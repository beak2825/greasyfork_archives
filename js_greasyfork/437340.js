// ==UserScript==
// @name         国科大SEP自动评教
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1
// @description  一键选择对课程或者对老师的评价，免去繁琐的点击环节。
// @author       无双愣坑
// @match        *jwxk.ucas.ac.cn/evaluate/*
// @icon         https://bkimg.cdn.bcebos.com/pic/0df3d7ca7bcb0a46162bebcb6163f6246b60af33?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxMTY=,g_7,xp_5,yp_5/format,f_auto
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437340/%E5%9B%BD%E7%A7%91%E5%A4%A7SEP%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/437340/%E5%9B%BD%E7%A7%91%E5%A4%A7SEP%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var radioList = []; // 所有单选
    var textList = []; // 所有文本
    var head = document.getElementsByTagName('thead');
    if (location.pathname.indexOf('evaluateTeacher') != -1) {
        // 评估老师
        console.log('教师评估');
        for (let i = 498; i <= 524; i++) {
            // radio的name是item_498到524，迭代生成字符串匹配name，其中510和511是文本输入框
            let radio = document.getElementsByName("item_" + i);
            if (radio.length == 5) { // 只保留单选radio
                radioList.push(document.getElementsByName("item_" + i))
            }
        }
        for (let n = 0; n <= 4; n++) {
            head[0].childNodes.item(1).childNodes.item(5 + 2 * n).onclick = function() {selectRadio(false, n, radioList)};
        }
        head[0].childNodes.item(1).childNodes.item(3).onclick = function() {selectRadio(true, 0, radioList)};
    } else {
        // 评估课程
        console.log('课程评估');
        for (let i = 453; i <= 496; i++) {
            // radio的name是item_498到524，迭代生成字符串匹配name，其中510和511是文本输入框
            let radio = document.getElementsByName("item_" + i);
            if (radio.length == 5) { // 只保留单选radio
                radioList.push(document.getElementsByName("item_" + i))
            }
        }
        for (let n = 0; n <= 4; n++) {
            head[0].childNodes.item(1).childNodes.item(5 + 2 * n).onclick = function() {selectRadio(false, n, radioList)};
        }
        head[0].childNodes.item(1).childNodes.item(3).onclick = function() {selectRadio(true, 0, radioList)};
    }
    function selectRadio(isRandom, num, radioList) {
        // 选择选项，当israndom为真时随机选择，否则均选择第num个，num=01234，分别对应非常满意到非常不满
        if (isRandom) {
            // 随机选择
            for (let i = 0; i < radioList.length; i++) {
                var n = Math.floor(Math.random() * 5);
                radioList[i][n].click(); // 点选第n个选项，n为随机整数01234
            }
        } else {
            // 选择第num个
            for (let i = 0; i < radioList.length; i++) {
                radioList[i][num].click(); // 点选第n个选项
            }
        }
    }
})();