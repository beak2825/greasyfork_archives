// ==UserScript==
// @name         SteamGG CDK辅助助手
// @namespace    https://tampermonkey.net/
// @version      3.2
// @description  提供低价提醒、价格高亮等功能，支持参数调节、本地存储和声音提醒，支持动态刷新
// @author       steamGG
// @match        https://steampy.com/cdkDetail?name=cn&gameId=*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/538330/SteamGG%20CDK%E8%BE%85%E5%8A%A9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/538330/SteamGG%20CDK%E8%BE%85%E5%8A%A9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 gameId
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId');

    // 本地存储Key，包含 gameId
    const STORAGE_KEY = `steamPyPriceHelperParams_${gameId}`;

    // 默认参数
    const defaultParams = {
        targetPrice: '0.01',
        scanInterval: '1000',
        refreshInterval: '10000',
        enableSound: 'false',
        enableAutoOrder: 'true',
        chkIgnoreRecord:'false',
        autoTargetPrice: 'true',// 新增，字符串形式
        bgSoundUrl: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg',
        successSoundUrl: 'https://www.soundjay.com/buttons/sounds/button-3.mp3'
    };

    // 读取本地存储参数，没存过用默认
    function loadParams() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored);
        } catch(e) {}
        return {...defaultParams};
    }

    // 保存参数到本地存储
    function saveParams(params) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
        } catch(e) {}
    }

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        #steamPyPanel {
            position: fixed;
            top: 50px;
            right: 20px;
            width: 290px;
            background: #222;
            color: #eee;
            font-family: Arial, sans-serif;
            font-size: 14px;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 12px rgba(0,0,0,0.8);
            z-index: 9999999;
            user-select: none;
        }
        #steamPyPanel h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-weight: bold;
            text-align: center;
            color: #fff;
        }
        #steamPyPanel label {
            display: block;
            margin: 8px 0 4px 0;
            cursor: pointer;
        }
        #steamPyPanel input[type="number"],
        #steamPyPanel input[type="text"],
        #steamPyPanel input[type="checkbox"] {
            background-color: #222 !important;
            color: #eee !important;
            border: 1px solid #555 !important;
            padding: 4px 6px;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
            pointer-events: auto !important;
            z-index: 999999 !important;
        }
        #steamPyPanel input[type="checkbox"] {
            width: auto !important;
            height: auto !important;
            vertical-align: middle;
            margin-right: 6px;
        }
        #steamPyPanel button {
            width: 100%;
            padding: 8px;
            margin-top: 12px;
            border: none;
            border-radius: 5px;
            background: #0066cc;
            color: #fff;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
        }
        #steamPyPanel button:hover {
            background: #005bb5;
        }
        #steamPyPanel .status {
            margin-top: 8px;
            font-size: 13px;
            color: #99ccff;
            text-align: center;
            user-select: text;
            min-height: 22px;
        }
    `;
    document.head.appendChild(style);

    // 加载之前的参数或默认
    const params = loadParams();

    // 创建面板
    const panel = document.createElement('div');
    panel.id = 'steamPyPanel';
    panel.innerHTML = `
        <h3>steamGG辅助（支持多开）</h3>
        <style>
@keyframes fadeSlideIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.notice-box {
  background-color: #fff4f4;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  margin-bottom: 10px;
  opacity: 1;
  transform: translateY(0);
}
.notice-box.animate {
  animation: fadeSlideIn 0.6s ease-out;
}
.notice-box span,
.notice-box strong {
  display: inline-block;
  margin-right: 3px;
}
</style>

<div id="noticeBox" class="notice-box">
  <strong style="color: #d00;">⚠ 本辅助归</strong>
  <strong style="color: #ff8800;">Steamgg协会</strong>
  <span style="color: #d00;">所有</span>，
  <span style="color: #9900cc;">未经授权</span>
  <span style="color: #d00;">使用传播</span>
  <span style="color: #003366; font-weight: bold;">系侵权行为</span>
 <span style="color: black;">检测当前为PC端系统，开启扫价模式（如需扫盒移至移动端系统）</span>
</div>

