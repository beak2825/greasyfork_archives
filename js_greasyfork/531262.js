// ==UserScript==
// @name         Remove Trollface Emoji from GitHub
// @namespace    https://github.com/Simyon264
// @version      2025-04-06-6
// @description  Remove trollface emoji from GitHub pages
// @author       Simyon
// @match        https://github.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         https://github.githubassets.com/images/icons/emoji/trollface.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531262/Remove%20Trollface%20Emoji%20from%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/531262/Remove%20Trollface%20Emoji%20from%20GitHub.meta.js
// ==/UserScript==

/*


Copyright 2025 Simyon

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

/*
CHANGELOG:
2025-03-29: Initial release
2025-04-06: Added a menu command to set the replace value for the trollface emoji.
2025-04-06-1: Fixed TypeError, with replace as the parent is null when we remove the emoji.
2025-04-06-2: Added a menu command to toggle the floating removal count widget on and off.
2025-04-06-3: Fixed syntax error in a menu command registration.
2025-04-06-4: Fixed logic error in the updateWidget method.
2025-04-06-5: Added a check to ensure the emoji is not inside the troll-whitelist element before removing it.
2025-04-06-6: Changed X to ❌ in the floating widget.
*/

const trollfaceElement = `<img class="emoji" title=":trollface:" alt=":trollface:" src="https://github.githubassets.com/images/icons/emoji/trollface.png" height="20" width="20" align="absmiddle">`;

(function () {
    'use strict';

    const floatingWidgetEnabled = GM_getValue("floatingCount", false);

    GM_registerMenuCommand("Set Replace Value", setReplaceValue, "r");
    GM_registerMenuCommand(`Floating removal count in page: ${floatingWidgetEnabled ? "ON" : "OFF"}`, toggleFloatingWidget);

    function setReplaceValue() {
        const newValue = prompt("Enter the new value for the replace value. Each time a trollface is replaced, it will get replaced by this:", GM_getValue('replaceValue', ''));
        GM_setValue('replaceValue', newValue);
        alert(`Replace value set to: ${newValue}`);
    }

    function toggleFloatingWidget() {
        const currentValue = GM_getValue("floatingCount", false);
        GM_setValue("floatingCount", !currentValue);
        alert(`Floating removal count in page is now ${!currentValue ? "enabled" : "disabled"}`);
        location.reload(); // Reload the page to apply the changes
    }

    let trollfaceWidget = null;
    let trollfaceWidgetCounter = null;

    function updateWidget(newCount) {
        if (floatingWidgetEnabled && !trollfaceWidget) {
            trollfaceWidget = document.createElement('div');
            trollfaceWidget.style.position = 'fixed';
            trollfaceWidget.style.bottom = '10px';
            trollfaceWidget.style.right = '10px';
            trollfaceWidget.style.backgroundColor = '#fff';
            trollfaceWidget.style.border = '1px solid #ccc';
            trollfaceWidget.style.padding = '10px';
            trollfaceWidget.style.zIndex = '9999';
            trollfaceWidget.style.color = 'black'
            document.body.appendChild(trollfaceWidget);

            trollfaceWidget.innerHTML = `<span class="troll-whitelist" >${trollfaceElement}❌ <span id="trollfaceCount">${newCount}</span></span>`;
            trollfaceWidgetCounter = document.getElementById('trollfaceCount');
        } else if (trollfaceWidgetCounter) {
            trollfaceWidgetCounter.textContent = newCount;
        }
    }

    function removeTrollfaceEmojis() {
        var trollfaceEmojis = document.querySelectorAll('img[title=":trollface:"]');
        trollfaceEmojis.forEach(function (emoji) {
            if (emoji.parentNode && emoji.parentNode.classList.contains('troll-whitelist')) {
                return; // Skip if it's inside the troll-whitelist element
            }

            const replaceValue = GM_getValue('replaceValue', '');
            if (replaceValue && emoji.parentNode) {
                var replacement = document.createElement('span');
                replacement.textContent = replaceValue;
                emoji.parentNode.insertBefore(replacement, emoji.nextSibling);
                console.log(`Replaced with: ${replaceValue}`);
            }

            if (emoji.parentNode) {
                emoji.remove();
                var removalCount = GM_getValue('totalRemovalCount', 0);
                removalCount++;
                GM_setValue('totalRemovalCount', removalCount);
                console.log(`Removed a troll emoji! Total: ${removalCount}! `)

                updateWidget(removalCount);
            }
        });
    }


    removeTrollfaceEmojis();

    var observer = new MutationObserver(function (mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                removeTrollfaceEmojis();
            }
        }
    });

    observer.observe(document.body, { subtree: true, childList: true });
})();