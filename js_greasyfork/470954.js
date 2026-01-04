// ==UserScript==
// @name         AC Iconner
// @namespace    https://atcoder.jp/
// @version      0.3
// @description  AtCoderのユーザー名の前にユーザーのアイコンを表示します。
// @author       Yama.can
// @match        https://atcoder.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470954/AC%20Iconner.user.js
// @updateURL https://update.greasyfork.org/scripts/470954/AC%20Iconner.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    let addedElements = [];
    let cache = {};
    window.setInterval(async () => {
        let beforeElements = Array.from(document.querySelectorAll('a[href^="/users/"]'));
        let elements = beforeElements.concat();
        for(let i = 0; i < elements.length; i++){
            if(addedElements.indexOf(elements[i]) != -1){
                elements[i] = undefined;
            }
        }
        addedElements = beforeElements.concat();
        console.log(addedElements, beforeElements);
        for(let i = 0; i < elements.length; i++){
            const element = elements[i];
            if(element == undefined) continue;
            let imgUrl;
            let wait = true;
            if(cache[element.href] == undefined){
                let response;
                let ok = false;
                while(!ok){
                    try{
                        response = await (await fetch(element.href)).text();
                        ok = true;
                    }finally{
                        await new Promise((resolve) => window.setTimeout(resolve,100));
                    }
                }
                imgUrl = response.match(/\<img class=\'avatar\' src=\'(.*)' width/)[1];
                cache[element.href] = imgUrl;
            } else {
                wait = false;
                imgUrl = cache[element.href];
            }
            let child = document.createElement("img")
            child.style = "height: 1.5em";
            child.src = imgUrl;
            element.parentNode.insertBefore(child,element.parentNode.firstChild);
            if(wait){
                await new Promise((resolve) => window.setTimeout(resolve,10));
            }
        };
    },100);
})();