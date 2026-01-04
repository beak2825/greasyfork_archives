// ==UserScript==
// @name         百度/谷歌/ddg搜索跳转ChatGPT
// @namespace    https://www.tampermonkey.net/
// @version      1.9.1
// @description  在 Google、百度、DuckDuckGo 搜索页面添加按钮，一键跳转到 ChatGPT 并自动使用联网搜索
// @author       schweigen
// @match        https://www.google.com/search*
// @match        https://google.com/search*
// @match        https://www.baidu.com/*
// @match        https://duckduckgo.com/*
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/533406/%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8Cddg%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%ACChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/533406/%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8Cddg%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%ACChatGPT.meta.js
// ==/UserScript==

/**
 * 用户设置 - 可以修改以下变量来自定义脚本行为
 */
const USER_SETTINGS = {
    // 备注：部分账号暂时无法使用 o4-mini-high 模型
    // 是否启用临时聊天模式
    ENABLE_TEMPORARY_CHAT: false,

    // 默认使用的模型（作为备用）
    DEFAULT_MODEL: "o4-mini-high",

    // 搜索页面展示的模型按钮
    MODEL_BUTTONS: [
        { label: 'o4mh', model: 'o4-mini-high', color: '#d97706', hoverColor: '#b45309' },
        { label: 'o3', model: 'o3', color: '#2563eb', hoverColor: '#1d4ed8' },
        { label: '5T', model: 'gpt-5-thinking', color: '#059669', hoverColor: '#047857' }
    ],

    // 按钮的垂直位置（距离顶部的像素值）
    BUTTON_TOP_POSITION: 80,

    // 按钮距离右侧的像素值（Google、DuckDuckGo 使用）
    BUTTON_RIGHT_POSITION: 20,

    // 百度页面按钮距离左侧的像素值
    BUTTON_LEFT_POSITION: 20,

    // 要添加到搜索前的前缀文字
    SEARCH_PREFIX: "websearch: ",

    // 等待发送按钮出现的最长时间（毫秒）
    SEND_BUTTON_WAIT_TIMEOUT: 5000
};

