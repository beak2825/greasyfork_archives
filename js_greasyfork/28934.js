// ==UserScript==
// @name         Metro_Question
// @namespace    
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.metroradio.com.hk/Campaign/gamea/qna*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28934/Metro_Question.user.js
// @updateURL https://update.greasyfork.org/scripts/28934/Metro_Question.meta.js
// ==/UserScript==


(function Choose() {
    'use strict';
        var x = '';
        x = Math.floor((Math.random() * 3) + 1);
        if (x == 1) {document.getElementById("ctl00_ContentPlaceHolder1_RadioButton1").checked = true;} 
        if (x == 2) {document.getElementById("ctl00_ContentPlaceHolder1_RadioButton2").checked = true;}
        if (x == 3) {document.getElementById("ctl00_ContentPlaceHolder1_RadioButton3").checked = true;}
    }
)();

(function maid() {
setTimeout(function(){document.getElementById("ctl00_ContentPlaceHolder1_btnSubmit").click();}, 3000);
}
)();