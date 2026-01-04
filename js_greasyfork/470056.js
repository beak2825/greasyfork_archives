// ==UserScript==
// @name         Search via Intercom
// @namespace    http://tampermonkey.net/
// @version      0.6.5
// @description  Помогает искать заказы быстрее
// @author       Vladislav Makeka
// @match        *https://dvclients.helpdeskeddy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dostavista.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470056/Search%20via%20Intercom.user.js
// @updateURL https://update.greasyfork.org/scripts/470056/Search%20via%20Intercom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var docurl = document.URL;
    var main_page = docurl.includes("dvclients.helpdeskeddy.com");

    if(main_page === true) {
            var toolbarSection = document.querySelector('html');



            var search_hsla = document.createElement('div');

            search_hsla.setAttribute("style", "position:sticky;bottom:0px;width:100%;z-index:99999;height:0px;background:#ddd");
            search_hsla.innerHTML = `

            <style>
            .makeka-btn{font-size:20px;border-radius:15px;border: 2px solid #ccc;line-height:40px;background:#ddd;color:#333;padding:0 !important;}.makeka-btn:hover {background:#e84118;color:#f5f6fa}</style>

            <div style="position:absolute;bottom:15px;right:15px;border:2px solid #ddd;background:#f5f6fa;border-radius:15px;float:right;padding:5px 2px 10px 5px">

            <b style="font-size:9px;color:#333;display:block;padding-left:17px;">Искать в административной панели:</b>

            <form target="_blank" action="https://dispatcher.dostavista.ru/dispatcher/search">
                <input type="text" style="font-size:16px; color:#333;background:#f5f6fa;width:180px !important;padding:0px 15px;line-height:40px !important;border-radius:15px;border: 2px solid #ccc;display:inline-block;margin-right: 5px;" name="search" maxlength="60" value="" placeholder="Введите текст запроса...">

                <input type="submit" target="_blank" class="button" style="display: none" value="">
            </form>

            </div>
            `;


            search_hsla.classList.add('comment-block');
            toolbarSection.appendChild(search_hsla);
    }

})();