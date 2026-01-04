// ==UserScript==
// @name         开发者网站去广告
// @name:zh-CN   开发者网站去广告
// @name:zh-TW   開發者網站去廣告
// @name:en      clear ad for developer website
// @namespace    http://tampermonkey.net/
// @icon         data:image/png;base64,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
// @description  去除开发者网站中的广告。包括：csdn、掘金、思否、菜鸟教程、antdv、vue、油猴。
// @description:zh-tw  去除開發者網站中的廣告。包括：csdn、掘金、思否、菜鳥教程、antdv、vue、油猴。
// @description:en  clear ad for developer website. contain：csdn,juejin,segmentfault,runoob,antdv,vue,greasy fork.
// @version      1.23
// @author       CodeKnife
// @match        *://*.csdn.net/*
// @match        *://*.juejin.cn/*
// @match        *://*.segmentfault.com/*
// @match        *://*.csdn.net/*
// @match        *://*.runoob.com/*
// @match        *://*.antdv.com/*
// @match        *://*.vuejs.org/*
// @match        *://*.greasyfork.org/*
// @grant        none
// @license      AGPL License
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/442918/%E5%BC%80%E5%8F%91%E8%80%85%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/442918/%E5%BC%80%E5%8F%91%E8%80%85%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
 
let dom = {};
dom.query = jQuery.noConflict(true);
dom.query(document).ready(function ($) {
  "use strict";
  const cycle = 200; // 广告检测周期
 
  const clearList = (list) => {
    for (let i of list) {
      if (i) {
        i.remove();
      }
    }
  };
 
  // csdn
  if (location.href.indexOf("csdn.net") > 0) {
    const ban = () => {
      let list = [
        $("#asideNewNps"),
        $("#footerRightAds"),
        $("#recommendAdBox"),
        $(".passport-login-container"),
      ];
      clearList(list);
    };
    ban();
    setInterval(() => {
      ban();
    }, cycle);
  }
 
  // juejin
  if (location.href.indexOf("juejin.cn") > 0) {
    const ban = () => {
      let list = [$(".sidebar-bd-entry"), $(".activity-ad")];
      clearList(list);
    };
    ban();
    setInterval(() => {
      ban();
    }, cycle);
  }
 
  // 思否segmentfault
  if (location.href.indexOf("segmentfault.com") > 0) {
    const ban = () => {
      let list = [
        $(".sticky-outer-wrapper:eq(3)"),
        $(".sticky-outer-wrapper:eq(1)"),
        $(".right-side").children().last(),
        $(".card-body").children("div:eq(3)"),
      ];
      clearList(list);
    };
    ban();
    setTimeout(() => {
      ban();
    }, cycle);
  }
 
  // runoob
  if (location.href.indexOf("runoob.com") > 0) {
    const ban = () => {
      let list = [
        $(".fivecol").children(".sidebar-box:eq(1)"),
        $(".article").children(".sidebar-box"),
      ];
      clearList(list);
    };
    ban();
  }
 
  // antdv
  if (location.href.indexOf("www.antdv.com") > 0) {
    const ban = () => {
      let list = [$("section.main-menu-inner").children().first(), $("#rice")];
      clearList(list);
    };
    ban();
    setTimeout(() => {
      ban();
    }, cycle);
  }
  if (location.href.indexOf("1x.antdv.com") > 0) {
    const ban = () => {
      let list = [$("section.main-menu-inner").children("div"), $("#rice")];
      clearList(list);
    };
    ban();
    setTimeout(() => {
      ban();
    }, cycle);
  }
 
  // vue
  if (location.href.indexOf("vuejs.org") > 0) {
    const ban = () => {
      let list = [$(".wwads-cn"), $("#carbonads")];
      clearList(list);
    };
    ban();
    setInterval(() => {
      ban();
    }, cycle);
  }
 
  // GF
  if (location.href.indexOf("greasyfork.org") > 0) {
    const ban = () => {
      let list = [$("#script-show-info-ad"), $(".ad.carbon-ad")];
      clearList(list);
    };
    ban();
    setInterval(() => {
      ban();
    }, cycle);
  }
});