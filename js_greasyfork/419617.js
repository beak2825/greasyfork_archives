// ==UserScript==
// @name         github 翻译纠正
// @namespace    mscststs
// @version      0.3
// @description  防止 chrome 翻译 github 的code
// @author       mscststs
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419617/github%20%E7%BF%BB%E8%AF%91%E7%BA%A0%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/419617/github%20%E7%BF%BB%E8%AF%91%E7%BA%A0%E6%AD%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("contextmenu",(e)=>{
        let pres = [
            ...document.querySelectorAll("pre"), // Markdown document
            ...document.querySelectorAll(".blob-code-inner"), // issue Diff
        ];
        [...document.querySelectorAll("code")].forEach(node=>{
            if(node.parentElement.translate !== "no"){
                //node.innerHTML = node.innerHTML.split("").map(i=>`<font><span>${i}<span></font>`).join("");
                node.outerHTML = `<font translate="no">${node.outerHTML}<font>`
            }
        });
        pres.forEach(node=>{
            //nsole.log(node.innerHTML)
            if(!node.innerHTML.startsWith("<code>")){
                node.innerHTML = "<code>"+node.innerHTML+"</code>"
            }
        });

    })
})();