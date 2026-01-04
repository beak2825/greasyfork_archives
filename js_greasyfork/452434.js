// ==UserScript==
// @name        🐭️ MouseHunt - No Share Buttons
// @description Remove the "Share" buttons that prompt you to share on Facebook.
// @version     2.1.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/452434/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20No%20Share%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/452434/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20No%20Share%20Buttons.meta.js
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

  // src/modules/hide-share/index.js
  var hide_share_exports = {};
  __export(hide_share_exports, {
    default: () => hide_share_default
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

  // src/utils/messages.js
  hadAddedErrorStyles = false;

  // src/modules/hide-share/styles.css
  var styles_default = '.actionportfolio,.canShare .larryTip,.journalactions a[data-share-type=journal],.journalactions a[data-type=journal],.pageSidebarView .fb-page,.socialLink,*[src="https://www.mousehuntgame.com//images/ui/buttons/share_green.gif"],#jsDialog-publishToOwnWall,.publishToWall,#OnboardArrow.onboardPopup.top .canShare .larryTip img{display:none}#OnboardArrow.onboardPopup.canShare .shareButton{display:none!important}#OnboardArrow.onboardPopup.canShare .closeButton{right:43px;left:unset;z-index:2}#OnboardArrow.onboardPopup.top .canShare .larryTip{color:#fff;background-color:#fff;border-color:#fff}\n';

  // src/modules/hide-share/index.js
  var init = () => __async(void 0, null, function* () {
    addStyles(styles_default, "no-share");
  });
  var hide_share_default = {
    id: "no-share",
    name: "Hide Share Buttons",
    type: "element-hiding",
    default: true,
    description: "Hides the share buttons.",
    load: init
  };
  return __toCommonJS(hide_share_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('No Share Buttons', 'https://greasyfork.org/en/scripts/452434-mousehunt-no-share-buttons');
