// ==UserScript==
// @name         apk.tw auto check-in
// @namespace    https://greasyfork.org/users/119029
// @version      0.4
// @description  auto check-in
// @author       Mc Peace
// @match        *://apk.tw/*
// @downloadURL https://update.greasyfork.org/scripts/36211/apktw%20auto%20check-in.user.js
// @updateURL https://update.greasyfork.org/scripts/36211/apktw%20auto%20check-in.meta.js
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