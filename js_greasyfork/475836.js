// ==UserScript==
// @name         知乎 不感兴趣
// @namespace    github.com/klt14
// @license      GPL
// @version      0.1
// @description  给知乎加一个 不感兴趣 的快捷键X。目前只对收起的回答生效（展开/收起 快捷键O）
// @author       klt14@pm.me
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475836/%E7%9F%A5%E4%B9%8E%20%E4%B8%8D%E6%84%9F%E5%85%B4%E8%B6%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/475836/%E7%9F%A5%E4%B9%8E%20%E4%B8%8D%E6%84%9F%E5%85%B4%E8%B6%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // currently only works when the answer is folded.
    function ignore() {
        //document.activeElement.firstChild.firstChild.firstChild.firstChild.childNodes[7].childNodes[2].childNodes[5].firstChild.click();
        let moreButton = document.activeElement.firstChild.firstChild.firstChild.firstChild.childNodes[7].lastChild.childNodes[5].firstChild;
        moreButton.click();
        // setTimeout so that focus is moved to "举报" button
        setTimeout(function(){
            console.log(document.activeElement);
            document.activeElement.parentNode.lastChild.previousSibling.click();
        }, 100);

    }
    document.onkeydown = function (event) {
        //console.log(event.keyCode);
        //console.log(document.activeElement);
        if (event.keyCode == 88) {
            ignore();
        }
    };
})();