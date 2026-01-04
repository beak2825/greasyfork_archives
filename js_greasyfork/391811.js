// ==UserScript==
// @name         Compact Discussions
// @namespace    http://www.mattmorrison.co.uk/
// @version      0.1
// @description  At-a-glance discussions without all the bumf
// @author       Matt Morrison
// @match        https://www.apterous.org/index.php
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391811/Compact%20Discussions.user.js
// @updateURL https://update.greasyfork.org/scripts/391811/Compact%20Discussions.meta.js
// ==/UserScript==

(function($) {

    $news = $("div.news_tickets");
    $tickets = $news.find("div.fp_discussion");

    $tickets.each(function(){

        var $t = $(this);

        $authorBlock = $t.find("p.ticketby");
        $authorLink = $authorBlock.find("a");

        $title = $t.find("h3");
        $votes = $t.find("p.ticket_voting");

        // restyle and move author link
        var authorStyle = {
            fontWeight: "normal",
            fontSize: "11px",
            marginLeft: "5px"
        };
        $author = $("<span>").css(authorStyle).html($authorLink).appendTo($title);

        // hide bumf
        $authorBlock.next("p").hide();
        $authorBlock.remove();

        // improve spacing
        $title.attr("style","margin: 0 !important");
        $votes.css("margin-top",0);

    });

    // add toggle
    $header = $news.find("h2.news-header");

    var toggleStyle = {
        float: "right",
        cursor: "pointer",
        fontSize: "13px",
        textTransform: "uppercase",
        fontWeight: "normal"
    }

    $toggle = $("<a>").css(toggleStyle).text("toggle previews").appendTo($header);
    $toggle.on("click",function(e){
        e.preventDefault();
        $tickets.find("p:not(.ticket_voting)").toggle();
    })

})(jQuery);