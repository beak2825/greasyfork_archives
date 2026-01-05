// ==UserScript==
// @name         Wicked Pictures Additions
// @description  New feature: mark as watched
// @namespace    https://www.pierreyves.io/
// @version      1.0
// @author       Pierre-Yves Lebecq
// @license      MIT
// @match        http://ma.wicked.com/watch/*
// @grant        none
// @require      http://code.jquery.com/jquery-2.0.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/12563/Wicked%20Pictures%20Additions.user.js
// @updateURL https://update.greasyfork.org/scripts/12563/Wicked%20Pictures%20Additions.meta.js
// ==/UserScript==

var _$ = jQuery.noConflict(true);

(function ($) {
    var $favoriteButton = $('.favorite').eq(0);
    var viewUrl = $('#player').data('view-url');
    
    // Add "Mark as watched" button.
    $favoriteButton.after('<li class="player-box-menu-li favorite"><a href="#" id="markAsWatched" class="favorites primary-btn" title="Mark as watched" data-url="'+viewUrl+'"><span class="btn-label">Mark as watched</span></a></li>');
    // Bind event listener to "Mark as Watched" button.
    var $markAsWatchedButton = $('#markAsWatched');
    $markAsWatchedButton.on('click', function (e) {
        e.preventDefault();
        
        var $this = $(this);

        $.ajax({
            type: "POST",
            url: $(this).data('url'),
        }).done(function (result) {
            if (result.success) {
                $this.addClass('active');
            }
        });
    });
})(_$);
