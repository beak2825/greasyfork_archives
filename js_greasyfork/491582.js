// ==UserScript==
// @name         Tiktokcounter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  renda extra
// @author       groland
// @match        https://tiktokcounter.net/*
// @match        https://tiktokcounter.net/travel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktokcounter.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491582/Tiktokcounter.user.js
// @updateURL https://update.greasyfork.org/scripts/491582/Tiktokcounter.meta.js
// ==/UserScript==

(function() {
    'use strict';




function resetTimer(varName) {
       window[varName] = 0;
    }

    function getVarName() {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            if (script.innerHTML.includes('window.wpSiteUrl = "https://tiktokcounter.net/travel";')) {
                var regex = /var (.+) = (\d+);/;
                var match = script.innerHTML.match(regex);
                if (match !== null) {
                    var variableName = match[1];
                    return variableName;
                }
            }
        }
        return "";
    }

    // Add a "SKIP" button
    function addSkipButton() {
        var skipButton = document.createElement('button');
        skipButton.id = 'skipButton';
        skipButton.textContent = 'SKIP';
        skipButton.style.position = 'fixed';
        skipButton.style.top = '10px';
        skipButton.style.left = '10px';
        skipButton.style.zIndex = '9999';

        skipButton.addEventListener('click', function() {
            var varName = getVarName();
            if (varName.length > 0) {
                resetTimer(varName);
            }
        });

        document.body.appendChild(skipButton);
    }


    function autoClickSkipButton() {
        var skipButton = document.getElementById('skipButton');
        if (skipButton) {
            skipButton.click();
        }
        var continueButton = document.getElementById('cbt');
        if (continueButton && continueButton.innerText == 'Continue') {
            if (skipButton) {
                skipButton.remove();
            }
            isHoverDone = true;
            continueButton;
        }
    }

    addSkipButton();
    setInterval(autoClickSkipButton, 6000); // 1000 ms = 1 seconde











    function isCaptchaChecked() {
        return hcaptcha && hcaptcha.getResponse().length !== 0;
    }

    setInterval(function(){

if (isCaptchaChecked()) {


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



      ReadytoClick('#cbt')
   

}
    }, 4000);


function iCaptchaChecked() {
        return hcaptcha && hcaptcha.getResponse().length !== 0;
    }

    setInterval(function(){

if (iCaptchaChecked()) {


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



      ReadytoClick('#cbt')
   

}
    }, 4000);


setTimeout(function() {
        // Localize e clique no elemento usando o seletor CSS fornecido
        document.querySelector('.mobile-hidden').click();
    }, 2000);



setTimeout(function() {
        // Localize e clique no elemento usando o seletor CSS fornecido
        document.querySelector('.gt-current-lang').click();
    }, 10000);

setTimeout(function() {
        // Localize e clique no elemento usando o seletor CSS fornecido
        document.querySelector('a.nturl:nth-of-type(22)').click();
    }, 11000);




const searchText = 'Step: 4/4';

    const sponsorLink = document.querySelector('center > cl > b:nth-of-type(1)');
    setTimeout(function() {
        if (sponsorLink.textContent === "Step: 4/4") {
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


      ReadytoClick('#cbt')
    }, 8000);

        }
          if (sponsorLink.textContent === "Step: 2/4") {
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


      ReadytoClick('#cbt')
    }, 8000);

        }
if (sponsorLink.textContent === "Step: 3/4") {
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


      ReadytoClick('#cbt')
    }, 8000);

        }
        if (sponsorLink.textContent === "Step: 1/3") {
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


      ReadytoClick('#cbt')
    }, 8000);

        }

        if (sponsorLink.textContent === "Step: 2/3") {
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


      ReadytoClick('#cbt')
    }, 8000);

        }

        if (sponsorLink.textContent === "Step: 1/2") {
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


      ReadytoClick('#cbt')
    }, 8000);

        }
         if (sponsorLink.textContent === "Step: 3/3") {
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


      ReadytoClick('#cbt')
    }, 8000);

        }

          if (sponsorLink.textContent === "Step: 2/2") {
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


      ReadytoClick('#cbt')
    }, 8000);

        }



    }, 2000);


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


      ReadytoClick('center > cl > b:nth-of-type(1)')
    }, 2000);


    // Your code here...
})();