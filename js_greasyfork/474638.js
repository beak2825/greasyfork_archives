// ==UserScript==
// @name         文章样式优化
// @namespace    https://greasyfork.org/zh-CN/scripts/474638-%E6%96%87%E7%AB%A0%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96
// @version      2.1.0
// @description  文章样式优化,更加人性化的阅读体验
// @author       冰冻大西瓜
// @license      GPLv3
// @match        https://juejin.cn/post/*
// @grant        GM_addStyle
// @run-at       document-start
// @note         2025年3月2日 修正推荐区宽度与文章区域相同
// @note         2025年2月26日 修正文章字体 15px->18px 修正代码字体 12px->14px
// @note         2025年2月26日 重构代码,更新文章布局 适配4K屏幕(屏幕宽度超过1440px即应用规则),
// @downloadURL https://update.greasyfork.org/scripts/474638/%E6%96%87%E7%AB%A0%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/474638/%E6%96%87%E7%AB%A0%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef
GM_addStyle(`
  @media (min-width: 1440px) {
    .container.main-container{
      max-width:1800px !important;
    }
    .main-area:is(.article-area,.recommended-area){
      width:80% !important;
    }
  }
  .markdown-body p{
    font: 18px "圆体-简" !important;
  }
  .markdown-body pre>code {
    font: 14px "JetBrainsMono NF" !important;
  }
`)
