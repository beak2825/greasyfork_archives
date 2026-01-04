// ==UserScript==
// @name        修正 Discuz 论坛 relatedlink 的 bug
// @description 修正 Discuz 论坛 relatedlink 的 bug（提示当前页面的某个脚本正忙,或者可能已停止响应）
// @namespace   http://www.google.com
// @include     *forum.php?mod=viewthread&tid=*
// @version     1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/33857/%E4%BF%AE%E6%AD%A3%20Discuz%20%E8%AE%BA%E5%9D%9B%20relatedlink%20%E7%9A%84%20bug.user.js
// @updateURL https://update.greasyfork.org/scripts/33857/%E4%BF%AE%E6%AD%A3%20Discuz%20%E8%AE%BA%E5%9D%9B%20relatedlink%20%E7%9A%84%20bug.meta.js
// ==/UserScript==
 
Object.defineProperty(window, 'relatedlink', {
    get: function() { return []; },
    set: function() {}
});