// ==UserScript==
// @name         Hentai Heroes SFW
// @namespace    https://sleazyfork.org/fr/scripts/539097-hentai-heroes-sfw
// @description  Removing explicit images in Hentai Heroes game and setting all girls / champions poses to the default one.
// @version      1.10.1
// @match        https://*.comixharem.com/*
// @match        https://*.hentaiheroes.com/*
// @match        https://*.pornstarharem.com/*
// @run-at       document-start
// @grant        none
// @author       Geto_hh
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539097/Hentai%20Heroes%20SFW.user.js
// @updateURL https://update.greasyfork.org/scripts/539097/Hentai%20Heroes%20SFW.meta.js
// ==/UserScript==

// ==CHANGELOG==
// 1.10.0: Add option to replace background
// 1.9.0: Add option to hide avatars
// 1.8.0: Add option to hide girls
// 1.7.0: Put observer back for girls and home background
// 1.6.0: Use style to hide images and background images
// 1.5.0: Split hide process and modify process & remove observer
// 1.4.0: Hide girls on the event and refill pop-up
// 1.3.0: Replace home page background image to alway have the same one and avoid NSFW ones
// 1.2.0: Allow user to show affection scene when clicking on eye icon
// 1.1.0: Page per page query selectors and optimized girl icons processing on edit team pages
// 1.0.1: Small fixes
// 1.0.0: Optimize script for release
// 0.6.0: Use only document query selectors and run continously
// 0.5.0: Optimized script for faster processing
// 0.4.0: Stop processing mutations when a 'diamond' or 'speech_bubble_info_icn' class element is clicked
// 0.3.0: Run script only once per page load
// 0.2.0: Added namespace
// 0.1.0: First available version on SleazyFork
// ==/CHANGELOG==

let DEBUG_ACTIVATED = false;
const DEBUG_LIMIT_ACTIVATED = false;

let debugHideLimitCount = 0;
let debugHideTemporarilyLimitCount = 0;
let debugModifyLimitCount = 0;

let foundMatchingUrl = false;

const DEFAULT_BACKGROUND_URL =
  'https://hh2.hh-content.com/pictures/gallery/6/2200x/9c04e3d2df8d992146eea132225d2d54.jpg';
const NEW_BACKGROUNG_URL =
  'https://hh2.hh-content.com/pictures/gallery/6/2200x/401-a8339a2168753900db437d91f2ed39ff.jpg';

const HIDE_AVATARS = true;
const HIDE_BACKGROUND = false;
const HIDE_GIRLS = true;
const REPLACE_BACKGROUND = true;

const NB_OF_GIRL_ICONS_TO_PROCESS_AT_ONCE = 20;
let currentIconIndex = 0;

let observer;
let observerGirlImagesProcessed = false;
let observerGirlIconsProcessStarted = false;
let observerGirlIconsProcessEnded = false;

const girlsWithSFWIndexEqualsOne = ['225777755', '298984036'];

const girlsRegex =
  /(.*\/)([0-9]+)\/([a-zA-Z]+)(\d+)([a-zA-Z0-9-_]*)\.(png|jpg|jpeg|webp|gif|bmp|tiff|svg|ico)$/;

// Activities screen https://www.hentaiheroes.com/activities.html
const activitiesSelectorsOfBackgroundImagesSrcToRemove = [
  '.contest > .contest_header',
  '.pop-records-container > .pop-record',
];
const activitiesSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
  '.mission_image > img',
  '.pop_thumb > img',
  '.pop-details-left > img',
  '.pop_girl_avatar > img',
  '.timer-girl-container > img',
];
const activitiesSelectorsOfGirlsSrcToModify = [];
const activitiesSelectorsOfGirlsIconsSrcToModify = [];

// Champions screen https://www.hentaiheroes.com/champions/3
const championsSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
  '.champions-animation > .avatar',
  '.champions-animation > .champions-over__champion-image',
  '.defender-preview > img',
  '.attacker-preview > .character',
  '.rounds-info__figures > .figure',
];
const championSelectorsOfGirlsSrcToModify = [
  '.girl-box__draggable > .girl-box__ico',
  '.girl > .avatar',
  '.girl-card > img',
];
const championSelectorsOfGirlsIconsSrcToModify = [];

// Characters screen https://www.hentaiheroes.com/characters/461620826
const charactersSelectorsOfGirlsSrcToModify = [
  '.avatar-box > .avatar',
  '.awakening-container > .avatar',
  '.variation_girl > .girl_ava',
  '.team-slot-container > img',
];
const charactersSelectorsOfGirlsIconsSrcToModify = ['.left > img'];

// Club champion screen https://www.hentaiheroes.com/club-champion.html
const clubChampionSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
  '.figure',
  '.girl-fav-position > .favorite-position',
  '.girl-card > .fav-position',
];
const clubChampionSelectorsOfGirlsSrcToModify = [
  '.girl-box__draggable > .girl-box__ico',
  '.girl > .avatar',
  '.girl-card > img',
];
const clubChampionSelectorsOfGirlsIconsSrcToModify = [];

// Edit Labyrinth team screen https://www.hentaiheroes.com/edit-labyrinth-team.html
const editLabyrinthTeamSelectorsOfGirlsSrcToModify = ['.girl-display > .avatar'];
const editLabyrinthTeamSelectorsOfGirlsIconsSrcToModify = [
  '.base-hexagon > .girl_img',
  '.harem-girl-container > .girl_img', // all girls => 282 for me
];

// Edit team screen https://www.hentaiheroes.com/edit-team.html
const editTeamSelectorsOfGirlsSrcToModify = ['.girl-display > .avatar'];
const editTeamSelectorsOfGirlsIconsSrcToModify = [
  '.base-hexagon > .girl_img',
  '.harem-girl-container > .girl_img',
];

