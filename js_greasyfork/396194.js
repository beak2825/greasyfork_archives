// ==UserScript==
// @name         Hordes UI Mod & Party Selector
// @version      1.3.3
// @description  Various UI mods for Hordes.io. & Party Selector
// @author       Sakaiyo & Chandog#6373 & Cullen & Pulsaqui
// @match        https://hordes.io/play
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/160017
// @downloadURL https://update.greasyfork.org/scripts/396194/Hordes%20UI%20Mod%20%20Party%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/396194/Hordes%20UI%20Mod%20%20Party%20Selector.meta.js
// ==/UserScript==

GM_addStyle(`.uimod-skill-tooltip {
  width: 260px;
  position: fixed;
  display: none; }
  .uimod-skill-tooltip .description {
    /* Mirrors color of normal tooltip description */
    color: #5b858e; }
  .uimod-skill-tooltip .uimod-skill-tooltip-text {
    color: white; }
/* Custom chat context menu, invisible by default */
.js-chat-context-menu {
  display: none; }

.js-chat-context-menu .name {
  color: white;
  padding: 2px 4px; }

/* Allow names in chat to be clicked (textf1 = BL, textf0 = VG) */
#chat .name,
.textwhisper .textf1,
.textwhisper .textf0 {
  pointer-events: all !important; }
/* Custom chat filter colors */
.js-chat-gm {
  color: #a6dcd5; }

/* Class that hides chat lines */
.js-line-hidden,
.js-line-blocked {
  display: none; }
/* Custom chat tabs */
.uimod-chat-tabs {
  position: fixed;
  margin-top: -22px;
  left: 5px;
  pointer-events: all;
  color: #5b858e;
  font-size: 12px;
  font-weight: bold; }

.uimod-chat-tabs > div {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.4);
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  display: inline-block;
  border: 1px black solid;
  border-bottom: 0;
  margin-right: 2px;
  padding: 3px 5px; }

.uimod-chat-tabs > div:not(.js-selected-tab):hover {
  border-color: #aaa; }

.uimod-chat-tabs > .js-selected-tab {
  color: #fff; }

/* Chat tab custom config */
.uimod-chat-tab-config {
  position: absolute;
  z-index: 9999999;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 3px;
  text-align: center;
  padding: 8px 12px 8px 6px;
  width: 175px;
  font-size: 14px;
  border: 1px solid black;
  display: none; }

.uimod-chat-tab-config-grid {
  grid-template-columns: 35% 65%;
  display: grid;
  grid-gap: 6px;
  align-items: center; }

.uimod-chat-tab-config h1 {
  font-size: 16px;
  margin-top: 0; }

.uimod-chat-tab-config .btn,
.uimod-chat-tab-config input {
  font-size: 12px; }
/* Lazy way to get tables to display side by side, given they share their container with various other elements */
.uimod-clan-lastseen-table {
  float: right;
  width: 25%;
  /* Make the last seen table look like its part of the main clan members table */
  position: relative;
  right: 1px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0; }
  .uimod-clan-lastseen-table tr.js-offline-member {
    opacity: 0.5; }

.uimod-clan-members-table {
  float: left;
  width: 75%; }
/* Custom css for settings page, duplicates preexisting settings pane grid */
.uimod-settings {
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-gap: 8px;
  align-items: center;
  max-height: 390px;
  margin: 0 20px;
  overflow-y: auto; }
/* Allows windows and frames to be moved */
.window,
.partyframes,
#ufplayer,
#uftarget,
#skillbar,
.js-map {
  position: relative; }

/* Retaining the default party frame with so we can override the "style" property */
.partyframes {
  width: 200px; }

/* All purpose hidden class */
.js-hidden {
  display: none; }
/* Friends list CSS, similar to settings but supports 4 columns */
.uimod-friends {
  display: grid;
  grid-template-columns: 2fr 1.1fr 1.5fr 0.33fr 3fr;
  grid-gap: 8px;
  align-items: center;
  max-height: 390px;
  margin: 0 20px;
  overflow-y: auto; }

/* Helps imitate normal UI window */
.uimod-friends-list-helper.titleframe {
  line-height: 1em;
  display: flex;
  align-items: start;
  position: relative;
  letter-spacing: 0.5px;
  margin-top: 8px; }

.uimod-friends-list-helper.titleicon {
  margin: 3px; }

.uimod-friends-list-helper.title {
  width: 100%;
  padding-left: 4px;
  font-weight: bold; }

.uimod-friends-intro {
  width: 100%;
  margin: 4px 0 14px;
  text-align: center;
  border-bottom: 2px solid #999;
  padding-bottom: 6px;
  font-weight: bold;
  user-select: none; }
.uimod-locked-slot {
  pointer-events: all;
  z-index: 10;
  background: rgba(255, 0, 0, 0.4);
  position: absolute;
  width: 46px;
  height: 46px; }
.js-map-btns {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 999;
  width: 100px;
  height: 100px;
  text-align: right;
  display: none;
  pointer-events: all; }

.js-map-btns:hover {
  display: block; }

.js-map-btns button {
  border-radius: 10px;
  font-size: 18px;
  padding: 0 5px;
  background: rgba(0, 0, 0, 0.4);
  border: 0;
  color: white;
  font-weight: bold;
  cursor: pointer; }

/* On hover of map, show opacity controls */
.js-map:hover .js-map-btns {
  display: block; }
/* Mirror styles of other merchant inputs */
.uidom-merchant-input {
  margin: 4px 0;
  align-self: center; }

/* Add 225px column for new filters input */
.uidom-merchant-with-filters .search {
  grid-template-columns: 120px auto 50px auto 50px 225px 1fr auto auto; }
.js-chat-resize {
  resize: both;
  overflow: auto; }
.js-map {
  /* This makes sure scroll bars don't appear when resizing the map */
  overflow: hidden; }

.js-map-resize:hover {
  resize: both;
  overflow: auto;
  direction: rtl; }
/* Screenshot Mod Warning CSS. Similar to the warning you get in chrome when entering full-screen since that's familiar and positioned to be below full-screen warning */
.uimod-screenshot-warning {
  margin: auto;
  display: block;
  text-align: center;
  margin-top: 100px;
  width: 250px;
  padding: 13px;
  color: #fff;
  background: rgba(39, 41, 45, 0.74); }

.uimod-screenshot-warning-container {
  width: 100%;
  position: absolute; }

/* Applied to warning after a short delay to fadeout */
.uimod-screenshot-warning-fadeout {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 1s, opacity 1s linear; }
/* Allows last clicked window to appear above all other windows */
.js-is-top {
  z-index: 9998 !important; }

.panel.context:not(.commandlist) {
  z-index: 9999 !important; }

/* The item icon being dragged in the inventory */
.container.svelte-120o2pb {
  z-index: 9999 !important; }
.js-cooldown-num {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 40px;
  text-align: center;
  font-weight: bold;
  color: white;
  pointer-events: none; }
.container.uimod-xpmeter-1 {
  z-index: 6; }

.window.uimod-xpmeter-2 {
  padding: 5px;
  height: 100%;
  display: grid;
  grid-template-rows: 30px 1fr;
  grid-gap: 4px;
  transform-origin: inherit;
  min-width: fit-content; }

.titleframe.uimod-xpmeter-2 {
  line-height: 1em;
  display: flex;
  align-items: center;
  position: relative;
  letter-spacing: 0.5px; }

.titleicon.uimod-xpmeter-2 {
  margin: 3px; }

.title.uimod-xpmeter-2 {
  width: 100%;
  padding-left: 4px;
  font-weight: bold; }

.slot.uimod-xpmeter-2 {
  min-height: 0; }

.wrapper.uimod-xpmeter-1 {
  width: 200px; }

.bar.uimod-xpmeter-3 {
  background-color: rgba(45, 66, 71, 0.7);
  border-radius: 1.5px;
  position: relative;
  color: #DAE8EA;
  overflow: hidden;
  text-shadow: 1px 1px 2px #10131d;
  white-space: nowrap;
  text-transform: capitalize;
  font-weight: bold; }

.buttons.uimod-xpmeter-1 {
  line-height: 1;
  font-size: 13px; }

.left.uimod-xpmeter-3 {
  padding-left: 4px;
  position: relative;
  z-index: 1; }

.right.uimod-xpmeter-3 {
  position: absolute;
  right: 7px;
  z-index: 1; }
/* This file is for CSS mods that don't fit in any other individual mod folder */
/* Transparent chat bg color */
.frame.svelte-1vrlsr3 {
  background: rgba(0, 0, 0, 0.4); }

/* Our mod's chat message color */
.textuimod {
  color: #00dd33; }

/* The browser resize icon */
*::-webkit-resizer {
  background: linear-gradient(to right, rgba(51, 77, 80, 0), rgba(203, 202, 165, 0.5));
  border-radius: 8px;
  box-shadow: 0 1px 1px black; }

*::-moz-resizer {
  background: linear-gradient(to right, rgba(51, 77, 80, 0), rgba(203, 202, 165, 0.5));
  border-radius: 8px;
  box-shadow: 0 1px 1px black; }

/* Our custom window, closely mirrors main settings window */
.uimod-custom-window {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translate(-50%, 0);
  min-width: 350px;
  max-width: 600px;
  width: 90%;
  height: 80%;
  min-height: 350px;
  max-height: 500px;
  z-index: 9;
  padding: 0px 10px 5px; }
`);

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _mods = _interopRequireDefault(require("./mods"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initialize() {
  // If the Hordes.io tab isn't active for long enough, it reloads the entire page, clearing this mod
  // We check for that and reinitialize the mod if that happens
  const $layout = document.querySelector('.layout');

  if ($layout.classList.contains('uimod-initd')) {
    return;
  }

  $layout.classList.add('uimod-initd');
  const rerunning = {
    // MutationObserver running whenever .layout changes
    onDomChange: [],
    // Mutation observer running whenever #chat changes
    onChatChange: [],
    // `click` Event listener running on document.body
    onLeftClick: [],
    // `contextmenu` Event listener running on document.body
    onRightClick: []
  }; // Run all our mods

  const registerOnDomChange = callback => rerunning.onDomChange.push(callback);

  const registerOnChatChange = callback => rerunning.onChatChange.push(callback);

  const registerOnLeftClick = callback => rerunning.onLeftClick.push(callback);

  const registerOnRightClick = callback => rerunning.onRightClick.push(callback);

  _mods.default.forEach(mod => {
    mod.run({
      registerOnDomChange,
      registerOnChatChange,
      registerOnLeftClick,
      registerOnRightClick
    });
  }); // Continuously re-run specific mods methods that need to be executed on UI change


  const rerunObserver = new MutationObserver(mutations => {
    // If new window appears, e.g. even if window is closed and reopened, we need to rewire it
    // Fun fact: Some windows always exist in the DOM, even when hidden, e.g. Inventory
    // 		     But some windows only exist in the DOM when open, e.g. Interaction
    rerunning.onDomChange.forEach(callback => callback(mutations));
  });
  Array.from(document.querySelectorAll('.layout > .container, .actionbarcontainer, .partyframes, .targetframes')).forEach($container => {
    rerunObserver.observe($container, {
      attributes: false,
      childList: true
    });
  }); // Rerun only on chat messages changing

  const chatRerunObserver = new MutationObserver(mutations => {
    rerunning.onChatChange.forEach(callback => callback(mutations));
  });
  chatRerunObserver.observe(document.querySelector('#chat'), {
    attributes: false,
    childList: true
  }); // Event listeners for document.body might be kept when the game reloads, so don't reinitialize them

  if (!document.body.classList.contains('js-uimod-initd')) {
    document.body.classList.add('js-uimod-initd');
    rerunning.onLeftClick.forEach(callback => document.body.addEventListener('click', callback));
    rerunning.onRightClick.forEach(callback => document.body.addEventListener('contextmenu', callback));
  }
} // Initialize mods once UI DOM has loaded
// Rerunning updates on every call to initialize


const pageObserver = new MutationObserver(() => {
  const isUiLoaded = !!document.querySelector('.layout');

  if (isUiLoaded) {
    initialize();
  }
});
pageObserver.observe(document.body, {
  attributes: true,
  childList: true
});

},{"./mods":20}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = require("../../utils/state");

// Note: For a split second after these event handlers are added,
// They may not actually be listening.
// e.g. Refresh page with inventory open, immediately control+right click item
//      to copy its stats. It won't work because `keydown` didn't register the keydown event yet
// Doesn't look like there's anything we can do about it, just something to keep in mind.
function keyPressTracker() {
  const tempState = (0, _state.getTempState)();
  window.addEventListener('keydown', keyEvent => {
    if (keyEvent.key === 'Control') {
      tempState.keyModifiers.control = true;
    } else if (keyEvent.key === 'Alt') {
      tempState.keyModifiers.alt = true;
    } else if (keyEvent.key === 'Shift') {
      // Shouldn't set keyModifiers.shift if we're programatically doing it while getting tooltip content
      // tempState.gettingTooltipContentShiftPress should only be `true` if user already isn't pressing shift
      // See game.js `getTooltipContent` for more details
      if (tempState.gettingTooltipContentShiftPress) {
        return;
      }

      tempState.keyModifiers.shift = true;
    }
  });
  window.addEventListener('keyup', keyEvent => {
    if (keyEvent.key === 'Control') {
      tempState.keyModifiers.control = false;
    } else if (keyEvent.key === 'Alt') {
      tempState.keyModifiers.alt = false;
    } else if (keyEvent.key === 'Shift') {
      tempState.keyModifiers.shift = false;
    }
  }); // If page ever regains focus, e.g. tabbing back in after tabbing out, make sure we reset our modifiers.
  // This prevents things like holding control, leaving the tab without releasing it, then coming back in and
  // the game will think you are still holding it, even if you're not.

  window.addEventListener('focus', () => {
    tempState.keyModifiers.control = false;
    tempState.keyModifiers.alt = false;
    tempState.keyModifiers.shift = false;
  });
}

var _default = {
  name: '[REQUIRED] Key press tracker',
  description: 'Identifies when you are pressing Ctrl/etc key modifiers, which is used by some other mods',
  run: keyPressTracker
};
exports.default = _default;

},{"../../utils/state":42}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var chat = _interopRequireWildcard(require("../../utils/chat"));

var _version = require("../../utils/version");

var _state = require("../../utils/state");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function modStart() {
  chat.addChatMessage(`Hordes UI Mod & Party Selector 2.1.2 is now running.`);
  (0, _state.loadState)();
  document.onkeydown = function(evt){
          evt = evt || window.event;
          
          if(evt.shiftKey && evt.keyCode!=16){
          switch (evt.keyCode){
              case 49: //1
              document.getElementsByClassName("partyframes svelte-1xmlhk")[0].children[0].click();
                  break;
              case 50: //2
              document.getElementsByClassName("partyframes svelte-1xmlhk")[0].children[1].click();
                  break;   
              case 51: //3
              document.getElementsByClassName("partyframes svelte-1xmlhk")[0].children[2].click();
                  break;   
              case 52: //4
              document.getElementsByClassName("partyframes svelte-1xmlhk")[0].children[3].click();
                  break;   
              case 53: //5
              document.getElementsByClassName("partyframes svelte-1xmlhk")[0].children[4].click();
                  break;   
              case 54: //6
              document.getElementsByClassName("partyframes svelte-1xmlhk")[0].children[5].click();
                  break;  
              case 55: //7
              document.getElementsByClassName("partyframes svelte-1xmlhk")[0].children[6].click();
                  break;  
              case 56: //8
              document.getElementsByClassName("partyframes svelte-1xmlhk")[0].children[7].click();
                  break;  
              case 57: //9
              document.getElementsByClassName("partyframes svelte-1xmlhk")[0].children[8].click();
                  break;  
              case 58: //10
              document.getElementsByClassName("partyframes svelte-1xmlhk")[0].children[9].click();
                  break;  
              case 48: //0
              document.getElementsByClassName("partyframes svelte-1xmlhk")[0].children[9].click();
                  break;  
          }
        }
      };
}

  
var _default = {
  name: '[REQUIRED] UI Mod Startup',
  description: 'Do not remove this! This displays a welcome message, loads saved state, and includes misc styles.',
  run: modStart
};
exports.default = _default;

},{"../../utils/chat":38,"../../utils/state":42,"../../utils/version":44}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleBuffTooltipDisplay = handleBuffTooltipDisplay;
exports.removeBuffTooltip = removeBuffTooltip;

var _skills = _interopRequireDefault(require("./skills"));

var _misc = require("../../utils/misc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getSkillId(url) {
  const regex = new RegExp('skills/([a-zA-Z0-9]+).');
  const matches = url.match(regex);
  return Array.isArray(matches) ? matches[1] : null;
}

