// ==UserScript==
// @name         Nitro Type - Race Info Footer
// @namespace    https://github.com/rickstaa/nitro-type-racing-stats-footer
// @version      1.1.2
// @description  Adds an information footer to the race page displaying user stats, season information, and daily challenges.
// @author       Toonidy, Ray Adams/Nate Dogg, Follycakes, Rick Staa
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @icon         data:image/png;base64,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
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js#sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ==
// @require      https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.1/dexie.min.js#sha512-ybuxSW2YL5rQG/JjACOUKLiosgV80VUfJWs4dOpmSWZEGwdfdsy2ldvDSQ806dDXGmg9j/csNycIbqsrcqW6tQ==
// @require      https://greasyfork.org/scripts/443718-nitro-type-userscript-utils/code/Nitro%20Type%20Userscript%20Utils.js?version=1042360
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473595/Nitro%20Type%20-%20Race%20Info%20Footer.user.js
// @updateURL https://update.greasyfork.org/scripts/473595/Nitro%20Type%20-%20Race%20Info%20Footer.meta.js
// ==/UserScript==

/* global Dexie moment NTGLOBALS createLogger findReact */

const logging = createLogger("Nitro Type Race Info Footer");

// == Config storage ==
const db = new Dexie("NTRacingStats");
db.version(1).stores({
  backupStatData: "userID",
});
db.open().catch((e) => {
  logging.error("Init")(
    "Failed to open up the race info footer cache database",
    e
  );
});

////////////
//  Init  //
////////////

// Retrieve race track.
const RACE_CONTAINER = document.getElementById("raceContainer");
const RACE_OBJ = RACE_CONTAINER ? findReact(RACE_CONTAINER) : null;
const SERVER = RACE_OBJ?.server;
const CURRENT_USER = RACE_OBJ?.props.user;
if (!RACE_CONTAINER || !RACE_OBJ) {
  logging.error("Init")("Could not find the race track");
  return;
}

if (!CURRENT_USER?.loggedIn) {
  logging.error("Init")("Not available for Guest Racing");
  return;
}

//////////////////
//  Helpers     //
//////////////////

/**
 * Merge daily challenge data with user progress.
 * @param {Array} progress - Array of user progress objects.
 * @returns {Array} - Array of challenge objects with merged user progress.
 */
const mergeDailyChallengeData = (progress) => {
  const { CHALLENGES, CHALLENGE_TYPES } = NTGLOBALS;
  const now = Math.floor(Date.now() / 1000);
  return CHALLENGES.filter((c) => c.expiration > now)
    .slice(0, 3)
    .map((c, _) => {
      const userProgress = progress.find(
        (p) => p.challengeID === c.challengeID
      );
      const [title, field] = CHALLENGE_TYPES[c.type];
      return {
        ...c,
        title: title
          .replace(/\$\{goal\}/, c.goal)
          .replace(/\$\{field\}/, `${field}${c.goal !== 1 ? "s" : ""}`),
        field,
        goal: c.goal,
        progress: userProgress?.progress || 0,
      };
    });
};

/**
 * Retrieve  Race Info Footer from various sources.
 * @returns {Promise} - Promise that resolves to an object containing the user stats.
 */
const getStats = async () => {
  let backupUserStats = null;
  try {
    backupUserStats = await db.backupStatData.get(CURRENT_USER.userID);
  } catch (ex) {
    logging.warn("Update")("Unable to get backup stats", ex);
  }
  try {
    const persistStorageStats = JSON.parse(
      JSON.parse(localStorage.getItem("persist:nt")).user
    );
    const user =
      !backupUserStats ||
      typeof backupUserStats.lastConsecRace !== "number" ||
      persistStorageStats.lastConsecRace >= backupUserStats.lastConsecRace
        ? persistStorageStats
        : backupUserStats;
    const dailyChallenges = mergeDailyChallengeData(user.challenges);
    return { user, dailyChallenges };
  } catch (ex) {
    logging.error("Update")("Unable to get stats", ex);
    return Promise.reject(new Error("Unable to get stats"));
  }
};

/**
 * Retrieve team stats.
 * @returns {Promise} - Promise that resolves to an object containing the team stats.
 */
