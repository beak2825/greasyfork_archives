// ==UserScript==
// @name         CSDN编辑器快捷键
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  自定义CSDN编辑器快捷键，使用快捷键在CSDN博客编辑页面中快速输入的自定义内容
// @author       myaijarvis
// @match        https://editor.csdn.net/md/?*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/439006/CSDN%E7%BC%96%E8%BE%91%E5%99%A8%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/439006/CSDN%E7%BC%96%E8%BE%91%E5%99%A8%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var kjj=function (event) {
        // console.log(event.ctrlKey, event.altKey);
        // console.log(event.keyCode);
        // console.log(getKeyCode("j"));

        //判断是否按下快捷键ctrl + alt + j
        if (event.ctrlKey && event.altKey && event.keyCode == getKeyCode("j")) {
            //alert("ctrl + alt + j");
            insertHtmlAtCaret("```java\n\n```");
        } else if (
            event.ctrlKey &&
            event.altKey &&
            event.keyCode == getKeyCode("p")
        ) {
            //alert("ctrl + alt + p");
            insertHtmlAtCaret("```python\n\n```");
        } else if (
            event.ctrlKey &&
            event.altKey &&
            event.keyCode == getKeyCode("c")
        ) {
            //alert("ctrl + alt + c");
            insertHtmlAtCaret("```c\n\n```");
        }else if (
            event.ctrlKey &&
            event.altKey &&
            event.keyCode == getKeyCode("i")
        ) {
            //alert("ctrl + alt + i"); // 电脑截屏快捷键ctrl+alt+s
            insertHtmlAtCaret("```javascript\n\n```");// t没反应，不知道为啥，先换成i
        }else if (
            event.ctrlKey &&
            event.altKey &&
            event.keyCode == getKeyCode("q")
        ) {
            //alert("ctrl + alt + q");
            insertHtmlAtCaret("```sql\n\n```");
        }else if (
            event.ctrlKey &&
            event.altKey &&
            event.keyCode == getKeyCode("z")
        ) {
            //alert("ctrl + alt + z");
            insertHtmlAtCaret("```\n\n```");
        }
    };

    // JS监听键盘快捷键【65到90:a到z（A到Z）】
    document.addEventListener("keydown",kjj );
})();

/**
 * 返回字符串代表的keyCode（数值型）
 * @param {字符串} str
 * @returns
 */
function getKeyCode(str) {
    return str.toUpperCase().charCodeAt();
}

/**
 * 在光标处插入内容
 * @param {字符串} html
 */
function insertHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(),
                node,
                lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}



