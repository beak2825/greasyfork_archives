// ==UserScript==
// @name         Duolingo Audio
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Mute auto audio play on duolingo.
// @author       You
// @include      https://www.duolingo.com/checkpoint*
// @include      https://www.duolingo.com/skill*
// @include      https://www.duolingo.com/learn*
// @include      https://www.duolingo.com/practice*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416970/Duolingo%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/416970/Duolingo%20Audio.meta.js
// ==/UserScript==

let header = "";
let sentence = "";

(function() {
    console.log("DuoMod Script mounted")
    'use strict';

    // Toggle console outputs
    let logOutput = false;
    let log = function(){
        if (logOutput){
            return console.log.apply(console, arguments);
        }
    };

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    const onMutation = (mutations) => {
        const headerEl = document.querySelector('[data-test="challenge-header"]');
        const hintEl = document.querySelector('[data-test="hint-sentence"]');
        log("Something changes, maybe will mute audio", mutations, hintEl, headerEl)
        if (hintEl && headerEl && headerEl.innerText === "Write this in English") {
            const curHeader = headerEl.innerText;
            const curSentence = hintEl.innerText;
            if(curSentence !== sentence || curHeader !== header) {
                log("Audio muted");
                Howler.stop();
                header = curHeader;
                sentence = curSentence;
            }
            else {
                log("Audio was already muted");
            }
        }
        else if (hintEl && headerEl && headerEl.innerText === "Write this in Japanese"){
            const likelyhood = Math.floor(Math.random() * 100);
            if(likelyhood < 60) {
                headerEl.innerHTML = `<span>Write this in <span style="text-decoration: underline; color: darkgreen;"><b>casual</b></span> Japanese</span>`;
            } else {
                headerEl.innerHTML = `<span>Write this in <span style="text-decoration: underline; color: darkblue;"><b>polite</b></span> Japanese</span>`;
            }
        }
    }

    var observer = new MutationObserver(onMutation);

    var settings = {
        childList: true, subtree: true, attributes: false, characterData: false,
    }

    observer.observe(document.body, settings); // I tried to find a better thing to observe (like the next button), but nothing worked

})();