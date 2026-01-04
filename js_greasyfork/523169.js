// ==UserScript==
// @name         No Timer
// @version      0.1
// @author       d59fd0405d44365efe2704a1f5657927ca88a1a
// @description  No Timer on mega.cc
// @match        *://mega2.cc/*
// @license MIT
// @grant        none
// @namespace https://greasyfork.org/users/954286
// @downloadURL https://update.greasyfork.org/scripts/523169/No%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/523169/No%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var linkElement = document.querySelector('.btn.btn-cta-primary.clickable-row[data-href*="zip"]');
    if (linkElement) {
        var link = linkElement.getAttribute('data-href');
        var newDiv = document.createElement('div');
        newDiv.style.position = 'fixed';
        newDiv.style.top = '20px';
        newDiv.style.right = '20px';
        newDiv.style.backgroundColor = 'red';
        newDiv.style.color = 'white';
        newDiv.style.borderRadius = '5px';
        newDiv.style.padding = '10px 15px';
        newDiv.style.cursor = 'pointer';
        newDiv.style.zIndex = '1000';
        newDiv.style.textAlign = 'center';
        newDiv.textContent = link;
        newDiv.addEventListener('click', function() {
            window.open(link, '_blank');
        });
        newDiv.addEventListener('mouseover', function() {
            newDiv.style.backgroundColor = '#ff4d4d';
        });
        newDiv.addEventListener('mouseout', function() {
            newDiv.style.backgroundColor = 'red';
        });
        document.body.appendChild(newDiv);
    }
})();
