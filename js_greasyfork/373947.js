// ==UserScript==
// @name         Auto dismiss suggested posts
// @namespace    https://greasyfork.org/users/65414
// @version      0.1
// @description  Dismisses suggested posts automatically when scrolling past them
// @match        https://www.tumblr.com/dashboard*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373947/Auto%20dismiss%20suggested%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/373947/Auto%20dismiss%20suggested%20posts.meta.js
// ==/UserScript==

(function($){
    $(window).scroll(function(){
        var top = $(window).scrollTop(),
            postBottom = $('.post_dismiss').parents().eq(5).offset().top + $('.post_dismiss').parents().eq(5).outerHeight() + 300;
        if (postBottom < top) {
            $('.post_dismiss').children().last()[0].click()
        }
    });
})(jQuery);