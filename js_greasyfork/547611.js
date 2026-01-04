// ==UserScript==
// @name         [DS] Twitch Logged-In Chatters Counter
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Добавляет счетчик залогинившихся пользователей рядом с оригинальным счетчиком зрителей на Twitch.
// @author       DS2902
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547611/%5BDS%5D%20Twitch%20Logged-In%20Chatters%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/547611/%5BDS%5D%20Twitch%20Logged-In%20Chatters%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CLIENT_ID = "a2QxdW5iNGIzcTR0NThmd2xwY2J6Y2JubTc2YThmcA==";
    const GQL_ENDPOINT = "https://gql.twitch.tv/gql";
    const UPDATE_INTERVAL = 30000; // Интервал обновления в миллисекундах (30 секунд)
    const MAX_FAILED_ATTEMPTS = 5;

    let isUpdating = false;
    let isTabActive = true;
    let failedAttempts = 0;
    let observer;

    // Отслеживание состояния вкладки
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            isTabActive = false;
        } else {
            isTabActive = true;
            forceUpdateCounter();
        }
    });

    async function gqlRequest(query, variables) {
        try {
            const response = await fetch(GQL_ENDPOINT, {
                method: "POST",
                headers: {
                    "Client-ID": atob(CLIENT_ID),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query, variables }),
            });

            if (!response.ok) {
                throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Ошибка при выполнении GraphQL-запроса:", error);
            return null;
        }
    }

    async function getChattersCount(channelName) {
        const query = `
            query GetChannelChattersCount($name: String!) {
                channel(name: $name) {
                    chatters {
                        count
                    }
                }
            }
        `;

        const variables = { name: channelName };
        const data = await gqlRequest(query, variables);

        return data?.data?.channel?.chatters?.count || 0;
    }

    function createChattersCounterComponent(parentElement) {
        const wrapper = document.createElement("span");
        wrapper.className = "enhancer-chat-counter-wrapper";

        const counter = document.createElement("span");
        counter.className = "logged-in-chatters-count";
        counter.style.cursor = "pointer";
        counter.style.marginLeft = "4px";
        counter.style.color = "#ff8280";
        counter.style.fontWeight = "600";

        counter.addEventListener("click", () => {
            updateCounterManually(counter);
        });

        wrapper.appendChild(counter);
        parentElement.appendChild(wrapper);

        return counter;
    }

    function animateCounter(element, startValue, endValue) {
        const duration = 2000;
        const steps = Math.ceil(duration / 16);
        const increment = (endValue - startValue) / steps;
        let currentStep = 0;

        function update() {
            if (currentStep < steps) {
                const currentValue = Math.round(startValue + increment * currentStep);
                element.textContent = `(${currentValue})`;
                currentStep++;
                requestAnimationFrame(update);
            } else {
                element.textContent = `(${endValue})`;
            }
        }

        update();
    }

    async function updateCounter(originalCounter) {
        if (!isTabActive || isUpdating) return; // Не обновляем, если вкладка неактивна или идёт обновление
        isUpdating = true;

        try {
            const channelName = window.location.pathname.split("/")[1];
            if (!channelName) return;

            const count = await getChattersCount(channelName);
            const counterElement = originalCounter.querySelector(".logged-in-chatters-count");

            if (counterElement) {
                const currentCount = parseInt(counterElement.textContent.trim().slice(1, -1));
                animateCounter(counterElement, currentCount, count);
            } else {
                const counterElement = createChattersCounterComponent(originalCounter);
                counterElement.textContent = `(${count})`;
            }

            failedAttempts = 0;
        } catch (error) {
            console.error("Ошибка при обновлении счетчика:", error);
            failedAttempts++;

            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                console.log("Скрипт остановлен из-за отсутствия оригинального счетчика.");
                stopScript();
            }
        } finally {
            isUpdating = false;
        }
    }

    async function updateCounterManually(counterElement) {
        if (!counterElement) return;

        counterElement.style.color = "rgba(255, 255, 255, 0.8)";
        await updateCounter(counterElement.parentElement);
        setTimeout(() => {
            counterElement.style.color = "";
        }, 200);
    }

    async function forceUpdateCounter() {
        const selectors = [
            'strong[data-a-target="animated-channel-viewers-count"]',
            'div[data-a-target="channel-viewers-count"]',
            'p[data-test-selector="stream-info-card-component__description"]'
        ];

        for (const selector of selectors) {
            const originalCounter = document.querySelector(selector);
            if (originalCounter) {
                await updateCounter(originalCounter);
            }
        }
    }

    function stopScript() {
        if (observer) {
            observer.disconnect();
        }
        clearInterval(intervalId);
    }

    async function main() {
        observer = new MutationObserver(async () => {
            const selectors = [
                'strong[data-a-target="animated-channel-viewers-count"]',
                'div[data-a-target="channel-viewers-count"]',
                'p[data-test-selector="stream-info-card-component__description"]'
            ];

            for (const selector of selectors) {
                const originalCounter = document.querySelector(selector);
                if (originalCounter && !originalCounter.querySelector(".enhancer-chat-counter-wrapper")) {
                    await updateCounter(originalCounter);
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Автоматическое обновление каждые 30 секунд
        const intervalId = setInterval(async () => {
            const selectors = [
                'strong[data-a-target="animated-channel-viewers-count"]',
                'div[data-a-target="channel-viewers-count"]',
                'p[data-test-selector="stream-info-card-component__description"]'
            ];

            for (const selector of selectors) {
                const originalCounter = document.querySelector(selector);
                if (originalCounter) {
                    await updateCounter(originalCounter);
                }
            }
        }, UPDATE_INTERVAL);
    }

    main();
})();