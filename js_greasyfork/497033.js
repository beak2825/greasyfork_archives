// ==UserScript==
// @name         去你妈的劳关评教
// @namespace    https://github.com/Cindy-Master
// @version      0.0.3
// @description  很喜欢点吗
// @author       Cindy-Master
// @match        *://culr.mycospxk.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497033/%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%E5%8A%B3%E5%85%B3%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/497033/%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%E5%8A%B3%E5%85%B3%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false;

    // 默认填空题内容
    const defaultAnswers = {
        answer1: '实践和理论结合',
        answer2: '无',
        answer3: '老师讲的非常好,教学很清晰明了。'
    };

    // 从localStorage获取保存的答案
    function getSavedAnswers() {
        const saved = localStorage.getItem('teachingEvaluationAnswers');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.log('解析保存的答案失败:', e);
            }
        }
        return defaultAnswers;
    }

    // 保存答案到localStorage
    function saveAnswers(answers) {
        localStorage.setItem('teachingEvaluationAnswers', JSON.stringify(answers));
        console.log('答案已保存:', answers);
    }

    // 创建配置界面
    function createConfigModal() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // 创建配置窗口
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 8px;
            width: 500px;
            max-width: 90%;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        const savedAnswers = getSavedAnswers();

        modal.innerHTML = `
            <h3 style="margin: 0 0 20px 0; text-align: center; color: #333;">填空题内容设置</h3>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">第一道填空题内容：</label>
                <input type="text" id="answer1" value="${savedAnswers.answer1}"
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                <div style="font-size: 12px; color: #666; margin-top: 2px;">推荐内容：实践和理论结合</div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">第二道填空题内容：</label>
                <input type="text" id="answer2" value="${savedAnswers.answer2}"
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                <div style="font-size: 12px; color: #666; margin-top: 2px;">推荐内容：无</div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">弹窗评价原因内容：</label>
                <textarea id="answer3" rows="3"
                          style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; resize: vertical;">${savedAnswers.answer3}</textarea>
                <div style="font-size: 12px; color: #666; margin-top: 2px;">推荐内容：老师讲的非常好,教学很清晰明了。</div>
            </div>

            <div style="text-align: center;">
                <button id="saveConfig" style="
                    background: #1890ff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px;
                    font-size: 14px;
                ">保存设置</button>
                <button id="cancelConfig" style="
                    background: #ccc;
                    color: #333;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                ">取消</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 保存按钮事件
        document.getElementById('saveConfig').addEventListener('click', () => {
            const answers = {
                answer1: document.getElementById('answer1').value.trim() || defaultAnswers.answer1,
                answer2: document.getElementById('answer2').value.trim() || defaultAnswers.answer2,
                answer3: document.getElementById('answer3').value.trim() || defaultAnswers.answer3
            };

            saveAnswers(answers);
            document.body.removeChild(overlay);

            // 显示保存成功提示
            showNotification('设置已保存成功！', 'success');
        });

        // 取消按钮事件
        document.getElementById('cancelConfig').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // 点击遮罩层关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            color: white;
            font-size: 14px;
            z-index: 10001;
            transition: all 0.3s;
            ${type === 'success' ? 'background: #52c41a;' : 'background: #1890ff;'}
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    // 等待页面加载完成
    function waitForElements() {
        const radioGroups = document.querySelectorAll('.ant-radio-group');
        const textareas = document.querySelectorAll('textarea.ant-input');

        if (radioGroups.length > 0 || textareas.length > 0) {
            fillForm();
        } else {
            setTimeout(waitForElements, 1000);
        }
    }

    function fillForm() {
        if (isProcessing) return;
        isProcessing = true;

        console.log('开始自动填写表单...');

        // 处理所有单选题
        fillRadioQuestions();

        // 等待一下再处理填空题
        setTimeout(() => {
            fillTextAreas();

            // 再等待一下后自动提交
            setTimeout(() => {
                autoSubmit();
            }, 2000);
        }, 1000);
    }

    function fillRadioQuestions() {
        const radioGroups = document.querySelectorAll('.ant-radio-group');

        radioGroups.forEach((group, index) => {
            const veryMatch = group.querySelector('input[value="1"]'); // 非常符合
            const match = group.querySelector('input[value="2"]'); // 符合

            if (veryMatch && match) {
                const random = Math.random();
                let selectedOption;

                if (random < 0.3) {
                    selectedOption = match; // 符合
                } else {
                    selectedOption = veryMatch; // 非常符合
                }

                selectedOption.click();
                selectedOption.dispatchEvent(new Event('change', { bubbles: true }));

                console.log(`第${index + 1}题已选择: ${random < 0.3 ? '符合' : '非常符合'}`);
            }
        });
    }

    function fillTextAreas() {
        const textareas = document.querySelectorAll('textarea.ant-input');
        const savedAnswers = getSavedAnswers();

        if (textareas.length >= 2) {
            // 第一个填空题：使用自定义内容
            fillTextAreaWithTyping(textareas[0], savedAnswers.answer1, 0);

            // 第二个填空题：使用自定义内容
            setTimeout(() => {
                fillTextAreaWithTyping(textareas[1], savedAnswers.answer2, 1);
            }, 1000);

            console.log('开始填写填空题...');
            console.log('第一道填空题内容:', savedAnswers.answer1);
            console.log('第二道填空题内容:', savedAnswers.answer2);
        }
    }

    // 模拟真实打字过程来触发字数检测
    function fillTextAreaWithTyping(textarea, text, index) {
        console.log(`开始填写第${index + 1}个填空题: "${text}"`);

        // 先清空
        textarea.value = '';
        textarea.focus();

        // 触发清空事件
        triggerAllEvents(textarea);

        // 模拟逐字输入
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex < text.length) {
                textarea.value += text[currentIndex];
                currentIndex++;

                // 每输入一个字符就触发事件
                triggerAllEvents(textarea);

                console.log(`第${index + 1}个填空题当前内容: "${textarea.value}"`);
            } else {
                clearInterval(typingInterval);

                // 输入完成后再次触发所有事件
                setTimeout(() => {
                    triggerAllEvents(textarea);
                    textarea.blur();
                    console.log(`第${index + 1}个填空题填写完成: "${textarea.value}"`);

                    // 检查字数显示是否更新
                    setTimeout(() => {
                        checkWordCount(index + 1);
                    }, 500);
                }, 200);
            }
        }, 100); // 每100ms输入一个字符
    }

    // 触发所有可能的事件
    function triggerAllEvents(element) {
        const events = [
            'input', 'change', 'keydown', 'keyup', 'keypress',
            'focus', 'blur', 'paste', 'cut', 'propertychange'
        ];

        events.forEach(eventType => {
            const event = new Event(eventType, {
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(event);
        });

        // 特殊的input事件
        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: element.value
        });
        element.dispatchEvent(inputEvent);

        // React特定的事件
        if (element._valueTracker) {
            element._valueTracker.setValue('');
        }

        // 尝试触发React的onChange
        const reactHandler = element._reactInternalFiber || element._reactInternalInstance;
        if (reactHandler) {
            const onChange = reactHandler.memoizedProps?.onChange;
            if (onChange) {
                onChange({ target: element });
            }
        }
    }

    // 检查字数是否更新
    function checkWordCount(textareaIndex) {
        const countElements = document.querySelectorAll('.index__numCount--pECDw, .index__count_wrap--m1keW');
        console.log(`检查第${textareaIndex}个填空题的字数显示...`);

        countElements.forEach((element, index) => {
            console.log(`字数显示${index + 1}: ${element.textContent}`);
        });
    }

    function autoSubmit() {
        // 使用您提供的精确选择器
        const submitButton = document.querySelector('button.ant-btn.index__submit--jiKIA.ant-btn-primary');

        if (submitButton) {
            console.log('找到提交按钮，准备提交...');
            submitButton.click();

            // 开始监听弹窗
            startModalWatcher();
        } else {
            console.log('未找到提交按钮，尝试其他选择器...');

            // 备用选择器
            const backupButton = document.querySelector('.index__submit--jiKIA') ||
                                document.querySelector('button[class*="submit"]') ||
                                document.querySelector('button:contains("提交")');

            if (backupButton) {
                console.log('使用备用选择器找到提交按钮');
                backupButton.click();
                startModalWatcher();
            } else {
                console.log('完全找不到提交按钮');
            }
        }
    }

    function startModalWatcher() {
        console.log('开始监听弹窗...');

        // 监听DOM变化，检测弹窗出现
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // 检查是否出现评价原因弹窗
                    const reasonModal = document.querySelector('.ant-modal-content .ant-modal-title');
                    if (reasonModal && reasonModal.textContent.includes('评价原因')) {
                        observer.disconnect(); // 找到后停止监听，避免重复触发
                        handleReasonModal();
                        return;
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 15秒后停止监听
        setTimeout(() => {
            observer.disconnect();
            console.log('停止监听弹窗');
        }, 15000);
    }

    function handleReasonModal() {
        console.log('检测到评价原因弹窗');

        setTimeout(() => {
            // 使用更精确的选择器来查找弹窗中的文本框
            let modalTextarea = document.querySelector('.index__reason_modal_content--N1LsY textarea.ant-input');

            // 备用选择器
            if (!modalTextarea) {
                modalTextarea = document.querySelector('.index__root--sPKi7 textarea.ant-input');
            }

            // 再次备用选择器
            if (!modalTextarea) {
                modalTextarea = document.querySelector('.ant-modal-body textarea.ant-input');
            }

            if (modalTextarea) {
                console.log('找到弹窗文本框，开始强制填写评价原因');

                // 使用保存的自定义内容
                const savedAnswers = getSavedAnswers();
                const text = savedAnswers.answer3;
                console.log('弹窗评价原因内容:', text);
                forceInputText(modalTextarea, text);

                // 等待一下后点击确定
                setTimeout(() => {
                    const confirmButton = document.querySelector('.ant-modal-footer .ant-btn-primary');
                    if (confirmButton) {
                        confirmButton.click();
                        console.log('已点击评价原因确定按钮');

                        // 等待7秒后处理最终确认弹窗
                        setTimeout(() => {
                            handleFinalConfirmModal();
                        }, 7000);
                    }
                }, 2000);

            } else {
                console.log('未找到弹窗中的文本框');
            }
        }, 500);
    }

    // 强制输入文本的方法
    function forceInputText(element, text) {
        console.log('开始强制输入文本:', text);

        // 方法1: 直接设置value并触发事件
        element.focus();
        element.value = '';
        triggerAllEvents(element);

        element.value = text;
        triggerAllEvents(element);

        // 方法2: 使用execCommand (如果支持)
        try {
            element.focus();
            element.select();
            document.execCommand('insertText', false, text);
            triggerAllEvents(element);
        } catch(e) {
            console.log('execCommand方法失败:', e);
        }

        // 方法3: 模拟键盘输入
        element.focus();
        element.value = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            // 模拟keydown事件
            const keydownEvent = new KeyboardEvent('keydown', {
                key: char,
                code: `Key${char.toUpperCase()}`,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(keydownEvent);

            // 设置值
            element.value += char;

            // 模拟input事件
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: char
            });
            element.dispatchEvent(inputEvent);

            // 模拟keyup事件
            const keyupEvent = new KeyboardEvent('keyup', {
                key: char,
                code: `Key${char.toUpperCase()}`,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(keyupEvent);
        }

        // 方法4: 强制设置并触发React事件
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(element, text);

        const inputEvent = new Event('input', { bubbles: true });
        element.dispatchEvent(inputEvent);

        // 最后再次触发所有事件
        triggerAllEvents(element);

        console.log('强制输入完成，当前值:', element.value);

        // 检查字数显示
        setTimeout(() => {
            const countElement = document.querySelector('.index__count_wrap--m1keW span:first-child');
            if (countElement) {
                console.log('弹窗字数显示:', countElement.textContent);
            }
        }, 100);
    }

    // 处理最终确认弹窗 - 点击所有确定按钮
    function handleFinalConfirmModal() {
        console.log('等待7秒后，开始处理最终确认弹窗...');

        // 查找当前页面上的所有确定按钮
        const confirmButtons = [
            // 精确选择器
            document.querySelector('.ant-modal-content .ant-btn-primary'),
            // 包含"确定"文本的按钮
            ...Array.from(document.querySelectorAll('button')).filter(btn =>
                btn.textContent.includes('确定') || btn.textContent.includes('确 定')
            ),
            // 通用的primary按钮
            document.querySelector('.ant-btn-primary'),
            // 弹窗中的primary按钮
            document.querySelector('.ant-modal-body ~ div .ant-btn-primary'),
            // 更多备用选择器
            ...Array.from(document.querySelectorAll('.ant-btn-primary')),
            ...Array.from(document.querySelectorAll('button[class*="primary"]')),
            ...Array.from(document.querySelectorAll('.ant-modal .ant-btn'))
        ].filter(Boolean); // 过滤掉null值

        // 去重
        const uniqueButtons = [...new Set(confirmButtons)];

        console.log(`找到 ${uniqueButtons.length} 个可能的确定按钮，准备全部点击`);

        if (uniqueButtons.length > 0) {
            // 依次点击所有按钮，每个按钮间隔500ms
            uniqueButtons.forEach((button, index) => {
                setTimeout(() => {
                    try {
                        // 如果按钮被禁用，先启用它
                        if (button.disabled || button.hasAttribute('disabled')) {
                            console.log(`按钮${index + 1}被禁用，正在启用...`);
                            button.removeAttribute('disabled');
                            button.disabled = false;

                            // 移除倒计时文本
                            const countdownSpan = button.querySelector('span[style*="margin-left"]');
                            if (countdownSpan) {
                                countdownSpan.remove();
                                console.log(`已移除按钮${index + 1}的倒计时文本`);
                            }
                        }

                        // 点击按钮
                        console.log(`点击第${index + 1}个确定按钮:`, button);
                        console.log(`按钮文本: "${button.textContent.trim()}"`);
                        button.click();

                        // 如果是最后一个按钮，等待3秒后查找成功弹窗
                        if (index === uniqueButtons.length - 1) {
                            console.log('所有确定按钮已点击完成！等待3秒后查找成功弹窗...');
                            setTimeout(() => {
                                handleSuccessModal();
                            }, 3000);
                        }
                    } catch (error) {
                        console.log(`点击按钮${index + 1}时出错:`, error);
                    }
                }, index * 500); // 每个按钮间隔500ms
            });
        } else {
            console.log('未找到任何确定按钮，尝试重新查找...');

            // 如果没找到，再等待3秒重试一次
            setTimeout(() => {
                const retryButtons = Array.from(document.querySelectorAll('button')).filter(btn =>
                    btn.textContent.includes('确定') ||
                    btn.textContent.includes('确 定') ||
                    btn.classList.contains('ant-btn-primary')
                );

                if (retryButtons.length > 0) {
                    console.log(`重试找到${retryButtons.length}个确定按钮，全部点击...`);
                    retryButtons.forEach((button, index) => {
                        setTimeout(() => {
                            button.removeAttribute('disabled');
                            button.disabled = false;
                            button.click();
                            console.log(`重试点击按钮${index + 1}`);

                            // 如果是最后一个按钮，等待3秒后查找成功弹窗
                            if (index === retryButtons.length - 1) {
                                setTimeout(() => {
                                    handleSuccessModal();
                                }, 3000);
                            }
                        }, index * 200);
                    });
                } else {
                    console.log('重试后仍未找到确定按钮');
                    isProcessing = false;
                }
            }, 3000);
        }
    }

    // 处理提交成功弹窗
    function handleSuccessModal() {
        console.log('开始查找提交成功弹窗...');

        // 查找包含"提交成功"的弹窗
        const successModal = Array.from(document.querySelectorAll('.ant-modal-body')).find(modal =>
            modal.textContent.includes('提交成功')
        );

        if (successModal) {
            console.log('找到提交成功弹窗');

            // 查找"下一门课程"按钮
            const nextCourseButton = Array.from(successModal.querySelectorAll('button')).find(btn =>
                btn.textContent.includes('下一门课程')
            );

            if (nextCourseButton) {
                console.log('找到"下一门课程"按钮，准备点击...');
                nextCourseButton.click();
                console.log('已点击"下一门课程"按钮');

                // 重置处理状态，准备处理下一门课程
                setTimeout(() => {
                    isProcessing = false;
                    console.log('准备开始下一门课程的评价...');

                    // 等待页面加载后重新开始
                    setTimeout(() => {
                        waitForElements();
                    }, 2000);
                }, 1000);
            } else {
                console.log('未找到"下一门课程"按钮，查找其他可能的按钮...');

                // 查找primary按钮作为备选
                const primaryButton = successModal.querySelector('.ant-btn-primary');
                if (primaryButton) {
                    console.log('找到primary按钮，尝试点击:', primaryButton.textContent);
                    primaryButton.click();

                    setTimeout(() => {
                        isProcessing = false;
                        setTimeout(() => {
                            waitForElements();
                        }, 2000);
                    }, 1000);
                } else {
                    console.log('未找到任何可点击的按钮');
                    isProcessing = false;
                }
            }
        } else {
            console.log('未找到提交成功弹窗，尝试重新查找...');

            // 重新查找，使用更宽泛的条件
            setTimeout(() => {
                const allButtons = Array.from(document.querySelectorAll('button')).filter(btn =>
                    btn.textContent.includes('下一门课程') ||
                    btn.textContent.includes('下一门') ||
                    btn.textContent.includes('下一')
                );

                if (allButtons.length > 0) {
                    console.log(`找到${allButtons.length}个可能的"下一门课程"按钮`);
                    allButtons[0].click();
                    console.log('已点击第一个"下一门课程"按钮');

                    setTimeout(() => {
                        isProcessing = false;
                        setTimeout(() => {
                            waitForElements();
                        }, 2000);
                    }, 1000);
                } else {
                    console.log('完全未找到"下一门课程"按钮');
                    isProcessing = false;
                }
            }, 2000);
        }
    }

    // 添加控制按钮
    function addControlButtons() {
        // 自动填写评价按钮
        const fillButton = document.createElement('button');
        fillButton.innerText = '自动填写评价';
        fillButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        fillButton.addEventListener('click', () => {
            isProcessing = false;
            fillForm();
        });

        // 设置按钮
        const configButton = document.createElement('button');
        configButton.innerText = '设置填空题';
        configButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 140px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: #52c41a;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        configButton.addEventListener('click', createConfigModal);

        document.body.appendChild(fillButton);
        document.body.appendChild(configButton);
    }

    // 页面加载完成后开始执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                waitForElements();
                addControlButtons();
            }, 2000);
        });
    } else {
        setTimeout(() => {
            waitForElements();
            addControlButtons();
        }, 2000);
    }

})();