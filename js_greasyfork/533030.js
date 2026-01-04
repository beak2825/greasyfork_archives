// ==UserScript==
// @name         Mastodon View in Home Instance
// @version      1.5
// @description  Show a Mastodon-style banner to view profiles on your own instance (avoids broken post links)
// @author       https://mastodon.online/@prvrtl
// @match        https://*/@*
// @grant        none
// @namespace https://greasyfork.org/users/1458606
// @downloadURL https://update.greasyfork.org/scripts/533030/Mastodon%20View%20in%20Home%20Instance.user.js
// @updateURL https://update.greasyfork.org/scripts/533030/Mastodon%20View%20in%20Home%20Instance.meta.js
// ==/UserScript==

(function () {
    const homeInstance = "mastodon.online";
    const currentHost = window.location.hostname;

    if (currentHost === homeInstance) return;

    const path = window.location.pathname;
    const usernameMatch = path.match(/^\/@([^\/]+)/); // only username part
    if (!usernameMatch) return;

    const username = usernameMatch[1];
    const federatedHost = currentHost.replace(/^www\./, "");
    const redirectUrl = `https://${homeInstance}/@${username}@${federatedHost}`;

    // Create styled banner
    const banner = document.createElement("div");
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #282c37;
        color: white;
        padding: 12px 20px;
        font-family: system-ui, BlinkMacSystemFont, sans-serif;
        font-size: 15px;
        z-index: 9999;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
        border-bottom: 1px solid #444;
    `;

    const text = document.createElement("div");
    text.innerHTML = `🌍 You're viewing a Mastodon profile on <strong>${currentHost}</strong>.`;

    const button = document.createElement("button");
    button.textContent = `Open in ${homeInstance}`;
    button.style.cssText = `
        background: #6364ff;
        color: white;
        border: none;
        padding: 8px 16px;
        font-weight: 600;
        font-size: 14px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s ease;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
    `;
    button.addEventListener("mouseover", () => {
        button.style.background = "#5253e6";
    });
    button.addEventListener("mouseout", () => {
        button.style.background = "#6364ff";
    });
    button.addEventListener("click", () => {
        window.location.href = redirectUrl;
    });

    banner.appendChild(text);
    banner.appendChild(button);
    document.body.style.paddingTop = "64px";
    document.body.prepend(banner);
})();