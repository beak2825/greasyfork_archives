// ==UserScript==
// @name         Akaanseutu paywall
// @namespace    http://akaanseutu.fi/
// @version      0.1
// @description  Paywallit on hanurista
// @author       Maksu Muuri
// @license      MIT
// @match        https://akaanseutu.fi/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/374868/Akaanseutu%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/374868/Akaanseutu%20paywall.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("paywall-preview").style.height = "100%";
    $('.omamainos-products').remove();
    $('.paywall-dialog').remove();
    $('.paywall-suggest-registration').remove();
    $('.paywall-actions').remove();
    $('.shade').remove();
    $('#article-before').remove();
    $('img').each(function(){
    if ($(this).attr('src') == 'https://akaanseutu.fi/wp-content/uploads/2017/05/tilaa-lehti.png' ){
        $(this).remove();
    }
});

})();
