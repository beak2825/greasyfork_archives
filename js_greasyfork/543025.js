// ==UserScript==
// @name        New script overnads.xyz
// @namespace   Violentmonkey Scripts
// @match       https://app.overnads.xyz/home*
// @grant       none
// @version     1.0
// @author      -
// @description 7/19/2025, 10:47:30 PM
// @user_url  https://x.com/asd576895195
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/543025/New%20script%20overnadsxyz.user.js
// @updateURL https://update.greasyfork.org/scripts/543025/New%20script%20overnadsxyz.meta.js
// ==/UserScript==

console.log("⚙️ 启动：自动循环 PLAY / CLAIM + 道具点击（跳过炸弹和 Freezes）");

// 新增：全局点击频率控制（毫秒）
let CLICK_INTERVAL = 500; // 默认每次点击间隔 500ms，可根据需要调整

const clickedSet = new WeakSet();

// 模拟真实点击
function realClick(el, repeat= true) {
  if (!el || !repeat && clickedSet.has(el)) return;
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const num = Math.floor(Math.random() * 20) + 1;
  if (num >= 15) {
    return;
  }
  ['pointerdown', 'mousedown', 'mouseup', 'click', 'dblclick'].forEach(type => {
    el.dispatchEvent(new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      button: 0
    }));
  });
  clickedSet.add(el);
}

// 检查 Freezes / Wings Down
function containsFreezes(el) {
  if (!el) return false;
  const attributesToCheck = [
    el.className || '',
    el.id || '',
    el.getAttribute('data-name') || '',
    el.getAttribute('data-type') || '',
    el.getAttribute('title') || '',
    el.getAttribute('aria-label') || '',
    el.textContent || ''
  ];
  const freezeRegex = /freezes|wings down|freeze/i;
  if (attributesToCheck.some(attr => freezeRegex.test(attr))) return true;
  const parent = el.parentElement;
  if (parent && (parent.className || '').toLowerCase().includes('freeze')) return true;
  for (const child of el.children) {
    if (containsFreezes(child)) return true;
  }
  return false;
}

// 检查炸弹或冰冻
function isBombOrIce(el) {
  if (!el) return false;
  const classStr = (el.className || '').toLowerCase();
  if (classStr.includes('bomb') || classStr.includes('bomb-icon')) return true;
  if (containsFreezes(el)) return true;
  return false;
}

// 道具点击观察器
const observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof HTMLElement)) return;
      if (!isBombOrIce(node)) {
        setTimeout(() => {
          if (!isBombOrIce(node)) {
            try {
              realClick(node, false);
            } catch (e) {
              console.warn("❌ 点击失败：", e);
            }
          }
        }, 1500);
      }
    });
  }
});

let countdownObserver = null;

// 等待倒计时
function waitForCountdownElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);
    const obs = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        obs.disconnect();
        resolve(el);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    if (timeout > 0) {
      setTimeout(() => {
        obs.disconnect();
        reject(new Error("等待倒计时元素超时"));
      }, timeout);
    }
  });
}

// 自动等待并点击按钮
function waitAndClickButton(text, interval = 1000) {
  return new Promise(resolve => {
    const timer = setInterval(() => {
      const btns = Array.from(document.querySelectorAll('.base-button'))
          .filter(el =>
              el.textContent.trim().toUpperCase() === text.toUpperCase()
          );

      if (btns.length > 0) {
        const targetBtn = btns[btns.length - 1]; // 选最后一个，通常是最新的
        realClick(targetBtn);
        realClick(targetBtn);
        console.log(`▶️ 已点击 ${text} 按钮:`, targetBtn.outerHTML);
        clearInterval(timer);
        resolve();
      }
    }, interval);
  });
}


// 启动一轮
function startRound() {
  console.log("🔄 新一轮：等待并点击 PLAY");
  waitAndClickButton("PLAY").then(() => {
    observer.observe(document.body, { childList: true, subtree: true });
    waitForCountdownElement('.counter.timer').then(countdownEl => {
      console.log("✅ 监听倒计时");
      countdownObserver = new MutationObserver(() => {
        const text = countdownEl.textContent.trim();
        const parts = text.match(/\d+/g);
        if (parts && parts.length >= 2) {
          const seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
          if (!isNaN(seconds) && seconds <= 5) {
            console.log("⏳ 倒计时≤3秒，准备结束");
            endRound();
          }
        }
      });
      countdownObserver.observe(countdownEl, { characterData: true, subtree: true, childList: true });
    }).catch(() => console.warn("❌ 找不到倒计时元素"));
  });
}

// 结束一轮
function endRound() {
  observer.disconnect();
  if (countdownObserver) countdownObserver.disconnect();
  console.log("🛑 本轮结束：等待并点击 CLAIM");
  waitAndClickButton("CLAIM").then(() => {
    console.log("✅ 已点击 CLAIM，5 秒后开始下一轮");
    setTimeout(() => startRound(), 5000);
  });
}

// 启动循环
startRound();
