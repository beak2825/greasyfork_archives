// ==UserScript==
// @name         去除Bilibili首页广告
// @namespace    http://tampermonkey.net/
// @version      0.1.0.2502181659
// @description  Remove Bilibili Ads
// @author       Roonfu
// @license      MIT
// @match        https://www.bilibili.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527309/%E5%8E%BB%E9%99%A4Bilibili%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/527309/%E5%8E%BB%E9%99%A4Bilibili%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

function func(){
    let a = document.getElementsByClassName("bili-video-card");
    for (let i in a) {
        try{
            //console.log(a[i].children[0].className);
            if(a[i].children[0].className.includes("video")==false){
                //console.log(1);
                a[i].remove();
            }
        }
        finally{}
    }
}
setInterval(func, 200);