const getTeamStats = async () => {
  const tag = CURRENT_USER?.tag ?? null;
  if (!tag) {
    console.log("User is not in a team.");
    return null;
  }

  // Retrieve team stats.
  try {
    const authToken = localStorage.getItem("player_token");
    const response = await fetch(`/api/v2/teams/${tag}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const { results } = await response.json();
    const { leaderboard, motd, info, stats, members, season } = results;
    const member = members?.find((u) => u.userID === CURRENT_USER.userID);
    const seasonStats = season?.find((u) => u.userID === CURRENT_USER.userID);
    return { leaderboard, motd, info, stats, member, season: seasonStats };
  } catch (error) {
    console.error("Error getting team stats:", error);
    return null;
  }
};

/**
 * Retrieve Summary Stats.
 * @returns {Promise} - Promise that resolves to an object containing the summary stats.
 */
const getSummaryStats = async () => {
  const authToken = localStorage.getItem("player_token");
  try {
    const response = await fetch("/api/v2/stats/summary", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const { results } = await response.json();
    const seasonBoard = results.racingStats?.find((b) => b.board === "season");
    const dailyBoard = results.racingStats?.find((b) => b.board === "daily");
    return { seasonBoard, dailyBoard };
  } catch (error) {
    console.error("Error getting summary stats:", error);
    return null;
  }
};

//////////////////
//  Components  //
//////////////////

// Inject components styles.
const style = document.createElement("style");
style.innerHTML = `
#raceContainer {
    margin-bottom: 0;
}
.nt-stats-root {
    background-color: #222;
}
.nt-stats-body {
    display: flex;
    justify-content: space-between;
    padding: 8px;
}
.nt-stats-left-section, .nt-stats-right-section  {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
}
.nt-stats-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 8px;
    color: rgba(255, 255, 255, 0.8);
    background-color: #03111a;
    font-size: 12px;
}
.nt-stats-toolbar-status {
    display: flex;
}
.nt-stats-toolbar-status .nt-stats-toolbar-status-item {
    padding: 0 8px;
    background-color: #0a2c42;
}
.nt-stats-toolbar-status .nt-stats-toolbar-status-item-alt {
    padding: 0 8px;
    background-color: #22465c;
}
.nt-stats-daily-challenges {
    width: 350px;
}
.nt-stats-daily-challenges .daily-challenge-progress--badge {
    z-index: 0;
}
.nt-stats-season-progress {
    padding: 8px;
    margin: 0 auto;
    border-radius: 8px;
    background-color: #1b83d0;
    box-shadow: 0 28px 28px 0 rgb(2 2 2 / 5%), 0 17px 17px 0 rgb(2 2 2 / 20%), 0 8px 8px 0 rgb(2 2 2 / 15%);
}
.nt-stats-season-progress .season-progress-widget {
    width: 350px;
}
.nt-stats-season-progress .season-progress-widget--level-progress-bar {
    transition: width 0.3s ease;
}
.nt-stats-info {
    text-align: center;
    color: #eee;
    font-size: 14px;
}
.nt-stats-metric-row {
    margin-bottom: 4px;
}
.nt-stats-metric-value, .nt-stats-metric-suffix {
    font-weight: 600;
}
.nt-stats-metric-suffix {
    color: #aaa;
}
.nt-stats-right-section {
    flex-grow: 1;
    margin-left: 15px;
}`;
document.head.appendChild(style);

/**
 * Creates a small toolbar widget component that displays information about the user's userscript, NT Cash, and Mystery Box status.
 * @param {Object} user - The current user object.
 * @returns {Object} An object containing the root element of the toolbar and an `updateStats` method that can be used to update the toolbar stats.
 */
const ToolbarWidget = ((user) => {
  const root = document.createElement("div");
  root.classList.add("nt-stats-toolbar");
  root.innerHTML = `
        <div>
            NOTE: Team Stats and Season Stats are cached.
        </div>
        <div class="nt-stats-toolbar-status">
            <div class="nt-stats-toolbar-status-item">
                <span class="nt-cash-status as-nitro-cash--prefix">N/A</span>
            </div>
            <div class="nt-stats-toolbar-status-item-alt">
                📦 Mystery Box: <span class="mystery-box-status">N/A</span>
            </div>
        </div>`;

  // == Mystery Box ==
  const { rewardCountdown } = user;
  const mysteryBoxStatus = root.querySelector(".mystery-box-status");

  let isDisabled = Date.now() < rewardCountdown * 1e3;
  let timer = null;

  // Sync countdown.
  const syncCountdown = () => {
    isDisabled = Date.now() < rewardCountdown * 1e3;
    if (!isDisabled) {
      if (timer) {
        clearInterval(timer);
      }
      mysteryBoxStatus.textContent = "Claim Now!";
      return;
    }
    mysteryBoxStatus.textContent = moment(rewardCountdown * 1e3).fromNow(false);
  };
  if (isDisabled) {
    syncCountdown();
    timer = setInterval(syncCountdown, 6e3);
  }

  // == NT Cash ==
  const amountNode = root.querySelector(".nt-cash-status");

  // Return an object with the widget root element and a method to update the widget's stats.
  return {
    root,
    updateStats: ({ money }) => {
      if (typeof money === "number") {
        amountNode.textContent = `$${money.toLocaleString()}`;
      }
    },
  };
})(RACE_OBJ.props.user);

/**
 * Creates a widget that displays the daily challenges.
 * @returns {Object} An object containing the root element of the widget and an `updateStats` method that can be used to update the widget stats.
 */
const DailyChallengeWidget = (() => {
  // Create the root element of the widget.
  const root = document.createElement("div");
  root.classList.add(
    "nt-stats-daily-challenges",
    "profile-dailyChallenges",
    "card",
    "card--open",
    "card--d",
    "card--grit",
    "card--shadow-l"
  );
  root.innerHTML = `
        <div class="daily-challenge-list--heading">
            <h4>Daily Challenges</h4>
            <div class="daily-challenge-list--arriving">
                <div class="daily-challenge-list--arriving-label">
                    <svg class="icon icon-recent-time"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/dist/site/images/icons/icons.css.1494.svg#icon-recent-time"></use></svg>
                    New <span></span>
                </div>
            </div>
        </div>
        <div class="daily-challenge-list--challenges"></div>`;

  // Get references to the daily challenges container and expiry label.
  const challengesContainer = root.querySelector(
    ".daily-challenge-list--challenges"
  );
  const expiryLabel = root.querySelector(
    ".daily-challenge-list--arriving-label span"
  );

  // Create a template for the daily challenge item.
  const challengeItemTemplate = document.createElement("div");
  challengeItemTemplate.classList.add("raceResults--dailyChallenge");
  challengeItemTemplate.innerHTML = `
        <div class="daily-challenge-progress">
            <div class="daily-challenge-progress--info">
                <div class="daily-challenge-progress--requirements">
                    <div class="daily-challenge-progress--name">
                        <div style="height: 19px;">
                            <div align="left" style="white-space: nowrap; pavgSpeedosition: absolute; transform: translate(0%, 0px) scale(1, 1); left: 0px;">
                            </div>
                        </div>
                    </div>
                    <div class="daily-challenge-progress--status"></div>
                </div>
                <div class="daily-challenge-progress--progress">
                    <div class="daily-challenge-progress--progress-bar-container">
                        <div class="daily-challenge-progress--progress-bar" style="width: 40%"></div>
                        <div class="daily-challenge-progress--progress-bar--earned" style="width: 40%"></div>
                    </div>
                </div>
            </div>
            <div class="daily-challenge-progress--badge">
                <div class="daily-challenge-progress--success"></div>
                <div class="daily-challenge-progress--xp">
                    <span class="daily-challenge-progress--value"></span><span class="daily-challenge-progress--divider">/</span><span class="daily-challenge-progress--target"></span>
                </div>
                <div class="daily-challenge-progress--label"></div>
            </div>
        </div>`;

  /**
   * Get the daily challenges.
   * @returns {Promise} - Promise that resolves to an array of challenge objects.
   */
  const getDailyChallenges = async () => {
    const { dailyChallenges } = await getStats();
    return dailyChallenges;
  };

  /**
   * Creates a challenge node for each challenge.
   * @returns {Promise} - Promise that resolves to an array of challenge nodes.
   */
  const createChallengeNodes = async () => {
    const dailyChallenges = await getDailyChallenges();
    const challengeFragment = document.createDocumentFragment();

    // Create a challenge node for each challenge.
    const challengeNodes = Array.from(dailyChallenges, (challenge) => {
      const node = challengeItemTemplate.cloneNode(true);
      updateChallengeNode(node, challenge);
      challengeFragment.append(node);

      return node;
    });

    challengesContainer.append(challengeFragment);

    return challengeNodes;
  };
  let challengeNodesPromise = createChallengeNodes();

  /*
   * Updates a challenge node with new data.
   * @param {HTMLElement} node The challenge node to update.
   * @param {Object} challenge The challenge data to update the node with.
   */
  const updateChallengeNode = (node, challenge) => {
    const { title, field, progress, goal, reward } = challenge;

    // Update each element in the challenge node.
    let progressPercentage = goal > 0 ? (progress / goal) * 100 : 0;
    if (progress === goal) {
      progressPercentage = 100;
      node
        .querySelector(".daily-challenge-progress")
        .classList.add("is-complete");
    } else {
      node
        .querySelector(".daily-challenge-progress")
        .classList.remove("is-complete");
    }
    node.querySelector(".daily-challenge-progress--name div div").textContent =
      title;
    node.querySelector(
      ".daily-challenge-progress--label"
    ).textContent = `${field}s`;
    node.querySelector(".daily-challenge-progress--value").textContent =
      progress;
    node.querySelector(".daily-challenge-progress--target").textContent = goal;
    node.querySelector(
      ".daily-challenge-progress--status"
    ).textContent = `Earn ${Math.floor(reward / 100) / 10}k XP`;
    node
      .querySelectorAll(
        ".daily-challenge-progress--progress-bar, .daily-challenge-progress--progress-bar--earned"
      )
      .forEach((bar) => {
        bar.style.width = `${progressPercentage}%`;
      });
  };

  /**
   * Upates the challenge widget with new data.
   * @param {Array} data - An array of challenge objects.
   */
  const updateStats = async (data) => {
    if (!data || data.length === 0) {
      return;
    }
    if (data[0] && data[0].expiration) {
      const expiryTime = 1000 * data[0].expiration;
      if (!isNaN(expiryTime)) {
        expiryLabel.textContent = moment(expiryTime).fromNow();
      }
    }
    const challengeNodes = await challengeNodesPromise;
    data.forEach((challenge, i) => {
      if (challengeNodes[i]) {
        updateChallengeNode(challengeNodes[i], challenge);
      }
    });
  };

  // Return an object with the widget root element and a method to update the widget's stats.
  return {
    root,
    updateStats,
  };
})();

/**
 * Creates a SeasonProgressWidget object that displays the user's progress in the current season.
 * @param {Object} race_info - A Race information object.
 * @param {Object} race_info.seasonRewards - An array of season rewards.
 * @param {Object} race_info.user - The current user object.
 * @returns {Object} An object with a root element and an updateStats method to update the widget's stats.
 */
const SeasonProgressWidget = (({ props }) => {
  const { ACTIVE_SEASONS, SEASON_LEVELS, LOOT, CARS } = NTGLOBALS;

  // Retrieve Season information.
  const currentSeason = ACTIVE_SEASONS.find((s) => {
    const now = Date.now();
    return now >= s.startStamp * 1e3 && now <= s.endStamp * 1e3;
  });
  const { seasonRewards, user } = props ?? {};

  // Create the root element for the widget.
  const root = document.createElement("div");
  root.classList.add("nt-stats-season-progress", "theme--pDefault");
  root.innerHTML = `
        <div class="season-progress-widget">
            <div class="season-progress-widget--info">
                <div class="season-progress-widget--title">Season Progress${
                  currentSeason ? "" : " (starting soon)"
                }</div>
                <div class="season-progress-widget--current-xp"></div>
                <div class="season-progress-widget--current-level">
                    <div class="season-progress-widget--current-level--prefix">Level</div>
                    <div class="season-progress-widget--current-level--number"></div>
                </div>
                <div class="season-progress-widget--level-progress">
                    <div class="season-progress-widget--level-progress-bar" style="width: 0%;"></div>
                </div>
            </div>
            <div class="season-progress-widget--next-reward">
                <div class="season-progress-widget--next-reward--display">
                    <div class="season-reward-mini-preview">
                        <div class="season-reward-mini-preview--locked">
                            <div class="tooltip--season tooltip--xs tooltip--c" data-ttcopy="Upgrade to Nitro Gold to Unlock!">
                                <svg class="icon icon-lock"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/dist/site/images/icons/icons.css.svg#icon-lock"></use></svg>
                            </div>
                        </div>
                        <a class="season-reward-mini-preview" href="/season">
                            <div class="season-reward-mini-preview--frame">
                                <div class="rarity-frame rarity-frame--small">
                                    <div class="rarity-frame--extra"></div>
                                    <div class="rarity-frame--content">
                                        <div class="season-reward-mini-preview--preview"></div>
                                        <div class="season-reward-mini-preview--label"></div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;

  // Setup widget text nodes.
  const xpTextNode = root.querySelector(".season-progress-widget--current-xp");
  const xpProgressBarNode = root.querySelector(
    ".season-progress-widget--level-progress-bar"
  );
  const levelNode = root.querySelector(
    ".season-progress-widget--current-level--number"
  );
  const nextRewardRootNode = root.querySelector(".season-reward-mini-preview");
  const nextRewardTypeLabelNode = root.querySelector(
    ".season-reward-mini-preview--label"
  );
  const nextRewardTypeLockedNode = root.querySelector(
    ".season-reward-mini-preview--locked"
  );
  const nextRewardTypePreviewNode = root.querySelector(
    ".season-reward-mini-preview--preview"
  );
  const nextRewardTypePreviewImgNode = document.createElement("img");
  const nextRewardRarityFrameNode = root.querySelector(
    ".rarity-frame.rarity-frame--small"
  );
  nextRewardTypePreviewImgNode.classList.add("season-reward-mini-previewImg");
  if (!currentSeason) {
    nextRewardRootNode.remove();
  }

  /**
   * Returns the next reward the user will receive.
   * @param {number} currentXP - The user's current experience.
   * @returns {Object} The next reward the user will receive.
   */
  const getNextReward = (currentXP) => {
    currentXP = currentXP || user?.experience;
    if (!seasonRewards || seasonRewards.length === 0) {
      return null;
    }
    if (user?.experience === 0) {
      return seasonRewards[0]?.achievementID ?? null;
    }
    let nextReward = seasonRewards.find((r, i) => r.experience > currentXP);
    if (!nextReward) {
      nextReward = seasonRewards[seasonRewards.length - 1];
    }
    return nextReward ?? null;
  };

  /**
   * Calculates the amount of experience required to reach a certain level and the total experience required to reach that level.
   * @param {number} lvl - The level to calculate the required experience for.
   * @returns {Array<number>} An array containing the amount of experience required to reach the specified level and the total experience required to reach that level.
   */
  const getExperienceRequired = (lvl) => {
    if (lvl < 1) {
      lvl = 1;
    }
    let {
      startingLevels,
      experiencePerStartingLevel,
      experiencePerAchievementLevel,
      experiencePerExtraLevels,
    } = SEASON_LEVELS;
    if (startingLevels === 0) {
      startingLevels = currentSeason?.totalRewards ?? 0;
    }

    let totalExpRequired = 0,
      amountExpRequired = experiencePerStartingLevel;
    for (let i = 1; i < lvl; i++) {
      if (i <= startingLevels) {
        totalExpRequired += experiencePerStartingLevel;
      } else if (currentSeason && i > currentSeason.totalRewards) {
        totalExpRequired += experiencePerExtraLevels;
        amountExpRequired = experiencePerExtraLevels;
      } else {
        totalExpRequired += experiencePerAchievementLevel;
        amountExpRequired = experiencePerAchievementLevel;
      }
    }

    return [amountExpRequired, totalExpRequired];
  };

  /**
   * Update the season progress widget with new data.
   * @param {Object} data - An object containing the user's season stats.
   * @param {number} data.experience - The user's current experience.
   * @param {number} data.level - The user's current level.
   */
  const updateStats = ({ experience, level }) => {
    // Get next Reward.
    const nextReward = getNextReward(experience);
    if (!nextReward) {
      return;
    }

    // Get experience required for next level.
    const [amountExpRequired, totalExpRequired] = getExperienceRequired(
      level + 1
    );

    // Calculate progress.
    const progress =
      ((experience - (totalExpRequired - amountExpRequired)) /
        amountExpRequired) *
      100;

    // Update progress text node if experience is available.
    if (experience) {
      xpTextNode.textContent = `${(
        amountExpRequired -
        (totalExpRequired - experience)
      ).toLocaleString()} / ${amountExpRequired / 1e3}k XP`;
      xpProgressBarNode.style.width = `${progress}%`;
      levelNode.textContent =
        currentSeason && level > currentSeason.totalRewards + 1
          ? `∞${level - currentSeason.totalRewards - 1}`
          : level || 1;
    }

    // Create next reward node.
    const { type, value } = nextReward.reward;
    if (["loot", "car"].includes(type)) {
      const item =
        type === "loot"
          ? LOOT.find((l) => l.lootID === value)
          : CARS.find((l) => l.carID === value);
      if (!item) {
        logging.warn("Update")(
          `Unable to find next reward ${type}`,
          nextReward.reward
        );
        return;
      }
      nextRewardRootNode.className = `season-reward-mini-preview season-reward-mini-preview--${
        type === "loot" ? item?.type : "car"
      }`;
      nextRewardTypeLabelNode.textContent =
        type === "loot" ? item?.type ?? "???" : "car";
      nextRewardRarityFrameNode.className = `rarity-frame rarity-frame--small${
        item?.options?.rarity ? ` rarity-frame--${item.options.rarity}` : ""
      }`;
      if (item?.type === "title") {
        nextRewardTypePreviewNode.textContent = `"${item.name}"`;
        nextRewardTypePreviewImgNode.remove();
      } else {
        nextRewardTypePreviewImgNode.src =
          type === "loot"
            ? item?.options?.src
            : `/cars/${item?.options?.smallSrc}`;
        nextRewardTypePreviewNode.append(nextRewardTypePreviewImgNode);
      }
    } else if (type === "money") {
      nextRewardTypeLabelNode.innerHTML = `<div class="as-nitro-cash--prefix">$${value.toLocaleString()}</div>`;
      nextRewardTypePreviewImgNode.src =
        "/dist/site/images/pages/race/race-results-prize-cash.2.png";
      nextRewardRootNode.className =
        "season-reward-mini-preview season-reward-mini-preview--money";
      nextRewardRarityFrameNode.className =
        "rarity-frame rarity-frame--small rarity-frame--legendary";
      nextRewardTypePreviewNode.append(nextRewardTypePreviewImgNode);
    } else {
      logging.warn("Update")(
        `Unhandled next reward type ${type}`,
        nextReward.reward
      );
      return;
    }
    if (!nextReward.free && user?.membership === "basic") {
      nextRewardRootNode.firstElementChild.before(nextRewardTypeLockedNode);
    } else {
      nextRewardTypeLockedNode.remove();
    }
  };

  // Return an object with the widget root element and a method to update the widget's stats.
  return {
    root,
    updateStats,
  };
})(RACE_OBJ);

