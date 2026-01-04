// ==UserScript==
// @name         Duolingo Tools for Study Notes
// @namespace    http://tampermonkey.net/
// @version      0.111
// @description  A tiny tool for Duolingo exercises better. Note: This script is used for studying and taking notes for languages such as Japanese etc., not for cheating and doing the exercises automatically.
// @author       Lepturus
// @match        *://*.duolingo.cn/g*
// @match        *://*.duolingo.com/g*
// @match        *://*.duolingo.com/l*
// @match        *://*.duolingo.cn/l*
// @match        *://*.duolingo.com/skill*
// @match        *://*.duolingo.cn/skill*
// @icon         https://d35aaqx5ub95lt.cloudfront.net/images/duolingo-touch-icon2.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469751/Duolingo%20Tools%20for%20Study%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/469751/Duolingo%20Tools%20for%20Study%20Notes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function copy(e, isHTML = true) {
        let obj = document.createElement('input');
        document.body.appendChild(obj);
        obj.value = isHTML ? e.innerText : e;
        obj.select();
        document.execCommand('copy', false);
        obj.remove();
    }

    function Duolingo() {
        let kws = document.querySelectorAll('div[dir="ltr"]');
        for (let i = 0; i < kws.length; i++) {
        if (!/guidebook/.test(document.URL) && i>0){
            break; // The practice mode will recognize two and remove the blank areas.
        }
        let txt="";
        if (kws[i]) {
            let cont = kws[i].parentNode;
            let Kont = document.createElement("div");
            let goGoogle = document.createElement("span");
            Kont.appendChild(goGoogle);
            if (kws[i].querySelector('ruby div')){ // fix conflict with 片假名终结者 https://greasyfork.org/zh-CN/scripts/33268
                kws[i].querySelectorAll('ruby rb div').forEach(function(tp){
                    txt += tp.innerText;
                })
            }
            else{
            txt = kws[i].innerText;
            }
            let goUrl = `https://www.google.com/search?q=${txt}%20site%3Aduolingo.com&ie=utf-8`
            let goTranslate = `https://translate.google.com/?hl=en&sl=auto&tl=en&text=${txt}`
            goGoogle.innerHTML =
                `<a href="${goUrl}" target="_blank">Google</a> <a href="${goTranslate}" target="_blank">Translation</a>  <button id ="copyText${i}" style="background: none!important;border: none;padding: 0!important;">Copy it</button>`;
            if (!cont.textContent.match("Google")) {
                console.log("sdgfsg")
                if (/guidebook/.test(document.URL)) {
                Kont.style.gridColumn = "2";
                Kont.style.gridRow = "3";
                cont.appendChild(document.createElement("br"));
                }
                cont.appendChild(Kont);
            }
            let cpy = document.getElementById("copyText"+i);
            cpy.onclick = function () {
                copy(txt,false);
                cpy.innerText = "Copied";
                window.setTimeout(function () {
                    cpy.innerText = "Copy it"
                }, 1500);
            }
        }
    }
    }
    if (/duolingo/.test(document.URL)) {
        setInterval(Duolingo, 1500);
    }
})();