function _addBuffTooltip(mouseEvent, $buff) {
  const $skillImg = $buff.querySelector('img');
  if (!$skillImg) return;

  const skillId = _getSkillId($skillImg.getAttribute('src'));

  if (!skillId) return;
  const $buffTooltip = document.querySelector('.js-skill-tooltip');
  const skillData = _skills.default[skillId]; // This shouldn't happen, but just in case it does, don't show the buff tooltip

  if (!skillData) return;
  $buffTooltip.querySelector('.js-tooltip-name').textContent = skillData.name;
  $buffTooltip.querySelector('.js-tooltip-desc').textContent = skillData.description; // Reset current tooltip stats and add current skill's stats

  const $tooltipStats = $buffTooltip.querySelector('.js-tooltip-stats');
  $tooltipStats.innerHTML = '';

  if (skillData.stats) {
    $tooltipStats.style.display = 'block';
    $buffTooltip.querySelector('.js-buff-tooltip-effects').style.display = 'block';
    skillData.stats.forEach(statText => {
      $tooltipStats.appendChild((0, _misc.makeElement)({
        element: 'div',
        class: 'textgreen',
        content: statText
      }));
    });
  } else {
    $tooltipStats.style.display = 'none';
    $buffTooltip.querySelector('.js-buff-tooltip-effects').style.display = 'none';
  } // Make tooltip visible near mouse


  $buffTooltip.setAttribute('style', `left: ${mouseEvent.pageX}px; top: ${mouseEvent.pageY - 50}px; display: block;`);
}

function removeBuffTooltip() {
  const $buffTooltip = document.querySelector('.js-skill-tooltip');

  if ($buffTooltip) {
    $buffTooltip.style.display = 'none';
  }
}

function handleBuffTooltipDisplay(mouseEvent, $buff) {
  const $elementMouseIsOver = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY); // If mouse is over cooldown overlay or icon image of buff icon

  if ($elementMouseIsOver.classList.contains('cd') || $elementMouseIsOver.classList.contains('icon')) {
    // If there is no $buff but we are over the buff icon, then this is the document.body
    // removeBuffTooltip handler, so we don't want to add the buff tooltip
    // TODO: Consider cleaning up this logic
    if ($buff) _addBuffTooltip(mouseEvent, $buff);
  } else {
    removeBuffTooltip();
  }
}

},{"../../utils/misc":40,"./skills":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helpers = require("./helpers");

var _misc = require("../../utils/misc");

function createBuffTooltip() {
  if (document.querySelector('.js-skill-tooltip')) return;
  const buffTooltipHTML = `
        <div class="container js-tooltip-content">
            <div class="slottitle textblue js-tooltip-name"></div>
            <div class="description js-tooltip-desc"></div>
            <div class="uimod-skill-tooltip-text js-buff-tooltip-effects">Effects:</div>
            <div class="js-tooltip-stats"></div>
        </div>
    `;
  const $buffTooltip = (0, _misc.makeElement)({
    element: 'div',
    class: 'border blue slotdescription uimod-skill-tooltip js-skill-tooltip',
    content: buffTooltipHTML
  });
  document.querySelector('.layout').appendChild($buffTooltip); // Hide the buff tooltip if we mouse over something that isn't the buff icon
  // Helps handle edge cases where the buff tooltip doesn't hide when it should

  document.body.addEventListener('mousemove', _helpers.handleBuffTooltipDisplay);
} // Add observers to every buff array, so we can track skills and add buff tooltip handlers when they appear


function buffTooltips() {
  const $buffArrays = Array.from(document.querySelectorAll('.buffarray:not(.js-buffarray-initd)'));
  $buffArrays.forEach($buffArray => {
    $buffArray.classList.add('js-buffarray-initd');
    const buffArrayObserver = new MutationObserver(() => {
      const $buffs = Array.from($buffArray.querySelectorAll('.slot:not(.js-buff-tooltip-initd)'));
      $buffs.forEach($buff => {
        $buff.classList.add('js-buff-tooltip-initd'); // Handle deleting tooltip either on mouseleave or on mousemove outside of the .buffarray
        // Being this comprehensive helps ensure the tooltip doesn't accidentally stay visible inappropriately

        $buff.parentNode.addEventListener('mousemove', event => (0, _helpers.handleBuffTooltipDisplay)(event, $buff));
        $buff.addEventListener('mouseleave', _helpers.removeBuffTooltip);
      });
    });
    buffArrayObserver.observe($buffArray, {
      childList: true,
      attributes: false
    });
  });
} // TODO BUGFIX: After buffing yourself, selecting yourself and hovering the buff tooltip sometimes doesnt show the tooltip


var _default = {
  name: 'Buff Tooltips',
  description: 'In a tooltip, shows a basic description of the buff that you are hovering over.',
  run: ({
    registerOnDomChange
  }) => {
    createBuffTooltip();
    buffTooltips();
    registerOnDomChange(buffTooltips);
  }
};
exports.default = _default;

},{"../../utils/misc":40,"./helpers":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// Source: https://hordes.io/info/skills
var _default = {
  // Warrior
  21: {
    name: 'Armor Reinforcement',
    description: 'Passively increase your Defense.',
    stats: ['+ Defense', '+ Increased Aggro Generation']
  },
  2: {
    name: 'Bulwark',
    description: 'Increase your block chance, while raising your damage for each successful block.',
    stats: ['+ Block'],
    notes: ['Stackable buff on block']
  },
  18: {
    name: 'Centrifugal Laceration',
    description: 'Your Crescent Swipe lacerates enemies, causing them to bleed for additional Damage.',
    notes: ['x% as additional damage over 10 seconds']
  },
  33: {
    name: 'Charge',
    description: 'Charge towards your target while also stunning it. Stun duration increases with charge distance.'
  },
  20: {
    name: "Crusader's Courage",
    description: 'You and your party members gain additional Defense.',
    stats: ['+ Defense']
  },
  17: {
    name: 'Colossal Reconstruction',
    description: 'While active you are healed each time you block an attack.'
  },
  19: {
    name: 'Unholy Warcry',
    description: 'You and your party members deal additional Damage.',
    stats: ['+ Min Dmg', '+ Max Dmg']
  },
  18: {
    // This is the effect triggered by Centrifugal Laceration
    name: 'Bleed',
    description: 'Crescent Swipe lacerates enemies, causing them to bleed for additional Damage.',
    stats: ['x% as additional damage over 10 seconds']
  },
  buffBlock: {
    name: 'Block',
    description: "Blocks the damage from an enemy's attack."
  },
  // Mage
  4: {
    name: 'Frost Bolt',
    description: 'Freezes targets for up to 4 stacks, at which they will be stunned and take 50% increased damage.'
  },
  14: {
    name: 'Chilling Radiance',
    description: 'Emit a chilling shockwave of ice around you, damaging and freezing enemies. Increases the critical hit chance of some of your spells.',
    stats: ['Empower Crit% of Ice bolt', 'Empower Crit% of Icicle Orb', '+100 % Movement Spd. Reduction']
  },
  23: {
    name: 'Ice Shield',
    description: 'Protects you against the next incoming attacks.',
    stats: ['# attacks blocked']
  },
  16: {
    name: 'Hypothermic Frenzy',
    description: 'You gain Haste and all your damage output is increased.',
    stats: ['+ Haste', '+ Increased Dmg']
  },
  24: {
    name: 'Enchantment',
    description: 'Increase your targets Damage.',
    stats: ['+ Min Dmg', '+ Max Dmg']
  },
  22: {
    name: 'Arctic Aura',
    description: 'You and your party members gain additional Crit%.',
    stats: ['+ Critical']
  },
  frozenBuff: {
    name: 'Frozen',
    description: 'Freezes targets for up to 4 stacks, at which they will be stunned and take 50% increased damage.'
  },
  // Archer
  10: {
    name: 'Serpent Arrows',
    description: 'Your Precise Shots will jump to additional targets while active.',
    stats: ['# Jumps', '##% damage per Jump']
  },
  11: {
    name: 'Invigorate',
    description: 'Instantly recovers MP and increases your damage temporarily.',
    stats: ['+ Increased damage']
  },
  29: {
    name: 'Poison Arrows',
    description: 'Your Precise Shot applies a poisonous Debuff on hit, damaging and slowing your enemies.',
    stats: ['###% per stack as additional damage over 10 seconds']
  },
  27: {
    name: 'Pathfinding',
    description: 'You and your party members gain additional Movement Speed.',
    stats: ['+ Move Spd']
  },
  26: {
    name: 'Cranial Punctures',
    description: 'Passively increase your Crit%.',
    stats: ['+ Critical']
  },
  25: {
    name: 'Temporal Dilation',
    description: 'You and your party members gain additional Haste.',
    stats: ['+ Haste']
  },
  31: {
    // Technically this is an effect brought on by Precise Shot
    name: 'Swift Shot',
    description: 'Increases the damage of your next Swift Shots and allows them to be cast instantly.'
  },
  38: {
    name: 'Dash',
    description: 'You dash into your current direction, instantly resetting the cooldown of Precise Shot. Your next Precise Shot is an instant cast.'
  },
  // Shaman
  // TODO: Figure out what the post-summon speed buff icon URL
  12: {
    name: 'Decay',
    description: 'Curse your enemy with a spell of decay, dealing damage over time.',
    stats: ['DMG', '+ Movement Spd. Reduction']
  },
  7: {
    name: 'Revitalize',
    description: 'Heal a friendly target over a short duration, stacking up to 3 times while also increasing the power of your Mend.',
    stats: ['Heal']
  },
  13: {
    name: "Mimir's Well",
    description: 'You and your party members quickly regenerate mana over a short period of time.',
    stats: ['MP recovered']
  },
  36: {
    name: 'Spirit Animal',
    description: 'Turn into your spirit animal for additional movementspeed.',
    stats: ['+ Move Spd']
  },
  28: {
    name: 'Canine Howl',
    description: 'You and your entire party enrages with haste, causing you to attack faster.',
    stats: ['+ Haste']
  },
  37: {
    name: 'Agonize',
    description: 'Turns your target into a zombie, interrupting all actions, slowing it down, and reducing received healing for the duration.',
    stats: ['Movement Spd. Reduction', 'Healing Reduction']
  },
  30: {
    name: 'Healing Totem',
    description: 'Place a totem on the ground healing your entire party.',
    stats: ['Heal']
  },
  // Other
  39: {
    name: 'Mount Riding',
    description: 'Allows you to ride ground mounts',
    stats: ['+60 Move Spd']
  },
  potionMp: {
    name: 'MP Potion',
    stats: ['MP Recovered']
  },
  potionhp: {
    name: 'HP Potion',
    stats: ['HP Recovered']
  },
  dazedBuff: {
    name: 'Dazed',
    description: 'When you are hit from behind, you can be dazed. This slows your movement speed and dismounts you.',
    stats: ['Movement Spd. Reduction']
  }
};
exports.default = _default;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showChatContextMenu = showChatContextMenu;

var _state = require("../../utils/state");

// Makes chat context menu visible and appear under the mouse
function showChatContextMenu(name, mousePos) {
  const state = (0, _state.getState)(); // Right before we show the context menu, we want to handle showing/hiding Friend/Unfriend

  const $contextMenu = document.querySelector('.js-chat-context-menu');
  $contextMenu.querySelector('[name="friend"]').classList.toggle('js-hidden', !!state.friendsList[name]);
  $contextMenu.querySelector('[name="unfriend"]').classList.toggle('js-hidden', !state.friendsList[name]);
  $contextMenu.querySelector('.js-name').textContent = name;
  $contextMenu.setAttribute('style', `display: block; left: ${mousePos.x}px; top: ${mousePos.y}px;`);
}

},{"../../utils/state":42}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = require("../../utils/state");

var _misc = require("../../utils/misc");

var helpers = _interopRequireWildcard(require("./helpers"));

var chat = _interopRequireWildcard(require("../../utils/chat"));

var player = _interopRequireWildcard(require("../../utils/player"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// This creates the initial chat context menu DOM (which starts as hidden)
function createChatContextMenu() {
  const tempState = (0, _state.getTempState)();

  if (document.querySelector('.js-chat-context-menu')) {
    return;
  }

  let contextMenuHTML = `
        <div class="js-name">...</div>
        <div class="choice" name="party">Party invite</div>
        <div class="choice" name="whisper">Whisper</div>
        <div class="choice" name="friend">Friend</div>
		<div class="choice" name="unfriend">Unfriend</div>
		<div class="choice" name="copy">Copy name</div>
        <div class="choice" name="block">Block</div>
    `;
  document.body.appendChild((0, _misc.makeElement)({
    element: 'div',
    class: 'panel context border grey js-chat-context-menu',
    content: contextMenuHTML
  }));
  const $chatContextMenu = document.querySelector('.js-chat-context-menu');
  $chatContextMenu.querySelector('[name="party"]').addEventListener('click', () => {
    chat.partyPlayer(tempState.chatName);
  });
  $chatContextMenu.querySelector('[name="whisper"]').addEventListener('click', () => {
    chat.whisperPlayer(tempState.chatName);
  });
  $chatContextMenu.querySelector('[name="friend"]').addEventListener('click', () => {
    player.friendPlayer(tempState.chatName);
  });
  $chatContextMenu.querySelector('[name="unfriend"]').addEventListener('click', () => {
    player.unfriendPlayer(tempState.chatName);
  });
  $chatContextMenu.querySelector('[name="copy"]').addEventListener('click', () => {
    navigator.clipboard.writeText(tempState.chatName);
  });
  $chatContextMenu.querySelector('[name="block"]').addEventListener('click', () => {
    player.blockPlayer(tempState.chatName);
  });
} // This opens a context menu when you click a user's name in chat


function chatContextMenu() {
  const tempState = (0, _state.getTempState)();

  const addContextMenu = ($name, name) => {
    $name.classList.add('js-is-context-menu-initd'); // Add name to element so we can target it in CSS, e.g. when filtering chat for block list

    $name.setAttribute('data-chat-name', name);

    const showContextMenu = clickEvent => {
      // TODO: Is there a way to pass the name to showChatContextMenumethod, instead of storing in tempState?
      tempState.chatName = name;
      helpers.showChatContextMenu(name, {
        x: clickEvent.pageX,
        y: clickEvent.pageY
      });
    };

    $name.addEventListener('click', showContextMenu); // Left click

    $name.addEventListener('contextmenu', showContextMenu); // Right click works too
  };

  Array.from(document.querySelectorAll('#chat .name:not(.js-is-context-menu-initd)')).forEach($name => {
    addContextMenu($name, $name.textContent);
  }); // `textf0` is the VG faction, `textf1` is the BL faction - we want to support both with our whisper context menu

  Array.from(document.querySelectorAll('.textwhisper .textf1:not(.js-is-context-menu-initd), .textwhisper .textf0:not(.js-is-context-menu-initd)')).forEach($whisperName => {
    // $whisperName's textContent is "to [name]" or "from [name]", so we cut off the first word
    let name = $whisperName.textContent.split(' ');
    name.shift(); // Remove the first word

    name = name.join(' ');
    addContextMenu($whisperName, name);
  });
} // Close chat context menu if clicking outside of it


function closeChatContextMenu(clickEvent) {
  const $target = clickEvent.target; // If clicking on name or directly on context menu, don't close it
  // Still closes if clicking on context menu item

  if ($target.classList.contains('js-is-context-menu-initd') || $target.classList.contains('js-chat-context-menu')) {
    return;
  }

  const $contextMenu = document.querySelector('.js-chat-context-menu');
  $contextMenu.style.display = 'none';
}

var _default = {
  name: 'Chat Context Menu',
  description: 'Displays a menu when you click on a player, allowing you to whisper/party/friend/block them',
  run: ({
    registerOnLeftClick,
    registerOnChatChange
  }) => {
    createChatContextMenu();
    chatContextMenu(); // When we click anywhere on the page outside of our chat context menu, we want to close the menu

    registerOnLeftClick(closeChatContextMenu); // Register event listeners for each name when a new chat message appears

    registerOnChatChange(chatContextMenu);
  }
};
exports.default = _default;

},{"../../utils/chat":38,"../../utils/misc":40,"../../utils/player":41,"../../utils/state":42,"./helpers":7}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var chat = _interopRequireWildcard(require("../../utils/chat"));

var _state = require("../../utils/state");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Remove GM chat filter state for users of v1.2.5 and prior
function removeGmChatFilter() {
  const state = (0, _state.getState)();
  let stateUpdated = false;
  state.chatTabs = state.chatTabs.map(chatTabState => {
    if (!chatTabState) return chatTabState;

    if (chatTabState.filters && chatTabState.filters.hasOwnProperty('GM')) {
      delete chatTabState.filters.GM;
      stateUpdated = true;
    }

    return chatTabState;
  });

  if (state.chat) {
    delete state.chat;
    stateUpdated = true;
  }

  if (stateUpdated) (0, _state.saveState)();
}

var _default = {
  name: 'Chat filters',
  description: "Filters all chat, e.g. ensuring blocked users' messages are not visible in chat.",
  run: ({
    registerOnChatChange
  }) => {
    removeGmChatFilter(); // Whenever chat changes, we want to filter it

    registerOnChatChange(chat.filterAllChat);
  }
};
exports.default = _default;

},{"../../utils/chat":38,"../../utils/state":42}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showChatTabConfigWindow = showChatTabConfigWindow;
exports.addChatTab = addChatTab;
exports.selectChatTab = selectChatTab;
exports.getCurrentChatFilters = getCurrentChatFilters;

