// ==UserScript==
// @name         Creative Hydro
// @namespace    http://tampermonkey.net/
// @version      2024-08-22
// @license      MIT
// @description  More Creative Hydro!
// @author       Shi Zheng
// @match        oiclass.com/*
// @match        www.oiclass.com/*
// @match        hydro.ac/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oiclass.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504647/Creative%20Hydro.user.js
// @updateURL https://update.greasyfork.org/scripts/504647/Creative%20Hydro.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const a = document.createElement('style');
    var urlimg="https://oiclass.com/d/puji/file/9507/good%20pic6.png";
    a.innerHTML = `
.section{
    border-radius: 10px;
    opacity: 0.3!important;
}
.button, .dropdown .menu{
    border-radius: 10px;
}
body{
    font-family: -apple-system, BlinkMacSystemFont, "San Francisco Display", "San Francisco", "Helvetica Neue", "Noto Sans", "Noto Sans CJK SC", "Noto Sans CJK", "Source Han Sans", "PingFang SC", "Segoe UI", "Microsoft YaHei", sans-serif;
}
.user-profile-badge{
    border-radius: 7px;
    box-shadow: 0px 1px 3px #656565;
}
data-tooltip, .data-tooltip, span.time.relative.tooltip{
    border-radius: 10px;
}
input.textbox, textarea.textbox, time relative tooltip drop-target drop-element-attached-bottom drop-element-attached-center drop-target-attached-top drop-target-attached-center{
    border-radius: 10px;
}
.search>input{
    border-radius: 10px 0px 0px 0px;
}
.search>button{
    border-radius: 0px  10px 0px 0px;
}
.bp4-tag.bp4-minimal:not([class*=bp4-intent-]){
    border-radius: 10px;
}
.problem__tag-link, .select-container.compact .select, .select.compact{
    border-radius: 10px;
}
pre[class*=language-], .autocomplete-wrapper{
    border-radius: 10px;
}
.section__table-header{
    border-radius: 10px 10px 0 0;
}
/*
div.code-toolbar>.toolbar>.toolbar-item>a, div.code-toolbar>.toolbar>.toolbar-item>button, div.code-toolbar>.toolbar>.toolbar-item>span{
    border-radius: 0 1 0 10px;
}
*/
.icon-search{
    border-radius: 10px 10px 10px 10px;
}
.toolbar{
    border-radius: 12px;
}
.contest-sidebar__bg {
    border-radius: 7px 7px 0 0;
}
.section:hover{
    border-radius: 10px;
    box-shadow: 0px 0px 5px #aaa;
    opacity: 0.9!important;
}
.compact{
    border-radius: 10px;
}
.main {
  width: 100%; /* 设置div的宽度 */
  height: 400px; /* 设置div的高度 */
  background-image: url('${urlimg}'); /* 设置背景图片 */
  background-size: cover; /* 背景图片覆盖整个div */
  background-position: center; /* 背景图片居中 */
}
.widget--category-filter__tag:hover{
    border-radius: 10px;
}
`;
    document.head.append(a);
})();