// ==UserScript==
// @name         Stage1st论坛回复优化
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在S1论坛回复框添加生成按钮
// @author       AnchorCat
// @match        *.saraba1st.com/2b/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.siliconflow.cn
// @downloadURL https://update.greasyfork.org/scripts/526368/Stage1st%E8%AE%BA%E5%9D%9B%E5%9B%9E%E5%A4%8D%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/526368/Stage1st%E8%AE%BA%E5%9D%9B%E5%9B%9E%E5%A4%8D%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 硅基流动API配置
const API_KEY = '###'; // 请替换为实际API密钥
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const API_MODEL = 'Pro/deepseek-ai/DeepSeek-R1'; // 模型
//const API_MODEL = 'Pro/deepseek-ai/DeepSeek-V3';

(function() {
    'use strict';

    // 等待回复框加载完成
    const waitForReplyBox = (replyBoxame) => {
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                const replyBox = document.querySelector(`#${replyBoxame}`);
                if (replyBox) {
                    clearInterval(checkInterval);
                    resolve(replyBox);
                }
            }, 100);
        });
    };

    // type:"diss" diss某一层说的话
    const generateS1StyleReply = async (text, type) => {
        var content = `你需要根据以下内容，将内容改写为符合Stage1st论坛风格的回复内容（你只需要生成回复内容即可），并且生成的内容和原内容观点保持一致：${text}`;
        if (type === "diss") {
            content = `你需要根据以下内容，将内容改写为符合Stage1st论坛风格的回复内容（你只需要生成回复内容即可），并且生成的内容要反对原内容观点：${text}`;
        }

        const messages = [
            {
                role: "system",
                content: "你作为一个深谙 Stage1st 论坛外野板块风格的回复者，熟练运用 [f:001] 此类格式的麻将脸表情包（数字可替换，三位数，不足三位数前面用 0 补足），禁止使用黄豆表情包、AC 娘表情包及其他表情包。给出的回复简洁明了，以巨魔语气进行回复，毫无做作之感。只在必要的时候加入赛博朋克，量子力学科技内容。"
            },
            {
                role: "user",
                content: content
            }
        ];

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: API_URL,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                data: JSON.stringify({
                    model: API_MODEL,
                    messages: messages,
                    temperature: 1,
                    max_tokens: 4096
                }),
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    resolve(data.choices[0].message.content);
                },
                onerror: reject
            });
        });
    };

    // 主逻辑
    const main = async () => {
        const replyBox = await waitForReplyBox("fastpostmessage");
        const btnContainer = replyBox.parentElement;

        // 添加生成按钮
        const genButton = document.createElement('button');
        genButton.textContent = `生成S1式回复【${API_MODEL}】`;
        genButton.style.cssText = `
            margin-left: 10px;
            background: #f90;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
        `;

        genButton.addEventListener('click', async (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            e.preventDefault(); // 禁用默认行为
            const originalText = replyBox.value;
            const locker = new ReplyLocker(replyBox);
            locker.lock();
            try {
                const generatedText = await generateS1StyleReply(originalText);
                replyBox.value = generatedText;
            } catch (error) {
                replyBox.value = locker.originalContent; // 恢复原始内容
                console.log("请求失败：", error);
            } finally {
                locker.unlock();
            }
        });
        btnContainer.appendChild(genButton);
    };
    main();

    // 动态监测器
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                attachButtonsToAreaInputs();
            }
        });
    });

    // 启动观察
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 增强型元素绑定
    let isProcessing = false;
    const attachButtonsToAreaInputs = async () => {
        if (isProcessing) return;
        const replyBox = await waitForReplyBox("postmessage");
        const existingBtn = replyBox.parentElement.querySelector("#s1-ai-button-v2");
        if (existingBtn) return;
        isProcessing = true;

        // 添加生成按钮
        const genButton = document.createElement('button');
        genButton.textContent = `生成S1式回复【${API_MODEL}】`;
        genButton.id = "s1-ai-button-v2";
        genButton.style.cssText = `
            margin-left: 10px;
            background: #f90;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
             `;

        replyBox.parentElement.insertBefore(genButton, replyBox.nextSibling);
        genButton.addEventListener('click', async (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            e.preventDefault(); // 禁用默认行为
            const originalText = replyBox.value;
            const locker = new ReplyLocker(replyBox);
            locker.lock();
            try {
                const generatedText = await generateS1StyleReply(originalText);
                replyBox.value = generatedText;
            } catch (error) {
                replyBox.value = locker.originalContent; // 恢复原始内容
                console.log("请求失败：", error);
            } finally {
                locker.unlock();
            }
        });
        isProcessing = false;
    };

    const attachDissButtonsToReply = async () => {
        document.querySelectorAll('.fastre').forEach(fastre => {
            // 创建带有平台模型信息的按钮[^5]
            const dissBtn = document.createElement('button');
            dissBtn.textContent = `DISS它！【${API_MODEL}】`;
            // 插入到fastre元素之后
            fastre.parentNode.insertBefore(dissBtn, fastre.nextSibling);

            dissBtn.addEventListener('click', async (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                e.preventDefault(); // 禁用默认行为
                const originalText = fastre.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector(".t_f").innerHTML;
                console.log("开始diss：", originalText);
                dissBtn.textContent = `正在DISS中！请稍后`;
                try {
                    const generatedText = await generateS1StyleReply(originalText, "diss");
                    // 找到回复按钮并模拟点击
                    const replyBtn = fastre.parentNode.parentNode.querySelector('a.fastre[onclick*="showWindow"]');
                    replyBtn.click(); // 🤖 触发点击事件，弹出窗口
                    // 点击后检查弹窗是否出现
                    setTimeout(() => {
                        autoFillReply(generatedText);
                    }, 1000); // ⏱️ 根据网络延迟调整延迟时间
                    console.log("diss成功：", generatedText);
                } catch (error) {
                    console.log("diss失败：", error);
                } finally {
                    console.log("diss结束：");
                    dissBtn.textContent = `DISS它！【${API_MODEL}】`;
                }
            });
        });
    };

    function autoFillReply(generatedText, retryCount = 0) {
        const replyInput = document.querySelector('#postmessage');
        if (replyInput) {
            replyInput.value = generatedText;
            console.log('成功填充回复内容喵~');
        } else if (retryCount < 2) { // 因为初始是0次，所以需要重试时次数是<2
            console.warn(`第 ${retryCount+1} 次寻找失败，1秒后重试...`);
            setTimeout(() => {
                autoFillReply(generatedText, retryCount + 1);
            }, 1000);
        } else {
            console.error('三次尝试后仍找不到回复框，停止重试喵~ (>﹏<)');
        }
    }

    // 首次加载执行
    attachButtonsToAreaInputs();
    attachDissButtonsToReply();
})();

GM_addStyle(`
    .s1-generating-tip {
        color: #666;
        font-size: 12px;
        padding: 8px;
        margin: 5px 0;
        background: #f9f9f9;
        border-left: 3px solid #f90;
    }
    /* 锁定状态下的回复框样式 */
    .s1-locked {
        opacity: 0.8;
        background-color: #f6f6f6 !important;
        cursor: not-allowed;
    }
`);

class ReplyLocker {
    constructor(replyBox) {
        this.replyBox = replyBox;
        this.originalContent = replyBox.value;
        this.originalStyle = replyBox.style.cssText;
    }

    lock() {
        // 锁定输入但允许复制
        this.replyBox.readOnly = true;
        this.replyBox.style.cssText = `
            background: #f0f0f0;
            opacity: 0.9;
            cursor: not-allowed;
            ${this.originalStyle}
        `;
        this.replyBox.parentElement.insertAdjacentHTML('beforeend',
                                                       `<div class="s1-generating-tip">【回复优化中】当前回复内容已锁定（大概需要30s）</div>`);
    }

    unlock() {
        this.replyBox.readOnly = false;
        this.replyBox.style.cssText = this.originalStyle;
        document.querySelector('.s1-generating-tip')?.remove();
    }
}
