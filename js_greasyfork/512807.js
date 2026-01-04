// ==UserScript==
// @name         Автоап тем
// @namespace    https://zelenka.guru/
// @version      1.0
// @description  Авто ап
// @author       You
// @match        https://zelenka.guru/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/512807/%D0%90%D0%B2%D1%82%D0%BE%D0%B0%D0%BF%20%D1%82%D0%B5%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/512807/%D0%90%D0%B2%D1%82%D0%BE%D0%B0%D0%BF%20%D1%82%D0%B5%D0%BC.meta.js
// ==/UserScript==

const _xfToken = document.querySelector('input[name="_xfToken"]').value;
const threads = [
    "https://zelenka.guru/threads/2078824/",
    "https://zelenka.guru/threads/5246331/",
    "https://zelenka.guru/threads/1337/",
    "https://zelenka.guru/threads/5310268/",
    "https://zelenka.guru/threads/5659653/",
    "https://zelenka.guru/threads/2901120/" // Добавьте другие ссылки на темы здесь, добавлять именно в таком формате, чтобы в конце был /
];

const time = 6; // Время в часах между поднятием тем, согласно вашим правам
const limit = 10; // Максимальное число тем, согласно вашим правам


function bumpThread(threadUrl) {
    const bumpUrl = `${threadUrl}bump?&_xfToken=${_xfToken}&_xfResponseType=json`;
    fetch(bumpUrl, { method: 'GET', credentials: 'include' })
        .then(response => {
            if (response.ok) {
                XenForo.alert('Тема поднята', '', 5000);
                const threadData = GM_getValue("threadData", {});
                threadData[threadUrl].lastBump = Date.now();
                GM_setValue("threadData", threadData);
            } else {
                console.error(`Ошибка при поднятии темы ${threadUrl}`);
            }
        });
}

function bumpThreadWithDelay(threadUrl, delay) {
    setTimeout(() => {
        bumpThread(threadUrl);
    }, delay);
}

function addThreadToList(threadUrl) {
    const threadData = GM_getValue("threadData", {});
    if (!threadData[threadUrl]) {
        if (Object.keys(threadData).length < limit) {
            const expirationDate = Date.now() + 1000 * 60 * 60 * 24 * 3;
            threadData[threadUrl] = { lastBump: 0, expires: expirationDate };
            GM_setValue("threadData", threadData);
            XenForo.alert('Тема была добавлена во временный список', '', 5000);
        } else {
            XenForo.alert('Нет свободных слотов. Максимальное число тем - ' + limit, '', 5000);
        }
    } else {
        XenForo.alert('Тема уже есть в списке.', '', 5000);
    }
}

function shouldBumpThread(threadUrl) {
    const threadData = GM_getValue("threadData", {});
    if (!threadData[threadUrl]) {
        return false;
    }
    const lastBumpTime = threadData[threadUrl].lastBump;
    if (lastBumpTime === 0) {
        return true;
    }
    const elapsedTime = (Date.now() - lastBumpTime) / 1000 / 60 / 60;
    return elapsedTime >= (time + (1 / 60));
}

function cleanupThreadData() {
    const threadData = GM_getValue("threadData", {});
    let updated = false;

    for (const threadUrl in threadData) {
        const isNotInThreads = !threads.includes(threadUrl);
        const isExpired = Date.now() > threadData[threadUrl].expires;
        const isPermanent = threadData[threadUrl].expires === 1883631170774;

        if ((isPermanent && isNotInThreads) || isExpired) {
            delete threadData[threadUrl];
            updated = true;
        }
    }

    if (updated) {
        GM_setValue("threadData", threadData);
    }
}

function getTimeLeft(threadUrl) {
    const threadData = GM_getValue("threadData", {});
    const lastBumpTime = threadData[threadUrl] ? threadData[threadUrl].lastBump : 0;
    const elapsedTime = (Date.now() - lastBumpTime) / 1000 / 60 / 60;
    const timeLeft = (time + (1 / 60)) - elapsedTime;
    return timeLeft;
}

function addButton() {
    const section = document.getElementById('pageDescription').firstElementChild;
    if (!section || !(section.getAttribute('href') == "forums/contests/")) {
        return;
    }

    const linkGroup = document.querySelector(".linkGroup.SelectionCountContainer");

    if (linkGroup) {
        const addToListButton = document.createElement("a");
        addToListButton.textContent = "Добавить в список на ап";
        addToListButton.style.cursor = "pointer";
        addToListButton.addEventListener("click", () => {
            const threadUrl = window.location.href.split("?")[0].replace(/\/+$/, "") + "/";
            addThreadToList(threadUrl);
        });

        linkGroup.appendChild(addToListButton);
    }
}

function init() {
    if (window.location.href === "https://zelenka.guru/") {
        cleanupThreadData();
        const threadData = GM_getValue("threadData", {});
        const allThreads = Array.from(new Set([...threads, ...Object.keys(threadData)]));

        let bumpCount = 0;

        for (const threadUrl of allThreads) {
            const isPermanentThread = threads.includes(threadUrl);
            if (isPermanentThread && !threadData[threadUrl]) {
                const expirationDate = 1883631170774;
                threadData[threadUrl] = { lastBump: 0, expires: expirationDate };
                GM_setValue("threadData", threadData);
            }

            if (threadData[threadUrl]) {
                const isExpired = Date.now() > threadData[threadUrl].expires;
                if (!isExpired && shouldBumpThread(threadUrl)) {
                    const delay = bumpCount * 5000;
                    bumpThreadWithDelay(threadUrl, delay);
                    bumpCount++;
                } else {
                    const timeLeft = getTimeLeft(threadUrl);
                    console.log(`Следующее поднятие через ${timeLeft.toFixed(2)} ч. - ${threadUrl}`);
                }
            }
        }
    }
}

if (window.location.href.includes("/threads/")) {
    addButton();
}
init();