// ==UserScript==
// @name  MyMHRoutine
// @namespace  https://greasyfork.org/en/users/39779
// @version  1.1.8
// @description  mh routine
// @author  Elie
// @match  https://www.mousehuntgame.com/*
// @license  GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant  unsafeWindow
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/19116/MyMHRoutine.user.js
// @updateURL https://update.greasyfork.org/scripts/19116/MyMHRoutine.meta.js
// ==/UserScript==

/**
 * if debug mode
 */
const debug = localStorage.getItem('isDebug');
/**
 * when(time in 24 hours) and how long(hours) for taking rest.
 * Must be from large to small hour.
 */
let restTimes = [
  [19, 1],
  [12, 1],
  [2, 7]
];
/**
 * url to count down rest time and then return to game
 */
const url = 'https://elie2201.github.io/mh/mhReloader.html';
/**
 * mousehunt game url
 */
const gameUrl = 'https://www.mousehuntgame.com/';
/**
 * url to hunter's hammer.
 */
const hammerUrl =
  'https://www.mousehuntgame.com/inventory.php?tab=crafting&sub_tab=hammer';
/**
 * interval for checking if take rest(second)
 */
const checkingInterval = Math.ceil(180 + Math.random() * (7 - 3) * 60);
/**
 * Minutes to be randomized and then added to rest time.
 * Randomized to be between +-0.5 * (this const).
 * To make taking rest time random.
 */
const nowTimeShiftRange = 30;
/**
 * Indicate current routine to prevent from
 * workIn setting immediately travelling to
 * workIn location.
 * workIn script should not travel to work
 * location if current routine is toRest.
 */
const currentRoutineKey = 'currentRoutine';
/**
 * Environment type:id dictionary.
 */
const environmentTypeIdDictionary = {
  acolyte_realm: 1,
  meadow: 18,
  town_of_gnawnia: 28,
  ronzas_traveling_shoppe: 24,
  windmill: 30,
  harbour: 13,
  mountain: 20,
  kings_arms: 38,
  tournament_hall: 37,
  kings_gauntlet: 15,
  calm_clearing: 4,
  great_gnarled_tree: 12,
  lagoon: 17,
  laboratory: 16,
  mousoleum: 21,
  town_of_digby: 27,
  bazaar: 3,
  pollution_outbreak: 45,
  training_grounds: 29,
  dojo: 8,
  meditation_room: 19,
  pinnacle_chamber: 23,
  catacombs: 6,
  forbidden_grove: 11,
  cape_clawed: 5,
  elub_shore: 10,
  nerg_plains: 22,
  derr_dunes: 7,
  jungle_of_dread: 14,
  dracano: 9,
  balacks_cove: 2,
  claw_shot_city: 43,
  train_station: 44,
  fort_rox: 54,
  desert_warpath: 33,
  desert_city: 34,
  desert_oasis: 35,
  lost_city: 41,
  sand_dunes: 42,
  ss_huntington_ii: 26,
  seasonal_garden: 31,
  zugzwang_tower: 32,
  zugzwang_library: 36,
  slushy_shoreline: 39,
  iceberg: 40,
  sunken_city: 47,
  queso_river: 59,
  queso_plains: 57,
  queso_quarry: 58,
  queso_geyser: 61,
  fungal_cavern: 50,
  labyrinth: 52,
  ancient_city: 51,
  moussu_picchu: 56,
  floating_islands: 63,
  rift_gnawnia: 46,
  rift_burroughs: 48,
  rift_whisker_woods: 49,
  rift_furoma: 53,
  rift_bristle_woods: 55
};

checkTakingRest();

/**
 * check whether take rest now
 */
