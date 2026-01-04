// ==UserScript==
// @name         Acceptance Criteria Checkboxes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds checkboxes to acceptance criteria
// @author       Vincent Malcorps
// @match        https://cde.toyota-europe.com/confluence/display/*
// @match        https://cde.toyota-europe.com/confluence/pages/viewpage.action?pageId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395022/Acceptance%20Criteria%20Checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/395022/Acceptance%20Criteria%20Checkboxes.meta.js
// ==/UserScript==

const getParsedLocalStorageItem = (key, fallbackValue) => {
    let item = window.localStorage.getItem(key);
    try {
        return item
            ? JSON.parse(item)
            : fallbackValue;
    } catch (e) {
        console.error(`something went wrong reading localStorage`, e);
        return fallbackValue;
    }
};

const setStringifiedDataLocalStorageItem = (key, data) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`something went wrong setting localStorage`, e);
    }
};

const addCheckboxes = () => {
    const acceptanceCriteria = [ ...new Set([ ...document.querySelectorAll(`.table-wrap thead tr > th`), ...document.querySelectorAll(`.table-wrap tbody tr > th`) ]) ];
    acceptanceCriteria.forEach((acceptanceCriterium, index) => {
        if (acceptanceCriterium.innerText.startsWith(`AC_`)) {
            const id = `${acceptanceCriterium.innerText}--${index}`;
            const checkBox = document.createElement(`input`);
            checkBox.type = `checkbox`;
            checkBox.checked = pageData[pageVersion][id];
            acceptanceCriterium.onclick = (e) => {
                if (e.target.nodeName !== `INPUT`) {
                    checkBox.checked = !pageData[pageVersion][id];
                }
                pageData[pageVersion][id] = !pageData[pageVersion][id];
                setStringifiedDataLocalStorageItem(pageId, pageData);
            };
            acceptanceCriterium.insertBefore(checkBox, acceptanceCriterium.childNodes[0]);
        }
    });
};

const lastModifiedLink = document.querySelector(`.last-modified`);
const it = lastModifiedLink.href.matchAll(/=([0-9]+)&?/g);
const pageId = it.next().value[1];
it.next();
const pageVersion = it.next().value[1];
if (!it.next().done) {
    console.error(`check the link/regex`);
}
const pageIdElement = lastModifiedLink.parentNode.cloneNode();
pageIdElement.innerText = `, pageId: ${pageId}`;
lastModifiedLink.parentNode.parentNode.appendChild(pageIdElement);

const pageData = getParsedLocalStorageItem(pageId, {});
if (!Object.keys(pageData).length) {
    pageData[pageVersion] = {};
} else if (!pageData[pageVersion]) {
    pageData[pageVersion] = JSON.parse(JSON.stringify(pageData[Object.keys(pageData)[Object.keys(pageData).length-1]]));
    setStringifiedDataLocalStorageItem(pageId, pageData);
    window.alert(`=-= AC Checkboxes =-=\n\nAcceptance criteria have been changed. Values may no longer match the correct AC's. History is available in localStorage.\nkey: ${pageId} (see under page title)`);
}

setTimeout(addCheckboxes, 1500); // tableSorter init await

const inlineTableHeaders = document.createElement(`style`);
inlineTableHeaders.innerText = `.table-wrap th * { display: inline; } th > input:checked + * { text-decoration: line-through; }`;
document.body.appendChild(inlineTableHeaders);
