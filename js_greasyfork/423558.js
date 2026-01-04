// ==UserScript==
// @name           Chatur | Login | Userscript Manager (iOS)
// @version        1.6
// @namespace      cam4_goes_droopy
// @description    cam4 cleanup
// @match          https://m.chaturbate.com/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/423558/Chatur%20%7C%20Login%20%7C%20Userscript%20Manager%20%28iOS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423558/Chatur%20%7C%20Login%20%7C%20Userscript%20Manager%20%28iOS%29.meta.js
// ==/UserScript==

alert('USERSCRIPT WORKING 1');

var s = document.createElement("script");
s.type = "text/javascript";
s.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js";
$("head").append(s);



$(function(){

    console.log('=============||||| RUNNING CHATURBATE LOGIN |||||==============');


   $('#close_entrance_terms').click();




    var url = window.location.href;

    
    if (url == "https://m.chaturbate.com/") {
        if( $('#gender-menu').attr('class') !== "icon-m" ) {
            console.log('CHECKING LOGIN STATUS');
            
            window.location.replace("https://m.chaturbate.com/auth/login/?next=/male-cams/");
            
        } else {
            window.location.replace("https://m.chaturbate.com/male-cams/");
        }
    }
    
    
    if (url == "https://m.chaturbate.com/auth/login/?next=/male-cams/") {
        console.log('LOGGING IN');
            
        $('#id_username').val('blumondayss');
        $('#id_password').val('sxoony1234');
        
        setTimeout(function(){
            $('.submit').click();
            $('.button[type="submit"]').click();
        }, 1000);
       
        
    }
    
    
    
});
