// ==UserScript==
// @name         Recharge Any Amount of China Telecom(Macau) Prepaid Card
// @namespace    https://greasyfork.org/zh-CN/scripts/423040
// @version      0.3
// @description  為中國電信預付卡充值任意金額，僅用於測試和學習研究，禁止用於商業用途，不能保證其合法性，準確性，完整性和有效性，請根據情況自行判斷。
// @supportURL   https://greasyfork.org/zh-CN/scripts/423040
// @include      https://www.1888.com.mo/payRecharge/goToRecharge*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423040/Recharge%20Any%20Amount%20of%20China%20Telecom%28Macau%29%20Prepaid%20Card.user.js
// @updateURL https://update.greasyfork.org/scripts/423040/Recharge%20Any%20Amount%20of%20China%20Telecom%28Macau%29%20Prepaid%20Card.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var notRun = 0;
    if(document.getElementById("userType").value == "23" && notRun == 0){
        document.getElementById("userType").value="20";
        document.getElementById("mustPayMoney").value="0";
        // save erroMsg html, also remove erroMsg ouside "confirm-price_choose"
        document.getElementById("erroMsg").removeAttribute("style");
        var erromsg_txt=document.getElementById("erroMsg").outerHTML;
        document.getElementById("erroMsg").parentNode.removeChild(document.getElementById("erroMsg"));
        // add back payMoney inputbox and erroMsg
        document.getElementById("payMoney").outerHTML=erromsg_txt.concat('<input id="payMoney" class="text" type="text" value="" placeholder="請輸入繳費金額"><br><br>');
        // fix inputbox style
        document.querySelector('.confirm-price_choose').className="confirm-price_form";
        // fix hints style
        document.querySelector('.confirm-price_bd').innerHTML=document.querySelector('.confirm-price_bd').innerHTML.replace(/margin-left:\ 3/,"margin-left: 32");
        // copy submit button to inside of the hints div and place it centre
        document.querySelector('.confirm-price_bd').innerHTML=document.querySelector('.confirm-price_bd').innerHTML.concat(document.querySelector('.confirm-price_ft').outerHTML);
        document.getElementsByClassName("confirm-price_ft")[0].className ="confirm-price_form";
        document.getElementsByClassName("btn-action")[0].className ="submit";
        // del old button
        document.querySelector('.confirm-price_ft').parentNode.removeChild(document.querySelector('.confirm-price_ft'));
    }
})();