/**
 * Displays a widget that shows various statistics about the player.
 * @returns {Object} An object containing the root element of the widget and an `updateStats` method that can be used to update the widget stats.
 */
const StatWidget = (() => {
  // Create the root element for the widget.
  const root = document.createElement("div");
  root.classList.add("nt-stats-info");

  // Create the HTML for the widget.
  root.innerHTML = `
      <div class="nt-stats-metric-row">
          <span class="nt-stats-metric nt-stats-metric-total-races">
              <span class="nt-stats-metric-heading">Total Races:</span>
              <span class="nt-stats-metric-value">0</span>
          </span>
          <span class="nt-stats-metric-separator">|</span>
          <span class="nt-stats-metric nt-stats-metric-season-races">
              <span class="nt-stats-metric-heading">Season Races:</span>
              <span class="nt-stats-metric-value">N/A</span>
          </span>
          ${
            CURRENT_USER.tag
              ? `<span class="nt-stats-metric-separator">|</span>
          <span class="nt-stats-metric nt-stats-metric-team-races">
              <span class="nt-stats-metric-heading">Team Races:</span>
              <span class="nt-stats-metric-value">N/A</span>
          </span>`
              : ``
          }
          <span class="nt-stats-metric-separator">|</span>
          <span class="nt-stats-metric nt-stats-metric-session-races">
              <span class="nt-stats-metric-heading">Current Session:</span>
              <span class="nt-stats-metric-value">0</span>
          </span>
      </div>
      <div class="nt-stats-metric-row">
          <span class="nt-stats-metric nt-stats-metric-avg-speed">
              <span class="nt-stats-metric-heading">Avg Speed:</span>
              <span class="nt-stats-metric-value">0</span>
              <span class="nt-stats-metric-suffix">WPM</span>
          </span>
          <span class="nt-stats-metric-separator">|</span>
          <span class="nt-stats-metric nt-stats-metric-avg-accuracy">
              <span class="nt-stats-metric-heading">Avg Acc:</span>
              <span class="nt-stats-metric-value">0</span>
              <span class="nt-stats-metric-suffix nt-stats-metric-suffix-no-space">%</span>
          </span>
      </div>
      `;

  // Get references to the various elements in the widget.
  const totalRacesElement = root.querySelector(
    ".nt-stats-metric-total-races .nt-stats-metric-value"
  );
  const sessionRacesElement = root.querySelector(
    ".nt-stats-metric-session-races .nt-stats-metric-value"
  );
  const teamRacesElement = CURRENT_USER.tag
    ? root.querySelector(".nt-stats-metric-team-races .nt-stats-metric-value")
    : null;
  const seasonRacesElement = root.querySelector(
    ".nt-stats-metric-season-races .nt-stats-metric-value"
  );
  const avgSpeedElement = root.querySelector(
    ".nt-stats-metric-avg-speed .nt-stats-metric-value"
  );
  const avgAccuracyElement = root.querySelector(
    ".nt-stats-metric-avg-accuracy .nt-stats-metric-value"
  );

  // Return an object with the widget root element and a method to update the widget's stats.
  return {
    root,
    updateStats: (data) => {
      const racesPlayed = data?.racesPlayed;
      const sessionRaces = data?.sessionRaces;
      const seasonRaces = data?.seasonRaces;
      const teamRaces = data?.teamRaces;
      const avgAcc = data?.avgAcc;
      const avgSpeed = data?.avgSpeed ?? data?.avgScore;

      // Update stats that were supplied.
      if (racesPlayed) {
        totalRacesElement.textContent = racesPlayed.toLocaleString();
      }
      if (sessionRaces) {
        sessionRacesElement.textContent = sessionRaces.toLocaleString();
      }
      if (seasonRaces) {
        const value = parseInt(seasonRaces, 10);
        seasonRacesElement.textContent = Number.isNaN(value)
          ? seasonRaces
          : value.toLocaleString();
      }
      if (teamRaces && teamRacesElement) {
        teamRacesElement.textContent = teamRaces.toLocaleString();
      }
      if (avgAcc) {
        avgAccuracyElement.textContent = avgAcc;
      }
      if (typeof avgSpeed === "number") {
        avgSpeedElement.textContent = avgSpeed;
      }
    },
  };
})();

