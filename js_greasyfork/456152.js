// ==UserScript==
// @name         webassign answerbox remover
// @namespace    none
// @version      1.1
// @license      MIT
// @description  delete the webassign answerboxes for if you don't want them like for re-studying
// @author       jacob phillips
// @match        https://www.webassign.net/web/Student/Assignment-Responses/last*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456152/webassign%20answerbox%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/456152/webassign%20answerbox%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function a() {
        var boxes=document.getElementsByClassName('wa1ans');
        for(var i = 0; i < boxes.length; i++){
            if(boxes.item(i).style.display=='none'){
                boxes.item(i).style.display='block'
            }else{
                boxes.item(i).style.display='none'
            };
        }
    }
    a();

    //<button style=\"background-color: #000000; border: 0px; color: white; padding: 10px; border-radius: 5px; position:absolute; top:0; right:0;\" onclick=\"a();\">Show All Answer Boxes</button>
    var toggleAnswerVisibilityButton = document.createElement('button');
    toggleAnswerVisibilityButton.style.backgroundColor = '#000000';
    toggleAnswerVisibilityButton.style.border='0px';
    toggleAnswerVisibilityButton.style.color='white';
    toggleAnswerVisibilityButton.style.padding='10px';
    toggleAnswerVisibilityButton.style.borderRadius='5px';
    toggleAnswerVisibilityButton.style.position='fixed';
    toggleAnswerVisibilityButton.style.bottom='0px';
    toggleAnswerVisibilityButton.style.right='0px';
    toggleAnswerVisibilityButton.style.zIndex='99';
    toggleAnswerVisibilityButton.addEventListener("click", a);
    toggleAnswerVisibilityButton.innerText='Show/Hide All Answer Boxes';
    document.getElementById('webAssign').appendChild(toggleAnswerVisibilityButton);
})();