// ==UserScript==
// @name        知乎精简主题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  极简主题!
// @author       You
// @match        https://www.zhihu.com/**
// @match        https://zhuanlan.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477325/%E7%9F%A5%E4%B9%8E%E7%B2%BE%E7%AE%80%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/477325/%E7%9F%A5%E4%B9%8E%E7%B2%BE%E7%AE%80%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerText = `
    .Question-sideColumn{
        display:none
    }
    .Question-mainColumn{
        width:100%
    }
    .Topstory-mainColumn{
        width:100%
    }
    .AuthorInfo{
        max-width:100%
    }
    div[data-za-detail-view-path-module=RightSideBar]{
       display:none
    }
    div.SearchMain + div {
       display: none;
    }
    .SearchMain{
        width:100%
    }
    ul.Tabs > li:not(:first-child) {
        display: none;
    }
    div.SearchBar{
        display: none;
    }
    .AppHeader-inner a svg {
        display: none;
    }
    .PageHeader a svg {
        display: none;
    }
    .ColumnPageHeader{
        display: none!important;
    }
    .origin_image{
        width:50%!important

    }


`
    document.body.appendChild(style)
    // Your code here...
})();