// ==UserScript==
// @name         Gitlab default reviewers
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add options to request reviews
// @author       Ernestas Mitkus
// @match        https://gitlab.com/*/-/merge_requests/*
// @icon         https://gitlab.com/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464369/Gitlab%20default%20reviewers.user.js
// @updateURL https://update.greasyfork.org/scripts/464369/Gitlab%20default%20reviewers.meta.js
// ==/UserScript==

const SELECT_REVIEWERS_SELECT_BOX = ".merge-request-reviewer .selectbox";
const SELECT_REVIEWERS_SELECT_BOX_TEXT = ".merge-request-reviewer .selectbox .dropdown-toggle-text";
const SELECT_REVIEWERS_INPUT_ELEMENTS = ".merge-request-reviewer .selectbox input";
const SELECT_REVIEWERS_SELECT_BOX_DROPDOWN = ".merge-request-reviewer .selectbox .dropdown";

const LS_KEY = "i3b13gox13hn";
const LS_REVIEWERS = "reviewers";

const lsGet = (key) => {
    const bucket = JSON.parse(localStorage.getItem(LS_KEY));
    return key ? bucket[key] : bucket;
};

const lsPut = (key, value) => {
    const bucket = lsGet();
    localStorage.setItem(LS_KEY, JSON.stringify({ ...bucket, [key]: value }));
};

const getReviewersSelectBoxText = () => {
    return document.querySelector(SELECT_REVIEWERS_SELECT_BOX_TEXT);
}

const getReviewersElements = () => {
    return [...document.querySelectorAll(SELECT_REVIEWERS_INPUT_ELEMENTS)].filter(it => it.dataset.username);
};

const getReviewersSelectBox = () => {
    return document.querySelector(SELECT_REVIEWERS_SELECT_BOX);
};

const useDefaultReviewers = () => {
    const reviewers = lsGet(LS_REVIEWERS);

    const reviewersElements = getReviewersElements();
    reviewersElements.forEach(it => it.remove());
    const target = document.querySelector(SELECT_REVIEWERS_SELECT_BOX_DROPDOWN);
    reviewers.inputs.forEach(reviewerOuterHtml => {
        target.insertAdjacentHTML("beforebegin", reviewerOuterHtml);
    });

    getReviewersSelectBoxText().innerText = reviewers.selectboxText;
};

const setDefaultReviewers = () => {
    const reviewers = getReviewersElements();

    lsPut(LS_REVIEWERS, {
        inputs: reviewers.map(it => it.outerHTML),
        selectboxText: getReviewersSelectBoxText().innerText,
    });
};


const insertNextNode = (node, target) => {
    target.parentNode.insertBefore(node, target.nextSibling);
};

const createLinkButton = (text, onClick) => {
    const el = document.createElement("a");
    el.innerText = text;
    el.onclick = onClick;
    el.className += "gl-white-space-nowrap gl-pl-4";
    el.style.cursor = "pointer";
    return el;
}

const initialize = () => {
    // Create buttons
    const box = getReviewersSelectBox();
    const btnDefaultReviewers = createLinkButton("Default reviewers", useDefaultReviewers);
    const btnSetDefaultReviewers = createLinkButton("Set default reviewers", setDefaultReviewers);

    insertNextNode(btnDefaultReviewers, box);
    insertNextNode(btnSetDefaultReviewers, btnDefaultReviewers);
};

const urlMatches = () => {
    return location.href.includes("merge_requests/new") || /merge_requests\/[0-9]+\/edit/.test(location.href);
};

(() => {
    'use strict';

    if (!urlMatches) {
        return;
    }

    initialize();
    console.log("Gitlab better reviewers initialized");
})();