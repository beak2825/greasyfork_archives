// ==UserScript==
// @name         WaniKani - Full Progress Bar
// @namespace    http://tampermonkey.net/
// @version      1.2.9
// @description  Swap Kanji passed to Full Kanji Completed and Vocab Completed
// @author       Rychu (based off of Gorbit99's Better Progress Bar)
// @match        https://www.wanikani.com/dashboard*
// @match        https://www.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/451006/WaniKani%20-%20Full%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/451006/WaniKani%20-%20Full%20Progress%20Bar.meta.js
// ==/UserScript==

let kdElementChild1 = [];
let kdElementChild2 = [];
let vdElementChild1 = [];
let vdElementChild2 = [];

;(function() {
    'use strict';

    if (!window.wkof) {
        alert('Full Progress Bar requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }
    wkof.include("ItemData");

    wkof.ready("ItemData").then(insert_html);
})();

function insert_html() {
    //Clone Progress Bar
    let k = document.querySelector(".level-progress-bar");
    let parentK = k.parentNode;
    let parentPK = parentK.parentNode;
    let kanjiDiv = parentK.cloneNode(true);
    //Change Kanji Div IDs
    kanjiDiv.className = 'kanji-bar';
    kanjiDiv.title = "Kanji Progress";
    kanjiDiv.id = 'kanji-bar-id';
    let kdElement = kanjiDiv.getElementsByClassName('level-progress-bar')[0];
    kdElement.id = "kanji-progress-bar-id";
    kdElement.style.backgroundColor = "#b1b1b1";
    kdElementChild1 = kdElement.getElementsByClassName('level-progress-bar__progress')[0];
    kdElementChild1.id = "kanji-actualprogress-id";
    kdElementChild2 = kdElement.getElementsByClassName('level-progress-bar__label')[0];
    kdElementChild2.id = "kanji-label-id";
    //Change Vocab Div IDs
    parentK.className = 'vocab-bar';
    parentK.title = "Vocab Progress";
    //Place New Progress Bar
    parentPK.insertBefore(kanjiDiv,parentK);

    //Modify New Progress Bar
    let v = document.querySelector(".vocab-bar");
    v.style.padding = "10px 0px 0px 0px";
    //Change Vocab Div IDs
    let vdElement = v.getElementsByClassName('level-progress-bar')[0];
    vdElement.id = "vocab-progress-bar-id";
    vdElement.style.backgroundColor = "#b1b1b1";
    vdElementChild1 = vdElement.getElementsByClassName('level-progress-bar__progress')[0];
    vdElementChild1.id = "vocab-actualprogress-id";
    vdElementChild1.style.backgroundColor = "#aa00ff";
    vdElementChild2 = vdElement.getElementsByClassName('level-progress-bar__label')[0];
    vdElementChild2.id = "vocab-label-id"
    Promise.resolve().then(query_kanji);
};

function query_kanji() {
    wkof.ItemData.get_items({
        wk_items: {
            options: {assignments: true},
            filters: {item_type: ["kan"], level: '+0',}
        }
    }).then(handle_kanji);
}

function handle_kanji(items) {
    let kanji = items.filter(item => item.assignments !== undefined)
        .map(item =>
            item.assignments.passed_at !== null
                ? 1
                : Math.min(item.assignments.srs_stage, 1));

    if (kanji.length < 0) {
        return 0;
    }

    let kanjimax = items.length;
    let kanjiactual = kanji.reduce((sum, x) => sum + x, 0);

    kdElementChild1.style.width = `${kanjiactual / kanjimax * 100}%`;
    kdElementChild2.innerText = `${kanjiactual} of ${kanjimax} Kanji Complete`;
    Promise.resolve().then(query_vocab);
}

function query_vocab() {
    wkof.ItemData.get_items({
        wk_items: {
            options: {assignments: true},
            filters: {item_type: ["voc"], level: '+0',}
        }
    }).then(handle_vocab);
}

function handle_vocab(items) {
    let vocab = items.filter(item => item.assignments !== undefined)
        .map(item =>
            item.assignments.passed_at !== null
                ? 1
                : Math.min(item.assignments.srs_stage, 1));
    if (vocab.length < 0) {
        return 0;
    }
    let vocabmax = items.length;
    let vocabactual = vocab.reduce((sum, x) => sum + x, 0);

    vdElementChild1.style.width = `${vocabactual / vocabmax * 100}%`;
    vdElementChild2.innerText = `${vocabactual} of ${vocabmax} Vocab Complete`;
}