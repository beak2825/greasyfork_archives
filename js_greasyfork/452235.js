// ==UserScript==
// @name        🐭️ MouseHunt - Taller Windows
// @description Makes all the windows taller, so you can see more of the content without scrolling.
// @version     2.1.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/452235/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Taller%20Windows.user.js
// @updateURL https://update.greasyfork.org/scripts/452235/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Taller%20Windows.meta.js
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

  // src/modules/taller-windows/index.js
  var taller_windows_exports = {};
  __export(taller_windows_exports, {
    default: () => taller_windows_default
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

  // src/modules/taller-windows/styles.css
  var styles_default = ".springHuntHUD-popup-allEggs,.adventureBookPopup-titleContent,.convertibleOpenView-itemContainer,.marketplaceView-browse-content,.MHCheckoutAllRewardsPageView,.treasureMapListingsView-tableView,.treasureMapView-block-content.tall,.treasureMapView-blockWrapper.tall .treasureMapView-block-content,#messengerUINotification .notificationHeader,#supplytransfer .drawer .listContainer,#supplytransfer .drawer .tabContent,#supplytransfer .drawer{height:auto;max-height:75vh}#messengerUINotification .notificationMessageList,.treasureMapView-block-content,.treasureMapView-block-content.halfHeight{height:auto;max-height:55vh}#supplytransfer .drawer{padding-bottom:75px}.adventureBookPopup-titleContent{max-height:unset}.treasureMapDialogView.limitHeight .treasureMapView-block-content,.treasureMapDialogView.limitHeight .treasureMapDialogView-content{max-height:75vh}.treasureMapDialogView.wide.limitHeight{transform:translate(-50%,-100px)}.giftSelectorView-inbox-giftContainer,#overlayPopup .giftSelectorView-scroller{height:auto;min-height:300px;max-height:65vh}#overlayPopup.giftSelectorViewPopup{top:50px!important}.springHuntHUD-popup-regionContainer{display:contents}#overlayPopup .imgArray{min-height:105px;max-height:500px}.floatingIslandsWorkshop-parts-content{height:auto;background:linear-gradient(255deg,#fbf3b0 75%,#fdfcc7);border-bottom-right-radius:10px;border-bottom-left-radius:10px;outline:10px solid #fbf3ae;box-shadow:0 2px 1px 11px #b9570e,0 3px 2px 12px #985316,0 4px 1px 13px #84420f,0 5px 1px 14px #c47728,0 6px 1px 15px #cd7f2c,0 7px 1px 16px #e19439}.floatingIslandsWorkshop-stabilizer{top:325px;right:78px;left:unset;border:none;transform:rotate(90deg)}.floatingIslandsWorkshop-stabilizer label{color:#848383}.floatingIslandsWorkshop-part-name{position:absolute;top:0;right:10px;left:0}.floatingIslandsWorkshop-part-border{margin-top:18px;border-top-left-radius:0;border-top-right-radius:0}.floatingIslandsWorkshop-part-state a.mousehuntActionButton.tiny.lightBlue{font-size:9px;background:#fefad7;box-shadow:none}.floatingIslandsWorkshop-part-state a.mousehuntActionButton.tiny.lightBlue:before{background:#fff9c3;box-shadow:0 0 10px #f3ecb2 inset}.floatingIslandsWorkshop-parts-total{margin-right:15px}.floatingIslandsWorkshop-partsContainer{background-color:#fbf3ae;border-radius:5px}.floatingIslandsWorkshop-part.active .floatingIslandsWorkshop-part-border{background-color:#90cefa}.floatingIslandsWorkshop-part-state .mousehuntActionButton.tiny.selected{box-shadow:none}.floatingIslandsWorkshop-part-actions{background-color:#c48648}.floatingIslandsWorkshop-part.active .floatingIslandsWorkshop-part-border:after{border:none}.select2-results{max-height:50vh}.treasureMapDialogView.limitHeight .treasureMapDialogView-content{max-height:unset}.giftSelectorView-scroller{height:auto}.mh-gift-buttons-clone-wrapper{max-height:calc(75vh - 175px)}.mh-ui-goals-block .treasureMapView-block-content{max-height:75vh}.mh-ui-environments-block .treasureMapView-block-content{max-height:68vh}\n";

  // src/modules/taller-windows/index.js
  var init = () => __async(void 0, null, function* () {
    addStyles(styles_default, "taller-windows");
  });
  var taller_windows_default = {
    id: "taller-windows",
    name: "Taller Windows",
    type: "feature",
    default: true,
    description: "Make popup and dialog windows taller.",
    load: init
  };
  return __toCommonJS(taller_windows_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('Taller Windows', 'https://greasyfork.org/en/scripts/452235-mousehunt-taller-windows');
