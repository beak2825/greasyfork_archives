// ==UserScript==
// @name         聚工自动答题-需配合聚工题库收集助手
// @namespace    vx:shuake345
// @version      1.3
// @description  手动触发在煤矿考试网站上答题|vx:shuake345
// @author       vx:shuake345
// @match        https://oe.jugong365.com/exam/exam_detail.html?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546790/%E8%81%9A%E5%B7%A5%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98-%E9%9C%80%E9%85%8D%E5%90%88%E8%81%9A%E5%B7%A5%E9%A2%98%E5%BA%93%E6%94%B6%E9%9B%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/546790/%E8%81%9A%E5%B7%A5%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98-%E9%9C%80%E9%85%8D%E5%90%88%E8%81%9A%E5%B7%A5%E9%A2%98%E5%BA%93%E6%94%B6%E9%9B%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 题库数据
    const questionBank = {
        "煤矿企业安全生产的第一责任人是？": "C",
        "下列哪项不是从业人员的安全生产义务？": "A",
        "安全风险辨识的首要步骤是？": "B",
        "以下哪种方法常用于风险评估？": "B",
        "重大安全风险清单中不包括下列哪项内容？": "C",
        "隐患排查治理的闭环管理要求不包括？": "D",
        "煤矿水害防治中，最常用的技术手段是？": "A",
        "下列哪项属于内因火灾？": "B",
        "顶板事故的主要诱因是？": "B",
        "下列哪项属于煤矿企业主要负责人的法定职责？": "A",
        "安全培训制度属于哪一类制度？": "B",
        "风险矩阵法的主要作用是？": "C",
        "下列哪项不是煤矿重大灾害？": "D",
        "煤矿火灾防控中，通风系统调整的主要目的是？": "B",
        "下列哪项属于从业人员权利？": "A",
        "隐患排查治理的首要环节是？": "C",
        "下列哪项属于信息化系统在安全管理中的作用？": "C",
        "顶板监测的主要目的是？": "B",
        "下列哪项属于煤矿水害类型？": "A",
        "安全生产责任制的核心是？": "A",
        "下列哪项属于火灾应急处置的首要任务？": "B",
        "下列哪项属于安全投入的范畴？": "B",
        "下列哪项不属于煤矿重大安全风险？": "C",
        "下列哪项属于隐患排查治理的闭环要求？": "A",
        "下列哪项是煤矿火灾的外因？": "B",
        "下列哪项是煤矿水害应急处置的正确做法？": "B",
        "下列哪项属于安全生产管理制度？": "A",
        "下列哪项是顶板支护的基本原则？": "B",
        "下列哪项属于安全风险辨识方法？": "A",
        "下列哪项是煤矿企业落实主体责任的关键？": "A",
        "煤矿企业主要负责人无需参与安全培训。": "B",
        "从业人员有权拒绝违章指挥和强令冒险作业。": "A",
        "风险辨识评估结果只用于检查，不作为管理依据。": "B",
        "隐患整改完成后必须验收合格才能销号。": "A",
        "煤矿火灾只能通过外因引发，内因不会起火。": "B",
        "顶板监测是预防冒顶事故的重要手段。": "A",
        "安全投入越多，事故发生率一定越低。": "B",
        "信息化系统可实现隐患闭环管理。": "A",
        "煤矿水害只发生在雨季，旱季不会发生。": "B",
        "安全生产责任制只需落实到管理层。": "B",
        "瓦斯爆炸属于煤矿重大灾害之一。": "A",
        "隐患排查治理不需要记录，只需整改即可。": "B",
        "煤矿火灾防控中，通风系统调整可控制火势蔓延。": "A",
        "从业人员发现隐患后可选择不报告。": "B",
        "安全风险辨识只需每年进行一次即可。": "B",
        "注浆堵水是煤矿水害防控的有效手段之一。": "A",
        "班组长不属于安全生产责任人。": "B",
        "煤矿企业必须建立健全安全管理制度。": "A",
        "安全生产权利与义务是对等的。": "A",
        "顶板事故发生后应立即组织人员撤离。": "A"
    };

    let isAnswering = false;
    let answerInterval = null;

    // 创建答题按钮
    function createAnswerButton() {
        // 移除旧按钮（如果存在）
        const oldBtn = document.getElementById('autoAnswerBtn');
        if (oldBtn) {
            oldBtn.remove();
        }

        const btn = document.createElement('button');
        btn.id = 'autoAnswerBtn';
        btn.innerHTML = '开始自动答题';

        // 使用更高的z-index确保按钮在最上层
        btn.style.position = 'fixed';
        btn.style.top = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '2147483647';
        btn.style.padding = '12px 20px';
        btn.style.backgroundColor = '#28a745';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '16px';
        btn.style.fontWeight = 'bold';
        btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        btn.style.transition = 'all 0.3s ease';

        // 鼠标悬停效果
        btn.addEventListener('mouseover', function() {
            if (!isAnswering) {
                btn.style.backgroundColor = '#218838';
                btn.style.transform = 'translateY(-2px)';
            }
        });

        btn.addEventListener('mouseout', function() {
            if (!isAnswering) {
                btn.style.backgroundColor = '#28a745';
                btn.style.transform = 'translateY(0)';
            }
        });

        // 点击事件
        btn.addEventListener('click', function() {
            if (!isAnswering) {
                startAutoAnswer();
            } else {
                stopAutoAnswer();
            }
        });

        document.body.appendChild(btn);
        console.log('自动答题按钮已添加');
    }

    // 创建停止按钮
    function createStopButton() {
        const stopBtn = document.createElement('button');
        stopBtn.id = 'stopAnswerBtn';
        stopBtn.innerHTML = '停止答题';
        stopBtn.style.position = 'fixed';
        stopBtn.style.top = '70px';
        stopBtn.style.right = '20px';
        stopBtn.style.zIndex = '2147483647';
        stopBtn.style.padding = '10px 15px';
        stopBtn.style.backgroundColor = '#dc3545';
        stopBtn.style.color = 'white';
        stopBtn.style.border = 'none';
        stopBtn.style.borderRadius = '6px';
        stopBtn.style.cursor = 'pointer';
        stopBtn.style.fontSize = '14px';
        stopBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

        stopBtn.addEventListener('click', stopAutoAnswer);
        document.body.appendChild(stopBtn);
    }

    // 移除停止按钮
    function removeStopButton() {
        const stopBtn = document.getElementById('stopAnswerBtn');
        if (stopBtn) {
            stopBtn.remove();
        }
    }

    // 开始自动答题
    function startAutoAnswer() {
        isAnswering = true;
        const btn = document.getElementById('autoAnswerBtn');
        btn.innerHTML = '答题中...';
        btn.style.backgroundColor = '#ffc107';
        btn.style.color = '#000';

        createStopButton();
        showMessage('开始自动答题，每秒执行一次', 'info');

        // 立即执行一次
        executeAnswer();

        // 设置循环，每秒执行一次
        answerInterval = setInterval(executeAnswer, 1000);
    }

    // 停止自动答题
    function stopAutoAnswer() {
        isAnswering = false;
        clearInterval(answerInterval);

        const btn = document.getElementById('autoAnswerBtn');
        btn.innerHTML = '开始自动答题';
        btn.style.backgroundColor = '#28a745';
        btn.style.color = 'white';

        removeStopButton();
        showMessage('已停止自动答题', 'info');
    }

    // 显示消息提示
    function showMessage(message, type = 'info') {
        const oldMessage = document.getElementById('answerMessage');
        if (oldMessage) {
            oldMessage.remove();
        }

        const msgDiv = document.createElement('div');
        msgDiv.id = 'answerMessage';
        msgDiv.innerHTML = message;
        msgDiv.style.position = 'fixed';
        msgDiv.style.top = '120px';
        msgDiv.style.right = '20px';
        msgDiv.style.zIndex = '2147483647';
        msgDiv.style.padding = '10px 15px';
        msgDiv.style.backgroundColor = type === 'info' ? '#17a2b8' : '#dc3545';
        msgDiv.style.color = 'white';
        msgDiv.style.borderRadius = '5px';
        msgDiv.style.fontSize = '14px';
        msgDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

        document.body.appendChild(msgDiv);

        setTimeout(() => {
            if (msgDiv.parentNode) {
                msgDiv.parentNode.removeChild(msgDiv);
            }
        }, 3000);
    }

    // 执行答题功能
    function executeAnswer() {
        try {
            const iframe = document.querySelector('iframe');
            if (!iframe) {
                showMessage('未找到iframe元素', 'error');
                return;
            }

            const iframeDoc = iframe.contentWindow.document;
            const questionElement = iframeDoc.querySelector("div.h5.font-weight-normal.bg-white.p.m-t-xs.well");

            if (!questionElement) {
                showMessage('未找到题目元素', 'error');
                return;
            }

            const questionText = questionElement.innerText.trim();
            let answer = null;
            let isFromBank = true;

            // 在题库中查找答案
            if (questionBank.hasOwnProperty(questionText)) {
                answer = questionBank[questionText];
            } else {
                // 题库中没有找到，自动选A
                answer = 'A';
                isFromBank = false;
                console.log('题库未匹配，自动选A:', questionText);
            }

            const options = iframeDoc.querySelectorAll("li > label > input");

            if (options.length < 4) {
                showMessage('未找到足够的选项', 'error');
                return;
            }

            let clicked = false;
            switch(answer) {
                case 'A':
                    options[0].click();
                    clicked = true;
                    break;
                case 'B':
                    options[1].click();
                    clicked = true;
                    break;
                case 'C':
                    options[2].click();
                    clicked = true;
                    break;
                case 'D':
                    options[3].click();
                    clicked = true;
                    break;
            }

            if (clicked) {
                const status = isFromBank ? `题库答案: ${answer}` : '自动选A';
                showMessage(`已选择答案 (${status})`, 'info');
                console.log('答题成功 - 题目:', questionText, '答案:', answer, isFromBank ? '(来自题库)' : '(自动选A)');
            }
        } catch (error) {
            showMessage('执行出错: ' + error.message, 'error');
            console.error('自动答题错误:', error);
        }
    }

    // 监听弹层出现
    function observeLayers() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.classList && node.classList.contains('layui-layer')) {
                            console.log('检测到弹层出现，重新定位按钮');
                            setTimeout(createAnswerButton, 100);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后添加按钮和监听
    window.addEventListener('load', function() {
        setTimeout(() => {
            createAnswerButton();
            observeLayers();
        }, 2000);
    });

    // 监听URL变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            stopAutoAnswer();
            setTimeout(createAnswerButton, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

})();