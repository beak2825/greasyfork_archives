// ==UserScript==
// @name         简书去广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  简书自动关闭广告,
// @author       bigMonkey666
// @match        https://www.jianshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianshu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468089/%E7%AE%80%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/468089/%E7%AE%80%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    console.log('======清除广告开始======');
    let count = 0;
    let s = setInterval(()=>{
        count += 1;
        let imgList = document.querySelectorAll('img');
        for(let i = 0;i<imgList.length;i++){
            const item = imgList[i];
            if(item.src.indexOf('close')!==-1||item.src.indexOf('closeb')!==-1){
                item.click();
            }
        }
        let b = false;
        imgList.forEach(item=>{
            if(item.src.indexOf('close')===-1&&item.src.indexOf('closeb')===-1){
                b=true
            }
        })
        if(b&&count===10){
            console.log('======清除广告结束======');
            clearInterval(s);
        }
    },500);
})();