// ==UserScript==
// @name         沈阳理工大学方正教务快速评教脚本2025
// @namespace    https://github.com/Dark-Li/SYLU_JiaoshiPingjia
// @version      0.1
// @description  一次性快速完成沈阳理工大学方正教务系统的教师评价，由Cursor编写。分数默认为6-8分，如果需要其他分数请自行修改代码。
// @author       Ender_Li
// @match        *://jxw.sylu.edu.cn/xspjgl/xspj_cxXspjIndex.html*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522680/%E6%B2%88%E9%98%B3%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E5%BF%AB%E9%80%9F%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC2025.user.js
// @updateURL https://update.greasyfork.org/scripts/522680/%E6%B2%88%E9%98%B3%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E5%BF%AB%E9%80%9F%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC2025.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加控制面板
    const panel = document.createElement('div');
    panel.innerHTML = `
        <div style="position: fixed; top: 10px; right: 10px; background: #fff; padding: 10px; border: 1px solid #ccc; z-index: 9999;">
            <button id="quickRate">一键评教</button>
            <div id="debugInfo" style="color: red;"></div>
        </div>
    `;
    document.body.appendChild(panel);

    function showDebug(message) {
        const debugDiv = document.getElementById('debugInfo');
        if (debugDiv) {
            debugDiv.textContent = message;
        }
        console.log(message);
    }

    // 快速评教函数
    async function quickRate() {
        showDebug('开始快速评教...');

        // 一次性获取所有输入框
        const inputs = document.querySelectorAll('input.form-control.input-sm.input-pjf');
        if (inputs.length === 0) {
            showDebug('未找到评分输入框！');
            return;
        }

        // 一次性填充所有分数
        inputs.forEach(input => {
            const maxScore = parseInt(input.getAttribute('data-zdfz')) || 8;
            let score;
            
            if (maxScore === 8) {
                score = Math.floor(Math.random() * 3) + 6;  // 6-8分
            } else if (maxScore === 6) {
                score = Math.floor(Math.random() * 3) + 4;  // 4-6分
            } else {
                score = Math.floor(maxScore * 0.8);  // 其他情况
            }
            
            input.value = score;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // 点击保存按钮
        const saveBtn = document.querySelector('#btn_xspj_bc');
        if (saveBtn) {
            saveBtn.click();

            let firstDialogHandled = false;  // 添加标记，记录第一个弹窗是否已处理

            // 处理警告框和确认框
            const handleDialogs = setInterval(() => {
                // 尝试查找并点击各种可能的确认按钮
                const buttons = [
                    document.querySelector('#btn_ok[data-bb-handler="ok"]'),  // 最后的确定按钮
                    document.querySelector('#btn_ok'),  // 警告框的确认按钮
                    document.querySelector('button[data-bb-handler="confirm"]'),  // 保存确认按钮
                ];

                for (const btn of buttons) {
                    if (btn && btn.offsetParent !== null) {  // 检查按钮是否可见
                        // 模拟鼠标移动到按钮上
                        btn.dispatchEvent(new MouseEvent('mouseover', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }));

                        // 模拟鼠标按下
                        btn.dispatchEvent(new MouseEvent('mousedown', {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            button: 0
                        }));

                        // 短暂延迟后模拟鼠标释放和点击
                        setTimeout(() => {
                            btn.dispatchEvent(new MouseEvent('mouseup', {
                                bubbles: true,
                                cancelable: true,
                                view: window,
                                button: 0
                            }));

                            btn.dispatchEvent(new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                view: window,
                                button: 0
                            }));
                        }, 50);
                        
                        // 如果这是第一个弹窗的处理
                        if (!firstDialogHandled) {
                            firstDialogHandled = true;
                            // 等待1秒后模拟鼠标点击提交按钮
                            setTimeout(() => {
                                const submitBtn = document.querySelector('#btn_xspj_tj');
                                if (submitBtn) {
                                    // 模拟鼠标移动到按钮上
                                    submitBtn.dispatchEvent(new MouseEvent('mouseover', {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window
                                    }));

                                    // 模拟鼠标按下
                                    submitBtn.dispatchEvent(new MouseEvent('mousedown', {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window,
                                        button: 0
                                    }));

                                    // 短暂延迟后模拟鼠标释放和点击
                                    setTimeout(() => {
                                        submitBtn.dispatchEvent(new MouseEvent('mouseup', {
                                            bubbles: true,
                                            cancelable: true,
                                            view: window,
                                            button: 0
                                        }));

                                        submitBtn.dispatchEvent(new MouseEvent('click', {
                                            bubbles: true,
                                            cancelable: true,
                                            view: window,
                                            button: 0
                                        }));

                                        // 等待500ms后处理提交确认按钮
                                        setTimeout(() => {
                                            const confirmBtn = document.querySelector('#btn_confirm');
                                            if (confirmBtn) {
                                                // 模拟鼠标移动到确认按钮上
                                                confirmBtn.dispatchEvent(new MouseEvent('mouseover', {
                                                    bubbles: true,
                                                    cancelable: true,
                                                    view: window
                                                }));

                                                // 模拟鼠标按下
                                                confirmBtn.dispatchEvent(new MouseEvent('mousedown', {
                                                    bubbles: true,
                                                    cancelable: true,
                                                    view: window,
                                                    button: 0
                                                }));

                                                // 短暂延迟后模拟鼠标释放和点击
                                                setTimeout(() => {
                                                    confirmBtn.dispatchEvent(new MouseEvent('mouseup', {
                                                        bubbles: true,
                                                        cancelable: true,
                                                        view: window,
                                                        button: 0
                                                    }));

                                                    confirmBtn.dispatchEvent(new MouseEvent('click', {
                                                        bubbles: true,
                                                        cancelable: true,
                                                        view: window,
                                                        button: 0
                                                    }));

                                                    // 等待500ms后处理最后的确定按钮
                                                    setTimeout(() => {
                                                        const okBtn = document.querySelector('#btn_ok');
                                                        if (okBtn) {
                                                            // 模拟鼠标移动到确定按钮上
                                                            okBtn.dispatchEvent(new MouseEvent('mouseover', {
                                                                bubbles: true,
                                                                cancelable: true,
                                                                view: window
                                                            }));

                                                            // 模拟鼠标按下
                                                            okBtn.dispatchEvent(new MouseEvent('mousedown', {
                                                                bubbles: true,
                                                                cancelable: true,
                                                                view: window,
                                                                button: 0
                                                            }));

                                                            // 短暂延迟后模拟鼠标释放和点击
                                                            setTimeout(() => {
                                                                okBtn.dispatchEvent(new MouseEvent('mouseup', {
                                                                    bubbles: true,
                                                                    cancelable: true,
                                                                    view: window,
                                                                    button: 0
                                                                }));

                                                                okBtn.dispatchEvent(new MouseEvent('click', {
                                                                    bubbles: true,
                                                                    cancelable: true,
                                                                    view: window,
                                                                    button: 0
                                                                }));

                                                                // 点击确定按钮后，尝试切换到下一个教师
                                                                setTimeout(() => {
                                                                    // 获取所有教师行
                                                                    const allTeachers = document.querySelectorAll('tr.ui-widget-content.jqgrow.ui-row-ltr');
                                                                    
                                                                    if (allTeachers.length > 0) {
                                                                        // 寻找下一个未评教的教师
                                                                        let nextTeacher = null;
                                                                        for (const teacher of allTeachers) {
                                                                            // 查找状态单元格
                                                                            const statusCell = teacher.querySelector('td[aria-describedby="tempGrid_tjztmc"]');
                                                                            if (statusCell && statusCell.getAttribute('title') === '未评') {
                                                                                nextTeacher = teacher;
                                                                                break;
                                                                            }
                                                                        }

                                                                        if (nextTeacher) {
                                                                            showDebug('切换到下一位未评教师...');
                                                                            // 获取教师姓名用于调试显示
                                                                            const teacherName = nextTeacher.querySelector('td[aria-describedby="tempGrid_jzgmc"]')?.textContent || '未知教师';
                                                                            showDebug(`正在切换到教师：${teacherName}`);

                                                                            // 模拟鼠标点击下一个教师
                                                                            nextTeacher.dispatchEvent(new MouseEvent('mouseover', {
                                                                                bubbles: true,
                                                                                cancelable: true,
                                                                                view: window
                                                                            }));

                                                                            setTimeout(() => {
                                                                                nextTeacher.dispatchEvent(new MouseEvent('mousedown', {
                                                                                    bubbles: true,
                                                                                    cancelable: true,
                                                                                    view: window,
                                                                                    button: 0
                                                                                }));

                                                                                setTimeout(() => {
                                                                                    nextTeacher.dispatchEvent(new MouseEvent('mouseup', {
                                                                                        bubbles: true,
                                                                                        cancelable: true,
                                                                                        view: window,
                                                                                        button: 0
                                                                                    }));

                                                                                    nextTeacher.dispatchEvent(new MouseEvent('click', {
                                                                                        bubbles: true,
                                                                                        cancelable: true,
                                                                                        view: window,
                                                                                        button: 0
                                                                                    }));

                                                                                    // 清除当前的定时器
                                                                                    clearInterval(handleDialogs);
                                                                                    
                                                                                    // 等待页面加载新教师的评教表
                                                                                    setTimeout(() => {
                                                                                        // 递归调用quickRate继续评教
                                                                                        quickRate();
                                                                                    }, 1000);
                                                                                }, 50);
                                                                            }, 50);
                                                                        } else {
                                                                            showDebug('所有教师评教完成！');
                                                                            clearInterval(handleDialogs);
                                                                        }
                                                                    } else {
                                                                        showDebug('未找到教师列表！');
                                                                        clearInterval(handleDialogs);
                                                                    }
                                                                }, 1000);
                                                            }, 50);
                                                        } else {
                                                            showDebug('未找到确定按钮！');
                                                        }
                                                    }, 500);
                                                }, 50);
                                            } else {
                                                showDebug('未找到提交确认按钮！');
                                            }
                                        }, 500);
                                    }, 50);
                                } else {
                                    showDebug('未找到提交按钮！');
                                }
                            }, 1000);
                        }
                        break;
                    }
                }

                // 尝试切换到下一个教师
                const nextTeacher = document.querySelector('tr.odd:not(.selected), tr:not(.selected)');
                if (nextTeacher) {
                    nextTeacher.click();
                    clearInterval(handleDialogs);  // 找到并点击下一个教师后停止检查
                }
            }, 200);  // 每200ms检查一次

            // 60秒后自动清除定时器（以防万一）
            setTimeout(() => {
                clearInterval(handleDialogs);
            }, 60000);
        } else {
            showDebug('未找到保存按钮！');
        }
    }

    // 绑定按钮事件
    window.addEventListener('load', () => {
        const rateButton = document.getElementById('quickRate');
        if (rateButton) {
            rateButton.addEventListener('click', quickRate);
            showDebug('脚本已准备就绪');
        } else {
            showDebug('未找到按钮！');
        }
    });
})(); 