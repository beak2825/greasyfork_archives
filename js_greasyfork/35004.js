// ==UserScript==
// @name         Dictionary.com and thesaurus.com cleanup
// @description  Remove bullshit
// @version      2017.11.10
// @namespace    greasy
// @match        http://www.dictionary.com/browse/*
// @match        http://www.thesaurus.com/browse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35004/Dictionarycom%20and%20thesauruscom%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/35004/Dictionarycom%20and%20thesauruscom%20cleanup.meta.js
// ==/UserScript==

let s = document.createElement('style');
s.id='hide-crap';
s.textContent = `

.editorial-content-feed,
.wotd-module,
.survey,
.left-nav-sticky,
[id*=serp] {
    display: none !important;
}

`;


document.head.appendChild(s);