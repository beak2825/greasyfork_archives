// ==UserScript==
// @name         [250523] 青书学堂作业秒杀助手
// @namespace    http://tampermonkey.net/
// @version      2025-05-23
// @description  进入作业页面 会出现按钮点击一下一击皆斩.只能秒杀作业,不要想考试的事情了
// @author       Hu5
// @match        https://degree.qingshuxuetang.com/*/Student/ExercisePaper*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qingshuxuetang.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535220/%5B250523%5D%20%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E4%BD%9C%E4%B8%9A%E7%A7%92%E6%9D%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/535220/%5B250523%5D%20%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E4%BD%9C%E4%B8%9A%E7%A7%92%E6%9D%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.addEventListener('contextmenu', function(e) {
        // console.log("尝试解除右键菜单限制...");
        // 使用 stopImmediatePropagation 阻止所有其他监听器和默认行为
        // 在这个场景下，我们是想让*默认*行为（显示菜单）发生，
        // 这里的目的是阻止那些尝试调用 e.preventDefault() 的脚本的监听器运行。
        // 通过在捕获阶段尽早且彻底阻止事件传播，那些在冒泡阶段或目标元素上设置的阻止默认行为的监听器就不会有机会执行了。
        e.stopImmediatePropagation();
        // 注意：这里不需要手动调用 e.preventDefault() 或其他，
        // stopImmediatePropagation 的目的是阻止那些会阻止默认行为的脚本。
        // 浏览器自身的右键菜单默认行为通常会在所有监听器执行后触发，
        // 除非有监听器调用了 e.preventDefault()。
        // 因为我们阻止了阻止默认行为的监听器运行，所以默认行为有机会触发。

    }, true); // <-- true 表示在捕获阶段监听

    // 监听 paste 事件 (粘贴)
    window.addEventListener('paste', function(e) {
        // console.log("尝试解除粘贴限制...");
        // 同上，阻止试图调用 e.preventDefault() 的脚本监听器执行
        e.stopImmediatePropagation();
    }, true); // <-- true 表示在捕获阶段监听
    window.addEventListener('copy', function(e) {
        // console.log("尝试解除复制限制...");
        // 同上，阻止试图调用 e.preventDefault() 的脚本监听器执行
        e.stopImmediatePropagation();
    }, true); // <-- true 表示在捕获阶段监听


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const targetSelector = '.question-controller'; // 要等待的目标元素的 CSS 选择器
    let targetElement = null; // 用于存储找到的目标元素
    async function solutionQuestion() {
        let quizId = (new URLSearchParams(location.href)).get("quizId")
        if (!quizId) {
            throw Error("[一击皆斩] 没有发现 quizId ")
        }
        let response = await fetch(`https://degree.qingshuxuetang.com/hkd/Student/DetailData?quizId=${quizId}`)
        let body = await response.json()
        let questions = body.data.paperDetail.questions
        console.log(`[题目数量]`, body.data.paperDetail.questions.length)
        for (let question of body.data.paperDetail.questions) {
            // 单选题的情况
            if (question.typeDesc === "单选题") {
                let solutionId = `${question.questionId}_${question.solution.toUpperCase()}`
                console.log(`[单选题][${question.questionId}] ${question.solution}`)
                document.getElementById(solutionId).click()
                await sleep(150)
            } else if (question.typeDesc === "多选题") {
                console.log(`[多选题][${question.questionId}] ${question.solution}`)
                for (let solution of [...question.solution.toUpperCase()]) {
                    let solutionId = `${question.questionId}_${solution}`

                    if(!document.getElementById(solutionId).checked)document.getElementById(solutionId).click()
                    await sleep(75)
                }
                document.querySelector(".next").click()
            } else {
                console.log(`[问答题][${question.questionId}] ${question.solution}`)
                document.getElementById(question.questionId).querySelector(".question-detail-solution-info").innerHTML = "参考答案(照抄满分,推荐自己编一编):<br/>"+question.solution
            }
        }
    }
    // 这个函数将在找到目标元素后被调用
    function onElementFound() {
        // 找到 class 为 'question-controller' 的元素
        const questionController = document.querySelector('.question-controller');
        // 要插入的 HTML 字符串
        const htmlToInsert = `
        <div class="controller_item switch_container">
            <div class="switch_btn solutionQuestion">
                <span>秒杀选择题</span>
            </div>
        </div>
    `;
        // 如果找到了目标元素
        if (questionController && !document.querySelector(`.solutionQuestion`)) {
            // 使用 insertAdjacentHTML 将 HTML 字符串插入到目标元素的末尾（beforeend）
            questionController.insertAdjacentHTML('beforeend', htmlToInsert);
            document.querySelector(`.solutionQuestion`).addEventListener('click', function() {
                console.log(`[一击皆斩]`, solutionQuestion());
            });
        } else {
            console.error('未找到元素');
        }
    }
    // 创建一个 MutationObserver 实例
    // 回调函数会在 DOM 发生变化时被调用，接收变化列表和观察者实例作为参数
    const observer = new MutationObserver((mutationsList, observer) => {
        // 遍历所有的变化记录
        for (const mutation of mutationsList) {
            // 检查变化的类型是否是子节点列表的变化 (添加或移除节点)
            if (mutation.type === 'childList') {
                // 遍历所有被添加的节点
                for (const addedNode of mutation.addedNodes) {
                    // 检查添加的节点是否是一个元素节点 (排除文本节点等)
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        // 检查添加的节点本身是否匹配目标选择器
                        if (addedNode.matches(targetSelector)) {
                            targetElement = addedNode;
                            observer.disconnect(); // 找到元素后停止观察，避免资源浪费
                            onElementFound(); // 执行找到元素后的逻辑
                            return; // 停止处理当前变化记录，并退出循环
                        } else {
                            // 检查添加的节点的子孙节点中是否有匹配目标选择器的
                            targetElement = addedNode.querySelector(targetSelector);
                            if (targetElement) {
                                observer.disconnect(); // 找到元素后停止观察
                                onElementFound(); // 执行找到元素后的逻辑
                                return; // 停止处理当前变化记录，并退出循环
                            }
                        }
                    }
                }
            }
            // 如果需要，可以添加对其他变化类型的检查 (例如 'attributes' 属性变化)
        }
    });
    // --- 开始观察 DOM ---
    // 配置对象：
    // childList: true -> 观察子节点的添加或移除
    // subtree: true  -> 观察目标节点 (document.body) 的整个子孙树
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    // --- 初始检查：以防元素在观察者启动前已经存在 ---
    // 尽管 @run-at document-idle 比较晚，但有时动态元素加载非常快
    // 在启动观察者后立即检查一次元素是否存在是一个好的做法
    targetElement = document.querySelector(targetSelector);
    if (targetElement) {
        observer.disconnect(); // 停止观察
        onElementFound(); // 执行找到元素后的逻辑
    }
})();