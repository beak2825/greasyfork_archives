// ==UserScript==
// @name        Lite代理软件指引
// @namespace   greasyfork.org
// @match       https://greasyfork.org/*
// @match       https://cn-greasyfork.org/*
// @match       https://github.com/*
// @match       https://*.youtube.com/*
// @grant       GM_registerMenuCommand
// @version     1.5
// @author      -
// @description 一款专注于简单轻量的代理软件。
// @downloadURL https://update.greasyfork.org/scripts/528969/Lite%E4%BB%A3%E7%90%86%E8%BD%AF%E4%BB%B6%E6%8C%87%E5%BC%95.user.js
// @updateURL https://update.greasyfork.org/scripts/528969/Lite%E4%BB%A3%E7%90%86%E8%BD%AF%E4%BB%B6%E6%8C%87%E5%BC%95.meta.js
// ==/UserScript==

const url="https://github.com/seelite/lite"

if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand("🌍 代理", ()=>{
        const a = document.createElement("a");
        a.href=url;
        a.target="_blank";
        a.click();
    });
}else{
    alert("你的浏览器不受支持，请手动前往 https://github.com/seelite/lite")
}