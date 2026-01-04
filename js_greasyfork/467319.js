// ==UserScript==
// @name         GameVN Uncensored
// @namespace    https://gist.github.com/iChickn/71e327935d0b0549735021afc4874c90/raw
// @version      0.0.4
// @description  Trên có chính sách, dưới có đối sách
// @author       [K]
// @match        http://gamevn.com/threads/*
// @icon         http://gamevn.com/favicon.ico
// @run-at       document-start
// @run-at       document-body
// @run-at       document-end
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/467319/GameVN%20Uncensored.user.js
// @updateURL https://update.greasyfork.org/scripts/467319/GameVN%20Uncensored.meta.js
// ==/UserScript==
var replaceArry = [
    [/dương cụ/gi, 'cặc'],
    [/công cụ lao động/gi, 'cu'],
    [/kông kụ lao động/gi, 'ku'],
    [/hồ bách thảo/gi, 'lồn'],
    [/khoái lạc song châu/gi, 'dái'],
    [/công nhân nghành/gi, 'đĩ'],
    [/lao động đường phố/gi, 'phò'],
    [/đặc sản/gi, 'cứt'],
    [/sản xuất/gi, 'ỉa'],
    [/giao hoan đất trời/gi, 'địt'],
    [/nam dương thần kiếm/gi, 'buồi'],
    [/khoái lạc/gi, 'đụ'],
    // etc...
];
document.onreadystatechange = function() {
    var numTerms = replaceArry.length;
    var txtWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            //-- Skip whitespace-only nodes
            if (node.nodeValue.trim()) return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_SKIP;
        }
    }, false);
    var txtNode = null;
    while (txtNode = txtWalker.nextNode()) {
        var oldTxt = txtNode.nodeValue;
        for (var J = 0; J < numTerms; J++) {
            oldTxt = oldTxt.replace(replaceArry[J][0], replaceArry[J][1]);
        }
        txtNode.nodeValue = oldTxt;
    }
}