// ==UserScript==
// @name         起点中文网作者、作家、大神替换成枪手
// @namespace    http://www.lkong.net/home.php?mod=space&uid=516696
// @version      0.2.1
// @description  大家都是起点请来的无工资枪手，就不要自称什么作者了。
// @author       仙圣
// @include        *://*.qidian.com/*
// @exclude       *://read.qidian.com/chapter/*/*
// @exclude       *://vipreader.qidian.com/chapter/*/*
// @downloadURL https://update.greasyfork.org/scripts/402472/%E8%B5%B7%E7%82%B9%E4%B8%AD%E6%96%87%E7%BD%91%E4%BD%9C%E8%80%85%E3%80%81%E4%BD%9C%E5%AE%B6%E3%80%81%E5%A4%A7%E7%A5%9E%E6%9B%BF%E6%8D%A2%E6%88%90%E6%9E%AA%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/402472/%E8%B5%B7%E7%82%B9%E4%B8%AD%E6%96%87%E7%BD%91%E4%BD%9C%E8%80%85%E3%80%81%E4%BD%9C%E5%AE%B6%E3%80%81%E5%A4%A7%E7%A5%9E%E6%9B%BF%E6%8D%A2%E6%88%90%E6%9E%AA%E6%89%8B.meta.js
// ==/UserScript==
var replaceArry = [
    [/作者/gi, '枪手'],
    [/作家/gi, '枪手'],
    [/大神/gi, '枪手'],
];
setInterval(function() {
var numTerms = replaceArry.length;
var txtWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            if (node.nodeValue.trim())
                return NodeFilter.FILTER_ACCEPT;

            return NodeFilter.FILTER_SKIP;
        }
    },
    false
);
var txtNode = null;


    while (txtNode = txtWalker.nextNode()) {
        var oldTxt = txtNode.nodeValue;

        for (var J = 0; J < numTerms; J++) {
            oldTxt = oldTxt.replace(replaceArry[J][0], replaceArry[J][1]);
        }
        txtNode.nodeValue = oldTxt;
    }

}, 3000);