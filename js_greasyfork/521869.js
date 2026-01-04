// ==UserScript==
// @name         Auto Cick miniapp telegram Devhoanglv92
// @namespace    http://tampermonkey.net/
// @version      2025-1-16/1
// @description  Hỗ trợ autoclick telegram miniapp, kucoin, babydogeclikerbot, pepememe
// @author       devhoanglv92
// @match        *://www.kucoin.com/*
// @match        *://babydogeclikerbot.com/*
// @match        *://game.raccooncoonbot.xyz/*
// @match        *://app.hipogang.io/*
// @match        *://bumpstore.app/*
// @match        *://app.cexptap.com/*
// @icon         https://i.postimg.cc/brxR6L7c/128.png
// @grant        GM_log
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/521869/Auto%20Cick%20miniapp%20telegram%20Devhoanglv92.user.js
// @updateURL https://update.greasyfork.org/scripts/521869/Auto%20Cick%20miniapp%20telegram%20Devhoanglv92.meta.js
// ==/UserScript==

(function() {
  'use strict';
// app.cexptap.com/
let isRunning = false;
let isAutoClickerEnabled = false;
let clickSpeed = parseInt(localStorage.getItem('clickSpeed')) || 100;

function createPopup() {
  const popup = document.createElement('div');
  popup.id = 'autoclicker-popup';
popup.innerHTML = `
<div id="popup-container" style="
position: fixed;
bottom: 10px;
right: 10px;
background-color: rgba(0, 0, 0, 0.7);
color: white;
padding: 10px;
border-radius: 10px;
z-index: 10000;
font-size: 14px;
text-align: center;
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
width: 120px;
font-family: Arial, sans-serif;
">
  <button id="resize-button" style="
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 12px;
    padding: 0 5px;
  ">⛶</button>
  <div id="main-content">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <p style="margin: 0; font-weight: bold; font-size: 10px;">
        AUTO CLICK BY DEVHOANGLV92
      </p>
    </div>
    <button id="toggle-autoclicker" style="
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 8px 8px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 8px;
      font-weight: bold;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
      transition: background-color 0.3s;
      width: 100%;
    ">Bật Autoclick</button>
    <button id="settings-button" style="
      background-color: #2196F3;
      color: white;
      border: none;
      padding: 8px 8px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 8px;
      font-weight: bold;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
      margin-top: 8px;
      transition: background-color 0.3s;
      width: 100%;
    ">Cài đặt</button>
    <div id="settings-panel" style="display: none; margin-top: 10px;">
      <label for="click-speed" style="
        font-size: 8px;
        display: block;
        margin-bottom: 5px;
      ">
        Tốc độ Tap: <span id="click-speed-value">${clickSpeed}</span> ms
      </label>
      <input type="range" id="click-speed" min="20" max="1000" step="10" value="${clickSpeed}" style="
        width: 20px;
        height: 100px;
        -webkit-appearance: slider-vertical;
        writing-mode: bt-lr;
        margin: 0 auto;
        padding: 0;
      ">
    </div>
  </div>
</div>
`;

document.body.appendChild(popup);

const toggleButton = document.getElementById('toggle-autoclicker');
const speedSlider = document.getElementById('click-speed');
const speedValue = document.getElementById('click-speed-value');
const settingsButton = document.getElementById('settings-button');
const settingsPanel = document.getElementById('settings-panel');

const popupContainer = document.getElementById('popup-container');
const resizeButton = document.getElementById('resize-button');
let isExpanded = false;

resizeButton.addEventListener('click', () => {
  const mainContent = document.getElementById('main-content');
  if (isExpanded) {
    popupContainer.style.width = '120px';
    popupContainer.style.padding = '10px';
    mainContent.style.display = 'block';
    resizeButton.innerHTML = '⛶';
  } else {
    popupContainer.style.width = '30px';
    popupContainer.style.padding = '5px';
    mainContent.style.display = 'none';
    resizeButton.innerHTML = '⧉';
  }
  isExpanded = !isExpanded;
});

toggleButton.addEventListener('click', function() {
  handleStartOrStop(toggleButton)
});

speedSlider.addEventListener('input', function() {
  clickSpeed = parseInt(this.value);
  speedValue.textContent = clickSpeed + ' ms';
  localStorage.setItem('clickSpeed', clickSpeed);
});

settingsButton.addEventListener('click', function() {
if (settingsPanel.style.display === 'none') {
settingsPanel.style.display = 'block';
settingsButton.textContent = 'Đóng cài đặt';
settingsButton.style.backgroundColor = '#f44336';
} else {
settingsPanel.style.display = 'none';
settingsButton.textContent = 'Cài đặt';
settingsButton.style.backgroundColor = '#2196F3';
}
});

toggleButton.addEventListener('mouseover', function() {
  this.style.backgroundColor = isAutoClickerEnabled ? '#d32f2f' : '#45a049';
});

toggleButton.addEventListener('mouseout', function() {
  this.style.backgroundColor = isAutoClickerEnabled ? '#f44336' : '#4CAF50';
});

settingsButton.addEventListener('mouseover', function() {
  this.style.backgroundColor = settingsPanel.style.display === 'none' ? '#1976D2' : '#d32f2f';
});

settingsButton.addEventListener('mouseout', function() {
  this.style.backgroundColor = settingsPanel.style.display === 'none' ? '#2196F3' : '#f44336';
});
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleStartOrStop(toggleButton) {
  isAutoClickerEnabled = !isAutoClickerEnabled;
  toggleButton.textContent = isAutoClickerEnabled ? 'Tắt Autoclick' : 'Bật Autoclick';
  toggleButton.style.backgroundColor = isAutoClickerEnabled ? '#f44336' : '#4CAF50';
  isAutoClickerEnabled ? startAutoClicker() : stopAutoClicker();
}

function detectInputSupport() {
  const support = {
    touch: false,
    pointer: false,
    mouse: false
  };

  const listTouch = ['babydogeclikerbot.com', 'bumpstore.app', 'app.cexptap.com'];
  // Check touch support
  support.touch = listTouch.filter((x) => window.location.host.includes(x)).length > 0;

  // Check pointer support
  const listPointer = ['kucoin.com', 'raccooncoonbot.xyz', 'app.hipogang.io'];
  support.pointer = listPointer.filter((e) => window.location.host.includes(e)).length > 0;

  // Check mouse support
  support.mouse = 'onmousedown' in window;

  return support;
}

function simulateClick(element) {
  const rect = element.getBoundingClientRect();
  let x, y;
  if (window.location.host.includes('raccooncoonbot.xyz')) {
    x = getRandomInt(rect.left + 30, rect.right - 30);
    y = getRandomInt(rect.top, rect.bottom - 50)
  } else {
    x = getRandomInt(rect.left, rect.right);
    y = getRandomInt(rect.top, rect.bottom);
  }
  const support = detectInputSupport();

  // 1. Pointer Events (most modern)
  if (support.pointer) {
    const pointerEvents = ['pointerdown', 'pointerup', 'pointerover', 'pointerenter'];
    pointerEvents.forEach(eventType => {
      const pointerEvent = new PointerEvent(eventType, {
        view: unsafeWindow,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        pointerId: 1,
        pressure: 0.5,
      });
      element.dispatchEvent(pointerEvent);
    });
  }

  // 2. Touch Events
  if (support.touch) {
    const touchObj = new Touch({
      identifier: Date.now(),
      target: element,
      clientX: x,
      clientY: y,
      pageX: x,
      pageY: y,
      radiusX: 2.5,
      radiusY: 2.5,
      force: 0.5,
    });

    ['touchstart', 'touchend'].forEach(eventType => {
      element.dispatchEvent(new TouchEvent(eventType, {
        bubbles: true,
        cancelable: true,
        view: unsafeWindow,
        touches: [touchObj],
        targetTouches: [touchObj],
        changedTouches: [touchObj]
      }));
    });
  }

  // 3. Mouse Events
  if (support.mouse) {
    const mouseEvents = ['mousedown', 'mouseup', 'click'];
    mouseEvents.forEach(eventType => {
      const mouseEvent = new MouseEvent(eventType, {
        view: unsafeWindow,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        button: 0,
        buttons: 1,
      });
      element.dispatchEvent(mouseEvent);
    });
  }

  // 4. Focus Events
  ['focus', 'focusin'].forEach(eventType => {
    const focusEvent = new FocusEvent(eventType, {
      view: unsafeWindow,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(focusEvent);
  });
}

function getEnergy() {
  if (window.location.host.includes('bumpstore.app')) {
      return null;
  }
  let energyElement;
  if (window.location.host.includes('kucoin.com')) {
      energyElement = document.querySelector('.process--mIfwx');
      if (!energyElement) return null;
      const energy = parseInt(energyElement.querySelector('span').textContent, 10);
      return isNaN(energy) ? null : energy;
  } else if (window.location.host.includes('raccooncoonbot.xyz')) {
    energyElement = document.querySelector('p._remainingEnergy_1kdi8_40');
    if (!energyElement) return null;
    const energy = parseInt(energyElement.textContent.split('from')[0], 10);
    return isNaN(energy) ? null : energy;
  } else if (window.location.host.includes('app.hipogang.io')) {
    energyElement = $('span.font-medium')[0];
    if (!energyElement) return null;
    const energy = parseInt(energyElement.textContent.split(' / ')[0]);
    return isNaN(energy) ? null : energy;
  } else if (window.location.host.includes('app.cexptap.com')) {
      energyElement = $('.Work_energy__viuKv')[0].querySelector('span')
      if (!energyElement) return null;
      const energy = parseInt(energyElement.textContent.split(' / ')[0]);
      return isNaN(energy) ? null : energy;
  } else {
      const energyElement = $('p[data-v-f4e17ff6]')[0];
      const energy = parseInt(energyElement.textContent.split('/')[0]);
      return isNaN(energy) ? null : energy;
  }
}

function getFrogElement() {
    let element;
    if (window.location.host.includes('kucoin.com')) {
        element = $('body').find('g[clip-path="url(#__lottie_element_2)"]')[0];
    } else if (window.location.host.includes('babydogeclikerbot.com')) {
        element = $('body').find('div[data-testid="tap_doge"]').find('img')[0];
    } else if (window.location.host.includes('raccooncoonbot.xyz')) {
        element = document.querySelector('canvas');
    } else if (window.location.host.includes('app.hipogang.io')) {
      element = $('img[src="/assets/tap-DwglmcxY.png"]')[0].parentElement;
    } else if (window.location.host.includes('bumpstore.app')) {
        element = document.querySelector('svg.styled__Tap-sc-1lbly2t-14')
    } else if (window.location.host.includes('app.cexptap.com')) {
        element = document.querySelector('div.Work_job__1fr9b')
    }
    return element;
}

function dragElementToTarget(bot, direction) {
  const botRect = bot.getBoundingClientRect();
  const targetRect = direction.getBoundingClientRect();

  // Calculate start and end positions (center points)
  const startX = botRect.left + (botRect.width / 2);
  const startY = botRect.top + (botRect.height / 2);
  const endX = targetRect.left + (targetRect.width / 2) + 20;
  const endY = targetRect.top + (targetRect.height / 2) + 20;

  let progress = 0;
  const duration = 900; // ms - typical swipe duration
  const startTime = performance.now();

  // Initial touch
  const touch = new Touch({
    identifier: Date.now(),
    target: bot,
    clientX: startX,
    clientY: startY,
    pageX: startX,
    pageY: startY
  });

  // Start touch
  bot.dispatchEvent(new TouchEvent('touchstart', {
    bubbles: true,
    touches: [touch],
    targetTouches: [touch],
    changedTouches: [touch]
  }));

  const animate = (currentTime) => {
    progress = (currentTime - startTime) / duration;

    if (progress >= 1) {
      // End with slight overshoot
      const finalTouch = new Touch({
        identifier: touch.identifier,
        target: bot,
        clientX: endX,
        clientY: endY,
        pageX: endX,
        pageY: endY
      });

      bot.dispatchEvent(new TouchEvent('touchend', {
        bubbles: true,
        touches: [],
        targetTouches: [],
        changedTouches: [finalTouch]
      }));
      return;
    }

    // Easing function for natural movement
    const easing = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const easedProgress = easing(progress);

    // Calculate current position
    const currentX = startX + (endX - startX) * easedProgress;
    const currentY = startY + (endY - startY) * easedProgress;

    const moveTouch = new Touch({
      identifier: touch.identifier,
      target: bot,
      clientX: currentX,
      clientY: currentY,
      pageX: currentX,
      pageY: currentY
    });

    bot.dispatchEvent(new TouchEvent('touchmove', {
      bubbles: true,
      touches: [moveTouch],
      targetTouches: [moveTouch],
      changedTouches: [moveTouch]
    }));

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

function startAutoClicker() {
  if (!isAutoClickerEnabled) return;
  const frogElement = getFrogElement();
  if (!frogElement) {
    if ((window.location.host.includes('bumpstore.app'))) {
      const divParent = document.querySelector('div.styled__InProgress-sc-1lbly2t-15');
      const checkBot = document.querySelector('div.styled__Circle-sc-gmgdwx-2');
      const checkBot2 = $('div[x="0"][y="0"]')[0];
      const bot = checkBot || checkBot2;
      let direction = document.querySelector('div.styled__EndCircle-sc-gmgdwx-3');
      dragElementToTarget(bot, direction);
    }
    setTimeout(startAutoClicker, 1000);
    return;
  }
  const energy = getEnergy();
  if (energy && energy === 0) {
    const waitTime = getRandomInt(30000, 60000);
      Swal.fire({
                title: 'thông báo!',
                position: "top-end",
                text: `Năng lượng bằng 0, tạm dừng trong ${waitTime/1000} giây`,
                type: 'warning',
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
            });
    console.log(`Năng lượng bằng 0, tạm dừng trong ${waitTime/1000} giây`);
    setTimeout(startAutoClicker, waitTime);
  } else {
    simulateClick(frogElement);
    setTimeout(startAutoClicker, clickSpeed);
  }
}

function stopAutoClicker() {
  console.log('Auto đã dừng!');
}

function checkAndStart() {
  if (!isRunning && window.location.href.includes('/miniapp/tap-game')) {
    console.log('Bắt đầu chạy Auto...');
    isRunning = true;
    setTimeout(startAutoClicker, 5000);
  }
}

createPopup();
checkAndStart();

const observer = new MutationObserver(() => {
  checkAndStart();
});
observer.observe(document.body, { childList: true, subtree: true });

})();
