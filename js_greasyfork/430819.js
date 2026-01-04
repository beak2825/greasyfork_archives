// ==UserScript==
// @name         Youtube Hide Ending Overlay
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide .ytp-ce-element
// @author       You
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430819/Youtube%20Hide%20Ending%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/430819/Youtube%20Hide%20Ending%20Overlay.meta.js
// ==/UserScript==

(function $$() {
    'use strict';

    if(!document||!document.documentElement)return window.requestAnimationFrame($$);

function addStyle (styleText) {
  const styleNode = document.createElement('style');
  styleNode.type = 'text/css';
  styleNode.textContent = styleText;
  document.documentElement.appendChild(styleNode);
  return styleNode;
}

    // Your code here...

    addStyle(`

    #player #movie_player [class*="ytp-ce-"]{
        --userscript-ytp-ce-element-opacity: 0.1;
    }
    #player #movie_player [class*="ytp-ce-"]:hover, #player #movie_player [class*="ytp-ce-"]:hover [class*="ytp-ce-"]{
        --userscript-ytp-ce-element-opacity: 'NIL';
    }
    #player #movie_player [class*="ytp-ce-covering"]{
        opacity: var(--userscript-ytp-ce-element-opacity);
        transition: opacity 0.3s ease-in-out;
    }
    #player #movie_player>.ytp-ce-element{
        box-shadow: inset 0px 0px 8px 4px rgb(255 255 255 / 25%);
        border-color: transparent;
    }

    `)


})();