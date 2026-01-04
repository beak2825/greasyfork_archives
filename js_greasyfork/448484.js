// ==UserScript==
// @name               Auto Dark Mode for Nyaa
// @name:zh-TW         Nyaa 自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               https://icons.duckduckgo.com/ip3/nyaa.si.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.1.4
// @license            MIT
// @match              https://nyaa.si/*
// @match              https://sukebei.nyaa.si/*
// @run-at             document-idle
// @inject-into        page
// @grant              none
// @supportURL         https://greasyfork.org/scripts/448484/feedback
// @downloadURL https://update.greasyfork.org/scripts/448484/Auto%20Dark%20Mode%20for%20Nyaa.user.js
// @updateURL https://update.greasyfork.org/scripts/448484/Auto%20Dark%20Mode%20for%20Nyaa.meta.js
// ==/UserScript==

if (GM.info.scriptHandler === "Greasemonkey")
{
    window.setThemeDark = window.eval("setThemeDark");
    window.setThemeLight = window.eval("setThemeLight");
}

const query = matchMedia("(prefers-color-scheme: dark)");

query.addEventListener("change", updateTheme);
updateTheme(query);

function isDarkTheme()
{
    return document.body.classList.contains("dark");
}

function updateTheme({ matches: isDarkMode })
{
    if (isDarkTheme() !== isDarkMode)
    {
        isDarkMode ? setThemeDark() : setThemeLight();
    }
}
