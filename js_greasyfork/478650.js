// ==UserScript==
// @name         重庆市法治理论知识考试平台-重庆法制普法考试-导出100道题目几元+代刷vx:shuake345
// @namespace    代刷vx:shuake345
// @version      0.3
// @description  秒刷视频|获取全部题目|几元+代刷vx:shuake345|请详细看说明
// @author       代刷vx:shuake345
// @match        *://ks.cqsdx.cn/*
// @match        *://ks.cqsdx.cn/exam/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cqsdx.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478650/%E9%87%8D%E5%BA%86%E5%B8%82%E6%B3%95%E6%B2%BB%E7%90%86%E8%AE%BA%E7%9F%A5%E8%AF%86%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0-%E9%87%8D%E5%BA%86%E6%B3%95%E5%88%B6%E6%99%AE%E6%B3%95%E8%80%83%E8%AF%95-%E5%AF%BC%E5%87%BA100%E9%81%93%E9%A2%98%E7%9B%AE%E5%87%A0%E5%85%83%2B%E4%BB%A3%E5%88%B7vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/478650/%E9%87%8D%E5%BA%86%E5%B8%82%E6%B3%95%E6%B2%BB%E7%90%86%E8%AE%BA%E7%9F%A5%E8%AF%86%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0-%E9%87%8D%E5%BA%86%E6%B3%95%E5%88%B6%E6%99%AE%E6%B3%95%E8%80%83%E8%AF%95-%E5%AF%BC%E5%87%BA100%E9%81%93%E9%A2%98%E7%9B%AE%E5%87%A0%E5%85%83%2B%E4%BB%A3%E5%88%B7vx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';



    function FZ(){
        document.querySelectorAll(".layui-btn.layui-btn-warm")[2].click()
    }
    //setInterval(FZ,100)
    // Your code here...
    function tiquTM(){
prompt('代刷重庆法制考试微信:shuake345 ,请输入任意内容开始下载题目，然后用word打开，替换掉‘换行符,’这段字，即可获得100题，是否明白？')
        var TM=document.querySelectorAll("#question_area>div>span:nth-child(2)")
        var TMarray=new Array;
        for (var i=0;i<TM.length;i++){
            TMarray.push(TM[i].innerText.substr(5,document.querySelectorAll("#question_area>div>span:nth-child(2)")[1].innerText.length)+"换行符")
        }
        console.log(TMarray)
        var textToSave = TMarray
        var filename = "1.txt";

        var hiddenElement = document.createElement('a');

        hiddenElement.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textToSave);
        hiddenElement.target = '_blank';
        hiddenElement.download = filename;

        hiddenElement.click();

        clearInterval(Tiqu)

    }

    var Tiqu=setInterval(tiquTM,2512)
    function TTKK(){
        if( document.getElementsByTagName('video').length!==0){
            document.getElementsByTagName('video')[0].currentTime=5900
            clearInterval(TTKK1)
        }
    }
    var TTKK1=setInterval(TTKK,2512)
    })();