var _state = require("../../utils/state");

var _misc = require("../../utils/misc");

const DEFAULT_CHAT_TAB_NAME = 'Untitled'; // Gets current chat filters as represented in the UI
// filter being true means it's invisible(filtered) in chat
// filter being false means it's visible(unfiltered) in chat

function getCurrentChatFilters() {
  // Saved by the official game client
  const gameFilters = JSON.parse(localStorage.getItem('filteredChannels'));
  return {
    global: gameFilters.includes('global'),
    faction: gameFilters.includes('faction'),
    party: gameFilters.includes('party'),
    clan: gameFilters.includes('clan'),
    pvp: gameFilters.includes('pvp'),
    inv: gameFilters.includes('inv')
  };
} // Shows the chat tab config window for a specific tab, displayed in a specific position


function showChatTabConfigWindow(tabId, pos) {
  const state = (0, _state.getState)();
  const tempState = (0, _state.getTempState)();
  const $chatTabConfig = document.querySelector('.js-chat-tab-config');
  const chatTab = state.chatTabs.find(tab => tab.id === tabId); // Update position and name in chat tab config

  $chatTabConfig.style.left = `${pos.x}px`;
  $chatTabConfig.style.top = `${pos.y}px`;
  $chatTabConfig.querySelector('.js-chat-tab-name').value = chatTab.name; // Store tabId in state, to be used by the Remove/Add buttons in config window

  tempState.editedChatTabId = tabId; // Hide remove button if only one chat tab left - can't remove last one
  // Show it if more than one chat tab left

  const chatTabCount = Object.keys(state.chatTabs).length;
  const $removeChatTabBtn = $chatTabConfig.querySelector('.js-remove-chat-tab');
  $removeChatTabBtn.style.display = chatTabCount < 2 ? 'none' : 'block'; // Show chat tab config

  $chatTabConfig.style.display = 'block';
} // Adds chat tab to DOM, sets it as selected
// If argument chatTab is provided, will use that name+id
// If no argument is provided, will create new tab name/id and add it to state
// isInittingTab is optional boolean, if `true`, will _not_ set added tab as selected. Used when initializing all chat tabs on load
// Returns newly added tabId


function addChatTab(chatTab, isInittingTab) {
  const state = (0, _state.getState)();
  let tabName = DEFAULT_CHAT_TAB_NAME;
  let tabId = (0, _misc.uuid)();

  if (chatTab) {
    tabName = chatTab.name;
    tabId = chatTab.id;
  } else {
    // If no chat tab was provided, create it in state
    state.chatTabs.push({
      name: tabName,
      id: tabId,
      filters: getCurrentChatFilters()
    });
    (0, _state.saveState)();
  }

  const $tabs = document.querySelector('.js-chat-tabs');
  const $tab = (0, _misc.makeElement)({
    element: 'div',
    content: tabName
  });
  $tab.setAttribute('data-tab-id', tabId); // Add chat tab to DOM

  $tabs.appendChild($tab); // Wire chat tab up to open config on right click

  $tab.addEventListener('contextmenu', clickEvent => {
    const mousePos = {
      x: clickEvent.pageX,
      y: clickEvent.pageY
    };
    showChatTabConfigWindow(tabId, mousePos);
  }); // And select chat tab on left click

  $tab.addEventListener('click', () => {
    selectChatTab(tabId);
  });

  if (!isInittingTab) {
    // Select the newly added chat tab
    selectChatTab(tabId);
  } // Returning tabId to all adding new tab to pass tab ID to `showChatTabConfigWindow`


  return tabId;
} // Selects chat tab [on click], updating client chat filters and custom chat filters


function selectChatTab(tabId) {
  const state = (0, _state.getState)(); // Remove selected class from everything, then add selected class to clicked tab

  Array.from(document.querySelectorAll('[data-tab-id]')).forEach($tab => {
    $tab.classList.remove('js-selected-tab');
  });
  const $tab = document.querySelector(`[data-tab-id="${tabId}"]`);
  $tab.classList.add('js-selected-tab');
  const tabFilters = state.chatTabs.find(tab => tab.id === tabId).filters; // Simulating clicks on the filters to turn them on/off

  const $filterButtons = Array.from(document.querySelectorAll('.channelselect small'));
  Object.keys(tabFilters).forEach(filter => {
    const $filterButton = $filterButtons.find($btn => $btn.textContent === filter);
    if (!$filterButton) return;
    const isCurrentlyFiltered = $filterButton.classList.contains('textgrey'); // If is currently filtered but filter for this tab is turned off, click it to turn filter off

    if (isCurrentlyFiltered && !tabFilters[filter]) {
      $filterButton.click();
    } // If it is not currently filtered but filter for this tab is turned on, click it to turn filter on


    if (!isCurrentlyFiltered && tabFilters[filter]) {
      $filterButton.click();
    }
  }); // Update the selected tab in state

  state.selectedChatTabId = tabId;
  (0, _state.saveState)();
}

},{"../../utils/misc":40,"../../utils/state":42}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var helpers = _interopRequireWildcard(require("./helpers"));

var _state = require("../../utils/state");

var _misc = require("../../utils/misc");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Creates DOM elements and wires them up for custom chat tabs and chat tab config
// Note: Should be done after creating new custom chat filters
function customChatTabs() {
  const state = (0, _state.getState)();
  const tempState = (0, _state.getTempState)(); // Create the chat tab configuration DOM

  const $chatTabConfigurator = (0, _misc.makeElement)({
    element: 'div',
    class: 'uimod-chat-tab-config js-chat-tab-config',
    content: `
            <h1>Chat Tab Config</h1>
            <div class="uimod-chat-tab-config-grid">
                <div>Name</div><input type="text" class="js-chat-tab-name" value="untitled"></input>
                <div class="btn orange js-remove-chat-tab">Remove</div><div class="btn blue js-save-chat-tab">Ok</div>
            </div>
        `
  });
  document.body.append($chatTabConfigurator); // Wire it up

  document.querySelector('.js-remove-chat-tab').addEventListener('click', () => {
    // Remove the chat tab from state
    const editedChatTab = state.chatTabs.find(tab => tab.id === tempState.editedChatTabId);
    const editedChatTabIndex = state.chatTabs.indexOf(editedChatTab);
    state.chatTabs.splice(editedChatTabIndex, 1); // Remove the chat tab from DOM

    const $chatTab = document.querySelector(`[data-tab-id="${tempState.editedChatTabId}"]`);
    $chatTab.parentNode.removeChild($chatTab); // If we just removed the currently selected chat tab

    if (tempState.editedChatTabId === state.selectedChatTabId) {
      // Select the chat tab to the left of the removed one
      const nextChatTabIndex = editedChatTabIndex === 0 ? 0 : editedChatTabIndex - 1;
      helpers.selectChatTab(state.chatTabs[nextChatTabIndex].id);
    } // Close chat tab config


    document.querySelector('.js-chat-tab-config').style.display = 'none';
  });
  document.querySelector('.js-save-chat-tab').addEventListener('click', () => {
    // Set new chat tab name in DOM
    const $chatTab = document.querySelector(`[data-tab-id="${state.selectedChatTabId}"]`);
    const newName = document.querySelector('.js-chat-tab-name').value;
    $chatTab.textContent = newName; // Set new chat tab name in state
    // `selectedChatTab` is a reference on `state.chatTabs`, so updating it above still updates it in the state - we want to save that

    const selectedChatTab = state.chatTabs.find(tab => tab.id === state.selectedChatTabId);
    selectedChatTab.name = newName;
    (0, _state.saveState)(); // Close chat tab config

    document.querySelector('.js-chat-tab-config').style.display = 'none';
  }); // Create the initial chat tabs HTML

  const $chat = document.querySelector('#chat');
  const $chatTabs = (0, _misc.makeElement)({
    element: 'div',
    class: 'uimod-chat-tabs js-chat-tabs',
    content: '<div class="js-chat-tab-add">+</div>'
  }); // Add them to the DOM

  $chat.parentNode.insertBefore($chatTabs, $chat); // Add all our chat tabs from state

  state.chatTabs.forEach(chatTab => {
    const isInittingTab = true;
    helpers.addChatTab(chatTab, isInittingTab);
  }); // Wire up the add chat tab button

  document.querySelector('.js-chat-tab-add').addEventListener('click', clickEvent => {
    const chatTabId = helpers.addChatTab();
    const mousePos = {
      x: clickEvent.pageX,
      y: clickEvent.pageY
    };
    helpers.showChatTabConfigWindow(chatTabId, mousePos);
  }); // If initial chat tab doesn't exist, create it based off current filter settings

  if (!Object.keys(state.chatTabs).length) {
    const tabId = (0, _misc.uuid)();
    const chatTab = {
      name: 'Main',
      id: tabId,
      filters: helpers.getCurrentChatFilters()
    };
    state.chatTabs.push(chatTab);
    (0, _state.saveState)();
    helpers.addChatTab(chatTab);
  } // Wire up click event handlers onto the filters to update the selected chat tab's filters in state


  document.querySelector('.channelselect').addEventListener('click', clickEvent => {
    const $elementMouseIsOver = document.elementFromPoint(clickEvent.clientX, clickEvent.clientY); // We only want to change the filters if the user manually clicks the filter button
    // If they clicked a chat tab and we programatically set filters, we don't want to update
    // the current tab's filter state

    if (!$elementMouseIsOver.classList.contains('btn')) {
      return;
    }

    const selectedChatTab = state.chatTabs.find(tab => tab.id === state.selectedChatTabId);
    selectedChatTab.filters = helpers.getCurrentChatFilters();
    (0, _state.saveState)();
  }); // Select the currently selected tab in state on mod initialization

  if (state.selectedChatTabId) {
    helpers.selectChatTab(state.selectedChatTabId);
  }
}

function cleanCustomChatTabState() {
  const state = (0, _state.getState)();
  let stateUpdated = true;
  state.chatTabs = state.chatTabs.filter(chatTab => {
    if (!chatTab) {
      stateUpdated = true;
      return false;
    }

    return true;
  });
  if (stateUpdated) (0, _state.saveState)();
}

var _default = {
  name: 'Chat tabs',
  description: 'Enables support for multiple chat tabs',
  run: () => {
    cleanCustomChatTabState();
    customChatTabs();
  }
};
exports.default = _default;

},{"../../utils/misc":40,"../../utils/state":42,"./helpers":10}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleClanWindowChange = handleClanWindowChange;

var _misc = require("../../utils/misc");

var _state = require("../../utils/state");

function _lastSeenFromTimestamp(ts) {
  if (!ts) return 'Never';
  const nowTs = Date.now();
  const seconds = (nowTs - ts) / 1000; // Divide by 1000 because Date.now returns milliseconds

  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const months = weeks / 30;
  const years = months / 12;

  const getPluralizedText = (num, word) => {
    num = Math.round(num);
    return num === 1 ? `${num} ${word}` : `${num} ${word}s`;
  };

  if (seconds < 60) return `${getPluralizedText(seconds, 'second')} ago`;
  if (minutes < 60) return `${getPluralizedText(minutes, 'minute')} ago`;
  if (hours < 24) return `${getPluralizedText(hours, 'hour')} ago`;
  if (days < 7) return `${getPluralizedText(days, 'day')} ago`;
  if (days < 30) return `${getPluralizedText(weeks, 'week')} ago`;
  if (months < 12) return `${getPluralizedText(months, 'month')} ago`;
  return `${getPluralizedText(years, 'year')} ago`;
}

function _handleClanMemberTableChange() {
  const state = (0, _state.getState)();
  const $clanLastSeenTable = document.querySelector('.js-clan-lastseen-table');
  const $clanMemberTable = document.querySelector('.js-clan-members-table-initd'); // Update+Save current online users last seen time

  const currentTimestamp = Date.now();
  const $memberNames = Array.from($clanMemberTable.querySelectorAll('tr .name'));
  const latestMemberNames = [];
  $memberNames.map($name => {
    const isOnline = !$name.parentNode.parentNode.classList.contains('offline');
    const name = $name.textContent.trim();

    if (isOnline) {
      // Update current timestamp of online members
      state.clanLastActiveMembers[name] = currentTimestamp;
    } else if (!state.clanLastActiveMembers.hasOwnProperty(name)) {
      // If not existing in state, add them so that we can check update their last seen time when they type in chat (See `refreshLastSeenClanMember`)
      state.clanLastActiveMembers[name] = null;
    }

    latestMemberNames.push(name);
  }); // Remove clan members that've left the clan from state, so their last seen time is no longer tracked when they type in chat

  const removedMembers = Object.keys(state.clanLastActiveMembers).filter(nameInState => !latestMemberNames.includes(nameInState));
  removedMembers.forEach(removedName => delete state.clanLastActiveMembers[removedName]);
  (0, _state.saveState)(); // Update changed last seen times in DOM

  const $names = Array.from($clanMemberTable.querySelectorAll('tr .name'));
  const $lastSeenRows = Array.from($clanLastSeenTable.querySelectorAll('.js-clan-lastseen-row')); // If necessary, update the quantity of rows in our custom table

  const $tableBody = $clanLastSeenTable.querySelector('tbody');

  if ($names.length !== $lastSeenRows.length) {
    const $newRow = (0, _misc.makeElement)({
      element: 'tr',
      class: 'striped js-clan-lastseen-row',
      content: '<td></td>'
    });

    if ($names.length > $lastSeenRows.length) {
      // Add last seen rows to match names length
      const rowsToAddCount = $names.length - $lastSeenRows.length;

      for (var i = 0; i < rowsToAddCount; i++) {
        $tableBody.appendChild($newRow.cloneNode(true));
      }
    } else {
      // Remove last seen rows to match names length
      const rowsToRemoveCount = $lastSeenRows.length - $names.length;

      for (var i = 0; i < rowsToRemoveCount; i++) {
        $tableBody.querySelector('tr').remove();
      }
    }
  } // Update last seen rows with appropriate last seen time


  const $tableRows = Array.from($tableBody.querySelectorAll('td'));
  $names.forEach(($name, index) => {
    const name = $name.textContent.trim();
    const isOnline = state.clanLastActiveMembers[name] === currentTimestamp;
    const lastSeenStr = isOnline ? 'Now' : _lastSeenFromTimestamp(state.clanLastActiveMembers[name]);
    const $tableRow = $tableRows[index];
    const rowLastSeenStr = $tableRow.textContent;
    const isLastSeenChanged = rowLastSeenStr !== lastSeenStr;
    if (isLastSeenChanged) $tableRow.textContent = lastSeenStr; // Mirroring the 50% opacity that the normal clan member table has on offline members

    const lineClassList = $tableRow.parentNode.classList;
    const displayingRowAsOffline = lineClassList.contains('js-offline-member');

    if (!isOnline && !displayingRowAsOffline) {
      lineClassList.add('js-offline-member');
    } else if (isOnline && displayingRowAsOffline) {
      lineClassList.remove('js-offline-member');
    }
  });
}

