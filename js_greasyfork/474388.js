// ==UserScript==
// @name         华医网跳视频-2023-2个脚本同时使用
// @include        *://*.91huayi.com/*
// @version      0.1
// @description  代刷vx:shuake345
// @grant        none
// @namespace https://greasyfork.org/users/1072479
// @downloadURL https://update.greasyfork.org/scripts/474388/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%B7%B3%E8%A7%86%E9%A2%91-2023-2%E4%B8%AA%E8%84%9A%E6%9C%AC%E5%90%8C%E6%97%B6%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/474388/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%B7%B3%E8%A7%86%E9%A2%91-2023-2%E4%B8%AA%E8%84%9A%E6%9C%AC%E5%90%8C%E6%97%B6%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}

    document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search('course.aspx') > 1 ) {
				setTimeout(sxrefere, 1000)
			}
		}
	});
    var LishiDaan
    if(localStorage.getItem('OldAhtr')==null){
    LishiDaan=''
    }else{LishiDaan=localStorage.getItem('OldAhtr')}

    var LiShiTimu
    if(localStorage.getItem('OldTimu')==null){
    LiShiTimu=''
    }else{LiShiTimu=localStorage.getItem('OldTimu')}


    function fhback() {
		window.history.go(-1)
	}

	function gbclose() {
		window.close()
	}

	function sxrefere() {
		window.location.reload()
	}
    function zy(){
    if (document.URL.search('course.aspx') > 1 ){
        var Kcs=document.querySelectorAll('div.course')
        for (var i=0;i<Kcs.length;i++){
            if(Kcs[i].querySelector('img').src.search('03a')<5){
                Kcs[i].querySelector('a').click()
            }
        }
    }
    }
    setTimeout(zy,2141)
     function tsp(){
     if(document.URL.search('result.aspx')>0){
         var kcs=document.querySelectorAll('div.case3>div.left>dl>dd')
         if(kcs.length>0){
         for (var i=0;i<kcs.length;i++){
            if( document.querySelectorAll('div.case3>div.left>dl>dd>input')[i].value=="立即学习"){
            document.querySelectorAll('div.case3>div.left>dl>dd>input')[i].click()
            }
         }
         }
         }else if(document.URL.search('course_ware/course_ware_polyv.aspx')>0){
                var min=document.getElementsByClassName('pv-time-duration')[0].innerText.split(':')[0]*60*1000
                var sect=document.getElementsByClassName('pv-time-duration')[0].innerText.split(':')[1]*1000
                var sect1000= min+sect
               document.getElementsByTagName('video')[0].currentTime=7200
         setTimeout(KsKaoshi1,1545)}
             else if(document.URL.search('course_ware/course_ware_cc.aspx')>0){
                 document.getElementsByTagName('video')[0].currentTime=7200
             setTimeout(KsKaoshi,1545)
             }
     }
    setTimeout(tsp,2000)

    function KsKaoshi(){
                 document.location.href=(document.URL.replace('course_ware/course_ware_cc.aspx','pages/exam.aspx'))

    }
function KsKaoshi1(){
                   document.location.href=(document.URL.replace('course_ware/course_ware_polyv.aspx','pages/exam.aspx'))


    }



})();