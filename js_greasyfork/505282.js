// ==UserScript==
// @name         Cases.GG - Text to Link
// @namespace    https://gge.gg
// @version      0.1
// @description  This script will replace all "case-battle/1234567" text messages to clickable links.
// @author       twitter.com/thes0meguy
// @match        https://cases.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cases.gg
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/505282/CasesGG%20-%20Text%20to%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/505282/CasesGG%20-%20Text%20to%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        // Select all div elements with the specified classes
        var textDivs = document.querySelectorAll('div.gap-1.text-text.break-words.text-sm.font-medium');

        for (var i = 0; i < textDivs.length; i++) {
            var div = textDivs[i];
            var text = div.textContent;

            if (text.includes("case-battles")) {
                var regex = /(case-battles\/[^\s]+)/gi;
                var newText = text.replace(regex, '<a href="https://cases.gg/$&" target="_blank" style="color: #61d5ff;">$&</a>');
                div.innerHTML = newText;
            }
        }
    }, 500);
})();
