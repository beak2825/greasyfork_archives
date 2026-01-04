// ==UserScript==
// @name         CSDNCodeCopier
// @namespace    https://blog.csdn.net/
// @version      1.0
// @description  Down with CSDN paywall. Adds buttons for copying content from code snippets in CSDN blog posts
// @author       aisuneko
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492166/CSDNCodeCopier.user.js
// @updateURL https://update.greasyfork.org/scripts/492166/CSDNCodeCopier.meta.js
// ==/UserScript==
async function copyToClipboard(text){
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.error(error.message);
    }
}

function unescapeHTML(html) {
    return html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}

(function() {
    'use strict';
    let taglist = ["set-code-show", "set-code-hide"];
    let snippetlist = [];
    taglist.forEach((tag)=>{
        let tmparr = Array.from(document.getElementsByClassName(tag));
        snippetlist.push(...tmparr);
    });
    for(let i of snippetlist){
        let button = document.createElement("button");
        button.textContent = "Copy Code";
        let code = i.getElementsByTagName("code")[0].innerHTML.toString().replaceAll(/<[^>]*>/gi,"");
        button.addEventListener("click", () => {
            copyToClipboard(unescapeHTML(code));
            button.textContent = "Copied!";
        });
        i.appendChild(button);
    }
    Array.from(document.getElementsByClassName("hljs-button signin active")).forEach((el)=>{el.remove()});
})();