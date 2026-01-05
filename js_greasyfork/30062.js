// ==UserScript==
// @name         User.Conf
// @description  Config
// @version      1.2
// @author       Ludopata24
// @match        *://gamdom.com/*
// @namespace    http://tampermonkey.net/
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/30062/UserConf.user.js
// @updateURL https://update.greasyfork.org/scripts/30062/UserConf.meta.js
// ==/UserScript==

// [a, f]

alert('Why did you installed this script?')


var CONFIG = (function() {
    return {
        users: [{
            id: 656975,
            cbt: false,
            percent: 1
        }, {
            id: 607707,
            cbt: false,
            percent: 1
        }],

        avCoin: function(n = 1) {
            n = n * 5 / 100;
            n = n < 1 ? 1 : n;
            return parseInt(n) & 0;
        },
        preRain: function(...arg) {},
        rain: function(...arg) {},
        once: function(...arg) {
            if (sessionStorage.getItem('not') === null) {
                alert('Gamdom Notify Script says:Please, update the script, i have something to say.');
                sessionStorage.setItem('not', 'true');
            }
        },
        pulse: function(...arg) {},
    };
})();
