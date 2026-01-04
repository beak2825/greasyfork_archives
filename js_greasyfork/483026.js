// ==UserScript==
// @name         scroll toolbox
// @namespace    https://github.com/evrestrgb/Tape
// @version      1.0.8
// @supportURL   https://github.com/evrestrgb/Tape/issues
// @description  About scrolling while browsing the web
// @author       evrest
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/KID-joker/userscript/main/assets/scroll.ico
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483026/scroll%20toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/483026/scroll%20toolbox.meta.js
// ==/UserScript==

const icons = {
  top: '<svg t="1663837134829" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1076" width="32" height="32"><path d="M153.6 815.786667c-6.826667 0-17.066667-3.413333-23.893333-6.826667-17.066667-6.826667-27.306667-23.893333-27.306667-44.373333v-129.706667c0-13.653333 6.826667-27.306667 17.066667-37.546667l368.64-334.506666c13.653333-10.24 34.133333-10.24 44.373333 0l368.64 337.92c10.24 10.24 17.066667 23.893333 17.066667 37.546666v98.986667c0 17.066667-10.24 34.133333-23.893334 44.373333-17.066667 10.24-34.133333 10.24-51.2 0l-283.306666-157.013333c-17.066667-10.24-23.893333-30.72-13.653334-47.786667 10.24-17.066667 30.72-23.893333 47.786667-13.653333l256 143.36v-64.853333L512 331.093333 170.666667 641.706667v92.16l252.586666-170.666667c17.066667-10.24 37.546667-6.826667 47.786667 10.24s6.826667 37.546667-10.24 47.786667l-279.893333 187.733333c-6.826667 6.826667-17.066667 6.826667-27.306667 6.826667z" fill="#9850FF" p-id="1077"></path></svg>',
  bottom: '<svg t="1663837149732" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1304" width="32" height="32"><path d="M512 815.786667c-6.826667 0-17.066667-3.413333-23.893333-10.24L119.466667 471.04c-10.24-6.826667-17.066667-23.893333-17.066667-37.546667V334.506667c0-17.066667 10.24-34.133333 23.893333-44.373334 17.066667-10.24 34.133333-10.24 51.2 0l283.306667 157.013334c17.066667 10.24 23.893333 30.72 13.653333 47.786666-10.24 17.066667-30.72 23.893333-47.786666 13.653334L170.666667 361.813333v64.853334l341.333333 310.613333 341.333333-310.613333V334.506667l-252.586666 170.666666c-17.066667 10.24-37.546667 6.826667-47.786667-10.24-10.24-17.066667-6.826667-37.546667 10.24-47.786666l279.893333-187.733334c17.066667-10.24 37.546667-10.24 51.2-3.413333 17.066667 10.24 27.306667 27.306667 27.306667 47.786667v129.706666c0 13.653333-6.826667 27.306667-17.066667 37.546667l-368.64 337.92c-6.826667 6.826667-17.066667 6.826667-23.893333 6.826667z" fill="#9850FF" p-id="1305"></path></svg>',
  autoRead: '<svg t="1663851454204" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="922" width="32" height="32"><path d="M680.5 874c-96.2-1.2-183.7-54.9-228.3-140.1-4.3-7.6-4.3-16.9 0-24.6C497 624.4 584.4 571 680.5 570h0.2c96.2 1.2 183.7 54.9 228.3 140.1 4.3 7.6 4.3 16.9 0 24.6A260.998 260.998 0 0 1 680.7 874h-0.2zM502.7 722c37.4 62.2 105 101.3 177.9 102.3 72.9-0.9 140.5-40 177.9-102.2-37.4-62.2-105-101.3-177.9-102.3-72.9 0.9-140.6 39.9-177.9 102.2z" fill="#9850FF" p-id="923"></path><path d="M680.6 794.5c-40 0-72.5-32.5-72.5-72.5s32.5-72.5 72.5-72.5 72.5 32.5 72.5 72.5-32.5 72.5-72.5 72.5z m0-111.5c-21.5 0-39 17.5-39 39s17.5 39 39 39 39-17.5 39-39-17.5-39-39-39zM713.2 443c0-17.1-13.1-31-29.2-31H321.4c-16.1 0-29.2 13.9-29.2 31s13.1 31 29.2 31H684c15.9 0 29-13.9 29.2-31zM321 529.9c-16.1 0-29.2 13.9-29.2 31s13.1 31 29.2 31h143.1c16 0 29.1-13.9 29.2-31 0-17.1-13.1-31-29.2-31H321zM684 284.5H321.4c-16.1 0-29.2 13.9-29.2 31s13.1 31 29.2 31H684c16 0 29.1-13.9 29.2-31 0-17.1-13.1-31-29.2-31z" fill="#9850FF" p-id="924"></path><path d="M521.3 851.5H228.4s-0.1-0.1-0.1 0V170.6s0.1-0.1 0-0.1h566.9s0.1 0.1 0.1 0V527c0 16.6 13.4 30 30 30s30-13.4 30-30V170.5c0-33.1-26.9-60-60-60h-567c-33.1 0-60 26.9-60 60v681c0 33.1 26.9 60 60 60h293c16.6 0 30-13.4 30-30s-13.4-30-30-30z" fill="#9850FF" p-id="925"></path></svg>',
  stopRead: '<svg t="1663851470156" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1152" width="32" height="32"><path d="M728.9 710.7v-1.2c0-40-32.5-72.5-72.5-72.5h-1.7l74.2 73.7zM666.4 747.2c-3.2 0.8-6.5 1.3-9.9 1.3-21.5 0-39-17.5-39-39 0-3.3 0.4-6.6 1.2-9.6L593 674.4c-5.8 10.4-9.1 22.4-9.1 35.1 0 40 32.5 72.5 72.5 72.5 12.9 0 25-3.4 35.6-9.3l-25.6-25.5z" fill="#9850FF" p-id="1153"></path><path d="M720.5 800.9c-20.4 6.8-42 10.6-64 10.9-72.9-1-140.5-40.1-177.9-102.3 18.6-31.1 44.7-56.3 75.3-74l-36.6-36.3c-37 23.9-67.9 57.1-89.2 97.5-4.3 7.7-4.3 17 0 24.6 44.6 85.2 132.1 138.9 228.3 140.1h0.2c36-0.4 70.8-8.1 102.7-22.2l-38.8-38.3zM884.9 697.6c-44.6-85.2-132.1-138.9-228.3-140.1h-0.2c-24.4 0.3-48.3 3.9-71.1 10.6l42 41.6c9.6-1.5 19.4-2.3 29.2-2.4 72.9 1 140.5 40.1 177.9 102.3-13.2 21.9-30.1 40.9-49.6 56.4l35.7 35.5c26-21.6 48.1-48.3 64.4-79.3 4.3-7.7 4.3-17 0-24.6zM787.707 854.424l-272.635-270.56 35.22-35.49 272.635 270.56zM713.2 443c0-17.1-13.1-31-29.2-31H321.4c-16.1 0-29.2 13.9-29.2 31s13.1 31 29.2 31H684c15.9 0 29-13.9 29.2-31zM321 529.9c-16.1 0-29.2 13.9-29.2 31s13.1 31 29.2 31h143.1c16 0 29.1-13.9 29.2-31 0-17.1-13.1-31-29.2-31H321zM684 284.5H321.4c-16.1 0-29.2 13.9-29.2 31s13.1 31 29.2 31H684c16 0 29.1-13.9 29.2-31 0-17.1-13.1-31-29.2-31z" fill="#9850FF" p-id="1154"></path><path d="M521.3 851.5H228.4s-0.1-0.1-0.1 0V170.6s0.1-0.1 0-0.1h566.9s0.1 0.1 0.1 0V527c0 16.6 13.4 30 30 30s30-13.4 30-30V170.5c0-33.1-26.9-60-60-60h-567c-33.1 0-60 26.9-60 60v681c0 33.1 26.9 60 60 60h293c16.6 0 30-13.4 30-30s-13.4-30-30-30z" fill="#9850FF" p-id="1155"></path></svg>'
};

