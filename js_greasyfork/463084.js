// ==UserScript==
// @name         web.telegram下载被禁止下载的图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点开图片向左上角添加一个下载按钮.      GPT NB！
// @author       ohy
// @match        https://web.telegram.org/k/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463084/webtelegram%E4%B8%8B%E8%BD%BD%E8%A2%AB%E7%A6%81%E6%AD%A2%E4%B8%8B%E8%BD%BD%E7%9A%84%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/463084/webtelegram%E4%B8%8B%E8%BD%BD%E8%A2%AB%E7%A6%81%E6%AD%A2%E4%B8%8B%E8%BD%BD%E7%9A%84%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==


(function() {

  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'btn-icon tgico-download';

  // 给下载按钮添加一个点击事件监听器
  downloadBtn.addEventListener('click', () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", window.globalVar, true);
    xhr.responseType = "blob";
    xhr.onload = function(e) {
      if (this.status === 200) {
        const blob = this.response;
        const img = document.createElement("img");
        img.src = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const randomValue = Math.random();
        const fileName = `${randomValue}.jpg`;
        a.href = img.src;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
        console.log('图片已下载到本地');
      }
      timerId = setTimeout(checkElement, 10); // 间隔1秒再次检查元素
    };
    xhr.send();
  });

  // 找到用于定位下载按钮位置的元素，并将下载按钮添加到其后面
  window.globalVar = "";
  let timerId = null; // 定义一个变量，用于保存定时器ID

  function checkElement() {
    const element = document.querySelector("#page-chats > div.media-viewer-whole.no-forwards.active > div.media-viewer-movers > div.media-viewer-mover.center.no-transition.active > div > img");
    if (element) {
      const jss = document.querySelector("#page-chats > div.media-viewer-whole.no-forwards.active > div.media-viewer-movers > div.media-viewer-mover.center.no-transition.active > div > img").src;
      const url = jss;
      if (url !== window.globalVar) {
        window.globalVar = url; // 更新全局变量的值
        const zoomInBtn = document.querySelector('.btn-icon.tgico-zoom.zoom-in');
        zoomInBtn.insertAdjacentElement('afterend', downloadBtn);
      }
      timerId = setTimeout(checkElement, 100); // 间隔100毫秒再次检查元素
    } else {
      timerId = setTimeout(checkElement, 100); // 间隔100毫秒再次检查元素
    }
  }

  // 开始定时器
  timerId = setTimeout(checkElement, 100);

})();
