// ==UserScript==
// @name         地大北京CUGB自动评教
// @namespace    http://tampermonkey.net/
// @version      2024-10-20
// @description  实现教务管理-课程评估-评估页面的自动评价提交。
// @author       w1m
// @license      Apache-2.0
// @match        https://jwglxt.cugb.edu.cn/academic/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513377/%E5%9C%B0%E5%A4%A7%E5%8C%97%E4%BA%ACCUGB%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/513377/%E5%9C%B0%E5%A4%A7%E5%8C%97%E4%BA%ACCUGB%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(() => {

        var menuFrameDoc = document.body.querySelector("iframe").contentWindow[1].document;

        const startButton = document.createElement('startButton');
        startButton.id = 'startButton';
        startButton.innerText = '自动评教';
        startButton.style.position = 'fixed';
        startButton.style.bottom = '600px';
        startButton.style.right = '98px';
        startButton.style.padding = '10px 20px';
        startButton.style.backgroundColor = '#4CAF50';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';

        menuFrameDoc.body.appendChild(startButton);

        const textarea = document.createElement('textarea');
        textarea.placeholder = '请输入文本评价';
        textarea.value = '老师认真负责。';
        textarea.style.position = 'fixed';
        textarea.style.bottom = '485px';
        textarea.style.right = '65px';
        textarea.style.padding = '5px 10px';
        textarea.style.border = '1px solid #ccc';
        textarea.style.borderRadius = '5px';
        textarea.style.width = '100px';
        textarea.style.height = '100px';
        textarea.style.resize = 'none'
        textarea.style.whiteSpace = 'pre-wrap';
        textarea.style.wordWrap = 'break-word';

        menuFrameDoc.body.appendChild(textarea);

        // 按钮点击事件
        startButton.addEventListener('click', function () {

            var mainFrameDoc = document.body.querySelector("iframe").contentWindow[2].document;

            var scoringTableList = mainFrameDoc.querySelectorAll("body > center > table.content_tab > tbody > tr > td > form > table.infolist_hr > tbody > tr");

            if (!scoringTableList || scoringTableList.length === 0) {
                alert("请进入评估课程页面再开启自动评教。");
            }
            else {
                Array.from(scoringTableList).slice(1).forEach(function (row, index) {
                    var scoringCells = row.querySelectorAll("td");
                    var scoringInput = scoringCells[2].querySelector('input[value="100.0#17688507#17688508"]');
                    if (scoringInput) {
                        scoringInput.checked = true;
                    }
                });
                var reviewsTextArea = mainFrameDoc.querySelector("body > center > table.content_tab > tbody > tr > td > form > table.infolist_hr > tbody > tr:nth-child(22) > td:nth-child(3) > textarea");
                reviewsTextArea.value = textarea.value;

                setTimeout(() => {
                    var submitButton = mainFrameDoc.querySelector("body > center > table.content_tab > tbody > tr > td > form > table.button_tab > tbody > tr > td > input:nth-child(1)");
                    submitButton.click();
                }, 1000);
            }
        });

    }, 500);


})();
