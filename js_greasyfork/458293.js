// ==UserScript==
// @name         Unity Forum $$anonymous$$ Replacer
// @namespace    none
// @version      1.0
// @description  replaces $$anonymous$$ back to 'hi'
// @author       RustyPrime
// @match        https://answers.unity.com/questions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unity.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458293/Unity%20Forum%20%24%24anonymous%24%24%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/458293/Unity%20Forum%20%24%24anonymous%24%24%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var body = document.querySelector("body");
    body.innerHTML = body.innerHTML.replaceAll('$$anonymous$$', 'hi');
})();