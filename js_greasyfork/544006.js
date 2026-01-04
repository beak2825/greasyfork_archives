// ==UserScript==
// @name         OMS +新APP保险星币2.9.0+联盟操作 (by：测试组@Steven)
// @namespace    http://tampermonkey.net/
// @version      2.9.0
// @description  在 OMS/CMS 页面中添加可折叠工具面板，支持手动输入 Cookie、白名单、CMS 权限、批量钻石充值、联盟币、登录解封、赠送年卡、俱乐部扩容，并支持面板缩放，优化提示返回信息，新增清空查询功能，添加白名单自动授权，提示飘窗优化，新增靓号俱乐部，开通手牌权限，钻石回收权限，新增插入俱乐部成员
// @author       Steven
// @match        http://54.65.203.182:8060/*
// @match        https://oms-web.lunarsphere.xyz/*
// @match        https://oms-web.nuvankerder.com/*
// @match        https://oms-web-stg.nuvankerder.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544006/OMS%20%2B%E6%96%B0APP%E4%BF%9D%E9%99%A9%E6%98%9F%E5%B8%81290%2B%E8%81%94%E7%9B%9F%E6%93%8D%E4%BD%9C%20%28by%EF%BC%9A%E6%B5%8B%E8%AF%95%E7%BB%84%40Steven%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544006/OMS%20%2B%E6%96%B0APP%E4%BF%9D%E9%99%A9%E6%98%9F%E5%B8%81290%2B%E8%81%94%E7%9B%9F%E6%93%8D%E4%BD%9C%20%28by%EF%BC%9A%E6%B5%8B%E8%AF%95%E7%BB%84%40Steven%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.top !== window.self) return;
    if (window.omsUtilityPanelInjected) return;
    window.omsUtilityPanelInjected = true;

    const ORIGIN = window.location.origin;

// 可配置的折叠按钮样式（黑金版）
const COLLAPSED_CONFIG = {
    text: "HH",
    size: 20,
    bgColor: "#0F0F0F",        // 纯黑底色
    textColor: "#D4AF37",      // 鎏金文字
    fontSize: "22px",
    fontFamily: "Arial, sans-serif"
};

    // 可配置的拖动深度参数
    const DRAG_CONFIG = {
        sensitivity: 1, // 拖动灵敏度 (0-1, 值越大越灵敏)
        smoothness: 1,   // 拖动平滑度 (0-1, 值越大越平滑)
        depth: 15          // 拖动深度 (像素)
    };

    // 星星特效配置
    const STAR_CONFIG = {
        size: 15,          // 星星大小(像素)
        colors: ["#FFD700", "#FF69B4", "#00FFFF", "#7CFC00", "#FF6347", "#9370DB"], // 星星颜色
        speed: 800,        // 星星动画时间(毫秒)
        count: 8,          // 每次创建星星数量
        shapes: ["★", "✦", "✧", "❂", "✵", "✺", "✷"] // 星星形状
    };

    function sendPost(path, body, extraHeaders) {
        const manualCookie = document.getElementById('manualCookie')?.value;
        const headers = Object.assign({
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': navigator.language,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'max-age=0',
            'Upgrade-Insecure-Requests': '1'
        }, extraHeaders || {});
        if (manualCookie) headers['Cookie'] = manualCookie;
        return fetch(ORIGIN + path, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: headers,
            referrer: ORIGIN + '/loginView',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: body
        });
    }

    // 存储面板位置
    function savePanelPosition() {
        const panel = document.getElementById('omsUtilityPanel');
        const pos = {
            left: panel.style.left,
            top: panel.style.top
        };
        localStorage.setItem('omsPanelPosition', JSON.stringify(pos));
    }

    // 恢复面板位置
    function restorePanelPosition() {
        const savedPos = localStorage.getItem('omsPanelPosition');
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                const panel = document.getElementById('omsUtilityPanel');
                if (pos.left) panel.style.left = pos.left;
                if (pos.top) panel.style.top = pos.top;
            } catch (e) {
                console.error('Error restoring panel position:', e);
            }
        }
    }

    function togglePanel() {
        const content = document.getElementById('panelContent');
        const btn = document.getElementById('toggleBtn');
        const panel = document.getElementById('omsUtilityPanel');

        if (content.style.display === 'none') {
            const savedWidth = localStorage.getItem('omsPanelWidth') || '680';
            content.style.display = '';
            btn.textContent = '折叠▼';
            panel.style.width = savedWidth + 'px';
            panel.style.height = 'auto';
            panel.style.borderRadius = '20px';
            panel.style.overflow = 'hidden';
            panel.style.cursor = 'move';
            document.getElementById('collapsedView').style.display = 'none';
        } else {
            content.style.display = 'none';
            btn.textContent = '▲';
            panel.style.width = COLLAPSED_CONFIG.size + 'px';
            panel.style.height = COLLAPSED_CONFIG.size + 'px';
            panel.style.borderRadius = '50%';
            panel.style.overflow = 'hidden';
            panel.style.cursor = 'pointer';
            document.getElementById('collapsedView').style.display = 'flex';
        }
        savePanelPosition();
    }

    // 创建星星特效
    function createStar(x, y) {
        for (let i = 0; i < STAR_CONFIG.count; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                const size = STAR_CONFIG.size * (0.5 + Math.random() * 1.5);
                const shape = STAR_CONFIG.shapes[Math.floor(Math.random() * STAR_CONFIG.shapes.length)];
                const color = STAR_CONFIG.colors[Math.floor(Math.random() * STAR_CONFIG.colors.length)];

                star.style.cssText = `
                    position: fixed;
                    z-index: 10000;
                    pointer-events: none;
                    font-size: ${size}px;
                    color: ${color};
                    text-shadow: 0 0 10px ${color}, 0 0 20px ${color};
                    transform: translate(-50%, -50%);
                    transition: all ${STAR_CONFIG.speed}ms ease-out;
                    opacity: 0.9;
                `;

                const offsetX = (Math.random() - 0.5) * DRAG_CONFIG.depth * 3;
                const offsetY = (Math.random() - 0.5) * DRAG_CONFIG.depth * 3;

                star.style.left = (x + offsetX) + 'px';
                star.style.top = (y + offsetY) + 'px';
                star.textContent = shape;

                document.body.appendChild(star);

                const angle = Math.random() * Math.PI * 2;
                const distance = DRAG_CONFIG.depth * (1 + Math.random() * 3);
                const targetX = x + Math.cos(angle) * distance;
                const targetY = y + Math.sin(angle) * distance;

                setTimeout(() => {
                    star.style.left = targetX + 'px';
                    star.style.top = targetY + 'px';
                    star.style.opacity = '0';
                    star.style.transform = `translate(-50%, -50%) scale(${0.2 + Math.random()}) rotate(${Math.random() * 360}deg)`;
                }, 10);

                setTimeout(() => {
                    star.remove();
                }, STAR_CONFIG.speed);
            }, i * 50);
        }
    }


    // 状态映射
    const statusMap = {
        0: "禁用",
        1: "启用",
        2: "彻底关闭"
    };

    // 小丑策略数据存储
    let clownStrategies = [];


    const savedWidth = localStorage.getItem('omsPanelWidth') || '580';
    const savedHeight = localStorage.getItem('omsPanelHeight') || '900';

    const panel = document.createElement('div');
    panel.id = 'omsUtilityPanel';
    panel.style.cssText = `
        position: fixed; top: 20px; right: 10px;
        width: ${savedWidth}px; height: ${savedHeight}px;
                background: linear-gradient(145deg, #ffffff, #f0f0f0);
        background-image: url('https://example.com/cool-pattern.png'), linear-gradient(145deg, #ffffff, #f0f0f0);
        border: 2px solid #faebd7;
        padding: 16px;
        border-radius: 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        z-index: 9999; resize: both; overflow: hidden;
        transition: all 0.3s ease;
    `;
// 在原有代码中找到 panel.innerHTML = `...` 的位置，整体替换为下方内容
// 仅替换 UI 结构，所有事件监听、功能逻辑保持不变
panel.innerHTML = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- 顶部标题栏（保持不变） -->
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; cursor: move;" id="panelHeader">
    <div style="display: flex; align-items: center;">
        <h4 style="margin:0; font-size:16px; margin-right: 10px; font-weight:bold; background: rgba(255,255,255,0.8); padding:4px 8px; border-radius:8px;">⚙️ OMS轻松助手(TEST/UAT通用)</h4>
        <div style="display: flex; align-items: center;">
            <span style="font-size: 12px; margin-right: 7px;">HH@by测试组   宽度:</span>
            ${[380, 680, 880,1080].map(w => {
                const isActive = parseInt(savedWidth) === w ? 'background: #4169E1; color: white;' : '';
                return `<button class="widthBtn" data-width="${w}" style="margin:0 2px; padding:2px 6px; font-size:11px; border-radius:4px; border:1px solid #ccc; ${isActive}">${w}</button>`;
            }).join('')}
            <span style="font-size: 12px; margin-left:15px; margin-right: 7px;">高度:</span>
            ${[400, 600, 800].map(h => {
                const isActive = parseInt(savedHeight) === h ? 'background: #4169E1; color: white;' : '';
                return `<button class="heightBtn" data-height="${h}" style="margin:0 2px; padding:2px 6px; font-size:11px; border-radius:4px; border:1px solid #ccc; ${isActive}">${h}</button>`;
            }).join('')}
        </div>
    </div>
    <button id="toggleBtn" style="border:none; background:none; font-size:16px; cursor:pointer; white-space: nowrap;">折叠▼</button>
</div>

<!-- 折叠视图（保持不变） -->
<div id="collapsedView" style="
    display: none;
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: ${COLLAPSED_CONFIG.bgColor};
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-weight: bold;
    color: ${COLLAPSED_CONFIG.textColor};
    font-size: ${COLLAPSED_CONFIG.fontSize};
    font-family: ${COLLAPSED_CONFIG.fontFamily};
">${COLLAPSED_CONFIG.text}</div>

<!-- 内容区（紧凑布局） -->
<div id="panelContent" style="max-height: 760px; overflow-y: auto; padding-right: 2px; background: rgba(255,255,255,0.8); border-radius: 15px; margin-top: 10px;">

    <!-- 1. 查询区（保持不变） -->
    <div style="margin-bottom:8px; border: 1px solid #ddd; padding: 8px; border-radius: 6px;">
        <strong><i class="fas fa-search"></i> 查询功能:</strong><br>
        <div style="margin-top:8px; display: flex; gap: 10px;">
            <label style="display: flex; align-items: center;">
                <input type="radio" name="queryType" value="uuid" checked style="margin-right: 4px;"> <i class="fas fa-user"></i> 按UUID
            </label>
            <label style="display: flex; align-items: center;">
                <input type="radio" name="queryType" value="showid" style="margin-right: 4px;"> <i class="fas fa-id-card"></i> 按SHOWID
            </label>
            <label style="display: flex; align-items: center;">
                <input type="radio" name="queryType" value="username" style="margin-right: 4px;"> <i class="fas fa-user-edit"></i> 按用户名
            </label>
            <label style="display: flex; align-items: center;">
                <input type="radio" name="queryType" value="clubid" style="margin-right: 4px;"> <i class="fas fa-users"></i> 按clubID查联盟
            </label>
            <label style="display: flex; align-items: center;">
                <input type="radio" name="queryType" value="leagueid" style="margin-right: 4px;"> <i class="fas fa-network-wired"></i> 按联盟ID查club
            </label>
            <label style="display: flex; align-items: center;">
                <input type="radio" name="queryType" value="clubuuid" style="margin-right: 4px;"> <i class="fas fa-user-friends"></i> 按UUID查俱乐部
            </label>

        </div>

        <input id="idQueryInput" type="text" value="666723" placeholder="输入查询内容" style="width:100%; padding:4px; border-radius:6px; border:1px solid #ccc; margin-top:4px;" />
        <button id="btnIdQuery" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:66; background:#9370DB; color:#fff;">🔎🔎查询🔍🔍</button>
        <button id="clearQueryBtn" style="margin-top:4px; padding:4px 8px; border:none; border-radius:4px; background:#f08080; color:white; cursor:pointer;">❎清空查询</button>
        <button id="autoLoginBtn" style="margin-top:4px; padding:4px 8px; border:none; border-radius:4px; background:#4CAF50; color:white; cursor:pointer;">▶️自动登录</button>
        <button id="queryUuidBtn" style="margin-top:4px; padding:4px 8px; border:none; border-radius:4px; background:#2196F3; color:white; cursor:pointer;">uuid查手机号</button>
        <!-- 小丑维护 -->
