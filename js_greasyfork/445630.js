// ==UserScript==
// @name         DV-Helper
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  Help for DV
// @author       makeka
// @include      *://dispatcher.dostavista.ru/dispatcher/problems/add/0/order_id*
// @match        *://dispatcher.dostavista.ru/dispatcher/orders/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dostavista.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445630/DV-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/445630/DV-Helper.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var docurl = document.URL;
    var main_page = docurl.includes("dispatcher.dostavista.ru/dispatcher/orders/view/");
    var transaction_page = docurl.includes("dispatcher.dostavista.ru/dispatcher/orders/tab-transactions/");
    if (main_page == true) {
        // Получили номер заказа
        try {
            var zz = +/\d+/.exec(docurl);
        } catch(err) {
            zz = null
        }
        var check_addbtn = document.querySelector('.general-view .ajax-dispatcher-note-add-dialog');
        if(!check_addbtn) {
             return;
        } else {

            var toolbarSection = document.querySelector('body');
            var create_comment = document.createElement('div');
            create_comment.setAttribute("style", "position:sticky;Bottom:0px;width:100%;z-index:99999;height:0px;");
            create_comment.innerHTML = '<style>.makeka-btn{font-size:20px;border-radius:15px;border: 2px solid #ccc;line-height:40px;background:#ddd;color:#333;padding:0 !important;}.makeka-btn:hover {background:#e84118;color:#f5f6fa}</style><div style="position:absolute;bottom:60px;right:25px;border:2px solid #ddd;background:#f5f6fa;border-radius:15px;float:right;padding:5px 15px 15px 15px"><b style="font-size:9px;color:#333;display:block;padding-left:17px;">Оставить комментарий диспетчеру:</b><form style="width:300px !important;" action="/dispatcher/orders/order-note-add/'+zz+'" method="post"><input placeholder="Введите комментарий" type="text" style="background:#f5f6fa;width:250px !important;padding:0px 15px;line-height:40px !important;border-radius:15px;border: 2px solid #ccc;display:inline-block;margin-right: 5px;" name="order_note" value=""></input><input type="hidden" name="ctoken" value="'+JS.CTOKEN+'"><input style="width:44px !important;display:inline-block;" class="makeka-btn" type="submit" value="➤"></form></div>';
            create_comment.classList.add('comment-block');
            toolbarSection.appendChild(create_comment);
        }
    } else if (transaction_page == true) {
        var check_trans = document.querySelector('.heading-section .add-block:nth-child(2) a:nth-child(1)');
        var trans_href = check_trans.getAttribute('href')
        var client_id = +/\d+/.exec(trans_href);

        var link_trans = document.querySelectorAll('.js-transaction-in-list-link');
        console.log(link_trans)
        for(var i = 0; i < link_trans.length; i++) {
            var change_class = link_trans[i].setAttribute("class", "super_link");
            var get_id = link_trans[i].getAttribute('data-transaction-id')
            var change_link = link_trans[i].setAttribute("href", "https://dispatcher.dostavista.ru/dispatcher/transactions/rollback-transaction/"+client_id+"/transaction_id/"+get_id+"");
        }
    }
    /*

    */
})();