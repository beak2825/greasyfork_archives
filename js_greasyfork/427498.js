// ==UserScript==
// @name         腾讯限制连接自动跳转
// @namespace    https://github.com/navee/fuckqq
// @version      0.1.3
// @description  腾讯QQ\TIM打开链接会跳转到https://c.pc.qq.com/middlem.html，这个插件可以帮助你自动跳转到目标网址
// @author       Navee
// @match        http*://c.pc.qq.com/middlem.html?*
// @match        http*://c.pc.qq.com/index.html?*
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427498/%E8%85%BE%E8%AE%AF%E9%99%90%E5%88%B6%E8%BF%9E%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/427498/%E8%85%BE%E8%AE%AF%E9%99%90%E5%88%B6%E8%BF%9E%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 就这么简单
    try{
        window.location.href=getParams("pfurl");
    }catch(err){
        console.error(err);
        window.location.href=decodeURIComponent(/pfurl\=(.*?)&+/.exec(window.location.href)[1])
    }
})();