// ==UserScript==
// @name           百度贴吧重定向
// @version        1.2
// @author         火心
// @description    重定向其他百度贴吧域名到tieba.baidu.com
// @compatible     chrome

// @include        http://tieba.baidu.com.cn/*
// @include        http://tieba.baidu.cn/*
// @include        http://c.tieba.baidu.com/*
// @include        http://xingqu.baidu.com/*
// @include        http://v.tieba.com/*
// @include        http://v.tieba.baidu.com/*
// @include        http://1111.baidu.com/*
// @include        http://post.baidu.*
// @include        http://www.tieba.com/*
// @include        https://wapp.baidu.com/*
// @include        https://wefan.baidu.com/*
// @include        https://jump2.bdimg.com/*
// @include        http://anfudianshang.com/*


// @run-at         document-start

// @namespace https://greasyfork.org/users/319402

// @downloadURL https://update.greasyfork.org/scripts/387691/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/387691/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

if (window.location.host = "anfudianshang.com"){
window.location.href = window.location.href.replace('anfudianshang.com/tieba_baidu_', 'tieba.baidu.com')
}
 else{
     window.location.host = "tieba.baidu.com"
 }