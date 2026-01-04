// ==UserScript==
// @name               Auto Dark Mode for TV Tropes
// @name:zh-TW         TV Tropes 自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               https://wsrv.nl/?url=https://assets.tvtropes.org/img/icons/apple-icon-180x180.png
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.2
// @license            MIT
// @match              https://tvtropes.org/*
// @run-at             document-end
// @grant              none
// @supportURL         https://greasyfork.org/scripts/483244/feedback
// @downloadURL https://update.greasyfork.org/scripts/483244/Auto%20Dark%20Mode%20for%20TV%20Tropes.user.js
// @updateURL https://update.greasyfork.org/scripts/483244/Auto%20Dark%20Mode%20for%20TV%20Tropes.meta.js
// ==/UserScript==

const toggle = document.getElementById("sidebar-toggle-nightvision");
const query = matchMedia("(prefers-color-scheme: dark)");

query.addEventListener("change", updateTheme);

const interval = setInterval(() =>
{
    (toggle.classList.contains("active") === query.matches)
        ? clearInterval(interval)
        : updateTheme(query);
}, 100);

function updateTheme({ matches: isDarkMode })
{
    if (toggle.classList.contains("active") !== isDarkMode)
    {
        toggle.click();
    }
}
