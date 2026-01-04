// ==UserScript==
// @name         Highlight or Hide Specific Divs on Taobao
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Highlight or hide specific divs and links on Taobao search results based on toggle
// @author       max5555
// @match        https://s.taobao.com/search?*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480814/Highlight%20or%20Hide%20Specific%20Divs%20on%20Taobao.user.js
// @updateURL https://update.greasyfork.org/scripts/480814/Highlight%20or%20Hide%20Specific%20Divs%20on%20Taobao.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add slider to the page
    const sliderHTML = `
    <div style="position:fixed; right:10px; top:10px; z-index:9999; background-color: white; padding: 5px; border: 1px solid #ccc; border-radius: 5px;">
        Highlight specific divs:
        <label class="switch">
            <input type="checkbox" id="toggleDivs" checked>
            <span class="slider round"></span>
        </label>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', sliderHTML);

    let highlightEnabled = true; // Slider is enabled by default

    function updateDivs() {
        // Highlight or hide Tmall divs
        const tmallDivs = document.querySelectorAll('div a[href^="//detail.tmall.com/"]');
        tmallDivs.forEach(div => updateDivVisibility(div, '4px solid red'));

        // Highlight or hide Taobao links
        const taobaoLinks = document.querySelectorAll('a[href*="click.simba.taobao.com/"]');
        taobaoLinks.forEach(link => updateDivVisibility(link, '4px solid orange'));
    }

    function updateDivVisibility(element, borderStyle) {
        const parentDiv = element.closest('div');
        if (parentDiv) {
            if (highlightEnabled) {
                parentDiv.style.border = borderStyle; // Highlight with specified border
                parentDiv.style.display = ''; // Ensure the div is visible
            } else {
                parentDiv.style.display = 'none'; // Hide the div
            }
        }
    }

    document.getElementById('toggleDivs').addEventListener('change', (event) => {
        highlightEnabled = event.target.checked;
        updateDivs();
    });

    // Use MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(() => {
        updateDivs();
    });

    // Start observing the target node for configured mutations
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial update
    updateDivs();
})();