<script>
window.addEventListener('DOMContentLoaded', () => {
  const notice = document.getElementById('noticeBox');
  const hasAnimated = localStorage.getItem('noticeAnimated');

  if (!hasAnimated) {
    notice.classList.add('animate');
    localStorage.setItem('noticeAnimated', 'true');
  }
});
</script>

       <label><input type="checkbox" id="autoTargetPrice" ${params.autoTargetPrice === 'true' ? 'checked' : ''} /> 自动获取预期价格</label>
        <label>目标价格 (元):
            <input type="number" id="targetPrice" min="0" step="0.01" value="${params.targetPrice}" />
        </label>
        <label>价格扫描间隔 (毫秒):
            <input type="number" id="scanInterval" min="20" step="10" value="${params.scanInterval}" />
        </label>
        <label>自动刷新间隔 (毫秒，0关闭):
            <input type="number" id="refreshInterval" min="0" step="1000" value="${params.refreshInterval}" />
        </label>
        <label><input type="checkbox" id="enableSound" ${params.enableSound === 'true' ? 'checked' : ''} /> 声音提醒</label>
       <label>查价音乐URL：
  <input type="text" id="bgSoundInput" placeholder="留空使用默认地址" value="${params.bgSoundUrl || ''}" />
</label>
<label>成功下单音效URL：
  <input type="text" id="successSoundInput" placeholder="留空使用默认地址" value="${params.successSoundUrl || ''}" />
</label>
        <label><input type="checkbox" id="enableAutoOrder" ${params.enableAutoOrder === 'true' ? 'checked' : ''} /> 自动下单</label>
         <label><input type="checkbox" id="chkIgnoreRecord"${params.chkIgnoreRecord === 'true' ? 'checked' : ''}/> 持续蹲当前游戏</label>
        <button id="btnPause">暂停刷新</button>
        <button id="btnManualRefresh">手动刷新</button>
        <button id="btnClearAllParams" style="background:#cc3300; margin-top:6px;">
  清除所有游戏预存参数（谨慎使用）
