// ==UserScript==
// @name         ChatGPT - History Sidebar Toggle
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  History Sidebar toggle for chatGPT
// @author       LKD70
// @license      AGPL-3.0
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466881/ChatGPT%20-%20History%20Sidebar%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/466881/ChatGPT%20-%20History%20Sidebar%20Toggle.meta.js
// ==/UserScript==

let url = undefined;
// set a listener for page changes based on the URL
setInterval(() => {
    const current_url = window.location.href;
    if(current_url !== url) {
        if (url !== undefined) appendHtml();
        url = current_url;
    }
}, 100);

const sleep = ms => new Promise(res => setTimeout(res, ms));

const setState = () => {
    const sidebar = getElementByXpath('/html/body/div[1]/div[2]/div[1]');
    const state = sidebar.style.display;
    localStorage.setItem('sidebar_toggle_state', state);
    return state;
};

const getState = () => {
    let state = localStorage.getItem('sidebar_toggle_state');
    if (state === null) state = setState();
    return state;
};

const getElementByXpath = (xPath) => {
    return document
        .evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue;
};

const toggle_sidebar = () => {
    const state = getState();
    const sidebar = getElementByXpath('/html/body/div[1]/div[2]/div[1]');
    if (url === undefined) {
        sidebar.style.display = state;
    } else {
        sidebar.style.display = (sidebar.style.display === "") ? "none" : "";
    }

    setState();
};

const appendHtml = async () => {
    await sleep(500);
    const buttonHtml = `<button id="toggleSidebar" class="cursor-pointer absolute left-4 top-2 z-10"><svg style="fill: #d9d9e3" width="30px" height="30px" clip-rule="evenodd" fill="#000000" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:serif="http://www.serif.com/"><rect x="-1088" width="1280" height="800" fill="none"/><g serif:id="Icons"><path d="m49.984 56h-35.989c-3.309 0-5.995-2.686-5.995-5.995v-36.011c0-3.308 2.686-5.995 5.995-5.995h35.989c3.309 0 5.995 2.687 5.995 5.995v36.011c0 3.309-2.686 5.995-5.995 5.995zm-25.984-4.001v-39.999h-9.012c-1.65 0-2.989 1.339-2.989 2.989v34.021c0 1.65 1.339 2.989 2.989 2.989h9.012zm24.991-39.999h-20.991v39.999h20.991c1.65 0 2.989-1.339 2.989-2.989v-34.021c0-1.65-1.339-2.989-2.989-2.989z"/><path d="m19.999 38.774-6.828-6.828 6.828-6.829 2.829 2.829-4 4 4 4-2.829 2.828z"/></g></svg></button>`;
    let main = undefined;
    let c = 0;
    while (main === undefined) {
        c = c + 1;
        main = getElementByXpath('/html/body/div[1]/div[2]/div[2]/div/main');
        if (c > 2000) {
            console.log("[ChatGPT - History Sidebar Toggle]: Unable to obtain <main>");
            break;
        }
    }
    const element = document.createElement("div");
    element.id = "sidebarToggleContainer";
    element.className = "dark:bg-gray-800"
    element.innerHTML = buttonHtml;
    main.prepend(element);

    element.addEventListener("click", () => toggle_sidebar());
};


toggle_sidebar();
appendHtml();
console.log('[ChatGPT - History Sidebar Toggle]: Loaded');