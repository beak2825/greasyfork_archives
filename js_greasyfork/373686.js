// ==UserScript==
// @name         WK Cool Review Progress Bar
// @namespace    japanese
// @version      0.1
// @description  Make the review progress bar not be boring
// @author       Sean 'StarMech' Matthew
// @match        http*://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373686/WK%20Cool%20Review%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/373686/WK%20Cool%20Review%20Progress%20Bar.meta.js
// ==/UserScript==

(function() {
    ///////////////////////////////////////////////////
    // Edit these to choose which features you want
    var useAnimatedBar = true;
    var useThickBar = true;
    var barThickness = 25; //Height in pixels
    ///////////////////////////////////////////////////


    if(useAnimatedBar){
        document.getElementById('bar').style.transition = 'all 1s ease 0s';
    }
    if(useThickBar){
        document.getElementById('progress-bar').style.height = barThickness + 'px';
        document.getElementById('bar').style.height = '100%';
    }
})();