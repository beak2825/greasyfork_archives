// ==UserScript==
// @name        更好的中文字体显示
// @name:en     Better Chinese Font Display
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      Floyd Li
// @license     MIT
// @description 将网页上的中文字体默认展示为非衬线字体，匹配各平台上最优字体，为您带来最优的中文显示效果。
// @description:en Change the font on the page is to display as non-serif font, matching the best font on each platform to bring you the best Chinese display experience.
// @downloadURL https://update.greasyfork.org/scripts/472104/%E6%9B%B4%E5%A5%BD%E7%9A%84%E4%B8%AD%E6%96%87%E5%AD%97%E4%BD%93%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/472104/%E6%9B%B4%E5%A5%BD%E7%9A%84%E4%B8%AD%E6%96%87%E5%AD%97%E4%BD%93%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
(function() {
    const styles = `
<style>
  *{
      font-family: -apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif;
  }
</style>
`
    document.head.insertAdjacentHTML("beforeend", styles)
})()
