// ==UserScript==
// @name         Kahoot Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Mikerific
// @match        https://create.kahoot.it/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372321/Kahoot%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/372321/Kahoot%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var qa = [];
    var answers = "";
    setTimeout(function(){
        document.getElementsByClassName("text-button question-list__group-toggle")[0].click();
        var choices = document.getElementsByClassName("choices");
        for (var i = 0; i < choices.length; i++) {
            for (var j = 0; j < choices[i].children.length; j++) {
                if (choices[i].children[j].children[1].className == "choices__choice--correct") {
                    if (qa.length > 0) {
                        if (qa[qa.length-1].question != i) {
                            qa.push({question: i, answer: j});
                        }
                    } else {
                        qa.push({question: i, answer: j});
                    }
                }
            }
        }
        for (var i = 0; i < qa.length; i++) {
            answers = answers + qa[i].answer;
        }
        alert(answers);
        console.log(answers);
    }, 2000);
})();