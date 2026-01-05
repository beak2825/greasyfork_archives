// ==UserScript==
// @name         Google Docs Wordcount
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.0.1
// @description  Adds a word counter to Google Docs
// @author       Croned
// @match        https://docs.google.com/document/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22057/Google%20Docs%20Wordcount.user.js
// @updateURL https://update.greasyfork.org/scripts/22057/Google%20Docs%20Wordcount.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var count = $(".kix-zoomdocumentplugin-outer").text().trim().replace(/\u00A0/g, " ").split(" ").length;
    var pages = $(".kix-page-content-wrapper").length;
    $("body").append("<div id='wordCount' style='position: fixed; width: 100%; left: 0px; bottom: 0px; height: 15px; background-color: #dcdcdc; z-index: 100; font-family: Arial; font-size: 12px; padding-top: 5px; padding-left: 5px; border-top: 1px solid #cccccc;'></div>");
    
    var setCount = function () {
        count = $(".kix-zoomdocumentplugin-outer").text().trim().replace(/\u00A0/g, " ").split(" ").length;
        pages = $(".kix-page-content-wrapper").length;
        $("#wordCount").text("Word Count: " + count + " | Pages: " + pages);
    };
    
    setCount();
    setInterval(setCount, 500);
    
})();