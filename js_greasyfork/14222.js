// ==UserScript==
// @name 		文章区药丸科技
// @namespace   avfun
// @description 还原A站文章区以前的样式，结合AcFun Fix 和http://198.177.122.145/acfun/wenzhang.html 的代码而成
// @include 	http://*.acfun.tv/a/*
// @include     http://*.acfun.tv/v/ac*
// @grant 		none
// @version 	0.0.1.4
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/14222/%E6%96%87%E7%AB%A0%E5%8C%BA%E8%8D%AF%E4%B8%B8%E7%A7%91%E6%8A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/14222/%E6%96%87%E7%AB%A0%E5%8C%BA%E8%8D%AF%E4%B8%B8%E7%A7%91%E6%8A%80.meta.js
// ==/UserScript==
(function(){
    var f=document.createElement('script');
    f.src='http://198.177.122.145/acfun/wenzhang_custom.js';
    document.body.appendChild(f);
})();