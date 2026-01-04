// ==UserScript==
// @name         CMS +新APP & 2.1.8.8 (by：测试组@Steven)
// @namespace    http://tampermonkey.net/
// @version      2.1.8.8
// @description  新增设置小丑游戏名、单独启/禁用小丑附属俱乐部、获取小丑游戏配置等功能。优化UI显示，自动提取token并加载俱乐部，新增按角色-联盟币余额排序，全选设置贵宾和统一设置贵宾比例。优化飘窗提示。区分了俱乐部缓存。
// @author       Steven
// @match        https://cms.yahhp.shop/*
// @match        https://cms.8z3i7.lunarsphere.xyz/*
// @match        https://cms.ayybyyy.com/*
// @match        https://cms-web.lunarsphere.xyz/*
// @match        https://d2pfu07omhbe26.cloudfront.net/*
// @match        https://cms-web.nuvankerder.com/*
// @match        https://cms-web-stg.nuvankerder.com/*


// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544009/CMS%20%2B%E6%96%B0APP%20%202188%20%28by%EF%BC%9A%E6%B5%8B%E8%AF%95%E7%BB%84%40Steven%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544009/CMS%20%2B%E6%96%B0APP%20%202188%20%28by%EF%BC%9A%E6%B5%8B%E8%AF%95%E7%BB%84%40Steven%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.__cmsPanelInjected) return;
    window.__cmsPanelInjected = true;

    const COLLAPSED_CONFIG = {
        text: "HH",
        size: 40,
    bgColor: "#0F0F0F",        // 纯黑底色
    textColor: "#D4AF37",      // 鎏金文字
        fontSize: "22px",
        fontFamily: "Arial, sans-serif"
    };

    const host = location.hostname;
    let API = '';
    if (host.includes('cms.ayybyyy.com')) {
        API = 'https://cmsapi3.qiucheng-wangluo.com';
    } else if (host.includes('cms.yahhp.shop')) {
        API = 'https://cms-api.yahhp.shop';
    } else if (host.includes('cms-web.lunarsphere.xyz')) {
        API = 'https://cms-distributed.lunarsphere.xyz:8081';
    } else if (host.includes('d2pfu07omhbe26.cloudfront.net')) {
        API = 'https://cms-api-direct.qiucheng-wangluo.com';
    } else if (host.includes('cms.8z3i7.lunarsphere.xyz')) {
        API = 'https://cms-distributed.lunarsphere.xyz:8082';
    } else if (host.includes('cms-web.nuvankerder.com')) {
        API = 'https://cms-distributed.nuvankerder.com:8081';
    } else if (host.includes('cms-web-stg.nuvankerder.com')) {
        API = 'https://cms-distributed-stg.nuvankerder.com:8081';
    }
// 异步获取当前用户名（优先用接口）
function getCurrentUsername() {
    // 最多重试 20 次，每次 300ms，直到拿到用户名
    return new Promise((resolve) => {
        let tries = 0;
        const timer = setInterval(() => {
            const el = document.querySelector("body > div.top > div > div.top_pub_right.fr > ul > li:nth-child(3) > span");
            if (el && el.textContent.trim()) {
                clearInterval(timer);
                resolve(el.textContent.trim());
            } else if (++tries >= 60) {
                clearInterval(timer);
                resolve('unknown'); // 兜底
            }
        }, 999);
    });
}

