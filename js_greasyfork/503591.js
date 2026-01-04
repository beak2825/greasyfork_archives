
// ==UserScript==
// @name          我的ChatGPT提示词
// @namespace     killest.xyz
// @version       1.0.1
// @description   ChatGPT 智能 Prompts 可以为你带来更好的使用体验助你训练好用的ChatGPT：添加快捷指令（prompts）新增：论文专家角色、支持自动发送、固定智能助手...还有更多需求可以到仓库Issues里发起！
// @author        killest
// @match         *://*.chatgpt.com/*
// @match         *://*.oaifree.com/*
// @match         *://*.aivvm.com/*
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/503591/%E6%88%91%E7%9A%84ChatGPT%E6%8F%90%E7%A4%BA%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/503591/%E6%88%91%E7%9A%84ChatGPT%E6%8F%90%E7%A4%BA%E8%AF%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (document.querySelector('#chatgptHelper')) {
        return;
    }
    var SHORTCUTS = [



        [
            '❤spring助手',
            "你作为助手,本对话基于springboot2和springcloud,使用常用库如mybatis-plus 等,使用中文markdown回复,注意使用中文回复"
        ],
        [
            '👉wpf',
            "本对话基于WPF,使用Prism框架,你作为助手,使用markdown格式回复"
        ],
        [
            '👉python',
            "使用python语言,本对话基于sklearn和pytorch,使用相关库matplotlib pandas lightgbm shap等,你作为编程助手,用中文使用markdown回复,代码注意使用中文添加注释"
        ],
        [
            'centos',
            "你作为一个助手,本对话基于centos9,包括一些常用工具如docker等,使用中文markdown回复,"
        ],
        [
            '👉 Vue3 开发人员',
            "你作为vue3编程助手,使用pnpm,TypeScript, 使用相关第三方库如echarts, element-plus, pinia, Tailwind CSS, vite 代码使用<script setup lang=\"ts\">,使用markdown回复,vue代码块改用typescript,如果理解,回复ok"
        ]



    ];
    var rootEle = document.createElement('div');
    rootEle.id = 'chatgptHelper';
    rootEle.innerHTML = "<div id=\"chatgptHelperOpen\" class=\"fixed top-1/2 right-1 z-50 p-3 rounded-md transition-colors duration-200 text-white cursor-pointer border border-white/20 bg-gray-900 hover:bg-gray-700 -translate-y-1/2\">\u5FEB<br>\u6377<br>\u6307<br>\u4EE4</div><div id=\"chatgptHelperMain\" class=\"fixed top-0 right-0 bottom-0 z-50 flex flex-col px-3 w-96 text-gray-100 bg-gray-900\" style=\"transform: translateX(100%); transition: transform 0.2s;\"><div class=\"py-4 pl-3\"><a href=\"https://github.com/winchesHe/chatGPT-prompt-scripts\" target=\"_blank\">ChatGPT 中文调教助手</a></div><ul class=\"flex flex-1 overflow-y-auto py-4 border-y border-white/20 text-sm\" style=\"flex-wrap: wrap\">".concat(SHORTCUTS.map(function (_a) {
        var label = _a[0], value = _a[1];
        return "<li class=\"mr-2 mb-2 py-1 px-3 rounded-md hover:bg-gray-700 cursor-pointer\" data-value=\"".concat(encodeURI(value), "\">").concat(label, "</li>");
    }).join(''), `</ul><div class=\"flex items-center py-4\"><div id=\"chatgptHelperClose\" class=\"py-2 px-3 rounded-md cursor-pointer hover:bg-gray-700\">\u5173\u95ED</div><div class=\"flex-1 pr-3 text-right text-sm items-center\">
    <label class="flex items-center cursor-pointer" style="display: inline-block;">
        <input type=\"checkbox\" id=\"isPain\" style="border-radius: 20px; margin-bottom: 3px;">
        <span>是否固定面板</span>
    </label>
    <label class=\"flex items-center ml-2 cursor-pointer\" style="display: inline-block;">
        <input type=\"checkbox\" id=\"isAutoSend\" style="border-radius: 20px; margin-bottom: 3px;" checked>
        <span>是否自动发送</span>
    </label>
    </div></div></div></div>`);


    // 创建一个新的 KeyboardEvent 事件对象
    const keyEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
        keyCode: 13,
    });
    rootEle.querySelector('ul').addEventListener('click', function (event) {
        var target = event.target;
        const isAutoSend = document.getElementById('isAutoSend').checked;
        const isPain = document.getElementById('isPain').checked;
        if (target.nodeName === 'LI') {
            var value = target.getAttribute('data-value');
            if (value) {
                var textareaEle_1 = document.querySelector('textarea');
                textareaEle_1.value = decodeURI(value);
                textareaEle_1.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(function () {
                    if (isAutoSend) {
                        textareaEle_1.dispatchEvent(keyEvent)
                    } else {
                        textareaEle_1.focus();
                    }
                }, 1e3);
            }
            if (!isPain) {
                chatgptHelperMain.style.transform = 'translateX(100%)';
            }
        }
    });
    document.body.appendChild(rootEle);
    var chatgptHelperMain = document.querySelector('#chatgptHelperMain');
    document.querySelector('#chatgptHelperOpen').addEventListener('click', function () {
        chatgptHelperMain.style.transform = 'translateX(0)';
    });
    document.querySelector('#chatgptHelperClose').addEventListener('click', function () {
        chatgptHelperMain.style.transform = 'translateX(100%)';
    });
})();