// Edit world boss team screen https://www.hentaiheroes.com/edit-world-boss-team.html
const editWorldBossTeamSelectorsOfGirlsSrcToModify = ['.girl-display > .avatar'];
const editWorldBossTeamSelectorsOfGirlsIconsSrcToModify = [
  '.base-hexagon > .girl_img',
  '.harem-girl-container > .girl_img',
];

// Event pop-up https://www.hentaiheroes.com/event.html?tab=sm_event_36
const eventSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
  '.sm-static-girl > img',
  '.lse_puzzle_wrapper > .lively_scene_image',
];
const eventSelectorsOfGirlsSrcToModify = ['.selected > .avatar'];
const eventSelectorsOfGirlsIconsSrcToModify = [];

// Girl screen https://www.hentaiheroes.com/girl/143960742
const girlSelectorsOfGirlsSrcToModify = [
  '#next_girl > img',
  '#previous_girl > img',
  '.girl-skills-avatar > .avatar',
  '.girl-avatar-wrapper > .avatar',
  '.team-slot-container > img',
];
const girlSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];

// Home screen https://www.hentaiheroes.com/home.html
const homeSelectorsOfBackgroundImagesSrcToRemove = [
  '#crosspromo_show_ad > .crosspromo_banner',
  '#special-offer',
  '.news_page_content > .news_page_pic',
  '.news_thumb > .news_thumb_pic',
];
const homeSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
  '.waifu-container > .avatar',
];
const homeSelectorsOfImagesSrcToReplace = ['.fixed_scaled > img'];
const homeSelectorsOfGirlsSrcToModify = [];
const homeSelectorsOfGirlsIconsSrcToModify = [];

// Labyrinth screen https://www.hentaiheroes.com/labyrinth.html
const labyrinthSelectorsOfGirlsSrcToModify = ['.relic-infos > .girl-image'];
const labyrinthSelectorsOfGirlsIconsSrcToModify = [];

// Labyrinth battle screen https://www.hentaiheroes.com/labyrinth-battle.html
const labyrinthBattleSelectorsOfGirlsSrcToModify = [
  '.pvp-girls > .avatar',
];
const labyrinthBattleSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];

// Labyrinth entrance screen https://www.hentaiheroes.com/labyrinth-entrance.html
const labyrinthEntranceSelectorsOfImagesSrcToRemove = ['.labyrinth-girl > .avatar'];
const labyrinthEntranceSelectorsOfGirlsSrcToModify = [];
const labyrinthEntranceSelectorsOfGirlsIconsSrcToModify = [];

// Labyrinth pool select screen https://www.hentaiheroes.com/labyrinth-pool-select.html
const labyrinthPoolSelectSelectorsOfGirlsSrcToModify = [];
const labyrinthPoolSelectSelectorsOfGirlsIconsSrcToModify = ['.girl-container > .girl-image'];
const labyrinthPoolSelectSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
];

// Labyrinth pre-battle screen https://www.hentaiheroes.com/labyrinth-pre-battle.html
const labyrinthPreBattleSelectorsOfGirlsSrcToModify = [];
const labyrinthPreBattleSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];

// League pre-battle screen https://www.hentaiheroes.com/leagues-pre-battle.html
const leaguePreBattleSelectorsOfGirlsSrcToModify = ['.girl-block > .avatar'];
const leaguePreBattleSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];
const leaguePreBattleSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
];

// League battle screen https://www.hentaiheroes.com/league-battle.html
const leagueBattleSelectorsOfGirlsSrcToModify = ['.new-battle-girl-container > .avatar'];
const leagueBattleSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];
const leagueBattleSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
];

// Login pop-up (no precise url as it can appear on any page)
const loginSelectorsOfImagesSrcToRemove = [
  '.intro > .quest-container > #scene > .canvas > .picture',
];

// Member progression screen https://www.hentaiheroes.com/member-progression.html
const memberProgressionSelectorsOfImagesSrcToRemove = ['.page-girl > img'];
const memberProgressionSelectorsOfGirlsSrcToModify = [];
const memberProgressionSelectorsOfGirlsIconsSrcToModify = [];

// No enegery pop-up (no precise url as it can be opened with the plus icon on any page)
const noEnergySelectorsOfImagesSrcToRemove = ['#no_energy_popup > .avatar'];

// Pachinko screen https://www.hentaiheroes.com/pachinko.html
const pachinkoSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
  '.pachinko_img > img',
];
const pachinkoSelectorsOfGirlsSrcToModify = [];
const pachinkoSelectorsOfGirlsIconsSrcToModify = [];

// Pantheon screen https://www.hentaiheroes.com/pantheon.html
const pantheonSelectorsOfGirlsSrcToModify = ['.girl-container > .avatar'];
const pantheonSelectorsOfGirlsIconsSrcToModify = [];
const pantheonSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
  '.girl-container > .avatar',
  '.pantheon_bgr > .stage-bgr',
];

// Pantheon battle screen https://www.hentaiheroes.com/pantheon-battle.html
const pantheonBattleSelectorsOfGirlsSrcToModify = [
  '.new-battle-girl-container > .avatar',
];
const pantheonBattleSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];
const pantheonBattleSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
];

// Pantheon pre-battle screen https://www.hentaiheroes.com/pantheon-pre-battle.html
const pantheonPreBattleSelectorsOfGirlsSrcToModify = [];
const pantheonPreBattleSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];
const pantheonPreBattleSelectorsOfImagesSrcToRemove = [
  '.fixed_scaled > img',
  '.player-profile-picture > img',
];

