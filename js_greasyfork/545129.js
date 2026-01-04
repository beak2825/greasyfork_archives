// ==UserScript==
// @name         ChatGPT Font Customizer
// @namespace    https://example.com/userscripts
// @version      1.0
// @description  本地苹方映射 + 正文排版 + 代码中文用苹方 + 输入框对齐 + 按钮/工具条中文用苹方 + 快捷设置
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545129/ChatGPT%20Font%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/545129/ChatGPT%20Font%20Customizer.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const PF_FAMILY = 'PingFang Local';
  const faces = [
    { wt: 200, names: ['PingFang SC ExtraLight','PingFang ExtraLight','PingFangSC-ExtraLight','PingFang ExtraLight_0'] },
    { wt: 300, names: ['PingFang SC Light','PingFang Light','PingFangSC-Light','PingFang Light_0'] },
    { wt: 400, names: ['PingFang SC Regular','PingFang Regular','PingFangSC-Regular','PingFang Regular_0','PingFang SC'] },
    { wt: 500, names: ['PingFang SC Medium','PingFang Medium','PingFangSC-Medium','PingFang Medium_0'] },
    { wt: 700, names: ['PingFang SC Bold','PingFang Bold','PingFangSC-Bold','PingFang Bold_0'] },
    { wt: 800, names: ['PingFang SC Heavy','PingFang Heavy','PingFangSC-Heavy','PingFang Heavy_0'] },
  ];
  function buildFontFaceCSS() {
    return faces.map(f => {
      const src = f.names.map(n => `local("${n}")`).join(', ');
      return `@font-face{font-family:"${PF_FAMILY}";font-style:normal;font-weight:${f.wt};src:${src};}`;
    }).join('\n');
  }

  const DEF_TEXT_SIZE = GM_getValue('cgpt_font_size', '15px');
  const DEF_TEXT_LH   = GM_getValue('cgpt_line_height', '1.65');
  const DEF_TEXT_WT   = GM_getValue('cgpt_font_weight', '500'); // 仅正文区

  const KEY_CODE_FONT = 'cgpt_code_font';
  const KEY_CODE_SIZE = 'cgpt_code_size';
  const KEY_CODE_LH   = 'cgpt_code_lh';
  const KEY_CODE_TAB  = 'cgpt_code_tab';

  const DEF_CODE_FONT = GM_getValue(
    KEY_CODE_FONT,
    '"JetBrains Mono","Fira Code","Cascadia Code","SFMono-Regular",Menlo,Monaco,Consolas,"Liberation Mono","DejaVu Sans Mono","Courier New","' +
    PF_FAMILY + '","PingFang SC",monospace'
  );
  const DEF_CODE_SIZE = GM_getValue(KEY_CODE_SIZE, '14px');
  const DEF_CODE_LH   = GM_getValue(KEY_CODE_LH, '1.6');
  const DEF_CODE_TAB  = GM_getValue(KEY_CODE_TAB, '2');

  const DEF_INPUT_LH  = '1.55';

  GM_addStyle(`
    ${buildFontFaceCSS()}

    :root{
      --cgpt-font-family: "${PF_FAMILY}","PingFang SC","Microsoft YaHei",
                          "Hiragino Sans GB","Source Han Sans SC","Noto Sans CJK SC","Noto Sans SC",
                          "WenQuanYi Micro Hei","Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;
      --cgpt-font-size: ${DEF_TEXT_SIZE};
      --cgpt-line-height: ${DEF_TEXT_LH};
      --cgpt-font-weight: ${DEF_TEXT_WT};

      --cgpt-code-font: ${DEF_CODE_FONT};
      --cgpt-code-size: ${DEF_CODE_SIZE};
      --cgpt-code-lh:   ${DEF_CODE_LH};
      --cgpt-code-tab:  ${DEF_CODE_TAB};

      --cgpt-input-lh:  ${DEF_INPUT_LH};
    }

    html, body, #__next{
      font-family: var(--cgpt-font-family) !important;
      font-size: var(--cgpt-font-size) !important;
      line-height: var(--cgpt-line-height) !important;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .markdown, .prose, [class*="markdown"]{ font-weight: var(--cgpt-font-weight) !important; }
    .markdown p, .prose p{ margin-bottom: .85em !important; }

    .markdown a, .prose a{ color:#3366cc; }
    .markdown a:visited, .prose a:visited{ color:#3366cc; }

    .markdown pre, .markdown code, .prose pre, .prose code,
    pre code, pre[class*="language-"], code[class*="language-"],
    .hljs, .shiki,
    [class*="syntax"], [class*="code-block"], [data-code-block], [data-testid*="code"]{
      font-family: var(--cgpt-code-font) !important; /* ASCII 等宽，CJK 用苹方 */
      font-size: var(--cgpt-code-size) !important;
      line-height: var(--cgpt-code-lh) !important;
      font-weight: 400 !important;
      font-variant-ligatures: contextual common-ligatures;
      font-feature-settings: "calt" 1, "liga" 1;
      tab-size: var(--cgpt-code-tab);
    }

    .markdown pre *, .prose pre *, .hljs *, .shiki *{
      font-family: inherit !important;
      font-size: inherit !important;
      line-height: inherit !important;
      font-weight: inherit !important;
    }

    textarea, input, [contenteditable="true"]{
      font-family: var(--cgpt-font-family) !important;
      font-weight: 400 !important;
      line-height: var(--cgpt-input-lh) !important;
    }

    button, [role="button"], .btn, [class*="Button"], [class*="btn-"],
    [class*="copy"], [data-testid*="copy"], [data-testid*="toolbar"], [class*="toolbar"]{
      font-family: var(--cgpt-font-family) !important;
    }

    .sidebar, [class*="sidebar"], nav, [class*="Nav"], .overflow-y-auto {
      font-weight: 500 !important; /* 500 比普通粗一点，不会撑开布局 */
    }


    .markdown, .prose{ padding-top:.35em !important; padding-bottom:.35em !important; }
  `);

  window.addEventListener('keydown', (e) => {
    if (!(e.altKey && e.shiftKey && (e.key === 'F' || e.key === 'f'))) return;
    e.preventDefault();
    const curSize = GM_getValue('cgpt_font_size', DEF_TEXT_SIZE);
    const curLH   = GM_getValue('cgpt_line_height', DEF_TEXT_LH);
    const curWT   = GM_getValue('cgpt_font_weight', DEF_TEXT_WT);

    const newSize = prompt('正文字号（如 15px/16px）：', curSize) || curSize;
    const newLH   = prompt('正文行高（如 1.6/1.7）：', curLH) || curLH;
    const newWT   = prompt('正文字重（400 普通 / 500 中粗 / 600 粗）：', curWT) || curWT;

    GM_setValue('cgpt_font_size', newSize.trim());
    GM_setValue('cgpt_line_height', newLH.trim());
    GM_setValue('cgpt_font_weight', newWT.trim());

    const root = document.documentElement;
    root.style.setProperty('--cgpt-font-size', newSize.trim());
    root.style.setProperty('--cgpt-line-height', newLH.trim());
    root.style.setProperty('--cgpt-font-weight', newWT.trim());

    alert('已更新：正文 字号/行高/字重 ✅');
  });

  window.addEventListener('keydown', (e) => {
    if (!(e.altKey && e.shiftKey && (e.key === 'C' || e.key === 'c'))) return;
    e.preventDefault();

    const curFont = GM_getValue(KEY_CODE_FONT, DEF_CODE_FONT);
    const curSize = GM_getValue(KEY_CODE_SIZE, DEF_CODE_SIZE);
    const curLH   = GM_getValue(KEY_CODE_LH,   DEF_CODE_LH);
    const curTab  = GM_getValue(KEY_CODE_TAB,  DEF_CODE_TAB);

    const newFont = prompt('代码字体栈（逗号分隔）:', curFont);
    if (newFont === null) return;
    const newSize = prompt('代码字号（如 13px/14px/15px）:', curSize) || curSize;
    const newLH   = prompt('代码行高（如 1.5/1.6）:', curLH) || curLH;
    const newTab  = prompt('Tab 宽度（2/4/8）:', curTab) || curTab;

    GM_setValue(KEY_CODE_FONT, newFont.trim() || curFont);
    GM_setValue(KEY_CODE_SIZE, newSize.trim() || curSize);
    GM_setValue(KEY_CODE_LH,   newLH.trim()   || curLH);
    GM_setValue(KEY_CODE_TAB,  newTab.trim()  || curTab);

    const root = document.documentElement;
    root.style.setProperty('--cgpt-code-font', newFont.trim() || curFont);
    root.style.setProperty('--cgpt-code-size', newSize.trim() || curSize);
    root.style.setProperty('--cgpt-code-lh',   newLH.trim()   || curLH);
    root.style.setProperty('--cgpt-code-tab',  newTab.trim()  || curTab);

    alert('已更新：代码 字体/字号/行高/Tab ✅');
  });
})();
