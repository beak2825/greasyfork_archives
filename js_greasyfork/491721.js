// ==UserScript==
// @name         49lottery自动跳名单页
// @namespace   https://greasyfork.org/users/1284284
// @version      0.2
// @description    49lottery链接打开自动跳名单页
// @author           喃哓盐主
// @run-at       document-start
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491721/49lottery%E8%87%AA%E5%8A%A8%E8%B7%B3%E5%90%8D%E5%8D%95%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/491721/49lottery%E8%87%AA%E5%8A%A8%E8%B7%B3%E5%90%8D%E5%8D%95%E9%A1%B5.meta.js
// ==/UserScript==

// 获取当前页面链接
var currentUrl = window.location.href;

// 判断链接是否包含longTermSub和hd=
if (currentUrl.indexOf('longTermSub') !== -1 && currentUrl.indexOf('hd=') !== -1) {
    // 提取hd=后四位
    var hdValue = currentUrl.match(/hd=([A-Za-z0-9]{4})/)[1];
    
    // 组装新链接
    var newUrl = 'https://huodong.4399.cn/game///api/huodong/daily/yxhGameSubscribe.html?scookie=&udid=&deviceId=&hd=' + hdValue;
    
    // 访问新链接
    window.location.href = newUrl;
}