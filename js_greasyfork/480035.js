// ==UserScript==
// @name        内存监控控制台（全背景图表）
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     2.6
// @author      K
// @description 2025 年 1 月 17 日
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480035/%E5%86%85%E5%AD%98%E7%9B%91%E6%8E%A7%E6%8E%A7%E5%88%B6%E5%8F%B0%EF%BC%88%E5%85%A8%E8%83%8C%E6%99%AF%E5%9B%BE%E8%A1%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/480035/%E5%86%85%E5%AD%98%E7%9B%91%E6%8E%A7%E6%8E%A7%E5%88%B6%E5%8F%B0%EF%BC%88%E5%85%A8%E8%83%8C%E6%99%AF%E5%9B%BE%E8%A1%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  class MemoryStats {
    constructor() {
      this.container = document.createElement('div');
      this.container.id = 'memoryStatsContainer';

      this.canvas = document.createElement('canvas');
      this.container.appendChild(this.canvas);

      this.ctx = this.canvas.getContext('2d');
      this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, 'rgba(0, 255, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 255, 0, 0.05)');
      this.ctx.fillStyle = gradient;

      this.MAX_DATA_POINTS = 200;
      this.values = new Array(this.MAX_DATA_POINTS).fill(0);
      this.maxMem = 0;

      window.addEventListener('resize', () => this.resize());
    }

    setMaxMem(value) {
      this.maxMem = value;
    }

    update(value) {
      const WIDTH = this.canvas.width;
      const HEIGHT = this.canvas.height;
      const CHART_HEIGHT = HEIGHT * 0.7;

      const gradient = this.ctx.createLinearGradient(0, 0, 0, HEIGHT);
      gradient.addColorStop(0, 'rgba(0, 255, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 255, 0, 0.05)');
      this.ctx.fillStyle = gradient;

      for (let i = 0; i < this.MAX_DATA_POINTS - 1; i++) {
        this.values[i] = this.values[i + 1];
      }
      this.values[this.MAX_DATA_POINTS - 1] = value;

      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
      this.ctx.beginPath();
      this.ctx.moveTo(0, HEIGHT);

      for (let i = 0; i < this.MAX_DATA_POINTS; i++) {
        const x = (i / (this.MAX_DATA_POINTS - 1)) * WIDTH;
        const y = HEIGHT - (this.values[i] / this.maxMem) * CHART_HEIGHT;
        this.ctx.lineTo(x, y);
      }

      this.ctx.lineTo(WIDTH, HEIGHT);
      this.ctx.globalAlpha = 0.5;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
      this.ctx.stroke();
    }

    resize() {
      this.canvas.width = this.container.clientWidth;
      this.canvas.height = this.container.clientHeight;
      this.update(this.values[this.values.length - 1]);
    }

    get domElement() {
      return this.container;
    }
  }

  class MemoryMonitor {
    constructor() {
      this.timer = null;
      this.maxMem = 0;
      this.memoryStats = new MemoryStats();
      this.memoryInfoDiv = this.addDom();
      this.isDragging = false;
      this.offsetX = 0;
      this.offsetY = 0;

      this.initDragEvents();
      this.initKeyboardEvents();
      this.loadSavedState();
    }

    addDom() {
      const css = `
        .memory-info-div {
          position: fixed;
          bottom: 10px;
          right: 10px;
          border: 1px solid #00FF00;
          background-color: rgba(0, 0, 0, 0.8);
          color: #00FF00;
          padding: 5px;
          z-index: 100000000;
          font-family: 'Courier New', monospace;
          user-select: none;
          display: none;
          cursor: grab;
          width: 200px;
          height: 60px;
          text-align: center;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
          overflow: hidden;
        }
        .memory-info-container {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 100%;
        }
        .memory-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 5px;
        }
        .memory-info-title {
          font-size: 10px;
          line-height: 14px;
          opacity: 0.8;
          color: rgba(0, 255, 0, 0.8);
        }
        .memory-info-value {
          font-size: 14px;
          line-height: 18px;
          font-weight: bold;
          color: #00FF00;
          text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
        }
        #memoryStatsContainer {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          opacity: 1;
        }
        #memoryStatsContainer canvas {
          width: 100%;
          height: 100%;
        }
      `;

      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = css;
      document.head.appendChild(styleSheet);

      const div = document.createElement('div');
      div.classList.add('memory-info-div');
      div.setAttribute('owl-ignore', '');
      document.body.appendChild(div);
      return div;
    }

    initDragEvents() {
      this.memoryInfoDiv.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.offsetX = e.clientX - this.memoryInfoDiv.getBoundingClientRect().left;
        this.offsetY = e.clientY - this.memoryInfoDiv.getBoundingClientRect().top;
        this.memoryInfoDiv.style.cursor = 'grabbing';
      });

      document.addEventListener('mouseup', () => {
        this.isDragging = false;
        this.memoryInfoDiv.style.cursor = 'grab';
      });

      document.addEventListener('mousemove', (e) => {
        if (this.isDragging) {
          this.memoryInfoDiv.style.left = (e.clientX - this.offsetX) + 'px';
          this.memoryInfoDiv.style.top = (e.clientY - this.offsetY) + 'px';
          this.memoryInfoDiv.style.right = 'auto';
          this.memoryInfoDiv.style.bottom = 'auto';

          localStorage.setItem('memoryInfoDivPosition', JSON.stringify({
            left: this.memoryInfoDiv.style.left,
            top: this.memoryInfoDiv.style.top
          }));
        }
      });
    }

    toGB(bytes) {
      const gb = bytes / 1024 / 1024 / 1024;
      const mb = bytes / 1024 / 1024;

      if (gb < 1) {
        return mb.toFixed(0) + 'M';
      } else {
        return gb.toFixed(2) % 1 === 0 ? gb.toFixed(0) + 'G' : gb.toFixed(2) + 'G';
      }
    }

    updateMemoryInfo() {
      const memory = window.performance.memory;
      if (!memory) {
        this.memoryInfoDiv.textContent = "Performance API is not supported in this browser.";
        return;
      }

      this.maxMem = Math.max(memory.usedJSHeapSize, this.maxMem);
      const dynamicMaxMem = Math.min(
        memory.jsHeapSizeLimit,
        Math.max(memory.usedJSHeapSize * 1.5, 512 * 1024 * 1024) // 最小显示 512MB
      );
      this.memoryStats.setMaxMem(dynamicMaxMem);
      const totalMemory = this.toGB(memory.jsHeapSizeLimit);
      const usedMemory = this.toGB(memory.usedJSHeapSize);
      const maxMemory = this.toGB(this.maxMem);
      const usageRate = ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2) + '%';

      this.memoryInfoDiv.innerHTML = `
        <div id="memoryStatsContainer"></div>
        <div class="memory-info-container">
          <div class="memory-info-row">
            <span class="memory-info-title">Max/Total:</span>
            <span class="memory-info-value">${maxMemory}/${totalMemory}</span>
          </div>
          <div class="memory-info-row">
            <span class="memory-info-title">Used:</span>
            <span class="memory-info-value">${usedMemory}</span>
          </div>
          <div class="memory-info-row">
            <span class="memory-info-title">Usage:</span>
            <span class="memory-info-value">${usageRate}</span>
          </div>
        </div>
      `;

      this.memoryInfoDiv.appendChild(this.memoryStats.domElement);
      this.memoryStats.resize();
      this.memoryStats.update(memory.usedJSHeapSize);
    }

    init() {
      clearInterval(this.timer);
      this.timer = setInterval(() => this.updateMemoryInfo(), 150);
      this.memoryInfoDiv.style.display = 'block';
      localStorage.setItem('memoryInfoDivVisible', 'true');
    }

    destroy() {
      clearInterval(this.timer);
      this.memoryInfoDiv.style.display = 'none';
      localStorage.setItem('memoryInfoDivVisible', 'false');
    }

    loadSavedState() {
      const savedVisible = localStorage.getItem('memoryInfoDivVisible');
      const savedPosition = JSON.parse(localStorage.getItem('memoryInfoDivPosition'));

      if (savedVisible === 'true') {
        this.init();
      } else {
        this.destroy();
      }

      if (savedPosition) {
        this.memoryInfoDiv.style.left = savedPosition.left || 0;
        this.memoryInfoDiv.style.top = savedPosition.top || 0;
        this.memoryInfoDiv.style.right = 'auto';
        this.memoryInfoDiv.style.bottom = 'auto';
      }
    }

    initKeyboardEvents() {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'F10') {
          event.preventDefault();
          if (this.memoryInfoDiv.style.display === 'none') {
            this.init();
          } else {
            this.destroy();
          }
        }
      });
    }
  }

  // 初始化监控器
  new MemoryMonitor();
})();
