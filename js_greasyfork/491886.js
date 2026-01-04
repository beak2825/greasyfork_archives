// ==UserScript==
// @name               Auto Dark Mode for Shlink Web Client
// @name:zh-TW         Shlink 網頁客戶端自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               https://icons.duckduckgo.com/ip3/app.shlink.io.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// @match              https://app.shlink.io/*
// @run-at             document-end
// @grant              none
// @supportURL         https://greasyfork.org/scripts/491886/feedback
// @downloadURL https://update.greasyfork.org/scripts/491886/Auto%20Dark%20Mode%20for%20Shlink%20Web%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/491886/Auto%20Dark%20Mode%20for%20Shlink%20Web%20Client.meta.js
// ==/UserScript==

const settings = JSON.parse(localStorage.getItem("shlink.settings") ?? "null");
if (settings)
{
    delete settings.ui.theme;
    localStorage.setItem("shlink.settings", JSON.stringify(settings));
}

const query = matchMedia("(prefers-color-scheme: dark)");
query.addEventListener("change", updateTheme);

function isDarkTheme()
{
    return (document.documentElement.dataset.theme === "dark");
}

function updateTheme({ matches: isDarkMode })
{
    if (isDarkTheme() !== isDarkMode)
    {
        document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
    }
}
