// ==UserScript==
// @name         问卷星自动填写助手 - 自启动版
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动填写问卷星表单中的个人信息 - 页面加载时自动启动
// @author       Jiashi
// @match        *://*.wjx.cn/*
// @match        *://*.wenjuan.com/*
// @match        *://*.wenjuanxing.com/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/538757/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B%20-%20%E8%87%AA%E5%90%AF%E5%8A%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/538757/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B%20-%20%E8%87%AA%E5%90%AF%E5%8A%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户信息配置 - 请根据实际情况修改
    const userInfo = {
        name: "张三",
        studentId: "20230001",
        gender: "男",
        college: "计算机学院",
        grade: "2023级",
        major: "计算机科学与技术",
        phone: "13800138000",
        email: "zhangsan@example.com",
        age: "20",
        class: "计科2301班"
    };

    // 优化的字段映射，更精确的匹配规则
    const fieldMappings = {
        college: ['学院', 'college', 'school', '所在学院', '学院名称', '请选择学院', 'department', '院系', '所属学院'],
        studentId: ['学号', 'student id', 'studentid', '学生学号', '请输入学号', '你的学号', 'student number', '学生编号', '学籍号'],
        name: ['姓名', 'name', '真实姓名', '你的姓名', '请输入姓名', '请填写姓名', 'fullname', 'real name', '学生姓名', '本人姓名'],
        gender: ['性别', 'gender', 'sex', '请选择性别', '你的性别', '男女'],
        grade: ['年级', 'grade', '所在年级', '请选择年级', '入学年份', '届', '级别'],
        major: ['专业', 'major', '所学专业', '专业名称', '请选择专业', '学科专业', '所学学科'],
        phone: ['手机', 'phone', '电话', '手机号', '联系电话', '手机号码', 'mobile', '电话号码', '联系方式'],
        email: ['邮箱', 'email', '电子邮箱', '邮件地址', 'e-mail', '电子邮件', '邮件'],
        age: ['年龄', 'age', '请输入年龄', '你的年龄', '岁数'],
        class: ['班级', 'class', '所在班级', '班级名称', '请选择班级', '班']
    };

    // 已填写的输入框记录，避免重复填写
    const filledInputs = new Set();

    function showMessage(message, type = 'info') {
        const colors = {
            info: '#007bff',
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545'
        };
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 999999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            max-width: 300px;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 4000);
    }

    // 改进的精确匹配函数
    function preciseMatch(text, keywords) {
        if (!text) return 0;
        const lowerText = text.toLowerCase().trim().replace(/[\s\*\:：\.\。]/g, '');
        
        let maxScore = 0;
        for (const keyword of keywords) {
            const lowerKeyword = keyword.toLowerCase().replace(/[\s]/g, '');
            let score = 0;
            
            // 精确匹配得分最高
            if (lowerText === lowerKeyword) {
                score = 100;
            }
            // 完全包含匹配
            else if (lowerText.includes(lowerKeyword)) {
                score = 80;
            }
            else if (lowerKeyword.includes(lowerText) && lowerText.length >= 2) {
                score = 70;
            }
            // 部分匹配
            else {
                const commonLength = getCommonLength(lowerText, lowerKeyword);
                if (commonLength >= 2) {
                    score = (commonLength / Math.max(lowerText.length, lowerKeyword.length)) * 60;
                }
            }
            
            maxScore = Math.max(maxScore, score);
        }
        
        return maxScore;
    }

    function getCommonLength(str1, str2) {
        let maxLength = 0;
        for (let i = 0; i < str1.length; i++) {
            for (let j = 0; j < str2.length; j++) {
                let length = 0;
                while (i + length < str1.length && 
                       j + length < str2.length && 
                       str1[i + length] === str2[j + length]) {
                    length++;
                }
                maxLength = Math.max(maxLength, length);
            }
        }
        return maxLength;
    }

    // 改进的标签查找函数
    function findLabelForInput(input) {
        try {
            let labelTexts = [];
            
            // 方法1: 通过 for 属性查找
            if (input.id) {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (label) labelTexts.push(label.textContent.trim());
            }

            // 方法2: 查找最近的父级容器中的标签
            let parent = input.parentElement;
            for (let i = 0; i < 4 && parent; i++) {
                // 优先查找直接的label标签
                const directLabels = parent.querySelectorAll(':scope > label');
                for (const label of directLabels) {
                    const text = label.textContent.trim();
                    if (text && text.length < 30) {
                        labelTexts.push(text);
                    }
                }

                // 查找其他文本元素，但排除过长的文本
                const textElements = parent.querySelectorAll('span, div');
                for (const el of textElements) {
                    const text = el.textContent.trim();
                    if (text && text.length > 1 && text.length < 20 && 
                        !text.includes('请选择') && !text.includes('请输入') &&
                        !text.includes('必填') && !text.includes('*')) {
                        // 检查是否是直接包含input的容器的文本
                        if (el.contains(input) || input.contains(el)) continue;
                        labelTexts.push(text);
                    }
                }

                parent = parent.parentElement;
            }

            // 方法3: 查找前面的兄弟元素
            let sibling = input.previousElementSibling;
            let siblingCount = 0;
            while (sibling && siblingCount < 3) {
                if (['LABEL', 'SPAN', 'DIV'].includes(sibling.tagName)) {
                    const text = sibling.textContent.trim();
                    if (text && text.length > 1 && text.length < 20) {
                        labelTexts.push(text);
                    }
                }
                sibling = sibling.previousElementSibling;
                siblingCount++;
            }

            // 方法4: 使用 placeholder 和 title
            if (input.placeholder && input.placeholder.length < 20) {
                labelTexts.push(input.placeholder);
            }
            if (input.title && input.title.length < 20) {
                labelTexts.push(input.title);
            }

            // 清理和去重，优先保留较短的文本
            labelTexts = [...new Set(labelTexts)]
                .filter(text => text && text.length > 0)
                .sort((a, b) => a.length - b.length)
                .slice(0, 3); // 只保留前3个最相关的标签
            
            return labelTexts.join(' | ');
        } catch (error) {
            console.log('查找标签时出错:', error);
            return '';
        }
    }

    // 获取输入框的唯一标识
    function getInputIdentifier(input) {
        const parts = [];
        if (input.id) parts.push('id:' + input.id);
        if (input.name) parts.push('name:' + input.name);
        if (input.className) parts.push('class:' + input.className);
        
        // 添加DOM路径作为后备标识
        let element = input;
        let path = [];
        while (element && element !== document.body && path.length < 5) {
            let selector = element.tagName.toLowerCase();
            if (element.id) {
                selector += '#' + element.id;
            }
            path.unshift(selector);
            element = element.parentElement;
        }
        parts.push('path:' + path.join('>'));
        
        return parts.join('|');
    }

    // 智能字段匹配和填写
    function smartFillForm() {
        let filledCount = 0;
        let totalAttempts = 0;
        showMessage('正在智能识别并填写表单...', 'info');

        console.log('=== 开始智能填写表单 ===');
        console.log('用户信息:', userInfo);

        // 查找所有可能的输入元素
        const selectors = [
            'input[type="text"]',
            'input[type="email"]',
            'input[type="tel"]',
            'input[type="number"]',
            'input[type="radio"]',
            'input[type="checkbox"]',
            'select',
            'textarea',
            'input:not([type])',
            'input[type=""]'
        ];

        const allInputs = document.querySelectorAll(selectors.join(','));
        console.log(`页面总共找到 ${allInputs.length} 个输入元素`);

        // 为每个输入框找到最佳匹配的字段
        const inputMatches = [];
        
        for (const input of allInputs) {
            // 跳过隐藏元素和已填写的元素
            if (input.style.display === 'none' || input.hidden || 
                input.offsetParent === null || input.value.trim() !== '') {
                continue;
            }

            const identifier = getInputIdentifier(input);
            if (filledInputs.has(identifier)) {
                continue;
            }

            const labelText = findLabelForInput(input);
            if (!labelText) continue;

            console.log(`\n检查输入框: ${input.tagName}[${input.type || 'default'}] - 标签: "${labelText}"`);

            // 计算与每个字段的匹配分数
            let bestMatch = null;
            let bestScore = 0;

            for (const [fieldType, keywords] of Object.entries(fieldMappings)) {
                const score = preciseMatch(labelText, keywords);
                console.log(`  ${fieldType}: ${score}分`);
                
                if (score > bestScore && score >= 60) { // 设置最低匹配分数阈值
                    bestMatch = {
                        fieldType,
                        score,
                        value: userInfo[fieldType]
                    };
                    bestScore = score;
                }
            }

            if (bestMatch && bestMatch.value) {
                inputMatches.push({
                    input,
                    identifier,
                    labelText,
                    fieldType: bestMatch.fieldType,
                    value: bestMatch.value,
                    score: bestMatch.score,
                    type: input.type || input.tagName.toLowerCase()
                });
                console.log(`✓ 最佳匹配: ${bestMatch.fieldType} (${bestMatch.score}分) = ${bestMatch.value}`);
            }
        }

        // 按匹配分数排序，优先填写匹配度最高的
        inputMatches.sort((a, b) => b.score - a.score);

        console.log(`\n=== 准备填写 ${inputMatches.length} 个字段 ===`);

        // 分字段类型填写，避免同一字段重复填写
        const fieldUsed = new Set();
        
        for (const match of inputMatches) {
            // 如果该字段类型已经填写过，跳过
            if (fieldUsed.has(match.fieldType)) {
                console.log(`跳过重复字段: ${match.fieldType}`);
                continue;
            }

            totalAttempts++;
            console.log(`\n填写字段: ${match.fieldType} = ${match.value} (${match.score}分)`);
            console.log(`目标输入框: ${match.type} - "${match.labelText}"`);

            let success = false;

            try {
                if (match.type === 'radio') {
                    success = setRadioValue(match.input, match.value);
                } else if (match.type === 'select' || match.input.tagName === 'SELECT') {
                    success = setSelectValue(match.input, match.value);
                } else {
                    success = setInputValue(match.input, match.value);
                }

                if (success) {
                    filledCount++;
                    fieldUsed.add(match.fieldType);
                    filledInputs.add(match.identifier);
                    console.log(`✓ 成功填写: ${match.fieldType} = ${match.value}`);
                } else {
                    console.log(`✗ 填写失败: ${match.fieldType} = ${match.value}`);
                }
            } catch (error) {
                console.log(`填写字段 ${match.fieldType} 时出错:`, error);
            }
        }

        // 显示结果
        setTimeout(() => {
            if (filledCount > 0) {
                showMessage(`智能填写完成！成功填写 ${filledCount} 个字段`, 'success');
                console.log(`\n=== 填写成功的字段 ===`);
                for (const fieldType of fieldUsed) {
                    console.log(`✓ ${fieldType}: ${userInfo[fieldType]}`);
                }
            } else {
                showMessage('未找到可填写的字段', 'warning');
                
                // 调试信息
                console.log('\n=== 调试信息：页面中的所有输入元素 ===');
                const debugInputs = document.querySelectorAll('input, select, textarea');
                debugInputs.forEach((el, index) => {
                    const label = findLabelForInput(el);
                    const isVisible = el.offsetParent !== null && el.style.display !== 'none';
                    const hasValue = el.value && el.value.trim() !== '';
                    console.log(`${index + 1}. ${el.tagName}[${el.type || 'default'}] - 标签: "${label}" - 可见: ${isVisible} - 有值: ${hasValue}`);
                });
            }
            console.log(`\n=== 智能填写完成: ${filledCount}/${totalAttempts} 个字段 ===`);
        }, 500);
    }

    // 设置输入框值的函数
    function setInputValue(input, value) {
        try {
            if (!input || !value) return false;
            
            console.log(`设置文本值: ${value}`);
            
            // 聚焦并清空
            input.focus();
            input.value = '';
            
            // 设置新值
            input.value = value;
            
            // 触发事件
            const events = ['input', 'change', 'blur'];
            for (const eventType of events) {
                const event = new Event(eventType, { 
                    bubbles: true, 
                    cancelable: true 
                });
                input.dispatchEvent(event);
            }

            // 确认值已设置
            return input.value === value;
        } catch (error) {
            console.log('设置输入值时出错:', error);
            return false;
        }
    }

    function setRadioValue(input, value) {
        try {
            // 查找同组的所有radio按钮
            const radioGroup = input.name ? 
                document.querySelectorAll(`input[name="${input.name}"]`) : [input];
            
            for (const radio of radioGroup) {
                const label = findLabelForInput(radio);
                if (label.includes(value) || radio.value === value || 
                    value.includes(label) || value.includes(radio.value)) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log('设置单选按钮时出错:', error);
            return false;
        }
    }

    function setSelectValue(select, value) {
        try {
            for (const option of select.options) {
                if (option.text.includes(value) || option.value.includes(value) || 
                    value.includes(option.text) || value.includes(option.value)) {
                    select.value = option.value;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log('设置下拉选择时出错:', error);
            return false;
        }
    }

    // 智能等待页面加载完成
    function waitForPageReady() {
        return new Promise((resolve) => {
            // 检查页面是否包含表单元素
            function checkForForms() {
                const inputs = document.querySelectorAll('input, select, textarea');
                const hasVisibleInputs = Array.from(inputs).some(input => 
                    input.offsetParent !== null && input.style.display !== 'none'
                );
                
                if (hasVisibleInputs) {
                    console.log('检测到表单元素，准备开始填写');
                    resolve();
                } else {
                    console.log('等待表单元素加载...');
                    setTimeout(checkForForms, 500);
                }
            }
            
            checkForForms();
        });
    }

    // 主初始化函数
    async function initialize() {
        console.log('问卷星自动填写助手已加载 - 自启动模式');
        
        // 等待页面准备就绪
        await waitForPageReady();
        
        // 等待额外的时间确保页面完全渲染
        setTimeout(() => {
            smartFillForm();
        }, 1500);
        
        // 监听页面变化，适应动态加载的内容
        const observer = new MutationObserver((mutations) => {
            let shouldRecheck = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 检查是否有新的表单元素添加
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element node
                            const hasInputs = node.tagName === 'INPUT' || 
                                            node.tagName === 'SELECT' || 
                                            node.tagName === 'TEXTAREA' ||
                                            node.querySelectorAll('input, select, textarea').length > 0;
                            if (hasInputs) {
                                shouldRecheck = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldRecheck) break;
            }
            
            if (shouldRecheck) {
                console.log('检测到新的表单元素，重新执行填写');
                setTimeout(smartFillForm, 1000);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后自动启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }

    // 确保在页面完全加载后也能工作
    window.addEventListener('load', () => {
        setTimeout(initialize, 2000);
    });

})();