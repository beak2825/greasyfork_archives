// ==UserScript==
// @name         教师专业发展培训网-altjyed阿勒泰智慧教育云平台-edueva-秒刷vx:shuake345
// @namespace    代刷vx:shuake345
// @version      0.3
// @description  自动学习|自动换课|代刷vx:shuake345
// @author       代刷vx:shuake345
// @match        http://*.study.teacheredu.cn/*
// @match        *://*.scedu.com.cn
// @match        *://*.edueva.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teacheredu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502732/%E6%95%99%E5%B8%88%E4%B8%93%E4%B8%9A%E5%8F%91%E5%B1%95%E5%9F%B9%E8%AE%AD%E7%BD%91-altjyed%E9%98%BF%E5%8B%92%E6%B3%B0%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E4%BA%91%E5%B9%B3%E5%8F%B0-edueva-%E7%A7%92%E5%88%B7vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/502732/%E6%95%99%E5%B8%88%E4%B8%93%E4%B8%9A%E5%8F%91%E5%B1%95%E5%9F%B9%E8%AE%AD%E7%BD%91-altjyed%E9%98%BF%E5%8B%92%E6%B3%B0%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E4%BA%91%E5%B9%B3%E5%8F%B0-edueva-%E7%A7%92%E5%88%B7vx%3Ashuake345.meta.js
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
        FirstTimeLook=prompt('是否从头开始刷，输入“1”则重置进度，输入“0”则接着之前的课程顺序。（如是更换账号，请输入1）')
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
               }
        }
    }
    }
    setTimeout(Zy,4254)

    function Cy(){
    if(document.URL.search('courseId')>20){
        var Rtime
        var Nowtime
        var Name
        var SeeTime
        var Alltime=document.querySelectorAll('div.title_tab_lists>div>div.introduce_list')
        if(yr.search('3')>2){
            for (var i=0;i<Alltime.length;i++){
                if(Alltime[i].innerText.search('时长')>1){
                    Rtime=parseInt( Alltime[i].innerText.split('：')[1].split(' ')[0])
                    break;
                }
            }
        Nowtime=parseInt(document.getElementById('zonggong').innerText.split('分钟')[0])
        SeeTime=parseInt(document.getElementById('benci').innerText.split('分')[0])
        if(Nowtime+SeeTime>=Rtime){
            if(document.getElementsByClassName('fl')[0].innerText.split('：').length==3){
            Name=document.getElementsByClassName('fl')[0].innerText.split('：')[1]+"："+document.getElementsByClassName('fl')[0].innerText.split('：')[2]
            }else{
            Name=document.getElementsByClassName('fl')[0].innerText.split('：')[1]
            }
            localStorage.setItem('key',localStorage.getItem('key')+Name)
            
        }
            }
    }
    }
    setInterval(Cy,5230)
    function Sy(){
    if(document.URL.search('courseListNew')>20){
        window.close();
    }
    }
    setInterval(Sy,1520)

})();