function handleClanWindowChange() {
  const state = (0, _state.getState)();
  const tempState = (0, _state.getTempState)();
  const $clanWindow = document.querySelector('.window .clanView'); // Table takes a moment to be created after clanView window is opened

  const $clanMemberTable = $clanWindow.querySelector('table:not(.js-clan-lastseen-initd)');
  if (!$clanMemberTable) return; // If not in Members tab (e.g. Applications tab), don't initialize Last seen
  // Check if we're in Members tab by seeing if there are 2 columns or not
  // (This allows us to support multiple languages, as opposed to checking for "Applications")

  const isMembersTab = Array.from($clanMemberTable.querySelectorAll('thead th')).length === 2;
  const $lastSeenTable = $clanWindow.querySelector('.js-clan-lastseen-table');

  if (!isMembersTab) {
    // Hide last seen table if it's visible
    if ($lastSeenTable) $lastSeenTable.style.display = 'none';
    return;
  } else if ($lastSeenTable) {
    // Unhide it when we are on Members table
    $lastSeenTable.setAttribute('style', '');
  } // Initialize the table column if we haven't already
  // The clan member table loses its class when the tab is changed, so we check


  if (!$clanMemberTable.classList.contains('js-clan-members-table-initd')) {
    $clanMemberTable.classList.add('js-clan-members-table-initd', 'uimod-clan-members-table'); // Last seen table may already exist if we're switching from Applications tab back to Members tab

    if ($lastSeenTable) return; // If last seen table hasn't been created, create it.
    // We add a new table next to the preexisting table.
    // We don't just add a new column because Svelte changes the columns and rows around
    // a lot, pretty randomly. This leads to our right-most column occasionally bugging out
    // and ending up as the left-most column.
    // Using our own table lets us control everything about it without Svelte interfering.

    $clanMemberTable.parentNode.appendChild((0, _misc.makeElement)({
      element: 'table',
      class: 'marg-top panel-black js-clan-lastseen-table uimod-clan-lastseen-table',
      content: `
                    <thead>
                        <tr class="textprimary">
                            <th>Last seen</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr class="striped js-clan-lastseen-row">
                        <td></td>
                    </tr>
                    </tbody>
                `
    })); // Reset last active members state if clan has changed

    const clanName = $clanWindow.querySelector('.textcenter h1').textContent;

    if (clanName !== state.currentClanName) {
      state.currentClanName = clanName.trim();
      state.clanLastActiveMembers = {};
      (0, _state.saveState)();
    }
  }

  if (!tempState.clanTableObserver) {
    _handleClanMemberTableChange();

    tempState.clanTableObserver = new MutationObserver(_handleClanMemberTableChange);
    tempState.clanTableObserver.observe($clanMemberTable, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }
}

},{"../../utils/misc":40,"../../utils/state":42}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ui = require("../../utils/ui");

var _state = require("../../utils/state");

var _helpers = require("./helpers");

// When clan window is open, initialize the mutation observer to add Last seen and track last seen in state
function clanActivityTracker() {
  const tempState = (0, _state.getTempState)();
  const $clanWindow = document.querySelector('.window .clanView'); // If the window is no longer visible, update the state to denote the window has closed and kill the observer

  if (!$clanWindow) {
    if ((0, _ui.isWindowOpen)(_ui.WindowNames.clan)) {
      if (tempState.clanWindowObserver) {
        tempState.clanWindowObserver.disconnect();
        delete tempState.clanWindowObserver;
      }

      if (tempState.clanTableObserver) {
        tempState.clanTableObserver.disconnect();
        delete tempState.clanTableObserver;
      }

      (0, _ui.setWindowClosed)(_ui.WindowNames.clan);
    }
  } else if (!tempState.clanWindowObserver) {
    (0, _ui.setWindowOpen)(_ui.WindowNames.clan);
    (0, _helpers.handleClanWindowChange)();
    tempState.clanWindowObserver = new MutationObserver(_helpers.handleClanWindowChange);
    tempState.clanWindowObserver.observe($clanWindow, {
      attributes: true,
      childList: true
    });
  }
} // Update last seen for clan members when they type in chat


function refreshLastSeenClanMember(mutations) {
  const state = (0, _state.getState)();
  let updatedState = false;
  const $newChatLines = mutations.map(mutation => Array.from(mutation.addedNodes)).flat();
  $newChatLines.forEach($chatLine => {
    const $name = $chatLine.querySelector('.name');
    if (!$name) return;
    const name = $name.textContent.trim(); // If not clan member, don't update state

    if (!state.clanLastActiveMembers.hasOwnProperty(name)) return;
    updatedState = true;
    state.clanLastActiveMembers[name] = Date.now();
  });
  if (updatedState) (0, _state.saveState)();
}

var _default = {
  name: 'Clan activity tracker',
  description: 'Updates clan member table with a Last seen column',
  run: ({
    registerOnDomChange,
    registerOnChatChange
  }) => {
    clanActivityTracker(); // Run it initially once in case clan is already open on mod load

    registerOnDomChange(clanActivityTracker); // Run it on dom change for whenever the clan window is opened/closed

    registerOnChatChange(refreshLastSeenClanMember); // Run it on chat change so whenever a clan member chats, their last seen is updated
  }
};
exports.default = _default;

},{"../../utils/state":42,"../../utils/ui":43,"./helpers":12}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _misc = require("../../utils/misc");

var _ui = require("../../utils/ui");

function customSettings() {
  const $settings = document.querySelector('.divide:not(.js-settings-initd)');

  if (!$settings) {
    return;
  }

  $settings.classList.add('js-settings-initd');
  const $settingsChoiceList = $settings.querySelector('.choice').parentNode;
  $settingsChoiceList.appendChild((0, _misc.makeElement)({
    element: 'div',
    class: 'choice js-blocked-players',
    content: 'Blocked players'
  }));
  $settingsChoiceList.appendChild((0, _misc.makeElement)({
    element: 'div',
    class: 'choice js-reset-ui-pos',
    content: 'Reset UI Positions'
  })); // Upon click, we display our custom settings window UI

  document.querySelector('.js-blocked-players').addEventListener('click', _ui.createBlockList); // Reset positions immediately upon click

  document.querySelector('.js-reset-ui-pos').addEventListener('click', _ui.resetUiPositions); // If it was open when the game last closed keep it open

  if ((0, _ui.isWindowOpen)(_ui.WindowNames.blockList)) {
    (0, _ui.createBlockList)();
  }
}

var _default = {
  name: 'Custom settings',
  description: 'Allows you to view and remove blocked players from the Settings window. Also adds Reset UI Position to settings',
  run: ({
    registerOnDomChange
  }) => {
    customSettings(); // If the settings window becomes visible/invisible, we want to update it

    registerOnDomChange(customSettings);
  }
};
exports.default = _default;

},{"../../utils/misc":40,"../../utils/ui":43}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deposit = deposit;

var _game = require("../../utils/game");

var _ui = require("../../utils/ui");

function deposit() {
  const $stash = (0, _game.getWindow)(_ui.WindowNames.stash); // Select normal deposit button

  $stash.querySelector('.slot .grey.gold:not(.js-deposit-all)').dispatchEvent(new Event('click'));
  const $currencyInput = $stash.querySelector('input.formatted'); // Input some huge value they'll have less than

  $currencyInput.value = 999999999999999;
  $currencyInput.dispatchEvent(new Event('input'));
  setTimeout(function () {
    const $depositButton = $stash.querySelector('.btn.blue');

    if (!$depositButton.classList.contains('disabled')) {
      $depositButton.dispatchEvent(new Event('click'));
    } // Clear input


    $currencyInput.value = '';
    $currencyInput.dispatchEvent(new Event('input'));
  }, 0);
}

},{"../../utils/game":39,"../../utils/ui":43}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _misc = require("../../utils/misc");

var _ui = require("../../utils/ui");

var _game = require("../../utils/game");

var _helper = require("./helper");

function addDepositAllButton() {
  const $stash = (0, _game.getWindow)(_ui.WindowNames.stash); // If stash is closed or deposit all button is already added, we dont need to do anything

  if (!$stash || $stash.querySelector('.js-deposit-all')) {
    return;
  } // Create deposit all button and add it to stash


  const $depositTargetBtn = $stash.querySelector('.slot .grey.gold');
  const $depositAllBtn = $depositTargetBtn.cloneNode(true);
  const $depositAllText = (0, _misc.makeElement)({
    element: 'span',
    content: ' ALL'
  });
  $depositAllBtn.append($depositAllText);
  $depositAllBtn.classList.add('js-deposit-all');
  $depositAllBtn.classList.remove('active');
  $depositTargetBtn.parentElement.insertBefore($depositAllBtn, $depositTargetBtn);
  $stash.querySelector('.js-deposit-all').addEventListener('click', _helper.deposit);
}

var _default = {
  name: 'Desposit All Button',
  description: 'Adds a button to your stash to quickly deposit all of your money',
  run: ({
    registerOnDomChange
  }) => {
    addDepositAllButton();
    registerOnDomChange(addDepositAllButton);
  }
};
exports.default = _default;

},{"../../utils/game":39,"../../utils/misc":40,"../../utils/ui":43,"./helper":15}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dragElement = dragElement;

// Influenced by: https://gist.github.com/remarkablemark/5002d27442600510d454a5aeba370579 & https://stackoverflow.com/a/45831670
// $draggedElement is the item that will be dragged.
// $dragTrigger is optional, if passed, this element that must be held down to drag $draggedElement
// If $dragTrigger is not passed, clicking anywhere on $draggedElement will drag it
// dragAfterTimeMs is an optional argument. If passed, user has to hold mouse down for that long before being able to drag
function dragElement($draggedElement, $dragTrigger, dragAfterTimeMs) {
  let offset = [0, 0];
  let mouseDownPos = [0, 0];
  let elementPos = [0, 0];
  let isDown = false;
  let downTimeMs = 0; // Time when user last started holding mouse left click

  const $trigger = $dragTrigger || $draggedElement;
  $trigger.addEventListener('mousedown', e => {
    isDown = true;
    downTimeMs = Date.now(); // Offset is used when there is a separate $dragTrigger

    offset = [$draggedElement.offsetLeft - e.clientX, $draggedElement.offsetTop - e.clientY]; // mouseDownPos and elementPos are used when $draggedElement is also the trigger

    mouseDownPos = [e.clientX, e.clientY];
    elementPos = [parseInt($draggedElement.style.left) || 0, parseInt($draggedElement.style.top) || 0];
  }, true);
  document.addEventListener('mouseup', () => {
    downTimeMs = 0;
    isDown = false;
  }, true);
  document.addEventListener('mousemove', e => {
    e.preventDefault();

    if (isDown) {
      // If dragAfterTimeMs is set, then user must hold down mouse for specified time before being able to drag
      if (dragAfterTimeMs && Date.now() - downTimeMs < dragAfterTimeMs) return;
      const deltaX = $dragTrigger ? e.clientX + offset[0] : elementPos[0] + e.clientX - mouseDownPos[0];
      const deltaY = $dragTrigger ? e.clientY + offset[1] : elementPos[1] + e.clientY - mouseDownPos[1];
      $draggedElement.style.left = `${deltaX}px`;
      $draggedElement.style.top = `${deltaY}px`;
    }
  }, true);
}

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var helpers = _interopRequireWildcard(require("./helpers"));

var _state = require("../../utils/state");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Drag all windows by their header
function draggableUIWindows() {
  Array.from(document.querySelectorAll('.window:not(.js-can-move)')).forEach($window => {
    $window.classList.add('js-can-move');
    helpers.dragElement($window, $window.querySelector('.titleframe'));
  });
  Array.from(document.querySelectorAll(`
		.partyframes:not(.js-can-move),
		#ufplayer:not(.js-can-move),
		#uftarget:not(.js-can-move),
		#skillbar:not(.js-can-move)
	`)).forEach($frame => {
    $frame.classList.add('js-can-move');
    helpers.dragElement($frame, null, 500);
  });
} // Save dragged UI windows position to state


function saveDraggedUIWindows() {
  const state = (0, _state.getState)();
  Array.from(document.querySelectorAll('.window:not(.js-ui-is-saving)')).forEach($window => {
    $window.classList.add('js-ui-is-saving');
    const $draggableTarget = $window.querySelector('.titleframe');
    const windowName = $draggableTarget.querySelector('[name="title"]').textContent;
    $draggableTarget.addEventListener('mouseup', () => {
      state.windowsPos[windowName] = $window.getAttribute('style');
      (0, _state.saveState)();
    });
  });

  const saveFramePos = ($element, name) => {
    if (!$element) return;
    $element.classList.add('js-ui-is-saving');
    $element.addEventListener('mouseup', () => {
      state.windowsPos[name] = $element.getAttribute('style');
    });
  };

  saveFramePos(document.querySelector('.partyframes:not(.js-ui-is-saving)'), 'partyFrame');
  saveFramePos(document.querySelector('#ufplayer:not(.js-ui-is-saving)'), 'playerFrame');
  saveFramePos(document.querySelector('#uftarget:not(.js-ui-is-saving)'), 'targetFrame');
} // Loads draggable UI windows position from state


function loadDraggedUIWindowsPositions() {
  const state = (0, _state.getState)();
  Array.from(document.querySelectorAll('.window:not(.js-has-loaded-pos)')).forEach($window => {
    $window.classList.add('js-has-loaded-pos');
    const windowName = $window.querySelector('[name="title"]').textContent;
    const pos = state.windowsPos[windowName];

    if (pos) {
      $window.setAttribute('style', pos);
    }
  });

  const loadFramePos = ($element, name) => {
    if (!$element) return;
    $element.classList.add('js-has-loaded-pos');
    const pos = state.windowsPos[name];

    if (pos) {
      $element.setAttribute('style', pos);
    }
  };

  loadFramePos(document.querySelector('.partyframes:not(.js-has-loaded-pos)'), 'partyFrame');
  loadFramePos(document.querySelector('#ufplayer:not(.js-has-loaded-pos)'), 'playerFrame');
  loadFramePos(document.querySelector('#uftarget:not(.js-has-loaded-pos)'), 'targetFrame');
}

var _default = {
  name: 'Draggable Windows',
  description: 'Allows you to drag windows in the UI',
  run: ({
    registerOnDomChange
  }) => {
    draggableUIWindows();
    saveDraggedUIWindows();
    loadDraggedUIWindowsPositions(); // As windows open, we want to make them draggable

    registerOnDomChange(saveDraggedUIWindows);
    registerOnDomChange(draggableUIWindows);
    registerOnDomChange(loadDraggedUIWindowsPositions);
  }
};
exports.default = _default;

},{"../../utils/state":42,"./helpers":17}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ui = require("../../utils/ui");

// The F icon and the UI that appears when you click it
function customFriendsList() {
  (0, _ui.createNavButton)('friendslist', 'F', 'Friends List', _ui.toggleFriendsList); // If it was open when the game last closed keep it open

  if ((0, _ui.isWindowOpen)(_ui.WindowNames.friendsList)) {
    (0, _ui.createFriendsList)();
  }
}

var _default = {
  name: 'Friends list',
  description: 'Allows access to your friends list from the top right F icon',
  run: customFriendsList
};
exports.default = _default;

},{"../../utils/ui":43}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _modStart = _interopRequireDefault(require("./_modStart"));

var _customSettings = _interopRequireDefault(require("./customSettings"));

var _chatContextMenu = _interopRequireDefault(require("./chatContextMenu"));

var _chatFilters = _interopRequireDefault(require("./chatFilters"));

var _chatTabs = _interopRequireDefault(require("./chatTabs"));

var _draggableUI = _interopRequireDefault(require("./draggableUI"));

var _friendsList = _interopRequireDefault(require("./friendsList"));

var _mapControls = _interopRequireDefault(require("./mapControls"));

var _resizableChat = _interopRequireDefault(require("./resizableChat"));

var _resizableMap = _interopRequireDefault(require("./resizableMap"));

var _selectedWindowIsTop = _interopRequireDefault(require("./selectedWindowIsTop"));

var _xpMeter = _interopRequireDefault(require("./xpMeter"));

var _merchantFilter = _interopRequireDefault(require("./merchantFilter"));

var _itemStatsCopy = _interopRequireDefault(require("./itemStatsCopy"));

var _keyPressTracker = _interopRequireDefault(require("./_keyPressTracker"));

var _clanActivityTracker = _interopRequireDefault(require("./clanActivityTracker"));

var _skillCooldownNumbers = _interopRequireDefault(require("./skillCooldownNumbers"));

var _depositAll = _interopRequireDefault(require("./depositAll"));

var _lockedItemSlots = _interopRequireDefault(require("./lockedItemSlots"));

var _screenshotMode = _interopRequireDefault(require("./screenshotMode"));