// Quest / Affection scene screen https://www.hentaiheroes.com/quest/1003697?grade=1
const questSelectorsOfImagesToHide = ['.canvas > .picture'];

// Season arena screen https://www.hentaiheroes.com/season-arena.html
const seasonArenaSelectorsOfGirlsSrcToModify = [];
const seasonArenaSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];
const seasonArenaSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
];

// Season battle screen https://www.hentaiheroes.com/season-battle.html
const seasonBattleSelectorsOfGirlsSrcToModify = [
  '.new-battle-girl-container > .avatar',
];
const seasonBattleSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];
const seasonBattleSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
];

// Shop pop-up (no precise url as it can be opened with the chest icon on the homepage or the plus icon on any page)
const shopSelectorsOfImagesSrcToRemove = [
  '.prestige > .avatar',
  '#special-offer > .background-video',
];
const shopSelectorsOfBackgroundImagesSrcToRemove = [
  '.bundle > #special-offer',
  '.bundle > #starter-offer',
  '.mc-card-container > .rewards-container',
  '.product-offer-container > .product-offer-background-container',
];

// Side quests screen https://www.hentaiheroes.com/side-quests.html
const sideQuestsSelectorsOfImagesSrcToRemove = ['.side-quest-image > img'];
const sideQuestsSelectorsOfGirlsSrcToModify = [];
const sideQuestsSelectorsOfGirlsIconsSrcToModify = [];

// Teams screen https://www.hentaiheroes.com/teams.html
const teamsSelectorsOfGirlsSrcToModify = [
  '.team-slot-container > img',
];
const teamsSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];
const teamsSelectorsOfImagesSrcToRemove = ['.girl-image-container > img'];

// Troll battle screen https://www.hentaiheroes.com/troll-battle.html
const trollBattleSelectorsOfGirlsSrcToModify = [
  '.new-battle-girl-container > .avatar',
];
const trollBattleSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];
const trollBattleSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
];

// Troll pre-battle screen https://www.hentaiheroes.com/troll-pre-battle.html
const trollPreBattleSelectorsOfGirlsSrcToModify = [];
const trollPreBattleSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];
const trollPreBattleSelectorsOfImagesSrcToRemove = [
  ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
  ...(HIDE_BACKGROUND ? ['.fixed_scaled > img'] : []),
];

// Main quest troll screens https://www.hentaiheroes.com/world/12
const worldSelectorsOfImagesSrcToRemove = ['.troll_world > .troll-tier-img'];
const worldSelectorsOfGirlsSrcToModify = [];
const worldSelectorsOfGirlsIconsSrcToModify = [];

// World boss battle screen https://www.hentaiheroes.com/world-boss-battle.html
const worldBossBattleSelectorsOfGirlsSrcToModify = [
  '.pvp-girls > .avatar',
];
const worldBossBattleSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];

// World boss event screen https://www.hentaiheroes.com/world-boss-event
const worldBossEventSelectorsOfImagesSrcToRemove = [
  '.left-container > .avatar',
  '.right-container > .avatar',
];
const worldBossEventSelectorsOfGirlsSrcToModify = [];
const worldBossEventSelectorsOfGirlsIconsSrcToModify = [];

// World boss pre-battle screen https://www.hentaiheroes.com/world-boss-pre-battle
const worldBossEventPreBattleSelectorsOfGirlsSrcToModify = [];
const worldBossEventPreBattleSelectorsOfGirlsIconsSrcToModify = ['.base-hexagon > .girl_img'];

