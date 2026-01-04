// ==UserScript==
// @name        Hide Solution Button - learnpython.org
// @namespace   Violentmonkey Scripts
// @match       https://www.learnpython.org/*
// @grant       none
// @version     1.0
// @author      Sergey Zhdanov
// @description Hide Solution Button at learnpython.org interactive courses
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/443139/Hide%20Solution%20Button%20-%20learnpythonorg.user.js
// @updateURL https://update.greasyfork.org/scripts/443139/Hide%20Solution%20Button%20-%20learnpythonorg.meta.js
// ==/UserScript==
function hide_solution_button()
{
    for (btn of document.querySelectorAll("button:not(.ng-hide)[ng-show=solutionButtonShown]")) 
    { 
        // console.log(btn); 
        btn.classList.add("ng-hide"); 
    }
}

window.addEventListener('load', hide_solution_button, false);
