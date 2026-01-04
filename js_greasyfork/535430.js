// ==UserScript==
// @name Facebook多欄化(Multi-Column)
// @namespace http://tampermonkey.net/
// @version 20251013
// @description 緊急臨時修復,新手修復全靠猜.Emergency temporary repair. 更多欄位總是更好，change column-count、max-post-height。
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.facebook.com/
// @match https://www.facebook.com/groups/feed/
// @match https://www.facebook.com/?filter=all&sk=h_chr
// @match https://www.facebook.com/?filter=favorites&sk=h_chr
// @match https://www.facebook.com/?filter=friends&sk=h_chr
// @match https://www.facebook.com/?filter=groups&sk=h_chr
// @match https://www.facebook.com/?filter=pages&sk=h_chr
// @include /^(?:https://www.facebook.com/.*/posts/.*)$/
// @include /^(?:https://www.facebook.com/reel/.*)$/
// @include /^(?:https://www.facebook.com/search/.*)$/
// @include /^(?:https://www.facebook.com/photo.*)$/
// @include /^(?:https://www.facebook.com/profile.php.*)$/
// @include /^(?:https://www.facebook.com/.*/videos/.*)$/
// @include /^(?:https://www.facebook.com/groups/.*)$/
// @include /^(?:https://www.facebook.com/permalink.php?.*)$/
// @downloadURL https://update.greasyfork.org/scripts/535430/Facebook%E5%A4%9A%E6%AC%84%E5%8C%96%28Multi-Column%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535430/Facebook%E5%A4%9A%E6%AC%84%E5%8C%96%28Multi-Column%29.meta.js
// ==/UserScript==

(function() {
let css = `
 
/* === 個人化設定 custom setup === */
:root {
--column-count: 4; /*所需欄位*/
--column-gap: 25px; /*彼此間隔*/
--max-post-height: 80vh; /*所佔視窗高度*/
--sidebar-width: 60px /*左側寬度*/
}
 
/* 中央容器 main wide */
.x1ceravr.xq1tmr.xvue9z.x193iq5w /*動態、首頁*/
,.x1xwk8fm.x193iq5w /*搜尋*/
,.xsfy40s.x1miatn0.x9f619 /*搜尋*/
{
width: calc(110% - var(--sidebar-width)); /*放大填補縫隙*/
margin-right: -60px
}

/*首頁容器 homepage wide fix*/
.x1iyjqo2.x1r8uery{max-width: 100%;}

/* 左側導航欄 left bar */
.xxzkxad.x9e5oc1 /*首頁左*/
,.xh78kpn.xcoz2nd.x2bj2ny /*動態消息左*/
,.x1vjfegm.x2lah0s.xeuugli /*動態消息左*/
{
max-width: var(--sidebar-width);
min-width: var(--sidebar-width);
position: absolute;
z-index: 1;
}
 
/* 排列 Multi-Column Post */
.x6o7n8i.x1unhpq9.x1hc1fzr > div > div/*首頁 動態*/
,.x1xwk8fm.x193iq5w/*搜尋*/ {
display: flex;
flex-wrap: wrap;
gap: var(--column-gap);
justify-content: flex-start;
align-content: flex-start;
contain: content; /* 限制重繪範圍 */
}
 
/* 控制 control post size 尺寸 */
.x6o7n8i.x1unhpq9.x1hc1fzr > div > div>* /*首頁 動態*/
,.x1xwk8fm.x193iq5w>div /*搜尋*/ {
width: calc((100% - (var(--column-gap) * (var(--column-count) - 1))) / var(--column-count));
max-height: var(--max-post-height);
overflow-y: auto;
overflow-x: hidden;
scrollbar-width: thin;
}

/* === Post zoom 放大 === */
@media (min-width: 1900px) {
.x1qjc9v5.x71s49j.x1a2a7pz {
width: 50%; /* 固定寬度為50% */
max-width: none; /* 移除最大寬度限制 */
margin: 0 25%; /* 左右各25%的空白 */
flex: 0 0 auto; /* 防止flex佈局影響寬度 */
}
}
 
/* === 隱藏元素 hide === */
.x1daaz14.x1t2pt76 /*FB homepage chat(聯絡人)*/
,.xwib8y2.x1y1aw1k.xwya9rg /*homepage Story(限動)*/
,.xq1tmr.xvue9z>.x1yztbdb /*homepage you post bar*/
,footer/*homepage useless ad*/
{
display: none;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
