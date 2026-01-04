// ==UserScript==
// @name         SBAuto
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  gets you automated swagbucks untill you run out of questions
// @author       Thaswasupbreh
// @match        http://www.swagbucks.com/surveys?t=1&m=17&a=1&s=44834408&ls=7
// @downloadURL https://update.greasyfork.org/scripts/39812/SBAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/39812/SBAuto.meta.js
// ==/UserScript==

setInterval(function() {
    document.getElementsByClassName("questionDropdownContainer")[0].click();
    document.getElementsByClassName('questionDropdownOptions')[0].getElementsByTagName('span')[0].click();
    document.getElementsByClassName('surveyQuestionCTA')[0].getElementsByTagName('button')[0].click();
},500);