// ==UserScript==
// @name         Bunpro Study Streak 2 Dragon
// @namespace    http://tampermonkey.net/
// @version      1c
// @description  Study streaks can be stressful or demoralizing, so we'll replace them with dragons instead 🐉 ...Or whatever you prefer.
// @author       Humin
// @match        https://bunpro.jp/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472719/Bunpro%20Study%20Streak%202%20Dragon.user.js
// @updateURL https://update.greasyfork.org/scripts/472719/Bunpro%20Study%20Streak%202%20Dragon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Edit the below to change the text that says "Study Streak".
    const newDescriptor = 'Dragon Status';
    //Edit the below to change the study streak number to something else. Also this will be static.
    const newText = '🐉🐉';

    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) { //Because Bunpro likes to do a lot of dynamic loading and these can be some of the last to load.
        if (document.querySelector('li.grid:nth-child(2) > p:nth-child(2)') && document.querySelector('li.grid:nth-child(2) > h4:nth-child(1)')){
            //observer.disconnect();
            const studyStreakDashboardText = document.querySelector('li.grid:nth-child(2) > h4:nth-child(1)');
            const studyStreakDashboardNumber = document.querySelector('li.grid:nth-child(2) > p:nth-child(2)');
            if (studyStreakDashboardText.innerHTML != newDescriptor){
                studyStreakDashboardText.innerHTML = newDescriptor;
            }
            if (studyStreakDashboardNumber.innerHTML != newText){
                studyStreakDashboardNumber.innerHTML = newText;
            }
        }
        if (document.querySelector('div.user-profile--stats-border:nth-child(2) > p:nth-child(1)') && document.querySelector('div.user-profile--stats-border:nth-child(2) > span:nth-child(2)')){
            //observer.disconnect();
            const studyStreakProfileText = document.querySelector('div.user-profile--stats-border:nth-child(2) > p:nth-child(1)');
            const studyStreakProfileNumber = document.querySelector('div.user-profile--stats-border:nth-child(2) > span:nth-child(2)');
            if (studyStreakProfileText.innerHTML != newDescriptor){
                studyStreakProfileText.innerHTML = newDescriptor;
            }
            if (studyStreakProfileNumber.innerHTML != newText){
                studyStreakProfileNumber.innerHTML = newText;
            }
        }
    }
})();