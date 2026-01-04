// ==UserScript==
// @name           Habr hide cover image in spoiler
// @name:ru        Хабр спрятать КДПВ в спойлер
// @namespace      habr_hide_cover_image
// @version        1.3.4
// @description    Hides cover image in spoiler; image is loaded on open.
// @description:ru Прячет КДПВ в спойлер; картинка загружается при открытии.
// @author         Dystopian
// @license        WTFPL
// @match          https://habr.com/*
// @icon           https://habr.com/favicon.ico
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/525641/Habr%20hide%20cover%20image%20in%20spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/525641/Habr%20hide%20cover%20image%20in%20spoiler.meta.js
// ==/UserScript==

'use strict';

const imgParentSelectorsArticle = [
    'div.cover.object-fit-cover:not(details div)',
    'div.article-formatted-body.article-formatted-body_version-1 a:not(details a)',
];

function hide(element) {
    const images = element.tagName === 'IMG' ? [element] : element.querySelectorAll('img:not([data-src])');
    images.forEach(img => {
        img.setAttribute('data-src', img.src);
        img.removeAttribute('src');
    });

    const details = document.createElement('details');
    // details.className = 'spoiler';
    details.style.border = "1px dashed rgba(128, 128, 128, 0.5)";
    const summary = document.createElement('summary');
    summary.textContent = 'Hidden Image';
    element.parentNode.insertBefore(details, element);
    details.appendChild(summary);
    details.appendChild(element);
    details.addEventListener('toggle', () => {
        if (details.open) {
            details.querySelectorAll('img[data-src]:not([src])').forEach(img => {
                img.src = img.getAttribute('data-src');
            });
        }
    });
}
function check() {
    document.querySelectorAll('div.article-snippet').forEach(articleElement => {
        imgParentSelectorsArticle.forEach(imgParentSelector => {
            articleElement.querySelectorAll(imgParentSelector).forEach(element => {
                if (element.querySelector('img')) hide(element);
            });
        });
        // images without parents, ex. 888424 874324
        articleElement.querySelectorAll('div.article-formatted-body.article-formatted-body_version-1 img:not(details img)').forEach(img => {
            hide(img);
        });
    });
    document.querySelectorAll('div.tm-post-snippet').forEach(postElement => {
        postElement.querySelectorAll('figure:not(details figure)').forEach(element => {
            if (element.querySelector('img')) hide(element);
        });
    });
}

function ready(fn) {
    const { readyState } = document;
    if (readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            fn();
        });
    } else {
        fn();
    }
}

ready(() => {
    check();
    const observer = new MutationObserver(() => {
        // handle mutation loop
        observer.disconnect();
        check();
        observer.observe(document.body, { childList: true, subtree: true });
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
