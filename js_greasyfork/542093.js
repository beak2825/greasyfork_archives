// ==UserScript==
// @name         微信商户平台辅助退款工具完整版
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  增加：退款成功截图
// @author       KevinLiu
// @match        https://pay.weixin.qq.com/index.php/core/refundapply*
// @match        https://pay.weixin.qq.com/index.php/core/refundquery*
// @match        https://pay.weixin.qq.com/index.php/xphp/ccomplaints/complaints_info*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542093/%E5%BE%AE%E4%BF%A1%E5%95%86%E6%88%B7%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9%E9%80%80%E6%AC%BE%E5%B7%A5%E5%85%B7%E5%AE%8C%E6%95%B4%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542093/%E5%BE%AE%E4%BF%A1%E5%95%86%E6%88%B7%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9%E9%80%80%E6%AC%BE%E5%B7%A5%E5%85%B7%E5%AE%8C%E6%95%B4%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加一些样式
    GM_addStyle(`
        .auto-refund-status {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 5px;
            z-index: 9999;
            font-size: 14px;
        }
    `);

    // 显示状态信息
    function showStatus(message) {
        let statusDiv = document.querySelector('.auto-refund-status');
        console.log(message); // 新增这行打印到控制台
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.className = 'auto-refund-status';
            document.body.appendChild(statusDiv);
        }
        statusDiv.textContent = message;
        setTimeout(() => statusDiv.remove(), 3000);
    }

    // 处理退款申请页面
    function handleRefundApplyPage() {
        // 等待页面加载完成
        const checkExist = setInterval(function() {
            const orderInput = document.querySelector('#app div div:nth-child(2) div:nth-child(2) div:nth-child(2) div span input');
            const applyBtn = document.querySelector('#applyRefundBtn');

            if (orderInput && applyBtn) {
                clearInterval(checkExist);

                // 从剪贴板获取内容
                navigator.clipboard.readText().then(clipText => {
                    if (clipText && clipText.trim() !== '') {
                        // 使用正则表达式分割制表符和可能的空格
                        const parts = clipText.split(/\t+/);
                        const orderNo = parts[0] ? parts[0].trim() : '';
                        let amount = parts[1] ? parts[1].trim() : '';

                        console.log('分割结果:', {orderNo, amount});

                        if (!orderNo) {
                            showStatus('剪贴板中没有找到有效的商户订单号');
                            return;
                        }

                        // 填充订单号
                        orderInput.value = orderNo;
                        const event = new Event('input', { bubbles: true });
                        orderInput.dispatchEvent(event);

                        showStatus('已填充商户订单号: ' + orderNo);

                        // 点击申请退款按钮
                        setTimeout(() => {
                            applyBtn.click();
                            showStatus('正在查询订单信息...');
                            // 新增：先滚动到顶部
                            window.scrollTo(0, 0);
                            // 向下滚动300像素
                            window.scrollBy(0, 300);

                            // 如果有金额信息，等待退款金额输入框出现
                            if (amount) {
                                amount = amount.replace(/[¥,]/g, '').trim();
                                waitForAmountInput(amount);
                            }
                        }, 500);
                    } else {
                        showStatus('剪贴板中没有找到商户订单号');
                    }
                }).catch(err => {
                    showStatus('无法读取剪贴板: ' + err);
                });
            }
        }, 500);
    }

    // 等待退款金额输入框出现并填充金额
    function waitForAmountInput(amount) {
        const checkAmountInput = setInterval(function() {
            const amountInput = document.querySelector('#app div div:nth-child(2) div:nth-child(2) div:nth-child(3) div:nth-child(2) div div:nth-child(1) div span:nth-child(1) input');
            const submitBtn = document.querySelector('#commitRefundApplyBtn');


            if (amountInput && submitBtn) {
                clearInterval(checkAmountInput);

                // 填充退款金额
                amountInput.value = amount;
                const event = new Event('input', { bubbles: true });
                amountInput.dispatchEvent(event);

                showStatus('已填充退款金额: ' + amount);

                // 点击提交申请按钮
                setTimeout(() => {
                    submitBtn.click();
                    showStatus('正在提交退款申请...');

                    // 新增：等待弹窗出现并处理短信验证
                    const checkSmsDialog = setInterval(() => {
                        const smsBtn = document.querySelector('#id_send_sms');
                        const pwdInput = document.querySelector('#sec_verify_dialog div div div div input');
                        const smsCodeInput = document.querySelector('#sec_verify_dialog div[data-v-1b588ea0].form-item:nth-child(2) input[data-v-1b588ea0].real-input');

                        if (pwdInput) {
                            // 1. 让密码输入框获取焦点
                            setTimeout(() => {
                                pwdInput.focus();
                                showStatus('密码输入框已聚焦，请手动输入密码');
                                // 触发自动输入事件
                                pwdInput.value = "663180";
                                const inputEvent = new Event('input', { bubbles: true });
                                pwdInput.dispatchEvent(inputEvent);
                                showStatus('已填充操作密码');
                            }, 100);
                        }

                        if (smsBtn) {
                            clearInterval(checkSmsDialog);
                            // 2. 点击发送短信按钮
                            smsBtn.click();
                            showStatus('已发送验证短信');

                            if (smsCodeInput) {
                                // 3. 自动聚焦到手机验证码输入框
                                setTimeout(() => {
                                    smsCodeInput.focus();
                                    showStatus('请输入手机验证码');

                                    // 监听验证码输入完成（6位）
                                    smsCodeInput.addEventListener('input', function onSmsInput() {
                                        if (smsCodeInput.value.length >= 6) {
                                            smsCodeInput.removeEventListener('input', onSmsInput);

                                            // 4. 查找并点击确定按钮
                                            const confirmBtn = document.querySelector('#app > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > a');
                                            if (confirmBtn) {
                                                confirmBtn.click();
                                                showStatus('已提交验证信息，等待跳转...');

                                                // 5. 等待确定按钮消失（表示跳转中）
                                                const checkBtnDisappear = setInterval(() => {
                                                    if (!document.contains(confirmBtn)) {
                                                        clearInterval(checkBtnDisappear);

                                                        // 6. 等待进入退款查询按钮出现
                                                        const checkQueryBtn = setInterval(() => {
                                                            const queryBtn = document.querySelector('#app > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > a:nth-child(1)');
                                                            if (queryBtn) {
                                                                clearInterval(checkQueryBtn);

                                                                // 7. 点击进入退款查询
                                                                setTimeout(() => {
                                                                    queryBtn.click();
                                                                    showStatus('正在跳转退款查询页面...');
                                                                }, 500);
                                                            }
                                                        }, 300);
                                                    }
                                                }, 300);
                                            }
                                        }
                                    });
                                }, 100);
                            }
                        } else {
                            // 6. 等待进入退款查询按钮出现
                            const checkQueryBtn = setInterval(() => {
                                const queryBtn = document.querySelector('#app > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > a:nth-child(1)');
                                if (queryBtn) {
                                    clearInterval(checkQueryBtn);

                                    // 7. 点击进入退款查询
                                    setTimeout(() => {
                                        queryBtn.click();
                                        showStatus('正在跳转退款查询页面...');
                                    }, 500);
                                }
                            }, 300);
                        }
                    }, 100);
                }, 500);
            }
        }, 100);
    }

    // 处理退款查询页面
    function handleRefundQueryPage() {
        // 等待页面加载完成
        const checkExist = setInterval(function() {
            const queryBtn = document.querySelector('#app div div div:nth-child(2) div:nth-child(3) div:nth-child(3) div:nth-child(4) div a');

            if (queryBtn) {
                clearInterval(checkExist);

                let retryCount = 0;
                const maxRetries = 5;

                function checkRefundStatus() {
                    queryBtn.click();
                    showStatus('正在查询退款状态...');

                    setTimeout(() => {
                        const statusElement = document.querySelector('#queryResultPage div:nth-child(2) table tbody tr:nth-child(2) td:nth-child(3) span');
                        if (statusElement) {
                            const status = statusElement.textContent.trim();
                            if (status === '退款成功') {
                                showStatus('退款状态: 成功');

                                // 添加截图功能
                                setTimeout(() => {
                                    // 动态加载html2canvas库
                                    if (typeof html2canvas === 'undefined') {
                                        const script = document.createElement('script');
                                        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
                                        script.onload = captureTable;
                                        document.head.appendChild(script);
                                    } else {
                                        captureTable();
                                    }
                                }, 1000);
                                return;
                            } else if (retryCount < maxRetries) {
                                retryCount++;
                                showStatus(`退款状态: ${status} (重试 ${retryCount}/${maxRetries})`);
                                setTimeout(checkRefundStatus, 500);
                            } else {
                                showStatus(`已达到最大重试次数，最终状态: ${status}`);
                            }
                        } else if (retryCount < maxRetries) {
                            retryCount++;
                            showStatus(`未找到状态元素 (重试 ${retryCount}/${maxRetries})`);
                            setTimeout(checkRefundStatus, 500);
                        } else {
                            showStatus('已达到最大重试次数，未能获取退款状态');
                        }
                    }, 500);
                }

                checkRefundStatus();
            }
        }, 500);
    }



    // 新增截图函数
    async function captureTable() {
        try {
            showStatus('正在截图...');

            // 查找退款状态表格
            const table = document.querySelector('#queryResultPage div:nth-child(2) table');

            if (!table) {
                showStatus('未找到表格');
                return;
            }

            // 截图整个表格
            const canvas = await html2canvas(table, {
                backgroundColor: '#ffffff',
                scale: 1.5, // 提高清晰度
                useCORS: true,
                logging: false
            });

            // 复制到剪贴板
            canvas.toBlob(async (blob) => {
                try {
                    const item = new ClipboardItem({ 'image/png': blob });
                    await navigator.clipboard.write([item]);

                    // 显示成功提示
                    showStatus('截图已复制到剪贴板');

                    // 添加弹窗提示
                    showStatus('退款成功！截图已保存到剪贴板，可直接粘贴使用。');

                } catch (err) {
                    showStatus('复制失败: ' + err.message);
                }
            });

        } catch (error) {
            showStatus('截图失败: ' + error.message);
        }
    }

    // 根据剪切板商户单号处理投诉单
    function handleComplaintsPage() {
        // 创建处理按钮
        const processBtn = document.createElement('button');
        processBtn.textContent = '根据剪切板商户单号处理投诉单';
        processBtn.style.position = 'fixed';
        processBtn.style.top = '20px';
        processBtn.style.right = '20px';
        processBtn.style.zIndex = '9999';
        processBtn.style.padding = '10px 15px';
        processBtn.style.backgroundColor = '#07C160';
        processBtn.style.color = 'white';
        processBtn.style.border = 'none';
        processBtn.style.borderRadius = '4px';
        processBtn.style.cursor = 'pointer';
        
        document.body.appendChild(processBtn);
    
        processBtn.addEventListener('click', async () => {
            try {
                const clipText = await navigator.clipboard.readText();
                if (!clipText) {
                    showStatus('剪贴板中没有内容');
                    return;
                }
    
                const superOrders = clipText.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.startsWith('super'));
    
                if (superOrders.length === 0) {
                    showStatus('剪贴板中没有找到以super开头的商户单号');
                    return;
                }
    
                showStatus(`找到 ${superOrders.length} 个待处理投诉单`);
    
                for (const order of superOrders) {
                    const orderNo = order.split(' ')[0];
                    if (!orderNo) continue;
    
                    // 填充单号并查询
                    const input = document.querySelector('#table > div:nth-child(1) > form > div:nth-child(2) > div > div > input');
                    const queryBtn = document.querySelector('#table > div:nth-child(1) > form > div:nth-child(8) > div > div > button');
                    
                    if (!input || !queryBtn) {
                        showStatus('找不到输入框或查询按钮');
                        return;
                    }
    
                    input.value = orderNo;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    queryBtn.click();
    
                    // 等待查询结果
                    await new Promise(resolve => setTimeout(resolve, 1000));
    
                    // 检查状态
                    const statusElement = document.querySelector('#table > div:nth-child(2) > div:nth-child(3) > table > tbody > tr > td:nth-child(10) > div > span:nth-child(1)');
                    if (!statusElement) {
                        showStatus(`订单 ${orderNo} 未找到状态元素`);
                        continue;
                    }
    
                    const status = statusElement.textContent.trim();
                    if (status === '已处理完成') {
                        showStatus(`订单 ${orderNo} 已处理完成，跳过`);
                        continue;
                    }
    
                    // 点击回复用户按钮
                    const replyBtn = document.querySelector('#table > div:nth-child(2) > div:nth-child(3) > table > tbody > tr > td:nth-child(11) > div > a:nth-child(1)');
                    if (!replyBtn) {
                        showStatus(`订单 ${orderNo} 找不到回复按钮`);
                        continue;
                    }
                    replyBtn.click();
    
                    // 等待弹窗出现
                    await new Promise(resolve => setTimeout(resolve, 500));
    
                    // 填写回复内容
                    const replyTextarea = document.querySelector('#businessReply > div > div > div:nth-child(2) > form > div:nth-child(1) > div > div:nth-child(1) > textarea');
                    const sendBtn = document.querySelector('#businessReply > div > div > div:nth-child(2) > form > div:nth-child(5) > div > div > button:nth-child(2)');
                    
                    if (replyTextarea && sendBtn) {
                        replyTextarea.value = '您好，已操作退款，请查收。感谢您选择"超级单词表"。';
                        replyTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                        sendBtn.click();
                    }
    
                    // 等待弹窗关闭
                    await new Promise(resolve => setTimeout(resolve, 500));
    
                    // 点击处理完成按钮
                    const completeBtn = document.querySelector('#table > div:nth-child(2) > div:nth-child(3) > table > tbody > tr > td:nth-child(11) > div > a:nth-child(2)');
                    if (completeBtn) {
                        completeBtn.click();
                    }
    
                    showStatus(`订单 ${orderNo} 处理完成`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 间隔1秒处理下一个
                }
    
                showStatus('所有投诉单处理完成');
            } catch (err) {
                showStatus('处理出错: ' + err.message);
                console.error(err);
            }
        });
    }
    
    // 根据当前URL执行不同的逻辑
    if (window.location.href.includes('refundapply')) {
        handleRefundApplyPage();
    } else if (window.location.href.includes('refundquery')) {
        handleRefundQueryPage();
    } else if (window.location.href.includes('ccomplaints/complaints_info')) {
        handleComplaintsPage();
    }
})();