<button id="btnMaintenanceOn"  style="margin-top:4px; padding:4px 8px; border:none; border-radius:4px; background:linear-gradient(to right,#FF6347,#FF4500); color:white; cursor:pointer;">🔞维护🤡</button>
<button id="btnMaintenanceOff" style="margin-top:4px; padding:4px 8px; border:none; border-radius:4px; background:linear-gradient(to right,#20B2AA,#3CB371); color:white; cursor:pointer;">结束维护🔚</button>
<!-- ④ 联盟审核 -->
<button id="btnQueryLeagueReview" style="margin-top:4px; padding:4px 8px; border:none; border-radius:4px; background:linear-gradient(to right,#7B68EE,#6A5ACD); color:white; cursor:pointer;">联盟审核📋</button>
<div id="reviewArea" style="display:none; margin-top:6px; border:1px solid #ddd; border-radius:4px; background:#fff; padding:6px;">
  <div id="reviewListWrapper" style="max-height:180px; overflow-y:auto;"></div>
  <div id="reviewActions" style="display:none; margin-top:6px; text-align:center;">
    <button id="btnBatchAgree"  style="margin-right:6px; padding:4px 10px; border:none; border-radius:4px; background:linear-gradient(to right,#32cd32,#4caf50); color:white; cursor:pointer;">批量同意</button>
    <button id="btnBatchReject" style="padding:4px 10px; border:none; border-radius:4px; background:linear-gradient(to right,#f44336,#e57373); color:white; cursor:pointer;">批量拒绝</button>
  </div>
</div>
<button id="btnClubQuery" style="margin-top:4px; margin-left:6px; padding:4px 8px; border:none; border-radius:4px; background:linear-gradient(to right,#FF69B4,#FF1493); color:white; cursor:pointer;">俱乐部ID查询🎯</button>
<input id="clubQueryInput" type="text" placeholder="输入俱乐部ID" style="margin-top:4px; margin-left:6px; padding:4px; border-radius:4px; border:1px solid #ccc; width:140px;">
<div id="clubQueryArea" style="display:none; margin-top:6px; border:1px solid #ddd; border-radius:4px; background:#fff; padding:6px;">
  <div id="clubQueryTable" style="max-height:200px; overflow-y:auto;"></div>
</div>

        <div style="margin-top:8px; position: relative;">
            <div id="queryResultContainer"></div>
        </div>
    </div>

    <!-- 2. 权限设置中心（并排） -->
    <div style="margin-bottom:8px; border: 1px solid #ddd; padding: 8px; border-radius: 6px;">
        <strong><i class="fas fa-user-shield"></i> 权限设置中心</strong>
        <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
            <!-- CMS登录解封 -->
            <div style="flex: 1 1 30%; min-width: 180px;">
                <input id="manageUuid" type="text" value="" placeholder="仅输入用户 UUID" style="width:100%; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <input id="manageStatus" type="text" value="0" placeholder="状态 (0=解封，1=封禁)" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <button id="btnUnban" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #98fb98, #32cd32); color:#fff;"><i class="fas fa-unlock"></i>CMS登录解封(uuid)</button>
            </div>
            <!-- CMS白名单 -->
            <div style="flex: 1 1 30%; min-width: 180px;">
                <input id="whitelistClubId" type="text" value="" placeholder="输入俱乐部ID" style="width:100%; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <button id="btnWhitelist" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #89CFF0, #00BFFF); color:#fff;"><i class="fas fa-user-shield"></i>首次添加CMS白名单</button>
            </div>
            <!-- CMS授权 -->
            <div style="flex: 1 1 30%; min-width: 180px;">
                <input id="cmsClubId" type="text" value="2121287795" placeholder="clubid" style="width:100%; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <button id="btnCms" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #ffa07a, #ff4500); color:#fff;"><i class="fas fa-crown"></i>授予 CMS 俱乐部全部权限</button>
            </div>

        </div>
    </div>

    <!-- 3. 俱乐部权限设置（并排） -->
    <div style="margin-bottom:8px; border: 1px solid #ddd; padding: 8px; border-radius: 6px;">
        <strong><i class="fas fa-sliders-h"></i> 俱乐部权限设置</strong>
        <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
            <!-- 钻石回收 -->
            <div style="flex: 1 1 30%; min-width: 180px;">
                <input id="diamondRecoveryClubId" type="text" placeholder="俱乐部ID" style="width:100%; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <select id="diamondRecoveryStatus" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;">
                    <option value="1">开启回收权限</option>
                    <option value="0">关闭回收权限</option>
                </select>
                <button id="btnDiamondRecovery" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #FF6347, #FF4500); color:#fff;"><i class="fas fa-recycle"></i>设置钻石回收权限</button>
            </div>
            <!-- 模拟器权限 -->
            <div style="flex: 1 1 30%; min-width: 180px;">
                <input id="emulatorUuids" type="text" placeholder="多个showID用英文逗号分隔" style="width:100%; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <button id="btnEmulatorWhite" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #FF69B4, #FF1493); color:#fff;"><i class="fas fa-gamepad"></i>添加玩家模拟器白名单</button>
                <!-- =============== 新增 开通鱿鱼权限 =============== -->
<div style="flex: 1 1 30%; min-width: 180px;">
    <input id="squidClubId" type="text" placeholder="俱乐部ID" style="width:100%; padding:4px; border-radius:6px; border:1px solid #ccc;" />
    <button id="btnSquid" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #2196F3, #0288D1); color:#fff;"><i class="fas fa-fish"></i>开通俱乐部鱿鱼权限</button>
</div>
            </div>

<!-- 看手牌权限（最终版） -->
<div style="flex: 1 1 30%; min-width: 220px;">
  <input id="peekId" type="text" placeholder="俱乐部ID / 联盟ID" style="width:100%; padding:4px; border-radius:6px; border:1px solid #ccc;" />

  <!-- 类型选择：仅在“首次添加”时可见 -->
  <select id="peekType" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;">
    <option value="1">俱乐部ID</option>
    <option value="2">联盟ID</option>
  </select>

  <!-- 操作下拉：新增 delete -->
  <select id="peekAction" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;">
    <option value="add">首次添加看手牌权限</option>
    <option value="open">编辑开启看手牌权限</option>
    <option value="close">编辑关闭看手牌权限</option>
    <option value="delete">删除看手牌权限</option>
  </select>

  <button id="btnPeek" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #7B68EE, #6A5ACD); color:#fff;">
    <i class="fas fa-eye"></i> 设置看手牌权限
  </button>
</div>
        </div>
    </div>

    <!-- 4. 货币充值中心（并排） -->
    <div style="margin-bottom:8px; border: 1px solid #ddd; padding: 8px; border-radius: 6px;">
        <strong><i class="fas fa-coins"></i> 货币充值中心</strong>
        <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
<!-- 批量钻石充值（新版） -->
<div style="flex: 1 1 30%; min-width: 220px;">
  <textarea id="batchDiamondUuids" placeholder="UUID/俱乐部ID列表，回车分隔" style="width:95%; height:50px; padding:8px; border-radius:6px; border:1px solid #ccc;"></textarea>

  <input id="batchDiamondCount" type="number" value="9999990" placeholder="钻石数量" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;" />

  <!-- 新增：充值对象选择 -->
  <select id="diamondTargetType" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;">
    <option value="1">用户钻石</option>
    <option value="2">用户金币</option>
    <option value="3">俱乐部金币</option>
    <option value="4">俱乐部钻石</option>
    <option value="5">用户星币🏅（仅新APP）</option>
    <option value="6">俱乐部星币🎖️（仅新APP）</option>
    <option value="7">联盟星币🎖️（仅新APP）</option>
    <option value="8">俱乐部保险星币🎖️（仅新APP）</option>
    <option value="9">联盟保险星币🎖️（仅新APP）</option>
  </select>

  <button id="btnBatchDiamond" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #FF69B4, #FF1493); color:#fff;">
    <i class="fas fa-gem"></i>批量添加钻石✨星币✨
  </button>
</div>
            <!-- 联盟币充值 -->
            <div style="flex: 1 1 30%; min-width: 180px;">
<textarea id="leagueId" placeholder="联盟ID列表，回车分隔" style="width:95%; height:50px; padding:8px; border-radius:6px; border:1px solid #ccc;"></textarea>
<input id="leagueCount" type="number" value="1000000" placeholder="数量" style="width:95%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <button id="btnLeagueCoin" style="width:95%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #f4a460, #d2691e); color:#fff;"><i class="fas fa-coins"></i>批量添加联盟币</button>
            </div>
            <!-- 赠送白金年卡 -->
            <div style="flex: 1 1 30%; min-width: 180px;">
                <input id="vipUuid" type="text" value="667152" placeholder="UUID" style="width:100%; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <input id="vipNick" type="text" value="HH Steven 0001" placeholder="昵称" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <button id="btnGiveVip" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #f4a460, #d2691e); color:#fff;"><i class="fas fa-gift"></i>赠送白金年卡🎁</button>
            </div>
        </div>
    </div>

    <!-- 5. 扩容 & 重置密码 & 复制MTT（并排） -->
    <div style="margin-bottom:8px; border: 1px solid #ddd; padding: 8px; border-radius: 6px;">
        <strong><i class="fas fa-tools"></i> 扩容 & 重置密码 & 复制MTT</strong>
        <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
            <!-- 重置密码 -->
            <div style="flex: 1 1 30%; min-width: 220px;">
                                <strong><i class="fas fa-key"></i> 重置密码为【1】<br></strong><br>
                <textarea id="batchPwdUuids" placeholder="测试环境UUID列表" style="width:90%; height:50px; padding:8px; border-radius:6px; border:1px solid #ccc;"></textarea>
                <button id="btnBatchResetPwd" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #cd5c5c, #800000); color:#fff;"><i class="fas fa-key"></i>重置测试环境密码</button>
                <textarea id="batchUatPwdUuids" placeholder="UAT环境UUID列表" style="width:90%; height:50px; margin-top:4px; padding:8px; border-radius:6px; border:1px solid #ccc;"></textarea>
                <button id="btnBatchUatResetPwd" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #20B2AA, #3CB371); color:#fff;"><i class="fas fa-key"></i>重置UAT环境密码</button>
            </div>
            <!-- 扩容俱乐部 -->
            <div style="flex: 1 1 30%; min-width: 180px;">
                                <strong><i class="fas fa-building"></i> 扩容用户创建俱乐部数量上限<br></strong><br>
                <input id="extraUuid" type="text" value="667449" placeholder="UUID" style="width:100%; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <input id="extraClubNum" type="number" value="99" placeholder="额外数量" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <button id="btnExtraClub" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #cd5c5c, #800000); color:#fff;"><i class="fas fa-building"></i>扩容俱乐部</button>
            </div>

            <!-- 复制MTT -->
            <div style="flex: 1 1 30%; min-width: 180px;">
                 <strong><i class="fas fa-copy"></i> 序列ID7016为钻石MTT比赛，<br>复制MTT（当前时间+10分）</strong><br>
                <input id="mttRaceId" type="text" value="7083" placeholder="mttRaceId" style="width:100%; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <input id="mttRaceName" type="text" value="MTT11322普通门票赛" placeholder="mttRaceName" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;" />
                <button id="btnCopyRace" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #4169E1, #3498db); color:#fff;"><i class="fas fa-copy"></i>复制MTT比赛</button>
            </div>
        </div>
    </div>
<!-- 6. 靓号俱乐部创建 & 迁移 & 小丑维护（并排） -->
<div style="margin-bottom:8px; border: 1px solid #ddd; padding: 8px; border-radius: 6px;">
  <strong><i class="fas fa-star"></i> 靓号俱乐部 & 迁移复制 & 小丑维护</strong>
  <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">

    <!-- ① 创建靓号俱乐部 -->
    <div style="flex: 1 1 30%; min-width: 220px;">
      <input id="vipClubId"   type="text" placeholder="靓号俱乐部ID" style="width:99%; padding:4px; border-radius:6px; border:1px solid #ccc;" />
      <input id="vipClubName" type="text" placeholder="俱乐部名称" style="width:99%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;" />
      <input id="vipClubUuid" type="text" placeholder="创建者UUID" style="width:99%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;" />
      <input id="vipClubStr"  type="text" placeholder="创建者手机号" style="width:99%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;" />
      <button id="btnCreateVipClub" style="width:99%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #FFD700, #FFA500); color:#fff;">
        <i class="fas fa-gem"></i>创建靓号俱乐部
      </button>
    </div>

       <!-- ② 迁移俱乐部成员 -->
<div style="flex: 1 1 30%; min-width: 220px;">
  <div style="text-align: center; font-weight: bold; margin-bottom: 4px; background: #FFD700; padding: 4px; border-radius: 4px;">
    <i class="fas fa-user-plus"></i> 复制俱乐部成员
  </div>
      <input id="fromClubId" type="text" placeholder="源俱乐部ID" style="width:99%; padding:4px; border-radius:6px;" />
      <input id="toClubId"   type="text" placeholder="目标俱乐部ID" style="width:99%; margin-top:4px; padding:4px; border-radius:6px;" />
      <button id="btnMoveMembers" style="width:99%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #FFA500, #FF8C00); color:#fff;">
        <i class="fas fa-users"></i>复制俱乐部成员
      </button>
    </div>
