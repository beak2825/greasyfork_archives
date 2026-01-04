// ==UserScript==
// @name        PubMed Research
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Adds a "Research" button that searches the current query on PubMed
// @author      UnitedPenguin
// @git         https://github.com/UnitedPenguin/PubMed-Automatic-Research
// @include     http://*
// @include     https://*
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/467695/PubMed%20Research.user.js
// @updateURL https://update.greasyfork.org/scripts/467695/PubMed%20Research.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // create the "Research" button and style it
    let btn = document.createElement("button");
    btn.innerHTML = "Research";
    btn.style.position = "fixed";
    btn.style.bottom = "10px";
    btn.style.right = "10px";
    btn.style.zIndex = 9999;

    // add the button to the page
    document.body.appendChild(btn);

    // when clicked, search the current query on PubMed
    btn.onclick = function() {
        // get the current search query from the search bar
        let input = document.querySelector('input[name=q]');

        if (input && input.value) {
            // redirect to PubMed with the search query
            window.location.href = `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(input.value)}`;
        }
    };

})();