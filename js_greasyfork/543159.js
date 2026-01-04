// ==UserScript==
// @name        Apple Maps Custom Shields
// @namespace   Violentmonkey Scripts
// @match       *://maps.apple.com/*
// @grant       none
// @version     1.0
// @author      CyrilSLi
// @description Click on a shield style in the sidebar and enter some text to display on it.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543159/Apple%20Maps%20Custom%20Shields.user.js
// @updateURL https://update.greasyfork.org/scripts/543159/Apple%20Maps%20Custom%20Shields.meta.js
// ==/UserScript==

const nativeFetch = window.fetch;
const shieldContainer = document.createElement("div");
shieldContainer.className = "mw-nav-bar-recents-list-container";
const shieldDiv = document.createElement("div");
shieldDiv.className = "mw-nav-bar-recents-list";
shieldDiv.innerHTML = `
    <button class="mw-recents-item-row" title="Clear shields" onclick="clearShields()">
        <picture>
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9ImN1cnJlbnRDb2xvciIgY2xhc3M9ImJpIGJpLXgtY2lyY2xlLWZpbGwiIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZD0iTTE2IDhBOCA4IDAgMSAxIDAgOGE4IDggMCAwIDEgMTYgME01LjM1NCA0LjY0NmEuNS41IDAgMSAwLS43MDguNzA4TDcuMjkzIDhsLTIuNjQ3IDIuNjQ2YS41LjUgMCAwIDAgLjcwOC43MDhMOCA4LjcwN2wyLjY0NiAyLjY0N2EuNS41IDAgMCAwIC43MDgtLjcwOEw4LjcwNyA4bDIuNjQ3LTIuNjQ2YS41LjUgMCAwIDAtLjcwOC0uNzA4TDggNy4yOTN6Ii8+PC9zdmc+">
        </picture>
        <span dir="auto" class="mw-recents-item-title">Clear shields</span>
    </button>
`.trim();
const shieldSet = new Set();
window.clearShields = function () {
    while (shieldDiv.childNodes.length > 1) {
        shieldDiv.removeChild(shieldDiv.lastChild);
    }
    shieldSet.clear();
};
shieldContainer.appendChild(shieldDiv);

window.getShield = function (url) {
    const text = prompt("Enter text to display on the shield: ");
    if (!text) {
        return;
    }
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    params.set("text", text);
    params.set("scale", "3");     // Max scale
    params.set("sizeGroup", "7"); // Max size group
    const link = document.createElement("a");
    link.href = urlObj.toString();
    link.target = "_blank";
    link.click();
};

window.fetch = function (url, options) {
    if (url.includes("v1/shield")) {
        const shieldURL = new URL(url);
        const params = shieldURL.searchParams;
        const shieldStyle = params.get("id") + "-" + params.get("variant");
        if (!shieldSet.has(shieldStyle)) {
            shieldDiv.innerHTML += `
                <button class="mw-recents-item-row" title=${params.get("id")} onclick="getShield('${url}')">
                    <picture>
                        <img src="${url}">
                    </picture>
                    <span dir="auto" calss="mw-recents-item-title">${shieldStyle}</span>
                </button>
            `.trim();
            shieldSet.add(shieldStyle);
        }
    }
    return nativeFetch(url, options);
};

const observer = new MutationObserver(() => {
    if (document.getElementsByClassName("mw-controls-container")[0]) {
        observer.disconnect();
        setTimeout(() => {
            const navGroup = document.getElementsByClassName("nav-button-group")[0];
            navGroup.style.cssText = `
                overflow-y: scroll;
                -ms-overflow-style: none;
                scrollbar-width: none;
            `;
            navGroup.insertBefore(shieldContainer, navGroup.lastChild);
        }, 500);
    }
});
observer.observe(document, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree:true
});