// ==UserScript==
// @name         CCU Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速幫你填線上教學意見調查
// @author       Pionxzh
// @match        https://miswww1.ccu.edu.tw/evaluation/Questionnaire/*.php
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376208/CCU%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/376208/CCU%20Helper.meta.js
// ==/UserScript==

function evaluationSelect() {
    $('.choose input[type="radio"]:first-child').prop("checked", true)
    $('.choose>div>input[type="checkbox"]').prop("checked", true)
    $('.choose>div:last-child>input[type="checkbox"]').prop("checked", false)
}

(function() {
    'use strict';
    if ($ === undefined) return alert('腳本執行錯誤，錯誤代碼: #NOJQ')

    // adding style for button
    GM_addStyle(`
        .p-btn {
            background-color: #F44336;
            color: #FFF;
            height: 30px;
            line-height: 30px;
            width: 90px;
            text-align: center;
            border-radius: 5px;
            cursor: pointer;
            transition: .3s;
            box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
        }

        .p-btn:hover {
            background-color: #f12f21;
        }
    `)
    $('#description').after('<div id="evSelect" class="col_12 column p-btn">幫我點嘛</div>')
    $('#evSelect').on('click', ()=> evaluationSelect())

})();
