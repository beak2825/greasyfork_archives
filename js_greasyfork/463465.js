"use strict";
// ==UserScript==
// @name         I Fixed Threads
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Save Twitter threads to local storage with easy reentry in case Twitter loses your thread in the ether
// @author       Samuel Gunter
// @license      MIT
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/463465/I%20Fixed%20Threads.user.js
// @updateURL https://update.greasyfork.org/scripts/463465/I%20Fixed%20Threads.meta.js
// ==/UserScript==
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getTweetButton = () => document.querySelector('[data-testid="tweetButton"]');
const getAddTweetButton = () => document.querySelector('[aria-label="Add Tweet"]');
const getTweetDrafts = () => document.querySelectorAll('[role="dialog"] [aria-label="Tweet text"]');
let isCurrentlyPasting = false;
let pastingDraftIndex = 0;
let savedDraftData = [];
const saveTweets = () => {
    const draftElements = Array.from(getTweetDrafts());
    const draftContents = draftElements.map((draft) => draft.innerText.trim().replaceAll("\n\n", "\n")).filter(Boolean);
    if (draftContents.length === 0)
        return;
    localStorage.setItem(":sgunter:thread", JSON.stringify(draftContents));
};
const loadTweets = () => {
    const rawData = localStorage.getItem(":sgunter:thread");
    if (rawData) {
        try {
            savedDraftData = JSON.parse(rawData);
        }
        catch (_a) { }
    }
    if (!savedDraftData) {
        alert("No thread saved or thread corrupted");
        return;
    }
    isCurrentlyPasting = true;
    pastingDraftIndex = 0;
    navigator.clipboard.writeText(savedDraftData[pastingDraftIndex]);
};
const rightClickHandler = (e) => {
    var _a;
    if (!((_a = getTweetButton()) === null || _a === void 0 ? void 0 : _a.contains(e.target)))
        return;
    e.preventDefault();
    if (e.shiftKey) {
        loadTweets();
    }
    else {
        saveTweets();
    }
};
const leftClickHandler = (e) => {
    var _a;
    if (!((_a = getTweetButton()) === null || _a === void 0 ? void 0 : _a.contains(e.target)))
        return;
    saveTweets();
};
const pasteHandler = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!isCurrentlyPasting)
        return;
    if (!savedDraftData.includes(yield navigator.clipboard.readText())) {
        isCurrentlyPasting = false;
        return;
    }
    pastingDraftIndex++;
    if (pastingDraftIndex >= savedDraftData.length) {
        navigator.clipboard.writeText("");
        isCurrentlyPasting = false;
        (_a = getAddTweetButton()) === null || _a === void 0 ? void 0 : _a.focus();
        (_b = getAddTweetButton()) === null || _b === void 0 ? void 0 : _b.blur();
        return;
    }
    (_c = getAddTweetButton()) === null || _c === void 0 ? void 0 : _c.focus();
    navigator.clipboard.writeText(savedDraftData[pastingDraftIndex]);
});
window.addEventListener("contextmenu", rightClickHandler);
window.addEventListener("click", leftClickHandler, true);
window.addEventListener("paste", pasteHandler);
if (typeof GM_registerMenuCommand !== "undefined") {
    GM_registerMenuCommand("Save Thread", saveTweets, "s");
    GM_registerMenuCommand("Load Thread", loadTweets, "l");
}
