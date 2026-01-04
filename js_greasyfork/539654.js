// ==UserScript==
// @name         Kick Chat Overlay
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  chat overlay on Kick.
// @author       korip1
// @license MIT
// @match        https://kick.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/539654/Kick%20Chat%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/539654/Kick%20Chat%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .chat-overlay-item {
            position: absolute;
            white-space: nowrap;
            font-weight: bold;
            color: white;
            text-shadow: 2px 2px 3px black;
            z-index: 9999;
            pointer-events: none;
            will-change: transform;
        }
        .chat-overlay-item img {
            height: 1.3em; /* 글자 크기에 맞춰 이모티콘 높이 조절 */
            vertical-align: middle; /* 텍스트와 수직 중앙 정렬 */
            margin: 0 0.1em; /* 이모티콘 좌우에 약간의 여백 추가 */
        }
    `);

    let fontSize = GM_getValue('fontSize', 24);
    let scrollDuration = GM_getValue('scrollDuration', 15);
    let maxChats = GM_getValue('maxChats', 20);
    let chatAreaHeight = GM_getValue('chatAreaHeight', 80);

    GM_registerMenuCommand('자막 크기 설정', () => {
        const newSize = prompt('자막의 글씨 크기를 입력하세요 (현재: ' + fontSize + 'px)', fontSize);
        if (newSize && !isNaN(newSize)) {
            fontSize = parseInt(newSize, 10);
            GM_setValue('fontSize', fontSize);
            alert('글씨 크기가 ' + fontSize + 'px로 설정되었습니다.');
        }
    });

    GM_registerMenuCommand('자막 속도 설정 (초)', () => {
        const newDuration = prompt('자막이 지나가는 시간을 초 단위로 입력하세요 (현재: ' + scrollDuration + '초)\n(숫자가 클수록 느려집니다)', scrollDuration);
        if (newDuration && !isNaN(newDuration)) {
            scrollDuration = parseFloat(newDuration);
            GM_setValue('scrollDuration', scrollDuration);
            alert('자막 속도가 ' + scrollDuration + '초로 설정되었습니다.');
        }
    });

    GM_registerMenuCommand('최대 자막 수 설정', () => {
        const newMax = prompt('화면에 동시에 표시할 최대 자막 개수를 입력하세요 (현재: ' + maxChats + '개)\n(0으로 설정하면 무제한)', maxChats);
        if (newMax !== null && !isNaN(newMax)) {
            maxChats = parseInt(newMax, 10);
            GM_setValue('maxChats', maxChats);
            alert('최대 자막 수가 ' + (maxChats === 0 ? '무제한' : maxChats + '개') + '로 설정되었습니다.');
        }
    });

        GM_registerMenuCommand('자막 표시 영역 설정 (%)', () => {
        const newArea = prompt('자막이 표시될 상단 영역을 %로 입력하세요 (현재: ' + chatAreaHeight + '%)\n(예: 80 입력 시 하단 20%는 빈 공간으로 유지)', chatAreaHeight);
        if (newArea && !isNaN(newArea) && newArea > 0 && newArea <= 100) {
            chatAreaHeight = parseInt(newArea, 10);
            GM_setValue('chatAreaHeight', chatAreaHeight);
            alert('자막 표시 영역이 상단 ' + chatAreaHeight + '%로 설정되었습니다.');
        }
    });

    let overlayBox = null;
    let playerParent = null;

    function showChat(messageHTML) {
        if (!playerParent || !overlayBox) return;
        if (maxChats > 0 && overlayBox.childElementCount >= maxChats) {
            return;
        }

        const video = playerParent.querySelector('video');
        if (!video) return;

        const chatEl = document.createElement('div');
        chatEl.className = 'chat-overlay-item';

        chatEl.innerHTML = messageHTML;

        chatEl.style.fontSize = `${fontSize}px`;
        chatEl.style.top = `${Math.random() * chatAreaHeight}%`;
        chatEl.style.left = `${video.offsetWidth}px`;
        chatEl.style.transition = `transform ${scrollDuration}s linear`;

        overlayBox.appendChild(chatEl);

        setTimeout(() => {
            const endPosition = video.offsetWidth + chatEl.offsetWidth + 20;
            chatEl.style.transform = `translateX(-${endPosition}px)`;
        }, 10);

        setTimeout(() => {
            chatEl.remove();
        }, scrollDuration * 1000);
    }

    function init(targetNode) {
        playerParent = targetNode;
        playerParent.style.position = 'relative';

        overlayBox = document.createElement('div');
        overlayBox.id = 'custom-chat-overlay';
        Object.assign(overlayBox.style, {
            position: 'absolute', top: '0', left: '0',
            width: '100%', height: '100%',
            zIndex: '10', pointerEvents: 'none'
        });
        playerParent.appendChild(overlayBox);

        document.addEventListener('fullscreenchange', () => {
            const fsEl = document.fullscreenElement;
            if (fsEl) {
                fsEl.appendChild(overlayBox);
            } else if (playerParent) {
                playerParent.appendChild(overlayBox);
            }
        });

        const chatContainer = document.querySelector('#chatroom-messages');
        if (chatContainer) {
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType !== 1) return;
                            const msgEl = node.querySelector('span.font-normal');
                            if (msgEl) {
                                showChat(msgEl.innerHTML);
                            }
                        });
                    }
                }
            });
            observer.observe(chatContainer, { childList: true, subtree: true });
        }
    }

    const bootInterval = setInterval(() => {
        const target = document.querySelector('#injected-channel-player');
        if (target) {
            clearInterval(bootInterval);
            init(target);
        }
    }, 500);

})();