</button>
        <div class="status" id="statusArea">状态：等待中...</div>
    `;
    document.body.appendChild(panel);
    const autoTargetPriceCheckbox = document.getElementById('autoTargetPrice');
    // 读取DOM元素
    const targetPriceInput = document.getElementById('targetPrice');
    const scanIntervalInput = document.getElementById('scanInterval');
    const refreshIntervalInput = document.getElementById('refreshInterval');
    const enableSoundCheckbox = document.getElementById('enableSound');
    const enableAutoOrderCheckbox = document.getElementById('enableAutoOrder');
    const btnPause = document.getElementById('btnPause');
    const btnManualRefresh = document.getElementById('btnManualRefresh');
    const chkIgnoreRecordCheckbox = document.getElementById('chkIgnoreRecord');
    const statusArea = document.getElementById('statusArea');
    const SOUND_URL = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';
    const SUCCESS_URL = 'https://www.soundjay.com/buttons/sounds/button-3.mp3';
// 获取DOM
    const bgSoundInput = document.getElementById('bgSoundInput');
    const successSoundInput = document.getElementById('successSoundInput');
    const btnClearAllParams = document.getElementById('btnClearAllParams');


    // 变量状态
    let scanIntervalId = null;
    let refreshIntervalId = null;
    let isPaused = false;
    let soundPlaying = false;
    let audio = null;
    let isOrdering = false;
   const AudioManager = (() => {
    let backgroundAudio = null;
    let eventAudio = null;
    let initialized = false;
    let soundEnabled = true;

   const DEFAULT_SOUND_URL = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';
   const DEFAULT_SUCCESS_URL = 'https://www.soundjay.com/buttons/sounds/button-3.mp3';

const SOUND_URL = params.bgSoundUrl?.trim() || DEFAULT_SOUND_URL;
const SUCCESS_URL = params.successSoundUrl?.trim() || DEFAULT_SUCCESS_URL;

    // 初始化音频（仅需用户交互触发一次）
    function init() {
        if (initialized) return;
        backgroundAudio = new Audio(SOUND_URL);
        backgroundAudio.loop = true;
        backgroundAudio.load();

        eventAudio = new Audio(SUCCESS_URL);
        eventAudio.load();

        initialized = true;
        console.log('🎵 音频系统已初始化');
    }
    // 播放背景音乐
    function playBackground() {
        if (!soundEnabled || !initialized) return;
        backgroundAudio.play().catch(err => {
            console.warn('🔇 背景音乐播放失败:', err);
        });
    }
    // 停止背景音乐
    function stopBackground() {
        if (backgroundAudio) {
            backgroundAudio.pause();
            backgroundAudio.currentTime = 0;
        }
    }
    // 播放一次事件音效（如：下单成功）
    function playEventSound() {
        if (!soundEnabled || !initialized) return;
        eventAudio.currentTime = 0;
        eventAudio.play().catch(err => {
            console.warn('🔇 事件音效播放失败:', err);
        });
    }
    // 控制开关
    function setEnabled(flag) {
        soundEnabled = flag;
        if (!flag) stopBackground();
    }
    return {
        init,
        playBackground,
        stopBackground,
        playEventSound,
        setEnabled
    };
})();

// 服务器地址，记得端口跟你Python程序里的一致
    const serverUrl = "http://127.0.0.1:8080";
    const notifyUrl = `${serverUrl}/notify`;


     function sendNotification(gameName, price, eventType) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: notifyUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                game_name: gameName,
                price: price,
                event_type: eventType// 事件类型 purchase_success 或 unpaid_limit
            }),
            onload: function(response) {
                if (response.status === 200) {
                    updateStatus('通知发送成功:', response.responseText);
                } else {
                    updateStatus('通知发送失败:', response.responseText);
                }
            },
            onerror: function(err) {
                updateStatus('通知请求错误:', err);
            }
        });
    }


    // 获取页面价格元素
    function getPriceElements() {
        return Array.from(document.querySelectorAll('table tbody tr')).map(tr => {
            const td = tr.querySelector('td:nth-child(5) > div > div');
            return td || null;
        }).filter(e => e !== null);
    }
let pauseEndTimestamp = parseInt(localStorage.getItem('pauseEndTimestamp') || '0', 10);
    // 模拟暂停机制，暂停期间禁止下单，自动恢复
function updatePauseStatus() {
    const now = Date.now();
    if (pauseEndTimestamp > now) {
        isOrdering = true;
        const secondsLeft = Math.ceil((pauseEndTimestamp - now) / 1000);
        updateStatus(`暂停下单中，剩余 ${secondsLeft} 秒`);
        // 每秒更新时间显示，直到暂停结束
        setTimeout(updatePauseStatus, 1000);
    } else {
        // 暂停结束，允许下单
        if (isOrdering) {
            isOrdering = false;
            updateStatus('暂停结束，恢复下单');
            localStorage.removeItem('pauseEndTimestamp');
            pauseEndTimestamp = 0;
        }
    }
}

// 初始化检查暂停状态，页面加载时调用
updatePauseStatus();

// 暂停函数，传入秒数，支持持久化
function pauseOrdering(seconds) {
    const now = Date.now();
    pauseEndTimestamp = now + seconds * 1000;
    localStorage.setItem('pauseEndTimestamp', pauseEndTimestamp.toString());
    isOrdering = true;
    updateStatus(`暂停下单 ${seconds} 秒`);
    updatePauseStatus(); // 启动倒计时显示
}
    //const orderedGameIds = new Set();
    let orderedGameIds = (() => {
        const saved = localStorage.getItem('orderedGameIds');
        return saved ? new Set(JSON.parse(saved)) : new Set();
})();
    // 成功下单后调用，保存到 localStorage
function recordOrder(gameId) {
  orderedGameIds.add(gameId);
  localStorage.setItem('orderedGameIds', JSON.stringify(Array.from(orderedGameIds)));
}
let ignoredGameId = null;// 忽略记录拦截的 gameId
    // 初始化 lastOrderTime，从 localStorage 读取
let lastOrderTime = parseInt(localStorage.getItem('lastOrderTime') || '0', 10);

function recordLastOrderTime() {
    lastOrderTime = Date.now();
    localStorage.setItem('lastOrderTime', lastOrderTime.toString());
}
    // 自动下单逻辑
    async function checkAndOrder(targetPrice) {
        const now = Date.now();
    if (now - lastOrderTime < 5000) {
        updateStatus(`距离上次下单不足5秒，等待中...`);
        return;// 距离上次下单不够5秒，跳过这次下单
    }
        if (isOrdering) {
            updateStatus("已有下单请求进行中（或者目前处于休息期），等待完成");
            return;
        }

        if (orderedGameIds.has(gameId) && gameId !== ignoredGameId) {
        updateStatus(`gameId=${gameId} 已经下单过，跳过`);
        return;
    }
         const priceDiv = document.querySelector('table tbody tr td:nth-child(5) > div > div');
    if (!priceDiv) {
        updateStatus('未找到页面价格元素，跳过本次检查');
        return;
    }
         const gameName = (new XPathEvaluator())
    .evaluate("/html/body/div[1]/div[1]/div[3]/div/div/div/div[3]/div/div[1]/div", document, null, XPathResult.STRING_TYPE, null)
    .stringValue.trim();


    const text = priceDiv.textContent.replace(/[^\d.]/g, '');
    const pageFirstPrice = parseFloat(text);
    if (isNaN(pageFirstPrice) || pageFirstPrice > targetPrice) {
        updateStatus(`页面价格 ${pageFirstPrice} 不符合要求，跳过接口请求`);
        return;
    }
        const accessToken = localStorage.getItem('accessToken'); // 或从 cookie/session 中获取
        try {
    const listUrl = `https://steampy.com/xboot/steamKeySale/listSale?pageNumber=1&pageSize=10&sort=keyPrice&order=asc&gameId=${gameId}`;
    const resp = await fetch(listUrl, {
      headers: {
        'accessToken': accessToken,
        'Accept': 'application/json',
        'User-Agent': navigator.userAgent
      }
    });

    if (!resp.ok) throw new Error(`接口返回错误: ${resp.status}`);

    const data = await resp.json();
    const contentList = data?.result?.content;

    if (!Array.isArray(contentList) || contentList.length === 0) {
      updateStatus('接口返回无数据');
      return;
    }

    const firstItem = contentList[0];
    const apiPrice = parseFloat(firstItem.keyPrice);
    const saleId = firstItem.saleId;

    // 页面价格
    let pageFirstPrice = null;
    const priceDiv = document.querySelector('table tbody tr td:nth-child(5) > div > div');
    if (priceDiv) {
      const text = priceDiv.textContent.replace(/[^\d.]/g, '');
      pageFirstPrice = parseFloat(text);
    }

    updateStatus(`接口最低价: ${apiPrice} 元，页面最低价: ${pageFirstPrice} 元，目标价: ${targetPrice} 元`);

    if (!isNaN(apiPrice) && !isNaN(pageFirstPrice) && apiPrice <= targetPrice && apiPrice === pageFirstPrice) {
      updateStatus(`价格符合条件，准备下单 saleId=${saleId}`);
      isOrdering = true;

      const orderUrl = `https://steampy.com/xboot/steamKeyOrder/payOrder?payType=AI&saleId=${saleId}&walletFlag=useBalance`;

      try {
        const response = await fetch(orderUrl, {
          method: 'POST',
          headers: {
            'accessToken': accessToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': navigator.userAgent
          }
        });

        const result = await response.json();
        const message = result.message || '';
        recordLastOrderTime();

        if (result.success) {
          recordOrder(gameId);
          AudioManager.playEventSound();
          sendNotification(gameName, apiPrice, 'purchase_success');
          updateStatus(`✅ 下单成功`, `【${gameName}】￥${apiPrice}`);
        } else {
          isOrdering = false;
          if (message.includes("已售罄")) {
            updateStatus("❌ 已售罄", `${gameName} - ￥${apiPrice}`);
          } else if (message.includes("更换卖家") || message.includes("已被其他买家抢先")) {
            isOrdering = true;
            updateStatus("⚠️ 被抢先", `好价 ${gameName} ￥${apiPrice} 已被抢`);
          } else if (message.includes("您未支付的CDKey订单过多")) {
            sendNotification(gameName, apiPrice, 'unpaid_limit');
            updateStatus("⚠️ 未支付过多", `${gameName} 未支付订单过多，暂停下单`);
            pauseOrdering(300); // 300秒暂停
          } else {
            updateStatus(`其他失败: ${message}`);
          }
        }
      } catch (e) {
        console.error(`请求异常: ${e}`);
        updateStatus("❗ 请求异常", e.message);
        lastOrderTime = Date.now();
        return 'error';
      }
    } else {
      updateStatus('价格不符合条件，跳过下单');
    }
  } catch (e) {
    console.error(`整体流程异常: ${e}`);
    updateStatus("❗ 整体流程异常", e.message);
    return 'error';
  }
}


