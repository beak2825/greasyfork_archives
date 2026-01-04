// ==UserScript==
// @name         Premium Onlinetools
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      1.2
// @description  Gives you premium features access: Unlimited Usage, No Wait Time, Instant Download, Instant Copy-to-clipboard
// @include      https://onlinetools.com/*
// @include      https://onlinetexttools.com/*
// @include      https://onlinecsvtools.com/*
// @include      https://onlinetsvtools.com/*
// @include      https://onlinejsontools.com/*
// @include      https://onlineyamltools.com/*
// @include      https://onlinexmltools.com/*
// @include      https://onlinemathtools.com/*
// @include      https://onlinefractaltools.com/*
// @include      https://onlinenumbertools.com/*
// @include      https://onlineintegertools.com/*
// @include      https://onlineunicodetools.com/*
// @include      https://onlineasciitools.com/*
// @include      https://onlineutf8tools.com/*
// @include      https://onlinebinarytools.com/*
// @include      https://onlinehextools.com/*
// @include      https://onlinetexttools.com/*
// @include      https://onlinestringtools.com/*
// @include      https://onlinelisttools.com/*
// @include      https://onlinerandomtools.com/*
// @include      https://onlineimagetools.com/*
// @include      https://onlinejpgtools.com/*
// @include      https://onlinepngtools.com/*
// @include      https://onlinegiftools.com/*
// @include      https://onlinetimetools.com/*
// @include      https://onlinefiletools.com/*
// @include      https://onlinehashtools.com/*
// @include      https://onlinecryptotools.com/*
// @include      https://onlinebitmaptools.com/*
// @include      https://onlinelinuxtools.com/*
// @include      https://onlinebase64tools.com/*
// @include      https://onlinesettools.com/*
// @include      https://onlinepdftools.com/*
// @include      https://onlineaudiotools.com/*
// @include      https://onlinebrowsertools.com/*
// @include      https://onlinecsstools.com/*
// @include      https://onlinejstools.com/*
// @include      https://onlinetabletools.com/*
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon https://www.google.com/s2/favicons?sz=64&domain=onlinetexttools.com
// @downloadURL https://update.greasyfork.org/scripts/469340/Premium%20Onlinetools.user.js
// @updateURL https://update.greasyfork.org/scripts/469340/Premium%20Onlinetools.meta.js
// ==/UserScript==
/* global jQuery, $ */
this.$ = this.jQuery = jQuery.noConflict(true);
(function($){

    $("#clipboardModalLabel").text("You're using the hacked premium plan")
    $("[id^='clipboardModal'] > div > div > div.modal-body > p").remove()
    
    $.each($('*').attr('data-subscription','free') , function (){
        $(this).attr('data-subscription','premium')
    }); 

})(jQuery);