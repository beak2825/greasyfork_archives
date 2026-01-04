// ==UserScript==
// @name         Add Voice to Oxford Dictionary example sentence
// @namespace    OxfordDictionary
// @version      1.1
// @description  Add voice to "Oxford Learner's Dictionaries" example sentence.
// @author       Junanchn
// @match        https://www.oxfordlearnersdictionaries.com/*
// @icon         https://www.oxfordlearnersdictionaries.com/us/external/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467392/Add%20Voice%20to%20Oxford%20Dictionary%20example%20sentence.user.js
// @updateURL https://update.greasyfork.org/scripts/467392/Add%20Voice%20to%20Oxford%20Dictionary%20example%20sentence.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rate = 1.0;
    const pitch = 1.0;

    const synth = window.speechSynthesis;

    var selectUK = document.createElement('select');
    selectUK.id = 'select-uk';
    selectUK.style.cssText = 'display:block;width:192px;';
    var selectUS = document.createElement('select');
    selectUS.id = 'select-us';
    selectUS.style.cssText = 'display:block;width:192px;';
    var box = document.createElement('div');
    box.style.cssText = 'position:fixed;bottom:0px;right:0px;';
    box.appendChild(selectUK);
    box.appendChild(selectUS);
    document.body.appendChild(box);

    synth.addEventListener("voiceschanged", () => {
        selectUK.innerHTML = '';
        selectUS.innerHTML = '';
        var voices = synth.getVoices();
        for(let i = 0; i < voices.length ; i++) {
            let option = document.createElement('option');
            option.textContent = voices[i].name;
            if (voices[i].lang === 'en-GB') {
                selectUK.appendChild(option);
            }
            if (voices[i].lang === 'en-US') {
                selectUS.appendChild(option);
            }
        }
    });

    var pronounce = function(text, lang) {
        var utter = new SpeechSynthesisUtterance(text);
        var voices = synth.getVoices();
        for(let j = 0; j < voices.length ; j++) {
            var voiceSelect = document.getElementById('select-'+lang);
            if(voices[j].name === voiceSelect.value) {
                utter.voice = voices[j];
            }
        }
        utter.rate = rate;
        utter.pitch = pitch;
        synth.cancel();
        synth.speak(utter);
    }

    var addPronounceButton = function(element, lang) {
        let btn = document.createElement("span");
        btn.classList.add('sound', 'audio_play_button', 'icon-audio', 'pron-'+lang);
        btn.addEventListener('click', (event) => {
            pronounce(element.outerText, lang);
        });
        element.parentNode.insertBefore(btn, element.nextSibling);
    }

    var x = document.getElementsByClassName('x');
    var unx = document.getElementsByClassName('unx');
    var headword = [];//document.getElementsByClassName('def');
    var def = [];//document.getElementsByClassName('def');
    var elements = [...x, ...unx, ...headword, ...def];

    for (let i=0, len=elements.length; i<len; i++) {
        addPronounceButton(elements[i], 'us');
        addPronounceButton(elements[i], 'uk');
    }
})();
