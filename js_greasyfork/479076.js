// ==UserScript==
// @name         DS-160 Translator
// @namespace    DS-160Translator
// @version      1
// @description  Translates the DS-160 Nonimmigrant Visa form into any language without making you have to hover over all english innerTexts on the page to see the translation!
// @author       hacker09
// @match        https://ceac.state.gov/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ceac.state.gov/genniv/&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479076/DS-160%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/479076/DS-160%20Translator.meta.js
// ==/UserScript==

(function() {
  'use strict';
  setTimeout(() => {
    if (document.querySelector("#ctl00_ddlLanguage").value !== 'en-US')
    {
      document.querySelectorAll("span:not(:has(a, div, input))").forEach(function(el) {
        el.innerText !== '' ? el.innerText = el.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/) !== null ? el.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2] : '' : ''
      });
      document.querySelectorAll("span > div").forEach(function(el) {
        if (el.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/) !== null && el.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2]) {
          var tempElement = document.createElement('textarea');
          tempElement.innerHTML = el.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2];
          el.innerHTML = tempElement.value;
        }
      });
      document.querySelectorAll("a").forEach(function(el) {
        el.innerText !== '' ? el.innerText = el.parentElement.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/) !== null ? el.parentElement.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2] : '' : ''
      });
      document.querySelectorAll("span > input").forEach(function(el) {
        el.value !== '' ? el.value = el.parentElement.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/) !== null ? el.parentElement.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2] : '' : ''
      });
      document.querySelectorAll("tr:has(label) > td").forEach(function(el) {
        el.querySelector("td > label").innerText !== '' ? el.querySelector("td > label").innerText = el.parentNode.parentNode.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/) !== null ? el.parentNode.parentNode.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2].split(' ')[0] : '' : ''
        el.querySelectorAll("td > label")[1].innerText !== '' ? el.querySelectorAll("td > label")[1].innerText = el.parentNode.parentNode.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/) !== null ? el.parentNode.parentNode.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2].split(' ')[2] : '' : ''
      });

      /*     new MutationObserver(async function() { //Se uma quantidade diferente for selecionada

            document.querySelectorAll("span:not(:has(a,div,label))").forEach(function(el) {
        el.innerText !== '' ? el.innerText = el.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/) !== null ? el.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2] : '' : ''
      });
      document.querySelectorAll("span > div").forEach(function(el) {
        if (el.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/) !== null && el.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2]) {
          var tempElement = document.createElement('textarea');
          tempElement.innerHTML = el.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2];
          el.innerHTML = tempElement.value;
        }
      });
      document.querySelectorAll("a").forEach(function(el) {
        el.innerText !== '' ? el.innerText = el.parentElement.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/) !== null ? el.parentElement.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2] : '' : ''
      });
      document.querySelectorAll("span > input").forEach(function(el) {
        el.value !== '' ? el.value = el.parentElement.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/) !== null ? el.parentElement.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2] : '' : ''
      });
      document.querySelectorAll("tr:has(label)").forEach(function(el) {
        el.querySelector("td > label").innerText !== '' ? el.querySelector("td > label").innerText = el.parentNode.parentNode.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/) !== null ? el.parentNode.parentNode.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2].split(' ')[0] : '' : ''
        el.querySelectorAll("td > label")[1].innerText !== '' ? el.querySelectorAll("td > label")[1].innerText = el.parentNode.parentNode.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/) !== null ? el.parentNode.parentNode.parentNode.outerHTML.match(/tip=("|'|&quot;)(.*?)("|'|&quot;;)/)[2].split(' ')[2] : '' : ''
      });

    }).observe(document.querySelector("body > title"), { //Define o elemento e as caracteristicas a serem observadas
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
      childList: true,
      subtree: true
    }); //Termina as definicoes a serem observadas */
    }
  }, 1000);
})();