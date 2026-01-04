// ==UserScript==
// @name         AIDP筛选器
// @namespace    https://aidp.bytedance.com/
// @version      0.0.7
// @author       哒哒伽
// @description  筛选指定的题目，如代码助手的代码翻译、代码debug，代码sft的python，sql等题目，其中如果是代码debug题目，则会在线执行【提示】里面的代码，用例成功则提示可做，反之自动押后。
// @match        *://*.bytedance.com/*
// @icon         https://lf-cdn-tos.bytescm.com/obj/static/toutiao/xigua-ai-data-platform/static/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479913/AIDP%E7%AD%9B%E9%80%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/479913/AIDP%E7%AD%9B%E9%80%89%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const skip = () => {
        // 如果内容不是数组内的类型或者翻译的目标语言不是Python，则执行相应押后操作，点击押后按钮
        var skipButton = document.getElementsByClassName('arco-btn-secondary')[0];
        if (skipButton.innerText.trim() === "押后") {
            skipButton.click();
            const skip = document.getElementsByClassName("arco-btn-primary")[2];
            skip.click()
        }
    }

    // 定义初始值，用于保存提示里的代码
    var init_bug_value = null
    // 定义初始prompt值
    var init_prompt_value = null

    setInterval(() => {

        // 获取所有类名为'neeko-text'的元素
        var elements = document.getElementsByClassName('neeko-text');
        // console.log(elements);

        // 检查是否有足够的元素
        if (elements.length > 1) {
            // 获取第二个元素(代码助手项目)，索引从0开始，所以第二个元素的索引是1
            var secondElement = elements[1];
            // console.log(secondElement);

            // 获取第7个元素(代码sft项目)，索引从0开始，所以第7个元素的索引是6
            var sevenElement = elements[6];
            // console.log(sevenElement);

            // 进行你需要的操作，例如检查文本内容
            // console.log(document.getElementById("textarea_loxxojrz"));
            // 检查文本内容是否符合要求
            if (['代码翻译', '代码debug', '代码评审'].includes(secondElement.innerText.trim())) {
                // 如果是代码翻译
                if (secondElement.innerText.trim() === "代码翻译") {
                    let textareaValue = document.getElementsByTagName('textarea')[0].value.trim();
                    let condition = !textareaValue.includes("你的工作是将下面的代码翻译成python") && !textareaValue.includes("你的工作是将下面的Python的代码翻译成Javascript");
                    if (condition) {
                        // 押后
                        skip()
                    }
                } else if (secondElement.innerText.trim() === "代码debug") {
                    // 如果是代码debug
                    const bug_val = document.getElementsByTagName('textarea')[1]
                    // 提示里面的代码还未渲染出来
                    if (bug_val === undefined) {
                        return
                    }
                    // 判断页面是否更新（即押后或者提交）
                    if (init_bug_value === bug_val.value.trim()) {
                        return
                    }
                    // 不一致说明已经切换下一题，先赋值再请求
                    init_bug_value = bug_val.value.trim()
                    // 使用 fetch 发送请求
                    fetch('http://localhost:3000/test-python-code', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                            // 添加其他需要的 headers
                        },
                        body: JSON.stringify({
                            code: init_bug_value
                        })
                    }).then(response => {
                        if (!response.ok) {
                            // 如果响应状态码不是2xx，抛出错误
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    }).then(res => {
                        // 请求成功，处理响应数据
                        console.log(res);
                        if (res.code === 200) {
                            alert("当前题目可做^_^")
                        } else {
                            // 押后
                            skip()
                        }

                    }).catch(error => {
                        // 请求失败，处理错误
                        alert("接口请求失败-_-", error)
                    });
                }
            } else if (['sft-代码标注-python', 'sft-代码标注-sql'].includes(sevenElement.innerText.trim())) {
                if (document.getElementsByClassName("auto-hide-last-sibling-br")[1].innerText === init_prompt_value) {
                    return
                }
                init_prompt_value = document.getElementsByClassName("auto-hide-last-sibling-br")[1].innerText
                const code_type = sevenElement.innerText.trim().split("-")[2]
                alert("题目状态：可做" + "\n" + "题目类型：" + code_type)
            } else {
                // 押后
                skip()
            }
        }
    }, 3000);
})();