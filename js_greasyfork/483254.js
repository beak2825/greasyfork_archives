// ==UserScript==
// @name            Steam | Hide Sensitive Data
// @name:uk         Steam | Приховати приватну інформацію
// @namespace       http://tampermonkey.net/
// @version         33.1.0
// @description     Will hide (blur) sensitive data. Remove blur effect on hover.
// @description:uk  Приховає (блюр) приватну інформацію. Еффект спаде при наведені на елемент.
// @author          Black_Yuzia
// @match           https://steamcommunity.com/*
// @match           https://*.steampowered.com/*
// @icon            https://store.steampowered.com/favicon.ico
// @grant           GM_addStyle
// @run-at          document-start
// @license         CC BY-NC-ND 4.0
// @license-url     https://creativecommons.org/licenses/by-nc-nd/4.0/
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      safari
// @compatible      edge
// @downloadURL https://update.greasyfork.org/scripts/483254/Steam%20%7C%20Hide%20Sensitive%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/483254/Steam%20%7C%20Hide%20Sensitive%20Data.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
    #header_wallet_balance, 
    .accountData.price,
    #total_expenses,
    .account_data_field,
    .wht_wallet_balance.wallet_column,
    .account_name,
    #marketWalletBalanceAmount,
    .help_intro_text,
    .responsive_menu_user_wallet,
    .youraccount_steamid,
    .OpenID_loggedInAccount,
    #review_account_body
    {
        filter: blur(5px);
    }

    .youraccount_pageheader {
    filter: blur(12px)
    }

    #header_wallet_balance:hover, 
    .accountData.price:hover,
    #total_expenses:hover,
    .account_data_field:hover,
    .wht_wallet_balance.wallet_column:hover,
    .account_name:hover,
    #marketWalletBalanceAmount:hover,
    .help_intro_text:hover,
    .responsive_menu_user_wallet:hover,
    .youraccount_steamid:hover,
    .youraccount_pageheader:hover,
    .OpenID_loggedInAccount:hover,
    #review_account_body:hover
    {
        filter: none;
    }
    `)
})();
