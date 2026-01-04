// ==UserScript==
// @name         2024年“寒假教师研修”-smart版本
// @namespace    国家中小学智慧教育平台
// @version      0.9
// @description  代刷vx:shuake345-国家中小学智慧教育平台
// @author       代刷vx:shuake345
// @match        *://www.zxx.edu.cn/*
// @match        https://*.vocational.smartedu.cn*
// @match        https://core.teacher.vocational.smartedu.cn/*
// @match        https://teacher.vocational.smartedu.cn/h/subject/winter2022/*
// @icon         https://www.google.com/s2/favicons?domain=zxx.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487710/2024%E5%B9%B4%E2%80%9C%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D-smart%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/487710/2024%E5%B9%B4%E2%80%9C%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D-smart%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...

    window.onbeforeunload = null

	document.addEventListener("visibilitychange", function() {
		if (document.visibilityState == "hidden") {
        if (document.URL.search('type=') > 1 ) {
				// window.close()
			}
        } else if (document.visibilityState == "visible") {
			if (document.URL.search('subject') > 1) {
				setTimeout(sx, 1000)
			}
		}
	});
    function gb(){
        if (document.URL.search('core') > 1) {
        window.close()
    }
    }

	function sx() {
		window.location.reload()
	}


	function cy() {
		if (document.URL.search('core') > 1) {
		if(document.getElementById('startStudy')!==null){
            document.getElementById('startStudy').click()
        }
            if(document.getElementsByClassName('video-title  clearfix').length!==0){
                var kc=document.getElementsByClassName('video-title  clearfix')
                for (var m = 0; m < kc.length; m++) {
                if(kc[m].querySelector('span.four').innerText!=='100%'){
                kc[m].click()
                    break;
                }
                }

            }
        }
	}
	setInterval(cy, 6145)

	function sy() {
		if (document.URL.search('core') > 1) {
            if(document.getElementsByClassName('layui-layer-btn0').length!==0){
                document.getElementsByClassName('layui-layer-btn0')[0].click()//提示有答题
            }else if(document.getElementsByClassName('fa fa-circle-o').length!==0){
                document.getElementsByClassName('fa fa-circle-o')[0].click()//选A
                 document.getElementsByClassName('submit')[0].click()//提交
            }
            document.querySelector('xg-start').click()//播放按钮
        }
	}
	setInterval(sy,2542)

    function sy1(){
    if(document.querySelectorAll('div.fish-collapse-item>div>i').length>0){
                for (var m = 0; m < document.querySelectorAll('div.fish-collapse-item>div>i').length; m++) {
                document.querySelectorAll('div.fish-collapse-item>div>i')[m].click()
                }
            }
        if(localStorage.getItem('wancheng')=='yes'){
        localStorage.setItem('wancheng','no')
            window.close()
        }

    }
    setInterval(sy1,10542)

    function sy2(){
        if (document.URL.search('core') > 1) {
        setTimeout(gb,600000)
        }

    }
    setInterval(sy2,6485)


    function Zy(){
    if (document.URL.search('winter') > 1) {
        var KCtime=document.getElementsByClassName('news_time')
        var KCimg=document.getElementsByClassName('news_img')
        for (var i = 0; i < KCtime.length;i++) {
        if(KCtime[i].innerText.search('认定 1 学时')==-1){
           KCimg[i].querySelector('a').click()
            break;
        }
        }
    }
    }
    setTimeout(Zy,3524)

})();