// ==UserScript==
// @name         Hardware Protocol Index
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  index extract
// @author       HolmesZhao
// @match        https://git.zuoyebang.cc/paperang_hardware/paperang_doc/-/blob/master/protocol.md
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zuoyebang.cc
// @grant        none
// @license      MIT
// @require           https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/445149/Hardware%20Protocol%20Index.user.js
// @updateURL https://update.greasyfork.org/scripts/445149/Hardware%20Protocol%20Index.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var gIndex = null
    function addButton() {
        var txt = document.createTextNode("Index");
        var btn = document.createElement('button');
        btn.className = 'mmbutton';
        btn.style = "z-index: 9999; font-size: large; position: fixed; top: 40px; right: 0px;";
        btn.onclick = () => {
            if (gIndex == null) {
                let toc = $('.section-nav')[0]
                gIndex = document.createElement('div');
                let header = '<div id="gIndex" style="position: fixed; top: ' + (btn.offsetHeight + 40) + 'px; right: 0px; background-color: white;">'
                let innerHTML = toc.outerHTML
                let footer = '</div>'
                gIndex.innerHTML = header + innerHTML + footer
                document.body.appendChild(gIndex);
                let indexTOC = $('.section-nav')[1]
                indexTOC.style.overflow = 'auto'
                indexTOC.style.height = (window.innerHeight - 100) + "px"
                addDrop()
                return
            }
            if (gIndex.style.display == "none") {
                gIndex.style.display = ""
            } else {
                gIndex.style.display = "none"
            }
        }
        btn.appendChild(txt);
        document.body.appendChild(btn);
    }

    function addDrop() {
        // 为box1绑定一个鼠标按下事件
        var box1 = gIndex.children[0]
        box1.onmousedown = function (event) {
            // 计算盒子的偏移量
            var offsetLeft = event.clientX - box1.offsetLeft;
            var offsetWidth = box1.offsetWidth
            // 为document绑定一个onmousemove事件，开始拖拽元素
            document.onmousemove = function (event) {
                var left = event.clientX - offsetLeft;
                box1.style.left = left + "px";
                box1.style.right = (window.innerWidth - left - offsetWidth) + "px";
            };
            // 为document绑定一个鼠标松开事件，停止拖拽
            document.onmouseup = function () {
                // 取消document的onmousemove事件
                document.onmousemove = null;
                // 取消document的onmouseup事件
                document.onmouseup = null;
            };
            // 取消浏览器默认行为，避免一些全选状态（Ctrl+A）引发的Bug
            return false;
        };
    }

    window.onload = () => {
        addButton()
    }
})();