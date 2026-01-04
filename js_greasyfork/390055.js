// ==UserScript==
// @name         重庆继续教育小节自动播放
// @namespace    http://tampermonkey.net/
// @version      0.7.1
// @description  自动播放下一节视频
// @author       moxiaoying
// @match        http*://cqrl.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390055/%E9%87%8D%E5%BA%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B0%8F%E8%8A%82%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/390055/%E9%87%8D%E5%BA%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B0%8F%E8%8A%82%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const sleep = async (time_delay) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, time_delay*1000)
        })
    }
    const nextCourse = async (element)=>{
        if (element.innerText.includes('已完成')){
            // 点击下一个视频
            await sleep(2);
            const tmp = element.parentElement.nextElementSibling;
            const next_cap = element.parentElement.parentElement.parentElement.nextElementSibling
            console.log(tmp, next_cap);
            if(tmp){
                tmp.click();
            }else if (next_cap){
                next_cap.firstElementChild.nextElementSibling.firstElementChild.click()
            }else{
                alert('当前章节已学习完毕啦')
            }
        }
    }
    const main = async () => {
        await sleep(2);
        // 进入页面后自动点击完成后的下一个元素
        const iframe = document.querySelector('.url-course-content').contentDocument;
        const finishes = iframe.querySelectorAll('.finish')
        if (finishes.length > 0){
            const last_finish = finishes[finishes.length-1]
            nextCourse(last_finish.firstElementChild);
        }
        setInterval(function(){
            const learn = iframe.querySelector('.active')
            console.log(`正在检测---${learn.firstElementChild.title}---是否播放完毕`);
            nextCourse(learn)
        },5*1000);
    }
    main()
})();