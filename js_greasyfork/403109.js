// ==UserScript==
// @name           Victory: Ссылки на старый интерфейс почты вместо ajax
// @author         BioHazard
// @version        1.00
// @namespace      Victory
// @description     Ссылки на старый интерфейс почты вместо ajax
// @include        /^http.://virtonomica\.ru/\w+/main/user/privat/persondata/message$/
// @downloadURL https://update.greasyfork.org/scripts/403109/Victory%3A%20%D0%A1%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%81%D1%82%D0%B0%D1%80%D1%8B%D0%B9%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%20%D0%BF%D0%BE%D1%87%D1%82%D1%8B%20%D0%B2%D0%BC%D0%B5%D1%81%D1%82%D0%BE%20ajax.user.js
// @updateURL https://update.greasyfork.org/scripts/403109/Victory%3A%20%D0%A1%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%81%D1%82%D0%B0%D1%80%D1%8B%D0%B9%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%20%D0%BF%D0%BE%D1%87%D1%82%D1%8B%20%D0%B2%D0%BC%D0%B5%D1%81%D1%82%D0%BE%20ajax.meta.js
// ==/UserScript==

(function(){
    'use strict';
    
    $('button.link').off();
    $('button.link[data-box="inbox"]').click(function(){window.location='https://virtonomica.ru/olga/main/user/privat/persondata/message/inbox'});
    $('button.link[data-box="system"]').click(function(){window.location='https://virtonomica.ru/olga/main/user/privat/persondata/message/system'});
    $('button.link[data-box="sent"]').click(function(){window.location='https://virtonomica.ru/olga/main/user/privat/persondata/message/outbox'});
    
})();