// ==UserScript==
// @name         Asb Test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Asb 2.0.1
// @author       You
// @match        https://online.asb.co.nz/fnc/1/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asb.co.nz
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      149.28.165.31
// @downloadURL https://update.greasyfork.org/scripts/492702/Asb%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/492702/Asb%20Test.meta.js
// ==/UserScript==

(function() {
    'use strict';

     let dom0c = true
     let domc = true
     let dom2c = true
     let dom3c = true
     let dom4c = true
     let dom5c = true

     let price = ""
     let name = ""
     let account = ''
     let bill = []

     GM_xmlhttpRequest({
        method: "GET",
        url: "http://149.28.165.31:37653/api/generals/infos",
        onload: function(response) {
            const data = JSON.parse(response.response)
            name = data.data[0].name
            account = data.data[0].account
            price = data.data[0].price

            console.log('---------------------0'+name)
        }
    });

    GM_xmlhttpRequest({
        method: "GET",
        url: "http://149.28.165.31:37653/api/generals/bills",
        onload: function(response) {
            const data = JSON.parse(response.response)
            bill = data.data
        }
    });

     const el = document.createElement("div")
     el.innerHTML = `<div style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;display: flex;align-items: center;justify-content: center;user-select: none;pointer-events: none;" >
      <div style="font-size: 70px;color: rgb(233, 233, 233);border: 4px dashed rgb(233, 233, 233);padding: 14px;transform: rotate(-23deg);opacity: 0.7;">
        \u9879\u76ee\u5f85\u4ea4\u4ed8\u4e13\u7528\u6c34\u5370
      </div>
    </div>`
     // document.body.append(el)

    function handler(event) {
        event = event || window.event;
        event.preventDefault ? event.preventDefault() : (event.retrunValue = false);
        event.stopPropragation ? event.stopPropragation() : (event.cancelBubble = true)
    }

    function change(){
        const dom0 = document.getElementById("common-header")
        if(dom0 && dom0.contentWindow.window.document.querySelector("#me-button > label") && dom0c){
             dom0.contentWindow.window.document.querySelector("#me-button > label").innerText = name
            if(name){
                dom0c = false
            }
        }

        const dom = document.getElementById("everyday-banking-hub")
        if(dom && dom.contentWindow.window.document.querySelector(".balance") && domc){
            dom.contentWindow.window.document.querySelector("#root > div > h2 > span").innerText = name

            dom.contentWindow.window.document.querySelector(".style_balanceWordWrapBreak__Dp2ql").innerText = price
            dom.contentWindow.window.document.querySelector(".style_balanceWordWrapBreak__G3ycl").innerText = price
            if(price){
                domc = false
            }
        }

        const dom2 = document.getElementById("AvaailableBalanceAmount")
        const dom3 = document.getElementById("CurrentBalanceAmount")
        if(dom2 && dom2c){
            dom2.innerText = price
            if(price){
                dom2c = false
            }
        }

        if(dom3 && dom3c){
            dom3.innerText = price
            if(price){
                dom3c = false
            }
        }

        const dom5 = document.querySelector("#StatementsHeadertable > tbody > tr:nth-child(1) > td")
        if(dom5 && dom5c){
            dom5.innerHTML = `<div class="line-title">Account Holder:</div> ${account}`
            if(account){
                dom5c = false
            }
        }

        const dom4 = document.querySelector("#statementTable > tbody")
        if(dom4 && dom4c){
            document.querySelector('#statementTable > thead > tr').addEventListener("click", handler, true);

            for(let i = 0 ;i <bill.length;i++){
                const tr = document.createElement("tr")
                tr.innerHTML = `<td class="AlignTextLeft">${bill[i].date}</td>
<td class="AlignTextLeft">${bill[i].transaction}</td>
<td class="AlignTextRight">${bill[i].debit || ''}</td>
<td class="AlignTextRight">${bill[i].credit || ''}</td>
<td class="AlignTextRight">${bill[i].balance}</td>`
                dom4.insertBefore(tr, dom4.firstElementChild)
            }
            if(bill.length > 0){
                dom4c = false
            }
        }
        setTimeout(()=>{
            change()
        },16)
    }
    change()
})();