var _buffTooltips = _interopRequireDefault(require("./buffTooltips"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The array here dictates the order of which mods are executed, from top to bottom
var _default = [_modStart.default, _keyPressTracker.default, _resizableMap.default, _mapControls.default, _friendsList.default, _customSettings.default, _resizableChat.default, _chatContextMenu.default, _chatFilters.default, _chatTabs.default, _draggableUI.default, _selectedWindowIsTop.default, _xpMeter.default, _merchantFilter.default, _itemStatsCopy.default, _clanActivityTracker.default, _skillCooldownNumbers.default, _depositAll.default, _lockedItemSlots.default, _screenshotMode.default, _buffTooltips.default];
exports.default = _default;

},{"./_keyPressTracker":2,"./_modStart":3,"./buffTooltips":5,"./chatContextMenu":8,"./chatFilters":9,"./chatTabs":11,"./clanActivityTracker":13,"./customSettings":14,"./depositAll":16,"./draggableUI":18,"./friendsList":19,"./itemStatsCopy":21,"./lockedItemSlots":23,"./mapControls":25,"./merchantFilter":27,"./resizableChat":28,"./resizableMap":30,"./screenshotMode":32,"./selectedWindowIsTop":33,"./skillCooldownNumbers":35,"./xpMeter":37}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var chat = _interopRequireWildcard(require("../../utils/chat"));

var _game = require("../../utils/game");

var _state = require("../../utils/state");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function itemStatsCopy(clickEvent) {
  const tempState = (0, _state.getTempState)(); // This mod only triggers if you alt+right click

  if (!tempState.keyModifiers.alt) {
    return;
  }

  const $elementMouseIsOver = document.elementFromPoint(clickEvent.clientX, clickEvent.clientY); // It grabs the .overlay class, which is child of the .slot class we need to grab to get the tooltip

  const $bagSlot = $elementMouseIsOver.parentNode; // No item in slot

  if (!$bagSlot.querySelector('img')) {
    return;
  } // Once we confirm we want to copy to clipboard, hide context menu


  const $itemContextMenuChoice = document.body.querySelector('.container > .panel > .choice');

  if (!$itemContextMenuChoice) {
    // If context menu isn't open, something is not right - stop what we're doing and exit
    // Seen this happen very rarely when testing
    return;
  }

  const $itemContextMenu = $itemContextMenuChoice.parentNode;

  if ($itemContextMenu) {
    $itemContextMenu.style.display = 'none';
  } // Get the texts we want from the tooltip


  const getDetailedTooltips = true;
  const $tooltip = await (0, _game.getTooltipContent)($bagSlot, getDetailedTooltips);

  if (!$tooltip) {
    // This _shouldn't_ happen, but very occasionally there is a (likely timing-related) problem getting the tooltip
    return;
  } // We get the detailed tooltip, which may have a second comparison tooltip. Remove the comparison tooltip if we have it.


  const $comparisonTooltip = $tooltip.querySelector('.slotdescription');
  if ($comparisonTooltip) $comparisonTooltip.parentNode.removeChild($comparisonTooltip); // Collect item name/stats into strings

  const itemName = $tooltip.querySelector('.slottitle').textContent;
  const $itemQuality = $tooltip.querySelector('.type span');
  const itemQuality = $itemQuality.textContent; // It's not a piece of equipment, just copy item name and exit

  if (!itemQuality.includes('%')) {
    let trimmedItemName = itemName; // If item name starts with T#, e.g. T1, T5, etc, then this was added onto the detailed tooltip
    // It's usually unnecessary information, so we remove it
    // (e.g. shows as "T94 Centrifugal Laceration Lv. 4" instead of "Centrifugal Laceration Lv. 4")

    if (itemName.substr(0, 2).match(/T[0-9]/)) {
      trimmedItemName = itemName.substr(itemName.indexOf(' ') + 1);
    }

    navigator.clipboard.writeText(trimmedItemName);
    chat.addChatMessage(`Copied ${trimmedItemName} to clipboard.`);
    return;
  } // We only want the lvl number, so pop off the level number from the "Requires Lv. 17" line
  // To find this line, we search through all the tooltip lines for the line containing "Requires"


  const $lines = Array.from($tooltip.querySelectorAll('.container .pack'));
  const $itemRequirement = $lines.filter($line => $line.textContent.includes('Requires '))[0];
  const itemLvl = $itemRequirement.textContent.split(' ').pop(); // Grab the stats we care about, i.e. not part of the requirements or item type

  const $stats = Array.from($tooltip.querySelectorAll(`
				.pack > .textpurp,
				.pack > .textblue,
				.pack > .textgreen:not(.slottitle),
				.pack > .textwhite:not(.type)
			`));
  const statsText = $stats.map($stat => {
    // We only care about lines starting with a "+ ", showcasing that a piece of gear adds a certain stat
    // The comparison line near the bottom of the tooltip also has a "+", but no space after it. This shows stat differentials vs current gear - we don't want that.
    if ($stat.textContent.substr(0, 2) !== '+ ') return; // Return quality percentage only if it exists, otherwise return normal stat

    const $quality = $stat.querySelector('span');

    if ($quality) {
      const quality = $quality.textContent;
      const statLineChunks = $stat.textContent.replace(/\+\s/g, '+').split(' ');
      statLineChunks.pop(); // Remove quality at end

      statLineChunks.shift(); // Remove specific +# at the beginning

      const statName = statLineChunks.join(' ');
      return `${statName} ${quality}`;
    } else {
      return $stat.textContent.trim();
    }
  }).filter(statText => !!statText) // Filter out empty stat texts, i.e. if they didn't begin with a "+"
  .join(', ');
  navigator.clipboard.writeText(`${itemName} ${itemQuality} Lv.${itemLvl}: ${statsText}`);
  chat.addChatMessage(`Copied ${itemName}'s stats to clipboard.`);
}

var _default = {
  name: 'Items stats copy',
  description: 'When ctrl+left clicking a piece of equipment in your inventory, its stats will be copied to your clipboard',
  run: ({
    registerOnRightClick
  }) => {
    registerOnRightClick(itemStatsCopy);
  }
};
exports.default = _default;

},{"../../utils/chat":38,"../../utils/game":39,"../../utils/state":42}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lockSlot = lockSlot;
exports.initLockedSlots = initLockedSlots;

var _state = require("../../utils/state");

var _misc = require("../../utils/misc");

var _ui = require("../../utils/ui");

var _game = require("../../utils/game");

function _wireLockSlot($lockedSlot) {
  const state = (0, _state.getState)();
  const tempState = (0, _state.getTempState)();
  const slotNumber = $lockedSlot.getAttribute('data-locked-slot-num');
  const $bagSlot = document.querySelector(`#bag${slotNumber}`); // Left clicking works normally, proxy it through

  $lockedSlot.addEventListener('click', () => {
    $bagSlot.dispatchEvent(new Event('pointerup'));
  }); // Hovering to see the tooltip works normally, proxy it through

  $lockedSlot.addEventListener('pointerenter', () => {
    $bagSlot.dispatchEvent(new Event('pointerenter'));
  });
  $lockedSlot.addEventListener('pointerleave', () => {
    $bagSlot.dispatchEvent(new Event('pointerleave'));
  }); // Right clicking removes Drop item from menu, otherwise works normally, proxy it through

  $lockedSlot.addEventListener('contextmenu', event => {
    // Block shift+right click
    if (tempState.keyModifiers.shift) return; // Don't do anything if no item in this slot

    if (!$bagSlot.querySelector('img')) return; // Emulate right click on the item to display its context menu

    $bagSlot.dispatchEvent(new PointerEvent('pointerup', event));
    setTimeout(() => {
      const $contextMenuChoices = Array.from(document.querySelectorAll('.container > .panel.context .choice')); // Remove "Drop item" from context menu

      $contextMenuChoices.forEach($choice => {
        if ($choice.textContent.toLowerCase() === 'drop item') {
          $choice.style.display = 'none';
        }
      }); // Add "Unlock slot" menu item

      $contextMenuChoices[0].parentNode.appendChild((0, _misc.makeElement)({
        element: 'div',
        class: 'choice js-unlock-item',
        content: 'Unlock slot'
      })); // Wire up "Unlock slot" menu item

      const $unlockItemChoice = document.querySelector('.js-unlock-item');
      $unlockItemChoice.addEventListener('click', () => {
        state.lockedItemSlots.splice(state.lockedItemSlots.indexOf(slotNumber), 1);
        (0, _state.saveState)();
        $lockedSlot.parentNode.removeChild($lockedSlot); // Hide context menu after clicking unlock (removing it breaks client that tries to remove it later)

        const $contextMenu = $unlockItemChoice.parentNode;
        $contextMenu.style.display = 'none';
      });
    }, 0);
  });
}

function lockSlot(slotNumber) {
  const $slot = document.querySelector(`#bag${slotNumber}`);
  if (!$slot) return; // If slot has already been locked, don't lock it again

  if (document.querySelector(`.js-locked-slot[data-locked-slot-num="${slotNumber}"]`)) return;
  const $lockedSlot = (0, _misc.makeElement)({
    element: 'div',
    class: 'js-locked-slot uimod-locked-slot'
  });
  $lockedSlot.setAttribute('data-locked-slot-num', slotNumber);
  $lockedSlot.setAttribute('style', `left: ${$slot.offsetLeft}px; top: ${$slot.offsetTop}px;`);
  $slot.parentNode.insertBefore($lockedSlot, $slot);

  _wireLockSlot($lockedSlot);
}

function initLockedSlots() {
  const state = (0, _state.getState)();
  const $inventory = (0, _game.getWindow)(_ui.WindowNames.inventory);
  if (!$inventory || $inventory.classList.contains('js-locked-slots-initd')) return;
  $inventory.classList.add('js-locked-slots-initd'); // Initialize locked slots UI

  state.lockedItemSlots.forEach(lockSlot);
}

},{"../../utils/game":39,"../../utils/misc":40,"../../utils/state":42,"../../utils/ui":43}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ui = require("../../utils/ui");

var _game = require("../../utils/game");

var _state = require("../../utils/state");

var _misc = require("../../utils/misc");

var _helpers = require("./helpers");

function addLockItemContextMenu() {
  const state = (0, _state.getState)();
  const $inventory = (0, _game.getWindow)(_ui.WindowNames.inventory);
  const $contextMenu = document.querySelector('.container > .panel.context:not(.js-lock-menu-initd)');
  if (!$inventory || !$contextMenu) return;
  const $elementUnderContextMenu = document.elementFromPoint($contextMenu.offsetLeft, $contextMenu.offsetTop - 10 // Subtract 10px to get element right above context menu, rather than context menu itself
  ); // If context menu top left is not inside inventory, then this is not the inventory context menu
  // For example, Queue or Party was clicked while inventory was opened

  if (!$inventory.contains($elementUnderContextMenu)) return; // Add Lock slot, only if unlock slot doesn't exist
  // Use `setTimeout` to wait for `unlock slot` to be added

  setTimeout(() => {
    // If Lock slot already added, dont add it
    if (document.querySelector('.js-lock-item')) return; // If Unlock slot exists, don't add Lock slot

    const isLocked = Array.from($contextMenu.querySelectorAll('.choice')).some($choice => $choice.textContent.toLowerCase() === 'unlock slot');
    if (isLocked) return;
    $contextMenu.appendChild((0, _misc.makeElement)({
      element: 'div',
      class: 'choice js-lock-item',
      content: 'Lock slot'
    }));
    document.querySelector('.js-lock-item').addEventListener('click', () => {
      // Get bag slot element displayed above right click menu
      // Overlay of the bag slot is selected by `elementFromPoint
      const $bagSlotOverlay = document.elementFromPoint($contextMenu.offsetLeft, $contextMenu.offsetTop - 10); // Parent of overlay is the bag slot. Get its id (e.g. "bag4"), then get the slot number from the id

      const bagSlotNum = parseInt($bagSlotOverlay.parentNode.id.substr(3));
      state.lockedItemSlots.push(bagSlotNum);
      (0, _state.saveState)(); // Hide context menu

      $contextMenu.style.display = 'none'; // Add lock slot in UI

      (0, _helpers.lockSlot)(bagSlotNum);
    });
  }, 0);
} // Pass `true` as argument to reinitialize even if initd


function renderLockedItemSlots() {
  const $inventory = (0, _game.getWindow)(_ui.WindowNames.inventory, true);
  const $inventoryContainer = $inventory.parentNode; // We listen specifically on the inventory's container to check for `style` changes
  // so we know if the inventory has had its visibility toggled

  const inventoryObserver = new MutationObserver(_helpers.initLockedSlots);
  inventoryObserver.observe($inventoryContainer, {
    attributes: true,
    childList: false
  });
  (0, _helpers.initLockedSlots)();
} // Removes non-numbers and duplicates from state.lockedItemSlots, and ensures it is an array
// This is primarily necessary because the original release had a few bugs that allowed a slot
// to be in the state array multiple times, or allowed `null` to be in the array. This isn't expected and caused bugs.


function cleanLockedItemState() {
  const state = (0, _state.getState)(); // If something really went wrong and lockedItemSlots isn't an array, set it to an empty array

  if (!Array.isArray(state.lockedItemSlots)) {
    state.lockedItemSlots = [];
    (0, _state.saveState)();
    return;
  } // Remove duplicates and non-numbers


  const cleanedLockItems = Array.from(new Set(state.lockedItemSlots)).filter(item => typeof item === 'number');
  const itemsAreSame = cleanedLockItems.sort().join() === state.lockedItemSlots.sort().join();

  if (!itemsAreSame) {
    state.lockedItemSlots = cleanedLockItems;
    (0, _state.saveState)();
  }
}

var _default = {
  name: 'Locked item slots',
  description: 'Allows you to lock inventory slots so you can not drop those items or shift+right click them',
  run: ({
    registerOnDomChange
  }) => {
    cleanLockedItemState(); // Initialize locked item overlays

    renderLockedItemSlots(); // Add Lock item choice to inventory context menu

    addLockItemContextMenu();
    registerOnDomChange(addLockItemContextMenu);
  }
};
exports.default = _default;

},{"../../utils/game":39,"../../utils/misc":40,"../../utils/state":42,"../../utils/ui":43,"./helpers":22}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMapOpacity = updateMapOpacity;

var _state = require("../../utils/state");

// On load, update map opacity to match state
// We modify the opacity of the canvas and the background color alpha of the parent container
// We do this to allow our opacity buttons to be visible on hover with 100% opacity
// (A surprisingly difficult enough task to require this implementation)
function updateMapOpacity() {
  const state = (0, _state.getState)();
  const $map = document.querySelector('.container canvas');
  const $mapContainer = document.querySelector('.js-map');
  $map.style.opacity = String(state.mapOpacity / 100);
  const mapContainerBgColor = window.getComputedStyle($mapContainer, null).getPropertyValue('background-color'); // Credit for this regexp + This opacity+rgba dual implementation: https://stackoverflow.com/questions/16065998/replacing-changing-alpha-in-rgba-javascript

  let opacity = state.mapOpacity / 100; // This is a slightly lazy browser workaround to fix a bug.
  // If the opacity is `1`, and it sets `rgba` to `1`, then the browser changes the
  // rgba to rgb, dropping the alpha. We could account for that and add the `alpha` back in
  // later, but setting the max opacity to very close to 1 makes sure the issue never crops up.
  // Fun fact: 0.99 retains the alpha, but setting this to 0.999 still causes the browser to drop the alpha. Rude.

  if (opacity === 1) {
    opacity = 0.99;
  }

  const newBgColor = mapContainerBgColor.replace(/[\d\.]+\)$/g, `${opacity})`);
  $mapContainer.style['background-color'] = newBgColor; // Update the button opacity

  const $addBtn = document.querySelector('.js-map-opacity-add');
  const $minusBtn = document.querySelector('.js-map-opacity-minus'); // Hide plus button if the opacity is max

  if (state.mapOpacity === 100) {
    $addBtn.style.visibility = 'hidden';
  } else {
    $addBtn.style.visibility = 'visible';
  } // Hide minus button if the opacity is lowest


  if (state.mapOpacity === 0) {
    $minusBtn.style.visibility = 'hidden';
  } else {
    $minusBtn.style.visibility = 'visible';
  }
}

},{"../../utils/state":42}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = require("../../utils/state");

var helpers = _interopRequireWildcard(require("./helpers"));

var _misc = require("../../utils/misc");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function mapControls() {
  const state = (0, _state.getState)();
  const $map = document.querySelector('.container canvas');

  if (!$map.parentNode.classList.contains('js-map')) {
    $map.parentNode.classList.add('js-map');
  }

  const $mapContainer = document.querySelector('.js-map'); // We only use the `js-map-move` button in the `draggableUI` mod

  const $mapButtons = (0, _misc.makeElement)({
    element: 'div',
    class: 'js-map-btns',
    content: `
            <button class="js-map-opacity-add">+</button>
            <button class="js-map-opacity-minus">-</button>
			<button class="js-map-reset">r</button>
        `
  }); // Add it right before the map container div

  $map.parentNode.insertBefore($mapButtons, $map);
  helpers.updateMapOpacity();
  const $addBtn = document.querySelector('.js-map-opacity-add');
  const $minusBtn = document.querySelector('.js-map-opacity-minus');
  const $resetBtn = document.querySelector('.js-map-reset'); // Hide the buttons if map opacity is maxed/minimum

  if (state.mapOpacity === 100) {
    $addBtn.style.visibility = 'hidden';
  }

  if (state.mapOpacity === 0) {
    $minusBtn.style.visibility = 'hidden';
  } // Wire it up


  $addBtn.addEventListener('click', () => {
    // Update opacity
    state.mapOpacity += 10;
    (0, _state.saveState)();
    helpers.updateMapOpacity();
  });
  $minusBtn.addEventListener('click', () => {
    // Update opacity
    state.mapOpacity -= 10;
    (0, _state.saveState)();
    helpers.updateMapOpacity();
  });
  $resetBtn.addEventListener('click', () => {
    state.mapOpacity = 70;
    state.mapWidth = '174px';
    state.mapHeight = '174px';
    (0, _state.saveState)();
    helpers.updateMapOpacity();
    $mapContainer.style.width = state.mapWidth;
    $mapContainer.style.height = state.mapHeight;
  });
  helpers.updateMapOpacity();
}

