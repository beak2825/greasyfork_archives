// ==UserScript==
// @name         掘金小册阅读优化
// @version      1.1.1
// @description  优化掘金小册的阅读体验,使其布局更加合理,充分利用空间,显示更多内容
// @namespace    https://greasyfork.org/zh-CN/scripts/459956-%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96
// @author       冰冻大西瓜
// @match        https://juejin.cn/book/*/section/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @run-at       document-start
// @grant        GM_addStyle
// @license      GPLv3
// @note         2025年2月26日 将小册阅读区域宽度由100%修正为80%
// @note         屏蔽了左下角的二维码广告
// @note         修正了字体大小,使其更加合理
// @note         扩展了阅读区域的宽度,使其更加合理
// @note         隐藏跳转箭头
// @note         增大了代码块的字体大小 12px -> 20px
// @downloadURL https://update.greasyfork.org/scripts/459956/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/459956/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef
GM_addStyle(`
.handle.book-direction,.book-summary__footer{
  display: none !important;
}
.section-page.book-section-view{
  min-width: 80% !important;
}
.book-body.transition--next{
  padding-top: 60px !important;
}
.markdown-body{
  font-size: 20px !important;
}
.markdown-body pre>code{
  font-size: 20px !important;
}
`)
