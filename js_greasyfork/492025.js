// ==UserScript==
// @name         自动填写评分脚本
// @namespace    https://greasyfork.org/zh-CN/scripts/492025-%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AF%84%E5%88%86%E8%84%9A%E6%9C%AC
// @version      2.2.4
// @description  自动填写评分并提交结束考核，可切换随机数版本或固定评分版本
// @author       小楫轻舟
// @license      MIT
// @match        http://cms.ahluqiao.com:9090/HR/Kpi/AssessMonthExaminationPM/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABaUExURTMwMJOOjsjDw4aCgrqzs87IyLWvr0xpcQAAABIRETQyMsK8vKehoaynp4SAgCYkJOjh4f/6+uLa2lRRUTY0NJ+ZmW5qaoiDg3x4eEhGRiYkJJiTk/fw8GJfXxZ3+4sAAAAWdFJOU2n2/O39/v0AC0WD/vz+7V////////4sgfxuAAAAk0lEQVQY02XPyRKEIAwEUEBAEJ0iCbv6/785Llg15fTxHdIdNr7CxtFY1mPNCWbiQomSpdTDZA6wfAPwNSn0ONgDmADAFChE7zU7QQGoRjxw7+UDWKnUiHiDQ9ShpFYpxQuWnajtJexrnC8QHmVNnNafGzm5SPkBAYrcllvutZZjWWBbg+zDzPSZlXA66j7977lXvrUYCtAbaK9PAAAAAElFTkSuQmCC
// @require      https://unpkg.com/sweetalert2@11.10.7/dist/sweetalert2.all.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/492025/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AF%84%E5%88%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/492025/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AF%84%E5%88%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 是否启用随机评分功能
    var useRandomScore = GM_getValue('useRandomScore', false); // 默认为false，即关闭随机功能，启用固定评分功能
    var fixedScoreValue = GM_getValue('fixedScoreValue', 99); // 默认固定评分为99

    // 添加菜单命令来打开设置界面
    GM_registerMenuCommand('⚙️ 设置', showSettingBox);

    // 显示设置界面
    function showSettingBox() {
        let html = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="randomScoreCheckbox" ${useRandomScore ? 'checked' : ''}>
                <label class="form-check-label" for="randomScoreCheckbox">启用随机评分功能（90-100任意随机数）</label>
            </div>
            <div class="form-group">
                <label for="fixedScoreInput">固定评分值：</label>
                <input type="number" class="form-control" id="fixedScoreInput" value="${fixedScoreValue}" ${useRandomScore ? 'disabled' : ''}min="0" max="120">
                <label for="fixedScoreInput">0-100</label>
            </div>
        `;

        Swal.fire({
            title: '评分设置',
            html: html,
            icon: 'info',
            showCloseButton: true,
            confirmButtonText: '保存',
            didOpen: () => {
                // 添加事件监听器以实时更新固定评分输入框的禁用状态
                const randomScoreCheckbox = document.getElementById('randomScoreCheckbox');
                const fixedScoreInput = document.getElementById('fixedScoreInput');

                randomScoreCheckbox.addEventListener('change', () => {
                    fixedScoreInput.disabled = randomScoreCheckbox.checked;
                });
            },
        }).then((result) => {
            if (result.isConfirmed) {
                useRandomScore = document.getElementById('randomScoreCheckbox').checked;
                fixedScoreValue = parseInt(document.getElementById('fixedScoreInput').value);
                GM_setValue('useRandomScore', useRandomScore);
                GM_setValue('fixedScoreValue', fixedScoreValue);
            }
        });
    }

    // 自动点击民主评分按钮
    function autoClickEditButton() {
        var editButton = document.getElementById('btnEdit');
        if (editButton) {
            editButton.click();
        }
    }

    // 自动填写评分
    function autoFillScore() {
        var scoreInput = document.querySelector('input[id^="AssessMonthExaminationPMItemMZs_"][id$="_MinZhuScore"]');
        if (scoreInput) {
            if (useRandomScore) {
                // 生成一个90到100之间的随机整数
                var randomScore = Math.floor(Math.random() * 11) + 90;//Math.floor(Math.random() * 11) + 80;Math.random() 的结果乘以 11，得到的随机整数范围是 0 到 10，然后再加上 80，得到的结果就是介于 80 和 90（包括） 之间的随机整数。
                scoreInput.value = randomScore.toString();
            } else {
                scoreInput.value = fixedScoreValue.toString();
            }
        }
    }

    // 自动填写评价意见
    function autoFillOpinion() {
        var opinionTextarea = document.getElementById('_Opinion');
        if (opinionTextarea) {
            // 获取输入框所在的父 <td> 元素
            var parentTd = opinionTextarea.parentElement;

            // 检查父 <td> 的前一个兄弟元素是否存在并且包含 "考核人发起考核"
            if (parentTd && parentTd.previousElementSibling &&
                parentTd.previousElementSibling.textContent.trim() === "考核人发起考核") {
                console.log("发现前面有‘考核人发起考核’，不赋值");
                return; // 不进行赋值
        }

        // 如果条件不满足，则赋值
        opinionTextarea.value = "已评分";
    }
}

    // 自动执行结束考核流程的函数
    function executeEndAssessment() {
        var endButton = document.querySelector("a[href*='javascript:flowNext']");
        if (endButton) {
            endButton.click();
        } else {
            console.error("无法找到结束考核按钮！");
        }
    }

    // 等待页面加载完成后执行操作
    window.addEventListener('load', function() {
        autoClickEditButton();
        autoFillScore();
        autoFillOpinion();
        setTimeout(executeEndAssessment, 1000); // 1秒后提交表单，以确保其他操作完成
    });

})();
