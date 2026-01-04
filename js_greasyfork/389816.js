// ==UserScript==
// @name         Pin Cats Appropriate/InAppropriate Selecters
// @author       Tehapollo
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try to take over the world!
// @include      https://sofia*.pinadmin.com/*
// @include      https://api.pinterest.com/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/389816/Pin%20Cats%20AppropriateInAppropriate%20Selecters.user.js
// @updateURL https://update.greasyfork.org/scripts/389816/Pin%20Cats%20AppropriateInAppropriate%20Selecters.meta.js
// ==/UserScript==
$(document).keydown(function (key) {
if (key.keyCode == 68 ){
            $('input[type=radio]')[16].click();
            $('button.btn.btn-lg.btn-primary').click();
    }
if (key.keyCode == 83){
            $('input[type=radio]')[15].click();
            $('button.btn.btn-lg.btn-primary').click();
    }
    if (key.keyCode == 65 ){
            $('input[type=radio]')[14].click();
            $('button.btn.btn-lg.btn-primary').click();
    }
     if (key.keyCode == 70 ){
            $('input[type=radio]')[9].click();
            $('button.btn.btn-lg.btn-primary').click();
    }
if (key.keyCode == 90 ){
            $('input[type=radio]')[10].click();
            $('button.btn.btn-lg.btn-primary').click();
    }
if (key.keyCode == 88 ){
            $('input[type=radio]')[11].click();
            $('button.btn.btn-lg.btn-primary').click();
    }
})();