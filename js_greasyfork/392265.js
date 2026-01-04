// ==UserScript==
// @name Google Colab Auto Reconnector
// @namespace http://tampermonkey.net/
// @version 1.3
// @description Automatically reconnect to Colab's session without clicking button.
// @author PartMent
// @coauthor SoulSpark
// @match https://colab.research.google.com/*
// @match http://colab.research.google.com/*
// @match https://*.research.google.com/*
// @match http://*.research.google.com/*
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/392265/Google%20Colab%20Auto%20Reconnector.user.js
// @updateURL https://update.greasyfork.org/scripts/392265/Google%20Colab%20Auto%20Reconnector.meta.js
// ==/UserScript==

//Keep Page Active
Object.defineProperty(document, 'visibilityState', {value: 'visible', writable: true});
Object.defineProperty(document, 'hidden', {value: false, writable: true});
document.dispatchEvent(new Event("visibilitychange"));

//Define MutationObserver to automatically reconnect
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
if (MutationObserver) console.log('Auto reconnector is enabled.');
var observer = new MutationObserver(function(mutations) {
    console.log('Detected DOM changes.');
    setTimeout(function () {
        var ok = document.getElementById('connect');
        if(ok.textContent.includes("Reconnect") || ok.textContent.includes("RECONNECT") || ok.textContent.includes("Connect") || ok.textContent.includes("connect") || ok.textContent.includes("CONNECT")) {
            console.log('Reconnecting...');
            ok.click();
            console.log('Connected');
        }
    }, 3000);
});
observer.observe(document.body, {childList: true});