// ==UserScript==
// @name        Anti-Anti Adblock
// @namespace   https://greasyfork.org/users/55460
// @author      阿皇仔
// @description 防止 Adblock 被偵測
// @include     https://apk.tw/*
// @include     https://openload.co/*
// @include     http://bbs4.2djgame.net/*
// @include     https://bbs4.2djgame.net/*
// @include     https://blog.ztjal.info/*
// @include     http://www.mexashare.com/*
// @version     1.2.3
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/23418/Anti-Anti%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/23418/Anti-Anti%20Adblock.meta.js
// ==/UserScript==

if (location.hostname == 'apk.tw') {
  document.cookie = 'adblock_forbit=1;expires=0';
}

if (location.hostname == 'openload.co') {
  window.adblock = false;
  window.adblock2 = false;
  window.sadbl = false;
  document.onbeforescriptexecute = function(e) {
    if (e.target.src.search('script.packed') != -1)
      e.preventDefault();
  };
  var HideAdv = function() {
    window.BetterJsPop = null;
    window.doPopAds = null;
    window.doSecondPop = null;
    window.secondsdl = 0;
    window.popAdsLoaded = true;
    window.noPopunder = true;
    setInterval(function() {
      $("#downloadTimer").click();
    }, 100);
  }
  document.addEventListener('DOMContentLoaded', HideAdv, false);
}

if (location.hostname == 'bbs4.2djgame.net') {
  if (document.cookie.search('dvVE_3b03_fidpw359') == -1)
    document.cookie = encodeURI('dvVE_3b03_fidpw359=内容及破解禁止分享或轉載;expires=0');
}

if (location.hostname == 'blog.ztjal.info') {
  window.killAdBlock = true;
}

if (location.hostname == 'www.mexashare.com') {
  document.getElementById('k749').remove();
}
