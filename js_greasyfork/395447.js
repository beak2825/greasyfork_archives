// ==UserScript==
// @name        Duolingo autoScroller
// @description Automatically scrolls to the last completed checkpoint when Duolingo loads.
// @version     1.1
// @namespace   minirock
// @match       https://www.duolingo.com/learn
// @downloadURL https://update.greasyfork.org/scripts/395447/Duolingo%20autoScroller.user.js
// @updateURL https://update.greasyfork.org/scripts/395447/Duolingo%20autoScroller.meta.js
// ==/UserScript==

window.onload = function () {
    let lessons = document.querySelectorAll("div[class='_2albn']");

    for (let i = 0; i < lessons.length; ++i) {
        var lesson = lessons[i].querySelector("div[data-test='level-crown']");
        if (lesson === null) {
            var last_finished = i;
            break;
        }
    }
    lessons[last_finished].click();
};

// window.onload = function(){
//     let elem = document.querySelectorAll("div[data-test='level-crown']");
//     elem = elem[elem.length - 1];
//     if(elem !== null) elem.scrollIntoView(true);
// };