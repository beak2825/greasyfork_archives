// ==UserScript==
// @name         CSGORoll - Text to Link
// @namespace    https://gge.gg
// @version      0.2
// @description  This script will replace all "www.csgoroll.com/en/pvp/" text messages to clickable links.
// @author       twitter.com/thes0meguy
// @match        https://www.csgoroll.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csgoroll.com
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/481685/CSGORoll%20-%20Text%20to%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/481685/CSGORoll%20-%20Text%20to%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        var textSpans = document.querySelectorAll('span:not(.processed)'); // Select only spans without the 'processed' class
        for (var i = 0; i < textSpans.length; i++) {
            var span = textSpans[i];
            var text = span.textContent;
            var regex = /(https:\/\/www.csgoroll.com\/(\w+)\/pvp\/([^\s]+))/gi;
            var newText = text.replace(regex, function(match, p1, p2, p3) {
                // p1 is the whole URL, p2 is the language code, p3 is the part after /pvp/
                return '<a  class="mat-button-wrapper" href="' + p1 + '" target="_blank" style="color: #ffffff;background: #00c74d;box-shadow: 0px 2px 0px 0px #00913c;padding: 2px 5px 2px 5px;border-radius: 5px;font-size: 12px;font-weight: 900;text-wrap: nowrap;text-shadow: 1px 1px black;">' + p3 + '</a>';
            });
            if (text !== newText) { // Check if replacement was done
                span.innerHTML = newText;
                span.classList.add('processed'); // Add 'processed' class to indicate this span has been processed
            }
        }
    }, 500);
})();