<!-- ① 创建联盟 -->
<div style="flex: 1 1 30%; min-width: 220px;">
  <div style="text-align: center; font-weight: bold; margin-bottom: 4px; background: #f4a460; padding: 4px; border-radius: 4px;">
    <i class="fas fa-crown"></i> 创建联盟
  </div>
  <input id="newLeagueId"   type="text" placeholder="联盟ID" style="width:99%; padding:4px; border-radius:6px; border:1px solid #ccc;" />
  <input id="newLeagueName" type="text" placeholder="联盟名称" style="width:99%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;" />
  <input id="newLeagueClub" type="text" placeholder="主机俱乐部ID" style="width:99%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #ccc;" />
  <button id="btnCreateLeague" style="width:99%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #ffa07a, #ff4500); color:#fff;">
    <i class="fas fa-plus-circle"></i> 创建联盟
  </button>
</div>
<!-- 8. 联盟管理（黑金风） -->
<div style="margin-bottom:8px; border: 1px solid #D4AF37; padding: 8px; border-radius: 6px; background: linear-gradient(145deg,#0F0F0F,#1C1C1C); color:#D4AF37;">
  <strong><i class="fas fa-crown"></i> 联盟管理</strong>
  <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">

    <!-- 升级授信 -->
    <div style="flex: 1 1 30%; min-width: 220px;">
      <input id="creditLeagueId" type="text" placeholder="联盟ID" style="width:100%; padding:4px; border-radius:6px; border:1px solid #D4AF37;" />
      <select id="creditType" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #D4AF37;">
        <option value="0">设为普通联盟</option>
        <option value="1">设为超级联盟</option>
      </select>
      <input id="creditClubId" type="text" placeholder="主机俱乐部ID" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #D4AF37;" />
      <button id="btnSetCredit" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right,#D4AF37,#B8860B); color:#000;">
        <i class="fas fa-crown"></i> 升级授信
      </button>
    </div>

    <!-- 设置抽水类型 -->
    <div style="flex: 1 1 30%; min-width: 220px;">
      <input id="potLeagueId" type="text" placeholder="联盟ID" style="width:100%; padding:4px; border-radius:6px; border:1px solid #D4AF37;" />
      <select id="potType" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #D4AF37;">
        <option value="0">普通抽水</option>
        <option value="1">底池抽水</option>
      </select>
      <button id="btnSetPot" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right,#D4AF37,#B8860B); color:#000;">
        <i class="fas fa-tint"></i> 设置抽水
      </button>
    </div>

    <!-- 俱乐部加入联盟 -->
    <div style="flex: 1 1 30%; min-width: 220px;">
      <input id="joinClubId"  type="text" placeholder="俱乐部ID" style="width:100%; padding:4px; border-radius:6px; border:1px solid #D4AF37;" />
      <input id="joinLeagueId" type="text" placeholder="联盟ID" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #D4AF37;" />
      <button id="btnJoinLeague" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right,#D4AF37,#B8860B); color:#000;">
        <i class="fas fa-sign-in-alt"></i> 加入联盟
      </button>
    </div>

    <!-- 踢出联盟 -->
    <div style="flex: 1 1 30%; min-width: 220px;">
      <input id="kickClubId"  type="text" placeholder="俱乐部ID" style="width:100%; padding:4px; border-radius:6px; border:1px solid #D4AF37;" />
      <input id="kickLeagueId" type="text" placeholder="联盟ID" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #D4AF37;" />
      <select id="kickForce" style="width:100%; margin-top:4px; padding:4px; border-radius:6px; border:1px solid #D4AF37;">
        <option value="0">正常踢出</option>
        <option value="1">强制踢出</option>
      </select>
      <button id="btnKickLeague" style="width:100%; margin-top:4px; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right,#D4AF37,#B8860B); color:#000;">
        <i class="fas fa-sign-out-alt"></i> 踢出联盟
      </button>
    </div>

  </div>
</div>
 
<!-- 俱乐部成员插入 -->
<div style="flex: 1 1 30%; min-width: 220px;">
  <div style="text-align: center; font-weight: bold; margin-bottom: 4px; background: #20B2AA; padding: 4px; border-radius: 4px;">
    <i class="fas fa-user-plus"></i> 俱乐部成员插入
  </div>

  <form onsubmit="return false;">   <!-- 关键：加 form -->
      <input name="insertUuid"   id="insertUuid"   type="text" placeholder="用户UUID" style="width:99%; padding:4px; border-radius:6px; border:1px solid #ccc; margin-bottom:4px;" />
    <input name="insertClubId" id="insertClubId" type="text" placeholder="俱乐部ID" style="width:99%; padding:4px; border-radius:6px; border:1px solid #ccc; margin-bottom:4px;" />
    <button id="btnInsertClubMember" style="width:99%; padding:6px; border:none; border-radius:6px; background: linear-gradient(to right, #20B2AA, #3CB371); color:#fff;">
      <i class="fas fa-plus-circle"></i> 插入成员
    </button>
  </form>
</div>
    <!-- ③ 小丑维护 -->
    <div style="flex: 1 1 30%; min-width: 220px;">
      <div style="text-align: center; font-weight: bold; margin-bottom: 4px; background: #FF6347; padding: 4px; border-radius: 4px;">
        <i class="fas fa-theater-masks"></i> 小丑维护
      </div>
      <div style="display: flex; gap: 8px;">
        <button id="btnMaintenanceOn"  style="flex: 1; padding: 6px; border: none; border-radius: 6px; background: linear-gradient(to right, #FF6347, #FF4500); color: #fff;">
          <i class="fas fa-tools"></i>立即维护
        </button>
        <button id="btnMaintenanceOff" style="flex: 1; padding: 6px; border: none; border-radius: 6px; background: linear-gradient(to right, #20B2AA, #3CB371); color: #fff;">
          <i class="fas fa-broom"></i>结束维护
        </button>
      </div>

    </div>
</div>
    </div>

    <!-- 7. 小丑策略（保持不变） -->
    <div style="margin-bottom:8px; border: 1px solid #ddd; padding: 8px; border-radius: 6px;">
        <div style="text-align: center; font-weight: bold; margin-bottom: 8px; background: #9370DB; padding: 4px; border-radius: 4px;">
            <i class="fas fa-robot"></i> 小丑策略筛选
        </div>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
            <input id="strategySearch" type="text" placeholder="策略名称模糊搜索" style="flex: 1; padding: 4px; border-radius: 6px; border: 1px solid #ccc;" />
            <select id="strategyStatusFilter" style="padding: 6px; border-radius: 6px; border: 1px solid #ccc;">
                <option value="">所有状态</option>
                <option value="1">启用</option>
                <option value="0">禁用</option>
                <option value="2">彻底关闭</option>
            </select>
            <button id="btnLoadStrategies" style="padding: 6px 10px; border: none; border-radius: 6px; background: linear-gradient(to right, #20B2AA, #3CB371); color: #fff;">
                <i class="fas fa-sync-alt"></i> 加载
            </button>
            <button id="btnCountStrategies" style="padding: 6px 10px; border: none; border-radius: 6px; background: linear-gradient(to right, #FF6347, #FF4500); color: #fff;">
                <i class="fas fa-chart-pie"></i> 统计
            </button>
        </div>
        <div id="strategyCount" style="margin-bottom: 8px; font-size: 12px; color: #666;">共加载 0 条策略</div>
        <div style="max-height: 300px; overflow-y: auto; border: 1px solid #eee; border-radius: 6px;">
            <table id="strategyTable" style="width: 100%; font-size: 12px; border-collapse: collapse;">
                <thead style="position: sticky; top: 0; background: #f2f2f2; z-index: 1;">
                    <tr>
                        <th style="padding: 4px; border: 1px solid #ccc;">策略ID</th>
                        <th style="padding: 4px; border: 1px solid #ccc;">策略名称</th>
                        <th style="padding: 4px; border: 1px solid #ccc;">联盟ID</th>
                        <th style="padding: 4px; border: 1px solid #ccc;">联盟名称</th>
                        <th style="padding: 4px; border: 1px solid #ccc;">状态</th>
                        <th id="sortPotHeader" style="padding: 4px; border: 1px solid #ccc; cursor: pointer;">奖池金额 ↓</th>
                    </tr>
                </thead>
                <tbody id="strategyTableBody"></tbody>
            </table>
        </div>
        <div id="strategyDetail" style="margin-top: 8px; padding: 8px; border: 1px solid #eee; border-radius: 6px; background: #f0f8ff; display: none;">
            <div style="display: flex; justify-content: space-between;">
                <strong>策略详情</strong>
                <button id="btnCloseDetail" style="background: none; border: none; cursor: pointer;">✕</button>
            </div>
            <div id="detailContent"></div>
        </div>
    </div>

    <!-- 底部署名（保持不变） -->
    <div style="text-align:center; margin-top:15px; padding-top:10px; border-top:2px solid #FFD700; color:#FFD700; font-size:22px;">
        by测试组@Steven
    </div>
</div>
`;
// ============ 替换结束 ============
    document.body.appendChild(panel);

    const style = document.createElement('style');
    style.textContent = `
        .copy-btn {
            flex: 1;
            padding: 4px;
            font-size: 12px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .copy-btn:hover {
            background: #5a6268;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        tr.uuid-match {
            background-color: #ffdddd !important;
        }
        button {
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            border-radius: 8px;
            padding: 8px;
            margin-top: 8px;
            font-weight: bold;
        }
        button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);

    restorePanelPosition();

    let isDragging = false;
    let dragOffsetX, dragOffsetY;
    let targetX = parseInt(panel.style.left) || panel.offsetLeft;
    let targetY = parseInt(panel.style.top) || panel.offsetTop;
    let lastX = targetX, lastY = targetY;

    function startDrag(e) {
        isDragging = true;
        dragOffsetX = e.clientX - panel.offsetLeft;
        dragOffsetY = e.clientY - panel.offsetTop;

        panel.style.cursor = 'grabbing';
        panel.style.transition = 'none';
        e.preventDefault();

        createStar(e.clientX, e.clientY);
    }

    function doDrag(e) {
        if (!isDragging) return;

        targetX = e.clientX - dragOffsetX;
        targetY = e.clientY - dragOffsetY;

        const dx = targetX - lastX;
        const dy = targetY - lastY;

        if (Math.abs(dx) > DRAG_CONFIG.depth || Math.abs(dy) > DRAG_CONFIG.depth) {
            createStar(e.clientX, e.clientY);
            lastX = targetX;
            lastY = targetY;
        }

        const smoothX = lastX + dx * DRAG_CONFIG.sensitivity * DRAG_CONFIG.smoothness;
        const smoothY = lastY + dy * DRAG_CONFIG.sensitivity * DRAG_CONFIG.smoothness;

        panel.style.left = smoothX + 'px';
        panel.style.top = smoothY + 'px';

        lastX = smoothX;
        lastY = smoothY;
    }

    function endDrag() {
        if (!isDragging) return;

        isDragging = false;
        panel.style.cursor = '';
        panel.style.transition = 'all 0.3s ease';
        savePanelPosition();
    }

    document.getElementById('panelHeader').addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', endDrag);
    document.getElementById('collapsedView').addEventListener('mousedown', startDrag);

    document.getElementById('toggleBtn').addEventListener('click', togglePanel);
    document.getElementById('collapsedView').addEventListener('click', togglePanel);

    document.querySelectorAll('.widthBtn').forEach(btn => {
        btn.addEventListener('click', function() {
            const width = this.dataset.width;
            panel.style.width = width + 'px';

            document.querySelectorAll('.widthBtn').forEach(b => {
                b.style.background = '';
                b.style.color = '';
            });
            this.style.background = '#4169E1';
            this.style.color = 'white';

            localStorage.setItem('omsPanelWidth', width);
            savePanelPosition();
        });
    });

        document.querySelectorAll('.heightBtn').forEach(btn => {
        btn.addEventListener('click', function() {
            const height = this.dataset.height;
            panel.style.height = height + 'px';

            document.querySelectorAll('.heightBtn').forEach(b => {
                b.style.background = '';
                b.style.color = '';
            });
            this.style.background = '#4169E1';
            this.style.color = 'white';

            localStorage.setItem('omsPanelHeight', height);
            savePanelPosition();
        });
    });
    // 重构后的查询功能
    let lastQueryUser = null;

    document.getElementById('btnIdQuery').addEventListener('click', () => {
        const query = document.getElementById('idQueryInput').value.trim();
        if (!query) {
            showFloatTip('请输入查询内容','#f44336');
            return;
        }

        const queryType = document.querySelector('input[name="queryType"]:checked').value;
        let path, body;

        if (queryType === 'clubid') {
            path = '/stat/club/leaguelist';
            body = `clubid=${query}`;
        } else if (queryType === 'uuid') {
            path = '/stat/player/list';
            body = `uuid=${encodeURIComponent(query)}&showid=&nickname=&strid=&countrycode=&idtype=&tag=&apptype=&page=1&rows=100&sort=uuid&order=desc`;
        } else if (queryType === 'showid') {
            path = '/stat/player/list';
            body = `uuid=&showid=${encodeURIComponent(query)}&nickname=&strid=&countrycode=&idtype=&tag=&apptype=&page=1&rows=100&sort=uuid&order=desc`;
        } else if (queryType === 'username') {
            path = '/stat/player/list';
            body = `uuid=&showid=&nickname=${encodeURIComponent(query)}&strid=&countrycode=&idtype=&tag=&apptype=&page=1&rows=100&sort=uuid&order=desc`;
        } else if (queryType === 'leagueid') {
            path = `/stat/league/memberlist?leagueid=${query}`;
            body = `page=1&rows=100`;
        } else if (queryType === 'clubuuid') {
            path = '/stat/player/clublist';
            body = `uuid=${query}`;
        }

        sendPost(path, body, {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        })
        .then(r => r.json())
        .then(data => {
            displayResults(data, queryType, query);
        })
        .catch(error => {
            document.getElementById('queryResultContainer').innerHTML = `<p style="color: red;">查询失败: ${error.message}</p>`;
        });
    });

