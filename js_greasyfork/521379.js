// ==UserScript==
// @name         知行乐评
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  一键式满分评分，告别手误，节省时间，快来给你喜欢的老师/同学满分吧！
// @author       Lambda5
// @match        https://aa.bjtu.edu.cn/teaching_assessment/stu/*
// @match        https://www.icourse163.org/*
// @grant        none
// @run-at       document-end
// @license       GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/521379/%E7%9F%A5%E8%A1%8C%E4%B9%90%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/521379/%E7%9F%A5%E8%A1%8C%E4%B9%90%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 弹窗处理部分（AI写的）
    var popupHTML = `
        <div id="zhixing-popup" style="display: none; position: fixed;
            top: 20%;
            right: 10%;
            transform: none;
            width: 140px; min-height: 170px;
            padding: 20px; background: rgba(41, 128, 185, 0.85);
            border-radius: 20px; text-align: center; box-sizing: border-box;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 999999;">
            <div style="margin-bottom: 15px;">
                <h1 style="color: #ECF0F1; margin: 5px 0; font-size: 24px; font-weight: 500;text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">知 行</h1>
                <h1 style="color: #ECF0F1; margin: 5px 0; font-size: 24px; font-weight: 500;text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">乐 评</h1>
            </div>
            <div style="margin: 15px 0;">
                <input type="number" id="互评份数" placeholder="互评份数" min="1"
                    style="color:rgb(227, 233, 235); border-radius: 5px; padding: 8px;
                    width: 100%; box-sizing: border-box; background: rgba(52, 152, 219, 0.4);
                    border: 1px solid rgba(233, 239, 240, 0.9);
                    outline: none;">
                    <style>
                    #互评份数::placeholder
                    {
                        color: #ECF0F1;
                    }
                    </style>
            </div>
            <div style="margin: 15px 0;">
                <button id="zhixing-button2" style="width: 100%; padding: 5px;
                    border-radius: 5px; background: rgba(236, 240, 241, 0.9);
                    border: none; cursor: pointer; color: #2980B9;
                    font-weight: bold; transition: all 0.3s ease;">一键好评</button>
            </div>
            <div id="dragbar" style="width: 100%; height: 10px; background: rgba(236, 240, 241, 0.3);
                cursor: move; margin-top: 10px; border-radius: 5px;"></div>
        </div>
    `;

    // 在页面加载完成后立即插入弹窗
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // 获取当前页面主机部分
    var iURL = window.location.hostname;

    // 获取弹窗和相关元素
    var popup = document.getElementById('zhixing-popup');
    var button2 = document.getElementById('zhixing-button2');
    var dragbar = document.getElementById('dragbar');
    var inputField = document.getElementById('互评份数');

    // 显示弹窗函数
    function showPopup() {
        if(iURL === 'www.icourse163.org' || iURL === 'aa.bjtu.edu.cn') {
            popup.style.display = 'block';
        }
    }

    var isDragging = false;
    var offsetX, offsetY;

    dragbar.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - popup.offsetLeft;
        offsetY = e.clientY - popup.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            popup.style.left = (e.clientX - offsetX) + 'px';
            popup.style.top = (e.clientY - offsetY) + 'px';
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Process函数
    async function process() {
        try {
            const checkboxes = document.getElementsByClassName('j-acb');
            if (checkboxes.length > 0) {
                checkboxes[0].checked = false;
            }

            const divs = document.getElementsByClassName('s');
            for (const div of divs) {
                const labels = div.getElementsByTagName('label');
                if (labels.length > 0) {
                    const lastRadio = labels[labels.length - 1].getElementsByTagName('input')[0];
                    if (lastRadio?.type === 'radio') {
                        lastRadio.checked = true;
                    }
                }
            }

            const iTextareas = document.querySelectorAll('textarea[name="inputtxt"]');
            iTextareas.forEach(iText => {
                iText.value = "写得很好，继续努力！";
                iText.style.color = 'green';
            });

            const iSubmit = document.querySelector('.u-btn.u-btn-default.f-fl.j-submitbtn');
            if (iSubmit) {
                iSubmit.click();
                await new Promise(resolve => setTimeout(resolve, 500));

                const iNext = document.querySelector('.j-gotonext');
                if (iNext) {
                    iNext.click();
                }
            }
        } catch (error) {
            console.error('处理评分时发生错误:', error);
        }
    }

    // 慕课互评部分
    if(iURL === 'www.icourse163.org') {
        button2.addEventListener('click', async function() {
            const times = parseInt(inputField.value, 10);
            if (isNaN(times)) {
                await process();
            } else {
                for (let t = 0; t < times; t++) 
                {
                    await process();
                    await new Promise(resolve => setTimeout(resolve, 1300)); // 等待1.3秒页面刷新时间，如果报错"并发限制"，就调大这个数值
                }
            }
        });
    }

    // MIS评教部分
    if(iURL === 'aa.bjtu.edu.cn') {
        button2.addEventListener('click', function() 
        {
            const labels = document.querySelectorAll('label');

            labels.forEach(label => {
                const forId = label.getAttribute('for');
                if (!forId) return;

                if (label.textContent.includes("非常符合") || label.textContent.includes("优秀")) {
                    const radio = document.getElementById(forId);
                    if (radio) {
                        radio.checked = true;
                        label.style.color = 'green';
                    }
                }
            });

            const iLabel = document.querySelector('label[for="id_comment-0-comment_result"]');
            if (iLabel) {
                const iTextarea = document.getElementById(iLabel.getAttribute('for'));
                if (iTextarea) {
                    iTextarea.value = "老师讲得很好,让我收获良多！";
                    iTextarea.style.color = 'green';
                }
            }
            window.scrollTo(0, document.documentElement.scrollHeight);

        });
    }

    // 立即显示弹窗
    showPopup();

})();