////////////
//  Main  //
////////////

/**
 * Adds stats to the race page with current values.
 */
const addStatsToRacePage = async () => {
  // Get user and daily challenge stats.
  const { user, dailyChallenges } = await getStats();
  StatWidget.updateStats(user);
  SeasonProgressWidget.updateStats(user);
  DailyChallengeWidget.updateStats(dailyChallenges);
  ToolbarWidget.updateStats(user);
  logging.info("Update")("Start of race");

  // Create Stats widget.
  const root = document.createElement("div");
  const body = document.createElement("div");
  root.classList.add("nt-stats-root");
  body.classList.add("nt-stats-body");
  const leftSection = document.createElement("div");
  leftSection.classList.add("nt-stats-left-section");
  leftSection.append(DailyChallengeWidget.root);
  const rightSection = document.createElement("div");
  rightSection.classList.add("nt-stats-right-section");
  rightSection.append(StatWidget.root, SeasonProgressWidget.root);
  body.append(leftSection, rightSection);
  root.append(body, ToolbarWidget.root);
  RACE_CONTAINER.parentElement.append(root);

  // Update team stats if user is in a team.
  const teamStats = await getTeamStats();
  if (teamStats) {
    const { member } = teamStats;
    StatWidget.updateStats({ teamRaces: member.played });
  }

  // Update season stats.
  const summaryStats = await getSummaryStats();
  if (summaryStats) {
    const { seasonBoard } = summaryStats;
    if (seasonBoard) {
      StatWidget.updateStats({ seasonRaces: seasonBoard.played });
    }
  }
};

