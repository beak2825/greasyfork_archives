// ==UserScript==
// @name         设置红包后可设置必须关注公众号作答
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  设置了红包后就不能设置必须关注公众号了，使用此脚本后就配置必须关注公众号
// @author       WJX
// @match        */wjx/promote/sendweixin.aspx?activityid=*
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427795/%E8%AE%BE%E7%BD%AE%E7%BA%A2%E5%8C%85%E5%90%8E%E5%8F%AF%E8%AE%BE%E7%BD%AE%E5%BF%85%E9%A1%BB%E5%85%B3%E6%B3%A8%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BD%9C%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/427795/%E8%AE%BE%E7%BD%AE%E7%BA%A2%E5%8C%85%E5%90%8E%E5%8F%AF%E8%AE%BE%E7%BD%AE%E5%BF%85%E9%A1%BB%E5%85%B3%E6%B3%A8%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BD%9C%E7%AD%94.meta.js
// ==/UserScript==

(function() {
    _$(function(){
    _$("#ctl02_ContentPlaceHolder1_cbGuanZhu")[0].disabled = false;
    })
})();