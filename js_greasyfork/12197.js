// ==UserScript==
// @name         CNKI Download Link Fix (For WHU VPN)
// @version      1.1
// @description  修复通过 WHU VPN WEB 服务访问知网时出现链接解析错误而无法下载或无法访问的问题
// @author       864907600cc
// @icon         https://secure.gravatar.com/avatar/147834caf9ccb0a66b2505c753747867
// @include      /^https://(vpn\.whu\.(edu\.)?cn|218\.197\.157\.2|58\.19\.127\.1)/web/\d+/https?/\d+/(.+\.)?cnki.net/.+/
// @namespace    http://ext.ccloli.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12197/CNKI%20Download%20Link%20Fix%20%28For%20WHU%20VPN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12197/CNKI%20Download%20Link%20Fix%20%28For%20WHU%20VPN%29.meta.js
// ==/UserScript==

var links = document.getElementsByTagName('a');
for (var i = 0; i < links.length; i++) {
    var href = links[i].href;
    if (href && href.indexOf('../') >= 0) {
        //console.log('Link:', href);
        links[i].href = href.replace(/\/\w+\/(\s|%20)*\.\.\//, '/');
    }
}