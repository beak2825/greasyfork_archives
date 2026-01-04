// ==UserScript==
// @name               Auto Dark Mode for Hameln
// @name:zh-TW         ハーメルン自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               https://icons.duckduckgo.com/ip3/syosetu.org.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.3
// @license            MIT
// @match              https://syosetu.org/*
// @run-at             document-idle
// @grant              none
// @supportURL         https://greasyfork.org/scripts/449361/feedback
// @downloadURL https://update.greasyfork.org/scripts/449361/Auto%20Dark%20Mode%20for%20Hameln.user.js
// @updateURL https://update.greasyfork.org/scripts/449361/Auto%20Dark%20Mode%20for%20Hameln.meta.js
// ==/UserScript==

const toggle = document.getElementById("nightmode_check");
const query = matchMedia("(prefers-color-scheme: dark)");

query.addEventListener("change", updateTheme);
updateTheme(query);

function updateTheme({ matches: isDarkMode })
{
    if (toggle.checked !== isDarkMode)
    {
        toggle.click();
    }
}