function checkTakingRest() {
  logging(
    'run checkTakingRest(), default sleep at ',
    restTimes[2][0],
    ', check every ',
    checkingInterval,
    ' seconds'
  );
  const theInterval = setInterval(function () {
    const isNotLoaded = !document.getElementById('mousehuntContainer');
    // Game not loaded. Tiny mouse page/maintenance page.
    logging('Game is not loaded? ', isNotLoaded);
    if (isNotLoaded) {
      window.localStorage.setItem('failToLoad', new Date().toISOString());
      window.location.href = gameUrl;
      return;
    }
    // 如果是 time-out page, reload then return
    const timeoutBody = document.querySelector('PageLockError');
    if (timeoutBody) {
      window.localStorage.setItem('pageLockError', new Date().toISOString());
      window.location.href = gameUrl;
      return;
    }
    // Smash unliked assignment by keywords: Zugzwang, Onyx Mallet, Maki Cheese
    checkResearchQuestItem();
    // 領取 Library Assignment
    if (isGetAssignment()) return;

    // 放在 setInterval中讀取 localStorage,
    // 有修改就不用 reload page了.
    const storedRoutine = window.localStorage.getItem('restTimes');
    logging('localStorage rest times: ' + storedRoutine);
    if (storedRoutine) restTimes = JSON.parse(storedRoutine);
    // randomized interval to be added to rest time
    const nowTimeShift = Math.floor(
      (((Math.random() * 100000) % 1) - 0.5) * nowTimeShiftRange * 60 * 1000
    );
    // now time(no date, time only) in millisecond
    const nowTime =
      (Date.parse(new Date()) + 8 * 60 * 60 * 1000) % (24 * 60 * 60 * 1000);
    // in loop, if a interval is matched, break the loop
    let timeSectionMatched = false;
    for (let i = 0; i < restTimes.length; i++) {
      // 休息多久為 0時不處理
      if (restTimes[i][1] < 1) continue;
      if (
        nowTime >
        restTimes[i][0] * 60 * 60 * 1000 +
          nowTimeShift +
          restTimes[i][1] * 60 * 60 * 1000
      ) {
        // 已經休息完畢了,標示為比對到,結束迴圈
        timeSectionMatched = true;
        logging('above time section ' + i + ', do nothing');
      } else if (nowTime > restTimes[i][0] * 60 * 60 * 1000 + nowTimeShift) {
        // 已經開始休息且休息結束時間還沒到
        timeSectionMatched = true;
        // debug mode時只想看 log,log完就 return掉
        logging('during rest time section ' + i);
        logging(
          restTimes[i][0] * 60 * 60 * 1000 +
            nowTimeShift +
            restTimes[i][1] * 60 * 60 * 1000 -
            nowTime
        );
        if (debug) {
          return;
        }

        /* nowTimeShift是用來 random啟動休息判斷而已,
          實際上真正休息時間與 nowTimeShift沒有什麼關係.
          例如 2:10 random到 -15分鐘判斷休息,但還是 2:10
          才開始休息而非 1:55,所以不能加入休息多久中. */
        const duration =
          restTimes[i][0] * 60 * 60 * 1000 +
          // nowTimeShift +
          restTimes[i][1] * 60 * 60 * 1000 -
          nowTime;
        const today = new Date();
        today.setHours(restTimes[i][0], 0, 0, 0);
        const until = today.getTime() + restTimes[i][1] * 60 * 60 * 1000;
        /* github那邊也是用 nowTimeShiftRange折半,
        現在加了 sleep-in travelling,
        不到一半的 duration就不要來來回回了 */
        if (duration > ((nowTimeShiftRange + 1) * 60 * 1000) / 2) {
          // Travel to sleep-in-location if is setted.
          const sleepIn = localStorage.getItem('sleepIn'); // 'desert_city';
          if (sleepIn && sleepIn != '') {
            // eslint-disable-next-line no-undef
            const environmentType = user.environment_type || '';
            if (environmentType != sleepIn) {
              window.localStorage.setItem(currentRoutineKey, 'toRest');
              // travel to rest前如果 workIn不是當前 location就改成當前 location(Laby <=> Zokor).
              const workIn = localStorage.getItem('workIn');
              if (workIn && workIn != '' && environmentType != workIn) {
                window.localStorage.setItem('workIn', environmentType);
              }
              travel(sleepIn);
              return;
            }
          }

          // Take rest之前點一下 Friend List,
          // 看看能否解決馬上沒被好友帶 horn的問題
          // eslint-disable-next-line no-undef
          $.ajax(
            'https://www.mousehuntgame.com/item.php?item_type=wisdom_stat_item'
          );
          // $('.friend_list > a')[0].click();

          // 休息前 bait換成 Gouda
          // checkThenArm(null, 'bait', 'Gouda');

          // const leaveTimeout =
          setTimeout(function () {
            // 確定開始休息把狀態改成 Resting,讓結束休息後 workIn發揮作用.
            window.localStorage.setItem(currentRoutineKey, 'Resting');
            // clearTimeout(leaveTimeout);
            clearInterval(theInterval);
            window.open(
              url + '?until=' + until + '&duration=' + duration,
              '_self'
            );
          }, 20000);
        }
      }
      // 如果比對到就結束迴圈,不再繼續比對
      if (timeSectionMatched) {
        break;
      }
    }
  }, checkingInterval * 1000);
}

/**
 * Check library assignment.
 * Smash research quest item if assignment contains following keywords:
 * Zugzwang, Onyx Mallet, Maki Cheese.
 */
