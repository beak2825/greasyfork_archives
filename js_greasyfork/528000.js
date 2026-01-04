// ==UserScript==
// @name         Stats性能监控
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在页面注入Stats.js性能监控面板
// @author       Your name
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528000/Stats%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/528000/Stats%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 Your name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Based on Stats.js by mrdoob (https://github.com/mrdoob/stats.js)
*/

(function () {
  "use strict";

  // 从localStorage读取设置
  const defaultSettings = {
    top: 50,
    left: 50,
    scale: 2.0,
    panel: 0,
  };

  let settings = JSON.parse(localStorage.getItem("statsSettings")) || defaultSettings;

  // Stats.js 代码
  var Stats = function () {
    var mode = settings.panel;
    var container = document.createElement("div");
    container.style.cssText = "position:relative;cursor:pointer;opacity:0.9;background:rgba(0,0,0,0.8);padding:0;margin:0;";

    // 创建包装器
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `position:fixed;top:${settings.top}px;left:${settings.left}px;z-index:999999;transform-origin:top left;transform:scale(${settings.scale});`;
    wrapper.appendChild(container);

    // 移动功能
    let isDragging = false;
    let initialX;
    let initialY;
    let moveThreshold = 5; // 移动阈值，小于这个值认为是点击
    let startX;
    let startY;

    // 防抖函数
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    // 保存设置到localStorage
    const saveSettings = debounce(function () {
      const newSettings = {
        top: parseInt(wrapper.style.top),
        left: parseInt(wrapper.style.left),
        scale: parseFloat(wrapper.style.transform.replace("scale(", "").replace(")", "")),
        panel: mode,
      };
      localStorage.setItem("statsSettings", JSON.stringify(newSettings));
    }, 500);

    container.addEventListener("mousedown", function (e) {
      if (e.target === container || e.target.tagName === "CANVAS") {
        isDragging = true;
        initialX = e.clientX - wrapper.offsetLeft;
        initialY = e.clientY - wrapper.offsetTop;
        startX = e.clientX;
        startY = e.clientY;
        wrapper.style.cursor = "move";
      }
    });

    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        e.preventDefault();
        wrapper.style.left = e.clientX - initialX + "px";
        wrapper.style.top = e.clientY - initialY + "px";
        saveSettings();
      }
    });

    document.addEventListener("mouseup", function (e) {
      if (isDragging) {
        const moveX = Math.abs(e.clientX - startX);
        const moveY = Math.abs(e.clientY - startY);

        // 如果移动距离小于阈值，认为是点击
        if (moveX < moveThreshold && moveY < moveThreshold) {
          showPanel(++mode % container.children.length);
          saveSettings();
        }
      }
      isDragging = false;
      wrapper.style.cursor = "pointer";
    });

    // 鼠标滚轮缩放
    let scale = settings.scale;
    wrapper.addEventListener("wheel", function (e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      scale = Math.max(0.5, Math.min(5, scale + delta));
      wrapper.style.transform = `scale(${scale})`;
      saveSettings();
    });

    function addPanel(panel) {
      container.appendChild(panel.dom);
      return panel;
    }

    function showPanel(id) {
      for (var i = 0; i < container.children.length; i++) {
        container.children[i].style.display = i === id ? "block" : "none";
      }
      mode = id;
    }

    var beginTime = (performance || Date).now(),
      prevTime = beginTime,
      frames = 0;
    var fpsPanel = addPanel(new Stats.Panel("FPS", "#0ff", "#002"));
    var msPanel = addPanel(new Stats.Panel("MS", "#0f0", "#020"));
    var memPanel = addPanel(new Stats.Panel("MB", "#f08", "#201"));

    showPanel(mode);

    // 获取内存信息
    if (window.performance && window.performance.memory) {
      setInterval(function () {
        var mem = performance.memory;
        memPanel.update(Math.round(mem.usedJSHeapSize / 1048576), Math.round(mem.jsHeapSizeLimit / 1048576));
      }, 1000);
    }

    return {
      REVISION: 16,
      dom: wrapper,
      addPanel: addPanel,
      showPanel: showPanel,
      begin: function () {
        beginTime = (performance || Date).now();
      },
      end: function () {
        frames++;
        var time = (performance || Date).now();
        msPanel.update(time - beginTime, 200);
        if (time >= prevTime + 1000) {
          fpsPanel.update((frames * 1000) / (time - prevTime), 100);
          prevTime = time;
          frames = 0;
        }
        return time;
      },
      update: function () {
        beginTime = this.end();
      },
    };
  };

  Stats.Panel = function (name, fg, bg) {
    var min = Infinity,
      max = 0,
      round = Math.round;
    var PR = round(window.devicePixelRatio || 1);
    var WIDTH = 80 * PR,
      HEIGHT = 48 * PR,
      TEXT_X = 3 * PR,
      TEXT_Y = 2 * PR,
      GRAPH_X = 3 * PR,
      GRAPH_Y = 15 * PR,
      GRAPH_WIDTH = 74 * PR,
      GRAPH_HEIGHT = 30 * PR;

    var canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.cssText = "width:80px;height:48px";

    var context = canvas.getContext("2d");
    context.font = "bold " + 9 * PR + "px Helvetica,Arial,sans-serif";
    context.textBaseline = "top";

    context.fillStyle = bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.fillStyle = fg;
    context.fillText(name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    return {
      dom: canvas,
      update: function (value, maxValue) {
        min = Math.min(min, value);
        max = Math.max(max, value);
        context.fillStyle = bg;
        context.globalAlpha = 1;
        context.fillRect(0, 0, WIDTH, GRAPH_Y);
        context.fillStyle = fg;
        context.fillText(round(value) + " " + name + " (" + round(min) + "-" + round(max) + ")", TEXT_X, TEXT_Y);
        context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);
        context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);
        context.fillStyle = bg;
        context.globalAlpha = 0.9;
        context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - value / maxValue) * GRAPH_HEIGHT));
      },
    };
  };

  // 注入Stats
  function injectStats() {
    try {
      const stats = new Stats();
      document.body.appendChild(stats.dom);

      function update() {
        stats.update();
        requestAnimationFrame(update);
      }
      update();

      return stats;
    } catch (error) {
      console.error("Failed to inject Stats:", error);
    }
  }

  injectStats();
})();