function initObserver() {
  if (DEBUG_ACTIVATED) {
    console.log('> ');
    console.log('> INIT OBSERVER');
  }

  resetObserverState();

  if (!observer) {
    if (DEBUG_ACTIVATED) {
      console.log('> ');
      console.log('> MutationObserver initialized.');
    }
    // Use MutationObserver to watch for dynamically loaded images
    observer = new MutationObserver(function (mutations) {
      mutations.forEach(function () {
        modifyGirlMedias();
      });
    });
  }

  // Start observing the main document
  if (observer) {
    if (DEBUG_ACTIVATED) {
      console.log('> ');
      console.log('> MutationObserver started.');
    }
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

function resetObserverState() {
  observerGirlImagesProcessed = false;
  observerGirlIconsProcessStarted = false;
  observerGirlIconsProcessEnded = false;
}

function killObserver() {
  if (DEBUG_ACTIVATED) {
    console.log('> ');
    console.log('> killObserver');
  }
  if (observer) {
    if (DEBUG_ACTIVATED) {
      console.log('> MutationObserver disconnected.');
    }
    observer.disconnect();
    observer = null;
  }
}

function processGirlImagesSrcToModify(
  selectorsOfGirlsSrcToModify,
  selectorsOfGirlsIconsSrcToModify,
) {
  if (DEBUG_ACTIVATED) {
    console.log('> PROCESSING GIRLS SRC TO MODIFY');
  }
  if (observer) {
    if (HIDE_GIRLS || selectorsOfGirlsSrcToModify.length === 0) {
      observerGirlImagesProcessed = true;
    }
    if (selectorsOfGirlsIconsSrcToModify.length === 0) {
      observerGirlIconsProcessStarted = true;
      observerGirlIconsProcessEnded = true;
    }
  }

  if (HIDE_GIRLS && selectorsOfGirlsSrcToModify.length > 0) {
    processImagesSrcToHidePermanently(selectorsOfGirlsSrcToModify);
  }

  const baseElements =
    !HIDE_GIRLS && selectorsOfGirlsSrcToModify.length > 0
      ? document.querySelectorAll(selectorsOfGirlsSrcToModify.join(', '))
      : [];

  const iconElements =
    selectorsOfGirlsIconsSrcToModify.length > 0
      ? document.querySelectorAll(selectorsOfGirlsIconsSrcToModify.join(', '))
      : [];

  const totalIconElements = iconElements.length;
  const processIconElements = totalIconElements > 0;
  const elements = baseElements.length > 0 ? Array.from(baseElements) : [];

  const startIndex = currentIconIndex;
  const endIndex = Math.min(startIndex + NB_OF_GIRL_ICONS_TO_PROCESS_AT_ONCE, totalIconElements);
  const batchedIconElements = Array.from(iconElements).slice(startIndex, endIndex);

  currentIconIndex = endIndex >= totalIconElements ? 0 : endIndex;

  if (DEBUG_ACTIVATED) {
    console.log('> nb of baseElements:', elements.length);
    console.log('> nb of iconElements:', totalIconElements);
    console.log('> nb of batchedIconElements:', batchedIconElements.length);
    console.log('> current batch (start, end):', startIndex, endIndex);
  }

  let nbOfElementsProcessed = 0;
  elements.forEach((element) => {
    if (element && element.src && !element.src.includes('grade_skins')) {
      const baseSrc = element.src.split('?')[0];
      const newSrc = baseSrc.replace(girlsRegex, function (match, p1, p2, p3, p4, p5, p6) {
        const sfwIndex = girlsWithSFWIndexEqualsOne.includes(p2) ? '1' : '0';
        return p4 === sfwIndex ? match : p1 + p2 + '/' + p3 + sfwIndex + p5 + '.' + p6;
      });

      if (newSrc !== baseSrc) {
        if (DEBUG_ACTIVATED) {
          console.log('> altering girl src from:', element.outerHTML);
        }
        element.src = newSrc;
        nbOfElementsProcessed++;
      }
    }
  });
  if (DEBUG_ACTIVATED) {
    console.log('> nb of elements processed:', nbOfElementsProcessed);
  }
  if (observer && elements.length > 0 && nbOfElementsProcessed > 0) {
    observerGirlImagesProcessed = true;
  }

  if (processIconElements) {
    setTimeout(() => {
      let nbOfIconElementsProcessed = 0;
      batchedIconElements.forEach((element) => {
        if (element && element.src && !element.src.includes('grade_skins')) {
          const baseSrc = element.src.split('?')[0];
          const newSrc = baseSrc.replace(girlsRegex, function (match, p1, p2, p3, p4, p5, p6) {
            const sfwIndex = girlsWithSFWIndexEqualsOne.includes(p2) ? '1' : '0';
            return p4 === sfwIndex ? match : p1 + p2 + '/' + p3 + sfwIndex + p5 + '.' + p6;
          });

          if (newSrc !== baseSrc) {
            if (DEBUG_ACTIVATED) {
              console.log('> altering girl icon src from:', element.outerHTML);
            }
            element.src = newSrc;
            nbOfIconElementsProcessed++;
          }
        }
      });
      if (DEBUG_ACTIVATED) {
        console.log('> nb of icon elements processed:', nbOfIconElementsProcessed);
      }
      if (
        observer &&
        batchedIconElements.length > 0 &&
        startIndex === 0 &&
        observerGirlIconsProcessStarted
      ) {
        observerGirlIconsProcessEnded = true;
      }
      if (
        observer &&
        batchedIconElements.length > 0 &&
        startIndex === 0 &&
        nbOfIconElementsProcessed > 0
      ) {
        observerGirlIconsProcessStarted = true;
      }
    }, 0);
  }

  if (observerGirlIconsProcessEnded && observerGirlImagesProcessed) {
    killObserver();
  }
}

function processBackgroundImagesSrcToHidePermanently(selectorsArray) {
  if (DEBUG_ACTIVATED) {
    console.log('> PROCESSING BACKGROUND IMAGES SRC TO HIDE PERMANENTLY');
  }

  const selectors = selectorsArray.join(', ');
  const displayNoneRule = `${selectors} { background-image: none !important; }\n`;

  const style = document.createElement('style');
  style.textContent = style.textContent
    ? style.textContent + `${displayNoneRule}`
    : displayNoneRule;
  document.head.prepend(style);
}

function modifyCssOfSelectors(selectorsArray, styleRules) {
  if (DEBUG_ACTIVATED) {
    console.log('> PROCESSING MODIFY CSS OF SELECTORS');
  }

  const selectors = selectorsArray.join(', ');
  const displayNoneRule = `${selectors} { ${styleRules.join(' !important; ')} }\n`;

  const style = document.createElement('style');
  style.textContent = style.textContent
    ? style.textContent + `${displayNoneRule}`
    : displayNoneRule;
  document.head.prepend(style);
}

function processImagesSrcToHidePermanently(selectorsArray) {
  if (DEBUG_ACTIVATED) {
    console.log('> PROCESSING IMAGES SRC TO HIDE PERMANENTLY');
  }

  const selectors = selectorsArray.join(', ');
  const displayNoneRule = `${selectors} { display: none !important; }\n`;

  const style = document.createElement('style');
  style.textContent = style.textContent
    ? style.textContent + `${displayNoneRule}`
    : displayNoneRule;
  document.head.prepend(style);
}

function processImagesSrcToReplace(selectorsArray, newSrc) {
  if (DEBUG_ACTIVATED) {
    console.log('> PROCESSING IMAGES SRC TO REPLACE');
  }
  const elements =
    selectorsArray.length > 0 ? document.querySelectorAll(selectorsArray.join(', ')) : [];
  let nbOfElementsProcessed = 0;
  if (DEBUG_ACTIVATED && elements.length > 0) {
    console.log('> nb of elements:', elements.length);
  }
  elements.forEach((element) => {
    if (element && element.src) {
      element.src = newSrc;
      nbOfElementsProcessed++;
    }
  });
  if (DEBUG_ACTIVATED) {
    console.log('> nb of elements processed:', nbOfElementsProcessed);
  }
}

function processImagesToHideTemporarily(selectorsArray) {
  if (DEBUG_ACTIVATED) {
    console.log('> PROCESSING IMAGES TO HIDE TEMPORARILY');
  }
  //TODO improve with style
  const elements =
    selectorsArray.length > 0 ? document.querySelectorAll(selectorsArray.join(', ')) : [];
  let nbOfElementsProcessed = 0;
  if (DEBUG_ACTIVATED && elements.length > 0) {
    console.log('> nb of elements:', elements.length);
  }
  elements.forEach((element) => {
    if (element) {
      element.style.display = 'none';
      nbOfElementsProcessed++;
    }
  });
  if (DEBUG_ACTIVATED) {
    console.log('> nb of elements processed:', nbOfElementsProcessed);
  }
}

function processImagesToShowAgain(selectorsArray) {
  if (DEBUG_ACTIVATED) {
    console.log('> PROCESSING IMAGES TO SHOW AGAIN');
  }
  //TODO improve with style
  const elements =
    selectorsArray.length > 0 ? document.querySelectorAll(selectorsArray.join(', ')) : [];
  let nbOfElementsProcessed = 0;
  if (DEBUG_ACTIVATED && elements.length > 0) {
    console.log('> nb of elements:', elements.length);
  }
  elements.forEach((element) => {
    if (element && element.style) {
      element.style.display = 'block';
      nbOfElementsProcessed++;
    }
  });
  if (DEBUG_ACTIVATED) {
    console.log('> nb of elements processed:', nbOfElementsProcessed);
  }
}

// Function to process image URLs
function hideMedias() {
  if (DEBUG_LIMIT_ACTIVATED) {
    debugHideLimitCount++;
    if (debugHideLimitCount > 3) {
      DEBUG_ACTIVATED = false;
    }
  }

  if (DEBUG_ACTIVATED) {
    console.log(' ');
    console.log('> ALL PAGES');
  }
  if (REPLACE_BACKGROUND && !HIDE_BACKGROUND) {
    processImagesSrcToReplace(['.fixed_scaled > img'], NEW_BACKGROUNG_URL);
  }
  processBackgroundImagesSrcToHidePermanently(shopSelectorsOfBackgroundImagesSrcToRemove);
  processImagesSrcToHidePermanently([
    ...(HIDE_AVATARS ? ['.player-profile-picture > img'] : []),
    ...loginSelectorsOfImagesSrcToRemove,
    ...noEnergySelectorsOfImagesSrcToRemove,
    ...shopSelectorsOfImagesSrcToRemove,
  ]);

  if (window.location.href.includes('/activities.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> ACTIVITIES PAGE');
    }

    processBackgroundImagesSrcToHidePermanently(activitiesSelectorsOfBackgroundImagesSrcToRemove);
    processImagesSrcToHidePermanently(activitiesSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/champions/')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> CHAMPIONS PAGE');
    }

    processImagesSrcToHidePermanently(championsSelectorsOfImagesSrcToRemove);
    modifyCssOfSelectors(
      ['.champions-over__champion-wrapper > .champions-over__champion-info'],
      ['display: flex', 'position: relative', 'left: -50px', 'top: 50px'],
    );
  }

  if (window.location.href.includes('/characters/')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> CHARACTERS PAGE');
    }
  }

  if (window.location.href.includes('/club-champion.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> CLUB CHAMPION PAGE');
    }

    processImagesSrcToHidePermanently(clubChampionSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/edit-labyrinth-team.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> EDIT LABYRINTH TEAM PAGE');
    }
  }

  if (window.location.href.includes('/edit-team.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> EDIT TEAM PAGE');
    }
  }

  if (window.location.href.includes('/edit-world-boss-team.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> EDIT WORLD BOSS TEAM PAGE');
    }
  }

  if (window.location.href.includes('/event.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> EVENT PAGE');
    }

    processImagesSrcToHidePermanently(eventSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/girl/')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> GIRL PAGE');
    }
  }

  if (window.location.href.includes('/home.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> HOME PAGE');
    }

    processImagesSrcToReplace(homeSelectorsOfImagesSrcToReplace, NEW_BACKGROUNG_URL);

    processBackgroundImagesSrcToHidePermanently(homeSelectorsOfBackgroundImagesSrcToRemove);
    processImagesSrcToHidePermanently(homeSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/labyrinth.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH PAGE');
    }
  }

  if (window.location.href.includes('/labyrinth-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH BATTLE PAGE');
    }
  }

  if (window.location.href.includes('/labyrinth-entrance.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH ENTRANCE PAGE');
    }

    processImagesSrcToHidePermanently(labyrinthEntranceSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/labyrinth-pool-select.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH POOL SELECT PAGE');
    }

    processImagesSrcToHidePermanently(labyrinthPoolSelectSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/labyrinth-pre-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH PRE-BATTLE PAGE');
    }
  }

  if (window.location.href.includes('/league-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LEAGUE BATTLE PAGE');
    }

    processImagesSrcToHidePermanently(leagueBattleSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/leagues-pre-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LEAGUE PRE-BATTLE PAGE');
    }

    processImagesSrcToHidePermanently(leaguePreBattleSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/member-progression.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> MEMBER PROGRESSION PAGE');
    }

    processImagesSrcToHidePermanently(memberProgressionSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/pachinko.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> PACHINKO PAGE');
    }

    processImagesSrcToHidePermanently(pachinkoSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/pantheon.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> PANTHEON PAGE');
    }

    processImagesSrcToHidePermanently(pantheonSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/pantheon-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> PANTHEON BATTLE PAGE');
    }

    processImagesSrcToHidePermanently(pantheonBattleSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/pantheon-pre-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> PANTHEON PRE-BATTLE PAGE');
    }

    processImagesSrcToHidePermanently(pantheonPreBattleSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/season-arena.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> SEASON ARENA PAGE');
    }

    processImagesSrcToHidePermanently(seasonArenaSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/season-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> SEASON BATTLE PAGE');
    }

    processImagesSrcToHidePermanently(seasonBattleSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/side-quests.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> SIDE QUESTS PAGE');
    }

    processImagesSrcToHidePermanently(sideQuestsSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/teams.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> TEAMS PAGE');
    }

    processImagesSrcToHidePermanently(teamsSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/troll-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> TROLL BATTLE PAGE');
    }

    processImagesSrcToHidePermanently(trollBattleSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/troll-pre-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> TROLL PRE-BATTLE PAGE');
    }

    processImagesSrcToHidePermanently(trollPreBattleSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/world/')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> WORLD PAGE');
    }

    processImagesSrcToHidePermanently(worldSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/world-boss-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> WORLD BOSS BATTLE PAGE');
    }
  }

  if (window.location.href.includes('/world-boss-event')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> WORLD BOSS EVENT PAGE');
    }

    processImagesSrcToHidePermanently(worldBossEventSelectorsOfImagesSrcToRemove);
  }

  if (window.location.href.includes('/world-boss-pre-battle')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> WORLD BOSS PRE-BATTLE PAGE');
    }
  }
}

