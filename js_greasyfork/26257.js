// ==UserScript==
// @name         Answers.com, no slideshow please!
// @namespace    http://dieterholvoet.com
// @version      1.0
// @description  Replaces the annoying slideshows on Answer.com questions with a simple card.
// @author       Dieter Holvoet
// @match        www.answers.com/Q/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26257/Answerscom%2C%20no%20slideshow%20please%21.user.js
// @updateURL https://update.greasyfork.org/scripts/26257/Answerscom%2C%20no%20slideshow%20please%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // HELPER
    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    // Variables
    var $container = $('<div class="module feedcards_wikilite"></div>'),
        $slideshow = $("#center_top > .question_slideshow .article_slides.current_article"),
        $slides = $slideshow.find(".slide");

    // Get content
    var title = $slideshow.find(".question_detail").data("title"),
        content = "";

    $slides.each(function() {
        var find = ["click on the link", "see answer"],
            text = $(this).text().trim();

        if(!find.some(function(v) {return text.toLowerCase().indexOf(v) >= 0;}))
            content += text+" ";
    });

    // Append new card
    $container.insertAfter("#center_top .breadcrumb_category");
    $container.append('<div class="feedcard no_image no_avatar" asg-card="gutenberg"><article class="frame"><section class="content"><h1 class="title">'+title+'</h1><div class="content_text" style="line-height: 1.6;">'+content.trim().capitalizeFirstLetter()+'</div></section></article></div>');

    // Remove slideshow
    $("#center_top .question_slideshow").remove();
})();