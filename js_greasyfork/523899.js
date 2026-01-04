// ==UserScript==
// @name         NicoNicoBrowserInnerFullScreen
// @namespace    https://twitter.com/Tescostum/
// @version      2025050803
// @description  ニコニコ動画のブラウザ内最大化やっつけ実装
// @author       KBT
// @match        https://www.nicovideo.jp/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523899/NicoNicoBrowserInnerFullScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/523899/NicoNicoBrowserInnerFullScreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function addMaximizeButton() {
        waitForElement('button[aria-label="全画面表示する"]', (fullscreenButton) => {
            const maximizeButton = document.createElement('button');
            maximizeButton.textContent = "最大化";
            maximizeButton.style.marginLeft = '8px';
            maximizeButton.style.padding = '5px';
            maximizeButton.style.color = 'var(--colors-text-on-layer-medium-em)';
            maximizeButton.style.backgroundColor = 'var(--colors-layer-background)';
            maximizeButton.style.border = 'none';
            maximizeButton.style.borderRadius = '4px';
            maximizeButton.style.cursor = 'pointer';

            fullscreenButton.parentNode.insertBefore(maximizeButton, fullscreenButton.nextSibling);

            let isMaximized = false;
            let originalStyles = {};
            const videoPlayer = document.querySelector('div[data-styling-id="«r2»"]');
            if(!videoPlayer) {
              console.error("NicoNicoBrowserInnerFullScreen: video playerが特定できませんでした");
              return;
            }
            let minimizeButton = null;
            let playerAspectRatio = 16 / 9; // デフォルトのアスペクト比

            // プレイヤーのサイズと位置を更新する関数
            function updatePlayerSizeAndPosition() {
                if (!isMaximized || !videoPlayer) return;

                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                let newWidth, newHeight;

                if ((viewportWidth / viewportHeight) > playerAspectRatio) {
                    newHeight = viewportHeight;
                    newWidth = newHeight * playerAspectRatio;
                } else {
                    newWidth = viewportWidth;
                    newHeight = newWidth / playerAspectRatio;
                }

                videoPlayer.style.top = (viewportHeight - newHeight) / 2 + 'px';
                videoPlayer.style.left = (viewportWidth - newWidth) / 2 + 'px';
                videoPlayer.style.width = newWidth + 'px';
                videoPlayer.style.height = newHeight + 'px';
            }

            // リサイズイベントハンドラ
            function handleResize() {
                if (isMaximized) {
                    updatePlayerSizeAndPosition();
                }
            }

            // ブラウザリサイズ時にプレイヤーサイズを調整する関数
            function adjustPlayerSizeOnResize() {
                if (isMaximized && videoPlayer) {
                    // 最大化状態の時のみ、プレイヤーの幅と高さを100%に再設定
                    // これにより、ブラウザウィンドウのリサイズに追従させる
                    videoPlayer.style.width = '100%';
                    videoPlayer.style.height = '100%';
                }
            }

            function showMinimizeButton() {
                if (!videoPlayer) return;

                minimizeButton = document.createElement('button');
                minimizeButton.textContent = "元に戻す";
                minimizeButton.style.marginLeft = '8px';
                minimizeButton.style.padding = '5px';
                minimizeButton.style.color = 'var(--colors-text-on-layer-medium-em)';
                minimizeButton.style.backgroundColor = 'var(--colors-layer-background)';
                minimizeButton.style.border = 'none';
                minimizeButton.style.borderRadius = '4px';
                minimizeButton.style.cursor = 'pointer';

                fullscreenButton.parentNode.insertBefore(minimizeButton, maximizeButton.nextSibling);

                minimizeButton.addEventListener('click', () => {
                    if (isMaximized && videoPlayer) {
                        videoPlayer.style.position = originalStyles.position;
                        videoPlayer.style.top = originalStyles.top;
                        videoPlayer.style.left = originalStyles.left;
                        videoPlayer.style.width = originalStyles.width;
                        videoPlayer.style.height = originalStyles.height;
                        videoPlayer.style.backgroundColor = originalStyles.backgroundColor;
                        videoPlayer.style.zIndex = originalStyles.zIndex;
                        isMaximized = false;
                        window.removeEventListener('resize', handleResize);

                        if (minimizeButton) {
                            minimizeButton.remove();
                            minimizeButton = null;
                        }
                    }
                });
            }

            maximizeButton.addEventListener('click', () => {
                if (!videoPlayer) {
                    console.error("NicoNicoBrowserInnerFullScreen: video player not found on click.");
                    return;
                }

                if (!isMaximized) {
                    originalStyles = {
                        position: videoPlayer.style.position,
                        top: videoPlayer.style.top,
                        left: videoPlayer.style.left,
                        width: videoPlayer.style.width,
                        height: videoPlayer.style.height,
                        backgroundColor: videoPlayer.style.backgroundColor,
                        zIndex: videoPlayer.style.zIndex,
                    };

                    // プレイヤーの現在のアスペクト比を取得
                    const currentWidth = videoPlayer.offsetWidth;
                    const currentHeight = videoPlayer.offsetHeight;

                    if (currentWidth > 0 && currentHeight > 0) {
                        playerAspectRatio = currentWidth / currentHeight;
                    } else {
                        const videoElement = videoPlayer.querySelector('video');
                        if (videoElement && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                            playerAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
                        }
                        // playerAspectRatio は既にデフォルト値 16/9 で初期化済み
                    }

                    videoPlayer.style.position = 'fixed';
                    videoPlayer.style.backgroundColor = 'black';
                    videoPlayer.style.zIndex = '9999';
                    isMaximized = true;

                    updatePlayerSizeAndPosition(); // 初回サイズ設定
                    window.addEventListener('resize', handleResize); // リサイズリスナーを追加
                    showMinimizeButton();
                }
            });

        })
    }

    addMaximizeButton();
})();