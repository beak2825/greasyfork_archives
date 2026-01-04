// ==UserScript==
// @name         新闻段落转语音
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  为新闻段落添加语音播放功能，目前支持纽约时报、CNA、新加坡海峡时报
// @author       raymon
// @match        https://*.nytimes.com/*
// @match        https://*.channelnewsasia.com/*
// @match        https://*.straitstimes.com/*
// @icon         https://openmoji.org/data/color/svg/1F50A.svg
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/538401/%E6%96%B0%E9%97%BB%E6%AE%B5%E8%90%BD%E8%BD%AC%E8%AF%AD%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/538401/%E6%96%B0%E9%97%BB%E6%AE%B5%E8%90%BD%E8%BD%AC%E8%AF%AD%E9%9F%B3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function appendPlayers() {
        const style = document.createElement('style');
        style.textContent = `
            .tts-container {
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 12px 16px;
                margin: 12px 0 36px; /* 上边距 12px，下边距 36px */
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                transition: all 0.2s ease;
                max-width: 100%;
                box-sizing: border-box;
            }
            .tts-container:hover {
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .tts-button {
                cursor: pointer;
                padding: 8px 20px;
                background: #2563eb;
                color: white;
                border: none;
                border-radius: 6px;
                display: inline-flex;
                align-items: center;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.2s ease;
                min-width: 90px;
                justify-content: center;
            }
            .tts-button:hover {
                background: #1d4ed8;
                transform: translateY(-1px);
            }
            .tts-button:active {
                transform: translateY(0);
            }
            .tts-controls {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
                min-width: 0;
                flex-wrap: wrap;
            }
            .tts-rate {
                padding: 6px 10px;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                background: white;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                width: 80px;
            }
            .tts-rate:hover {
                border-color: #2563eb;
            }
            .tts-rate:focus {
                outline: none;
                border-color: #2563eb;
                box-shadow: 0 0 0 2px rgba(37,99,235,0.2);
            }
            .progress-bar {
                flex: 1;
                height: 8px;
                background: #e5e7eb;
                border-radius: 4px;
                cursor: pointer;
                position: relative;
                margin: 0 12px;
                min-width: 100px;
                z-index: 1;
                transition: all 0.2s ease;
            }
            .progress-bar:hover {
                background: #d1d5db;
            }
            .progress {
                width: 0%;
                height: 100%;
                background: #2563eb;
                border-radius: 4px;
                transition: width 0.1s linear;
                position: absolute;
                top: 0;
                left: 0;
            }
            .progress:hover {
                background: #1d4ed8;
            }
            .time-btn {
                cursor: pointer;
                padding: 6px 12px;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
                transition: all 0.2s ease;
                min-width: 50px;
                text-align: center;
            }
            .time-btn:hover {
                background: #f3f4f6;
                border-color: #d1d5db;
                transform: translateY(-1px);
            }
            .time-btn:active {
                transform: translateY(0);
            }
            .controls-wrapper {
                display: flex;
                align-items: center;
                margin-top: 0;
                width: 100%;
                gap: 12px;
                flex-wrap: wrap;
            }
            @media (max-width: 768px) {
                .controls-wrapper {
                    flex-direction: column;
                    align-items: stretch;
                }
                .tts-controls {
                    margin-left: 0;
                    margin-top: 12px;
                }
                .progress-bar {
                    margin: 8px 0;
                }
            }
        `;
        document.head.appendChild(style);

        const synth = window.speechSynthesis;
        let paragraphs = [];

        if (window.location.hostname.includes('nytimes.com')) {
            paragraphs = document.querySelectorAll('section[name="articleBody"] p');
        } else if (window.location.hostname.includes('channelnewsasia.com')) {
            paragraphs = document.querySelectorAll('section[data-title="Content"] p');
        } else if (window.location.hostname.includes('straitstimes.com')) {
            const snapshot = document.evaluate(
                '/html/body/div[5]/div[1]/main/div[1]/article/section[2]//p',
                document,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
            );
            for (let i = 0; i < snapshot.snapshotLength; i++) {
                paragraphs.push(snapshot.snapshotItem(i));
            }
        }

        function createUtterance(text) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            return utterance;
        }

        paragraphs.forEach((paragraph) => {
            const container = document.createElement('div');
            container.className = 'tts-container';

            const controlsWrapper = document.createElement('div');
            controlsWrapper.className = 'controls-wrapper';

            const button = document.createElement('button');
            button.className = 'tts-button';
            button.innerHTML = 'Play';

            const controls = document.createElement('div');
            controls.className = 'tts-controls';

            const rateLabel = document.createElement('span');
            rateLabel.textContent = 'Speed';
            rateLabel.style.fontWeight = '500';
            rateLabel.style.color = '#374151';

            const rateControl = document.createElement('select');
            rateControl.className = 'tts-rate';
            [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].forEach(rate => {
                const option = document.createElement('option');
                option.value = rate;
                option.text = `${rate}x`;
                if (rate === 1.0) option.selected = true;
                rateControl.appendChild(option);
            });

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            const progress = document.createElement('div');
            progress.className = 'progress';
            progressBar.appendChild(progress);

            const backwardBtn = document.createElement('button');
            backwardBtn.className = 'time-btn';
            backwardBtn.textContent = '-3s';

            const forwardBtn = document.createElement('button');
            forwardBtn.className = 'time-btn';
            forwardBtn.textContent = '+3s';

            controls.append(rateLabel, rateControl, backwardBtn, progressBar, forwardBtn);
            controlsWrapper.append(button, controls);
            container.appendChild(controlsWrapper);

            let utterance = createUtterance(paragraph.textContent);
            let isPlaying = false;
            let progressInterval, duration, startTime;
            let currentPosition = 0, pausedPosition = 0;

            function stopSpeaking() {
                synth.cancel();
                isPlaying = false;
                button.innerHTML = 'Play';
                clearInterval(progressInterval);
                pausedPosition = currentPosition;
            }

            function startSpeaking(startPosition = 0) {
                utterance = createUtterance(paragraph.textContent);
                utterance.rate = parseFloat(rateControl.value);

                if (startPosition > 0) {
                    const words = paragraph.textContent.split(' ');
                    const startIndex = Math.floor(words.length * (startPosition / 100));
                    utterance.text = words.slice(startIndex).join(' ');
                }

                progress.style.width = `${startPosition}%`;
                currentPosition = startPosition;
                startTime = Date.now();
                duration = (utterance.text.length / utterance.rate) * 50;

                progressInterval = setInterval(() => {
                    if (!isPlaying) return;
                    const elapsed = Date.now() - startTime;
                    currentPosition = Math.min(startPosition + (elapsed / duration) * (100 - startPosition), 100);
                    progress.style.width = `${currentPosition}%`;
                }, 50);

                synth.speak(utterance);
                isPlaying = true;
                button.innerHTML = 'Pause';
            }

            utterance.onend = () => {
                isPlaying = false;
                button.innerHTML = 'Play';
                clearInterval(progressInterval);
                progress.style.width = '100%';
                currentPosition = 100;
                pausedPosition = 0;
                setTimeout(() => {
                    if (!isPlaying) {
                        progress.style.width = '0%';
                        currentPosition = 0;
                    }
                }, 500);
            };

            button.addEventListener('click', () => {
                if (isPlaying) stopSpeaking();
                else startSpeaking(pausedPosition);
            });

            rateControl.addEventListener('change', () => {
                if (isPlaying) {
                    stopSpeaking();
                    startSpeaking(currentPosition);
                }
            });

            backwardBtn.addEventListener('click', () => {
                const timeAdj = (-3 * 1000) / duration * 100;
                stopSpeaking();
                startSpeaking(Math.max(0, currentPosition + timeAdj));
            });

            forwardBtn.addEventListener('click', () => {
                const timeAdj = (3 * 1000) / duration * 100;
                stopSpeaking();
                startSpeaking(Math.min(100, currentPosition + timeAdj));
            });

            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                stopSpeaking();
                startSpeaking(pos);
            });

            // 插入播放器到段落后面
            paragraph.parentNode.insertBefore(container, paragraph.nextSibling);
        });
    }

    // 延迟加载，确保页面内容已经渲染完毕
    setTimeout(appendPlayers, 1000);
})();
