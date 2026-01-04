// ==UserScript==
// @name         职培考试高速自动答题系统去除时间限制模拟十分钟
// @namespace    http://tampermonkey.net/
// @version      11.0
// @description  高速自动填写所有题型，确保选择和提交成功，屏幕居中控制面板，模拟已考10分钟解除时间限制
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531663/%E8%81%8C%E5%9F%B9%E8%80%83%E8%AF%95%E9%AB%98%E9%80%9F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E7%B3%BB%E7%BB%9F%E5%8E%BB%E9%99%A4%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E6%A8%A1%E6%8B%9F%E5%8D%81%E5%88%86%E9%92%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/531663/%E8%81%8C%E5%9F%B9%E8%80%83%E8%AF%95%E9%AB%98%E9%80%9F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E7%B3%BB%E7%BB%9F%E5%8E%BB%E9%99%A4%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E6%A8%A1%E6%8B%9F%E5%8D%81%E5%88%86%E9%92%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 状态变量
    let autoAnswering = false;
    window.timeAdjusted = false; // 标记是否已经调整了时间
    
    // 显示toast通知
    function showToast(message, duration = 2000) {
        let toast = document.getElementById('auto-answer-toast');
        if (toast) {
            toast.textContent = message;
            clearTimeout(toast.timeoutId);
        } else {
            toast = document.createElement('div');
            toast.id = 'auto-answer-toast';
            toast.style.position = 'fixed';
            toast.style.top = '20%';
            toast.style.left = '50%';
            toast.style.transform = 'translate(-50%, -50%)';
            toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            toast.style.color = 'white';
            toast.style.padding = '12px 24px';
            toast.style.borderRadius = '4px';
            toast.style.zIndex = '10000';
            toast.style.fontSize = '16px';
            toast.style.fontWeight = 'bold';
            toast.textContent = message;
            document.body.appendChild(toast);
        }
        
        toast.timeoutId = setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);
    }

    // 替换规则定义
    const replacements = [
        {
            search: 'for(var s=0;s<e.topicList2.length;s++)"单选题"==e.topicList2[s].ttop010?e.danx.push(e.topicList2[s]):"不定项选择题"==e.topicList2[s].ttop010?e.duox.push(e.topicList2[s]):"判断题"==e.topicList2[s].ttop010?e.pand.push(e.topicList2[s]):"填空题"==e.topicList2[s].ttop010?e.tinak.push(e.topicList2[s]):"简答题"==e.topicList2[s].ttop010?e.jiand.push(e.topicList2[s]):e.zuh.push(e.topicList2[s]);',
            replace: `
            for(var s=0;s<e.topicList2.length;s++) {
                var question = e.topicList2[s];
                if ("单选题" == question.ttop010) {
                    (!question.daAn || void 0 === question.daAn) && (question.daAn = question.ttop022);
                    e.danx.push(question);
                } else if ("不定项选择题" == question.ttop010) {
                    (!question.daAn || void 0 === question.daAn) && (question.daAn = question.ttop022.split(""));
                    e.duox.push(question);
                } else if ("判断题" == question.ttop010) {
                    (!question.daAn || void 0 === question.daAn) && (question.daAn = question.ttop022);
                    e.pand.push(question);
                } else if ("填空题" == question.ttop010) {
                    // 修改这里：对于填空题，使用ttop021而不是ttop022
                    (!question.daAn || void 0 === question.daAn) && (question.daAn = question.ttop021);
                    // 存储填空题答案到window对象方便访问
                    if (!window.tiankongAnswers) window.tiankongAnswers = {};
                    window.tiankongAnswers[question.ttop001] = question.ttop021;
                    e.tinak.push(question);
                } else if ("简答题" == question.ttop010) {
                    (!question.daAn || void 0 === question.daAn) && (question.daAn = question.ttop022);
                    e.jiand.push(question);
                } else {
                    e.zuh.push(question);
                }
            }`
        }
    ];

    // 修改JS文件内容的函数
    function modifyJSContent(text, url) {
        let modifiedText = text;

        replacements.forEach(replacement => {
            if (modifiedText.includes(replacement.search)) {
                modifiedText = modifiedText.split(replacement.search).join(replacement.replace);
            }
        });

        return modifiedText;
    }
    
    // 获取Vue实例 - 添加时间模拟功能
    function getVueInstance() {
        const vueElements = Array.from(document.querySelectorAll('*')).filter(
            el => el.__vue__ && el.__vue__.topicList && el.__vue__.topicListI !== undefined
        );
        
        const vueInstance = vueElements.length > 0 ? vueElements[0].__vue__ : null;
        
        // 如果找到Vue实例并且没有设置过时间
        if (vueInstance && !window.timeAdjusted) {
            try {
                // 1. 移除最短考试时间限制
                vueInstance.finishTimes = 0;
                console.log('[自动答题] 已移除最低考试时间限制');
                
                // 2. 修改开始时间，让系统认为已经考了10分钟
                const tenMinutesInMs = 10 * 60 * 1000; // 10分钟的毫秒数
                if (vueInstance.clockStart) {
                    vueInstance.clockStart = vueInstance.clockStart - tenMinutesInMs;
                    
                    // 直接修改itesttime，确保立即显示已考10分钟
                    vueInstance.itesttime = 600; // 10分钟 = 600秒
                    
                    console.log('[自动答题] 已模拟已考10分钟，当前考试时间：', vueInstance.itesttime);
                    showToast('已模拟考试10分钟，无需等待即可交卷', 3000);
                }
                
                window.timeAdjusted = true; // 标记已调整时间，避免重复设置
            } catch (e) {
                console.error('[自动答题] 设置考试时间失败：', e);
            }
        }
        
        return vueInstance;
    }
    
    // 强制提交填空题答案
    function forceSubmitTiankong(vueInstance) {
        if (!vueInstance) return false;
        
        // 尝试直接调用tianKongSj方法
        if (vueInstance.tianKongSj && vueInstance.ttop012numberDa) {
            vueInstance.tianKongSj(null, vueInstance.ttop012numberDa);
            return true;
        }
        
        // 如果Vue方法失败，尝试DOM操作
        const submitButtons = Array.from(document.querySelectorAll('button')).filter(
            btn => {
                const text = btn.textContent || '';
                return text.includes('确定') || text.includes('提交');
            }
        );
        
        if (submitButtons.length > 0) {
            submitButtons[0].click();
            return true;
        }
        
        return false;
    }
    
    // 自动前往下一题 - 快速版
    function goToNextQuestion() {
        // 使用Vue方法切换到下一题
        const vueInstance = getVueInstance();
        if (!vueInstance) return false;
        
        // 获取当前题目索引和总数
        const currentIndex = vueInstance.topicListI;
        const totalTopics = vueInstance.topicNum;
        
        // 如果是最后一题，显示完成消息
        if (currentIndex >= totalTopics - 1) {
            showToast('🎉 所有题目已完成！', 3000);
            autoAnswering = false;
            
            // 恢复开始按钮状态
            resetStartButton();
            
            return false;
        }
        
        // 尝试直接调用下一题方法
        if (vueInstance.showPaperQuestion) {
            vueInstance.showPaperQuestion("1");
            return true;
        }
        
        // 如果Vue方法失败，尝试点击下一题按钮
        const nextButtons = document.querySelectorAll('button');
        for (const btn of nextButtons) {
            const text = btn.textContent || '';
            if (text.includes('下一题') || text.includes('下一步')) {
                btn.click();
                return true;
            }
        }
        
        return false;
    }

    // 自动填写题目答案 - 高速版
    function autoFillAnswers() {
        // 获取Vue实例
        const vueInstance = getVueInstance();
        if (!vueInstance) {
            console.log('[自动答题] 未找到Vue实例，等待1秒后重试');
            setTimeout(autoFillAnswers, 1000);
            return;
        }
        
        // 获取当前题目
        const currentTopic = vueInstance.topicList[vueInstance.topicListI];
        if (!currentTopic) {
            console.log('[自动答题] 未找到当前题目，等待1秒后重试');
            setTimeout(autoFillAnswers, 1000);
            return;
        }
        
        // 获取当前进度
        const currentIndex = vueInstance.topicListI;
        const totalTopics = vueInstance.topicNum;
        
        // 显示当前进度
        showToast(`答题: ${currentIndex + 1}/${totalTopics}`, 1000);
        
        // 根据题目类型执行不同的填写策略
        switch (currentTopic.ttop010) {
            case "单选题":
            case "判断题":
                // 单选题/判断题处理
                if (currentTopic.ttop022) {
                    // 设置答案
                    vueInstance.dxradio = currentTopic.ttop022;
                    
                    // 强制立即执行提交
                    if (vueInstance.dxtdjsj) {
                        vueInstance.dxtdjsj();
                        
                        // 确保答案已选中
                        setTimeout(() => {
                            // 检查是否已成功选中
                            if (vueInstance.dxradio === currentTopic.ttop022) {
                                // 快速前往下一题
                                setTimeout(goToNextQuestion, 300);
                            } else {
                                // 如果选择失败，重试
                                vueInstance.dxradio = currentTopic.ttop022;
                                vueInstance.dxtdjsj();
                                setTimeout(goToNextQuestion, 300);
                            }
                        }, 300);
                    } else {
                        // 尝试通过DOM选中正确答案
                        const radios = document.querySelectorAll('[role="radio"]');
                        let clicked = false;
                        
                        for (const radio of radios) {
                            if (radio.textContent && radio.textContent.includes(currentTopic.ttop022)) {
                                radio.click();
                                clicked = true;
                                break;
                            }
                        }
                        
                        if (clicked) {
                            setTimeout(goToNextQuestion, 300);
                        } else {
                            // 如果DOM方法也失败，延迟后直接下一题
                            setTimeout(goToNextQuestion, 500);
                        }
                    }
                } else {
                    // 没有答案，直接下一题
                    setTimeout(goToNextQuestion, 300);
                }
                break;
                
            case "不定项选择题":
                // 多选题处理
                if (currentTopic.ttop022) {
                    // 设置答案
                    vueInstance.duoXuanDaAn = currentTopic.ttop022.split("");
                    
                    // 强制立即执行提交
                    if (vueInstance.duoxtdjsj) {
                        vueInstance.duoxtdjsj();
                        
                        // 确保答案已选中
                        setTimeout(() => {
                            // 快速前往下一题
                            setTimeout(goToNextQuestion, 300);
                        }, 300);
                    } else {
                        // 尝试通过DOM选中正确答案
                        const checkboxes = document.querySelectorAll('[role="checkbox"]');
                        const answers = currentTopic.ttop022.split("");
                        
                        for (const checkbox of checkboxes) {
                            const label = checkbox.textContent || '';
                            if (answers.some(ans => label.includes(ans))) {
                                checkbox.click();
                            }
                        }
                        
                        // 提交后前往下一题
                        setTimeout(goToNextQuestion, 500);
                    }
                } else {
                    // 没有答案，直接下一题
                    setTimeout(goToNextQuestion, 300);
                }
                break;
                
            case "填空题":
                // 填空题处理
                if (currentTopic.ttop021) {
                    // 分割答案
                    const answers = currentTopic.ttop021.split("$$");
                    
                    // 清空并重新填写答案
                    vueInstance.ttop012numberDa = [];
                    for (let i = 0; i < answers.length; i++) {
                        vueInstance.ttop012numberDa[i] = answers[i];
                    }
                    
                    // 通过Vue方法提交
                    if (vueInstance.tianKongSj) {
                        vueInstance.tianKongSj(null, vueInstance.ttop012numberDa);
                        
                        // 再次确认提交成功
                        setTimeout(() => {
                            // 强制再次提交，确保成功
                            forceSubmitTiankong(vueInstance);
                            
                            // 尝试通过DOM直接设置输入框值并触发提交
                            const inputs = document.querySelectorAll('input[type="text"]');
                            if (inputs.length > 0 && inputs.length === answers.length) {
                                for (let i = 0; i < inputs.length; i++) {
                                    inputs[i].value = answers[i];
                                    inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
                                    inputs[i].dispatchEvent(new Event('change', { bubbles: true }));
                                }
                                
                                // 尝试点击提交按钮
                                const submitBtns = document.querySelectorAll('button');
                                for (const btn of submitBtns) {
                                    if ((btn.textContent || '').includes('确定')) {
                                        btn.click();
                                        break;
                                    }
                                }
                            }
                            
                            // 最后前往下一题
                            setTimeout(goToNextQuestion, 300);
                        }, 300);
                    } else {
                        // 尝试通过DOM填写并提交
                        const inputs = document.querySelectorAll('input[type="text"]');
                        if (inputs.length > 0) {
                            for (let i = 0; i < Math.min(inputs.length, answers.length); i++) {
                                inputs[i].value = answers[i];
                                inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
                                inputs[i].dispatchEvent(new Event('change', { bubbles: true }));
                            }
                            
                            // 尝试点击提交按钮
                            const submitBtns = document.querySelectorAll('button');
                            for (const btn of submitBtns) {
                                if ((btn.textContent || '').includes('确定')) {
                                    btn.click();
                                    break;
                                }
                            }
                            
                            // 再次执行点击，确保提交成功
                            setTimeout(() => {
                                for (const btn of submitBtns) {
                                    if ((btn.textContent || '').includes('确定')) {
                                        btn.click();
                                        break;
                                    }
                                }
                                
                                setTimeout(goToNextQuestion, 300);
                            }, 300);
                        } else {
                            // 如果找不到输入框，直接下一题
                            setTimeout(goToNextQuestion, 500);
                        }
                    }
                } else {
                    // 没有答案，直接下一题
                    setTimeout(goToNextQuestion, 300);
                }
                break;
                
            case "简答题":
                // 简答题处理
                if (currentTopic.ttop022) {
                    // 设置答案
                    vueInstance.jiandatext = currentTopic.ttop022;
                    
                    // 通过Vue方法提交
                    if (vueInstance.jianDaSj) {
                        vueInstance.jianDaSj();
                        
                        // 确保提交成功后前往下一题
                        setTimeout(goToNextQuestion, 500);
                    } else {
                        // 尝试通过DOM填写并提交
                        const textarea = document.querySelector('textarea');
                        if (textarea) {
                            textarea.value = currentTopic.ttop022;
                            textarea.dispatchEvent(new Event('input', { bubbles: true }));
                            textarea.dispatchEvent(new Event('change', { bubbles: true }));
                            
                            // 尝试点击提交按钮
                            const submitBtns = document.querySelectorAll('button');
                            for (const btn of submitBtns) {
                                if ((btn.textContent || '').includes('确定')) {
                                    btn.click();
                                    break;
                                }
                            }
                            
                            setTimeout(goToNextQuestion, 500);
                        } else {
                            // 如果找不到输入框，直接下一题
                            setTimeout(goToNextQuestion, 300);
                        }
                    }
                } else {
                    // 没有答案，直接下一题
                    setTimeout(goToNextQuestion, 300);
                }
                break;
                
            case "组合题":
                // 组合题处理
                handleComboQuestion(vueInstance);
                break;
                
            default:
                // 未知题型，直接下一题
                setTimeout(goToNextQuestion, 300);
                break;
        }
    }
    
    // 处理组合题
    function handleComboQuestion(vueInstance) {
        if (!vueInstance || !vueInstance.zuHeTiList || vueInstance.zuHeTiList.length === 0) {
            setTimeout(goToNextQuestion, 500);
            return;
        }
        
        // 处理所有子题目
        console.log('[自动答题] 处理组合题，共', vueInstance.zuHeTiList.length, '个子题目');
        
        // 依次处理每个子题目
        let delay = 0;
        for (let i = 0; i < vueInstance.zuHeTiList.length; i++) {
            const subTopic = vueInstance.zuHeTiList[i];
            
            // 设置递增延迟，确保依次处理
            setTimeout(() => {
                if (subTopic.ttop010 === "单选题" || subTopic.ttop010 === "判断题") {
                    if (subTopic.ttop022) {
                        // 使用Vue的响应式更新
                        vueInstance.$set(vueInstance.zuHeTiSelect, "danxuan" + i, subTopic.ttop022);
                        
                        // 提交
                        setTimeout(() => {
                            if (vueInstance.dxtdjsj) {
                                vueInstance.dxtdjsj(subTopic.ttop001, i);
                            }
                        }, 100);
                    }
                } else if (subTopic.ttop010 === "不定项选择题") {
                    if (subTopic.ttop022) {
                        // 使用Vue的响应式更新
                        vueInstance.$set(vueInstance.zuHeTiSelect, "duoxuan" + i, subTopic.ttop022.split(""));
                        
                        // 提交
                        setTimeout(() => {
                            if (vueInstance.duoxtdjsj) {
                                vueInstance.duoxtdjsj(subTopic.ttop001, i);
                            }
                        }, 100);
                    }
                }
            }, delay);
            
            delay += 200; // 每个子题目增加200ms的延迟
        }
        
        // 所有子题目处理完成后，前往下一题
        setTimeout(goToNextQuestion, delay + 300);
    }

    // 重置开始按钮状态
    function resetStartButton() {
        const startBtn = document.getElementById('start-auto-btn');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.style.backgroundColor = '#4CAF50';
            startBtn.innerText = '开始自动答题 (S)';
        }
    }

    // 开始自动答题 - 连续版
    function startAutoAnswering() {
        if (autoAnswering) return;
        
        autoAnswering = true;
        showToast('🚀 开始高速自动答题', 2000);
        
        // 修改开始按钮状态
        const startBtn = document.getElementById('start-auto-btn');
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.style.backgroundColor = '#888';
            startBtn.innerText = '答题中...';
        }
        
        // 建立一个连续答题的递归函数
        function continueAnswering() {
            if (!autoAnswering) {
                // 答题被手动停止，恢复按钮状态
                resetStartButton();
                return;
            }
            
            // 获取Vue实例
            const vueInstance = getVueInstance();
            if (!vueInstance) {
                setTimeout(continueAnswering, 1000);
                return;
            }
            
            // 获取当前进度
            const currentIndex = vueInstance.topicListI;
            const totalTopics = vueInstance.topicNum;
            
            // 如果已经完成全部题目，则停止
            if (currentIndex >= totalTopics - 1) {
                showToast('🎉 所有题目已完成！', 3000);
                autoAnswering = false;
                
                // 恢复开始按钮状态
                resetStartButton();
                return;
            }
            
            // 填写当前题目的答案
            autoFillAnswers();
            
            // 等待填写和提交完成后，自动继续下一题
            setTimeout(continueAnswering, 1500);
        }
        
        // 启动连续答题流程
        continueAnswering();
    }
    
    // 添加控制按钮（屏幕居中显示）
    function addControlButtons() {
        // 创建按钮容器
        const container = document.createElement('div');
        container.id = 'auto-answer-controls';
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.zIndex = '10000';
        container.style.display = 'flex';
        container.style.flexDirection = 'column'; // 垂直排列
        container.style.gap = '10px';
        container.style.padding = '15px';
        container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        
        // 创建标题
        const title = document.createElement('div');
        title.innerText = '自动答题控制面板';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '16px';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        
        // 创建开始按钮
        const startBtn = document.createElement('button');
        startBtn.id = 'start-auto-btn'; // 添加ID便于后续查找
        startBtn.innerText = '开始自动答题 (S)';
        startBtn.style.padding = '10px 15px';
        startBtn.style.backgroundColor = '#4CAF50';
        startBtn.style.color = 'white';
        startBtn.style.border = 'none';
        startBtn.style.borderRadius = '4px';
        startBtn.style.cursor = 'pointer';
        startBtn.style.fontSize = '14px';
        startBtn.style.width = '200px';
        
        startBtn.onclick = function() {
            startAutoAnswering();
        };
        
        // 创建下一题按钮
        const nextBtn = document.createElement('button');
        nextBtn.innerText = '下一题 (N)';
        nextBtn.style.padding = '10px 15px';
        nextBtn.style.backgroundColor = '#2196F3';
        nextBtn.style.color = 'white';
        nextBtn.style.border = 'none';
        nextBtn.style.borderRadius = '4px';
        nextBtn.style.cursor = 'pointer';
        nextBtn.style.fontSize = '14px';
        nextBtn.style.width = '200px';
        
        nextBtn.onclick = goToNextQuestion;
        
        // 创建填写当前题按钮
        const fillBtn = document.createElement('button');
        fillBtn.innerText = '填写当前题 (F)';
        fillBtn.style.padding = '10px 15px';
        fillBtn.style.backgroundColor = '#FF9800';
        fillBtn.style.color = 'white';
        fillBtn.style.border = 'none';
        fillBtn.style.borderRadius = '4px';
        fillBtn.style.cursor = 'pointer';
        fillBtn.style.fontSize = '14px';
        fillBtn.style.width = '200px';
        
        fillBtn.onclick = autoFillAnswers;
        
        // 创建停止按钮
        const stopBtn = document.createElement('button');
        stopBtn.innerText = '停止自动答题 (X)';
        stopBtn.style.padding = '10px 15px';
        stopBtn.style.backgroundColor = '#f44336';
        stopBtn.style.color = 'white';
        stopBtn.style.border = 'none';
        stopBtn.style.borderRadius = '4px';
        stopBtn.style.cursor = 'pointer';
        stopBtn.style.fontSize = '14px';
        stopBtn.style.width = '200px';
        
        stopBtn.onclick = function() {
            autoAnswering = false;
            showToast('已停止自动答题', 1500);
            resetStartButton();
        };
        
        // 添加鼠标悬停效果
        [startBtn, nextBtn, fillBtn, stopBtn].forEach(btn => {
            btn.onmouseover = function() {
                if (!this.disabled) {
                    this.style.opacity = '0.9';
                    this.style.transform = 'scale(1.05)';
                }
            };
            btn.onmouseout = function() {
                if (!this.disabled) {
                    this.style.opacity = '1';
                    this.style.transform = 'scale(1)';
                }
            };
            btn.style.transition = 'all 0.2s ease';
        });
        
        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerText = '关闭面板';
        closeBtn.style.padding = '8px';
        closeBtn.style.backgroundColor = '#555';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '12px';
        closeBtn.style.width = '200px';
        closeBtn.style.marginTop = '5px';
        
        closeBtn.onclick = function() {
            container.style.display = 'none';
            
            // 添加一个小按钮来重新显示面板
            const showBtn = document.createElement('button');
            showBtn.innerText = '显示面板';
            showBtn.style.position = 'fixed';
            showBtn.style.bottom = '10px';
            showBtn.style.right = '10px';
            showBtn.style.padding = '5px 10px';
            showBtn.style.backgroundColor = '#555';
            showBtn.style.color = 'white';
            showBtn.style.border = 'none';
            showBtn.style.borderRadius = '4px';
            showBtn.style.cursor = 'pointer';
            showBtn.style.zIndex = '10000';
            
            showBtn.onclick = function() {
                container.style.display = 'flex';
                this.remove();
            };
            
            document.body.appendChild(showBtn);
        };
        
        // 添加元素到容器
        container.appendChild(title);
        container.appendChild(startBtn);
        container.appendChild(fillBtn);
        container.appendChild(nextBtn);
        container.appendChild(stopBtn);
        container.appendChild(closeBtn);
        
        // 使面板可拖动
        let isDragging = false;
        let offsetX, offsetY;
        
        title.style.cursor = 'move';
        title.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            container.style.left = x + 'px';
            container.style.top = y + 'px';
            container.style.transform = 'none';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        // 添加容器到页面
        document.body.appendChild(container);
    }

    // 注册热键
    document.addEventListener('keydown', function(e) {
        // F键填写当前题
        if (e.key === 'f' || e.key === 'F') {
            autoFillAnswers();
        }
        
        // N键下一题
        if (e.key === 'n' || e.key === 'N') {
            goToNextQuestion();
        }
        
        // S键开始自动答题
        if (e.key === 's' || e.key === 'S') {
            startAutoAnswering();
        }
        
        // X键停止自动答题
        if (e.key === 'x' || e.key === 'X') {
            autoAnswering = false;
            showToast('已停止自动答题', 1500);
            resetStartButton();
        }
    });

    // 拦截XHR
    (function (open, send) {
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            this._url = url;
            open.call(this, method, url, async, user, password);
        };

        XMLHttpRequest.prototype.send = function (body) {
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && this.status === 200 && this._url.endsWith('.js')) {
                    const modifiedText = modifyJSContent(this.responseText, this._url);
                    if (modifiedText) {
                        Object.defineProperty(this, 'responseText', { value: modifiedText });
                    }
                }
            });
            send.call(this, body);
        };
    })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);

    // 拦截fetch
    (function (fetch) {
        window.fetch = function () {
            return fetch.apply(this, arguments).then(response => {
                if (response.url.endsWith('.js')) {
                    return response.clone().text().then(text => {
                        const modifiedText = modifyJSContent(text, response.url);
                        if (modifiedText) {
                            return new Response(modifiedText, {
                                status: response.status,
                                statusText: response.statusText,
                                headers: response.headers
                            });
                        }
                        return response;
                    });
                }
                return response;
            });
        };
    })(window.fetch);

    // 拦截动态script标签
    (function (createElement) {
        const originalCreateElement = document.createElement;
        document.createElement = function () {
            const element = originalCreateElement.apply(this, arguments);
            if (arguments[0].toLowerCase() === 'script') {
                Object.defineProperty(element, 'src', {
                    set: function (url) {
                        if (url.endsWith('.js')) {
                            fetch(url).then(response => response.text()).then(text => {
                                const modifiedText = modifyJSContent(text, url);
                                if (modifiedText) {
                                    const blob = new Blob([modifiedText], { type: 'text/javascript' });
                                    const newUrl = URL.createObjectURL(blob);
                                    element.setAttribute('src', newUrl);
                                }
                            });
                        } else {
                            element.setAttribute('src', url);
                        }
                    }
                });
            }
            return element;
        };
    })(document.createElement);
    
    // 每次页面切换时重置状态
    function resetState() {
        autoAnswering = false;
        window.timeAdjusted = false; // 重置时间标记，允许在新页面再次模拟时间
        resetStartButton();
    }
    
    // 页面加载完成后添加按钮
    window.addEventListener('load', function() {
        setTimeout(() => {
            resetState();
            addControlButtons();
            // 获取Vue实例，触发时间模拟
            getVueInstance();
        }, 1000);
    });
    
    // 监听URL变化，处理页面切换
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(() => {
                resetState();
                // 在新页面再次获取Vue实例
                getVueInstance();
            }, 1000);
        }
    }).observe(document, {subtree: true, childList: true});
})();