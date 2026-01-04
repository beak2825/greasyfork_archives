// ==UserScript==
// @name         PT站点自动签到-原作者：dhjesus
// @namespace    z377409011
// @version      1.3.8-v11
// @description  pt站点自动签到
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAgCAYAAACYTcH3AAAAAXNSR0IArs4c6QAAAbxJREFUWEftlz1IQlEUx/9Xn4hBRGNNBdXQh0a1RIsRfdDmUCQ0CAUt0ahCi0sNrrUEDm4NDQ8iomiwIWjRIKmlpaYc4xVU0vPduI8EET/O1ScOvTs+/uec3/ufc97lMRCPqhspgD8FFOcWMQSqXjgC2FBAccxSYhhFJDSqbnAA19TEfzEpAP6A4iDVIYn+L4w3oq05GHY4x3S1tsX2OvHyXEAy8UntLEKbHejrdyK2+1ErJsO5cZaNd8eYL6xtg+GgXoUWwpilGeOrzBfR0gAm2w3DOc8KGLEldY+wPPdawOV5vq62KFhcdqOn10luLRmGTNCE0IapZp7tjO3MxJQLd+kf8n61bGZWgh6MjCo4Vb/JQC2BKYI8Pug4Of5qnzONgpj3E/U6EJbPL7lxdZGHeONKpxkQKZiBQQXrIY/JIKwvB2oWRApGiIU7omg5kBUg0jCVgIbHXCak7LBWajN5ZkqDSx0Sz60AaciZIpQAmltwI5czpNa31p435Az5wyEptGHsW1tyZMB8Ue0GHDOygVbrGcMt84bfNxjjCauTy+bjQND88R+PvvkBx36t31vZ5BL6DDiS9/Guw1/5Ifek+Vvu+AAAAABJRU5ErkJggg==
// @author       DHJesus
// @match     *://ourbits.club/*
// @match     *://hdhome.org/*
// @match     *://hdchina.org/*
// @match     *://pterclub.net/*
// @match     *://lemonhd.org/*
// @match     *://*.pthome.net/*
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
// @match     *://*.nicept.net/*
// @match     *://yingk.com/*
// @match     *://hdstreet.club/*
// @match     *://52pt.site/*
// @match     *://moecat.best/*
// @match     *://pt.hd4fans.org/*
// @match     *://*.haidan.video/*
// @match     *://*.pttime.org/*
// @match     *://hdtime.org/*
// @match     *://*.hdfans.org/*
// @match     *://audiences.me/*
// @match     *://*.tjupt.org/*
// @match     *://piggo.me/*
// @match     *://hdmayi.com/*
// @match     *://carpt.net/*
// @match     *://*.gamegamept.com/*
// @match     *://*.oshen.win/*
// @match     *://*.sharkpt.net/*
// @match     *://hdvideo.one/*
// @match     *://*.icc2022.com/*
// @match     *://pt.cdfile.org/*
// @match     *://pandapt.net/*
// @match     *://lemonhd.net/*
// @match     *://cspt.top/*
// @grant        none
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Opera
// @compatible	 UC
// @homepageURL  https://greasyfork.org/zh-CN/scripts/443653
// @downloadURL https://update.greasyfork.org/scripts/443653/PT%E7%AB%99%E7%82%B9%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-%E5%8E%9F%E4%BD%9C%E8%80%85%EF%BC%9Adhjesus.user.js
// @updateURL https://update.greasyfork.org/scripts/443653/PT%E7%AB%99%E7%82%B9%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-%E5%8E%9F%E4%BD%9C%E8%80%85%EF%BC%9Adhjesus.meta.js
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
    var hdfansSign = document.getElementsByClassName("faqlink")[0];
    var hdmayiSign = document.getElementsByClassName("faqlink")[0];
    var carptSign = document.getElementsByClassName("faqlink")[0];
    var gamegameptSign = document.getElementsByClassName("faqlink")[0];
    var oshenSign = document.getElementsByClassName("faqlink")[0];
    var sharkpt = document.getElementsByTagName('shark-tooltip');
    for (let i = 0; i < sharkpt.length; i++) {
      const element = sharkpt[i];
      if(element.label === '签到') {
        var sharkptSign = element.getElementsByTagName('shark-icon-button')[0].shadowRoot.querySelector('.button--high-warn');
        break;
      }
    }
    var hdvideoSign = document.getElementsByClassName("faqlink")[0]
    var icc2022Sign = document.getElementsByClassName("faqlink")[0]
    var cdfileSign = document.getElementsByClassName("faqlink")[0]
    var pandaptSign = document.getElementsByClassName("faqlink")[0]
    var lemonhdnetSign = document.getElementsByClassName("faqlink")[0]

    //var csptSign = document.querySelector('a.not-attended img[title*="签到得金元宝"]').parentElement
    var csptSign = document.getElementsByClassName("not-attended")[0]

    // BAKATEST SITE
    var yingkSign = document.getElementById("game");
    var hdstreet = document.getElementsByClassName("medium")[0];
    if (hdstreet) {
      var hdstreetSign = hdstreet.getElementsByTagName("a")[5];
    }
    var _52ptSign = document.getElementById("game");
    var audiencesSign = document.getElementsByClassName("faqlink")[0];
    var tjuptSign = document.getElementsByClassName("faqlink")[0];
    var piggoSign = document.getElementsByClassName("faqlink")[0];
    var moecatSign = document.getElementById("game");
    var hd4fan = document.getElementById("checkin");
    if (hd4fan) {
      var hd4fanSign = hd4fan.getElementsByTagName("a")[0];
    }


    if (
      host.indexOf("ourbits") != -1 &&
      href.indexOf("attendance") < 0 &&
      ourbitsSign.innerText.indexOf("签到得魔力") != -1
    ) {
      ourbitsSign.click();
    }
    if (
      host.indexOf("hdhome") != -1 &&
      href.indexOf("attendance") < 0 &&
      hdhomeSign.innerText.indexOf("签到得魔力") != -1
    ) {
      hdhomeSign.click();
    }
    if (
      host.indexOf("hdchina") != -1 &&
      href.indexOf("attendance") < 0 &&
      hdchinaSign.innerText.indexOf("签 到") != -1
    ) {
      hdchinaSign.click();
    }
    if (
      host.indexOf("pterclub") != -1 &&
      href.indexOf("attendance") < 0 &&
      pterSign.innerText.indexOf("签到得猫粮") != -1
    ) {
      pterSign.click();
    }
    if (
      host.indexOf("lemonhd") != -1 &&
      href.indexOf("attendance") < 0 &&
      lemonhdSign.innerText.indexOf("签到") != -1
    ) {
      lemonhdSign.click();
    }
    if (
      host.indexOf("pthome") != -1 &&
      href.indexOf("attendance") < 0 &&
      pthomeSign.innerText.indexOf("签到得魔力") != -1
    ) {
      pthomeSign.click();
    }
    if (
      host.indexOf("btschool") != -1 &&
      href.indexOf("attendance") < 0 &&
      btschoolSign.innerText.indexOf("每日签到") != -1
    ) {
      btschoolSign.click();
    }
    if (
      host.indexOf("soulvoice") != -1 &&
      href.indexOf("attendance") < 0 &&
      soulvoiceSign.innerText.indexOf("签到得魔力") != -1
    ) {
      soulvoiceSign.click();
    }
    if (
      host.indexOf("1ptba") != -1 &&
      href.indexOf("attendance") < 0 &&
      _1ptbaSign.innerText.indexOf("签到得魔力") != -1
    ) {
      _1ptbaSign.click();
    }
    if (
      host.indexOf("hddolby") != -1 &&
      href.indexOf("attendance") < 0 &&
      hddolbySign.innerText.indexOf("签到得魔力") != -1
    ) {
      hddolbySign.click();
    }
    if (
      host.indexOf("hdzone") != -1 &&
      href.indexOf("attendance") < 0 &&
      hdzoneSign.innerText.indexOf("签到得魔力") != -1
    ) {
      hdzoneSign.click();
    }
    if (
      host.indexOf("hddisk") != -1 &&
      href.indexOf("attendance") < 0 &&
      hddiskSign.innerText.indexOf("签到得魔力") != -1
    ) {
      hddiskSign.click();
    }
    if (
      host.indexOf("discfan") != -1 &&
      href.indexOf("attendance") < 0 &&
      (discfanSign.innerText.indexOf("簽到得魔力") != -1 ||
        discfanSign.innerText.indexOf("签到得魔力") != -1)
    ) {
      discfanSign.click();
    }
    if (
      host.indexOf("hdarea") != -1 &&
      href.indexOf("attendance") < 0 &&
      hdareaSign.innerText.indexOf("签到") != -1
    ) {
      hdareaSign.click();
    }
    if (
      host.indexOf("hdcity") != -1 &&
      href.indexOf("attendance") < 0 &&
      hdcitySign.innerText.indexOf("签到") != -1 &&
      hdcitySign.innerText.indexOf("已签到") < 0
    ) {
      hdcitySign.click();
    }
    if (
      host.indexOf("dhcmusic") != -1 &&
      href.indexOf("attendance") < 0 &&
      dhcmusicSign.innerText.indexOf("签到得魔力") != -1
    ) {
      dhcmusicSign.click();
    }
    if (
      host.indexOf("totheglory") != -1 &&
      href.indexOf("attendance") < 0 &&
      ttgSign.innerText.indexOf("签到") != -1
    ) {
      ttgSign.click();
    }
    if (
      host.indexOf("nicept") != -1 &&
      href.indexOf("attendance") < 0 &&
      (niceptSign.innerText.indexOf("簽到得魔力") != -1 ||
        niceptSign.innerText.indexOf("签到得魔力") != -1)
    ) {
      niceptSign.click();
    }
    if (
      host.indexOf("haidan") != -1 &&
      href.indexOf("attendance") < 0 &&
      haidanSign.value.indexOf("每日打卡") != -1
    ) {
      haidanSign.click();
    }
    if (
      host.indexOf("pttime") != -1 &&
      href.indexOf("attendance") < 0 &&
      pttimeSign.innerText.indexOf("签到领魔力") != -1
    ) {
      pttimeSign.click();
    }
    if (
      host.indexOf("hdtime") != -1 &&
      href.indexOf("attendance") < 0 &&
      hdtimeSign.innerText.indexOf("签到得魔力") != -1
    ) {
      hdtimeSign.click();
    }
    if (
      host.indexOf("hdfans") != -1 &&
      href.indexOf("attendance") < 0 &&
      hdfansSign.innerText.indexOf("签到得魔力") != -1
    ) {
      hdfansSign.click();
    }
    if (
      host.indexOf("hdmayi") != -1 &&
      href.indexOf("attendance") < 0 &&
      hdmayiSign.innerText.indexOf("签到得魔力") != -1
    ) {
      hdmayiSign.click();
    }
    if (
      host.indexOf("carpt") != -1 &&
      href.indexOf("attendance") < 0 &&
      carptSign.innerText.indexOf("签到得魔力") != -1
    ) {
      carptSign.click();
    }
    if (
      host.indexOf("gamegamept") != -1 &&
      href.indexOf("attendance") < 0 &&
      gamegameptSign.innerText.indexOf("签到得G值") != -1
    ) {
      gamegameptSign.click();
    }
    if (
      host.indexOf("oshen") != -1 &&
      href.indexOf("attendance") < 0 &&
      oshenSign.innerText.indexOf("签到得魔力") != -1
    ) {
      oshenSign.click();
    }
    if (
      host.indexOf("sharkpt") != -1 && 
      href.indexOf("attendance") < 0 &&
      sharkptSign
    ) {
      sharkptSign.click();
    }
    if (
      host.indexOf("hdvideo") != -1 &&
      href.indexOf("attendance") < 0 &&
      hdvideoSign.innerText.indexOf("签到得魔力") != -1
    ) {
      hdvideoSign.click();
    }
    if (
      host.indexOf("icc2022") != -1 &&
      href.indexOf("attendance") < 0 &&
      icc2022Sign.innerText.indexOf("签到得魔力") != -1
    ) {
      icc2022Sign.click();
    }
    if (
      host.indexOf("cdfile") != -1 &&
      href.indexOf("attendance") < 0 &&
      cdfileSign.innerText.indexOf("签到得魔力") != -1
    ) {
      cdfileSign.click();
    }
    if (
      host.indexOf("pandapt") != -1 &&
      href.indexOf("attendance") < 0 &&
      pandaptSign.innerText.indexOf("签到得魔力") != -1
    ) {
      pandaptSign.click();
    }
    if (
      host.indexOf("lemonhd.net") != -1 &&
      href.indexOf("attendance") < 0 &&
      lemonhdnetSign.innerText.indexOf("签到得魔力") != -1
    ) {
      lemonhdnetSign.click();
    }
    if (
        host.indexOf("cspt") !== -1 &&
        href.indexOf("attendance") < 0 &&
        csptSign.querySelector("img")?.title.indexOf("签到得金元宝") !== -1
    ) {
        csptSign.click();
    }
    // BAKSTEST SITE
    if (
      host.indexOf("yingk") != -1 &&
      href.indexOf("attendance") < 0 &&
      yingkSign.innerText.indexOf("每日签到") != -1
    ) {
      yingkSign.click();
    }
    if (
      host.indexOf("hdstreet") != -1 &&
      href.indexOf("attendance") < 0 &&
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
      host.indexOf("audiences") != -1 &&
      href.indexOf("attendance") < 0 &&
      audiencesSign.innerText.indexOf("签到得爆米花") != -1
    ) {
      audiencesSign.click();
    }
      if (
      host.indexOf("tjupt") != -1 &&
      href.indexOf("attendance") < 0 &&
      tjuptSign.innerText.indexOf("签到得魔力") != -1
    ) {
      tjuptSign.click();
    }
    if (
      host.indexOf("moecat") != -1 &&
      href.indexOf("attendance") < 0 &&
      moecatSign.innerText.indexOf("每日签到") != -1
    ) {
      moecatSign.click();
    }
    if (
      host.indexOf("piggo") != -1 &&
      href.indexOf("attendance") < 0 &&
      piggoSign.innerText.indexOf("签到得魔力") != -1
    ) {
      piggoSign.click();
    }
    if (
      host.indexOf("hd4fans") != -1 &&
      href.indexOf("attendance") < 0 &&
      hd4fanSign.innerText.indexOf("签 到") != -1
    ) {
      hd4fanSign.click();
    }
  }, 500);
})();
