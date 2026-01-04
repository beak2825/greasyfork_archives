// ==UserScript==
// @name         Make Korben Readable Again
// @namespace    https://korben.info/
// @version      0.1
// @description  removes all the trash content from Korben.info
// @author       You
// @match        https://korben.info/*
// @icon         https://www.google.com/s2/favicons?domain=korben.info
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430475/Make%20Korben%20Readable%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/430475/Make%20Korben%20Readable%20Again.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var postCategoriesAndFooters = document.querySelectorAll(".post-categories, footer");
    postCategoriesAndFooters.forEach(function(node){ node.remove() });

    var entryWrappers = document.querySelectorAll(".entry-wrapper .entry-wrapper");
    entryWrappers.forEach(function(wrap) {
        if (wrap.innerHTML.includes("ien partenaire</em>") || wrap.innerHTML.includes("Tu aimes ce site ?")) wrap.remove();
    })

    var sections = document.querySelectorAll("section");
    sections.forEach(function(sect) {
        if (sect.innerHTML.includes("Mes gazouillis</h3>")) sect.remove();
    });
})();