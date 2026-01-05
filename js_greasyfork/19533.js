// ==UserScript==
// @name        FacebookMail
// @namespace   FacebookMail
// @include     https://mail.google.com/mail/u/0/*
// @version     1
// @description delete fb emails
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/19533/FacebookMail.user.js
// @updateURL https://update.greasyfork.org/scripts/19533/FacebookMail.meta.js
// ==/UserScript==







$(document).ready(function (){
    
    
    $("td").mouseenter(function(){
        var val= $(this).text();
        
        
        

        if(val.indexOf("Facebook")>-1){
            //$(":checkbox").attr('checked',true);
            $(this).siblings(":first").children().attr('checked',true);
            alert(html);
        }
        
    });
});

