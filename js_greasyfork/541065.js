// ==UserScript==
// @name         【牛牛】华医网课程收藏工具(不喜勿喷)✨
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  通过输入课程CID值自动收藏华医网课程!或者打开对应课程页面将会自动收藏,不需要手动去点!此脚本不适合所有人,只适合爱收藏课程的人群,不做过多解释,此为基础版本,后续将进行优化,更多功能敬请您等候!
// @author       VX:hapens1986
// @match        https://cme28.91huayi.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541065/%E3%80%90%E7%89%9B%E7%89%9B%E3%80%91%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%AF%BE%E7%A8%8B%E6%94%B6%E8%97%8F%E5%B7%A5%E5%85%B7%28%E4%B8%8D%E5%96%9C%E5%8B%BF%E5%96%B7%29%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541065/%E3%80%90%E7%89%9B%E7%89%9B%E3%80%91%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%AF%BE%E7%A8%8B%E6%94%B6%E8%97%8F%E5%B7%A5%E5%85%B7%28%E4%B8%8D%E5%96%9C%E5%8B%BF%E5%96%B7%29%E2%9C%A8.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    GM_addStyle(`
        #cid-input-container {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            background: white;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
        #cid-input {
            width: 250px;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
        #collect-btn {
            background: #1277af;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 3px;
            cursor: pointer;
        }
        #collect-btn:hover {
            background: #0e6a9c;
        }
        #status-message {
            margin-top: 10px;
            font-size: 12px;
            color: #666;
        }
    `);
 
    const container = document.createElement('div');
    container.id = 'cid-input-container';
    container.innerHTML = `
        <h3>华医网课程收藏工具</h3>
        <input type="text" id="cid-input" placeholder="请输入课程CID值">
        <button id="collect-btn">收藏课程</button>
        <div id="status-message"></div>
    `;
    document.body.appendChild(container);
 
    const cidInput = document.getElementById('cid-input');
    const collectBtn = document.getElementById('collect-btn');
    const statusMessage = document.getElementById('status-message');
 
    function getCIDFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('cid');
    }
 
    function autoClickCollect() {
        const currentCID = getCIDFromURL();
        if (currentCID) {
            const collectBtn = document.getElementById('btnCollect');
            if (collectBtn) {
                if (collectBtn.getAttribute('data-collect') === '0') {
                    collectBtn.click();
                    statusMessage.textContent = `课程 ${currentCID} 收藏成功!`;
                    statusMessage.style.color = 'green';
                } else {
                    statusMessage.textContent = `课程 ${currentCID} 已收藏过!`;
                    statusMessage.style.color = 'orange';
                }
            } else {
                statusMessage.textContent = '未找到收藏按钮，请等待页面加载完成';
                statusMessage.style.color = 'red';
                setTimeout(autoClickCollect, 1000); // 1秒后重试
            }
        }
    }
 
    collectBtn.addEventListener('click', function() {
        const cid = cidInput.value.trim();
        if (!cid) {
            statusMessage.textContent = '请输入有效的CID值';
            statusMessage.style.color = 'red';
            return;
        }
 
        const currentCID = getCIDFromURL();
        if (currentCID === cid) {
            autoClickCollect();
        } else {
            window.location.href = `https://cme28.91huayi.com/pages/course.aspx?cid=${cid}`;
        }
    });
 
    window.addEventListener('load', function() {
        const autoCollect = GM_getValue('autoCollect', false);
        if (autoCollect) {
            GM_setValue('autoCollect', false);
            setTimeout(autoClickCollect, 2000); // 延迟2秒确保页面完全加载
        }
    });
 
    const currentCID = getCIDFromURL();
    if (currentCID && document.referrer.includes('cme28.91huayi.com')) {
        GM_setValue('autoCollect', true);
    }
})();