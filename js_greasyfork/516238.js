// ==UserScript==
// @name         2024-重庆法制普法考试-导出100道题目，代刷vx:shuake345|软件效果：https://b23.tv/eQt3lug
// @namespace    代刷vx:shuake345
// @version      0.4
// @description  获取全部题目|代刷vx:shuake345|软件效果：https://b23.tv/eQt3lug
// @author       代刷vx:shuake345
// @match        *://ks.cqsdx.cn/exam/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cqsdx.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516238/2024-%E9%87%8D%E5%BA%86%E6%B3%95%E5%88%B6%E6%99%AE%E6%B3%95%E8%80%83%E8%AF%95-%E5%AF%BC%E5%87%BA100%E9%81%93%E9%A2%98%E7%9B%AE%EF%BC%8C%E4%BB%A3%E5%88%B7vx%3Ashuake345%7C%E8%BD%AF%E4%BB%B6%E6%95%88%E6%9E%9C%EF%BC%9Ahttps%3Ab23tveQt3lug.user.js
// @updateURL https://update.greasyfork.org/scripts/516238/2024-%E9%87%8D%E5%BA%86%E6%B3%95%E5%88%B6%E6%99%AE%E6%B3%95%E8%80%83%E8%AF%95-%E5%AF%BC%E5%87%BA100%E9%81%93%E9%A2%98%E7%9B%AE%EF%BC%8C%E4%BB%A3%E5%88%B7vx%3Ashuake345%7C%E8%BD%AF%E4%BB%B6%E6%95%88%E6%9E%9C%EF%BC%9Ahttps%3Ab23tveQt3lug.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function tiquTM(){
        alert('vx:shuake345')
        var TM=document.querySelectorAll("#question_area>div>span:nth-child(2)")
        var TMarray=new Array;
        //var Da_an=document.querySelectorAll("#question_area>div>span:nth-child(2)")//[0].nextElementSibling
        var Da_anarray=new Array
        for (var i=0;i<TM.length;i++){
            TMarray.push(TM[i].innerText+"换行符"+TM[i].nextElementSibling.innerText+"换行符")
        }
        console.log(TMarray)
        var textToSave = TMarray
        var filename = "试题汇总.txt";
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textToSave);
        hiddenElement.target = '_blank';
        hiddenElement.download = filename;
        hiddenElement.click();
    }
    setTimeout(tiquTM,2512)
    function TTKK(){
        if( document.getElementsByTagName('video').length!==0){
            document.getElementsByTagName('video')[0].currentTime=5800
            // clearInterval(TTKK1)
        }
    }
    //var TTKK1=setInterval(TTKK,2512)
    function QT(){
        var img =document.createElement("img");
        var img1=document.createElement("img");
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
        img.style.position = 'fixed';
        img.style.top = '0';
        img1.style.right = '250';
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
    setTimeout(QT,121)
})();