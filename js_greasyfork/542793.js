// ==UserScript==
// @name         扒取正则
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在页面插入按钮，点击执行逻辑
// @author       Your Name
// @match        https://www.mklab.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542793/%E6%89%92%E5%8F%96%E6%AD%A3%E5%88%99.user.js
// @updateURL https://update.greasyfork.org/scripts/542793/%E6%89%92%E5%8F%96%E6%AD%A3%E5%88%99.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 等待页面加载完成
  window.addEventListener('load', () => {
    // 创建按钮
    const btn = document.createElement('button');
    btn.className = 'cyq666'
    btn.textContent = '点击跳转正则图';
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.padding = '10px 15px';
    btn.style.backgroundColor = '#007bff';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

    // 按钮点击事件
    btn.onclick = () => {
      const content = document.querySelector(".regulex-graph-container");
      if (!content) {
        alert("⚠ 找不到图形容器！");
        return;
      }

      const newWin = window.open("", "_blank");

newWin.document.write(`
  <html>
  <head>
    <title>Regulex 独立图</title>
    <style>
      body {
        margin: 0;
        padding: 20px;
        overflow-x: hidden;
        overflow-y: auto;
      }
      .graph-wrapper {
        min-width: 100%;
        min-height: 100%;
        overflow: auto;
        cursor: grab;
      }
      .graph-wrapper:active {
        cursor: grabbing;
      }
      svg {
        display: block;
        width: auto;
        height: auto;
      }
    </style>
  </head>
  <body>
    <div class="graph-wrapper" id="graph">
      ${content.innerHTML}
    </div>

    <script>
      const wrapper = document.getElementById('graph');
      let isDown = false;
      let startX, startY;
      let scrollLeft, scrollTop;

      wrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        wrapper.classList.add('active');
        startX = e.pageX - wrapper.offsetLeft;
        startY = e.pageY - wrapper.offsetTop;
        scrollLeft = wrapper.scrollLeft;
        scrollTop = wrapper.scrollTop;
      });

      wrapper.addEventListener('mouseleave', () => {
        isDown = false;
      });

      wrapper.addEventListener('mouseup', () => {
        isDown = false;
      });

      wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const y = e.pageY - wrapper.offsetTop;
        const walkX = x - startX;
        const walkY = y - startY;
        wrapper.scrollLeft = scrollLeft - walkX;
        wrapper.scrollTop = scrollTop - walkY;
      });
    </script>
  </body>
</html>
`);

      newWin.document.close();
    };

    // 插入页面
    document.body.appendChild(btn);
  });
})();