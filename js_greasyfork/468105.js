// ==UserScript==
// @name         zikao365-湖南师范大学自学考试社会考生网络助学平台【视频可以秒刷】-【考试软件】
// @include        *://*.91huayi.com/*
// @include        *://*.zikao365.com/*
// @version      0.2
// @description  视频可以秒刷|考试需要软件|秒刷，代刷VX：shuake345
// @grant        none
// @namespace https://greasyfork.org/users/1072479
// @downloadURL https://update.greasyfork.org/scripts/468105/zikao365-%E6%B9%96%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E7%A4%BE%E4%BC%9A%E8%80%83%E7%94%9F%E7%BD%91%E7%BB%9C%E5%8A%A9%E5%AD%A6%E5%B9%B3%E5%8F%B0%E3%80%90%E8%A7%86%E9%A2%91%E5%8F%AF%E4%BB%A5%E7%A7%92%E5%88%B7%E3%80%91-%E3%80%90%E8%80%83%E8%AF%95%E8%BD%AF%E4%BB%B6%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/468105/zikao365-%E6%B9%96%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E7%A4%BE%E4%BC%9A%E8%80%83%E7%94%9F%E7%BD%91%E7%BB%9C%E5%8A%A9%E5%AD%A6%E5%B9%B3%E5%8F%B0%E3%80%90%E8%A7%86%E9%A2%91%E5%8F%AF%E4%BB%A5%E7%A7%92%E5%88%B7%E3%80%91-%E3%80%90%E8%80%83%E8%AF%95%E8%BD%AF%E4%BB%B6%E3%80%91.meta.js
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
             
 
    }
function KsKaoshi1(){
             
 
 
    }
 
 
 
})();