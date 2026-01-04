// ==UserScript==
// @name        replicon
// @version     0.4
// @description Fix Chrome+Firefox incompatibilities in Replicon TimeSheet sites
// @author      Greg Toombs
// @namespace   https://github.com/reinderien
// @homepage    https://github.com/reinderien/replicon
// @include     /^https?://timesheet\.\w+\.\w+/Timesheet/main\.aspx$/
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36852/replicon.user.js
// @updateURL https://update.greasyfork.org/scripts/36852/replicon.meta.js
// ==/UserScript==

// Patch the load element - replicon expects it to be a window, not an iframe
window.load = document.getElementById('load').contentWindow;

// Patch the parameter parsing in jsLoaderObject.loadFrom() - inline comments break it
old_string = window.String;
window.String = function(o) {
    var s = old_string(o);
    if (typeof(o) == 'function') {
        // Chrome fix
        s = s.replace(/\s*\/\*.*?\*\/\s*/g, '');
        // Firefox fix
        var close = s.indexOf(')'),
            params = s.substr(0, close).replace('\n', '');
        s = params + s.substr(close);
    }
    return s;
};
