// ==UserScript==
// @name Toggle Messenger Sidebar
// @namespace http://jamesswandale.com/
// @version 0.2
// @description Button to hide messengers list of conversations
// @match https://www.messenger.com/*
// @copyright 2015+, James Swandale
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/14192/Toggle%20Messenger%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/14192/Toggle%20Messenger%20Sidebar.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('body').append('<input type="button" value="Hide Sidebar" id="showHideButton" style="background-color:#292929; color:#FFFFFF;">');
    $("#showHideButton").css({"position":"fixed", "top":15, "left":60, "z-index":1000, "border-style":"solid", "border-width":"2px", "border-color":"#3C3C3C"});
    $("#showHideButton").click(function(){
        var convThreads = document.getElementsByClassName("_1enh")[0];
        if(convThreads.style.display == 'none'){
            convThreads.style.display = 'block';
            showHideButton.value = "Hide Sidebar";
        }else {
            convThreads.style.display = 'none';
            showHideButton.value = "Show Sidebar";
        }
    });
});