// ==UserScript==
// @name         辽宁省干部在线学习网-专业技术专区专用
// @namespace    代刷课程
// @version      1.06
// @description  专业技术只能自然时长挂课时，其他专区均可刷课时
// @author       代刷vx：GKmkj123
// @match        *://zyjs.lngbzx.gov.cn/*
// @match        *://zyjsvideo.lngbzx.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lngbzx.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460338/%E8%BE%BD%E5%AE%81%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E7%BD%91-%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%B8%93%E5%8C%BA%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/460338/%E8%BE%BD%E5%AE%81%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E7%BD%91-%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%B8%93%E5%8C%BA%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if(document.visibilityState == "hidden") {
        } else if (document.visibilityState == "visible") {
            if(document.URL.search('yearplan/gostudy')>1){setTimeout(sx,1000)}
        }
    });
    function sx(){window.location.reload()}

    function zy(){
        if(document.URL.search('yearplan/gostudy')>1){
            var xxnum= document.querySelectorAll('dl.w_zxinfo.fl>dd.time>span.fr')
            for (var i=0;i<xxnum.length;i++){
                if(xxnum[i].innerText !=='完成100.0%' &&  xxnum[i].innerText !=='完成100%'){
                    document.querySelectorAll('dl.w_zxinfo.fl>dd.teach>p')[i].click()
                    break;
                }else if(i==xxnum.length-1){
                    var yeshu=document.querySelectorAll('ul.pagination>li').length-2
                    var nowyeshu=Number( document.querySelector('ul.pagination>li>span.on').innerText)
                    if(yeshu==nowyeshu){
                        window.close()
                    }else {
                        document.querySelector('ul.pagination>li>span.on').parentNode.nextElementSibling.getElementsByTagName('a')[0].click()
                    }
                }
            }
        }
    }
    setTimeout(zy,3000)

    function cy(){
        if(document.URL.search('resource/info')>1){
            if(document.getElementsByTagName('button')[0].innerText=="点击观看"){
                document.getElementsByTagName('button')[0].click()
            }
        }
    }
    setTimeout(cy,2000)

    function bfy(){
        if(document.URL.search('study/xml/video')>1){
            window.close() }
    }
    setTimeout(bfy,600000)

    function bfyy(){
        if(document.URL.search('study/xml/tss')>1){
            location.replace(document.querySelectorAll('iframe')[1].src)}
    }
    setTimeout(bfyy,3000)
    function bfyyy(){
        if (document.URL.search('zyjsvideo')>1){
            document.querySelector('.user_choise').click()
        }
    }
    setTimeout(bfyyy,3000)
})();