let gUsername = ''; // 全局变量，后续任何地方直接读取
    (async () => {
    gUsername = await getCurrentUsername();
    console.log(`[全局1] 当前用户：${gUsername}`);
document.getElementById('usernamePlaceholder').textContent = gUsername;
    // 读取对应用户的 token
    const tokenKey = `cmsToken_${gUsername}`;
    const savedToken = localStorage.getItem(tokenKey);
    if (savedToken) {
        autoToken = savedToken;
        //console.log(`[${gUsername}11] 从 localStorage 读取 token:`, autoToken);
    }

    // 触发后续逻辑（如自动加载俱乐部）
    if (autoToken) {
        autoLoadClub(autoToken);
    }
})();

    let autoToken = '';
    let initialLoad = true;

    const autoObserver = new MutationObserver(() => {
        const tokenDiv = document.querySelector('.tokenVal');
        if (tokenDiv && tokenDiv.textContent.trim()) {
            const token = tokenDiv.textContent.trim();
            console.log(`${gUsername}'[AutoToken] 84行提取到 token:'`, token);
            localStorage.setItem('cmsToken', token);
            autoToken = token;
            autoLoadClub(token);
            autoObserver.disconnect();
        }
    });

    autoObserver.observe(document.body, { childList: true, subtree: true });

    async function autoLoadClub(token) {
        let path = '/cms-api/club/getClubList';
        let fullPath;
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json, text/javascript',
            'token': token
        };
        let credentials = 'include';

        if (host.includes('cms-web.lunarsphere.xyz') || host.includes('cms.8z3i7.lunarsphere.xyz')|| host.includes('cms-web.nuvankerder.com')|| host.includes('cms-web-stg.nuvankerder.com')) {
            path = '/cms-api/club/getClubList';
            fullPath = API + '//' + path.substring(1);
            credentials = 'omit';
            headers.token = token;
        } else {
            fullPath = API + path;
        }

        try {
            const res = await fetch(fullPath, {
                method: 'POST',
                headers,
                credentials: 'omit',
                body: null
            });
            const json = await res.json();
            if (json.iErrCode === 0) {
                localStorage.setItem('cmsClubs', JSON.stringify(json.result));
                console.log('[AutoClub] 123自动加载俱乐部成功:', json.result);
            } else {
                console.warn('[AutoClub] 加载失败:', json.iErrCode);
            }
        } catch (e) {
            console.error('[AutoClub] 请求异常:', e);
        }
    }

    function onReady(fn) {
        document.readyState !== 'loading'
            ? fn()
            : document.addEventListener('DOMContentLoaded', fn);
    }

    let cachedClubs = null;

    onReady(() => {
        const panel = document.createElement('div');
        Object.assign(panel.style, {
            position: 'fixed', top: '60px', right: '20px', width: '580px',
            background: '#fff', border: '1px solid #e0e6ed', borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '12px', zIndex: 99999,
            transformOrigin: 'top right', transition: 'transform .2s ease',
            maxHeight: '87vh', display: 'flex', flexDirection: 'column'
        });

        let savedWidth = localStorage.getItem('panelWidth') || '580';
        panel.style.width = `${savedWidth}px`;

        panel.innerHTML =
            `<div id="panelTopSection" style="flex-shrink: 0;">
              <div id="panelHeader" style="display: flex; justify-content: space-between; align-items: center; cursor: move; margin-bottom: 10px; font-weight: bold;">
                <span style="font-size:16px;font-weight:bold;">CMS 管理面板(双击放大)</span>
                 <span style="font-size: 14px; color: rgb(136, 136, 136);"">当前用户：<span id="usernamePlaceholder" style="color:red;">加载中...</span></span>
                <button id="collapseBtn" style="border:none;background:none;cursor:pointer;font-size:22px;">折叠−</button>
              </div>
              <div id="widthControls" style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 12px; margin-right: 7px;">宽度:</span>
                ${[600, 680, 880].map(w => {
                  const isActive = parseInt(savedWidth) === w ? 'background: #4169E1; color: white;' : '';
                  return `<button class="widthBtn" data-width="${w}" style="margin:0 2px; padding:2px 6px; font-size:11px; border-radius:4px; border:1px solid #ccc; ${isActive}">${w}</button>`;
                }).join('')}
              </div>
            </div>
            <div id="panelBody" style="overflow-y: auto; flex-grow: 1; padding-top: 5px;">
              <div style="margin-bottom:12px;"><label style="font-size:14px;">Token (留空点击自动获取):</label>
                <input id="cmsTokenInput" type="text" placeholder="手动输入 token 或留空" style="width:100%;padding:6px;border:1px solid #ccd0d5;border-radius:4px;margin-top:4px;" />
              </div>
              <button id="loadClubsBtn" style="width:100%;padding:8px;background:#2f80ed;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-bottom:12px;">(俱乐部首页点击)默认会自动加载俱乐部列表</button>
              <div id="clubSection" style="display:none;margin-bottom:12px;">
                <label style="font-size:14px; color: red;font-weight: bold;">选择俱乐部:(双击复制俱乐部ID)</label>
                <select id="clubSelect" style="width:100%;  height: 35px;padding:1px;border:3px solid #ccd0d5;border-radius:4px;margin-top:4px;"></select>
              </div>
<div id="freeCheckSection" style="display:none;display:flex;justify-content:space-between;margin-bottom:6px;">
  <button id="enableFreeCheckBtn" style="flex:1;margin-right:6px;padding:8px;background:#27ae60;color:#fff;border:none;border-radius:4px;cursor:pointer;">开启免审核</button>
  <button id="disableFreeCheckBtn" style="flex:1;margin-left:6px;padding:8px;background:#c0392b;color:#fff;border:none;border-radius:4px;cursor:pointer;">关闭免审核</button>
</div>
<div id="jokerSection" style="display:none;display:flex;justify-content:space-between;margin-bottom:6px;">
  <button id="enableJokerBtn" style="flex:1;margin-right:6px;padding:8px;background:#27ae60;color:#fff;border:none;border-radius:4px;cursor:pointer;">启用全部小丑</button>
  <button id="disableJokerBtn" style="flex:1;margin-left:6px;padding:8px;background:#c0392b;color:#fff;border:none;border-radius:4px;cursor:pointer;">禁用全部小丑</button>
</div>
              <button id="loadMembersBtn" style="width:100%;padding:8px;background:#56ccf2;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-top:12px;">加载俱乐部成员</button>
              <div id="membersSection" style="display:none;margin-bottom:12px;">
                <div style="margin-bottom:8px;display:flex;align-items:center;">
                   <!-- 现有按钮... -->
   <button id="unlockManagerBtn"  style="padding:4px 8px;background:#00bcd4;color:#fff;border:none;border-radius:4px;cursor:pointer;">解封管理</button>
   <input id="unlockManagerShowIdInput" type="text" placeholder="勾选或输入showID" style="width:120px; padding:6px; border:1px solid #ccd0d5; border-radius:4px; font-size:14px;" />

                    <label style="font-size:14px;">加币数量:</label>
                    <input id="creditAmount" type="number" value="200000" style="width:80px;padding:6px;border:1px solid #ccd0d5;border-radius:4px;margin-left:8px;" />
                    <span id="memberClubIdDisplay" style="font-size: 13px; color: #3498db; user-select: text; font-weight: bold;"></span>

                </div>
                <!-- 钻石基金转账 & 钻石回收 -->
<div style="margin-bottom:8px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
  <label style="font-size:14px;">钻石基金:</label>
  <input id="diamondTransferAmount" type="number" value="233" style="width:70px;padding:4px;border:1px solid #ccd0d5;border-radius:4px;" />
  <button id="diamondTransferBtn" style="padding:4px 8px;background:#27ae60;color:#fff;border:none;border-radius:4px;cursor:pointer;">批量转账</button>

  <label style="font-size:14px;">钻石回收:</label>
  <input id="diamondRecallAmount" type="number" value="69" style="width:70px;padding:4px;border:1px solid #ccd0d5;border-radius:4px;" />
  <button id="diamondRecallBtn" style="padding:4px 8px;background:#c0392b;color:#fff;border:none;border-radius:4px;cursor:pointer;">批量回收</button>
</div>
<div style="margin-bottom:12px; max-height: 250px; overflow-y: auto;">
<!-- 固定表头：使用 sticky 实现 -->
<table id="memberTable" style="width:100%; border-collapse: collapse;">
<div id="memberSearchBoxWrapper" style="margin-bottom:8px;"></div>
<thead style="position: sticky; top: 0; background: #e53935; color: #fff; z-index: 1;">    <tr>
      <th style="border:1px solid #ccc; padding:4px; text-align:center;">
        <input type="checkbox" id="selectAllMembers" />
      </th>
      <th style="border:1px solid #ccc; padding:4px; text-align:center;">角色</th>
      <th style="border:1px solid #ccc; padding:4px; text-align:center;">UUID</th>
      <th style="border:1px solid #ccc; padding:4px; text-align:center;">showID</th>
      <th style="border:1px solid #ccc; padding:4px;">昵称</th>
      <th style="border:1px solid #ccc; padding:4px; text-align:center;">联盟币-</th>
      <!-- 新增钻石字段 -->
      <th style="border:1px solid #ccc; padding:4px; text-align:center;">钻石</th>
            <th style="border:1px solid #ccc; padding:4px; text-align:center;">星币</th>
            <th style="border:1px solid #ccc; padding:4px; text-align:center;">金币</th>


    </tr>
  </thead>
  <tbody id="memberList"></tbody>
</table>
                </div>
                <div style="display:flex; gap: 8px; margin-top: 8px;">
                   <button id="addCreditBtn" style="flex:1; padding:8px;background:#2d9cdb;color:#fff;border:none;border-radius:4px;cursor:pointer;">批量加联盟币</button>
                   <button id="kickMembersBtn" style="flex:1; padding:8px;background:#e74c3c;color:#fff;border:none;border-radius:4px;cursor:pointer;">批量踢出用户</button>
                   <button id="setManagerBtn" style="flex:1; padding:8px;background:#8e44ad;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-right:4px;">设置管理</button>
                   <button id="cancelManagerBtn" style="flex:1; padding:8px;background:#c0392b;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-left:4px;">取消管理</button>
                   <button id="setAllPermissionsBtn" style="flex:1; padding:8px;background:#2ecc71;color:#fff;border:none;border-radius:4px;cursor:pointer;">设置全部权限</button>
                   <button id="setVIPBtn" style="flex:1; padding:8px;background:#8e44ad;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-right:4px;">设置贵宾</button>
                   <button id="cancelVIPBtn" style="flex:1; padding:8px;background:#c0392b;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-left:4px;">取消贵宾</button>
                </div>
              </div>
              <hr style="border:none;border-top:1px solid #e0e6ed;margin:8px 0;" />
              <div id="creditSection" style="display:none;">
                <button id="loadLeagueClubsBtn" style="width:100%;padding:8px;background:#c0392b;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-bottom:12px;">加载俱乐部联盟信息</button>
                <div id="hostLeagueInfoSection" style="display:none;margin-bottom:12px;">
                  <label style="font-size:14px;">主机联盟信息:(切换俱乐部不生效刷新浏览器即可)</label>
                  <div id="hostLeagueInfo" style="margin-top:8px;padding:8px;background:#f5f5f5;border:1px solid #ddd; user-select: text;"></div>
                </div>
                <div style="margin-bottom:8px;display:flex;align-items:center;">
                    <label style="font-size:14px;">加联盟币数量:</label>
                    <input id="leagueCreditAmount" type="number" value="5001000" style="width:80px;padding:6px;border:1px solid #ccd0d5;border-radius:4px;margin-left:8px;" />
                </div>
                <div style="margin-bottom:12px; max-height: 120px; overflow-y: auto;">
                  <table id="leagueClubTable" style="width:100%; border-collapse: collapse;">
                    <thead>
                      <tr>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;"><input type="checkbox" id="selectAllLeagueClubs" /></th>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;">是否主机</th>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;">俱乐部名称</th>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;">俱乐部ID</th>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;">余额</th>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;">状态</th>
                      </tr>
                    </thead>
                    <tbody id="leagueClubList"></tbody>
                  </table>
                </div>
                <button id="addLeagueClubCreditBtn" style="width:100%;padding:8px;background:#8e44ad;color:#fff;border:none;border-radius:4px;cursor:pointer; margin-bottom: 8px;">批量勾选给附属俱乐部加联盟币</button>
                <div id="leagueClubActionButtons" style="display:flex; gap: 8px; margin-top: 8px;">
                   <button id="freezeLeagueClubBtn" style="flex:1; padding:8px;background:#f39c12;color:#fff;border:none;border-radius:4px;cursor:pointer;">冻结选中</button>
                   <button id="unfreezeLeagueClubBtn" style="flex:1; padding:8px;background:#2ecc71;color:#fff;border:none;border-radius:4px;cursor:pointer;">解冻选中</button>
                   <button id="kickLeagueClubBtn" style="flex:1; padding:8px;background:#c0392b;color:#fff;border:none;border-radius:4px;cursor:pointer;">踢出选中</button>
                </div>
              </div>
              <button id="loadApplicationsBtn" style="width:100%;padding:8px;background:#3498db;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-top:12px;">加载入会审核申请</button>
              <div id="applySection" style="display:none;margin-bottom:12px;">
                <div style="margin-bottom:8px;display:flex;align-items:center;">
                    <label style="font-size:14px;">操作:</label>
                    <button id="agreeApplicationsBtn" style="margin-left:8px;padding:6px 12px;background:#2ecc71;color:#fff;border:none;border-radius:4px;cursor:pointer;">同意选中申请</button>
                </div>
                <div style="margin-bottom:12px; max-height: 120px; overflow-y: auto;">
                  <table id="applicationTable" style="width:100%; border-collapse: collapse;">
                    <thead>
                      <tr>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;"><input type="checkbox" id="selectAllApplications" /></th>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;">UUID</th>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;">showID</th>
                        <th style="border:1px solid #ccc; padding:4px;">昵称</th>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;">申请时间</th>
                      </tr>
                    </thead>
                    <tbody id="applicationList"></tbody>
                  </table>
                </div>
              </div>
              <hr style="border:none;border-top:2px solid #1abc9c;margin:16px 0;" />
              <div id="advancedJokerSection" style="display:none;">
                <div style="margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                    <label style="font-size:14px; flex-shrink:0;">小丑游戏名:</label>
                    <input id="jokerGameNameInput" type="text" placeholder="输入游戏名" style="flex-grow:1;padding:6px;border:1px solid #ccd0d5;border-radius:4px;" />
                    <button id="setJokerGameNameBtn" style="padding:6px 12px;background:#16a085;color:#fff;border:none;border-radius:4px;cursor:pointer;">设置</button>
                </div>

                <button id="loadJokerClubsBtn" style="width:100%;padding:8px;background:#f39c12;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-bottom:12px;">获取小丑附属俱乐部</button>
                <div id="jokerGameInfo" style="display:none; margin-bottom:12px; padding:8px; background:#fffbe6; border:1px solid #ffe58f; user-select: text;"></div>
                <div id="jokerClubsSection" style="display:none;margin-bottom:12px; max-height: 150px; overflow-y: auto;">
                  <table id="jokerClubTable" style="width:100%; border-collapse: collapse;">
                    <thead>
                      <tr>
                        <th style="border:1px solid #ccc; padding:4px;">俱乐部名称</th>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;">俱乐部ID</th>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;">状态</th>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;">返点比例%</th>
                        <th style="border:1px solid #ccc; padding:4px; text-align:center;">操作</th>
                      </tr>
                    </thead>
                    <tbody id="jokerClubList"></tbody>
                  </table>
                </div>

                <button id="loadJpPoolBtn" style="width:100%;padding:8px;background:#16a085;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-bottom:12px;">获取JP池信息</button>
                <div id="jpPoolInfo" style="display:none;margin-top:8px;padding:8px;background:#f0f9f8;border:1px solid #1abc9c; user-select: text; margin-bottom:12px;"></div>

                <button id="loadVIPListBtn" style="width:100%;padding:8px;background:#16a085;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-top:12px;">获取贵宾列表</button>
                <div id="vipListSection" style="display:none;margin-top:12px;"></div>
              </div>
                          <button id="assignAgentBtn" style="width:100%;padding:8px;background:#8e44ad;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-top:12px;">分配贵宾代理</button>
            <div id="memberAgentSection" style="display:none;margin-top:12px;">
                <h3 style="margin-top:0;">成员与贵宾代理管理</h3>
                <div style="display:flex;gap:20px;">
                    <div style="flex:1;border:1px solid #e0e6ed;border-radius:4px;overflow:hidden;">
                        <div style="background:#f5f7fa;padding:8px;font-weight:bold;">
                            <table style="width:100%;border-collapse:collapse;">
                                <thead>
                                    <tr style="background-color: #1e88e5; color: white;">
                                        <th style="border:1px solid #ddd;padding:1px;text-align:left;"><input type="checkbox" id="selectAllMembersForAgent" /></th>
                                        <th style="border:1px solid #ddd;padding:22px;text-align:left;">昵称</th>
                                        <th style="border:1px solid #ddd;padding:5px;text-align:left;">showId</th>
                                        <th style="border:1px solid #ddd;padding:6px;text-align:left;">所属贵宾</th>
                                    </tr>
                                </thead>
                                <tbody id="membersForAgentListBodyContent">
                                </tbody>
                            </table>
                        </div>
                        <div style="max-height:200px;overflow-y:auto;padding:8px;" id="memberAgentListBody">
                            <table style="width:100%;border-collapse:collapse;">
                                <tbody id="membersForAgentListBodyContent2">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div style="flex:1;border:1px solid #e0e6ed;border-radius:4px;overflow:hidden;">
                        <div style="background:#f5f7fa;padding:8px;font-weight:bold;">
                            <div>选择的贵宾列表</div>
                            <select id="agentForMembersList" style="width:100%;padding:6px;margin-top:6px;border-radius:4px;border:1px solid #ddd; height: 80px; background-color: #e3f2fd;">
                            </select>
                        </div>
                    </div>
                </div>
                <div style="margin-top:12px;">
                    <button id="assignMembersToAgentBtn" style="padding:8px 16px;background:#27ae60;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-right:10px;">分配选中成员给选中贵宾</button>
                    <button id="setNoAgentForMembersBtn" style="padding:8px 16px;background:#c0392b;color:#fff;border:none;border-radius:4px;cursor:pointer;">设置选中成员为无贵宾</button>
                </div>
            </div>
              <div style="text-align:center; margin-top:15px; padding-top:10px; border-top:2px solid #FFD700; color:#FFD700; font-size:22px;">
                by测试组@Steven
              </div>
            </div>`;

        // 在面板中添加分配贵宾代理的按钮和隐藏区域
        panel.innerHTML += `

        `;

        document.body.appendChild(panel);

        const widthButtons = panel.querySelectorAll('.widthBtn');
        widthButtons.forEach(button => {
            button.addEventListener('click', () => {
                const newWidth = button.getAttribute('data-width');
                panel.style.width = `${newWidth}px`;
                localStorage.setItem('panelWidth', newWidth);
                widthButtons.forEach(btn => {
                    btn.style.background = '';
                    btn.style.color = '';
                });
                button.style.background = '#4169E1';
                button.style.color = 'white';
            });
        });

        const collapseBtn = panel.querySelector('#collapseBtn');
        const bodyElem = panel.querySelector('#panelBody');
        const topSectionElem = panel.querySelector('#panelTopSection');
        collapseBtn.onclick = () => {
            const hidden = bodyElem.style.display === 'none';
            if (hidden) {
                bodyElem.style.display = 'block';
                topSectionElem.querySelector('#widthControls').style.display = 'flex';
                collapseBtn.textContent = '折叠−';
                collapseBtn.style = 'border:none;background:none;cursor:pointer;font-size:22px;';
            } else {
                bodyElem.style.display = 'none';
                topSectionElem.querySelector('#widthControls').style.display = 'none';
                collapseBtn.textContent = COLLAPSED_CONFIG.text;
                Object.assign(collapseBtn.style, {
                    width: `${COLLAPSED_CONFIG.size}px`, height: `${COLLAPSED_CONFIG.size}px`,
                    borderRadius: '50%', background: COLLAPSED_CONFIG.bgColor, color: COLLAPSED_CONFIG.textColor,
                    fontSize: COLLAPSED_CONFIG.fontSize, fontFamily: COLLAPSED_CONFIG.fontFamily,
                    border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                });
            }
        };

        const currentUrl = window.location.href;
        if (!currentUrl.includes('index.html')) {
            collapseBtn.click();
        }

        let scale = 1;
        panel.querySelector('#panelHeader').ondblclick = () => {
            scale = scale === 1 ? 1.2 : 1;
            panel.style.transform = `scale(${scale})`;
        };

        const hdr = panel.querySelector('#panelHeader');
        hdr.onmousedown = e => {
            e.preventDefault();
            const rect = panel.getBoundingClientRect();
            const dx = e.clientX - rect.left, dy = e.clientY - rect.top;
            const move = ev => {
                panel.style.left = ev.clientX - dx + 'px';
                panel.style.top = ev.clientY - dy + 'px';
                panel.style.right = 'auto';
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', () => document.removeEventListener('mousemove', move), { once: true });
        };

        function getToken() {
            const manual = panel.querySelector('#cmsTokenInput').value.trim();
            return manual || autoToken;
        }

        async function sendPost(path, body) {
            const token = getToken();
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/javascript'
            };
            token && (headers.token = token);

            let fullPath;
            let credentials = 'include';
            if (host.includes('cms-web.lunarsphere.xyz')|| host.includes('cms.8z3i7.lunarsphere.xyz')|| host.includes('cms-web.nuvankerder.com')|| host.includes('cms-web-stg.nuvankerder.com')) {
                fullPath = API + '//' + path.substring(1);
                credentials = 'omit';
            } else {
                fullPath = API + path;
            }

            const res = await fetch(fullPath, {
                method: 'POST', mode: 'cors', credentials:'omit',
                headers, referrer: location.origin + '/', referrerPolicy: 'strict-origin-when-cross-origin', body
            });

            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                try { return await res.json(); }
                catch { console.warn('[CMS Panel] JSON 解析失败'); }
            }
            return { code: res.status };
        }

        const leagueCache = {};
        function getLeagueId(clubId) {
            if (leagueCache[clubId]) return leagueCache[clubId];
            const xhr = new XMLHttpRequest();
            let path = '/cms-api/club/clubInfo';
            xhr.open('POST', API + path, false);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            const tk = getToken();
            tk && xhr.setRequestHeader('token', tk);
            xhr.send(`clubId=${clubId}`);
            try {
                const r = JSON.parse(xhr.responseText);
                return leagueCache[clubId] = r.result.iCreditLeagueId;
            } catch { return ''; }
        }

        if (initialLoad) {
            const tokenDiv = document.querySelector('.tokenVal');
            if (tokenDiv && tokenDiv.textContent.trim()) {
                autoToken = tokenDiv.textContent.trim();
                localStorage.setItem('cmsToken', autoToken);
                console.log('[CMS Panel] 从页面DOM提取 token:', autoToken);
                initialLoad = false;
            }
        }
        if (currentUrl.includes('index.html')) {
            const tokenDiv = document.querySelector('.tokenVal');
            if (tokenDiv && tokenDiv.textContent.trim()) {
                autoToken = tokenDiv.textContent.trim();
                localStorage.setItem('cmsToken', autoToken);
                console.log('[CMS Panel] 从页面DOM提取 token:', autoToken);
            }
        } else if (!currentUrl.includes('cmsLogin.html')) {
            const savedToken = localStorage.getItem('cmsToken');
            if (savedToken) {
                autoToken = savedToken;
                const input = panel.querySelector('#cmsTokenInput');
                if (input) input.value = autoToken;
                console.log('[CMS Panel] 从 localStorage 读取 token:', autoToken);
            }
        }
        panel.querySelector('#loadClubsBtn').onclick = async () => {
            showFloatTip('俱乐部列表获取成功');
            const json = await sendPost('/cms-api/club/getClubList', null);
            if (currentUrl.includes('index.html')) {
                const tokenDiv = document.querySelector('.tokenVal');
                if (tokenDiv && tokenDiv.textContent.trim()) {
                    autoToken = tokenDiv.textContent.trim();
                    localStorage.setItem('cmsToken', autoToken);
                    console.log('[CMS Panel] 从页面DOM提取 token:', autoToken);
                }
            } else if (!currentUrl.includes('cmsLogin.html')) {
                const savedToken = localStorage.getItem('cmsToken');
                if (savedToken) {
                    autoToken = savedToken;
                    const input = panel.querySelector('#cmsTokenInput');
                    if (input) input.value = autoToken;
                    console.log('[CMS Panel] 从 localStorage 读取 token:', autoToken);
                }
            }

            //const json = await sendPost('/cms-api/club/getClubList', null);
            if (json.iErrCode !== 0) return showFloatTip('加载俱乐部失败: ' + json.iErrCode);
            const sel = panel.querySelector('#clubSelect'); sel.innerHTML = '';
            json.result.forEach(c => sel.add(new Option(`${c.sClubName}（俱乐部ID：${c.lClubID}） 成员数:${c.iCurMembers}  -  管理员:${c.iCurManageMembers}/${c.iMaxManageMembers}`, c.lClubID)));
            panel.querySelector('#clubSection').style.display = 'block';
            panel.querySelector('#jokerSection').style.display = 'flex';
            panel.querySelector('#creditSection').style.display = 'block';
            panel.querySelector('#advancedJokerSection').style.display = 'block';
            panel.querySelector('#freeCheckSection').style.display = 'flex';

            localStorage.setItem('cmsClubs', JSON.stringify(json.result));
            cachedClubs = json.result;

            //setTimeout(() => { panel.querySelector('#loadLeagueClubsBtn').click(); }, 1000);
            //setTimeout(() => { panel.querySelector('#loadMembersBtn').click(); }, 1000);

        };
        if (!currentUrl.includes('index.html') && !currentUrl.includes('cmsLogin.html')) {
            const savedClubs = localStorage.getItem('cmsClubs');
            if (savedClubs) {
                const clubs = JSON.parse(savedClubs);
                const sel = panel.querySelector('#clubSelect'); sel.innerHTML = '';
                clubs.forEach(c => sel.add(new Option(`${c.sClubName}（俱乐部ID：${c.lClubID}） 成员数:${c.iCurMembers}  -  管理员:${c.iCurManageMembers}/${c.iMaxManageMembers}`, c.lClubID)));
                panel.querySelector('#clubSection').style.display = 'block';
                panel.querySelector('#jokerSection').style.display = 'flex';
                panel.querySelector('#creditSection').style.display = 'block';
                panel.querySelector('#advancedJokerSection').style.display = 'block';
                panel.querySelector('#freeCheckSection').style.display = 'flex';
                cachedClubs = clubs;
                console.log('[CMS Panel546] 从 localStorage 读取俱乐部信息');
            }
        }

        if (initialLoad && cachedClubs === null) {
            const savedClubs = localStorage.getItem('cmsClubs');
            if (savedClubs) {
                const clubs = JSON.parse(savedClubs);
                panel.querySelector('#clubSection').style.display = 'block';
                panel.querySelector('#jokerSection').style.display = 'flex';
                panel.querySelector('#creditSection').style.display = 'block';
                panel.querySelector('#advancedJokerSection').style.display = 'block';
                panel.querySelector('#freeCheckSection').style.display = 'flex';
                const sel = panel.querySelector('#clubSelect'); sel.innerHTML = '';
                clubs.forEach(c => sel.add(new Option(`${c.sClubName}（俱乐部ID：${c.lClubID}） 成员数:${c.iCurMembers}  -  管理员:${c.iCurManageMembers}/${c.iMaxManageMembers}`, c.lClubID)));
                cachedClubs = clubs;
                initialLoad = false;
            }
        }

        const isSuccessfulResponse = (r) => r?.iErrCode === 0;

       /* === clubSelect 双击复制俱乐部 ID + 蓝色加粗俱乐部 ID === */
function enhanceClubSelect() {
  const sel = document.getElementById('clubSelect');
  if (!sel) return;



  // 2. 双击复制俱乐部 ID
  sel.addEventListener('dblclick', () => {
    const val = sel.value;
    if (!val) return;
    navigator.clipboard.writeText(val)
      .then(() => showFloatTip(`已复制俱乐部ID：${val}`, '#4caf50'))
      .catch(() => showFloatTip('复制失败，请手动复制', '#f44336'));
  });
}

/* 在页面加载完成后执行 */
onReady(enhanceClubSelect);

        panel.querySelector('#enableJokerBtn').onclick = async () => {
            const cid = panel.querySelector('#clubSelect').value;
            const lid = getLeagueId(cid);
            if (!lid) return showFloatTip('该俱乐部无超级联盟，无法获取联盟ID', '#f44336');
            const r = await sendPost('/cms-api/superleague/crazyjokersetting/setclubgamestatus', `clubId=0&leagueId=${lid}&status=2`);
            showFloatTip(r.iErrCode === 0 ? '启用小丑成功' : `启用失败（无权限或未开启）(${r.iErrCode})`, '#f44336');
        };
        panel.querySelector('#disableJokerBtn').onclick = async () => {
            const cid = panel.querySelector('#clubSelect').value;
            const lid = getLeagueId(cid);
            if (!lid) return showFloatTip('该俱乐部无超级联盟，无法获取联盟ID', '#f44336');
            const r = await sendPost('/cms-api/superleague/crazyjokersetting/setclubgamestatus', `clubId=0&leagueId=${lid}&status=1`);
            showFloatTip(r.iErrCode === 0 ? '禁用小丑成功' : `禁用失败（无权限或未开启）(${r.iErrCode})`, '#f44336');
        };

        // 开启俱乐部免审核
panel.querySelector('#enableFreeCheckBtn').onclick = async () => {
    const cid = panel.querySelector('#clubSelect').value;
    if (!cid) return showFloatTip('请先选择俱乐部', '#f44336');

    const r = await sendPost('/cms-api/club/acceptApply', `freeCheck=1&clubId=${cid}`);
    if (r && r.iErrCode === 0) {
        showFloatTip('开启免审核成功', '#4caf50');
    } else {
        showFloatTip(`开启免审核失败${r ? ' (' + r.iErrCode + ')' : ''}`, '#f44336');
    }
};

// 关闭俱乐部免审核
panel.querySelector('#disableFreeCheckBtn').onclick = async () => {
    const cid = panel.querySelector('#clubSelect').value;
    if (!cid) return showFloatTip('请先选择俱乐部', '#f44336');

    const r = await sendPost('/cms-api/club/acceptApply', `freeCheck=0&clubId=${cid}`);
    if (r && r.iErrCode === 0) {
        showFloatTip('关闭免审核成功', '#4caf50');
    } else {
        showFloatTip(`关闭免审核失败${r ? ' (' + r.iErrCode + ')' : ''}`, '#f44336');
    }
};

        panel.querySelector('#loadMembersBtn').onclick = async () => {

            const cid = panel.querySelector('#clubSelect').value;
            const lid = getLeagueId(cid);
            setTimeout(() => { panel.querySelector('#loadLeagueClubsBtn').click(); }, 500);

            //if (!lid) return showFloatTip('该俱乐部无超级联盟，无法获取联盟ID', '#f44336');
            const memberActionButtons = panel.querySelector('#membersSection > div:last-child');


            const json = await sendPost('/cms-api/club/getClubMemberList', `clubId=${cid}&sort=-1&keyword=&pageNumber=1&pageSize=1000`);

            const memberList = panel.querySelector('#memberList');

            const memberClubIdDisplay = panel.querySelector('#memberClubIdDisplay');
            if (memberClubIdDisplay) {
                memberClubIdDisplay.textContent = `当前俱乐部ID: ${cid}`;
            }
            // 🆕 获取并展示钻石基金
    try {
        const clubInfoRes = await sendPost('/cms-api/club/clubInfo', `clubId=${cid}`);
        if (isSuccessfulResponse(clubInfoRes) && clubInfoRes.result) {
            const diamondFund = clubInfoRes.result.lDiamond || 0;
            // 把【当前俱乐部ID】文字后面追加绿色钻石基金
            const idDisplay = panel.querySelector('#memberClubIdDisplay');
            idDisplay.innerHTML = `当前俱乐部ID: ${cid} | <span style="color:#00c853;font-weight:bold;">钻石基金: ${diamondFund}</span>`;
        }
    } catch (e) {
        console.error('获取钻石基金失败', e);
    }

            memberList.innerHTML = '<tr><td colspan="6" style="text-align:center;">加载中...</td></tr>';
            try {
                //const json = await sendPost('/cms-api/club/getClubMemberList', `clubId=${cid}&sort=-1&keyword=&pageNumber=1&pageSize=1000`);


                if (!isSuccessfulResponse(json)) {
                    memberList.innerHTML = `<tr><td colspan="6" style="text-align:center;">加载失败: ${json.iErrCode}</td></tr>`;
                    return;
                }



                // 设置管理按钮点击事件
panel.querySelector('#setManagerBtn').onclick = async () => {
    const cid = panel.querySelector('#clubSelect').value;
    const checkboxes = panel.querySelectorAll('#memberList .memberCheck:checked');
    if (checkboxes.length === 0) return showFloatTip('请至少选择一个成员', '#f44336');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < checkboxes.length; i++) {
        const cb = checkboxes[i];
        const uuid = cb.getAttribute('data-uuid');
        const showId = cb.getAttribute('data-showid');

        try {
            const r = await sendPost('/cms-api/club/addClubManager', `clubId=${cid}&uuid=${uuid}`);
            if (isSuccessfulResponse(r)) {
                successCount++;
                // 更新表格显示（可选）
                const row = cb.closest('tr');
                const roleCell = row.querySelector('td:nth-child(2)');
                roleCell.innerHTML = '<span style="color:blue; font-weight:bold;">管理</span>';
            } else {
                errorCount++;
                console.error(`设置管理失败(${showId}):`, r);
            }
        } catch (e) {
            errorCount++;
            console.error(`设置管理出错(${showId}):`, e);
        }

        if (i < checkboxes.length - 1) {
            await new Promise(res => setTimeout(res, 6200));
        }
    }

    showFloatTip(`操作完成！成功: ${successCount} 个, 失败: ${errorCount} 个`);
                panel.querySelector('#loadMembersBtn').click();

};

// 取消管理按钮点击事件
panel.querySelector('#cancelManagerBtn').onclick = async () => {
    const cid = panel.querySelector('#clubSelect').value;
    const checkboxes = panel.querySelectorAll('#memberList .memberCheck:checked');
    if (checkboxes.length === 0) return showFloatTip('请至少选择一个成员', '#f44336');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < checkboxes.length; i++) {
        const cb = checkboxes[i];
        const showId = cb.getAttribute('data-showid');

        try {
            const r = await sendPost('/cms-api/club/deleteClubManager', `clubId=${cid}&showid=${showId}`);
            if (isSuccessfulResponse(r)) {
                successCount++;
                // 更新表格显示（可选）
                const row = cb.closest('tr');
                const roleCell = row.querySelector('td:nth-child(2)');
                roleCell.innerHTML = '成员';
            } else {
                errorCount++;
                console.error(`取消管理失败(${showId}):`, r);
            }
        } catch (e) {
            errorCount++;
            console.error(`取消管理出错(${showId}):`, e);
        }

        if (i < checkboxes.length - 1) {
            await new Promise(res => setTimeout(res, 6200));
        }
    }

    showFloatTip(`操作完成！成功: ${successCount} 个, 失败: ${errorCount} 个`);
            panel.querySelector('#loadMembersBtn').click();

};

// 设置全部权限按钮点击事件
panel.querySelector('#setAllPermissionsBtn').onclick = async () => {
    const cid = panel.querySelector('#clubSelect').value;
    const checkboxes = panel.querySelectorAll('#memberList .memberCheck:checked');
    if (checkboxes.length === 0) return showFloatTip('请至少选择一个成员', '#f44336');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < checkboxes.length; i++) {
        const cb = checkboxes[i];
        const showId = cb.getAttribute('data-showid');
        const pemissionStr = '1%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1%2C1';

        try {
            const r = await sendPost('/cms-api/club/grantManagerPermision', `showId=${showId}&pemissionStr=${pemissionStr}`);
            if (isSuccessfulResponse(r)) {
                successCount++;
            } else {
                errorCount++;
                console.error(`设置权限失败(${showId}):`, r);
            }
        } catch (e) {
            errorCount++;
            console.error(`设置权限出错(${showId}):`, e);
        }

        if (i < checkboxes.length - 1) {
            await new Promise(res => setTimeout(res, 6200));
        }
    }

    showFloatTip(`权限设置完成！成功: ${successCount} 个, 失败: ${errorCount} 个`);
                panel.querySelector('#loadMembersBtn').click();

};

