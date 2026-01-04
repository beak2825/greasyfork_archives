// ==UserScript==
// @name         LZT_CustomMaintenance
// @namespace    MeloniuM/LZT
// @version      1.0
// @description  Customizes the maintenance page
// @author       You
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532114/LZT_CustomMaintenance.user.js
// @updateURL https://update.greasyfork.org/scripts/532114/LZT_CustomMaintenance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let banPageContainer = $(`<div class="banPageContainer">
        <div class="banPageInfo">
            <img style="object-fit: cover;" src="https://i.ibb.co/8gD1VmnC/1000081369.jpg" width="166" height="150" alt="lzt_ban_page_access_to_the_site_is_denied">
            <div class="title mn-15-0">Технические шоколадки</div>
            <div>Форум наевся и спитъ <img src="https://nztcdn.com/files/5b6c1b52-00b7-4913-90f4-039897839685.webp" class="mceSmilie" alt=":pigyes:" title="Pig yes" loading="lazy"></div>
        </div>
        <div class="bottomContainer">
            <div class="title mn-0-0-15">А всё! А надо было раньше!</div>
            <div class="mn-0-0-15">Больше никаких фурри сегодня. Пей молочка и ложись спать. Завтра пофапаешь</div>
        </div>
    </div>
`);

    function customBanPageContainer($target){
        if (!$('.banPageContainer:contains(Технические работы на Форуме)').length){
            return;
        }
        $target.replaceWith(banPageContainer);
    }

    customBanPageContainer($('.banPageContainer'));
    $(document).on('XFAjaxSuccess', function (e) {
        let ajaxData = e.ajaxData;
        if (!(ajaxData && ajaxData.templateHtml)) {
            return;
        }
        if (!ajaxData?.css?.stylesheets?.includes("ban_page")) {
            return;
        }
        if ($(ajaxData.templateHtml).find('.banPageContainer:contains(Технические работы на Форуме)').length) {
            ajaxData.templateHtml = banPageContainer
        }
    });
})();