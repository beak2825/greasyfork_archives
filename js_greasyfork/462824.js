// ==UserScript==
// @name         微信读书加宽度优化版
// @namespace    在原作者xvusrmqj基础上优化，主要是自用
// @version      0.1
// @description  微信读书宽度调整，可加大，减少，方便的调整到想要的宽度
// @author       yw
// @match        https://weread.qq.com/web/reader/*
// @grant        GM_log
// @grant        GM_addStyle
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/462824/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%8A%A0%E5%AE%BD%E5%BA%A6%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/462824/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%8A%A0%E5%AE%BD%E5%BA%A6%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 基础方法
  function getCurrentMaxWidth(element) {
    let currentValue = window.getComputedStyle(element).maxWidth;
    currentValue = currentValue.substring(0, currentValue.indexOf("px"));
    currentValue = parseInt(currentValue);
    return currentValue;
  }

  function getCurrentMarginLeft(element) {
    let currentValue = window.getComputedStyle(element).marginLeft;
    currentValue = currentValue.substring(0, currentValue.indexOf("px"));
    currentValue = parseInt(currentValue);
    return currentValue;
  }

  function changeWidth(increse) {
    changeContentWidth(increse);
    changeControlsPosition(increse);
    const myEvent = new Event("resize");
    window.dispatchEvent(myEvent);
  }

  function changeContentWidth(increse) {
    const step = 100;
    const item = document.querySelector(".readerContent .app_content");
    // 顶部信息栏
    var top = document.querySelector(".readerContent .readerTopBar");
    const currentValue = getCurrentMaxWidth(item);
    let changedValue;
    if (increse) {
      changedValue = currentValue + step;
    } else {
      changedValue = currentValue - step;
    }
    item.style["max-width"] = changedValue + "px";
    top.style["max-width"] = changedValue + "px";
  }

  function changeControlsPosition(increse) {
    const step = 50;
    const item = document.querySelector(".readerContent .readerControls");
    // 缩放
    const zoom = document.querySelector(".zoom-controls");
    // 阅读控制和缩放控制位置一致，采用同样的就可以
    const currentValue = getCurrentMarginLeft(item);
    let changedValue;
    if (increse) {
      changedValue = currentValue + step;
    } else {
      changedValue = currentValue - step;
    }

    item.style["margin-left"] = changedValue + "px";
    zoom.style["margin-left"] = changedValue + "px";
  }

  const initMenus = function () {
    // 添加内容
    const menus = `
        <div class="zoom-controls">
            <button id='lv-button1' class="zoom_item"><span class="iconfont">&#xe684;</span></button>
            <button id='lv-button2' class="zoom_item"><span class="iconfont">&#xe897;</span></button>
        </div>
    `;
    const body = document.getElementsByTagName("body");
    body[0].insertAdjacentHTML("beforeend", menus);
    // 添加样式
    GM_addStyle(`
        @font-face {
            font-family: 'iconfont';  /* Project id 3978675 */
            src: url('//at.alicdn.com/t/c/font_3978675_ngptx8td2k.woff2?t=1679888786121') format('woff2'),
                url('//at.alicdn.com/t/c/font_3978675_ngptx8td2k.woff?t=1679888786121') format('woff'),
                url('//at.alicdn.com/t/c/font_3978675_ngptx8td2k.ttf?t=1679888786121') format('truetype');
        }
        .iconfont {
            font-family: "iconfont" !important;
            font-size: 24px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            color: white;
          }
        .zoom-controls {
            width: 48px;
            overflow: visible;
            position: fixed;
            z-index: 5;
            left: 50%;
            bottom: 405px;
            margin-left: 548px;   
        }
        .zoom-controls .zoom_item {
            width: 48px;
            height: 48px;
            background-color: #1c1c1d;
            transition: background-color .2s ease-in-out;
            border-radius: 24px;
            line-height: 48px;
            text-align: center;
            position: relative;
            margin-top: 24px;
        }
        .wr_whiteTheme .zoom_item {
            background-color: #fff;
            box-shadow: 0 8px 32px rgba(0,25,104,.1);
        }
        .wr_whiteTheme .iconfont {
            color: black;
        }
    `);
    // 添加监听
    document
      .getElementById("lv-button1")
      .addEventListener("click", () => changeWidth(true));
    document
      .getElementById("lv-button2")
      .addEventListener("click", () => changeWidth(false));
  };

  initMenus();
})();
