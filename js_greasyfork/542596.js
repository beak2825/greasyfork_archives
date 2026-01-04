// ==UserScript==
// @name        内存监控控制台
// @namespace   MemoryMonitor Scripts
// @match        *://*/*
// @grant       none
// @version     3.18
// @author      sum-one
// @description 11 月 21 日
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542596/%E5%86%85%E5%AD%98%E7%9B%91%E6%8E%A7%E6%8E%A7%E5%88%B6%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/542596/%E5%86%85%E5%AD%98%E7%9B%91%E6%8E%A7%E6%8E%A7%E5%88%B6%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    let timer = null;

    function addDom() {
      const css = `
          .memory-info-div {
              position: fixed;
              bottom: 10px;
              right: 10px;
              border: 1px solid #0f0; /* 绿色边框 */
              background-color: #000; /* 黑色背景 */
              color: #0f0; /* 绿色文字 */
              padding: 5px;
              z-index: 100000000;
              opacity: 0.7; /* 透明度 */
              font-family: Consolas, "Courier New", monospace; /* 控制台字体 */
              user-select: none; /* 防止文本被选择 */
              display: none;
              cursor: grab;
              width: 320px; /* 设置宽度 */
              text-align: center; /* 居中对齐 */
          }
          .memory-info-row {
              min-width:100px;
          }
          .memory-info-title {
              margin-top: -10px;
              font-size: 12px; /* 较小的字体 */
              line-height:18px;
          }
          .memory-info-value {
              font-size: 24px; /* 较大的字体 */
              line-height:34px;
              font-weight: bold; /* 加粗字体 */
          }
      `;
      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = css;
      document.head.appendChild(styleSheet);

      const memoryInfoDiv = document.createElement('div');
      memoryInfoDiv.classList.add('memory-info-div');
      memoryInfoDiv.setAttribute('owl-ignore', '');
      document.body.appendChild(memoryInfoDiv);
      return memoryInfoDiv
    }

    const memoryInfoDiv = addDom();

    // 拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    memoryInfoDiv.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - memoryInfoDiv.getBoundingClientRect().left;
        offsetY = e.clientY - memoryInfoDiv.getBoundingClientRect().top;
        memoryInfoDiv.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        memoryInfoDiv.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            memoryInfoDiv.style.left = (e.clientX - offsetX) + 'px';
            memoryInfoDiv.style.top = (e.clientY - offsetY) + 'px';
            memoryInfoDiv.style.right = 'auto';
            memoryInfoDiv.style.bottom = 'auto';

            // 保存位置
            localStorage.setItem('memoryInfoDivPosition', JSON.stringify({
              left: memoryInfoDiv.style.left,
              top: memoryInfoDiv.style.top
            }));
        }
    });

    // 更新内存信息的函数
    function updateMemoryInfo() {
      const memory = window.performance.memory;
      if (!memory) {
          memoryInfoDiv.textContent = "Performance API is not supported in this browser.";
          return;
      }
      function toGB(bytes) {
          const gb = bytes / 1024 / 1024 / 1024;
          const mb = bytes / 1024 / 1024;

          // 如果不足1GB，则以MB显示
          if (gb < 1) {
              return mb.toFixed(0) + 'M';
          } else {
              // 如果是整数GB，则不显示小数
              if (gb.toFixed(2) % 1 === 0) {
                  return gb.toFixed(0) + 'G';
              } else {
                  return gb.toFixed(2) + 'G';
              }
          }
      }
      const totalMemory = toGB(memory.jsHeapSizeLimit);
      const usedMemory = toGB(memory.usedJSHeapSize);
      const freeMemory = toGB(memory.jsHeapSizeLimit - memory.usedJSHeapSize);
      const usageRate = ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2) + '%';
      const freeRate = ((1 - memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2) + '%';

      memoryInfoDiv.innerHTML = `
          <div class="memory-info-row">
              <div class="memory-info-value">${totalMemory}</div>
              <div class="memory-info-title">Total</div>
          </div>
          <div class="memory-info-row">
              <div class="memory-info-value">${usedMemory}</div>
              <div class="memory-info-title">Used</div>
          </div>
          <div class="memory-info-row">
              <div class="memory-info-value">${usageRate}</div>
              <div class="memory-info-title">Usage</div>
          </div>
      `;
    }

    function init() {
        clearInterval(timer);
        timer = setInterval(updateMemoryInfo, 60);
        memoryInfoDiv.style.display = 'flex';
        localStorage.setItem('memoryInfoDivVisible', 'true');
    }

    function destroy() {
        clearInterval(timer);
        memoryInfoDiv.style.display = 'none';
        localStorage.setItem('memoryInfoDivVisible', 'false');
    }

    // 从localStorage加载状态和位置
    const savedVisible = localStorage.getItem('memoryInfoDivVisible');
    const savedPosition = JSON.parse(localStorage.getItem('memoryInfoDivPosition'));

    if (savedVisible === 'true') {
        init();
    } else {
        destroy();
    }

    if (savedPosition) {
        memoryInfoDiv.style.left = savedPosition.left || 0;
        memoryInfoDiv.style.top = savedPosition.top || 0;
        memoryInfoDiv.style.right = 'auto';
        memoryInfoDiv.style.bottom = 'auto';
    }

    // 键盘事件监听器，用于切换浮窗显示状态
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F10') {
            event.preventDefault(); // 防止F10默认行为
            if (memoryInfoDiv.style.display === 'none') {
                init();
            } else {
                destroy();
            }
        }
    });
})();
