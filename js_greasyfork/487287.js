// ==UserScript==
// @name         NightCafé Profanity Warning
// @namespace    http://tampermonkey.net/
// @version      2024-05-15
// @description  Highlights input fields containing profanities
// @author       Rokker
// @match        https://creator.nightcafe.studio/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487287/NightCaf%C3%A9%20Profanity%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/487287/NightCaf%C3%A9%20Profanity%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.styleSheets[0].insertRule(".profanity-inside-element { outline: 3px solid blue; }");
    document.styleSheets[0].insertRule(".profanity-likelyhood-certain { outline: 3px solid red !important; }");
    document.styleSheets[0].insertRule(".profanity-likelyhood-likely { outline: 3px solid tomato !important; }");
    document.styleSheets[0].insertRule(".profanity-likelyhood-possible { outline: 3px solid orange !important; }");

    //Please help to populate this list with more words that will trigger the profanity filter
    const profanityWords = ['sex','fuck','slut','tit','ass','slag', 'lust'];
    const filterEnabledElementTypes = ['textarea', 'input'];
    const pRegex = '(\\s|[.,?!:;åäöÅÄÖ]|$|^)';

    const profanityCheck = () => {
        let elements = Array.from(document.querySelectorAll(filterEnabledElementTypes.join(', ')));
        elements.forEach((element)=>{
            let elementValue = (element.value||'').toLowerCase();
            let certainty = null;
            let wordMatch = null;
            let profanityMatch = profanityWords.find((profanity) => {
                certainty = null;
                let certainRegex = new RegExp(`${pRegex}(${profanity})${pRegex}`,'gmi');
                //let likelyRegex = new RegExp(`(${pRegex}(${profanity})([^\s]+))|(([^\s]+)(${profanity})${pRegex})`,'gmi');
                let likelyRegex = new RegExp(`(${pRegex}(${profanity})([A-Za-z0-9]+))|(([A-Za-z0-9]+)(${profanity})${pRegex})`,'gmi');
                let possibleRegex = new RegExp(`([A-Za-z0-9]+)${profanity}([A-Za-z0-9]+)`,'gmi');
                let regexMatch;
                if(regexMatch = certainRegex.test(elementValue)){
                    certainty = 'certain';
                    wordMatch = elementValue.match(certainRegex)[0].trim();
                    return true;
                };
                if(regexMatch = likelyRegex.test(elementValue)){
                    certainty = 'likely';
                    wordMatch = elementValue.match(likelyRegex)[0].trim();
                    return true;
                };
                if(regexMatch = possibleRegex.test(elementValue)){
                    certainty = 'possible';
                    wordMatch = elementValue.match(possibleRegex)[0].trim();
                    return true;
                };
            });

            element.classList.remove('profanity-likelyhood-certain,profanity-likelyhood-likely,profanity-likelyhood-possible');
            element.classList.toggle('profanity-inside-element', !!profanityMatch);

            if(profanityMatch){
                element.classList.add(`profanity-likelyhood-${certainty}`);
                if(wordMatch.toLowerCase() === profanityMatch.toLowerCase()){
                    element.title = `Matched profanity [${certainty}]:   "${wordMatch}"`;
                } else {
                    element.title = `Matched profanity [${certainty}]:   "${wordMatch}" (${profanityMatch})`;
                }
            } else {
                element.title = '';
            }
        });
    }


    //Main Loop
    const pageLoop = setInterval(()=>{
        profanityCheck();
    }, 1000);
})();