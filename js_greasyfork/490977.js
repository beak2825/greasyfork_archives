// ==UserScript==
// @name         Removedor de anúncio para habblet
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removedor de anúncios e rádio chatos do habblet.
// @author       kyos
// @match        https://www.habblet.city/hotelv2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=habblet.city
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490977/Removedor%20de%20an%C3%BAncio%20para%20habblet.user.js
// @updateURL https://update.greasyfork.org/scripts/490977/Removedor%20de%20an%C3%BAncio%20para%20habblet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElement(elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    function showMessage(message) {
        var messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.position = 'fixed';
        messageElement.style.top = '50%';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translate(-50%, -50%)';
        messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        messageElement.style.color = 'white';
        messageElement.style.padding = '20px';
        messageElement.style.borderRadius = '10px';
        messageElement.style.zIndex = '9999';
        document.body.appendChild(messageElement);

       
        setTimeout(function() {
            document.body.removeChild(messageElement);
        }, 3000);
    }

    var customMessage = "Removedor de anúncios por: kyos";
    showMessage(customMessage);
    removeElement('ads2');
    removeElement('ads1');
    removeElement('player');
})();
