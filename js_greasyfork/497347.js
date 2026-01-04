// ==UserScript==
// @name         Smartdroid.de E-Auto Artikel Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides all articles with the category "Mobilität" unless they also have the category "Apps & Dienste". Removes the "Mobilität" category filter if activated, and styles the checkbox accordingly.
// @author       Integer
// @match        https://www.smartdroid.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497347/Smartdroidde%20E-Auto%20Artikel%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/497347/Smartdroidde%20E-Auto%20Artikel%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sliderContainer = document.createElement('div');
    sliderContainer.style.marginTop = '0.8rem';
    sliderContainer.style.marginBottom = '0.8rem';
    sliderContainer.style.textAlign = 'center';

    const sliderLabel = document.createElement('label');
    sliderLabel.textContent = 'E-Auto Artikel ausblenden: ';
    sliderLabel.style.verticalAlign = 'middle';
    sliderContainer.appendChild(sliderLabel);

    const slider = document.createElement('input');
    slider.type = 'checkbox';
    slider.id = 'eCarFilter';
    slider.style.verticalAlign = 'middle';
    sliderContainer.appendChild(slider);

    const style = document.createElement('style');
    style.textContent = `
        #eCarFilter {
            appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid #ccc;
            border-radius: 4px;
            outline: none;
            cursor: pointer;
            position: relative;
            margin-left: 8px;
        }
        #eCarFilter:checked {
            background-color: #f92020;
            border-color: #f92020;
        }
        #eCarFilter:checked::after {
            content: '';
            display: block;
            width: 6px;
            height: 12px;
            border: solid white;
            border-width: 0 2px 2px 0;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
        }
    `;
    document.head.appendChild(style);

    const postFilter = document.querySelector('.ast-post-filter');
    if (postFilter) {
        postFilter.appendChild(sliderContainer);
    } else {
        console.error('Element .ast-post-filter not found.');
    }

    function filterArticles() {
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            const categories = Array.from(article.querySelectorAll('a[rel="category tag"]'));
            const hasMobilitaet = categories.some(cat => cat.textContent.includes('Mobilität'));
            const hasAppsAndServices = categories.some(cat => cat.href.includes('/thema/software/app/'));

            if (hasMobilitaet && !hasAppsAndServices) {
                article.style.display = slider.checked ? 'none' : '';
            }
        });

        const mobilitaetFilter = document.querySelector('li.ast-post-filter-single[value="326"]');
        if (mobilitaetFilter) {
            mobilitaetFilter.style.display = slider.checked ? 'none' : '';
        }
    }

    const savedState = localStorage.getItem('eCarFilter');
    if (savedState !== null) {
        slider.checked = JSON.parse(savedState);
    }

    slider.addEventListener('change', () => {
        localStorage.setItem('eCarFilter', slider.checked);
        filterArticles();
    });

    filterArticles();

    const observer = new MutationObserver(filterArticles);
    observer.observe(document.body, { childList: true, subtree: true });
})();