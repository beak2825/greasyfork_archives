// ==UserScript==
// @name         AimTrainer Cheat
// @namespace    /
// @version      2
// @description  Cheat on https://f2ville.space/aimtrainer
// @author       F2Ville
// @match        https://f2ville.space/aimtrainer/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412516/AimTrainer%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/412516/AimTrainer%20Cheat.meta.js
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

(function() {
    'use strict';

    setInterval(() => {
        let target = document.getElementById("target");

        if (target) {
            eventFire(target, "click");
        }
    }, Math.random() * 10)

})();