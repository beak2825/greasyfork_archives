// ==UserScript==
// @name               Auto Dark Mode for Miraheze
// @name:zh-TW         Miraheze 自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               https://wsrv.nl/?url=https://static.miraheze.org/metawiki/3/35/Miraheze_Logo.svg
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.1
// @license            MIT
// @match              https://*.miraheze.org/*
// @exclude-match      https://miraheze.org/*
// @run-at             document-idle
// @grant              none
// @supportURL         https://greasyfork.org/scripts/460249/feedback
// @downloadURL https://update.greasyfork.org/scripts/460249/Auto%20Dark%20Mode%20for%20Miraheze.user.js
// @updateURL https://update.greasyfork.org/scripts/460249/Auto%20Dark%20Mode%20for%20Miraheze.meta.js
// ==/UserScript==

const toggle = document.querySelector(".ext-darkmode-link");
const query = matchMedia("(prefers-color-scheme: dark)");

if (!isCitizenSkin() && (toggle !== null))
{
    setTimeout(() =>
    {
        query.addEventListener("change", updateTheme);
        updateTheme(query);
    }, 1000);
}

function updateTheme({ matches: isDarkMode })
{
    if (isDarkTheme() !== isDarkMode) { toggle.click(); }
}


function isCitizenSkin()
{
    return document.body.classList.contains("skin-citizen");
}

function isDarkTheme()
{
    return document.documentElement.classList.contains("client-darkmode");
}