function hideMediasTemporarily() {
  if (DEBUG_LIMIT_ACTIVATED) {
    debugHideTemporarilyLimitCount++;
    if (debugHideTemporarilyLimitCount > 3) {
      DEBUG_ACTIVATED = false;
    }
  }

  if (DEBUG_ACTIVATED) {
    console.log(' ');
    console.log('> ALL PAGES');
  }
  if (window.location.href.includes('/quest/')) {
    processImagesToHideTemporarily(questSelectorsOfImagesToHide);
  }

  if (window.location.href.includes('/activities.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> ACTIVITIES PAGE');
    }
  }

  if (window.location.href.includes('/champions/')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> CHAMPIONS PAGE');
    }

    // processGirlImagesSrcToModify(
    //   championSelectorsOfGirlsSrcToModify,
    //   championSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/characters/')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> CHARACTERS PAGE');
    }

    // processGirlImagesSrcToModify(
    //   charactersSelectorsOfGirlsSrcToModify,
    //   charactersSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/club-champion.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> CLUB CHAMPION PAGE');
    }
    // processGirlImagesSrcToModify(
    //   clubChampionSelectorsOfGirlsSrcToModify,
    //   clubChampionSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/edit-labyrinth-team.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> EDIT LABYRINTH TEAM PAGE');
    }

    // processGirlImagesSrcToModify(
    //   editLabyrinthTeamSelectorsOfGirlsSrcToModify,
    //   editLabyrinthTeamSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/edit-team.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> EDIT TEAM PAGE');
    }

    // processGirlImagesSrcToModify(
    //   editTeamSelectorsOfGirlsSrcToModify,
    //   editTeamSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/edit-world-boss-team.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> EDIT WORLD BOSS TEAM PAGE');
    }

    // processGirlImagesSrcToModify(
    //   editWorldBossTeamSelectorsOfGirlsSrcToModify,
    //   editWorldBossTeamSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/event.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> EVENT PAGE');
    }
  }

  if (window.location.href.includes('/girl/')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> GIRL PAGE');
    }

    // processGirlImagesSrcToModify(
    //   girlSelectorsOfGirlsSrcToModify,
    //   girlSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/home.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> HOME PAGE');
    }
    // processGirlImagesSrcToModify(
    //   homeSelectorsOfGirlsSrcToModify,
    //   homeSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/labyrinth.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH PAGE');
    }

    // processGirlImagesSrcToModify(
    //   labyrinthSelectorsOfGirlsSrcToModify,
    //   labyrinthSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/labyrinth-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH BATTLE PAGE');
    }

    // processGirlImagesSrcToModify(
    //   labyrinthBattleSelectorsOfGirlsSrcToModify,
    //   labyrinthBattleSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/labyrinth-entrance.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH ENTRANCE PAGE');
    }

    // processGirlImagesSrcToModify(
    //   labyrinthEntranceSelectorsOfGirlsSrcToModify,
    //   labyrinthEntranceSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/labyrinth-pool-select.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH POOL SELECT PAGE');
    }

    // processGirlImagesSrcToModify(
    //   labyrinthPoolSelectSelectorsOfGirlsSrcToModify,
    //   labyrinthPoolSelectSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/labyrinth-pre-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH PRE-BATTLE PAGE');
    }

    // processGirlImagesSrcToModify(
    //   labyrinthPreBattleSelectorsOfGirlsSrcToModify,
    //   labyrinthPreBattleSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/league-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LEAGUE BATTLE PAGE');
    }

    // processGirlImagesSrcToModify(
    //   leagueBattleSelectorsOfGirlsSrcToModify,
    //   leagueBattleSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/leagues-pre-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LEAGUE PRE-BATTLE PAGE');
    }

    // processGirlImagesSrcToModify(
    //   leaguePreBattleSelectorsOfGirlsSrcToModify,
    //   leaguePreBattleSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/member-progression.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> MEMBER PROGRESSION PAGE');
    }
  }

  if (window.location.href.includes('/pachinko.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> PACHINKO PAGE');
    }
  }

  if (window.location.href.includes('/pantheon.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> PANTHEON PAGE');
    }

    processImagesSrcToHidePermanently(pantheonSelectorsOfImagesSrcToRemove);
    // processGirlImagesSrcToModify(
    //   pantheonSelectorsOfGirlsSrcToModify,
    //   pantheonSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/pantheon-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> PANTHEON BATTLE PAGE');
    }
    // processGirlImagesSrcToModify(
    //   pantheonBattleSelectorsOfGirlsSrcToModify,
    //   pantheonBattleSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/pantheon-pre-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> PANTHEON PRE-BATTLE PAGE');
    }
    // processGirlImagesSrcToModify(
    //   pantheonPreBattleSelectorsOfGirlsSrcToModify,
    //   pantheonPreBattleSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/season-arena.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> SEASON ARENA PAGE');
    }
    // processGirlImagesSrcToModify(
    //   seasonArenaSelectorsOfGirlsSrcToModify,
    //   seasonArenaSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/season-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> SEASON BATTLE PAGE');
    }
    // processGirlImagesSrcToModify(
    //   seasonBattleSelectorsOfGirlsSrcToModify,
    //   seasonBattleSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/side-quests.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> SIDE QUESTS PAGE');
    }
  }

  if (window.location.href.includes('/teams.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> TEAMS PAGE');
    }
    // processGirlImagesSrcToModify(
    //   teamsSelectorsOfGirlsSrcToModify,
    //   teamsSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/troll-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> TROLL BATTLE PAGE');
    }
    // processGirlImagesSrcToModify(
    //   trollBattleSelectorsOfGirlsSrcToModify,
    //   trollBattleSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/troll-pre-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> TROLL PRE-BATTLE PAGE');
    }
    // processGirlImagesSrcToModify(
    //   trollPreBattleSelectorsOfGirlsSrcToModify,
    //   trollPreBattleSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/world/')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> WORLD PAGE');
    }
  }

  if (window.location.href.includes('/world-boss-battle.html')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> WORLD BOSS BATTLE PAGE');
    }

    // processGirlImagesSrcToModify(
    //   worldBossBattleSelectorsOfGirlsSrcToModify,
    //   worldBossBattleSelectorsOfGirlsIconsSrcToModify,
    // );
  }

  if (window.location.href.includes('/world-boss-event')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> WORLD BOSS EVENT PAGE');
    }
  }

  if (window.location.href.includes('/world-boss-pre-battle')) {
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> WORLD BOSS PRE-BATTLE PAGE');
    }

    // processGirlImagesSrcToModify(
    //   worldBossEventPreBattleSelectorsOfGirlsSrcToModify,
    //   worldBossEventPreBattleSelectorsOfGirlsIconsSrcToModify,
    // );
  }
}

