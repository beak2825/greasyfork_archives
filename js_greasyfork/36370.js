// ==UserScript==
// @name        Pixiv排行去重复
// @version     1.1.2
// @description 隐藏曾经上过榜和你已收藏过的作品
// @author      WatsonYe
// @namespace   https://404.html
// @include     *://www.pixiv.net/*
// @icon        https://www.pixiv.net/favicon.ico
// @connect     i.pximg.net
// @connect     i1.pixiv.net
// @connect     i2.pixiv.net
// @connect     i3.pixiv.net
// @connect     i4.pixiv.net
// @connect     i5.pixiv.net
// @connect     imgaz.pixiv.net
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/36370/Pixiv%E6%8E%92%E8%A1%8C%E5%8E%BB%E9%87%8D%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/36370/Pixiv%E6%8E%92%E8%A1%8C%E5%8E%BB%E9%87%8D%E5%A4%8D.meta.js
// ==/UserScript==

(function(){
     $("div.ranking-items").bind('DOMNodeInserted', function(e) {
	$("div.on").parentsUntil("div.adjust").hide();
	$("div.rank p a").parentsUntil("div.adjust").hide();

});
})();

(function(){
     $("#js-react-search-mid").bind('DOMNodeInserted', function(e) {
	$("div.on").parentsUntil("#js-react-search-mid").hide();
	

});
})();


