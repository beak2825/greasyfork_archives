// ==UserScript==
// @name         修复ddxs.cc书签链接
// @namespace    http://www.zhangminghao.com
// @version      0.1
// @description  修复ddxs.cc书签跳转链接
// @author       张明浩
// @match        https://www.ddxs.cc/*.html
// @exclude      https://www.ddxs.cc/ddxs/*.html
// @downloadURL https://update.greasyfork.org/scripts/433303/%E4%BF%AE%E5%A4%8Dddxscc%E4%B9%A6%E7%AD%BE%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/433303/%E4%BF%AE%E5%A4%8Dddxscc%E4%B9%A6%E7%AD%BE%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {

    var url = window.location.href;
    var arr=url.match(/\d*\/\d*\.html/)
    var url="https://www.ddxs.cc/ddxs/" + String(arr)
    window.location.replace(url)

})();