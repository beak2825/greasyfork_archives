// ==UserScript==
// @name         超多选项Select附加搜索框
// @namespace    http://ynotme.cn/
// @version      0.1
// @description  try to take over the world!
// @author       zhangtao103239
// @match         *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374542/%E8%B6%85%E5%A4%9A%E9%80%89%E9%A1%B9Select%E9%99%84%E5%8A%A0%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/374542/%E8%B6%85%E5%A4%9A%E9%80%89%E9%A1%B9Select%E9%99%84%E5%8A%A0%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    selections = document.getElementsByTagName('select');
    for (var i = 0; i < selections.length; i++) {
        var selection = selections[i];
        if (selection.length > 20) {
            var ins = document.createElement('input');
            ins["data-indexCount"] = i;
            ins.onkeypress = function (e) {
                if (e.keyCode == 13) {
                    var value = ins.value;
                    var indexCount = ins["data-indexCount"]
                    var selection = selections[indexCount]
                    for (var j = 0; j < selection.length; j++) {
                        if (selection[j].label == value) {
                            selection[j].selected = true;
                            break;
                        }
                    }
                }
            }
            selection.parentElement.appendChild(ins);
        }
    }
    // Your code here...
})();