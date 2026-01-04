// ==UserScript==
// @name Cookie Clicker Keyboard Shortcuts
// @namespace Cookie
// @include http://orteil.dashnet.org/cookieclicker/
// @include https://orteil.dashnet.org/cookieclicker/
// @description Adds keyboard shortcuts to cookie clicker automatically. 
// @version 1.1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/416344/Cookie%20Clicker%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/416344/Cookie%20Clicker%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

var code = "(" + (function() {
    var checkReady = setInterval(function() {
        if (typeof Game.ready !== 'undefined' && Game.ready) {
            Game.LoadMod('https://idon-texist.github.io/CC-Keyboard-short-cuts/index.js');
            clearInterval(checkReady);
        }
    }, 1000);
}).toString() + ")()";

window.eval(code);