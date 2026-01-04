// ==UserScript==
// @name         Sunflower AutoClicker v1.4.2 ES5
// @namespace    http://tampermonkey.net/
// @version      1.4.4
// @description  自动点击成熟作物或庄稼洞，连贯非并发点击，支持作物状态更新后重复识别，兼容 ES5。适配 sunflower-land.com/play 页面结构与规则。
// @author       doggod
// @match        https://sunflower-land.com/play/
// @grant        none
// @license      MIT
// @jshint       esversion: 5
// @downloadURL https://update.greasyfork.org/scripts/535787/Sunflower%20AutoClicker%20v142%20ES5.user.js
// @updateURL https://update.greasyfork.org/scripts/535787/Sunflower%20AutoClicker%20v142%20ES5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var cropList = [
    "sunflower", "rhubarb", "potato", "carrot", "yam","zucchini", "zuchinni",
    "cabbage", "broccoli", "soybean", "beetroot", "pepper", "cauliflower",
    "parsnip", "eggplant", "corn", "onion", "radish", "wheat", "turnip",
    "kale", "barley",  "pumpkin"
  ];

  var blockStatusMap = {}; // 每次状态更新重建
  var lastClickTime = 0;
  var isRunning = false;

  // UI 控制按钮
  var toggleBtn = document.createElement('button');
  toggleBtn.innerText = '启动脚本';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.top = '10px';
  toggleBtn.style.left = '50%';
  toggleBtn.style.transform = 'translateX(-50%)';
  toggleBtn.style.zIndex = 9999;
  toggleBtn.style.backgroundColor = '#28a745';
  toggleBtn.style.color = '#fff';
  toggleBtn.style.border = 'none';
  toggleBtn.style.padding = '10px 14px';
  toggleBtn.style.borderRadius = '6px';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.fontSize = '14px';
  document.body.appendChild(toggleBtn);

  toggleBtn.onclick = function () {
    isRunning = !isRunning;
    toggleBtn.innerText = isRunning ? '停止脚本' : '启动脚本';
    toggleBtn.style.backgroundColor = isRunning ? '#dc3545' : '#28a745';
  };

  function simulateClick(element) {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    element.dispatchEvent(event);
  }

  function isCropTarget(src) {
    if (!src || src.indexOf('plant.png') === -1) return false;
    for (var i = 0; i < cropList.length; i++) {
      if (src.indexOf('/crops/' + cropList[i] + '/') !== -1) return true;
    }
    return false;
  }

  function isBlueBar(imgs) {
    var hasPlant = false;
    var hasBar = false;
    for (var i = 0; i < imgs.length; i++) {
      var src = imgs[i].src;
      if (src.indexOf('plant.png') !== -1) hasPlant = true;
      if (src.indexOf('empty_bar.png') !== -1) hasBar = true;
    }
    return hasPlant && hasBar;
  }

  function isSoil(imgs) {
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].src.indexOf('/crops/soil2.png') !== -1) {
        return true;
      }
    }
    return false;
  }

  function getBlockKey(div) {
    var style = div.getAttribute("style");
    var match = style && style.match(/top:\s*calc\(50%\s*[-+]\s*(\d+)px\);\s*left:\s*calc\(50%\s*[-+]\s*(\d+)px\)/);
    return match ? match[1] + ',' + match[2] : '';
  }

  function scanAndClick() {
    if (!isRunning) {
      setTimeout(scanAndClick, 1000);
      return;
    }

    var containers = document.querySelectorAll("div.absolute[style*='height: 42px'][style*='width: 42px']");
    for (var i = 0; i < containers.length; i++) {
      var div = containers[i];
      var style = div.getAttribute("style") || "";
      if (!/top:\s*calc\(50%\s*[-+]\s*\d+px\);\s*left:\s*calc\(50%\s*[-+]\s*\d+px\)/.test(style)) {
        continue;
      }

      var key = getBlockKey(div);
      if (!key) continue;

      var imgs = div.getElementsByTagName("img");
      var clickable = div.querySelector(".cursor-pointer");
      var cropImg = null;

      // 检查 crop 是否为目标
      for (var j = 0; j < imgs.length; j++) {
        if (isCropTarget(imgs[j].src)) {
          cropImg = imgs[j];
          break;
        }
      }

      // 判断当前状态
      var currentStatus = "unknown";
      if (isBlueBar(imgs)) {
        currentStatus = "blue";
      } else if (cropImg) {
        currentStatus = "mature";
      } else if (isSoil(imgs)) {
        currentStatus = "soil";
      }

      // 如果状态发生了变化，清除旧记录
      if (!blockStatusMap[key] || blockStatusMap[key] !== currentStatus) {
        blockStatusMap[key] = currentStatus;
      }

      // 每轮只点击一个地块
      var now = new Date().getTime();
      if ((currentStatus === "mature" || currentStatus === "soil") &&
        clickable &&
        now - lastClickTime > 1000
      ) {
        simulateClick(clickable);
        lastClickTime = now;
        console.log("✅ 点击地块:", key, "状态:", currentStatus);
        break;
      }
    }

    setTimeout(scanAndClick, 1200);
  }

  window.addEventListener('load', function () {
    setTimeout(scanAndClick, 1000);
  });
})();
