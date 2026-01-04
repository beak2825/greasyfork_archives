// ==UserScript==
// @name         LZT Background System
// @namespace    https://lolzteam.net
// @version      2.3.3
// @description  Changes background
// @author       Liquid, Fantik
// @match        *lolzteam.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387830/LZT%20Background%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/387830/LZT%20Background%20System.meta.js
// ==/UserScript==

// профиль
$("html").css("background-color", 'rgba(39,39,39,.95)');
$(".member_tabs").css("margin", '0');
$("div.post-header").css("margin-top", '10px');
$(".messageSimple ").css("background", 'rgba(39,39,39,.95)');
$("body").css("background-attachment", 'fixed');
$("li.messageSimple").css("margin-top", '-10px');
$(".tabs").css("background", 'rgba(39, 39, 39,.95)');
$(".darkBackground").css("background", 'rgba(39,39,39,.95)');
$(".secondaryContent").css("background", 'none');
$("li.panel.Notice.DismissParent.notice_34").css("display", 'none');
$(".profilePage .mast .section").css("border-radius", '0 0 5px 5px');
$(".profilePage .mast .section").css("background-color", 'rgba(39,39,39,.95)');
$("div.topblock.darkBackground.padding15").css("margin-bottom", '-15px');
$("form.simpleRedactor.MemberViewRedactor.messageSimple.profilePoster.AutoValidator.primaryContent").css("margin-bottom", '-10px');

// система
$(document).ready(function(){
    if (document.getElementsByClassName("profilePage").length > 0) {
        var user = $.trim($("title").text().split(" ")[0])
        console.log(user);
        $.get('https://qtcl.000webhostapp.com/searchwallapers.php?nickname='+user, function(data) {
            $("body").css("background-image", 'url('+ data +')');
            console.log(data);
        });
    }
});