// 更新状态栏
function updateStatus(text) {
    statusArea.textContent = `状态：${text}`;
}

// 价格扫描函数
function scanPrices() {
    if (isPaused) return;
    //targetPriceInput.disabled = true;
    const targetPrice =getTargetPrice();
    if (isNaN(targetPrice)) {
        updateStatus('目标价格格式错误');
        return;
    }

    const priceEls = getPriceElements();
    let foundLow = false;

    priceEls.forEach(el => {
        const priceText = el.textContent.replace(/[^\d.]/g, '');
        const price = parseFloat(priceText);

        if (!isNaN(price)) {
            if (price <= targetPrice) {
                el.style.color = '#ff8800';
                el.style.fontWeight = 'bold';
                foundLow = true;
            } else {
                el.style.color = '';
                el.style.fontWeight = '';
            }
        }
    });

    if (foundLow) {
        updateStatus(`发现价格低于目标价 ${targetPrice} 元`);
        AudioManager.playBackground()
    } else {
        updateStatus(`未发现价格低于目标价 ${targetPrice} 元`);
         AudioManager.stopBackground()
    }

    // 自动下单
    if (enableAutoOrderCheckbox.checked) {
        checkAndOrder(targetPrice);
    }
}
let globalRefreshCount = parseInt(localStorage.getItem('globalRefreshCount') || '0', 10);