addStatsToRacePage();

/**
 * Broadcasts a message to let other windows know that the stats have been updated.
 * Listens for messages on the channel and updates the appropriate widgets based on the message type.
 */
const MESSAGE_LAST_RACE_UPDATED = "last_race_updated";
const MESSAGE_DAILY_CHALLENGE_UPDATED = "stats_daily_challenge_updated";
const MESSAGE_USER_STATS_UPDATED = "stats_user_updated";
const statChannel = new BroadcastChannel("NTRacingStats");
statChannel.onmessage = async (e) => {
  const [type, payload] = e.data;
  switch (type) {
    case MESSAGE_LAST_RACE_UPDATED: {
      const { user, dailyChallenges } = await getStats();
      StatWidget.updateStats(user);
      SeasonProgressWidget.updateStats(user);
      DailyChallengeWidget.updateStats(dailyChallenges);
      ToolbarWidget.updateStats(user);
      break;
    }
    case MESSAGE_DAILY_CHALLENGE_UPDATED:
      DailyChallengeWidget.updateStats(payload);
      break;
    case MESSAGE_USER_STATS_UPDATED:
      StatWidget.updateStats(payload);
      SeasonProgressWidget.updateStats(payload);
      break;
  }
};

/**
 * Syncs the daily challenge data.
 */
