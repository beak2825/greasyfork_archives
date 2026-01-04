// ==UserScript==
// @name         Baidu Homepage Customization - Remove Ai
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  移除所有AI相关内容，只展示纯粹搜索工具
// @author       GuoCS
// @match        https://www.baidu.com/
// @icon         https://www.baidu.com/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430572/Baidu%20Homepage%20Customization%20-%20Remove%20Ai.user.js
// @updateURL https://update.greasyfork.org/scripts/430572/Baidu%20Homepage%20Customization%20-%20Remove%20Ai.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 1) 样式：placeholder,suggestion居中，隐藏两个 AI div；初始阶段隐藏 placeholder
  const css = `

  textarea#chat-textarea::placeholder,
        input#kw::placeholder,
        input[name="wd"]::placeholder {
            text-align: center !important;
            font-family:"楷体","KaiTi",serif !important;
            font-style: italic !important;
            font-size:18px;
            color:#555 !important;
        }
  textarea#chat-textarea,
        input#kw,
        input[name="wd"] {
            text-align: center !important;
            font-family:"楷体","KaiTi",serif !important;
            font-size:20px !important;
            color:black !important;
        }
        /* 普通文字和命中关键词统一字体 */
        .bdsug-item .sug-content  {
            font-family: "KaiTi", "楷体", serif !important; /* 统一为楷体 */
            font-size: 16px !important;
            font-weight: normal !important; /* 去掉加粗 */
            display: block !important;
            color: #b5c20!important;          /* 统一颜色 */
            text-align: center !important;
            width: 100% !important;
        }
        .bdsug-item .sug-content b {
            font-family: "KaiTi", "楷体", serif !important; /* 统一为楷体 */
            font-size: 16px !important;
            font-weight: normal !important; /* 去掉加粗 */
            color: #000 !important;          /* 统一颜色 */
            text-align: center !important;
            width: 100% !important;
        }
        .bdsug-item .ask-ai-tail-wrapper {
            display: none !important;
        }

    .chat-input-tool,.panel-list_8jHmm ,.ai-tools-container_S4Ind ,#bottom_layer { display: none !important; }

  #chat-input-top-band{ padding:2px;}
/* 搜索框&预测框背景透明
        /输入框本身透明 /
        #chat-textarea {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
        }

        / 外层容器透明 /
        .chat-input-wrapper-border,
        .chat-input-wrapper-box-shadow,
        .chat-input-background_3edHa,
        .chat-normal-wrapper,
        .two-line-input {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }
*/
  /*搜索框颜色*/
     .chat-input-wrapper{
        border:transparent !important;
        }
    .__placeholder_hidden__::placeholder { color: transparent !important; }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.documentElement.appendChild(styleEl);

  // 2) 移除两个 div（动态注入也拦截）
  const removeIfMatch = (node) => {
    if (!(node instanceof Element)) return;
    if (node.matches('.chat-input-tool, .panel-list_8jHmm, ')) {
      node.remove();
    } else {
      node.querySelectorAll('.chat-input-tool, .panel-list_8jHmm').forEach(el => el.remove());
    }
  };
  const obs = new MutationObserver(muts => {
    for (const m of muts) {
      m.addedNodes.forEach(removeIfMatch);
      if (m.type === 'attributes' && m.target) removeIfMatch(m.target);
    }
  });
  obs.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  removeIfMatch(document);

  // 3) 工具函数：定位搜索输入
  function getSearchInput() {
    return (
      document.querySelector('textarea#chat-textarea.chat-input-textarea.chat-input-scroll-style') ||
      document.querySelector('input#kw') ||
      document.querySelector('input[name="wd"]')
    );
  }

  // 4) 初始化：隐藏默认 placeholder
  let input = getSearchInput();
  if (input) input.classList.add('__placeholder_hidden__');

  // 5) 设置新 placeholder 并显示
  function setPlaceholderAndShow(input, text) {
    if (!input) return;
    input.setAttribute('placeholder', text.trim());
    input.removeAttribute('data-ai-placeholder');
    input.removeAttribute('data-normal-placeholder');
    input.classList.remove('__placeholder_hidden__');
  }

  // 6) 防止页面脚本篡改 placeholder
  function guardPlaceholder(input, text) {
    if (!input) return;
    const guard = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'placeholder') {
          const current = input.getAttribute('placeholder') || '';
          if (current.trim() !== text.trim()) {
            input.setAttribute('placeholder', text.trim());
          }
        }
      }
    });
    guard.observe(input, { attributes: true, attributeFilter: ['placeholder'] });
  }

  // 7) 搜索逻辑：空时用 placeholder
  function performSearch(input) {
    if (!input) return;
    const keyword = (input.value && input.value.trim())
      ? input.value.trim()
      : ((input.getAttribute('placeholder') || '').trim());
    if (!keyword) return;
    const url = 'https://www.baidu.com/s?wd=' + encodeURIComponent(keyword);
    window.location.href = url;
  }

  // 8) 绑定事件
  function bindSearchEvents(input, text) {
    if (!input) return;
    // 移除内联阻止回车
    if (input.hasAttribute('onkeydown')) input.removeAttribute('onkeydown');
    // 回车触发搜索
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(input);
      }
    });
    // 表单提交兜底
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        if (!input.value.trim()) {
          const ph = (input.getAttribute('placeholder') || '').trim();
          if (ph) input.value = ph;
        }
      }, true);
    }
    guardPlaceholder(input, text);
  }

  // 9) 获取诗词并应用
  fetch('https://v1.jinrishici.com/all.txt')
    .then(r => r.text())
    .then(text => {
      input = input || getSearchInput();
      if (!input) return;
      setPlaceholderAndShow(input, text);
      bindSearchEvents(input, text);
    })
    .catch(() => {
      input = input || getSearchInput();
      if (input) input.classList.remove('__placeholder_hidden__');
    });

  // 10) 等输入框出现后再初始化
  const waitInput = new MutationObserver(() => {
    if (!input) {
      input = getSearchInput();
      if (input) input.classList.add('__placeholder_hidden__');
    }
  });
  waitInput.observe(document, { childList: true, subtree: true });
})();
