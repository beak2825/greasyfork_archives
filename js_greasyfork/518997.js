// ==UserScript==
// @name         滚动条美化
// @namespace    npm/vite-plugin-monkey
// @version      1.3.3
// @author       Feny
// @description  本脚本基于 Scroll Style 插件移植，并采用了🌈彩虹滚动条🌈脚本的 CSS 样式。
// @license      MIT
// @icon         data:image/png;base64,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
// @homepage     https://github.com/xFeny/UserScript/tree/main/monkey-scrollbar
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/518997/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/518997/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(' @charset "UTF-8";:root{scrollbar-width:none!important}body::-webkit-scrollbar,::-webkit-scrollbar-track,::-webkit-scrollbar-corner,::-webkit-scrollbar-button,::-webkit-scrollbar-track-piece,::-webkit-scrollbar-track:horizontal{display:none!important}::-webkit-scrollbar{width:7px!important;height:7px!important;display:static!important}::-webkit-scrollbar-thumb{background:linear-gradient(to bottom,#ff567f,#fbeb91,#2ec2ff,#8375ff)!important;border-radius:5px!important;border:none!important;box-shadow:inset 0 0 10px #fff!important}::-webkit-scrollbar-thumb:horizontal{background:linear-gradient(to right,#ff567f,#fbeb91,#2ec2ff,#8375ff)!important;border-radius:5px!important;border:none!important;box-shadow:inset 0 0 10px #fff!important}.wsx_scroll{margin:0;padding:0;-webkit-user-select:none;user-select:none;pointer-events:none;display:none;position:fixed;z-index:999999999;transition:opacity .2s linear}.wsx_scroll_bar{margin:0;padding:0;-webkit-user-select:none;user-select:none;pointer-events:none;position:relative}.wsx_fade{margin:0;padding:0;-webkit-user-select:none;user-select:none;pointer-events:none;display:block;position:fixed;z-index:9999999999}.wsx_vertical_scroll{top:0;right:0;width:30px}.wsx_vertical_scroll_bar{left:19px;opacity:.6;height:100%;width:7px!important;border-radius:5px!important;background:linear-gradient(to bottom,#ff567f,#fbeb91,#2ec2ff,#8375ff)!important}.wsx_vertical_fade{top:0;right:0;width:30px;height:100%}.wsx_horizontal_scroll{left:0;bottom:0;height:30px}.wsx_horizontal_scroll_bar{top:20px;width:100%;opacity:.6;height:7px!important;border-radius:5px!important;background:linear-gradient(to right,#ff567f,#fbeb91,#2ec2ff,#8375ff)!important}.wsx_horizontal_fade{left:0;bottom:0;width:100%;height:30px} ');

