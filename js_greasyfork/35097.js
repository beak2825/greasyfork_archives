// ==UserScript==
// @name        taobao fix
// @namespace   https://greasyfork.org/zh-CN/users/821
// @description  临时修复火狐访问淘宝店铺问题
// @author      gfork
// @include     *.taobao.com/*
// @exclude     https://item.taobao.com/*
// @version     1.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/35097/taobao%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/35097/taobao%20fix.meta.js
// ==/UserScript==
/*
var url=document.location.href;

if(url.match('world')==null && document.getElementsByTagName('meta')['microscope-data'].getAttribute('content').match('shopId')){
jump=url.replace(/(.*)\.taobao\.com(.*)/, "$1.world.taobao.com$2"); 
window.location=jump;
}
*/