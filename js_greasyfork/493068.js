// ==UserScript==
// @name         广元市继续教育网考试专用
// @namespace    0.1代刷网课VX：shuake345
// @version      0.1
// @description  只用于《试卷标题：2024年专业技术人员公需科目继续教育试卷》考试
// @author       代刷网课VX：shuake345
// @match        *://*.gysjxjy.com/studentmanage/*
// @icon         https://img.nuannian.com/files/images/23/1019/1697723881-6511.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493068/%E5%B9%BF%E5%85%83%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%80%83%E8%AF%95%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/493068/%E5%B9%BF%E5%85%83%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%80%83%E8%AF%95%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

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
            var Bankuai=document.querySelectorAll("div.fish-spin-nested-loading.x-edu-nested-loading > div > div:nth-child(1) > div> div > div > div> div > span")
            for (var i = 0; i < Bankuai.length; i++) {
                //改这里即可，这里的数字是红色的学时数，它就会自动学zy1 和zy 2选1。
                if(Bankuai[i].attributes[1].textContent=="color: rgb(233, 91, 86);"){
                    Bankuai[i].click()
                    break;
                }
            }
        }
    }
  

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
            //var sps=document.getElementsByTagName('video')[0]
            if (document.getElementsByClassName('course-video-reload').length > 0) {
                var kec = document.getElementsByClassName('resource-item resource-item-train')//document.querySelectorAll("div.resource-item ")
                var kecnum = kec.length

                }
            if(document.querySelector("div.resource-item.resource-item-train.resource-item-active")!==null){//播放的视频
                if(document.querySelector("div.resource-item.resource-item-train.resource-item-active").querySelector('i').title=='已学完'){//
                    if(document.querySelector('[class="iconfont icon_checkbox_linear"]')!==null){//完全没看的
                        document.querySelector('[class="iconfont icon_checkbox_linear"]').click()
                    }else if(document.querySelector('[class="iconfont icon_processing_fill"]')!==null){//看来一部分的
                        document.querySelector('[class="iconfont icon_processing_fill"]').click()
                    }else{setTimeout(gbclose,121)}

                }
            }
            if(document.getElementsByTagName('video').length==1){
                var INGtime=document.querySelector("span.vjs-current-time-display").innerText
                var Alltime=document.querySelector("span.vjs-duration-display").innerText
                if(document.getElementsByTagName('video')[0].paused){
                    if(INGtime!==Alltime){
                        document.getElementsByTagName('video')[0].play()
                    }else{//close
                        document.querySelector('[class="iconfont icon_checkbox_linear"]').click()
                        setTimeout(gbclose,1212)
                    }
                }
                document.getElementsByTagName('video')[0].volume=0
            }
            if(document.querySelector("div.fish-modal-content > div > div > div.fish-modal-confirm-btns > button")!==null){//完成视频后才能得到学分（确定）
                document.querySelector("div.fish-modal-content > div > div > div.fish-modal-confirm-btns > button").click()
            }
            if(document.getElementsByClassName('fa fa-circle-o').length>0){//单选
                danxuan=document.getElementsByClassName('fa fa-circle-o')
                for (var m = 0; m < danxuan.length; m++) {
                    danxuan[m].click()
                    document.getElementsByClassName('submit')[0].click()
                }
            }
            if(document.getElementsByClassName('fa fa-square-o').length>0){//多选
                danxuan=document.getElementsByClassName('fa fa-square-o')
                for (var n = 0; n < danxuan.length; n++) {
                    danxuan[n].click()
                    document.getElementsByClassName('submit')[0].click()
                }
            }
            if(document.getElementsByClassName('question-input').length>0){//填空
                danxuan=document.getElementsByClassName('question-input')
                for (var o = 0; o < danxuan.length; o++) {
                    danxuan[o].value=document.getElementsByClassName('answer-tips')[o].nextSibling.nodeValue
                    document.getElementsByClassName('submit')[0].click()
                }
            }





        }
    }

    function danze(){//单独选择没有完成 的。
        var jd=document.getElementsByClassName('four')
        for (var l = 0; l < jd.length; l++) {
            if(jd[l].innerText!=="100%"){
                var danxuan=document.getElementsByClassName('fa fa-circle-o')
                if(danxuan.length==0){
                    jd[l].click()
                    break;
                }
            }else if(l==jd.length-1){//全完成
                setTimeout(gb,1420)
            }

        }
    }
    function QT(){
        var img1=document.createElement("img");
        img1.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";
        img1.style="width:230px; height:230px;"
        img1.style.position = 'fixed';
        img1.style.top = '0';
        img1.style.right = '0';
        img1.style.zIndex = '9999';
        document.body.appendChild(img1);
    }
    setTimeout(QT,1541)
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
    function dt(){
        if(document.querySelector('iframe')!==null){
            var dms=document.querySelector('iframe').contentWindow.document.querySelectorAll("#ei_Container > div > div.ques_Context > ul")
            for (var i=0;i<40;i++){
                        dms[i].querySelectorAll('label')[1].click()
                }
        alert('注意：本脚本的答案只用于《2024年专业技术人员公需科目继续教育试卷》，如果第一次考试没有90分，说明题目已经变化更新，需更换题库，千万别再次尝试答题。否则机会用完后就没机会了')
        }
    }
    setTimeout(dt,2121)
    function tj(){
        document.querySelector('iframe').contentWindow.document.querySelector("#submitExam").click()
    }
    setTimeout(tj,5424)

})();