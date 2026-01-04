// ==UserScript==
// @name         湖南省高校师资培训云平台2024-1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动看，自动切换
// @author       You
// @match        https://hngs.peixunyun.cn/*
// @match        https://ua.peixunyun.cn/learnCourse/*
// @icon         https://www.google.com/s2/favicons?domain=peixunyun.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502094/%E6%B9%96%E5%8D%97%E7%9C%81%E9%AB%98%E6%A0%A1%E5%B8%88%E8%B5%84%E5%9F%B9%E8%AE%AD%E4%BA%91%E5%B9%B3%E5%8F%B02024-1.user.js
// @updateURL https://update.greasyfork.org/scripts/502094/%E6%B9%96%E5%8D%97%E7%9C%81%E9%AB%98%E6%A0%A1%E5%B8%88%E8%B5%84%E5%9F%B9%E8%AE%AD%E4%BA%91%E5%B9%B3%E5%8F%B02024-1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here..
    function zy(){
        if(document.URL.search('tClassId')>1){
            console.log('祖业')
            var imgs=document.querySelector("#app > div > div.j-main > div > div.mainBox > div.head > div.head_right > div > div > button")
            if(imgs!==null){
            imgs.click()
            }
        }
    }
    setInterval(zy,5000)
    function bfy(){
        if(document.URL.search('chapterId')>1){
            var imgs=document.getElementsByClassName('page-icon')
            for (var i=0;i<imgs.length;i++){
                    if(imgs[i].querySelector('i').className!=='iconfont finish'){
                        imgs[i].click()
                        console.log(i)
                        break;
                }
                }
    if($('video').length>0){
    $('video')[0].play()
        setTimeout(fh,3000)
        }
    }
    }

    setInterval(bfy,5000)
function fh(){
            if(document.getElementsByClassName("video-progress clearfix complete")[0].innerText.search('已看完')>0){//ka完1课
            document.getElementsByClassName("back btn-text")[0].click()
            }
    if(document.querySelector("#alertModal > div.modal-dialog > div > div.modal-body > div > div.modal-operation > button")!==null){
    document.querySelector("#alertModal > div.modal-dialog > div > div.modal-body > div > div.modal-operation > button").click()
    }
}
})();