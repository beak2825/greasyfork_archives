// ==UserScript==
// @name         Daily Vocab Planner
// @namespace    wyverex
// @version      1.2.2
// @description  Shows unlock information for vocab and the recommended number of vocab/day to clear the queue on level up
// @author       Andreas Krügersen-Clark
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496232/Daily%20Vocab%20Planner.user.js
// @updateURL https://update.greasyfork.org/scripts/496232/Daily%20Vocab%20Planner.meta.js
// ==/UserScript==

(function () {
  if (!window.wkof) {
    alert('"Daily Vocab Planner" script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
    window.location.href = "https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549";
    return;
  }

  const DayMillis = 24 * 3600 * 1000;
  const WeekMillis = 7 * DayMillis;

  const wkof = window.wkof;
  const shared = {
    settings: {},
    wffSettings: {},
    items: {},

    // SRS system id -> [seconds to pass]
    timings: {},
    // SubjectId -> projected pass time millis
    passTimes: {},
    // SubjectId -> projected unlock time millis
    unlockTimes: {},
    // SubjectIds of locked vocab items for the current level
    lockedVocabIds: [],
    // Number of vocab items on stage 0
    availableCount: 0,
    vocabUnlocks: {},
    levelUpTimeMillis: 0,
    numVocabLearnedToday: 0,
    recommendedVocabPerDay: 0,

    unlocksElement: null,
    lessonBarElement: null,
  };

  const todayFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
  });
  const shortFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
  });
  const longFormatter = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    hour: "numeric",
    minute: "numeric",
  });

  wkof.include("Apiv2,ItemData,Menu,Settings");
  wkof
    .ready("document,Apiv2,ItemData,Menu,Settings")
    .then(load_settings)
    .then(() => wkof.Apiv2.get_endpoint("spaced_repetition_systems").then(calculateSrsTimings))
    .then(startup)
    .catch(loadError);

  function loadError(e) {
    console.error('Failed to load data from WKOF for "Daily Vocab Planner"', e);
  }

  function installCSS() {
    // prettier-ignore
    const content = `
    .vocab-progress-bar {
      background-color: var(--color-level-progress-bar-background);
      color: var(--color-level-progress-bar-text);
      border-radius: 18px;
      height: 18px;
      box-shadow: inset 0px 2px 0 0 var(--color-level-progress-bar-shadow);
      display: flex;
      overflow: hidden;
      margin-top: 15px;
    }

    .vocab-progress-bar__progress {
      background-color: var(--color-vocabulary);
      color: var(--color-level-progress-bar-progress-text);
      border-radius: 18px;
      height: 18px;
      display: flex;
      justify-content: flex-end;
      min-width: 18px;
      transition: width 0.5s ease-in-out;
    }
    `;

    $("head").append("<style>" + content + "</style>");
  }

  function load_settings() {
    let defaults = {
      showUnlocks: true,
      showNumRecommendedVocab: true,
      useWFFData: true,

      includeLevelUpDay: true,
      radicalsPerDay: 5,
      kanjiPerDay: 5,
      lessonHour: 9,
    };
    return wkof.Settings.load("vocab_planner", defaults).then(() => {
      shared.settings = wkof.settings.vocab_planner;
      shared.wffSettings = wkof.settings["wk-word-frequency-filter"];
    });
  }

  function startup() {
    installCSS();
    installMenu();

    const config = {
      wk_items: {
        options: { subjects: true, assignments: true },
        filters: {
          level: "-1..+0",
          item_type: "rad, kan, voc, kana_voc",
        },
      },
    };
    wkof.ItemData.get_items(config).then(processData);
  }

  // ====================================================================================
  function installMenu() {
    wkof.Menu.insert_script_link({
      name: "vocab_planner",
      submenu: "Settings",
      title: "Daily Vocab Planner",
      on_click: openSettings,
    });
  }

  // prettier-ignore
  function openSettings() {
    let config = {
      script_id: 'vocab_planner',
      title: 'Daily Vocab Planner',
      on_save: settingsSaved,
      on_change: settingsSaved,
      content: {
        display: {
          type: "group", label: "Display", content: {
            showUnlocks: { type: "checkbox", label: "Vocabulary unlocks", default: true },
            showNumRecommendedVocab: { type: "checkbox", label: "Lesson recommendation", default: true, hover_tip: "Displays a progress bar in the lesson panel whenever there's vocabulary available, which displays how many vocabulary items you should learn today to clear your vocabulary queue by the time you level up" },
            useWFFData: { type: "checkbox", label: "Use Word Frequency Filter", default: true, hover_tip: "Requires \"Word Frequency Filter\" to be installed. The number of vocab to learn is based on the frequency cutoff set in WFF." },
          }
        },
        config: {
          type: "group", label: "Configuration", content: {
            includeLevelUpDay: { type: 'checkbox', label: 'Learn vocab on level-up day', default: true, hover_tip: "If set, the day you're going to level up is considered a full day to learn vocabulary." },
            radicalsPerDay: { type: "number", label: "Radicals/Day", default: 5, min: 0, hover_tip: "How many radicals do you intend to learn per day? Set to 0 if you learn all available radicals as a batch as soon as they are unlocked." },
            kanjiPerDay: { type: "number", label: "Kanji/Day", default: 5, min: 0, hover_tip: "How many kanji do you intend to learn per day? Set to 0 if you learn all available kanji as a batch as soon as they are unlocked." },
            lessonHour: { type: "number", label: "Daily lesson hour (24h format)", default: 9, min: 0, max: 23, hover_tip: "Roughly at which hour do you usually learn radicals/kanji each day? This is used to make the unlock predictions a bit more accurate." },
          }
        }
      }
    };
    let dialog = new wkof.Settings(config);
    dialog.open();
  }

  function settingsSaved() {
    if (shared.unlocksElement) {
      shared.unlocksElement.remove();
      shared.unlocksElement = null;
    }
    if (shared.lessonBarElement) {
      shared.lessonBarElement.remove();
      shared.lessonBarElement = null;
    }
    shared.unlockTimes = {};
    shared.passTimes = {};

    updateData();
  }

  // ====================================================================================
  function calculateSrsTimings(data) {
    let result = {};
    const entries = Object.entries(data);
    for (let i = 0; i < entries.length; ++i) {
      const id = entries[i][1].id;
      const system = entries[i][1].data;
      const passingStage = system.passing_stage_position;
      const stages = system.stages;
      let timings = [];
      for (let k = 0; k < passingStage; ++k) {
        timings.push(0);
      }
      timings[passingStage - 1] = getSrsIntervalInSeconds(stages[passingStage - 1]);
      for (let k = passingStage - 2; k >= 0; --k) {
        timings[k] = timings[k + 1] + getSrsIntervalInSeconds(stages[k]);
      }
      result[id] = timings;
    }
    shared.timings = result;
  }

  function getSrsIntervalInSeconds(stage) {
    if (stage.interval_unit === "milliseconds") {
      return stage.interval / 1000;
    }
    if (stage.interval_unit === "seconds") {
      return stage.interval;
    }
    if (stage.interval_unit === "minutes") {
      return stage.interval * 60;
    }
    if (stage.interval_unit === "hours") {
      return stage.interval * 3600;
    }
    if (stage.interval_unit === "days") {
      return stage.interval * 3600 * 24;
    }
    if (stage.interval_unit === "weeks") {
      return stage.interval * 3600 * 24 * 7;
    }
    return 0;
  }

  // ====================================================================================
  function processData(items) {
    shared.items = items;
    updateData();
  }

  function updateData() {
    const byType = wkof.ItemData.get_index(shared.items, "item_type");
    const allVocab = [...(byType.vocabulary || []), ...(byType.kana_vocabulary || [])];
    const filtered = filterVocabByWFF(allVocab);
    const subjectsById = wkof.ItemData.get_index(shared.items, "subject_id");
    const vocabByStage = wkof.ItemData.get_index(filtered, "srs_stage");
    const lockedVocab = vocabByStage[-1];
    shared.lockedVocabIds = lockedVocab.map((item) => item.id);
    shared.availableCount = vocabByStage[0] ? vocabByStage[0].length : 0;

    const nowMillis = Date.now();
    const now = new Date(nowMillis);

    const context = {
      numRadicalsLearnedToday: getNumItemsLearnedToday(byType.radical, now),
      numKanjiLearnedToday: getNumItemsLearnedToday(byType.kanji, now),
    };
    context.radicalLessonsPerDay = [context.numRadicalsLearnedToday];
    context.kanjiLessonsPerDay = [context.numKanjiLearnedToday];

    for (let i = 0; i < lockedVocab.length; ++i) {
      projectPassTimeForItem(lockedVocab[i], nowMillis, subjectsById, context);
    }
    shared.vocabUnlocks = groupByTime(shared.lockedVocabIds, shared.unlockTimes, nowMillis);

    const thisLevelKanjiIds = getThisLevelItems(byType.kanji).map((item) => item.id);
    // Kanji for which all the current level vocab has already been unlocked haven't been projected yet.
    // For Kanji with locked vocab this is simply a lookup to a cached value.
    for (let i = 0; i < thisLevelKanjiIds.length; ++i) {
      projectPassTimeForItem(subjectsById[thisLevelKanjiIds[i]], nowMillis, subjectsById, context);
    }
    shared.levelUpTimeMillis = projectLevelUpTime(thisLevelKanjiIds);

    shared.numVocabLearnedToday = getNumItemsLearnedToday(filtered, now);
    calculateRecommendedVocabPerDay(now);

    addUnlockOverview();
    addVocabLessonBar();
  }

  function filterVocabByWFF(allVocab) {
    if (shared.settings.useWFFData && shared.wffSettings && window.wff.FrequencyData) {
      const cutoff = shared.wffSettings.rankCutoff;
      const filtered = allVocab.filter((v) => {
        const slug = v.data.slug;
        const freqData = window.wff.FrequencyData[slug];
        const rank = window.wff.getRank(freqData);
        const isMarked = window.wff.isMarked(v.id);
        return rank <= cutoff || isMarked;
      });
      return filtered;
    }
    return allVocab;
  }

  function getThisLevelItems(items) {
    return items.filter((item) => item.data.level == wkof.user.level);
  }

  function projectLessonDate(passesPerDay, nowMillis, availableAt, perDay) {
    const now = new Date(nowMillis);
    const dayOffset = new Date(availableAt).getDate() - now.getDate();

    let tryOffset = dayOffset;
    while (true) {
      while (passesPerDay.length < tryOffset + 1) {
        passesPerDay.push(0);
      }
      if (passesPerDay[tryOffset] < perDay) {
        passesPerDay[tryOffset]++;
        if (tryOffset == 0) {
          // Available today, assume we're learning it now
          return nowMillis;
        }
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, shared.settings.lessonHour);
        return tomorrow.getTime() + (tryOffset - 1) * DayMillis;
      }
      ++tryOffset;
    }
  }

  function projectPassTimeForItem(item, nowMillis, subjectsById, context) {
    if (shared.passTimes[item.id] !== undefined) {
      return shared.passTimes[item.id];
    }

    if (item.assignments) {
      // Item is unlocked or learned
      let availableAt = nowMillis;
      if (item.assignments.available_at) {
        // Item was already learned
        availableAt = Date.parse(item.assignments.available_at);
      } else {
        if (item.object == "radical" && shared.settings.radicalsPerDay > 0) {
          availableAt = projectLessonDate(context.radicalLessonsPerDay, nowMillis, availableAt, shared.settings.radicalsPerDay);
        } else if (item.object == "kanji" && shared.settings.kanjiPerDay > 0) {
          availableAt = projectLessonDate(context.kanjiLessonsPerDay, nowMillis, availableAt, shared.settings.kanjiPerDay);
        }
      }

      const passTime = getPassTimeMillis(item.data.spaced_repetition_system_id, item.assignments.srs_stage, availableAt);
      shared.passTimes[item.id] = passTime;
      return passTime;
    }

    // Item is still locked behind at least one component
    if (shared.unlockTimes[item.id] === undefined) {
      // Get latest pass time of its components to determine the unlock time
      let unlockTimeMillis = 0;
      const components = item.data.component_subject_ids;
      for (let i = 0; i < components.length; ++i) {
        const id = components[i];
        if (shared.passTimes[id] === undefined) {
          const component = subjectsById[id];
          if (component === undefined) {
            // Component not in the level range, it must have passed on an earlier level
            continue;
          }
          projectPassTimeForItem(component, nowMillis, subjectsById, context);
        }
        if (shared.passTimes[id] > unlockTimeMillis) {
          unlockTimeMillis = shared.passTimes[id];
        }
      }

      shared.unlockTimes[item.id] = unlockTimeMillis;
    }

    let availableAt = shared.unlockTimes[item.id];
    if (item.object == "kanji" && shared.settings.kanjiPerDay > 0) {
      availableAt = projectLessonDate(context.kanjiLessonsPerDay, nowMillis, availableAt, shared.settings.kanjiPerDay);
    }

    const passTime = getPassTimeMillis(item.data.spaced_repetition_system_id, 0, availableAt);
    shared.passTimes[item.id] = passTime;
    return passTime;
  }

  function getPassTimeMillis(systemId, srsStage, lessonOrReviewTimeMillis) {
    const timings = shared.timings[systemId];
    const passingStage = timings.length;
    if (srsStage >= passingStage) {
      return 0;
    }
    if (srsStage == passingStage - 1) {
      return lessonOrReviewTimeMillis;
    }
    const secondsToPass = timings[srsStage + 1];
    return lessonOrReviewTimeMillis + secondsToPass * 1000;
  }

  // Given itemIds and a map of Id -> time, returns an array of {timeMilis, count} objects, sorted by timeMillis
  function groupByTime(itemIds, timeSource, groupCutoff) {
    const byTime = {};
    for (let i = 0; i < itemIds.length; ++i) {
      const timeMillis = timeSource[itemIds[i]];
      if (byTime[timeMillis] === undefined) {
        byTime[timeMillis] = 0;
      }
      byTime[timeMillis]++;
    }
    let byTimeArray = Object.entries(byTime);
    byTimeArray.sort((lhs, rhs) => lhs[0] - rhs[0]);
    // Group up entries that are below the cutoff
    if (groupCutoff) {
      while (byTimeArray.length > 1 && parseInt(byTimeArray[1][0]) <= groupCutoff) {
        byTimeArray[0][1] += byTimeArray[1][1];
        byTimeArray = [byTimeArray[0], ...byTimeArray.slice(2)];
      }
    }
    return byTimeArray.map((entry) => {
      return { timeMillis: entry[0], count: entry[1] };
    });
  }

  // ====================================================================================
  function projectLevelUpTime(kanjiIds) {
    const kanjiPasses = groupByTime(kanjiIds, shared.passTimes);
    const numKanjisToLevelUp = Math.ceil(kanjiIds.length * 0.9);
    let remaining = kanjiIds.length - numKanjisToLevelUp;
    for (let i = kanjiPasses.length - 1; i >= 0; --i) {
      remaining -= kanjiPasses[i].count;
      if (remaining <= 0) {
        return parseInt(kanjiPasses[i].timeMillis);
      }
    }
    // Should never happen
    return 0;
  }

  function getNumItemsLearnedToday(items, now) {
    let numLearnedToday = 0;
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      if (item.assignments && item.assignments.started_at) {
        const startedAt = new Date(Date.parse(item.assignments.started_at));
        if (startedAt.getDate() == now.getDate() && startedAt.getMonth() == now.getMonth()) {
          ++numLearnedToday;
        }
      }
    }
    return numLearnedToday;
  }

  function getNumVocabUntilLevelUp() {
    let numVocab = shared.availableCount;
    for (let i = 0; i < shared.vocabUnlocks.length; ++i) {
      if (shared.vocabUnlocks[i].timeMillis >= shared.levelUpTimeMillis) {
        break;
      }
      numVocab += shared.vocabUnlocks[i].count;
    }
    return numVocab;
  }

  function calculateRecommendedVocabPerDay(now) {
    const numUntilLevelUp = getNumVocabUntilLevelUp() + shared.numVocabLearnedToday;

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const levelUpDate = new Date(shared.levelUpTimeMillis);
    const levelUpDay = new Date(levelUpDate.getFullYear(), levelUpDate.getMonth(), levelUpDate.getDate());
    const numDays = (levelUpDay.getTime() - today.getTime()) / (24 * 3600 * 1000) + (shared.settings.includeLevelUpDay ? 1 : 0);
    shared.recommendedVocabPerDay = Math.ceil(numUntilLevelUp / numDays);
    return shared.recommendedVocabPerDay;
  }

  // ====================================================================================

  function createDiv(parent, className, style = undefined, innerHTML = undefined) {
    const div = document.createElement("div");
    div.className = className;
    if (style !== undefined) {
      div.style = style;
    }
    if (innerHTML !== undefined) {
      div.innerHTML = innerHTML;
    }
    $(parent).append(div);
    return div;
  }

  function addUnlockOverview() {
    if (!shared.settings.showUnlocks) {
      return;
    }

    const root = document.getElementsByClassName("wk-panel--review-forecast")[0];
    if (root === undefined) {
      console.log("Review forecast panel not found, can't add Vocab Panel");
      return;
    }
    const contentRoot = root.getElementsByClassName("review-forecast")[0];
    if (contentRoot === undefined) {
      console.log("Review content panel not found, can't add Vocab Panel");
      return;
    }

    const section = createDiv(contentRoot, "review-forecast__day", "margin-top: 10px");
    shared.unlocksElement = section;
    createDiv(section, "review-forecast__day-title", "padding-bottom: 5px", "Vocabulary unlocks");

    const content = createDiv(section, "review-forecast__day-content");

    const maxCount = Math.max(shared.availableCount, Math.max(...shared.vocabUnlocks.map((entry) => entry.count)));
    if (shared.availableCount > 0) {
      addUnlockRow(content, "Unlocked", shared.availableCount, shared.availableCount, maxCount, false);
    }
    let unlockCounter = shared.availableCount;
    let levelUpAdded = false;
    const levelUpDate = new Date(shared.levelUpTimeMillis);
    const now = new Date(Date.now());
    for (let i = 0; i < shared.vocabUnlocks.length; ++i) {
      const date = new Date(parseInt(shared.vocabUnlocks[i].timeMillis));
      if (!levelUpAdded && levelUpDate <= date) {
        const levelUpTimeStr = getTimeStr(levelUpDate, now);
        addLevelUpRow(content, levelUpTimeStr);
        levelUpAdded = true;
      }

      const timeStr = getTimeStr(date, now);
      const count = shared.vocabUnlocks[i].count;
      unlockCounter += count;
      addUnlockRow(content, timeStr, count, unlockCounter, maxCount);
    }
    if (!levelUpAdded) {
      const levelUpTimeStr = getTimeStr(levelUpDate, now);
      addLevelUpRow(content, levelUpTimeStr);
    }
  }

  function getTimeStr(date, now) {
    const diff = date - now;
    if (diff > WeekMillis) {
      return longFormatter.format(date);
    } else if (diff < DayMillis && date.getDate() == now.getDate()) {
      if (date.getTime() <= now.getTime()) {
        return "After reviews";
      }
      return "Today " + todayFormatter.format(date);
    }
    return shortFormatter.format(date);
  }

  function addLevelUpRow(root, timeStr) {
    const container = createDiv(
      root,
      "review-forecast__day-content",
      "border-bottom: 1px solid var(--color-review-forecast-divider); padding-bottom: var(--spacing-xxtight);"
    );
    const row = createDiv(container, "review-forecast__hour");
    createDiv(row, "review-forecast__hour-title", "flex: 0 0 120px", timeStr);
    createDiv(row, "review-forecast__increase-indicator", "font-weight: var(--font-weight-bold); text-align: center;", "Level Up!");
  }

  function addUnlockRow(root, timeStr, count, runningTotal, maxCount, showIncrease = true) {
    const row = createDiv(root, "review-forecast__hour");
    createDiv(row, "review-forecast__hour-title", "flex: 0 0 120px", timeStr);
    const barRoot = createDiv(row, "review-forecast__increase-indicator");
    createDiv(barRoot, "review-forecast__increase-bar", `width: ${(count / maxCount) * 100}%; background-color: var(--color-vocabulary);`);
    if (showIncrease) {
      createDiv(row, "review-forecast__hour-increase review-forecast__increase", undefined, count);
    } else {
      createDiv(row, "review-forecast__hour-increase", "flex: 0 0 56px");
    }
    createDiv(row, "review-forecast__hour-total review-forecast__total", undefined, runningTotal);
  }

  function addVocabLessonBar() {
    if (!shared.settings.showNumRecommendedVocab) {
      return;
    }

    if (shared.recommendedVocabPerDay == 0 || (shared.availableCount == 0 && shared.numVocabLearnedToday == 0)) {
      return;
    }

    const root = document.getElementsByClassName("todays-lessons")[0];
    if (root === undefined) {
      console.log("Lesson panel not found, can't add vocab bar");
      return;
    }

    const percentage = Math.min(1.0, shared.numVocabLearnedToday / shared.recommendedVocabPerDay);

    const outer = createDiv(root, "vocab-progress-bar");
    shared.lessonBarElement = outer;
    const bar = createDiv(outer, "vocab-progress-bar__progress", `width: ${percentage * 100}%`);
    if (percentage > 0.5) {
      createDiv(
        bar,
        "level-progress-bar__label level-progress-bar__label--inside",
        "line-height: 18px; font-size: 14px",
        `${shared.numVocabLearnedToday}/${shared.recommendedVocabPerDay} vocab`
      );
    } else {
      createDiv(
        outer,
        "level-progress-bar__label level-progress-bar__label",
        "line-height: 18px; font-size: 14px",
        `${shared.numVocabLearnedToday}/${shared.recommendedVocabPerDay} vocab`
      );
    }
    createDiv(bar, "level-progress-bar__icon", "flex: 0 0 18px");
  }
})();
