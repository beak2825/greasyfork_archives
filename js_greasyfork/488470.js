// ==UserScript==
// @name         CCMTV_FastScoreUploader
// @namespace    http://tampermonkey.net/
// @version      2024-02-28
// @description  CCMTV_FastScoreUploader 1.0
// @author       青年桥东
// @match        https://yunjxs.ccmtv.cn/admin.php/wx/Ck_examiner/*
// @match        https://yunjxs.ccmtv.cn/admin.php/wx/Ck_examiner/grade/*
// @match        https://yunjxs.ccmtv.cn/admin.php/wx/Ck_examiner/formContent/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/488470/CCMTV_FastScoreUploader.user.js
// @updateURL https://update.greasyfork.org/scripts/488470/CCMTV_FastScoreUploader.meta.js
// ==/UserScript==


(function() {
    'use strict';
    
    // 读取localStorage中的formSelected值，如果没有则返回null
    var formSelected = localStorage.getItem("formSelected");
    // 如果formSelected为空
    if (formSelected == null) {
        // 设置formSelected为"R1"(391)
        localStorage.setItem("formSelected", "391");
    }

    // 读取当前网页的URL
    
    // 判断当前网页为(https://yunjxs.ccmtv.cn/admin.php/wx/Ck_examiner/info/*)出科考核参与人员列表页
    if (window.location.href.includes("https://yunjxs.ccmtv.cn/admin.php/wx/Ck_examiner/info/")) {
        // 截取info后的数字
        var match = window.location.href.match(/\/info\/(\d+)/);
        var infonum = match ? match[1] : '';
        // 将infonum记录到localStorage
        localStorage.setItem("infonum", infonum);
        // 从localStorage中读取formSelected值
        var formSelected = localStorage.getItem("formSelected");
        // 获取container元素
        var container = document.querySelector("body > div.container.page-bg > div");
        // 创建一组 Radio 按钮
        function createRadioButtons() {
            var radioGroup = document.createElement('div');

            // 创建 Radio 按钮 R1
            var radio1 = document.createElement('input');
            radio1.type = 'radio';
            radio1.name = 'radioGroup';
            radio1.value = '391';
            radio1.id = '391';
            var label1 = document.createElement('label');
            label1.innerHTML = 'R1';
            label1.setAttribute('for', '391');
            radioGroup.appendChild(radio1);
            radioGroup.appendChild(label1);

            // 创建 Radio 按钮 R2
            var radio2 = document.createElement('input');
            radio2.type = 'radio';
            radio2.name = 'radioGroup';
            radio2.value = '392';
            radio2.id = '392';
            var label2 = document.createElement('label');
            label2.innerHTML = 'R2';
            label2.setAttribute('for', '392');
            radioGroup.appendChild(radio2);
            radioGroup.appendChild(label2);

            // 创建 Radio 按钮 R3
            var radio3 = document.createElement('input');
            radio3.type = 'radio';
            radio3.name = 'radioGroup';
            radio3.value = '393';
            radio3.id = '393';
            var label3 = document.createElement('label');
            label3.innerHTML = 'R3';
            label3.setAttribute('for', '393');
            radioGroup.appendChild(radio3);
            radioGroup.appendChild(label3);

            // 根据 formSelected 值设置选中状态
            if (formSelected === '391') {
                radio1.checked = true;
            } else if (formSelected === '392') {
                radio2.checked = true;
            } else if (formSelected === '393') {
                radio3.checked = true;
            }

            return radioGroup;
        }

        // 创建确认按钮
        function createConfirmButton() {
            var button = document.createElement('button');
            button.innerHTML = '确认';
            button.addEventListener('click', function() {
                // 获取选择的 Radio 按钮的值
                var selectedRadio = document.querySelector('input[name="radioGroup"]:checked');
                if (selectedRadio) {
                    // 将选择的按钮的 id 赋值给 formSelected
                    var formSelected = selectedRadio.value;
                    localStorage.setItem("formSelected", formSelected);
                    console.log('选择的按钮的 id:', formSelected);
                    // 这里可以将 formSelected 的值用于其他操作
                } else {
                    console.log('请先选择一个按钮');
                }
            });
            return button;
        }

        // 将 Radio 按钮和确认按钮添加到页面
        function addElementsToPage() {
            var radioButtons = createRadioButtons();
            var confirmButton = createConfirmButton();

            // 创建一个容器来包裹 Radio 按钮和确认按钮
            var buttonDiv = document.createElement('div');
            buttonDiv.style.display = 'flex'; // 设置容器样式为 flex 布局
            buttonDiv.appendChild(radioButtons);
            buttonDiv.appendChild(confirmButton);

            // 添加到页面中的某个元素内，这里假设有一个 id 为 'container' 的元素
            var referenceNode = container.children[1];
            container.insertBefore(buttonDiv, referenceNode);
        }

        // 调用函数将元素添加到页面中
        addElementsToPage();

        // CSS 样式
        var cssStyles = `
        /* 样式化 Radio 按钮的外观 */
        input[type="radio"] {
            margin-right: 5px; /* 设置按钮之间的间距 */
            width: 20px; /* 设置按钮宽度 */
            height: 20px; /* 设置按钮高度 */
            cursor: pointer;
        }

        /* 触摸反馈效果 */
        input[type="radio"]:active {
            transform: scale(0.9); /* 缩小按钮大小 */
        }

        /* 样式化确认按钮 */
        button {
            padding: 10px 20px;
            background-color: #007bff; /* 设置背景色 */
            color: #fff; /* 设置文字颜色 */
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        /* 悬停样式 */
        button:hover {
            background-color: #0056b3;
        }

        /* 激活样式 */
        button:active {
            background-color: #0056b3;
            transform: translateY(1px);
        }
        `;

        // 创建并添加样式表
        var styleElement = document.createElement('style');
        styleElement.innerHTML = cssStyles;
        document.head.appendChild(styleElement);

        // 判断当前网页为(https://yunjxs.ccmtv.cn/admin.php/wx/Ck_examiner/grade/*)人员详情页
        } else if (window.location.href.includes("https://yunjxs.ccmtv.cn/admin.php/wx/Ck_examiner/grade/")) {
            console.log("人员详情页")
            // 读取用户名
            var username = document.querySelector("body > div.container.page-bg > div > div.weui-cells.weui-cells_form > div:nth-child(1) > div.weui-cell__bd > input")
            // 从localStorage中读取formSelected值
            var formSelected = localStorage.getItem("formSelected");
            // 获取元素body > div.container.page-bg > div > div:nth-child(3) > a
            var luruchengji = document.querySelector("body > div.container.page-bg > div > div:nth-child(3) > a");
            // 获取href
            var href = luruchengji.getAttribute("href");
            // 使用正则表达式匹配查询中间字符串部分
            var match = href.match(/\?(.*)$/);
            var queryString = match ? match[1] : '';
            // 生成新URL（即直接打开录入成绩，无需选择模板）
            var newURL = "https://yunjxs.ccmtv.cn/admin.php/wx/Ck_examiner/formContent/" + formSelected + "?" + queryString + "&form_id=190"
            // 读取localStorage中的usernameLast（上次打开的成绩录入页的用户名）值，如果没有则返回null
            var usernameLast = localStorage.getItem("usernameLast");
            // 读取localStorage中的infonum值
            var infonum = localStorage.getItem("infonum");
            // 如果username与usernameLast相同（上个录入的是该同志）
            if (username.value === usernameLast) {
                // 直接回到人员名单页
                window.open("https://yunjxs.ccmtv.cn/admin.php/wx/Ck_examiner/info/" + infonum, "_self");
            } else {
                // 否则打开新URL
                window.open(newURL, "_self");
            }

        // 判断当前网页为(https://yunjxs.ccmtv.cn/admin.php/wx/Ck_examiner/formContent/*)录入成绩页
        } else if (window.location.href.includes("https://yunjxs.ccmtv.cn/admin.php/wx/Ck_examiner/formContent/")) {
            // 找到所有class为core score-item的元素
            var scoreItems = document.querySelectorAll(".core.score-item");
            // 题目数
            var numQuestions = scoreItems.length;
            var datagrades = [];
            // 遍历所有scoreItems
            for (var i = 0; i < scoreItems.length; i++) {
                // 获取当前元素
                var scoreItem = scoreItems[i];
                // 获取当前元素的data-grade属性
                var dataGrade = scoreItem.getAttribute("data-grade");
                // 将dataGrade转换为数字
                var dataGradeNum = parseInt(dataGrade);
                // 将dataGrade添加到datagrades[i]
                datagrades[i] = dataGradeNum;
            }

            // 生成随机扣分
            function generateRandomLosses(numQuestions, maxScores) {
                var totalMaxScore = maxScores.reduce((a, b) => a + b, 0); // 计算所有题目的满分总和
                var minScore = 0; // 每道题的最低扣分为 0
                var totalScore = 0;
                var losses = [];

                var numLosses = 0; // 记录已经扣分的题目数量

                while (true) {
                    totalScore = 0;
                    losses = []; // 创建一个新的空数组来存储扣分
                    numLosses = 0; // 重置已扣分的题目数量

                    // 生成每道题的扣分
                    for (var i = 0; i < numQuestions; i++) {
                        var randomLoss = Math.min(3, Math.floor(Math.random() * 4));

                        // 如果随机扣分不为 0，增加已扣分题目数量
                        if (randomLoss > 0) {
                            numLosses++;
                        }

                        losses.push(randomLoss);
                        totalScore += maxScores[i] - randomLoss; // 计算总分
                    }

                    if (numLosses <= 4 && totalScore >= 86 && totalScore <= 96) {
                        // 如果已扣分的题目数量不超过 3 并且总分在指定范围内，退出循环
                        break;
                    }
                }

                return losses;
            }

            // 生成随机扣分
            var losses = generateRandomLosses(numQuestions, datagrades);

            // 遍历所有scoreItems
            for (var i = 0; i < scoreItems.length; i++) {
                // 获取当前元素
                var scoreItem = scoreItems[i];
                // 将随机生成的分数赋值给当前元素
                scoreItem.value = losses[i];
                // 触发元素的change事件
                scoreItem.dispatchEvent(new Event('change'));
            }

            // 选择所有class为reason-item的元素
            var reasonItems = document.querySelectorAll(".reason-item");
            // 遍历所有reasonItems
            for (var i = 0; i < reasonItems.length; i++) {
                // 获取当前元素
                var reasonItem = reasonItems[i];
                // 将理由赋值给当前元素
                reasonItem.value = "回答不完善";
                // 触发元素的change事件
                reasonItem.dispatchEvent(new Event('change'));
            }

            // 读取用户名
            var username = document.querySelector("body > form > div.both_c > div:nth-child(3) > span:nth-child(2)")
            // 截取括号里的内容
            var usernameText = username.innerText;
            var usernameMatch = usernameText.match(/\(([^)]*)\)/);
            var usernameLast = usernameMatch ? usernameMatch[1] : '';
            // 将usernameLast记录到localStorage
            localStorage.setItem("usernameLast", usernameLast);

            // 移动提交按钮的位置
            var submitButton = document.querySelector("#submit");
            var form_detailDiv = document.querySelector("#form_detail");
            // 将提交按钮移动到form_detailDiv的第四个元素之后
            form_detailDiv.insertBefore(submitButton, form_detailDiv.children[4]);
            // 设置提交按钮的样式
            submitButton.style.marginTop = "20px";


        } else {
            // 在其他网页上执行的代码
            console.log("欢迎使用CCMTV_FastScoreUploader");
        }
})();
