// ==UserScript==
// @name         Responde Aí Sem Paywall
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove a paywall ou blur das respostas do site Responde Aí
// @author       Carinha que mora logo alí
// @match        https://www.respondeai.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=respondeai.com.br
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447430/Responde%20A%C3%AD%20Sem%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/447430/Responde%20A%C3%AD%20Sem%20Paywall.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const old_element = document.getElementById("root");
    const new_element = old_element.cloneNode(true);
    const paywallElements = new_element.querySelectorAll('.paywall-content');
    paywallElements.forEach((e)=> {
        e.style= '';
        e.classList.value = '';
    })
    old_element.parentNode.replaceChild(new_element, old_element);
})();