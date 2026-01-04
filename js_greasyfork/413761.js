// ==UserScript==
// @name         Jisho Only Essential Info
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Hide non-essential information from jisho search results
// @author       NickNickovich
// @match        https://jisho.org/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413761/Jisho%20Only%20Essential%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/413761/Jisho%20Only%20Essential%20Info.meta.js
// ==/UserScript==

/* jshint esversion:6 */

const showOtherForms = (node, button) => {
    if (node.style.display === "none") {
        node.style.display = "inline-block";
        button.innerHTML = "Hide";
    } else {
        node.style.display = "none";
        button.innerHTML = "Show";
    }
}

(function() {
    'use strict';
    const meaningTags = document.querySelectorAll("div.meaning-tags");
    const levelTags = document.querySelectorAll("div.concept_light-status > span");

    // Number of words found in search
    document.querySelectorAll("h4").forEach(h => {
        if (h.innerHTML.startsWith("Words")) {
            h.style.display = "none";
        }
    });

    // Example sentences in search results
    const sentences = document.querySelectorAll("div.sentence");
    sentences.forEach(s => {
        s.style.display = "none";
    });

    // Example sentences on the right side
    const secondarySentences = document.querySelector("div#secondary > div.sentences_block");
    if (secondarySentences) {
        secondarySentences.style.display = "none";
    }

    // Links under the words (play audio, collocations, links)
    const links = document.querySelectorAll("div.concept_light-status > a");
    links.forEach(link => {
        link.style.display = "none";
    });

    // Common word tags
    const commonWordTags = document.querySelectorAll("div.concept_light-status > span.success");
    commonWordTags.forEach(tag => {
        tag.style.display = "none";
    });

    // JLPT level tags
    levelTags.forEach(tag => {
        if (tag.innerHTML.startsWith("JLPT")) {
            tag.style.display = "none";
        }
    });

    // WK level tags
    levelTags.forEach(tag => {
        if (tag.innerHTML.includes("Wanikani level")) {
            tag.style.display = "none";
        }
    });

    // Other forms
    const otherForms = document.querySelectorAll("span.meaning-meaning");
    const entries = document.querySelectorAll("div.concept_light-wrapper.columns.zero-padding");
    if (entries.length > 3) {
        otherForms.forEach(f => {
            if (f.children.length > 2) {
                f.style.display = "none";
                const newButton = document.createElement("button");
                newButton.innerHTML = "Show";
                newButton.style.padding = "0rem 1rem";
                newButton.style.margin = "0";
                newButton.onclick = () => showOtherForms(f, newButton);
                f.parentNode.parentNode.parentNode.appendChild(newButton);
            }
        })
    }

    // Wikipedia definitions
    const wikiDefinitions = document.querySelectorAll("div.meaning-definition.zero-padding > span > a");
    wikiDefinitions.forEach(d => {
        if (d.innerHTML === " Read more") {
            d.parentNode.parentNode.style.display = "none";
        }
    });
    meaningTags.forEach(tag => {
        if (tag.innerHTML === "Wikipedia definition") {
            tag.style.display = "none";
        }
    });

    // Notes
    const notes = document.querySelectorAll("div.meaning-representation_notes");
    notes.forEach(note => {
        note.style.display = "none";
    });
    meaningTags.forEach(tag => {
        if (tag.innerHTML === "Notes") {
            tag.style.display = "none";
        }
    });

    // Annotations
    const supplementalInfo = document.querySelectorAll("span.sense-tag.tag-tag");
    supplementalInfo.forEach(s => {
        if (s.innerHTML === "Usually written using kana alone") {
            s.innerHTML = "Usually kana";
        } else if (s.innerHTML === "Yojijukugo (four character compound)") {
            s.innerHTML = "Yojijukugo";
        }
    });
})();