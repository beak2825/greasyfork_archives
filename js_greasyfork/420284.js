// ==UserScript==
// @name           Chaturbate | Login
// @version            1.9
// @namespace      cam4_goes_droopy
// @description    cam4 cleanup
// @include        https://chaturbate.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant          GM_xmlhttpRequest
// @run-at         document-end
// @icon               https://www.google.com/s2/favicons?domain=chaturbate.com
// @downloadURL https://update.greasyfork.org/scripts/420284/Chaturbate%20%7C%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/420284/Chaturbate%20%7C%20Login.meta.js
// ==/UserScript==




$(function(){

    console.log('=============||||| RUNNING CHATURBATE LOGIN |||||==============');


   $('#close_entrance_terms').click();

    setTimeout(function(){
        $('#close_entrance_terms').click();
    }, 2000);
    setTimeout(function(){
        $('#close_entrance_terms').click();
    }, 3000);
    setTimeout(function(){
        $('#close_entrance_terms').click();
    }, 4000);

    var url = window.location.href;


    if (url == "https://chaturbate.com/") {
        if( $('#gender-menu').attr('class') !== "icon-m" ) {
            console.log('CHECKING LOGIN STATUS');

            window.location.replace("https://chaturbate.com/auth/login/?next=/male-cams/");

        } else {
            window.location.replace("https://chaturbate.com/male-cams/");
        }
    }


    if (url == "https://chaturbate.com/auth/login/?next=/male-cams/") {
        console.log('LOGGING IN');

        $('#id_username').val('blumondayss');
        $('#id_password').val('sxoony1234');
        $("#id_rememberme").prop("checked", true);

        setTimeout(function(){
            $('.submit').click();
            $('.button[type="submit"]').click();
        }, 1000);


    }



});

