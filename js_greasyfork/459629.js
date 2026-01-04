// ==UserScript==
// @name        🐭️ MouseHunt - Fancy King's Reward
// @description Clicks the 'Resume Hunting' button after solving a King's Reward.
// @version     3.1.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/459629/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Fancy%20King%27s%20Reward.user.js
// @updateURL https://update.greasyfork.org/scripts/459629/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Fancy%20King%27s%20Reward.meta.js
// ==/UserScript==

var mhui = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/modules/better-kings-reward/index.js
  var better_kings_reward_exports = {};
  __export(better_kings_reward_exports, {
    default: () => better_kings_reward_default
  });

  // src/utils/event-registry.js
  var eventsAdded = {};
  var onEvent = (event, callback, remove = false) => {
    if (!eventRegistry) {
      return;
    }
    const id = `${event}-${remove.toString()}-${callback.toString()}`;
    if (eventsAdded[id]) {
      return;
    }
    eventsAdded[id] = true;
    eventRegistry.addEventListener(event, callback, null, remove);
  };

  // src/utils/styles.js
  var addModuleStyles = (styles, identifier = "mh-improved-styles", replace = false) => {
    const existingStyles = document.querySelector(`#${identifier}`);
    styles = Array.isArray(styles) ? styles.join("\n") : styles;
    if (existingStyles) {
      if (replace) {
        existingStyles.innerHTML = styles;
      } else {
        existingStyles.innerHTML += styles;
      }
      return existingStyles;
    }
    const style = document.createElement("style");
    style.id = identifier;
    style.innerHTML = styles;
    document.head.append(style);
    return style;
  };
  var addStyles = (styles, module = false, identifier = "mh-improved-styles") => {
    if (!module) {
      throw new Error("Module ID is required for adding module styles.", module);
    }
    const key = `${identifier}-${module}`;
    let stylesEl = addModuleStyles(styles, key, true);
    onEvent(`mh-improved-settings-changed-${module}`, (enabled) => {
      if (enabled) {
        stylesEl = addModuleStyles(styles, key, true);
      } else if (stylesEl) {
        stylesEl.remove();
      }
    });
  };

  // src/utils/events.js
  var requestCallbacks = {};
  var onRequestHolder = null;
  var onRequest = (url = null, callback = null, skipSuccess = false, ignore = []) => {
    url = "*" === url ? "*" : `managers/ajax/${url}`;
    if (ignore.includes(url)) {
      return;
    }
    if (!callback) {
      return;
    }
    if (!requestCallbacks[url]) {
      requestCallbacks[url] = [];
    }
    requestCallbacks[url].push({
      callback,
      skipSuccess
    });
    if (onRequestHolder) {
      return;
    }
    const req = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
      this.addEventListener("load", function() {
        if (this.responseText) {
          let response = {};
          try {
            response = JSON.parse(this.responseText);
          } catch (e) {
            return;
          }
          Object.keys(requestCallbacks).forEach((key) => {
            if ("*" === key || this.responseURL.includes(key)) {
              requestCallbacks[key].forEach((item) => {
                if (item.callback && typeof item.callback === "function" && (item.skipSuccess || (response == null ? void 0 : response.success))) {
                  item.callback(response);
                }
              });
            }
          });
        }
      });
      Reflect.apply(req, this, arguments);
    };
    onRequestHolder = true;
  };

  // src/utils/messages.js
  hadAddedErrorStyles = false;

  // src/modules/better-kings-reward/styles.css
  var styles_default = ".puzzleView__imageContainer{background-color:transparent;border-color:#73332a;border-width:1px}.puzzleView__image img{filter:hue-rotate(333deg);transform:scale(1.3) translate(-10px,5px);transform-origin:left}.puzzleView__requestNewPuzzleButton{background-color:#a35721;opacity:.3;transition:opacity .2s ease-in-out}.puzzleView__requestNewPuzzleButton:hover,.puzzleView__requestNewPuzzleButton:focus{border-color:transparent;opacity:1}.puzzleView__requestNewPuzzleButtonIcon{filter:invert(1);opacity:.8}input.puzzleView__code{font-size:28px;letter-spacing:8px}\n";

  // src/modules/better-kings-reward/index.js
  var honk = () => __async(void 0, null, function* () {
    const horn = document.querySelector(".huntersHornView__horn--ready");
    if (!horn) {
      return;
    }
    horn.dispatchEvent(new MouseEvent("mousedown", {
      bubbles: true
    }));
    yield new Promise((resolve) => setTimeout(resolve, 250));
    horn.dispatchEvent(new MouseEvent("mouseup", {
      bubbles: true
    }));
  });
  var continueOnKingsReward = (req) => {
    if (req.success && req.puzzle_reward) {
      const resume = document.querySelector(".puzzleView__resumeButton");
      if (resume) {
        resume.click();
        setTimeout(honk, 250);
      }
    }
  };
  var initiateKingsReward = () => {
    const reward = document.querySelector(".huntersHornMessageView huntersHornMessageView--puzzle .huntersHornMessageView__action");
    if (reward) {
      reward.click();
    }
  };
  var startKingsReward = () => {
    const rewardStart = document.querySelector(".huntersHornMessageView--puzzle .huntersHornMessageView__action");
    if (rewardStart) {
      rewardStart.click();
    }
    setTimeout(() => {
      const puzzle = document.querySelector(".puzzleView__code");
      if (puzzle) {
        puzzle.focus();
      }
    }, 500);
  };
  var init = () => __async(void 0, null, function* () {
    addStyles(styles_default, "better-kings-reward");
    onRequest("turns/activeturn.php", initiateKingsReward, true);
    onRequest("users/puzzle.php", continueOnKingsReward, true);
    onRequest("*", startKingsReward);
    startKingsReward();
  });
  var better_kings_reward_default = {
    id: "better-kings-reward",
    name: "Better King's Reward",
    type: "better",
    default: true,
    description: "Updates the style of the King's Reward slightly, automatically closes the success message",
    load: init
  };
  return __toCommonJS(better_kings_reward_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('Fancy King\'s Reward', 'https://greasyfork.org/en/scripts/459629-mousehunt-fancy-king-s-reward');
