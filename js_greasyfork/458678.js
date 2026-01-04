// ==UserScript==
// @name         TikTok Toggle Comments
// @namespace    http://alamote.pp.ua/
// @match        https://www.tiktok.com/*
// @grant        none
// @version      1.0.1
// @namespace    AlaMote
// @description  Add an ability to hide comments block on full screen TikTok
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458678/TikTok%20Toggle%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/458678/TikTok%20Toggle%20Comments.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';

    const interval = setInterval(() => {
        const soundButton = document.querySelector('#app div[class*="DivVoiceControlContainer"] button[class*="ButtonVoiceControlNew"]');
        if (soundButton) {
            clearInterval(interval);

            const style = document.createElement('style');
            style.innerHTML = `
                .comments-button {
                    border: none;
                    background: none rgba(84, 84, 84, 0.5);
                    outline: none;
                    padding: 0px;
                    display: flex;
                    transition: opacity 0.3s ease 0s;
                    cursor: pointer;
                    line-height: 0;
                    border-radius: 100px;
                    height: 40px;
                    width: 40px;
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    z-index: 1;
                    bottom: 20px;
                    right: 20px;
                }

                .comments-button:hover {
                    background-color: rgba(37, 37, 37, 0.6);
                    opacity: 0.7;
                }
            `;
            document.querySelector('head').append(style);

            soundButton.parentNode.style.bottom = '68px';

            const commentsButton = document.createElement('button');
            commentsButton.classList.add('comments-button');
            commentsButton.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();
                const commentsContainer = document.querySelector('#app div[class*="DivVideoContainer"] + div[class*="DivContentContainer"]');
                if (commentsContainer) {
                    commentsContainer.style.display = commentsContainer.style.display === 'none' ? 'flex' : 'none';
                }
            });
            commentsButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#svg-ellipsis-right-fill"></use></svg>`;
            soundButton.parentNode.parentNode.append(commentsButton);
        }
    }, 300);

})();