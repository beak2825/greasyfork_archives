// ==UserScript==
// @name         抖音4K清晰度设置
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动将抖音视频清晰度设置为4K（使用会话存储）
// @author       Your name
// @match        https://*.douyin.com/*
// @icon         https://www.douyin.com/favicon.ico
// @run-at       document-end
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/521661/%E6%8A%96%E9%9F%B34K%E6%B8%85%E6%99%B0%E5%BA%A6%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/521661/%E6%8A%96%E9%9F%B34K%E6%B8%85%E6%99%B0%E5%BA%A6%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 4K配置
    const QUALITY_CONFIG = {
        clarityReal: [
            "normal_1080_0", "low_720_0", "low_540_0", "normal_720_0",
            "normal_540_0", "adapt_low_540_0", "lower_540_0",
            "adapt_lowest_1080_1", "adapt_lowest_720_1", "adapt_540_1",
            "adapt_lower_540_1", "adapt_lowest_1080_1", "adapt_lowest_720_1",
            "adapt_540_1", "adapt_lower_540_1"
        ],
        done: 1,
        gearClarity: "20",
        qualityType: 1,
        gearName: "超清 4K",
        gearType: -2
    };

    // 设置视频清晰度
    function setVideoQuality() {
        try {
            const currentConfig = JSON.parse(sessionStorage.getItem('MANUAL_SWITCH') || '{}');
            // 只有当清晰度不是4K时才设置
            if (currentConfig.gearClarity !== "20") {
                sessionStorage.setItem('MANUAL_SWITCH', JSON.stringify(QUALITY_CONFIG));
                console.log('✅ 已设置抖音清晰度为4K');
            }
        } catch (error) {
            console.error('❌ 设置清晰度失败:', error);
        }
    }

    // 监听URL变化并设置清晰度
    function startQualityMonitor() {
        // 等待文档加载完成后执行
        setTimeout(() => {
            setVideoQuality();
        }, 1000);  // 延迟1秒执行

        // 监听URL变化
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                setTimeout(setVideoQuality, 1000);  // URL变化后延迟1秒执行
            }
        }).observe(document, { subtree: true, childList: true });
    }


    // 启动脚本
    document.addEventListener('DOMContentLoaded', () => {
        startQualityMonitor();
    });

    // 页面完全加载后再次执行
    window.addEventListener('load', () => {
        setVideoQuality();
    });


//为直播页面时 尝试设置为最高清晰度
// 存储所有intervals的数组
const intervals = {
  definition: null,
  // 可以添加其他interval名称
};

// 清理所有intervals的函数
function clearAllIntervals() {
  Object.keys(intervals).forEach(key => {
    if (intervals[key]) {
      clearInterval(intervals[key]);
      intervals[key] = null;
    }
  });
}

// Monitor URL changes
let lastUrl = location.href;
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    clearAllIntervals(); // 清理所有旧的intervals
    initQualitySettings();
  }
});

observer.observe(document, { subtree: true, childList: true });

// Initialize quality settings
function initQualitySettings() {
  // 确保清理之前可能存在的interval
  if (intervals.definition) {
    clearInterval(intervals.definition);
  }

  intervals.definition = setInterval(function() {
    let curdefinition = "";
    let highestdefinition = "";
    let find = 0;

    if (location.href.indexOf("live") > -1) {
      const qualityElement = document.querySelector('#_douyin_live_scroll_container_ xg-controls div[data-e2e="quality"]');
      if (qualityElement) {
        curdefinition = qualityElement.textContent;
      }

      const qualityOptions = document.querySelectorAll('#_douyin_live_scroll_container_ xg-controls div[data-e2e="quality-selector"] > div');
      qualityOptions.forEach(option => {
        highestdefinition = option.textContent;
        if ((highestdefinition.indexOf("登录即享") > -1 && highestdefinition.indexOf("高清") < 0) || find > 0) {
          return;
        }

        if (highestdefinition !== "") {
          console.log("%c当前清晰度 " + curdefinition + " 可选最高" + highestdefinition, "color: white");
          if (highestdefinition.indexOf(curdefinition) < 0) {
            console.log("点击 ", option);
            option.click();
          } else {
            // 使用新的清理方式
            clearInterval(intervals.definition);
            intervals.definition = null;
          }
          find = 1;
        }
      });
    }
  }, 1000);
}

// 页面卸载时清理所有intervals
window.addEventListener('unload', clearAllIntervals);

// Initial execution
initQualitySettings();
})();