// ==UserScript==
// @name         阿里云盘多倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.24
// @description  在原来作者版本的基础上修正了暂停和切换视频后倍速还原的问题（https://greasyfork.org/zh-CN/scripts/449912-%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%A4%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE），并增加记忆设定的播放倍速，去掉svip，修复排序。阿里云视频倍速播放增加了额外倍速的选择，增加的方式是在原有的倍速播放样式基础上增加，保证使用方便及样式统一。
// @author       rogerlaw666
// @match        https://www.alipan.com/drive/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyundrive.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463169/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%A4%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/463169/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%A4%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.addEventListener("load", () => {
    let playbackRate = 1;
    let video = null;
    let isChanged = false;

    const interval = setInterval(() => {
      video = document.querySelector("video");
      if (video) {
        video.onplay = function () {
          video.playbackRate = playbackRate;
        };
      } else {
        isChanged = false;
      }
      const ul = document.querySelector('div[class^="drawer-list-grid"]');
      if (!ul || !video || isChanged) {
        return;
      }
      const close =
        ul.parentElement.parentElement.previousElementSibling.children.item(1);
      let firstChild = [...ul.children].find(
        (el) => el.firstChild.textContent === "1.5 倍"
      );
      const originChild = firstChild;
      const rates = ["4", "3", "2.5", "2"];
      rates.forEach((rate) => {
        const cloneNode = firstChild.cloneNode(true);
        cloneNode.firstChild.innerHTML = `${rate} 倍`;
        ul.insertBefore(cloneNode, firstChild);
        firstChild = cloneNode;
      });
      ul.insertBefore(originChild, firstChild);
      const backRateNodes = [...ul.children];
      const changeSelectColor = (select) => {
        setTimeout(() => {
          backRateNodes.forEach((item) => {
            item.dataset.isCurrent = "false";
          });
          if (!select.dataset.isCurrent) {
            select.parentElement.dataset.isCurrent = "true";
          } else {
            select.dataset.isCurrent = "true";
          }
        });
      };
      playbackRate = localStorage.getItem("playbackRate") || 1;
      const currentTarget = [...ul.children].find(
        (el) => el.firstChild.textContent === `${playbackRate} 倍`
      );
      changeSelectColor(currentTarget);
      const tagNodes = document.querySelectorAll('div[class*="featureTag"]');
      for (const node of tagNodes) {
        node.parentNode.style = "display: none;";
      }
      ul.addEventListener("click", (e) => {
        const target = e.target;
        playbackRate = target.textContent.replace(" 倍", "");
        video.playbackRate = playbackRate;
        localStorage.setItem("playbackRate", playbackRate);
        changeSelectColor(target);
        close.click();
      });
      isChanged = true;
    }, 1000);
  });
})();