(function () {
  /**
   * html
   */
  // toolbox
  function insertToolbox() {
    // 在iframe中
    if (unsafeWindow.self != unsafeWindow.top) {
      return;
    }
    // 没有滚动条
    if (getScrollValue('scrollHeight') == getScrollValue('clientHeight')) {
      return;
    }
    const toolbox = document.querySelector('#userscript-scroll-toolbox');
    if (toolbox) {
      return;
    }
    const clientX = GM_getValue('clientX');
    const clientY = GM_getValue('clientY');
    const box = document.createElement('div');
    box.id = 'userscript-scroll-toolbox';
    box.draggable = true;
    box.ondragend = moveToolbox;
    setToolboxPosition(box, clientX, clientY);
    const fragment = document.createDocumentFragment();
    const list = ['top', 'bottom', 'read'];
    list.forEach(ele => {
      const button = document.createElement('div');
      button.className = 'tool-btn';
      button.addEventListener('click', eventFuncList[ele]);
      const icon = document.createElement('div');
      icon.id = `tool-${ele}`;
      icon.className = 'tool-icon';
      if (ele == 'read') {
        icon.innerHTML = icons.autoRead;
      } else {
        icon.innerHTML = icons[ele];
      }
      button.appendChild(icon);
      fragment.appendChild(button);
    })
    box.appendChild(fragment);
    document.body.appendChild(box);
  }
  document.addEventListener('DOMContentLoaded', function () {
    // 数据加载
    setTimeout(() => {
      insertToolbox();
    }, 3000);
  });
  /**
   * style
   */
  const cssStyle = `
    #userscript-scroll-toolbox {
      position: fixed;
      z-index: 999999;
      right: 24px;
      bottom: 256px;
      background-color: #fbfbfb;
      width: 44px;
      padding: 6px 0;
      border-radius: 22px;
    }

    #userscript-scroll-toolbox .tool-btn {
      width: 100%;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    #userscript-scroll-toolbox .tool-btn:hover {
      box-shadow:0 3px 5px 0 rgba(0,0,0,.1)
    }

    #userscript-scroll-toolbox .tool-icon {
      height: 32px;
      width: 32px;
    }

    #userscript-scroll-toolbox .tool-icon svg {
      height: 32px;
      width: 32px;
    }
  `
  GM_addStyle(cssStyle);

  /**
   * script
   */
  function moveToolbox(event) {
    const { clientX, clientY } = event;
    const element = event.srcElement;
    setToolboxPosition(element, clientX, clientY);
    GM_setValue('clientX', clientX);
    GM_setValue('clientY', clientY);
  }
  function setToolboxPosition(element, clientX, clientY) {
    if (clientX) {
      element.style.left = `${clientX}px`;
      element.style.right = 'unset';
    }
    if (clientY) {
      element.style.top = `${clientY}px`;
      element.style.bottom = 'unset';
    }
  }
  const eventFuncList = {
    top: scrollTop,
    bottom: scrollBottom,
    read
  }
  function scrollTop() {
    stopRead();
    unsafeWindow.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }
  function scrollBottom() {
    stopRead();
    unsafeWindow.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    })
  }
  let scrollRequestID;
  function read(event) {
    if (scrollRequestID) {
      stopRead();
    } else {
      function scroll() {
        unsafeWindow.scrollBy({
          top: 1
        });
        if (getScrollValue('scrollHeight') - getScrollValue('scrollTop') <= getScrollValue('clientHeight') + 6) {
          stopRead();
        } else {
          scrollRequestID = unsafeWindow.requestAnimationFrame(scroll);
        }
      }
      scrollRequestID = unsafeWindow.requestAnimationFrame(scroll);
      const readIcon = document.querySelector('#tool-read');
      readIcon.innerHTML = icons.stopRead;
    }
  }
  function stopRead() {
    const readIcon = document.querySelector('#tool-read');
    unsafeWindow.cancelAnimationFrame(scrollRequestID);
    scrollRequestID = null;
    readIcon.innerHTML = icons.autoRead;
  }
  function getScrollValue(key) {
    return document.documentElement[key] || document.body[key];
  }
  // 监听视频全屏
  document.addEventListener("fullscreenchange", function (event) {
    const element = document.fullscreenElement;
    const toolbox = document.querySelector('#userscript-scroll-toolbox');
    if (element !== null) {
      toolbox.style.display = 'none';
    } else {
      toolbox.style.display = 'block';
    }
  });
})();