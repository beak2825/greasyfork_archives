// ==UserScript==
// @name         SpeedUp – 长按空格倍速播放视频
// @namespace    https://github.com/echowav
// @version      0.0.4
// @description  快速视频播放脚本，支持长按空格键加速视频播放
// @description:en Speed up video playback with long press on space
// @author       echowav
// @match        *://*/*
// @icon         null
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545989/SpeedUp%20%E2%80%93%20%E9%95%BF%E6%8C%89%E7%A9%BA%E6%A0%BC%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/545989/SpeedUp%20%E2%80%93%20%E9%95%BF%E6%8C%89%E7%A9%BA%E6%A0%BC%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
let policy;

/**
 * Returns the Trusted Types policy, or null if Trusted Types are not
 * enabled/supported. The first call to this function will create the policy.
 */
function getPolicy() {
  if (policy === undefined) {
    const trustedTypes = window.trustedTypes;
    policy = null;

    if (trustedTypes) {
      try {
        policy = trustedTypes.createPolicy('escape', {
          createHTML: s => s,
        });
      } catch {
        // trustedTypes.createPolicy throws if called with a name that is
        // already registered, even in report-only mode. Until the API changes,
        // catch the error not to break the applications functionally. In such
        // cases, the code will fall back to using strings.
      }
    }
  }
  return policy;
}

function trustedHTMLFromString(html) {
  return getPolicy()?.createHTML(html) || html;
}

function useLongPress(target, {
  onStart = () => {},
  onHold = null,
  onLongPress = () => {},
  onClick = () => {},
  onRelease = () => {},
  onReleaseAfterLong = () => {},

  duration = 800,
  holdInterval = 100,
  preventDefault = false,
  capture = false,

  disabled = () => true,
} = {}) {
  let isPressed = false;
  let longPressTriggered = false;
  let longPressTimer = null;
  let holdIntervalTimer = null;
  let totalHoldTime = 0;

  const clear = (event) => {
    if (disabled(event)) return;

    if (!isPressed) return;
    isPressed = false;

    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    if (holdIntervalTimer) {
      clearInterval(holdIntervalTimer);
      holdIntervalTimer = null;
    }

    onRelease(event);

    if (longPressTriggered) {
      onReleaseAfterLong(event);
    } else {
      onClick(event);
    }

    longPressTriggered = false;
  };

  const start = (event) => {
    if (disabled(event)) return;

    if (preventDefault) event.preventDefault();

    if (isPressed) return;
    isPressed = true;
    longPressTriggered = false;
    totalHoldTime = 0;

    onStart(event);

    // 设置长按判定
    longPressTimer = setTimeout(() => {
      if (isPressed && !longPressTriggered) {
        longPressTriggered = true;
        onLongPress(event);
      }
    }, duration);

    // 设置持续 onHold
    if (onHold) {
      holdIntervalTimer = setInterval(() => {
        if (isPressed) {
          totalHoldTime += holdInterval;
          onHold(event, { duration: totalHoldTime, triggered: longPressTriggered });
        }
      }, holdInterval);
    }
  };

  // ========== 工具：统一添加事件并返回解绑函数 ==========
  const addEvent = (target, type, handler) => {
    target.addEventListener(type, handler, { capture });
    return () => target.removeEventListener(type, handler, { capture });
  };

  // ========== 情况 1：DOM 元素（鼠标 + 触摸）==========
  if (target instanceof Element) {
    const cleanupFns = [];

    // 主事件
    cleanupFns.push(addEvent(target, 'mousedown', start));
    cleanupFns.push(addEvent(target, 'touchstart', start));

    // 全局释放事件（必须绑定到 document，也应支持 capture）
    cleanupFns.push(addEvent(document, 'mouseup', clear));
    cleanupFns.push(addEvent(document, 'touchend', clear));
    cleanupFns.push(addEvent(document, 'touchcancel', clear));

    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }

  // ========== 情况 2：键盘按键 ==========
  else if (typeof target === 'string') {
    const keyDownHandler = (e) => {
      if (disabled(e)) return;

      if (e.code === target) {
        if (!isPressed) {
          start(e);
        }
        if (isPressed && e.repeat) {
          // 如果是重复按下，直接忽略
          e.stopPropagation();
          e.preventDefault();
          return;
        }
      }
    };

    const keyUpHandler = (e) => {
      if (disabled(e)) return;

      if (e.code === target && isPressed) {
        clear(e);
      }
    };

    const cleanupKeydown = addEvent(document, 'keydown', keyDownHandler);
    const cleanupKeyup = addEvent(document, 'keyup', keyUpHandler);

    return () => {
      cleanupKeydown();
      cleanupKeyup();
    };
  }

  console.warn('useLongPress: Unsupported target type');
  return () => {};
}

