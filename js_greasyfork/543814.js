// ==UserScript==
// @name         Objection.lol New Courtroom Enhancer
// @namespace    objection.lol
// @description  Enhances Objection.lol Courtroom functionality
// @icon         https://objection.lol/favicon.ico
// @version      0.27
// @author       Anonymous
// @license      CC0
// @match        https://objection.lol/courtroom/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      catbox.moe
// @downloadURL https://update.greasyfork.org/scripts/543814/Objectionlol%20New%20Courtroom%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/543814/Objectionlol%20New%20Courtroom%20Enhancer.meta.js
// ==/UserScript==

(function () {
    "use strict";
    let settings = {};

    function addStyle() {
        const style = document.createElement("style");
        style.innerHTML = `
            #root>.MuiContainer-root>.MuiGrid2-root.MuiGrid2-container>.MuiGrid2-root:nth-child(2)>div.MuiStack-root>div.MuiBox-root:nth-of-type(1)>div.MuiStack-root ul>li a {
                color: #00aeff;
            }

            #root>.MuiContainer-root>.MuiGrid2-root.MuiGrid2-container>.MuiGrid2-root:nth-child(2)>div.MuiStack-root>div.MuiBox-root:nth-of-type(1)>div.MuiStack-root ul>li a:hover {
                color: #4fc5fcff;
            }

            #root>.MuiContainer-root>.MuiGrid2-root.MuiGrid2-container>.MuiGrid2-root:nth-child(2)>div.MuiStack-root>div.MuiBox-root:nth-of-type(1)>div.MuiStack-root ul>li a:visited {
                color: #910f9c;
            }

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
            }

            div#hoverContainer>img,
            div#hoverContainer>video,
            div#hoverContainer>audio,
            div#hoverContainer iframe {
                max-width: 94vw;
                max-height: 92vh;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                display: block;
            }

            .sticky-embed {
                text-decoration: none;
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

                <label title="Disable ADT Hotkeys. A / D: Change pose; T: Toggle Testimony" style="margin-top: 8px;">
                <span>Disable ADT Hotkeys</span>
                <input type="checkbox" name="disableHotkeys" ${settings.disableHotkeys ? "checked" : ""}>
                </label>

                <label title="Enable Enhancer Hotkeys. N: Open Settings; M: Toggle TTS">
                <span>Enhancer Hotkeys</span>
                <input type="checkbox" name="enhancerHotkeys" ${settings.enhancerHotkeys ? "checked" : ""}>
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
                        speechSynthesis.speak(new SpeechSynthesisUtterance("TTS " + (ev.target.checked ? "on" : "off")));
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
                    var checkbox = document.querySelector("#enhancer-settings-popup input[name=ttsEnabled]");
                    checkbox.click();
                }
            }

        });

        notificationSound.setAudio(settings.notificationSoundUrl, settings.soundVolume);

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.removedNodes.length > 0) {
                    for (const node of mutation.removedNodes) {
                        if (node.classList.contains("MuiDialog-root")) {
                            if (node.textContent.includes("Join Courtroom")) {
                                onCourtroomJoined();
                                observer.disconnect();
                                break;
                            }
                        }
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function onCourtroomJoined() {
        const pageContainer = document.querySelector("#root > .MuiContainer-root > .MuiGrid2-root.MuiGrid2-container");
        const leftFrame = pageContainer.querySelector(".MuiGrid2-root:nth-child(1)");
        const rightFrame = pageContainer.querySelector(".MuiGrid2-root:nth-child(2)");

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

        chatObserve(rightFrame.querySelector(":scope > div.MuiStack-root > div.MuiBox-root:nth-of-type(1)"));
        addSettingsButton(rightFrame.querySelector(":scope > div.MuiStack-root > div.MuiBox-root:nth-of-type(4)"));
    }

    function chatObserve(frameContainer) {
        const chatList = frameContainer.querySelector("div.MuiStack-root ul");

        const urlRegex = /((https?:\/\/|www\.)[^\s<>"]+)/g;

        function linkify(text) {
            return text.replace(urlRegex, (url) => {
                const href = url.startsWith('http') ? encodeURI(url) : 'https://' + encodeURIComponent(url);
                return `<a href="${href}" target="_blank" style="text-decoration: none;" rel="noopener noreferrer">${url}</a>`;
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

        function previewEmbedShow(params = {}) {
            if (document.getElementById("hoverContainer")) return;

            const type = params.type || "image";
            const url = params.url || this.href;
            const sticky = params.sticky || false;

            const hoverContainer = document.createElement("div");
            hoverContainer.id = "hoverContainer";

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
                    const videoUrl = new URL(url);
                    var videoId;
                    if (videoUrl.hostname == "youtu.be") {
                        videoId = videoUrl.pathname.slice(1);
                    } else {
                        if (videoUrl.pathname.startsWith("/shorts/")) {
                            videoId = videoUrl.pathname.slice(8);
                        } else {
                            videoId = videoUrl.searchParams.get("v");
                        }
                    }
                    var startTime = videoUrl.searchParams.get("t") || 0;
                    // convert startTime to seconds if it's in 1h23m45s format
                    if (startTime && !/^\d+$/.test(startTime)) {
                        startTime = startTime.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
                        startTime = 3600 * (startTime[1] || 0) + 60 * (startTime[2] || 0) + 1 * (startTime[3] || 0);
                    }

                    hoverContainer.insertAdjacentHTML("beforeend", `<div><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&start=${startTime}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`);
                    break;
            }

            if (sticky) {
                hoverContainer.insertAdjacentHTML("afterbegin", `<button style="float:right;cursor:pointer" id="hoverPreviewCloseBtn" title="Close"><svg xmlns="http://www.w3.org/2000/svg" style="width:1em;height:1em" viewBox="0 0 384 512">
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" fill="currentColor"></path>
                    </svg></button>`);
                hoverContainer.querySelector("#hoverPreviewCloseBtn").addEventListener("click", previewEmbedHide);
            }

            const container = document.querySelector("#root > .MuiContainer-root > .MuiGrid2-root.MuiGrid2-container");
            if (container)
                container.appendChild(hoverContainer);
        }

        function previewEmbedToggle(params = {}) {
            if (document.getElementById("hoverContainer")) return previewEmbedHide();
            previewEmbedShow(params);
        }

        function previewEmbedHide() {
            const hoverContainer = document.getElementById("hoverContainer");
            if (!hoverContainer) return;
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
            const content = message.querySelector('div:nth-child(2) > p:nth-child(2)');
            if (!content) continue;
            processMessageContent(message.querySelector('div:nth-child(2) > p:nth-child(2)'));
        }

        function processMessageContent(contentElement) {
            const originalText = contentElement.textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            contentElement.innerHTML = linkify(originalText);

            setTimeout(() => {
                contentElement.querySelectorAll('a').forEach(anchor => {
                    try {
                        if (anchor.dataset.hoverpreview == "true") return;
                        const url = new URL(anchor.href);
                        if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].some(ext => url.pathname.endsWith(ext))) {
                            anchor.addEventListener("mouseover", previewEmbedShow.bind(anchor, { type: "image" }));
                            anchor.addEventListener("mouseout", previewEmbedHide);
                        } else if ([".webm", ".mp4"].some(ext => url.pathname.endsWith(ext))) {
                            anchor.addEventListener("mouseover", previewEmbedShow.bind(anchor, { type: "video" }));
                            anchor.addEventListener("mouseout", previewEmbedHide);
                        } else if ([".mp3", ".ogg", ".m4a", ".wav", ".flac"].some(ext => url.pathname.endsWith(ext))) {
                            anchor.addEventListener("mouseover", previewEmbedShow.bind(anchor, { type: "audio" }));
                            anchor.addEventListener("mouseout", previewEmbedHide);
                        } else if (["youtu.be", "www.youtube.com", "youtube.com"].includes(url.hostname)) {
                            anchor.addEventListener("mouseover", previewEmbedShow.bind(anchor, { type: "youtube" }));
                            anchor.addEventListener("mouseout", previewEmbedHide);

                            const stickyEmbedBtn = document.createElement("a");
                            stickyEmbedBtn.href = `javascript:;`;
                            stickyEmbedBtn.title = "Sticky embed"
                            stickyEmbedBtn.className = "sticky-embed";
                            stickyEmbedBtn.innerText = "[#]";
                            stickyEmbedBtn.addEventListener("click", previewEmbedToggle.bind(stickyEmbedBtn, { type: "youtube", url: anchor.href, sticky: true }));
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
                        const content = node.querySelector('div:nth-child(2) > p:nth-child(2)');
                        if (!content) continue;
                        processMessageContent(content);
                        if (settings.ttsEnabled) {
                            const username = node.querySelector('div:nth-child(2) > span > div > p:nth-child(1)') ?? node.querySelector('div:nth-child(2) p');
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
        if (settings.ttsEnabled === undefined) settings.ttsEnabled = false;
        if (settings.ttsExcludedUsernames === undefined) settings.ttsExcludedUsernames = "";
        if (settings.ttsVolume === undefined) settings.ttsVolume = 0.5;
        if (settings.disableHotkeys === undefined) settings.disableHotkeys = true;
        if (settings.enhancerHotkeys === undefined) settings.enhancerHotkeys = true;
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

        function uploadFileData(file) {
            return new Promise((resolve, reject) => {
                const fd = new FormData();
                fd.append("reqtype", "fileupload");
                fd.append("fileToUpload", file);

                GM_xmlhttpRequest({
                    method: "POST",
                    url: UPLOAD_API,
                    data: fd,
                    onload: r => resolve(r.responseText.trim()),
                    onerror: reject
                });
            });
        }

        function uploadRemoteUrl(url) {
            return new Promise((resolve, reject) => {
                const fd = new FormData();
                fd.append("reqtype", "urlupload");
                fd.append("url", url);

                GM_xmlhttpRequest({
                    method: "POST",
                    url: UPLOAD_API,
                    data: fd,
                    onload: r => resolve(r.responseText.trim()),
                    onerror: reject
                });
            });
        }

        function attachUploadDrop(input) {
            if (!(input instanceof HTMLInputElement)) return;
            if (input.dataset.uploadDropAttached) return;
            input.dataset.uploadDropAttached = "true";

            input.addEventListener("dragover", e => {
                e.preventDefault();
                input.style.outline = "2px dashed #4caf50";
            });

            input.addEventListener("dragleave", () => {
                input.style.outline = "";
            });

            input.addEventListener("drop", async e => {
                e.preventDefault();
                input.style.outline = "";

                try {
                    const dt = e.dataTransfer;
                    const text = dt.getData("text/plain");

                    if (text && isValidUrl(text)) {
                        setInputValue(input, "Uploading...");
                        setInputValue(input, await uploadRemoteUrl(text));
                        return;
                    }

                    if (dt.files?.length) {
                        setInputValue(input, "Uploading...");
                        setInputValue(input, await uploadFileData(dt.files[0]));
                    }
                } catch (err) {
                    console.error("Upload failed:", err);
                    setInputValue(input, "");
                }
            });
        }

        function attachAllInputs(rootNode) {
            rootNode.querySelectorAll("input").forEach(attachUploadDrop);
        }

        attachAllInputs(root);
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.tagName === "INPUT") attachUploadDrop(node);
                    else attachAllInputs(node);
                }
            }
        });

        observer.observe(root, {
            childList: true,
            subtree: true
        });
    }


    init();
})();