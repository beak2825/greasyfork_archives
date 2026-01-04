// ==UserScript==
// @name           fefe suchfeld
// @description    Fügt auf blog.fefe.de eine Sucheingabe ein.
// @version        0.1.1
// @author         Caduta Sassi
// @namespace      https://greasyfork.org/de/scripts/470527/
// @license MIT
// @match        https://blog.fefe.de/*
// @match        http://blog.fefe.de/*
// @run-at         document-end
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/470527/fefe%20suchfeld.user.js
// @updateURL https://update.greasyfork.org/scripts/470527/fefe%20suchfeld.meta.js
// ==/UserScript==
var title = document.getElementsByTagName('h2')[0],
    search = document.createElement('form'),
    input = document.createElement('input')
    ;
search.setAttribute('method', 'get');
search.setAttribute('action', 'https://blog.fefe.de/');
input.setAttribute('type', 'text');
input.setAttribute('placeholder', 'Suche...');
input.setAttribute('name', 'q');
search.appendChild(input);
title.appendChild(search);