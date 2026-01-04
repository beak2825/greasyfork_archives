// ==UserScript==
// @name         Golem.de: Multipage article on one page
// @namespace    ksjdhksjdhkjsdhksjdhkjsdh
// @version      0.1
// @description  Shows all pages of multi page articles on a single page.
// @match        https://www.golem.de/
// @match        https://www.golem.de/news/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/430491/Golemde%3A%20Multipage%20article%20on%20one%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/430491/Golemde%3A%20Multipage%20article%20on%20one%20page.meta.js
// ==/UserScript==

// Based on the script "Simple Golem" by sascha_

if ( $( "ol.list-pages" ).length ) {
    var urls = [];

    //get the urls from the a href of each li
    $( "ol.list-pages" ).children().each(function(){
        urls.push($(this).find('a').attr('href'));
    });

    //The last link is next page, is not needed again
    urls.pop();
    for (var i = 0; i < urls.length; i++) {
        var divid = "plugin-page-" + i;
        //append a new div
        $("div.formatted").append('<div id="' + divid + '"></div>');

        //load the content of the page's article into the fresh div
        $('#' + divid).load(urls[i] + ' div.formatted', function(data) {
            var scripts = $(data).find("script");

            if (scripts.length) {
                $(scripts).each(function() {
                if ($(this).attr("src")) {
                    $.getScript($(this).attr("src"));
                }
                else {
                    eval($(this).html());
                }
            });
    }

});
    }
}

$('.gvideofig').remove();

// Remove the multi page navigation
$("ol.list-pages").remove();
$("#table-jtoc").remove();
