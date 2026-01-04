// ==UserScript==
// @name         超星学习通辅助||视频/答题自动切换
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  用于辅助超星学习通插件，使得能够进行自动切换视频，观看完视频自动切换答题
// @author       chic1018
// @match        *://*.chaoxing.com/*
// @downloadURL https://update.greasyfork.org/scripts/435693/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%BE%85%E5%8A%A9%7C%7C%E8%A7%86%E9%A2%91%E7%AD%94%E9%A2%98%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/435693/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%BE%85%E5%8A%A9%7C%7C%E8%A7%86%E9%A2%91%E7%AD%94%E9%A2%98%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

!function(){
    'use strict';
    function loop(){
        setTimeout(()=>{
            if (window.self !== window.top){
                return;
            }
            let videoElem;
            videoElem = document.querySelector('#iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('#video_html5_api');
            if (!videoElem){
                return;
            }
            let videoLi = document.querySelectorAll('.posCatalog_name');
            let videoCu = document.querySelector('.posCatalog_active span');
            let videoNext;
            for (let i=0,len=videoLi.length;i < len;i++){
                if (videoLi[i] == videoCu){
                    videoNext = videoLi[i+1];
                    break;
                }
            }
            function AnsQues(){
                let check = setInterval(()=>{
                    try{
                        let text = document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('body > div:last-child').innerText;
                        if (text.slice(0,5) === '答题已完成'){
                            clearInterval(check);
                            document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('.Btn_blue_1').click()
                            setTimeout(()=>{
                                document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('#confirmSubWin .bluebtn').click()
                                setTimeout(()=>{
                                    videoNext.click();
                                    if (videoNext != videoLi[videoLi.length-1]){
                                        loop();
                                    }
                                },2000)
                            },50)
                            return;
                        }
                        else if (text.match('题目待完善')){
                            clearInterval(check);
                            videoNext.click();
                            if (videoNext != videoLi[videoLi.length-1]){
                                loop();
                            }
                            return;
                        }
                    }
                    catch{
                    }
                },2000)
            }
            let jobLeft;
            try {
                jobLeft = document.querySelector('.posCatalog_active input').value;
            }
            catch {
                videoNext.click();
                if (videoNext != videoLi[videoLi.length-1]){
                    loop();
                }
                return;
            }
            if (jobLeft == 2){
                videoElem.onended = ()=>{
                    document.querySelector('#dct2').click();
                    setTimeout(AnsQues,2000);
                }
            }
            else if (jobLeft == 1){
                if (!document.querySelector('#iframe').contentDocument.querySelector('.ans-job-finished')){
                    videoElem.onended = videoNext.click();
                }
                else {
                    document.querySelector('#dct2').click();
                    setTimeout(AnsQues,2000);
                }
            }
        },5000);
    }
    loop();
}();
