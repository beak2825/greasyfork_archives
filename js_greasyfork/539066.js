// ==UserScript==
// @name Inter加思源黑體
// @namespace https://github.com/abc0922001
// @version 0.1.0
// @description UserCSS example
// @author abc0922001
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/539066/Inter%E5%8A%A0%E6%80%9D%E6%BA%90%E9%BB%91%E9%AB%94.user.js
// @updateURL https://update.greasyfork.org/scripts/539066/Inter%E5%8A%A0%E6%80%9D%E6%BA%90%E9%BB%91%E9%AB%94.meta.js
// ==/UserScript==

(function() {
let css = `@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+HK:wght@100..900&family=Noto+Sans+JP:wght@100..900&family=Noto+Sans+KR:wght@100..900&family=Noto+Sans+Mono:wght@100..900&family=Noto+Sans+TC:wght@100..900&display=swap");

/* 根據語系切換 Sans 主字體 */
[lang="zh-CN" i],
[lang="zh" i],
[lang="zh-hans" i] {
    --noto-sans: "Noto Sans SC";
}

[lang="ko" i] {
    --noto-sans: "Noto Sans KR";
}

[lang="ja" i],
[lang="jp" i] {
    --noto-sans: "Noto Sans JP";
}

[lang="zh-HK" i] {
    --noto-sans: "Noto Sans HK";
}

[lang="zh-TW" i],
[lang="zh-hant" i] {
    --noto-sans: "Noto Sans TC";
}

/* 預設語言：繁體中文 */
html {
    --noto-sans: "Noto Sans TC";
    --noto-mono: "Noto Sans Mono";
}

/* 一般文字，支援字重變化 */
:not([class*="icon"]):not(i) {
    font-family: 'Inter', var(--noto-sans), "Google Symbols", "FontAwesome", "Material Icons Extended", "Material-Design-Icons", "QualcommIcon", "VideoJS", "icons101", "AmebaNewSymbols", "videofont", "ohpOffice365Icons", "anchorjs-icons", "consumer-icons", "tm-detail-font", "iconfont", "FabricMDL2Icons", "MWF-MDL2", "Noto Emoji", sans-serif !important;
}

/* 程式碼區塊使用等寬字體（Noto Sans Mono） */
pre,
code {
    font-family: var(--noto-mono), Consolas, "Courier New", monospace !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