function modifyGirlMedias() {
  if (DEBUG_LIMIT_ACTIVATED) {
    debugModifyLimitCount++;
    if (debugModifyLimitCount > 3) {
      DEBUG_ACTIVATED = false;
    }
  }

  if (window.location.href.includes('/activities.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> ACTIVITIES PAGE');
    }

    processGirlImagesSrcToModify(
      activitiesSelectorsOfGirlsSrcToModify,
      activitiesSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/champions/')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> CHAMPIONS PAGE');
    }

    processGirlImagesSrcToModify(
      championSelectorsOfGirlsSrcToModify,
      championSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/characters/')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> CHARACTERS PAGE');
    }

    processGirlImagesSrcToModify(
      charactersSelectorsOfGirlsSrcToModify,
      charactersSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/club-champion.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> CLUB CHAMPION PAGE');
    }

    processGirlImagesSrcToModify(
      clubChampionSelectorsOfGirlsSrcToModify,
      clubChampionSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/edit-labyrinth-team.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> EDIT LABYRINTH TEAM PAGE');
    }

    processGirlImagesSrcToModify(
      editLabyrinthTeamSelectorsOfGirlsSrcToModify,
      editLabyrinthTeamSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/edit-team.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> EDIT TEAM PAGE');
    }

    processGirlImagesSrcToModify(
      editTeamSelectorsOfGirlsSrcToModify,
      editTeamSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/edit-world-boss-team.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> EDIT WORLD BOSS TEAM PAGE');
    }

    processGirlImagesSrcToModify(
      editWorldBossTeamSelectorsOfGirlsSrcToModify,
      editWorldBossTeamSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/event.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> EVENT PAGE');
    }

    processGirlImagesSrcToModify(
      eventSelectorsOfGirlsSrcToModify,
      eventSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/girl/')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> GIRL PAGE');
    }

    processGirlImagesSrcToModify(
      girlSelectorsOfGirlsSrcToModify,
      girlSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/home.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> HOME PAGE');
    }

    processGirlImagesSrcToModify(
      homeSelectorsOfGirlsSrcToModify,
      homeSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/labyrinth.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH PAGE');
    }

    processGirlImagesSrcToModify(
      labyrinthSelectorsOfGirlsSrcToModify,
      labyrinthSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/labyrinth-battle.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH BATTLE PAGE');
    }

    processGirlImagesSrcToModify(
      labyrinthBattleSelectorsOfGirlsSrcToModify,
      labyrinthBattleSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/labyrinth-entrance.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH ENTRANCE PAGE');
    }

    processGirlImagesSrcToModify(
      labyrinthEntranceSelectorsOfGirlsSrcToModify,
      labyrinthEntranceSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/labyrinth-pool-select.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH POOL SELECT PAGE');
    }

    processGirlImagesSrcToModify(
      labyrinthPoolSelectSelectorsOfGirlsSrcToModify,
      labyrinthPoolSelectSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/labyrinth-pre-battle.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LABYRINTH PRE-BATTLE PAGE');
    }

    processGirlImagesSrcToModify(
      labyrinthPreBattleSelectorsOfGirlsSrcToModify,
      labyrinthPreBattleSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/league-battle.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LEAGUE BATTLE PAGE');
    }

    processGirlImagesSrcToModify(
      leagueBattleSelectorsOfGirlsSrcToModify,
      leagueBattleSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/leagues-pre-battle.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> LEAGUE PRE-BATTLE PAGE');
    }

    processGirlImagesSrcToModify(
      leaguePreBattleSelectorsOfGirlsSrcToModify,
      leaguePreBattleSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/member-progression.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> MEMBER PROGRESSION PAGE');
    }

    processGirlImagesSrcToModify(
      memberProgressionSelectorsOfGirlsSrcToModify,
      memberProgressionSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/pachinko.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> PACHINKO PAGE');
    }

    processGirlImagesSrcToModify(
      pachinkoSelectorsOfGirlsSrcToModify,
      pachinkoSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/pantheon.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> PANTHEON PAGE');
    }

    processGirlImagesSrcToModify(
      pantheonSelectorsOfGirlsSrcToModify,
      pantheonSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/pantheon-battle.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> PANTHEON BATTLE PAGE');
    }

    processGirlImagesSrcToModify(
      pantheonBattleSelectorsOfGirlsSrcToModify,
      pantheonBattleSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/pantheon-pre-battle.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> PANTHEON PRE-BATTLE PAGE');
    }

    processGirlImagesSrcToModify(
      pantheonPreBattleSelectorsOfGirlsSrcToModify,
      pantheonPreBattleSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/season-arena.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> SEASON ARENA PAGE');
    }

    processGirlImagesSrcToModify(
      seasonArenaSelectorsOfGirlsSrcToModify,
      seasonArenaSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/season-battle.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> SEASON BATTLE PAGE');
    }

    processGirlImagesSrcToModify(
      seasonBattleSelectorsOfGirlsSrcToModify,
      seasonBattleSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/side-quests.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> SIDE QUESTS PAGE');
    }

    processGirlImagesSrcToModify(
      sideQuestsSelectorsOfGirlsSrcToModify,
      sideQuestsSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/teams.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> TEAMS PAGE');
    }

    processGirlImagesSrcToModify(
      teamsSelectorsOfGirlsSrcToModify,
      teamsSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/troll-battle.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> TROLL BATTLE PAGE');
    }

    processGirlImagesSrcToModify(
      trollBattleSelectorsOfGirlsSrcToModify,
      trollBattleSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/troll-pre-battle.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> TROLL PRE-BATTLE PAGE');
    }

    processGirlImagesSrcToModify(
      trollPreBattleSelectorsOfGirlsSrcToModify,
      trollPreBattleSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/world/')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> WORLD PAGE');
    }

    processGirlImagesSrcToModify(
      worldSelectorsOfGirlsSrcToModify,
      worldSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/world-boss-battle.html')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> WORLD BOSS BATTLE PAGE');
    }

    processGirlImagesSrcToModify(
      worldBossBattleSelectorsOfGirlsSrcToModify,
      worldBossBattleSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/world-boss-event')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> WORLD BOSS EVENT PAGE');
    }

    processGirlImagesSrcToModify(
      worldBossEventSelectorsOfGirlsSrcToModify,
      worldBossEventSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (window.location.href.includes('/world-boss-pre-battle')) {
    foundMatchingUrl = true;
    if (DEBUG_ACTIVATED) {
      console.log(' ');
      console.log('> WORLD BOSS PRE-BATTLE PAGE');
    }

    processGirlImagesSrcToModify(
      worldBossEventPreBattleSelectorsOfGirlsSrcToModify,
      worldBossEventPreBattleSelectorsOfGirlsIconsSrcToModify,
    );
  }

  if (!foundMatchingUrl) {
    if (DEBUG_ACTIVATED) {
      console.log('> ');
      console.log('> NO MATCHING URL FOUND (killing observer...)');
    }
    killObserver();
  }
}

