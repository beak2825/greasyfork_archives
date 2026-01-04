// ==UserScript==
// @name LMSYS Chat History Downloader
// @namespace http://tampermonkey.net/
// @version 1.12
// @description Download LMSYS Arena chat history as text file
// @author akira0245
// @match *://chat.lmsys.org
// @match *://arena.lmsys.org
// @icon https://chat.lmsys.org/favicon.ico
// @grant none
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/492216/LMSYS%20Chat%20History%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/492216/LMSYS%20Chat%20History%20Downloader.meta.js
// ==/UserScript==


function getComponentIds() {
    const components = gradio_config.components;

    const modelA = components.find(c => c.type === "chatbot");
    const modelB = components.find(c => c.type === "chatbot" && c.id !== modelA.id);
    const originalChat = components.filter(c => c.type === "chatbot").pop();

    const modelAName = components.find(c => c.type === "markdown" && c.props.value.includes("Model A:"));
    const modelBName = components.find(c => c.type === "markdown" && c.props.value.includes("Model B:"));

    const button1 = components.find(c => c.type === "button" && c.props.value === "📷  Share");
    const button2 = components.filter(c => c.type === "button" && c.props.value === "🗑️  Clear history").pop();

    const originalModel = components.filter(c => c.type === "dropdown").slice(-3)[0];

    console.log(`
const COMPONENT_ID_MODEL_A = ${modelA.id};
const COMPONENT_ID_MODEL_B = ${modelB.id};
const COMPONENT_ID_MODEL_A_NAME = ${modelAName.id};
const COMPONENT_ID_MODEL_B_NAME = ${modelBName.id};
const COMPONENT_ID_BUTTON1 = ${button1.id};

const COMPONENT_ID_ORIGINAL_CHAT = ${originalChat.id};
const COMPONENT_ID_ORIGINAL_MODEL = ${originalModel.id};
const COMPONENT_ID_BUTTON2 = ${button2.id};
    `);
}

window.getComponentIds = getComponentIds;

//function for update component ids
//getComponentIds();

(function() {
    'use strict';


    // 定义组件ID常量
const COMPONENT_ID_MODEL_A = 31;
const COMPONENT_ID_MODEL_B = 33;
const COMPONENT_ID_MODEL_A_NAME = 36;
const COMPONENT_ID_MODEL_B_NAME = 38;
const COMPONENT_ID_BUTTON1 = 55;

const COMPONENT_ID_ORIGINAL_CHAT = 108;
const COMPONENT_ID_ORIGINAL_MODEL = 104;
const COMPONENT_ID_BUTTON2 = 118;

    // 获取模型名称
    function getModelName(componentId) {
        return gradio_config.components.find(component => component.id === componentId).props.value;
    }

    // 获取聊天记录
    function getChatHistory(componentId) {
        const props = gradio_config.components.find(component => component.id === componentId).props;
        let chatHistory = "";

        for (let i = 0; i < props.value.length; i++) {
            const [userMessage, assistantMessage] = props.value[i];
            chatHistory += `User: \n${userMessage}\n\n------\n\nAssistant: \n${assistantMessage}\n\n------\n\n`;
        }

        return chatHistory;
    }

    // 下载聊天记录
    function downloadChatHistory(chatHistory, modelName) {
        if (chatHistory) {
            const blob = new Blob([chatHistory], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat_history_${modelName}_${new Date().toLocaleString()}.md`;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            alert('No chat history found.');
        }
    }

    // 创建下载按钮
    function createDownloadButton(componentId) {
        const downloadButton = document.createElement('button');
        downloadButton.textContent = `📥 Download Chat${componentId === COMPONENT_ID_MODEL_A ? ' A' : componentId === COMPONENT_ID_MODEL_B ? ' B' : ''}`;
        downloadButton.classList.add('lg', 'secondary', 'svelte-cmf5ev');

        // 点击下载按钮时执行下载操作
        downloadButton.addEventListener('click', function() {
            let modelName, chatHistory;
            if (componentId === COMPONENT_ID_MODEL_A || componentId === COMPONENT_ID_MODEL_B) {
                modelName = getModelName(componentId === COMPONENT_ID_MODEL_A ? COMPONENT_ID_MODEL_A_NAME : COMPONENT_ID_MODEL_B_NAME);
                chatHistory = getChatHistory(componentId);
            } else {
                modelName = getModelName(COMPONENT_ID_ORIGINAL_MODEL);
                chatHistory = getChatHistory(COMPONENT_ID_ORIGINAL_CHAT);
            }
            downloadChatHistory(chatHistory, modelName);
        });

        return downloadButton;
    }

    // 监视指定按钮的出现
    function observeTargetButton(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const newTargetButton = document.querySelector(`button.lg.secondary.svelte-cmf5ev#component-${COMPONENT_ID_BUTTON1}`);
                const originalTargetButton = document.querySelector(`button.lg.secondary.svelte-cmf5ev#component-${COMPONENT_ID_BUTTON2}`);

                // 在原有目标按钮旁边插入下载按钮
                if (originalTargetButton) {
                    const originalDownloadButton = createDownloadButton();
                    originalTargetButton.parentNode.insertBefore(originalDownloadButton, originalTargetButton.nextSibling);
                }

                // 在新目标按钮旁边插入下载按钮
                if (newTargetButton) {
                    const downloadButtonA = createDownloadButton(COMPONENT_ID_MODEL_A);
                    const downloadButtonB = createDownloadButton(COMPONENT_ID_MODEL_B);
                    newTargetButton.parentNode.insertBefore(downloadButtonB, newTargetButton.nextSibling);
                    newTargetButton.parentNode.insertBefore(downloadButtonA, newTargetButton.nextSibling);
                }

                // 当原有目标按钮和新目标按钮都出现时,停止观察页面变化
                if (originalTargetButton && newTargetButton) {
                    observer.disconnect();
                    break;
                }
            }
        }
    }

    // 创建 MutationObserver 实例
    const observer = new MutationObserver(observeTargetButton);

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察页面变化
    observer.observe(document.body, config);
})();