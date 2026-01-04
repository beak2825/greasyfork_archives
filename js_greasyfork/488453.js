// ==UserScript==
// @name         Coze工具
// @namespace    https://github.com/wzhjm/
// @version      1.5
// @license      GPL-3.0
// @description  Coze自动化工具
// @author       wzshjm
// @match        *://www.coze.com/*
// @match        *://www.coze.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js
// @downloadURL https://update.greasyfork.org/scripts/488453/Coze%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/488453/Coze%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("Coze工具已加载");
    let main = async () => {
        console.log("main已加载");
        var _wait_time
        var wait_time_id1;
        var wait_time_id2;
        // 下载器
        const funDownload = (content, filename) => {
            log(`下载文件：${filename}`);
            const eleLink = document.createElement('a');
            eleLink.download = filename;
            eleLink.style.display = 'none';
            const blob = new Blob([content]);
            eleLink.href = URL.createObjectURL(blob);
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink); // 清除元素，防止DOM过载
        };
        var wait_time = (ms) => {
            let ss = parseInt(ms)
            let tt = () => {
                if (fram2) {
                    fram2.innerText = "倒计时：" + ss
                }
                if (ss > 0) {
                    ss--;
                } else {
                    clearInterval(_wait_time);
                }
            }
            tt()
            _wait_time = setInterval(tt, 1000);
        }
        var wait = (ms) => {
            ms = parseInt(ms)
            ms = ms * 1000;
            return new Promise((resolve, reject) => {
                wait_time_id1 = setTimeout(resolve, ms);
            });
        };
        var wait2 = (ms) => {
            wait_time(ms);
            ms = parseInt(ms);
            ms = ms * 1000;
            return new Promise((resolve, reject) => {
                wait_time_id2 = setTimeout(resolve, ms);
            });
        };
        // 停止等待的函数
        var stopWait = () => {
            clearInterval(_wait_time);
            clearTimeout(wait_time_id1);
            clearTimeout(wait_time_id2);
            fram2.innerText = '倒计时：0';
            progress.value = 0;
        };
        var setNativeValue = (element, value) => {
            const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
            const prototype = Object.getPrototypeOf(element);
            const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

            if (valueSetter && valueSetter !== prototypeValueSetter) {
                prototypeValueSetter.call(element, value);
            } else {
                valueSetter.call(element, value);
            }
        }
        var insertQuestion = async (input_txt) => {
            get_cur_plaintext_content()
            var question_input = document.getElementsByClassName("rc-textarea")[0];
            setNativeValue(question_input, input_txt)
            question_input.dispatchEvent(new Event('input', { bubbles: true }));
            if (is_confirm == true) {
                return
            }
            await wait(1);
            if (is_confirm == true) {
                return
            }
            question_input.parentNode.children[1].children[0].children[0].click();
            await wait(2);
            while (true) {
                if (is_confirm == true) {
                    break
                }
                var loading = document.getElementsByClassName('e5qE_oBizHoEmU57nLO5 Aerxqt_c36EPBQNPWQis')[0]
                if (loading == null) {
                    if (is_down) {
                        let _plaintext_count = document.getElementsByClassName("language-plaintext").length
                        log("当前数量:" + _plaintext_count)
                        for (let index = 0; index < _plaintext_count; index++) {
                            let plaintext = document.getElementsByClassName("language-plaintext")[index].innerText
                            let plaintext_md5 = CryptoJS.MD5(plaintext).toString()
                            if (window.plaintext_content_map.get(plaintext_md5) == undefined) {
                                funDownload(plaintext, new Date().getTime() + ".txt")
                            }
                        }
                    }
                    log("完成一次任务");
                    break;
                }
                await wait(1);
            }
        };

        await wait(1)

        const parent = document.querySelector(".semi-spin-children");
        const firstChild = parent.children[0];
        // 处理重复创建问题
        if (firstChild.children.length != 6) {
            return
        }
        // 自动提问
        var floatButton = document.createElement('button');
        floatButton.textContent = '自动提问';
        floatButton.style.marginLeft = '10px';
        floatButton.className = "semi-button semi-button-primary"
        floatButton.onclick = function () {
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        };
        firstChild.appendChild(floatButton);

        // 创建弹出面板
        var panel = document.createElement('div');
        panel.style.display = 'none';
        panel.style.position = 'fixed';
        panel.style.right = '0px';
        panel.style.top = '74px';
        panel.style.width = '300px';
        panel.style.backgroundColor = '#f9f9f9';
        panel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        panel.style.padding = '10px';
        panel.style.zIndex = '10002';
        firstChild.appendChild(panel);

        let set_style = () => {
            const url = window.location.href;
            // 是否是国内
            if (url.includes("www.coze.cn")) {
                let win_l = document.getElementsByClassName("tool-card--n45JgeYICUopObuac2Xf")
                let win_r = document.getElementsByClassName("w-full h-full overflow-hidden wrapper-single--UMf9npeM8cVkDi0CDqZ0")
                // 打开
                if (is_win) {
                    win_l[0].style.gridTemplateColumns = "13fr 13fr"
                    win_r[0].style.gridTemplateColumns = "26fr 14fr"
                } else {
                    win_l[0].style.gridTemplateColumns = "0 13fr"
                    win_r[0].style.gridTemplateColumns = "2fr 3fr"
                }
            } else {
                let win_l = document.getElementsByClassName("arQAab07X2IRwAe6dqHV")
                let win_r = document.getElementsByClassName("sidesheet-container")
                // 打开
                if (is_win) {
                    win_l[0].style.gridTemplateColumns = "13fr 13fr"
                    win_r[0].style.gridTemplateColumns = "26fr 14fr"
                } else {
                    win_l[0].style.gridTemplateColumns = "0 13fr"
                    win_r[0].style.gridTemplateColumns = "2fr 3fr"
                }
            }

            GM_setValue("is_win", is_win.toString())
        }
        var is_win = GM_getValue("is_win") == "true";
        var winButton = document.createElement('button');
        winButton.style.marginLeft = '10px';
        winButton.className = "semi-button semi-button-primary"
        winButton.innerText = is_win ? '恢复' : '展开';
        winButton.onclick = () => {
            is_win = !is_win
            winButton.innerText = is_win ? '恢复' : '展开';
            set_style()
        }
        firstChild.appendChild(winButton);
        setTimeout(set_style, 1000);

        // 准备提问的内容
        var input1 = document.createElement('textarea');
        input1.placeholder = '准备提问的内容';
        input1.style.color = '#000000';
        input1.style.margin = '5px';
        input1.style.width = '100%';
        input1.style.minHeight = "200px"
        panel.appendChild(input1);
        // 执行间隔(秒)
        var execution_interval = document.createElement('input');
        execution_interval.type = 'number';
        execution_interval.style.color = '#000000';
        execution_interval.placeholder = '执行间隔(秒)';
        execution_interval.style.margin = '5px';
        execution_interval.style.width = '100%';
        panel.appendChild(execution_interval);
        // 最大执行次数
        var input2 = document.createElement('input');
        input2.type = 'number';
        input2.style.color = '#000000';
        input2.placeholder = '最大执行次数';
        input2.style.margin = '5px';
        input2.style.width = '100%';
        panel.appendChild(input2);

        var fram1 = document.createElement('div')
        fram1.style.margin = '5px';
        fram1.style.display = "flex";
        fram1.style.justifyContent = "space-between";
        panel.appendChild(fram1);

        // 开始按钮
        var is_confirm = true
        var confirmButton = document.createElement('button');
        confirmButton.textContent = is_confirm ? '开始' : '停止';
        confirmButton.style.backgroundColor = is_confirm ? "" : 'red';
        confirmButton.className = "semi-button semi-button-primary"
        fram1.appendChild(confirmButton);
        var set_is_confirm = () => {
            is_confirm = !is_confirm
            confirmButton.textContent = is_confirm ? '开始' : '停止';
            confirmButton.style.backgroundColor = is_confirm ? "" : 'red';
            if (is_confirm) {
                stopWait()
            }
        }
        confirmButton.onclick = async () => {
            set_is_confirm()
            var input_txt = input1.value;
            if (input_txt == "") {
                return alert("请输入准备提问的内容")
            }
            log('准备提问的内容:' + input_txt);
            var execution_interval_count = execution_interval.value
            if (execution_interval_count == "" || execution_interval_count == null) {
                execution_interval_count = 0;
            } else {
                execution_interval_count = parseInt(execution_interval_count)
            }
            log('执行间隔(秒):' + execution_interval_count);
            if (input2.value == "") {
                return alert("请输入最大执行次数")
            }
            var implement_count_max = parseInt(input2.value);
            log('最大执行次数:' + implement_count_max);

            for (let index = 0; index < implement_count_max; index++) {
                if (is_confirm == true) {
                    log("任务被强行中断");
                    break
                }
                log("当前执行进度 " + (index + 1) + "/" + implement_count_max);
                progress.value = (index + 1) / implement_count_max;
                await insertQuestion(input_txt);
                if (is_confirm == true) {
                    break
                }
                if (index < implement_count_max - 1) {
                    log("等待" + execution_interval_count + "秒");
                    if (is_confirm == true) {
                        break
                    }
                    await wait2(execution_interval_count);
                } else {
                    set_is_confirm()
                    log("完成全部任务");
                }
            }
        }


        let get_cur_plaintext_content = () => {
            window.plaintext_content_map = new Map()
            for (let index = 0; index < document.getElementsByClassName("language-plaintext").length; index++) {
                window.plaintext_content_map.set(CryptoJS.MD5(document.getElementsByClassName("language-plaintext")[index].innerText).toString(), 1)
            }
        }
        // 是否自动下载开关
        var is_down = true
        var downButton = document.createElement('button');
        downButton.className = "semi-button semi-button-primary"
        downButton.innerText = is_down ? '关闭下载' : '开启下载';
        downButton.style.backgroundColor = is_down ? 'red' : "";
        downButton.onclick = () => {
            is_down = !is_down
            downButton.innerText = is_down ? '关闭下载' : '开启下载';
            downButton.style.backgroundColor = is_down ? 'red' : "";
        }
        fram1.appendChild(downButton);
        // 倒计时
        var fram2 = document.createElement('div')
        fram2.innerText = '倒计时：0';
        fram2.style.color = '#000000';
        fram2.style.margin = '5px';
        panel.appendChild(fram2);
        // 任务进度条
        var progress = document.createElement('progress');
        progress.value = 0;
        progress.style.width = '100%';
        panel.appendChild(progress);
        // 日志区域
        var log_textarea = document.createElement('textarea');
        log_textarea.placeholder = '日志区域';
        log_textarea.style.margin = '5px';
        log_textarea.style.width = '100%';
        log_textarea.style.color = '#000000';
        log_textarea.style.minHeight = "200px"
        panel.appendChild(log_textarea);
        const log = (...args) => {
            const formattedArgs = args.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(' ');
            const logEntry = `${new Date().toLocaleString()}\n${formattedArgs}\n`;
            log_textarea.value += logEntry;
            log_textarea.scrollTop = log_textarea.scrollHeight; // 确保使用scrollTop而不是scrollTo
        };
    }

    let task = () => {
        const timer = setInterval(() => {
            const parent = document.querySelector(".semi-spin-children");
            if (parent) {
                const firstChild = parent.children[0];
                if (firstChild) {
                    clearInterval(timer);
                    main()
                }
            }
        });
    }
    let registerEventHandler = (target) => {
        return function registerTargetEventHandler(methodName) {
            const originMethod = target[methodName];
            return function eventHandler(...args) {
                const event = new Event(methodName.toLowerCase());
                originMethod.apply(target, args);
                window.dispatchEvent(event);
                return originMethod;
            };
        };
    }
    const registerHistoryEventHandler = registerEventHandler(window.history);
    window.history.pushState = registerHistoryEventHandler("pushState");
    let init = () => {
        console.log("Coze工具init");
        const url = window.location.href;
        const botReg = /^https:\/\/www\.coze\.(?:com|cn)\/.*\/bot\/.*$/;
        if (botReg.test(url)) {
            if (!url.includes("analysis")) {
                task();
            }
        }
        const exploreReg = /^https:\/\/www\.coze\.(?:com|cn)\/explore\/.*$/;
        if (exploreReg.test(url)) {
            task();
        }
    }
    window.addEventListener("pushstate", init, false);
    init();
})();