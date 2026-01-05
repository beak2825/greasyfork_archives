// ==UserScript==
// @name         help/formattin
// @version      1.1
// @description  Converts [help/formatting] into the link to help center article on formatting
// @author       nicael
// @include        *://*.stackexchange.com/questions/*
// @include        *://*stackoverflow.com/questions/*
// @include        *://*serverfault.com/questions/*
// @include        *://*superuser.com/questions/*
// @include        *://*askubuntu.com/questions/*
// @include        *://*stackapps.com/questions/*
// @grant        none
// @namespace    https://greasyfork.org/users/9713
// @downloadURL https://update.greasyfork.org/scripts/13770/helpformattin.user.js
// @updateURL https://update.greasyfork.org/scripts/13770/helpformattin.meta.js
// ==/UserScript==

$(document).on("focus","textarea[name='comment']",function(){
    $(document).on("click","input",function(){rs();})
    $(document).on("keydown","textarea[name='comment']",function(e){
        if(e.which == 13){rs()}
    })
    function rs(){
        $("textarea[name='comment']").val($("textarea[name='comment']").val().replace(/\[help\/formatting\]/g,"[formatting tools](/help/formatting)"))
        if($("textarea[name='comment']").val().indexOf('[formatting tools]')==0){$("textarea[name='comment']").val($("textarea[name='comment']").val().replace("[f","[F"))}
    }
})