var _default = {
  name: 'Map controls',
  description: 'Enables hovering over the minimap to show buttons that let you increase or decrease the opacity of the map, or reset the size+transparency of it',
  run: mapControls
};
exports.default = _default;

},{"../../utils/misc":40,"../../utils/state":42,"./helpers":24}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleMerchantFilterInputChange = handleMerchantFilterInputChange;
exports.deleteMerchantObserver = deleteMerchantObserver;

var _game = require("../../utils/game");

var _state = require("../../utils/state");

function handleMerchantFilterInputChange() {
  const $filterInput = document.querySelector('.js-merchant-filter-input');

  if (!$filterInput) {
    return;
  }

  const value = $filterInput.value;

  if (value) {
    _refreshMerchantFilter(); // When we're filtering, start refreshing merchant filter if we haven't already

  } // If no filters, include single empty string, to make every item visible


  const filters = value.split(',').map(v => v.trim()) || [''];
  const $items = Array.from(document.querySelectorAll('.js-merchant-initd .items .slot'));
  $items.forEach($item => {
    const tooltipContentPromise = (0, _game.getTooltipContent)($item);
    tooltipContentPromise.then(tooltipContent => {
      if (!tooltipContent) {
        // Something weird happened, probably related to lag from looking at tooltips in bulk
        // In this case where we unexpectedly don't have the tooltip, just show the item rather than error out
        $item.parentNode.style.display = 'grid';
        return;
      }

      let filterMatchCount = 0;
      filters.forEach(filter => {
        const matchesFilter = tooltipContent.textContent.toLowerCase().includes(filter.toLowerCase());

        if (matchesFilter) {
          filterMatchCount++;
        }
      });
      const matchesAllFilters = filterMatchCount === filters.length;

      if (matchesAllFilters) {
        $item.parentNode.style.display = 'grid';
      } else {
        $item.parentNode.style.display = 'none';
      }
    });
  });
}

function _refreshMerchantFilter() {
  const tempState = (0, _state.getTempState)(); // If we're already observing, we don't need to observe again

  if (tempState.merchantLoadingObserver) return;
  tempState.merchantLoadingObserver = new MutationObserver(mutation => {
    // If spinner is visible, we are loading. Once spinner is not visible, we are no longer loading
    if (mutation[0] && mutation[0].addedNodes[0] && mutation[0].addedNodes[0].classList.contains('spinner')) {
      tempState.merchantLoading = true;
    } else {
      // If we were loading and now we aren't, we want to refresh the filters
      if (tempState.merchantLoading) {
        handleMerchantFilterInputChange();
      }

      tempState.merchantLoading = false;
    }
  });
  tempState.merchantLoadingObserver.observe(document.querySelector('.js-merchant-initd .buy'), {
    attributes: false,
    childList: true,
    subtree: true
  });
}

function deleteMerchantObserver() {
  const tempState = (0, _state.getTempState)();

  if (tempState.merchantLoadingObserver) {
    tempState.merchantLoading = false;
    tempState.merchantLoadingObserver.disconnect();
    delete tempState.merchantLoadingObserver;
  }
}

},{"../../utils/game":39,"../../utils/state":42}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _game = require("../../utils/game");

var _misc = require("../../utils/misc");

var _ui = require("../../utils/ui");

var _helpers = require("./helpers");

function addMerchantFilter() {
  const $merchant = (0, _game.getWindow)('Merchant'); // If merchant is closed or merchant filter input is already added, we dont need to do anything

  if (!$merchant || $merchant.querySelector('.js-merchant-filter-input')) {
    return;
  }

  $merchant.classList.add('js-merchant-initd');
  $merchant.classList.add('uidom-merchant-with-filters');
  (0, _ui.setWindowOpen)(_ui.WindowNames.merchant);
  const $lvMaximumField = $merchant.querySelectorAll('input[type="number"]')[1];
  const $customSearchField = (0, _misc.makeElement)({
    element: 'input',
    class: 'js-merchant-filter-input uidom-merchant-input',
    type: 'search',
    placeholder: 'Filters (comma separated)'
  });
  $lvMaximumField.parentNode.insertBefore($customSearchField, $lvMaximumField.nextSibling);
  $merchant.querySelector('.js-merchant-filter-input').addEventListener('keyup', (0, _misc.debounce)(_helpers.handleMerchantFilterInputChange, 250));
}

function cleanupMerchantObserver() {
  if ((0, _ui.isWindowOpen)(_ui.WindowNames.merchant)) {
    const $merchant = document.querySelector('.js-merchant-initd');
    if ($merchant) return;
  } // Window was set to open but is actually closed, let's clean up...


  (0, _ui.setWindowClosed)(_ui.WindowNames.merchant);
  (0, _helpers.deleteMerchantObserver)();
}

var _default = {
  name: 'Merchant filter',
  description: 'Allows you to specify filters, or search text, for items displayed in the merchant',
  run: ({
    registerOnDomChange
  }) => {
    addMerchantFilter();
    registerOnDomChange(addMerchantFilter);
    registerOnDomChange(() => {
      cleanupMerchantObserver();
    });
  }
};
exports.default = _default;

},{"../../utils/game":39,"../../utils/misc":40,"../../utils/ui":43,"./helpers":26}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = require("../../utils/state");

function resizableChat() {
  const state = (0, _state.getState)(); // Add the appropriate classes

  const $chatContainer = document.querySelector('#chat').parentNode;
  $chatContainer.classList.add('js-chat-resize'); // Load initial chat and map size

  if (state.chatWidth && state.chatHeight) {
    $chatContainer.style.width = state.chatWidth;
    $chatContainer.style.height = state.chatHeight;
  } // Save chat size on resize


  const resizeObserverChat = new ResizeObserver(() => {
    const chatWidthStr = window.getComputedStyle($chatContainer, null).getPropertyValue('width');
    const chatHeightStr = window.getComputedStyle($chatContainer, null).getPropertyValue('height');
    const hasWidthChanged = state.chatWidth !== chatWidthStr;
    const hasHeightChanged = state.chatHeight !== chatHeightStr;
    if (hasWidthChanged) state.chatWidth = chatWidthStr;
    if (hasHeightChanged) state.chatHeight = chatHeightStr;
    if (hasWidthChanged || hasHeightChanged) (0, _state.saveState)();
  });
  resizeObserverChat.observe($chatContainer);
}

var _default = {
  name: 'Resizable chat',
  description: 'Allows you to resize chat by clicking and dragging from the bottom right of chat',
  run: resizableChat
};
exports.default = _default;

},{"../../utils/state":42}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapResizeHandler = mapResizeHandler;
exports.triggerMapResize = triggerMapResize;

var _state = require("../../utils/state");

// When the map container resizes, we want to update the canvas width/height and the state
function mapResizeHandler() {
  if (!document.querySelector('.layout')) {
    return;
  }

  const state = (0, _state.getState)();
  const tempState = (0, _state.getTempState)();
  const $map = document.querySelector('.container canvas').parentNode;
  const $canvas = $map.querySelector('canvas'); // Get real values of map height/width, excluding padding/margin/etc
  // We round the values in this file to prevent unnecessary decimal points in our map or canvas sizes
  // For some people these decimal points cause the map to constantly resize, making it pretty unusable.
  // Rounding the numbers fixes this.

  const mapWidthStr = window.getComputedStyle($map, null).getPropertyValue('width');
  const mapHeightStr = window.getComputedStyle($map, null).getPropertyValue('height');
  const mapWidth = Math.round(Number(mapWidthStr.slice(0, -2)));
  const mapHeight = Math.round(Number(mapHeightStr.slice(0, -2))); // If height/width are 0 or unset, don't resize canvas

  if (!mapWidth || !mapHeight) {
    return;
  }

  if ($canvas.width !== mapWidth) {
    $canvas.width = mapWidth;
  }

  if ($canvas.height !== mapHeight) {
    $canvas.height = mapHeight;
  } // If we're clicking map, i.e. manually resizing, then save state
  // Don't save state when minimizing/maximizing map via [M]


  if (tempState.clickingMap) {
    state.mapWidth = mapWidthStr;
    state.mapHeight = mapHeightStr;
    (0, _state.saveState)();
  } else {
    const isMaximized = mapWidth > tempState.lastMapWidth && mapHeight > tempState.lastMapHeight;

    if (!isMaximized) {
      $map.style.width = state.mapWidth;
      $map.style.height = state.mapHeight;
    }
  } // Store last map width/height in temp state, so we know if we've minimized or maximized


  tempState.lastMapWidth = mapWidth;
  tempState.lastMapHeight = mapHeight;
} // We need to observe canvas resizes to tell when the user presses M to open the big map
// At that point, we resize the map to match the canvas


function triggerMapResize() {
  if (!document.querySelector('.layout')) {
    return;
  }

  const $map = document.querySelector('.container canvas').parentNode;
  const $canvas = $map.querySelector('canvas'); // Get real values of map height/width, excluding padding/margin/etc

  const mapWidthStr = window.getComputedStyle($map, null).getPropertyValue('width');
  const mapHeightStr = window.getComputedStyle($map, null).getPropertyValue('height');
  const mapWidth = Math.round(Number(mapWidthStr.slice(0, -2)));
  const mapHeight = Math.round(Number(mapHeightStr.slice(0, -2)));
  const canvasWidth = Math.round($canvas.width);
  const canvasHeight = Math.round($canvas.height); // If height/width are 0 or unset, we don't care about resizing yet

  if (!mapWidth || !mapHeight) {
    return;
  }

  if (canvasWidth !== mapWidth) {
    $map.style.width = `${canvasWidth}px`;
  }

  if (canvasHeight !== mapHeight) {
    $map.style.height = `${canvasHeight}px`;
  }
}

},{"../../utils/state":42}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = require("../../utils/state");

var helpers = _interopRequireWildcard(require("./helpers"));

var _misc = require("../../utils/misc");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function resizableMap() {
  const state = (0, _state.getState)();
  const tempState = (0, _state.getTempState)();
  const $map = document.querySelector('.container canvas').parentNode;
  const $canvas = $map.querySelector('canvas');
  $map.classList.add('js-map-resize'); // Track whether we're clicking (resizing) map or not
  // Used to detect if resize changes are manually done, or from minimizing/maximizing map (with [M])

  $map.addEventListener('mousedown', () => {
    tempState.clickingMap = true;
  }); // Sometimes the mouseup event may be registered outside of the map - we account for this

  document.body.addEventListener('mouseup', () => {
    tempState.clickingMap = false;
  });

  if (state.mapWidth && state.mapHeight) {
    $map.style.width = state.mapWidth;
    $map.style.height = state.mapHeight;
    helpers.mapResizeHandler(); // Update canvas size on initial load of saved map size
  } // On resize of map, resize canvas to match
  // Debouncing allows map to be visible while resizing


  const debouncedMapResize = (0, _misc.debounce)(helpers.mapResizeHandler, 1);
  const resizeObserverMap = new ResizeObserver(debouncedMapResize);
  helpers.mapResizeHandler();
  resizeObserverMap.observe($map); // We debounce the canvas resize, so it doesn't resize every single
  // pixel you move when resizing the DOM. If this were to happen,
  // resizing would constantly be interrupted. You'd have to resize a tiny bit,
  // lift left click, left click again to resize a tiny bit more, etc.
  // Resizing is smooth when we debounce this canvas.

  const debouncedTriggerResize = (0, _misc.debounce)(helpers.triggerMapResize, 50);
  const resizeObserverCanvas = new ResizeObserver(debouncedTriggerResize);
  resizeObserverCanvas.observe($canvas);
}

var _default = {
  name: 'Resizable map',
  description: 'Allows you to resize the map by clicking and dragging from the bottom left',
  run: resizableMap
};
exports.default = _default;

},{"../../utils/misc":40,"../../utils/state":42,"./helpers":29}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleScreenshotMode = toggleScreenshotMode;

var _ui = require("../../utils/ui");

function toggleScreenshotMode(keyEvent) {
  // All of the UI elements we want to hide
  const $expBar = document.querySelector('#expbar'); // Player exp bar

  const $actionBar = document.querySelector('.actionbarcontainer'); // Skillbar & player/target hp bar

  const $mainUI = document.querySelector('.layout > .container'); // The rest of the UI
  // On release of F9 hide/show these UI elements and the screenshot warning

  if (keyEvent.keyCode == '120') {
    if ($expBar.style.display != 'none') {
      $mainUI.style.display = 'none';
      $expBar.style.display = 'none';
      $actionBar.style.display = 'none';
      (0, _ui.createScreenshotWarning)();
    } else {
      $mainUI.style.display = 'block';
      $expBar.style.display = 'block';
      $actionBar.style.display = 'block';
      (0, _ui.removeScreenshotWarning)();
    }
  }
}

},{"../../utils/ui":43}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helper = require("./helper");

function screenshotMode() {
  window.addEventListener('keyup', _helper.toggleScreenshotMode);
}

var _default = {
  name: 'Screenshot Mode',
  description: 'Hookup F9 key to toggle game UI visibly for cleaner screenshots',
  run: screenshotMode
};
exports.default = _default;

},{"./helper":31}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// The last clicked UI window displays above all other UI windows
// This is useful when, for example, your inventory is near the market window,
// and you want the window and the tooltips to display above the market window.
function selectedWindowIsTop() {
  Array.from(document.querySelectorAll('.window:not(.js-is-top-initd)')).forEach($window => {
    $window.classList.add('js-is-top-initd');
    $window.addEventListener('mousedown', () => {
      // First, make the other is-top window not is-top
      const $otherWindowContainer = document.querySelector('.js-is-top');

      if ($otherWindowContainer) {
        $otherWindowContainer.classList.remove('js-is-top');
      } // Then, make our window's container (the z-index container) is-top


      $window.parentNode.classList.add('js-is-top');
    });
  });
}

var _default = {
  name: 'Make Selected Window Top',
  description: 'The UI window you click will always be displayed over other UI windows',
  run: ({
    registerOnDomChange
  }) => {
    selectedWindowIsTop(); // As windows are opened, we want to enable them to become the top window when they're clicked

    registerOnDomChange(selectedWindowIsTop);
  }
};
exports.default = _default;

},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSkillCooldownNumbers = addSkillCooldownNumbers;

var _state = require("../../utils/state");

var _misc = require("../../utils/misc");

function _getCooldownText(cd) {
  const timeBetweenCooldownChecks = cd.latestCooldownTimestamp - cd.initialCooldownTimestamp;
  const percentCompletedWithinTime = cd.initialCooldownPcntLeft - cd.latestCooldownPcntLeft;
  const secondsForOnePercent = timeBetweenCooldownChecks / percentCompletedWithinTime / 1000;
  return Math.floor(secondsForOnePercent * cd.latestCooldownPcntLeft);
}

function _handleCooldownUpdate(mutations) {
  const tempState = (0, _state.getTempState)();
  mutations.forEach(mutation => {
    if (!mutation.target.classList.contains('cd')) return;
    const $cooldownOverlay = mutation.target;
    const skillId = $cooldownOverlay.parentNode.id;
    const cooldownPercentageLeft = parseInt($cooldownOverlay.style.height);
    let cdState = tempState.cooldownNums[skillId]; // If cooldown percentage left is greater than the current initial cooldown pcnt left,
    // that means the skill cooldown counter is still tracking an old cooldown.
    // This can happen rarely if the user casts the ability the instant it comes off cooldown.
    // In this scenario, we want to reset the cooldown state.
    // If we don't reset the cooldown state, the cooldown number will be wrong because
    // `initialCooldownTime` will be from the previous cast, not the current cast.

    if (cdState.initialCooldownPcntLeft && cooldownPercentageLeft >= cdState.initialCooldownPcntLeft) {
      cdState.initialCooldownTimestamp = null;
      cdState.initialCooldownPcntLeft = null;
      cdState.latestCooldownTimestamp = null;
      cdState.latestCooldownPcntLeft = null;
      cdState.calculationCount = 0;
    }

    if (!cdState.initialCooldownTimestamp) {
      cdState.initialCooldownTimestamp = Date.now();
      cdState.initialCooldownPcntLeft = cooldownPercentageLeft;
    }

    cdState.latestCooldownTimestamp = Date.now();
    cdState.latestCooldownPcntLeft = cooldownPercentageLeft;
    cdState.calculationCount++; // Minimum number of numbers to figure out an accurate enough real cooldown number = 3
    // Set the cooldown number in the UI

    if (cdState.calculationCount > 2) {
      const $cooldownNum = $cooldownOverlay.querySelector('.js-cooldown-num');
      $cooldownNum.innerText = _getCooldownText(cdState);
    }
  });
}

