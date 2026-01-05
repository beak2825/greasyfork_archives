// ==UserScript==
// @name         GameFAQs Old-Style left of post.
// @Author       Judgmenl
// @namespace    Kraust
// @version      1.2.0
// @description  Old-Style left of post.
// @author       Kraust
// @match        http://*.gamefaqs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10188/GameFAQs%20Old-Style%20left%20of%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/10188/GameFAQs%20Old-Style%20left%20of%20post.meta.js
// ==/UserScript==

$(".msg_below").css("position", "relative");
$(".msg_below").each(function(index){
    $(this).parent().prev().append($(this).detach());
});

$(".message_num").each(function(index){
    $(this).parent().append($(this).detach());
});

$(".edited").css("display", "block");
$(".action_after").hide();
$(".options").css("float", "none");
