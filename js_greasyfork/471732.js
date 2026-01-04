// ==UserScript==
// @name         yxlearning-济宁专业技术人员继续教育管理服务平台--济宁职业技术学院专技人员公需科目
// @namespace    代刷网课：vx:shuake345
// @version      0.1
// @description  代刷网课：vx:shuake345
// @author       代刷网课：vx:shuake345
// @match        *://sdjn-gxk.yxlearning.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yxlearning.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471732/yxlearning-%E6%B5%8E%E5%AE%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%AE%A1%E7%90%86%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0--%E6%B5%8E%E5%AE%81%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E4%B8%93%E6%8A%80%E4%BA%BA%E5%91%98%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/471732/yxlearning-%E6%B5%8E%E5%AE%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%AE%A1%E7%90%86%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0--%E6%B5%8E%E5%AE%81%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E4%B8%93%E6%8A%80%E4%BA%BA%E5%91%98%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var xzt=0
    var Duoxzt=0
    function sx() {
		window.location.reload()
	}
    function zy(){
        var tm=document.querySelectorAll("div.progress.video-progress>div")//[0].attributes["style"].value.search('100')
        //document.querySelector("li.clearfix.videoLi.active").querySelector('.progress.video-progress')
        if(document.querySelector("li").querySelector('.progress.video-progress>div')!==null){
            if(document.querySelector("li").querySelector('.progress').attributes[2].value.search('100')>0){//no100
            }
        }

        if(document.querySelector("div.modal-")!==null){
        document.querySelector("div.modal-scrollable").click()
        sx()
        }
     /*for (var i=0;i<tm.length;i++){
            if(tm[i].attributes[2].value.search('100')>0){
            tm[i+3].querySelector('button.btn.btn-link.btn-block').click()
                //document.querySelectorAll('tr>td')[11].querySelector('button.btn.btn-link.btn-block').click()
            }
        }*/
    }
    setInterval(zy,5000)

    function next(){
        if(document.querySelector("li").nextElementSibling!==null){
        document.querySelector("li").nextElementSibling.click()
        }else{
        document.querySelector("li").parentElement.parentElement.nextElementSibling.querySelector('.clearfix.videoLi').click()
        }
    }
    function dati(){//答题
        var xuanxiang=document.querySelectorAll(" div > div.pv-ask-modal-wrap > div > div.pv-ask-content.pv-ask-content-noimg > div.pv-ask-right > div > div > label")
        var Tijiao=document.querySelector("div > div.pv-ask-modal-wrap > div > div.pv-ask-foot > button.pv-ask-submit")//.click()
        if(document.getElementsByClassName('ccQuestionList').length>0){
            setTimeout(datixuan,2000)
        }
        if(xuanxiang.length>0){
            if(xzt>=xuanxiang.length){xzt=0}
            xuanxiang[xzt].click()
            Tijiao.click()
                xzt++
        }
       if(document.getElementById('rightBtn')!==null){
       document.getElementById('rightBtn').click()
       }
    }
    function datixuan(){
        var dtfu=document.getElementsByClassName('sdagsd')[0]

        if(document.getElementsByClassName('sdgas').length==0){//单选
        dtfu.querySelectorAll('li>i')[0].click()
            $('#ccQuestionSubmit').click()
            setTimeout(Tj,241)
        setTimeout(function (){
        dtfu.querySelectorAll('li>i')[1].click()
            $('#ccQuestionSubmit').click()
            setTimeout(Tj,241)
        },2000)
        setTimeout(function (){
        dtfu.querySelectorAll('li>i')[2].click()
            $('#ccQuestionSubmit').click()
            setTimeout(Tj,241)
        },4000)
        setTimeout(function (){
        dtfu.querySelectorAll('li>i')[3].click()
            $('#ccQuestionSubmit').click()
            setTimeout(Tj,241)
        },6000)
        }else{//多选
            var Duox=document.getElementsByClassName('gsdgds')
            var TImu=document.getElementsByClassName('text fl')[0].innerText
            var Duoxuanxiang=document.getElementsByClassName('checkboxBg')
            if(TImu=="黄河流域存在的主要问题："){
                for (var i=0;i<Duox.length;i++){
                    Duox[i].click()
                }
                setTimeout(Tj,1241)
            }else if (Duoxuanxiang.length == 3) { //3选项
					if (Duoxzt == 0) { //ABC
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[2].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 1) { //AB
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 2) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[2].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 3) {
						Duoxuanxiang[2].click()
						Duoxuanxiang[1].click()
						Duoxzt = 0
						setTimeout(Tjjjj, 1254)
					}
				} else if (Duoxuanxiang.length == 4) { //4选项
					if (Duoxzt == 0) { //ABCD
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[2].click()
						Duoxuanxiang[3].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 1) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[2].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 2) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[2].click()
						Duoxuanxiang[3].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 3) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[3].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 4) {
						Duoxuanxiang[3].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[2].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 5) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 6) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[2].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 7) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[3].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 8) {
						Duoxuanxiang[2].click()
						Duoxuanxiang[1].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 9) {
						Duoxuanxiang[3].click()
						Duoxuanxiang[1].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 10) {
						Duoxuanxiang[2].click()
						Duoxuanxiang[3].click()
						Duoxzt = 0
						setTimeout(Tjjjj, 1254)
					}
				} else if (Duoxuanxiang.length == 5) {
					//5选项
					if (Duoxzt == 0) { //ABCDE
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[2].click()
						Duoxuanxiang[3].click()
						Duoxuanxiang[4].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 1) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[2].click()
						Duoxuanxiang[4].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 2) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[2].click()
						Duoxuanxiang[3].click()
						Duoxuanxiang[4].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 3) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[3].click()
						Duoxuanxiang[4].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 4) {
						Duoxuanxiang[3].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[2].click()
						Duoxuanxiang[4].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 5) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[4].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 6) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[2].click()
						Duoxuanxiang[4].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 7) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[3].click()
						Duoxuanxiang[4].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 8) {
						Duoxuanxiang[2].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[4].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 9) {
						Duoxuanxiang[3].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[4].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 10) {
						Duoxuanxiang[2].click()
						Duoxuanxiang[3].click()
						Duoxuanxiang[4].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 11) { //ABCD
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[2].click()
						Duoxuanxiang[3].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 12) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[2].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 13) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[2].click()
						Duoxuanxiang[3].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 14) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[3].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 15) {
						Duoxuanxiang[3].click()
						Duoxuanxiang[1].click()
						Duoxuanxiang[2].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 16) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[1].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 17) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[2].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 18) {
						Duoxuanxiang[0].click()
						Duoxuanxiang[3].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 19) {
						Duoxuanxiang[2].click()
						Duoxuanxiang[1].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 20) {
						Duoxuanxiang[3].click()
						Duoxuanxiang[1].click()
						Duoxzt++
						setTimeout(Tjjjj, 1254)
					} else if (Duoxzt == 21) {
						Duoxuanxiang[2].click()
						Duoxuanxiang[3].click()
						Duoxzt = 0
						setTimeout(Tjjjj, 1254)
					}
                }

        }
    }
    function Tj(){
        $('#sdgdsaga').click()
    $('#rightBtn').click()
    }
    function Tjjjj() {
		$('#gsdga').click()
    $('#rightBtn').click()
	}
     function Tjjj() {
		$('#gsdgasd').click()
    $('#rightBtn').click()
	}
    // Your code here...
})();