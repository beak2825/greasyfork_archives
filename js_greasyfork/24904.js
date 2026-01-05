// ==UserScript==
// @id twitterUnfollow.js
// @name TwitterUnfollow
// @description Quick Unfollow button for every tweet and mass unfollow button for the following page.
// @homepageURL https://github.com/mymizan/signal-to-noise
// @author M Yakub Mizan
// @version 1.0.0
// @date 2016-11-16
// @namespace http://mymizan.rocks/
// @include https://twitter.com/*
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-end
// @license MIT License
// @downloadURL https://update.greasyfork.org/scripts/24904/TwitterUnfollow.user.js
// @updateURL https://update.greasyfork.org/scripts/24904/TwitterUnfollow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function watchAjaxLoad()
    {
        $('.stream-item-header .quick_unfollow').remove();
        $('.stream-item-header').append('<a href="#" class="pull-right quick_unfollow"> Unfollow </a>');
        setTimeout( watchAjaxLoad, 300 );
    }
    watchAjaxLoad();
    $('.quick_unfollow').live('click', function(e){
        e.preventDefault();
        var save_context = this;
        $(this).parent().parent().parent().parent().hide();
        $.post('/i/user/unfollow',{authenticity_token: $('.authenticity_token').val(), challenges_passed: false, handles_challenges: 1, user_id: $('a', $(this).parent()).eq(0).attr('data-user-id')},function(data){
            $(save_context).parent().parent().parent().parent().remove();
        });
        $(this).parent().parent().parent().parent().remove();
    });
})();