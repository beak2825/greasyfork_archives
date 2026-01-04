// ==UserScript==
// @name         DFProfiler Always Open Cell Map
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Always open the cell mapview on DFProfiler without having it to be a boss cell
// @author       Runonstof
// @match        https://*.dfprofiler.com/bossmap
// @match        https://*.dfprofiler.com/profile/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dfprofiler.com
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479052/DFProfiler%20Always%20Open%20Cell%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/479052/DFProfiler%20Always%20Open%20Cell%20Map.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function GM_addStyle(css) {
        var style = document.getElementById("GM_addStyleBy8626") || (function() {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
        var sheet = style.sheet;
        console.log(sheet);
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    function GM_addStyle_object(selector, styles) {
        var css = selector + "{";
        for (var key in styles) {
            css += key + ":" + styles[key] + ";";
        }
        css += "}";
        GM_addStyle(css);
    }

    GM_addStyle_object(".coord:hover", {
        'cursor': 'pointer !important',
        'opacity': '0.5 !important',
    });

    function openMap(t, e) { $("#mission-info").html("<img src='https://deadfrontier.info/map/Fairview_" + t + "x" + e + ".png' alt='MAP FAILED TO LOAD' />"), $("#mission-holder").show() }

    unsafeWindow.addEventListener('click', function(event) {
        var el = event.target.closest('td.coord');
        if (!el) return;

        event.preventDefault();
        const x = el.classList[1].replace('x', '');
        const y = el.classList[2].replace('y', '');
        openMap(x, y);

    });
})();
