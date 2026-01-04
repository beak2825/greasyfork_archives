// ==UserScript==
// @name         浙江大学健康打卡自动化脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  节约你每天半分钟的生命
// @author       Leslie
// @match        https://healthreport.zju.edu.cn/ncov/wap/default/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415466/%E6%B5%99%E6%B1%9F%E5%A4%A7%E5%AD%A6%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/415466/%E6%B5%99%E6%B1%9F%E5%A4%A7%E5%AD%A6%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定义获取地区的callback函数 获取到地区之后再提交
    function getarea(callback) {
        document.getElementsByName("area")[0].click();
        intervalID = setInterval(function checkarea() {
            console.log(document.getElementsByName("area")[0].getElementsByTagName("input")[0].value);
            if(document.getElementsByName("area")[0].getElementsByTagName("input")[0].value != "") {
                clearInterval(intervalID);
                callback()
            }
        }, 1000);
    };

    var intervalID = null;
    // 特殊的选项
    var keywordsSp = ["sfqrxxss"];
    // 需要选是的选项
    var keywordsYes = ["sfzgn", "sfzx"];
    // 需要选否的选项
    var keywordsNo = ["sffrqjwdg", "sfymqjczrj", "zgfx14rfh", "sfcxzysx", "sfhsjc", "jrsfqzfy",
                      "jrsfqzys", "sfcyglq", "sfyqjzgc", "sfjcqz", "sfjcbh",
                      "sfcxtz", "tw", "sfqtyyqjwdg"];
    for(var i = 0; i < keywordsNo.length; i++) {
        try {
            var selection = document.getElementsByName(keywordsNo[i]);
            selection[0].getElementsByTagName("span")[3].click();
        } catch (err) {
            alert(keywordsNo[i] + err.message);
        }
    }
    selection = document.getElementsByName("sfsqhzjkk");
    selection[0].getElementsByTagName("span")[1].click();
    Vue.nextTick( function() {
        selection = document.getElementsByName("sqhzjkkys");
        selection[0].getElementsByTagName("span")[1].click();
    })
    for(i = 0; i < keywordsYes.length; i++) {
        try {
            selection = document.getElementsByName(keywordsYes[i]);
            selection[0].getElementsByTagName("span")[1].click();
        } catch (err) {
            alert(keywordsNo[i] + err.message);
        }
    }
    selection = document.getElementsByName("sfqrxxss");
    selection[0].getElementsByTagName("span")[0].click();
    getarea(function(){
        selection = document.getElementsByClassName("list-box");
        selection[0].getElementsByClassName("footers")[0].getElementsByTagName("a")[0].click();
        Vue.nextTick( function() {
            var confirm = document.getElementsByClassName("wapcf-btn wapcf-btn-ok");
            confirm[0].click();
        })
    });
    //wapcf-btn wapcf-btn-ok
    // Your code here...
})();