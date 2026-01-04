// ==UserScript==
// @name         AnsaPayWallRemoval
// @namespace    http://urgay.net/
// @version      0.1
// @description  Ansa paywall removal tool
// @author       MarkIF
// @match        https://www.ansa.it/*
// @icon         https://www.google.com/s2/favicons?domain=ansa.it
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/437079/AnsaPayWallRemoval.user.js
// @updateURL https://update.greasyfork.org/scripts/437079/AnsaPayWallRemoval.meta.js
// ==/UserScript==

$(function(){
    $("#piano-container").remove();
    $(".news-txt > p").each(function(){
        $(this).removeAttr("hidden");
    });
});


