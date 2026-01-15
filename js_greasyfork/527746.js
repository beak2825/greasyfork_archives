// ==UserScript==
// @name         Animesss Просветление
// @namespace    http://tampermonkey.net/
// @version      2.02
// @description  Помогает познать просветление
// @author       test
// @match        https://animesss.com/*
// @match        https://animesss.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527746/Animesss%20%D0%9F%D1%80%D0%BE%D1%81%D0%B2%D0%B5%D1%82%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/527746/Animesss%20%D0%9F%D1%80%D0%BE%D1%81%D0%B2%D0%B5%D1%82%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==

'use strict';

const currentDomain = window.location.origin;
let isRunning = false;
let page = 1;
let rotation = 0;
let intervalId = null;
let enlightenmentAchieved = false;
const userHash = window.dle_login_hash;

if (!userHash) {
    console.error("Не удалось получить user_hash. Скрипт не может работать.");
} else {
    createButton();
}

function createButton() {
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.top = '50px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.backgroundColor = 'green';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.cursor = 'pointer';
    button.style.backgroundImage = 'url("https://animestars.org/prosvetleniya.png")';
    button.style.backgroundSize = 'cover';
    button.style.transition = 'background-color 0.3s ease';
    document.body.appendChild(button);

    button.addEventListener('click', async () => {
        checkEnlightenment();
        if (enlightenmentAchieved) {
            return showNotification("Просветление получено!");
        } else {
            isRunning = !isRunning;
            if (isRunning) {
                startRotation(button);
                setInterval(checkEnlightenment, 30000);
                await processPages();
            } else {
                stopRotation();
            }
        }
    });

    return button;
}

function startRotation(button) {
    stopRotation();
    intervalId = setInterval(() => {
        rotation += 10;
        button.style.transform = `rotate(${rotation}deg)`;
    }, 100);
}

function stopRotation() {
    clearInterval(intervalId);
    rotation = 0;
}

async function processPages() {
    while (isRunning) {
        const pageUrl = `${currentDomain}/cards/page/${page}/`;

        try {
            const response = await fetch(pageUrl);
            if (!response.ok) break;

            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            const cards = doc.querySelectorAll(".anime-cards__item");
            const cardIds = Array.from(cards).map(card => card.getAttribute("data-id"));

            if (cardIds.length === 0) break;

            for (const cardId of cardIds) {
                if (!isRunning) return;
                await fetchAndLog(`${currentDomain}/cards/users/?id=${cardId}/`);
                await sleep(600);
                await fetchAndLog(`${currentDomain}/cards/users/trade/?id=${cardId}/`);
                await sleep(600);
                await fetchAndLog(`${currentDomain}/cards/users/need/?id=${cardId}/`);
                await sleep(600);
            }
        } catch (error) {
            console.error(`Ошибка при обработке страницы ${pageUrl}:`, error);
            break;
        }
        page++;
        await sleep(500);
    }
    stopScript();
}

async function fetchAndLog(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка при запросе ${url}: ${response.status}`);
    } catch (error) {
        console.error(error);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkEnlightenment() {
    const profileLinkElement = document.querySelector('a[href*="/user/"]');
    const profileLink = profileLinkElement ? profileLinkElement.href : null;

    if (!profileLink) {
        console.error("Не удалось найти ссылку на профиль.");
        return;
    }

    try {
        const response = await fetch(profileLink);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const questItems = doc.querySelectorAll(".shop__get-coins li");
        let enlightenmentDetected = false;

        questItems.forEach(item => {
            if (item.textContent.includes("Познать просветление") && item.classList.contains("reward-activated")) {
                enlightenmentDetected = true;
            }
        });

        if (enlightenmentDetected) {
            console.log("Просветление достигнуто! Останавливаем скрипт...");
            stopScript();
            isRunning = false;
        } else {
            console.log("Просветление НЕ достигнуто.");
        }
    } catch (error) {
        console.error("Ошибка при проверке просветления:", error);
    }
}

function stopScript() {
    isRunning = false;
    stopRotation();
    showNotification("Просветление получено!");
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.innerText = message;
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.padding = "15px";
    notification.style.background = "rgba(0, 0, 0, 0.8)";
    notification.style.color = "white";
    notification.style.borderRadius = "8px";
    notification.style.fontSize = "16px";
    notification.style.zIndex = "9999";
    notification.style.boxShadow = "0px 0px 10px rgba(255, 255, 255, 0.5)";
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}
