// ==UserScript==
// @name        小红书清理点赞
// @namespace   http://tampermonkey.net/
// @version     2025-06-27
// @description 自动批量取消和添加小红书点赞
// @author      You
// @match       https://www.xiaohongshu.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/540923/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%B8%85%E7%90%86%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/540923/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%B8%85%E7%90%86%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 配置项
  const config = {
    unlikeButtonSelector: '.like-wrapper.like-active svg use[*|href="#liked"]',
    likeButtonSelector: '.like-wrapper.like-active svg use[*|href="#like"]',
    clickDelay: 50,
    scrollDelay: 200,
  };

  let isCanceling = false;
  let isLiking = false;

  // 创建控制面板
  function createControlPanel() {
    // 创建开始取消点赞按钮
    const startUnlikeButton = document.createElement("button");
    startUnlikeButton.textContent = "开始取消点赞";
    startUnlikeButton.style.position = "fixed";
    startUnlikeButton.style.top = "20px";
    startUnlikeButton.style.right = "340px";
    startUnlikeButton.style.zIndex = "9999";
    startUnlikeButton.style.padding = "12px 24px";
    startUnlikeButton.style.backgroundColor = "#ff4444";
    startUnlikeButton.style.color = "white";
    startUnlikeButton.style.border = "none";
    startUnlikeButton.style.borderRadius = "4px";
    startUnlikeButton.style.fontSize = "16px";
    startUnlikeButton.style.cursor = "pointer";
    startUnlikeButton.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
    startUnlikeButton.style.transition = "background-color 0.3s";
    startUnlikeButton.addEventListener("mouseenter", () => {
      startUnlikeButton.style.backgroundColor = "#cc0000";
    });
    startUnlikeButton.addEventListener("mouseleave", () => {
      startUnlikeButton.style.backgroundColor = "#ff4444";
    });
    document.body.appendChild(startUnlikeButton);

    // 创建开始批量点赞按钮
    const startLikeButton = document.createElement("button");
    startLikeButton.textContent = "开始批量点赞";
    startLikeButton.style.position = "fixed";
    startLikeButton.style.top = "20px";
    startLikeButton.style.right = "180px";
    startLikeButton.style.zIndex = "9999";
    startLikeButton.style.padding = "12px 24px";
    startLikeButton.style.backgroundColor = "#4CAF50";
    startLikeButton.style.color = "white";
    startLikeButton.style.border = "none";
    startLikeButton.style.borderRadius = "4px";
    startLikeButton.style.fontSize = "16px";
    startLikeButton.style.cursor = "pointer";
    startLikeButton.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
    startLikeButton.style.transition = "background-color 0.3s";
    startLikeButton.addEventListener("mouseenter", () => {
      startLikeButton.style.backgroundColor = "#388E3C";
    });
    startLikeButton.addEventListener("mouseleave", () => {
      startLikeButton.style.backgroundColor = "#4CAF50";
    });
    document.body.appendChild(startLikeButton);

    // 创建停止按钮
    const stopButton = document.createElement("button");
    stopButton.textContent = "停止操作";
    stopButton.style.position = "fixed";
    stopButton.style.top = "20px";
    stopButton.style.right = "20px";
    stopButton.style.zIndex = "9999";
    stopButton.style.padding = "12px 24px";
    stopButton.style.backgroundColor = "#999999";
    stopButton.style.color = "white";
    stopButton.style.border = "none";
    stopButton.style.borderRadius = "4px";
    stopButton.style.fontSize = "16px";
    stopButton.style.cursor = "pointer";
    stopButton.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
    stopButton.style.transition = "background-color 0.3s";
    stopButton.addEventListener("mouseenter", () => {
      stopButton.style.backgroundColor = "#666666";
    });
    stopButton.addEventListener("mouseleave", () => {
      stopButton.style.backgroundColor = "#999999";
    });
    document.body.appendChild(stopButton);

    // 绑定停止按钮点击事件
    stopButton.addEventListener("click", () => {
      isCanceling = false;
      isLiking = false;
      console.log("已触发停止操作");
    });

    // 绑定点击事件
    startUnlikeButton.addEventListener("click", () => batchAction('unlike'));
    startLikeButton.addEventListener("click", () => batchAction('like'));

    return {
      startUnlikeButton,
      startLikeButton,
      stopButton,
    };
  }

  // 批量操作函数
  async function batchAction(action) {
    if (action === 'unlike') {
      isCanceling = true;
      console.log('开始批量取消点赞操作');
    } else {
      isLiking = true;
      console.log('开始批量点赞操作');
    }
    let isScrollEnd = false;
    const selector = action === 'unlike' ? config.unlikeButtonSelector : config.likeButtonSelector;
    const isActive = action === 'unlike' ? () => isCanceling : () => isLiking;

    while (!isScrollEnd && isActive()) {
        console.log(`查找页面中的${action === 'unlike' ? '取消' : '点赞'}按钮`);
        const useElements = document.querySelectorAll(selector);
        console.log(`找到 ${useElements.length} 个${action === 'unlike' ? '取消' : '点赞'}按钮`);
        const clickedElements = [];

        for (const useElement of useElements) {
            if (!isActive()) break;
            const outerSpan = useElement.closest('.like-wrapper.like-active');
            if (outerSpan && isInViewport(outerSpan)) {
                console.log(`找到可视${action === 'unlike' ? '取消' : '点赞'}按钮，准备点击`);
                outerSpan.click();
                console.log(`已点击${action === 'unlike' ? '取消' : '点赞'}按钮，等待 ${config.clickDelay}ms`);
                await new Promise(resolve => setTimeout(resolve, config.clickDelay));
                clickedElements.push(outerSpan);
            }
        }
        console.log(`已点击按钮数/找到按钮数: ${clickedElements.length}/${useElements.length}`);

        if (!isActive()) break;
        const oldScrollY = window.scrollY;
        if (clickedElements.length > 0) {
          const lastClickedElement = clickedElements[clickedElements.length - 1];
          scrollUntilElementExitsViewport(lastClickedElement, 'down', false);
        } else {
          window.scrollBy({ 
            top: window.innerHeight, 
            behavior: 'auto' 
          });
        }
        await new Promise(resolve => setTimeout(resolve, config.scrollDelay));

        if (window.scrollY === oldScrollY) {
            console.log(`已到达页面底部，停止批量${action === 'unlike' ? '取消' : '点赞'}操作`);
            isScrollEnd = true;
        }
    }
    if (!isActive()) {
        console.log(`用户手动停止了批量${action === 'unlike' ? '取消' : '点赞'}操作`);
    }
    console.log(`批量${action === 'unlike' ? '取消' : '点赞'}操作结束`);
    if (action === 'unlike') {
      isCanceling = false;
    } else {
      isLiking = false;
    }
  }

  // 判断元素是否在视口内
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function scrollUntilElementExitsViewport(element, direction = 'down', isSmooth = true) {
    // 获取元素的边界矩形
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // 根据滚动方向计算目标滚动位置
    let scrollTarget;
    if (direction === 'down') {
        // 向下滚动直到元素顶部离开视口顶部
        scrollTarget = window.scrollY + rect.top;
    } else if (direction === 'up') {
        // 向上滚动直到元素底部离开视口底部
        scrollTarget = window.scrollY + (rect.bottom - windowHeight);
    } else if (direction === 'left') {
        // 向左滚动直到元素右侧离开视口左侧
        scrollTarget = window.scrollX + rect.right;
    } else if (direction === 'right') {
        // 向右滚动直到元素左侧离开视口右侧
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        scrollTarget = window.scrollX + (rect.left - windowWidth);
    }
    
    // 执行平滑滚动
    if (direction === 'up' || direction === 'down') {
        window.scrollTo({
            top: scrollTarget,
            behavior: isSmooth ? 'smooth' : 'auto',
        });
    } else {
        window.scrollTo({
            left: scrollTarget,
            behavior: isSmooth ? 'smooth' : 'auto',
        });
    }
}

  // 创建控制面板
  createControlPanel();
})();