// （其他旧的自动登录监听/劫持/observer 全部删除）

    // uuid查手机号功能
document.getElementById('queryUuidBtn').addEventListener('click', () => {
    const uuid = document.getElementById('idQueryInput').value.trim();
    if (!uuid) {
        showFloatTip('请输入UUID','#f44336');
        return;
    }

    const path = '/stat/playerregiste/list';
    const body = `uuid=${uuid}&showid=&page=1&rows=100&sort=uuid&order=desc`;

    sendPost(path, body, {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
    })
    .then(response => response.json())
    .then(data => {
        if (data.total === 0) {
            showFloatTip('未找到匹配的记录','#f44336');
            return;
        }

        const user = data.rows[0];
        const result = {
            "uuid": user.uuid,
            "showid": user.showid,
            "nickname": user.nickname,
            "countrycode": user.countrycode,
            "phonenumber": user.phonenumber
        };

        // 显示结果
        document.getElementById('queryResultContainer').innerHTML = `
            <div style="margin-top: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
                <strong>查询结果:</strong><br>
                <div style="margin-top: 8px;">
                    <strong>UUID:</strong> ${result.uuid}<br>
                    <strong>SHOWID:</strong> ${result.showid}<br>
                    <strong>昵称:</strong> ${result.nickname}<br>
                    <strong>区号:</strong> ${result.countrycode}<br>
                    <strong>手机号:</strong> ${result.phonenumber}
                </div>
            </div>
        `;
    })
    .catch(error => {
        showFloatTip(`查询失败:  ${error.message}`,'#f44336');
    });
});
function displayResults(data, queryType, query) {
    const resultContainer = document.getElementById('queryResultContainer');
    resultContainer.innerHTML = '<table id="queryTable" style="width:100%; border-collapse: collapse;"></table>';
    const table = document.getElementById('queryTable');

    let headers, rows;
    if (queryType === 'clubid') {
        headers = ['联盟名', '联盟ID', '俱乐部名', '主俱乐部ID', '联盟成员'];
        rows = data.rows.map(item => [
            item.leaguename || '无名',
            item.leagueid || 'N/A',
            item.clubname || '无名',
            item.leaguelord || 'N/A',
            item.members || 0
        ]);
    } else if (queryType === 'uuid' || queryType === 'showid') {
        headers = ['区号', 'UUID', 'SHOWID', '昵称', '金币', '星币', '钻石', 'VIP类型', '登录时间', '游戏时间', 'VIP到期时间'];
        const user = data.rows[0] || {};
        rows = [[
            user.countrycode || 'N/A',
            user.uuid || 'N/A',
            user.showid || 'N/A',
            user.nickname || '无名',
        user.depu_coin || '0',
        user.star_coin || '0',
            user.diamond || 'N/A',
            user.viptype || 'N/A',
            user.logintime || 'N/A',
            user.gametime || 'N/A',
            user.viplimittime || 'N/A',
        ]];
    } else if (queryType === 'username') {
        // 如果是用户名查询，可能会返回多个结果
        headers = ['区号', 'UUID', 'SHOWID', '昵称', '金币', '星币', '钻石', 'VIP类型', '登录时间', '游戏时间', 'VIP到期时间'];
        rows = data.rows.map(item => [
            item.countrycode || 'N/A',
            item.uuid || 'N/A',
            item.showid || 'N/A',
            item.nickname || '无名',
            item.diamond || 'N/A',
            item.viptype || 'N/A',
            item.logintime || 'N/A',
            item.gametime || 'N/A',
            item.viplimittime || 'N/A',
        ]);
    } else if (queryType === 'leagueid') {
        headers = ['【俱乐部名字↓】', '【俱乐部ID↓】', '【创建者↓】', '【联盟余额↓】', '【club成员数↓】'];
        rows = data.rows.map(item => [
            item.clubname || '无名',
            item.clubid || 'N/A',
            item.createUser || 'N/A',
            item.creditcoin || 0,
            item.members || 0
        ]);
    } else if (queryType === 'clubuuid') {
        headers = ['俱乐部名字', '俱乐部ID', '创建者uuid', '创建者showid', '联盟名字', '联盟ID', '联盟余额', '现有人数'];
        rows = data.rows.map(item => [
            item.clubname || '无名',
            item.clubid || 'N/A',
            item.createuser || 'N/A',
            item.showid || 'N/A',
            item.leaguename || '无名',
            item.leagueid || 'N/A',
            item.balance || 0.00,
            item.curNum || 0
        ]);
    }

    // 创建表头
    const thead = document.createElement('thead');
    thead.style.backgroundColor = '#f5f5f5';
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.padding = '8px';
        th.style.border = '1px solid #ddd';
        th.style.textAlign = 'left';
        th.style.color = 'red'; // 表头设置为红色
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 创建表体
    const tbody = document.createElement('tbody');
    if (data.total === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="${headers.length}" style="text-align: center;">未找到匹配的记录</td>`;
        tbody.appendChild(row);
    } else {
        rows.forEach((rowData, index) => {
            const row = document.createElement('tr');
            // 如果查询的uuid与创建者uuid一致，设置行样式
            if (queryType === 'clubuuid' && data.rows[index].createuser === parseInt(query)) {
                row.style.backgroundColor = '#ffdddd';
            }
            rowData.forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                td.style.padding = '8px';
                td.style.border = '1px solid #ddd';
                // 如果查询的uuid与创建者uuid一致，设置字体颜色为蓝色
                if (queryType === 'clubuuid' && data.rows[index].createuser === parseInt(query)) {
                    td.style.color = 'blue';
                }

                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
    }
    table.appendChild(tbody);
}

    // 初始化复选框状态
    //document.getElementById('saveScaleCheckbox').checked = true;

    // 以下为原有功能按钮的事件监听器...
    document.getElementById('btnWhitelist').addEventListener('click', () => {
        const clubId = document.getElementById('whitelistClubId').value;
        if (!clubId) {
            showFloatTip('请输入俱乐部ID','#f44336');
            return;
        }


        sendPost('/stat/userwhite/add', `clubid=${encodeURIComponent(clubId)}`)
            .then(r => r.text())
            .then(txt => {
                if (txt.includes('0')) {
                    showFloatTip('白名单添加成功，0.1秒后继续授予CMS权限');
                    setTimeout(() => {
                        document.getElementById('cmsClubId').value = clubId;
                        document.getElementById('btnCms').click();
                    }, 100);
                } else if (txt.includes('4')) {
                    showFloatTip('白名单已存在，状态码4','#ffc107');
                } else if (txt.includes('2')) {
                    showFloatTip('俱乐部ID不存在，状态码2','#f44336');
                } else {
                    showFloatTip(`白名单添加失败或ID错误:   response： ${txt}`,'#f44336');
                }
            });
    });

document.getElementById('btnCms').addEventListener('click', () => {
        const clubId = document.getElementById('cmsClubId').value;
        if (!clubId) {
            showFloatTip('请输入CMS俱乐部ID','#f44336');
            return;
        }


        const params = new URLSearchParams();
        params.append('ids', '');
        params.append('userWhite.uuid', '');
        params.append('userWhite.clubid', clubId);
        ['4','5','6','7','8','9','10','11','20','21','22','25'].forEach(r => params.append('role_ids', r));
        sendPost('/stat/userwhite/grant', params.toString())
            .then(r => r.text())
            .then(txt => {
                if (txt.includes('200')) {
                    showFloatTip('CMS权限已成功授予');
                } else {
                    showFloatTip(`'CMS权限授予失败: '  response： ${txt}`,'#f44336');
                }
            });
    });


// 批量添加钻石（用户 / 俱乐部 / 用户星币 / 俱乐部星币）
function batchAddDiamonds(uuids, diamondCount, targetType) {
  const manualCookie = document.getElementById('manualCookie')?.value;
  const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': navigator.language || 'zh-CN,zh;q=0.9,en;q=0.8',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Upgrade-Insecure-Requests': '1'
  };
  if (manualCookie) headers['Cookie'] = manualCookie;

  let results = [];

  for (let uuid of uuids) {
    /* ===== 新增类型 5、6：用户星币 & 俱乐部星币 ===== */
    if (targetType === '5') {                       // 用户星币
      fetch(`${ORIGIN}/credit/usercreditcoin/addUserCredtiCoin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `clubid=&uuid=${uuid}&num=${diamondCount}`
      })
      .then(r => r.text())
      .then(text => {
        if (text.includes('成功')) {
          results.push(`用户星币【成功充值数量：${diamondCount}】 id：${uuid}`);
        } else {
          results.push(`用户星币充值失败: ${uuid}, ${text}`);
        }
        if (results.length === uuids.length) {
          showFloatTip(results.join('\n'), '#4caf50');
        }
      })
      .catch(error => {
        results.push(`用户星币请求错误: ${uuid}, ${error.message}`);
      });
      continue;                                     // 跳过下方统一逻辑
    }

    if (targetType === '6') {                       // 俱乐部星币
      fetch(`${ORIGIN}/credit/usercreditcoin/addClubCredtiCoin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `clubid=${uuid}&uuid=&num=${diamondCount}`
      })
      .then(r => r.text())
      .then(text => {
        if (text.includes('成功')) {
          results.push(`俱乐部星币【成功充值数量：${diamondCount}】 id：${uuid}`);
        } else {
          results.push(`俱乐部星币充值失败: ${uuid}, ${text}`);
        }
        if (results.length === uuids.length) {
          showFloatTip(results.join('\n'), '#4caf50');
        }
      })
      .catch(error => {
        results.push(`俱乐部星币请求错误: ${uuid}, ${error.message}`);
      });
      continue;                                     // 跳过下方统一逻辑
    }
          /* ===== 新增类型 7：联盟星币 ===== */
    if (targetType === '7') {                       // 联盟星币
      const params = new URLSearchParams();
      params.append('creditCoinRecord.id', '');
      params.append('creditCoinRecord.leagueid', uuid);
      params.append('creditCoinRecord.mcount', diamondCount);
      params.append('creditCoinRecord.rechargeType', '1');
      params.append('creditCoinRecord.text', '1');

      fetch(`${ORIGIN}/recharge/creditcoin/add`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      })
      .then(r => r.text())
      .then(text => {
        const ok = text.includes('code":0');
        results.push(`联盟星币【${ok ? '成功' : '失败'}充值数量：${diamondCount}】 id：${uuid}`);
        if (results.length === uuids.length) {
          showFloatTip(results.join('\n'), '#4caf50');
        }
      })
      .catch(error => {
        results.push(`联盟星币请求错误: ${uuid}, ${error.message}`);
      });
      continue;                                     // 跳过下方统一逻辑
    }
      /* ===== 新增类型 8、9：俱乐部/联盟 保险星币 ===== */
    if (targetType === '8' || targetType === '9') {
      const isClub = targetType === '8';
      const api  = isClub ? '/credit/insuranceaccountsystemrevision/addClubCreditCoin'
                          : '/credit/insuranceaccountsystemrevision/addLeagueCreditCoin';
      const idKey = isClub ? 'clubid' : 'leagueid';

      fetch(`${ORIGIN}${api}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded',
                   'X-Requested-With': 'XMLHttpRequest' },
        body: `${idKey}=${uuid}&num=${diamondCount}`
      })
      .then(r => r.json())
      .then(json => {
        const ok   = json.code === 0;
        const desc = isClub ? '俱乐部保险星币' : '联盟保险星币';
        results.push(`${desc}【${ok ? '成功' : '失败'}充值数量：${diamondCount}】 id：${uuid}`);
        if (results.length === uuids.length) {
          showFloatTip(results.join('\n'), ok ? '#4caf50' : '#f44336');
        }
      })
      .catch(error => {
        const desc = isClub ? '俱乐部保险星币' : '联盟保险星币';
        results.push(`${desc}请求错误: ${uuid}, ${error.message}`);
      });
      continue;                                     // 跳过下方统一逻辑
    }
    /* ===== 新增结束 ===== */
    /* ===== 新增结束 ===== */
    /* ===== 新增结束 ===== */

    // 原有钻石/金币逻辑（1~4）保持不变
    const params = new URLSearchParams();
    params.append('coinRecord.id', '');
    params.append('coinRecord.type', targetType); // 1 用户钻石 / 2 用户金币 / 3 俱乐部金币 / 4 俱乐部钻石
    params.append('coinRecord.uuClubid', uuid);
    params.append('coinRecord.mcount', diamondCount);
    params.append('coinRecord.rechargeType', '2');
    params.append('coinRecord.text', '1');

    fetch(ORIGIN + '/recharge/coin/add', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: headers,
      referrer: ORIGIN + '/recharge/coin/add',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: params.toString()
    })
    .then(response => response.text())
    .then(text => {
      if (text.includes('操作成功') || text.includes('success') || text.includes('{"code":0}')) {
        results.push(`${targetType === '4' ? '俱乐部' : '用户'}【成功充值数量：${diamondCount}】 id：${uuid}`);
      } else {
        results.push(`${targetType === '4' ? '俱乐部' : '用户'}充值失败: ${uuid}, ${text}`);
      }

      if (results.length === uuids.length) {
        showFloatTip(results.join('\n'), '#4caf50');
      }
    })
    .catch(error => {
      results.push(`请求错误: ${uuid}, ${error.message}`);
    });
  }
}