// 设置贵宾按钮点击事件
panel.querySelector('#setVIPBtn').onclick = async () => {
    const cid = panel.querySelector('#clubSelect').value;
    const checkboxes = panel.querySelectorAll('#memberList .memberCheck:checked');
    if (checkboxes.length === 0) return showFloatTip('请至少选择一个成员', '#f44336');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < checkboxes.length; i++) {
        const cb = checkboxes[i];
        const showId = cb.getAttribute('data-showid');

        try {
            const r = await sendPost('/cms-api/agent/setUserAgent', `showId=${showId}`);
            if (isSuccessfulResponse(r)) {
                successCount++;
            } else {
                errorCount++;
                console.error(`设置贵宾失败(${showId}):`, r);
            }
        } catch (e) {
            errorCount++;
            console.error(`设置贵宾出错(${showId}):`, e);
        }

        if (i < checkboxes.length - 1) {
            await new Promise(res => setTimeout(res, 6200));
        }
    }

    showFloatTip(`操作完成！成功: ${successCount} 个, 失败: ${errorCount} 个`);
                panel.querySelector('#loadMembersBtn').click();

};

// 取消贵宾按钮点击事件
panel.querySelector('#cancelVIPBtn').onclick = async () => {
    const cid = panel.querySelector('#clubSelect').value;
    const checkboxes = panel.querySelectorAll('#memberList .memberCheck:checked');
    if (checkboxes.length === 0) return showFloatTip('请至少选择一个成员', '#f44336');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < checkboxes.length; i++) {
        const cb = checkboxes[i];
        const showId = cb.getAttribute('data-showid');

        try {
            const r = await sendPost('/cms-api/agent/deteleAgent', `showId=${showId}`);
            if (isSuccessfulResponse(r)) {
                successCount++;
            } else {
                errorCount++;
                console.error(`取消贵宾失败(${showId}):`, r);
            }
        } catch (e) {
            errorCount++;
            console.error(`取消贵宾出错(${showId}):`, e);
        }

        if (i < checkboxes.length - 1) {
            await new Promise(res => setTimeout(res, 6200));
        }
    }

    showFloatTip(`操作完成！成功: ${successCount} 个, 失败: ${errorCount} 个`);
                panel.querySelector('#loadMembersBtn').click();

};
// 在 panel.querySelector('#cancelVIPBtn').onclick 之后添加以下代码：

