// ==UserScript==
// @name         Mangalib: Download all chapters
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  download manga from mangalib.me
// @author       You
// @match        *://mangalib.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399534/Mangalib%3A%20Download%20all%20chapters.user.js
// @updateURL https://update.greasyfork.org/scripts/399534/Mangalib%3A%20Download%20all%20chapters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const header = document.querySelector('#main-page .media-tabs .tabs__list');

    if (!header) {
        return;
    }

    const button = document.createElement('span');
    button.classList.add('volume-anchor__trigger');
    button.innerText = 'Скачать все главы';
    button.addEventListener('click', function() {
        const chapters = document.querySelectorAll('.media-chapter__icon.media-chapter__icon_download');
        chapters.forEach(function(node) {
            if (node.getAttribute('data-chapter-dropdown')) {
                node.dispatchEvent(new MouseEvent('mouseenter'));
                setTimeout(() => {
                    const tippyId = node.getAttribute('aria-describedby');
                    const tippy = document.getElementById(tippyId);
                    const translations = tippy.querySelectorAll('.menu a.menu__item');
                    translations[translations.length - 1].click();
                }, 500);
            }
            node.click();
        });
    });
    button.style.marginLeft = '12px';
    header.appendChild(button);

})();