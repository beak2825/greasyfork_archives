// ==UserScript==
// @name         站酷文章编辑器排版
// @namespace    https://www.ifeiwu.com/
// @version      0.2
// @description  修正站酷文章编辑器内容和预览效果一致
// @author       pagepan
// @match        https://my.zcool.com.cn/uploadArticle
// @include      /(^https:\/\/my\.zcool\.com\.cn\/editArticle\?id=\d*$)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410701/%E7%AB%99%E9%85%B7%E6%96%87%E7%AB%A0%E7%BC%96%E8%BE%91%E5%99%A8%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/410701/%E7%AB%99%E9%85%B7%E6%96%87%E7%AB%A0%E7%BC%96%E8%BE%91%E5%99%A8%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $body = $('#ueditor_0').contents().find('head');

    $body.append(`
<style>
*, a, body, button, caption, dd, div, dl, dt, em, figure, form, h1, h2, h3, h4, h5, h6, html, i, img, input, label, li, ol, p, span, strong, sub, sup, table, tbody, td, tfoot, th, thead, tr, tt, ul {
    margin: 0;
    padding: 0;
}

body {
    padding: 18px !important;
}

h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
}

p {
font-size: 16px;
line-height: 32px;
text-align: justify;
text-justify: inter-ideograph;
word-wrap: break-word;
color: #666666;
}
</style>`);

})();