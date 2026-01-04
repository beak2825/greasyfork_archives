// ==UserScript==
// @name         国家中小学智慧平台-2024年-22日更新前版本
// @namespace    国家中小学
// @version      0.2
// @description  2024年新版本|秒刷已经被修复了|更新新版|代刷vx:shuake345
// @author       You
// @match        *://www.zxx.edu.cn/*
// @match        *.smartedu.cn/*
// @icon         https://www.google.com/s2/favicons?domain=zxx.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485441/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0-2024%E5%B9%B4-22%E6%97%A5%E6%9B%B4%E6%96%B0%E5%89%8D%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/485441/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0-2024%E5%B9%B4-22%E6%97%A5%E6%9B%B4%E6%96%B0%E5%89%8D%E7%89%88%E6%9C%AC.meta.js
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
            var xxnum = document.querySelectorAll("div.fish-spin-nested-loading.x-edu-nested-loading > div > div>div > div > div > div> div:nth-child(3) > span")
            for (var i = 0; i < xxnum.length; i++) {
                //改这里即可，这里的数字是已看学时数，只需要定义不同课程的学时数即可。
                if(parseFloat(xxnum[i].innerText)<2){//2就是2学时
                    xxnum[i].click()
                    break;
                }
            }

        }
    }
    setTimeout(zy, 5524)

    function cy() {
        if (document.URL.search('subjectType') > 1) {
            if (document.getElementsByClassName('fa fa-play').length > 0) {
                document.getElementsByClassName('fa fa-play')[0].click()

            }
            if(document.getElementsByClassName('fish-checkbox-input').length > 0){
                document.getElementsByClassName('fish-checkbox-input')[0].click()
            }
        }
    }
    setInterval(cy,3145)

    function sy() {
        if (document.URL.search('vocational/v') > 1) {
            var danxuan
            //var sps=document.getElementsByTagName('video')[0]
            if (document.getElementsByClassName('course-video-reload').length > 0) {
                if (document.getElementsByClassName('course-video-reload')[0].innerText == '再学一遍') {
                    var kec = document.getElementsByClassName('resource-item resource-item-train')
                    var kecnum = kec.length
                    for (var i = 0; i < kecnum; i++) {
                        if (kec[i].className == 'resource-item resource-item-train resource-item-active') {
                            if (i < kecnum - 1) {
                                kec[i + 1].click();
                                break;
                            } else if (i == kecnum - 1) {
                                if(document.getElementsByClassName('size').length==0 || document.getElementsByClassName('_qti-title-prefix-qtype').length==0){
                                    window.close()
                                }
                            }
                        }
                    }
                }
            }
            /*if (sps.paused == true) {
				sps.play()
				sps.playbackRate = 16
                sps.volume=0
			}else if(sps.playbackRate !== 16){
                sps.playbackRate = 16
                sps.volume=0
            }*/
            if (document.getElementsByClassName('layui-layer-btn0').length > 0) {
                document.getElementsByClassName('layui-layer-btn0')[0].click()
                /*if (document.getElementsByClassName('fish-btn fish-btn-primary')[0].innerText == '我知道了') {
					document.getElementsByClassName('fish-btn fish-btn-primary')[0].click()
				}*/
            }else if(document.getElementsByTagName('video').length<1){
                document.getElementsByClassName('xgplayer-start')[0].click()
            }else if(document.getElementsByClassName('video-title  clearfix on')[0].querySelector('span.four').innerText=="100%"){//完成视频
                setTimeout(danze,35480)
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
    setInterval(sy,4542)

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
        var img =document.createElement("img");
        var img1=document.createElement("img");
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
        img.style.position = 'fixed';
        img.style.top = '0';
        img1.style.right = '200';
        img.style.zIndex = '999';
        img.style="width:230px; height:230px;"
        document.body.appendChild(img);
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
        if (document.URL.search('vocational/v') > 1) {
            if (document.querySelectorAll('div.content>div>div>div>div>div>div>div>div>div').length > 2) {
                if(document.getElementsByClassName('size').length>0){//选择题
                    document.getElementsByClassName('size')[0].click()
                }
                //if(){}
                if (document.getElementsByClassName('fish-btn fish-btn-primary').length > 0) {
                    if(document.getElementsByClassName('fish-btn fish-btn-primary')[0].parentElement.className.search('footer')>10){
                        document.getElementsByClassName('fish-btn fish-btn-primary')[0].click()
                    }else if(document.getElementsByClassName('fish-btn fish-btn-primary').length > 1){
                        if(document.getElementsByClassName('fish-btn fish-btn-primary')[1].parentElement.className.search('footer')>10){
                            document.getElementsByClassName('fish-btn fish-btn-primary')[1].click()
                        }
                    }

                }

            }
        }
    }
    setInterval(sy2,1245)
    function sy1(){//打开右边的列表箭头
        if(document.querySelectorAll('div.fish-collapse-item>div>i').length>0){
            for (var m = 0; m < document.querySelectorAll('div.fish-collapse-item>div>i').length; m++) {
                document.querySelectorAll('div.fish-collapse-item>div>i')[m].click()
            }
        }
    }
    setInterval(sy1,10542)

})();