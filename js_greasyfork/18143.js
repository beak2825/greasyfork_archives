// ==UserScript==
// @name         DomesticatedWalrus
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Only tame animals may interact with humans.
// @author       Croned
// @match        https://epicmafia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18143/DomesticatedWalrus.user.js
// @updateURL https://update.greasyfork.org/scripts/18143/DomesticatedWalrus.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var runAgain = true;

var tameForumCom = function() {
    $(".rt-post").each(function() {
        if ($(this).find(".postuser a").text() == "WildWalrus") {
            $(this).find(".bubble_msg").html($(this).find(".bubble_msg").html().toLowerCase());
        }
    });
}

var tameLobCom = function() {
    $(".bubble_i").each(function() {
        if ($(this).find(".commentinfo a").text().trim() == "WildWalrus") {
            $(this).find(".msg-inner").html($(this).find(".msg-inner").html().toLowerCase());
        }
    });
}

$("body").on("click", ".pagenav", function() {
    runAgain = true;
});

switch(window.location.pathname.split("/")[1]) {
    case "topic":
        if ($("#threadmaker a").text() == "WildWalrus") {
            $("#msg_container").html($("#msg_container").html().toLowerCase());
        }
        $('#posts').bind("DOMSubtreeModified",function(){
            if (runAgain) {
                runAgain = false;
                setTimeout(function() {
                    tameForumCom();
                }, 100);
            }
        });
        tameForumCom();
        break;
        
    case "lobby":
        $('.comment_container').bind("DOMSubtreeModified",function(){
            if (runAgain) {
                runAgain = false;
                setTimeout(function() {
                    tameLobCom();
                }, 100);
            }
        });
        break;
}