function checkResearchQuestItem() {
  const eventLocation = window.localStorage.getItem('eventLocation');
  // eslint-disable-next-line no-undef
  const quests = user.quests;
  const isAssigned =
    quests.QuestFuromaResearch ||
    quests.QuestPagodaResearch ||
    quests.QuestAdvancedPagodaResearch;
  console.log(
    'eventLocation is: ',
    eventLocation,
    '; is assigned: ',
    isAssigned
  );
  if (eventLocation != 'library_assignment' || !isAssigned) return;
  stepByStep([
    [
      () => {
        if (
          isAssigned &&
          !document.querySelector('.campPage-quests-container')
        ) {
          // eslint-disable-next-line no-undef
          $('a[data-tab=quests').click();
        }
      },
      () => {
        return false;
      },
      () => {
        return document.querySelector('.campPage-quests-container');
      }
    ],
    [
      () => {},
      () => {
        const questsContainer = document.querySelector(
          '.campPage-quests-container'
        );
        const questContent = questsContainer.innerText;
        console.log(questContent);
        if (
          questContent.indexOf('Zugzwang') > -1 ||
          questContent.indexOf('Onyx Mallet') > -1 ||
          questContent.indexOf('Maki Cheese') > -1
        ) {
          console.log(
            'Assignment need Zugzwang move or Onyx Mallet, keep execution.'
          );
          return false;
        } else {
          console.log(
            'Assignment ok, clear interval and stop execution and set TrapCheck true.'
          );
          // 任務檢查這邊執行頻率高,值得避免無謂的寫入
          const trapCheck = window.localStorage.getItem('TrapCheck');
          if (trapCheck !== 'true')
            window.localStorage.setItem('TrapCheck', 'true');
          return true;
        }
      },
      () => {
        const questsContainer = document.querySelector(
          '.campPage-quests-container'
        );
        const questContent = questsContainer.innerText;
        console.log(questContent);
        if (
          questContent.indexOf('Zugzwang') > -1 ||
          questContent.indexOf('Onyx Mallet') > -1 ||
          questContent.indexOf('Maki Cheese') > -1
        ) {
          console.log(
            'Assignment need Zugzwang weapon or Onyx Mallet or Maki Cheese, go next step to smash it.'
          );
          return true;
        } else {
          console.log('Assignment ok, do not go next step.');
          return false;
        }
      }
    ],
    [
      () => {
        console.log('Go to hunters hammer page.');
        // eslint-disable-next-line no-undef
        const a = $('a[data-sub-tab=recipe]');
        a.attr('href', hammerUrl);
        a.attr('data-sub-tab', 'hammer');
        a.click();
      },
      () => {
        return false;
      },
      () => {
        console.log('Wait research quest item ready.');
        // eslint-disable-next-line no-undef
        const furomaItem = $('div[data-item-id=652]');
        // eslint-disable-next-line no-undef
        const senseiItem = $('div[data-item-id=658]');
        // eslint-disable-next-line no-undef
        const pagodaItem = $('div[data-item-id=659]');
        return (
          furomaItem.length > 0 ||
          senseiItem.length > 0 ||
          pagodaItem.length > 0
        );
      }
    ],
    [
      () => {
        console.log('Click exist research quest item.');
        let questItem;
        // eslint-disable-next-line no-undef
        const furomaItem = $('div[data-item-id=652]');
        // eslint-disable-next-line no-undef
        const senseiItem = $('div[data-item-id=658]');
        // eslint-disable-next-line no-undef
        const pagodaItem = $('div[data-item-id=659]');
        if (furomaItem.length > 0) questItem = furomaItem;
        else if (senseiItem.length > 0) questItem = senseiItem;
        else if (pagodaItem.length > 0) questItem = pagodaItem;
        questItem.click();
      },
      () => {
        return false;
      },
      () => {
        console.log('Wait submit popup.');
        // eslint-disable-next-line no-undef
        const confirmButton = $('a[data-confirm-type=hammer]');
        return confirmButton.length > 0;
      }
    ],
    [
      () => {
        // eslint-disable-next-line no-undef
        const confirmButton = $('a[data-confirm-type=hammer]');
        localStorage.setItem('lastSmashAt', new Date().toISOString());
        confirmButton.click();
        setTimeout(() => {
          window.location.href = gameUrl;
        }, 3000);
      },
      () => {
        return true;
      },
      () => {
        return false;
      }
    ]
  ]);
}

/**
 * Execute stage-by-stage.
 * Use termination checking to determine whether keep executing stages.
 * Use waiting check to determine whether ready for next stage.
 * Argument format is:
 * [stages...].
 * states format is:
 * [initial action,
 *  termination checking function,
 *  ready for next stage check function].
 *
 * @param {Array<Array<Function>>} stages
 */