(function () {
  'use strict';

  document.addEventListener("DOMContentLoaded", function() {
    const timeoutSec = 500;
    function createAndAppendElement(tag, className, parent) {
      const el = document.createElement(tag);
      el.className = className;
      parent.appendChild(el);
      return el;
    }
    const verticalFade = createAndAppendElement("div", "wsx_fade wsx_vertical_fade", document.body);
    const verticalScroll = createAndAppendElement("div", "wsx_scroll wsx_vertical_scroll", document.body);
    createAndAppendElement("div", "wsx_scroll_bar wsx_vertical_scroll_bar", verticalScroll);
    const horizontalFade = createAndAppendElement("div", "wsx_fade wsx_horizontal_fade", document.body);
    const horizontalScroll = createAndAppendElement("div", "wsx_scroll wsx_horizontal_scroll", document.body);
    createAndAppendElement("div", "wsx_scroll_bar wsx_horizontal_scroll_bar", horizontalScroll);
    let content = document.documentElement || document.body;
    let changeY = window.innerHeight;
    let scrollShowY = false;
    let wsxVerticalTimeout;
    let changeX = window.innerWidth;
    let scrollShowX = false;
    let wsxHorizontalTimeout;
    function upScrollHeight() {
      const fullWin = Array.from(document.querySelectorAll("*")).some((el) => {
        const cs = getComputedStyle(el);
        return (cs.position === "fixed" || cs.position === "static") && el.type === "application/x-shockwave-flash" && cs.height === window.innerHeight + "px" && parseInt(cs.width, 10) >= window.innerWidth;
      });
      clearTimeout(wsxVerticalTimeout);
      clearTimeout(wsxHorizontalTimeout);
      const wHeight = document.documentElement.clientHeight;
      const wWidth = document.documentElement.clientWidth;
      const dHeight = document.documentElement.scrollHeight;
      const dWidth = document.documentElement.scrollWidth;
      if (dHeight <= wHeight || fullWin) {
        if (scrollShowY) {
          verticalScroll.style.display = "none";
        }
        scrollShowY = false;
      } else {
        verticalScroll.style.display = "block";
        verticalScroll.style.opacity = "1";
        verticalScroll.style.pointerEvents = "none";
        scrollShowY = true;
      }
      if (dWidth <= wWidth || fullWin) {
        if (scrollShowX) {
          horizontalScroll.style.display = "none";
        }
        scrollShowX = false;
      } else {
        horizontalScroll.style.display = "block";
        horizontalScroll.style.opacity = "1";
        horizontalScroll.style.pointerEvents = "none";
        scrollShowX = true;
      }
      const scrollHeight = Math.max(wHeight / dHeight * wHeight, 30);
      const scrollWidth = Math.max(wWidth / dWidth * wWidth, 30);
      const top = (document.documentElement.scrollTop || document.body.scrollTop) / (dHeight - wHeight) * (wHeight - scrollHeight);
      verticalScroll.style.top = `${top}px`;
      verticalScroll.style.height = `${scrollHeight}px`;
      const left = (document.documentElement.scrollLeft || document.body.scrollLeft) / (dWidth - wWidth) * (wWidth - scrollWidth);
      horizontalScroll.style.left = `${left}px`;
      horizontalScroll.style.width = `${scrollWidth}px`;
      wsxVerticalTimeout = setTimeout(() => {
        verticalScroll.style.opacity = "0";
        verticalScroll.style.pointerEvents = "none";
        scrollShowY = false;
      }, timeoutSec);
      wsxHorizontalTimeout = setTimeout(() => {
        horizontalScroll.style.opacity = "0";
        horizontalScroll.style.pointerEvents = "none";
        scrollShowX = false;
      }, timeoutSec);
    }
    const initInterval = 200;
    setInterval(() => {
      if (changeY !== content.scrollHeight || changeX !== content.scrollWidth) {
        changeY = content.scrollHeight;
        changeX = content.scrollWidth;
        upScrollHeight();
      }
    }, initInterval);
    window.addEventListener("scroll", upScrollHeight);
    window.addEventListener("resize", upScrollHeight);
    let alwaysY;
    let alwaysX;
    let mousedownY = false;
    let mousedownX = false;
    let startY;
    let Y;
    let startX;
    let X;
    window.addEventListener("mousemove", (event) => {
      if (event.clientX >= 0 && event.clientY >= 0) {
        if (content.clientWidth - event.clientX < 40) {
          if (!scrollShowY) {
            upScrollHeight();
          }
          clearTimeout(wsxVerticalTimeout);
          alwaysY = true;
        } else if (alwaysY) {
          alwaysY = false;
          wsxVerticalTimeout = setTimeout(() => {
            verticalScroll.style.opacity = "0";
            verticalScroll.style.pointerEvents = "none";
            scrollShowY = false;
          }, timeoutSec);
        }
        if (content.clientHeight - event.clientY < 40) {
          if (!scrollShowX) {
            upScrollHeight();
          }
          clearTimeout(wsxHorizontalTimeout);
          alwaysX = true;
        } else if (alwaysX) {
          alwaysX = false;
          wsxHorizontalTimeout = setTimeout(() => {
            horizontalScroll.style.opacity = "0";
            horizontalScroll.style.pointerEvents = "none";
            scrollShowX = false;
          }, timeoutSec);
        }
        if (mousedownY) {
          verticalFade.style.pointerEvents = "auto";
          const endY = event.clientY;
          let top = endY - startY + Y;
          top = Math.max(0, top);
          const maxHeight = window.innerHeight - verticalScroll.offsetHeight;
          top = Math.min(maxHeight, top);
          const scrollTop = top / (window.innerHeight - verticalScroll.offsetHeight) * (document.documentElement.scrollHeight - window.innerHeight);
          document.documentElement.scrollTop = document.body.scrollTop = scrollTop;
        }
        if (mousedownX) {
          horizontalFade.style.pointerEvents = "auto";
          const endX = event.clientX;
          let left = endX - startX + X;
          left = Math.max(0, left);
          const maxWidth = window.innerWidth - horizontalScroll.offsetWidth;
          left = Math.min(maxWidth, left);
          const scrollLeft = left / (window.innerWidth - horizontalScroll.offsetWidth) * (document.documentElement.scrollWidth - window.innerWidth);
          document.documentElement.scrollLeft = document.body.scrollLeft = scrollLeft;
        }
      }
    });
    window.addEventListener("mousedown", (event) => {
      startY = event.clientY;
      startX = event.clientX;
      Y = (document.documentElement.scrollTop || document.body.scrollTop) / (document.documentElement.scrollHeight - window.innerHeight) * (window.innerHeight - verticalScroll.offsetHeight);
      X = (document.documentElement.scrollLeft || document.body.scrollLeft) / (document.documentElement.scrollWidth - window.innerWidth) * (window.innerWidth - horizontalScroll.offsetWidth);
      if (content.clientWidth - event.clientX < 40 && content.clientWidth - event.clientX >= 0) {
        mousedownY = true;
        document.onselectstart = () => false;
      }
      if (content.clientHeight - event.clientY < 40 && content.clientHeight - event.clientY >= 0) {
        mousedownX = true;
        document.onselectstart = () => false;
      }
    });
    window.addEventListener("mouseup", () => {
      document.onselectstart = null;
      mousedownY = false;
      mousedownX = false;
      verticalFade.style.pointerEvents = "none";
      horizontalFade.style.pointerEvents = "none";
    });
  });

})();