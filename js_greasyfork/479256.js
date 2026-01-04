// ==UserScript==
// @name         hideLoadingBar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Скрытие лоадинг бара на форуме лолзтим 
// @author       vuchaev2015
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479256/hideLoadingBar.user.js
// @updateURL https://update.greasyfork.org/scripts/479256/hideLoadingBar.meta.js
// ==/UserScript==

const observer = new MutationObserver((mutationsList, observer) => {
    const elements = document.querySelectorAll('.loadingBar');
    for(let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
});


observer.observe(document, { childList: true, subtree: true });
