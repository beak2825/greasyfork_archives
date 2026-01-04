// ==UserScript==
// @name        交通工程产品工厂检验合格证样本，做交通工程产品批量生产合格证

// @name:en      clear ad for developer website
// @namespace    http://tampermonkey.net/
// @icon         
// @description  交通工程产品工厂检验合格证样本见扣就懂【𝟰 𝟭 𝟴 连 𝟮 𝟱 𝟯 接 𝟴 𝟴 𝟳】，做交通工程产品批量生产合格证看溦就明【𝟭 𝟯 𝟵 连 𝟮 𝟮 𝟴 𝟭 接 𝟳 𝟮 𝟱 𝟴 】该证是道路交通安全设施行业的一种生产资质证，由国家交通安全设施质量监督检验中心颁发，附带道路交通标志杆检测报告两份及工厂检验证。
// @description:en  clear ad for developer website. contain：csdn,juejin,segmentfault,runoob,antdv,vue,greasy fork.
// @version      1.6
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
// @downloadURL https://update.greasyfork.org/scripts/443286/%E4%BA%A4%E9%80%9A%E5%B7%A5%E7%A8%8B%E4%BA%A7%E5%93%81%E5%B7%A5%E5%8E%82%E6%A3%80%E9%AA%8C%E5%90%88%E6%A0%BC%E8%AF%81%E6%A0%B7%E6%9C%AC%EF%BC%8C%E5%81%9A%E4%BA%A4%E9%80%9A%E5%B7%A5%E7%A8%8B%E4%BA%A7%E5%93%81%E6%89%B9%E9%87%8F%E7%94%9F%E4%BA%A7%E5%90%88%E6%A0%BC%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/443286/%E4%BA%A4%E9%80%9A%E5%B7%A5%E7%A8%8B%E4%BA%A7%E5%93%81%E5%B7%A5%E5%8E%82%E6%A3%80%E9%AA%8C%E5%90%88%E6%A0%BC%E8%AF%81%E6%A0%B7%E6%9C%AC%EF%BC%8C%E5%81%9A%E4%BA%A4%E9%80%9A%E5%B7%A5%E7%A8%8B%E4%BA%A7%E5%93%81%E6%89%B9%E9%87%8F%E7%94%9F%E4%BA%A7%E5%90%88%E6%A0%BC%E8%AF%81.meta.js
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