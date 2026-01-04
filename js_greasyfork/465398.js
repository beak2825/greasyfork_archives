// ==UserScript==
// @name         Forumophilia hide non k2s
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert all <div class="row-wrap"> elements into collapsible and expandable panels
// @license MIT
// @author       Chad
// @match        https://www.forumophilia.com/search.php?*
// @match        https://www.forumophilia.com/topic*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forumophilia.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/465398/Forumophilia%20hide%20non%20k2s.user.js
// @updateURL https://update.greasyfork.org/scripts/465398/Forumophilia%20hide%20non%20k2s.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles for collapsible panels
    GM_addStyle(`
        .collapsible-panel {
            cursor: pointer;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #f1f1f1;
            margin-bottom: 10px;
        }
        .collapsible-panel-text {
            display: inline-block;
            margin-left: 8px;
            pointer-events: none;
        }
        .collapsible-panel-content {
            display: none;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #fff;
            margin-bottom: 10px;
        }
    `);

    function containsK2sOrKeep2s(element) {
        const content = element.innerHTML.toLowerCase();
        return content.includes('k2s') || content.includes('keep2s');
    }

    function makeCollapsible() {
        const elements = document.getElementsByClassName('row-wrap');

        for (let i = 1; i < elements.length; i++) {
            const element = elements[i];
            const panelContent = document.createElement('div');
            const expandText = document.createElement('span');

            // Set the class and move content into the panelContent div
            panelContent.className = 'collapsible-panel-content';
            panelContent.innerHTML = element.innerHTML;
            element.innerHTML = '';

            // Add the "Click To Expand" text
            expandText.className = 'collapsible-panel-text';
            expandText.textContent = '+ Click to toggle expansion';

            // Add the panelContent div as a sibling of the row-wrap div
            element.parentNode.insertBefore(panelContent, element.nextSibling);

            // Add the collapsible-panel class to the row-wrap div and append the expandText
            element.classList.add('collapsible-panel');
            element.appendChild(expandText);

            // Expand the panel by default if it contains "k2s" or "keep2s"
            if (containsK2sOrKeep2s(panelContent)) {
                panelContent.style.display = 'block';
            }
            else {
                panelContent.style.display = 'none';
            }

            // Add event listeners for toggling the content visibility
            element.addEventListener('click', () => {
                panelContent.style.display = panelContent.style.display === 'none' ? 'block' : 'none';
            });
        }
    }

    makeCollapsible();
})();