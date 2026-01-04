// ==UserScript==
// @name                YouTube Danmaku
// @name:zh-TW          YouTube 彈幕
// @name:zh-CN          YouTube 弹幕
// @name:ja             YouTube 弾幕
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAqhJREFUaEPtmc9rE0EUxz+DjSh6UAQRxP4F9uhBRKjipef+FwqtoZdYEk3U4jGn0FJ6KrQnj6X0EKVKKIi9tAotPZSCYilFoq0/sK1Z92V329XGENiZSRZ2LtllZ9+8z/e9ncy8UcS8qZj7TwLQ7ggmEUgiEFGB/6aQAxeBq8Al4GxonDPAydD9+dB1qkFfefy9iZ9fgRrwC/jh96v6vz+Bj8B7BduNbBwDcOA6UABuAyciCqTr9d/ACxf0oYI3YaOHAA71KfWpq8QDF6BTP27H9/GRArk+ctSBZ0BGl2SG7YwoyB4COF66lDtY+X/1EPVvKXhVTxUHKsANw6rpNl9RcFM50A1sxEj9QAiJQrcA9LvT5XPd8liy1y8Ad4GSpQF1D3NPAO4DRd2WLdlL6wUYH4dKBSYnLfmPZoDZWejrg/l5GByE5WXTIIYAxO1aDaamYGgIthsuY3TAGQQI3KtWoVCAUgkODnQ4HbZhASAYbnUV0mmYm9MJYREgcHtmxvs+1td1gLQBQNze24OxMchmYXc3CkibAOQDl6k2k4GtrZgBLC56KbSwEMXx4F2LEdjchHweJia8KVZPswCwvw+jo5DLwc6OHrePrBgGKJdhYABWVnQ7bjiF1ta8OV+WFmab5ghMT8PSEhSL3lRpvmkGSKVAct5eqwPEfkMT+y3lZeBDbDf1kq6xLqv4AL3AyxhFQUoqvQpeh2ujI+46cdjeBBJppL9Li34UBCYP5Do4ErKIeiLV82PF3UAPB64Bj4E7biW4K5JO+l6WvajUbqW8/jZsttkBxwWgB7gCnPZfCg4z5P6UH6lzTfyUgxGp7ctBRdBkBxNsjiWXv4Seyd93+DDkG/AJeKfgc6NxOvUcoOXYJQAtS2WoYxIBQ8K2bDaJQMtSGer4B8aT1sve/dr7AAAAAElFTkSuQmCC
// @namespace           electroknight22_youtube_danmaku_namespace
// @author              ElectroKnight22
// @version             0.2.5
// @license             MIT
// @description         Display chat messages as a danmaku overlay over the video on YouTube livestreams.
// @description:zh-TW   在 YouTube 直播中，將聊天訊息顯示為彈幕覆蓋於視頻上。
// @description:zh-CN   在 YouTube 直播中，将聊天消息显示为弹幕覆盖于视频上。
// @description:ja      YouTubeライブストリームのビデオ上にチャットメッセージを弾幕として表示します。
// @homepage            https://greasyfork.org/en/scripts/507848-youtube-danmaku/
// @match               *://www.youtube.com/*
// @exclude             *://www.youtube.com/live_chat*
// @downloadURL https://update.greasyfork.org/scripts/507848/YouTube%20Danmaku.user.js
// @updateURL https://update.greasyfork.org/scripts/507848/YouTube%20Danmaku.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function() {
    'use strict';

    const video = document.querySelector('video');
    let ytPlayer = document.getElementById("movie_player") || document.getElementsByClassName("html5-video-player")[0];
    let captionContainer = ytPlayer?.querySelector('.ytp-caption-window-container');

    let chatObserver = new MutationObserver(processNewMessages);
    let chatFrameObserver = null;
    let lastMessage = null;
    let playing = true;
    let adjust;
    const lifespan = 10;

    let danmakuQueue = [];

    // Function to create a danmaku and animate it over the video
    function createDanmaku(timestamp, textNodes) {

        ensureCaptionContainer();  // Ensure the container exists before creating a danmaku
        const containerWidth = captionContainer?.clientWidth;

        if (captionContainer && containerWidth > 0) {

            if (!playing) {
                danmakuQueue.push({ timestamp, textNodes });
                return;
            }

            const danmaku = document.createElement('div');
            const progress = video.currentTime - timeStringToSeconds(timestamp);
            const movedPercentage = ytPlayer.getVideoData().isLive ? 0 : (progress * (100/lifespan) * 0.01);
            const tweakedPercentage = movedPercentage - 0.1;
            const offset = containerWidth * tweakedPercentage *  ( 1 + Math.random() * 0.15);

            danmaku.style.position = 'absolute';
            danmaku.style.display = 'flex';
            danmaku.style.alignItems = 'center';
            danmaku.style.whiteSpace = 'nowrap';
            danmaku.style.fontSize = '18px';
            danmaku.style.fontWeight = 'bold';
            danmaku.style.color = 'white';
            danmaku.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
            danmaku.style.top = `${Math.random() * 80}%`;
            danmaku.style.left = `100%`;
            danmaku.style.zIndex = '39';
            danmaku.style.transform = `translateX(-${offset}px)`;

            textNodes.forEach(node => {
                if (typeof node === 'string') {
                    const textNode = document.createTextNode(node);
                    danmaku.appendChild(textNode);
                } else if (node instanceof HTMLImageElement) {
                    node.style.margin = '-1px 2px 1px';
                    danmaku.appendChild(node);
                } else if (node instanceof HTMLElement) {
                    danmaku.appendChild(node);
                }
            });

            captionContainer.appendChild(danmaku);

            const distanceLeft = containerWidth + danmaku.offsetWidth - offset;
            const remainingTime = lifespan * (distanceLeft / containerWidth);

            if (distanceLeft <= 0) {
                danmaku.remove();
                return;
            }

            danmaku.style.transition = `transform ${remainingTime}s linear`;
            requestAnimationFrame(() => {
                danmaku.style.transform = `translateX(-${distanceLeft + Math.max(offset, 0)}px)`;
            });

            danmaku.addEventListener('transitionend', () => {
                danmaku.remove();
            });
        } else {
            console.error("Danmaku error: Container invalid.");
        }
    }

    // Update danmaku speed and position
    function updateDanmakuState() {
        ensureCaptionContainer();
        const danmakus = captionContainer.querySelectorAll('div');
        const containerWidth = captionContainer.clientWidth;

        danmakus.forEach(danmaku => {
            const computedStyle = window.getComputedStyle(danmaku);
            const transform = computedStyle.transform;

            const matrixValues = transform.match(/matrix\((.*)\)/);
            if (matrixValues) {
                const matrix = matrixValues[1].split(', ');
                const translateX = parseFloat(matrix[4]);
                const danmakuWidth = danmaku.offsetWidth;
                const distanceLeft = containerWidth + danmakuWidth + translateX;

                if (distanceLeft <= 0) {
                    danmaku.remove();
                    return;
                }

                if (playing) {
                    const remainingTime = lifespan * (distanceLeft / containerWidth);
                    danmaku.style.transition = `transform ${remainingTime}s linear`;
                    requestAnimationFrame(() => {
                        danmaku.style.transform = `translateX(-${danmakuWidth + containerWidth}px)`;
                    });
                } else {
                    danmaku.style.transform = `translateX(${translateX}px)`;
                    danmaku.dataset.pauseTime = translateX;
                    danmaku.style.transition = 'none';
                }
            }
        });
    }

    function pauseDanmaku() {
        playing = false;
        updateDanmakuState();
    }

    function resumeDanmaku() {
        playing = true;
        updateDanmakuState();
        while (danmakuQueue.length > 0) {
            const { timestamp, textNodes } = danmakuQueue.shift();
            createDanmaku(timestamp, textNodes);
        }
    }

    function processChatNode(chatNode) {
        if (chatNode.nodeType === 1 && chatNode.tagName === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER') {
            const timestamp = chatNode.querySelector('#timestamp')?.innerText;
            const author = chatNode.querySelector('#author-name')?.innerText;
            const badgeNodes = chatNode.querySelector('#chat-badges').childNodes;
            const messageNodes = chatNode.querySelector('#message')?.childNodes;
            const contentNodes = [];

            let hasMembership = false;

            badgeNodes.forEach((node) => {
                hasMembership = node.type === 'member';
                const badge = node.querySelector('#image').children[0];
                if (badge.nodeType === 1 && badge.tagName === 'IMG') {
                    const img = document.createElement('img');
                    img.src = badge.src;
                    img.alt = 'badge';
                    img.style.height = '20px';
                    contentNodes.push(img);
                }
            });

            contentNodes.push(": ");

            messageNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === 'IMG') {
                    const img = document.createElement('img');
                    img.src = node.src;
                    img.alt = 'emoji';
                    img.style.height = '20px';
                    contentNodes.push(img);
                } else if (node.nodeType === 3) {
                    contentNodes.push(node.textContent);
                }
            });

            const authorSpan = document.createElement('span');
            authorSpan.textContent = author;

            if (hasMembership) {
                authorSpan.style.color = '#2ba640';
            } else {
                authorSpan.style.opacity = '0.7';
            }

            contentNodes.unshift(authorSpan);
            createDanmaku(timestamp, contentNodes);
        }
    }

    // Function to log the chat messages in real-time and display them as danmaku
    function processNewMessages(mutationsList) {
        mutationsList.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((newChatNode) => { processChatNode(newChatNode); });
            }
        });
    }

    // Function to ensure the caption container exists
    function ensureCaptionContainer() {
        captionContainer = ytPlayer?.querySelector('.ytp-caption-window-container') || ytPlayer?.querySelector('.ytp-caption-window-container-custom');
        if (!captionContainer && ytPlayer) {
            // Create a new container if not found
            captionContainer = document.createElement('div');
            captionContainer.classList.add('ytp-caption-window-container-custom');
            captionContainer.style.position = 'absolute';
            captionContainer.style.height = '100%';
            captionContainer.style.width = '100%';
            captionContainer.style.pointerEvents = 'none'; // Disable mouse interaction with the container
            ytPlayer.appendChild(captionContainer);
            console.log('Danmaku | Created new caption container');
        }
    }

    // Function to attach observer to the chat messages container
    function attachChatObserver(chatMessages) {
        if (chatObserver) {
            chatObserver.disconnect();
        }
        chatObserver.observe(chatMessages, { childList: true, subtree: true });
    }

    // Observe chat container for new messages
    function observeChatItems(init = false) {

        const chatFrame = window.chatframe;
        const contentDocument = chatFrame?.contentDocument;
        const chatMessages = contentDocument?.querySelector('#chat-messages');
        const chatItems = chatMessages?.querySelector('#items.style-scope.yt-live-chat-item-list-renderer');

        if (chatItems && chatItems.childElementCount > 0) {
            if (init && !ytPlayer.getVideoData().isLive) {
                const chatNodes = chatItems?.childNodes;
                chatNodes.forEach((chatNode) => {
                    processChatNode(chatNode);
                });
            }
            attachChatObserver(chatMessages);
        } else {
            console.warn("YTDM| Cannot find valid chat messages.");
            setTimeout(() => { observeChatItems(init); }, 500);
        }
    }

    // Function to observe the higher-level chat container to detect when it's replaced
    function observeChatFrame() {

        const chatFrame = window.chatframe;

        if (chatFrame) {
            observeChatItems();
        } else {
            console.warn("YTDM| Chat frame not found, retrying...");
            setTimeout(observeChatFrame, 500);
            return;
        }

        // Disconnect previous observer to avoid duplicate observing
        if (chatFrameObserver) {
            chatFrameObserver.disconnect();
        }

        chatFrameObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                console.log('Chat frame resize.');
                observeChatItems();
            }
        });

        // Observe changes to the chat container
        chatFrameObserver.observe(chatFrame);
    }

    async function determineContentValid(skipInitialChecks = false, attempts = 0) {
        if (attempts > 10) {
            console.log("Failed to determine content validity after 10 attempts.");
            return false; // Stop and return false after 10 attempts
        }

        if (!skipInitialChecks) {
            const isShorts = /^https?:\/\/(www\.)?youtube\.com\/shorts\//.test(window.location.href);
            if (isShorts) return false;

            const isLivestream = ytPlayer.getVideoData().isLive;
            if (isLivestream) return true;
        }

        const infoText = document.querySelector('.ytd-watch-info-text');
        if (infoText) {
            const isLiveStreamVOD = infoText?.textContent.toLowerCase().includes('streamed');
            return isLiveStreamVOD ? true : false;
        } else {
            // Wait until infoText is available by retrying
            await new Promise(resolve => setTimeout(resolve, 500));
            return determineContentValid(true, attempts + 1);  // Retry, increment attempts
        }
    }

    function update() {
        const isValidContentType = determineContentValid();
        if (!isValidContentType) return;

        const captionContainerCustom = ytPlayer?.querySelector('.ytp-caption-window-container-custom');
        if (captionContainerCustom) captionContainerCustom.remove();
        ensureCaptionContainer();
        observeChatItems(true);
    }

    function timeStringToSeconds(timestamp) {
        let isNegative = timestamp.startsWith('-');
        const parts = timestamp.replace('-', '').split(':').map(Number).reverse();
        let seconds = 0;

        seconds += parts[0] || 0;
        seconds += (parts[1] || 0) * 60;

        if (parts.length > 2) {
            seconds += (parts[2] || 0) * 3600;
        }

        if (parts.length > 3) {
            seconds += (parts[3] || 0) * 86400;
        }

        return isNegative ? -seconds : seconds;
    }

    function initializeEventListeners() {
        window.addEventListener('loadstart', update, true);
        window.addEventListener('fullscreenchange', updateDanmakuState, true);
        window.addEventListener('resize', updateDanmakuState, true);
        video.addEventListener('pause', () => {
            if (ytPlayer.getVideoData().isLive) {return}
            pauseDanmaku();
        });
        video.addEventListener('playing', () => {
            resumeDanmaku();
        });
        video.addEventListener('seeking', () => {
            if (ytPlayer.getVideoData().isLive) {return}
            if (captionContainer && captionContainer.innerText) {
                captionContainer.innerText = '';
            }
            observeChatItems(true);
        });
        observeChatFrame();
    }

    function main() {
        initializeEventListeners();
        update();
    }

    // Initialize the chat observer
    window.addEventListener('yt-navigate-finish', main, {once: true});
})();
