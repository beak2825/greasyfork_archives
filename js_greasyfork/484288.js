// ==UserScript==
// @name         GF Inkognito-löscher
// @namespace    https://www.gutefrage.net/
// @version      2025.7
// @description  Versteckt Inkognito Fragen
// @author       jort93
// @license MIT
// @match        https://www.gutefrage.net/*
// @exclude      https://www.gutefrage.net/nutzer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gutefrage.net
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @downloadURL https://update.greasyfork.org/scripts/484288/GF%20Inkognito-l%C3%B6scher.user.js
// @updateURL https://update.greasyfork.org/scripts/484288/GF%20Inkognito-l%C3%B6scher.meta.js
// ==/UserScript==

waitForKeyElements(".u-mbm", action);

function action(jNode) {
    var xpath = `//span[text()='Inkognito']`;
    var elements = Array.from((function*(){ let iterator = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null); let current = iterator.iterateNext(); while(current){ yield current; current = iterator.iterateNext(); } })());
    elements.forEach((element) => { element.parentElement.parentElement.parentElement.parentElement.parentElement.remove()} );
}