// ==UserScript==
// @name 巴哈姆特
// @namespace github.com/openstyles/stylus
// @version 1.0.11
// @description 巴哈姆特佈局優化
// @author Dxzy
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.forum.gamer.com.tw/*
// @match *://*.www.gamer.com.tw/*
// @downloadURL https://update.greasyfork.org/scripts/536935/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/536935/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9.meta.js
// ==/UserScript==

(function() {
let css = `
:root {--img-max-size: min(100vh, 300px);}
    
.photoswipe-image > .lazyloaded 
{max-width: var(--img-max-size);}

/* 留言區調整 */
.reply-content {display: flex;}/*留言排列*/
.user--sm.reply-avatar
{height: 30px;width: 30px}/*用戶頭像 影響留言高度*/
.comment_content>.lazyloaded,/*emoji*/
.comment_content > .photoswipe-image > .lazyloaded/*圖片*/
{max-height: 30px!important;max-width: 30px}
    

/* 通用佈局放寬 */
#BH-wrapper/*討論區目錄、串文*/
,[id^="Commendcontent_"] > div > .reply-content > .c-article.reply-content__article:has(.content-edit) /*編輯留言*/
/*,.global-container首頁*/
{   width: 100%;
    max-width: none ;
    position: relative;}
.c-post.c-section__main/*串文編輯區*/{width: 90%;}

@media (width <= 940px) {
    .b-list__img {display: none!important}
    .b-list__brief,.imglist-text > .b-list__tile {
    width: calc(100vw);/* 列表標題區 */
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    gap: 8px; /* 替代margin間距 */}}
@media (width > 941px) {
    .b-list__brief,.imglist-text > .b-list__tile {
    width: calc(100vw - 500px);/* 列表標題區 */
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    gap: 8px; /* 替代margin間距 */}
    #BH-master {
    width: calc(100% - 0px);
    overflow: hidden; /* 防止子元素溢出 */
    position: relative; /* 建立定位上下文 */
    z-index: 1;}}
@media (width < 2200px) {#BH-slave {display: none ;}}
@media (width > 2200px) {
.b-list__brief,.imglist-text > .b-list__tile {
    width: calc(100vw - 800px);/* 列表標題區 */
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    gap: 8px; /* 替代margin間距 */}
    #BH-master {
    width: calc(100% - 320px);
    overflow: hidden; /* 防止子元素溢出 */
    position: relative; /* 建立定位上下文 */}
    }
/* 串文單帖放寬 */
.c-quick-reply,.c-section,.c-section__main
    {width: calc(100%);display: flex;}
/* 串文右側欄位固定位置防止拉長版面 */
#BH-slave {position: fixed;right: 0;}
/* 右側欄位固定位置沒fixed 
div.BH-rbox,.bh-b-title.as-mes-header,.is-bpageclose.now_chatroom-container{right: 0;}*/

/* 隱藏各種區塊 */
#BH-footer/*串文最下方*/,
.popular.c-section__main/*串文延伸閱讀*/,
.main-container__footer/*首頁最下方*/,
.popular.b-popular/*列表底部本板推薦*/,
.BH-qabox1.BH-rbox,h5:nth-of-type(2)/*列表 動漫電玩通*/
{display: none ;}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