// 按钮点击事件（读取下拉框值）
document.getElementById('btnBatchDiamond').addEventListener('click', () => {
  const uuidsStr = document.getElementById('batchDiamondUuids').value.trim();
  const diamondCount = document.getElementById('batchDiamondCount').value.trim();
  const targetType = document.getElementById('diamondTargetType').value;

  if (!uuidsStr) {
    showFloatTip('请输入UUID列表', '#f44336');
    return;
  }
  if (!diamondCount || isNaN(diamondCount)) {
    showFloatTip('请输入有效的钻石数量', '#f44336');
    return;
  }

  const uuids = uuidsStr.split('\n').map(u => u.trim()).filter(u => u);
  batchAddDiamonds(uuids, diamondCount, targetType);
});

    // 其他功能保持不变（批量钻石充值、联盟币充值、解封、白名单等）
/* ========== 批量添加联盟币（回车分隔）========== */
document.getElementById('btnLeagueCoin').addEventListener('click', () => {
  const leagueIdsStr = document.getElementById('leagueId').value.trim();
  const leagueCount  = document.getElementById('leagueCount').value.trim();

  if (!leagueIdsStr) {
    showFloatTip('请输入联盟ID列表', '#f44336');
    return;
  }
  if (!leagueCount || isNaN(leagueCount)) {
    showFloatTip('请输入有效的联盟币数量', '#f44336');
    return;
  }

  const leagueIds = leagueIdsStr.split('\n').map(l => l.trim()).filter(l => l);
  if (leagueIds.length === 0) {
    showFloatTip('联盟ID列表无效', '#f44336');
    return;
  }

  const manualCookie = document.getElementById('manualCookie')?.value;
  const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': navigator.language || 'zh-CN,zh;q=0.9,en;q=0.8',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Upgrade-Insecure-Requests': '1'
  };
  if (manualCookie) headers['Cookie'] = manualCookie;

  let results = [];

  for (let leagueId of leagueIds) {
    const params = new URLSearchParams();
    params.append('creditCoinRecord.id', '');
    params.append('creditCoinRecord.leagueid', leagueId);
    params.append('creditCoinRecord.mcount', leagueCount);
    params.append('creditCoinRecord.rechargeType', '1');
    params.append('creditCoinRecord.text', '1');

    fetch(ORIGIN + '/recharge/creditcoin/add', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: headers,
      referrer: ORIGIN + '/recharge/creditcoin/add',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: params.toString()
    })
    .then(response => response.text())
    .then(text => {
      if (text.includes('code":0')) {
        results.push(`联盟【成功充值数量：${leagueCount}】 id：${leagueId}`);
      } else {
        results.push(`联盟充值失败: ${leagueId}, ${text}`);
      }

      if (results.length === leagueIds.length) {
        showFloatTip(results.join('\n'), '#4caf50');
      }
    })
    .catch(error => {
      results.push(`请求错误: ${leagueId}, ${error.message}`);
    });
  }
});

    document.getElementById('btnUnban').addEventListener('click', () => {
        const uuid = document.getElementById('manageUuid').value;
        const status = document.getElementById('manageStatus').value;
        if (!uuid) {
            showFloatTip('请输入用户UUID','#f44336');
            return;
        }

        const params = `uuid=${encodeURIComponent(uuid)}&status=${encodeURIComponent(status)}`;
        sendPost('/stat/manageaccount/setStatus', params, {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        })
        .then(r => r.json())
        .then(json => showFloatTip('解封结果(200即成功): ' + JSON.stringify(json)))
        .catch(err => showFloatTip(`解封操作失败:  +  response：${err.message}`,'#f44336'));
    });

    document.getElementById('btnGiveVip').addEventListener('click', () => {
        const uuid = document.getElementById('vipUuid').value;
        const nickname = document.getElementById('vipNick').value;
        if (!uuid || !nickname) {
            showFloatTip('请输入UUID和昵称','#f44336');
            return;
        }

        const params = new URLSearchParams();
        params.append('uuid', uuid);
        params.append('nickname', nickname);
        params.append('vipType', '2');
        params.append('remark', '1');

    sendPost('/stat/player/giveVip', params.toString())
        .then(r => r.json())  // 将响应转换为JSON
        .then(json => {
            if (json.code === 0) {
                showFloatTip(`'赠送结果: uuid：${uuid}赠送成功'`);
            } else {
                showFloatTip(`赠送结果: 失败, 代码 response：: ${json.code}, 消息: ${json.message || '未知错误'}`,'#f44336');
            }
        })
        .catch(err => {
            showFloatTip('赠送操作失败: ' + err.message);
        });
    });

    document.getElementById('btnExtraClub').addEventListener('click', () => {
        const uuid = document.getElementById('extraUuid').value;
        const extraNum = document.getElementById('extraClubNum').value;
        if (!uuid || !extraNum) {
            showFloatTip('请输入UUID和扩容数量','#f44336');
            return;
        }

        const params = new URLSearchParams();
        params.append('uuid', uuid);
        params.append('extraClubNum', extraNum);
        sendPost('/stat/player/editExtraClubNum', params.toString())
            .then(r => r.text())
            .then(txt => showFloatTip('创建俱乐部数量扩容成功: ' + txt))
            .catch(err => showFloatTip('扩容操作失败: ' + err.message));
    });

    // 迁移俱乐部成员功能
    document.getElementById('btnMoveMembers').addEventListener('click', () => {
        const fromClubId = document.getElementById('fromClubId').value;
        const toClubId = document.getElementById('toClubId').value;

        if (!fromClubId || !toClubId) {
            showFloatTip('请输入源俱乐部ID和目标俱乐部ID','#f44336');
            return;
        }

        const body = `fromClubid=${encodeURIComponent(fromClubId)}&toClubid=${encodeURIComponent(toClubId)}&remark=1`;

        const manualCookie = document.getElementById('manualCookie')?.value;
        const headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': navigator.language || 'zh-CN,zh;q=0.9,en;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Upgrade-Insecure-Requests': '1'
        };

        if (manualCookie) {
            headers['Cookie'] = manualCookie;
        }

        fetch(ORIGIN + '/stat/club/moveClubUser', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: headers,
            referrer: ORIGIN + '/stat/club',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: body
        })
        .then(response => response.text())
        .then(text => {
            if (text.includes('操作成功') || text.includes('0') || text.includes('{"code":0}')) {
                showFloatTip(`复制俱乐部成员成功！（俱乐部ID:${toClubId}）人数增加`);
            } else {
                showFloatTip(`迁移失败：或ID错误  response： ${text}`,'#f44336');
            }
        })
        .catch(error => {
            showFloatTip(`请求错误： response： ${error.message}`,'#f44336');
        });
    });

    // 新增功能 - 模拟器白名单
    document.getElementById('btnEmulatorWhite').addEventListener('click', () => {
        const uuids = document.getElementById('emulatorUuids').value;
        if (!uuids) {
            showFloatTip('请输入showID列表','#f44336');
            return;
        }

        const body = `uuidlist=${encodeURIComponent(uuids)}`;
        sendPost('/stat/emulatorplayerwhite/setStatus', body)
            .then(r => r.text())
            .then(txt => showFloatTip('模拟器白名单添加结果: ' + txt))
            .catch(err => showFloatTip(`'操作失败: '  response： ${err.message}`,'#f44336'));
    });

    // 小丑维护功能
    document.getElementById('btnMaintenanceOn').addEventListener('click', () => {
        const body = 'id=&maintenance=1&settlement_hour=8';
        sendPost('/clown/gameLeague/editLeagueBase', body)
            .then(r => r.text())
            .then(txt => showFloatTip('立即维护成功: ' + txt))
            .catch(err => showFloatTip(`'操作失败: '  response： ${err.message}`,'#f44336'));
    });

    document.getElementById('btnMaintenanceOff').addEventListener('click', () => {
        const body = 'id=&maintenance=0&settlement_hour=8';
        sendPost('/clown/gameLeague/editLeagueBase', body)
            .then(r => r.text())
            .then(txt => showFloatTip('结束维护成功: ' + txt))
            .catch(err => showFloatTip(`'操作失败: '  response： ${err.message}`,'#f44336'));
    });

    // UUID和SHOWID互查功能
    //let lastQueryUser = null;

    // 小丑策略筛选功能
// === 状态映射 ===
// 状态映射


const statusColorMap = {
    0: { text: '禁用', color: '#FF4500', bg: '#FFE4E1' },
    1: { text: '启用', color: '#008000', bg: '#E6FFE6' },
    2: { text: '彻底关闭', color: '#800080', bg: '#F3E5F5' }
};

//let clownStrategies = [];
let sortDirection = 'desc';

// 渲染策略表格
function renderStrategyTable(strategies) {
    const tbody = document.getElementById('strategyTableBody');
    tbody.innerHTML = '';

    const searchName = document.getElementById('strategySearch').value.trim().toLowerCase();
    const statusFilter = document.getElementById('strategyStatusFilter').value;

    let filtered = strategies.filter(s => {
        const nameMatch = !searchName || (s.gamePlotName || '').toLowerCase().includes(searchName);
        const statusMatch = !statusFilter || s.crazy_joker_status.toString() === statusFilter;
        return nameMatch && statusMatch;
    });

    filtered.sort((a, b) => {
        const valA = a.crazy_joker_game_pot || 0;
        const valB = b.crazy_joker_game_pot || 0;
        return sortDirection === 'desc' ? valB - valA : valA - valB;
    });

    filtered.forEach(strategy => {
        const tr = document.createElement('tr');
        const statusInfo = statusColorMap[strategy.crazy_joker_status] || {};

        tr.style.backgroundColor = statusInfo.bg;
        tr.style.color = statusInfo.color;
        tr.style.cursor = 'pointer';

        tr.innerHTML = `
            <td>${strategy.game_plot_id || 'N/A'}</td>
            <td>${strategy.gamePlotName || '无名称'}</td>
            <td>${strategy.leagueid || 'N/A'}</td>
            <td>${strategy.leaguename || '无名称'}</td>
            <td>${statusInfo.text}</td>
            <td>${strategy.crazy_joker_game_pot || 0}</td>
        `;

        tr.addEventListener('click', () => {
            showStrategyDetail(strategy);
        });

        tbody.appendChild(tr);
    });
}

// 加载策略
document.getElementById('btnLoadStrategies').addEventListener('click', () => {
    sendPost('/clown/gameLeague/list', 'page=1&rows=1000', {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
    })
    .then(r => r.json())
    .then(data => {
        if (!data.rows || data.rows.length === 0) {
            document.getElementById('strategyCount').textContent = '未找到策略';
            return;
        }

        clownStrategies = data.rows;
        document.getElementById('strategyCount').textContent = `已加载 ${clownStrategies.length} 条策略`;
        renderStrategyTable(clownStrategies);
    })
    .catch(err => {
        document.getElementById('strategyCount').textContent = `加载失败: ${err.message}`;
    });
});

