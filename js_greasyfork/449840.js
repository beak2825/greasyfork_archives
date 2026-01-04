// ==UserScript==
// @name        🐭️ MouseHunt - Metric
// @description Convert mice weight to metric.
// @version     2.1.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/449840/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Metric.user.js
// @updateURL https://update.greasyfork.org/scripts/449840/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Metric.meta.js
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

  // src/modules/metric/index.js
  var metric_exports = {};
  __export(metric_exports, {
    default: () => metric_default
  });

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
  var getDialogMapping = () => {
    return {
      treasureMapPopup: "map",
      itemViewPopup: "item",
      mouseViewPopup: "mouse",
      largerImage: "image",
      convertibleOpenViewPopup: "convertible",
      adventureBookPopup: "adventureBook",
      marketplaceViewPopup: "marketplace",
      giftSelectorViewPopup: "gifts",
      supportPageContactUsForm: "support",
      MHCheckout: "premiumShop"
    };
  };
  var onDialogShow = (overlay = null, callback = null, once = false) => {
    const identifier = callback.toString().replaceAll(/[^\w-]/gi, "");
    eventRegistry.addEventListener("js_dialog_show", () => {
      if (!activejsDialog) {
        return;
      }
      const tokens = activejsDialog.getAllTokens();
      if (!tokens || !tokens["{*content*}"] || !tokens["{*content*}"].value || tokens["{*content*}"].value === "" || tokens["{*content*}"].value.includes('data-item-type=""') || // Item view.
      tokens["{*content*}"].value.includes('data-mouse-id=""')) {
        return;
      }
      const atts = activejsDialog.getAttributes();
      let dialogType = atts.className.replace("jsDialogFixed", "").replace("wide", "").replace("default", "").replaceAll("  ", " ").replaceAll(" ", ".").trim();
      if (dialogType.endsWith(".")) {
        dialogType = dialogType.slice(0, -1);
      }
      if ((!overlay || "all" === overlay) && "function" === typeof callback) {
        return callback();
      }
      const dialogMapping = getDialogMapping();
      if ("function" === typeof callback && (overlay === dialogType || overlay === dialogMapping[dialogType])) {
        return callback();
      }
    }, null, once, 0, identifier);
  };

  // src/utils/messages.js
  hadAddedErrorStyles = false;

  // src/modules/metric/index.js
  var imperialToMetric = (text) => {
    const lb = text.match(/(\d+? )lb./i);
    const oz = text.match(/(\d+? )oz./i);
    if (!(lb || oz)) {
      return;
    }
    const lbValue = lb ? lb[1] : 0;
    const ozValue = oz ? oz[1] : 0;
    const totalWeight = Number.parseInt(lbValue) + Number.parseInt(ozValue) / 16;
    const totalWeightMetric = (Math.round(totalWeight * 0.45359237 * 100) / 100).toString();
    return text.replace(/(\d+? lb.\s)?(\d+? oz.)/i, totalWeightMetric + " kg. ");
  };
  var convertInDialog = () => {
    const mouseViewWeights = document.querySelectorAll(".mouseView-statsContainer .mouseView-statsContainer-block-padding table tbody tr");
    if (mouseViewWeights.length) {
      mouseViewWeights.forEach((row) => {
        const firstCell = row.querySelector("td");
        const secondCell = firstCell.nextSibling;
        if (firstCell.innerText === "Avg. Weight:" || firstCell.innerText === "Heaviest:") {
          const converted = imperialToMetric(secondCell.innerText);
          if (converted) {
            secondCell.innerText = converted;
          }
        }
      });
    }
  };
  var replaceInJournal = () => {
    const entries = document.querySelectorAll(".journal .entry .journalbody .journaltext");
    if (!entries.length) {
      return;
    }
    entries.forEach((entry) => {
      const converted = imperialToMetric(entry.innerHTML);
      if (converted) {
        entry.innerHTML = converted;
      }
    });
  };
  var replaceOnMousePage = () => {
    const mouseWeightsStats = document.querySelectorAll(".mouseListView-categoryContent-subgroupContainer .mouseListView-categoryContent-subgroup-mouse-stats");
    if (!mouseWeightsStats.length) {
      return;
    }
    mouseWeightsStats.forEach((stat) => {
      if (stat.classList.contains("average_weight") || stat.classList.contains("heaviest_catch")) {
        const converted = imperialToMetric(stat.innerText);
        if (converted) {
          stat.innerText = converted;
        }
      }
    });
  };
  var convertOnPage = () => {
    replaceOnMousePage();
    replaceInJournal();
  };
  var init = () => __async(void 0, null, function* () {
    onDialogShow("all", convertInDialog);
    onRequest("*", convertOnPage);
    convertOnPage();
  });
  var metric_default = {
    id: "metric",
    name: "Metric Units",
    type: "feature",
    default: false,
    description: "Use metric units instead of imperial units.",
    load: init
  };
  return __toCommonJS(metric_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('Metric', 'https://greasyfork.org/en/scripts/449840-mousehunt-metric');
