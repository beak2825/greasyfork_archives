// ==UserScript==
// @name         select plus account
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  方便选取plus共享账号
// @author       You
// @match        https://*.zhile.io/shared.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhile.io
// @grant        none
// @license      MIT License
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/470033/select%20plus%20account.user.js
// @updateURL https://update.greasyfork.org/scripts/470033/select%20plus%20account.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let accountNodes
    let try_max = 100
    let try_times = 0
    const func = () => {
        try_times++
        accountNodes = document.querySelectorAll(".account-list .plus");
        if (accountNodes==null && try_times < try_max) {
            setTimeout(func, 100)
        }
    }
    const div = document.createElement('div')
    div.style = "position: fixed;top: 20px;left: 20px;"
    const btnUp = document.createElement('button')
    const btnDown = document.createElement('button')
    const btnFirst = document.createElement('button')
    const btnLast = document.createElement('button')
    btnUp.innerText = '<'
    btnDown.innerText = '>'
    btnFirst.innerText = '|<'
    btnLast.innerText = '>|'
    let selectIndex = 0;
    const fnClick = (op) => () => {
        if(accountNodes == null) {
            func()
        }
        if(accountNodes == null) {
            console.log("accountNodes get fail")
            return
        }
        if("first" === op) {
            selectIndex = 0
        } else if("up" === op && selectIndex > 0) {
            selectIndex--
        } else if("last" === op) {
            selectIndex = accountNodes.length - 1
        } else if("down" === op && selectIndex < accountNodes.length - 1) {
            selectIndex++
        }
        const account = accountNodes[selectIndex];
        if(account == null) {
            console.log("account get fail")
            return
        }
        scrollTo(0, selectIndex > accountNodes.length / 2 ? account.offsetTop + account.offsetHeight + 20
                 : account.offsetTop - 20)
    }
    btnUp.onclick = fnClick("up")
    btnDown.onclick = fnClick("down")
    btnFirst.onclick = fnClick("first")
    btnLast.onclick = fnClick("last")
    div.appendChild(btnFirst)
    div.appendChild(btnUp)
    div.appendChild(btnDown)
    div.appendChild(btnLast)
    document.body.appendChild(div)
})();