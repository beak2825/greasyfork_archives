// ==UserScript==
// @name         GDQ Schedule Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gamesdonequick.com/schedule
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/31092/GDQ%20Schedule%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/31092/GDQ%20Schedule%20Highlighter.meta.js
// ==/UserScript==
/*jshint multistr: true */

GM_addStyle ( "                                     \
.scheduled {                                   \
background-color:#a5d6a7; \
}                                               \
" );

(function() {
    'use strict';

    // Your code here...
    var config = GM_getValue("config", {});

    $("tr.second-row").append('<td><button style="float:right" class="schedule">Highlight</button></td>');
    $("#runTable tr").not(".second-row").not(".day-split").addClass("first-row");
    var i = 0;
    $("#runTable tr").not(".day-split").not(".first-row").each(function() {
        i++;
        $(this).attr("row-count", i);
        $(this).prev(".first-row").attr("row-count", i);
    });

    Object.keys(config).forEach(function(entry) {
        $("#runTable tr[row-count='" + entry + "']").addClass("scheduled");
    });

    $( "button.schedule" ).on( "click", function( event ) {
        if (config[$( event.target ).closest( "tr.second-row" ).attr("row-count")]){
            delete config[$( event.target ).closest( "tr.second-row" ).attr("row-count")];
        } else {
            config[$( event.target ).closest( "tr.second-row" ).attr("row-count")] = true;
        }
        $( event.target ).closest( "tr.second-row" ).toggleClass( "scheduled" );
        $( event.target ).closest( "tr.second-row" ).prev("tr.first-row").toggleClass( "scheduled" );
        GM_setValue("config", config);
    });
    $("tr.first-row").append('<td><button style="float:right;visibility: hidden;" class="schedule">Highlight</button></td>');
})();
