// ==UserScript==
// @name         OF Download Button
// @namespace    http://tampermonkey.net/
// @version      2025-01-25
// @description  Adds a download button to OF when a piece of media is opened in the overlay
// @author       anon
// @match        https://onlyfans.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524841/OF%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/524841/OF%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const vid = () => (
        document.querySelector('.pswp__item[aria-hidden="false"] video source[label="original"]') ??
        document.querySelector('.pswp__item[aria-hidden="false"] video source[label="720"]') ??
        document.querySelector('.pswp__item[aria-hidden="false"] video source[label="240"]')
    );
    const img = () => document.querySelector('.pswp__item[aria-hidden="false"] img:not([loading])');
    const mp4 = () => document.querySelector('.pswp__item[aria-hidden="false"] .b-audioplayer')?.__vue__._props;

    function downloadCurrentlyOpened() {
        dwnldBtn.style.backgroundColor = null;
        const src = (vid() ?? img() ?? mp4())?.src;

        if(!src) {
            throw Error("No content found or no overlay opened!");
        }

        const filename = src.split('/').pop().split('?')[0];
        console.time('download');

        fetch(src)
            .then(response => {
            if (response.ok) {
                return response.blob();
            }

            console.timeEnd('download');
            console.log('download finished:', filename);
            dwnldBtn.style.backgroundColor = 'red';
            throw new Error("failed to fetch: " + src);
        })
            .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.timeEnd('download');
            console.log('download finished:', filename);
        })
            .catch(error => {
            console.timeEnd('download');
            console.log('could not download:', filename);
            dwnldBtn.style.backgroundColor = 'red';
            throw new Error(error);
        });
    }

    const dwnldBtn = document.createElement('button');
    dwnldBtn.className = 'g-btn m-rounded b-chat__btn-submit';
    dwnldBtn.textContent = 'Download';
    dwnldBtn.style.position = 'fixed';
    dwnldBtn.style.right = '1rem';
    dwnldBtn.style.bottom = '1rem';
    dwnldBtn.style.zIndex = 5000;
    dwnldBtn.onclick = downloadCurrentlyOpened;
    document.body.appendChild(dwnldBtn);

    function handleDisplayBtn() {
        const overlay = document.querySelector('.pswp.pswp--open');
        if (overlay) {
            dwnldBtn.style.display = 'initial';
        } else {
            dwnldBtn.style.display = 'none';
        }
    }

    handleDisplayBtn();
    const observerTarget = document.body;
    const observer = new MutationObserver(handleDisplayBtn);
    observer.observe(observerTarget, { childList: true });
})();