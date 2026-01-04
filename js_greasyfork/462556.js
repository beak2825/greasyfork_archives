// ==UserScript==
// @name         德云色房管后台助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://live.bilibili.com/7777*
// @match        https://live.bilibili.com/blanc/7777*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462556/%E5%BE%B7%E4%BA%91%E8%89%B2%E6%88%BF%E7%AE%A1%E5%90%8E%E5%8F%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/462556/%E5%BE%B7%E4%BA%91%E8%89%B2%E6%88%BF%E7%AE%A1%E5%90%8E%E5%8F%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  var dysPercent = 30; // 后台屏幕百分占比，iFrame 占屏幕宽度的百分比
  dys_script(dysPercent);
})();

function dys_script(dysPercent) {
  const BILI_PERCENT = 100 - dysPercent; // 计算原始内容占屏幕宽度的百分比
  const live_dom_class_name = "live-room-app"

  if (location.href.indexOf("https://live.bilibili.com/blanc/7777") == -1) {
      location.assign("https://live.bilibili.com/blanc/7777");
  }

  // 创建样式元素以调整全屏模式下播放器和聊天框的宽度
  const style = document.createElement("style");
  style.type = "text/css";
  style.textContent = `.player-full-win .player-section2 {width: ${BILI_PERCENT}% !important;height: 100%;padding: 0!important;left: 0!important;border: none!important}`;
  document.head.appendChild(style);

  // 创建包裹容器，用于放置原始内容和 iFrame
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `overflow: hidden;display: flex;height:${window.innerHeight}px;`
  const appContent = document.querySelector('.'+ live_dom_class_name); // 查找 live-room-app 元素
  if (appContent != null) {
    const origin = document.createElement('div');
    origin.id = "origin";
    origin.style.cssText = `width: ${BILI_PERCENT}%;overflow: auto;`;
    appContent.parentNode.removeChild(appContent)
    origin.appendChild(appContent);
    wrapper.append(origin);
  }

  const url = window.location.href.split('?')[0];
  const dys = document.createElement('iframe');
  dys.setAttribute('style', `width:${dysPercent}%; margin-top:50px;height:${window.innerHeight}px`);
  dys.src = `https://deyunse.top/admin/#/live-manager-no-video?origin=${url}`;
  dys.id = 'dys-live';
  wrapper.append(dys);

  document.body.append(wrapper);
  setTimeout(init, 1000);
}

function init() {
  // 监听全屏模式的变化
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type !== "attributes") return;
      const video = document.querySelector('.player-section');
      const chats = document.querySelector('.aside-area');
      if (mutation.attributeName === 'class') {
        const body = document.body;
        const newClass = video.getAttribute('class');
        if (body.classList.contains("player-full-win")) {
          if (newClass.includes("player-section2")) return;
          video.setAttribute('class', `${newClass} player-section2`);
          chats.style.width = '0px';
        } else {
          if (!newClass.includes("player-section2")) return;
          const replacedClass = newClass.replace(' player-section2', '');
          video.setAttribute('class', replacedClass);
          chats.style.width = '302px';
        }
      }
    });
  });
  mutationObserver.observe(document.body, {
    attributes: true // 监听属性变化
  });
}