// 统计策略（按策略名称聚合）
document.getElementById('btnCountStrategies').addEventListener('click', () => {
    if (clownStrategies.length === 0) {
        showFloatTip(`请先加载策略`,'#f44336');
        return;
    }

    const strategyMap = {};
    clownStrategies.forEach(strategy => {
        const name = strategy.gamePlotName || '未命名策略';
        if (!strategyMap[name]) {
            strategyMap[name] = {
                id: strategy.game_plot_id,
                name: name,
                count: 0
            };
        }
        strategyMap[name].count++;
    });

    const tbody = document.getElementById('strategyTableBody');
    tbody.innerHTML = '';

    Object.values(strategyMap)
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
        .forEach(item => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';
            tr.innerHTML = `
                <td>${item.id || 'N/A'}</td>
                <td>${item.name}</td>
                <td colspan="2">共 ${item.count} 个联盟</td>
                <td>-</td>
                <td>${item.count}</td>
            `;

            tr.addEventListener('click', () => {
                showStrategyDetailForName(item.name);
            });

            tbody.appendChild(tr);
        });
});

// 显示策略详情（单条）
function showStrategyDetail(strategy) {
    const detailDiv = document.getElementById('strategyDetail');
    const contentDiv = document.getElementById('detailContent');

    contentDiv.innerHTML = `
        <div><strong>策略ID:</strong> ${strategy.game_plot_id || 'N/A'}</div>
        <div><strong>策略名称:</strong> ${strategy.gamePlotName || '无名称'}</div>
        <div><strong>联盟ID:</strong> ${strategy.leagueid || 'N/A'}</div>
        <div><strong>联盟名称:</strong> ${strategy.leaguename || '无名称'}</div>
        <div><strong>联盟俱乐部:</strong> ${strategy.leaguelord || 'N/A'}</div>
        <div><strong>老虎机奖池:</strong> ${strategy.creditcoin || 0}</div>
        <div><strong>小丑状态:</strong> ${statusMap[strategy.crazy_joker_status] || '未知'}</div>
        <div><strong>JP池:</strong>
            JP1: ${strategy.l_jack_pot_1 || 0},
            JP2: ${strategy.l_jack_pot_2 || 0},
            JP3: ${strategy.l_jack_pot_3 || 0},
            JP4: ${strategy.l_jack_pot_4 || 0}
        </div>
        <div><strong>JP储备池:</strong>
            HP1: ${strategy.crazy_joker_hp1 || 0},
            HP2: ${strategy.crazy_joker_hp1 || 0},
            HP3: ${strategy.crazy_joker_hp1 || 0},
            HP4: ${strategy.crazy_joker_hp1 || 0}
        </div>
    `;

    detailDiv.style.display = 'block';
}

// 显示策略详情（按名称聚合）
function showStrategyDetailForName(strategyName) {
    const strategies = clownStrategies.filter(s => s.gamePlotName === strategyName);
    if (strategies.length === 0) return;

    const detailDiv = document.getElementById('strategyDetail');
    const contentDiv = document.getElementById('detailContent');

    let html = `
        <div><strong>策略名称:</strong> ${strategyName}</div>
        <div><strong>策略ID:</strong> ${strategies[0].game_plot_id || 'N/A'}</div>
        <div><strong>联盟数量:</strong> ${strategies.length}</div>
        <div><strong>联盟列表:</strong></div>
        <ul>
    `;

    strategies.forEach(s => {
        html += `<li>联盟ID: ${s.leagueid || 'N/A'}, 联盟名称: ${s.leaguename || '无名称'}, 状态: ${statusMap[s.crazy_joker_status] || '未知'}</li>`;
    });

    html += '</ul>';

    contentDiv.innerHTML = html;
    detailDiv.style.display = 'block';
}

// 关闭详情弹窗
document.getElementById('btnCloseDetail').addEventListener('click', () => {
    document.getElementById('strategyDetail').style.display = 'none';
});

// 实时搜索 + 状态筛选
document.getElementById('strategySearch').addEventListener('input', () => renderStrategyTable(clownStrategies));
document.getElementById('strategyStatusFilter').addEventListener('change', () => renderStrategyTable(clownStrategies));

// 奖池金额排序
document.getElementById('sortPotHeader').addEventListener('click', () => {
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    document.getElementById('sortPotHeader').textContent = `奖池金额 ${sortDirection === 'desc' ? '↓' : '↑'}`;
    renderStrategyTable(clownStrategies);
});
    // 批量修改密码功能
    // 批量修改密码（实时抓取公钥→仅加密密码 112233qq）
/* =========================================================
 *  批量改密：公钥 + security.js 双缓存
 * ========================================================= */
(() => {
  /* 0. 日志开关（如需调试，改回 console.log） */
  const LOG = () => {};

  /* 1. 双缓存 */
  const CACHE = {
    keys: null,      // {modulus, exponent}
    jsLoaded: false  // security.js 已注入
  };

  /* 2. 浏览器原生注入 security.js（只一次） */
  function loadSecurityJS() {
    return new Promise((resolve, reject) => {
      if (CACHE.jsLoaded) { resolve(); return; }
      const s = document.createElement('script');
      s.src = location.origin + '/static/js/security.js';
      s.onload  = () => { CACHE.jsLoaded = true; LOG('security.js 已缓存'); resolve(); };
      s.onerror = () => reject(new Error('加载 security.js 失败'));
      document.head.appendChild(s);
    });
  }

  /* 3. 取公钥（只抓一次） */
  async function getKeys() {
    if (CACHE.keys) return CACHE.keys;
    LOG('🔍 首次抓取公钥');
    const html = await fetch(location.origin + '/loginView', { credentials: 'include' })
                     .then(r => r.text());
    const mod = html.match(/modulus='([0-9a-fA-F]+)'/);
    const exp = html.match(/exponent='([0-9a-fA-F]+)'/);
    if (!mod) throw new Error('modulus 抓取失败');
    CACHE.keys = { modulus: mod[1], exponent: exp ? exp[1] : '010001' };
    return CACHE.keys;
  }

  /* 4. 加密密码 */
  function encryptPwd(pwd, { modulus, exponent }) {
    const key = RSAUtils.getKeyPair(exponent, '', modulus);
    return RSAUtils.encryptedString(key, `name=unused&pwd=${pwd}`);
  }

  /* 5. 单条改密 */
  async function resetOne(uuid, encKey, env) {
    const body = `uuid=${encodeURIComponent(uuid)}&nickname2=%E5%AE%83%E5%8C%85%E5%90%AB2356163&newpwd=&key=${encodeURIComponent(encKey)}`;
    const manualCookie = document.getElementById('manualCookie')?.value;
    const headers = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Upgrade-Insecure-Requests': '1'
    };
    if (manualCookie) headers['Cookie'] = manualCookie;

    try {
      const res = await fetch(location.origin + '/stat/player/updatepwd', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers,
        body
      });
      const txt = await res.text();
      return (txt.includes('操作成功') || txt.includes('{"code":0}'))
        ? `${env} uuid: ${uuid} 密码重置成功`
        : showTopTip(`${env} 密码重置失败（ID不存在或错误）: ${uuid}, ${txt}`, '#f44336');
    } catch (e) {
      return `${env} 网络错误: ${uuid}, ${e.message}`;
    }
  }

  /* 6. 主入口112233qq */
  async function batchResetPasswords(uuids, env) {
    if (!uuids.length) return;
    try {
      await loadSecurityJS();
      const keys = await getKeys();
      const encKey = encryptPwd('1', keys);
      const results = await Promise.all(
        uuids.map(uuid => resetOne(uuid, encKey, env))
      );
      showFloatTip(results.join('\n'), '#4caf50');
    } catch (err) {
      showFloatTip('批量改密异常：' + err.message, '#f44336');
    }
  }

  /* 7. 按钮绑定 */
/* 7. 按钮绑定（含空值、无效列表双重提示） */
document.getElementById('btnBatchResetPwd').onclick = () => {
  const uuidsStr = document.getElementById('batchPwdUuids').value.trim();
  if (!uuidsStr) {
    showFloatTip('请输入测试环境UUID列表', '#f44336');
    return;
  }
  const uuids = uuidsStr.split('\n').map(v => v.trim()).filter(v => v);
  if (uuids.length === 0) {
    showFloatTip('测试环境UUID列表无效', '#f44336');
    return;
  }
  batchResetPasswords(uuids, '测试环境');
};

document.getElementById('btnBatchUatResetPwd').onclick = () => {
  const uuidsStr = document.getElementById('batchUatPwdUuids').value.trim();
  if (!uuidsStr) {
    showFloatTip('请输入UAT环境UUID列表', '#f44336');
    return;
  }
  const uuids = uuidsStr.split('\n').map(v => v.trim()).filter(v => v);
  if (uuids.length === 0) {
    showFloatTip('UAT环境UUID列表无效', '#f44336');
    return;
  }
  batchResetPasswords(uuids, 'UAT环境');

  };
})();
    // 清空查询功能的按钮
    document.getElementById('clearQueryBtn').addEventListener('click', () => {
        document.getElementById('idQueryInput').value = '';
        document.getElementById('queryResultContainer').innerHTML = '';
    });
// 复制mtt比赛的按钮
document.getElementById('btnCopyRace').addEventListener('click', () => {
    const mttRaceId = document.getElementById('mttRaceId').value || '7083';
    const mttRaceName = document.getElementById('mttRaceName').value || '默认比赛名称'; // 获取mttRaceName的值，默认值为"默认比赛名称"
    const now = new Date();
    const singaporeTime = new Date(now.getTime() + (8 * 60 * 60 * 1000)); // 转换为新加坡时间 (UTC+8)
    singaporeTime.setMinutes(singaporeTime.getMinutes() + 10); // 加10分钟
    const formattedTime = singaporeTime.toJSON().slice(0, 19).replace('T', ' ');

    const body = `mttRaceId=${mttRaceId}&mttRaceName=${encodeURIComponent(mttRaceName)}&mttENRaceName=MTT+%E9%92%BB%E7%9F%B3+%E8%B5%9B%E4%BA%8B+16&mttZHTRaceName=MTT+%E9%92%BB%E7%9F%B3+%E8%B5%9B%E4%BA%8B+4&mttJARaceName=MTT+%E9%92%BB%E7%9F%B3+%E8%B5%9B%E4%BA%8B+2&startTime=${formattedTime}&sendTime=`;

    sendPost('/race/mttcreatemanage/copyRace', body)
        .then(response => response.text())
        .then(text => {
            try {
                const result = JSON.parse(text);
                if (result.code === 0) {
                    showFloatTip('复制MTT比赛成功！');
                } else {
                    showFloatTip(`复制MTT比赛失败, 代码: ${result.code}, 消息: ${result.message || '未知错误'}`,'#f44336');
                }
            } catch (e) {
                showFloatTip(`复制MTT比赛失败, 无法解析服务器响应`,'#f44336');
            }
        })
        .catch(error => {
            showFloatTip(`'复制MTT比赛失败: '  response： ${error.message}`,'#f44336');
        });
});
document.getElementById('btnDiamondRecovery').addEventListener('click', () => {
    const clubId = document.getElementById('diamondRecoveryClubId').value;
    const status = document.getElementById('diamondRecoveryStatus').value;

    if (!clubId) {
        showFloatTip('请输入俱乐部ID','#f44336');
        return;
    }


    const params = new URLSearchParams();
    params.append('club_id', clubId);
    params.append('diamondrecovery', status === '1' ? '开启回收' : '关闭回收');
    params.append('status', status);
    params.append('remark', '12q');

    sendPost('/stat/club/grantdiamond', params.toString())
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                showFloatTip(`俱乐部ID${clubId},设置回收权限成功！`);
                //alert('钻石回收权限设置成功！');
            } else {
                showFloatTip(`设置失败, 代码: ${data.code}, 接口返回: ${data.msg || '未知错误'}`,'#f44336');
            }
        })
        .catch(err => {
            showFloatTip(`钻石回收权限设置失败:   response： ${err.msg}`,'#f44336');
        });
});

    // 新增功能 - 开通鱿鱼权限
document.getElementById('btnSquid').addEventListener('click', () => {
    const clubId = document.getElementById('squidClubId').value.trim();
    if (!clubId) {
        showFloatTip('请输入俱乐部ID', '#f44336');
        return;
    }

    fetch(`${ORIGIN}/stat/clubGameWhite/add`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `type=&clubid=${clubId}`
    })
    .then(response => response.text())
    .then(text => {
        if (text.includes('1')) {
            showFloatTip(`俱乐部ID ${clubId} 鱿鱼权限开通成功`, '#4caf50');
        } else {
            showFloatTip(`俱乐部ID ${clubId} 鱿鱼权限开通失败`, '#f44336');
        }
    })
    .catch(() => showFloatTip('网络异常，开通失败', '#f44336'));
});
// 看手牌权限
// ---------- 看手牌权限（完全体） ----------
let whitelistCache = [];

