// ==UserScript==
// @name         高亮显示未评阅的课程讨论帖
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  高亮显示特定课程讨论的未评分新帖
// @author       You
// @match        https://lms.ouchn.cn/course/30000012357/learning-activity/full-screen
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouchn.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467365/%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E6%9C%AA%E8%AF%84%E9%98%85%E7%9A%84%E8%AF%BE%E7%A8%8B%E8%AE%A8%E8%AE%BA%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/467365/%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E6%9C%AA%E8%AF%84%E9%98%85%E7%9A%84%E8%AF%BE%E7%A8%8B%E8%AE%A8%E8%AE%BA%E5%B8%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let intervalId = setInterval(function() {
        let items=document.querySelectorAll("div.list-forum-score  div.list-item")
        if (items.length) {
            clearInterval(intervalId); // 找到元素则停止查找
            console.log("Found.");
            for(let i=1;i<=items.length;i++){
                let item=document.querySelector(`div.list-forum-score.list-area.card.row > div.list-content.ng-scope > div:nth-child(${i})`)
                if(item){
                    let vPost=item.querySelector("div.large-5.column > span")
                    let vNota=item.querySelector("div:nth-child(9) > span").innerText
                    let tl=vPost.innerText.match(/\(\d+\/\d+\)/g)[0].replace(/[\(\)]/g,'').split("/");
                    if( (parseInt(tl[0])||parseInt(tl[1])) && !parseInt(vNota) ){
                        vPost.style.color="red";
                    }
                }
            }
        }else{
            console.log("waiting...")
        }
    }, 1000);

})();