SERVER.on("setup", async (e) => {
  const dailyChallenges = mergeDailyChallengeData(e.challenges);
  DailyChallengeWidget.updateStats(dailyChallenges);
  statChannel.postMessage([MESSAGE_DAILY_CHALLENGE_UPDATED, dailyChallenges]);
});

/**
 * Syncs some of the user's stats data.
 */
SERVER.on("joined", async (e) => {
  if (e.userID !== CURRENT_USER.userID) {
    return;
  }
  const payload = {
    level: e.profile?.level,
    racesPlayed: e.profile?.racesPlayed,
    sessionRaces: e.profile?.sessionRaces,
    avgSpeed: e.profile?.avgSpeed,
  };
  StatWidget.updateStats(payload);
  SeasonProgressWidget.updateStats(payload);
  statChannel.postMessage([MESSAGE_USER_STATS_UPDATED, payload]);
});

/**
 * Store race results in IndexedDB when the race is complete.
 */
let hasCollectedResultStats = false;
SERVER.on("update", async (e) => {
  const me = e?.racers?.find((r) => r.userID === CURRENT_USER.userID);
  if (
    me.progress.completeStamp > 0 &&
    me.rewards?.current &&
    !hasCollectedResultStats
  ) {
    hasCollectedResultStats = true;
    try {
      const backupData = {
        ...me.rewards.current,
        challenges: me.challenges,
        userID: CURRENT_USER.userID,
      };
      await db.backupStatData.put(backupData);
      statChannel.postMessage([MESSAGE_LAST_RACE_UPDATED]);
    } catch (error) {
      console.error(error);
    }
  }
});

/**
 * Adds a mutation observer to check if the racing results have been shown.
 * When the results are shown, updates various widgets with the user's stats.
 */
const resultObserver = new MutationObserver(([mutation], observer) => {
  for (const node of mutation.addedNodes) {
    if (node.classList?.contains("race-results")) {
      observer.disconnect();
      logging.info("Update")("Race Results received");
      addStatsToRacePage();
      break;
    }
  }
});
resultObserver.observe(RACE_CONTAINER, { childList: true });
