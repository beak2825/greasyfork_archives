// ==UserScript==
// @name         自动化评估脚本（课程和教师）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动化填写课程和教师评估问卷
// @author       huhu
// @icon         https://www.urongda.com/_next/image?url=%2Flogos%2Fnormal%2Fmedium%2Funiversity-of-chinese-academy-of-sciences-logo-1024px.png&w=640&q=75
// @match        *://xkcts.ucas.ac.cn:*/evaluate/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516975/%E8%87%AA%E5%8A%A8%E5%8C%96%E8%AF%84%E4%BC%B0%E8%84%9A%E6%9C%AC%EF%BC%88%E8%AF%BE%E7%A8%8B%E5%92%8C%E6%95%99%E5%B8%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/516975/%E8%87%AA%E5%8A%A8%E5%8C%96%E8%AF%84%E4%BC%B0%E8%84%9A%E6%9C%AC%EF%BC%88%E8%AF%BE%E7%A8%8B%E5%92%8C%E6%95%99%E5%B8%88%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 评价内容配置
    let evaluationConfig = {
        course: {
            item_1456: '课程安排合理，教学材料详实，对课程主题深入浅出',
            item_1457: '课程内容充实，理论与实践结合得当，所以目前挺好的',
            item_1458: '因为比较喜欢这门课所以每周在这门课花费的时间大概是四个小时',
            item_1459: '我非常喜欢这门课，对这个科学领域也是很感兴趣',
            item_1460: '积极上课回答问题，积极举手，积极汇报'
        },
        teacher: {
            item_1431: '教师专业水平高，教学风格生动活泼，关注学生成长',
            item_1432: '教师备课认真，课堂组织有序，答疑耐心细致'
        }
    };

    // 创建配置面板
    const configPanel = document.createElement('div');
    configPanel.style.cssText = `
        position: fixed;
        top: 150px;
        right: 10px;
        width: 400px;
        padding: 15px;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        z-index: 9998;
        display: none;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

    // 生成配置面板HTML
    function generateConfigPanelHTML() {
        return `
            <h3 style="margin-top: 0;">评价内容设置</h3>
            <p style="color: #ff6b6b; margin: 5px 0 15px 0; font-size: 13px;">如果无法匹配文字输入框，请点击下方的"重置默认"设置或"清除配置"设置来清除缓存，请务必先保存自定义的评价内容。</p>
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px;">课程评价：</h4>
                ${Object.entries(evaluationConfig.course).map(([id, text], index) => `
                    <div style="margin-bottom: 10px;">
                        <p style="margin: 5px 0;">评价${index + 1}：</p>
                        <textarea id="config_${id}" class="eval-textarea" style="width: 100%; height: 60px; padding: 5px;">${text}</textarea>
                    </div>
                `).join('')}
            </div>
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px;">教师评价：</h4>
                ${Object.entries(evaluationConfig.teacher).map(([id, text], index) => `
                    <div style="margin-bottom: 10px;">
                        <p style="margin: 5px 0;">评价${index + 1}：</p>
                        <textarea id="config_${id}" class="eval-textarea" style="width: 100%; height: 60px; padding: 5px;">${text}</textarea>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center;">
                <button id="saveConfig" style="padding: 8px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">保存设置</button>
                <button id="resetConfig" style="padding: 8px 20px; background-color: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">重置默认</button>
                <button id="clearConfig" style="padding: 8px 20px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">清除配置</button>
            </div>
        `;
    }

    configPanel.innerHTML = generateConfigPanelHTML();

    // 创建设置按钮
    const configButton = document.createElement('button');
    configButton.innerText = '设置评价内容';
    configButton.style.cssText = `
        position: fixed;
        top: 150px;
        right: 10px;
        z-index: 9999;
        padding: 10px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;

    // 创建自动填写按钮
    const autoButton = document.createElement('button');
    autoButton.innerText = '自动填写评估';
    autoButton.style.cssText = `
        position: fixed;
        top: 100px;
        right: 10px;
        z-index: 9999;
        padding: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;

    // 设置按钮点击事件
    configButton.onclick = function() {
        if (configPanel.style.display === 'none') {
            // 显示面板时，更新文本框内容为当前配置
            configPanel.innerHTML = generateConfigPanelHTML();
            configPanel.style.display = 'block';
        } else {
            configPanel.style.display = 'none';
        }
    };

    // 保存配置事件
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'saveConfig') {
            // 从配置面板的文本框获取值
            Object.keys(evaluationConfig.course).forEach(id => {
                const textarea = document.getElementById(`config_${id}`);
                if (textarea) {
                    evaluationConfig.course[id] = textarea.value;
                }
            });
            Object.keys(evaluationConfig.teacher).forEach(id => {
                const textarea = document.getElementById(`config_${id}`);
                if (textarea) {
                    evaluationConfig.teacher[id] = textarea.value;
                }
            });

            // 保存到localStorage
            localStorage.setItem('evaluationConfig', JSON.stringify(evaluationConfig));

            configPanel.style.display = 'none';
            alert('设置已保存！');
        } else if (e.target && e.target.id === 'resetConfig') {
            // 重置为默认配置
            evaluationConfig = {
                course: {
                    item_1456: '课程安排合理，教学材料详实，对课程主题深入浅出',
                    item_1457: '课程内容充实，理论与实践结合得当，所以目前挺好的',
                    item_1458: '因为比较喜欢这门课所以每周在这门课花费的时间大概是四个小时',
                    item_1459: '我非常喜欢这门课，对这个科学领域也是很感兴趣',
                    item_1460: '积极上课回答问题，积极举手，积极汇报'
                },
                teacher: {
                    item_1431: '教师专业水平高，教学风格生动活泼，关注学生成长',
                    item_1432: '教师备课认真，课堂组织有序，答疑耐心细致'
                }
            };
            localStorage.setItem('evaluationConfig', JSON.stringify(evaluationConfig));
            configPanel.innerHTML = generateConfigPanelHTML();
            alert('已重置为默认配置！');
        } else if (e.target && e.target.id === 'clearConfig') {
            // 清除配置
            localStorage.removeItem('evaluationConfig');
            evaluationConfig = {
                course: {
                    item_1456: '',
                    item_1457: '',
                    item_1458: '',
                    item_1459: '',
                    item_1460: ''
                },
                teacher: {
                    item_1431: '',
                    item_1432: ''
                }
            };
            configPanel.innerHTML = generateConfigPanelHTML();
            alert('配置已清除！');
        }
    });

    // 从localStorage加载配置
    const savedConfig = localStorage.getItem('evaluationConfig');
    if (savedConfig) {
        try {
            evaluationConfig = JSON.parse(savedConfig);
            // 立即更新配置面板内容
            configPanel.innerHTML = generateConfigPanelHTML();
        } catch (e) {
            // 如果解析失败，清除可能损坏的数据
            localStorage.removeItem('evaluationConfig');
        }
    }

    // 修改自动填写逻辑部分
    autoButton.onclick = function() {
        if (window.location.pathname.includes('/evaluateCourse')) {
            // 选择所有5分选项
            document.querySelectorAll('input[type="radio"][value="5"]').forEach(function(radio) {
                radio.checked = true;
            });

            // 填写课程评价
            Object.entries(evaluationConfig.course).forEach(([id, text]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.value = text;
                    ['input', 'change', 'blur'].forEach(eventType => {
                        element.dispatchEvent(new Event(eventType, { bubbles: true }));
                    });
                }
            });

            // 自动选择特定的单选题选项
            const specificRadio = document.querySelector('input[type="radio"][id="1462"][name="radio_1461"]');
            if (specificRadio) {
                specificRadio.checked = true;
            }

            // 自动选择特定的多选题选项
            const specificCheckbox = document.querySelector('input[type="checkbox"][id="1469"][name="item_1467"]');
            if (specificCheckbox) {
                specificCheckbox.checked = true;
            }
            const specificCheckbox2 = document.querySelector('input[type="checkbox"][id="1471"][name="item_1467"]');
            if (specificCheckbox2) {
                specificCheckbox2.checked = true;
            }

            alert('课程评估已自动填写完成！');
        } else if (window.location.pathname.includes('/evaluateTeacher')) {
            // 选择所有5分选项
            document.querySelectorAll('input[type="radio"][value="5"]').forEach(function(radio) {
                radio.checked = true;
            });

            // 填写教师评价
            Object.entries(evaluationConfig.teacher).forEach(([id, text]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.value = text;
                    ['input', 'change', 'blur'].forEach(eventType => {
                        element.dispatchEvent(new Event(eventType, { bubbles: true }));
                    });
                }
            });

            alert('教师评估已自动填写完成！');
        }
    };

    // 将新元素添加到页面
    document.body.appendChild(configButton);
    document.body.appendChild(configPanel);
    document.body.appendChild(autoButton);
})();