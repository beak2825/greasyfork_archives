// ==UserScript==
// @name         Mobile01 pager icon
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add 'prev page/next page' icon.
// @author       You
// @match        https://www.mobile01.com/topicdetail.php?*
// @grant        GM_addStyle

// @require http://code.jquery.com/jquery-3.4.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/389278/Mobile01%20pager%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/389278/Mobile01%20pager%20icon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.m01_pager { font-size:5em; width:70pt; text-align:center; border-radius:10%; position:fixed; background:#aaa; opacity:.5; } \
      .m01_next {top:40%; right:10%;} \
      .m01_prev {top:40%; left:10%;} \
      .m01_pager a {color:#fff; display:block; font-family:"Webdings"} \
      .hover {opacity:0.9;} \
    ');
//      .m01_pager a {color:#fff; display:block; font-family:"Wingdings 3"} \

    // Your code here...
    var prev = $("li.l-pagination__page.is-active").prev()[0];
    var next = $("li.l-pagination__page.is-active").next()[0];
    var prev_url, next_url;
    var prev_html = "<div class='m01_pager m01_prev'>" +
        "<a href>3</span></div>";
    var next_html = "<div class='m01_pager m01_next'>" +
        "<a href>4</span></div>";

    prev_url = prev ? $('a', prev).attr('href') : "";
    next_url = next ? $('a', next).attr('href') : "";

    console.log(prev,next);
    console.log('prev_url = ' + prev_url);
    console.log('next_url = ' + next_url);

    if (prev_url != "")
    {
        var prev_icon = $(prev_html);
        $('a', prev_icon).attr("href", prev_url).attr("title", $('a', prev).attr('data-page'));
        $(prev_icon).appendTo("body");
    }

    if (next_url != "")
    {
        var next_icon = $(next_html);
        $('a', next_icon).attr("href", next_url).attr("title", $('a', next).attr('data-page'));
        $(next_icon).appendTo("body");
    }

    $(".m01_pager").hover(function(){ $(this).toggleClass('hover');}, function(){$(this).toggleClass('hover');});
})();