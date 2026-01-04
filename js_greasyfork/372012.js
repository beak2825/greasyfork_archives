// ==UserScript==
// @name         apk.tw台灣中文網自動簽到
// @version      0.0.1
// @description  android-台灣中文網簽到
// @author       Guan Da
// @match        *://apk.tw/*
// @namespace https://greasyfork.org/users/141503
// @downloadURL https://update.greasyfork.org/scripts/372012/apktw%E5%8F%B0%E7%81%A3%E4%B8%AD%E6%96%87%E7%B6%B2%E8%87%AA%E5%8B%95%E7%B0%BD%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/372012/apktw%E5%8F%B0%E7%81%A3%E4%B8%AD%E6%96%87%E7%B6%B2%E8%87%AA%E5%8B%95%E7%B0%BD%E5%88%B0.meta.js
// ==/UserScript==

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}
eventFire(document.getElementById('my_amupper'), 'click');
document.cookie = 'adblock_forbit=1;expires=0';
mydefplugin_close(1);
