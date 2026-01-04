// ==UserScript==
// @name        AD Hider - kissanime.ru
// @namespace   Violentmonkey Scripts
// @match       https://kissanime.ru/Anime/*
// @grant       none
// @version     1.0
// @author      Qther
// @description 6/6/2020, 8:28:47 PM
// @downloadURL https://update.greasyfork.org/scripts/404818/AD%20Hider%20-%20kissanimeru.user.js
// @updateURL https://update.greasyfork.org/scripts/404818/AD%20Hider%20-%20kissanimeru.meta.js
// ==/UserScript==

var observer = new MutationObserver(function(mutations) {
    if ($(".divCloseBut").length) {
        console.log("Found it");
        for (i = 0; i < document.getElementsByClassName("divCloseBut").length; i++) {
            document.getElementsByClassName("divCloseBut").item(0).children.item(0).click();
        }
    }
});

// Start observing
observer.observe(document.body, { 
    childList: true, 
    subtree: true 
});
            
$(document).ready(function() {
    $("button").on("click", function() {
        $(".divCloseBut").remove();
        setTimeout(function() {
            $("#newContent").append("<p>New element</p>");
        }, 1000);
    });
});
  