// ==UserScript==
// @name         Trzaskowski2020 WYPOK
// @namespace    http://wykop.pl/
// @version      1.0
// @description  Dodaje belkę z Trzaskiem na wykop :3
// @author       Print_Screen
// @match        https://www.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405007/Trzaskowski2020%20WYPOK.user.js
// @updateURL https://update.greasyfork.org/scripts/405007/Trzaskowski2020%20WYPOK.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var logo = document.createElement("div");
    logo.setAttribute('class', 'woodle');
    logo.style.cssText = 'background: url(https://i.imgur.com/4qFgRK5.png) no-repeat 0 0;';
    logo.innerHTML = '<a href="https://www.wykop.pl/tag/trzaskowski2020/"></a>';
    document.getElementById("nav").appendChild(logo);
})();