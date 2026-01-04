// ==UserScript==
// @name         テスト
// @namespace    http://www.youtube.com/
// @version      2.6
// @description  live配信用自動コメントツール
// @author       none
// @match        *.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432439/%E3%83%86%E3%82%B9%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/432439/%E3%83%86%E3%82%B9%E3%83%88.meta.js
// ==/UserScript==
 
 
//送信コメント
var contentArr = [];
contentArr.push('コメント内容を入力');
contentArr.push('コメント内容を入力');
contentArr.push('コメント内容を入力');
//コメント間隔
var intervalTime = 1 * 1;
var timer = 2;
var cLength = contentArr.length;
 
window.inputValue = function (dom, st) {
    var evt = new InputEvent('input', {
        inputType: 'insertText',
        data: st,
        dataTransfer: null,
        isComposing: false
    });
    dom.innerHTML = st;
    dom.dispatchEvent(evt);
}
 
setInterval(function () {
    var cIndex = timer % cLength;
    var shtml = document.querySelectorAll("#input");
    var commentInput = shtml[1];
    window.inputValue(commentInput, contentArr[cIndex]);
    commentInput.focus();
    commentInput.click();
    var buttons = document.querySelectorAll("#send-button");
    if (buttons && buttons.length > 0) {
        var button = buttons[0];
        var childNodes = button.childNodes;
        var childNode = childNodes[0];
        childNode.click();
        timer++;
    }
}, intervalTime);