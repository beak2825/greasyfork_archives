// ==UserScript==
// @name         Wanikani Hints
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24536/Wanikani%20Hints.user.js
// @updateURL https://update.greasyfork.org/scripts/24536/Wanikani%20Hints.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Wanikani Meaning / Reading Hints 2");

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function questionTypeUpdated(){
        console.log("Question type updated");
        var questionType = $.jStorage.get('questionType');
        console.log(questionType);
        
        if (questionType == "reading"){
            //change style
            $("#question")[0].className = "reading";
        } else if (questionType == "meaning"){
            //change style
            $("#question")[0].className = "meaning";
        }
    }

    addGlobalStyle('#question.meaning #answer-form { margin-right: 30% }');
    addGlobalStyle('#question.reading #answer-form { margin-left: 30% }');
    addGlobalStyle('#question.reading { background-color: #2e2e2e; }');

    $.jStorage.listenKeyChange("questionType", questionTypeUpdated);

})();
