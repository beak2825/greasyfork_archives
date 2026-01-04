// ==UserScript==
// @name         SimilarWeb Add Open Page Button
// @namespace    Lalala
// @author       Lalala
// @version      0.1
// @description  Adds a button to SimilarWeb competitor list items to open the competitor's url in a new tab/window when clicked.
// @match        https://www.similarweb.com/*/website/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462576/SimilarWeb%20Add%20Open%20Page%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/462576/SimilarWeb%20Add%20Open%20Page%20Button.meta.js
// ==/UserScript==

window.onload = function() {
    'use strict';
  
    const items = document.querySelectorAll('.wa-competitors__list-item');
    
    const createButton = (url) => {
        const button = document.createElement('a');
        button.classList.add('swui-button', 'swui-button--solid', 'swui-button--negative', 'wa-competitors__list-item-compare');
        button.setAttribute('data-test', 'button');
        button.href = `https://${url}`;
        button.target = '_blank';
        const span = document.createElement('span');
        span.textContent = '打開網站';
        const websiteSpan = document.createElement('span');
        websiteSpan.classList.add('wa-competitors__list-item-website');
        websiteSpan.textContent = `至 ${url}`;
        span.appendChild(websiteSpan);
        button.appendChild(span);
        return button;
    };
  
    const addButton = (wrapper, button) => {
        wrapper.parentNode.insertBefore(button, wrapper);
    };
  
    const addButtons = () => {
        for (const item of items) {
            const analyzeLink = item.querySelector('.wa-competitors__list-item-title');
            const analyzeWrapper = item.querySelector('.wa-competitors__list-item-analyze-text');
            if (analyzeLink && analyzeWrapper) {
                const button = createButton(analyzeLink.innerHTML);
                addButton(analyzeWrapper, button);
            } 
        }
    };

    addButtons();
};