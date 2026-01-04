// ==UserScript==
// @name         Skip Linkpage
// @namespace    https://greasyfork.org/zh-CN/scripts/440550-skip-linkpage
// @version      0.3
// @description  解除Gitee.com,oschina.net,zhihu.com,jianshu.com,csdn.net等对于访问外部链接需要进行确认，安装后不会再有对于外部链接访问的限制。
// @author       duice#foxmail.com
// @match       https://gitee.com/link?target=*
// @match       https://www.oschina.net/action/GoToLink?url=*
// @match       https://link.csdn.net/?target=*
// @match       https://link.zhihu.com/?target=*
// @match       https://www.jianshu.com/go-wild*
// @icon
// @license   GPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440550/Skip%20Linkpage.user.js
// @updateURL https://update.greasyfork.org/scripts/440550/Skip%20Linkpage.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pageurl = window.location.href;
    var targeturl=pageurl.split("=");
    window.location =decodeURIComponent(targeturl[targeturl.length-1]);
})();