// ==UserScript==
// @name         自动加载css.js
// @namespace    http://tampermonkey.net/
// @version      2025-06-11-2
// @description  加载远程/本地css样式文件
// @author       You
// @include *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533808/%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BDcssjs.user.js
// @updateURL https://update.greasyfork.org/scripts/533808/%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BDcssjs.meta.js
// ==/UserScript==


(function() {
  // 默认的远程地址
  let remoteCssUrl = localStorage.getItem('remoteCssUrl') || 'https://localhost/site-resources/dynamic-css.css';
  let autoLoad = localStorage.getItem('autoLoadCss') === 'true';
  let intervalId = null;
  let lastCss = '';
  const borderCss = `
.border-animate{
    position: relative;
}
.border-animate::before {
    pointer-events: none;
    opacity: 0.5;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999999;
    padding: 3px;
    background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet, red);
    background-size: 200% 200%;
    /*border-radius: 12px;*/
    -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: borderSlide 3s linear infinite;
}

@keyframes borderSlide {
    0% {
        background-position: 0% 50%;
    }
    100% {
        background-position: 100% 50%;
    }
}
  `
  // 添加控制面板
  const ctrlDiv = document.createElement('div');
  ctrlDiv.id = 'css-controller';
  /*  ctrlDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999999999999;
      background: rgba(255,255,255,0.9);
      padding: 4px;
      font-size: 12px;
      display: flex;
      gap: 4px;
    `;*/
  ctrlDiv.innerHTML = `
<style>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.spin {
  box-shadow: 0 0px 8px rgb(67 217 169 / 80%), inset 0 3px 1px rgb(41 229 160 / 54%) !important;
  animation: spin 3s linear infinite;
}
#css-fab-wrapper {
  position: fixed;
  top: 100px;
  left: 20px;
  z-index: 9999;
  display: flex;
  gap: 10px;
  /*transition: left 0.1s ease; !* 平滑吸附动画 *!*/
}

#css-fab {
  opacity: 0.75;
  background: rgba(227,227,227,0.1);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  user-select: none;
  font-size: 2.5em;
}

#css-fab-wrapper:hover #css-fab {
  font-size: 2.8em;
  transition: font-size 0.1s;
}

.fab-btns {
  top: 0;
  left: 60px;
  display: none;
  flex-direction: column;
  gap: 6px;
}
#css-fab-wrapper:hover .fab-btns {
  display: flex;
}
.fab-btns button {
  padding: 4px 8px;
  font-size: 12px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}
</style>

<div id="css-fab-wrapper">
  <div id="css-fab">⚙️</div>
  <div class="fab-btns">
    <button id="auto-load-btn">自动加载CSS</button>
    <button id="clear-css-btn">清除CSS</button>
    <button id="manual-css-btn">手动载入CSS</button>
    <button id="set-css-url-btn">设置 CSS 地址</button>
  </div>
</div>
  `;
  document.body.appendChild(ctrlDiv);

  function saveFabPosition(left, top) {
    localStorage.setItem('fabPosition', JSON.stringify({ left, top }));
  }

  function loadFabPosition() {
    const pos = JSON.parse(localStorage.getItem('fabPosition'));
    if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
      wrapper.style.left = `${pos.left}px`;
      wrapper.style.top = `${pos.top}px`;
    }
  }

  const getDocument = () => {
    const iframe = document.querySelector(".lc-simulator-content-frame")
    return iframe?.contentDocument || iframe?.contentWindow?.document || document;
  }

  // 样式标签处理
  const getStyleTag = () => {
    const doc = getDocument();
    let tag = doc.querySelector('#my-dynamic-style');
    if (!tag) {
      const header = doc.querySelector('head')
      tag = document.createElement('style');
      tag.id = 'my-dynamic-style';
      header.appendChild(tag);
    }
    return tag;
  };

  // 拉取并应用 CSS
  async function fetchAndApplyCSS() {
    try {
      const res = await fetch(remoteCssUrl);
      const css = await res.text();
      if (css !== lastCss) {
        getStyleTag().innerHTML = borderCss + css;
        lastCss = css;
        console.log('[CSS] 样式已更新');
      }
    } catch (err) {
      console.warn('[CSS] 加载失败:', err);
      window.Next?.Message?.error?.(`[CSS] 加载失败, 请检查设置的css地址: ${err} ${remoteCssUrl}`);
    }
  }

  const fabIcon = document.getElementById('css-fab');

  const stopAutoLoad = () => {
    clearInterval(intervalId);
    intervalId = null;
    autoLoad = false;
    fabIcon.classList.remove('spin');
    document.getElementById('auto-load-btn').innerText = '自动加载CSS';
    console.log('[CSS] 自动加载已关闭');
    localStorage.setItem('autoLoadCss', false)
  }

  function highLightHtml(times = 3) {
    if (times <= 0){
      return
    }
    getDocument()?.querySelector('html')?.classList?.add('border-animate')
    setTimeout(() => {
      getDocument()?.querySelector('html')?.classList?.remove('border-animate')
      setTimeout(() => {
        highLightHtml(times - 1)
      }, 300)
    }, 700)
  }

    const startAutoLoad = () => {
       fetchAndApplyCSS();
      highLightHtml()
      intervalId = setInterval(fetchAndApplyCSS, 1000);
      autoLoad = true;
      fabIcon.classList.add('spin');
      document.getElementById('auto-load-btn').innerText = '关闭自动加载';
      console.log('[CSS] 自动加载已开启');
      localStorage.setItem('autoLoadCss', true)
    }

    if (autoLoad){
      startAutoLoad()
    }

  document.getElementById('auto-load-btn').addEventListener('click', () => {
    if (autoLoad) {
      stopAutoLoad()
    } else {
        startAutoLoad()
    }
  });
  // 清除按钮逻辑
  document.getElementById('clear-css-btn').addEventListener('click', () => {
    stopAutoLoad()
    const tag = getStyleTag();
    if (tag) tag.remove();
    lastCss = '';
    console.log('[CSS] 样式已清除');
    window.Next?.Message?.success?.('[CSS] 样式已清除')
  });

  // 手动载入按钮逻辑
  document.getElementById('manual-css-btn').addEventListener('click', () => {
    fetchAndApplyCSS();
    highLightHtml()
    console.log('[CSS] 手动载入完成');
    window.Next?.Message?.success?.('[CSS] 手动载入完成')
  });

  // 设置按钮事件
  document.getElementById('set-css-url-btn').addEventListener('click', () => {
    const input = prompt('请输入新的远程 CSS 地址：', remoteCssUrl);
    if (input && input.trim()) {
      remoteCssUrl = input.trim();
      localStorage.setItem('remoteCssUrl', remoteCssUrl);
      console.log('已更新 CSS 地址');
      window.Next?.Message?.success?.('已更新 CSS 地址');
    }
  });



  // 拖动逻辑
  const wrapper = document.getElementById('css-fab-wrapper');
  const fab = document.getElementById('css-fab');
  let isDragging = false, offsetX = 0, offsetY = 0;

  loadFabPosition();

  fab.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - wrapper.offsetLeft;
    offsetY = e.clientY - wrapper.offsetTop;
    fab.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', e => {
    if (isDragging) {
      const halfWidth = wrapper.offsetWidth / 2;
      const halfHeight = wrapper.offsetHeight / 2;

      const maxLeft = window.innerWidth - halfWidth;
      const maxTop = window.innerHeight - halfHeight;

      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;

      newLeft = Math.max(-halfWidth, Math.min(newLeft, maxLeft));
      newTop = Math.max(-halfHeight, Math.min(newTop, maxTop));

      wrapper.style.left = `${newLeft}px`;
      wrapper.style.top = `${newTop}px`;

      saveFabPosition(newLeft, newTop); // 保存位置
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    fab.style.cursor = 'grab';
  });

})();