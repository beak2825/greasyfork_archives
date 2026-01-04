// ==UserScript==
// @name         accascs
// @namespace    http://tampermonkey.net/
// @version      2024-11-15
// @description  acaccacacaca
// @author       You
// @match        https://faucetpayz.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucetpayz.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517515/accascs.user.js
// @updateURL https://update.greasyfork.org/scripts/517515/accascs.meta.js
// ==/UserScript==

(function() {
    'use strict';

  if (window.location.href.includes("https://faucetpayz.com/")) {
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


      ReadytoClick(".col-xl-4.col-lg-6:nth-of-type(2) > .shortlink > .ptc-card")
    }, 1000);
        }

})();