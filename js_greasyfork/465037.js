// ==UserScript==
// @name        滚动条-新
// @namespace   https://greasyfork.org/zh-CN/users/954189
// @version     1.2
// @description 为网页添加滚动条。
// @author      chatgpt
// @run-at      document-end
// @license     MIT
// @match       *://*/*
// @downloadURL https://update.greasyfork.org/scripts/465037/%E6%BB%9A%E5%8A%A8%E6%9D%A1-%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/465037/%E6%BB%9A%E5%8A%A8%E6%9D%A1-%E6%96%B0.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建滚动条 DOM 元素
  const theScrollBar = document.createElement("div");

  // 设置滚动条的 ID 和文本
  theScrollBar.id = "theScrollBar";
  theScrollBar.innerHTML = "▲<br>▼";

  // 设置滚动条样式
  theScrollBar.setAttribute(
    "style",
    "font-size:1.5vw ;width:6vw ;line-height:5vw ;display: block;text-align:center ;background-color:rgba(255,255,255) ;opacity: 0 ;box-shadow:0px 1px 5px rgba(0,0,0,0.2) ;color:#000 ;position:fixed ;top: -14vw;right:-10vw ;z-index:9999999 ;transition: opacity 0.4s ease-in-out,right 0.4s; border-radius:1vw "
  );

  // 将滚动条元素添加到页面中
  document.body.appendChild(theScrollBar);

  // 存储网页高度和上次滚动位置
  let webHeight = null;
  let lastScrollTop = null;

  // 更新滚动条位置的函数
  function updateScrollBar() {
    // 获取当前的滚动位置
    const scrollTop = window.scrollY;

    // 如果滚动位置改变了，重新计算滚动条位置
    if (scrollTop !== lastScrollTop) {
      const scrollBarTop =
        (scrollTop / webHeight) * (window.innerHeight - theScrollBar.clientHeight);
      if (scrollBarTop < 0) {
        theScrollBar.style.top = "0";
      } else if (scrollBarTop + theScrollBar.clientHeight > window.innerHeight) {
        theScrollBar.style.top = `${window.innerHeight - theScrollBar.clientHeight}px`;
        webHeight = document.documentElement.scrollHeight - window.innerHeight;
      } else {
        theScrollBar.style.top = `${scrollBarTop}px`;
      }
      lastScrollTop = scrollTop;
    }

    // 使用 requestAnimationFrame 函数，优化渲染性能
    window.requestAnimationFrame(updateScrollBar);
  }

  // 添加 touchstart 事件监听器，当用户在手机上开始触摸屏幕时触发
  window.addEventListener("touchstart", function() {
    //如果网页高度过低，不需要添加滚动条
    if (document.documentElement.scrollHeight <= window.innerHeight * 2) {
      return;
    }

    // 获取网页高度，并开始更新滚动条位置
    webHeight = document.documentElement.scrollHeight - window.innerHeight;
    updateScrollBar();
  });

  // 定义一些与触摸事件相关的变量
  let startOffset = null;

  // 滚动条开始滚动时触发的函数
  function startScroll(event) {
    event.preventDefault();
    event.stopPropagation();
    startOffset = event.changedTouches[0].clientY - parseInt(theScrollBar.style.top);
  }

  // 滚动条正在滚动时触发的函数
  function scrolling(event) {
    event.preventDefault();
    event.stopPropagation();
    // 计算当前滚动条的位置和滑动距离，并更新滚动位置和滚动条位置
    const currentY = event.changedTouches[0].clientY;
    const scrollBarTop = currentY - startOffset;
    if (scrollBarTop < 0) {
      theScrollBar.style.top = "0px";
    } else if (scrollBarTop > window.innerHeight - theScrollBar.clientHeight) {
      theScrollBar.style.top = `${window.innerHeight - theScrollBar.clientHeight}px`;
      webHeight = document.documentElement.scrollHeight - window.innerHeight;
    } else {
      theScrollBar.style.top = `${scrollBarTop}px`;
    }
    const scrollTop =
      (scrollBarTop / (window.innerHeight - theScrollBar.clientHeight)) * webHeight;
    window.scrollTo(window.scrollX, scrollTop);
  }

  // 为滚动条添加触摸事件监听器
  theScrollBar.addEventListener("touchstart", startScroll, { passive: false });
  theScrollBar.addEventListener("touchmove", scrolling, { passive: false });

  // 停止滚动1秒后隐藏
  let timer;
  window.addEventListener("scroll", function() {
    clearTimeout(timer);
    theScrollBar.style.right = "2vw";
    theScrollBar.style.opacity = "0.8";
    timer = setTimeout(() => {
      theScrollBar.style.right = "-10vw";
      theScrollBar.style.opacity = "0";
    }, 1000);
  });

  // 定义触顶/底反弹动画的函数
  function bounceAnimation() {
    // 获取当前滚动条的位置
    const scrollTop = window.scrollY;

    // 获取滚动条的高度
    const scrollBarHeight = theScrollBar.clientHeight;

    // 获取滚动速度
    const scrollSpeed = Math.abs(scrollTop - lastScrollTop);

    // 设置滚动速度阈值
    const threshold = 7;

    // 如果滚动条触顶，且滚动速度超过阈值，执行反弹动画
    if (scrollTop === 0 && scrollSpeed > threshold) {
      theScrollBar.style.animation = "bounce-down 0.4s";
      setTimeout(() => {
        theScrollBar.style.animation = "";
      }, 500);
    }

    // 如果滚动条触底，且滚动速度超过阈值，执行反弹动画
    if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight && scrollSpeed > threshold) {
      theScrollBar.style.animation = "bounce-up 0.4s";
      setTimeout(() => {
        theScrollBar.style.animation = "";
      }, 500);
    }
  }

  // 添加触顶/底反弹动画的事件监听器
  window.addEventListener("scroll", bounceAnimation);

  // CSS样式
  const styles = `
  @keyframes bounce-down {
    0% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(10px);
    }
    100% {
      transform: translateY(0);
    } 
  }
  @keyframes bounce-up {
    0% {
      transform: translateY(0);
    }
     30% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }
  `;

  // 创建样式元素并将样式添加到头部
  const styleElement = document.createElement("style");
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);


})();
