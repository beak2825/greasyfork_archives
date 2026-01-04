// ==UserScript==
// @name         Gigab2b Product Features Panel (Fixed Button)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  显示Product Features弹窗，按钮固定右中，一键复制内容，无alt提示
// @author       lin lin
// @match        https://www.gigab2b.com/index.php?route=product/product&product_id=*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/543736/Gigab2b%20Product%20Features%20Panel%20%28Fixed%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543736/Gigab2b%20Product%20Features%20Panel%20%28Fixed%20Button%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener('load', () => {
    try {
      // 获取包含“Product Features”标题的元素
      const titleElement = Array.from(document.querySelectorAll("div.text-20px"))
        .find(el => el.textContent.trim() === "Product Features");

      if (!titleElement) return;

      const featureItems = titleElement.parentElement?.querySelectorAll("li");

      if (!featureItems || featureItems.length === 0) return;

      const formattedText = Array.from(featureItems)
        .map((li, i) => `${i + 1}. ${li.textContent.trim()}`)
        .join('\n\n');

      // 创建固定按钮
      const fixedBtn = document.createElement('div');
      fixedBtn.innerText = '📋 Product Features';
      Object.assign(fixedBtn.style, {
        position: 'fixed',
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)',
        zIndex: 9999,
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        userSelect: 'none'
      });
      document.body.appendChild(fixedBtn);

      // 创建浮窗
      const popup = document.createElement('div');
      popup.style.display = 'none';
      Object.assign(popup.style, {
        position: 'fixed',
        top: '60px', // ←←← 悬浮窗距离页面顶部的位置，往上移了
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        width: '600px',
        maxHeight: '70vh',
        overflowY: 'auto',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        fontSize: '15px',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap'
      });

      const topBar = document.createElement('div');
      topBar.style.textAlign = 'right';
      topBar.style.marginBottom = '10px';

      const closeBtn = document.createElement('button');
      closeBtn.innerText = '✖';
      closeBtn.style.marginRight = '10px';
      closeBtn.style.cursor = 'pointer';

      const copyBtn = document.createElement('button');
      copyBtn.innerText = '✅ Copy All';
      copyBtn.style.cursor = 'pointer';

      topBar.appendChild(copyBtn);
      topBar.appendChild(closeBtn);
      popup.appendChild(topBar);

      const content = document.createElement('div');
      content.innerText = formattedText;
      popup.appendChild(content);

      document.body.appendChild(popup);

      // 点击按钮展示/关闭浮窗
      fixedBtn.addEventListener('click', () => {
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
      });

      closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
      });

      copyBtn.addEventListener('click', () => {
        GM_setClipboard(formattedText);
        copyBtn.innerText = '✅ Copied!';
        setTimeout(() => {
          copyBtn.innerText = '✅ Copy All';
        }, 2000);
      });

    } catch (e) {
      console.error('Feature Panel Script Error:', e);
    }
  });
})();
