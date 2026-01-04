// ==UserScript==
// @name         FLY adicional
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  eee
// @author       You
// @license      none
// @match        https://advertisingexcel.com/landing/*
// @match        https://advertisingexcel.com/outgoing/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wefly.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496267/FLY%20adicional.user.js
// @updateURL https://update.greasyfork.org/scripts/496267/FLY%20adicional.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
        return;
            }else{
    function clickContinueButton() {
        var buttons = document.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].textContent.includes('Continue')) {
                var button = buttons[i];
                setTimeout(function() {
                    button.click();
                    console.log('Botão "Continue" clicado!');
                }, 1000);
                break;
            }
        }
    }
    function clickGetLinkButton() {
        var buttons = document.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].textContent.includes('Get Link')) {
                var button = buttons[i];
                setTimeout(function() {
                    button.click();
                    console.log('Botão "Get Link" clicado!');
                }, 1000);
                break;
            }
        }
    }
    var targetNode = document.body;
    var config = { attributes: true, childList: true, subtree: true };
    var callback = function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                clickContinueButton();
                clickGetLinkButton();
            }
        }
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    clickContinueButton();
    clickGetLinkButton();
            }
})();
