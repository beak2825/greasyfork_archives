// ==UserScript==
// @name         湖南省中小学教师发展网-湖南省高校师资培训云平台-湖南人才市场网-VX-shuake345
// @namespace    全自动
// @version      0.12.2
// @description  全自动刷课|代刷VX：shuake345
// @author       代刷VX：shuake345
// @match        *://ifang.hnteacher.net/HTML/WorkShops/*
// @match        https://sts.hnteacher.net/Home/index
// @match        http://*.hunan.smartedu.cn/*
// @icon         http://ifang.hnteacher.net/HTML/WorkShops/image/head-logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507458/%E6%B9%96%E5%8D%97%E7%9C%81%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E5%8F%91%E5%B1%95%E7%BD%91-%E6%B9%96%E5%8D%97%E7%9C%81%E9%AB%98%E6%A0%A1%E5%B8%88%E8%B5%84%E5%9F%B9%E8%AE%AD%E4%BA%91%E5%B9%B3%E5%8F%B0-%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E7%BD%91-VX-shuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/507458/%E6%B9%96%E5%8D%97%E7%9C%81%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E5%8F%91%E5%B1%95%E7%BD%91-%E6%B9%96%E5%8D%97%E7%9C%81%E9%AB%98%E6%A0%A1%E5%B8%88%E8%B5%84%E5%9F%B9%E8%AE%AD%E4%BA%91%E5%B9%B3%E5%8F%B0-%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E7%BD%91-VX-shuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var Kctime='7小时'
    var n=0
    window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
    document.addEventListener("visibilitychange", function() {
    console.log(document.visibilityState);
    if(document.visibilityState == "hidden") {
        console.log('隐藏');
    } else if (document.visibilityState == "visible") {
        console.log('显示')
        if(document.URL.search('PK_ID')>1){
            setTimeout(sx,1000)}
    }
});

    function zuofei1(){
    if(document.URL.search('HTML/WorkShops/index')>1){document.querySelector("#pageMenu > a:nth-child(6)").click()}
    if(document.URL.search('HTML/WorkShops/workshop')>1){
        var Alltimes=document.querySelectorAll("#courseList > li > div > p.bottom > span.long")
        var Allkecheng=document.querySelectorAll("#courseList > li > div > p.text.cl > a")
        for (var i=0;i<Alltimes.length;i++){
                if(Alltimes[i].innerText.search(Kctime)>1){
                    Allkecheng[i].click()
                    break
                }
            }
    }
    }
    setTimeout(zuofei1,7252)
   function sx(){
        window.location.reload()
    }
    function bfy(){
    if(document.URL.search('inLessonId=')>1){
    if(document.getElementsByTagName('img')[4].title=='gorgeous'){document.getElementsByTagName('img')[4].click()}
    if(parseInt(document.getElementById('min').innerText)==parseInt(document.getElementById('_ctime').innerText)){
        localStorage.setItem('key',document.getElementById('_kjmc').innerText)
        window.close()
    }
    }
    }
    setInterval(bfy,15000)

    function zy(){
    if(document.URL.search('PK_ID')>1 ){
        if(document.getElementsByClassName('bg-blue').length>0){
        if($('.bg-blue')[0].innerText=="未学习"){
        $('.bg-blue')[1].click()
            clearInterval(zydj)
        }else{$('.bg-blue')[0].click()
             clearInterval(zydj)}
        }else{
            var KCjd=document.querySelectorAll("b.fcolor-green")
            for (var i=0;i<KCjd.length;i++){
                if(KCjd[i].innerText.search('100')<1){
                    KCjd[i].parentElement.firstChild.click()
                    clearInterval(zydj)
                    break
                }
            }
        }
    }
        }
    var zydj=setInterval(zy,8000)

    function zuizhuye(){
         if(document.URL.search('Home/index')>1){
         document.querySelector("body > div> table > tbody > tr.trcolor > td:nth-child(3) > a").click()
         }
    }
    setTimeout(zuizhuye,2121)
})();