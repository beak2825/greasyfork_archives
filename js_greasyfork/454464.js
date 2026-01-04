// ==UserScript==
// @name         ich
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  Intercom Helper
// @author       makeka
// @match        *://app.intercom.com/a/inbox/onpb0p7t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dostavista.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454464/ich.user.js
// @updateURL https://update.greasyfork.org/scripts/454464/ich.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var name_courier = '';
    let i = setInterval(function() {
        if (document.querySelector(".popover__opener")){
            var user_name = document.querySelector('.inbox-2__conversation-header span');
            if (name_courier == user_name.innerHTML) {
                var dv_active_has = document.getElementById('dv-active-order');
                if (dv_active_has.innerHTML == "") {
                    write_blocks();
                } else {
                    return;
                }
            } else {
                write_blocks();
            }
            name_courier = user_name.innerHTML;
        } else {
            return
        }
    }, 1000);
    function write_blocks() {
        var rightSide = document.querySelector('.inbox2__conversation-details-sidebar-sheet .px-6');
        var is_assistant = document.getElementById('dostavista-assistant');
        if (!is_assistant) { // ассистента нет
            var super_style = document.createElement('div');
            super_style.innerHTML = '<style>#dostavista-assistant{border-radius:15px;padding:10px 0;colod:#000;}'+
                '#dostavista-assistant > ul> li {list-style-type: none;margin:0;padding:0;} '+
                '#dostavista-assistant > ul> li a{display:inline-block;background:rgba(111, 111, 111, 0.2);border:2px solid rgba(151, 151, 151, 0.2);padding:5px 10px;border-radius:5px;margin:5px 10px 5px 0;text-decoration:none;font-weight:bold;}'+
                '.image-hide-dv{background:rgba(111, 111, 111, 0.2);dispay:inline-block;padding:5px 10px;border-radius:15px;}'+
                '</style>'+
                '<div id="dostavista-assistant"><ul style="padding:0;margin:0;">'+
                '<li id="dv-active-order"></li>'+
                '<li id="dv-link-courier"></li>'+
                '</ul></div><div style="text-align:center;">Made with love for my team <span style="color:red">&#10084;</span></div><div style="text-align:center;font-size:80%;">Support <a href="https://t.me/u2poy">t.me/u2poy</a></div>'+
                '';
            rightSide.appendChild(super_style);

        } else { // видим ассистента
            let link = document.querySelectorAll('.accordion-new__section[data-intercom-target$="user-details"] .flex-row');
            let searchTerm = 'Today active orders';
            var findTAO;
            for(var i = 0; i < link.length; i++) {
                if(link[i].childNodes[4].outerText == searchTerm) {
                    findTAO = link[i].childNodes[7].outerText;
                    break;
                }
            }
            var findID;
            for(let id = 0; id < link.length; id++) {
                if(link[id].childNodes[4].outerText == "User id") {
                    findID = link[id].childNodes[7].outerText;
                    break;
                }
            }
            if (!findID) {

            } else {
                let link_CR = document.getElementById('dv-link-courier');
                link_CR.innerHTML = '<a style="background:rgba(131, 181, 181, 0.2)" target="_blank" href="https://dispatcher.dostavista.ru/dispatcher/couriers/view/'+findID+'">Courier</a><a style="background:rgba(131, 181, 181, 0.2)" target="_blank" href="https://dispatcher.dostavista.ru/dispatcher/couriers/view/'+findID+'#tab-contracts">Contracts</a>';
            }
            console.log(findID);
            if (findTAO == "no_active_order") {
                let link_TAO = document.getElementById('dv-active-order');
                link_TAO.innerHTML = '<a target="_blank" href="https://t.me/u2poy">Кажется, активных заказов нет &#128580;</a>';
            } else {
                let link_TAO = document.getElementById('dv-active-order');
                let masTAO = findTAO.split(",");
                let strTAO = "";
                masTAO.forEach(item=>{
                    let url_link = +/\d+/.exec(item);
                    let elem = '<a target="_blank" href="https://dispatcher.dostavista.ru/dispatcher/orders/view/'+url_link+'">'+item+'</a>';
                    strTAO += elem;
                })
                link_TAO.innerHTML = strTAO;
            }
        }
    }
})();