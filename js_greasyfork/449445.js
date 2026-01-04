// ==UserScript==
// @name               Auto Dark Mode for SimpleLogin
// @name:zh-TW         SimpleLogin 自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               https://icons.duckduckgo.com/ip3/app.simplelogin.io.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.2.0
// @license            MIT
// @match              https://app.simplelogin.io/*
// @run-at             document-idle
// @inject-into        page
// @grant              none
// @supportURL         https://greasyfork.org/scripts/449445/feedback
// @downloadURL https://update.greasyfork.org/scripts/449445/Auto%20Dark%20Mode%20for%20SimpleLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/449445/Auto%20Dark%20Mode%20for%20SimpleLogin.meta.js
// ==/UserScript==

if (GM.info.scriptHandler === "Greasemonkey")
{
    window.setCookie = window.eval("setCookie");
}

const query = matchMedia("(prefers-color-scheme: dark)");

query.addEventListener("change", updateTheme);
updateTheme(query);

function updateTheme({ matches: isDarkMode })
{
    const theme = isDarkMode ? "dark" : "light";

    if (document.documentElement.dataset.theme !== theme)
    {
        setCookie("dark-mode", String(isDarkMode), 30);
        document.documentElement.dataset.theme = theme;
    }
}
