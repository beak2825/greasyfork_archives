// ==UserScript==
// @name         Trade Chat Timer on Button
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Show a timer that shows the time left to post next message, synchronized across tabs.
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/496284/Trade%20Chat%20Timer%20on%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/496284/Trade%20Chat%20Timer%20on%20Button.meta.js
// ==/UserScript==

const STORAGE_KEY = "localStorage__Trade_Chat_Timer__Do_Not_Edit";
const timerChannel = new BroadcastChannel('tradeChatTimer');

function waitFor(selector, parent = document) {
    return new Promise(resolve => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                const el = parent.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
        });
        observer.observe(parent, { childList: true, subtree: true });
    });
}

(async () => {
    const addStyle = () => {
        if (!document.head.querySelector("#trade-chat-timer-style")) {
            const style = document.createElement('style');
            style.id = "trade-chat-timer-style";
            style.textContent = `
                #chatRoot [class*="minimized-menu-item__"][title="Trade"] {
                    position: relative;
                }
                #chatRoot [class*="minimized-menu-item__"][title="Trade"] .timer-svg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
        }
    };

    addStyle();

    const tradeChatButton = await waitFor("#chatRoot [class*='minimized-menu-item__'][title='Trade']");
    let tradeChat = tradeChatButton?.className.includes("minimized-menu-item--open__") ? await getTradeChat() : null;

    let timerSvg = tradeChatButton?.querySelector('.timer-svg');
    if (tradeChatButton && !timerSvg) {
        timerSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        timerSvg.setAttribute("viewBox", "0 0 100 100");
        timerSvg.classList.add("timer-svg");
        timerSvg.innerHTML = '<rect x="5" y="5" width="90" height="90" stroke-width="10" fill="none" />';
        tradeChatButton.appendChild(timerSvg);
    }

    const timerRect = timerSvg?.querySelector('rect');

    let nextAllowedTime = new Date(localStorage.getItem(STORAGE_KEY) || Date.now());

    const updateTimerVisual = (timeLeft) => {
        const roundedTimeLeft = Math.round(timeLeft / 1000) * 1000; // Round to nearest second
        if (timerRect) {
            if (roundedTimeLeft > 0) {
                timerRect.setAttribute('stroke', 'red');
                timerRect.setAttribute('stroke-dasharray', '360');
                timerRect.setAttribute('stroke-dashoffset', 360 * (1 - roundedTimeLeft / 60000));
            } else {
                timerRect.setAttribute('stroke', 'green');
                timerRect.setAttribute('stroke-dasharray', 'none');
                timerRect.setAttribute('stroke-dashoffset', '0');
            }
        }
    };

    let timerInterval;
    const setTimer = () => {
        const now = new Date();
        const timeUntil = Math.max(nextAllowedTime - now, 0);
        updateTimerVisual(timeUntil);

        timerChannel.postMessage({ timeUntil });

        if (timeUntil === 0) {
            clearInterval(timerInterval);
        } else {
            requestAnimationFrame(setTimer);
        }
    };

    const resetTimer = () => {
        nextAllowedTime = new Date(Date.now() + 60000);
        localStorage.setItem(STORAGE_KEY, nextAllowedTime.toISOString());
        clearInterval(timerInterval);
        timerInterval = requestAnimationFrame(setTimer);

        timerChannel.postMessage({ reset: true, nextAllowedTime: nextAllowedTime.toISOString() });
    };

    timerChannel.onmessage = (event) => {
        if (event.data.timeUntil !== undefined) {
            updateTimerVisual(event.data.timeUntil);
        } else if (event.data.reset) {
            nextAllowedTime = new Date(event.data.nextAllowedTime);
            clearInterval(timerInterval);
            timerInterval = requestAnimationFrame(setTimer);
        }
    };

    async function checkForBlockMessage(chatBody) {
        const lastMessage = chatBody?.lastElementChild;
        return lastMessage && lastMessage.classList.contains("chat-box-body__block-message-wrapper___JjbKr") && lastMessage.textContent.includes("Trade chat allows one message per 60 seconds");
    }

    async function handleNewMessage(chat) {
        const chatBody = chat.querySelector("[class*='chat-box-body___']");
        return new Promise(resolve => {
            const observer = new MutationObserver(async (mutations) => {
                const mutation = mutations.find(mutation => mutation.addedNodes.length);
                if (!mutation) return;

                observer.disconnect();

                if (await checkForBlockMessage(chatBody)) {
                    resolve(false);
                } else {
                    resetTimer();
                    resolve(true);
                }
            });

            observer.observe(chatBody, { childList: true });
        });
    }

    function attachChatListeners(chat) {
        const textarea = chat.querySelector("textarea");
        if (textarea) {
            textarea.addEventListener("keyup", async e => {
                if (e.key === "Enter") {
                    await handleNewMessage(chat);
                }
            });
        }

        const sendButton = chat.querySelector("button.chat-box-footer__send-icon-wrapper___fGx9E");
        if (sendButton) {
            sendButton.addEventListener("click", async () => {
                await handleNewMessage(chat);
            });
        }
    }

    if (tradeChat) {
        attachChatListeners(tradeChat);
    }

    tradeChatButton?.addEventListener("click", async () => {
        if (!tradeChatButton.className.includes("minimized-menu-item--open__")) {
            tradeChat = await getTradeChat();
        }
        if (tradeChat) {
            attachChatListeners(tradeChat);
        }
    });

    setTimer(); // Initial timer setup
    timerInterval = requestAnimationFrame(setTimer);

    async function getTradeChat() {
        await waitFor("#chatRoot [class*='chat-box-header__']");
        return [...document.querySelectorAll("#chatRoot [class*='chat-box-header__']")].find(x => x.textContent === "Trade")?.closest("[class*='chat-box__']");
    }
})();