function stepByStep(stages) {
  for (let i = 0; i < stages.length; i++) {
    const steps = stages[i];
    for (let j = 0; j < steps.length; j++) {
      const step = steps[j];
      if (!step || !(step instanceof Function)) {
        console.log(
          'Elements cannot be undefined or null and must be function!!'
        );
        return;
      }
    }
  }
  let index = 0;
  let isExecuted = false;
  const theInterval = setInterval(() => {
    console.log('running stepByStep interval');
    if (!isExecuted) {
      console.log('Running steps of index: ', index);
      stages[index][0]();
      isExecuted = true;
    }
    const isTerminating = stages[index][1]();
    console.log('Is terminating? ', isTerminating);
    if (isTerminating) {
      console.log('Clear interval and stop execution!!');
      clearInterval(theInterval);
      return;
    }
    const isReadyNextStep = stages[index][2]();
    console.log('Is ready for next step? ', isReadyNextStep);
    if (isReadyNextStep) {
      console.log('Prepare for next step');
      index++;
      isExecuted = false;
    }
    if (index >= stages.length) {
      console.log('Reach end of stages.');
      clearInterval(theInterval);
    }
    // if (index >= stages.length) window.location.href=gameUrl;
  }, 3000);
}

/**
 * 檢查是否執行 get library assignment.
 * @return {Boolean} has gotten library assignment.
 */
function isGetAssignment() {
  const eventLocation = window.localStorage.getItem('eventLocation');
  // eslint-disable-next-line no-undef
  const quests = user.quests;
  const isAssigned =
    quests.QuestFuromaResearch ||
    quests.QuestPagodaResearch ||
    quests.QuestAdvancedPagodaResearch;
  logging('eventLocation is: ', eventLocation, '; is assigned: ', isAssigned);
  if (eventLocation != 'library_assignment' || isAssigned) return false;
  const lastSmashAtText = window.localStorage.getItem('lastSmashAt');
  logging('last smash assignment at ', lastSmashAtText);
  if (!lastSmashAtText || lastSmashAtText == '') return false;
  const lastSmashAt = new Date(lastSmashAtText);
  if (isNaN(lastSmashAt)) return false;
  if (new Date() - lastSmashAt < 3600000) return false;
  // Fumora Research
  // 原地領任務(mh-improved也是這樣搞),不用 travel了.
  // travel('zugzwang_library', -1);
  setTimeout(() => {
    // eslint-disable-next-line no-undef
    hg.views.HeadsUpDisplayZugswangLibraryView.showPopup();
  }, 2000);
  setTimeout(() => {
    // eslint-disable-next-line no-undef
    hg.views.HeadsUpDisplayZugswangLibraryView.startAssignment(
      // eslint-disable-next-line no-undef
      $(
        '<a href="#" class="mousehuntActionButton" data-quest="furoma_research_assignment_convertible"></a>'
      )[0]
    );
    // 領任務後取消 trap check方便分辨.領到 ok的任務後重新啟動.
    // 領任務的執行頻率低,先讀取判斷不是 false就省了.
    window.localStorage.setItem('TrapCheck', 'false');
  }, 8000);
  /* 原地領任務(mh-improved也是這樣搞),不用 travel了.
  但是也沒了 travel的 reload,要手動 reload.
  setTimeout(() => {
    let workIn = window.localStorage.getItem('workIn');
    if (!workIn || workIn === '') workIn = 'dojo';
    travel(workIn);
  }, 10000);
   */
  /* 
  setTimeout(() => {
    let workIn = window.localStorage.getItem('workIn');
    if (!workIn || workIn === '') workIn = 'dojo';
    // TODO 找時間還是要修改測試直接用 travel的 reload就好
    travel(workIn, -1);
  }, 10000);
   */
  setTimeout(() => {
    location.href = gameUrl;
  }, 12000);
  return true;
}

/**
 * Travel to specified location.
 * Directly invoke function of game.
 * @param {String} environmentType
 * @param {BigInteger} milliseconds
 *  wait milliseconds to reload after travel.
 *  if no milliseconds, 5000 is default value.
 *  Will not reload if milliseconds less then 0.
 */
function travel(environmentType, milliseconds) {
  // eslint-disable-next-line no-undef
  if (user.environment_type == environmentType) return;
  const timeout = milliseconds ? milliseconds : 2000;
  // eslint-disable-next-line no-undef
  user.environment_type = environmentType;
  // eslint-disable-next-line no-undef
  user.environment_id = environmentTypeIdDictionary[environmentType];
  // eslint-disable-next-line no-undef
  app.pages.TravelPage.travel(environmentType);
  if (timeout >= 0) {
    window.setTimeout(function () {
      window.location.href = gameUrl;
    }, timeout);
  }
}

/**
 * logging function.
 * Invoke console.log with customization.
 * @param  {...any} logs
 */
function logging(...any) {
  if (debug) {
    console.groupCollapsed(new Date(), ...any);
    console.log(Error().stack);
    // console.trace();
    console.groupEnd();
    /* console.groupCollapsed(...arguments);
        // console.trace.apply(console, arguments);
        console.trace();
        console.groupEnd(); */
  }
}
