// ==UserScript==
// @name         屏蔽圣王薇薇欧的无头漫画讨论贴
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  用于在NGA猴区屏蔽屏蔽圣王薇薇欧的无头漫画讨论贴
// @author       a
// @match        *://bbs.nga.cn/thread.php?fid=-447601*
// @match        *://nga.178.com/thread.php?fid=-447601*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373197/%E5%B1%8F%E8%94%BD%E5%9C%A3%E7%8E%8B%E8%96%87%E8%96%87%E6%AC%A7%E7%9A%84%E6%97%A0%E5%A4%B4%E6%BC%AB%E7%94%BB%E8%AE%A8%E8%AE%BA%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/373197/%E5%B1%8F%E8%94%BD%E5%9C%A3%E7%8E%8B%E8%96%87%E8%96%87%E6%AC%A7%E7%9A%84%E6%97%A0%E5%A4%B4%E6%BC%AB%E7%94%BB%E8%AE%A8%E8%AE%BA%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function doRemove() {
        var topicRows = document.getElementsByClassName("topicrow");
        for (var i = topicRows.length - 1; i >= 0; --i) {
            var topicRow = topicRows[i];
            var author = topicRow.getElementsByClassName("author")[0].textContent;
            if (author !== "圣王薇薇欧") {
                continue;
            }
            var title = topicRow.getElementsByClassName("c2")[0].textContent;
            if (title.indexOf("漫画讨论") < 0) {
                continue;
            }
            topicRow.parentNode.remove();
        }
    }
    function hookProgbar() {
        var originProgFunc = commonui.progbar;
        commonui.progbar = function(v) {
            if (v === 100){
                console.log('in hooked func');
                setTimeout(doRemove, 500);
            }
            return originProgFunc.apply(this, arguments);
        }
    }
    hookProgbar();

    setTimeout(doRemove, 500);
})();