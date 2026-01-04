// ==UserScript==
// @name Postoj.sk vstup do diskusii
// @description Umoznuje vstup do diskusii na postoj.sk aj pre ludi, ktori nie su podporovatelia postoja
// @namespace https://podpora.postoj.sk/v1
// @homepageURL https://podpora.postoj.sk/nezastavme-sa
// @supportURL https://podpora.postoj.sk/nezastavme-sa
// @author scare21410
// @version 1.0
// @date 2022-03-10
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @compatible edge
// @match *://postoj.sk/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441295/Postojsk%20vstup%20do%20diskusii.user.js
// @updateURL https://update.greasyfork.org/scripts/441295/Postojsk%20vstup%20do%20diskusii.meta.js
// ==/UserScript==

(function() {
    var interval = setInterval(function() {
        if (Toolbox) {
            clearInterval(interval);
            Toolbox.isUserActiveDonor = function() {
                return true;
            }
        }
    }, 1);
})();