// 解封管理员按钮点击事件
panel.querySelector('#unlockManagerBtn').onclick = async () => {
    const cid = panel.querySelector('#clubSelect').value;
    const checkboxes = panel.querySelectorAll('#memberList .memberCheck:checked');

    // 获取输入框的showid
    const inputShowId = panel.querySelector('#unlockManagerShowIdInput').value.trim();

    // 如果没有勾选也没有输入showid，提示并返回
    if (checkboxes.length === 0 && !inputShowId) {
        return showFloatTip('请勾选要解封的管理员或输入showID', '#f44336');
    }

    let showIdsToUnlock = [];

    // 处理勾选的管理员
    if (checkboxes.length > 0) {
        // 筛选出管理员（userClubLevel为2）
        const managerCheckboxes = Array.from(checkboxes).filter(cb => cb.getAttribute('data-level') === '2');
        if (managerCheckboxes.length === 0) {
            return showFloatTip('请勾选管理员角色的用户', '#f44336');
        }
        showIdsToUnlock = managerCheckboxes.map(cb => cb.getAttribute('data-showid'));
    }

    // 处理输入的showid
    if (inputShowId) {
        // 验证showid格式（纯数字）
        if (!/^\d+$/.test(inputShowId)) {
            return showFloatTip('showID格式不正确，请输入纯数字', '#f44336');
        }
        showIdsToUnlock.push(inputShowId);
    }

    // 去重
    showIdsToUnlock = [...new Set(showIdsToUnlock)];

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < showIdsToUnlock.length; i++) {
        const showId = showIdsToUnlock[i];

        try {
            const r = await sendPost('/cms-api/club/unlockClubManager', `showid=${showId}`);
            if (isSuccessfulResponse(r)) {
                successCount++;
                showFloatTip(`解封管理员 ${showId} 成功`, '#4caf50');
            } else {
                errorCount++;
                console.error(`解封管理员 ${showId} 失败:`, r);
                showFloatTip(`解封管理员 ${showId} 失败: ${r.iErrCode}`, '#f44336');
            }
        } catch (e) {
            errorCount++;
            console.error(`解封管理员 ${showId} 出错:`, e);
            showFloatTip(`解封管理员 ${showId} 出错`, '#f44336');
        }

        // 批量操作时添加延迟
        if (showIdsToUnlock.length > 1 && i < showIdsToUnlock.length - 1) {
            await new Promise(res => setTimeout(res, 6200));
        }
    }

    showFloatTip(`解封完成！成功: ${successCount} 个, 失败: ${errorCount} 个`);

    // 清空输入框
    panel.querySelector('#unlockManagerShowIdInput').value = '';

    // 刷新成员列表
    panel.querySelector('#loadMembersBtn').click();
};

                const list = json.result?.list || [];


        // 按角色排序（群主-管理-成员），其次按联盟币余额排序（降序）
        list.sort((a, b) => {
            // 定义角色优先级：群主 > 管理 > 成员
            const rolePriority = { 1: 0, 2: 1, 4: 2 }; // 1: 群主, 2: 管理, 4: 成员
            const roleDiff = rolePriority[a.userClubLevel] - rolePriority[b.userClubLevel];
            if (roleDiff !== 0) return roleDiff;

            // 如果角色相同，则按联盟币余额降序排序
            return b.balance - a.balance;
        });

                memberList.innerHTML = '';
/*************  搜索框 + 清空按钮  *************/
const wrapper = document.getElementById('memberSearchBoxWrapper');
wrapper.innerHTML = `
  <div style="display:flex;gap:6px;">
    <input id="memberSearchInput" type="text" placeholder="输入 UUID / ShowID / 昵称 模糊搜索"
           style="flex:1;padding:6px;border:1px solid #ccd0d5;border-radius:4px;" />
    <button id="btnClearSearch" style="padding:6px 12px;background:#e53935;color:#fff;border:none;border-radius:4px;cursor:pointer;">清空</button>
  </div>
`;

/* 统一的事件处理函数 */
function doFilter() {
  const kw = document.getElementById('memberSearchInput').value.trim().toLowerCase();
  document.querySelectorAll('#memberList tr').forEach(tr => {
    const txt = [tr.dataset.uuid, tr.dataset.showid, tr.dataset.nick].join('|').toLowerCase();
    tr.style.display = txt.includes(kw) ? '' : 'none';
  });
}

/* 实时搜索 + 清空后重新触发 */
wrapper.querySelector('#memberSearchInput').addEventListener('input', doFilter);
wrapper.querySelector('#btnClearSearch').addEventListener('click', () => {
  wrapper.querySelector('#memberSearchInput').value = '';
  doFilter();          // 手动触发一次过滤，解决“清空不生效”问题
});
/*************  结束  *************/
                list.forEach(member => {
                    const row = document.createElement('tr');
                    let roleText;
                    switch(member.userClubLevel) {
                        case 1: roleText = '<span style="color:red; font-weight:bold;">群主</span>'; break;
                        case 2: roleText = '<span style="color:blue;">管理</span>'; break;
                        default: roleText = '成员'; break;
                    }
row.innerHTML = `
  <td style="border:1px solid #ccc; text-align:center;">
    <input type="checkbox" class="memberCheck" data-uuid="${member.uuid}" data-showid="${member.showId}" data-level="${member.userClubLevel}" />
  </td>
  <td style="border:1px solid #ccc; padding:4px; text-align:center;">${roleText}</td>
<td class="copyable" data-copy="${member.uuid}" style="border:1px solid #ccc;padding:4px;text-align:center;cursor:pointer;">${member.uuid}</td>
<td class="copyable" data-copy="${member.showId}" style="border:1px solid #ccc;padding:4px;text-align:center;cursor:pointer;">${member.showId}</td>
  <td style="border:1px solid #ccc; padding:4px;">${member.strNick}</td>
  <td style="border:1px solid #ccc; padding:4px; text-align:center;">${member.balance}</td>
  <!-- 新增钻石字段 -->
  <td style="border:1px solid #ccc; padding:4px; text-align:center;">${member.coin || 0}</td>
  <!-- 新增星币字段 -->
  <td style="border:1px solid #ccc; padding:4px; text-align:center;">${member.starCoin || 0}</td>
    <!-- 新增金币字段 -->
  <td style="border:1px solid #ccc; padding:4px; text-align:center;">${member.lPopularity || 0}</td>`;

// ✅ 勾选高亮当前行
const checkbox = row.querySelector('.memberCheck');
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    row.style.backgroundColor = '#56ccf2'; // 高亮黄色
  } else {
    row.style.backgroundColor = ''; // 恢复原色
  }
});
                    row.dataset.uuid   = member.uuid;
row.dataset.showid = member.showId;
row.dataset.nick   = member.strNick;
                    memberList.appendChild(row);
                    // 双击复制 UUID / showID
memberList.querySelectorAll('.copyable').forEach(cell => {
    cell.addEventListener('dblclick', () => {
        navigator.clipboard.writeText(cell.dataset.copy)
            .then(() => showFloatTip(`已复制：${cell.dataset.copy}`, '#4caf50'))
            .catch(() => showFloatTip('复制失败', '#f44336'));
    });
});
                });
