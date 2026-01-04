// ==UserScript==
// @name         whatfontis premium 
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      1.1
// @description  removes blurred text and blocking elements so you can use (Commercial / Free Personal / Google Fonts) premium features in font search results 
// @match        https://www.whatfontis.com/*
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @require      https://greasyfork.org/scripts/451088-utils-library/code/Utils%20-%20Library.js?version=1097324
// @grant        GM_info
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatfontis.com
// @downloadURL https://update.greasyfork.org/scripts/470646/whatfontis%20premium.user.js
// @updateURL https://update.greasyfork.org/scripts/470646/whatfontis%20premium.meta.js
// ==/UserScript==
/* global jQuery, $ */
this.$ = this.jQuery = jQuery.noConflict(true);
(function($){

    var names = $('.border-bottom-dotted.pb-0.bg-light.pb-1')
    $.each(names , function (index, value){
        $(this).remove()
    }); 

    var names2 = $("#loadertestblock > div > div").find('div')
    $.each(names2 , function (index, value){
        $(this).removeClass('blur')
    }); 

    var names3 = $('.aboutinlist.py-3')
    $.each(names3 , function (index, value){
        $(this).remove()
    }); 

    $("#display-options > div > div > form:nth-child(2) > button").remove()


    setInterval(function(){
        utils.waitForElement('.fade.show').then(function() {
            $("#dialog > div > div > button")[0].click()
        }) 
        utils.waitForElement('.modal.fadedisplaymodal.show').then(function() {
            $('.modal.fadedisplaymodal.show').find('button').click()
        }) 
    }, 1000); 


    $("body > div.content.standard.mb-3.mb-lg-5.pt-3.pt-lg-5.pb-5 > div > div > div.col-12.col-lg-9.display.px-lg-5.pb-5 > div.font-control.mb-4 > div.row.mb-5 > div:nth-child(2) > div:nth-child(2)").replaceWith($("body > div.content.standard.mb-3.mb-lg-5.pt-3.pt-lg-5.pb-5 > div > div > div.col-12.col-lg-9.display.px-lg-5.pb-5 > div.font-control.mb-4 > div:nth-child(5) > div.col-16.col-lg-16.p-3.pt-3"))

})(jQuery);