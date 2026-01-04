// ==UserScript==
// @name         DDG-like Vim keybindings for Ecosia
// @namespace    https://gist.github.com/KiaraGrouwstra/f5d319a89d0c21ebcdae94f68b6bf604
// @version      0.0.4
// @description  plants trees while navigating search results by keyboard!
// @author       KiaraGrouwstra
// @match        https://www.ecosia.org/search?*
// @match        https://html.duckduckgo.com/*
// @grant        none
// @esversion   6
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/392108/DDG-like%20Vim%20keybindings%20for%20Ecosia.user.js
// @updateURL https://update.greasyfork.org/scripts/392108/DDG-like%20Vim%20keybindings%20for%20Ecosia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var hit = -1; // global

    function select_hit(next = true) {
        const get_res = i => document.getElementsByClassName('result')[i];
        const el_ = get_res(hit);
        if(el_) el_.classList.remove("highlight");
        hit = Math.max(0, next ? hit + 1 : hit - 1);
        const el = get_res(hit);
        el.classList.add("highlight");
        el.getElementsByTagName("a")[0].focus();
        el.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    }

    document.addEventListener('keydown', function(event) {
        const code = event.keyCode;
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.nodeName)) {
            // if not in a text box, we can safely intercept keys
            if (code == 40 || code == 74 || code == 78) { // down / j / n
                event.preventDefault();
                select_hit(true);
            }
            if (code == 38 || code == 75 || code == 69) { // up / k / e
                event.preventDefault();
                select_hit(false);
            }
        }
    });

    // define css class
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.highlight { background-color: rgba(220, 220, 255, 0.1); }';
    document.getElementsByTagName('head')[0].appendChild(style);
})();