// ==UserScript==
// @name         ALBot
// @namespace    https://samyok.us/
// @version      0.3.1
// @description  try to take over the albert.io world!
// @author       You
// @match        https://www.albert.io/*
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
// @resource customCSS  https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/381308/ALBot.user.js
// @updateURL https://update.greasyfork.org/scripts/381308/ALBot.meta.js
// ==/UserScript==
/*global $ toastr*/
const newCSS = GM_getResourceText("customCSS");
GM_addStyle(newCSS);
(function() {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    'use strict';
    setTimeout(startBot, 5000);
})();
function startBot() {
    $.get("https://auctioneer.hqknight.online/ping", data=>{
        if(!data.online) return false;
        $(".assignment-stage__footer-content").find("button").text("CONTINUE").click(()=>{
            setTimeout(addButton, 1000);
        });
    });
}
function addButton(){
    $("<button class='sg-button'>Answer</button>").appendTo(".ie-stats-wrapper").click(()=>{
        let question = $(".markdown-renderer-v2.mcq__question-content").text();
        console.log(question);
        $.get("https://auctioneer.hqknight.online/?username=" + $(".global-nav__username").text() + "&q=" + question, data => {
            console.log(data);
            toastr.success(data.answer, "Answer");
        })
    });
}