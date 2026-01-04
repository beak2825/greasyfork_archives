// ==UserScript==
// @name         北京科技大学锐格查看答案
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  获取锐格答案
// @author       慌得一批的荒
// @match        http://ucb.ustb.edu.cn/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480242/%E5%8C%97%E4%BA%AC%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E9%94%90%E6%A0%BC%E6%9F%A5%E7%9C%8B%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/480242/%E5%8C%97%E4%BA%AC%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E9%94%90%E6%A0%BC%E6%9F%A5%E7%9C%8B%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scriptEnabled = false;

    const panel = document.createElement('div');
    const button = document.createElement('button');
    const output = document.createElement('div');

    GM_addStyle(`
        #scriptPanel {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: white;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
            z-index: 10000;
        }

        #scriptToggleButton {
            background-color: #4CAF50;
            color: white;
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }

        #output {
            margin-top: 10px;
            padding: 5px;
            border: 1px solid #ddd;
            background-color: #f5f5f5;
        }
    `);

    panel.id = 'scriptPanel';
    button.id = 'scriptToggleButton';
    button.textContent = '开始';
    output.id = 'output';

    button.addEventListener('click', function() {
        scriptEnabled = !scriptEnabled;
        button.textContent = scriptEnabled ? '关闭' : '开始';
        if (scriptEnabled) {
            runScript();
        }
    });

    panel.appendChild(button);
    panel.appendChild(output);
    document.body.appendChild(panel);

    function runScript() {
        const url = window.location.href;
        const match = url.match(/#(\d+)/);

        if (match && match[1]) {
            const a = parseInt(match[1], 10);
            captureShowMyPrgKeyOutput(a);
        } else {
            console.error("错误");
        }
    }

    function captureShowMyPrgKeyOutput(a) {
        // 假设showMyPrgKey函数现在返回结果而不是打印到控制台
        const result = showMyPrgKey(a, 1);
        output.textContent = '答案已获取';
    }
})();