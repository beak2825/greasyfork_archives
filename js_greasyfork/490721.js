// ==UserScript==
// @name         【tong】旧版学习通批改作业助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  新版学习通考试平台批改试卷助手
// @author       You
// @match        https://mooc1.chaoxing.com/mooc-ans/work/reviewTheContentNew?*
// @match        http://mooc1.chaoxing.com/mooc-ans/work/reviewTheContentNew?*
// @grant        GM_addStyle
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/490721/%E3%80%90tong%E3%80%91%E6%97%A7%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%89%B9%E6%94%B9%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/490721/%E3%80%90tong%E3%80%91%E6%97%A7%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%89%B9%E6%94%B9%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // console.log('我的脚本加载了');

    var button0 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button0.setAttribute("type", "button");
    button0.setAttribute("value", "批改单份");
    button0.setAttribute("style", "right: 60px;bottom: 60px;background: #004f98;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 100px;height: 60px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;");

    $("body").append(button0);

    button0.onclick = function (){
        //.js
        //step0: 获取页面上单选题和简答题的总分
        const DanXuanregex = new RegExp('单选题','u');
        const JianDaregex = new RegExp('简答题','u');
        var x = document.getElementsByClassName("Cy_TItle1");
        for (i = 0; i < x.length; i++) {
            var TiMutextContent = x[i].children[0].textContent;
            let reg = /\d+/g; //匹配所有的数字
            var resultNum = TiMutextContent.match(reg);
            if (DanXuanregex.test(TiMutextContent))  //如果是单选题
            {
                var DanXuanTotalScore = parseInt(resultNum[1]); //单选题总分
            }
            if (JianDaregex.test(TiMutextContent))  //如果是简答题
            {
                var JianDaTotalScore = parseInt(resultNum[1]); //简答题总分
            }
        }


        //step1: 获取客观题得分
        var KeGuanTiScoreNow = parseInt(document.getElementById("objScore").textContent);

        //step2：设置主观题满分
        var ZhuGuanTiScoreTotal = JianDaTotalScore;
        //var ZhuGuanTiScoreTotal = a;

        //step3: 设置主观题得分比例
        var ratioMin=0.9; //得分比例下限
        var ratioMax=1;  //得分比例上限
        let randomNum = Math.random() * (ratioMax-ratioMin) + ratioMin;

        //step4: 生成主观题得分
        var ZhuGuanTiScoreNow = Math.floor(ZhuGuanTiScoreTotal * randomNum);

        //step5: 生成总分
        var ScoreTotalNew = KeGuanTiScoreNow + ZhuGuanTiScoreNow;

        //step6: 找到得分框，赋分
        var TmpScore = document.getElementById('tmpscore');
        TmpScore.value = ScoreTotalNew;

        var event = document.createEvent('HTMLEvents');
        event.initEvent("keyup", true, true);
        TmpScore.dispatchEvent(event);

        //step7: 提交下一份
        document.getElementsByClassName('Btn_blue_1 fl')[1].click();


    };



})();