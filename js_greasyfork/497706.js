// ==UserScript==
// @name         Youtube Chat Flow
// @version      0.2
// @description  Chat Flow.
// @license      MIT
// @homepageURL  https://github.com/willy67k/tampermonkey-userscripts
// @homepage     https://github.com/willy67k/tampermonkey-userscripts
// @source       https://github.com/willy67k/tampermonkey-userscripts/raw/master/src/youtube-chat-flow.js
// @namespace    https://github.com/willy67k/tampermonkey-userscripts/raw/master/src/youtube-chat-flow.js
// @author       Lilp
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497706/Youtube%20Chat%20Flow.user.js
// @updateURL https://update.greasyfork.org/scripts/497706/Youtube%20Chat%20Flow.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // prettier-ignore
    window.killString = ["html5-video-player", "ytp-transparent", "ytp-exp-bottom-control-flexbox", "ytp-exp-ppp-update", "ytp-hide-info-bar", "ytp-large-width-mode", "ytp-fine-scrubbing-exp", "ytp-autonav-endscreen-cancelled-state", "ytp-fit-cover-video", "ytp-heat-map", "ytp-branding-shown", "ytp-progress-bar-decoration", "ytp-progress-bar-hover", "ytp-autohide", "ytp-autohide-active"];
    window.topOffset = 30;
    window.chatGap = 250;
    window.chatDuration = 5;

    window.startChatFlow = async function () {
        window.urlParams = new URLSearchParams(window.location.search).get("v");
        const liveIframe = document.querySelector(".ytd-live-chat-frame");
        const html5Player = document.querySelector(".html5-video-player");
        let html5Video = document.querySelector(".html5-video-player-chat-flow-box");
        if (!html5Video) {
            html5Player.insertAdjacentHTML("afterbegin", '<div class="html5-video-player-chat-flow-box"></div>');
            html5Video = document.querySelector(".html5-video-player-chat-flow-box");
        }
        const listRenderer = liveIframe.contentWindow.document.querySelector("yt-live-chat-renderer");
        let chats = {};
        let renderChats = {};
        let couldObserve = false;

        function appendStyle() {
            const style = `<style>
  .html5-video-player-chat-flow-box {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .chat-flow-message {
    font-size: 24px;
    font-weight: bold;
    position: absolute;
    z-index: 99;
    user-select: none;
    pointer-events: none;
    white-space: nowrap;
    -webkit-text-stroke: 1px rgba(0, 0, 0, 0.3);
    animation-name: chat-flow-animate;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: forwards;
  }

  .chat-flow-message.paused {
    animation-play-state: paused;
  }

  @keyframes chat-flow-animate {
    from {
      left: 100%;
      transform: translateX(0%);
    }
    to {
      left: 0%;
      transform: translateX(-120%);
    }
  }
  </style>`;
            document.body.insertAdjacentHTML("beforeend", style);
        }

        function observeChat(node) {
            const mutationObserver = new MutationObserver((m, o) => {
                if (couldObserve) return;
                m.forEach((el) => {
                    el.addedNodes.forEach((node) => {
                        if (node.tagName === "YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER") {
                            const message = node.querySelector("#message").textContent;
                            chats[node.id] = message;
                            generateFlowChat(message, node.id);
                        }
                    });
                });
            });
            couldObserve = false;

            mutationObserver.observe(node, { childList: true, subtree: true });
            return mutationObserver;
        }

        function observerChatFinalIn(chat, width = 250) {
            const option = {
                root: html5Video,
                rootMargin: `0px -${width}px 0px 0px`,
                threshold: 0,
            };

            const callback = (entries) => {
                if (entries[0].isIntersecting) {
                    for (const key in renderChats) {
                        if (renderChats[key] === chat.id) {
                            delete renderChats[key];
                        }
                    }
                    observer.unobserve(entries[0].target);
                }
            };
            const observer = new IntersectionObserver(callback, option);

            observer.observe(chat);
        }

        function observerChatOut(chat) {
            const option = {
                root: html5Video,
                rootMargin: "0px 0px 0px 0px",
                threshold: 0,
            };

            const callback = (entries) => {
                if (!entries[0].isIntersecting) {
                    for (const key in renderChats) {
                        if (renderChats[key] === chat.id) {
                            delete renderChats[key];
                        }
                    }
                    observer.unobserve(entries[0].target);
                    entries[0].target.remove();
                }
            };
            const observer = new IntersectionObserver(callback, option);
            observer.observe(chat);
        }

        function generateFlowChat(str, id) {
            const p = document.createElement("p");
            p.className = "chat-flow-message";
            p.id = `flow-chat-${id}`;
            p.textContent = `${str}`;
            html5Video.append(p);
            p.style.animationDuration = window.chatDuration * ((html5Player.clientWidth + p.clientWidth) / html5Player.clientWidth) + "s";
            let top = 0;
            while (true) {
                if (!renderChats[top]) {
                    renderChats[top] = p.id;
                    break;
                } else {
                    top += window.topOffset;
                }
            }
            p.style.top = top + "px";

            observerChatFinalIn(p, p.clientWidth + window.chatGap);
            observerChatOut(p);
        }

        appendStyle();
        const mutationObserver = new MutationObserver((m, o) => {
            const control = [...html5Player.classList].filter((el) => !window.killString.includes(el));
            switch (true) {
                case control.includes("seeking-mode") || control.includes("buffering-mode"):
                    couldObserve = true;
                    mutationObserverChat.disconnect();
                    chats = {};
                    renderChats = {};
                    break;
                case control.includes("playing-mode"):
                    if (couldObserve) {
                        mutationObserverChat = observeChat(listRenderer);
                    }
                    document.querySelectorAll(".chat-flow-message").forEach((el) => {
                        el.classList.remove("paused");
                    });
                    break;

                case control.includes("paused-mode"):
                    if (couldObserve) {
                        mutationObserverChat = observeChat(listRenderer);
                    }
                    document.querySelectorAll(".chat-flow-message").forEach((el) => {
                        el.classList.add("paused");
                    });
                    break;

                default:
                    break;
            }
        });
        mutationObserver.observe(html5Player, { childList: true, attributes: true, attributeOldValue: true });
        let mutationObserverChat = observeChat(listRenderer);
    };

    window.urlParams = "";
    window.interval = setInterval(() => {
        if (window.urlParams === new URLSearchParams(window.location.search).get("v")) return;

        const liveIframe = document.querySelector(".ytd-live-chat-frame");
        if (!liveIframe) return;
        const listRenderer = liveIframe.contentWindow.document.querySelector("yt-live-chat-renderer");
        if (!listRenderer) return;
        window.startChatFlow();
    }, 1000);
})();
