// ==UserScript==
// @name           百度云下载不受限制
// @namespace      百度云下载不受限制
// @description    把"share"改为"wap"百度网盘下载大于2G的文件不用安装云管家
// @version        1.0
// @include        http://pan.baidu.com/share/link?shareid*
// @include        http://pan.baidu.com/share/link?uk*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/10895/%E7%99%BE%E5%BA%A6%E4%BA%91%E4%B8%8B%E8%BD%BD%E4%B8%8D%E5%8F%97%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/10895/%E7%99%BE%E5%BA%A6%E4%BA%91%E4%B8%8B%E8%BD%BD%E4%B8%8D%E5%8F%97%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
           
(function(){
  location.href = document.URL.replace("share","wap");
})();