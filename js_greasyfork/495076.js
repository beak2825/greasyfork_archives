// ==UserScript==
// @name         Ultimate Guitar inline chords
// @namespace    https://github.com/RMoura98/moura-userscripts
// @version      2024-05-15
// @description  Replaces the chord labels with inline chords
// @author       @RMoura98 (https://github.com/RMoura98)
// @match        https://tabs.ultimate-guitar.com/tab/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ultimate-guitar.com
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/495076/Ultimate%20Guitar%20inline%20chords.user.js
// @updateURL https://update.greasyfork.org/scripts/495076/Ultimate%20Guitar%20inline%20chords.meta.js
// ==/UserScript==

GM_addStyle("span[data-name] {font-size: 0; margin: -25px -28px !important; display: inline-block; height: 50px; transform: translate(0px, 15px);} span[data-name]:after {content: none;}")

const CHORD_SECTION_SELECTOR = "article > section:nth-child(2) > article > section"
const CHORD_SECTION_TO_CHORDS_SELECTOR = "section > div > div"
const CANVAS_SIZE_MULTIPLIER = 0.7
const debounce = (a,b,c) => {var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}}

const findChordElements = () => {
    let chordsSection = document.querySelector(CHORD_SECTION_SELECTOR)
    let chordElements = chordsSection.querySelectorAll(CHORD_SECTION_TO_CHORDS_SELECTOR)
    return chordElements
}

const mapChordToCanvas = (chords) => [...chords]
.reduce((f, e) => ({ ...f, [e.querySelector("span").textContent]: e.querySelector("canvas")}), {})

const copyCanvas = (sourceCanvas, destinationCanvas) => {
    let destCtx = destinationCanvas.getContext('2d');
    destCtx.drawImage(sourceCanvas, 0, 0);
}

const addInlineChords = (chordElements) => {
    const chordToCanvas = mapChordToCanvas(chordElements)
    const chordLabels = document.querySelectorAll("span[data-name]")
    chordLabels.forEach((chordLabel) => {
        let sourceCanvas = chordToCanvas[chordLabel.textContent] // maybe check dataset?
        let canvas = chordLabel.querySelector("canvas")
        chordLabel.innerHTML = ""
        let newCanvas = sourceCanvas.cloneNode(true);
        newCanvas.setAttribute("style", `transform: scale(${CANVAS_SIZE_MULTIPLIER});`);
        copyCanvas(sourceCanvas, newCanvas)
        chordLabel.appendChild(newCanvas);
    })
}

const reAddInlineChords = debounce(function() {
    let chordElements = findChordElements()
	addInlineChords(chordElements)
}, 250);


let watchChordChanges = (chordsCanvas) => {
    chordsCanvas.forEach(canvas => {
        (new MutationObserver(_ => reAddInlineChords())).observe(canvas.parentElement, {childList: true, subtree: true});
    })
}

(function() {
    'use strict';

    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(_changes, observer) {
        let chordElements = findChordElements()
        let chordsCanvas = [...chordElements].map(c => c.querySelector("canvas"))
        if (!chordsCanvas.every(cc => cc.toDataURL() === chordsCanvas[0].toDataURL())) {
            observer.disconnect();
            addInlineChords(chordElements)
            watchChordChanges(chordsCanvas)
        }
    }
})();