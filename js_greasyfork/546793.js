// ==UserScript==
// @name         智慧中小学暑假研修自动学习
// @namespace    国家中小学
// @version      0.1
// @description  2025年新版本|更新新版|代刷vx:shuake345
// @author       vx:shuake345
// @match        *://www.zxx.edu.cn/*
// @match        *.smartedu.cn/*
// @icon         https://www.google.com/s2/favicons?domain=zxx.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546793/%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%9A%91%E5%81%87%E7%A0%94%E4%BF%AE%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/546793/%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%9A%91%E5%81%87%E7%A0%94%E4%BF%AE%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    window.onbeforeunload = null
    //window.onbeforeunload='return true'
    //window.onbeforeunload = function(e) {return null}
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState == "visible") {
            if (document.URL.search('cn/training') > 1) {
                setTimeout(sx, 2000)
            }
        }
    });
    function gb(){
        if (document.URL.search('vocational/v') > 1) {
            window.close()
        }
    }
    setTimeout(gb,900000)

    function sx() {
        window.location.reload()
    }

    function zy1(){
        if (document.URL.search('cn/training') > 1) {
            var Bankuai=document.querySelectorAll('div.fish-tabs-nav-list>div.fish-tabs-tab')
            for (var i = 0; i < Bankuai.length; i++) {
                Bankuai[i].click()
            }
        }
    }
    //setTimeout(zy1,4400)
    function zy() {
        if (document.URL.search('cn/training') > 1) {
            var xxnum = document.querySelectorAll('[style="color: rgb(233, 91, 86);"]')
            if(xxnum[0].className==xxnum[1].className){
                xxnum[0].click()
            }else{
                xxnum[1].click()
            }
        }
    }
    setTimeout(zy,15524)

    function cy() {
        if (document.URL.search('courseIndex') > 1) {
            if (document.querySelectorAll(" div > section > div > div > div> a").length > 0) {
                document.querySelectorAll(" div > section > div > div > div> a")[0].click()

            }
            if(document.querySelectorAll(" span.fish-checkbox > input").length > 0){
                document.querySelectorAll(" span.fish-checkbox > input")[0].click()
            }

        }
    }
    setInterval(cy,3145)

    function fhback() {
        window.history.go(-1)
    }

    function gbclose() {
        window.close()
    }

    function sxrefere() {
        window.location.reload()
    }


    function sy() {
        if (document.URL.search('courseDetail') > 1) {
            setTimeout(gbclose,60000*20)
            var danxuan
            /*var sps=document.getElementsByTagName('video')[0]
            if (document.getElementsByClassName('course-video-reload').length > 0) {
                    var kec = document.getElementsByClassName('resource-item resource-item-train')//展开后，所有课程
                    var kecnum = kec.length

            }
            if (sps.paused == true) {
				sps.play()
				sps.playbackRate = 16
                sps.volume=0
			}else if(sps.playbackRate !== 16){
                sps.playbackRate = 16
                sps.volume=0
            }*/
            if(document.getElementsByTagName('video').length==1){
                var INGtime=document.querySelector("span.vjs-current-time-display").innerText
                var Alltime=document.querySelector("span.vjs-duration-display").innerText
                if(document.getElementsByTagName('video')[0].paused){
                    if(INGtime!==Alltime){
                        document.getElementsByTagName('video')[0].play()
                    }else{//close
                        //document.querySelector('[class="iconfont icon_checkbox_linear"]').click()
                        //setTimeout(gbclose,1212)
                    }
                }
                document.getElementsByTagName('video')[0].volume=0
            }
            if(document.querySelector("div.fish-modal-content > div > div > div.fish-modal-confirm-btns > button")!==null){//完成视频后才能得到学分（确定）
                document.querySelector("div.fish-modal-content > div > div > div.fish-modal-confirm-btns > button").click()
            }
            if(document.getElementsByClassName('nqti-option-radio-icon').length>0){//单选
                danxuan=document.getElementsByClassName('nqti-option-radio-icon')
                for (var m = 0; m < danxuan.length; m++) {
                    danxuan[m].click()
                    document.getElementsByClassName('fish-btn fish-btn-primary')[1].click()
                }
            }
            if(document.getElementsByClassName('nqti-option-checkbox-icon').length>0){//多选
                danxuan=document.getElementsByClassName('nqti-option-checkbox-icon')
                for (var n = 0; n < danxuan.length; n++) {
                    danxuan[n].click()
                    document.getElementsByClassName('fish-btn fish-btn-primary')[1].click()
                }
            }
            if(document.getElementsByClassName('question-input').length>0){//填空
                danxuan=document.getElementsByClassName('question-input')
                for (var o = 0; o < danxuan.length; o++) {
                    danxuan[o].value=document.getElementsByClassName('answer-tips')[o].nextSibling.nodeValue
                    document.getElementsByClassName('fish-btn fish-btn-primary')[1].click()
                }
            }





        }
    }
    setInterval(sy,4542)

    function danze(){//单独选择没有完成 的。
        if(document.querySelector("div.course-video-reload")!==null){
            if(document.querySelector("div.course-video-reload").innerText=='再学一遍'){
                if(document.querySelector('[title="进行中"]')!==null){//有进行中的课程，点一下
                    document.querySelector('[title="进行中"]').click()
                }else if(document.querySelector('[title="未开始"]')!==null){//有未完成的课程，点一下
                    document.querySelector('[title="未开始"]').click()
                }else{
                    setTimeout(gb,1420)
                }
            }
        }
        /*for (var l = 0; l < jd.length; l++) {
            if(jd[l].innerText!=="100%"){
                var danxuan=document.getElementsByClassName('fa fa-circle-o')
                if(danxuan.length==0){
                    jd[l].click()
                    break;
                }
            }else if(l==jd.length-1){//全完成
                setTimeout(gb,1420)
            }

        }*/
    }
    setInterval(danze,5645)

    function sy2(){
        if (document.URL.search('courseDetail') > 1) {
            if (document.getElementsByClassName('fish-collapse-item').length > 0) {//下箭头
                var Xjt=document.getElementsByClassName('fish-collapse-item')
                for (var n = 0; n < Xjt.length; n++) {
                    Xjt[n].querySelector('i').click()
                }
            }
        }
    }
    setTimeout(sy2,8245)
    function sy1(){//打开右边的列表箭头
        if(document.querySelectorAll('div.fish-collapse-item>div>i').length>0){
            for (var m = 0; m < document.querySelectorAll('div.fish-collapse-item>div>i').length; m++) {
                document.querySelectorAll('div.fish-collapse-item>div>i')[m].click()
            }
        }
    }
    setInterval(sy1,10542)

})();