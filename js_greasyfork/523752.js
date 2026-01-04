// ==UserScript==
// @name         问卷星自动填写(简化版)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填写问卷星问卷，纯随机填写
// @author       Bin
// @match        https://www.wjx.cn/vm/*
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/523752/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%28%E7%AE%80%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523752/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%28%E7%AE%80%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加控制面板
    const panel = document.createElement('div');
    panel.innerHTML = `
        <div id="autoFillPanel" style="position:fixed;top:10px;right:10px;background:#fff;padding:15px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);z-index:9999;font-family:Arial,sans-serif;">
            <div style="margin-bottom:10px;font-size:14px;color:#333;text-align:center;border-bottom:1px solid #eee;padding-bottom:5px;">
                <div style="font-weight:bold;margin-bottom:5px;">问卷星自动填写</div>
                <div style="font-size:12px;color:#666;">作者: Bin</div>
            </div>
            <div style="margin-bottom:10px;font-size:13px;">状态: <span id="status" style="color:#4CAF50;">等待开始...</span></div>
            <div style="display:flex;gap:8px;">
                <button id="startFill" style="flex:1;padding:6px 12px;background:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px;">开始填写</button>
                <button id="submitForm" style="flex:1;padding:6px 12px;background:#2196F3;color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px;">提交问卷</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // 随机文本库
    const randomTexts = {
        normal: [
            "课程内容很充实，希望继续保持",
            "建议增加实践环节，加强互动",
            "总体来说不错，但是可以更好",
            "课程安排合理，学习体验良好",
            "希望能有更多案例分析",
            "教学质量不错，继续加油",
            "课程设计很用心，收获很多",
            "建议适当增加课后练习",
            "整体满意，期待后续课程",
            "希望能有更多实操机会"
        ],
        other: [
            "其他建议",
            "个人想法",
            "补充意见",
            "特殊情况说明",
            "建议完善"
        ]
    };

    // 更新状态显示
    function updateStatus(text) {
        const status = document.getElementById('status');
        status.textContent = text;
        status.style.color = text.includes('完成') ? '#4CAF50' : '#2196F3';
    }

    // 随机延迟函数
    function randomDelay(min, max) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // 处理单选题
    function handleRadio(div) {
        const options = div.querySelectorAll('.ui-radio');
        if(options.length > 0) {
            const randomIndex = Math.floor(Math.random() * options.length);
            const radio = options[randomIndex].querySelector('.jqradio');
            radio.click();
            
            // 处理可能出现的文本框
            setTimeout(() => {
                const textInput = div.querySelector('input.OtherRadioText');
                if(textInput && textInput.offsetParent !== null) {
                    textInput.value = randomTexts.normal[Math.floor(Math.random() * randomTexts.normal.length)];
                    textInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }, 100);
        }
    }

    // 处理多选题
    function handleCheckbox(div) {
        const options = div.querySelectorAll('.ui-checkbox');
        if(options.length > 0) {
            // 过滤掉最后一个选项和包含"其他"的选项
            const validOptions = Array.from(options).filter((option, index) => {
                const label = option.querySelector('.label');
                return label && 
                       !label.textContent.includes('其他') && 
                       index !== options.length - 1;
            });

            if(validOptions.length > 0) {
                // 随机选择1-3个选项
                const selectCount = Math.min(
                    Math.floor(Math.random() * 3) + 1,
                    validOptions.length
                );
                const selectedIndexes = new Set();
                
                while(selectedIndexes.size < selectCount) {
                    const randomIndex = Math.floor(Math.random() * validOptions.length);
                    if(!selectedIndexes.has(randomIndex)) {
                        selectedIndexes.add(randomIndex);
                        const checkbox = validOptions[randomIndex].querySelector('.jqcheck');
                        checkbox.click();
                        
                        // 处理可能出现的文本框
                        setTimeout(() => {
                            const textInput = validOptions[randomIndex].querySelector('input.OtherText');
                            if(textInput && textInput.offsetParent !== null) {
                                textInput.value = randomTexts.normal[Math.floor(Math.random() * randomTexts.normal.length)];
                                textInput.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                        }, 100);
                    }
                }
            } else if(options.length > 1) {
                // 如果没有有效选项，随机选择一个非最后的选项
                const randomIndex = Math.floor(Math.random() * (options.length - 1));
                const checkbox = options[randomIndex].querySelector('.jqcheck');
                checkbox.click();
            }
        }
    }

    // 处理填空题
    function handleText(div) {
        const input = div.querySelector('input[type="text"]');
        if(input) {
            input.value = randomTexts.normal[Math.floor(Math.random() * randomTexts.normal.length)];
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // 滚动到元素位置
    function scrollToElement(element) {
        element.scrollIntoView(true);
    }

    // 自动填写问卷
    async function autoFill() {
        updateStatus('正在填写...');
        const questions = document.querySelectorAll('.field');
        
        for(const div of questions) {
            const type = div.getAttribute('type');
            try {
                switch(type) {
                    case '3': // 单选题
                        handleRadio(div);
                        break;
                    case '4': // 多选题
                        handleCheckbox(div);
                        break;
                    case '1': // 填空题
                        handleText(div);
                        break;
                }
            } catch (error) {
                console.error("处理题目失败:", error);
            }
        }

        const submitBtn = document.querySelector('.submitbutton');
        if(submitBtn) {
            scrollToElement(submitBtn);
            updateStatus('填写完成！');
        }
    }

    // 页面加载完成立即开始
    window.addEventListener('load', () => {
        autoFill();
    });

    // 按钮悬停效果
    document.getElementById('startFill').addEventListener('mouseover', function() {
        this.style.backgroundColor = '#45a049';
    });
    document.getElementById('startFill').addEventListener('mouseout', function() {
        this.style.backgroundColor = '#4CAF50';
    });
    document.getElementById('submitForm').addEventListener('mouseover', function() {
        this.style.backgroundColor = '#1976D2';
    });
    document.getElementById('submitForm').addEventListener('mouseout', function() {
        this.style.backgroundColor = '#2196F3';
    });

})(); 