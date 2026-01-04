// ==UserScript==
// @name         XAUAT 自动评教脚本
// @namespace    http://tampermonkey.net/
// @version      1.4.3.1
// @description  西安建筑科技大学自动评教脚本
// @author       MrSuM and rain
// @match        https://swjw.xauat.edu.cn/evaluation-student-frontend/*
// @grant        none
// @encoding     utf-8
// @downloadURL https://update.greasyfork.org/scripts/536990/XAUAT%20%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/536990/XAUAT%20%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';

    console.log('xauat自动评教脚本-1.4.2');

    // 元素配置
    const appSelector = '#app';
    const itemSelector = '.item';
    const radioSelector = 'input.el-radio__original';
    const checkboxSelector = 'input.el-checkbox__original';
    const textareaSelector = 'textarea.el-textarea__inner';
    const submitBtnSelector = 'button.el-button.el-button--primary.el-button--small';
    const timelySurveySelector = 'button.el-button.el-button--primary.el-button--mini.is-plain.is-round.borderhalf';
    const byTaskSelector = 'a.el-tooltip.el-link.el-link--primary.is-underline';

    var config = {
        is_running: true,
        current_route: '/',
    }

    var ui = {};

    // 延迟函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 等待元素加载
    function waitForElement(selector, timeout = 5000) {
        return new Promise(resolve => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
            }
            else {
                const t = setTimeout(() => {
                    observer.disconnect();
                    resolve(null);
                }, timeout);

                const observer = new MutationObserver(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        observer.disconnect();
                        clearTimeout(t);
                        resolve(element);
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            }
        });
    }

    // 即时性评教答题填写
    async function solveTimelySurvey() {
        const items = document.querySelectorAll(itemSelector);
        for (let item of items) {
            let option_count = 0;
            const options = item.querySelectorAll('label.el-checkbox');

            for (let option of options) {
                const checkbox = option.querySelector(checkboxSelector);
                if (checkbox && !checkbox.checked) {
                    checkbox.click();
                    // console.log(`选项 ${checkbox.value} 已选中`);
                }
                await sleep(1);
                if (++option_count >= 3) break;
            }
        }

        const textarea = document.querySelector(textareaSelector);
        if (textarea) {
            textarea.value = '这个老师真棒！';
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            // console.log('已填写评教内容');
        }

        const submitBtn = document.querySelector(submitBtnSelector);
        if (submitBtn) {
            submitBtn.click();
            // console.log('提交按钮点击成功');
        }
    }

    // 总性性评教答题填写
    async function solveTSurvey() {
        const items = document.querySelectorAll(itemSelector);
        for (let item of items) {
            const option = item.querySelector(radioSelector);
            if (option) {
                option.click();
                // console.log(`选项 ${option.value} 已选中`);
            }

            const textarea = item.querySelector(textareaSelector);
            if (textarea) {
                textarea.value = '这个老师真棒！';
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                // console.log('已填写评教内容');
            }

            await sleep(1);
        }

        const submitBtn = document.querySelector(submitBtnSelector);
        if (submitBtn) {
            submitBtn.click();
            // console.log('提交按钮点击成功');
        }
    }

    // 路由处理
    const route_handler = {
        // 即时性评教答题页面
        '/timelySurvey': async function () {
            try {
                if (config.is_running) {
                    await waitForElement(itemSelector).then(solveTimelySurvey);
                }
            } catch (e) {
                console.error('/timelySurvey 出错:', e);
            }
        },
        // 即时性评教选择页面
        '/timely-evaluation/myparticipate': async function () {
            try {
                if (config.is_running) {
                    await waitForElement(timelySurveySelector).then((element) => {
                        if (element) {
                            element.click();
                        }
                        else {
                            config.is_running = false;
                            updateUI();

                            alert('即时性评教完成！');
                        }
                    });
                }
            } catch (e) {
                console.error('/timely-evaluation/myparticipate 出错:', e);
            }
        },
        // 总结性评教选择页面
        '/byTask': async function () {
            try {
                if (config.is_running) {
                    await waitForElement(byTaskSelector).then((element) => {
                        // await sleep(1000); // TODO: 触发服务器限流（访问太过频繁，休息，休息一下！）
                        if (element) {
                            element.click();
                        }
                        else {
                            config.is_running = false;
                            updateUI();

                            alert('总结性评教完成！');
                        }
                    });
                }
            } catch (e) {
                console.error('/byTask 出错:', e);
            }
        },
        // 总结性评教答题页面
        '/tSurvey': async function () {
            try {
                if (config.is_running) {
                    await waitForElement(itemSelector).then(solveTSurvey);
                }
            } catch (e) {
                console.error('/tSurvey 出错:', e);
            }
        },
        //  其他
        '/': async function () {
            try {
                if (config.is_running) {
                    // const a = document.createElement('a');
                    // a.href = '#/timely-evaluation/myparticipate';
                    // a.click();
                    window.location.href = '#/timely-evaluation/myparticipate';
                }
            } catch (e) {
                console.error('/ 出错:', e);
            }
        }
    };

    // 路由监听
    function setupRouteHook() {
        try {
            const appVue = document.querySelector("#app").__vue__;
            if (!appVue || !appVue.$router || !appVue.$router.afterHooks) {
                console.warn('Vue Router 未正确初始化');
                return;
            }

            appVue.$router.afterHooks.push((to, from) => {
                console.log('路由切换:', from.path, '->', to.path);
                config.current_route = to.path;
                for (const key in route_handler) {
                    if (to.path.startsWith(key)) {
                        console.log('匹配到路由:', key);
                        route_handler[key]();
                        break;
                    }
                }
            });
        } catch (e) {
            console.error('路由监听设置失败:', e);
        }
    }

    // 配置UI
    function setupUI() {
        // 创建悬浮窗容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.backgroundColor = '#fff';
        container.style.padding = '10px';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'flex-start';

        // 创建按钮
        const button_run = document.createElement('button');
        button_run.textContent = config.is_running ? '停止评教' : '开始评教';
        button_run.style.marginBottom = '10px';
        button_run.style.padding = '5px 10px';
        button_run.style.cursor = 'pointer';

        // 创建状态标签
        const label_status = document.createElement('label');
        label_status.textContent = config.is_running ? '状态：评教中' : '状态：已停止';
        label_status.style.fontSize = '14px';
        label_status.style.color = config.is_running ? 'green' : 'red';

        // 添加点击事件
        button_run.addEventListener('click', async () => {
            config.is_running = !config.is_running;

            // 更新按钮文本
            button_run.textContent = config.is_running ? '停止评教' : '开始评教';

            // 更新状态标签
            label_status.textContent = config.is_running ? '状态：评教中' : '状态：已停止';
            label_status.style.color = config.is_running ? 'green' : 'red';

            if (config.is_running) {
                for (const key in route_handler) {
                    if (config.current_route.startsWith(key)) {
                        console.log('匹配到路由:', key);
                        await route_handler[key]();
                        break;
                    }
                }
            }
        });

        // ui全局变量
        ui.container = container;
        ui.button_run = button_run;
        ui.label_status = label_status;

        // 将按钮和标签添加到容器
        container.appendChild(button_run);
        container.appendChild(label_status);

        // 将容器添加到 body
        document.body.appendChild(container);
        console.log('已添加悬浮窗', container);
    }

    // 更新ui
    function updateUI() {
        ui.button_run.textContent = config.is_running ? '停止评教' : '开始评教';
        ui.label_status.textContent = config.is_running ? '状态：评教中' : '状态：已停止';
        ui.label_status.style.color = config.is_running ? 'green' : 'red';
    }

    // 初始化
    (async () => {
        setupRouteHook();
        setupUI();
    })();
})();
