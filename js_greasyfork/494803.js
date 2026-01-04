// ==UserScript==
// @name         国科大杭高院SEP自动评教
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.0
// @description  一键选择对课程或者对老师的评价，免去繁琐的点击环节。
// @author       Evopower
// @match        *.ucas.ac.cn/evaluate/*
// @match        *.ucas.ac.cn
// @match        https://xkcts.ucas.ac.cn:8443/evaluate/course/*
// @match        https://xkcts.ucas.ac.cn:8443/evaluate/evaluateCourse/*
// @icon         https://bkimg.cdn.bcebos.com/pic/0df3d7ca7bcb0a46162bebcb6163f6246b60af33?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxMTY=,g_7,xp_5,yp_5/format,f_auto
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500189/%E5%9B%BD%E7%A7%91%E5%A4%A7%E6%9D%AD%E9%AB%98%E9%99%A2SEP%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/500189/%E5%9B%BD%E7%A7%91%E5%A4%A7%E6%9D%AD%E9%AB%98%E9%99%A2SEP%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var radioList = []; // 所有单选
    var textList_teacher = ['他能够将复杂的概念以生动、易懂的方式讲解给我们，总是充满热情，让课堂氛围活跃又不失专注，激发了我对这门学科的浓厚兴趣。','对于老师的教学，我几乎没有负面意见。如果非要提出些建议的话，或许可以考虑在课堂上增加一些小组讨论或者合作学习的环节，这样不仅能增进同学间的交流与合作，还能让我们从不同角度理解课程内容，促进思维的碰撞与创新。']; // 所有文本
    var textList_class = ['这门课程我最喜欢的是它将理论知识与实践案例紧密结合的教学方式，让我能够更好地理解和掌握复杂概念。','我认为本课程可以从增加更多互动环节，比如小组讨论和在线问答，以及提供更多的实践机会，如实验或项目作业，这些方面进行进一步改进和提高，以增强学习体验和应用能力。','我平均每周在这门课程上花费大约8小时，包括上课时间、自学材料、完成作业和复习。','在参与这门课程之前，我对这个学科领域已经有很高的兴趣，这也是我选择这门课程的主要原因之一。','在该课程的课堂参与度方面，我保持了很高的积极性，几乎全勤所有课程，经常主动回答老师的问题，并积极参与课堂讨论。']; // 所有课程评估
    var head = document.getElementsByTagName('thead');

    if (location.pathname.indexOf('evaluateTeacher') != -1) {
        // 评估老师
        console.log('教师评估');
        let allRadios = document.querySelectorAll('input[type="radio"][name^="item_"]');

        // 使用 Set 来存储唯一的名字以便去重
        let uniqueNames = new Set();
        for (let radio of allRadios) {
            uniqueNames.add(radio.name);
        }
        uniqueNames.forEach(name => {
            let radioGroup = document.getElementsByName(name);
            if (radioGroup.length === 5) { // 只保留单选radio且数量为5的组
                radioList.push(radioGroup);
            }
        });

        for (let n = 0; n <= 4; n++) {
            head[0].childNodes.item(1).childNodes.item(5 + 2 * n).onclick = function() {selectRadio(false, n, radioList)};
        }
        head[0].childNodes.item(1).childNodes.item(3).onclick = function() {selectRadio(true, 0, radioList)};
        console.log('函数完成');
        // 开始text部分
        let textareas = document.querySelectorAll('textarea[id^="item_"][name^="item_"][rows="5"][cols="100"][minlength="15"][maxlength="200"].required[aria-required="true"]');
        let i = 0;
        for (let single of textareas){
            single.value = textList_teacher[i];
            i=i+1;
        }
        // for (let i = 1167; i <= 1168; i++) { // 完成文本的部分
        //     document.getElementById("item_" + i).value = textList_teacher[i-1167];
        // }
    } else {
        // 评估课程
        console.log('课程评估');
        let allRadios = document.querySelectorAll('input[type="radio"][name^="item_"]');

        // 使用 Set 来存储唯一的名字以便去重
        let uniqueNames = new Set();
        for (let radio of allRadios) {
            uniqueNames.add(radio.name);
        }
        uniqueNames.forEach(name => {
            let radioGroup = document.getElementsByName(name);
            if (radioGroup.length === 5) { // 只保留单选radio且数量为5的组
                radioList.push(radioGroup);
            }
        });
        for (let n = 0; n <= 4; n++) {
            head[0].childNodes.item(1).childNodes.item(5 + 2 * n).onclick = function() {selectRadio(false, n, radioList)};
        }
        head[0].childNodes.item(1).childNodes.item(3).onclick = function() {selectRadio(true, 0, radioList)};
        let textareas = document.querySelectorAll('textarea[id^="item_"][name^="item_"][rows="5"][cols="100"][minlength="15"][maxlength="200"].required[aria-required="true"]');
        let i = 0;
        for (let single of textareas){
            single.value = textList_class[i];
            i=i+1;
        }
        let midRadios = document.querySelectorAll('input[class="required radio"][name^="radio_"]');
        console.log(midRadios)
        midRadios[0].click();
        let lastRadios = document.querySelectorAll('input[class="required checkbox"][name^="item_"]');
        for (let n = 0; n <= 4; n++) {
           lastRadios[n].click(); // 点选第0个选项
        }
    }

    // 创建一个按钮
    var startButton = document.createElement('button');
    startButton.textContent = '随机评估'; // 按钮上显示的文本
    startButton.addEventListener('click', function() {
        // 在点击按钮时选择所有的单选题
        selectRadio(true, 0, radioList); // 使用随机选择
    });
    var spacer = document.createElement('span');
    spacer.textContent = ' '; // 一个空格或其他间隔符号
    // 创建第二个按钮
    var startButton2 = document.createElement('button');
    startButton2.textContent = '满分评估'; // 按钮上显示的文本
    startButton2.addEventListener('click', function() {
        // 在点击按钮时选择所有的单选题
        console.log('开始满分评估');
        selectRadio(false, 0, radioList); // 选择0
        console.log('结束满分评估');
    });

    // 将按钮添加到页面
    var buttonContainer = document.getElementsByClassName('btnav-menu')[0]; // 获取第一个匹配的元素
    // var buttonContainer = document.getElementById('sidebar'); // 请替换为要添加按钮的容器的ID
    if (buttonContainer) {
        buttonContainer.appendChild(startButton);
    }
    var buttonContainer1 = document.getElementsByClassName('dropdown-toggle')[1]; // 获取第一个匹配的元素
    // var buttonContainer = document.getElementById('sidebar'); // 请替换为要添加按钮的容器的ID
    if (buttonContainer1) {
        buttonContainer1.appendChild(startButton2);
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
            console.log(radioList.length)
            for (let i = 0; i < radioList.length; i++) {
                console.log('点选第n个选项')
                radioList[i][num].click(); // 点选第n个选项
            }
        }
    }
})();
