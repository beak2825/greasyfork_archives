// ==UserScript==
// @name         Geoguessr Challenge Results Filter
// @version      0.1
// @description  Adds a filter to only show verified users in challenge results
// @author       macca#8949
// @license      MIT
// @match        https://www.geoguessr.com/*
// @grant        none
// @namespace https://greasyfork.org/users/865125
// @downloadURL https://update.greasyfork.org/scripts/451913/Geoguessr%20Challenge%20Results%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/451913/Geoguessr%20Challenge%20Results%20Filter.meta.js
// ==/UserScript==

window.filterVerified = (e) => {
    if (e.checked) {
        for (let row of document.querySelectorAll('.results_row__2iTV4')) {
            if (!row.querySelector('.user-nick_verifiedWrapper__yocOV') && !row.classList.contains('results_selected___yiF6')) {
                row.style.display = 'none';
                row.nextSibling.style.display = 'none';
            }
        }
    } else {
        for (let row of document.querySelectorAll('.results_row__2iTV4')) {
            row.style.display = 'grid';
            row.nextSibling.style.display = 'block';
        }
    }
}

let observer = new MutationObserver((mutations) => {
    if (window.location.href.includes('results')) {
        if (document.querySelector('.results_switch__Qj1HI') && !document.querySelector('#verifiedFilter')) {
            document.querySelector('.results_switch__Qj1HI').insertAdjacentHTML('beforeend', `
            <div id="verifiedFilter" style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0;">
                <span class="info-card_title__zdSgV">Filter Verified</span>
                <input type="checkbox" id="enableScriptHeader" onclick="filterVerified(this)">
            </div>
            `);
        }
    }
});

observer.observe(document.body, {
  characterDataOldValue: false,
  subtree: true,
  childList: true,
  characterData: false
});