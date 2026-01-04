// ==UserScript==
// @name         山东省教师教育平台-qlteacher
// @namespace    vx:shuake345
// @version      0.1
// @description  自动看课，带刷网课+++++vx:shuake345
// @author       vx:shuake345
// @match        *://v3.dconline.net.cn/*
// @match        *://*.qlteacher.com/
// @match        *://*.lt-edu.net/*
// @match        *://*.dccloud.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lt-edu.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467415/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-qlteacher.user.js
// @updateURL https://update.greasyfork.org/scripts/467415/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-qlteacher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.addEventListener("visibilitychange", function() {
    console.log(document.visibilityState);
    if(document.visibilityState == "hidden") {
    } else if (document.visibilityState == "visible") {if(document.URL.search('project_id')>1 ){setTimeout(function (){window.location.reload()},1000)}}});

    function zy(){
    if(document.URL.search('project_id')>1){
        if(document.getElementsByClassName('el-dialog__close el-icon el-icon-close').length>0){
            document.getElementsByClassName('el-dialog__close el-icon el-icon-close')[1].click()
            var jxxx=document.querySelectorAll("ul > li > div.project-courseBottom > div.project-courseInfo > span")
            var jxxx1=document.getElementsByClassName('project-course')[1].querySelectorAll('li>div.project-courseBottom>div>span.project-courseButton')
            for (var i=0;i<jxxx.length;i++){
                if(jxxx[i].innerText=="继续学习" || jxxx[i].innerText=="去学习"){
                jxxx[i].click()
                break;
            }else if(i==jxxx.length-1){
            for (var l=0;l<jxxx1.length;l++){
                if(jxxx1[l].innerText=="继续学习" || jxxx1[l].innerText=="去学习"){
                jxxx1[l].click()
                break;
            }
                                            }
        }
            }
            console.log(i)

        if(document.getElementsByClassName('video_round study').length==document.getElementsByClassName('video_round').length){
        //window.close()
        }
    }
    }}

    function sy(){
        if(document.getElementsByClassName('fs12 c-red').length>0){
            var wendang=document.getElementsByClassName('fs12 c-red')
            for (var l=0;l<wendang.length;l++){
            if(wendang[l].innerText.search('未完成')>0){
               wendang[l].nextElementSibling.click()
            }
    }
        }
    if(document.URL.search('dccloud.com')>1){
        window.close()
    }
    }
    setInterval(sy,1000)
    function sx(){
        if(document.URL.search('course_id=')>1){
    if( document.getElementsByClassName('mr20').length>1){
        if(parseInt(document.getElementsByClassName('mr20')[1].innerText.split('：')[1].split('/')[0])==parseInt(document.getElementsByClassName('mr20')[1].innerText.split('：')[1].split('/')[1])){
        window.location.reload()
        }

        }
            setTimeout(function (){window.location.reload()},600000)
        }
    }
    setInterval(sx,20000)
    function cy(){
    if(document.URL.search('course_id=')>1){
        document.getElementsByTagName('video')[0].play()
        var menu=document.getElementsByClassName('nav_menu')
        for (var i=0;i<menu.length;i++){
            if(menu[i].querySelector('i')!==null && menu[i].querySelector('i')._prevClass!=="video_round study"){//没有看完的z课程
               menu[i].querySelector('i').click()
                break;
            }else if(i==menu.length-1){//
            setTimeout(function (){
                window.close()
        },2000)
            }
    }
        if(document.getElementsByClassName('el-icon-video-play el-icon el-icon-video-pause').length>0){
        if(document.getElementsByClassName('el-icon-video-play el-icon el-icon-video-pause')[0].nextElementSibling.innerText=="已学习"){
        if( document.getElementsByClassName('video-status unstudy').length>0){
            document.getElementsByClassName('video-status unstudy')[0].click()
        }else if(document.getElementsByClassName('video-status study').length>0){
        document.getElementsByClassName('video-status study')[0].click()
        }

        }
        }

        if(document.getElementsByClassName('el-button el-button--default el-button--small el-button--primary ').length==1){//确定切换
            if(document.getElementsByClassName('el-button el-button--default el-button--small el-button--primary ').length>0){
                document.getElementsByClassName('el-button el-button--default el-button--small el-button--primary ')[0].click()
            }
        }
        /*if(document.getElementsByClassName('mr20')[1].innerText.split('/')[0].split('：')[1]==document.getElementsByClassName('mr20')[1].innerText.split('/')[1]){//0/1变1/1的时候。刷新一下
            window.location.reload()
        }*/


        if(document.getElementsByClassName('fs12 c-red').length>0){//文档是否看了
            var wendang=document.getElementsByClassName('fs12 c-red')
            for (var l=0;i<wendang.length;l++){
            if(wendang[l].innerText.search('未完成')>0){
               wendang[l].nextElementSibling.click()
            }
    }
        }

    }
    }
        setInterval(cy,5000)

})();