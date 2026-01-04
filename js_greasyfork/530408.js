// ==UserScript==
// @name      PT站自动签到
// @author    csf2001
// @namespace csf2001
// @version   1.0.5
// @license   MIT
// @description PT站自动点击签到
// @match     *://www.hitpt.com/*
// @match     *://ptfans.cc/*
// @match     *://rousi.zip/*
// @match     *://sunnypt.top/*
// @match     *://crabpt.vip/*
// @match     *://zmpt.cc/*
// @match     *://ptlgs.org/*
// @match     *://sanpro.pw/*
// @match     *://pt.0ff.cc/*
// @match     *://cyanbug.net/*
// @match     *://open.cd/*
// @match     *://sewerpt.com/*
// @match     *://njtupt.top/*
// @match     *://ourbits.club/*
// @match     *://hdhome.org/*
// @match     *://pterclub.com/*
// @match     *://lemonhd.org/*
// @match     *://www.pthome.net/*
// @match     *://pt.btschool.club/*
// @match     *://pt.soulvoice.club/*
// @match     *://1ptba.com/*
// @match     *://www.hddolby.com/*
// @match     *://hdzone.me/*
// @match     *://hddisk.life/*
// @match     *://discfan.net/*
// @match     *://www.hdarea.co/*
// @match     *://hdcity.city/*
// @match     *://dhcmusic.xyz/*
// @match     *://totheglory.im/*
// @match     *://www.nicept.net/*
// @match     *://yingk.com/*
// @match     *://hdstreet.club/*
// @match     *://52pt.site/*
// @match     *://moecat.best/*
// @match     *://pt.hd4fans.org/*
// @match     *://www.haidan.video/*
// @match     *://www.pttime.org/*
// @match     *://hdtime.org/*
// @match     *://audiences.me/*
// @match     *://*.tjupt.org/*
// @match     *://*.hdfans.org/*
// @match     *://*.oshen.win/*
// @match     *://*.sharkpt.net/*
// @match     *://*.ptskit.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530408/PT%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/530408/PT%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
  var host = window.location.host;
  var href = window.location.href;

  function checkAndClick(element, text, additionalCondition) {
    if (element && element.innerText.indexOf(text) !== -1 && (additionalCondition === undefined || additionalCondition)) {
      element.click();
    }
  }

  function getElementBySite(siteHost, selectors) {
    if (host.indexOf(siteHost) !== -1) {
      for (var i = 0; i < selectors.length; i++) {
        var element = selectors[i]();
        if (element) return element;
      }
    }
    return null;
  }

  function safeGetElementByClassName(className, index) {
    var elements = document.getElementsByClassName(className);
    return elements && elements.length > index ? elements[index] : null;
  }

  function safeGetElementById(id) {
    var element = document.getElementById(id);
    return element ? element : null;
  }

  function safeGetTagFromElement(element, tagName, index) {
    if (element) {
      var tags = element.getElementsByTagName(tagName);
      return tags && tags.length > index ? tags[index] : null;
    }
    return null;
  }

  function generateElements(config) {
    var elements = {};
    for (var key in config) {
      elements[key] = getElementBySite(config[key].host, config[key].selectors);
    }
    return elements;
  }

  setTimeout(function () {
    var elementsConfig = {
      hitptSign: { host: "hitpt", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      ptfansSign: { host: "ptfans", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      rousiSign: { host: "rousi", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      sunnyptSign: { host: "sunnypt", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      crabptSign: { host: "crabpt", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      zmptSign: { host: "zmpt", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      ptlgsSign: { host: "ptlgs", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      sanproSign: { host: "sanpro", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      pt0ffSign: { host: "pt.0ff", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      cyanbugSign: { host: "cyanbug", selectors: [function () { return safeGetElementByClassName("nav-btn", 3); }] },
      opencdSign: { host: "open.cd", selectors: [function () { return safeGetTagFromElement(safeGetElementByClassName("infos-bar", 4), "a", 0); }] },
      sewerptSign: { host: "sewerpt", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      njtuptSign: { host: "njtupt", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      ourbitsSign: { host: "ourbits", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      hdhomeSign: { host: "hdhome", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      pterSign: { host: "pterclub", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      lemonhdSign: { host: "lemonhd", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      pthomeSign: { host: "pthome", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      btschoolSign: { host: "btschool", selectors: [function () {
        var outer = safeGetElementById("outer");
        return outer ? Array.prototype.find.call(outer.getElementsByTagName("a"), function (a) { return a.href.indexOf("addbonus") !== -1; }) : null;
      }] },
      soulvoiceSign: { host: "soulvoice", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      _1ptbaSign: { host: "1ptba", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      hddolbySign: { host: "hddolby", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      hdzoneSign: { host: "hdzone", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      hddiskSign: { host: "hddisk", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      discfanSign: { host: "discfan", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      hdareaSign: { host: "hdarea", selectors: [function () { return safeGetTagFromElement(safeGetElementById("sign_in"), "a", 0); }] },
      hdcitySign: { host: "hdcity", selectors: [function () { return safeGetTagFromElement(safeGetElementById("bottomnav"), "a", 1); }] },
      dhcmusicSign: { host: "dhcmusic", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      ttgSign: { host: "totheglory", selectors: [function () { return safeGetTagFromElement(safeGetElementById("sp_signed"), "a", 0); }] },
      niceptSign: { host: "nicept", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      haidanSign: { host: "haidan", selectors: [function () { return safeGetElementById("modalBtn"); }] },
      pttimeSign: { host: "pttime", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      hdtimeSign: { host: "hdtime", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      audiencesSign: { host: "audiences", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      hdfansSign: { host: "hdfans", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      oshenSign: { host: "oshen", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      sharkptSign: { host: "sharkpt", selectors: [function () {
        var tooltip = Array.prototype.find.call(document.getElementsByTagName("shark-tooltip") || [], function (e) { return e.label === "签到"; });
        return tooltip ? safeGetTagFromElement(safeGetTagFromElement(tooltip.getElementsByTagName("shark-icon-button")[0], "shadowRoot", 0), "button", 0) : null;
      }] },
      yingkSign: { host: "yingk", selectors: [function () { return safeGetElementById("game"); }] },
      hdstreetSign: { host: "hdstreet", selectors: [function () { return safeGetTagFromElement(safeGetElementByClassName("medium", 0), "a", 5); }] },
      _52ptSign: { host: "52pt", selectors: [function () { return safeGetElementById("game"); }] },
      moecatSign: { host: "moecat", selectors: [function () { return safeGetElementById("game"); }] },
      hd4fanSign: { host: "hd4fans", selectors: [function () { return safeGetTagFromElement(safeGetElementById("checkin"), "a", 0); }] },
      tjuptSign: { host: "tjupt", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
      ptskitSign: { host: "ptskit", selectors: [function () { return safeGetElementByClassName("faqlink", 0); }] },
    };

    var elements = generateElements(elementsConfig);

    var conditions = [
      { host: "hitpt", element: elements.hitptSign, text: "签到得魔力" },
      { host: "ptfans", element: elements.ptfansSign, text: "签到得魔力" },
      { host: "rousi", element: elements.rousiSign, text: "签到得魔力" },
      { host: "sunnypt", element: elements.sunnyptSign, text: "签到得魔力" },
      { host: "crabpt", element: elements.crabptSign, text: "签到得魔力" },
      { host: "zmpt", element: elements.zmptSign, text: "签到得电力" },
      { host: "ptlgs", element: elements.ptlgsSign, text: "签到得工分" },
      { host: "sanpro", element: elements.sanproSign, text: "签到得魔力" },
      { host: "pt.0ff", element: elements.pt0ffSign, text: "签到得魔力", additionalCondition: href.indexOf("attendance") < 0 },
      { host: "cyanbug", element: elements.cyanbugSign, text: "签到得魔力" },
      { host: "open.cd", element: elements.opencdSign, text: "签到" },
      { host: "sewerpt", element: elements.sewerptSign, text: "签到得金币" },
      { host: "njtupt", element: elements.njtuptSign, text: "签到得魔力" },
      { host: "ourbits", element: elements.ourbitsSign, text: "签到得魔力" },
      { host: "hdhome", element: elements.hdhomeSign, text: "签到得魔力" },
      { host: "pterclub", element: elements.pterSign, text: "签到得猫粮" },
      { host: "lemonhd", element: elements.lemonhdSign, text: "签到" },
      { host: "pthome", element: elements.pthomeSign, text: "签到得魔力" },
      { host: "btschool", element: elements.btschoolSign, text: "每日签到" },
      { host: "soulvoice", element: elements.soulvoiceSign, text: "签到得魔力" },
      { host: "1ptba", element: elements._1ptbaSign, text: "签到得魔力" },
      { host: "hddolby", element: elements.hddolbySign, text: "签到得鲸币" },
      { host: "hdzone", element: elements.hdzoneSign, text: "签到得魔力" },
      { host: "hddisk", element: elements.hddiskSign, text: "签到得魔力" },
      { host: "discfan", element: elements.discfanSign, text: "签到得魔力" },
      { host: "hdarea", element: elements.hdareaSign, text: "签到" },
      { host: "hdcity", element: elements.hdcitySign, text: "签到", additionalCondition: elements.hdcitySign && elements.hdcitySign.innerText.indexOf("已签到") < 0 },
      { host: "dhcmusic", element: elements.dhcmusicSign, text: "签到得魔力" },
      { host: "totheglory", element: elements.ttgSign, text: "签到" },
      { host: "nicept", element: elements.niceptSign, text: "签到得魔力" },
      { host: "haidan", element: elements.haidanSign, text: "每日打卡" },
      { host: "pttime", element: elements.pttimeSign, text: "签到领魔力" },
      { host: "hdtime", element: elements.hdtimeSign, text: "签到得魔力" },
      { host: "audiences", element: elements.audiencesSign, text: "签到得魔力" },
      { host: "hdfans", element: elements.hdfansSign, text: "签到得魔力" },
      { host: "oshen", element: elements.oshenSign, text: "签到得魔力" },
      { host: "sharkpt", element: elements.sharkptSign },
      { host: "yingk", element: elements.yingkSign, text: "每日签到", additionalCondition: href.indexOf("bakatest") < 0 },
      { host: "hdstreet", element: elements.hdstreetSign, text: "每日签到", additionalCondition: href.indexOf("bakatest") < 0 },
      { host: "52pt", element: elements._52ptSign, text: "签到赚魔力", additionalCondition: href.indexOf("bakatest") < 0 },
      { host: "moecat", element: elements.moecatSign, text: "每日签到", additionalCondition: href.indexOf("bakatest") < 0 },
      { host: "hd4fans", element: elements.hd4fanSign, text: "签 到" },
      { host: "tjupt", element: elements.tjuptSign, text: "签到得魔力", additionalCondition: href.indexOf("attendance") < 0 },
      { host: "ptskit", element: elements.ptskitSign, text: "签到得魔力", additionalCondition: href.indexOf("attendance") < 0 },
    ];

    conditions.forEach(function (condition) {
      if (host.indexOf(condition.host) !== -1) {
        checkAndClick(condition.element, condition.text, condition.additionalCondition);
      }
    });
  }, 500);
})();