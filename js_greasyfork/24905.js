// ==UserScript==
// @name            Registration date in VK
// @name:ru         Дата регистрации в VK
// @namespace       FIX
// @version         0.6
// @description     Registration date in VK profile
// @description:ru  Показ даты регистрации в профиле VK
// @author          raletag
// @copyright       2016-2021, raletag
// @include         *://vk.com/*
// @exclude         *://vk.com/notifier.php*
// @exclude         *://vk.com/*widget*.php*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/24905/Registration%20date%20in%20VK.user.js
// @updateURL https://update.greasyfork.org/scripts/24905/Registration%20date%20in%20VK.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var month = [null, 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
        error = function () {
            console.error('GET registration date in VK ERROR!');
        };
    new MutationObserver(function () {
        var a = document.body.querySelector('#profile_short:not([vrd]'), b, c, id;
        if (!a) return;
        a.setAttribute('vrd', '1');
        b = document.body.querySelector('a.page_actions_item[onclick*="Abuse"]');
        id = ((b && b.getAttribute('onclick').match(/(\d+)/))||[])[1];
        if (!id && window.vk && window.vk.id) id = window.vk.id;
        if (!id) return;
        c = new XMLHttpRequest();
        c.onload = function () {
            var xd = (this.responseText.match(/ya:created dc:date="(.+)T/i)||[])[1], ad, div;
            if (xd) {
                ad = xd.split('-');
                div = document.createElement ('div');
                div.className = 'clear_fix profile_info_row';
                div.innerHTML = '<div class="label fl_l">Дата регистрации:</div><div class="labeled">' + parseInt(ad[2]) + ' ' + month[parseInt(ad[1])] + ' ' + ad[0] + ' г.</div>';
                a.insertBefore(div, a.firstChild);
            } else {
                error ();
            }
        };
        c.onerror = error;
        c.timeout = 10000;
        c.open('GET', '/foaf.php?id=' + id, true);
        c.send();
    }).observe(document.body, {childList: true, subtree: true});
})();
