// ==UserScript==
// @name         自动关闭指定网页
// @namespace    http://tampermonkey.net/
// @version      2025-01-04
// @description  根据菜单中的关键词或正则自动关闭指定网页
// @license MIT
// @author       You
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/523224/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E6%8C%87%E5%AE%9A%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/523224/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E6%8C%87%E5%AE%9A%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册菜单命令
    GM_registerMenuCommand('🔸屏蔽站点列表', createModal);

    // 从存储中加载屏蔽的站点列表
    const blockedSites = GM_getValue('blockedSites', [
        'xiaohongshu.com',   // 关键词模糊匹配
        '/^https:\/\/www\.bilibili\.com\/$/',  // 正则表达式匹配
        '/^https:\/\/www\.bilibili\.com\/\?spm_id_from/',   // 正则表达式匹配
    ]);

    // 获取当前网页的完整 URL
    const currentUrl = window.location.href;

    // 遍历屏蔽的关键词和正则表达式字符串数组
    for (const site of blockedSites) {
        if ( site &&!site.startsWith('/')) {
            // 如果是字符串，则进行关键词模糊匹配
            if (currentUrl.includes(site)) {
                window.close();
                window.stop();
                window.location.href = 'about:blank';
                break;  // 匹配到后就跳出循环
            }
        }else if (site && site.startsWith('/')) {
            // 修改正则表达式以不区分大小写
            const siteReg = new RegExp(site.slice(1, -1));
            if (siteReg.test(currentUrl)) {
                window.close();
                window.stop();
                window.location.href = 'about:blank';
                return;
            }
        }
    }

    // 创建模态对话框
    function createModal() {

        // 从存储中加载屏蔽的站点列表
        let blockedSites = GM_getValue('blockedSites', [
            'xiaohongshu.com',   // 关键词模糊匹配
            '/^https:\/\/www\.bilibili\.com\/$/',  // 正则表达式匹配
            '/^https:\/\/www\.bilibili\.com\/\?spm_id_from/',   // 正则表达式匹配
        ]);
        const modal = document.createElement('div');
        modal.id = 'blockModal';
        modal.innerHTML = `
            <div id="modalContent">
                <h2>屏蔽站点列表</h2>
                <textarea id="blockList" style="width: 100%; height: 200px;"></textarea>
                <button id="saveButton">保存</button>
                <button id="closeButton">关闭</button>
            </div>
        `;

        // 填充文本域
        const blockListTextArea = modal.querySelector('#blockList');
        blockListTextArea.value = blockedSites.join('\n');

        // 保存按钮事件
        modal.querySelector('#saveButton').addEventListener('click', () => {
            const newBlockedSites = blockListTextArea.value.split('\n').map(line => {
                if (line.startsWith('/')) {
                    try {
                        new RegExp(line.slice(1, -1));
                        return line;
                    } catch (e) {
                        alert(`Invalid regex: ${line}`);
                        return null;
                    }
                }
                return line;
            }).filter(Boolean);

            GM_setValue('blockedSites', newBlockedSites);
            blockedSites= GM_getValue('blockedSites');
            //alert('newBlockedSites: '+ blockedSites);
            alert('blockedSites: '+ blockedSites);
        });

        // 关闭按钮事件
        modal.querySelector('#closeButton').addEventListener('click', () => {
            closeModal();
        });

        // 添加模态对话框到页面
        document.body.appendChild(modal);
    }

    // 关闭模态对话框
    function closeModal() {
        const modal = document.getElementById('blockModal');
        if (modal) {
            modal.remove();
        }
    }


    // CSS 样式
    const style = document.createElement('style');
    style.innerHTML = `
        #blockModal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        #modalContent {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 30%;
            max-width: 300px;
            min-width:240px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
        #modalContent h2 {
            margin-bottom: 10px;
        }
        #modalContent #blockList {
            margin-bottom: 10px;
            max-width: 100%;
        width: 100%;
        height: 200px;
        box-sizing: border-box;
        padding: 6px;
        border-radius: 4px;
        border: 2px solid #D1D5DB;
        font-family: inherit;
        }
        #modalContent button {
        margin-top: 10px;
        padding: 5px 16px;
        cursor: pointer;
        border-radius: 4px;
        border: none;
        outline: 2px solid #D1D5DB;
        font-size: 14px;
    }
    #modalContent #saveButton {
        margin-right: 10px;
        color: white;
        background-color: #00AEEC;
        outline: 2px solid #00AEEC;
    }
    `;
    document.head.appendChild(style);
})();