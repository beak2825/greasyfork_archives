// ==UserScript==
// @name               style-shims
// @description        Shims for GM_addStyle and GM.addStyle.
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.3
// @license            MIT
// ==/UserScript==

let GM_addStyle = function GM_addStyle(css)
{
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.textContent = css;

    const target = document.head ?? document.documentElement;
    return target.appendChild(style);
}

GM.addStyle = GM_addStyle;
