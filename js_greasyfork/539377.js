// ==UserScript==
// @name         上海第二工业大学教师评教自动填写（优化版）
// @license      All rights reserved
// @namespace    http://tampermonkey.net/
// @version      4.0-Enhanced
// @description  优化表单识别逻辑，支持更多表格结构类型 - 增强版本
// @author       Assistant
// @match        https://jx.sspu.edu.cn/eams/evaluateStd*
// @match        https://jx.sspu.edu.cn/eams/*
// @include      https://jx.sspu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539377/%E4%B8%8A%E6%B5%B7%E7%AC%AC%E4%BA%8C%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E5%B8%88%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539377/%E4%B8%8A%E6%B5%B7%E7%AC%AC%E4%BA%8C%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E5%B8%88%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 智能选项识别配置
    const BEST_OPTIONS = {
        // 最佳选项关键词（按优先级排序）
        positive: [
            '非常符合', '完全符合', '非常同意', '完全同意', '非常满意', '完全满意',
            '非常愿意', '完全愿意', '非常好', '优秀', '很好', '满意',
            '比较符合', '比较同意', '比较满意', '比较愿意', '愿意', '好'
        ],
        // 需要避免的选项关键词
        negative: [
            '非常不符合', '完全不符合', '非常不同意', '完全不同意', '非常不满意',
            '非常不愿意', '完全不愿意', '很差', '差', '不满意', '不愿意',
            '比较不符合', '比较不同意', '比较不满意', '不确定', '一般'
        ]
    };

    // 等待页面加载完成
    window.addEventListener('load', function() {
        setTimeout(() => {
            addAutoFillButton();
        }, 2000);
    });

    function addAutoFillButton() {
        // 避免重复添加按钮
        if (document.getElementById('auto-fill-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'auto-fill-btn';
        button.innerHTML = '🤖 智能评教';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 30px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
        `;

        // 添加悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
            button.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
        });

        button.onclick = intelligentAutoFill;
        document.body.appendChild(button);
    }

    function intelligentAutoFill() {
        console.log('🤖 启动智能评教填写...');

        // 显示加载提示
        showLoadingToast();

        setTimeout(() => {
            const result = performIntelligentFill();
            hideLoadingToast();
            showResult(result);
        }, 500);
    }

    function performIntelligentFill() {
        // 增强版查找所有单选按钮组
        const radioGroups = findAllRadioGroupsEnhanced();
        console.log(`📊 找到 ${Object.keys(radioGroups).length} 个问题组`);

        // 打印调试信息
        for (let [groupName, radios] of Object.entries(radioGroups)) {
            console.log(`🔍 问题组 ${groupName}:`);
            radios.forEach((option, index) => {
                console.log(`  ${index + 1}. "${option.text}" (value: ${option.value})`);
            });
        }

        let successCount = 0;
        let totalGroups = Object.keys(radioGroups).length;
        let analysisLog = [];

        for (let [groupName, radios] of Object.entries(radioGroups)) {
            const bestOption = findBestOptionEnhanced(radios);
            if (bestOption) {
                bestOption.radio.checked = true;

                // 触发多种事件确保兼容性
                ['change', 'click', 'input'].forEach(eventType => {
                    const event = new Event(eventType, { bubbles: true });
                    bestOption.radio.dispatchEvent(event);
                });

                successCount++;
                analysisLog.push({
                    group: groupName,
                    selected: bestOption.text,
                    reason: bestOption.reason
                });

                console.log(`✅ ${groupName}: 选择 "${bestOption.text}" (${bestOption.reason})`);
            } else {
                console.log(`❌ ${groupName}: 未找到合适选项`);
                analysisLog.push({
                    group: groupName,
                    selected: '未选择',
                    reason: '未找到合适选项'
                });
            }
        }

        return {
            success: successCount,
            total: totalGroups,
            log: analysisLog
        };
    }

    function findAllRadioGroupsEnhanced() {
        const radioGroups = {};
        const allRadios = document.querySelectorAll('input[type="radio"]');

        console.log(`🔍 页面中找到 ${allRadios.length} 个单选按钮`);

        allRadios.forEach((radio, index) => {
            const name = radio.name;
            if (name) {
                if (!radioGroups[name]) {
                    radioGroups[name] = [];
                }

                // 增强版选项文本识别
                let labelText = getRadioLabelTextEnhanced(radio);

                // 清理文本，移除多余的空白字符和&nbsp;
                labelText = labelText.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

                console.log(`📝 单选按钮 ${index + 1}: name="${name}", value="${radio.value}", text="${labelText}"`);

                radioGroups[name].push({
                    radio: radio,
                    text: labelText,
                    value: radio.value
                });
            }
        });

        return radioGroups;
    }

    function getRadioLabelTextEnhanced(radio) {
        let labelText = '';

        // 方法1: 通过for属性查找对应的label
        if (radio.id) {
            const label = document.querySelector(`label[for="${radio.id}"]`);
            if (label) {
                labelText = label.textContent.trim();
                console.log(`🏷️ 方法1找到标签: "${labelText}"`);
                return labelText;
            }
        }

        // 方法2: 查找紧邻的label元素
        const nextLabel = radio.nextElementSibling;
        if (nextLabel && nextLabel.tagName === 'LABEL') {
            labelText = nextLabel.textContent.trim();
            console.log(`🏷️ 方法2找到标签: "${labelText}"`);
            return labelText;
        }

        // 方法3: 查找前一个label元素
        const prevLabel = radio.previousElementSibling;
        if (prevLabel && prevLabel.tagName === 'LABEL') {
            labelText = prevLabel.textContent.trim();
            console.log(`🏷️ 方法3找到标签: "${labelText}"`);
            return labelText;
        }

        // 方法4: 从父元素中查找包含该radio的label
        let parent = radio.parentElement;
        while (parent && parent.tagName !== 'BODY') {
            const labels = parent.querySelectorAll('label');
            for (let label of labels) {
                if (label.getAttribute('for') === radio.id || label.contains(radio)) {
                    labelText = label.textContent.trim();
                    console.log(`🏷️ 方法4找到标签: "${labelText}"`);
                    return labelText;
                }
            }
            parent = parent.parentElement;
        }

        // 方法5: 从父元素的文本内容中提取（针对表格结构）
        const parentTd = radio.closest('td');
        if (parentTd) {
            // 创建临时元素来分析HTML结构
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = parentTd.innerHTML;

            // 移除所有input元素，只保留label文本
            const inputs = tempDiv.querySelectorAll('input');
            inputs.forEach(input => input.remove());

            // 查找与当前radio相关的label
            const labels = tempDiv.querySelectorAll('label');
            for (let label of labels) {
                if (label.getAttribute('for') === radio.id) {
                    labelText = label.textContent.trim();
                    console.log(`🏷️ 方法5找到标签: "${labelText}"`);
                    return labelText;
                }
            }
        }

        // 方法6: 根据value推断文本（最后的备用方案）
        if (!labelText && radio.value) {
            // 常见的评价选项映射
            const valueTextMap = {
                '174': '非常符合',
                '173': '比较符合',
                '172': '不确定',
                '171': '比较不符合',
                '170': '非常不符合',
                '169': '非常同意',
                '168': '比较同意',
                '167': '不确定',
                '166': '比较不同意',
                '165': '非常不同意',
                '179': '非常愿意',
                '178': '愿意',
                '177': '一般',
                '176': '不愿意',
                '175': '非常不愿意'
            };

            labelText = valueTextMap[radio.value] || `选项${radio.value}`;
            console.log(`🏷️ 方法6推断标签: "${labelText}"`);
        }

        return labelText;
    }

    function findBestOptionEnhanced(options) {
        console.log(`🎯 分析选项组，共 ${options.length} 个选项`);

        // 按优先级查找最佳选项
        for (let keyword of BEST_OPTIONS.positive) {
            for (let option of options) {
                if (option.text.includes(keyword)) {
                    console.log(`✨ 找到最佳选项: "${option.text}" (关键词: ${keyword})`);
                    return {
                        radio: option.radio,
                        text: option.text,
                        reason: `匹配关键词: ${keyword}`
                    };
                }
            }
        }

        // 如果没有找到明确的正面选项，尝试数值分析
        const numericOptions = options.filter(opt => /^\d+$/.test(opt.value));
        if (numericOptions.length > 0) {
            // 选择数值最大的选项（通常最高分是最好的）
            const maxValueOption = numericOptions.reduce((max, current) =>
                parseInt(current.value) > parseInt(max.value) ? current : max
            );
            console.log(`🔢 选择最高数值选项: "${maxValueOption.text}" (值: ${maxValueOption.value})`);
            return {
                radio: maxValueOption.radio,
                text: maxValueOption.text,
                reason: `选择最高数值选项 (${maxValueOption.value})`
            };
        }

        // 位置分析：通常第一个选项是最好的
        if (options.length > 0) {
            const firstOption = options[0];
            // 确保不是明显的负面选项
            const isNegative = BEST_OPTIONS.negative.some(neg =>
                firstOption.text.includes(neg)
            );

            if (!isNegative) {
                console.log(`📍 选择第一个选项: "${firstOption.text}"`);
                return {
                    radio: firstOption.radio,
                    text: firstOption.text,
                    reason: '选择第一个选项（通常为最佳）'
                };
            }
        }

        console.log(`❌ 未找到合适的选项`);
        return null;
    }

    function showLoadingToast() {
        const toast = document.createElement('div');
        toast.id = 'loading-toast';
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="spinner"></div>
                <span>智能分析中...</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 99998;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-size: 14px;
            backdrop-filter: blur(10px);
        `;

        // 添加旋转动画样式
        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                width: 20px;
                height: 20px;
                border: 2px solid #ffffff30;
                border-top: 2px solid #ffffff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(toast);
    }

    function hideLoadingToast() {
        const toast = document.getElementById('loading-toast');
        if (toast) {
            toast.remove();
        }
    }

    function showResult(result) {
        const { success, total, log } = result;

        let message = `🎉 智能评教完成！\n\n`;
        message += `📊 填写统计: ${success}/${total} 个问题\n`;
        message += `✅ 成功率: ${total > 0 ? Math.round(success/total*100) : 0}%\n\n`;

        if (success > 0) {
            message += `🔍 智能分析结果:\n`;
            const successLog = log.filter(item => item.selected !== '未选择');
            const samples = successLog.slice(0, 3); // 显示前3个样例

            samples.forEach((item, index) => {
                message += `${index + 1}. ${item.selected} (${item.reason})\n`;
            });

            if (successLog.length > 3) {
                message += `... 还有 ${successLog.length - 3} 个问题已智能填写\n`;
            }

            message += `\n💡 提示: 请检查填写结果后再提交`;
        } else {
            message += `❌ 未找到可识别的评教表单\n`;
            message += `🔧 调试信息:\n`;
            message += `- 页面中单选按钮总数: ${document.querySelectorAll('input[type="radio"]').length}\n`;
            message += `- 建议: 请确保页面完全加载后再使用脚本\n`;
            message += `- 如果问题持续，请联系开发者更新脚本`;
        }

        alert(message);

        // 滚动到页面底部
        if (success > 0) {
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }, 1000);
        }
    }

    // 增强版页面变化监听
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const hasRadios = document.querySelector('input[type="radio"]');
                if (hasRadios && !document.getElementById('auto-fill-btn')) {
                    console.log('🔄 检测到新的单选按钮，准备添加自动填写按钮');
                    setTimeout(addAutoFillButton, 1000);
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('🤖 上海第二工业大学增强版评教脚本已加载');
    console.log('📝 当前页面单选按钮数量:', document.querySelectorAll('input[type="radio"]').length);
})();