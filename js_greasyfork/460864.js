// ==UserScript==
// @name         kartinfo.me auto check-in
// @namespace    https://greasyfork.org/users/1033920
// @version      0.11
// @description  auto check-in
// @author       Siniong
// @match        *://kartinfo.me/sign.php*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460864/kartinfome%20auto%20check-in.user.js
// @updateURL https://update.greasyfork.org/scripts/460864/kartinfome%20auto%20check-in.meta.js
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
eventFire(document.getElementsByClassName('zzza_button_1')[0], 'click');
document.cookie = 'adblock_forbit=1;expires=0';