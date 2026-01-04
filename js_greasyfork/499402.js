// ==UserScript==
// @name         山东省教师2024-智慧学习平台-幼儿园“互联网+教师专业发展”刷网课vx：shuake345
// @namespace    带刷网课vx：shuake345
// @version      0.1
// @description  自动看课|自动切换|刷网课vx：shuake345
// @author       刷网课vx：shuake345
// @match        *://*.qlteacher.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qlteacher.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499402/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%882024-%E6%99%BA%E6%85%A7%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E5%B9%BC%E5%84%BF%E5%9B%AD%E2%80%9C%E4%BA%92%E8%81%94%E7%BD%91%2B%E6%95%99%E5%B8%88%E4%B8%93%E4%B8%9A%E5%8F%91%E5%B1%95%E2%80%9D%E5%88%B7%E7%BD%91%E8%AF%BEvx%EF%BC%9Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/499402/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%882024-%E6%99%BA%E6%85%A7%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E5%B9%BC%E5%84%BF%E5%9B%AD%E2%80%9C%E4%BA%92%E8%81%94%E7%BD%91%2B%E6%95%99%E5%B8%88%E4%B8%93%E4%B8%9A%E5%8F%91%E5%B1%95%E2%80%9D%E5%88%B7%E7%BD%91%E8%AF%BEvx%EF%BC%9Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var num=0 //-----------如果刷“能力点课程”，就写0，如果刷“通识类课程”就写1

    var plan//这里不用改
    /*—————————分割线———————————————————————————————————————*/

    function sx(){window.location.reload()}
    function gbclose() {
		window.close()
	}
    function bfy(){
    if(document.URL.search('learning')>1){
        if(document.querySelector('i.fa.fa-dot-circle-o.text-warning')!==null){
            document.querySelector('i.fa.fa-dot-circle-o.text-warning').click()
        }else if(document.querySelector('span.text-success')!==null ){
           if(document.querySelector('span.text-success').innerText==" 已完成"){window.history.go(-1)}
        }else if(document.querySelector('i.fa.fa-circle-o')!==null){
        document.querySelector('i.fa.fa-circle-o').click()
        }else if(document.querySelectorAll('i.fa.fa-play.mr-025').length==document.querySelectorAll('i.fa.fa-check-circle-o.text-success').length){window.close()}
        }
    }
    setInterval(bfy,6000)
    function spbf(){
        if(document.querySelector('video')!==null){
        document.querySelector('video').play()
        }
    }
    setInterval(spbf,5000)
    function ks(){
    if(document.getElementsByClassName('form-check-input ng-untouched ng-pristine ng-valid').length>0){
        var imgs=document.getElementsByClassName('form-check-input ng-untouched ng-pristine ng-valid')
    for (var i=0;i<imgs.length;i++){imgs[i].click()}
    }
        document.getElementsByClassName('btn btn-info')[0].click()
        document.getElementsByClassName('layui-layer-btn0')[0].click()

    }
setInterval(ks,5000)
    function Cy(){
        var KcStar=document.querySelectorAll("app-course-catalogue > ul > nz-spin > div > div > li> button > span")
        if(KcStar.length>0){
        KcStar[0].click()
        }
    }
    setTimeout(Cy,15000)

})();