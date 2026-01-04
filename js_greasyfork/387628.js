// ==UserScript==
// @name         Damai - Stage 3
// @namespace    http://tampermonkey.net/
// @version      0.2.6 - Bham Init
// @description  try to take over the world!
// @author       Mr.FireAwayH
// @match        https://buy.damai.cn/orderConfirm*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387628/Damai%20-%20Stage%203.user.js
// @updateURL https://update.greasyfork.org/scripts/387628/Damai%20-%20Stage%203.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.saveContactHandler =  function(e){
        var info = [];
        var contactInfo = document.querySelectorAll("input[type=text]");
        contactInfo.forEach(s => info.push(s.value));
        if(info[0]){
            localStorage.name = info[0];
        }

        if(info[1]){
            localStorage.tel = info[1];
        }
        e.innerText = "保存成功";
    }

    var init = function(){
        var type = document.querySelector(".next-col.way-item.selected").innerText;
        var submit = document.querySelector(".submit-wrapper > button");
        submit.style = "position: fixed; right: 0px; top: 50%; width: 50%; height: 20%;";

        if(type.indexOf("快递") > -1){

        }else{
        }

        var contact = document.querySelector(".delivery-form");
        if(contact){
            var saveContact = document.createElement("button");
            var contactInfo = document.querySelectorAll("input[type=text]");

            contact.appendChild(saveContact);
            saveContact.outerHTML = "<button type='button' class='next-btn next-btn-normal next-btn-medium' onclick='saveContactHandler(this)'>保存联系人信息</button>";
            saveContact.onclick = saveContactHandler

            if(localStorage.name){
                contactInfo[0].value = localStorage.name;
            }

            if(localStorage.tel){
                contactInfo[1].value = localStorage.tel;
            }
        }

        var buyer = document.querySelector(".ticket-buyer-title");
        if(buyer){
            var buyerNum = document.querySelector(".ticket-buyer-title > span > em").innerText;
            var inputs = document.querySelectorAll("[type='checkbox'][aria-checked='false']");
            while(inputs.length == 0){
                setInterval(function(){
                    inputs = document.querySelectorAll("[type='checkbox'][aria-checked='false']");
                }, 10);
            }

            if(inputs.length < buyerNum){
                alert("观影人数不足");
            }

            for(var i = 0; i < buyerNum; i++){
                inputs[i].click();
            }
            submit.click();
        }else{
            submit.click();
        }
    }

    window.onload = init;
})();