let video = null;
let isSpeedUp = false;
let speedIndicator = null;

const LONG_PRESS_DURATION = 500;

function createSpeedIndicator() {
  if (speedIndicator) return;

  speedIndicator = document.createElement('div');
  speedIndicator.innerHTML = trustedHTMLFromString(`
    <span>2x</span>
    <div id="triangle-container">
      <div id="triangle1"></div>
      <div id="triangle2" style="margin-left: 2px;"></div>
    </div>
  `);

  speedIndicator.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: #fffe;
    height: 40px;
    box-sizing: border-box;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 18px;
    font-weight: bold;
    z-index: 9999;
    display: none;
    pointer-events: none;

    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);

    display: flex;
    align-items: center;
    gap: 8px;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0.4; }
      50% { opacity: 0.9; }
      100% { opacity: 0.4; }
    }
    #triangle-container {
      display: flex;
    }
    #triangle1, #triangle2 {
      width: 0;
      height: 0;
      border-left: 8px solid #fff;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
    }
    #triangle1 {
      animation: fadeInOut 1s ease-in-out infinite;
      animation-delay: -0.25s;
    }
    #triangle2 {
      animation: fadeInOut 1s ease-in-out infinite;
    }
  `;

  speedIndicator.prepend(style);
}

function showSpeedIndicator() {
  if (!video) return;

  if (!speedIndicator) {
    createSpeedIndicator();
  }

  if (speedIndicator && !speedIndicator.parentNode) {
    video.parentNode?.appendChild(speedIndicator);
  }

  updateIndicatorPosition();
  if (speedIndicator) {
    speedIndicator.style.display = 'flex';
  }
}

function updateIndicatorPosition() {
  if (!speedIndicator || !video) return;

  const videoRect = video.getBoundingClientRect();

  const leftOffset = videoRect.left + videoRect.width / 2;
  speedIndicator.style.left = `${leftOffset}px`;
  speedIndicator.style.top = `${videoRect.top + 20}px`;
}

function hideSpeedIndicator() {
  if (speedIndicator) {
    speedIndicator.style.display = 'none';
  }
}

function findVideo() {
  return document.querySelector('video');
}

function restoreNormalSpeed() {
  if (!video) return;

  isSpeedUp = false;
  video.playbackRate = 1.0;
  hideSpeedIndicator();
}

function speedUp() {
  if (!video) return;

  isSpeedUp = true;
  video.playbackRate = 2.0;
  showSpeedIndicator();
}

window.addEventListener('scroll', () => {
  if (isSpeedUp && video) {
    updateIndicatorPosition();
  }
});

window.addEventListener('resize', () => {
  if (isSpeedUp && video) {
    updateIndicatorPosition();
  }
});

// DOMContentLoaded 后监听新元素插入（如动态加载的视频）
document.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver(() => {
    if (!video) {
      video = findVideo();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

// 监听 DOM 变化以更新指示器位置（如样式或类名改变影响布局）
const positionObserver = new MutationObserver(() => {
  if (isSpeedUp && video) {
    updateIndicatorPosition();
  }
});

positionObserver.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['style', 'class'],
});


function togglePlayPause() {
  if (!video) return;
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

const isInputArea = (e) => {
  const target = e.target;
  return /input|textarea/i.test(target.tagName) ||
         target.contentEditable === 'true' ||
         target.isContentEditable;
}

useLongPress('Space', {
  onStart: (e) => {
    e.preventDefault();
    e.stopPropagation();
    video = findVideo();
  },
  onLongPress: () => {
    speedUp();
  },
  onRelease: (e) => {
    e.preventDefault();
    e.stopPropagation();
    restoreNormalSpeed();
  },
  onClick: () => {
    togglePlayPause();
  },
  disabled: isInputArea,
  preventDefault: true,
  capture: true,
  duration: LONG_PRESS_DURATION,
})
})();