// 拉取白名单列表（无区分）
async function fetchWhitelistList() {
  if (whitelistCache.length) return whitelistCache;
  try {
    const res = await fetch(`${ORIGIN}/stat/whitelist/list`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
      body: 'page=1&rows=1000&sort=otime&order=desc'
    });
    const data = await res.json();
    whitelistCache = data.rows || [];
    return whitelistCache;
  } catch (e) {
    showFloatTip('获取白名单列表失败', '#f44336');
    throw e;
  }
}

// 根据操作类型显/隐下拉框
document.getElementById('peekAction').addEventListener('change', e => {
  const typeBox = document.getElementById('peekType');
  const actionsNeedHide = ['open', 'close', 'delete'];
  typeBox.style.display = actionsNeedHide.includes(e.target.value) ? 'none' : '';
});

// 主按钮事件
document.getElementById('btnPeek').addEventListener('click', async () => {
  const id     = document.getElementById('peekId').value.trim();
  const type   = document.getElementById('peekType').value;   // 仅在 add 时生效
  const action = document.getElementById('peekAction').value; // add | open | close | delete

  if (!id) { showFloatTip('请输入俱乐部ID 或 联盟ID', '#f44336'); return; }

  /* 1) 首次添加 */
  if (action === 'add') {
    const body = new URLSearchParams({ whitelist_type: type, mode: 1, whitelist_ids: id }).toString();
    try {
      const res = await fetch(`${ORIGIN}/stat/whitelist/add`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body }).then(r => r.json());
      if (res.code === '0') {
                whitelistCache = []; // 清空缓存，下次重新拉取
        showFloatTip(`开通成功：${res.msg}`, '#4caf50');
      } else if (res.code === '1' && res.msg.includes('重复')) {
        showFloatTip('已存在，无需重复开通', '#ffc107');
      } else {
        showFloatTip(res.msg || '开通失败', '#f44336');
      }
    } catch {
      showFloatTip('网络异常', '#f44336');
    }
    return;
  }

  /* 2) 开启 / 关闭 / 删除：统一查列表再操作 */
  try {
    const list = await fetchWhitelistList();
    const item = list.find(i => i.whitelist_id.toString() === id);
      whitelistCache = []; // 清空缓存，下次重新拉取
    if (!item) { showFloatTip(`未找到白名单 ID ${id}`, '#f44336'); return; }

    let reqUrl, body, successColor, successMsg;

    if (action === 'open' || action === 'close') {
      const targetStatus = (action === 'open') ? 1 : 0;
      if (item.status === targetStatus) {
                whitelistCache = []; // 清空缓存，下次重新拉取
        showFloatTip(`该记录已经是 ${targetStatus ? '开启' : '关闭'} 状态`, '#ffc107');
        return;
      }
      reqUrl   = `${ORIGIN}/stat/whitelist/editstatus`;
      body     = new URLSearchParams({ id: item.id, status: targetStatus }).toString();
      successColor = targetStatus ? '#4caf50' : '#ff9800';
      successMsg   = `ID ${id} 已 ${targetStatus ? '开启' : '关闭'} 看手牌功能`;
    } else if (action === 'delete') {
      reqUrl   = `${ORIGIN}/stat/whitelist/delete`;
      body     = new URLSearchParams({ id: item.id }).toString();
      successColor = '#ff5252';
      successMsg   = `ID ${id} 看手牌权限已删除`;
    }

    const res = await fetch(reqUrl, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body }).then(r => r.json());
    if (res.code === 200) {
      showFloatTip(successMsg, successColor);
      whitelistCache = []; // 清空缓存
    } else {
      showFloatTip(res.msg || '操作失败', '#f44336');
    }
  } catch {
    showFloatTip('网络异常', '#f44336');
  }
});

    // ✅ 强制折叠面板（确保 HH 图标可见）
    const content = document.getElementById('panelContent');
    const btn = document.getElementById('toggleBtn');
    //const panel = document.getElementById('omsUtilityPanel');
    const collapsedView = document.getElementById('collapsedView');

    // 强制进入折叠状态
    content.style.display = 'none';
    btn.textContent = '▲';
    panel.style.width = COLLAPSED_CONFIG.size + 'px';
    panel.style.height = COLLAPSED_CONFIG.size + 'px';
    panel.style.borderRadius = '50%';
    panel.style.overflow = 'hidden';
    panel.style.cursor = 'pointer';
    panel.style.zIndex = '9999'; // 确保在最上层
    panel.style.position = 'fixed'; // 防止被其他元素挤压
    panel.style.top = '20px';
    panel.style.right = '10px';

    collapsedView.style.display = 'flex';
    collapsedView.style.alignItems = 'center';
    collapsedView.style.justifyContent = 'center';
    collapsedView.style.width = '100%';
    collapsedView.style.height = '100%';
    collapsedView.style.borderRadius = '50%';
    collapsedView.style.background = COLLAPSED_CONFIG.bgColor;
    collapsedView.style.color = COLLAPSED_CONFIG.textColor;
    collapsedView.style.fontSize = COLLAPSED_CONFIG.fontSize;
    collapsedView.style.fontFamily = COLLAPSED_CONFIG.fontFamily;


  /* ---------- 立即执行 ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoLogin);
  } else {
    autoLogin();
  }*/
/* =========================================================
 * 动态抓取 modulus + exponent 并完成自动登录（含日志）
 * ========================================================= */
/* =========================================================
 *  双域名动态登录：浏览器原生加载 security.js
 const LOG = () => {};   // 关闭日志
   const LOG = (...a) => console.log('[AutoLogin]', ...a);打印日志
 * ========================================================= */
(() => {
const LOG = () => {};
  /* web */
/* （零） */
const CFG_CRYPT = {
  'oms-web.lunarsphere.xyz': { user: 'Njg4MDAwMTIzNw==', pwd: 'MTEyMjMzcXE=' },
  '54.65.203.182:8060':      { user: 'ODg4MzMz', pwd: 'MQ==' },
  'oms-web.nuvankerder.com': { user: 'Njg4MDAwMTIzNw==', pwd: 'dHQxMjM0NTY=' },
  'oms-web-stg.nuvankerder.com': { user: 'Njg4MDAwMTIzNw==', pwd: 'dHQxMjM0NTY=' }
};

/*  */
function getAccount(host) {
  const c = CFG_CRYPT[host];
  return c ? { user: atob(c.user), pwd: atob(c.pwd) } : null;
}

  /* 缓存对象 */
  const CACHE = {
    modulus:  null,
    exponent: null
  };

  /* 1. 用 <script> 把 security.js 注入页面（只一次） */
  function loadSecurityJS() {
    return new Promise((resolve, reject) => {
      if (window.RSAUtils) { resolve(); return; }
      const s = document.createElement('script');
      s.src = location.origin + '/static/js/security.js';
      s.onload  = () => { LOG('✅ security.js 已加载到全局'); resolve(); };
      s.onerror = () => { showFloatTip('加载 security.js 失败', '#f44336'); reject(); };
      document.head.appendChild(s);
    });
  }

  /* 2. 抓取公钥（每次点击按钮或自动登录都会刷新） */
  async function fetchKeys() {
    LOG('🔍 抓取 modulus / exponent ...');
    const html = await fetch(location.origin + '/loginView', { credentials: 'include' })
                     .then(r => r.text());
    const mod = html.match(/modulus='([0-9a-fA-F]+)'/);
    const exp = html.match(/exponent='([0-9a-fA-F]+)'/);
    if (!mod) throw new Error('modulus 抓取失败');
    CACHE.modulus  = mod[1];
    CACHE.exponent = exp ? exp[1] : '010001';
    LOG('✅ 公钥已更新：', CACHE);
  }

  /* 3. 真正登录 */
  async function doLogin() {
    try {
              const host = location.host; // 当前域名（含端口）
     const cfg = getAccount(location.host);
      if (!cfg) { LOG('❌ 未知域名'); return; }

      await loadSecurityJS();   // 浏览器加载 security.js
      await fetchKeys();        // 抓取最新公钥

      const key = RSAUtils.getKeyPair(CACHE.exponent, '', CACHE.modulus);
      const enc = RSAUtils.encryptedString(key, `name=${cfg.user}&pwd=${cfg.pwd}`);

      const body = `key=${enc}&username=${cfg.user}&pwd=${cfg.pwd}&capchaCode=`;
      const resp = await fetch(location.origin + '/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      }).then(r => r.text());

      LOG('🎯 /login 返回：', resp);
      if (resp.includes('success') || resp.includes('index')) {
        showFloatTip(`✅${host} 登录成功！HH@by测试组`);
      } else {
        showFloatTip('❌ 登录失败', '#f44336');
      }
    } catch (e) {
      LOG('❌ doLogin 异常：', e);
      showFloatTip('登录异常：' + e.message, '#f44336');
    }
  }

  /* 4. 路由判断 */
  const href = location.href;
  if (href.endsWith('/loginView') || href.includes('/loginView?')) {
            const btn = document.getElementById('autoLoginBtn');
            if (btn) btn.onclick = doLogin;
    LOG('🚀 当前为 loginView，自动登录');
    doLogin();
  } else if (getAccount(location.host)) {
    LOG('🖱️ 绑定【自动登录】按钮事件');
    const bindBtn = () => {
      const btn = document.getElementById('autoLoginBtn');
      if (btn) btn.onclick = doLogin;
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindBtn);
    } else {
      bindBtn();
    }
  }
})();

    // ---------- 创建靓号俱乐部 ----------
document.getElementById('btnCreateVipClub').addEventListener('click', () => {
  const clubId   = document.getElementById('vipClubId').value.trim();
  const clubName = document.getElementById('vipClubName').value.trim();
  const uuid     = document.getElementById('vipClubUuid').value.trim();
  const strid    = document.getElementById('vipClubStr').value.trim();
  if (!clubId || !clubName || !uuid || !strid) {
    showFloatTip('请完整填写俱乐部信息', '#ff9800'); return;
  }

  const body = new URLSearchParams({
    clubid: clubId, clubname: clubName, uuid: uuid, strid: strid, clublevel: 10, clubFlag: 0,text: 78
  }).toString();

  fetch(ORIGIN + '/stat/club/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'include',
    body
  })
  .then(r => r.text())          // ← 先拿纯文本
  .then(txt => {
    const code = Number(txt.trim());  // 转成数字
    if (code === 1) {
      showFloatTip(`创建成功：俱乐部名字：[${clubName}]（ID:${clubId}）`, '#4caf50');
    } else if (code === 2) {
      showFloatTip(`俱乐部ID ${clubId} 已存在`, '#ffc107');
    } else if (code === 3) {
      showFloatTip('用户手机号/信息不匹配', '#f44336');
    } else {
      showFloatTip('创建失败：' + (res.msg || '未知错误'), '#f44336');
    }
  })
  .catch(err => showFloatTip('网络异常', '#f44336'));
});

    // ---------- 俱乐部成员插入 ---------
document.getElementById('btnInsertClubMember').addEventListener('click', async () => {
  const clubId = document.getElementById('insertClubId').value.trim();
  const uuid   = document.getElementById('insertUuid').value.trim();

  if (!clubId || !uuid) {
    showFloatTip('请输入俱乐部ID和用户UUID', '#f44336');
    return;
  }

  const body = new URLSearchParams({ clubId, uuid }).toString();

  try {
    const res = await fetch(`${ORIGIN}/stat/clubjoin/join`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });

    const text = await res.text();
    const code = Number(text.trim());

    switch (code) {
      case 0:
        showFloatTip(`成功：用户uuid: ${uuid} 已加入俱乐部id: ${clubId}`, '#4caf50');
        //document.getElementById('insertClubId').value = '';
        document.getElementById('insertUuid').value = '';
        break;
      case 3:
        showFloatTip('提示：该用户已在此俱乐部', '#f44336');
        break;
      case 1:
      default:
        showFloatTip('失败：俱乐部或用户UUID错误', '#f44336');
    }
  } catch (e) {
    showFloatTip('网络异常，请重试', '#f44336');
  }
});

    /* ---------- 联盟管理相关功能 ---------- */
// 工具函数：统一处理返回
function leagueRespHandler(txt, okCode, successMsg, failPrefix = '操作失败') {
  try {
    const json = JSON.parse(txt);
    if (json.code === okCode) {
      showFloatTip(successMsg, '#4caf50');
    } else {
      showFloatTip(`${failPrefix}：${json.msg || txt}`, '#f44336');
    }
  } catch {
    showFloatTip(`${failPrefix}：${txt}`, '#f44336');
  }
}

