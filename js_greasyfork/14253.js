// ==UserScript==
// @name         Zenmoney UI
// @version      0.04
// @description  Адаптация интерфейса дзен-мани
// @author       jonny3D
// @include      https://zenmoney.ru/*
// @grant        none
// @namespace    https://greasyfork.org/users/12985
// @downloadURL https://update.greasyfork.org/scripts/14253/Zenmoney%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/14253/Zenmoney%20UI.meta.js
// ==/UserScript==
'use strict'

$(function () {
   zm.bind('zenmoney_onload', function(){ 
       if (zm.loader.url == "browse")
       {
           console.log('Корректиируем внешний вид списка счетов...');
           $('.balanceSmall').css('float', 'right').css('font-size', '14px').css('margin', '0');
           $('.balanceComment').css('font-size', '14px').css('margin', '2px 0');
           
           console.log('Корректиируем внешний операций...');
           $('.transDatas').css('padding', '2px 0px 4px 2px');
           $('.transDatas .action, .transaction_row.marker .action').css('margin-top', '-20px');
       }
   });
});
