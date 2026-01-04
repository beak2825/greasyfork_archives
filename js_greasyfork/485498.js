// ==UserScript==
// @name         DDG-like Vim keybindings for Brave Search
// @namespace    https://gist.github.com/KiaraGrouwstra/94c77deb4ba1ac7c464568bb9a895b76
// @version      0.0.3
// @description  navigate search results by keyboard!
// @author       KiaraGrouwstra
// @match        https://search.brave.com/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/485498/DDG-like%20Vim%20keybindings%20for%20Brave%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/485498/DDG-like%20Vim%20keybindings%20for%20Brave%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var hit = 1; // global

    function select_hit(next = true) {
        const get_res = i => document.getElementsByClassName('snippet')[i];
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
    style.innerHTML = '.highlight { background-color: rgba(120, 120, 255, 0.1); }';
    document.getElementsByTagName('head')[0].appendChild(style);
})();
