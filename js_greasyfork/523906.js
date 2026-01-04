// ==UserScript==
// @name         Greasy Fork Code Viewer
// @name:en      Greasy Fork Code Viewer
// @name:ja      Greasy Fork Code Viewer
// @namespace    http://tampermonkey.net/
// @version      2025-01-16
// @description    Direct access to the code page.
// @description:en Direct access to the code page.
// @description:ja codeページへの直接アクセス。
// @author       ぐらんぴ
// @match        https://greasyfork.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523906/Greasy%20Fork%20Code%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/523906/Greasy%20Fork%20Code%20Viewer.meta.js
// ==/UserScript==

const $sa = (el) => document.querySelectorAll(el);

if(!location.pathname.includes("/code")){
    $sa(".script-link").forEach(i =>{
        i.href = i.href + "/code"
    });
}
if(location.pathname.includes("/code")){
    window.onload = () =>{
        $sa(".com").forEach(i =>{
            if(i.textContent == "// ==/UserScript=="){
                i.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}