// ==UserScript==
// @name         claimbox
// @namespace    http://tampermonkey.net/
// @version      1
// @description  dvbvcbc
// @author       You
// @match        https://claimbox.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimbox.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511664/claimbox.user.js
// @updateURL https://update.greasyfork.org/scripts/511664/claimbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes("https://claimbox.xyz/")){
        function removerCartoes() {
        var cartoes = document.querySelectorAll('.col-lg-3');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("Earnow") ||
                textoCartao.includes("Clks") ||
                textoCartao.includes("Shortino") ||
                textoCartao.includes("Shortano") ||
                textoCartao.includes("Revcut") ||
                textoCartao.includes("Linksflame") ||
                textoCartao.includes("Cutlinks") ||
                textoCartao.includes("Shorthop") ||
                textoCartao.includes("Rsshorts") ||
                textoCartao.includes("Chainfo") ||
                textoCartao.includes("V2p") ||
                textoCartao.includes("Usalink") ||
                textoCartao.includes("Coinfays") ||
                textoCartao.includes("Dutchycorp.Ovh") ||
                textoCartao.includes("Clks.Pro") ||
                textoCartao.includes("C2g") ||
                textoCartao.includes("Clks.Pro")) {
                cartao.remove();
            }
        });
    }
        removerCartoes();
}




  if (window.location.href.includes("https://claimbox.xyz/")){
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


      ReadytoClick(".col-lg-3 .waves-light.waves-effect.btn-primary.btn")
    }, 1000);

    }

})();