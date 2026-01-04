// ==UserScript==
// @name         PT站点自动签到
// @namespace    dhjesus
// @version      1.3.8
// @description  pt站点自动签到
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAgCAYAAACYTcH3AAAAAXNSR0IArs4c6QAAAbxJREFUWEftlz1IQlEUx/9Xn4hBRGNNBdXQh0a1RIsRfdDmUCQ0CAUt0ahCi0sNrrUEDm4NDQ8iomiwIWjRIKmlpaYc4xVU0vPduI8EET/O1ScOvTs+/uec3/ufc97lMRCPqhspgD8FFOcWMQSqXjgC2FBAccxSYhhFJDSqbnAA19TEfzEpAP6A4iDVIYn+L4w3oq05GHY4x3S1tsX2OvHyXEAy8UntLEKbHejrdyK2+1ErJsO5cZaNd8eYL6xtg+GgXoUWwpilGeOrzBfR0gAm2w3DOc8KGLEldY+wPPdawOV5vq62KFhcdqOn10luLRmGTNCE0IapZp7tjO3MxJQLd+kf8n61bGZWgh6MjCo4Vb/JQC2BKYI8Pug4Of5qnzONgpj3E/U6EJbPL7lxdZGHeONKpxkQKZiBQQXrIY/JIKwvB2oWRApGiIU7omg5kBUg0jCVgIbHXCak7LBWajN5ZkqDSx0Sz60AaciZIpQAmltwI5czpNa31p435Az5wyEptGHsW1tyZMB8Ue0GHDOygVbrGcMt84bfNxjjCauTy+bjQND88R+PvvkBx36t31vZ5BL6DDiS9/Guw1/5Ifek+Vvu+AAAAABJRU5ErkJggg==
// @author       DHJesus
// @match     *://ourbits.club/*
// @match     *://hdhome.org/*
// @match     *://hdchina.org/*
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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398560/PT%E7%AB%99%E7%82%B9%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/398560/PT%E7%AB%99%E7%82%B9%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
  var host = window.location.host;
  var href = window.location.href;
  setTimeout(function () {
    var ourbitsSign = document.getElementsByClassName("faqlink")[0];
    var hdhomeSign = document.getElementsByClassName("faqlink")[0];
    var hdc = document.getElementsByClassName("userinfort")[0];
    if (hdc) {
      var hdchinaSign = hdc.getElementsByTagName("a")[1];
    }
    var pterSign = document.getElementsByClassName("faqlink")[0];
    var lemonhdSign = document.getElementsByClassName("faqlink")[0];
    var pthomeSign = document.getElementsByClassName("faqlink")[0];
    var btschool = document.getElementById("outer");
    if (btschool) {
      var btschoolSign = btschool.getElementsByTagName("a");
      for (var i = 0; i < btschoolSign.length; i++) {
        var _href = btschoolSign[i].href;
        if (_href.indexOf("addbonus") != -1) {
          btschoolSign = btschoolSign[i];
          break;
        }
      }
    }
    var soulvoiceSign = document.getElementsByClassName("faqlink")[0];
    var _1ptbaSign = document.getElementsByClassName("faqlink")[0];
    var hddolbySign = document.getElementsByClassName("faqlink")[0];
    var hdzoneSign = document.getElementsByClassName("faqlink")[0];
    var hddiskSign = document.getElementsByClassName("faqlink")[0];
    var discfanSign = document.getElementsByClassName("faqlink")[0];
    var hdarea = document.getElementById("sign_in");
    if (hdarea) {
      var hdareaSign = hdarea.getElementsByTagName("a")[0];
    }
    var hdcity = document.getElementById("bottomnav");
    if (hdcity) {
      var hdcitySign = hdcity.getElementsByTagName("a")[1];
    }
    var dhcmusicSign = document.getElementsByClassName("faqlink")[0];
    var ttg = document.getElementById("sp_signed");
    if (ttg) {
      var ttgSign = ttg.getElementsByTagName("a")[0];
    }
    var niceptSign = document.getElementsByClassName("faqlink")[0];
    var haidanSign = document.getElementById("modalBtn");
    var pttimeSign = document.getElementsByClassName("faqlink")[0];
    var hdtimeSign = document.getElementsByClassName("faqlink")[0];
    var audiencesSign = document.getElementsByClassName("faqlink")[0];
    var hdfansSign = document.getElementsByClassName("faqlink")[0];
    var oshenSign = document.getElementsByClassName("faqlink")[0];
    var sharkpt = document.getElementsByTagName('shark-tooltip');
    for (let i = 0; i < sharkpt.length; i++) {
      const element = sharkpt[i];
      if(element.label === '签到') {
        var sharkptSign = element.getElementsByTagName('shark-icon-button')[0].shadowRoot.querySelector('.button--high-warn');
        break;
      }
    }

    // BAKATEST SITE
    var yingkSign = document.getElementById("game");
    var hdstreet = document.getElementsByClassName("medium")[0];
    if (hdstreet) {
      var hdstreetSign = hdstreet.getElementsByTagName("a")[5];
    }
    var _52ptSign = document.getElementById("game");
    var moecatSign = document.getElementById("game");
    var hd4fan = document.getElementById("checkin");
    if (hd4fan) {
      var hd4fanSign = hd4fan.getElementsByTagName("a")[0];
    }
    var tjuptSign = document.getElementsByClassName("faqlink")[0];


    if (
      host.indexOf("ourbits") != -1 &&
      ourbitsSign.innerText.indexOf("签到得魔力") != -1
    ) {
      ourbitsSign.click();
    }
    if (
      host.indexOf("hdhome") != -1 &&
      hdhomeSign.innerText.indexOf("签到得魔力") != -1
    ) {
      hdhomeSign.click();
    }
    if (
      host.indexOf("hdchina") != -1 &&
      hdchinaSign.innerText.indexOf("签 到") != -1
    ) {
      hdchinaSign.click();
    }
    if (
      host.indexOf("pterclub") != -1 &&
      pterSign.innerText.indexOf("签到得猫粮") != -1
    ) {
      pterSign.click();
    }
    if (
      host.indexOf("lemonhd") != -1 &&
      lemonhdSign.innerText.indexOf("签到") != -1
    ) {
      lemonhdSign.click();
    }
    if (
      host.indexOf("pthome") != -1 &&
      pthomeSign.innerText.indexOf("签到得魔力") != -1
    ) {
      pthomeSign.click();
    }
    if (
      host.indexOf("btschool") != -1 &&
      btschoolSign.innerText.indexOf("每日签到") != -1
    ) {
      btschoolSign.click();
    }
    if (
      host.indexOf("soulvoice") != -1 &&
      soulvoiceSign.innerText.indexOf("签到得魔力") != -1
    ) {
      soulvoiceSign.click();
    }
    if (
      host.indexOf("1ptba") != -1 &&
      _1ptbaSign.innerText.indexOf("签到得魔力") != -1
    ) {
      _1ptbaSign.click();
    }
    if (
      host.indexOf("hddolby") != -1 &&
      hddolbySign.innerText.indexOf("签到得魔力") != -1
    ) {
      hddolbySign.click();
    }
    if (
      host.indexOf("hdzone") != -1 &&
      hdzoneSign.innerText.indexOf("签到得魔力") != -1
    ) {
      hdzoneSign.click();
    }
    if (
      host.indexOf("hddisk") != -1 &&
      hddiskSign.innerText.indexOf("签到得魔力") != -1
    ) {
      hddiskSign.click();
    }
    if (
      host.indexOf("discfan") != -1 &&
      (discfanSign.innerText.indexOf("簽到得魔力") != -1 ||
        discfanSign.innerText.indexOf("签到得魔力") != -1)
    ) {
      discfanSign.click();
    }
    if (
      host.indexOf("hdarea") != -1 &&
      hdareaSign.innerText.indexOf("签到") != -1
    ) {
      hdareaSign.click();
    }
    if (
      host.indexOf("hdcity") != -1 &&
      hdcitySign.innerText.indexOf("签到") != -1 &&
      hdcitySign.innerText.indexOf("已签到") < 0
    ) {
      hdcitySign.click();
    }
    if (
      host.indexOf("dhcmusic") != -1 &&
      dhcmusicSign.innerText.indexOf("签到得魔力") != -1
    ) {
      dhcmusicSign.click();
    }
    if (
      host.indexOf("totheglory") != -1 &&
      ttgSign.innerText.indexOf("签到") != -1
    ) {
      ttgSign.click();
    }
    if (
      host.indexOf("nicept") != -1 &&
      (niceptSign.innerText.indexOf("簽到得魔力") != -1 ||
        niceptSign.innerText.indexOf("签到得魔力") != -1)
    ) {
      niceptSign.click();
    }
    if (
      host.indexOf("haidan") != -1 &&
      haidanSign.value.indexOf("每日打卡") != -1
    ) {
      haidanSign.click();
    }
    if (
      host.indexOf("pttime") != -1 &&
      pttimeSign.innerText.indexOf("签到领魔力") != -1
    ) {
      pttimeSign.click();
    }
    if (
      host.indexOf("hdtime") != -1 &&
      hdtimeSign.innerText.indexOf("签到得魔力") != -1
    ) {
      hdtimeSign.click();
    }
    if (
      host.indexOf("audiences") != -1 &&
      audiencesSign.innerText.indexOf("签到得魔力") != -1
    ) {
      audiencesSign.click();
    }
    if (
      host.indexOf("hdfans") != -1 &&
      hdfansSign.innerText.indexOf("签到得魔力") != -1
    ) {
      hdfansSign.click();
    }
    if (
      host.indexOf("oshen") != -1 &&
      oshenSign.innerText.indexOf("签到得魔力") != -1
    ) {
      oshenSign.click();
    }
    if (host.indexOf("sharkpt") != -1 && sharkptSign) {
      sharkptSign.click();
    }

    // BAKSTEST SITE
    if (
      host.indexOf("yingk") != -1 &&
      href.indexOf("bakatest") < 0 &&
      yingkSign.innerText.indexOf("每日签到") != -1
    ) {
      yingkSign.click();
    }
    if (
      host.indexOf("hdstreet") != -1 &&
      href.indexOf("bakatest") < 0 &&
      hdstreetSign.innerText.indexOf("每日签到") != -1
    ) {
      hdstreetSign.click();
    }
    if (
      host.indexOf("52pt") != -1 &&
      href.indexOf("bakatest") < 0 &&
      _52ptSign.innerText.indexOf("签到赚魔力") != -1
    ) {
      _52ptSign.click();
    }
    if (
      host.indexOf("moecat") != -1 &&
      href.indexOf("bakatest") < 0 &&
      moecatSign.innerText.indexOf("每日签到") != -1
    ) {
      moecatSign.click();
    }
    if (
      host.indexOf("hd4fans") != -1 &&
      hd4fanSign.innerText.indexOf("签 到") != -1
    ) {
      hd4fanSign.click();
    }
    if (
      host.indexOf("tjupt") != -1 &&
      href.indexOf("attendance") < 0 &&
      tjuptSign.innerText.indexOf("签到得魔力") != -1
    ) {
      tjuptSign.click();
    }
  }, 500);
})();