panel.querySelector('#selectAllMembers').onchange = function() {
    memberList.querySelectorAll('.memberCheck').forEach(cb => {
        cb.checked = this.checked;
        const row = cb.closest('tr');
        if (this.checked) {
            row.style.backgroundColor = '#56ccf2'; // 高亮
        } else {
            row.style.backgroundColor = ''; // 恢复原色
        }
    });
};
                panel.querySelector('#membersSection').style.display = 'block';
            } catch (error) {
                console.error('加载成员信息出错:', error);
                memberList.innerHTML = `<tr><td colspan="6" style="text-align:center;">加载失败: 网络错误或链接不合法</td></tr>`;
                showFloatTip('加载成员信息失败，请检查网络或链接的合法性。', '#f44336');
            }
        };

        panel.querySelector('#addCreditBtn').onclick = async () => {
            const cid = panel.querySelector('#clubSelect').value;
            const amount = panel.querySelector('#creditAmount').value;
            const checkboxes = panel.querySelectorAll('#memberList .memberCheck:checked');
            if (checkboxes.length === 0) return showFloatTip('请至少选择一个成员', '#f44336');

            let successCount = 0;
            let errorCount = 0;

            for (let i = 0; i < checkboxes.length; i++) {
                const cb = checkboxes[i];
                const showId = cb.getAttribute('data-showid');
                let path = '/cms-api/leaguecredit/setPlayerCreditCoin';

                try {
                    const r = await sendPost(path, `showId=${showId}&clubId=${cid}&num=${amount}`);
                    if (isSuccessfulResponse(r)) {
                        showFloatTip(`给${showId}加币${amount}成功 ` );
                        showTopTip('接口限制每5秒请求一次，请耐心等待');
                        successCount++;
                    } else {
                        errorCount++;
                        console.error(`给成员 ${showId} 加币失败:`, r);
                        showTopTip(`给成员 ${showId} 加币失败:`);
                    }
                } catch (e) {
                    errorCount++;
                    console.error(`给成员 ${showId} 加币出错:`, e);
                }

                // 【OPTIMIZATION】Only wait if it's not the last request in the batch.
                if (i < checkboxes.length - 1) {
                    await new Promise(res => setTimeout(res, 6200));
                }
            }

            showFloatTip(`操作完成！成功: ${successCount} 个, 失败: ${errorCount} 个`);
            panel.querySelector('#loadMembersBtn').click();

        };

        panel.querySelector('#kickMembersBtn').onclick = async () => {
            const checkboxes = panel.querySelectorAll('#memberList .memberCheck:checked');
            if (checkboxes.length === 0) return showFloatTip('请至少选择一个成员', '#f44336');

            const membersToKick = Array.from(checkboxes).filter(cb => cb.getAttribute('data-level') == '4');

            if (membersToKick.length !== checkboxes.length) {
                if (!confirm(`只能踢出"成员"角色的用户。您选中了 ${checkboxes.length} 个用户，其中 ${membersToKick.length} 个是可踢出的成员。是否继续?`)) {
                    return;
                }
            }
            if (membersToKick.length === 0) return showFloatTip('您选择的用户中没有可踢出的成员。（如管理、群主等', '#f44336');


            let successCount = 0;
            let errorCount = 0;

            for (let i = 0; i < membersToKick.length; i++) {
                const cb = membersToKick[i];
                const uuid = cb.getAttribute('data-uuid');
                let path = '/cms-api/club/fire';

                try {
                    const r = await sendPost(path, `userUuid=${uuid}`);
                    if (isSuccessfulResponse(r)) {
                        showTopTip('接口限制每5秒请求一次，请耐心等待');
                        showFloatTip(`踢出用户uuid：${uuid} 成功 ` );
                        successCount++;
                         cb.closest('tr').style.backgroundColor = '#f8d7da'; // Visually mark as kicked
                    } else {
                        errorCount++;
                        console.error(`踢出用户 ${uuid} 失败:`, r);
                    }
                } catch (e) {
                    errorCount++;
                    console.error(`踢出用户 ${uuid} 出错:`, e);
                }

                if (membersToKick.length > 1 && i < membersToKick.length - 1) {
                    await new Promise(res => setTimeout(res, 6200));
                }
            }
            showFloatTip(`踢出操作完成！成功: ${successCount} 个, 失败: ${errorCount} 个`);
            panel.querySelector('#loadMembersBtn').click(); // Refresh list
        };
        panel.querySelector('#loadApplicationsBtn').onclick = async () => {
            setTimeout(() => { panel.querySelector('#loadLeagueClubsBtn').click(); }, 10);

            const cid = panel.querySelector('#clubSelect').value;
            const applicationList = panel.querySelector('#applicationList');
            applicationList.innerHTML = '<tr><td colspan="5" style="text-align:center;">加载中...</td></tr>';

            try {
                let path = '/cms-api/club/getApplyList';
                const json = await sendPost(path, `clubId=${cid}`);
                if (json.iErrCode !== 0) {
                    applicationList.innerHTML = `<tr><td colspan="5" style="text-align:center;">加载失败: ${json.iErrCode}</td></tr>`;
                    return;
                }
                const list = json.result || [];
                applicationList.innerHTML = '';
                list.forEach(apply => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border:1px solid #ccc; text-align:center;"><input type="checkbox" class="applicationCheck" data-uuid="${apply.uuid}" /></td>
                        <td style="border:1px solid #ccc; padding:4px; text-align:center;">${apply.uuid}</td>
                        <td style="border:1px solid #ccc; padding:4px; text-align:center;">${apply.showId}</td>
                        <td style="border:1px solid #ccc; padding:4px;">${apply.strNick}</td>
                        <td style="border:1px solid #ccc; padding:4px; text-align:center;">${new Date(apply.applyTime).toLocaleString()}</td>`;
                    applicationList.appendChild(row);
                });
                panel.querySelector('#selectAllApplications').onchange = function() {
                    applicationList.querySelectorAll('.applicationCheck').forEach(cb => cb.checked = this.checked);
                };
                panel.querySelector('#applySection').style.display = 'block';
            } catch (error) {
                console.error('加载申请信息出错:', error);
                applicationList.innerHTML = `<tr><td colspan="5" style="text-align:center;">加载失败: 网络错误或链接不合法</td></tr>`;
                showFloatTip('加载申请信息失败，请检查网络或链接的合法性。', '#f44336');
            }
        };
        panel.querySelector('#agreeApplicationsBtn').onclick = async () => {
            const cid = panel.querySelector('#clubSelect').value;
            const checkboxes = panel.querySelectorAll('#applicationList .applicationCheck:checked');
            if (checkboxes.length === 0) return showFloatTip('请至少选择一个申请', '#f44336');

            let successCount = 0;
            let errorCount = 0;

            for (let i = 0; i < checkboxes.length; i++) {
                const cb = checkboxes[i];
                const uuid = cb.getAttribute('data-uuid');
                let path = '/cms-api/club/acceptApply';

                try {
                    const r = await sendPost(path, `userUuid=${uuid}&clubId=${cid}`);
                    if (r.iErrCode === 0) {
                        successCount++;
                    } else {
                        errorCount++;
                        console.error(`同意申请 ${uuid} 失败:`, r);
                    }
                } catch (e) {
                    errorCount++;
                    console.error(`同意申请 ${uuid} 出错:`, e);
                }

                // 【OPTIMIZATION】Only wait if it's not the last request in the batch.
                if (i < checkboxes.length - 1) {
                    await new Promise(res => setTimeout(res, 6200));
                }
            }
            showFloatTip(`操作完成！成功: ${successCount} 个, 失败: ${errorCount} 个`);
        };

        panel.querySelector('#loadLeagueClubsBtn').onclick = async () => {
            const cid = panel.querySelector('#clubSelect').value;
            const lid = getLeagueId(cid);
            if (!lid) return showFloatTip('该俱乐部无超级联盟，无法获取联盟ID', '#f44336');

            const hostLeagueData = await sendPost('/cms-api/leaguecredit/getLeagueCreditBaseInfo', null);
            if (isSuccessfulResponse(hostLeagueData)) {
                const info = hostLeagueData.data;
                panel.querySelector('#hostLeagueInfo').innerHTML = `
                    <div style="margin: 5px 0;">
                        <div style="font-weight: bold; margin-bottom: 5px; user-select: text;">主机联盟信息</div>
                        <div style="font-size:14px; color: #2f80ed;font-weight: bold;user-select: text;">联盟ID: <span id="hostLeagueId" contenteditable="true">${info.leagueid}</span></div>
                        <div style="user-select: text;">名称: ${info.leagueName}</div>
                        <div style="user-select: text;">余额: ${info.creditBalance}</div>
                    </div>`;
                panel.querySelector('#hostLeagueInfoSection').style.display = 'block';
            }

            const tbody = panel.querySelector('#leagueClubList');
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">加载中...</td></tr>';
            const leagueClubs = [];
            for (let page = 1; ; page++) {
                const json = await sendPost('/cms-api/leaguecredit/getLeagueMermberCreditInfoList', `keyword=&order=1&pageNumber=${page}&pageSize=100`);
                if (!isSuccessfulResponse(json)) { showFloatTip('加载联盟俱乐部失败: ' + json.iErrCode); break; }
                const list = json.data?.list || [];
                if (list.length === 0) break;
                leagueClubs.push(...list);
                if (list.length < 100) break;
            }

            tbody.innerHTML = '';
            leagueClubs.forEach(club => {
                const row = document.createElement('tr');
                const statusText = club.creditStatus === 1 ? '<span style="color:red;">冻结</span>' : '<span style="color:green;">正常</span>';
                const isLeagueLordText = club.isLeagueLord === 0 ? '<span style="color:red;">附属俱乐部</span>' : '<span style="color:green;">主机俱乐部</span>';
                row.innerHTML = `
                    <td style="border:1px solid #ccc; text-align:center;"><input type="checkbox" class="leagueClubCheck" data-clubid="${club.clubId}" /></td>
                    <td style="border:1px solid #ccc; padding:4px;">${isLeagueLordText}</td>
                    <td style="border:1px solid #ccc; padding:4px;">${club.clubName}</td>
                    <td style="border:1px solid #ccc; padding:4px; text-align:center;">${club.clubId}</td>
                    <td style="border:1px solid #ccc; padding:4px; text-align:center;">${club.creditBalance}</td>
                    <td style="border:1px solid #ccc; padding:4px; text-align:center;">${statusText}</td>`;
                tbody.appendChild(row);
            });
            panel.querySelector('#selectAllLeagueClubs').onchange = function() {
                tbody.querySelectorAll('.leagueClubCheck').forEach(cb => cb.checked = this.checked);
            };
            panel.querySelector('#leagueClubActionButtons').style.display = 'flex';
        };

        panel.querySelector('#addLeagueClubCreditBtn').onclick = async () => {
            const amount = panel.querySelector('#leagueCreditAmount').value;
            const checkboxes = panel.querySelectorAll('#leagueClubList .leagueClubCheck:checked');
            if (checkboxes.length === 0) return showFloatTip('请至少选择一个俱乐部', '#f44336');

            const cid = panel.querySelector('#clubSelect').value;
            const lid = getLeagueId(cid);
            if (!lid) return showFloatTip('该俱乐部无超级联盟，无法获取联盟ID', '#f44336');

            let successCount = 0;
            let errorCount = 0;

            for (let i = 0; i < checkboxes.length; i++) {
                const cb = checkboxes[i];
                const clubId = cb.getAttribute('data-clubid');
                let path = '/cms-api/leaguecredit/setClubCreditCoin';

                try {
                    const r = await sendPost(path, `leagueId=${lid}&memberClubId=${clubId}&num=${amount}`);
                    if (isSuccessfulResponse(r)) {
                        successCount++;
                    } else {
                        errorCount++;
                        console.error(`给俱乐部 ${clubId} 加币失败:`, r);
                    }
                } catch (e) {
                    errorCount++;
                    console.error(`给俱乐部 ${clubId} 加币出错:`, e);
                }

                // 【OPTIMIZATION】Only wait if it's not the last request in the batch.
                if (i < checkboxes.length - 1) {
                    await new Promise(res => setTimeout(res, 6200));
                }
            }
            showFloatTip(`操作完成！成功: ${successCount} 个, 失败: ${errorCount} 个`);
            panel.querySelector('#loadLeagueClubsBtn').click(); // Refresh list

        };
        const handleLeagueClubAction = async (actionType) => {
            const checkboxes = panel.querySelectorAll('#leagueClubList .leagueClubCheck:checked');
            if (checkboxes.length === 0) return showFloatTip('请至少选择一个俱乐部', '#f44336');

            const cid = panel.querySelector('#clubSelect').value;
            const lid = getLeagueId(cid);
            if (!lid) return showFloatTip('该俱乐部无超级联盟，无法获取联盟ID', '#f44336');

            let path, bodyBuilder;
            switch(actionType) {
                case 'kick':
                    path = '/cms-api/leaguecredit/knickClubFromLeague';
                    bodyBuilder = (clubId) => `memberClubId=${clubId}&leagueId=${lid}`;
                    break;
                case 'freeze':
                    path = '/cms-api/leaguecredit/frozenClubFromCreditLeague';
                    bodyBuilder = (clubId) => `memberClubId=${clubId}&leagueId=${lid}&num=1`;
                    break;
                case 'unfreeze':
                    path = '/cms-api/leaguecredit/frozenClubFromCreditLeague';
                    bodyBuilder = (clubId) => `memberClubId=${clubId}&leagueId=${lid}&num=0`;
                    break;
                default:
                    return;
            }

            let successCount = 0;
            let errorCount = 0;
            for (let i = 0; i < checkboxes.length; i++) {
                const cb = checkboxes[i];
                const clubId = cb.getAttribute('data-clubid');
                try {
                    const r = await sendPost(path, bodyBuilder(clubId));
                    if (isSuccessfulResponse(r)) {
                        successCount++;
                    } else {
                        errorCount++;
                        console.error(`对俱乐部 ${clubId} 操作失败:`, r);
                    }
                } catch (e) {
                    errorCount++;
                    console.error(`对俱乐部 ${clubId} 操作出错:`, e);
                }

                if (checkboxes.length > 1 && i < checkboxes.length - 1) {
                    await new Promise(res => setTimeout(res, 6200));
                }
            }
            showFloatTip(`操作完成！成功: ${successCount} 个, 失败: ${errorCount} 个`);
            panel.querySelector('#loadLeagueClubsBtn').click(); // Refresh list
        };
        panel.querySelector('#kickLeagueClubBtn').onclick = () => handleLeagueClubAction('kick');
        panel.querySelector('#freezeLeagueClubBtn').onclick = () => handleLeagueClubAction('freeze');
        panel.querySelector('#unfreezeLeagueClubBtn').onclick = () => handleLeagueClubAction('unfreeze');

        panel.querySelector('#setJokerGameNameBtn').onclick = async () => {
            const cid = panel.querySelector('#clubSelect').value;
            const lid = getLeagueId(cid);
            if (!lid) return showFloatTip('该俱乐部无超级联盟，无法获取联盟ID', '#f44336');

            const gameNameInput = panel.querySelector('#jokerGameNameInput');
            const gameName = gameNameInput.value.trim();
            if (!gameName) return showFloatTip('请输入游戏名称', '#f44336');

            const path = '/cms-api/superleague/crazyjokersetting/setgamename';
            const body = `gameName=${encodeURIComponent(gameName)}&leagueId=${lid}`;
            const r = await sendPost(path, body);
            showFloatTip(isSuccessfulResponse(r) ? '设置成功' : `设置失败: ${r.iErrCode || '请求错误'}`);
        };

        panel.querySelector('#loadJpPoolBtn').onclick = async () => {
            const cid = panel.querySelector('#clubSelect').value;
            const lid = getLeagueId(cid);
            if (!lid) return showFloatTip('该俱乐部无超级联盟，无法获取联盟ID', '#f44336');
            const path = '/cms-api/superleague/crazyjokersetting/getjpinfo';
            const body = `leagueId=${lid}`;
            const jpInfoDiv = panel.querySelector('#jpPoolInfo');
            jpInfoDiv.style.display = 'block';
            jpInfoDiv.innerHTML = '加载中...';
            const json = await sendPost(path, body);
            if (isSuccessfulResponse(json) && json.result) {
                jpInfoDiv.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 5px;">JP 池信息</div>
                    <div><strong>JP1:</strong> ${json.result.jp1}</div>
                    <div><strong>JP2:</strong> ${json.result.jp2}</div>
                    <div><strong>JP3:</strong> ${json.result.jp3}</div>
                    <div><strong>JP4:</strong> ${json.result.jp4}</div>`;
            } else {
                jpInfoDiv.innerHTML = `加载JP池信息失败: ${json.iErrCode || '请求错误'}`;
            }
        };


        // 获取全部成员列表
        async function fetchMemberList() {
            const token = getToken();
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'token': token
            };
            const currentHost = location.hostname;
            let apiPath;
            if (currentHost.includes('cms.ayybyyy.com')) {
                apiPath = 'https://cmsapi3.qiucheng-wangluo.com';
            } else if (currentHost.includes('cms.yahhp.shop')) {
                apiPath = 'https://cms-api.yahhp.shop';
            } else if (currentHost.includes('cms-web.lunarsphere.xyz')) {
                apiPath = 'https://cms-distributed.lunarsphere.xyz:8081';
            } else if (currentHost.includes('d2pfu07omhbe26.cloudfront.net')) {
                apiPath = 'https://cms-api-direct.qiucheng-wangluo.com';
            } else if (currentHost.includes('cms.8z3i7.lunarsphere.xyz')) {
                apiPath = 'https://cms-distributed.lunarsphere.xyz:8082';
            }
             else if (host.includes('cms-web.nuvankerder.com')) {
        apiPath = 'https://cms-distributed.nuvankerder.com:8081';
    }
            else if (host.includes('cms-web-stg.nuvankerder.com')) {
        apiPath = 'https://cms-distributed-stg.nuvankerder.com:8081';
    }
            else {
                apiPath = API;
            }
            return await fetch(apiPath + '/cms-api/agent/getClubAllMemberList', {
                method: 'POST',
                headers: headers,
                body: 'keyWord='
            }).then(response => response.json());
        }

        // 获取贵宾列表
        async function fetchAgentList() {
            const token = getToken();
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'token': token
            };
            const currentHost = location.hostname;
            let apiPath;
            if (currentHost.includes('cms.ayybyyy.com')) {
                apiPath = 'https://cmsapi3.qiucheng-wangluo.com';
            } else if (currentHost.includes('cms.yahhp.shop')) {
                apiPath = 'https://cms-api.yahhp.shop';
            } else if (currentHost.includes('cms-web.lunarsphere.xyz')) {
                apiPath = 'https://cms-distributed.lunarsphere.xyz:8081';
            } else if (currentHost.includes('d2pfu07omhbe26.cloudfront.net')) {
                apiPath = 'https://cms-api-direct.qiucheng-wangluo.com';
            } else if (currentHost.includes('cms.8z3i7.lunarsphere.xyz')) {
                apiPath = 'https://cms-distributed.lunarsphere.xyz:8082';
            }
             else if (host.includes('cms-web.nuvankerder.com')) {
        apiPath = 'https://cms-distributed.nuvankerder.com:8081';
    }
            else if (host.includes('cms-web-stg.nuvankerder.com')) {
        apiPath = 'https://cms-distributed-stg.nuvankerder.com:8081';
    }
            else {
                apiPath = API;
            }
            return await fetch(apiPath + '/cms-api/agent/getClubAllAgentList', {
                method: 'POST',
                headers: headers,
                body: 'keyWord='
            }).then(response => response.json());
        }

        // 成员分配给贵宾代理
        async function assignMembersToAgent(assignInfo) {
            const token = getToken();
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'token': token
            };
            const currentHost = location.hostname;
            let apiPath;
            if (currentHost.includes('cms.ayybyyy.com')) {
                apiPath = 'https://cmsapi3.qiucheng-wangluo.com';
            } else if (currentHost.includes('cms.yahhp.shop')) {
                apiPath = 'https://cms-api.yahhp.shop';
            } else if (currentHost.includes('cms-web.lunarsphere.xyz')) {
                apiPath = 'https://cms-distributed.lunarsphere.xyz:8081';
            } else if (currentHost.includes('d2pfu07omhbe26.cloudfront.net')) {
                apiPath = 'https://cms-api-direct.qiucheng-wangluo.com';
            }
             else if (currentHost.includes('cms.8z3i7.lunarsphere.xyz')) {
                apiPath = 'https://cms-distributed.lunarsphere.xyz:8082';
            }
             else if (host.includes('cms-web.nuvankerder.com')) {
        apiPath = 'https://cms-distributed.nuvankerder.com:8081';
    }
            else if (host.includes('cms-web-stg.nuvankerder.com')) {
        apiPath = 'https://cms-distributed-stg.nuvankerder.com:8081';
    }

            else {
                apiPath = API;
            }
            return await fetch(apiPath + '/cms-api/agent/setAgencyRelative', {
                method: 'POST',
                headers: headers,
                body: `showIds=${assignInfo.showIds}&agentShowId=${assignInfo.agentShowId}`
            }).then(response => response.json());
        }

        // 成员设置为无贵宾
        async function setNoAgentForMember(showIds) {
            const token = getToken();
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'token': token
            };
            const currentHost = location.hostname;
            let apiPath;
            if (currentHost.includes('cms.ayybyyy.com')) {
                apiPath = 'https://cmsapi3.qiucheng-wangluo.com';
            } else if (currentHost.includes('cms.yahhp.shop')) {
                apiPath = 'https://cms-api.yahhp.shop';
            } else if (currentHost.includes('cms-web.lunarsphere.xyz')) {
                apiPath = 'https://cms-distributed.lunarsphere.xyz:8081';
            } else if (currentHost.includes('d2pfu07omhbe26.cloudfront.net')) {
                apiPath = 'https://cms-api-direct.qiucheng-wangluo.com';
            } else if (currentHost.includes('cms.8z3i7.lunarsphere.xyz')) {
                apiPath = 'https://cms-distributed.lunarsphere.xyz:8082';
            }
             else if (host.includes('cms-web.nuvankerder.com')) {
        apiPath = 'https://cms-distributed.nuvankerder.com:8081';
    }
            else if (host.includes('cms-web-stg.nuvankerder.com')) {
        apiPath = 'https://cms-distributed-stg.nuvankerder.com:8081';
    }
            else {
                apiPath = API;
            }
            return await fetch(apiPath + '/cms-api/agent/setNoAgentForUsers', {
                method: 'POST',
                headers: headers,
                body: `showIds=${showIds}`
            }).then(response => response.json());
        }
        // 加载成员和贵宾列表
        async function loadMemberAndAgentLists() {
            try {
                const memberResponse = await fetchMemberList();
                const agentResponse = await fetchAgentList();

                if (memberResponse.iErrCode !== 0) {
                    showFloatTip(`获取成员列表失败: ${memberResponse.iErrCode}`, '#f44336');
                    return;
                }
                if (agentResponse.iErrCode !== 0) {
                    showFloatTip(`获取贵宾列表失败: ${agentResponse.iErrCode}`, '#f44336');
                    return;
                }

                const members = memberResponse.data || [];
                const agents = agentResponse.data || [];

                // 填充成员列表
                const membersListHTML = members.map(member => `
                    <tr>
                        <td style="border:1px solid #ddd;padding:6px;text-align:left;"><input type="checkbox" data-showid="${member.showId}" /></td>
                        <td style="border:1px solid #ddd;padding:6px;text-align:left;">${member.nickName}</td>
                        <td style="border:1px solid #ddd;padding:6px;text-align:left;">${member.showId}</td>
                        <td style="border:1px solid #ddd;padding:6px;text-align:left;">${member.agentNickName || '-'}</td>
                    </tr>
                `).join('');

                document.getElementById('membersForAgentListBodyContent2').innerHTML = membersListHTML;

                // 填充贵宾列表
                const agentsListHTML = agents.map(agent => `
                    <option value="${agent.showId}">${agent.nickName} (${agent.showId})</option>
                `).join('');

                document.getElementById('agentForMembersList').innerHTML = agentsListHTML;

                // 高亮显示有贵宾的成员
                const rows = document.querySelectorAll('#membersForAgentListBodyContent2 tr');
                rows.forEach(row => {
                    const agentCell = row.cells[3];
                    if (agentCell.textContent !== '-') {
                        row.style.backgroundColor = '#bbdefb';
                    }
                });

            } catch (error) {
                console.error('加载成员和贵宾列表出错:', error);
                showFloatTip('加载成员和贵宾列表出错，请检查网络或联系管理员。', '#f44336');
            }
        }

        // 成员分配给贵宾代理逻辑
        document.getElementById('assignMembersToAgentBtn').addEventListener('click', async () => {
            const selectedMemberShowIds = Array.from(document.querySelectorAll('#membersForAgentListBodyContent2 input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.getAttribute('data-showid'));
            const selectedAgentShowId = document.getElementById('agentForMembersList').value;

            if (!selectedMemberShowIds.length) return showFloatTip('请至少选择一个成员', '#f44336');
            if (!selectedAgentShowId) return showFloatTip('请选择一个贵宾代理', '#f44336');

            try {
                await assignMembersToAgent({
                    showIds: selectedMemberShowIds.join(','),
                    agentShowId: selectedAgentShowId
                });
                showFloatTip('分配成功');
                await loadMemberAndAgentLists(); // 刷新列表
            } catch (error) {
                console.error('分配成员出错:', error);
                showFloatTip('分配成员出错，请检查网络或联系管理员。', '#f44336');
            }
        });

        // 设置成员无贵宾逻辑
        document.getElementById('setNoAgentForMembersBtn').addEventListener('click', async () => {
            const selectedMemberShowIds = Array.from(document.querySelectorAll('#membersForAgentListBodyContent2 input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.getAttribute('data-showid'));

            if (!selectedMemberShowIds.length) return showFloatTip('请至少选择一个成员', '#f44336');

            try {
                await setNoAgentForMember(selectedMemberShowIds.join(','));
                showFloatTip('设置无贵宾成功');
                await loadMemberAndAgentLists(); // 刷新列表
            } catch (error) {
                console.error('设置无贵宾出错:', error);
                showFloatTip('设置无贵宾出错，请检查网络或联系管理员。', '#f44336');
            }
        });

        // 全选成员复选框逻辑
        document.getElementById('selectAllMembersForAgent').addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('#membersForAgentListBodyContent2 input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });

        // 分配贵宾代理按钮点击事件
        document.getElementById('assignAgentBtn').addEventListener('click', async () => {
            const cid = panel.querySelector('#clubSelect').value;
            const lid = getLeagueId(cid);
            if (!lid) return showFloatTip('无法获取联盟ID（无超盟）', '#f44336');

            // 获取当前选择的俱乐部
            const clubId = document.getElementById('clubSelect').value;
            if (!clubId) {
                showFloatTip('请选择一个俱乐部', '#f44336');
                return;
            }

            // 请求获取成员列表和贵宾列表
            await loadMemberAndAgentLists();

            // 显示隐藏区域
            document.getElementById('memberAgentSection').style.display = 'block';
        });

        // 获取贵宾列表按钮点击事件
        panel.querySelector('#loadVIPListBtn').onclick = async () => {
            const cid = panel.querySelector('#clubSelect').value;
            const lid = getLeagueId(cid);
            if (!lid) return showFloatTip('该俱乐部无超级联盟，无法获取联盟ID', '#f44336');

            // 先清除之前的贵宾列表
            const existingVIPLists = panel.querySelectorAll('#vipListDiv');
            existingVIPLists.forEach(div => div.remove());

            const vipListDiv = document.createElement('div');
            vipListDiv.id = 'vipListDiv';
            vipListDiv.style.marginTop = '12px';
            vipListDiv.style.marginBottom = '12px';
            vipListDiv.style.display = 'none';

            const vipList = await sendPost('/cms-api/agent/getClubAgentList', 'keyWord=&order=1&pageNumber=1&pageSize=100');

            if (isSuccessfulResponse(vipList)) {
                const data = vipList.result.data || [];
                if (data.length === 0) {
                    vipListDiv.innerHTML = '<p>未找到贵宾信息。</p>';
                } else {
                    let tableHTML = '<table style="width:100%; border-collapse: collapse;"><thead><tr>';
                    const keysToShow = ['showId', 'nickName', 'creditBalance', 'slotDrawRatio',
                        'texasDrawRatio', 'texasShareInsurance', 'omahaDrawRatio', 'omahaShareInsurance',
                        'shortDrawRatio', 'shortShareInsurance', 'ofcDrawRatio', 'crbDrawRatio',
                        'texasCowboyDrawRatio', 'texasCowboyBetBackRatio', 'mixedDrawRatio',
                        'sngDrawRatio', 'mttDrawRatio'];
                    const headers = ['选择', 'showID', '昵称', '余额', '小丑slot返利%',
                        '德州返利%', '德州保险%', '奥马哈返利%', '奥马哈保险%',
                        '短牌返利%', '短牌保险%', 'OF榜返利%', 'CRB返利%',
                        '德州牛仔返利%', '德州牛仔返点%', '混合游戏返利%',
                        'SNG返利%', 'MTT返利%'];
                    headers.forEach(header => {
                        if (header === '选择') {
                            tableHTML += `<th style="border:1px solid #ccc; padding:4px; text-align:center;"><input type="checkbox" id="selectAllVIPs" /></th>`;
                        } else {
                            tableHTML += `<th style="border:1px solid #ccc; padding:4px; text-align:center;">${header}</th>`;
                        }
                    });
                    tableHTML += '</tr></thead><tbody>';

                    data.forEach(agent => {
                        tableHTML += '<tr data-showid="' + agent.showId + '">';
                        // 添加选择框
                        tableHTML += `<td style="border:1px solid #ccc; padding:4px; text-align:center;">
                            <input type="checkbox" class="select-vip" data-showid="${agent.showId}" />
                        </td>`;
                        keysToShow.forEach(key => {
                            if (key.includes('Ratio') || key.includes('Back') || key.includes('Insurance')) {
                                tableHTML += `<td style="border:1px solid #ccc; padding:4px; text-align:center;">
                                    <input type="number" class="ratio-input" data-ratio="${key}" value="${agent[key]}" style="width: 60px; padding:4px; border:1px solid #ccc; border-radius:4px;" />
                                </td>`;
                            } else {
                                tableHTML += `<td style="border:1px solid #ccc; padding:4px; text-align:center;">${agent[key]}</td>`;
                            }
                        });
                        tableHTML += '</tr>';
                    });

                    tableHTML += '</tbody></table>';
                    vipListDiv.innerHTML = tableHTML;

                    // 全选/全不选功能
                    vipListDiv.querySelector('#selectAllVIPs').onchange = function() {
                        const checkboxes = vipListDiv.querySelectorAll('.select-vip');
                        checkboxes.forEach(cb => cb.checked = this.checked);
                    };

                    // 批量设置返利比例的输入框和按钮
                    const batchSetDiv = document.createElement('div');
                    batchSetDiv.style.marginTop = '12px';
                    batchSetDiv.style.display = 'flex';
                    batchSetDiv.style.alignItems = 'center';
                    batchSetDiv.style.gap = '8px';

                    const batchRatioInput = document.createElement('input');
                    batchRatioInput.type = 'number';
                    batchRatioInput.placeholder = '输入返利比例（0-100）';
                    batchRatioInput.min = '0';
                    batchRatioInput.max = '100';
                    batchRatioInput.style.padding = '4px 8px';
                    batchRatioInput.style.border = '1px solid #ccc';
                    batchRatioInput.style.borderRadius = '4px';
                    batchRatioInput.style.width = '160px';

                    const batchSetBtn = document.createElement('button');
                    batchSetBtn.textContent = '设置统一返利比例';
                    batchSetBtn.style.padding = '6px 12px';
                    batchSetBtn.style.background = '#16a085';
                    batchSetBtn.style.color = '#fff';
                    batchSetBtn.style.border = 'none';
                    batchSetBtn.style.borderRadius = '4px';
                    batchSetBtn.style.cursor = 'pointer';

                    batchSetDiv.appendChild(batchRatioInput);
                    batchSetDiv.appendChild(batchSetBtn);

                    // 批量设置返利比例的逻辑
                    batchSetBtn.onclick = async () => {
                        const ratioValue = batchRatioInput.value.trim();
                        if (!ratioValue) return showFloatTip('请输入返利比例', '#f44336');
                        const ratio = parseFloat(ratioValue);
                        if (isNaN(ratio) || ratio < 0 || ratio > 100) return showFloatTip('请输入有效的返利比例（0-100）', '#f44336');

                        const selectedVIPs = vipListDiv.querySelectorAll('.select-vip:checked');
                        if (selectedVIPs.length === 0) return showFloatTip('请至少选择一个贵宾', '#f44336');

                        let successCount = 0;
                        let errorCount = 0;

                        for (const checkbox of selectedVIPs) {
                            const showId = checkbox.getAttribute('data-showid');
                            const row = vipListDiv.querySelector(`tr[data-showid="${showId}"]`);
                            const inputs = row.querySelectorAll('.ratio-input');
                            let bodyParams = `agentShowId=${showId}`;

                            const ratioMapping = {
                                'mixedDrawRatio': 'mixedRatio',
                                'sngDrawRatio': 'sngRatio',
                                'mttDrawRatio': 'mttRatio',
                                'slotDrawRatio': 'slotDrawRatio'
                            };

                            inputs.forEach(input => {
                                const originalRatioType = input.getAttribute('data-ratio');
                                let ratioType = ratioMapping[originalRatioType] || originalRatioType;

                                // 特殊处理 texasCowboyBetBackRatio 的最大值为 3
                                let value = ratio;
                                if (originalRatioType === 'texasCowboyBetBackRatio' && value > 3) {
                                    value = 3;
                                }

                                bodyParams += `&${ratioType}=${value}`;
                            });

                            try {
                                const xhr = new XMLHttpRequest();
                                const currentHost = location.hostname;
                                let apiPath;
                                if (currentHost.includes('cms.ayybyyy.com')) {
                                    apiPath = 'https://cmsapi3.qiucheng-wangluo.com';
                                } else if (currentHost.includes('cms.yahhp.shop')) {
                                    apiPath = 'https://cms-api.yahhp.shop';
                                } else if (currentHost.includes('cms-web.lunarsphere.xyz')) {
                                    apiPath = 'https://cms-distributed.lunarsphere.xyz:8081';
                                } else if (currentHost.includes('d2pfu07omhbe26.cloudfront.net')) {
                                    apiPath = 'https://cms-api-direct.qiucheng-wangluo.com';
                                } else if (currentHost.includes('cms.8z3i7.lunarsphere.xyz')) {
                apiPath = 'https://cms-distributed.lunarsphere.xyz:8082';
                                } else if (host.includes('cms-web.nuvankerder.com')) {
        apiPath = 'https://cms-distributed.nuvankerder.com:8081';
    }
                                else if (host.includes('cms-web-stg.nuvankerder.com')) {
        apiPath = 'https://cms-distributed-stg.nuvankerder.com:8081';
    }
                                else {
                                    apiPath = API;
                                }
                                const fullUrl = apiPath + '/cms-api/agent/setAgentRatio';

                                xhr.open('POST', fullUrl, true);
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                                xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
                                xhr.setRequestHeader('token', getToken());
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === 4 && xhr.status === 200) {
                                        const response = JSON.parse(xhr.responseText);
                                        if (response.iErrCode === 0) {
                                            successCount++;
                                        } else {
                                            errorCount++;
                                            console.error(`保存贵族 ${showId} 的返利比例失败:`, response);
                                        }
                                    } else if (xhr.readyState === 4) {
                                        errorCount++;
                                        console.error(`保存贵族 ${showId} 的返利比例失败:`, xhr.statusText);
                                    }
                                };
                                xhr.send(bodyParams);

                                // 模拟0.3秒的延迟
                                await new Promise(resolve => setTimeout(resolve, 300));
                            } catch (e) {
                                errorCount++;
                                console.error(`保存贵族 ${showId} 的返利比例出错:`, e);
                            }
                        }

                        showFloatTip(`批量设置完成！成功: ${successCount} 个, 失败: ${errorCount} 个`);

                        // 刷新设置完成的贵宾列表展示区域
                        panel.querySelector('#loadVIPListBtn').click();
                    };

                    vipListDiv.appendChild(batchSetDiv);

                    // 添加保存按钮
                    const saveBtn = document.createElement('button');
                    saveBtn.textContent = '设置不同返利比例';
                    saveBtn.style.marginTop = '12px';
                    saveBtn.style.padding = '8px';
                    saveBtn.style.background = '#27ae60';
                    saveBtn.style.color = '#fff';
                    saveBtn.style.border = 'none';
                    saveBtn.style.borderRadius = '4px';
                    saveBtn.style.cursor = 'pointer';

                    saveBtn.onclick = async () => {
                        const selectedVIPs = vipListDiv.querySelectorAll('.select-vip:checked');
                        let saveSuccess = 0;
                        let saveError = 0;

                        for (const checkbox of selectedVIPs) {
                            const showId = checkbox.getAttribute('data-showid');
                            const row = vipListDiv.querySelector(`tr[data-showid="${showId}"]`);
                            const inputs = row.querySelectorAll('.ratio-input');
                            let bodyParams = `agentShowId=${showId}`;

                            const ratioMapping = {
                                'mixedDrawRatio': 'mixedRatio',
                                'sngDrawRatio': 'sngRatio',
                                'mttDrawRatio': 'mttRatio',
                                'slotDrawRatio': 'slotDrawRatio'
                            };

                            inputs.forEach(input => {
                                const originalRatioType = input.getAttribute('data-ratio');
                                let ratioType = ratioMapping[originalRatioType] || originalRatioType;
                                const value = input.value;
                                bodyParams += `&${ratioType}=${value}`;
                            });

                            try {
                                const xhr = new XMLHttpRequest();
                                const currentHost = location.hostname;
                                let apiPath;
                                if (currentHost.includes('cms.ayybyyy.com')) {
                                    apiPath = 'https://cmsapi3.qiucheng-wangluo.com';
                                } else if (currentHost.includes('cms.yahhp.shop')) {
                                    apiPath = 'https://cms-api.yahhp.shop';
                                } else if (currentHost.includes('cms-web.lunarsphere.xyz')) {
                                    apiPath = 'https://cms-distributed.lunarsphere.xyz:8081';
                                } else if (currentHost.includes('d2pfu07omhbe26.cloudfront.net')) {
                                    apiPath = 'https://cms-api-direct.qiucheng-wangluo.com';
                                } else if (currentHost.includes('cms.8z3i7.lunarsphere.xyz')) {
                apiPath = 'https://cms-distributed.lunarsphere.xyz:8082';
                                }
             else if (host.includes('cms-web.nuvankerder.com')) {
        apiPath = 'https://cms-distributed.nuvankerder.com:8081';
    }
                                else if (host.includes('cms-web-stg.nuvankerder.com')) {
        apiPath = 'https://cms-distributed-stg.nuvankerder.com:8081';
    }
                                else {
                                    apiPath = API;
                                }
                                const fullUrl = apiPath + '/cms-api/agent/setAgentRatio';

                                xhr.open('POST', fullUrl, true);
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                                xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
                                xhr.setRequestHeader('token', getToken());
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === 4 && xhr.status === 200) {
                                        const response = JSON.parse(xhr.responseText);
                                        if (response.iErrCode === 0) {
                                            saveSuccess++;
                                        } else {
                                            saveError++;
                                            console.error(`保存贵族 ${showId} 的返利比例失败:`, response);
                                        }
                                    } else if (xhr.readyState === 4) {
                                        saveError++;
                                        console.error(`保存贵族 ${showId} 的返利比例失败:`, xhr.statusText);
                                    }
                                };
                                xhr.send(bodyParams);

                                // 模拟0.3秒的延迟
                                await new Promise(resolve => setTimeout(resolve, 300));
                            } catch (e) {
                                saveError++;
                                console.error(`保存贵族 ${showId} 的返利比例出错:`, e);
                            }
                        }

                        showFloatTip(`保存完成！成功: ${saveSuccess} 个, 失败: ${saveError} 个`);

                        // 刷新设置完成的贵宾列表展示区域
                        panel.querySelector('#loadVIPListBtn').click();
                    };

                    vipListDiv.appendChild(saveBtn);
                }
            } else {
                vipListDiv.innerHTML = `<p>加载贵宾列表失败: ${vipList.iErrCode}</p>`;
            }

            panel.querySelector('#advancedJokerSection').appendChild(vipListDiv);
            vipListDiv.style.display = 'block';
        };
        panel.querySelector('#loadJokerClubsBtn').onclick = async () => {
            const cid = panel.querySelector('#clubSelect').value;
            const lid = getLeagueId(cid);
            if (!lid) return showFloatTip('该俱乐部无超级联盟，无法获取联盟ID', '#f44336');

            // 延迟0.1秒获取小丑游戏信息
            setTimeout(async () => {
                const jokerGameInfoDiv = panel.querySelector('#jokerGameInfo');
                jokerGameInfoDiv.style.display = 'block';
                jokerGameInfoDiv.innerHTML = '加载游戏信息中...';

                try {
                    const path = '/cms-api/superleague/crazyjokersetting/getgameinfo';
                    const body = `leagueId=${lid}`;
                    const json = await sendPost(path, body);

                    if (isSuccessfulResponse(json) && json.result) {
                        jokerGameInfoDiv.innerHTML = `
                            <div><strong>当前小丑游戏名:</strong> ${json.result.gameName || '未设置'}</div>
                            <div><strong>返点比例上限:</strong> ${json.result.rebateShareRatioLimit}%</div>
                        `;
                    } else {
                        jokerGameInfoDiv.innerHTML = `加载游戏信息失败: ${json.iErrCode || '请求错误'}`;
                    }
                } catch (e) {
                    console.error('加载小丑游戏信息出错:', e);
                    jokerGameInfoDiv.innerHTML = `加载游戏信息失败: ${e.message}`;
                }
            }, 10);

            // 开始加载小丑附属俱乐部列表
            panel.querySelector('#jokerClubsSection').style.display = 'block';
            const tbody = panel.querySelector('#jokerClubList');
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">加载中...</td></tr>';

            const jokerClubs = [];
            for (let page = 1; ; page++) {
                const path = '/cms-api/superleague/crazyjokersetting/listclubgamesetting';
                const body = `pageNumber=${page}&pageSize=100&leagueId=${lid}&keyword=&order=`;
                const json = await sendPost(path, body);
                if (!isSuccessfulResponse(json)) {
                    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">加载失败: ${json.iErrCode}</td></tr>`;
                    break;
                }
                const list = json.result?.crazyJokerClubGameSettingBaseInfoVoList || [];
                if (list.length === 0) break;
                jokerClubs.push(...list);
                if (list.length < 100) break;
            }

            tbody.innerHTML = '';
            if (jokerClubs.length === 0) {
                 tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">未找到相关俱乐部</td></tr>';
                 return;
            }
            jokerClubs.forEach(club => {
                const row = document.createElement('tr');
                const statusText = club.crazyJokerStatus === 2 ? '<span style="color:green;">启用</span>' : '<span style="color:red;">禁用</span>';
                row.innerHTML = `
                    <td style="border:1px solid #ccc; padding:4px;">${club.clubName}</td>
                    <td style="border:1px solid #ccc; padding:4px; text-align:center;">${club.clubId}</td>
                    <td style="border:1px solid #ccc; padding:4px; text-align:center;">${statusText}</td>
                    <td style="border:1px solid #ccc; padding:4px; text-align:center;">${club.crazyJokerRebateShareRatio}</td>
                    <td style="border:1px solid #ccc; padding:4px; text-align:center;">
                        <button class="jokerClubActionBtn" data-action="enable" data-clubid="${club.clubId}" style="padding: 2px 5px; font-size: 10px; background: #27ae60; color: white; border: none; border-radius: 3px; cursor: pointer; margin-right: 4px;">启用</button>
                        <button class="jokerClubActionBtn" data-action="disable" data-clubid="${club.clubId}" style="padding: 2px 5px; font-size: 10px; background: #c0392b; color: white; border: none; border-radius: 3px; cursor: pointer;">禁用</button>
                    </td>`;
                tbody.appendChild(row);
            });
        };

        panel.querySelector('#jokerClubList').addEventListener('click', async (e) => {
            if (!e.target.classList.contains('jokerClubActionBtn')) return;

            const button = e.target;
            const action = button.dataset.action;
            const clubId = button.dataset.clubid;
            const status = action === 'enable' ? 2 : 1;

            const cid = panel.querySelector('#clubSelect').value;
            const lid = getLeagueId(cid);
            if (!lid) return showFloatTip('该俱乐部无超级联盟，无法获取联盟ID', '#f44336');

            const path = '/cms-api/superleague/crazyjokersetting/setclubgamestatus';
            const body = `clubId=${clubId}&leagueId=${lid}&status=${status}`;

            try {
                const r = await sendPost(path, body);
                if (isSuccessfulResponse(r)) {
                    showFloatTip(`俱乐部 ${clubId} ${action === 'enable' ? '启用' : '禁用'}成功`);
                    panel.querySelector('#loadJokerClubsBtn').click();
                } else {
                    showFloatTip(`操作失败: ${r.iErrCode || '请求错误'}`, '#f44336');
                }
            } catch (err) {
                console.error(`操作俱乐部 ${clubId} 出错:`, err);
                showFloatTip(`操作失败: ${err.message}`, '#f44336');
            }
        });
        // ✅ 钻石基金转账
panel.querySelector('#diamondTransferBtn').onclick = async () => {
  const cid = panel.querySelector('#clubSelect').value;
  const amount = panel.querySelector('#diamondTransferAmount').value;
  const checkboxes = [...panel.querySelectorAll('#memberList .memberCheck:checked')];
  if (checkboxes.length === 0) return showFloatTip('请先勾选用户', '#f44336');

  let success = 0, fail = 0;
  for (const cb of checkboxes) {
    const showid = cb.getAttribute('data-showid');
    const body = `num=${amount}&showid=${showid}`;
    try {
      const res = await sendPost('/cms-api/club/transferdiamond', body);
      if (res.iErrCode === 0) {
        showFloatTip(`向用户${showid}转账${amount}钻石成功...请骚等`);
        success++;
      } else if (res.iErrCode === 666) {
        showTopTip(`俱乐部钻石不足 向用户${showid}转账失败`, '#ffc107'); // 黄色提示
          fail++;
      } else {
        fail++;
      }
    } catch {
      fail++;
    }
    await new Promise(r => setTimeout(r, 0));
  }

  showFloatTip(`钻石转账完成！\n成功：${success}，失败：${fail}`);
      // 🆕 转账完成后刷新钻石基金
    try {
        const clubInfoRes = await sendPost('/cms-api/club/clubInfo', `clubId=${cid}`);
        if (isSuccessfulResponse(clubInfoRes) && clubInfoRes.result) {
            const diamondFund = clubInfoRes.result.lDiamond || 0;
            const idDisplay = panel.querySelector('#memberClubIdDisplay');
            idDisplay.innerHTML = `当前俱乐部ID: ${cid} | <span style="color:#00c853;font-weight:bold;">钻石基金: ${diamondFund}</span>`;
        }
    } catch (e) {
        console.error('刷新钻石基金失败', e);
    }
  panel.querySelector('#loadMembersBtn').click();
    // 取消“全选”复选框的勾选状态
const selectAll = panel.querySelector('#selectAllMembers');
if (selectAll) selectAll.checked = false;
};

// ✅ 钻石回收（优化版）
panel.querySelector('#diamondRecallBtn').onclick = async () => {
  const cid = panel.querySelector('#clubSelect').value;
  const amount = panel.querySelector('#diamondRecallAmount').value;
  const checkboxes = [...panel.querySelectorAll('#memberList .memberCheck:checked')];
  if (checkboxes.length === 0) return showFloatTip('请先勾选用户', '#f44336');

  let hasPermission = true; // 权限标志
  for (const cb of checkboxes) {
    if (!hasPermission) break; // 检测到无权限时终止循环

    const showid = cb.getAttribute('data-showid');
    const body = `clubId=${cid}&showId=${showid}&amount=${amount}`;
    try {
      const res = await sendPost('/cms-api/club/fund/recall', body);
      switch (res.iErrCode) {
        case 0:
          showFloatTip(`向用户(showid:${showid})发送回收${amount}钻石成功！`, '#4CAF50');
          break;
        case 4035:
          showTopTip(`用户(showid:${showid})已存在回收请求，重复提交`, '#FF9800');
          break;
        case 2:
          showFloatTip('未开通钻石回收权限', '#E91E63');
          hasPermission = false; // 终止后续请求
          break;
        default:
          showFloatTip(`钻石回收失败：iErrCode：${res.iErrCode || '未知错误'}`, '#f44336');
      }
    } catch {
      showFloatTip('网络错误，请重试', '#f44336');
    }
    await new Promise(r => setTimeout(r, 0)); // 保持异步间隔
  }
    panel.querySelector('#loadMembersBtn').click();
    if (i < checkboxes.length - 1) await new Promise(r => setTimeout(r, 0));
  }

    // 取消“全选”复选框的勾选状态
const selectAll = panel.querySelector('#selectAllMembers');
if (selectAll) selectAll.checked = false;
  //panel.querySelector('#loadMembersBtn').click();
// ✅ 自动读取 clubid 并加载成员（不依赖按钮点击）
if (!currentUrl.includes('index.html') && !currentUrl.includes('cmsLogin.html')) {
    const tryAutoLoad = async () => {
        const savedClubId = sessionStorage.getItem('clubid');
        if (!savedClubId) return;

        const clubSelect = panel.querySelector('#clubSelect');
        if (!clubSelect || clubSelect.options.length === 0) {
            setTimeout(tryAutoLoad, 500);
            return;
        }
console.log('11clubSelect value:', document.querySelector('#clubSelect')?.value);
        // 设置选中项
        for (let i = 0; i < clubSelect.options.length; i++) {
            if (clubSelect.options[i].value === savedClubId) {
                clubSelect.selectedIndex = i;
                break;
            }
        }
console.log('22clubSelect value:', document.querySelector('#clubSelect')?.value);
        // ✅ 直接调用加载成员逻辑，而不是模拟点击按钮
        await panel.querySelector('#loadMembersBtn').onclick();
    };

    setTimeout(tryAutoLoad, 500);
}

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
    border:none; border-radius:6px; font-size:18px; font-weight:bold;
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