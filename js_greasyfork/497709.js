// ==UserScript==
// @name         韶关学院评教1
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自动发展性评教，并自动填写评论
// @author       You
// @match        https://yjcg.webvpn.sgu.edu.cn/pj/Student/*
// @match        https://yjcg.webvpn.sgu.edu.cn/pj/Student/PJStandard.aspx?sqid=*
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      yjcg.webvpn.sgu.edu.cn
// @downloadURL https://update.greasyfork.org/scripts/497709/%E9%9F%B6%E5%85%B3%E5%AD%A6%E9%99%A2%E8%AF%84%E6%95%991.user.js
// @updateURL https://update.greasyfork.org/scripts/497709/%E9%9F%B6%E5%85%B3%E5%AD%A6%E9%99%A2%E8%AF%84%E6%95%991.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自动选择所有单选按钮并提交评教表单
    function autoEvaluate() {
        // 循环遍历从 GridView1_ctl01_RadioButtonList1_0 到 GridView1_ctl11_RadioButtonList1_0 的所有单选按钮
        for (let i = 1; i <= 11; i++) {
            let radioButtonId = 'GridView1_ctl' + ('0' + i).slice(-2) + '_RadioButtonList1_0';
            let radioButton = document.getElementById(radioButtonId);
            if (radioButton) {
                radioButton.checked = true;
            }
        }
        // 提交评教表单
        document.getElementById('LinkButtonPJ').click();
    }

    // 自动填写评论
    function autoFillComment() {
        // 填入评价内容到textarea
        var textToFill = '老师人很好'; // 要填入的文本
        var textArea = document.getElementById('TxtPcontent'); // 找到<textarea>元素
        var submitButton = document.getElementById('LinkButtonPJ'); // 找到提交按钮
        var exitButton = document.getElementById('LinkButtonfq'); // 找到退出按钮

        if (textArea && submitButton && exitButton) {
            // 设置<textarea>的值为指定的文本
            textArea.value = textToFill;

            // 模拟点击提交按钮
            submitButton.click();

            // 延迟200毫秒后点击退出按钮
            setTimeout(function() {
                exitButton.click();
            }, 200); // 这里设置了延迟时间为200毫秒
        }
    }

    // 如果是评教页面，则自动评教并填写评论
    if (window.location.href.includes("PJStandard.aspx")) {
        autoEvaluate();
        autoFillComment();
    }

    // 如果是评教列表页面，则创建按钮
    if (window.location.href.includes("https://yjcg.webvpn.sgu.edu.cn/pj/Student/")) {
        // 创建一个按钮，点击它时触发自动评教的操作
        function createButton() {
            var button = document.createElement("button");
            button.innerHTML = "自动评教";
            button.style.padding = "10px";
            button.style.margin = "10px";
            button.style.fontSize = "16px";
            button.addEventListener("click", function() {
                // 获取 select 元素
                var selectElement = document.getElementById("ListBoxkc");

                // 获取所有 option 元素
                var optionElements = selectElement.getElementsByTagName("option");

                // 遍历每个 option 元素并获取其值
                for (var i = 0; i < optionElements.length; i++) {
                    var optionValue = optionElements[i].value;
                    var optionText = optionElements[i].innerText;
                    console.log("值:", optionValue, "文本:", optionText);

                    // 打开评教页面并自动评教
                    var evaluationURL = "https://yjcg.webvpn.sgu.edu.cn/pj/Student/PJStandard.aspx?sqid=" + optionValue;
                    GM_openInTab(evaluationURL, { active: false, insert: true }, function(tab) {
                        setTimeout(function() {
                            // 自动勾选单选按钮并提交表单
                            for (let i = 1; i <= 11; i++) {
                                let radioButtonId = 'GridView1_ctl' + ('0' + i).slice(-2) + '_RadioButtonList1_0';
                                let radioButton = tab.document.getElementById(radioButtonId);
                                if (radioButton) {
                                    radioButton.checked = true;
                                }
                            }
                            tab.document.getElementById('LinkButtonPJ').click();
                        }, 5000); // 在这里增加等待时间，单位为毫秒
                    });
                }
            });
            document.body.appendChild(button);
        }

        // 在页面加载后创建按钮
        window.addEventListener('load', function() {
            createButton();
        }, false);
    }

})();