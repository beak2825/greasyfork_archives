// ==UserScript==
// @name         ExpandSpoilers
// @namespace    http://slizg.eu/memberlist.php?mode=viewprofile&u=9686
// @version      0.1.2.1
// @description  Expand all spoilers on site
// @author       Miechu
// @match        http://slizg.eu/*
// @grant        none
// @run-at	 document-end
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/17122/ExpandSpoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/17122/ExpandSpoilers.meta.js
// ==/UserScript==


$(function(){
    $('#pagecontent table tbody tr td:nth-child(3).gensmall').append('<input type="button" id="expand-spoilers" value="Rozwin spoilery">');
    $('#expand-spoilers').on('click',function(){
        $('.quotecontent').each(function() {
            $(this).css("display", "");
            console.log($(this));
        });
    });
});