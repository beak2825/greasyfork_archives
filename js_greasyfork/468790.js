// ==UserScript==
// @name         VRCMods Download Bypass No Login and ADS
// @namespace    Wizzergod
// @version      1.0.2
// @description  VRCMods Download Bypass,No Login? no timer and ADS.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vrcmods.com
// @author       Wizzergod
// @match        *://vrcmods.com/*
// @include      *://vrcmods.com/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/468790/VRCMods%20Download%20Bypass%20No%20Login%20and%20ADS.user.js
// @updateURL https://update.greasyfork.org/scripts/468790/VRCMods%20Download%20Bypass%20No%20Login%20and%20ADS.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const xpathExpression = '//*[@data-toggle="modal" and @aria-hidden="true"]';
    const element = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
        element.parentNode.removeChild(element);
    }
    var elements = document.getElementsByClassName('bg-dark mt-5');
    for (var i = 0; i < elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);
    }
    var elements = document.getElementsByClassName('bg-dark mt-3 p-3 rounded');
    for (var i = 0; i < elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);
    }
    var elements = document.getElementsByClassName('text-right small mt-5 h6');
    for (var i = 0; i < elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);
    }
})();
onTimesUp()