function addSkillCooldownNumbers() {
  const tempState = (0, _state.getTempState)(); // Add/update cooldowns

  const $skillCooldowns = Array.from(document.querySelectorAll('#skillbar .cd:not(.js-cooldown-num-initd'));
  $skillCooldowns.forEach($cooldownOverlay => {
    $cooldownOverlay.classList.add('js-cooldown-num-initd'); // Add cooldown element to overlay

    $cooldownOverlay.appendChild((0, _misc.makeElement)({
      element: 'div',
      class: 'js-cooldown-num'
    }));
    const cooldownObserver = new MutationObserver(_handleCooldownUpdate); // Add cooldown number and mutator to state

    const skillId = $cooldownOverlay.parentNode.id;
    tempState.cooldownNums[skillId] = {
      initialCooldownTimestamp: null,
      initialCooldownPcntLeft: null,
      latestCooldownTimestamp: null,
      latestCooldownPcntLeft: null,
      calculationCount: 0
    }; // Clear preexisting observer if it exists, then set new one to state

    if (tempState.cooldownObservers[skillId]) {
      tempState.cooldownObservers[skillId].disconnect();
      delete tempState.cooldownObservers[skillId];
    }

    tempState.cooldownObservers[skillId] = cooldownObserver;
    cooldownObserver.observe($cooldownOverlay, {
      attributes: true
    });
  });
}

},{"../../utils/misc":40,"../../utils/state":42}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = require("../../utils/state");

var _helpers = require("./helpers");

function skillCooldownNumbers() {
  const tempState = (0, _state.getTempState)(); // If not initialized, initialize with initial observer

  const $skillBar = document.querySelector('#skillbar:not(.js-cooldowns-skillbar-initd');
  if (!$skillBar) return;
  $skillBar.classList.add('js-cooldowns-skillbar-initd');

  if (tempState.skillBarObserver) {
    tempState.skillBarObserver.disconnect();
    delete tempState.skillBarObserver;
  }

  tempState.skillBarObserver = new MutationObserver(_helpers.addSkillCooldownNumbers);
  tempState.skillBarObserver.observe($skillBar, {
    subtree: true,
    childList: true,
    attributes: true
  });
}

var _default = {
  name: 'Skill cooldown numbers',
  description: 'Overlays time left on cooldown over skill icons',
  run: () => {
    skillCooldownNumbers();
  }
};
exports.default = _default;

},{"../../utils/state":42,"./helpers":34}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentCharacterLvl = getCurrentCharacterLvl;
exports.getCurrentXp = getCurrentXp;
exports.getNextLevelXp = getNextLevelXp;
exports.resetXpMeterState = resetXpMeterState;
exports.msToString = msToString;

var _state = require("../../utils/state");

function getCurrentCharacterLvl() {
  return Number(document.querySelector('#ufplayer .bgmana > .left').textContent.split('Lv. ')[1]);
}

function getCurrentXp() {
  return Number(document.querySelector('#expbar .progressBar > .left').textContent.split('/')[0].replace(/,/g, '').trim());
}

function getNextLevelXp() {
  return Number(document.querySelector('#expbar .progressBar > .left').textContent.split('/')[1].replace(/,/g, '').replace('EXP', '').trim());
} // user invoked reset of xp meter stats


function resetXpMeterState() {
  const state = (0, _state.getState)();
  state.xpMeterState.xpGains = []; // array of xp deltas every second

  state.xpMeterState.averageXp = 0;
  state.xpMeterState.gainedXp = 0;
  (0, _state.saveState)();
  document.querySelector('.js-xp-time').textContent = '-:-:-';
}

function msToString(ms) {
  const pad = value => value < 10 ? `0${value}` : value;

  const hours = pad(Math.floor(ms / (1000 * 60 * 60) % 60));
  const minutes = pad(Math.floor(ms / (1000 * 60) % 60));
  const seconds = pad(Math.floor(ms / 1000 % 60));
  return `${hours}:${minutes}:${seconds}`;
}

},{"../../utils/state":42}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = require("../../utils/state");

var helpers = _interopRequireWildcard(require("./helpers"));

var _ui = require("../../utils/ui");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// TODO: Consider adding start button to start interval, and stop after X minutes of no EXP
//       Or maybe watch XP bar and start it once XP bar first moves?
// Adds XP Meter DOM icon and window, starts continuous interval to get current xp over time
function xpMeter() {
  const state = (0, _state.getState)();
  const tempState = (0, _state.getTempState)();
  (0, _ui.createXpMeter)(); // If it was open when the game last closed keep it open

  if ((0, _ui.isWindowOpen)(_ui.WindowNames.xpMeter)) {
    (0, _ui.toggleXpMeterVisibility)();
  } // Wire up icon and xpmeter window


  (0, _ui.createNavButton)('xpmeter', 'XP', 'XP Meter', _ui.toggleXpMeterVisibility);
  document.querySelector('.js-xpmeter-close-icon').addEventListener('click', _ui.toggleXpMeterVisibility);
  document.querySelector('.js-xpmeter-reset-button').addEventListener('click', helpers.resetXpMeterState);
  const currentXp = helpers.getCurrentXp();
  const currentCharLvl = helpers.getCurrentCharacterLvl();
  if (currentXp !== state.xpMeterState.currentXp) state.xpMeterState.currentXp = currentXp;
  if (currentCharLvl !== state.xpMeterState.currentLvl) state.xpMeterState.currentLvl = currentCharLvl;
  (0, _state.saveState)();
  if (tempState.xpMeterInterval) clearInterval(tempState.xpMeterInterval); // every second we run the operations for xp meter, update xps, calc delta, etc
  // TODO Cleanup: This interval may not be cleaned up if the UI mod reinitializes,
  //               e.g. user is away from tab for a while then comes back
  //               Should confirm if this is an issue, and try to fix it if possible.

  tempState.xpMeterInterval = setInterval(() => {
    if (!document.querySelector('#expbar')) {
      return;
    } // This _shouldn't_ happen, but in case it does, reset xp meter state instead of throwing error


    if (!Array.isArray(state.xpMeterState.xpGains)) {
      helpers.resetXpMeterState();
    }

    const currentXp = helpers.getCurrentXp();
    const nextLvlXp = helpers.getNextLevelXp();
    const currentLvl = helpers.getCurrentCharacterLvl(); // Only update and save state if it has changed

    const gainedXp = currentXp - state.xpMeterState.currentXp;
    const xpGains = currentXp - state.xpMeterState.currentXp;
    const averageXp = state.xpMeterState.xpGains.length > 0 ? state.xpMeterState.xpGains.reduce((a, b) => a + b, 0) / state.xpMeterState.xpGains.length : 0; // Our algorithms and session time depend on an xpGain being pushed every second, even if it is 0

    state.xpMeterState.xpGains.push(xpGains); // array of xp deltas every second

    if (gainedXp !== 0) state.xpMeterState.gainedXp += gainedXp;
    if (currentXp !== state.xpMeterState.currentXp) state.xpMeterState.currentXp = currentXp;
    if (averageXp !== state.xpMeterState.averageXp) state.xpMeterState.averageXp = averageXp;
    (0, _state.saveState)();

    if (document.querySelector('.js-xpmeter')) {
      document.querySelector('.js-xpm').textContent = parseInt((state.xpMeterState.averageXp * 60).toFixed(0)).toLocaleString();
      document.querySelector('.js-xph').textContent = parseInt((state.xpMeterState.averageXp * 60 * 60).toFixed(0)).toLocaleString();
      document.querySelector('.js-xpg').textContent = state.xpMeterState.gainedXp.toLocaleString();
      document.querySelector('.js-xpl').textContent = (nextLvlXp - currentXp).toLocaleString();
      document.querySelector('.js-xp-s-time').textContent = helpers.msToString(state.xpMeterState.xpGains.length * 1000); // need a positive integer for averageXp to calc time left

      if (state.xpMeterState.averageXp > 0) document.querySelector('.js-xp-time').textContent = helpers.msToString((nextLvlXp - currentXp) / state.xpMeterState.averageXp * 1000);
    }

    if (state.xpMeterState.currentLvl < currentLvl) {
      helpers.resetXpMeterState();
      state.xpMeterState.currentLvl = currentLvl;
      (0, _state.saveState)();
    }
  }, 1000);
}

var _default = {
  name: 'XP Meter',
  description: "Tracks your XP/minute and displays how much XP you're getting and lets you know how long until you level up",
  run: xpMeter
};
exports.default = _default;

},{"../../utils/state":42,"../../utils/ui":43,"./helpers":36}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterAllChat = filterAllChat;
exports.whisperPlayer = whisperPlayer;
exports.partyPlayer = partyPlayer;
exports.addChatMessage = addChatMessage;

var _state = require("./state");

var _misc = require("./misc");

// Filters all chat based on custom filters
function filterAllChat() {
  const state = (0, _state.getState)(); // Blocked user filter

  Object.keys(state.blockList).forEach(blockedName => {
    // Get the `.name` elements from the blocked user, if we haven't already hidden their messages
    const $blockedChatNames = Array.from(document.querySelectorAll(`[data-chat-name="${blockedName}"]:not(.js-line-blocked)`)); // Hide each of their messages

    $blockedChatNames.forEach($name => {
      // Add the class name to $name so we can track whether it's been hidden in our CSS selector $blockedChatNames
      $name.classList.add('js-line-blocked');
      const $line = $name.parentNode.parentNode.parentNode; // Add the class name to $line so we can visibly hide the entire chat line

      $line.classList.add('js-line-blocked');
    });
  });
}

function enterTextIntoChat(text) {
  // Open chat input
  const enterEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  });
  document.body.dispatchEvent(enterEvent); // Place text into chat

  const $input = document.querySelector('#chatinput input');
  $input.value = text; // Get chat input to recognize slash commands and change the channel
  // by triggering the `input` event.
  // (Did some debugging to figure out the channel only changes when the
  //  svelte `input` event listener exists.)

  const inputEvent = new KeyboardEvent('input', {
    bubbles: true,
    cancelable: true
  });
  $input.dispatchEvent(inputEvent);
}

function submitChat() {
  const $input = document.querySelector('#chatinput input');
  const kbEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  });
  $input.dispatchEvent(kbEvent);
} // Automated chat command helpers
// (We've been OK'd to do these by the dev - all automation like this should receive approval from the dev)


function whisperPlayer(playerName) {
  enterTextIntoChat(`/${playerName} `);
}

function partyPlayer(playerName) {
  enterTextIntoChat(`/partyinvite ${playerName}`);
  submitChat();
} // Pushes message to chat
// TODO: The margins for the message are off slightly compared to other messages - why?


function addChatMessage(text) {
  const newMessageHTML = `
    <div class="linewrap svelte-1vrlsr3">
        <span class="time svelte-1vrlsr3">00.00</span>
        <span class="textuimod content svelte-1vrlsr3">
        <span class="capitalize channel svelte-1vrlsr3">UIMod</span>
        </span>
        <span class="svelte-1vrlsr3">${text}</span>
    </div>
    `;
  const element = (0, _misc.makeElement)({
    element: 'article',
    class: 'line svelte-1vrlsr3',
    content: newMessageHTML
  });
  const $chat = document.querySelector('#chat');
  $chat.appendChild(element); // Scroll to bottom of chat

  $chat.scrollTop = $chat.scrollHeight;
}

},{"./misc":40,"./state":42}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTooltipContent = getTooltipContent;
exports.getWindow = getWindow;

var _state = require("./state");

// Gets the node of a tooltip for any element, emulates shift keypress to get tooltip with quality details
// Must be `await`'d to use, e.g. `await getTooltipContent($element)`
// Optionally pass `getDetailedTooltips` as `true` if you want detailed tooltips by holding shift
// ^ is laggier, do not use when looking at more than one item
async function getTooltipContent($elementToHoverOver, getDetailedTooltips) {
  const tempState = (0, _state.getTempState)(); // Emulate holding down shift when getting tooltip
  // Don't need to emulate if user is already holding it down

  if (getDetailedTooltips && !tempState.keyModifiers.shift) {
    // Set this so the keymodifiers mod knows our shift press shouldn't be tracked in tempState
    tempState.gettingTooltipContentShiftPress = true;
    document.body.dispatchEvent(new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Shift'
    }));
  }

  $elementToHoverOver.dispatchEvent(new Event('pointerenter'));
  const closeTooltipPromise = new Promise(resolve => setTimeout(() => {
    const resolveWithTooltip = () => {
      // If there is no slotdescription at this point, the item element passed very likely has no tooltip
      const $tooltip = document.querySelector('.slotdescription');

      if (!$tooltip || !$tooltip.cloneNode) {
        resolve(false);
      } else {
        resolve($tooltip.cloneNode(true));
      }

      if (tempState.gettingTooltipContentShiftPress) {
        // Release our emulated shift press
        document.body.dispatchEvent(new KeyboardEvent('keyup', {
          bubbles: true,
          cancelable: true,
          key: 'Shift'
        }));
        tempState.gettingTooltipContentShiftPress = false;
      }

      $elementToHoverOver.dispatchEvent(new Event('pointerleave'));
    }; // Very occasionally the 0ms wait time on our timeout doesn't show the tooltip,
    // so we set a second timeout to account for this. Not the most perfect user experience,
    // but it rarely hapens, and it's better than getting an error.


    if (getDetailedTooltips && !document.querySelector('.slotdescription')) {
      setTimeout(resolveWithTooltip, 1);
    } else {
      resolveWithTooltip();
    }
  }, 0));
  const $tooltip = await closeTooltipPromise;
  return $tooltip;
} // Use this to get a specific window, rather than using the svelte class, which is not preferable
// Only returns window if it is visible. Some windows are kept in DOM at all times, but are not visible until opened, e.g. Inventory.
// To get window even if it isn't visible (but is still in DOM), pass `true` to second argument


function getWindow(windowTitle, getInvisibleWindow) {
  const $specificWindowTitle = Array.from(document.querySelectorAll('.window [name="title"]')).find($windowTitle => $windowTitle.textContent.toLowerCase() === windowTitle.toLowerCase());
  const $window = $specificWindowTitle ? $specificWindowTitle.parentNode.parentNode.parentNode : $specificWindowTitle; // If window is invisible, don't return it unless we are overriding with `getInvisibleWindow`

  if (!$window || !$window.offsetParent && !getInvisibleWindow) {
    return;
  } else {
    return $specificWindowTitle ? $specificWindowTitle.parentNode.parentNode.parentNode : $specificWindowTitle;
  }
}

},{"./state":42}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeElement = makeElement;
exports.debounce = debounce;
exports.uuid = uuid;
exports.deepClone = deepClone;

// Nicer impl to create elements in one method call
function makeElement(args) {
  const $node = document.createElement(args.element);
  if (args.class) $node.className = args.class;
  if (args.content) $node.innerHTML = args.content;
  if (args.src) $node.src = args.src;
  if (args.type) $node.type = args.type;
  if (args.placeholder) $node.placeholder = args.placeholder;
  return $node;
} // Credit: David Walsh


function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;

    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
} // Credit: https://gist.github.com/jcxplorer/823878
// Generate random UUID string


function uuid() {
  var uuid = '',
      i,
      random;

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += '-';
    }

    uuid += (i == 12 ? 4 : i == 16 ? random & 3 | 8 : random).toString(16);
  }

  return uuid;
} // Credit: http://voidcanvas.com/clone-an-object-in-vanilla-js-in-depth/


function deepClone(obj) {
  //in case of premitives
  if (obj === null || typeof obj !== 'object') {
    return obj;
  } //date objects should be


  if (obj instanceof Date) {
    return new Date(obj.getTime());
  } //handle Array


  if (Array.isArray(obj)) {
    var clonedArr = [];
    obj.forEach(function (element) {
      clonedArr.push(deepClone(element));
    });
    return clonedArr;
  } //lastly, handle objects


  let clonedObj = new obj.constructor();

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      clonedObj[prop] = deepClone(obj[prop]);
    }
  }

  return clonedObj;
}

},{}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.friendPlayer = friendPlayer;
exports.unfriendPlayer = unfriendPlayer;
exports.blockPlayer = blockPlayer;
exports.unblockPlayer = unblockPlayer;

var _state = require("./state");

var chat = _interopRequireWildcard(require("./chat"));

