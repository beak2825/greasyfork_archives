// ==UserScript==
// @name         markdown helper
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  在中文输入法中，将·自动替换成`，》替换成>，！替换成'* '(减少按键距离)
// @author       鹿之城
// @match        https://www.nowcoder.com/creation/write/*
// @match        https://maxiang.io/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500448/markdown%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/500448/markdown%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('md专用转换脚本已加载');

    function getCaretPosition(element) {
        let caretOffset = 0;
        let doc = element.ownerDocument || element.document;
        let win = doc.defaultView || doc.parentWindow;
        let sel = win.getSelection();
        if (sel.rangeCount > 0) {
            let range = sel.getRangeAt(0);
            let preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
        return caretOffset;
    }

    function setCaretPosition(element, offset) {
        let charIndex = 0, range = document.createRange();
        range.setStart(element, 0);
        range.collapse(true);
        let nodeStack = [element], node, foundStart = false, stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                let nextCharIndex = charIndex + node.length;
                if (!foundStart && offset >= charIndex && offset <= nextCharIndex) {
                    range.setStart(node, offset - charIndex);
                    range.setEnd(node, offset - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                let i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    document.addEventListener('compositionend', function(e) {
        let target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            let start = getCaretPosition(target);
            console.log('替换前 - 光标位置:', start);

            let value = target.value || target.innerHTML;
            let lengthChange = 0;

            if (value.includes('》')) {
                console.log('检测到"》"，将其替换为">"');
                value = value.replace(/》/g, '> ');
                lengthChange = '> '.length - '》'.length;
            } else if (value.includes('·')) {
                console.log('检测到"·"，将其替换为"`"');
                value = value.replace(/·/g, '`');
                lengthChange = '` '.length - '·'.length;
            }
            //else if (value.includes('~')) {
              //  console.log('检测到"~"，将其替换为"* "');
               // value = value.replace(/~/g, '*  ');
                //lengthChange = '*  '.length - '~'.length;
        //    }
            else if (value.includes('！')) {
                console.log('检测到"！"，将其替换为"* "');
                value = value.replace(/！/g, '*  ');
                lengthChange = '*  '.length - '~'.length;
            }


            if (lengthChange !== 0) {
                start += lengthChange;
            }

            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                target.value = value;
                target.setSelectionRange(start, start);
                console.log('替换后 - 光标位置:', start);
            } else {
                target.innerHTML = value;
                setCaretPosition(target, start);
                console.log('替换后 - 光标位置:', start);
            }
        }
    });

})();
