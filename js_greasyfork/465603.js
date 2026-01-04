// ==UserScript==
// @name        🐭️ MouseHunt - Labyrinth HUD Enhancer
// @version     1.1.0
// @description Enhances the Labyrinth HUD in a variety of ways.
// @license     MIT
// @author      brap
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mouse.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/mousehunt-utils@1.6.3/mousehunt-utils.js
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1

// @downloadURL https://update.greasyfork.org/scripts/465603/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Labyrinth%20HUD%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/465603/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Labyrinth%20HUD%20Enhancer.meta.js
// ==/UserScript==
(function () {
  'use strict';
 
  const highlightDoors = () => {
    if ('intersection' !== user?.quests?.QuestLabyrinth?.status) {
      return;
    }
 
    const existingHighlight = document.querySelector('.mh-ui-labyrinth-highlight');
    if (existingHighlight) {
      existingHighlight.classList.remove('mh-ui-labyrinth-highlight');
    }
 
    const clues = user.quests.QuestLabyrinth.clues || [];
    const clue = clues.reduce((a, b) => a.quantity > b.quantity ? a : b);
 
    if (clue) {
      const doors = user.quests.QuestLabyrinth.doors || [];
      const matchingDoors = doors.filter((door) => {
        if (door.choice && door.choice.length) {
          return door.choice.includes(clue.type);
        }
        return false;
      });
      const bestDoor = matchingDoors.reduce((a, b) => a.choice.length > b.choice.length ? a : b);
 
      if (bestDoor) {
        const highlight = document.querySelector(`.labyrinthHUD-door.${bestDoor.css_class.replaceAll(' ', '.')}`);
        if (highlight) {
          highlight.classList.add('mh-ui-labyrinth-highlight');
        }
      }
    }
  };
 
  const main = () => {
    if ('labyrinth' !== getCurrentLocation()) {
      return;
    }
 
    // Always allow gems to be scrambled.
    scrambleGems();
    spinCompass();
 
    const appendTo = document.querySelector('.labyrinthHUD-hallwayDescription');
    if (!appendTo) {
      return;
    }
 
    const existing = document.querySelector('.mh-ui-labyrinth-step-counter');
    if (existing) {
      existing.remove();
    }
 
    const existingStepsToGo = document.querySelector('.mh-ui-labyrinth-steps-to-go');
    if (existingStepsToGo) {
      existingStepsToGo.remove();
    }
 
    const clueProgresses = document.querySelectorAll('.mh-ui-labyrinth-clue-count');
    if (clueProgresses) {
      clueProgresses.forEach((progress) => {
        progress.remove();
      });
    }
 
    // expand the clues bar with count
    const clueProgress = document.querySelectorAll('.labyrinthHUD-clue');
    if (clueProgress) {
      clueProgress.forEach((progress) => {
        const clueType = progress.classList.value.replace('labyrinthHUD-clue', '').replace('clueFound', '').trim();
 
        // check if user.quests.QuestLabyrinth.clues has a clue of this type
        const clues = user.quests.QuestLabyrinth.clues || [];
        const clue = clues.find((c) => c.type === clueType);
        if (clue) {
          progress.setAttribute('title', `${clue.quantity} found`);
          const text = makeElement('span', 'mh-ui-labyrinth-clue-count', `${clue.quantity}`);
          progress.appendChild(text);
        }
      });
    }
 
    if ('inactive' === user?.quests?.QuestLabyrinth?.lantern_status && user?.quests?.QuestLabyrinth?.hallway_tier >= 2) {
      const existingLanternReminder = document.querySelector('.mh-ui-labyrinth-lantern-reminder');
      if (existingLanternReminder) {
        existingLanternReminder.classList.remove('hidden');
      }
 
      const labyHud = document.querySelector('.labyrinthHUD-intersection');
      if (labyHud) {
        const lanternReminer = document.createElement('div');
        lanternReminer.classList.add('mh-ui-labyrinth-lantern-reminder');
        labyHud.appendChild(lanternReminer);
      }
    }
 
    if ('intersection' === user?.quests?.QuestLabyrinth?.status) {
      highlightDoors();
      return;
    }
 
    const hallwayLength = user.quests.QuestLabyrinth.hallway_length || 0;
    const tiles = user.quests.QuestLabyrinth.tiles || [];
    const completed = tiles.filter((tile) => tile.status.includes('complete'));
 
    makeElement('span', 'mh-ui-labyrinth-step-counter', `${completed.length}/${hallwayLength} steps completed.`, appendTo);
    const stepsToGo = hallwayLength - completed.length;
 
    if (stepsToGo !== 0) {
      const intersectionDoors = document.querySelector('.labyrinthHUD-doorContainer');
      if (intersectionDoors) {
        const tilesWithClues = tiles.filter((tile) => tile.status.includes('good'));
        // remove the string 'complete_good_' from each tile and sum the remaining numbers
        const cluesFound = tilesWithClues.reduce((a, b) => a + parseInt(b.status.replace('complete', '').replace('good_', '').trim()), 0);
        const cluesPerTile = (cluesFound / completed.length).toFixed(1).replace('.0', '');
 
        const existingIntersectionText = document.querySelector('.mh-ui-labyrinth-door-text');
        if (existingIntersectionText) {
          existingIntersectionText.remove();
        }
 
        const intersectionText = makeElement('div', 'mh-ui-labyrinth-door-text');
 
        makeElement('div', 'mh-ui-laby-steps', `${stepsToGo} hunt${(stepsToGo) > 1 ? 's' : ''} left in the hallway`, intersectionText);
        if (cluesPerTile !== 'NaN') {
          makeElement('div', 'mh-ui-laby-cpt', `Avg. ${cluesPerTile} clues per hunt`, intersectionText);
        }
 
        intersectionDoors.appendChild(intersectionText);
      }
    }
  };
 
  const scrambleGems = () => {
    const gems = document.querySelectorAll('.labyrinthHUD-scrambleGem');
    if (!gems) {
      return;
    }
 
    // remove the onclick attribute
    gems.forEach((gem) => {
      gem.removeAttribute('onclick');
      gem.addEventListener('click', () => {
        hg.views.HeadsUpDisplayLabyrinthView.labyrinthScrambleGem(gem, 2);
      });
    });
  };

  const spinCompass = () => {
    const container = document.querySelector('.labyrinthHUD');
    if (!container) {
      return;
    }

    const needle = document.createElement('div');
    needle.classList.add('mh-ui-labyrinth-compass-needle');
    container.appendChild(needle);
  };
  
  addStyles(`.mh-ui-labyrinth-step-counter {
    padding-right: 5px;
    margin-left: 5px;
    font-weight: 900;
    background-color: #000;
  }
  
  /* Make the clue counter bigger */
  .labyrinthHUD-clueBar-totalContainer {
    z-index: 10;
    width: auto;
    padding-left: 4px;
    font-size: 12px;
    border-radius: 6px;
  }
  
  .labyrinthHUD-clue {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 10px;
  }
  
  .labyrinthHUD-clue-name {
    overflow: visible;
    text-overflow: unset;
  }
  
  .mh-ui-labyrinth-clue-count {
    padding: 4px;
    color: #050505;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  
  .y .labyrinthHUD-clue-name,
  .y .mh-ui-labyrinth-clue-count {
    background-color: rgb(216 81 255 / 40%);
  }
  
  .h .labyrinthHUD-clue-name,
  .h .mh-ui-labyrinth-clue-count {
    background-color: rgb(33 226 255 / 40%);
  }
  
  .s .labyrinthHUD-clue-name,
  .s .mh-ui-labyrinth-clue-count {
    background-color: rgb(233 99 0 / 40%);
  }
  
  .t .labyrinthHUD-clue-name,
  .t .mh-ui-labyrinth-clue-count {
    background-color: rgb(255 228 0 / 40%);
  }
  
  .f .labyrinthHUD-clue-name,
  .f .mh-ui-labyrinth-clue-count {
    background-color: rgb(17 244 0 / 40%);
  }
  
  .m .labyrinthHUD-clue-name,
  .m .mh-ui-labyrinth-clue-count {
    color: #d3c5c5;
    background-color: rgb(106 106 106 / 40%);
  }
  
  /* Make the quantity counters bigger */
  .labyrinthHUD-item-quantity,
  .labyrinthHUD-scrambleDoors-quantity,
  .labyrinthHUD-scrambleClues-quantity,
  .labyrinthHUD-toggleLantern-quantity.quantity {
    position: absolute;
    top: 6px;
    padding: 0 5px;
    font-size: 11px;
    text-align: center;
    background-color: #000;
    border-radius: 5px;
  }
  
  .labyrinthHUD-item-quantity.quantity {
    top: 6px;
    left: 5px;
    display: block;
    width: 30px;
    margin: 0 !important;
  }
  
  .labyrinthHUD-scrambleDoors-quantity,
  .labyrinthHUD-scrambleClues-quantity,
  .labyrinthHUD-toggleLantern-quantity.quantity {
    display: inline-flex;
    align-items: center;
    width: auto;
    height: 18px;
    margin-right: 11px;
  }
  
  .labyrinthHUD-scrambleClues-quantity.quantity {
    left: -6px;
  }
  
  .labyrinthHUD-toggleLantern-quantity.quantity {
    right: -5px;
  }
  
  .labyrinthHUD-scrambleDoors-quantity.quantity {
    top: 0.5px;
    right: -7px;
    height: 9.5px;
    padding: 4px;
  }
  
  .labyrinthHUD-scrambleClues:hover .labyrinthHUD-scrambleClues-name,
  .labyrinthHUD-scrambleClues.disabled .labyrinthHUD-scrambleClues-name,
  .labyrinthHUD-scrambleClues:focus .labyrinthHUD-scrambleClues-name,
  .labyrinthHUD-scrambleClues-name {
    position: relative;
    color: transparent !important;
    text-shadow: none;
  }
  
  .labyrinthHUD-scrambleClues-name::after {
    position: absolute;
    top: 0;
    right: -30px;
    display: block;
    width: 50px;
    color: #eee;
    text-align: center;
    text-shadow: 0 0 1px #000;
    content: "Compass Magnet";
  }
  
  .labyrinthHUD-item:nth-child(1) .labyrinthHUD-item-name,
  .labyrinthHUD-item:nth-child(2) .labyrinthHUD-item-name,
  .labyrinthHUD-item:nth-child(3) .labyrinthHUD-item-name,
  .labyrinthHUD-item:nth-child(4) .labyrinthHUD-item-name,
  .labyrinthHUD-item:nth-child(5) .labyrinthHUD-item-name {
    width: 96px;
    margin-left: 47px;
    font-size: 11px;
    font-weight: 900;
    text-align: center;
    text-shadow: 0 0 1px #000;
    background: linear-gradient(180deg, rgb(112 112 112 / 0%) 0%, rgb(168 168 168 / 100%) 50%, rgb(112 112 112 / 0%) 100%);
    border-radius: 20px;
  }
  
  .labyrinthHUD-baitWarning {
    z-index: 6;
  }
  
  .labyrinthHUD-item:hover .labyrinthHUD-item-location,
  .labyrinthHUD-item:focus .labyrinthHUD-item-location {
    position: absolute;
    top: unset;
    bottom: -25px;
    padding: 3px;
    font-size: 9px;
    color: #000;
    text-align: center;
    background: #fff;
    border: 2px solid #000;
    border-radius: 10px;
    box-shadow: 2px 3px 4px #666;
  }
  
  /* hunts to go */
  .mh-ui-labyrinth-door-text {
    position: absolute;
    inset: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #fff;
    opacity: 0.8;
  }
  
  .mh-ui-laby-steps {
    margin-bottom: 3px;
    font-size: 13px;
  }
  
  .labyrinthHUD-doorContainer {
    position: relative;
  }
  
  /* hunts to go - door background */
  .labyrinthHUD-door.disabled.mystery {
    filter: brightness(0.4);
  }
  
  /* Highlight the best door */
  .labyrinthHUD-door.mh-ui-labyrinth-highlight {
    filter: brightness(1.3);
  }
  
  .labyrinthHUD-door.mh-ui-labyrinth-highlight::after {
    position: absolute;
    right: 5px;
    bottom: 5px;
    width: 30px;
    height: 30px;
    overflow: hidden;
    content: "";
    background: url(https://www.mousehuntgame.com/images/ui/events/winter_hunt_2013/checkmark.png?asset_cache_version=2) no-repeat 95% 90%;
  }
  
  .labyrinthHUD-confirm-padding .labyrinthHUD-door.mh-ui-labyrinth-highlight::after {
    background: none;
  }
  
  /* Popup summary */
  .labyrinthHUD-clueDrawer {
    padding-bottom: 11px;
    font-size: 11px;
  }
  
  .labyrinthHUD-clueDrawer-description {
    padding: 5px 0 10px;
    line-height: 17px;
    color: #fafafa;
    text-align: center;
  }
  
  .labyrinthHUD-clueDrawer-clue {
    margin: 10px 0;
  }
  
  .labyrinthHUD-clueDrawer-clue.tier-1 .labyrinthHUD-clueDrawer-exit.tier-1::after,
  .labyrinthHUD-clueDrawer-clue.tier-2 .labyrinthHUD-clueDrawer-exit.tier-2::after,
  .labyrinthHUD-clueDrawer-clue.tier-3 .labyrinthHUD-clueDrawer-exit.tier-3::after {
    background: none;
  }
  
  .labyrinthHUD-clueDrawer-exit {
    top: 0;
    bottom: 0;
    width: 1px;
    height: 10px;
    background: #8d8d8d;
    border-radius: 0;
  }
  
  .labyrinthHUD-clueDrawer-bar {
    height: 10px;
  }
  
  .labyrinthHUD-clueDrawer-barFrame {
    margin-right: 3px;
    border: 1px solid #585858;
    border-radius: 0;
  }
  
  .y .labyrinthHUD-clueDrawer-name,
  .y .labyrinthHUD-clueDrawer-quantity {
    border-bottom: 1px solid #d851ff;
  }
  
  .h .labyrinthHUD-clueDrawer-name,
  .h .labyrinthHUD-clueDrawer-quantity {
    border-bottom: 1px solid #21e2ff;
  }
  
  .s .labyrinthHUD-clueDrawer-name,
  .s .labyrinthHUD-clueDrawer-quantity {
    border-bottom: 1px solid #e96300;
  }
  
  .t .labyrinthHUD-clueDrawer-name,
  .t .labyrinthHUD-clueDrawer-quantity {
    border-bottom: 1px solid #ffe400;
  }
  
  .f .labyrinthHUD-clueDrawer-name,
  .f .labyrinthHUD-clueDrawer-quantity {
    border-bottom: 1px solid #11f400;
  }
  
  .labyrinthHUD-clueDrawer-name {
    padding-left: 3px;
    margin-right: -3px;
  }
  
  .labyrinthHUD-clueDrawer-quantity {
    padding-right: 3px;
    margin-left: -3px;
  }
  
  /* retreat button */
  .hudLocationContent a.labyrinthHUD-retreatButton {
    color: #707070 !important;
    background-color: rgb(0 0 0 / 50%);
  }
  
  .hudLocationContent a.labyrinthHUD-retreatButton:hover {
    color: #eee !important;
  }
  
  /* clue count on hover */
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete::after,
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.bad::after,
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.good_1::after,
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.good_2::after,
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.good_3::after,
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.good_4::after,
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.good_5::after,
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.good_6::after {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 15px;
      font-weight: 900;
      color: #000;
      text-align: center;
      text-shadow: 0 0 4px #c7ffad;
      content: "";
  }
  
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete::after {
      color: #0e0e0e;
      text-shadow: none;
      content: "0";
  }
  
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.bad::after {
      color: #c69898;
      text-shadow: none;
      content: "1";
  }
  
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.good_1::after {
      content: "1";
  }
  
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.good_2::after {
      content: "2";
  }
  
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.good_3::after {
      content: "3";
  }
  
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.good_4::after {
      content: "4";
  }
  
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.good_5::after {
      content: "5";
  }
  
  .labyrinthHUD-hallway-padding:hover .labyrinthHUD-hallway-tile.complete.good_6::after {
      content: "6";
  }

  .labyrinthHUD-scrambleGem:hover {
    background: url(https://www.mousehuntgame.com/images/ui/hud/labyrinth/animated_gem.gif?asset_cache_version=2) 0 0;
  }
  
  .mh-ui-labyrinth-lantern-reminder {
    position: absolute;
    bottom: 0;
    left: -8px;
    width: 75px;
    height: 75px;
    background: url(https://www.mousehuntgame.com/images/items/stats/transparent_thumb/d1c4774c7afebe379bef83d30b81f069.png?cv=2) 0 0 no-repeat;
    filter: drop-shadow(1px 0 8px #f6eac3);
    background-size: contain;
    transform-origin: bottom;
    animation: mh-ui-sway-side-to-side .75s;
    animation-iteration-count: 3;
  }

  .mh-ui-labyrinth-compass-needle {
    width: 28px;
    height: 30px;
    position: absolute;
    bottom: 36px;
    left: 141px;
    border-radius: 10px;
  }

  .mh-ui-labyrinth-compass-needle::after {
    position: absolute;
    content: "";
    background: url(https://i.mouse.rip/compass-needle.png) no-repeat;
    width: 10px;
    height: 20px;
    left: 9px;
    top: 5px;
  }

  .mh-ui-labyrinth-compass-needle:hover {
    animation: mh-ui-shake-compass-needle 1s infinite;
  }

  @keyframes mh-ui-shake-compass-needle {
    0% {
      transform: rotate(0deg);
    }

    25% {
      transform: rotate(-45deg);
    }

    75% {
      transform: rotate(45deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }
  
  @keyframes mh-ui-sway-side-to-side {
    0% {
      transform: rotate(0deg);
    }
  
    25% {
      transform: rotate(-5deg);
    }
  
    75% {
      transform: rotate(5deg);
    }
  
    100% {
      transform: rotate(0deg);
    }
  }`)
 
  main();
 
  onAjaxRequest(main);
  onPageChange({ camp: { show: main } });
  onAjaxRequest(() => {
    setTimeout(main, 500);
  }, 'managers/ajax/turns/activeturn.php', true);

  migrateUserscript('🐭️ MouseHunt - Labyrinth HUD Enhancer', 'https://greasyfork.org/en/scripts/465603-mousehunt-labyrinth-hud-enhancer');
}());