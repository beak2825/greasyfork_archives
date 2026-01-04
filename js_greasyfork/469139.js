// ==UserScript==
// @name         Kbin Subscriptions Panel
// @namespace    https://perry.dev
// @license      MIT
// @version      2.9
// @description  Adds a side panel with all magazine subscriptions.
// @author       Daniel Pervan
// @match        https://kbin.social/*
// @match        https://lab2.kbin.pub/*
// @match        https://lab3.kbin.pub/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @downloadURL https://update.greasyfork.org/scripts/469139/Kbin%20Subscriptions%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/469139/Kbin%20Subscriptions%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // style-helper:index.js
  function inject_style(text) {
    if (typeof document !== "undefined") {
      var style = document.createElement("style");
      var node = document.createTextNode(text);
      style.appendChild(node);
      document.head.appendChild(style);
    }
  }
  var init_index = __esm({
    "style-helper:index.js"() {
    }
  });

  // src/style.scss
  var init_style = __esm({
    "src/style.scss"() {
      init_index();
      inject_style('body.subscription-panel-injected.extend-width:not(.subscription-panel-force-mobile,.subscription-panel-open) .kbin-container{max-width:1620px}body.subscription-panel-injected .subscription-panel-modal{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99;background-color:#00000080;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px)}body.subscription-panel-injected .subscription-panel-modal-content{background-color:var(--kbin-section-bg);border:var(--kbin-options-border);color:var(--kbin-section-text-color);padding:2rem 1rem;height:fit-content;font-size:.8em;position:relative;max-width:600px;min-width:400px;width:100%;animation:modalopen .2s ease-in-out}body.subscription-panel-injected .subscription-panel-modal-content h1,body.subscription-panel-injected .subscription-panel-modal-content h2,body.subscription-panel-injected .subscription-panel-modal-content h3{margin-top:0;text-align:center;margin-bottom:0}body.subscription-panel-injected .subscription-panel-modal-content h3{opacity:.5;font-size:2em}body.subscription-panel-injected .subscription-panel-modal-content .close{color:#aaa;font-size:28px;cursor:pointer;position:absolute;top:.5rem;right:1rem}body.subscription-panel-injected .subscription-panel-modal-content .close:hover{color:var(--kbin-sidebar-header-text-color)}body.subscription-panel-injected.rounded-edges .subscription-panel-modal-content{border-radius:.5rem}body.subscription-panel-injected.rounded-edges #subscription-panel-content{border-radius:0 0 .5rem .5rem}body.subscription-panel-injected.rounded-edges .subscription-panel-modal .danger{border-radius:.5rem}body.subscription-panel-injected.subscription-panel-sticky:not(.subscription-panel-open).fixed-navbar.topbar #subscription-panel-content{top:calc(50.5px + 1.1rem);max-height:calc(100vh - 50px - 1.1rem - 1em)}body.subscription-panel-injected.subscription-panel-sticky:not(.subscription-panel-open).fixed-navbar #subscription-panel-content{top:50px;max-height:calc(100vh - 50px - 1em)}body.subscription-panel-injected.subscription-panel-sticky:not(.subscription-panel-open).topbar #subscription-panel-content{top:1.1rem;max-height:calc(100vh - 1.1rem - 1em)}body.subscription-panel-injected.subscription-panel-sticky:not(.subscription-panel-open) #subscription-panel-content{position:sticky;overflow:auto;max-height:calc(100vh - 1em);top:0}body.subscription-panel-injected.subscription-panel-sticky:not(.subscription-panel-open) #subscription-panel-content>h3{position:sticky;top:-2.5em;background:var(--kbin-section-bg);z-index:3;margin-bottom:0}body.subscription-panel-injected.subscription-panel-sticky:not(.subscription-panel-open) #subscription-panel-content .search-box-container{position:sticky;top:1.25em;z-index:3;padding:1em 0;background:var(--kbin-section-bg)}body.subscription-panel-injected.subscription-panel-sticky:not(.subscription-panel-open) #subscription-panel-content .search-box-container .search-box-clear{top:1.2em}body.subscription-panel-injected.subscription-panel-sticky:not(.subscription-panel-open) #subscription-panel-content .last-clicked-container h3{position:sticky;top:7em;margin-top:0;z-index:2;background:var(--kbin-section-bg)}body.subscription-panel-injected.subscription-panel-sticky:not(.subscription-panel-open).subscription-panel-collapsed #subscription-panel-content .last-clicked-container h3{top:-1em;padding-top:1em}body.subscription-panel-injected.subscription-panel-sticky:not(.subscription-panel-open) #subscription-panel.edit-mode #subscription-panel-content{padding-top:0}body.subscription-panel-injected.subscription-panel-sticky:not(.subscription-panel-open) #subscription-panel.edit-mode .search-box-container{top:3.5em;margin-top:1em;padding:0 0 1em}body.subscription-panel-injected.subscription-panel-sticky:not(.subscription-panel-open) #subscription-panel.edit-mode #subscription-panel-edit-button{position:sticky;top:-.5em;margin:0;padding-top:1em;z-index:5;background:var(--kbin-section-bg)}body.subscription-panel-injected #subscription-panel .search-box-container{position:relative}body.subscription-panel-injected #subscription-panel .search-box-clear{position:absolute;top:.6em;right:1em;font-size:1.5em;display:none;cursor:pointer;transition:color .2s ease-in-out;animation:searchBoxClearShow .25s ease-in-out}@keyframes searchBoxClearShow{0%{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}body.subscription-panel-injected #subscription-panel .search-box-clear:hover{color:var(--kbin-sidebar-header-text-color)}body.subscription-panel-injected #subscription-panel .search-box-clear.active{display:block}body.subscription-panel-injected #subscription-panel-edit-button{position:absolute;top:0;left:0;margin:.5rem;padding:.5rem;z-index:5;color:var(--kbin-section-text-color);font-size:.8em;cursor:pointer;transition:font-size .2s ease-in-out}body.subscription-panel-injected #subscription-panel-edit-button i{transition:transform .2s ease-in-out}body.subscription-panel-injected #subscription-panel-edit-button:not(.active):hover i{color:var(--kbin-sidebar-header-text-color);transform:rotate(-25deg)}body.subscription-panel-injected #subscription-panel-edit-button.active{font-size:1.5em}body.subscription-panel-injected #subscription-panel-edit-button.active:hover{color:var(--kbin-link-hover-color)}body.subscription-panel-injected #subscription-panel-edit-button.active:hover i{transform:scale(1.2)}body.subscription-panel-injected #subscription-panel-settings-button{position:absolute;top:0;right:0;margin:.5rem;padding:.5rem;color:var(--kbin-section-text-color);font-size:.8em;cursor:pointer;transition:transform .2s ease-in-out;z-index:3}body.subscription-panel-injected #subscription-panel-settings-button:hover{color:var(--kbin-sidebar-header-text-color);transform:rotate(25deg)}body.subscription-panel-injected #subscription-panel-settings-button:active{animation:settingsbuttonclick .5s ease-in-out}@keyframes settingsbuttonclick{0%{transform:rotate(0)}to{transform:rotate(360deg)}}body.subscription-panel-injected .subscription-panel-settings-modal-content{max-width:600px;min-width:400px}body.subscription-panel-injected .subscription-panel-settings-modal-content ul{list-style:none;padding-inline:0}body.subscription-panel-injected .subscription-panel-settings-modal-content ul li{margin-bottom:1rem}body.subscription-panel-injected .subscription-panel-settings-modal-content ul li label{display:block;margin-bottom:.5rem}body.subscription-panel-injected .subscription-panel-settings-modal-content ul li label.danger{background-color:RGBA(255,0,0,.1);border:1px solid RGBA(255,0,0,.5);padding:.5rem;color:var(--kbin-section-text-color);margin:2em 0}body.subscription-panel-injected .subscription-panel-settings-modal-content ul li .description{font-size:.8em;font-weight:100;font-style:italic;opacity:.8}body.subscription-panel-injected .subscription-panel-settings-modal-content ul li input[type=checkbox]{margin-right:.5rem}body.subscription-panel-injected .subscription-panel-settings-modal-content ul li input[type=button]{margin-right:.5rem;padding:.5rem}body.subscription-panel-injected .subscription-panel-settings-modal-content ul li input[type=button]:active{opacity:.8}body.subscription-panel-injected .subscription-panel-settings-modal-content h2{margin-top:0}@keyframes modalopen{0%{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}body.subscription-panel-injected #subscription-panel-collapse-button{position:relative;display:inline-block;right:0;margin:.5rem;padding:.5rem;color:var(--kbin-section-text-color);font-size:.8em;cursor:pointer;transition:transform .2s ease-in-out}body.subscription-panel-injected.subscription-panel-collapsed #subscription-panel h3:hover #subscription-panel-collapse-button{transform:translate(2px)}body.subscription-panel-injected #subscription-panel h3:hover #subscription-panel-collapse-button{color:var(--kbin-sidebar-header-text-color);transform:translate(-2px)}body.subscription-panel-injected:not(.subscription-panel-force-mobile,.subscription-panel-open,.sidebar-left) #middle>.kbin-container{grid-template-areas:"subscription-panel main sidebar";grid-template-columns:minmax(200px,1fr) 3fr 1fr}body.subscription-panel-injected.sidebar-left:not(.subscription-panel-force-mobile,.subscription-panel-open) #middle>.kbin-container{grid-template-areas:"sidebar main subscription-panel";grid-template-columns:1fr 3fr minmax(200px,1fr)}body.subscription-panel-injected.subscription-panel-collapsed:not(.subscription-panel-force-mobile,.subscription-panel-open) #middle>.kbin-container{grid-template-columns:minmax(100px,120px) 3fr 1fr}body.subscription-panel-injected.subscription-panel-collapsed.sidebar-left:not(.subscription-panel-force-mobile,.subscription-panel-open) #middle>.kbin-container{grid-template-columns:1fr 3fr minmax(100px,120px)}body.subscription-panel-injected.subscription-panel-collapsed #middle>.kbin-container #subscription-panel #subscription-panel-edit-button{display:none}body.subscription-panel-injected.subscription-panel-collapsed #middle>.kbin-container #subscription-panel #subscription-panel-collapse-button{margin:0;padding:0 .5em}body.subscription-panel-injected.subscription-panel-collapsed #middle>.kbin-container #subscription-panel li{font-size:.8em}body.subscription-panel-injected.subscription-panel-collapsed #middle>.kbin-container #subscription-panel .search-box-container{display:none}body.subscription-panel-injected.subscription-panel-collapsed.subscription-panel-hide-on-collapse #middle>.kbin-container #subscription-panel ul{display:none}body.subscription-panel-injected.subscription-panel-collapsed.subscription-panel-hide-on-collapse #middle>.kbin-container .last-clicked-container{display:none}body.subscription-panel-injected:not(.subscription-panel-force-mobile,.subscription-panel-open) .sidebar-left #middle>.kbin-container{grid-template-areas:"sidebar main subscription-panel";grid-template-columns:1fr 3fr minmax(200px,1fr)}body.subscription-panel-injected.subscription-panel-collapsed:not(.subscription-panel-force-mobile,.subscription-panel-open) .sidebar-left #middle>.kbin-container{grid-template-columns:1fr 3fr minmax(100px,120px)}body.subscription-panel-injected #subscription-panel-content{background-color:var(--kbin-section-bg);border:var(--kbin-options-border);color:var(--kbin-section-text-color);margin-bottom:.5rem;padding:2rem 1rem;height:fit-content;font-size:.8em;margin-right:.5rem;position:relative}body.subscription-panel-injected #subscription-panel.edit-mode h3,body.subscription-panel-injected #subscription-panel.edit-mode .last-clicked-container,body.subscription-panel-injected #subscription-panel.edit-mode #subscription-panel-settings-button{display:none}body.subscription-panel-injected #subscription-panel.edit-mode .search-box-container{margin-top:2em}body.subscription-panel-injected #subscription-panel.edit-mode .group.open>ul{width:auto}body.subscription-panel-injected #subscription-panel h3{border-bottom:var(--kbin-sidebar-header-border);color:var(--kbin-sidebar-header-text-color);font-size:.8rem;margin:0 0 1em;text-transform:uppercase;width:100%}body.subscription-panel-injected #subscription-panel .last-clicked-container{border-bottom:var(--kbin-sidebar-header-border)}body.subscription-panel-injected #subscription-panel .last-clicked-container.hideItem{display:none}body.subscription-panel-injected #subscription-panel .last-clicked-container h3{margin-top:1em}body.subscription-panel-injected #subscription-panel ul{list-style:none;line-height:2.5em;padding-inline:0}body.subscription-panel-injected #subscription-panel ul.fade-in,body.subscription-panel-injected #subscription-panel ul li.fade-in{animation:showItem .5s ease-in-out}body.subscription-panel-injected #subscription-panel ul li{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}body.subscription-panel-injected #subscription-panel ul li.ignore:not(.edit-mode){display:none}body.subscription-panel-injected #subscription-panel ul li.hideItem{animation:hideItem .25s ease-in-out;animation-fill-mode:forwards}body.subscription-panel-injected #subscription-panel ul li .magazine{transition:transform .2s ease-in-out;display:inline-block}body.subscription-panel-injected #subscription-panel ul li .tools .toolItem{display:inline-block;margin-right:.5rem;cursor:pointer;color:var(--kbin-link-color)}body.subscription-panel-injected #subscription-panel ul li .tools .toolItem:hover{color:var(--kbin-link-hover-color)}body.subscription-panel-injected #subscription-panel ul li.starred .toolItem.star{color:RGBA(255,215,0,1)}body.subscription-panel-injected #subscription-panel ul li.starred .toolItem.star:hover{color:RGBA(255,215,0,.8)}body.subscription-panel-injected #subscription-panel ul li.ignore .toolItem.ignore{color:var(--kbin-link-hover-color)}body.subscription-panel-injected #subscription-panel ul li.ignore .toolItem.ignore:hover{opacity:.8}body.subscription-panel-injected #subscription-panel ul li.edit-mode .magazine{transform:translate(3.5em)}body.subscription-panel-injected #subscription-panel ul li.edit-mode.group .count{display:none}body.subscription-panel-injected #subscription-panel ul li.edit-mode .tools{display:inline-block;animation:showTools .5s ease-in-out;position:absolute}@keyframes showTools{0%{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}body.subscription-panel-injected #subscription-panel ul li .tools{display:none}body.subscription-panel-injected #subscription-panel ul li a img{height:1.4em;margin-right:.5em;border-radius:50%;vertical-align:middle}body.subscription-panel-injected #subscription-panel ul li.no-image a.magazine{padding-left:1.9em}body.subscription-panel-injected #subscription-panel ul li.group{font-weight:700}body.subscription-panel-injected #subscription-panel ul li.group a.group-name .name{margin-left:.5em}body.subscription-panel-injected #subscription-panel ul li.group a.group-name .count{margin-left:.25em;font-weight:400;opacity:.8}body.subscription-panel-injected #subscription-panel ul li.group a.group-name .image{font-size:1.2em;vertical-align:middle;width:1.2em}body.subscription-panel-injected #subscription-panel ul li.group ul{margin-left:.75em;padding-left:.75em;padding-right:.75em;border-left:var(--kbin-sidebar-header-border);border-bottom:var(--kbin-sidebar-header-border);width:fit-content;border-bottom-left-radius:.5rem;display:none}body.subscription-panel-injected #subscription-panel ul li.group ul li{font-weight:400}body.subscription-panel-injected #subscription-panel ul li.group.open ul{animation:openGroup .25s ease-in-out;display:block}body.subscription-panel-injected #subscription-panel .instance-name{opacity:.8;font-weight:100}@keyframes openGroup{0%{transform:translateY(-.5em);opacity:0}to{transform:translateY(0);opacity:1}}body.subscription-panel-injected #subscription-panel-spinner{text-align:center;font-size:2em}@keyframes showItem{0%{opacity:0}to{opacity:1}}@keyframes hideItem{0%{opacity:1;max-height:2.5em}to{opacity:0;max-height:0}}body.subscription-panel-injected #header menu li a.subscription-panel-mobile-button{display:none}@keyframes showMobileSubscriptionPanelUL{0%{transform:translateY(-2em)}to{transform:translateY(0)}}@keyframes showMobileSubscriptionPanel{0%{opacity:0}to{opacity:1}}body.subscription-panel-injected.subscription-panel-open{overflow:hidden}body.subscription-panel-injected.subscription-panel-open #scroll-top{display:none!important}body.subscription-panel-injected.subscription-panel-open #subscription-panel{z-index:5;top:0;height:100%;width:100%;left:0;position:fixed;margin:0}body.subscription-panel-injected.subscription-panel-open.subscription-panel-force-mobile #middle>.kbin-container #subscription-panel,body.subscription-panel-injected.subscription-panel-open.subscription-panel-open #middle>.kbin-container #subscription-panel{overflow:hidden;border-radius:0!important;border:none;background:RGBA(0,0,0,.5);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center}body.subscription-panel-injected.subscription-panel-open.subscription-panel-force-mobile #middle>.kbin-container #subscription-panel #subscription-panel-content,body.subscription-panel-injected.subscription-panel-open.subscription-panel-open #middle>.kbin-container #subscription-panel #subscription-panel-content{height:100%;overflow:auto;padding:1em 10em;padding-bottom:100px!important;position:fixed;top:49px;width:fit-content;margin:2em 0 0;animation:showMobileSubscriptionPanel .2s ease-out}body.subscription-panel-injected.subscription-panel-open.subscription-panel-force-mobile #middle>.kbin-container #subscription-panel ul,body.subscription-panel-injected.subscription-panel-open.subscription-panel-open #middle>.kbin-container #subscription-panel ul{animation:showMobileSubscriptionPanelUL .2s ease-out}body.subscription-panel-injected.subscription-panel-open.rounded-edges #middle>.kbin-container #subscription-panel-content{border-radius:.5rem}body.subscription-panel-injected.subscription-panel-open #header menu li a.subscription-panel-mobile-button{border-bottom:var(--kbin-header-hover-border)}body.subscription-panel-injected.subscription-panel-force-mobile:not(.subscription-panel-open) #middle>.kbin-container #subscription-panel{display:none}body.subscription-panel-injected #header menu li a.subscription-panel-mobile-button{font-size:0;cursor:pointer;transition:border-bottom .2s ease-in-out}body.subscription-panel-injected.subscription-panel-alternative-menu:not(.subscription-panel-force-mobile) a.subscription-panel-mobile-button{display:none!important}body.subscription-panel-injected.subscription-panel-force-mobile #header menu li a.subscription-panel-mobile-button,body.subscription-panel-injected.subscription-panel-open #header menu li a.subscription-panel-mobile-button{display:flex}body.subscription-panel-injected.subscription-panel-force-mobile #subscription-panel-collapse-button,body.subscription-panel-injected.subscription-panel-open #subscription-panel-collapse-button{display:none}body.subscription-panel-injected a.subscription-panel-mobile-button i{font-size:.85rem}body.subscription-panel-injected .subscription-panel-mobile-close-button-alt{position:relative;top:-.5em;font-size:2em;display:none}body.subscription-panel-injected.subscription-panel-alternative-menu.subscription-panel-open .subscription-panel-mobile-close-button-alt{display:block}@media (min-width: 991.98px){body.subscription-panel-injected .mobile-subscriptions-panel-button-alt{display:none!important}}@media (max-width: 991.98px){body.subscription-panel-injected.subscription-panel-alternative-menu .mobile-subscriptions-panel-button-alt,body.subscription-panel-injected #header menu li a.subscription-panel-mobile-button{display:flex}body.subscription-panel-injected #middle>.kbin-container,body.subscription-panel-injected body.subscription-panel-collapsed #middle>.kbin-container{grid-template-areas:"main main" "subscription-panel subscription-panel" "sidebar sidebar"!important;grid-template-columns:1fr!important}body.subscription-panel-injected.subscription-panel-sticky #middle>.kbin-container #subscription-panel{display:none}body.subscription-panel-injected.subscription-panel-open #middle>.kbin-container #subscription-panel{animation:showMobileSubscriptionPanel .2s ease-out}body.subscription-panel-injected.subscription-panel-open #middle>.kbin-container #subscription-panel #subscription-panel-content{height:100%;left:0;padding:2em 2em 100px!important;width:100%!important;border-radius:0!important;border:none;top:49px!important;margin:0!important;overflow:auto}body.subscription-panel-injected.subscription-panel-open #middle>.kbin-container #subscription-panel ul{animation:showMobileSubscriptionPanelUL .2s ease-out}body.subscription-panel-injected #subscription-panel-collapse-button{display:none}body.subscription-panel-injected #subscription-panel-settings-button{right:1em}body.subscription-panel-injected #subscription-panel-edit-button{right:4em;left:unset}body.subscription-panel-injected #subscription-panel.edit-mode #subscription-panel-edit-button{right:1em}}@media (hover: none){body.subscription-panel-injected #header menu li a.subscription-panel-mobile-button:hover{border-bottom:3px solid transparent}body.subscription-panel-injected #subscription-panel-settings-button:hover i,body.subscription-panel-injected #subscription-panel-edit-button:hover i{transform:none!important}}@media (pointer: coarse){body.subscription-panel-injected #subscription-panel-settings-button,body.subscription-panel-injected #subscription-panel-edit-button{font-size:1.2em}}body.subscription-panel-injected .subscription-panel-onboarding .subscription-panel-onboarding-content{max-width:800px}body.subscription-panel-injected .subscription-panel-onboarding-next{margin-top:1em;font-size:2em;text-align:center;display:block}');
    }
  });

  // src/utils.js
  function getSettings() {
    const settings = localStorage.getItem("subscription-panel-settings");
    let settingsObj = {};
    if (settings) {
      settingsObj = JSON.parse(settings);
    }
    if (settingsObj.useCache === void 0) {
      settingsObj.useCache = true;
    }
    if (settingsObj.useGroups === void 0) {
      settingsObj.useGroups = true;
    }
    if (settingsObj.showLastClicked === void 0) {
      settingsObj.showLastClicked = true;
    }
    return settingsObj;
  }
  function saveSettings(settings) {
    localStorage.setItem("subscription-panel-settings", JSON.stringify(settings));
  }
  function resetSettings() {
    localStorage.removeItem("subscription-panel-settings");
    localStorage.removeItem("subscription-panel-magazine-data");
  }
  var init_utils = __esm({
    "src/utils.js"() {
    }
  });

  // src/Classes/Item.js
  var Item, Item_default;
  var init_Item = __esm({
    "src/Classes/Item.js"() {
      Item = class _Item {
        #icon;
        type;
        fullName;
        editMode;
        hidden = false;
        element;
        static get TYPE() {
          return {
            MAGAZINE: "magazine",
            GROUP: "group"
          };
        }
        constructor(fullName, type) {
          this.fullName = fullName;
          this.name = fullName;
          this.type = type;
          this.#icon = null;
          this.editMode = false;
        }
        get icon() {
          return this.#icon;
        }
        getElement() {
          let li = document.createElement("li");
          li.classList.add("item");
          li.setAttribute("data-type", this.type);
          li.setAttribute("data-name", this.fullName);
          return li;
        }
        enableEditMode() {
          this.editMode = true;
        }
        disableEditMode() {
          this.editMode = false;
        }
        toggleEditMode() {
          if (this.editMode) {
            this.disableEditMode();
          } else {
            this.enableEditMode();
          }
        }
        isStarred() {
          return false;
        }
        isHidden() {
          return this.hidden;
        }
        hide(fadeOut = false) {
          this.hidden = true;
          if (!this.element) {
            return;
          }
          this.element.classList.add("hideItem");
        }
        show(fadeIn = false) {
          if (!this.hidden) {
            return;
          }
          this.hidden = false;
          if (!this.element) {
            return;
          }
          if (fadeIn && this.element.classList.contains("hideItem")) {
            this.element.addEventListener("animationend", () => {
              this.element.classList.remove("fade-in");
            });
            this.element.classList.add("fade-in");
          }
          this.element.classList.remove("hideItem");
        }
        toggleHidden() {
          if (this.isHidden()) {
            this.hide();
          } else {
            this.show();
          }
        }
        isIgnored() {
          return false;
        }
        search(query, includeIgnored = false) {
          if (!includeIgnored && this.isIgnored()) {
            return false;
          }
          return this.fullName.toLowerCase().includes(query.toLowerCase());
        }
        copy() {
          return new _Item(this.fullName, this.type);
        }
      };
      Item_default = Item;
    }
  });

  // src/Classes/Magazine.js
  var Magazine, Magazine_default;
  var init_Magazine = __esm({
    "src/Classes/Magazine.js"() {
      init_Item();
      Magazine = class _Magazine extends Item_default {
        icon;
        element;
        starred;
        constructor(fullName, url, icon = null) {
          super(fullName, Item_default.TYPE.MAGAZINE);
          this.icon = icon;
          this.url = url;
          this.name = fullName.replace(/@.*/, "");
          const instanceName = fullName.match(/@(.*)/);
          this.instanceName = instanceName ? instanceName[1] : null;
        }
        registerClickTime() {
          this.appendMagazineData({ clickTime: Date.now() });
        }
        getMagazineData() {
          let magData = localStorage.getItem("subscription-panel-magazine-data");
          if (magData) {
            magData = JSON.parse(magData);
            magData = magData[this.fullName] || {};
          } else {
            magData = {};
          }
          return magData;
        }
        getClickTime() {
          return this.getMagazineData().clickTime || 0;
        }
        appendMagazineData(data) {
          let magData = localStorage.getItem("subscription-panel-magazine-data");
          if (magData) {
            magData = JSON.parse(magData);
          } else {
            magData = {};
          }
          if (!magData[this.fullName]) {
            magData[this.fullName] = data;
          } else {
            magData[this.fullName] = { ...magData[this.fullName], ...data };
          }
          localStorage.setItem("subscription-panel-magazine-data", JSON.stringify(magData));
        }
        static fromElement(element) {
          let magA = element.querySelector("a");
          return new _Magazine(magA.innerText, magA.href, element.querySelector("figure img")?.src);
        }
        enableEditMode() {
          super.enableEditMode();
          if (!this.element) {
            return;
          }
          this.element.classList.add("edit-mode");
        }
        disableEditMode() {
          super.disableEditMode();
          if (!this.element) {
            return;
          }
          this.element.classList.remove("edit-mode");
        }
        toggleStar() {
          let data = this.getMagazineData();
          if (data?.starred) {
            this.unstar();
          } else {
            this.star();
          }
        }
        star() {
          this.appendMagazineData({ starred: true });
          this.element.classList.add("starred");
          this.starred = true;
        }
        unstar() {
          this.appendMagazineData({ starred: false });
          this.element.classList.remove("starred");
          this.starred = false;
        }
        isStarred() {
          if (this.starred === void 0) {
            this.starred = this.getMagazineData()?.starred === true;
          }
          return this.starred;
        }
        ignore() {
          this.element.classList.add("ignore");
          this.ignored = true;
          this.appendMagazineData({ ignored: true });
          this.element.querySelector(".toolItem.ignore").innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
        unignore() {
          this.element.classList.remove("ignore");
          this.ignored = false;
          this.appendMagazineData({ ignored: false });
          this.element.querySelector(".toolItem.ignore").innerHTML = '<i class="fas fa-eye"></i>';
        }
        toggleIgnored() {
          if (this.isIgnored()) {
            this.unignore();
          } else {
            this.ignore();
          }
        }
        isIgnored() {
          if (this.ignored === void 0) {
            this.ignored = this.getMagazineData()?.ignored === true;
          }
          return this.ignored;
        }
        getElement() {
          if (this.element) {
            return this.element;
          }
          let magData = this.getMagazineData();
          let li = document.createElement("li");
          if (magData?.starred) {
            li.classList.add("starred");
          }
          if (this.isIgnored()) {
            li.classList.add("ignore");
          }
          const tools = Object.assign(document.createElement("span"), { className: "tools" });
          const star = Object.assign(document.createElement("span"), {
            className: "star toolItem",
            title: "Star",
            innerHTML: '<i class="fas fa-star"></i>',
            onclick: () => {
              this.toggleStar();
            }
          });
          const ignore = Object.assign(document.createElement("span"), {
            className: "ignore toolItem",
            title: "Ignore",
            innerHTML: this.isIgnored() ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>',
            onclick: () => {
              this.toggleIgnored();
            }
          });
          tools.appendChild(star);
          tools.appendChild(ignore);
          li.appendChild(tools);
          this.element = li;
          let a = document.createElement("a");
          a.href = this.url;
          a.className = "magazine";
          a.addEventListener("click", () => {
            this.registerClickTime();
          });
          a.title = this.fullName;
          if (this.icon) {
            let icon = document.createElement("img");
            icon.src = this.icon;
            a.appendChild(icon);
          } else {
            li.classList.add("no-image");
          }
          const span = document.createElement("span");
          span.className = "name";
          span.appendChild(document.createTextNode(this.name));
          a.appendChild(span);
          if (this.instanceName) {
            const span2 = document.createElement("span");
            span2.className = "instance-name";
            span2.appendChild(document.createTextNode("@" + this.instanceName));
            a.appendChild(span2);
          }
          li.appendChild(a);
          return li;
        }
        static fromJSON(json) {
          return new _Magazine(json.fullName, json.url, json.icon);
        }
        toJSON() {
          return {
            fullName: this.fullName,
            icon: this.icon,
            url: this.url,
            type: this.type
          };
        }
        copy() {
          return new _Magazine(this.fullName, this.url, this.icon);
        }
      };
      Magazine_default = Magazine;
    }
  });

  // src/Classes/Group.js
  var Group, Group_default;
  var init_Group = __esm({
    "src/Classes/Group.js"() {
      init_Item();
      init_Magazine();
      Group = class _Group extends Item_default {
        #isOpen = false;
        element;
        magazines = [];
        countElement;
        constructor(fullName, subMagazines) {
          super(fullName, Item_default.TYPE.GROUP);
          this.magazines = subMagazines;
          this.name = fullName;
        }
        set isOpen(isOpen) {
          this.#isOpen = !!isOpen;
        }
        get isOpen() {
          return !!this.#isOpen;
        }
        get icon() {
          if (this.isOpen) {
            return '<i class="fas fa-box-open image"></i>';
          } else {
            return '<i class="fas fa-box image"></i>';
          }
        }
        getClickTime() {
          let latest = 0;
          this.magazines.forEach((mag) => {
            if (mag.getClickTime() > latest) {
              latest = mag.getClickTime();
            }
          });
          return latest || 0;
        }
        static fromElement(element) {
          let groupA = element.querySelector("a");
          return new _Group(groupA.innerText, element.querySelector("figure img")?.src, groupA.href);
        }
        toggle() {
          this.isOpen ? this.close() : this.open();
        }
        open() {
          this.isOpen = true;
          this.element.classList.add("open");
          const a = this.element.querySelector("a");
          const icon = a.querySelector("i");
          a.setAttribute("aria-expanded", "true");
          icon.classList.remove("fa-box");
          icon.classList.add("fa-box-open");
        }
        close() {
          this.isOpen = false;
          this.element.classList.remove("open");
          const a = this.element.querySelector("a");
          const icon = a.querySelector("i");
          a.setAttribute("aria-expanded", "false");
          icon.classList.remove("fa-box-open");
          icon.classList.add("fa-box");
        }
        getElement() {
          if (this.element) {
            return this.element;
          }
          const magazineCount = this.magazineCount();
          let li = document.createElement("li");
          this.element = li;
          li.classList.add("group");
          if (this.isIgnored() || magazineCount === 0) {
            li.classList.add("ignore");
          }
          let a = document.createElement("a");
          a.className = "group-name";
          a.href = "#";
          a.title = this.fullName;
          a.ariaLabel = this.fullName;
          a.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
          });
          const count = Object.assign(document.createElement("span"), {
            className: "count",
            innerHTML: "(" + magazineCount + ")"
          });
          this.countElement = count;
          a.innerHTML = this.icon + '<span class="name">' + this.fullName + "</span>";
          a.appendChild(count);
          li.appendChild(a);
          let ul = document.createElement("ul");
          this.magazines.forEach((subMag) => {
            const el = subMag.getElement();
            ul.appendChild(el);
          });
          li.appendChild(ul);
          return li;
        }
        static fromJSON(json) {
          return new _Group(json.fullName, json.magazines.map((mag) => Magazine_default.fromJSON(mag)));
        }
        toJSON() {
          return {
            fullName: this.fullName,
            magazines: this.magazines.map((mag) => mag.toJSON()),
            type: this.type
          };
        }
        copy() {
          return new _Group(this.fullName, this.magazines.map((mag) => mag.copy()));
        }
        enableEditMode() {
          super.enableEditMode();
          if (!this.element) {
            return;
          }
          this.magazines.forEach((mag) => {
            mag.enableEditMode();
          });
          this.open();
          this.element.classList.add("edit-mode");
        }
        disableEditMode() {
          super.disableEditMode();
          if (!this.element) {
            return;
          }
          this.magazines.forEach((mag) => {
            mag.disableEditMode();
          });
          this.close();
          this.element.classList.remove("edit-mode");
          if (this.isIgnored()) {
            this.element.classList.add("ignore");
          } else {
            this.element.classList.remove("ignore");
          }
          this.countElement.innerHTML = "(" + this.magazineCount() + ")";
        }
        isStarred() {
          return this.magazines.some((mag) => mag.isStarred());
        }
        isIgnored() {
          return this.magazineCount() === 0;
        }
        hide(fadeOut = false) {
          super.hide();
          if (!this.element) {
            return;
          }
          this.magazines.forEach((mag) => {
            mag.hide(fadeOut);
          });
          this.element.classList.add("hideItem");
        }
        show(fadeIn = false) {
          super.show(fadeIn);
        }
        showAll(fadeIn = false) {
          super.show(fadeIn);
          if (!this.element) {
            return;
          }
          this.magazines.forEach((mag) => {
            mag.show();
          });
        }
        magazineCount() {
          let count = 0;
          this.magazines.forEach((mag) => {
            if (!mag.isIgnored()) {
              count++;
            }
          });
          return count;
        }
        search(query, includeIgnored = false) {
          let found = super.search(query, includeIgnored);
          if (!found && !includeIgnored && this.isIgnored()) {
            return false;
          }
          this.magazines.forEach((mag) => {
            if (mag.search(query, includeIgnored)) {
              found = true;
            }
          });
          return found;
        }
      };
      Group_default = Group;
    }
  });

  // src/Classes/Cache.js
  var Cache, Cache_default;
  var init_Cache = __esm({
    "src/Classes/Cache.js"() {
      init_utils();
      init_Group();
      init_Magazine();
      init_Item();
      Cache = class {
        constructor() {
          localStorage.removeItem("subscription-panel-cache");
        }
        save(cache) {
          const settings = getSettings();
          let cacheWrapper = {
            cache,
            timestamp: Date.now(),
            version: 1
          };
          if (settings?.useCache) {
            localStorage.setItem("subscription-panel-item-cache", JSON.stringify(cacheWrapper));
          }
        }
        remove() {
          localStorage.removeItem("subscription-panel-item-cache");
        }
        parseItem(item) {
          if (item.type === Item_default.TYPE.MAGAZINE) {
            return new Magazine_default(item.fullName, item.url, item.icon);
          } else if (item.type === Item_default.TYPE.GROUP) {
            let magazines = [];
            item.magazines.forEach((mag) => {
              magazines.push(this.parseItem(mag));
            });
            return new Group_default(item.fullName, magazines);
          }
        }
        get() {
          const settings = getSettings();
          if (settings?.useCache) {
            const cache = localStorage.getItem("subscription-panel-item-cache");
            if (cache) {
              let cacheWrapper = JSON.parse(cache);
              if (cacheWrapper.version === 1) {
                let output = [];
                cacheWrapper.cache.forEach((item) => {
                  output.push(this.parseItem(item));
                });
                return output;
              } else {
                this.remove();
                return [];
              }
            }
          }
          return [];
        }
      };
      Cache_default = Cache;
    }
  });

  // src/Classes/SettingsModal.js
  var SettingsModal, SettingsModal_default;
  var init_SettingsModal = __esm({
    "src/Classes/SettingsModal.js"() {
      init_utils();
      init_Cache();
      SettingsModal = class {
        subscriptionsPanel;
        modalElement;
        constructor(subscriptionsPanel) {
          this.subscriptionsPanel = subscriptionsPanel;
        }
        getSettingsButtonElement() {
          const settingsButton = document.createElement("div");
          settingsButton.id = "subscription-panel-settings-button";
          settingsButton.title = "Settings";
          settingsButton.ariaLabel = "Settings";
          settingsButton.innerHTML = '<i class="fa-solid fa-cog"></i>';
          settingsButton.addEventListener("click", () => {
            this.show();
          });
          return settingsButton;
        }
        init() {
          const settingsButton = this.getSettingsButtonElement();
          this.subscriptionsPanel.contentElement.appendChild(settingsButton);
          this.applySettings();
          window.addEventListener("open-subscriptions-panel-settings", () => {
            this.show();
          });
          setTimeout(() => {
            const KUP = document.KUP;
            const settingsPanel = KUP?.settingsPanel;
            const SettingsPanelBooleanRow = KUP?.components?.SettingsPanelButtonRow;
            const SettingsPanelSection = KUP?.components?.SettingsPanelSection;
            if (settingsPanel && SettingsPanelBooleanRow && SettingsPanelSection) {
              const section = new SettingsPanelSection("Subscriptions Panel");
              section.addSettingsRows([new SettingsPanelBooleanRow("Open settings", {
                label: "Open",
                onClick: () => {
                  window.dispatchEvent(new CustomEvent("open-subscriptions-panel-settings"));
                }
              })]);
              settingsPanel.addSection(section);
            }
          }, 100);
        }
        close() {
          if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
          }
        }
        /** Apply settings to the subscriptions panel
         * @param id {string} The id of the element
         * @param setting {string} The setting to apply
         * @param invert {boolean} Invert checked state from settings
         * @param callback {function} Callback to run when checkbox is changed
         */
        registerCheckbox(id, setting, invert = false, callback = null) {
          const element = document.getElementById(id);
          const settings = getSettings();
          if (settings?.[setting] === true) {
            element.checked = !invert;
          }
          element.addEventListener("change", (e) => {
            const settings2 = getSettings();
            settings2[setting] = !!e.target.checked;
            saveSettings(settings2);
            if (callback) {
              callback(element.checked);
            }
          });
        }
        show() {
          const settings = getSettings();
          const modal = document.createElement("div");
          this.modalElement = modal;
          const version = GM_info.script.version || "Unknown";
          modal.className = "subscription-panel-settings-modal subscription-panel-modal";
          modal.innerHTML = `
        <div class="subscription-panel-settings-modal-content subscription-panel-modal-content">
            <div class="subscription-panel-settings-modal-header">
                <span class="close" title="Close settings" aria-label="Close settings">
                    <i class="fa-solid fa-times"></i>
                </span>
                <h2>Subscriptions Panel Settings</h2>
                <h3>Version ${version}</h3>
            </div>
            <div class="subscription-panel-settings-modal-body">
                <ul>
                    <li>
                        <label>
                            <input type="checkbox" id="subscription-panel-extend-width" />
                            Extend page width
                            <span class="description">Extend the page width to fit the subscriptions panel</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-hide-on-collapse" />
                            Hide on collapse
                            <span class="description">Hide magazines when panel is collapsed</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-use-cache" />
                            Cache subscriptions
                            <span class="description">Cache subscriptions to load the panel quicker.</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-force-mobile" />
                            Always show mobile menu
                            <span class="description">Always show the mobile menu, even on desktop.</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-use-groups" />
                            Group identical names
                            <span class="description">Group magazines with the same name but from different instances.</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-show-last-clicked" />
                            Show recently viewed
                            <span class="description">Show recently viewed magazines.</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-sticky" />
                            Sticky panel
                            <span class="description">Make the panel stick to the top and scroll independently.</span>
                        </label>
                        <label>
                            <input type="checkbox" id="subscription-panel-alternative-menu" />
                            Alternative menu
                            <span class="description">Move the mobile menu button to the hamburger mobile menu for better compatibility with other scripts.</span>
                        <label>
                            <input type="checkbox" id="subscription-panel-show-onboarding" />
                            Show onboarding
                            <span class="description">Show the onboarding step again on next load.</span>
                        </label>
                        <label class="danger">
                            <input type="button" id="subscription-panel-reset" value="Reset settings"/>
                            <span class="description">Removes all cached data and resets settings to default.</span>
                        </label>
                    </li>
            </div>
        </div>
        `;
          document.body.appendChild(modal);
          const extendWidthEl = modal.querySelector("#subscription-panel-extend-width");
          if (settings?.extendWidth) {
            extendWidthEl.checked = true;
          }
          const hideOnCollapseEl = modal.querySelector("#subscription-panel-hide-on-collapse");
          if (settings?.hideOnCollapse) {
            hideOnCollapseEl.checked = true;
          }
          const useCacheEl = modal.querySelector("#subscription-panel-use-cache");
          if (settings?.useCache) {
            useCacheEl.checked = true;
          }
          const skipOnboardingEl = modal.querySelector("#subscription-panel-show-onboarding");
          if (settings?.onboardingDone) {
            skipOnboardingEl.checked = false;
          }
          const forceMobileEl = modal.querySelector("#subscription-panel-force-mobile");
          if (settings?.forceMobile) {
            forceMobileEl.checked = true;
          }
          const useGroupsEl = modal.querySelector("#subscription-panel-use-groups");
          if (settings?.useGroups) {
            useGroupsEl.checked = true;
          }
          const lastClickedEl = modal.querySelector("#subscription-panel-show-last-clicked");
          if (settings?.showLastClicked) {
            lastClickedEl.checked = true;
          }
          this.registerCheckbox("subscription-panel-sticky", "sticky", false, () => {
            this.applySettings();
          });
          this.registerCheckbox("subscription-panel-alternative-menu", "alternativeMenu", false, () => {
            this.applySettings();
          });
          const resetEl = modal.querySelector("#subscription-panel-reset");
          resetEl.addEventListener("click", () => {
            const cache = new Cache_default();
            cache.remove();
            resetSettings();
            window.location.reload();
          });
          modal.querySelector(".subscription-panel-settings-modal .close").addEventListener("click", () => {
            this.close();
          });
          modal.addEventListener("click", (e) => {
            if (e.target === modal) {
              this.close();
            }
          });
          modal.querySelector("#subscription-panel-extend-width").addEventListener("change", (e) => {
            const settings2 = getSettings();
            settings2.extendWidth = !!e.target.checked;
            saveSettings(settings2);
            this.applySettings();
          });
          modal.querySelector("#subscription-panel-use-cache").addEventListener("change", (e) => {
            const settings2 = getSettings();
            if (e.target.checked) {
              settings2.useCache = true;
            } else {
              settings2.useCache = false;
              const cache = new Cache_default();
              cache.remove();
            }
            saveSettings(settings2);
            this.applySettings();
          });
          modal.querySelector("#subscription-panel-hide-on-collapse").addEventListener("change", (e) => {
            const settings2 = getSettings();
            settings2.hideOnCollapse = !!e.target.checked;
            saveSettings(settings2);
            this.applySettings();
          });
          modal.querySelector("#subscription-panel-show-onboarding").addEventListener("change", (e) => {
            const settings2 = getSettings();
            settings2.onboardingDone = !e.target.checked;
            saveSettings(settings2);
          });
          modal.querySelector("#subscription-panel-use-groups").addEventListener("change", (e) => {
            const settings2 = getSettings();
            settings2.useGroups = !!e.target.checked;
            const subscriptionsHandler = this.subscriptionsPanel.subscriptionsHandler;
            subscriptionsHandler.reload().then(() => {
              this.subscriptionsPanel.addMagazinesToDOM(subscriptionsHandler.subscriptions, true);
            });
            saveSettings(settings2);
            this.applySettings();
          });
          modal.querySelector("#subscription-panel-force-mobile").addEventListener("change", (e) => {
            const settings2 = getSettings();
            settings2.forceMobile = !!e.target.checked;
            saveSettings(settings2);
            this.applySettings();
          });
          modal.querySelector("#subscription-panel-show-last-clicked").addEventListener("change", (e) => {
            const settings2 = getSettings();
            settings2.showLastClicked = !!e.target.checked;
            const subscriptionsHandler = this.subscriptionsPanel.subscriptionsHandler;
            subscriptionsHandler.reload().then(() => {
              this.subscriptionsPanel.addMagazinesToDOM(subscriptionsHandler.subscriptions, true);
            });
            saveSettings(settings2);
            this.applySettings();
          });
        }
        applySettings() {
          const settings = getSettings();
          if (settings?.extendWidth) {
            document.body.classList.add("extend-width");
          } else {
            document.body.classList.remove("extend-width");
          }
          if (settings?.collapsed) {
            this.subscriptionsPanel.collapsePanel();
          } else {
            this.subscriptionsPanel.expandPanel();
          }
          if (settings?.hideOnCollapse) {
            document.body.classList.add("subscription-panel-hide-on-collapse");
          } else {
            document.body.classList.remove("subscription-panel-hide-on-collapse");
          }
          if (settings?.forceMobile) {
            document.body.classList.add("subscription-panel-force-mobile");
          } else {
            document.body.classList.remove("subscription-panel-force-mobile");
            this.subscriptionsPanel.closeMobilePanel();
          }
          if (settings?.sticky) {
            document.body.classList.add("subscription-panel-sticky");
          } else {
            document.body.classList.remove("subscription-panel-sticky");
          }
          if (settings?.alternativeMenu) {
            document.body.classList.add("subscription-panel-alternative-menu");
          } else {
            document.body.classList.remove("subscription-panel-alternative-menu");
          }
        }
      };
      SettingsModal_default = SettingsModal;
    }
  });

  // src/Classes/SubscriptionsHandler.js
  var SubscriptionsHandler, SubscriptionsHandler_default;
  var init_SubscriptionsHandler = __esm({
    "src/Classes/SubscriptionsHandler.js"() {
      init_utils();
      init_Cache();
      init_Magazine();
      init_Item();
      init_Group();
      SubscriptionsHandler = class {
        subscriptions;
        constructor() {
          this.subscriptions = [];
        }
        reload() {
          this.subscriptions = [];
          return this.load(1);
        }
        sort() {
          const sortFunction = (a, b) => {
            if (a.isStarred() && !b.isStarred()) {
              return -1;
            } else if (!a.isStarred() && b.isStarred()) {
              return 1;
            } else {
              return a.fullName.localeCompare(b.fullName);
            }
          };
          this.subscriptions.sort((a, b) => {
            return sortFunction(a, b);
          });
          this.subscriptions.forEach((sub) => {
            if (sub.type === Item_default.TYPE.GROUP) {
              sub.magazines.sort((a, b) => {
                return sortFunction(a, b);
              });
            }
          });
        }
        append(magazines) {
          const settings = getSettings();
          const useGroups = settings?.useGroups;
          magazines.forEach(
            (mag) => {
              let found = false;
              this.subscriptions.some((sub, index) => {
                if (sub.type === Item_default.TYPE.MAGAZINE && mag.type === Item_default.TYPE.MAGAZINE && sub.url === mag.url) {
                  found = true;
                } else if (useGroups && sub.name.toLowerCase() === mag.name.toLowerCase()) {
                  if (sub.type === Item_default.TYPE.GROUP) {
                    sub.magazines.push(mag);
                  } else {
                    this.subscriptions[index] = new Group_default(sub.name, [sub, mag]);
                  }
                  found = true;
                }
                return found;
              });
              if (!found) {
                this.subscriptions.push(mag);
              }
            }
          );
          this.sort();
          const cache = new Cache_default();
          cache.save(this.subscriptions);
        }
        load(page) {
          page = page || 1;
          const fetchURL = window.location.origin + "/settings/subscriptions/magazines?p=" + page;
          const fetchPromise = fetch(fetchURL);
          return fetchPromise.then((response) => {
            const spinner = document.querySelector("#subscription-panel-spinner");
            if (spinner) {
              spinner.remove();
            }
            return response.text();
          }).then((pageContent) => {
            let dom = new DOMParser().parseFromString(pageContent, "text/html");
            let magazinesElements = dom.querySelectorAll(".section.magazines.magazines-columns ul>li");
            let magazines = [];
            if (magazinesElements.length === 0) {
              document.querySelector("#subscription-panel-content").appendChild(document.createTextNode("No subscriptions found"));
              return Promise.resolve();
            }
            magazinesElements.forEach((el) => {
              const mag = Magazine_default.fromElement(el);
              magazines.push(mag);
              const currentMagazine = window.location.pathname.match(/\/m\/(.+?)(\/|$)/);
              if (currentMagazine && currentMagazine[1] === mag.fullName) {
                mag.registerClickTime();
              }
            });
            this.append(magazines);
            let nextPage = dom.querySelector("a.pagination__item.pagination__item--next-page")?.href;
            nextPage = nextPage ? nextPage.match(/p=(\d+)/)[1] : void 0;
            nextPage = nextPage ? parseInt(nextPage) : 1;
            if (page < nextPage && page < 100) {
              return this.load(page + 1);
            } else {
              return Promise.resolve();
            }
          }).catch((error) => {
            console.error(error);
            document.querySelector("#subscription-panel-content").appendChild(document.createTextNode("Failed to load subscriptions"));
            return Promise.reject(error);
          });
        }
        loadSubscriptions(page, callback) {
          page = page || 1;
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              const spinner = document.querySelector("#subscription-panel-spinner");
              if (spinner) {
                spinner.remove();
              }
              if (xhr.status === 200) {
                let dom = new DOMParser().parseFromString(xhr.responseText, "text/html");
                let magazinesElements = dom.querySelectorAll(".section.magazines.magazines-columns ul>li");
                let magazines = [];
                magazinesElements.forEach((el) => {
                  const mag = Magazine_default.fromElement(el);
                  magazines.push(mag);
                  if (window.location && window.location.pathname === mag.url) {
                    mag.registerClickTime();
                  }
                });
                this.append(magazines);
                let nextPage = dom.querySelector("a.pagination__item.pagination__item--next-page")?.href;
                nextPage = nextPage ? nextPage.match(/p=(\d+)/)[1] : void 0;
                nextPage = nextPage ? parseInt(nextPage) : 1;
                if (page < nextPage && page < 100) {
                  this.loadSubscriptions(page + 1, callback);
                } else if (callback) {
                  callback(this.subscriptions);
                }
              } else {
                document.querySelector("#subscription-panel-content").appendChild(document.createTextNode("Failed to load subscriptions"));
              }
            }
          };
          xhr.open("GET", "/settings/subscriptions/magazines?p=" + page, true);
          xhr.send();
        }
      };
      SubscriptionsHandler_default = SubscriptionsHandler;
    }
  });

  // src/Classes/SearchBox.js
  var SearchBox, SearchBox_default;
  var init_SearchBox = __esm({
    "src/Classes/SearchBox.js"() {
      init_Magazine();
      SearchBox = class {
        #element;
        #containerElement;
        panelElement;
        searchQuery = "";
        #editMode = false;
        constructor(subscriptionsHandler, panelElement) {
          this.subscriptionsHandler = subscriptionsHandler;
          this.panelElement = panelElement;
        }
        clear() {
          this.doSearch("");
        }
        set editMode(editMode) {
          this.#editMode = !!editMode;
          this.doSearch(this.searchQuery);
        }
        get editMode() {
          return this.#editMode;
        }
        doSearch(filter) {
          filter = filter.trim();
          this.searchQuery = filter;
          this.#element.value = filter;
          let lastClickedContainer = this.panelElement.querySelector(".last-clicked-container");
          if (filter.length > 0) {
            this.#containerElement.querySelector(".search-box-clear")?.classList.add("active");
          } else {
            this.#containerElement.querySelector(".search-box-clear")?.classList.remove("active");
            lastClickedContainer.classList.remove("hideItem");
            this.subscriptionsHandler.subscriptions.forEach((mag) => {
              if (mag.type === Magazine_default.TYPE.GROUP) {
                mag.showAll();
                if (!this.editMode) {
                  mag.close();
                } else {
                  mag.open();
                }
              } else {
                mag.show();
              }
            });
            return;
          }
          filter = filter.toLowerCase();
          lastClickedContainer.classList.add("hideItem");
          this.subscriptionsHandler.subscriptions.forEach((mag) => {
            if (mag.type === Magazine_default.TYPE.GROUP) {
              mag.open();
              let subMagFound = false;
              mag.magazines.forEach((subMag) => {
                if (subMag.search(filter, this.editMode)) {
                  subMagFound = true;
                  subMag.show(true);
                } else {
                  subMag.hide(true);
                }
              });
              if (subMagFound) {
                mag.show(true);
              } else {
                mag.hide(true);
              }
            } else if (mag.type === Magazine_default.TYPE.MAGAZINE) {
              if (mag.search(filter, this.editMode)) {
                mag.show(true);
              } else {
                mag.hide(true);
              }
            }
          });
        }
        getElement() {
          if (this.#element) {
            return this.#element;
          }
          const searchBox = document.createElement("input");
          this.#element = searchBox;
          searchBox.type = "text";
          searchBox.id = "subscription-panel-search";
          searchBox.placeholder = "Filter";
          searchBox.addEventListener("input", (e) => {
            this.doSearch(e.target.value);
          });
          const searchBoxClear = document.createElement("span");
          searchBoxClear.className = "search-box-clear";
          searchBoxClear.innerHTML = '<i class="fa-solid fa-times"></i>';
          searchBoxClear.addEventListener("click", () => {
            this.clear();
          });
          searchBox.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
              this.clear();
              searchBox.blur();
            }
          });
          const searchBoxContainer = document.createElement("div");
          this.#containerElement = searchBoxContainer;
          searchBoxContainer.className = "search-box-container";
          searchBoxContainer.appendChild(searchBox);
          searchBoxContainer.appendChild(searchBoxClear);
          return searchBoxContainer;
        }
      };
      SearchBox_default = SearchBox;
    }
  });

  // src/Classes/SubscriptionsPanel.js
  var SubscriptionsPanel, SubscriptionsPanel_default;
  var init_SubscriptionsPanel = __esm({
    "src/Classes/SubscriptionsPanel.js"() {
      init_Cache();
      init_utils();
      init_SubscriptionsHandler();
      init_SearchBox();
      init_Magazine();
      SubscriptionsPanel = class {
        subscriptionsHandler;
        containerElement;
        contentElement;
        editMode = false;
        constructor() {
          this.subscriptionsHandler = new SubscriptionsHandler_default();
        }
        init() {
          const settings = getSettings();
          document.body.classList.add("subscription-panel-injected");
          const kbinContainer = document.querySelector("#middle > .kbin-container");
          const magazinePanelContainer = document.createElement("div");
          this.containerElement = magazinePanelContainer;
          magazinePanelContainer.id = "subscription-panel";
          const magazinePanel = document.createElement("aside");
          this.contentElement = magazinePanel;
          const magazinePanelUl = document.createElement("ul");
          magazinePanelUl.className = "fade-in subscription-list";
          magazinePanelUl.addEventListener("animationend", () => {
            magazinePanelUl.classList.remove("fade-in");
          });
          const title = document.createElement("h3");
          magazinePanel.id = "subscription-panel-content";
          title.innerHTML = '<span class="subscription-panel-header">Subscriptions</span>';
          magazinePanel.appendChild(title);
          const editButton = Object.assign(document.createElement("div"), {
            id: "subscription-panel-edit-button",
            title: "Edit subscriptions",
            ariaLabel: "Edit subscriptions",
            innerHTML: '<i class="fa-solid fa-pencil"></i>'
          });
          editButton.addEventListener("click", () => {
            this.toggleEditMode();
          });
          magazinePanel.appendChild(editButton);
          magazinePanelContainer.appendChild(magazinePanel);
          kbinContainer.appendChild(magazinePanelContainer);
          const searchBox = new SearchBox_default(this.subscriptionsHandler, magazinePanelContainer);
          this.searchBox = searchBox;
          magazinePanel.appendChild(searchBox.getElement());
          const collapseButton = document.createElement("span");
          collapseButton.id = "subscription-panel-collapse-button";
          collapseButton.title = "Hide Subscriptions";
          collapseButton.ariaLabel = "Hide Subscriptions";
          collapseButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
          title.addEventListener("click", () => {
            this.toggleCollapsePanel();
          });
          title.appendChild(collapseButton);
          if (settings?.forceMobile || !settings?.alternativeMenu) {
            const menu = document.querySelector(".kbin-container > menu");
            const mobileButtonLi = document.createElement("li");
            const mobileButton = document.createElement("a");
            mobileButton.className = "subscription-panel-mobile-button";
            mobileButton.title = "Subscriptions";
            mobileButton.ariaLabel = "Subscriptions";
            mobileButton.href = "#";
            mobileButton.innerHTML = '<i class="fa-solid fa-newspaper"></i>';
            mobileButton.addEventListener("click", (e) => {
              this.toggleOpenMobilePanel();
              e.preventDefault();
            });
            mobileButtonLi.appendChild(mobileButton);
            menu.insertBefore(mobileButtonLi, menu.firstChild);
            magazinePanelContainer.addEventListener("click", (e) => {
              if (e.target === magazinePanelContainer) {
                if (document.body.classList.contains("subscription-panel-open")) {
                  this.closeMobilePanel();
                }
              }
            });
          }
          const altMobileButton = Object.assign(document.createElement("a"), {
            title: "Subscriptions",
            ariaLabel: "Subscriptions",
            href: "#",
            innerHTML: '<i class="fa-solid fa-newspaper"></i>'
          });
          altMobileButton.addEventListener("click", (e) => {
            this.toggleOpenMobilePanel();
            e.preventDefault();
          });
          const mobileMenu = document.querySelector(".top-options menu ul");
          const mobileMenuLi = Object.assign(document.createElement("li"), {
            className: "mobile-subscriptions-panel-button-alt"
          });
          mobileMenuLi.appendChild(altMobileButton);
          mobileMenu.insertBefore(mobileMenuLi, mobileMenu.lastChild.previousSibling);
          const altCloseButton = Object.assign(document.createElement("a"), {
            className: "subscription-panel-mobile-close-button-alt",
            title: "Close",
            ariaLabel: "Close",
            innerHTML: '<i class="fa-solid fa-times"></i>',
            href: "#"
          });
          altCloseButton.addEventListener("click", (e) => {
            this.closeMobilePanel();
            e.preventDefault();
          });
          magazinePanel.insertBefore(altCloseButton, magazinePanel.firstChild);
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.attributeName === "class") {
                const attributeValue = mutation.target.getAttribute(mutation.attributeName);
                if (attributeValue.includes("open")) {
                  this.closeMobilePanel();
                }
              }
            });
          });
          observer.observe(document.getElementById("sidebar"), { attributes: true });
          const lastClickedContainer = document.createElement("div");
          lastClickedContainer.className = "last-clicked-container";
          lastClickedContainer.appendChild(Object.assign(document.createElement("h3"), {
            innerText: "Recently viewed"
          }));
          const magazinePanelLastClickedUl = document.createElement("ul");
          magazinePanelLastClickedUl.className = "fade-in last-clicked-list";
          if (settings?.showLastClicked !== true) {
            lastClickedContainer.classList.add("hideItem");
          }
          lastClickedContainer.appendChild(magazinePanelLastClickedUl);
          magazinePanel.appendChild(lastClickedContainer);
          magazinePanel.appendChild(magazinePanelUl);
          const cache = new Cache_default();
          let cacheData = cache.get();
          if (cacheData.length > 0) {
            this.addMagazinesToDOM(cacheData, false);
          } else {
            let spinner = document.createElement("div");
            spinner.id = "subscription-panel-spinner";
            spinner.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            magazinePanel.appendChild(spinner);
          }
          this.subscriptionsHandler.load().then(() => {
            this.addMagazinesToDOM(this.subscriptionsHandler.subscriptions, true);
          });
          window.addEventListener("hide-all-modals", () => {
            this.closeMobilePanel();
          });
        }
        enableEditMode() {
          this.editMode = true;
          this.containerElement.classList.add("edit-mode");
          this.expandPanel();
          this.subscriptionsHandler.subscriptions.forEach((mag) => {
            mag.enableEditMode();
          });
          this.searchBox.editMode = true;
          const editButton = document.getElementById("subscription-panel-edit-button");
          editButton.innerHTML = '<i class="fa-solid fa-check"></i> Done';
          editButton.classList.add("active");
        }
        disableEditMode() {
          this.editMode = false;
          this.containerElement.classList.remove("edit-mode");
          this.subscriptionsHandler.subscriptions.forEach((mag) => {
            mag.disableEditMode();
          });
          this.subscriptionsHandler.sort();
          this.addMagazinesToDOM(this.subscriptionsHandler.subscriptions);
          const editButton = document.getElementById("subscription-panel-edit-button");
          editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
          editButton.classList.remove("active");
          this.searchBox.editMode = false;
          this.searchBox.clear();
        }
        toggleEditMode() {
          if (this.editMode) {
            this.disableEditMode();
          } else {
            this.enableEditMode();
          }
        }
        toggleCollapsePanel() {
          const settings = getSettings();
          if (document.body.classList.contains("subscription-panel-collapsed")) {
            this.expandPanel();
            settings.collapsed = false;
          } else {
            if (this.collapsePanel()) {
              settings.collapsed = true;
            }
          }
          saveSettings(settings);
        }
        collapsePanel() {
          if (window.innerWidth <= 991.98 || document.body.classList.contains("subscription-panel-force-mobile") || this.editMode) {
            return false;
          }
          const lastClickedH3 = document.querySelector(".last-clicked-container h3");
          if (lastClickedH3) {
            lastClickedH3.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> Recent';
          }
          if (document.body.classList.contains("sidebar-left")) {
            document.querySelector("#subscription-panel-collapse-button i").className = "fa-solid fa-chevron-left";
          } else {
            document.querySelector("#subscription-panel-collapse-button i").className = "fa-solid fa-chevron-right";
          }
          const button = document.querySelector("#subscription-panel-collapse-button");
          button.title = "Show subscriptions";
          button.ariaLabel = "Show subscriptions";
          document.querySelector(".subscription-panel-header").innerHTML = '<i class="fa-solid fa-newspaper"></i> Subs';
          document.body.classList.add("subscription-panel-collapsed");
          return true;
        }
        expandPanel() {
          if (document.body.classList.contains("sidebar-left")) {
            document.querySelector("#subscription-panel-collapse-button i").className = "fa-solid fa-chevron-right";
          } else {
            document.querySelector("#subscription-panel-collapse-button i").className = "fa-solid fa-chevron-left";
          }
          const lastClickedH3 = document.querySelector(".last-clicked-container h3");
          if (lastClickedH3) {
            lastClickedH3.innerText = "Recently viewed";
          }
          const button = document.querySelector("#subscription-panel-collapse-button");
          button.title = "Hide subscriptions";
          button.ariaLabel = "Hide subscriptions";
          document.querySelector(".subscription-panel-header").innerText = "Subscriptions";
          document.body.classList.remove("subscription-panel-collapsed");
          return true;
        }
        toggleOpenMobilePanel() {
          if (document.body.classList.contains("subscription-panel-open")) {
            this.closeMobilePanel();
          } else {
            this.openMobilePanel();
          }
        }
        openMobilePanel() {
          window.dispatchEvent(new Event("hide-all-modals"));
          document.body.classList.add("subscription-panel-open");
          if (!document.body.classList.contains("fixed-navbar")) {
            window.scrollTo(0, 0);
          }
          document.getElementById("sidebar")?.classList.remove("open");
        }
        closeMobilePanel() {
          document.body.classList.remove("subscription-panel-open");
        }
        addMagazinesToDOM(magazines) {
          const magazinePanelUl = document.querySelector("#subscription-panel ul.subscription-list");
          const lastClickedContainer = document.querySelector("#subscription-panel .last-clicked-container");
          const magazinePanelLastClickedUl = document.querySelector("#subscription-panel ul.last-clicked-list");
          magazinePanelUl.innerHTML = "";
          magazinePanelLastClickedUl.innerHTML = "";
          const settings = getSettings();
          if (settings?.showLastClicked === true) {
            lastClickedContainer.classList.remove("hideItem");
            let lastMagazines = [...magazines].sort((a, b) => {
              return b.getClickTime() - a.getClickTime();
            }).slice(0, 4);
            lastMagazines = lastMagazines.filter((mag) => mag.getClickTime() > 0);
            if (lastMagazines.length === 0) {
              lastClickedContainer.classList.add("hideItem");
            } else {
              lastMagazines.forEach((mag) => {
                const newMag = mag.copy();
                if (newMag.type === Magazine_default.TYPE.GROUP) {
                  newMag.magazines.sort((a, b) => {
                    return b.getClickTime() - a.getClickTime();
                  });
                }
                let el = newMag.getElement();
                el.classList.add("last-clicked");
                magazinePanelLastClickedUl.appendChild(el);
              });
            }
          } else {
            lastClickedContainer.classList.add("hideItem");
          }
          magazines.forEach((mag) => {
            let el = mag.getElement();
            magazinePanelUl.appendChild(el);
          });
        }
      };
      SubscriptionsPanel_default = SubscriptionsPanel;
    }
  });

  // src/Classes/OnboardingModal.js
  var OnboardingModal, OnboardingModal_default;
  var init_OnboardingModal = __esm({
    "src/Classes/OnboardingModal.js"() {
      init_utils();
      OnboardingModal = class {
        modalElement;
        constructor() {
        }
        init() {
          const settings = getSettings();
          if (!settings?.onboardingDone) {
            settings.onboardingDone = true;
            saveSettings(settings);
            this.show();
          }
        }
        close() {
          if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
          }
        }
        show() {
          const onboarding = document.createElement("div");
          this.modalElement = onboarding;
          onboarding.className = "subscription-panel-onboarding subscription-panel-modal";
          onboarding.innerHTML = `
        <div class="subscription-panel-onboarding-content subscription-panel-modal-content">
            <div class="subscription-panel-onboarding-close close" title="Close onboarding" aria-label="Close onboarding"><i class="fa-solid fa-times"></i></div>
            <h2>Thanks for using Subscriptions Panel!</h2>
            <p>Click on the <i class="fa-solid fa-chevron-left"></i> icon to collapse the panel.</p>
            <p>Click on the <i class="fa-solid fa-cog"></i> icon to open the settings.</p>
            <p>Click on the <i class="fa-solid fa-newspaper"></i> icon to open the panel on mobile.</p>
            <p>Magazines that share the same name are grouped together. A group is indicated by a <i class="fa-solid fa-box"></i> icon.</p>
            <p>Please take a few seconds to review the settings in the next step. You can always do this later if you want.</p>
            <a href="#" class="subscription-panel-onboarding-next">Show settings <i class="fa-solid fa-chevron-right"></i></a>
        </div>
        `;
          onboarding.querySelector(".subscription-panel-onboarding-close").addEventListener("click", (e) => {
            this.close();
            e.preventDefault();
          });
          onboarding.querySelector(".subscription-panel-onboarding-next").addEventListener("click", (e) => {
            this.close();
            window.dispatchEvent(new Event("open-subscriptions-panel-settings"));
            e.preventDefault();
          });
          onboarding.addEventListener("click", (e) => {
            if (e.target === onboarding) {
              this.close();
              window.dispatchEvent(new Event("open-subscriptions-panel-settings"));
              e.preventDefault();
            }
          });
          document.body.appendChild(onboarding);
        }
      };
      OnboardingModal_default = OnboardingModal;
    }
  });

  // src/index.js
  var require_src = __commonJS({
    "src/index.js"() {
      init_style();
      init_SettingsModal();
      init_SubscriptionsPanel();
      init_OnboardingModal();
      var loginElement = document.querySelector(".login");
      if (!loginElement.href.endsWith("/login")) {
        const subscriptionsPanel = new SubscriptionsPanel_default();
        const settingsModal = new SettingsModal_default(subscriptionsPanel);
        const onboardingModal = new OnboardingModal_default(settingsModal);
        subscriptionsPanel.init();
        settingsModal.init();
        onboardingModal.init();
      }
    }
  });
  require_src();
})();
})();
