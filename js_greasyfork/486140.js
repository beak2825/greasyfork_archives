// ==UserScript==
// @name         操你妈单词❤
// @namespace    *
// @author       Weifeng Wang
// @version      1.0
// @include      *
// @description  将“单词类词汇”替换成“操你妈”
// @match        http://*/*
// @run-at       document-end
// @grant        none
// @license      FuckYou-1.145-or-later
// @downloadURL https://update.greasyfork.org/scripts/486140/%E6%93%8D%E4%BD%A0%E5%A6%88%E5%8D%95%E8%AF%8D%E2%9D%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/486140/%E6%93%8D%E4%BD%A0%E5%A6%88%E5%8D%95%E8%AF%8D%E2%9D%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var oldText = "单词|背单词|词汇|生词记忆法|学习方法|词汇量|生词本|听写练习|语言学习|词汇记忆|复习计划|记忆技巧|学习习惯|词汇测试|学习资源|词汇学习|学习策略|学习计划|词汇扩展|学习目标|词汇理解|学习效率|词汇应用|学习环境|词汇积累|学习态度|词汇掌握|学习时间|词汇练习|学习进度|词汇提升|学习动力|词汇熟练";
    var newText = "操你妈❤";

    var textNodes = document.evaluate("//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (var i = 0; i < textNodes.snapshotLength; i++) {
        var node = textNodes.snapshotItem(i);
        var text = node.data;
        var regex = new RegExp(oldText, "g");
        var replacedText = text.replace(regex, newText);
        node.data = replacedText;
    }

    setInterval(arguments.callee, 3000);
})();
