// ==UserScript==
// @name        Slim JIRA issue search
// @description Adds a button to hide the JIRA issue browser
// @namespace   https://www.pietz.me/
// @match       https://*.atlassian.net/browse/*
// @run-at      document-idle
// @grant       GM_addStyle
// @version     1.0
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/461872/Slim%20JIRA%20issue%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/461872/Slim%20JIRA%20issue%20search.meta.js
// ==/UserScript==

GM_addStyle(`
.toggle-search {
    background: none;
    border: none;
    height: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    box-shadow: none;
}

.toggle-search-line {
    height: 1px;
    display: block;
    background-color: #e5e5e5;
    transition: all 0.2s ease-out;
    flex: 1;
}

.toggle-search:hover .toggle-search-line {
    background-color: #448ae5;
    height: 2px;
}
`)

const contentElement = document.querySelector('#global-issue-navigator-container .contained-content');
const savedSearchSelectorElement = contentElement.querySelector('.saved-search-selector');
const searchElement = contentElement.querySelector('.navigator-search');

const toggleButton = document.createElement('button');
toggleButton.classList.add('toggle-search');

const indicatorLine = document.createElement('span');
indicatorLine.classList.add('toggle-search-line');
toggleButton.appendChild(indicatorLine);

let visible = true;
toggleButton.addEventListener('click', () => {
    visible = !visible;
    if (visible) {
        savedSearchSelectorElement.style.removeProperty('display');
        searchElement.style.removeProperty('display');
    } else {
        savedSearchSelectorElement.style.display = 'none';
        searchElement.style.display = 'none';
    }
})


contentElement.insertBefore(toggleButton, searchElement.nextSibling)
