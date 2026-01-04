// ==UserScript==
// @name         Torn - Less Cluttered Forums
// @author       Xiphias[187717]
// @namespace    https://greasyfork.org/users/3898
// @version      1.0
// @include      *torn.com/forums.php*
// @description  try to take over the world!
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368963/Torn%20-%20Less%20Cluttered%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/368963/Torn%20-%20Less%20Cluttered%20Forums.meta.js
// ==/UserScript==

$( document ).ajaxComplete(function( event, xhr, settings ) {
    if ( settings.url.search(/forums.php.*/) === 0) {
        var forum_header = $('.forums-committee');

        var header_rating = forum_header.find('.rating');
        var header_rating_width = header_rating.outerWidth();

        var header_thread_name = forum_header.find('.thread-name');

        var header_thread_name_width = header_thread_name.width();
        header_thread_name.width(header_thread_name_width + header_rating_width);


        // Remove ratings on main forum page
        header_rating.remove();
        $('.threads-list').find('.rating').remove();

        if (settings.data.search('&f=19&') < 0) { // If not bugs forum
            $('.threads-list').find('> li').each(function() {
                var li = $(this);
                var thread_name = li.find('.thread-name');
                var thread_pages = li.find('.thread-pages');
                var new_max_width;
                if (thread_pages.length > 0) { // exists
                    thread_pages.removeClass('left');
                    thread_pages.addClass('right');
                    thread_pages.css('margin-right', '10px');
                    new_max_width = 400 - thread_pages.outerWidth() + 'px';
                } else {
                    new_max_width = '400px';
                }
                thread_name.css('max-width', new_max_width);

            });
        }

        if (settings.data.search('&f=19&') >= 0) { // Is bugs forum
            $('.threads-list').find('> li').each(function() {
                var li = $(this);
                var thread_name = li.find('.thread-name');
                var thread_pages = li.find('.thread-pages');
                var new_max_width;
                if (thread_pages.length > 0) { // exists
                    thread_pages.removeClass('left');
                    thread_pages.addClass('right');
                    thread_pages.css('margin-right', '8px');
                    new_max_width = 300 - thread_pages.outerWidth() + 'px';
                } else {
                    new_max_width = '300px';
                }
                thread_name.css('max-width', new_max_width);

            });
        }



        // remove rating values
        $('.like.forum-button').find('.value').remove();
        $('.dislike.forum-button').find('.value').remove();

        // remove rating dashboard on main forum
        var dashboard_rating = $('.dashboard.rating');
        var karma_rating_text = dashboard_rating.find('.title-black').html();
        if(typeof karma_rating_text !== 'undefined') {
            karma_rating_text = karma_rating_text.replace(/Karma Rating/g, 'Post Count');
            dashboard_rating.find('.title-black').html(karma_rating_text);
            dashboard_rating.find('.rating').remove();
        }

        // change feed
        var feed = $('#feed-threads');
        var fm_list = feed.find('.panel.fm-list');

        fm_list.find('.like-icon').remove();
        fm_list.find('.dislike-icon').remove();

        var feedbacks = fm_list.find('.post-wrap');
        feedbacks.each(function() {
            var feedback_text = $(this).html();

            feedback_text = feedback_text.replace(/(dis)?liked your post/g, 'reacted to your post');
            $(this).html(feedback_text);
        });

        // Popular threads
        var popular_threads = $('#pop-threads');
        if(typeof popular_threads !== 'undefined') {
            popular_threads.find('.like-wrap').remove();
            popular_threads.find('.dislike-wrap').remove();
        }

        var poster_wrap_left = $('.poster-wrap.left');
        poster_wrap_left.find('.karma').remove();

    }
});