function incrementGlobalRefreshCount() {
    globalRefreshCount++;
    localStorage.setItem('globalRefreshCount', globalRefreshCount.toString());
    if (globalRefreshCount >= 600) {
        // 休息2-3分钟随机时间
        const restSeconds = 30 + Math.floor(Math.random() * 30);
        updateStatus(`刷新次数达到600次，休息 ${restSeconds} 秒...`);
        pauseOrdering(restSeconds); // 你的暂停函数，参数为秒
        // 重置计数
        globalRefreshCount = 0;
        localStorage.setItem('globalRefreshCount', '0');
    }
}
// 重新设置定时器
function resetIntervals() {
    if (scanIntervalId) clearInterval(scanIntervalId);
    if (refreshIntervalId) clearInterval(refreshIntervalId);

    const scanMs = parseInt(scanIntervalInput.value) || 1000;
    const refreshMs = parseInt(refreshIntervalInput.value) || 10000;

    scanIntervalId = setInterval(scanPrices, scanMs);

    if (refreshMs > 0) {
        refreshIntervalId = setInterval(() => {
            if (!isPaused){
                incrementGlobalRefreshCount(); // 页面刷新计数加1
                location.reload();}
        }, refreshMs);
    }
}
function getAutoTargetPrice() {
    // 获取前5个价格（默认升序）
    const priceCells = document.querySelectorAll('table tbody tr td:nth-child(5) div div');
    const prices = Array.from(priceCells).slice(0, 5).map(cell => parseFloat(cell.textContent.replace(/[^\d.]/g, '')));
   if (prices.length < 5 || prices.some(p => isNaN(p))) {
       updateStatus('价格获取失败，请检查页面结构或重试。');
       return 0;
    }

    // 判断5个价格是否都相等
   const allEqual = prices.every(p => p === prices[0]);
const allLow = prices.every(p => p <= 0.5);
if (allEqual && allLow) {
    updateStatus('这是垃圾填库游戏，5个价格完全相同且价格低于1元。');
    return 0;
}
    const midPrice = prices[2]; // 中位数是第3个元素（升序）

    if (midPrice < 0.5) {
        updateStatus('这是垃圾小游戏，中位数过低。');
        return 0;
    } else if (midPrice >= 0.5 && midPrice <= 1) {
        return parseFloat((midPrice * 0.22).toFixed(2));
    } else if (midPrice > 1 && midPrice < 10) {
        return parseFloat((midPrice * 0.3).toFixed(2));
    } else if (midPrice >= 10 && midPrice < 20) {
        return parseFloat((midPrice * 0.4).toFixed(2));
    } else if (midPrice >= 20) {
        return parseFloat((midPrice * 0.5).toFixed(2));
    }

    return 0;
}

function getTargetPrice() {
    if (autoTargetPriceCheckbox.checked) {
        try {
            return getAutoTargetPrice();
        } catch (e) {
             updateStatus('自动获取目标价格失败：', e);
        }
    }
    // 不启用自动价格时，读取输入框的值或默认参数
    return parseFloat(targetPriceInput.value) || parseFloat(defaultParams.targetPrice) || 0;
}
    if (autoTargetPriceCheckbox.checked) {
    targetPriceInput.disabled = true;
    const autoPrice = getAutoTargetPrice();
        if (!isNaN(autoPrice) && autoPrice !== 0) {
        targetPriceInput.value = autoPrice;}
    } else {
    targetPriceInput.disabled = false;
    }
