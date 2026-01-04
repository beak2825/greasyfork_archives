// ==UserScript==
// @name           EmptySite
// @name:zh-CN     强制清空网站内容
// @version      2024-11-08 1219
// @description    清空这些网站的内容，因为不应该看这些内容
// @author         有容乃大
// @license        GPL version 3
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceURL
// @grant          GM_openInTab
// @grant          GM_setClipboard
// @grant          GM_registerMenuCommand
// @grant          GM_info
// @grant          unsafeWindow


// @include        *://tieba.baidu.com/*
// @include        *ngabbs*
// @include        *ithome*
// @include        *zhibo8*
// @include        *51credit*
// @include        *huya*
// @include        *fanqienovel*
// @include        *.faloo.*
// @include        *zongheng*
// @include        *17cg*
// @include        *.51cg1.app
// @include        *twitter*
// @include        *ngabbs*
// @include        *qidian*
// @include        laowang.vip
// @include        *bilibili*
// @include        *.zhihu.com/billboard
// @include        *.douyin.com
// @include        top.baidu.com
// @include        *51cg1*

// @run-at         document-start
// @namespace https://greasyfork.org/users/34138
// @downloadURL https://update.greasyfork.org/scripts/519806/EmptySite.user.js
// @updateURL https://update.greasyfork.org/scripts/519806/EmptySite.meta.js
// ==/UserScript==

/* This script build by rollup. */
(function () {

    document.body.innerHTML = '';
    setTimeout( () => {
           document.body.innerHTML = '';
    }, 1000)

}());