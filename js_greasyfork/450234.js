// ==UserScript==
// @name         Setnmh helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Improve setnmh
// @author       You
// @match        https://www.setnmh.com/series-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=setnmh.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450234/Setnmh%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/450234/Setnmh%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var iframe;
    var loading;

    const container = document.querySelector('.ptview');

    function processImage(image) {
        const img = document.createElement('img');
        img.src = image;
        container.appendChild(img);

        console.log(img);
    }

    function processPage(page) {
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '0px';
            iframe.style.height = '0px';
            document.body.appendChild(iframe);
        }
        iframe.src = page;

        showLoading(page);
    }

    function showLoading(page) {
        if (!loading) {
            loading = document.createElement('div');
            loading.style.textAlign = 'center';
            loading.style.position = 'fixed';
            loading.style.left = '50%';
            loading.style.top = '0px';
            loading.style.transform = 'translateX(-50%)';
            loading.style.zIndex = 999999;
            loading.style.color = '#000';
            loading.style.background = 'rgba(255, 255, 255, .8)';
            loading.style.padding = '2px 5px';
            document.body.appendChild(loading);
        }
        loading.textContent = `Loading ${page}`;
    }

    function hideLoading() {
        if (loading) {
            loading.remove();
            loading = undefined;
        }
    }

    const nextPageA = document.querySelector('.setnmh-next.mhicon.icon-jiantou-right');
    if (window != window.top) {
        const interval = setInterval(() => {
            const img = document.querySelector('.setnmh-seebox img');
            if (!img) return;

            clearInterval(interval);
            window.top.postMessage({ nextPagePath: nextPageA?.href, image: img.src }, location.origin);
        }, 100);
        return;
    }

    window.addEventListener('message', e => {
        if (e.data.image) {
            processImage(event.data.image);
        }
        if (e.data.nextPagePath) {
            processPage(e.data.nextPagePath);
        } else {
            hideLoading();
        }
    });

    if (nextPageA) processPage(nextPageA.href);
})();