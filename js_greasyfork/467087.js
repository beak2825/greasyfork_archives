// ==UserScript==
// @name         威海专技人员公需科目--多选版
// @namespace    带刷vx:shuake345
// @version      0.1
// @description  带刷vx:shuake345
// @author       带刷vx:shuake345
// @match        *://sdwh-gxk.yxlearning.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yxlearning.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467087/%E5%A8%81%E6%B5%B7%E4%B8%93%E6%8A%80%E4%BA%BA%E5%91%98%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE--%E5%A4%9A%E9%80%89%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/467087/%E5%A8%81%E6%B5%B7%E4%B8%93%E6%8A%80%E4%BA%BA%E5%91%98%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE--%E5%A4%9A%E9%80%89%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var xzt=0
    var Duoxzt=0
    function zy(){
        var tm=document.querySelectorAll('tr>td')//[8].innerText=='未完成学习'
     for (var i=0;i<tm.length;i++){
            if(tm[i].innerText=='未完成学习'){
            tm[i+3].querySelector('button.btn.btn-link.btn-block').click()
                //document.querySelectorAll('tr>td')[11].querySelector('button.btn.btn-link.btn-block').click()
            }
        }
    }
    setInterval(zy,5000)

    function Tjjjj(){
    document.querySelector("div > div.pv-ask-modal-wrap > div > div.pv-ask-foot > button.pv-ask-submit").click()
    }

    function dati(){//答题
        var xuanxiang=document.querySelectorAll(" div > div.pv-ask-modal-wrap > div > div.pv-ask-content.pv-ask-content-noimg > div.pv-ask-right > div > div > input")
        var Tijiao=document.querySelector("div > div.pv-ask-modal-wrap > div > div.pv-ask-foot > button.pv-ask-submit")//.click()
        if(document.getElementsByClassName('ccQuestionList').length>0){
            setTimeout(datixuan,2000)
        }

        if(xuanxiang.length>0){
            //多选
            var Duoxuanxiang=document.querySelectorAll(" div > div.pv-ask-modal-wrap > div > div.pv-ask-content.pv-ask-content-noimg > div.pv-ask-right > div > div > input")
            if(Duoxuanxiang[0].attributes[1].value=="checkbox"){
                if(Duoxuanxiang.length==3){//3选项
                    if(Duoxzt==0){//ABC
                    Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[2].click()
                        Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==1){//AB
                    Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                        Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==2){
                    Duoxuanxiang[0].click()
                        Duoxuanxiang[2].click()
                        Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==3){
                    Duoxuanxiang[2].click()
                        Duoxuanxiang[1].click()
                        Duoxzt=0
                        setTimeout(Tjjjj,1254)
                    }
                }else if(Duoxuanxiang.length==4){//4选项
                    if(Duoxzt==0){//ABCD
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[3].click()
                        Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==1){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[2].click()
                        Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==2){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[3].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==3){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[3].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==4){
                        Duoxuanxiang[3].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[2].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==5){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==6){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[2].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==7){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[3].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==8){
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[1].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==9){
                        Duoxuanxiang[3].click()
                        Duoxuanxiang[1].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==10){
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[3].click()
                        Duoxzt=0
                        setTimeout(Tjjjj,1254)
                    }
                }else if(Duoxuanxiang.length==5){
                    //5选项
                    if(Duoxzt==0){//ABCDE
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[3].click()
                        Duoxuanxiang[4].click()
                        Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==1){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[4].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==2){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[3].click()
                        Duoxuanxiang[4].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==3){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[3].click()
                        Duoxuanxiang[4].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==4){
                        Duoxuanxiang[3].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[4].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==5){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[4].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==6){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[4].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==7){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[3].click()
                        Duoxuanxiang[4].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==8){
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[4].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==9){
                        Duoxuanxiang[3].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[4].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==10){
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[3].click()
                        Duoxuanxiang[4].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==11){//ABCD
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[3].click()
                        Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==12){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[2].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==13){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[3].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==14){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[3].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==15){
                        Duoxuanxiang[3].click()
                        Duoxuanxiang[1].click()
                        Duoxuanxiang[2].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==16){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[1].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==17){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[2].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==18){
                        Duoxuanxiang[0].click()
                        Duoxuanxiang[3].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==19){
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[1].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==20){
                        Duoxuanxiang[3].click()
                        Duoxuanxiang[1].click()
                    Duoxzt++
                        setTimeout(Tjjjj,1254)
                    }else if(Duoxzt==21){
                        Duoxuanxiang[2].click()
                        Duoxuanxiang[3].click()
                        Duoxzt=0
                        setTimeout(Tjjjj,1254)
                    }

                }
            }else {
            if(xzt>=xuanxiang.length){xzt=0}
            xuanxiang[xzt].click()
            setTimeout(Tjjjj,1254)
                xzt++
            }
        }
       if(document.getElementById('rightBtn')!==null){
       document.getElementById('rightBtn').click()
       }
    }
    setInterval(dati,5000)

    function datixuan(){
        var dtfu=document.getElementsByClassName('ccQuestionList')[0]
        dtfu.querySelectorAll('li>i')[0].click()
            $('#ccQuestionSubmit').click()
            $('#rightBtn').click()
        setTimeout(function (){
        dtfu.querySelectorAll('li>i')[1].click()
            $('#ccQuestionSubmit').click()
            $('#rightBtn').click()
        },2000)
        setTimeout(function (){
        dtfu.querySelectorAll('li>i')[2].click()
            $('#ccQuestionSubmit').click()
            $('#rightBtn').click()
        },4000)
        setTimeout(function (){
        dtfu.querySelectorAll('li>i')[3].click()
            $('#ccQuestionSubmit').click()
            $('#rightBtn').click()
        },6000)
    }
    // Your code here...
})();