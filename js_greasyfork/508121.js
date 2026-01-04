// ==UserScript==
// @name         Nokofaucet
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Renda Extra
// @author       Groland
// @match        https://nokofaucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nokofaucet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508121/Nokofaucet.user.js
// @updateURL https://update.greasyfork.org/scripts/508121/Nokofaucet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout( function() {

        function removerCartoes() {
        var cartoes = document.querySelectorAll('.overflow-hidden.shadow.rounded-2xl.border-gray-200.border.bg-white');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("Earnow") ||
                textoCartao.includes("Zshort") ||
                textoCartao.includes("CLKS") ||
                textoCartao.includes("Freeltc") ||
                textoCartao.includes("Shortlinks")) {
                cartao.remove();
            }
        });
    }
        removerCartoes();

    }, 3000);
 const bp = query => document.querySelector(query);const BpAll = query => document.querySelectorAll(query);
    function SubmitBp(selector, time = 1) {let elem = (typeof selector === 'string') ? bp(selector).closest('form') : selector; console.log(elem); setTimeout(() => {elem.submit();}, time * 1000);}
    function sleep(ms) {return new Promise((resolve) => setTimeout(resolve, ms));}
  function elementReady(selector) {return new Promise(function(resolve, reject) {let element = bp(selector);
      if (element) {resolve(element); return;} new MutationObserver(function(_, observer) {element = bp(selector);
      if (element) {resolve(element); observer.disconnect();}}).observe(document.documentElement, {childList: true, subtree: true});});}

    function ReadytoClick(selector, sleepTime = 0) {const events = ["mouseover", "mousedown", "mouseup", "click"];const selectors = selector.split(', ');
    if (selectors.length > 1) {return selectors.forEach(ReadytoClick);}if (sleepTime > 0) {return sleep(sleepTime * 1000).then(function() {ReadytoClick(selector, 0);});}
    elementReady(selector).then(function(element) {element.removeAttribute('disabled');element.removeAttribute('target');
        events.forEach(eventName => {const eventObject = new MouseEvent(eventName, {bubbles: true}); element.dispatchEvent(eventObject);});});}
setTimeout (function () {


      ReadytoClick(".overflow-hidden button")
    }, 4000);


})();