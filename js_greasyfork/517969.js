// ==UserScript==
// @name         SurferSEO Heading Buttons
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds custom buttons to set text headings on SurferSEO page
// @author       mhshan
// @match        https://app.surferseo.com/drafts/s/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517969/SurferSEO%20Heading%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/517969/SurferSEO%20Heading%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and add a heading button
    function createHeadingButton(text, top, left, heading) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.position = 'fixed';
        button.style.top = top;
        button.style.left = left;
        button.style.height = '40px';
        button.style.width = '40px';
        button.style.background = 'Black';
        button.style.color = 'white';
        button.style.fontWeight = '600';
        button.style.zIndex = 1000;
        button.style.borderRadius = '8px';
        button.style.padding = '5px 10px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.transition = 'background 0.3s ease, transform 0.3s ease';

        button.addEventListener('mouseover', function() {
            button.style.background = '#3CCF4E';
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseout', function() {
            button.style.background = 'Black';
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', function() {
            const outerDiv = document.querySelector('div[data-testid="ribbon-heading-select-button"]');
            if (outerDiv) {
                outerDiv.click();

                setTimeout(() => {
                    const menuItems = document.querySelectorAll('div[role="menuitem"] span.Text__StyledText-sc-8gmuv2-0.kGVTxJ');
                    let headingElement = null;
                    menuItems.forEach(item => {
                        if (item.textContent.trim() === heading) {
                            headingElement = item.closest('div[role="menuitem"]');
                        }
                    });

                    if (headingElement) {
                        headingElement.click();
                    } else {
                        alert(`${heading} element not found.`);
                    }
                }, 500);
            } else {
                alert('Outer button not found.');
            }
        });

        document.body.appendChild(button);
    }

    // Check if the URL matches the pattern
    if (window.location.href.startsWith('https://app.surferseo.com/drafts/s/')) {
        createHeadingButton('H1', '400px', '60px', 'Heading 1');
        createHeadingButton('H2', '400px', '110px', 'Heading 2');
        createHeadingButton('H3', '400px', '160px', 'Heading 3');
    }
})();
