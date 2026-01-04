// ==UserScript==
// @name               Auto Dark Mode for KadoKado
// @name:zh-TW         角角者自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               https://icons.duckduckgo.com/ip3/www.kadokado.com.tw.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.2
// @license            MIT
// @match              https://www.kadokado.com.tw/*
// @run-at             document-idle
// @grant              none
// @supportURL         https://greasyfork.org/scripts/459917/feedback
// @downloadURL https://update.greasyfork.org/scripts/459917/Auto%20Dark%20Mode%20for%20KadoKado.user.js
// @updateURL https://update.greasyfork.org/scripts/459917/Auto%20Dark%20Mode%20for%20KadoKado.meta.js
// ==/UserScript==

const toggle = document.querySelector("button[aria-label=\"切換黑夜/白晝模式\"]");
const query = matchMedia("(prefers-color-scheme: dark)");

query.addEventListener("change", updateTheme);
updateTheme(query);

function isDarkTheme()
{
    return (getComputedStyle(document.documentElement).getPropertyValue("--theme-ui-colors-background") !== "#fff");
}

function updateTheme({ matches: isDarkMode })
{
    if (isDarkTheme() !== isDarkMode)
    {
        toggle.click();
    }
}
