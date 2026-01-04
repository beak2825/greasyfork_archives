// ==UserScript==
// @name         Git游戏无心宠物-监测战利品掉落-屏蔽怪物图片
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  适用于Git游戏无心宠物。统计宠物币、贡献值、喜糖和红包，计算平均每小时掉落数量。屏蔽怪物图片（清爽挂机）。新增：为战利品列表添加滚动条。
// @author       liuyang28282
// @match        https://wx.gityx.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523153/Git%E6%B8%B8%E6%88%8F%E6%97%A0%E5%BF%83%E5%AE%A0%E7%89%A9-%E7%9B%91%E6%B5%8B%E6%88%98%E5%88%A9%E5%93%81%E6%8E%89%E8%90%BD-%E5%B1%8F%E8%94%BD%E6%80%AA%E7%89%A9%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/523153/Git%E6%B8%B8%E6%88%8F%E6%97%A0%E5%BF%83%E5%AE%A0%E7%89%A9-%E7%9B%91%E6%B5%8B%E6%88%98%E5%88%A9%E5%93%81%E6%8E%89%E8%90%BD-%E5%B1%8F%E8%94%BD%E6%80%AA%E7%89%A9%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个用于显示统计数据的浮动框
    const statsBox = document.createElement('div');
    statsBox.style.position = 'fixed';
    statsBox.style.top = '10px';
    statsBox.style.right = '10px';
    statsBox.style.backgroundColor = '#f9f9f9';
    statsBox.style.border = '1px solid #ddd';
    statsBox.style.padding = '10px';
    statsBox.style.zIndex = '10000';
    statsBox.innerHTML = `
        <strong>战利品统计启动成功，开始战斗后10秒才有显示</strong><br>
            <strong>众人拾柴火焰高：点击按钮分享你的数据</strong><br>
            <div id="statsContent">
            <a href="https://docs.qq.com/sheet/DT05YcVJvZEJCQ2Jw?tab=BB08J2" style="display:block;margin-top:10px;padding:5px;background-color:#4CAF50;color:white;text-align:center;text-decoration:none;font-size:16px;border-radius:4px;">
                查看/分享 副本战利品数据
            </a>
        <label><input type="checkbox" id="hidePotions"> 不显示药水</label><br>
        <label><input type="checkbox" id="hideBooks"> 不显示技能书</label><br>
            <strong>当前位置</strong><br>
            <span id="secondH2Text">未找到第二个H2标签</span><br>
            <strong>金钱统计:</strong><br>
            总场次: <span id="changes">0</span><br>
            总共获得宠物币: <span id="petCoins">0</span> (平均每小时: <span id="avgPetCoinsPerHour">0</span>)<br>
            总共贡献给家族宠物币: <span id="familyContributions">0</span><br>
            <strong>战利品统计:</strong><br>
            <div id="lootStatsContainer" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; margin-top: 5px;">
                <div id="lootStats"></div>
            </div>
            脚本运行时间: <span id="elapsedTime">0</span><br>
            <strong>别着急，数据10秒刷新一次</strong><br>
        </div>
    `;
    document.body.appendChild(statsBox);

    // 初始化状态对象
    let state = {
        startTime: Date.now(), // 记录脚本开始运行的时间（使用真实时间）
        changes: 0,
        petCoins: 0,
        familyContributions: 0,
        candies: 0,
        redPackets: 0,
        loot: {} // 动态添加战利品类别
    };

    // 更新统计数据框的函数
    function updateStatsBox() {
        const now = Date.now(); // 获取当前时间（使用真实时间）
        const elapsedTime = (now - state.startTime) / 1000; // 计算已过去的时间（秒）
        const hoursElapsed = (elapsedTime / 60 / 60).toFixed(2); // 转换为小时

        const avgPetCoinsPerHour = (hoursElapsed > 0 ? (state.petCoins / hoursElapsed).toFixed(2) : '0');

        // 构建战利品统计字符串
        let lootStats = '';
        for (const [item, count] of Object.entries(state.loot)) {
            const avgLootPerHour = (hoursElapsed > 0 ? (count / hoursElapsed).toFixed(2) : '0');
            if (!document.getElementById('hidePotions').checked || !item.includes('药水')) {
                if (!document.getElementById('hideBooks').checked || !item.includes('书')) {
                    lootStats += `${item}: ${count} (平均每小时: ${avgLootPerHour})<br>`;
                }
            }
        }

        // 获取并显示第二个<h2>标签的文本内容，移除特定文本
        const secondH2Text = getSecondH2Text();

        document.getElementById('secondH2Text').innerText = secondH2Text || '未找到第二个H2标签';
        document.getElementById('changes').innerText = state.changes;
        document.getElementById('petCoins').innerText = state.petCoins;
        document.getElementById('avgPetCoinsPerHour').innerText = avgPetCoinsPerHour;
        document.getElementById('familyContributions').innerText = state.familyContributions;
        document.getElementById('lootStats').innerHTML = lootStats;
        document.getElementById('elapsedTime').innerText = formatDuration(elapsedTime);
    }

    // 格式化持续时间
    function formatDuration(seconds) {
        const days = Math.floor(seconds / 86400);
        seconds %= 86400;
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);

        return `${days > 0 ? days + "天" : ""}${hours > 0 ? hours + "小时" : ""}${minutes > 0 ? minutes + "分钟" : ""}${seconds > 0 ? seconds + "秒" : ""}`;
    }

    // 解析新文本并更新状态对象的函数
    function parseAndUpdateState(text) {
        // 匹配格式：获得宠物币（可能是负数）、贡献给家族宠物币、善恶值增加，并掉落特定物品
        const matchDrop = text.match(/获得(-?\d+)\s*宠物币.*?贡献给家族(\d+)\s*宠物币.*?善恶值\s*\+\s*(\d+).*?(?:特殊怪物掉落|获得)\s*(\d+)\s*个\s*([^\n]+)/g);
        // 匹配格式：获得宠物币（可能是负数）、贡献给家族宠物币、善恶值增加
        const matchNoDrop = text.match(/获得(-?\d+)\s*宠物币.*?贡献给家族(\d+)\s*宠物币.*?善恶值\s*\+\s*(\d+)/g);

        if (matchDrop) {
            matchDrop.forEach(dropText => {
                const dropMatch = dropText.match(/获得(-?\d+)\s*宠物币.*?贡献给家族(\d+)\s*宠物币.*?善恶值\s*\+\s*(\d+).*?(?:特殊怪物掉落|获得)\s*(\d+)\s*个\s*([^\n]+)/);
                if (dropMatch) {
                    state.changes++;
                    state.petCoins += parseInt(dropMatch[1], 10);
                    state.familyContributions += parseInt(dropMatch[2], 10);
                    let item = dropMatch[5].trim();
                    const count = parseInt(dropMatch[4], 10);

                    // 检查是否需要调整战利品名称
                    if (item.includes("获得 1 个")) {
                        item = item.replace("获得 1 个", "").trim() + "（特殊怪物掉落）";
                    }

                    // 动态添加新的战利品类别
                    if (!state.loot[item]) {
                        state.loot[item] = 0;
                    }
                    state.loot[item] += count;

                    updateStatsBox();
                }
            });
        } else if (matchNoDrop) {
            matchNoDrop.forEach(noDropText => {
                const noDropMatch = noDropText.match(/获得(-?\d+)\s*宠物币.*?贡献给家族(\d+)\s*宠物币.*?善恶值\s*\+\s*(\d+)/);
                if (noDropMatch) {
                    state.changes++;
                    state.petCoins += parseInt(noDropMatch[1], 10);
                    state.familyContributions += parseInt(noDropMatch[2], 10);
                    updateStatsBox();
                }
            });
        }
    }

    // 屏蔽ID为'npcpic'的div元素
    function hideNpcPic() {
        const npcPicElement = document.getElementById('npcpic');
        if (npcPicElement) {
            npcPicElement.style.display = 'none';  // 隐藏元素
        }
    }

    // 获取第二个<h2>标签的文本内容，并移除特定文本
    function getSecondH2Text() {
        const h2Elements = document.querySelectorAll('h2');
        if (h2Elements.length > 1) {
            let textContent = h2Elements[1].textContent.trim();
            // 移除“【 返回野战地图 】”文本
            textContent = textContent.replace(/【 返回野战地图 】/g, "").trim();
            return textContent;
        }
        return null;
    }

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                parseAndUpdateState(targetNode.textContent);
            }
        }
    });

    // 目标节点是ID为'showtxt5'的div
    const targetNode = document.getElementById('showtxt5');

    // 配置观察选项
    const config = { childList: true, subtree: true, characterData: true, characterDataOldValue: true, attributes: false };

    // 开始观察目标节点
    if (targetNode) {
        observer.observe(targetNode, config);
        // 初始解析一次当前内容
        parseAndUpdateState(targetNode.textContent);
    }

    // 立即隐藏npcpic元素，并确保在页面加载后也能隐藏动态添加的npcpic元素
    hideNpcPic();
    new MutationObserver(() => hideNpcPic()).observe(document.body, { childList: true, subtree: true });

    // 添加事件监听器以处理复选框的变化，仅在初始化时添加一次
    document.getElementById('hidePotions').addEventListener('change', () => updateStatsBox());
    document.getElementById('hideBooks').addEventListener('change', () => updateStatsBox());

    // 定期更新统计数据框以反映最新的平均值
    setInterval(updateStatsBox, 10000); // 每10秒钟更新一次
})();