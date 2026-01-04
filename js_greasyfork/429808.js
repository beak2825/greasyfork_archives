// ==UserScript==
// @name         mod noticer
// @namespace    http://atcoder.jp/
// @version      2.2
// @description  modを取る必要がありそうだったら教えてくれます！嬉しいね（うれしいので）　ソースコード内で通知位置の設定が可能です！
// @author       Ll_e_ki
// @license      MIT
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429808/mod%20noticer.user.js
// @updateURL https://update.greasyfork.org/scripts/429808/mod%20noticer.meta.js
// ==/UserScript==

/*
LICENCE : MIT

Copyright © 2023 Ll_e_ki

https://opensource.org/license/mit/
*/

(function() {
    'use strict';

    // Your code here...

    const NOTICE_POSITION = {
        IN_SUBMIT : true, // 提出ボタン内
        ABOVE_SUBMIT : false, // 提出ボタンの上
        DIALOG : false // 提出時、提出コードでmodを取り忘れている場合ダイアログ表示
        // 複数選択も可能です
    }
    const MODMARK = [ // ダイアログ表示を使用する場合、modを取っているかの確認用文言を予め入力してください
        "%"
    ]
    const MOD_LIST = ["割ったあまり", "割った余り", "答えは非常に大きく", "mod"]

    function inWord(root_element, word_list) {
        let elem_stack = [root_element]

        while (elem_stack.length > 0) {
            var element = elem_stack.pop()
            for (var i = 0; i < word_list.length; i++) {
                if (element.textContent.match(word_list[i])) {
                    return true
                }
            }
            if (element.children.length > 0) {
                var children = element.children
                for (var i = 0; i < children.length; i++) {
                    elem_stack.push(children[i])
                }
            }
        }

        return false
    }

    let task_element = document.getElementById("task-statement")
    let global_needmod = inWord(task_element, MOD_LIST)
    if (global_needmod) {
        if (NOTICE_POSITION.IN_SUBMIT) {
            document.getElementById("submit").appendChild(document.createElement("br"))
            document.getElementById("submit").appendChild(document.createTextNode("※ modは取りましたか？"))
        }
        if (NOTICE_POSITION.ABOVE_SUBMIT) {
            var append_elem = document.createElement("b")
            append_elem.textContent = "※ modは取りましたか？"
            document.getElementById("sourceCode").appendChild(append_elem)
        }
    }

    document.getElementById("submit").addEventListener("click", (event) => {
        if (NOTICE_POSITION.DIALOG && global_needmod) {
            let code_element = document.getElementById("sourceCode")
            if (inWord(code_element, MODMARK) == false && confirm("modを取っていない可能性があります。提出しますか？") == false) {
                event.preventDefault()
            }
        }
    })
})()