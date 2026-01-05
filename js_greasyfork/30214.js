// ==UserScript==
// @name         GU.Conf
// @description  Config
// @version      1.0.1.2
// @author       Ori
// @match        *://gamdom.com/*
// @namespace    http://tampermonkey.net/
// @run-at       document-idle
// ==/UserScript==

// [a, f]


var CONFIG = (function() {
    return {
        users: [],
        once: function(...arg) {},
        pulse: function(...arg) {},
    };
})();