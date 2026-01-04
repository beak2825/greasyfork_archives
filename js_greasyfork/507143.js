// ==UserScript==
// @name         Tenipo Match Detail Button - Optimized
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Přidání tlačítek "DETAIL ZÁPASU" jen pro zápasy viditelné na obrazovce na stránce Tenipo.
// @author       Lukáš Malec
// @match        https://tenipo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507143/Tenipo%20Match%20Detail%20Button%20-%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/507143/Tenipo%20Match%20Detail%20Button%20-%20Optimized.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function addButtonToMatch(match) {
        let onclickAttr = match.getAttribute('onclick');
        let matchUrl = onclickAttr.match(/\/match\/[a-zA-Z0-9-]+\/\d+/);
 
        if (matchUrl) {
            let fullUrl = 'https://tenipo.com' + matchUrl[0];
 
            if (!match.querySelector('a.detail-button')) {
                let button = document.createElement('a');
                button.href = fullUrl;
                button.textContent = 'DETAIL ZÁPASU';
                button.className = 'detail-button';
                button.style.display = 'inline-block';
                button.style.padding = '5px 40px';
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
                button.style.textDecoration = 'none';
                button.style.marginTop = '10px';
                button.style.borderRadius = '5px';
 
                match.appendChild(button);
            }
        }
    }
 
    const observerCallback = function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                addButtonToMatch(entry.target);
                observer.unobserve(entry.target);
            }
        });
    };
 
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
 
    const observer = new IntersectionObserver(observerCallback, observerOptions);
 
    function observeMatches() {
        let matches = document.querySelectorAll('table[onclick]');
 
        matches.forEach(function(match) {
            observer.observe(match);
        });
    }

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .detail-button {
                display: inline-block;
                padding: 5px 40px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                margin-top: 10px;
                border-radius: 5px;
            }
        `;
        document.head.appendChild(style);
    }
 
    const mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                observeMatches();
            }
        });
    });
 
    mutationObserver.observe(document.body, { childList: true, subtree: true });
 
    document.addEventListener('DOMContentLoaded', function() {
        addStyles();
        observeMatches();
    });
 
})();