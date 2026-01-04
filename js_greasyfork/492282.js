// ==UserScript==
// @name         flashcard-revealer
// @namespace    MEDS 201
// @version      1.1
// @description  Reveals flashcard answer and puts it in the answer field
// @author       Ethan Logue
// @match        https://rit4.cipcourses.com/*/flashcards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cipcourses.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492282/flashcard-revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/492282/flashcard-revealer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        var btn = document.querySelector('button[type="submit"]');
        var cntnr = document.querySelector('.SingleQuestion-footer.margin-top-20')
        var txt = document.createElement('p');
        txt.style.width = '250px';
        cntnr.parentNode.insertBefore(txt, cntnr.nextSibling);
        showDef(txt);
        btn.addEventListener("click", function() {
            showDef(txt);
        });
    }, 2000);

    function showDef(txt) {
        setTimeout(function() {
            var def = document.querySelector('.flashcard-definition')
            var input = document.getElementById('flashcardAnswer');
            input.value = def.innerText;
            input.classList.add('ng-valid-parse');
            input.parentNode.classList.add('ng-valid-parse');
            txt.innerHTML = def.innerText;
            console.log(def.innerText);
        }, 500);
    }
})();