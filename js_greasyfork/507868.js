// ==UserScript==
// @name        Force GPT3.5 4omini
// @namespace   revar
// @match       https://chatgpt.com/*
// @version     2.0
// @author      revar
// @run-at      document-start
// @license MIT
// @description  chatgpt强制使用3.5或4omini
// @downloadURL https://update.greasyfork.org/scripts/507868/Force%20GPT35%204omini.user.js
// @updateURL https://update.greasyfork.org/scripts/507868/Force%20GPT35%204omini.meta.js
// ==/UserScript==

let windowRef = window;

try {
    windowRef = unsafeWindow;
} catch (e) {}

const originalFetch = windowRef.fetch;

windowRef.fetch = async (url, config) => {
    const gptModel = await GM.getValue("gptModel", "text-davinci-002-render-sha");

    if (gptModel !== "auto" && url.includes("/backend-api/conversation") && config.method === "POST") {
        try {
            const body = JSON.parse(config.body);
            config.body = JSON.stringify({ ...body, model: gptModel });
        } catch (error) {
            console.error("[force-gpt3] Error parsing JSON body:", error);
        }
    }

    const response = await originalFetch(url, config);
    return response;
};

async function mainRunner() {
    const style = document.createElement("style");
    style.innerHTML = `
        .toggleContainer {
            position: absolute; right: 12rem; top: 0.5rem; z-index: 9999;
        }
        .toggleContainer select {
            border-radius: 9999px; z-index: 9999;
        }
    `;
    document.head.append(style);

    const toggleContainer = document.createElement("div");
    toggleContainer.classList.add("toggleContainer");

    toggleContainer.innerHTML = `
        <select>
            <option value="auto">Auto</option>
            <option value="text-davinci-002-render-sha">GPT 3.5</option>
            <option value="gpt-4o-mini">GPT 4o mini</option>
        </select>
    `;
    document.body.appendChild(toggleContainer);

    const select = toggleContainer.querySelector("select");
    select.onchange = (evt) => {
        GM.setValue("gptModel", evt.target.value);
        localStorage.setItem('gptModel', evt.target.value);
        console.log(`[force-gpt3] changing model to ${evt.target.value}`);
    };

    const selectVal = await GM.getValue("gptModel", "text-davinci-002-render-sha");
    select.value = selectVal;
    localStorage.setItem('gptModel', selectVal);
}

function ensureToggleContainer() {
    if (!document.querySelector('.toggleContainer')) {
        mainRunner();
    } else {
        const select = document.querySelector('.toggleContainer select');
        const savedModel = localStorage.getItem('gptModel');
        if (savedModel) {
            select.value = savedModel;
        }
    }
}

const observer = new MutationObserver(ensureToggleContainer);
observer.observe(document.body, { childList: true, subtree: true });

if (document.readyState !== "loading") {
    setTimeout(mainRunner, 1000);
} else {
    window.onload = () => setTimeout(mainRunner, 1000);
}
