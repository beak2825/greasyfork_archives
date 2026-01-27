// ==UserScript==
// @name         Objection.lol New Courtroom Enhancer
// @namespace    objection.lol
// @description  Enhances Objection.lol Courtroom functionality
// @icon         https://objection.lol/favicon.ico
// @version      0.42
// @author       Anonymous
// @license      CC0
// @match        https://objection.lol/courtroom
// @match        https://objection.lol/courtroom/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      catbox.moe
// @connect      api.fxtwitter.com
// @connect      youtube.com
// @connect      video.twimg.com
// @downloadURL https://update.greasyfork.org/scripts/543814/Objectionlol%20New%20Courtroom%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/543814/Objectionlol%20New%20Courtroom%20Enhancer.meta.js
// ==/UserScript==

(function () {
    "use strict";
    let settings = {};
    const gmRequest = (typeof GM !== 'undefined' && GM?.xmlHttpRequest) || (typeof GM_xmlhttpRequest !== 'undefined' && GM_xmlhttpRequest);

    function addStyle() {
        const style = document.createElement("style");
        style.innerHTML = `
            #enhancer-settings-popup {
                position: fixed;
                overflow: auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                align-content: center;
                max-height: 90vh;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1c1c1c;
                color: #eee;
                border: 1px solid #444;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                padding: 14px;
                z-index: 999;
                min-width: 440px;
                border-radius: 12px;
            }

            #enhancer-settings-popup h3 {
                margin: 0;
                padding: 0;
                font-size: 18px;
                color: rgb(255, 85, 32);
            }

            #enhancer-settings-popup .close-btn {
                border: none;
                background: transparent;
                color: #ccc;
                font-size: 18pt;
                cursor: pointer;
                position: absolute;
                top: 8px;
                right: 12px;
            }

            .enhancer-settings-container {
                margin-top: 16px;
                width: 100%;
            }

            .enhancer-settings-container label {
                display: grid;
                grid-template-columns: 1fr 1fr;
                margin-bottom: 4px;
                align-items: center;
            }

            .enhancer-settings-container label:nth-child(2n+1) {
                background: #252525;
            }

            .enhancer-settings-container label:nth-child(2n) {
                background: #303030;
            }

            .enhancer-settings-container label span {
                margin-right: 8px;
                text-align: right;
            }

            .enhancer-settings-container label input {
                width: 100%;
                height: fit-content;
                align-self: center;
            }

            #enhancer-settings-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-sizing: border-box;
                outline: 0;
                margin: 0 0 0 8px;
                cursor: pointer;
                user-select: none;
                vertical-align: middle;
                appearance: none;
                text-decoration: none;
                font-family: "Roboto", "Helvetica", "Arial", sans-serif;
                font-weight: 500;
                line-height: 1.75;
                letter-spacing: 0.02857em;
                text-transform: uppercase;
                min-width: 64px;
                border: 0;
                border-radius: 4px;
                color: #fff;
                background-color: rgb(161, 35, 35);
                padding: 4px 10px;
                font-size: 0.8125rem;
                box-shadow: none;
                transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1),
                    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
                    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1),
                    color 250ms cubic-bezier(0.4, 0, 0.2, 1);
            }

            #enhancer-settings-button:hover {
                background-color: rgb(116, 36, 23);
            }

            div#hoverContainer {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 999;
                pointer-events: none;
                max-width: 70vw;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            div#hoverContainer div#hoverPreviewHeader {
                position: absolute;
                right: 0;
                top: -24px;
            }

            #hoverPreviewHeader button {
                all: unset;
                width: 32px;
                height: 24px;
                display: inline-grid;
                place-items: center;
                color: #fff;
                background: #007aff;
                transition: background 120ms ease, transform 80ms ease;
            }

            #hoverPreviewHeader button:hover {
                background: rgb(125, 185, 255);
            }

            #hoverPreviewHeader button:active {
                transform: scale(0.95);
            }

            #hoverPreviewHeader button svg {
                width: 24px;
                height: 24px;
                pointer-events: none;
            }

            div#hoverContainer>img,
            div#hoverContainer>video,
            div#hoverContainer>audio,
            div#hoverContainer iframe,
            div#hoverContainer .embedMediaContainer {
                max-width: 70vw;
                max-height: 80vh;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            }

            div#hoverContainer.stickyEmbed {
                pointer-events: unset;
            }

            #hoverContainer .embedMediaContainer {
                display: flex;
                flex-direction: row;
                gap: 4px;
                max-height: 50vh;
                width: 100%;
                justify-content: center;
                align-items: stretch;
                overflow: hidden;
            }

            #hoverContainer .embedText {
                background-color: rgb(29, 29, 29);
                color: white;
                text-align: center;
                width: 100%;
                word-break: break-word;
                display:flex;
                justify-content: space-evenly;
            }

            #hoverContainer .embedMediaContainer img,
            #hoverContainer .embedMediaContainer video {
                flex: 1 1 0;
                max-height: 50vh;
                object-fit: contain;
                width: auto;
            }

            .previewLink,
            .previewStickyAnchor {
                text-decoration: none;
                color: #00aeff;
            }

            .previewLink:hover {
                text-decoration: underline;
            }

            .previewLink:hover,
            .previewStickyAnchor:hover {
                color: #4fc5fcff;
            }

            .previewLink:visited {
                color: #e717f8;
            }

            .previewStickyAnchor {
                margin-left: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    function createSettingsPopup() {
        const popup = document.createElement("div");
        popup.id = "enhancer-settings-popup";
        popup.style.display = "none";
        popup.innerHTML = `
            <button type="button" class="close-btn" title="Close"><svg xmlns="http://www.w3.org/2000/svg" style="width:1em;height:1em;" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" fill="currentColor"></path></svg></button>
            <h3>Courtroom Enhancer v${GM_info.script.version || "unknown"}</h3>
            <div class="enhancer-settings-container">
                <label title="Words to highlight, separated by commas">
                <span>Highlight Words</span>
                <input type="text" name="highlightWords" placeholder="word1, word2, word3" value="${settings.highlightWords || ""}">
                </label>
  
                <label title="Play sound on highlight">
                <span>Sound on Highlight</span>
                <input type="checkbox" name="playSoundOnHighlight" ${settings.playSoundOnHighlight ? "checked" : ""}>
                </label>

                <label title="Sound URL. Leave empty to use default">
                <span>Sound URL</span>
                <input type="text" name="notificationSoundUrl" placeholder="Sound URL"  value="${settings.notificationSoundUrl || ""}">
                </label>

                <label title="Notification Sound Volume">
                <span>Volume (${Math.round(settings.notificationSoundVolume * 100)} %)</span>
                <input type="range" name="notificationSoundVolume" min="0" max="1" step="0.01" value="${settings.notificationSoundVolume}">
                </label>

                <label title="Show images linked in chat on hover (links ending in jpg, jpeg, png, gif, webp)" style="margin-top: 8px;">
                <span>Hover images</span>
                <input type="checkbox" name="imageHoverPopup" ${settings.imageHoverPopup ? "checked" : ""}>
                </label>

                <label title="Play videos linked to chat on hover (links ending in webm, mp4)">
                <span>Hover videos</span>
                <input type="checkbox" name="videoHoverPopup" ${settings.videoHoverPopup ? "checked" : ""}>
                </label>

                <label title="Play audios linked to chat on hover (links ending in mp3, ogg, m4a, wav, flac)">
                <span>Hover audio</span>
                <input type="checkbox" name="audioHoverPopup" ${settings.audioHoverPopup ? "checked" : ""}>
                </label>

                <label title="Play YouTube videos linked in chat on hover">
                <span>Hover YouTube</span>
                <input type="checkbox" name="youtubeHoverPopup" ${settings.youtubeHoverPopup ? "checked" : ""}>
                </label>

                <label title="Preview X (formerly Twitter) links on hover">
                <span>Hover Twitter</span>
                <input type="checkbox" name="twitterHoverPopup" ${settings.twitterHoverPopup ? "checked" : ""}>
                </label>

                <label title="Don't send out your own typing notifications" style="margin-top: 8px;">
                <span>Suppress Own Typing</span>
                <input type="checkbox" name="suppressOwnTyping" ${settings.suppressOwnTyping ? "checked" : ""}>
                </label>

                <label title="Disable ADT Hotkeys. A / D: Change pose; T: Toggle Testimony">
                <span>Disable ADT Hotkeys</span>
                <input type="checkbox" name="disableHotkeys" ${settings.disableHotkeys ? "checked" : ""}>
                </label>

                <label title="Enable Enhancer Hotkeys. N: Open Settings; M: Toggle TTS">
                <span>Enhancer Hotkeys</span>
                <input type="checkbox" name="enhancerHotkeys" ${settings.enhancerHotkeys ? "checked" : ""}>
                </label>

                <label title="Maintain aspect ratio for presented evidence">
                <span>Fix Evidence Stretch</span>
                <input type="checkbox" name="fixEvidenceStretch" ${settings.fixEvidenceStretch ? "checked" : ""}>
                </label>

                <label title="Text-to-Speech for chat" style="margin-top: 8px;">
                <span>Chat TTS</span>
                <input type="checkbox" name="ttsEnabled" ${settings.ttsEnabled ? "checked" : ""}>
                </label>

                <label title="Exclude usernames from chat TTS (separated by commas)">
                <span>Exclude Usernames</span>
                <input type="text" name="ttsExcludedUsernames" placeholder="name1, name2, name3" value="${settings.ttsExcludedUsernames || ""}">
                </label>

                <label title="Chat TTS Volume">
                <span>Volume (${Math.round(settings.ttsVolume * 100)} %)</span>
                <input type="range" name="ttsVolume" min="0" max="1" step="0.01" value="${settings.ttsVolume}">
                </label>
            </div>
        `;

        popup.querySelector(".close-btn").addEventListener("click", () => {
            toggleSettingsPopup();
        });

        popup.querySelectorAll("input").forEach(input => {
            input.addEventListener("change", ev => {
                switch (ev.target.name) {
                    case "ttsEnabled":
                        const utterance = new SpeechSynthesisUtterance("TTS " + (ev.target.checked ? "on" : "off"));
                        utterance.volume = settings.ttsVolume;
                        utterance.rate = 1.5;
                        speechSynthesis.speak(utterance);
                        break;
                    case "fixEvidenceStretch":
                        const evidenceFixStretchStyle = document.getElementById("evidence-fix-stretch");
                        if (evidenceFixStretchStyle) {
                            evidenceFixStretchStyle.textContent = ev.target.checked
                                ? `img[alt="Evidence"] { object-fit: contain !important; }`
                                : "";
                        }
                        break;
                }

                if (ev.target.type === "checkbox") {
                    settings[ev.target.name] = ev.target.checked;
                } else {
                    settings[ev.target.name] = ev.target.value;
                }
                saveSettings(settings);
            });
        });

        popup.querySelectorAll("input[type=range]").forEach(input => {
            input.addEventListener("change", ev => {
                ev.target.previousElementSibling.textContent = "Volume (" + Math.round(ev.target.value * 100) + "%)";
            });
        });

        return popup;
    }

    function init() {
        settings = loadSettings();

        addStyle();

        window.addEventListener("beforeunload", ev => {
            ev.preventDefault();
            return "Are you sure you want to leave?";
        }, false);

        document.addEventListener("keydown", (ev) => {
            if (["textarea", "text", "select"].includes(ev.target.type)) return;
            if (settings.disableHotkeys && "adt".includes(ev.key)) {
                ev.preventDefault();
                ev.stopImmediatePropagation();
            }
            if (settings.enhancerHotkeys) {
                if (ev.key === "n") {
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                    toggleSettingsPopup();
                } else if (ev.key === "m") {
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                    var checkbox = document.querySelector(`#enhancer-settings-popup input[name="ttsEnabled"]`);
                    checkbox.click();
                }
            }
        });

        notificationSound.setAudio(settings.notificationSoundUrl, settings.soundVolume);

        document.head.appendChild(Object.assign(document.createElement("style"), {
            id: "evidence-fix-stretch",
            textContent: settings.fixEvidenceStretch ? `img[alt="Evidence"] { object-fit: contain !important; }` : ""
        }));


        interceptWebSocketMessages();
    }

    function onCourtroomJoined() {
        const pageContainer = document.querySelector("#root > .MuiContainer-root > .MuiGrid2-root.MuiGrid2-container");
        const leftFrame = pageContainer.querySelector(".MuiGrid2-root:nth-child(1)");
        const rightFrame = pageContainer.querySelector(".MuiGrid2-root:nth-child(2)");

        if (pageContainer._courtroomEnhancerInitialized) return;
        pageContainer._courtroomEnhancerInitialized = true;

        new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.classList.contains("MuiStack-root") && node.parentElement === leftFrame.nextElementSibling) {
                            // Horizontal layout
                            onRightFrameFound(rightFrame);
                            break;
                        }
                    }
                }
            }
        }).observe(rightFrame, { childList: true });

        pageContainer.appendChild(createSettingsPopup());
        onRightFrameFound(rightFrame);
        initUploadDropModule(document.body);
    }

    function onRightFrameFound(rightFrame) {
        if (!rightFrame || rightFrame.childNodes.length === 0) return;
        const tabMenu = rightFrame.querySelector("div[role=tablist]");

        chatObserve(rightFrame.querySelector(":scope > div.MuiStack-root > div.MuiBox-root:nth-of-type(1)"));
        const settingsTabIndex = [...tabMenu.children].indexOf([...tabMenu.querySelectorAll(":scope > button")].find(tab => tab.textContent.toLowerCase().trim() === "settings"));
        const settingsTab = rightFrame.querySelector("div[role=tabpanel]:nth-of-type(" + (settingsTabIndex + 1) + ")");
        addSettingsButton(settingsTab);
    }

    function chatObserve(frameContainer) {
        const chatList = frameContainer.querySelector("div.MuiStack-root ul");

        const urlRegex = /((https?:\/\/|www\.)[^\s<>"]+)/g;

        function linkify(text) {
            return text.replace(urlRegex, (url) => {
                const href = url.startsWith('http') ? encodeURI(url) : 'https://' + encodeURIComponent(url);
                return `<a href="${href}" target="_blank" class="previewLink" rel="noopener noreferrer">${url}</a>`;
            });
        }

        function highlightWords(chatMessage) {
            const wordlist = settings.highlightWords.split(',').map(word => RegExp.escape(word.trim())).join('|');
            const regex = new RegExp(`(?<!<[^>]*?)\\b(${wordlist})\\b(?![^<]*?>)`, 'gmi');

            if (regex.test(chatMessage)) {
                chatMessage = chatMessage.replace(regex, (word) => `<mark>${word}</mark>`);

                if (settings.playSoundOnHighlight && !document.hasFocus()) {
                    notificationSound.play();
                }
            }
            return chatMessage;
        }

        function previewEmbedMoveStart(ev) {
            const hoverContainer = document.getElementById("hoverContainer");
            if (!hoverContainer) return;

            ev.preventDefault();

            const moveBtn = ev.currentTarget;
            moveBtn.setPointerCapture(ev.pointerId);

            const containerRect = hoverContainer.getBoundingClientRect();
            const btnRect = moveBtn.getBoundingClientRect();

            hoverContainer._isMoving = true;

            hoverContainer._offsetX = ev.clientX - containerRect.left;
            hoverContainer._offsetY = ev.clientY - containerRect.top;

            hoverContainer._btnOffsetLeft = btnRect.left - containerRect.left;
            hoverContainer._btnOffsetTop = btnRect.top - containerRect.top;
            hoverContainer._btnWidth = btnRect.width;
            hoverContainer._btnHeight = btnRect.height;

            document.addEventListener("pointermove", previewEmbedMove);
            document.addEventListener("pointerup", previewEmbedMoveEnd);
        }

        function previewEmbedMove(ev) {
            const hoverContainer = document.getElementById("hoverContainer");
            if (!hoverContainer || !hoverContainer._isMoving) return;

            let left = ev.clientX - hoverContainer._offsetX;
            let top = ev.clientY - hoverContainer._offsetY;
            left = Math.max(-hoverContainer._btnOffsetLeft, Math.min(window.innerWidth - hoverContainer._btnOffsetLeft - hoverContainer._btnWidth, left));
            top = Math.max(-hoverContainer._btnOffsetTop, Math.min(window.innerHeight - hoverContainer._btnOffsetTop - hoverContainer._btnHeight, top));

            hoverContainer.style.left = left + "px";
            hoverContainer.style.top = top + "px";
            hoverContainer.style.transform = "none";
        }

        function previewEmbedMoveEnd(ev) {
            const hoverContainer = document.getElementById("hoverContainer");
            if (!hoverContainer) return;
            hoverContainer._isMoving = false;

            if (ev?.currentTarget?.hasPointerCapture?.(ev.pointerId)) {
                ev.currentTarget.releasePointerCapture(ev.pointerId);
            }

            document.removeEventListener("pointermove", previewEmbedMove);
            document.removeEventListener("pointerup", previewEmbedMoveEnd);
        }

        function previewEmbedShow(params = {}) {
            if (document.getElementById("hoverContainer")) return;

            const type = params.type;
            const url = params.url;
            const sticky = params.sticky || false;
            if (!type || !url) return;

            const hoverContainer = document.createElement("div");
            hoverContainer.id = "hoverContainer";

            var hoverPreviewHeader;
            if (sticky) {
                hoverPreviewHeader = document.createElement("div");
                hoverPreviewHeader.id = "hoverPreviewHeader";

                const moveBtn = document.createElement("button");
                moveBtn.title = "Move";
                moveBtn.style.cursor = "grab";
                moveBtn.addEventListener("pointerdown", previewEmbedMoveStart);
                moveBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                    <circle cx="9"  cy="7"  r="1.5"/>
                    <circle cx="15" cy="7"  r="1.5"/>
                    <circle cx="9"  cy="12" r="1.5"/>
                    <circle cx="15" cy="12" r="1.5"/>
                    <circle cx="9"  cy="17" r="1.5"/>
                    <circle cx="15" cy="17" r="1.5"/>
                    </svg>`;

                const closeBtn = document.createElement("button");
                closeBtn.title = "Close";
                closeBtn.style.cursor = "pointer";
                closeBtn.addEventListener("click", previewEmbedHide);
                closeBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <line x1="6" y1="6" x2="18" y2="18"/>
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    </svg>`;

                hoverPreviewHeader.appendChild(moveBtn);
                hoverPreviewHeader.appendChild(closeBtn);
                hoverContainer.appendChild(hoverPreviewHeader);
                hoverContainer.classList.add("stickyEmbed");
            }

            switch (type) {
                case "image":
                    if (!settings.imageHoverPopup) return;
                    const img = document.createElement("img");
                    img.src = url;
                    img.referrerPolicy = "no-referrer";
                    img.addEventListener("error", () => {
                        previewEmbedHide();
                    });

                    hoverContainer.appendChild(img);
                    break;
                case "video":
                    if (!settings.videoHoverPopup) return;
                    const video = document.createElement("video");
                    video.src = url;
                    video.referrerPolicy = "no-referrer";
                    video.addEventListener("error", () => {
                        previewEmbedHide();
                    });
                    video.autoplay = true;
                    video.loop = true;
                    hoverContainer.appendChild(video);
                    break;
                case "audio":
                    if (!settings.audioHoverPopup) return;
                    const audio = document.createElement("audio");
                    audio.src = url;
                    audio.referrerPolicy = "no-referrer";
                    audio.addEventListener("error", () => {
                        previewEmbedHide();
                    });
                    audio.autoplay = true;
                    audio.loop = true;
                    audio.controls = true;
                    hoverContainer.appendChild(audio);
                    break;
                case "youtube":
                    if (!settings.youtubeHoverPopup && !sticky) return;
                    hoverContainer.insertAdjacentHTML("beforeend", `<div><iframe width="480" height="270" src="https://www.youtube.com/embed/${params.videoId}?enablejsapi=1&autoplay=1&start=${params.startTime}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`);
                    break;
                case "twitter":
                    if (!settings.twitterHoverPopup && !sticky) return;
                    const sourceUrl = new URL(url);
                    const apiUrl = "https://api.fxtwitter.com" + sourceUrl.pathname;

                    if (sticky && hoverPreviewHeader)
                        hoverPreviewHeader.style.display = "none";

                    gmRequest({
                        method: "GET",
                        url: apiUrl,
                        onload: r => {
                            if (!r.responseText) return;
                            const res = JSON.parse(r.responseText);
                            if (res.code !== 200) return;

                            if (sticky && hoverPreviewHeader)
                                hoverPreviewHeader.style.display = "inline";

                            const embedWrapper = document.createElement("div");
                            embedWrapper.className = "embedWrapper";
                            embedWrapper.insertAdjacentHTML("beforeend", `<div class="embedText">${linkify(res.tweet.text)}</div>`);

                            const media = res.tweet.media;
                            if (!media) return;
                            const mediaContainer = document.createElement("div");
                            mediaContainer.className = "embedMediaContainer";

                            // photos
                            if (Array.isArray(media.photos)) {
                                for (const photo of media.photos) {
                                    const a = document.createElement("a");
                                    a.href = photo.url;
                                    a.target = "_blank";
                                    a.referrerPolicy = "no-referrer";

                                    const img = document.createElement("img");
                                    img.src = photo.url;

                                    img.addEventListener("error", () => {
                                        a.style.display = "none";
                                        embedWrapper.style.maxWidth = getComputedStyle(mediaContainer).width;
                                    });
                                    img.addEventListener("load", () => {
                                        embedWrapper.style.maxWidth = getComputedStyle(mediaContainer).width;
                                    })

                                    a.appendChild(img);
                                    mediaContainer.appendChild(a);
                                }
                            }

                            // videos
                            if (Array.isArray(media.videos)) {
                                for (const video of media.videos) {
                                    gmRequest({
                                        method: 'GET',
                                        url: video.url,
                                        responseType: 'blob',
                                        onload: (resp) => {
                                            if (resp.status !== 200) return;
                                            if (!document.documentElement.contains(embedWrapper)) return;
                                            const blob = resp.response;
                                            const video = document.createElement("video");
                                            video.src = URL.createObjectURL(blob);
                                            video.autoplay = true;
                                            video.controls = true;
                                            video.loop = true;
                                            video.poster = video.thumbnail_url;
                                            video.addEventListener("error", () => {
                                                video.style.display = "none";
                                                embedWrapper.style.maxWidth = getComputedStyle(mediaContainer).width;
                                            });
                                            video.addEventListener("loadeddata", () => {
                                                embedWrapper.style.maxWidth = getComputedStyle(mediaContainer).width;
                                            });

                                            mediaContainer.appendChild(video);
                                        }
                                    });
                                }
                            }

                            embedWrapper.appendChild(mediaContainer);

                            // footer
                            embedWrapper.insertAdjacentHTML("beforeend", `
                                <div class="embedText">
                                <span><a class="previewLink" href="https://twitter.com/${res.tweet.author.username}" target="_blank" referrerPolicy="no-referrer">${res.tweet.author.name}</a></span>
                                <span><a class="previewLink" href="https://twitter.com/${sourceUrl.pathname.split("/")[1]}" target="_blank" referrerPolicy="no-referrer">${new Date(res.tweet.created_timestamp * 1000).toLocaleString()}</a></span>
                                </div>
                                <div class="embedText">
                                <span>${res.tweet.replies} replies</span>
                                <span>${res.tweet.retweets} retweets</span>
                                <span>${res.tweet.likes} likes</span>
                                </div>`);

                            hoverContainer.appendChild(embedWrapper);
                        },
                        onerror: () => { previewEmbedHide(true); }
                    });
                    break;

            }

            const container = document.querySelector("#root > .MuiContainer-root > .MuiGrid2-root.MuiGrid2-container");
            if (container)
                container.appendChild(hoverContainer);
        }

        function previewEmbedToggle(params = {}) {
            const sticky = params.sticky || false;
            if (document.getElementById("hoverContainer")) return previewEmbedHide(sticky);
            previewEmbedShow(params);
        }

        function previewEmbedHide(forceHide = false) {
            const hoverContainer = document.getElementById("hoverContainer");
            if (!hoverContainer) return;
            if (hoverContainer.classList.contains("stickyEmbed") && !forceHide) return;

            hoverContainer.style.display = "none";
            const iframe = document.querySelector("#hoverContainer iframe");
            if (iframe) {
                // clean up for multimedia keys
                iframe.src = "about:blank";
                iframe.style.display = "none";
                hoverContainer.id = "";
                setTimeout(() => {
                    iframe.remove();
                    hoverContainer.remove();
                }, 200);
            } else {
                hoverContainer.remove();
            }

        }

        // Process all messages (useful when reloading the frame)
        for (const message of chatList.querySelectorAll("li")) {
            const content = message.querySelector(':scope > div.MuiListItemText-root > p.MuiTypography-root');
            if (!content) continue;
            processMessageContent(content);
        }

        function processMessageContent(contentElement) {
            const originalText = contentElement.textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            contentElement.innerHTML = linkify(originalText);

            setTimeout(() => {
                contentElement.querySelectorAll('a').forEach(anchor => {
                    try {
                        if (anchor.dataset.hoverpreview == "true") return;
                        const url = new URL(anchor.href);
                        if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].some(ext => url.pathname.endsWith(ext)) || url.host == "pbs.twimg.com") {
                            anchor.addEventListener("mouseover", () => previewEmbedShow({ type: "image", url: anchor.href }));
                            anchor.addEventListener("mouseout", () => previewEmbedHide());
                        } else if ([".webm", ".mp4"].some(ext => url.pathname.endsWith(ext))) {
                            anchor.addEventListener("mouseover", () => previewEmbedShow({ type: "video", url: anchor.href }));
                            anchor.addEventListener("mouseout", () => previewEmbedHide());
                        } else if ([".mp3", ".ogg", ".m4a", ".wav", ".flac"].some(ext => url.pathname.endsWith(ext))) {
                            anchor.addEventListener("mouseover", () => previewEmbedShow({ type: "audio", url: anchor.href }));
                            anchor.addEventListener("mouseout", () => previewEmbedHide());
                        } else if (["youtu.be", "www.youtube.com", "youtube.com", "m.youtube.com", "yewtu.be", "invidious.nerdvpn.de"].includes(url.hostname)) {
                            const videoUrl = new URL(url);
                            let videoId;
                            if (videoUrl.hostname == "youtu.be") {
                                videoId = videoUrl.pathname.slice(1);
                            } else {
                                const match = /^\/(?:embed|shorts|v|watch)\/([^\/]+)/.exec(videoUrl.pathname);
                                if (match) {
                                    videoId = match[1];
                                } else if (videoUrl.pathname === "/watch") {
                                    videoId = videoUrl.searchParams.get("v");
                                }
                            }
                            if (!videoId) return;

                            let startTime = videoUrl.searchParams.get("t") || 0;
                            // convert startTime to seconds if it's in 1h23m45s format
                            if (startTime && !/^\d+$/.test(startTime)) {
                                startTime = startTime.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
                                startTime = 3600 * (startTime[1] || 0) + 60 * (startTime[2] || 0) + 1 * (startTime[3] || 0);
                            }

                            gmRequest({
                                url: `https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v=')}${videoId}&format=json`,
                                method: "GET",
                                onload: r => {
                                    if (r.status != 200) return;
                                    const anchorContainer = anchor.closest("ul.MuiList-root");
                                    if (!anchorContainer) return;
                                    const isAtBottom = anchorContainer.scrollTop + anchorContainer.clientHeight >= anchorContainer.scrollHeight - 1;

                                    try {
                                        const data = JSON.parse(r.responseText);
                                        if (!data.title) return;
                                        anchor.textContent = `[YouTube] ${data.title.trim()}`;

                                        anchor.addEventListener("mouseover", () => previewEmbedShow({ type: "youtube", url: anchor.href, videoId: videoId, startTime: startTime }));
                                        anchor.addEventListener("mouseout", () => previewEmbedHide());

                                        const stickyEmbedBtn = document.createElement("a");
                                        stickyEmbedBtn.href = `javascript:;`;
                                        stickyEmbedBtn.title = "Sticky embed"
                                        stickyEmbedBtn.className = "previewStickyAnchor";
                                        stickyEmbedBtn.innerText = "[#]";
                                        stickyEmbedBtn.addEventListener("click", () => previewEmbedToggle({ type: "youtube", url: anchor.href, sticky: true }));
                                        anchor.after(stickyEmbedBtn);
                                    } catch (e) { anchor.textContent = `[YouTube] ${r.status} ${r.responseText}`; }

                                    if (isAtBottom) anchorContainer.scrollTop = anchorContainer.scrollHeight;
                                }
                            });

                        } else if (["x.com", "twitter.com", "xcancel.com", "fxtwitter.com", "fixupx.com", "nitter.net"].includes(url.hostname)) {
                            anchor.addEventListener("mouseover", () => previewEmbedShow({ type: "twitter", url: anchor.href }));
                            anchor.addEventListener("mouseout", () => previewEmbedHide());

                            const stickyEmbedBtn = document.createElement("a");
                            stickyEmbedBtn.href = `javascript:;`;
                            stickyEmbedBtn.title = "Sticky embed"
                            stickyEmbedBtn.className = "previewStickyAnchor";
                            stickyEmbedBtn.innerText = "[#]";
                            stickyEmbedBtn.addEventListener("click", () => previewEmbedToggle({ type: "twitter", url: anchor.href, sticky: true }));
                            anchor.after(stickyEmbedBtn);
                        }
                        anchor.dataset.hoverpreview = "true";
                    } catch (e) { }
                });
            }, 50);

            if (settings.highlightWords) {
                contentElement.innerHTML = highlightWords(contentElement.innerHTML);
            }
        }

        // Watch for new messages
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeName === 'LI') {
                        const content = node.querySelector(':scope > div.MuiListItemText-root > p.MuiTypography-root');
                        if (!content) continue;
                        processMessageContent(content);
                        if (settings.ttsEnabled) {
                            const username = node.querySelector(':scope > div.MuiListItemText-root > span p.MuiTypography-root');
                            if (!username) continue;
                            if (settings.ttsExcludedUsernames && settings.ttsExcludedUsernames.split(",").map(name => name.trim()).some(name => new RegExp(`\\b${name.toLowerCase()}\\b`).test(username.textContent.toLowerCase()))) continue;
                            speechSynthesis.cancel();
                            tts.speak({ id: username.textContent, text: content.textContent });
                        }
                    }
                }
            }
        });

        // Start observing the chat list
        observer.observe(chatList, { childList: true });
    }

    const popupClickHandler = (ev) => {
        const popup = document.getElementById("enhancer-settings-popup");
        if (!popup) return;

        if (!popup.contains(ev.target) && ev.target.type !== "button") {
            ev.stopPropagation();
            toggleSettingsPopup();
        }
    };

    function toggleSettingsPopup() {
        const popup = document.getElementById("enhancer-settings-popup");
        if (!popup) return;
        if (popup.style.display === "none") {
            popup.style.display = "flex";
            setTimeout(() => document.documentElement.addEventListener("click", popupClickHandler), 0);

        } else {
            popup.style.display = "none";
            document.documentElement.removeEventListener("click", popupClickHandler);
        }
    }

    function addSettingsButton(frameContainer) {
        const button = document.createElement("button");
        button.className = "courtroom-enhancer-button";
        button.id = "enhancer-settings-button";
        button.textContent = "Enhancer Settings";

        button.addEventListener("click", toggleSettingsPopup);

        frameContainer.querySelector("div.MuiStack-root > div.MuiStack-root:last-of-type").appendChild(button);
    }

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem("courtroom_enhancer_settings")) || {};
        if (settings.highlightWords === undefined) settings.highlightWords = "";
        if (settings.playSoundOnHighlight === undefined) settings.playSoundOnHighlight = true;
        if (settings.notificationSoundUrl === undefined) settings.notificationSoundUrl = "";
        if (settings.notificationSoundVolume === undefined) settings.notificationSoundVolume = 0.5;
        if (settings.imageHoverPopup === undefined) settings.imageHoverPopup = true;
        if (settings.videoHoverPopup === undefined) settings.videoHoverPopup = true;
        if (settings.audioHoverPopup === undefined) settings.audioHoverPopup = true;
        if (settings.youtubeHoverPopup === undefined) settings.youtubeHoverPopup = true;
        if (settings.twitterHoverPopup === undefined) settings.twitterHoverPopup = true;
        if (settings.ttsEnabled === undefined) settings.ttsEnabled = false;
        if (settings.ttsExcludedUsernames === undefined) settings.ttsExcludedUsernames = "";
        if (settings.ttsVolume === undefined) settings.ttsVolume = 0.5;
        if (settings.suppressOwnTyping === undefined) settings.suppressOwnTyping = false;
        if (settings.disableHotkeys === undefined) settings.disableHotkeys = true;
        if (settings.enhancerHotkeys === undefined) settings.enhancerHotkeys = true;
        if (settings.fixEvidenceStretch === undefined) settings.fixEvidenceStretch = true;
        return settings;
    }

    function saveSettings(settings) {
        notificationSound.setAudio(settings.notificationSoundUrl, settings.notificationSoundVolume);
        localStorage.setItem("courtroom_enhancer_settings", JSON.stringify(settings));
    }

    const notificationSound = {
        ctx: null,
        buffer: null,
        source: null,
        seek: 0,
        duration: 0,
        volume: 0.5,
        cooldown: 6000,
        lastPlayed: 0,
        setAudio: function (url, volume = 0.5) {
            this.volume = volume;
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            let fileUrl;
            try {
                new URL(url);
                fileUrl = url;
                this.seek = 0;
                this.duration = 0;
            } catch {
                fileUrl = "/Audio/Music/ringtone%202.ogg";
                this.seek = 1710;
                this.duration = 1240;
            }
            fetch(fileUrl)
                .then(res => res.arrayBuffer())
                .then(buf => {
                    this.ctx.decodeAudioData(buf, decoded => {
                        this.buffer = decoded;
                    });
                })
                .catch(err => {
                    console.error("Audio load error:", err);
                });
        },
        play: function () {
            if (!this.buffer) return;
            if (Date.now() - this.lastPlayed < this.cooldown) return;
            this.lastPlayed = Date.now();
            const source = this.ctx.createBufferSource();
            const gain = this.ctx.createGain();
            source.buffer = this.buffer;
            gain.gain.value = this.volume;
            source.connect(gain).connect(this.ctx.destination);
            const start = this.seek / 1000;
            source.start(0, start);
            if (this.duration) {
                source.stop(this.ctx.currentTime + this.duration / 1000);
            }
            this.source = source;
        }
    };

    const tts = {
        voices: [],
        utterances: {},
        getVoices: function () {
            if (this.voices.length > 0) return this.voices;
            this.voices = speechSynthesis.getVoices().filter(voice => voice.localService && voice.lang.startsWith("en-"));
            return this.voices;
        },
        getUtterance: function (id) {
            if (this.utterances[id]) return this.utterances[id];
            const hash = id.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return Math.abs(a & a) }, 0);
            const hashStr = String(hash);

            const utterance = new SpeechSynthesisUtterance;
            utterance.voice = this.getVoices()[hash * 2 % this.getVoices().length]; // pick a voice
            utterance.rate = 1.0 + (parseInt(hashStr.split("").reverse().join("") % 11) * 0.05); // mirror the hash and get a rate between 1.0 and 1.5
            utterance.pitch = (hash * parseInt(hashStr.slice(-1)) % 17) * 0.1; // pitch from 0 to 1.7
            this.utterances[id] = utterance;
            return utterance;
        },
        translateText: function (text) {
            var text = text
                .replace(/(https?:\/\/(www\.)?([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9]{1,8})(?:\:\d{1,5})?\b(?:\/\S*)*)/gi, "Link to $3")
                .replace("&gt;", ";")
                .replace(">", ";")
                .replace(/\[(?:Show Evidence|Play Music|Stop Music|Fade In Music|Fade Out Music|Play Sound|Stop Sounds|Flash|Shake)\]/g, "");
            return text;
        },
        speak: function (message) {
            const utterance = this.getUtterance(message.id);
            if (!utterance) return;
            utterance.volume = settings.ttsVolume;
            utterance.text = this.translateText(message.text);
            speechSynthesis.speak(utterance);
        }
    }

    function initUploadDropModule(root) {
        const UPLOAD_API = "https://catbox.moe/user/api.php";
        const inputSelector = `input.MuiInput-input[type="text"], input.MuiFilledInput-input[type="text"], input.MuiInputBase-input[type="text"], textarea.MuiInputBase-inputMultiline`;
        let inputPrevContent;
        let inputPrevSelectionStart;

        function isValidUrl(str) {
            try { new URL(str); return true; }
            catch { return false; }
        }

        function setInputValue(el, value) {
            const proto = Object.getPrototypeOf(el);
            const desc = Object.getOwnPropertyDescriptor(proto, "value");
            desc?.set?.call(el, value);

            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
        }

        function uploadFile(uploadData) {
            let reqType;
            let dataType;

            if (typeof uploadData === "object" && uploadData instanceof File) {
                reqType = "fileupload";
                dataType = "fileToUpload";
            } else if (typeof uploadData === "string") {
                reqType = "urlupload";
                dataType = "url";
            } else {
                return Promise.reject(new Error("Invalid upload data"));
            }

            return new Promise((resolve, reject) => {
                const fd = new FormData();
                fd.append("reqtype", reqType);
                fd.append(dataType, uploadData);

                gmRequest({
                    method: "POST",
                    url: UPLOAD_API,
                    data: fd,
                    onload: r => {
                        const response = r.responseText.trim();
                        if (!response || !isValidUrl(response)) return reject(new Error(response || "Invalid response"));
                        resolve(response);
                    },
                    onerror: reject
                });
            });
        }

        function onDragOver(e) {
            const input = e.currentTarget;

            if (e.shiftKey) {
                cancelDrag(input);
                return;
            }

            if (input.readOnly) return;

            const types = Array.from(e.dataTransfer.types);
            if (!types.includes("Files") && !types.includes("text/plain")) return;

            e.preventDefault();

            if (input.classList.contains("dragover")) return;

            inputPrevContent = input.value;
            inputPrevSelectionStart = input.selectionStart;

            setInputValue(input, `Drop to upload ${(types.includes("Files") ? "file" : "link")} to ${new URL(UPLOAD_API).hostname} - hold Shift to cancel`);

            input.classList.add("dragover");
            input.style.outline = "2px dashed #4caf50";
        }

        function onDragLeave(e) {
            if (e.currentTarget.contains(e.relatedTarget)) return;
            const input = e.currentTarget;
            if (!input.classList.contains("dragover")) return;
            cancelDrag(input);
        }

        async function onDrop(e) {
            const input = e.currentTarget;

            if (e.shiftKey) {
                cancelDrag(input);
                return;
            }
            if (!input.classList.contains("dragover")) return;

            e.preventDefault();
            cancelDrag(input);

            const uploadData = e.dataTransfer.getData("text/plain") || e.dataTransfer.files[0];
            if (!uploadData) return;

            setInputValue(input, "Uploading...");
            try {
                const response = await uploadFile(uploadData);
                setInputValue(
                    input,
                    inputPrevContent.slice(0, inputPrevSelectionStart) +
                    (inputPrevContent[inputPrevSelectionStart - 1]?.match(/\S/) ? " " : "") +
                    response +
                    (inputPrevContent[inputPrevSelectionStart]?.match(/\S/) ? " " : "") +
                    inputPrevContent.slice(inputPrevSelectionStart)
                );
            } catch (e) {
                console.error("Error uploading file:", e);
                setInputValue(input, inputPrevContent);
            }
        }

        function cancelDrag(input) {
            if (!input.classList.contains("dragover")) return;
            setInputValue(input, inputPrevContent);
            input.classList.remove("dragover");
            input.style.outline = "";
        }

        function attachUploadDrop(input) {
            if (!(input instanceof HTMLInputElement) && !(input instanceof HTMLTextAreaElement)) return;
            if (input.dataset.uploadDropAttached) return;
            input.dataset.uploadDropAttached = "true";

            input.addEventListener("dragover", onDragOver);
            input.addEventListener("dragleave", onDragLeave);
            input.addEventListener("drop", onDrop);
        }

        function attachAllInputs(rootNode) {
            rootNode.querySelectorAll(inputSelector).forEach(attachUploadDrop);
        }

        attachAllInputs(root);
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    attachAllInputs(node);
                }
            }
        });

        observer.observe(root, {
            childList: true,
            subtree: true
        });
    }

    function interceptWebSocketMessages() {
        const originalSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function (data) {
            if (typeof data === "string" && data.startsWith("42[")) {
                try {
                    const payload = JSON.parse(data.slice(2));
                    switch (payload[0]) {
                        case "me": {
                            onCourtroomJoined();
                            break;
                        }
                        case "typing": {
                            if (settings.suppressOwnTyping) return;
                        }
                    }
                } catch { console.warn("Failed to parse:", data); }
            }
            return originalSend.call(this, data);
        };
    }

    function interceptClickHandler(e) {
        const deleteEvidenceButton = e.target.closest("button[title='Delete Evidence']");
        if (deleteEvidenceButton) {
            const yesButton = [...deleteEvidenceButton.closest(".MuiPaper-root").querySelectorAll("button")].find(btn => btn.textContent.trim() === "Yes");
            if (yesButton) yesButton.click();
            return;
        }
    }

    document.documentElement.addEventListener("click", interceptClickHandler);

    init();
})();