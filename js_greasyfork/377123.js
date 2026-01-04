// ==UserScript==
// @name         OFF---WHITE
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        *www.off---white.com*
// @include      *www.off---white.com*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/377123/OFF---WHITE.user.js
// @updateURL https://update.greasyfork.org/scripts/377123/OFF---WHITE.meta.js
// ==/UserScript==

// "FIRST LAST"
var yourName = "";
// "1111222233334444"
var yourCC_Number = "";
// "123"
var yourCC_Code = "";
// USE "1", "2", "3" ETC OR "10", "11", "12"
var yourCC_Exp_Month = "";
// USE "2020"
var yourCC_Exp_Year = "";


//////////////////////////////////////////////////////////////////////////////////////////
// LEAVE EVERYTHING BELOW ALONE   ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

var checkBox = $("#privacy_policy_check");
var addyPage = $("#billing");
var shipPage = $("#shipping_method");
var cont1 = $(".continue.button.primary");
var payPage = $("#js-gestpay-form");
var name = $("#cardholder_name");
var number = $("#card_number");
var code = $("#card_code");
var month = $("#card_month");
var year = $("#card_year");



if ( checkBox.length ) {
    checkBox.click();
    }

if (addyPage.length ) {
    setTimeout(function(){ cont1.click(); }, 500);
}

if ( shipPage.length ) {
    setTimeout(function(){ cont1.click(); }, 500);
}

if (payPage.length ) {
    name.val( yourName );
    number.val( yourCC_Number );
    code.val( yourCC_Code );
    month.val( yourCC_Exp_Month );
    year.val( yourCC_Exp_Year );
}


