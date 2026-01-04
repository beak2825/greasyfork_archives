// ==UserScript==
// @name         Quizlet gravity game cheat
// @namespace    Danielv123
// @version      2.4
// @description  The correct answer pops up in the browser console and the restart button down left
// @author       You
// @match        https://quizlet.com/*/gravity
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371923/Quizlet%20gravity%20game%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/371923/Quizlet%20gravity%20game%20cheat.meta.js
// ==/UserScript==

// Set settings and stuff
if(!localStorage.cheat){
    localStorage.cheatAutoType = true;
    localStorage.cheatActivated =  true;
}

// selectors, if something breaks these probably needs updating
// get word from asteroid
// broken 19.09.17 selector = "#GravityGameTarget > div > div > div > div.ModeLayout-content > div > div.GravityGameplayView-inner > div:nth-child(5) > div > div > div > .TermText > .TermText";
selector = "div > div > div > .TermText > .TermText";

// outputSelector = "#GravityGameTarget > div > div > div > div.ModeLayout-controls > div > div > div > div.ModeControls-main > div.ModeControls-actions > div:nth-child(2) > div > button > span";
outputSelector = "#GravityModeTarget > div > div > div > div.ModeLayout-controls > div > div > div > div.ModeControls-main > div.ModeControls-actions > div:nth-child(2) > div > button > span";

inputSelector = "#GravityGameTarget > div > div > div > div.ModeLayout-content > div > div.GravityGameplayView-inner > div.GravityGameplayView-typingPrompt > span > div > div > div.GravityTypingPrompt-inputWrapper > textarea";

inputRepeatSelector = "#GravityGameTarget > div > div > div > div.ModeLayout-content > div > div.GravityGameplayView-inner > div:nth-child(3) > div > div > div > div.GravityCopyTermView-inputWrapper > textarea";

setInterval(function() {
    // console.log(words);
    if(document.querySelector(selector) && localStorage.cheatActivated == "true"){
        translatedWord = words[document.querySelector(selector).innerHTML.replace(RegExp(
            '<!--[\\s\\S]*?(?:-->)?'
            + '<!---+>?'  // A comment with no body
            + '|<!(?![dD][oO][cC][tT][yY][pP][eE]|\\[CDATA\\[)[^>]*>?'
            + '|<[?][^>]*>?',  // A pseudo-comment
            'g'), "")];
        console.log(translatedWord);
        // update the feedback button with one of our translated words
        document.querySelector(outputSelector).innerHTML = translatedWord;
        if(document.querySelector(inputSelector).value == "" && localStorage.cheatAutoType == "true"){
            document.querySelector(inputSelector).value = translatedWord;
        }
    }
}, 100);

// Quizlet.gravityModeData.terms[0].definition gets data straight from quizlet :3
words = {};
for(i = 0; i<Quizlet.gravityModeData.terms.length; i++){
    words[Quizlet.gravityModeData.terms[i].word] = Quizlet.gravityModeData.terms[i].definition;
}
