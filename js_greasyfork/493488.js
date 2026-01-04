// ==UserScript==
// @name               Auto Dark Mode for Change Detection
// @name:zh-TW         Change Detection 自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               https://wsrv.nl/?url=https://changedetection.io/themes/cdio/assets/images/favicons/apple-touch-icon.png
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// @match              https://lemonade.changedetection.io/*
// @exclude-match      https://lemonade.changedetection.io/resetpassword
// @noframes
// @run-at             document-end
// @grant              none
// @supportURL         https://greasyfork.org/scripts/493488/feedback
// @downloadURL https://update.greasyfork.org/scripts/493488/Auto%20Dark%20Mode%20for%20Change%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/493488/Auto%20Dark%20Mode%20for%20Change%20Detection.meta.js
// ==/UserScript==

const toggle = document.getElementById("toggle-light-mode");
const query = matchMedia("(prefers-color-scheme: dark)");

query.addEventListener("change", updateTheme);

const interval = setInterval(() =>
{
    (document.documentElement.dataset.darkmode === String(query.matches))
        ? clearInterval(interval)
        : updateTheme(query);
}, 100);

function updateTheme({ matches: isDarkMode })
{
    if (document.documentElement.dataset.darkmode !== String(isDarkMode))
    {
        toggle.click();
    }
}
