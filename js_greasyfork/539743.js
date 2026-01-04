// ==UserScript==
// @name         流放之路传奇页面跳转市集
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在编年史传奇物品旁添加交易集市跳转 从Azure版本更新过来 支持国服以及后续赛季
// @author       Azure
// @author       ningheimo
// @match        https://poedb.tw/tw/*
// @match        https://poe2db.tw/tw/*
// @match        https://poedb.tw/cn/*
// @match        https://poe2db.tw/cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poedb.tw
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539743/%E6%B5%81%E6%94%BE%E4%B9%8B%E8%B7%AF%E4%BC%A0%E5%A5%87%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%B8%82%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/539743/%E6%B5%81%E6%94%BE%E4%B9%8B%E8%B7%AF%E4%BC%A0%E5%A5%87%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%B8%82%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //AI写的输入框
    function showPanel() {
        const overlay = document.createElement('div');
        overlay.style = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;justify-content:center;align-items:center;`;

        const panel = document.createElement('div');
        panel.style = `background:#222;padding:20px;border-radius:8px;width:280px;color:#eee;`;

        const userLabel = document.createElement('div');
        userLabel.textContent = "国服赛季名称";
        userLabel.style = `margin-bottom:5px;color:#aaa;`;
        panel.appendChild(userLabel);

        const input1 = document.createElement('input');
        input1.type = "text";
        input1.value = GM_getValue("cn_league", "");
        input1.placeholder = 'S26赛季';
        input1.style = `width:100%;padding:8px;margin-bottom:15px;background:#333;color:#fff;border:1px solid #444;`;
        panel.appendChild(input1);

        const apiLabel = document.createElement('div');
        apiLabel.textContent = "国际服赛季名称";
        apiLabel.style = `margin-bottom:5px;color:#aaa;`;
        panel.appendChild(apiLabel);

        const input2 = document.createElement('input');
        input2.type = "text";
        input2.value = GM_getValue("en_league", "");
        input2.placeholder = 'Mercenaries';
        input2.style = `width:100%;padding:8px;margin-bottom:20px;background:#333;color:#fff;border:1px solid #444;`;
        panel.appendChild(input2);

        // 按钮容器
        const btnBox = document.createElement('div');
        btnBox.style = `display:flex;justify-content:flex-end;`;

        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = "取消";
        cancelBtn.style = `padding:6px 12px;background:#444;color:#eee;border:none;border-radius:4px;margin-right:8px;`;
        cancelBtn.onclick = () => document.body.removeChild(overlay);
        btnBox.appendChild(cancelBtn);

        // 保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.textContent = "保存";
        saveBtn.style = `padding:6px 12px;background:#4a6fa5;color:#fff;border:none;border-radius:4px;`;
        saveBtn.onclick = () => {
            GM_setValue("cn_league", input1.value);
            GM_setValue("en_league", input2.value);
            document.body.removeChild(overlay);
            alert('请刷新页面');
        };
        btnBox.appendChild(saveBtn);

        panel.appendChild(btnBox);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    GM_registerMenuCommand("⚙️ 打开设置", showPanel);

    function extractNValue(dataHover) {
        if (!dataHover) return null;

        // 方法1: 使用正则表达式直接匹配n参数
        const match = dataHover.match(/[?&]n=([^&]*)|[?&]name=n(\d+)/i);
        if (match && (match[1] || match[2])) {
            return match[1] || match[2];
        }

        // 方法2: 将字符串转换为URL参数
        const params = new URLSearchParams(dataHover);
        if (params.has('n')) return params.get('n');
        if (params.has('name') && params.get('name').startsWith('n')) {
            return params.get('name').substring(1);
        }

        return null;
    }

    // 页面完全加载后执行
    window.addEventListener('load', function() {
        // 获取class为'flex-grow-1 ms-2'的元素内部的class为'uniqueitem'的元素
        let uniqueItems = document.querySelectorAll('.uniqueitem .uniqueTypeLine');

        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        let poe1 = hostname.toLowerCase().includes('poedb');

        //国服市集查询query:name:无法用英文查找 所以非简中页面无展示意义
        let cn = pathname.toLowerCase().includes('/cn/')
        //Mercenaries
        let en_league = GM_getValue("en_league", "");
        //S26赛季
        let cn_league = GM_getValue("cn_league", "");

        if (uniqueItems.length > 0) {
            uniqueItems.forEach(function(item, index) {
                const parentElement = item.parentElement;
                let itemname = extractNValue(parentElement.getAttribute('data-hover'));
                const tradeLink = document.createElement('a');
                tradeLink.href = poe1 ? `https://www.pathofexile.com/trade/search/${en_league}?q={"query":{"name":"${itemname}"}}` : `https://www.pathofexile.com/trade2/search/poe2/Dawn%20of%20the%20Hunt?q={"query":{"name":"${itemname}"}}`;
                tradeLink.id = 'tradeLink';
                tradeLink.target = '_blank';
                tradeLink.textContent = '查看市集';
                tradeLink.className = 'trade-link';
                tradeLink.style= "font-size: 13px; margin-left: 20px;";
                tradeLink.addEventListener('click', function(event) {
                    if (typeof en_league === 'string' && en_league.trim() === ''){
                        showPanel();
                        event.preventDefault(); // 阻止默认行为
                    }
                });
                parentElement.parentElement.appendChild(tradeLink);
                if (cn){
                    const tradeQQLink = document.createElement('a');
                    let cnItemName = parentElement.getElementsByClassName('uniqueName')[0].innerText;
                    tradeQQLink.href = false ? '' : poe1 ? `https://poe.game.qq.com/trade/search/${cn_league}?q={"query":{"name":"${cnItemName}"}}` : `https://www.pathofexile.com/trade2/search/poe2/Dawn%20of%20the%20Hunt?q={"query":{"name":"${cnItemName}"}}`;
                    tradeQQLink.id = 'tradeQQLink';
                    tradeQQLink.target = '_blank';
                    tradeQQLink.textContent = '查看国服市集';
                    tradeQQLink.className = 'trade-link';
                    tradeQQLink.style= "font-size: 13px; margin-left: 20px;";
                    tradeQQLink.addEventListener('click', function(event) {
                        if (typeof cn_league === 'string' && cn_league.trim() === ''){
                            showPanel();
                            event.preventDefault(); // 阻止默认行为
                        }
                    });
                    parentElement.parentElement.appendChild(tradeQQLink);
                }
            });
        }
    }, false);
})();
