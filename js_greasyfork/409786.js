// ==UserScript==
// @name          Kitsun Open JPod101 Audio
// @namespace     https://kitsun.io
// @description   Open JPod101 audio for the word being edited in a new tab.
// @author        seanblue
// @version       1.0.2
// @include       https://kitsun.io/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/409786/Kitsun%20Open%20JPod101%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/409786/Kitsun%20Open%20JPod101%20Audio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const requiredKey = 120; // F9

    const kanjiLabelText = 'Vocabulary';
    const kanaLabelText = 'Readings';

    document.addEventListener('keydown', onKeyDown);

    function onKeyDown(e) {
        if (e.keyCode === requiredKey) {
            openJPod101Audio();
        }
    }

    function openJPod101Audio() {
        let labelNodes = document.querySelectorAll('.kitInputWrapper label');

        let kanji = getInputValue(labelNodes, kanjiLabelText);
        let kana = getInputValue(labelNodes, kanaLabelText);

        if (kana) {
            let url = getJPodUrl(kanji, kana);

            window.open(url);
        }
    }

    function getInputValue(labelNodes, labelText) {
        for (let i = 0; i < labelNodes.length; i++) {
            let label = labelNodes[i];

            if (label.innerText === labelText) {
                let input = label.nextElementSibling;
                if (input && input.value) {
                    return input.value.split(',')[0].trim();
                }
            }
        }
    }

    function getJPodUrl(kanji, kana) {
        return `http://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=${kanji}&kana=${kana}`;
    }
})();