(function() {
    'use strict';

    const hostname = window.location.hostname;
    const isGooglePage = hostname.includes('google');
    const isBaiduPage = hostname.includes('baidu.com');
    const isDuckDuckGoPage = hostname.includes('duckduckgo.com');
    const isChatGPTPage = hostname.includes('chatgpt.com');

    if (isGooglePage || isBaiduPage || isDuckDuckGoPage) {
        if (!document.getElementById('gpt-buttons-style')) {
            const style = document.createElement('style');
            style.id = 'gpt-buttons-style';
            style.textContent = `
                .gpt-buttons-container {
                    position: fixed;
                    top: ${USER_SETTINGS.BUTTON_TOP_POSITION}px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    z-index: 1000;
                }
                .gpt-buttons-container.gpt-buttons-right {
                    right: ${USER_SETTINGS.BUTTON_RIGHT_POSITION}px;
                }
                .gpt-buttons-container.gpt-buttons-left {
                    left: ${USER_SETTINGS.BUTTON_LEFT_POSITION}px;
                }
                .gpt-button {
                    background-color: var(--bg-color, #10a37f);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px 12px;
                    margin: 0;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: background-color 0.3s;
                }
                .gpt-button:hover {
                    background-color: var(--hover-color, #0d8c6d);
                }
                .gpt-icon {
                    margin-right: 6px;
                    width: 16px;
                    height: 16px;
                }
            `;
            document.head.appendChild(style);
        }

        const SEARCH_PARAM_MAP = {
            google: 'q',
            baidu: 'wd',
            duckduckgo: 'q'
        };

        function getSearchInput() {
            if (isGooglePage) {
                return document.querySelector('input[name="q"]');
            }
            if (isBaiduPage) {
                return document.querySelector('input[name="wd"], input#kw');
            }
            if (isDuckDuckGoPage) {
                return document.querySelector('input[name="q"], input#searchbox_input, input#search_form_input, input#search_form_input_homepage');
            }
            return null;
        }

        function getSearchParamKey() {
            if (isBaiduPage) {
                return SEARCH_PARAM_MAP.baidu;
            }
            if (isDuckDuckGoPage) {
                return SEARCH_PARAM_MAP.duckduckgo;
            }
            return SEARCH_PARAM_MAP.google;
        }

        function createGptButton(buttonLabel, targetModel, colors) {
            const button = document.createElement('button');
            button.className = 'gpt-button';
            if (colors) {
                const { color, hoverColor } = colors;
                if (color) {
                    button.style.setProperty('--bg-color', color);
                }
                if (hoverColor) {
                    button.style.setProperty('--hover-color', hoverColor);
                }
            }

            const iconSvg = `<svg class="gpt-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5093-2.6067-1.4997z"></path></svg>`;

            button.innerHTML = iconSvg + buttonLabel;
            button.title = `使用 ${targetModel} 模型在 ChatGPT 中查询`;

            button.addEventListener('click', function() {
                const searchInput = getSearchInput();
                let searchText = searchInput ? searchInput.value.trim() : '';

                if (!searchText) {
                    const params = new URLSearchParams(window.location.search);
                    const fallbackParam = getSearchParamKey();
                    searchText = (params.get(fallbackParam) || '').trim();
                }

                if (searchText) {
                    redirectToChatGPT(searchText, targetModel);
                }
            });

            return button;
        }

        function redirectToChatGPT(searchText, model) {
            const selectedModel = model || USER_SETTINGS.DEFAULT_MODEL;
            let urlParams = `model=${selectedModel}&prompt=${encodeURIComponent(USER_SETTINGS.SEARCH_PREFIX + searchText)}`;

            if (USER_SETTINGS.ENABLE_TEMPORARY_CHAT) {
                urlParams += '&temporary-chat=true';
            }

            const chatGptUrl = `https://chatgpt.com/?${urlParams}`;
            window.open(chatGptUrl, '_blank');
        }

        function addButtonsToPage() {
            if (document.querySelector('.gpt-buttons-container')) {
                return;
            }

            const container = document.createElement('div');
            container.className = 'gpt-buttons-container';
            if (isBaiduPage) {
                container.classList.add('gpt-buttons-left');
            } else {
                container.classList.add('gpt-buttons-right');
            }

            USER_SETTINGS.MODEL_BUTTONS.forEach(({ label, model: modelName, color, hoverColor }) => {
                const button = createGptButton(label, modelName, { color, hoverColor });
                container.appendChild(button);
            });

            document.body.appendChild(container);
        }

        window.addEventListener('load', function() {
            addButtonsToPage();
        });

        function setupMutationObserver() {
            const targetNode = document.body;
            if (!targetNode) {
                document.addEventListener('DOMContentLoaded', setupMutationObserver, { once: true });
                return;
            }

            const observer = new MutationObserver(function() {
                if (!document.querySelector('.gpt-buttons-container')) {
                    addButtonsToPage();
                }
            });

            observer.observe(targetNode, { childList: true, subtree: true });
        }

        setupMutationObserver();

        setTimeout(addButtonsToPage, 1000);
    }
    else if (isChatGPTPage) {
        // ChatGPT页面的脚本处理

        // 从URL参数中检查是否是从Google搜索跳转过来的
        const urlParams = new URLSearchParams(window.location.search);
        const promptParam = urlParams.get('prompt');

        if (promptParam) {
            // 标记是否已经点击过发送按钮
            let hasClickedSendButton = false;

            // 使用MutationObserver监听DOM变化，等待发送按钮出现
            const observer = new MutationObserver(function(mutations) {
                if (hasClickedSendButton) return; // 如果已经点击过，不再尝试

                // 尝试精确匹配发送按钮
                const sendButton = document.querySelector('button#composer-submit-button[data-testid="send-button"]');

                if (sendButton && !sendButton.disabled) {
                    console.log("找到发送按钮，准备点击");
                    hasClickedSendButton = true; // 标记为已点击

                    // 创建一个鼠标点击事件
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });

                    // 分发事件到发送按钮
                    sendButton.dispatchEvent(clickEvent);
                    console.log("已点击发送按钮，停止监听");

                    // 停止观察
                    observer.disconnect();
                }
            });

            // 开始观察文档
            observer.observe(document, { childList: true, subtree: true });

            // 设置超时，最多等待指定时间
            setTimeout(function() {
                if (!hasClickedSendButton) {
                    console.log("达到最大等待时间，停止监听");
                    observer.disconnect();
                }
            }, USER_SETTINGS.SEND_BUTTON_WAIT_TIMEOUT);
        }
    }
})();
