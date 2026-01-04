// ==UserScript==
// @name         CTRL+Q给选中的输入框中的文字添加零宽字符\u200B
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  比如选中原字符是“太阳熊”，那么CTRL+Q后为“太\u200B阳\u200B熊”
// @author       太陽闇の力
// @include       *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445652/CTRL%2BQ%E7%BB%99%E9%80%89%E4%B8%AD%E7%9A%84%E8%BE%93%E5%85%A5%E6%A1%86%E4%B8%AD%E7%9A%84%E6%96%87%E5%AD%97%E6%B7%BB%E5%8A%A0%E9%9B%B6%E5%AE%BD%E5%AD%97%E7%AC%A6%5Cu200B.user.js
// @updateURL https://update.greasyfork.org/scripts/445652/CTRL%2BQ%E7%BB%99%E9%80%89%E4%B8%AD%E7%9A%84%E8%BE%93%E5%85%A5%E6%A1%86%E4%B8%AD%E7%9A%84%E6%96%87%E5%AD%97%E6%B7%BB%E5%8A%A0%E9%9B%B6%E5%AE%BD%E5%AD%97%E7%AC%A6%5Cu200B.meta.js
// ==/UserScript==

(function() {

    document.addEventListener('keydown', function(e) {
        if (event.ctrlKey && event.keyCode == 81) {//Q
            const soto = window.getSelection().anchorNode;
            let inputBox = soto.querySelector("textarea");
            if(!inputBox){
                inputBox = soto.querySelector("input");
                if(inputBox?.type!="text"&&inputBox?.type!="search"){
                    return
                }
            }
            const inputEvent = document.createEvent("Event");
            inputEvent.initEvent("input",true, true);
            replaceSelection(inputBox,unescape(window.getSelection().toString().split("").join("\u200B")))
            inputBox.dispatchEvent(inputEvent);
        }
    }, true);
    function replaceSelection(editor, text) {
        if (!editor) {
            return false;
        }
        if (!text) { // 如果没传递文本就不执行
            editor.focus(); //归还焦点
            return false;
        }
        let selectionStart; // textarea选中文本的开始索引
        let selectionEnd; // textarea选中文本的结束索引
        selectionStart = editor.selectionStart;
        selectionEnd = editor.selectionEnd;
        let selectStr = editor.value.substring(selectionStart, selectionEnd);
        if (selectStr && selectStr.substring(selectStr.length - 1)==" ") {
            text += " ";
        }
        let leftStr = editor.value.substring(0, selectionStart);
        let rightStr = editor.value.substring(selectionEnd, editor.value.length);
        editor.value = leftStr + text + rightStr;
        //重新选中新文本
        selectionEnd = selectionStart + text.length;
        editor.setSelectionRange(selectionStart, selectionEnd);
        //非IE浏览器必须获取焦点
        editor.focus();
    }
})();