// ==UserScript==
// @name         2023年阳西县中小学教师全员培训-百练网-v3-lt-edu
// @namespace    vx:shuake345
// @version      0.1
// @description  vx:shuake345
// @author       vx:shuake345
// @match        *://v3.dconline.net.cn/*
// @match        *://*.lt-edu.net/*
// @match        *://*.dccloud.com.cn/*
// @match        https://edu.wkw.net.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lt-edu.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488970/2023%E5%B9%B4%E9%98%B3%E8%A5%BF%E5%8E%BF%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD-%E7%99%BE%E7%BB%83%E7%BD%91-v3-lt-edu.user.js
// @updateURL https://update.greasyfork.org/scripts/488970/2023%E5%B9%B4%E9%98%B3%E8%A5%BF%E5%8E%BF%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD-%E7%99%BE%E7%BB%83%E7%BD%91-v3-lt-edu.meta.js
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
                var jxxx=document.getElementsByClassName('project-course')[0].querySelectorAll('li>div.project-courseBottom>div>span.project-courseButton')
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
                }
            }
        }}
    setTimeout(zy,3000)

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
            if(document.querySelector('[class="beyondConcealment ellipsis active"]').innerText.split(" ")[1]=="讨论"){
                var textarea = document.querySelector('textarea');
                var event = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    data: '家长的态度决定孩子的学习成绩。这里不是说家长要敦促孩子学习，给他找好学校、出高学费请家教，而是家长自己是否愿意积极学习，愿意改变，不怕失败，敢于冒险尝试创新，善于坚持。家长不珍惜时间，不勤劳持家，只注重打扮爱打麻将，孩子也难以只争朝夕，积极进取，更别提学习获得进步和成长了。'
                });
                textarea.value = '家长的态度决定孩子的学习成绩。这里不是说家长要敦促孩子学习，给他找好学校、出高学费请家教，而是家长自己是否愿意积极学习，愿意改变，不怕失败，敢于冒险尝试创新，善于坚持。家长不珍惜时间，不勤劳持家，只注重打扮爱打麻将，孩子也难以只争朝夕，积极进取，更别提学习获得进步和成长了。'; // 设置textarea的值
                textarea.dispatchEvent(event); 
                setTimeout(function (){
                    document.querySelector("div.add_comment_button > button").click()
                },100)
                setTimeout(function (){window.location.reload()},2000)
            }else if( document.getElementsByClassName('mr20').length>1){
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
            if(document.getElementsByTagName('video').length!==0){
                 document.getElementsByTagName('video')[0].play()
            }

            var menu=document.getElementsByClassName('nav_menu')
            for (var i=0;i<menu.length;i++){
                if(menu[i].querySelector('i')!==null && menu[i].querySelector('i')._prevClass!=="video_round study"){
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


            setTimeout(function (){
                if(document.getElementsByClassName('el-button el-button--default el-button--small el-button--primary ').length==1){//确定切换
                    if(document.getElementsByClassName('el-button el-button--default el-button--small el-button--primary ').length>0){
                        document.getElementsByClassName('el-button el-button--default el-button--small el-button--primary ')[0].click()
                    }
                }
            },1200)

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