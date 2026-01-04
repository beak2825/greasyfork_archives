// ==UserScript==
// @name         YouTube Q點讚Press Q to like/cancel likes
// @namespace    http://your.namespace.com
// @version      0.4
// @description  Press Q to like/cancel likes
// @author       You
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483465/YouTube%20Q%E9%BB%9E%E8%AE%9APress%20Q%20to%20likecancel%20likes.user.js
// @updateURL https://update.greasyfork.org/scripts/483465/YouTube%20Q%E9%BB%9E%E8%AE%9APress%20Q%20to%20likecancel%20likes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 81 && !event.ctrlKey && !event.altKey && !event.shiftKey) {
            if (document.activeElement.tagName.toLowerCase() === 'input' ||
                document.activeElement.tagName.toLowerCase() === 'textarea' ||
                document.activeElement.isContentEditable) {
                return;
            }
            triggerLikeButton();
        }
    });
    function triggerLikeButton() {
        setTimeout(() => {
            const likeSection = document.querySelector('ytd-segmented-like-dislike-button-renderer');
            if (likeSection) {
                const likeButton = likeSection.querySelector('button:first-child');
                if (likeButton) {
                    const isLiked = likeButton.getAttribute('aria-pressed') === 'true';
                    const event = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    likeButton.dispatchEvent(event);
                    ddiv(!isLiked);
                    return;
                }
            }
            const selectors = [
                'button[title*="喜歡"], button[aria-label*="喜歡"], button[aria-label*="like"]',
                'yt-button-shape button[aria-pressed]',
                '#segmented-like-button button'
            ];
            for (let selector of selectors) {
                const button = document.querySelector(selector);
                if (button) {
                    const isLiked = button.getAttribute('aria-pressed') === 'true';
                    const event = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    button.dispatchEvent(event);
                    ddiv(!isLiked);
                    return;
                }
            }
        }, 100);
    }
    function ddiv(isActive) {
        const msg = document.createElement('div');
        msg.textContent = isActive ? '已按讚' : '已取消按讚';
        Object.assign(msg.style, {
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            top: isActive ? '70%' : '30%',
            padding: '10px 20px',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            borderRadius: '8px',
            zIndex: 9999,
            fontSize: '16px',
            opacity: '0',
            transition: 'opacity 0.3s',
            pointerEvents: 'none' 
        });
        document.body.appendChild(msg);
        setTimeout(() => { msg.style.opacity = '1'; }, 10);
        setTimeout(() => {
            msg.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(msg)) {
                    document.body.removeChild(msg);
                }
            }, 300);
        }, 2500);
    }
})();