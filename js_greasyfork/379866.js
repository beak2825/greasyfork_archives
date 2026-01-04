// ==UserScript==
// @name         WideNotebook
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Microblink
// @include      /^.*/notebooks/.*.ipynb.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379866/WideNotebook.user.js
// @updateURL https://update.greasyfork.org/scripts/379866/WideNotebook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function strech() {
        document.querySelector('#header-container').style.width = '95%';
        document.querySelector('#menubar-container').style.width = '95%';
        document.querySelector('#notebook-container').style.width = '95%';
    }

    document.addEventListener("click", strech);

})();