hideMedias();

// DOM is ready, resources may still be loading
document.addEventListener('DOMContentLoaded', function () {
  if (DEBUG_ACTIVATED) {
    console.log('> ');
    console.log('> DOMContentLoaded');
  }
  hideMediasTemporarily();
  initObserver();
});

// Add event listener for clicks
document.addEventListener('click', function (event) {
  killObserver();
  if (
    event.target.classList.contains('diamond') ||
    event.target.classList.contains('speech_bubble_info_icn') ||
    (event.target.parentElement &&
      event.target.parentElement.classList.contains('eye') &&
      window.location.href.includes('/quest/'))
  ) {
    if (DEBUG_ACTIVATED) {
      console.log('');
      console.log('> SPECIAL BUTTON CLICKED (IMG PROCESSING STOPPED)');
    }
    if (window.location.href.includes('/quest/')) {
      processImagesToShowAgain(questSelectorsOfImagesToHide);
    }
  } else {
    // initObserver();
    modifyGirlMedias();
  }
});

// TODO replace killObserver with resetObserver
// TODO implement count of img processed and compare it with the total number of images (if < then process imgs)
// // Add event listener for scrolling on desktop
// document.addEventListener('wheel', function (event) {
//   killObserver();
//   initObserver();
// });
//
// // Add event listener for scrolling on mobile
// document.addEventListener('touchmove', function (event) {
//   killObserver();
//   initObserver();
// });
