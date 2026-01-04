// ==UserScript==
// @name         Anti-Adblocker-Killer for Cnbeta.com.tw
// @version      0.2
// @description  Remove the anti-adblocker popup.
// @author       Eric Qian
// @match        https://www.cnbeta.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnbeta.com.tw
// @grant        none
// @namespace https://greasyfork.org/users/1240870
// @downloadURL https://update.greasyfork.org/scripts/522822/Anti-Adblocker-Killer%20for%20Cnbetacomtw.user.js
// @updateURL https://update.greasyfork.org/scripts/522822/Anti-Adblocker-Killer%20for%20Cnbetacomtw.meta.js
// ==/UserScript==

(function() {
    var aak = function(i) {
        setTimeout(function() {
            var d = document.querySelectorAll('div.fc-ab-root');
            d.forEach(function(element) {
                element.remove();
            });
            var b = document.body;
            b.setAttribute('style', '');
        }, i * 50);
    };

    var len = 20;
    for (var i = 0; i < len; i++) {
        aak(i);
    }
})();