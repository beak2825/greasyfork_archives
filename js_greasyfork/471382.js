// ==UserScript==
// @name         教师学习平台-没有时间显示，但是需要120分钟1换门课
// @namespace    study.yanxiu
// @version      0.1
// @description  自动学习|自动换课|全自动|切勿手动|换号请输入1|vx:shuake345
// @author       vx:shuake345
// @match        http://*.study.teacheredu.cn/*
// @match        http://study.yanxiu.jsyxsq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teacheredu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471382/%E6%95%99%E5%B8%88%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E6%B2%A1%E6%9C%89%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA%EF%BC%8C%E4%BD%86%E6%98%AF%E9%9C%80%E8%A6%81120%E5%88%86%E9%92%9F1%E6%8D%A2%E9%97%A8%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/471382/%E6%95%99%E5%B8%88%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E6%B2%A1%E6%9C%89%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA%EF%BC%8C%E4%BD%86%E6%98%AF%E9%9C%80%E8%A6%81120%E5%88%86%E9%92%9F1%E6%8D%A2%E9%97%A8%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var FirstTimeLook
    document.addEventListener("visibilitychange", function() {
    if (document.visibilityState == "visible") {
        if(document.URL.search('course_list_new')>1 ){
            setTimeout(Zy,4254)
        }
    }
    });

    var dRq = new Date();
    var yr = dRq.getFullYear()+''

    window.alert=function(){}
    window.onbeforeunload = null
    window.confirm=function(){
    return true
    }

    function Zy(){
    if(document.URL.search('course_list_new')>20){
       //console.log(FirstTimeLook)
        if(FirstTimeLook==undefined){
        FirstTimeLook=prompt('输入“1”')
        }
        var Looked = localStorage.getItem('key')
        var Name0=document.getElementsByClassName('kcal_title')
        var NameNum=Name0.length
        var Clicked=document.getElementsByClassName('qxx')
        if(FirstTimeLook==1){
            localStorage.clear('key')
            Clicked[0].click()
            FirstTimeLook=2
            return;
        }
        for (var l=0;l<NameNum;l++){
            if(Looked.indexOf(Name0[l].title)==-1){//不包含，点击
                Clicked[l].click()
                break;
               }else if(l==NameNum-1){
                   if(document.getElementsByClassName('page_label')[document.getElementsByClassName('page_label').length-1].innerText.search('页')>0){
                   document.getElementsByClassName('page_label')[document.getElementsByClassName('page_label').length-1].click()
                       setTimeout(Zy,3254)
                   }
               }
        }
    }
    }
    setTimeout(Zy,4254)

    function Cy(){
    if(document.URL.search('courseId')>20){
        var Name
            if(document.getElementsByClassName('fl')[0].innerText.split('：').length==3){
            Name=document.getElementsByClassName('fl')[0].innerText.split('：')[1]+"："+document.getElementsByClassName('fl')[0].innerText.split('：')[2]
            }else{
            Name=document.getElementsByClassName('fl')[0].innerText.split('：')[1]
            }
            localStorage.setItem('key',localStorage.getItem('key')+Name)
            exitStudy(this.title);return ture;
        }
            }
    setInterval(Cy,10800000)
    function Sy(){
    if(document.URL.search('courseListNew')>20){
        window.close();
    }
    }
    setInterval(Sy,1520)

})();