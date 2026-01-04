// ==UserScript==
// @name         抖词词敏感词替换
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  敏感词替换
// @author       wang
// @match        https://www.doucici.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doucici.com
// @grant        none
// @require      https://unpkg.com/pinyin-pro@3.12.0/dist/index.js
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460476/%E6%8A%96%E8%AF%8D%E8%AF%8D%E6%95%8F%E6%84%9F%E8%AF%8D%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/460476/%E6%8A%96%E8%AF%8D%E8%AF%8D%E6%95%8F%E6%84%9F%E8%AF%8D%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

const pinyin=pinyinPro.pinyin


window.onload=lan()

function lan() {
    'use strict';


    // Create the floating window
    var floatingWindow = document.createElement("div");
    floatingWindow.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    floatingWindow.style.color = "white";
    floatingWindow.style.position = "fixed";
    floatingWindow.style.display="inline-flex";
    floatingWindow.style["white-space"] = "nowrap";
    floatingWindow.style.bottom = "10px";
    floatingWindow.style.left = "0px";
    floatingWindow.style.width = "auto";
    floatingWindow.style.height = "auto";
    floatingWindow.style.zIndex = "999";
    floatingWindow.style.whitewrap="nowerp"
    floatingWindow.style.textAlign = "center";
    floatingWindow.style.padding = "5px";



    let button = document.createElement('button');
    button.innerHTML = "敏感词替换";
    button.style.color="black"
    button.style.width = "auto";
    button.style.height = "auto";
    button.style.cursor = "pointer";
    button.addEventListener('click', function() {


        const elements = document.querySelectorAll('[class*="word_mark"]');

        // 遍历所有符合条件的元素并进行替换
        elements.forEach((el) => {

            el.innerHTML = pinyin(el.innerHTML, { pattern: 'first' })
                .replace(/\s+/g, "")
                .toUpperCase();

        });

    });


    var buttonStyle = document.createElement('style');
    document.head.appendChild(buttonStyle);
    buttonStyle.innerHTML = `
button:after {

    background: #90EE90;

    transition: all 0.8s
}

button:active:after {
    background: #90EE90;
    transition: 0.9s
}
  button:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
}

`
    floatingWindow.appendChild(button);
    document.body.appendChild(floatingWindow);

}