var ui = _interopRequireWildcard(require("./ui"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function friendPlayer(playerName) {
  const state = (0, _state.getState)();

  if (state.friendsList[playerName]) {
    return;
  }

  state.friendsList[playerName] = true;
  chat.addChatMessage(`${playerName} has been added to your friends list.`);
  (0, _state.saveState)(); // If UI is open remake it with new changes

  if (ui.isWindowOpen(ui.WindowNames.friendsList)) {
    ui.removeFriendsList();
    ui.createFriendsList();
  }
}

function unfriendPlayer(playerName) {
  const state = (0, _state.getState)();

  if (!state.friendsList[playerName]) {
    return;
  }

  delete state.friendsList[playerName];
  delete state.friendNotes[playerName];
  chat.addChatMessage(`${playerName} is no longer on your friends list.`);
  (0, _state.saveState)(); // If UI is open remake it with new changes

  if (ui.isWindowOpen(ui.WindowNames.friendsList)) {
    ui.removeFriendsList();
    ui.createFriendsList();
  }
} // Adds player to block list, to be filtered out of chat


function blockPlayer(playerName) {
  const state = (0, _state.getState)();

  if (state.blockList[playerName]) {
    return;
  }

  state.blockList[playerName] = true;
  chat.filterAllChat();
  chat.addChatMessage(`${playerName} has been blocked.`);
  (0, _state.saveState)(); // If UI is open remake it with new changes

  if (ui.isWindowOpen(ui.WindowNames.blockList)) {
    ui.removeBlockList();
    ui.createBlockList();
  }
} // Removes player from block list and makes their messages visible again


function unblockPlayer(playerName) {
  const state = (0, _state.getState)();
  delete state.blockList[playerName];
  chat.addChatMessage(`${playerName} has been unblocked.`);
  (0, _state.saveState)(); // Make messages visible again

  const $chatNames = Array.from(document.querySelectorAll(`.js-line-blocked[data-chat-name="${playerName}"]`));
  $chatNames.forEach($name => {
    $name.classList.remove('js-line-blocked');
    const $line = $name.parentNode.parentNode.parentNode;
    $line.classList.remove('js-line-blocked');
  });
}

},{"./chat":38,"./state":42,"./ui":43}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getState = getState;
exports.getTempState = getTempState;
exports.saveState = saveState;
exports.loadState = loadState;

var _version = require("./version");

const STORAGE_STATE_KEY = 'hordesio-uimodsakaiyo-state';
let state = {
  breakingVersion: _version.BREAKING_VERSION,
  windowsPos: {},
  blockList: {},
  friendsList: {},
  mapOpacity: 70,
  // e.g. 70 = opacity: 0.7
  friendNotes: {},
  chatTabs: [],
  xpMeterState: {
    currentXp: 0,
    xpGains: [],
    // array of xp deltas every second
    averageXp: 0,
    gainedXp: 0,
    currentLvl: 0
  },
  openWindows: {
    friendsList: false,
    blockList: false,
    xpMeter: false,
    merchant: false
  },
  clanLastActiveMembers: {},
  lockedItemSlots: []
}; // tempState is saved only between page refreshes.

const tempState = {
  // The last name clicked in chat
  chatName: null,
  lastMapWidth: 0,
  lastMapHeight: 0,
  xpMeterInterval: null,
  // tracks the interval for fetching xp data
  keyModifiers: {
    shift: false,
    control: false,
    alt: false
  },
  // set by _keyModifiers mod
  cooldownNums: {},
  cooldownObservers: {}
};

function getState() {
  return state;
}

function getTempState() {
  return tempState;
}

function saveState() {
  localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(state));
}

function loadState() {
  const storedStateJson = localStorage.getItem(STORAGE_STATE_KEY);

  if (storedStateJson) {
    const storedState = JSON.parse(storedStateJson);

    if (storedState.breakingVersion !== _version.BREAKING_VERSION) {
      localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(state));
      return;
    }

    for (let [key, value] of Object.entries(storedState)) {
      state[key] = value;
    }
  }
}

},{"./version":44}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBlockList = createBlockList;
exports.removeBlockList = removeBlockList;
exports.createFriendsList = createFriendsList;
exports.removeFriendsList = removeFriendsList;
exports.toggleFriendsList = toggleFriendsList;
exports.toggleXpMeterVisibility = toggleXpMeterVisibility;
exports.createXpMeter = createXpMeter;
exports.resetUiPositions = resetUiPositions;
exports.setWindowOpen = setWindowOpen;
exports.setWindowClosed = setWindowClosed;
exports.isWindowOpen = isWindowOpen;
exports.createScreenshotWarning = createScreenshotWarning;
exports.removeScreenshotWarning = removeScreenshotWarning;
exports.createNavButton = createNavButton;
exports.WindowNames = void 0;

var _state = require("./state");

var _misc = require("./misc");

var chat = _interopRequireWildcard(require("./chat"));

var player = _interopRequireWildcard(require("./player"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const WindowNames = {
  friendsList: 'friendsList',
  blockList: 'blockList',
  xpMeter: 'xpMeter',
  merchant: 'merchant',
  clan: 'clan',
  stash: 'stash',
  inventory: 'inventory'
};
exports.WindowNames = WindowNames;

function createBlockList() {
  const state = (0, _state.getState)();
  let blockedPlayersHTML = '';
  Object.keys(state.blockList).sort().forEach(blockedName => {
    blockedPlayersHTML += `
			<div data-player-name="${blockedName}">${blockedName}</div>
			<div class="btn orange js-unblock-player" data-player-name="${blockedName}">Unblock player</div>
		`;
  });
  const customSettingsHTML = `
		<h3 class="textprimary">Blocked players</h3>
		<div class="settings uimod-settings">${blockedPlayersHTML}</div>
		<p></p>
		<div class="btn purp js-close-custom-settings">Close</div>
	`;
  const $customSettings = (0, _misc.makeElement)({
    element: 'div',
    class: 'menu panel-black uimod-custom-window js-blocked-list',
    content: customSettingsHTML
  });
  document.body.appendChild($customSettings);
  setWindowOpen(WindowNames.blockList); // Wire up all the unblock buttons

  Array.from(document.querySelectorAll('.js-unblock-player')).forEach($button => {
    $button.addEventListener('click', clickEvent => {
      const name = clickEvent.target.getAttribute('data-player-name');
      player.unblockPlayer(name); // Remove the blocked player from the list

      Array.from(document.querySelectorAll(`.js-blocked-list [data-player-name="${name}"]`)).forEach($element => {
        $element.parentNode.removeChild($element);
      });
    });
  }); // And the close button for our custom UI

  document.querySelector('.js-close-custom-settings').addEventListener('click', removeBlockList);
}

function removeBlockList() {
  const $customSettingsWindow = document.querySelector('.js-blocked-list');
  $customSettingsWindow.parentNode.removeChild($customSettingsWindow);
  setWindowClosed(WindowNames.blockList);
}

function createFriendsList() {
  const state = (0, _state.getState)();

  if (document.querySelector('.js-friends-list')) {
    // Don't open the friends list twice.
    return;
  }

  let friendsListHTML = '';
  Object.keys(state.friendsList).sort().forEach(friendName => {
    friendsListHTML += `
			<div data-player-name="${friendName}">${friendName}</div>
			<div class="btn blue js-whisper-player" data-player-name="${friendName}">Whisper</div>
			<div class="btn blue js-party-player" data-player-name="${friendName}">Party invite</div>
			<div class="btn orange js-unfriend-player" data-player-name="${friendName}">X</div>
			<input type="text" class="js-friend-note" placeholder="You can add a note here" data-player-name="${friendName}" value="${state.friendNotes[friendName] || ''}"></input>
		`;
  });
  const customFriendsWindowHTML = `
		<div class="titleframe uimod-friends-list-helper">
				<div class="textprimary title uimod-friends-list-helper">
					<div name="title">Friends list</div>
				</div>
				<img src="/assets/ui/icons/cross.svg?v=3282286" class="js-close-custom-friends-list btn black svgicon">
		</div>
		<div class="uimod-friends-intro">To add someone as a friend, click their name in chat and then click Friend :)</div>
		<div class="uimod-friends">${friendsListHTML}</div>
	`;
  const $customFriendsList = (0, _misc.makeElement)({
    element: 'div',
    class: 'menu window panel-black js-friends-list uimod-custom-window',
    content: customFriendsWindowHTML
  });
  document.body.appendChild($customFriendsList);
  setWindowOpen(WindowNames.friendsList); // Wire up the buttons

  Array.from(document.querySelectorAll('.js-whisper-player')).forEach($button => {
    $button.addEventListener('click', clickEvent => {
      const name = clickEvent.target.getAttribute('data-player-name');
      chat.whisperPlayer(name);
    });
  });
  Array.from(document.querySelectorAll('.js-party-player')).forEach($button => {
    $button.addEventListener('click', clickEvent => {
      const name = clickEvent.target.getAttribute('data-player-name');
      chat.partyPlayer(name);
    });
  });
  Array.from(document.querySelectorAll('.js-unfriend-player')).forEach($button => {
    $button.addEventListener('click', clickEvent => {
      const name = clickEvent.target.getAttribute('data-player-name');
      player.unfriendPlayer(name); // Remove the blocked player from the list

      Array.from(document.querySelectorAll(`.js-friends-list [data-player-name="${name}"]`)).forEach($element => {
        $element.parentNode.removeChild($element);
      });
    });
  });
  Array.from(document.querySelectorAll('.js-friend-note')).forEach($element => {
    $element.addEventListener('change', clickEvent => {
      const name = clickEvent.target.getAttribute('data-player-name');
      state.friendNotes[name] = clickEvent.target.value;
    });
  }); // The close button for our custom UI

  document.querySelector('.js-close-custom-friends-list').addEventListener('click', removeFriendsList);
}

function removeFriendsList() {
  const $friendsListWindow = document.querySelector('.js-friends-list');
  $friendsListWindow.parentNode.removeChild($friendsListWindow);
  setWindowClosed(WindowNames.friendsList);
}

function toggleFriendsList() {
  if (isWindowOpen(WindowNames.friendsList)) {
    removeFriendsList();
  } else {
    createFriendsList();
  }
}

function toggleXpMeterVisibility() {
  const xpMeterContainer = document.querySelector('.js-xpmeter'); // Make it if it doesn't exist for some reason

  if (!xpMeterContainer) {
    createXpMeter();
  }

  xpMeterContainer.style.display = xpMeterContainer.style.display === 'none' ? 'block' : 'none'; // Save whether xpMeter is currently open or closed in the state

  if (xpMeterContainer.style.display === 'none') {
    setWindowClosed(WindowNames.xpMeter);
  } else {
    setWindowOpen(WindowNames.xpMeter);
  }
}

function createXpMeter() {
  const $layoutContainer = document.querySelector('body > div.layout > div.container:nth-child(1)');
  const xpMeterHTMLString = `
        <div class="l-corner-lr container uimod-xpmeter-1 js-xpmeter" style="display: none">
            <div class="window panel-black uimod-xpmeter-2">
			<div class="titleframe uimod-xpmeter-2">
			<img src="/assets/ui/icons/trophy.svg?v=3282286" class="titleicon svgicon uimod-xpmeter-2">
				<div class="textprimary title uimod-xpmeter-2">
					<div name="title">Experience / XP</div>
				</div>
				<img src="/assets/ui/icons/cross.svg?v=3282286" class="js-xpmeter-close-icon btn black svgicon">
		</div>
                <div class="slot uimod-xpmeter-2" style="">
                    <div class="wrapper uimod-xpmeter-1">
                        <div class="bar  uimod-xpmeter-3" style="z-index: 0;">
                            <div class="progressBar bgc1 uimod-xpmeter-3" style="width: 100%; font-size: 1em;">
                                <span class="left uimod-xpmeter-3">XP per minute:</span>
                                <span class="right uimod-xpmeter-3 js-xpm">-</span>
                            </div>
                            <div class="progressBar bgc1 uimod-xpmeter-3" style="width: 100%; font-size: 1em;">
                                <span class="left uimod-xpmeter-3">XP per hour:</span>
                                <span class="right uimod-xpmeter-3 js-xph">-</span>
                            </div>
                            <div class="progressBar bgc1 uimod-xpmeter-3" style="width: 100%; font-size: 1em;">
                                <span class="left uimod-xpmeter-3">XP Gained:</span>
                                <span class="right uimod-xpmeter-3 js-xpg">-</span>
                            </div>
                            <div class="progressBar bgc1 uimod-xpmeter-3" style="width: 100%; font-size: 1em;">
                                <span class="left uimod-xpmeter-3">XP Left:</span>
                                <span class="right uimod-xpmeter-3 js-xpl">-</span>
                            </div>
                            <div class="progressBar bgc1 uimod-xpmeter-3" style="width: 100%; font-size: 1em;">
                                <span class="left uimod-xpmeter-3">Session Time: </span>
                                <span class="right uimod-xpmeter-3 js-xp-s-time">-</span>
                            </div>
                            <div class="progressBar bgc1 uimod-xpmeter-3" style="width: 100%; font-size: 1em;">
                                <span class="left uimod-xpmeter-3">Time to lvl: </span>
                                <span class="right uimod-xpmeter-3 js-xp-time">-</span>
                            </div>
                        </div>
                    </div>
                    <div class="grid buttons marg-top uimod-xpmeter-1 js-xpmeter-reset-button">
                        <div class="btn grey">Reset</div>
                    </div>
                </div>
            </div>
        </div>
    `;
  const $xpMeterElement = (0, _misc.makeElement)({
    element: 'div',
    content: xpMeterHTMLString.trim()
  });
  $layoutContainer.appendChild($xpMeterElement.firstChild);
}

function resetUiPositions() {
  const state = (0, _state.getState)();
  state.windowsPos = {};
  (0, _state.saveState)();
  chat.addChatMessage('Please refresh the page for the reset frame & window positions to take effect.');
}

function createScreenshotWarning() {
  // If it already exists kill it so we can remake it with a fresh fadeout
  if (document.querySelector('js-screenshot-warning')) {
    removeScreenshotWarning();
  }

  const $screenshotWarningContainer = (0, _misc.makeElement)({
    element: 'span',
    class: 'js-screenshot-warning uimod-screenshot-warning-container'
  });
  const $screenshotWarning = (0, _misc.makeElement)({
    element: 'span',
    class: 'uimod-screenshot-warning',
    content: 'Press F9 to exit screenshot mode'
  });
  $screenshotWarningContainer.appendChild($screenshotWarning);
  document.body.appendChild($screenshotWarningContainer);
  setTimeout(() => {
    $screenshotWarningContainer.classList.add('uimod-screenshot-warning-fadeout');
  }, 3000);
}

function removeScreenshotWarning() {
  const $screenshotWarning = document.querySelector('.js-screenshot-warning'); // If it's already removed for some reason don't bother trying to remove it

  if (!$screenshotWarning) {
    return;
  }

  $screenshotWarning.parentNode.removeChild($screenshotWarning);
}

function createNavButton(shortname, icon, tooltip, callback) {
  const iconClass = 'js-' + shortname + '-icon';
  const tooltipClass = 'js-' + shortname + '-tooltip'; // Create the icon

  const $newIcon = (0, _misc.makeElement)({
    element: 'div',
    class: 'btn border black ' + iconClass,
    content: icon
  }); // Add the icon to the right of Elixir icon

  const $elixirIcon = document.querySelector('#sysgem');
  $elixirIcon.parentNode.insertBefore($newIcon, $elixirIcon.nextSibling); // Add tooltip onhover

  $newIcon.addEventListener('mouseenter', () => {
    const $newTooltip = (0, _misc.makeElement)({
      element: 'div',
      class: 'btn border grey ' + tooltipClass,
      content: tooltip
    }); // Add the tooltip to the left of Elixir icon

    $elixirIcon.parentNode.insertBefore($newTooltip, $elixirIcon);
  }); // Remove tooltip after hover

  $newIcon.addEventListener('mouseleave', () => {
    const $newTooltip = document.querySelector('.' + tooltipClass);
    $newTooltip.parentNode.removeChild($newTooltip);
  }); // Call the appropriate function when clicked

  document.querySelector('.' + iconClass).addEventListener('click', callback);
} // state.openWindows should always only be managed by this file
// Sometimes we want to track when a UI window we don't control is opened/closed
// We use these methods to help facilitate that
// To use these methods correctly, you need to track when the window opens _and_ when it closes
// If you don't _need_ to do both those things, then don't do that, and don't use these methods


function setWindowOpen(windowName) {
  const state = (0, _state.getState)();
  state.openWindows[windowName] = true;
  (0, _state.saveState)();
}

function setWindowClosed(windowName) {
  const state = (0, _state.getState)();
  state.openWindows[windowName] = false;
  (0, _state.saveState)();
}

function isWindowOpen(windowName) {
  const state = (0, _state.getState)();
  return state.openWindows[windowName];
}

},{"./chat":38,"./misc":40,"./player":41,"./state":42}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VERSION = exports.BREAKING_VERSION = void 0;
// If this version is different from the user's stored state,
// e.g. they have upgraded the version of this script and there are breaking changes,
// then their stored state will be deleted.
const BREAKING_VERSION = 1; // Used for initialization message in chat, and userscript version

exports.BREAKING_VERSION = BREAKING_VERSION;
const VERSION = '1.3.2';
exports.VERSION = VERSION;

},{}]},{},[1]);
