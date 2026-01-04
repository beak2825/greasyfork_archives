// ==UserScript==
// @name 微博优化 weibo.com
// @namespace https://www.runningcheese.com
// @version 0.1
// @description 微博首页去除热搜榜，去除多余内容，调整宽度等。
// @author RunningCheese
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/486025/%E5%BE%AE%E5%8D%9A%E4%BC%98%E5%8C%96%20weibocom.user.js
// @updateURL https://update.greasyfork.org/scripts/486025/%E5%BE%AE%E5%8D%9A%E4%BC%98%E5%8C%96%20weibocom.meta.js
// ==/UserScript==

(function() {
let css = `/* 导航栏滚动 */
    div[role=navigation] {
        position: absolute !important;
    }
    /* 导航栏滚动 */
    div[class^="WB_global_nav"] {
        position: absolute !important;
    }
    /* 侧边栏滚动 */
    div[class^="Nav_main_"] {
        position: absolute !important;
    }
    /*宽度调整*/
    div[class^="Main_full_"] {
        width: 700px;
    }
    /* 详情后退按钮取消固定 */
    div[class^="Bar_main_"] {
        position: inherit !important;
    }
    /* 名称、发布时间、发布来源 一行 */
    div[class*=" head_content_wrap_"] {
        height: 100%;
        flex-direction: inherit !important;
        float: left !important;
    }
    /*右侧边栏隐藏*/
    .Main_side_i7Vti {
        display: none;
    }

    /*广告隐藏*/
    #cniil_wza,
    .Links_icon_2dHQb,
    .Links_item_ZuBMD,
    .wbpro-side-copy-inner {
        display: none;
    }`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
