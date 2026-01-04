// ==UserScript==
// @name         Progtest
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make progtest great again
// @author       Me
// @match        https://progtest.fit.cvut.cz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381883/Progtest.user.js
// @updateURL https://update.greasyfork.org/scripts/381883/Progtest.meta.js
// ==/UserScript==

(function() {
    'use strict';

    textNodesUnder(document.body).forEach(node => {
        node.textContent = node.textContent.replace(/ProgTest/g, 'ProgTrest').replace(/Program/g, 'Mašinka Tomáš')
        node.textContent = node.textContent.replace(/o/g, 'Ž').replace(/a/g, 'o').replace(/e/g, 'a').replace(/i/g, 'e').replace(/u/g, 'i').replace(/Ž/g, 'u')
        node.textContent = node.textContent.replace(/á/, 'Ž').replace(/ě/, 'á').replace(/ý/, 'ě').replace(/é/, 'ý').replace(/í/, 'é').replace(/ó/, 'í').replace(/Ž/, 'ó')
        node.textContent = node.textContent.replace(/O/g, 'Ž').replace(/A/g, 'O').replace(/E/g, 'A').replace(/I/g, 'E').replace(/U/g, 'I').replace(/Ž/g, 'U')
        node.textContent = node.textContent.replace(/Á/, 'Ž').replace(/Ě/, 'Á').replace(/Ý/, 'Ě').replace(/É/, 'Ý').replace(/Í/, 'É').replace(/Ó/, 'Í').replace(/Ž/, 'Ó')
    });
})();

function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}