// ==UserScript==
// @name         Amazon Image Alt Text Display
// @version      1.12
// @description  Display image alt text on Amazon pages.
// @author       Xiafanmao
// @match          *://www.amazon.com/*
// @match          *://www.amazon.co.uk/*
// @match          *://www.amazon.de/*
// @match          *://www.amazon.fr/*
// @match          *://www.amazon.it/*
// @match          *://www.amazon.ca/*
// @match          *://www.amazon.com.mx/*
// @match          *://www.amazon.es/*
// @match          *://www.amazon.co.jp/*
// @match          *://www.amazon.in/*
// @match          *://www.amazon.com.br/*
// @match          *://www.amazon.nl/*
// @match          *://www.amazon.com.au/*
// @match          *://www.amazon.ae/*
// @match          *://www.amazon.eg/*
// @match          *://www.amazon.pl/*
// @match          *://www.amazon.se/*
// @match          *://www.amazon.sg/*
// @match          *://www.amazon.com.tr/*
// @match          *://www.amazon.cn/*
// @match          *://www.amazon.sa/*
// @license MIT
// @namespace https://greasyfork.org/users/934737
// @downloadURL https://update.greasyfork.org/scripts/477236/Amazon%20Image%20Alt%20Text%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/477236/Amazon%20Image%20Alt%20Text%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all images on the page
    const images = document.querySelectorAll('img');

    images.forEach(image => {
        const altText = image.alt;
        if (altText) {
            // Create a tooltip to display alt text on hover
            const tooltip = document.createElement('div');
            tooltip.style.position = 'absolute';
            tooltip.style.zIndex = '9999';
            tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
            tooltip.style.color = '#fff';
            tooltip.style.padding = '5px';
            tooltip.style.borderRadius = '5px';
            tooltip.innerText = altText;

            // Attach event listeners to show/hide tooltip on hover
            image.addEventListener('mouseenter', () => {
                document.body.appendChild(tooltip);
                const imageRect = image.getBoundingClientRect();
                tooltip.style.top = `${imageRect.top + window.scrollY}px`;
                tooltip.style.left = `${imageRect.left + window.scrollX}px`;
            });

            image.addEventListener('mouseleave', () => {
                document.body.removeChild(tooltip);
            });
        }
    });
})();
