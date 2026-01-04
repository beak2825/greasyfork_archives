// ==UserScript==
// @name         字体替换，Force Consolas (Latin) + YaHei (CJK)
// @namespace    https://example.com/userscripts
// @version      1.0，2025-08-23
// @description  将网页中的拉丁字符用 Consolas，中文（CJK）用 微软雅黑 显示（使用系统本地字体，无网络下载）。
// @author       gpt
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      无所谓吧，一定要写？
// @downloadURL https://update.greasyfork.org/scripts/547060/%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%EF%BC%8CForce%20Consolas%20%28Latin%29%20%2B%20YaHei%20%28CJK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547060/%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%EF%BC%8CForce%20Consolas%20%28Latin%29%20%2B%20YaHei%20%28CJK%29.meta.js
// ==/UserScript==

(function () {
  const css = `
/* 统一的逻辑：为同一个 font-family 定义多条 @font-face，
   通过 unicode-range 自动按字符选择合适的本地字体。 */
@font-face {
  font-family: "ConsolasYaHeiStack";
  src: local("Consolas"), local("Consolas Regular");
  /* 基本拉丁 + 扩展，覆盖常见英文与符号 */
  unicode-range:
    U+0000-00FF,          /* Basic Latin & Latin-1 */
    U+0100-024F,          /* Latin Extended A/B */
    U+0250-02AF,          /* IPA */
    U+1E00-1EFF,          /* Latin Extended Additional */
    U+2000-206F,          /* General Punctuation */
    U+20A0-20CF,          /* Currency Symbols */
    U+2100-214F;          /* Letterlike Symbols */
  font-display: swap;
}

@font-face {
  font-family: "ConsolasYaHeiStack";
  /* 微软雅黑的常见本地名（包含中英文系统名） */
  src: local("Microsoft YaHei UI"), local("Microsoft YaHei"),
       local("微软雅黑"), local("微软雅黑 UI");
  /* CJK 统一表意 + 扩展A、兼容区、全角、假名、部首等 */
  unicode-range:
    U+3000-303F,          /* CJK Punctuation */
    U+3040-30FF,          /* Hiragana/Katakana（覆盖部分跨站内容） */
    U+31F0-31FF,          /* Katakana Phonetic Extensions */
    U+3400-4DBF,          /* CJK Ext A */
    U+4E00-9FFF,          /* CJK Unified Ideographs */
    U+F900-FAFF,          /* CJK Compatibility Ideographs */
    U+FF00-FFEF;          /* Halfwidth and Fullwidth Forms */
  font-display: swap;
}

/* 作为兜底，若以上本地字体缺失，则走常见无衬线备选 */
html, body, input, textarea, button, select, .ace_editor, code, pre, kbd, samp {
  font-family: "ConsolasYaHeiStack", "Microsoft YaHei", "微软雅黑",
               Consolas, "Helvetica Neue", Arial, Helvetica, sans-serif !important;
}

/* 一些站点会对代码块强制等宽，显式指定也没问题 */
code, pre, kbd, samp {
  font-family: "ConsolasYaHeiStack", Consolas, "Courier New", monospace !important;
}
`;

  const inject = () => {
    const style = document.createElement('style');
    style.id = 'consolas-yahei-style';
    style.textContent = css;
    document.documentElement.appendChild(style);
  };

  // 尽早插入，且防止重复注入
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!document.getElementById('consolas-yahei-style')) inject();
    });
  } else {
    if (!document.getElementById('consolas-yahei-style')) inject();
  }
})();