// 1. 创建联盟
document.getElementById('btnCreateLeague').addEventListener('click', () => {
  const lid  = document.getElementById('newLeagueId').value.trim();
  const lname = document.getElementById('newLeagueName').value.trim();
  const club = document.getElementById('newLeagueClub').value.trim();
  if (!lid || !lname || !club) { showFloatTip('请完整填写联盟信息', '#f44336'); return; }

  const body = `leagueId=${lid}&leagueName=${encodeURIComponent(lname)}&clubId=${club}&leagueLevel=6&text=1`;
  sendPost('/stat/league/add', body)
    .then(r => r.text())
    .then(t => leagueRespHandler(t, 1, '联盟创建成功！'))
    .catch(e => showFloatTip('网络异常：' + e.message, '#f44336'));
});

// 2. 升级授信
document.getElementById('btnSetCredit').addEventListener('click', () => {
  const id  = document.getElementById('creditLeagueId').value.trim();
  const cid = document.getElementById('creditClubId').value.trim();
  const type = document.getElementById('creditType').value;
  if (!id || !cid) { showFloatTip('请输入联盟ID与主机俱乐部ID', '#f44336'); return; }

  const body = `id=${id}&iscredit=${type}&clubid=${cid}`;
  sendPost('/stat/league/setIsCredit', body, { 'X-Requested-With': 'XMLHttpRequest' })
    .then(r => r.text())
    .then(t => leagueRespHandler(t, 2, type === '1' ? '已升级为超级联盟' : '已降为普通联盟'))
    .catch(e => showFloatTip('网络异常：' + e.message, '#f44336'));
});

// 3. 设置抽水
document.getElementById('btnSetPot').addEventListener('click', () => {
  const id  = document.getElementById('potLeagueId').value.trim();
  const pt  = document.getElementById('potType').value;
  if (!id) { showFloatTip('请输入联盟ID', '#f44336'); return; }

  const body = `id=${id}&potType=${pt}`;
  sendPost('/stat/league/setPotType', body, { 'X-Requested-With': 'XMLHttpRequest' })
    .then(r => r.text())
    .then(t => leagueRespHandler(t, 3, pt === '1' ? '已设为底池抽水' : '已设为普通抽水'))
    .catch(e => showFloatTip('网络异常：' + e.message, '#f44336'));
});

// 4. 加入联盟
document.getElementById('btnJoinLeague').addEventListener('click', () => {
  const cid = document.getElementById('joinClubId').value.trim();
  const lid = document.getElementById('joinLeagueId').value.trim();
  if (!cid || !lid) { showFloatTip('请输入俱乐部ID与联盟ID', '#f44336'); return; }

  const body = `clubid=${cid}&leagueId=${lid}`;
  sendPost('/stat/club/joinLeague', body)
    .then(r => r.text())
    .then(t => leagueRespHandler(t, 0, '俱乐部已成功加入联盟'))
    .catch(e => showFloatTip('网络异常：' + e.message, '#f44336'));
});

// 5. 踢出联盟
document.getElementById('btnKickLeague').addEventListener('click', () => {
  const cid = document.getElementById('kickClubId').value.trim();
  const lid = document.getElementById('kickLeagueId').value.trim();
  const force = document.getElementById('kickForce').value;
  if (!cid || !lid) { showFloatTip('请输入俱乐部ID与联盟ID', '#f44336'); return; }

  const body = `clubid=${cid}&leagueId=${lid}&force=${force}`;
  sendPost('/stat/club/kickLeague', body)
    .then(r => r.text())
    .then(t => leagueRespHandler(t, 0, force === '1' ? '已强制踢出联盟' : '已踢出联盟'))
    .catch(e => showFloatTip('网络异常：' + e.message, '#f44336'));
});

    /* ---------- 联盟审核 ---------- */
/* ---------- 联盟审核 ---------- */
let reviewData = [];        // 原始数据
const reviewArea   = document.getElementById('reviewArea');
const reviewList   = document.getElementById('reviewListWrapper');
const reviewActions= document.getElementById('reviewActions');

// 查询待处理
document.getElementById('btnQueryLeagueReview').addEventListener('click', () => {
  fetch(`${ORIGIN}/stat/leagueCreateReview/list`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
    body: 'club_id=&club_name=&league_id=&status=0&page=1&rows=50'
  })
  .then(r => r.json())
  .then(json => {
    if (!json.rows || json.rows.length === 0) {
      reviewArea.style.display = 'block';
      reviewList.innerHTML = '<div style="padding:8px; color:#666;">暂无待处理记录</div>';
      reviewActions.style.display = 'none';
      return;
    }
    reviewData = json.rows;
    renderReviewTable(json.rows);
    reviewArea.style.display   = 'block';
    reviewActions.style.display= 'block';
  })
  .catch(err => {
    reviewArea.style.display = 'block';
    reviewList.innerHTML = '<div style="padding:8px; color:red;">查询失败：' + err.message + '</div>';
    reviewActions.style.display = 'none';
  });
});

// 渲染表格
function renderReviewTable(rows) {
  const clubTypeMap = { 0: '积分', 1: '星币' };
  const html = `
    <table style="width:100%; font-size:12px; border-collapse:collapse;">
      <thead style="background:#f2f2f2;">
        <tr>
          <th style="border:1px solid #ddd; padding:4px;"><input type="checkbox" id="chkAllReview"></th>
          <th style="border:1px solid #ddd; padding:4px;">审核ID</th>
          <th style="border:1px solid #ddd; padding:4px;">申请人ID</th>
          <th style="border:1px solid #ddd; padding:4px;">申请人昵称</th>
          <th style="border:1px solid #ddd; padding:4px;">俱乐部ID</th>
          <th style="border:1px solid #ddd; padding:4px;">俱乐部名称</th>
          <th style="border:1px solid #ddd; padding:4px;">类型</th>
          <th style="border:1px solid #ddd; padding:4px;">联盟名字</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td style="border:1px solid #ddd; padding:4px; text-align:center;"><input type="checkbox" class="chkReview" value="${r.id}"></td>
            <td style="border:1px solid #ddd; padding:4px;">${r.id}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.applicant_id}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.applicant_name}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.club_id}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.club_name}</td>
            <td style="border:1px solid #ddd; padding:4px;">${clubTypeMap[r.club_type] || '未知'}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.league_name || '-'}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
  reviewList.innerHTML = html;

  // 全选
  document.getElementById('chkAllReview').onchange = function () {
    document.querySelectorAll('.chkReview').forEach(cb => cb.checked = this.checked);
  };
}

// 批量审核
async function batchReview(status, desc) {
  const checked = Array.from(document.querySelectorAll('.chkReview:checked'));
  if (checked.length === 0) { showFloatTip('请先勾选要审核的记录', '#f44336'); return; }

  const results = [];
  for (const cb of checked) {
    const id = cb.value;
    try {
      const res = await fetch(`${ORIGIN}/stat/leagueCreateReview/setstatus`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
        body: `id=${id}&status=${status}&deal_remark=`
      }).then(r => r.json());

      if (res.code === 0) {
        results.push(`审核ID ${id} 已${desc}`);
      } else {
        results.push(`审核ID ${id} 失败：${res.msg}`);
      }
    } catch (e) {
      results.push(`审核ID ${id} 网络错误`);
    }
  }
  showFloatTip(results.join('\n'), '#4caf50');
  // 刷新列表
  document.getElementById('btnQueryLeagueReview').click();
}

document.getElementById('btnBatchAgree').onclick  = () => batchReview(1, '同意');
document.getElementById('btnBatchReject').onclick = () => batchReview(2, '拒绝');

   /* ---------- 俱乐部ID查询（独立） ---------- */
const clubTypeMap = { 0: '积分', 1: '星币' };
document.getElementById('btnClubQuery').addEventListener('click', () => {
  const cid = document.getElementById('clubQueryInput').value.trim();
  if (!cid) { showFloatTip('请输入俱乐部ID', '#f44336'); return; }

  fetch(`${ORIGIN}/stat/club/list`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
    body: `clubid=${cid}&clubname=&clubType=&page=1&rows=10&sort=clubid&order=desc`
  })
  .then(r => r.json())
  .then(json => {
    const area = document.getElementById('clubQueryArea');
    const table = document.getElementById('clubQueryTable');
    if (!json.rows || json.rows.length === 0) {
      area.style.display = 'block';
      table.innerHTML = '<div style="padding:8px; color:#666;">暂无记录</div>';
      return;
    }
    const r = json.rows[0];
    table.innerHTML = `
      <table style="width:100%; font-size:12px; border-collapse:collapse;">
        <thead style="background:#f2f2f2;">
          <tr>
            <th style="border:1px solid #ddd; padding:4px;">俱乐部ID</th>
            <th style="border:1px solid #ddd; padding:4px;">俱乐部名称</th>
            <th style="border:1px solid #ddd; padding:4px;">创建者ID</th>
            <th style="border:1px solid #ddd; padding:4px;">星币余额</th>
            <th style="border:1px solid #ddd; padding:4px;">保险余额</th>
            <th style="border:1px solid #ddd; padding:4px;">钻石余额</th>
            <th style="border:1px solid #ddd; padding:4px;">所属联盟</th>
            <th style="border:1px solid #ddd; padding:4px;">类型</th>
            <th style="border:1px solid #ddd; padding:4px;">等级</th>
            <th style="border:1px solid #ddd; padding:4px;">当前成员</th>
            <th style="border:1px solid #ddd; padding:4px;">注册时间</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border:1px solid #ddd; padding:4px;">${r.clubid}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.clubname}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.createuser}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.star_coin}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.margin}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.diamond}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.creditid || '-'}</td>
            <td style="border:1px solid #ddd; padding:4px;">${clubTypeMap[r.clubType] || '未知'}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.clublevel}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.currentmembers}</td>
            <td style="border:1px solid #ddd; padding:4px;">${r.logintime}</td>
          </tr>
        </tbody>
      </table>`;
    area.style.display = 'block';
  })
  .catch(err => {
    document.getElementById('clubQueryArea').style.display = 'block';
    document.getElementById('clubQueryTable').innerHTML = '<div style="padding:8px; color:red;">查询失败：' + err.message + '</div>';
  });
});

        // 通用飘窗提示（2.5 秒后自动消失）
    /*
 * showFloatTip 颜色速查
 * 第 2 个参数 bg 可传：
 * -------------------------------------------------
 * '#4caf50' 或 'linear-gradient(to right,#4caf50,#81c784)'    → 绿色  ✔ 成功
 * '#ff9800' 或 'linear-gradient(to right,#ff9800,#ffb74d)'    → 橙色  ⚠ 警告/提示
 * '#f44336' 或 'linear-gradient(to right,#f44336,#e57373)'    → 红色  ✖ 错误
 * '#ffc107' 或 'linear-gradient(to right,#ffc107,#ffeb3b)'    → 黄色  ⓘ 已存在/重复
 * -------------------------------------------------
 * 示例：
 * showFloatTip('开通成功', '#4caf50');
 * showFloatTip('已存在',   '#ffc107');
 * showFloatTip(`设置看手牌权限成功：${res.msg}`, '#4caf50');
 */
// 通用飘窗提示（按钮渐变风）
function showFloatTip(text, bg = 'linear-gradient(to right, #98fb98, #32cd32)') {
  const tip = document.createElement('div');
  tip.innerText = text;
  tip.style.cssText = `
    position:fixed; top:30%; left:50%; transform:translate(-50%,-50%);
    padding:8px 16px; background:${bg}; color:#fff;
    border:none; border-radius:6px; font-size:20px; font-weight:bold;
    min-width:240px; text-align:center; z-index:99999;
    box-shadow:0 4px 12px rgba(0,0,0,.25);
    transition:opacity .3s;
  `;
  document.body.appendChild(tip);
  setTimeout(() => {
    tip.style.opacity = 0;
    setTimeout(() => tip.remove(), 300);
  }, 3000);
}



    // ✅ 顶部飘窗固定提示（非通用飘窗）
const showTopTip = (text, bg = '#ffc107') => {
  // 避免重复提示
  const old = document.getElementById('top-tip');
  if (old) old.remove();

  const tip = document.createElement('div');
  tip.id = 'top-tip';
  tip.innerText = text;
  tip.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 16px;
    background: ${bg};
    color: #000;
    font-size: 18px;
    font-weight: bold;
    border-radius: 6px;
    z-index: 99999;
    box-shadow: 0 4px 12px rgba(0,0,0,.25);
    transition: opacity .3s;
  `;
  document.body.appendChild(tip);

  // 2秒后淡出并移除
  setTimeout(() => {
    tip.style.opacity = 0;
    setTimeout(() => tip.remove(), 300);
  }, 3000);
};

/* ✅ 使用方式
showTopTip(`俱乐部钻石不足，向用户${showid}转账失败`, '#ffc107');
*/
})();