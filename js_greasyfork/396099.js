// ==UserScript==
// @name         Remove notes Wiki
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Удаление сносок с сайта Википедии
// @author       Vera
// @match        https://ru.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396099/Remove%20notes%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/396099/Remove%20notes%20Wiki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function removeNotes() {
        let parent = document.getElementById('bodyContent');
        let before = document.getElementById('siteSub');
        let btn = document.createElement('button');
        btn.innerText = 'Убрать все сноски';
        btn.setAttribute('id', 'removeN');
        btn.style.backgroundColor = 'red';
        btn.style.color = 'white';
        parent.insertBefore(btn, before);
        let sups = document.querySelectorAll('sup');
        btn.addEventListener("click", () => {
            for (let elem of sups) elem.innerText = ''
        })
        }
    removeNotes();
})();