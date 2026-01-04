// ==UserScript==
// @name         enetedu.com自动播放下一集
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  自动播放下一集
// @author       moxiaoying
// @match        https://a.gp.enetedu.com/MyCourse/Process*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enetedu.com
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479216/eneteducom%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/479216/eneteducom%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
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
    const iframe = document.querySelector('body > div > table:nth-child(13) > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table:nth-child(2) > tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr > td > table:nth-child(1) > tbody > tr > td:nth-child(3) > form > table > tbody > tr > td:nth-child(2) > iframe')
    async function main(){
        await sleep(3)
        // const video = await elmGetter.get('video',iframe.contentDocument);
        // video.play()

        // 倍速
        // video.playbackRate = 4
        const video = iframe.contentDocument.getElementsByTagName('video')[0]
        //debugger
        //video.play()
        video.onended = (e)=> {
            const nextEl = document.querySelectorAll('.tishivalju')
            if(nextEl.length===1 && nextEl[nextEl.length-1].textContent.includes('没有了')){
                alert('当前章节已学习完毕，请手动选择下一章节')
                return
            }
            nextEl[nextEl.length-1].click()
        }

    }
    main()

})();