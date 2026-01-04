// ==UserScript==
// @name         AWS增加账户下拉
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       feiyu0123
// @match        https://signin.aws.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422319/AWS%E5%A2%9E%E5%8A%A0%E8%B4%A6%E6%88%B7%E4%B8%8B%E6%8B%89.user.js
// @updateURL https://update.greasyfork.org/scripts/422319/AWS%E5%A2%9E%E5%8A%A0%E8%B4%A6%E6%88%B7%E4%B8%8B%E6%8B%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var accounts = [
      'bingo.online@ae-mobile.com',
      'ace@ae-mobile.com',
      'amazon@ae-mobile.com',
      'aeads@ae-mobile.com',
      'aecasino@ae-mobile.com',
      'sacasino@ae-mobile.com'
    ];
    var html =
                '<select id="account_select" class="aws-signin-textfield" style="margin-bottom:10px"><option value="">请选择</option>';

    for(var i = 0; i < accounts.length; i++) {
        html += '<option>' + accounts[i] + '</option>';
    }
                '</select>';
    console.info(html);
    $(html).insertBefore('#resolving_input');
    $('#account_select').on('change', function() {
        $('#resolving_input').val($('#account_select').val());
    });

})();