// ==UserScript==
// @name         Wikipedia Copiraiter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  removes footnotes from an article
// @author       Skl
// @match        https://ru.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395704/Wikipedia%20Copiraiter.user.js
// @updateURL https://update.greasyfork.org/scripts/395704/Wikipedia%20Copiraiter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        let siteSub = document.querySelector('#siteSub');
        let button = document.createElement('button');
        button.innerText = 'Убрать сноски';
        siteSub.appendChild(button);
        button.style.float = 'right';
        button.style.color = 'blue';
        button.addEventListener('click', () => {
        let references = document.querySelectorAll('.reference');
        for (let item of references) {
            item.remove();
        }
        });
    };
  //  document.addEventListener('DOMContentLoaded', remover);
    // Your code here...
})();