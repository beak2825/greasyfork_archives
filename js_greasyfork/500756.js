// ==UserScript==
// @name         IWRPG - Cosmetic - Unuglify pancake script
// @namespace    http://tampermonkey.net/
// @version      2024-07-15
// @description  Undo the ugly pancake does
// @author       You
// @match        https://ironwoodrpg.com/*
// @icon         https://ironwoodrpg.com/assets/misc/quests.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500756/IWRPG%20-%20Cosmetic%20-%20Unuglify%20pancake%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/500756/IWRPG%20-%20Cosmetic%20-%20Unuglify%20pancake%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

// JavaScript function to insert CSS after a 2-second delay
setTimeout(function() {
    // Define the CSS as a string
    var css = `
        .customComponent {
            background-color: #0d2234 !important;
        }
        .customComponent * {
            background-color: #0d2234 !important;
        }
        .customComponent .myHeader.lineTop {
            border-top: 1px solid #263849 !important;
        }
        .customMenuButton {
            background-color: #061a2e !important;
            border-bottom: 1px solid #263849 !important;
        }
        .lineLeft {
            border-left: 1px solid #263849;
        }
        .customRow {
            border-top: 1px solid #263849 !important;
        }
        div.scroll.custom-scrollbar .header, div.scroll.custom-scrollbar button {
            height: 56px !important;
        }
        div.scroll.custom-scrollbar img {
            height: 32px !important;
            width: 32px !important;
        }
    `;

    // Create a <style> element
    var style = document.createElement('style');
    style.type = 'text/css';

    // Check if the style element supports the CSS directly
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    // Append the <style> element to the <head> of the document
    document.head.appendChild(style);
}, 500); // 1000 milliseconds = 2 seconds


})();