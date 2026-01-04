// ==UserScript==
// @name         Typeracer - No input limit
// @namespace    http://opensteno.org/
// @version      0.2.1
// @description  no more TypeRacer length limit
// @author       nimble
// @match        https://play.typeracer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35832/Typeracer%20-%20No%20input%20limit.user.js
// @updateURL https://update.greasyfork.org/scripts/35832/Typeracer%20-%20No%20input%20limit.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var inputBox = document.getElementsByClassName("txtInput");
 
    var maxLengthObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.target.removeAttribute("maxlength");
        });
    });
 
    new MutationObserver(function(mutations) {
        for(var node of inputBox)
            maxLengthObserver.observe(node, { attributes: true, attributeList: ["maxlength"] });
    }).observe(document.body, {
        childList: true,
        subTree: true,
    });
})();