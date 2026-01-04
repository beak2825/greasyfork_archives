// ==UserScript==
// @name         cleanLeetcode
// @namespace    mailto: fish404hsif@gmail.com
// @version      0.1.0
// @description  clean Leetcode
// @author       fish-404
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=
// @match        https://leetcode.cn/problemset/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452407/cleanLeetcode.user.js
// @updateURL https://update.greasyfork.org/scripts/452407/cleanLeetcode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    cleanLeetCode();
    myMutation();
})();

function cleanLeetCode() {
    hideNav();
    hideFooter();
    hideRightBlock();
    hideRightCornerIcon();
    stickyTopBottom();
    widenMain();
    hideTags();
}

function hideElement(element) {
    element.style.display = "none";
}

function hideSelf(selfSelector) {
    hideElement(document.querySelector(selfSelector));
}

function hideParent(childSelector) {
    hideElement(document.querySelector(childSelector).parentElement);
}

function hideGroup(groupSelector) {
    document.querySelectorAll(groupSelector).forEach((e) => {
        hideElement(e);
    });
}

function hideNav() {
    hideSelf("nav");
}

function hideFooter() {
    hideSelf("footer");
}

function hideRightBlock() {
    hideSelf("#__next div.grid div.col-span-4:nth-child(2)");
}

function hideRightCornerIcon() {
    hideParent("a[aria-label='feedback']");
}

function hideCol() {
    hideGroup("div.mx-2:nth-child(6)");
    hideGroup("div.mx-2:nth-child(3)");
}

function stickyTopBottom() {
    let wrapper = document.querySelector('div.grid').firstChild.lastChild;
    wrapper.firstChild.setAttribute('style', 'position: sticky; top: 0; background: black; padding: 5px;');
    wrapper.lastChild.setAttribute('style', 'position: sticky; bottom: 0; background: black; padding: 5px;');
}

function widenMain() {
    document.querySelector('div.grid').removeAttribute('class');
}

function hideTags() {
    hideGroup("div.z-base div.relative.flex");
}

function myMutation() {
    let problemsNode, observer;

    const config = {
        subtree: true
        , childList: true
    };


    problemsNode = document.querySelector("div[role='table']");
    observer = new MutationObserver(hidePlusProblemsWithoutTag);
    observer.observe(problemsNode, config);
}

function hidePlusProblemsWithoutTag(mutationList, observer) {
    let preTargetRow;
    mutationList.forEach((mutation) => {
        let target;
        if (mutation.addedNodes.length > 0) {
            target = mutation.addedNodes[0];
        }
        else {
            target = mutation.target;
        }
        let curTargetRow = target.closest("div[role='row']");
        if (curTargetRow !== null && curTargetRow !== preTargetRow) {
            preTargetRow = curTargetRow;
            let searchPlus = curTargetRow.querySelector("svg.text-brand-orange");
            changeElementDisplay(curTargetRow, searchPlus === null);
            hideCol();
        }
    });
}

function changeElementDisplay(element, displayOrNot) {
    const SHOW = "flex", HIDE = "none";
    element.style.display = displayOrNot ? SHOW : HIDE;
}