// ==UserScript==
// @name PO18 Style
// @namespace https://greasyfork.org/users/1272411
// @version 1.0
// @description CSS snippets.
// @author null
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:.*\po18\.tw.*)$/
// @downloadURL https://update.greasyfork.org/scripts/502525/PO18%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/502525/PO18%20Style.meta.js
// ==/UserScript==

(function() {
let css = `
  html {
    font-synthesis: none;
    font-optical-sizing: auto;
    text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: "SF Pro", "PingFang SC", "Segoe UI", "Microsoft YaHei", sans-serif;
    line-height: 1.5;
    background: white;
  }

  [class ^="ad"],
  .Algo_box,
  .announce,
  .banner-wrap,
  .c_right .tags,
  .newest,
  .nav5 img,
  .R-rated::after {
    display: none;
  }

  .navbar .member img {
    display: none;
  }

  h1 {
    margin-block: 16px;
    color: white;
  }

  h2 {
    margin-block: 16px;
  }

  h3 {
    margin-block: 12px;
  }

  .btn_more {
    margin-top: 16px;
  }

  table th,
  table td {
    padding: 8px 6px;
  }

  .T_name a,
  .r_name a,
  .l_bookname,
  .book_name {
    text-transform: uppercase;
  }

  .row .t6,
  .rhead .t6 {
    display: none !important;
  }

  h1+.table .rhead {
    padding: 16px 0;
  }

  h1+.table .rhead>div,
  h1+.table .row>div {
    padding: 0;
  }

  h1+.table .row {
    padding: 16px 0;
  }

  h1+.table .l_bookname,
  h1+.table .l_chaptname {
    display: block;
    padding-right: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  h1+.table .t1 {
    width: 30%;
  }

  h1+.table .t2 {
    width: 25%;
  }

  h1+.table .t3 {
    width: 15%;
  }

  h1+.table .t4 {
    width: 15%;
  }

  h1+.table .t5 {
    width: 15%;
  }

  .book,
  .book_detail,
  .editor_recom .book,
  .C_list_reader .C_box {
    background: #fafafa;
  }

  .C_list_reader .C_msg::before {
    border-top-color: #fafafa;
    border-right-color: #fafafa;
  }

  .n_l:hover {
    border-left: 3px solid #ffc1cb;
  }

  .l_bookname:hover {
    text-decoration: none;
  }

  .c_left .toolbar {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
  }

  .c_left .toolbar [class ^="btn"] {
    width: 100%;
    margin: 0;
  }

  .popup .toolbar {
    display: block;
  }

  .popup .toolbar .inner {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .c_left .book_intro_tags {
    display: flex;
    gap: 10px;
  }

  .c_left .book_intro_tags .tag {
    padding: 4px 8px;
    margin: 0;
  }

  .chapter_list .l_bookmark {
    width: 10px;
  }

  .read-txt {
    max-width: 640px;
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  }

  .breadcrumbs {
    max-width: 640px;
    margin: 18px auto;
    font-size: 14px;
    line-height: 18px;
    opacity: 0;
  }

  .read-txt h1 {
    padding-bottom: 18px;
    margin: 36px 0;
    font-family: ui-sans-serif, sans-serif;
    font-weight: 600;
    border-bottom: 1px solid #969696;
  }

  .read-txt p {
    min-height: 24px;
    margin: 24px 0;
    letter-spacing: 0 !important;
  }

  .font-m {
    font-size: 20px !important;
    line-height: 36px;
  }

  .font-m h1,
  .font-m h2 {
    font-size: 28px;
    line-height: 36px;
  }

  .function {
    top: 240px;
    display: flex;
    flex-direction: column;
    width: 80px;
    background: rgb(255 255 255 / 50%);
    border-radius: 8px;
  }

  .function li:nth-child(5) {
    display: none;
  }

  .function a {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 8px 0;
    background: none !important;
  }

  .CONTAINER.yellow {
    background: #fff2e2 !important;
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
