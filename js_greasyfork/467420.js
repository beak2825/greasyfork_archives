// ==UserScript==
// @name         AtCoder未記入チェッカー
// @namespace    https://github.com/ZOI-dayo
// @version      0.1
// @description  AtCoderの参加登録メニューで未記入のものがあれば赤く表示します
// @author       ZOI_dayo
// @supportURL  https://twitter.com/ZOI_dayo
// @license      MIT
// @match        https://atcoder.jp/contests/*/register
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @downloadURL https://update.greasyfork.org/scripts/467421/AtCoder%E6%9C%AA%E8%A8%98%E5%85%A5%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/467421/AtCoder%E6%9C%AA%E8%A8%98%E5%85%A5%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC.meta.js
// ==/UserScript==

(() =>{
    'use strict';
    const warn = (elem) => {
        elem.style.backgroundColor = "#FF000044"
    }
    const unwarn = (elem) => {
        elem.style.backgroundColor = "unset"
    }
    const onChange = () => {
        for(let elem of document.querySelectorAll('.form-group')) {
            console.log(elem)
            const inputs = elem.querySelectorAll('input');
            if(inputs.length == 0) continue;
            console.log(inputs[0].getAttribute('type'))
            console.log(elem.querySelector('input[type="radio"][checked]'))
            const type = inputs[0].getAttribute('type')
            if(type == 'radio') {
                // console.log(inputs[0].getAttribute('name'))
                const checked = Array.from(inputs).find(i => i.checked)
                if(checked.value == "No") warn(elem)
                else unwarn(elem)
            } else if(type == 'text') {
                const value = inputs[0].value;
                if(value == "") warn(elem)
                else unwarn(elem)
            } else if(type == 'checkbox') {
                if(!Array.from(inputs).some(i => i.checked)) warn(elem)
                else unwarn(elem)
            }
        }
    }
    document.forms[1].addEventListener('change', onChange);
    onChange();
})();
