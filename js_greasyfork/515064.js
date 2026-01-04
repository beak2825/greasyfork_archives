// ==UserScript==
// @name         YouTube Button Hider
// @namespace    YouTube Button Hider
// @version      1.1.2
// @author       Hess
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @description  You can hide share button, Thanks button, Clip button, Download button, Save (to platlist) button and live chat on YouTube videos.
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515064/YouTube%20Button%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/515064/YouTube%20Button%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 각 버튼의 숨기기 여부 (1: 숨기기, 0: 놔두기)
    const featureToggle = {
        hideShareButton: 1, // 공유 버튼 숨기기
        hideThanksButton: 1, // Thanks 버튼 숨기기
        hideClipButton: 1, // 클립 버튼 숨기기
        hideDownloadButton: 1, // 다운로드 버튼 숨기기
        hideSaveButton: 1, // (재생목록에) 저장 버튼 숨기기
        hideChatWindow: 1 // 채팅창 숨기기
    };

    function hideButtons() {
        // 공유 버튼 숨기기
        if (featureToggle.hideShareButton) {
            const shareButton = document.querySelector(
                'div#top-level-buttons-computed yt-button-view-model button-view-model button[aria-label="공유"]'
            );
            if (shareButton) {
                shareButton.style.display = 'none';
            }
            const shareButton2 = document.querySelector(
                'div#top-level-buttons-computed yt-button-view-model button-view-model button[aria-label="Share"]'
            );
            if (shareButton2) {
                shareButton2.style.display = 'none';
            }
            const shareButton3 = document.querySelector(
                'div#top-level-buttons-computed yt-button-view-model button-view-model button[aria-label="共有"]'
            );
            if (shareButton3) {
                shareButton3.style.display = 'none';
            }
        }

        // Thanks 버튼 숨기기
        if (featureToggle.hideThanksButton) {
            const thanksButton = document.querySelector(
                'button[aria-label="Thanks"]'
            );
            if (thanksButton) {
                thanksButton.style.display = 'none';
            }
            const thanksButton2 = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer[role="menuitem"] tp-yt-paper-item[role="option"]')).find(
                item => item.querySelector('yt-formatted-string').innerText === 'Thanks'
            );
            if (thanksButton2) {
                thanksButton2.style.display = 'none';
            }
        }

        // 클립 버튼 숨기기
        if (featureToggle.hideClipButton) {
            const clipButton = document.querySelector(
                'button[aria-label="클립"]'
            );
            if (clipButton) {
                clipButton.style.display = 'none';
            }
            const clipButton2 = document.querySelector(
                'button[aria-label="Clip"]'
            );
            if (clipButton2) {
                clipButton2.style.display = 'none';
            }
            const clipButton3 = document.querySelector(
                'button[aria-label="クリップ"]'
            );
            if (clipButton3) {
                clipButton3.style.display = 'none';
            }
            const clipButton4 = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer[role="menuitem"] tp-yt-paper-item[role="option"]')).find(
                item => item.querySelector('yt-formatted-string').innerText === '클립'
            );
            if (clipButton4) {
                clipButton4.style.display = 'none';
            }
            const clipButton5 = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer[role="menuitem"] tp-yt-paper-item[role="option"]')).find(
                item => item.querySelector('yt-formatted-string').innerText === 'Clip'
            );
            if (clipButton5) {
                clipButton5.style.display = 'none';
            }
            const clipButton6 = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer[role="menuitem"] tp-yt-paper-item[role="option"]')).find(
                item => item.querySelector('yt-formatted-string').innerText === 'クリップ'
            );
            if (clipButton6) {
                clipButton6.style.display = 'none';
            }
        }

        // 오프라인 저장 버튼 숨기기
        if (featureToggle.hideDownloadButton) {
            const downloadButton = document.querySelector(
                'ytd-download-button-renderer', 'ytd-menu-service-item-download-renderer'
            );
            if (downloadButton) {
                downloadButton.style.display = 'none';
            }
            const downloadButton2 = document.querySelector(
                'ytd-menu-service-item-download-renderer'
            );
            if (downloadButton2) {
                downloadButton2.style.display = 'none';
            }
        }

        // (재생목록에) 저장 버튼 숨기기
        if (featureToggle.hideSaveButton) {
            const saveButton = document.querySelector(
                'button[aria-label="재생목록에 저장"]'
            );
            if (saveButton) {
                saveButton.style.display = 'none';
            }
            const saveButton2 = document.querySelector(
                'button[aria-label="Save to platlist"]'
            );
            if (saveButton2) {
                saveButton2.style.display = 'none';
            }
            const saveButton3 = document.querySelector(
                'button[aria-label="再生リストに保存"]'
            );
            if (saveButton3) {
                saveButton3.style.display = 'none';
            }

            const saveButton4 = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer[role="menuitem"] tp-yt-paper-item[role="option"]')).find(
                item => item.querySelector('yt-formatted-string').innerText === '저장'
            );
            if (saveButton4) {
                saveButton4.style.display = 'none';
            }
            const saveButton5 = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer[role="menuitem"] tp-yt-paper-item[role="option"]')).find(
                item => item.querySelector('yt-formatted-string').innerText === 'Save'
            );
            if (saveButton5) {
                saveButton5.style.display = 'none';
            }
            const saveButton6 = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer[role="menuitem"] tp-yt-paper-item[role="option"]')).find(
                item => item.querySelector('yt-formatted-string').innerText === '保存'
            );
            if (saveButton6) {
                saveButton6.style.display = 'none';
            }
        }

        // 채팅창 숨기기
        if (featureToggle.hideChatWindow) {
            const chatWindow = document.querySelector(
                '#chat'
            );
            if (chatWindow) {
                chatWindow.style.display = 'none';
            }
        }
    }

    // 페이지 로드 시 버튼 숨기기
    hideButtons();

    // 페이지 변경 감지 시 클립 버튼 숨기기
    const observer = new MutationObserver(hideButtons);
    observer.observe(document.body, { childList: true, subtree: true });

})();
