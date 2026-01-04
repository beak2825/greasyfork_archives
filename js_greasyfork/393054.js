// ==UserScript==
// @name         7-ELEVEN 登錄發票抽
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       SentenceDot
// @match        https://www.ecloudlife.com/invoice/my
// @match        https://ilottery.7-11.com.tw/Func/SetInvoice
// @grant        none
// @require      https://unpkg.com/clipboard@2/dist/clipboard.min.js
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/393054/7-ELEVEN%20%E7%99%BB%E9%8C%84%E7%99%BC%E7%A5%A8%E6%8A%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/393054/7-ELEVEN%20%E7%99%BB%E9%8C%84%E7%99%BC%E7%A5%A8%E6%8A%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var timeout = 1.5
    const match_URLs = ["https://www.ecloudlife.com/invoice/my", "https://ilottery.7-11.com.tw/Func/SetInvoice"]


    setTimeout(() => {
        if (match_URLs.indexOf(window.location.toString()))
            senvenPage()
        else
            Einvoice()
    }, timeout * 1000)


    function Einvoice() {
        console.log(123)
        var copy_content = ""
        var copy_amount = 0

        document.querySelectorAll("tr.collapsed").forEach(tr => {
            if (tr.children[5].innerText.includes("統一")) {
                var date = tr.children[2].innerText.slice(0, 4) + "/" + tr.children[2].innerText.slice(4, 6) + "/" + tr.children[2].innerText.slice(6) // 消費日期
                var number = tr.children[3].innerText // 發票號碼

                copy_content += date + "\t" + number + "\n"
                copy_amount++
            }
        })

        // 複製並設定內部按鈕各項參數
        var element = document.querySelector("div.btn-group.pull-right").cloneNode()
        var btn = document.createElement("button");
        var textnode = document.createTextNode("複製發票內容");
        btn.setAttribute("id", "copy")
        btn.className = "btn btn-primary"
        btn.appendChild(textnode);
        element.appendChild(btn)

        // 插入至按鈕的toolbar裡面
        document.querySelector(".btn-toolbar").insertAdjacentElement('beforeend', element)

        // clipboard.js的複製函式
        new ClipboardJS('#copy', {
                text: function(trigger) {
                    console.log(copy_content)
                    return copy_content;
                }
            })
            // 成功複製的recall
            .on('success', (e) => {
                alert(`複製完成，共${copy_amount}張統一超商發票`)
            });
    }

    function senvenPage() {

        //新增一個可以打字的地方
        document.querySelector("#pop_up").innerHTML = "<textarea id='invoices' style='width: 80%;'></textarea>"

        //自動調整高度
        var textarea = document.getElementById("invoices");
        textarea.addEventListener('change', () => {
            console.log(123);
            textarea.style.height = textarea.scrollHeight + "px";
        })

        // 直接點開數量最大的電子發票輸入框
        for (var index = 0; index < 9; index++)
            document.querySelector("#invoice_form > div.login_tb > div.csstable > div:nth-child(3) > div.td > a").click()
    }
})();