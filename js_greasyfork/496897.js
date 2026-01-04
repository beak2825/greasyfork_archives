// ==UserScript==
// @name         Safari Default Dark Theme Color
// @namespace    https://gist.github.com/10tion
// @version      0.2
// @description  Setting a default dark theme color for Safari.
// @author       10tion
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496897/Safari%20Default%20Dark%20Theme%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/496897/Safari%20Default%20Dark%20Theme%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var _DEFAULT_THEME_COLOR = "#1e2327";
    // Flip this to true if you want to forcibly override theme color for all websites.
    var _FORCE_OVERRIDE = false;

    var _head = document.getElementsByTagName('head')[0];
    for (var _h = 0; _h < _head.childNodes.length; _h++) {
        if (_head.childNodes[_h].name === "theme-color") {
            if (_FORCE_OVERRIDE) {
                var _cur_theme = _head.childNodes[_h];
                _cur_theme.parentNode.removeChild(_cur_theme);
                break;
            } else {
                return;
            }
        }
    }

    var meta = document.createElement('meta');
    meta.name = "theme-color";
    meta.content = _DEFAULT_THEME_COLOR;
    _head.appendChild(meta);
})();