// ==UserScript==
// @name         Civitai Ultra Fast Auto Clicker
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  스크롤 최적화된 Civitai 자동 클릭 스크립트 (10초 이내 완료)
// @author       Your Name
// @match        https://civitai.com/images
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513032/Civitai%20Ultra%20Fast%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/513032/Civitai%20Ultra%20Fast%20Auto%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cachedButtons = new Set();
    let isProcessing = false;

    const createButton = () => {
        const button = document.createElement('button');
        button.innerText = '터보 클릭';
        button.style.cssText = `
            padding: 5px 10px;
            background-color: #ff0000;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        `;
        return button;
    };

    const rapidClickAllButtons = async () => {
        const currentButtons = Array.from(document.querySelectorAll('button'));
        let clickCount = 0;

        for (let i = 0; i < currentButtons.length; i += 15) {
            for (let j = 0; j < 15; j++) {
                const button = currentButtons[i + j];
                if (button && button.closest('div.absolute.inset-x-1.bottom-1.flex.items-center.justify-between.gap-1')
                    && !cachedButtons.has(button)) {
                    try {
                        button.click();
                        cachedButtons.add(button);
                        clickCount++;
                    } catch (error) {
                        console.error('Button click error:', error);
                    }
                }
            }
            await new Promise(resolve => setTimeout(resolve, 4)); // 각 열다섯 번의 버튼 클릭 후 대기 시간 0.004초
        }

        return clickCount;
    };

    const performScroll = async () => {
        const scrollElement = document.documentElement || document.body;
        const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
        );

        if (currentPosition >= scrollHeight - window.innerHeight) {
            return false; // 페이지 끝에 도달
        }

        window.scrollTo({
            top: currentPosition + (window.innerHeight / 1.5),
            behavior: 'smooth'
        });

        await new Promise(resolve => setTimeout(resolve, 100)); // 스크롤 후 대기 시간

        return true;
    };

    const turboScrollAndClick = async () => {
        const totalDuration = 9000;
        const startTime = Date.now();
        let totalClicks = 0;

        const processFrame = async () => {
            if (Date.now() - startTime < totalDuration) {
                const clicks = await rapidClickAllButtons();
                totalClicks += clicks;

                if (clicks > 0) {
                    console.log(`현재까지 클릭한 버튼 수: ${totalClicks}`);
                }

                if (!await performScroll()) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                requestAnimationFrame(processFrame);
            } else {
                console.log(`총 실행 시간: ${Date.now() - startTime}ms`);
                console.log(`총 클릭한 버튼 수: ${totalClicks}`);
                cleanup();
                location.reload();
            }
        };

        requestAnimationFrame(processFrame);
    };

    const cleanup = () => {
        cachedButtons.clear();

        // 캐시 삭제 코드 추가
        if ('caches' in window) {
            caches.keys().then(names => {
                for (let name of names) caches.delete(name);
            });
        }

        if (window.gc) window.gc();
    };

    window.addEventListener('load', function() {
        const panel = document.querySelector('#main > div > div > footer > div.relative.flex.h-\\[var\\(--footer-height\\)\\].w-full.items-center.gap-2.overflow-x-auto.bg-gray-0.p-1.px-2.\\@sm\\:gap-3.dark\\:bg-dark-7.border-t.border-gray-3.dark\\:border-dark-4 > div.mantine-Group-root.mantine-1msv4yg');

        if (!panel) return;

        const newButton = createButton();

        newButton.addEventListener('click', async function() {
            if (isProcessing) return;
            isProcessing = true;

            try {
                await turboScrollAndClick();
            } catch (error) {
                console.error('Error:', error);
                cleanup();
            } finally {
                isProcessing = false;
            }
        });

        panel.style.display = 'flex';
        panel.style.justifyContent = 'center';
        panel.appendChild(newButton);
    });
})();