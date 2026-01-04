// ==UserScript==
// @name         anti-twitter-breadvirus
// @namespace    https://greasyfork.org/en/scripts/407479-anti-twitter-breadvirus
// @version      0.1.1
// @description  anti #breadvirus
// @author       YeXiaoRain
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407479/anti-twitter-breadvirus.user.js
// @updateURL https://update.greasyfork.org/scripts/407479/anti-twitter-breadvirus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const debounce = function(fn, timeout) {
        let timer;
        return function() {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function(){
                fn(arguments);
            }, timeout);
        }
    }
    const dfs = (item,d = 10000) => {
        let anticount = 0;
        if(item.nodeType === 3){ // #Text
            const reg = /扩散性百万(?!甜)(.+)面包/;
            while(reg.test(item.textContent)){
                anticount ++;
                // 为了计数 没有使用 /g
                item.textContent = item.textContent.replace(reg,'$1');
            }
        }else if(d > 0){
            for (let i = 0; i < item.childNodes.length; i++) {
                anticount += dfs(item.childNodes[i],d-1);
            }
        }
        return anticount;
    }
    const work = debounce(()=>{
        console.log('Anti #breadvirus ',dfs(window.document.body));
    },1000);
    const observer = new MutationObserver(()=>{
        setTimeout(work,0);
    });
    const options = {
        childList: true,
        subtree: true
    } ;
    observer.observe(document.body,options);
})();