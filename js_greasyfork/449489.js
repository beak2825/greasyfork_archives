// ==UserScript==
// @name        🐭️ MouseHunt - Better Gifts / Gift Buttons
// @description Adds buttons to easily accept and return all daily gifts.
// @version     2.1.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/449489/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Better%20Gifts%20%20Gift%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/449489/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Better%20Gifts%20%20Gift%20Buttons.meta.js
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

  // src/modules/better-gifts/index.js
  var better_gifts_exports = {};
  __export(better_gifts_exports, {
    default: () => better_gifts_default
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

  // src/utils/settings.js
  var getSettingDirect = (key = null, defaultValue = null, identifier = "mousehunt-improved-settings") => {
    const settings = JSON.parse(localStorage.getItem(identifier)) || {};
    if (!key) {
      return settings;
    }
    if (!key.includes(".")) {
      if (settings[key] === void 0) {
        return defaultValue;
      }
      return settings[key];
    }
    const groupAndKey = getGroupAndKey(key);
    if (!groupAndKey.group) {
      if (settings[groupAndKey.key] === void 0) {
        return defaultValue;
      }
      return settings[groupAndKey.key];
    }
    const groupSettings = settings[groupAndKey.group] || {};
    if (groupSettings[groupAndKey.key] === void 0) {
      return defaultValue;
    }
    return groupSettings[groupAndKey.key];
  };
  var getGroupAndKey = (key) => {
    const split = key.split(".");
    if (split.length === 1) {
      return {
        group: null,
        key: split[0]
      };
    }
    if (split[0] === "location-huds-enabled") {
      return {
        group: "location-huds-enabled",
        key: split[1]
      };
    }
    return {
      group: `${split[0]}-settings`,
      key: split[1]
    };
  };
  var getSetting = (key, defaultValue = false) => {
    return getSettingDirect(key, defaultValue, "mousehunt-improved-settings");
  };

  // src/utils/elements.js
  var makeElement = (tag, classes = "", text = "", appendTo = null) => {
    const element = document.createElement(tag);
    if (Array.isArray(classes)) {
      classes = classes.join(" ");
    }
    if (classes && classes.length) {
      element.className = classes;
    }
    element.innerHTML = text;
    if (appendTo) {
      appendTo.append(element);
      return appendTo;
    }
    return element;
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
  var onDeactivation = (module, callback) => {
    onEvent("mh-improved-settings-changed", ({ key, value }) => {
      if (key === module && !value) {
        callback();
      }
    });
  };

  // src/utils/messages.js
  hadAddedErrorStyles = false;

  // src/utils/templates.js
  var replaceInTemplate = (templateId, replacements) => {
    let templateContent = hg.utils.TemplateUtil.getTemplate(templateId);
    replacements.forEach((replacement) => {
      templateContent = templateContent.replace(replacement[0], replacement[1]);
    });
    hg.utils.TemplateUtil.addTemplate(templateId, templateContent);
  };

  // src/modules/better-gifts/settings/index.js
  var settings_default = () => __async(void 0, null, function* () {
    const orderOptions = [
      {
        name: "Newest to Oldest",
        value: "default"
      },
      {
        name: "Oldest to Newest",
        value: "reverse"
      }
    ];
    const skipBadGiftOptions = [
      {
        name: "Skip all non-GOTD gifts",
        value: "skip"
      },
      {
        name: "Don't skip any gifts",
        value: "no-skip"
      },
      {
        name: "Skip Mozzarella Cheese only",
        value: "mozzarella"
      },
      {
        name: "Skip Stale Cheese only",
        value: "stale"
      },
      {
        name: "Skip Radioactive Sludge only",
        value: "sludge"
      },
      {
        name: "Skip Mozz. Cheese & Stale Cheese",
        value: "mozzarella-stale"
      },
      {
        name: "Skip Mozz. Cheese & Radioactive Sludge",
        value: "mozzarella-sludge"
      },
      {
        name: "Skip Stale Cheese & Radioactive Sludge",
        value: "stale-sludge"
      }
    ];
    return [
      {
        id: "better-gifts.send-order",
        title: "Order to accept/send",
        default: [orderOptions[0]],
        description: "",
        settings: {
          type: "multi-select",
          number: 1,
          options: orderOptions
        }
      },
      {
        id: "better-gifts.ignore-bad-gifts",
        title: "Ignore gifts",
        default: [skipBadGiftOptions[0]],
        description: "",
        settings: {
          type: "multi-select",
          number: 1,
          options: skipBadGiftOptions
        }
      }
    ];
  });

  // src/modules/better-gifts/styles.css
  var styles_default = '.giftSelectorView-giftContainer .giftSelectorView-gift.gift_of_the_day{width:20%}#bulk-gifting-gift-buttons{position:relative;display:flex;justify-content:flex-end;margin-bottom:10px}#bulk-gifting-gift-buttons .mh-gift-button{padding:0 15px;font-weight:400}#bulk-gifting-gift-buttons .mh-gift-buttons-accept{margin-right:5px}#bulk-gifting-gift-buttons .mh-gift-buttons-paid-gifts{margin-right:10px}.giftSelectorView-inbox-giftContainer{height:auto;min-height:300px;max-height:75vh}.giftSelectorView-inbox-giftRow.complete{height:25px;padding-top:5px;padding-left:15px;border:none;box-shadow:none}.giftSelectorView-inbox-giftRow.complete .giftSelectorView-inbox-gift-thumb{display:inline}.giftSelectorView-inbox-giftRow.complete .itemImage{display:inline-block;width:25px;height:25px}.giftSelectorView-inbox-giftRow.complete .giftSelectorView-inbox-gift-details{width:90%}.mh-gift-buttons-send-random,.mh-gift-buttons-send-faves{margin-top:-2px;margin-left:10px}.giftSelectorView-gift.sendable.gift.gift_of_the_day{flex:1}.giftSelectorView-gift .giftSelectorView-gift-padding{min-width:75px;border:1px solid #dcdcdc;box-shadow:none}.giftSelectorView-gift.gift_of_the_day .giftSelectorView-gift-padding{background-color:#a5e3ff}.giftSelectorView-scroller.giftSelectorView-giftContainer{display:flex;flex-wrap:wrap;justify-content:space-around}.giftSelectorView-gift.gift_of_the_day:hover .giftSelectorView-gift-padding{background-color:#0090ff}body #overlayPopup .giftSelectorView-scroller.giftSelectorView-giftContainer{min-height:unset}.giftSelectorView-friend.complete .giftSelectorView-friend-padding:before{bottom:9px;left:10px;z-index:1;filter:drop-shadow(0 0 3px #b9ff5d) drop-shadow(1px 1px 4px #b9ff5d) drop-shadow(-1px -1px 3px #b9ff5d)}.mh-gift-buttons-clone-wrapper{scrollbar-color:#938f83 #e9e1c6;max-height:calc(75vh - 175px);overflow-y:auto}.mh-gift-buttons-clone-wrapper .giftSelectorView-gift-description{display:flex;flex-direction:column-reverse;align-items:stretch}.mh-gift-buttons-clone-wrapper .giftSelectorView-gift-padding{min-width:unset;padding:0 2px;margin:0;border:none}.mh-gift-buttons-clone-wrapper .giftSelectorView-gift-name{height:unset}.mh-gift-buttons-clone-wrapper .giftSelectorView-gift-name span{padding:5px}.mh-gift-buttons-clone-wrapper .giftSelectorView-content-leftBar-highlightBlock{padding:5px;margin:0 5px 0 10px;background-color:transparent}.mh-gift-buttons-clone-wrapper .giftSelectorView-friendRow-returnCost{bottom:3px}.giftSelectorView-content-leftBar>.giftSelectorView-content-leftBar-highlightBlock:before{position:absolute;inset:0;z-index:1;content:"";border-radius:10px 0 0 10px;box-shadow:0 4px 4px -3px #000}.giftSelectorView-content-leftBar>.giftSelectorView-content-leftBar-highlightBlock{position:relative}.giftSelectorView-friend.complete .giftSelectorView-friend-padding:after,.mh-gift-buttons-clone-wrapper .giftSelectorView-gift.gift_of_the_day .giftSelectorView-gift-padding:after{display:none}.mh-gift-buttons-clone-wrapper .giftSelectorView-gift.gift_of_the_day .giftSelectorView-gift-padding{color:#000;background-color:#fff}.mh-gift-buttons-clone-wrapper .giftSelectorView-gift.gift_of_the_day:hover .giftSelectorView-gift-padding{background-color:#a5e3ff}.giftSelectorView-friend-group-title{padding:3px;font-size:11px}.giftSelectorView-friend-padding,.giftSelectorView-confirmPopup-block-actionItem .giftSelectorView-friend:hover .giftSelectorView-friend-padding{border-radius:0}.giftSelectorView-friend .giftSelectorView-friend-padding{height:35px}.mh-gift-buttons-clone-wrapper .giftSelectorView-gift .itemImage{width:50px;height:50px}.giftSelectorView-gift .itemImage{width:100%;height:80px}.giftSelectorView-friend-name{display:flex;flex-flow:column;align-items:flex-start;justify-content:flex-start;width:unset;height:unset;padding:0 3px;line-height:1.1}.giftSelectorView-friend-name span{display:block}#bulk-gifting-gift-buttons.mh-gift-buttons-send-popup{margin-bottom:0}.giftSelectorView-tabContentContainer .giftSelectorView-tabContent.active .giftSelectorView-actionContainer{display:flex;align-items:center;justify-content:flex-end}#bulk-gifting-gift-buttons.mh-gift-buttons-send-popup button{padding:6px;font-size:12px}a.mousehuntActionButton.giftSelectorView-action-confirm span{display:block;width:auto;min-width:80px}.giftSelectorView-friendRow-returnImage:hover{margin-top:-10px;margin-right:10px;margin-left:0;border:none}.giftSelectorView-claimableGift{min-height:100px}.giftSelectorView-claimableGift.accordion_disabled:after,.giftSelectorView-claimableGift.expanded:after{box-shadow:none}.giftSelectorView-claimableGift.accordion_disabled,.giftSelectorView-claimableGift.expanded{padding:5px;margin-bottom:11px;border:1px solid #ccc;border-radius:3px}.giftSelectorView-claimableGift-title-itemName{font-size:13px}.giftSelectorView-content-subtitle{border-bottom:none}.giftSelectorView-inboxGiftOfTheDay{padding:5px 0;border-color:#d1d0cf}.giftSelectorView-inbox-giftRow.paidgift{background-color:#fff08c;border:none}.giftSelectorView-inbox-gift-details .giftSelectorView-inbox-gift-sent{padding-top:3px}.giftSelectorView-inbox-giftRow{display:flex;align-items:center;justify-content:space-between;min-height:40px}.giftSelectorView-inbox-gift-details{flex:1;width:auto;margin:0 0 0 10px}.giftSelectorView-inbox-giftRow.paidgift .giftSelectorView-inbox-gift-actions{padding-bottom:0}.giftSelectorView-inboxGiftOfTheDay-label{margin-right:5px}.giftSelectorView-inboxGiftOfTheDay-gift{font-size:12px}.giftSelectorView-inboxGiftOfTheDay-gift abbr{text-decoration:none;vertical-align:middle}.paidgift a.giftSelectorView-friendRow-action.return{text-indent:-70px}.giftSelectorView-friendRow-returnQuantity{width:30px}.giftSelectorView-gift.paidgift .giftSelectorView-gift-padding{box-shadow:0 0 1px #000 inset}.giftSelectorView-tabContent.hasSidebar .giftSelectorView-content-rightBar{border-bottom-left-radius:10px}.giftSelectorView-friendRow-sender{position:relative}.giftSelectorView-friendRow:hover{padding-bottom:5px;margin-bottom:7px;border-top-left-radius:0;border-bottom-left-radius:0;outline:1px solid #dfdfdf;box-shadow:none}.giftSelectorView-friend-image{top:-7px;left:-7px;width:33px;height:33px;border:1px solid #bdbdbd}.giftSelectorView-friend-image.paidgift{top:-11px;width:31px;height:31px}#giftSelectorView-inbox{border:1px solid #d1d0cf;box-shadow:0 3px 6px -3px #000}.giftSelectorView-inbox-footer-viewMore a{position:relative;font-weight:400;line-height:24px;text-shadow:0 0 1px #fff;background:none;border:none;border-radius:3px;box-shadow:none}.giftSelectorView-inbox-footer-viewMore{position:absolute;right:10px;width:135px;padding:0;font-size:12px;font-weight:700;line-height:30px;color:#000!important;text-align:center;background:#b3edff;border:1px solid #50549c;border-radius:5px;box-shadow:1px 1px 1px #eee}.giftSelectorView-inbox-footer-viewMore:hover{background-color:#b3f4ff;border-color:#000;box-shadow:0 0 5px #fff inset,1px 1px 1px #fff}.giftSelectorView-inbox-footer-viewMore:before{position:absolute;inset:40% 0 0;content:"";background:#b2e2ff;border-radius:5px;box-shadow:0 0 10px #7bf inset}.giftSelectorView-inbox-footer-viewMore:before:hover{background-color:#a5e2ff;box-shadow:0 0 10px #f0f4f7 inset}.giftSelectorView-inbox-footer{padding-bottom:18px}.giftSelectorView-inbox-giftContainer .mousehuntActionButton.return.disabled,.giftSelectorView-inbox-giftContainer .mousehuntActionButton.claim.disabled{opacity:.5}.giftSelectorView-inbox-giftContainer .mousehuntActionButton.return.disabled:hover,.giftSelectorView-inbox-giftContainer .mousehuntActionButton.claim.disabled:hover{opacity:1}.giftSelectorView-friendRow-action.ignore{outline:1px solid #ededed;box-shadow:none}.giftSelectorView-friendRow-action.ignore:hover{background-color:#eee;outline-color:#c6c6c6}.giftSelectorView-friendRow-action.claim,.giftSelectorView-friendRow-action.return{box-sizing:border-box;outline:1px solid #e7e7e7}.giftSelectorView-friendRow-action.claim:hover,.giftSelectorView-friendRow-action.return:hover{box-shadow:0 0 1px #000 inset,0 -1px 1px #fff inset}.giftSelectorView-friendRow.new .giftSelectorView-friend-image:after{top:-4px;left:-4px;border-radius:4px;box-shadow:none}.mh-dark-mode #giftSelectorView-inbox,.mh-dark-mode .giftSelectorView-inboxGiftOfTheDay{border-color:#424242}.mh-dark-mode .pageFrameView #mousehuntContainer.PageCamp .campPage-trap-statsContainer:hover{background-color:#494949}.complete .giftSelectorView-inbox-gift-details{margin-right:150px;margin-left:0}\n';

  // src/modules/better-gifts/index.js
  var getIgnoredGifts = () => {
    const ignored = getSetting("better-gifts.ignore-bad-gifts-0", "skip");
    const skipOptions = {
      skip: ["mozzarella_cheese", "stale_cheese", "stale_cheese_craft_item"],
      "no-skip": [],
      mozzarella: ["mozzarella_cheese"],
      stale: ["stale_cheese_craft_item"],
      sludge: ["radioactive_sludge"],
      "mozzarella-stale": ["mozzarella_cheese", "stale_cheese_craft_item"],
      "mozzarella-sludge": ["mozzarella_cheese", "radioactive_sludge"],
      "stale-sludge": ["stale_cheese_craft_item", "radioactive_sludge"]
    };
    return skipOptions[ignored] || skipOptions.skip;
  };
  var claimGifts = (send = false, retries = 0) => __async(void 0, null, function* () {
    hg.views.GiftSelectorView.show();
    const isLoaded = document.querySelector(".giftSelectorView-tabContent.active .giftSelectorView-friendRow");
    if (!isLoaded) {
      if (retries <= 10) {
        setTimeout(() => {
          claimGifts(send, retries + 1);
        }, 250);
      }
      return;
    }
    let gifts = hg.views.GiftSelectorView.getClaimableGiftsSortedByTime();
    if (getSetting("better-gifts.send-order-0", "default") === "reverse") {
      gifts.reverse();
    }
    const ignoredGifts = getIgnoredGifts();
    let sendLimit = hg.views.GiftSelectorView.getNumSendableActionsRemaining();
    let claimLimit = hg.views.GiftSelectorView.getNumClaimableActionsRemaining();
    gifts = gifts.filter((gift) => {
      if (gift.channel !== "gift") {
        return false;
      }
      if (ignoredGifts.includes(gift.item_type)) {
        return false;
      }
      return true;
    });
    for (const gift of gifts) {
      let verb = send ? "return" : "claim";
      if (send && sendLimit > 0 && gift.is_returnable) {
        verb = "return";
      }
      const giftEl = document.querySelector(`.giftSelectorView-friendRow[data-gift-id="${gift.gift_id}"] .giftSelectorView-friendRow-action.${verb}`);
      if (!giftEl) {
        continue;
      }
      const event = { target: giftEl };
      if (send && "return" === verb && sendLimit > 0) {
        hg.views.GiftSelectorView.selectReturnableGift(event, giftEl);
        sendLimit--;
        claimLimit--;
      } else if (!send && "claim" === verb && claimLimit > 0) {
        hg.views.GiftSelectorView.selectClaimableGift(giftEl);
        claimLimit--;
      }
    }
    setTimeout(() => {
      const confirm = document.querySelector(".mousehuntActionButton.giftSelectorView-action-confirm.small");
      if (confirm) {
        setTimeout(() => {
          hg.views.GiftSelectorView.submitConfirm(confirm);
        }, 250);
      }
    }, 500);
  });
  var makeAcceptButton = (buttonContainer, isTiny = false) => {
    const acceptButton = makeElement("button", ["mh-gift-button", "mh-gift-buttons-accept", "mousehuntActionButton"]);
    makeElement("span", "mousehuntActionButton-text", "Accept All", acceptButton);
    if (isTiny) {
      acceptButton.classList.add("tiny");
    }
    const acceptLimit = document.querySelector(".giftSelectorView-numClaimActionsRemaining");
    if (acceptLimit && acceptLimit.innerText === "0") {
      acceptButton.classList.add("disabled");
    } else {
      acceptButton.addEventListener("click", () => {
        claimGifts();
      });
    }
    buttonContainer.append(acceptButton);
  };
  var makeReturnButton = (buttonContainer, isTiny = false) => {
    const returnWrapper = makeElement("div", "mh-gift-buttons-return-wrapper");
    const returnButton = makeElement("button", ["mh-gift-button", "mh-gift-buttons-return", "mousehuntActionButton"]);
    makeElement("span", "mousehuntActionButton-text", "Accept & Return All", returnButton);
    if (isTiny) {
      returnButton.classList.add("tiny");
    }
    const returnLimit = document.querySelector(".giftSelectorView-numSendActionsRemaining");
    if (returnLimit && returnLimit.innerText === "0") {
      returnButton.classList.add("disabled");
    } else {
      returnButton.addEventListener("click", () => {
        claimGifts(true);
      });
    }
    returnWrapper.append(returnButton);
    buttonContainer.append(returnWrapper);
  };
  var fixTypo = () => {
    replaceInTemplate("ViewGiftSelector", [
      [
        "You can send 1 free gifts",
        "You can send 1 free gift"
      ],
      [
        "<b>1</b> free gifts",
        "<b>1</b> free gift"
      ]
    ]);
  };
  var lineBreakGiftFooter = () => {
    replaceInTemplate("GiftSelectorView", [
      [
        "more free gifts today. You can",
        'more free gifts today. <p class="mh-ui-footer-gifts-second-line">You can'
      ],
      [
        'class="giftSelectorView-inboxHeader-closeButton" onclick="hg.views.GiftSelectorView.hideInbox(); return false;">Close</a>',
        'class="giftSelectorView-inboxHeader-closeButton" onclick="hg.views.GiftSelectorView.hideInbox(); return false;">\u2715</a>'
      ]
    ]);
  };
  var getButtons = (className = false, isTiny = false) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "bulk-gifting-gift-buttons";
    if (className) {
      buttonContainer.classList.add(className);
    }
    makeAcceptButton(buttonContainer, isTiny);
    makeReturnButton(buttonContainer, isTiny);
    return buttonContainer;
  };
  var makeButtons = () => {
    if (document.querySelector("#bulk-gifting-gift-buttons")) {
      return;
    }
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "bulk-gifting-gift-buttons";
    makeAcceptButton(buttonContainer);
    makeReturnButton(buttonContainer);
    const giftFooter = document.querySelector(".giftSelectorView-inbox-footer");
    if (giftFooter && giftFooter.firstChild) {
      giftFooter.insertBefore(buttonContainer, giftFooter.firstChild);
    }
  };
  var getLimit = () => {
    const limitEl = document.querySelector(".giftSelectorView-tabContent.active .giftSelectorView-actionLimit.giftSelectorView-numSendActionsRemaining");
    limit = limitEl ? Number.parseInt(limitEl.innerText, 10) : 0;
    return limit;
  };
  var pickFriends = (friends, useRandom = true) => {
    const selected = [];
    let sent = 0;
    if (useRandom) {
      const bound = friends.length > 35 ? 35 : friends.length;
      const firstRandom = Math.floor(Math.random() * bound);
      selected.push(firstRandom);
      sent++;
    }
    let limit2 = getLimit();
    while (sent < limit2) {
      if (selected.length >= friends.length) {
        break;
      }
      if (useRandom) {
        const random = Math.floor(Math.random() * friends.length);
        if (selected.includes(random)) {
          continue;
        }
        selected.push(random);
      } else {
        selected.push(sent);
      }
      sent++;
      limit2 = getLimit();
    }
    selected.forEach((index) => {
      friends[index].click();
    });
    if (getLimit() < 1) {
      const buttons = document.querySelectorAll(".mh-gift-buttons");
      buttons.forEach((button) => {
        button.classList.add("disabled");
      });
    }
  };
  var addSendButton = (className, text, selector, buttonContainer) => {
    const existing = document.querySelector(`.mh-gift-buttons-send-${className}`);
    if (existing) {
      existing.remove();
    }
    const sendButton = makeElement("button", ["mousehuntActionButton", "tiny", "mh-gift-buttons", `mh-gift-buttons-send-${className}`]);
    makeElement("span", "mousehuntActionButton-text", text, sendButton);
    const limit2 = getLimit();
    if (limit2 && limit2 < 1) {
      sendButton.classList.add("disabled");
    }
    sendButton.addEventListener("click", () => {
      const friends = document.querySelectorAll(selector);
      if (!friends.length) {
        return;
      }
      if ("faves" === className) {
        pickFriends(friends, false);
      } else {
        pickFriends(friends);
      }
    });
    buttonContainer.append(sendButton);
  };
  var addRandomSendButton = () => {
    const _selectGift2 = hg.views.GiftSelectorView.selectGift;
    hg.views.GiftSelectorView.selectGift = (gift) => {
      _selectGift2(gift);
      const title = document.querySelector(".giftSelectorView-tabContent.active .selectFriends .giftSelectorView-content-title");
      if (!title) {
        return false;
      }
      addSendButton("random", "Select Random Friends", ".giftSelectorView-tabContent.active .giftSelectorView-friend:not(.disabled, .selected)", title);
      addSendButton("faves", "Select Frequent Gifters", ".giftSelectorView-tabContent.active .giftSelectorView-friend-group.favorite .giftSelectorView-friend:not(.disabled, .selected)", title);
    };
  };
  var _showTab;
  var _selectGift;
  var _updateGiftMultiplierQuantity;
  var addGiftSwitcher = () => {
    if (_showTab || _selectGift || _updateGiftMultiplierQuantity) {
      return;
    }
    _showTab = hg.views.GiftSelectorView.showTab;
    _selectGift = hg.views.GiftSelectorView.selectGift;
    _updateGiftMultiplierQuantity = hg.views.GiftSelectorView.updateGiftMultiplierQuantity;
    hg.views.GiftSelectorView.showTab = (tabType, viewState, preserveVariables, preserveActions) => {
      _showTab(tabType, viewState, preserveVariables, preserveActions);
      hg.views.GiftSelectorView.updateGiftMultiplierQuantity = (input) => {
        if (input && input.hasAttribute("maxlength")) {
          input.removeAttribute("maxlength");
        }
        return _updateGiftMultiplierQuantity(input);
      };
      hg.views.GiftSelectorView.selectGift = (gift) => {
        _selectGift(gift);
        const giftContainer = document.querySelector(".giftSelectorView-tabContent.active.selectFriends .giftSelectorView-content-leftBar");
        if (!giftContainer) {
          return false;
        }
        const existing = document.querySelector(".mh-gift-buttons-clone-wrapper");
        if (existing) {
          existing.remove();
        }
        const giftType = tabType === "send_free_gifts" ? "gift" : "paidgift";
        const gifts = document.querySelectorAll(`.active .selectGift .giftSelectorView-scroller.giftSelectorView-giftContainer .giftSelectorView-gift.sendable.${giftType}`);
        if (!gifts.length) {
          return;
        }
        const cloneWrapper = makeElement("div", "mh-gift-buttons-clone-wrapper");
        gifts.forEach((toClone) => {
          const clone = toClone.cloneNode(true);
          const giftWrap = makeElement("div", "giftSelectorView-content-leftBar-highlightBlock");
          giftWrap.append(clone);
          giftWrap.addEventListener("click", () => {
            const prevSelected = document.querySelectorAll(".mh-gift-buttons-clone-selected");
            prevSelected.forEach((el) => {
              el.classList.remove("mh-gift-buttons-clone-selected");
            });
            giftWrap.classList.add("mh-gift-buttons-clone-selected");
          });
          cloneWrapper.append(giftWrap);
        });
        giftContainer.append(cloneWrapper);
      };
    };
  };
  var addButtonsToDropdown = () => {
    const buttonLink = document.querySelector("#hgbar_freegifts");
    if (!buttonLink) {
      return;
    }
    buttonLink.addEventListener("click", () => {
      makeButtons();
    });
  };
  var addButtonsToPopup = () => {
    const actionRow = document.querySelector(".giftSelectorView-tabContentContainer .giftSelectorView-tabContent.active .giftSelectorView-actionContainer");
    if (!actionRow) {
      return;
    }
    const existing = document.querySelector(".mh-gift-buttons-send-popup");
    if (existing) {
      existing.remove();
    }
    const buttons = getButtons("mh-gift-buttons-send-popup", true);
    actionRow.insertBefore(buttons, actionRow.firstChild);
  };
  var main = () => {
    onRequest("users/socialGift.php", makeButtons);
    addButtonsToDropdown();
    onDialogShow("giftSelectorViewPopup", addButtonsToPopup);
    addRandomSendButton();
    addGiftSwitcher();
    fixTypo();
    lineBreakGiftFooter();
  };
  var init = () => __async(void 0, null, function* () {
    addStyles(styles_default, "better-gifts");
    main();
    onDeactivation("better-gifts", () => {
      const buttons = document.querySelectorAll(".mh-gift-buttons");
      buttons.forEach((button) => {
        button.remove();
      });
    });
  });
  var better_gifts_default = {
    id: "better-gifts",
    name: "Better Gifts",
    type: "better",
    default: true,
    description: "Quickly accept and return all your gifts as well as picking random friends to send to.",
    load: init,
    settings: settings_default
  };
  return __toCommonJS(better_gifts_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('Better Gifts / Gift Buttons', 'https://greasyfork.org/en/scripts/449489-mousehunt-gift-buttons');
