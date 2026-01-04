// ==UserScript==
// @name         YouTube Auto Speed + Block Shorts + Force 144p
// @namespace    https://www.youtube.com/@gamelucky29
// @version      1.2
// @description  Tự động chỉnh tốc độ phát lại YouTube thành 3x và chặn Shorts hoàn toàn (ẩn + chuyển hướng)
// @author       gamelucky
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533948/YouTube%20Auto%20Speed%20%2B%20Block%20Shorts%20%2B%20Force%20144p.user.js
// @updateURL https://update.greasyfork.org/scripts/533948/YouTube%20Auto%20Speed%20%2B%20Block%20Shorts%20%2B%20Force%20144p.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentSpeed = 3;

    const setPlaybackSpeed = () => {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = currentSpeed;
            console.log(`🎬 Playback speed set to ${currentSpeed}x`);
        } else {
            setTimeout(setPlaybackSpeed, 500);
        }
    };

    const createSpeedMenu = () => {
        if (document.getElementById('speed-controller')) return;

        const menu = document.createElement('select');
        menu.id = 'speed-controller';
        menu.style.position = 'fixed';
        menu.style.top = '20px';
        menu.style.right = '20px';
        menu.style.zIndex = 9999;
        menu.style.padding = '6px';
        menu.style.background = '#fff';
        menu.style.border = '1px solid #ccc';
        menu.style.borderRadius = '6px';
        menu.style.fontSize = '14px';
        menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';

        [1, 1.5, 2, 3, 4, 16].forEach(speed => {
            const option = document.createElement('option');
            option.value = speed;
            option.textContent = `${speed}x`;
            if (speed === currentSpeed) option.selected = true;
            menu.appendChild(option);
        });

        menu.addEventListener('change', () => {
            currentSpeed = parseFloat(menu.value);
            setPlaybackSpeed();
        });

        document.body.appendChild(menu);
    };

    const forceQuality144p = () => {
        const clickMenuItem = (text) => {
            const items = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer, tp-yt-paper-item'));
            const target = items.find(item => item.innerText.includes(text));
            if (target) target.click();
        };

        const openSettingsAndSetQuality = () => {
            const settingsButton = document.querySelector('.ytp-settings-button');
            if (settingsButton) {
                settingsButton.click();
                setTimeout(() => {
                    clickMenuItem("Quality"); // Open quality submenu
                    setTimeout(() => {
                        clickMenuItem("144p");
                        console.log("🔧 Đã đặt chất lượng về 144p");
                    }, 500);
                }, 500);
            } else {
                setTimeout(openSettingsAndSetQuality, 500);
            }
        };

        setTimeout(openSettingsAndSetQuality, 1500);
    };

    const blockShorts = () => {
        const hideShorts = () => {
            const shorts = document.querySelectorAll('ytd-rich-section-renderer, a[href*="/shorts"], ytd-reel-shelf-renderer');
            shorts.forEach(el => el.remove());
        };

        hideShorts();
        setInterval(hideShorts, 2000);
    };

    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(() => {
                createSpeedMenu();
                setPlaybackSpeed();
                forceQuality144p();
                blockShorts();
            }, 1000);
        }
    });

    window.addEventListener('load', () => {
        createSpeedMenu();
        setPlaybackSpeed();
        forceQuality144p();
        blockShorts();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