// ✅ 默认勾选
// 默认勾选
//autoTargetPriceCheckbox.checked = true;
// 绑定事件
autoTargetPriceCheckbox.addEventListener('change', () => {
    const autoOn = autoTargetPriceCheckbox.checked;
    targetPriceInput.disabled = autoOn;
    params.autoTargetPrice = autoOn ? 'true' : 'false';

    if (autoOn) {
        const autoPrice = getAutoTargetPrice();
        if (!isNaN(autoPrice)) {
            targetPriceInput.value = autoPrice;
            params.targetPrice = autoPrice.toString();
        }
    }
    saveParams(params);
});

//页面加载时延迟触发一次 change 事件
window.addEventListener('load', () => {
   setTimeout(() => {
       autoTargetPriceCheckbox.dispatchEvent(new Event('change'));
       AudioManager.init();
      const enabled = enableSoundCheckbox.checked;
      AudioManager.setEnabled(enabled);
   }, 500);
});
targetPriceInput.addEventListener('change', () => {
    params.targetPrice = targetPriceInput.value;
    saveParams(params);
});
scanIntervalInput.addEventListener('change', () => {
    params.scanInterval = scanIntervalInput.value;
    saveParams(params);
    resetIntervals();
});
refreshIntervalInput.addEventListener('change', () => {
    params.refreshInterval = refreshIntervalInput.value;
    saveParams(params);
    resetIntervals();
});
enableSoundCheckbox.addEventListener('change', () => {
      const enable = enableSoundCheckbox.checked;
    params.enableSound = enable ? 'true' : 'false';
    saveParams(params);
    AudioManager.setEnabled(enable); // ✅ 无论开关都同步通知 AudioManager
    if (enable && !isPaused) {
        AudioManager.playBackground(); // ✅ 如果未暂停则立刻播放
    }
});
enableAutoOrderCheckbox.addEventListener('change', () => {
    params.enableAutoOrder = enableAutoOrderCheckbox.checked ? 'true' : 'false';
    saveParams(params);
});

btnPause.addEventListener('click', () => {
    isPaused = !isPaused;
    btnPause.textContent = isPaused ? '继续刷新' : '暂停刷新';
    updateStatus(isPaused ? '已暂停' : '继续扫描');
     if (isPaused) {
        AudioManager.stopBackground(); // 停止背景音
    } else if (enableSoundCheckbox.checked) {
        AudioManager.playBackground(); // 恢复播放
    }});
// 保存输入事件
bgSoundInput.addEventListener('change', () => {
  params.bgSoundUrl = bgSoundInput.value.trim();
  saveParams(params);
});
successSoundInput.addEventListener('change', () => {
  params.successSoundUrl = successSoundInput.value.trim();
  saveParams(params);
});
// 绑定复选框事件
chkIgnoreRecordCheckbox.addEventListener('change', () => {
    params.chkIgnoreRecord = chkIgnoreRecordCheckbox.checked ? 'true' : 'false';
    saveParams(params);
    if (chkIgnoreRecordCheckbox.checked) {
        // 勾选时，清除当前gameId的已购记录，并设置忽略标志
        orderedGameIds.delete(gameId);
        localStorage.setItem('orderedGameIds', JSON.stringify(Array.from(orderedGameIds)));
        ignoredGameId = gameId;
        updateStatus(`已忽略当前 GameID ${gameId} 的购买记录`);
    } else {
        // 取消勾选时，移除忽略标志
        ignoredGameId = null;
        updateStatus(`已取消忽略当前 GameID 购买记录`);
    }
});
btnClearAllParams.addEventListener('click', () => {
    if (!confirm('确认清除所有游戏的预存参数？此操作不可恢复！')) return;

    let removedCount = 0;
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('steamPyPriceHelperParams_')) {
            localStorage.removeItem(key);
            removedCount++;
        }
    }

    updateStatus(`已清除所有游戏预存参数，共计 ${removedCount} 条。默认参数已恢复。`);

    // 如果默认参数就是页面加载时的状态，刷新页面即可：
    location.reload();

    // 如果默认参数是某个JS对象，刷新页面不方便，可以调用一个初始化函数：
    // resetToDefaultParams();
});

btnManualRefresh.addEventListener('click', () => {
    location.reload();
});

// 页面加载后，启动定时扫描
resetIntervals();
scanPrices();
})();
