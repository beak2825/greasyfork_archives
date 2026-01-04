// ==UserScript==
// @name         Stack for Github
// @namespace    Pitr
// @version      0.1
// @description  Must have for all devs
// @author       Pitr
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32583/Stack%20for%20Github.user.js
// @updateURL https://update.greasyfork.org/scripts/32583/Stack%20for%20Github.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ul = document.querySelector('.d-flex.pl-2.flex-items-center.text-bold.list-style-none');
    var newli = document.createElement('li');
    newli.innerHTML = '<a href="https://stackoverflow.com/" class="js-selected-navigation-item HeaderNavlink px-2">Stack Overflow</a>';
    ul.appendChild(newli);
})();