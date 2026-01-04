// ==UserScript==
// @name         Youtube jump to embed
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Jump video to embed page
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541798/Youtube%20jump%20to%20embed.user.js
// @updateURL https://update.greasyfork.org/scripts/541798/Youtube%20jump%20to%20embed.meta.js
// ==/UserScript==
/*
1.1.2 20250704
修复打开的嵌入式链接带referer导致错误4的bug。
1.1.1 20250622
修复Live无法打开窗口的bug。
1.1 20250607
修复This document requires 'TrustedHTML' assignment错误。
1.0
完成需求功能。
*/

(function() {
    'use strict';
    let waitInterval;
    function waitEl(q){
        return new Promise((resolve, reject)=>{
            clearInterval(waitInterval);
            waitInterval=setInterval(()=>{
            let el=document.querySelector(q);
            if(el!=null){
                clearInterval(waitInterval);
                resolve(el);
            }
        },1000);
        });
    }

    let watchInterval;
    async function watchDog(){
        clearInterval(watchInterval);
        watchInterval=setInterval(()=>{
            let jumpEl=document.querySelector(`#jumpBu`);
            if(!jumpEl){
                main();
            }
        },1000);
    }

    async function main(){
        let feedEl=document.querySelector(`h1.style-scope.ytd-watch-metadata`);
        if(!feedEl) return;
        let jumpEl=document.createElement(`button`);
        jumpEl.id=`jumpBu`;
        jumpEl.innerText=`Embed`;
        jumpEl.addEventListener(`click`,function(){
            if(window.location.href.includes(`?`)){
                let searchList=window.location.search.replace(`?`,``).split(`&`);
                for(let search of searchList){
                    if(search.startsWith(`v=`)){
                        let videoId=search.split(`v=`)[1];
                        let embedUrl=`https://www.youtube.com/embed/${videoId}`;
                        window.open(embedUrl,`_blank`,`noopener,noreferrer`);
                        return;
                    }
                }
            }else if(!window.location.href.includes(`?`)){
                let videoId=window.location.href.split(`/`).at(-1);
                let embedUrl=`https://www.youtube.com/embed/${videoId}`;
                window.open(embedUrl);
            }
        });
        feedEl.after(jumpEl);
        console.log(`Inserted.`);
    }

    watchDog();
})();