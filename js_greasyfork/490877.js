// ==UserScript==
// @name         stickerBotCDNChange
// @namespace    http://tampermonkey.net/
// @version      2024-03-26
// @description  sticker Bot CDN Change
// @author       Logo
// @match        https://beta.2fools.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2fools.app
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490877/stickerBotCDNChange.user.js
// @updateURL https://update.greasyfork.org/scripts/490877/stickerBotCDNChange.meta.js
// ==/UserScript==
let imgLength = 0;
let fun = ()=>{
    let imgs = document.getElementsByTagName('img');
    if(imgLength!==imgs.length){
        for(let i = imgLength;i<imgs.length;i++){
            const match = /https:\/\/tgs-files.oss-accelerate.aliyuncs.com/.exec(imgs[i].src)
            if(match){
                imgs[i].src = imgs[i].src.replace('https://tgs-files.oss-accelerate.aliyuncs.com','https://tgs.sgp1.digitaloceanspaces.com')
            }
        }
        imgLength = imgs.length;
    }
}
setInterval(fun,1000);
