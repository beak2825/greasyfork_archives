// ==UserScript==
// @name        浏览器你长这么大了要学会自己播放 - EASY在线
// @namespace   Violentmonkey Scripts
// @match       https://neancts.gdei.edu.cn/*
// @grant       none
// @license     MIT
// @icon        https://neancts.gdei.edu.cn/common/vue/img/userCenter/boy_head.png
// @version     0.98
// @author      OpenAI GPT & BLUE声色
// @description 2025年6月11日更新，大食省专用！
// @downloadURL https://update.greasyfork.org/scripts/539128/%E6%B5%8F%E8%A7%88%E5%99%A8%E4%BD%A0%E9%95%BF%E8%BF%99%E4%B9%88%E5%A4%A7%E4%BA%86%E8%A6%81%E5%AD%A6%E4%BC%9A%E8%87%AA%E5%B7%B1%E6%92%AD%E6%94%BE%20-%20EASY%E5%9C%A8%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/539128/%E6%B5%8F%E8%A7%88%E5%99%A8%E4%BD%A0%E9%95%BF%E8%BF%99%E4%B9%88%E5%A4%A7%E4%BA%86%E8%A6%81%E5%AD%A6%E4%BC%9A%E8%87%AA%E5%B7%B1%E6%92%AD%E6%94%BE%20-%20EASY%E5%9C%A8%E7%BA%BF.meta.js
// ==/UserScript==

function ensureVideoPlaying() {
  const video = document.querySelector('video');
  if (video) {
    video.muted = true;         // 静音
    video.volume = 0;           // 双保险：静音音量
    if (video.paused) {
      video.play();
    }
  }
}

ensureVideoPlaying();

// 👁️ 模拟页面始终处于激活状态
Object.defineProperty(document, 'hidden', {
  get: () => false,
  configurable: true
});
Object.defineProperty(document, 'visibilityState', {
  get: () => 'visible',
  configurable: true
});
document.addEventListener('visibilitychange', (e) => {
  e.stopImmediatePropagation();
}, true);
setInterval(() => {
  window.dispatchEvent(new Event('focus'));
}, 15000);

function clickContinueCourse() {
  const btns = document.querySelectorAll('button.mylayer-btn3');
  const contBtn = Array.from(btns).find(btn => btn.textContent.includes('继续学习'));
  if (contBtn) {
    contBtn.click();
  }
}

function clickCompletedConfirm() {
  const doneBtn = Array.from(document.querySelectorAll('button.mylayer-btn.type1'))
    .find(btn => btn.textContent.includes('确定'));
  if (doneBtn) {
    doneBtn.click();
  }
}

function simulateScrollActivity() {
  const scrollAmount = 1; // 1像素
  const direction = Math.random() > 0.5 ? 1 : -1;
  window.scrollBy(0, scrollAmount * direction);
}

function simulateMouseMove() {
    const video = document.querySelector("video");
    if (video) {
        const evt = new MouseEvent("mousemove", {
            view: window,
            bubbles: true,
            cancelable: true
        });
        video.dispatchEvent(evt);
    }
}

function simulateClickOnBody() {
  const evt = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: 10,
    clientY: 10
  });
  document.body.dispatchEvent(evt);
}

function checkAndClickNext() {
  try {
    const p = document.querySelector('div.g-study-prompt > p');
    const text = p?.textContent || '';
    const hasCompletedText = text.includes('您已完成观看');

    // 提取分钟数字
    const spanEls = p?.querySelectorAll('span');
    let requiredMin = 0, watchedMin = 0;
    if (spanEls?.length >= 2) {
      requiredMin = parseInt(spanEls[0].textContent.trim(), 10) || 0;
      watchedMin = parseInt(spanEls[1].textContent.trim(), 10) || 0;
    }

    const watchEnough = watchedMin >= requiredMin && requiredMin > 0;

    const shouldClickNext = hasCompletedText || watchEnough;

    if (shouldClickNext) {
      const nextBtnIcon = Array.from(document.querySelectorAll('i.tag'))
        .find(el => el.textContent.includes('下一活动'));
      const nextBtn = nextBtnIcon?.closest('a.btn-next');

      if (nextBtn) {
        console.log('✅ 满足完成条件 → 点击“下一活动”按钮！');
        nextBtn.click();
      } else {
        console.warn('⚠️ 找不到“下一活动”按钮');
      }
    }
  } catch (err) {
    console.error('❌ 检查下一活动时出错：', err);
  }
}

// 🔔 通知函数（async）
async function notifyUser(message) {
  if (Notification.permission === 'granted') {
    new Notification('📘 EASY在线提醒', {
      body: message,
    });
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('📘 EASY在线提醒', {
        body: message,
      });
    } else {
      alert(message); // 拒绝通知权限用 alert 替代
    }
  } else {
    alert(message); // 通知被拒绝则用 alert
  }
}

// 每 5 秒执行一次的操作
setInterval(() => {
  ensureVideoPlaying();
  clickCompletedConfirm();
  checkAndClickNext();
}, 5 * 1000);

// 每 7 秒执行一次的操作
setInterval(() => {
  clickContinueCourse();
}, 7 * 1000);

// 每 13 秒执行一次的操作
setInterval(() => {
  simulateScrollActivity();
  simulateClickOnBody();
}, 13 * 1000);
  
// 每 17 秒执行一次的操作
setInterval(() => {
  simulateMouseMove();
}, 17 * 1000);