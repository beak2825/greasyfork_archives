// ==UserScript==
// @name         一番上へボタン for Twitter Moments
// @namespace    http://lyna.space/
// @version      0.5
// @description  Twitterのモーメント編集画面に「ツイートを一番上に移動するボタン（⏫）」を追加します。
// @author       Lyna
// @match        https://twitter.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @license      CC0-1.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375556/%E4%B8%80%E7%95%AA%E4%B8%8A%E3%81%B8%E3%83%9C%E3%82%BF%E3%83%B3%20for%20Twitter%20Moments.user.js
// @updateURL https://update.greasyfork.org/scripts/375556/%E4%B8%80%E7%95%AA%E4%B8%8A%E3%81%B8%E3%83%9C%E3%82%BF%E3%83%B3%20for%20Twitter%20Moments.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
(function($) {
    'use strict';

    function addButton(capsule) {
        if (capsule.find('.MomentMakerActionButtons-button--top').length != 0) return;
        var buttonUp = capsule.find('.MomentMakerActionButtons-button--up');
        if (buttonUp.length == 0) return;
        var buttonTop = document.createElement('button');
        buttonTop.type = 'button';
        buttonTop.className = 'MomentMakerActionButtons-button MomentMakerActionButtons-button--top js-tooltip';
        buttonTop.setAttribute('data-original-title', '一番上へ');
        $(buttonTop).append('<svg width="18px" height="18px"><path d="M9 9 L0 9 L9 2 L18 9 L9 9 L18 16 L0 16 Z" style="fill:#aab8c2"/></svg>');
        $(document).on('click', '.MomentMakerActionButtons-button--top', function(e) {
            var topCapsule = $('.MomentCapsuleItem').first();
            var currentCapsule = $(e.target).closest('.MomentCapsuleItem');
            if (topCapsule.is(currentCapsule)) return;
            $.post(location.href + '/reorder', {
                authenticity_token: $('#authenticity_token').val(),
                moment_id: location.pathname.split('/').pop(),
                tweet_id: currentCapsule.attr('data-tweet-id'),
                relative_tweet_id: topCapsule.attr('data-tweet-id'),
                above: true
            });
            currentCapsule.insertBefore(topCapsule);
        });
        $(buttonTop).insertBefore(buttonUp.get(0));
    };

    $('.MomentCapsuleItem').each(function() {
        addButton($(this));
    });

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                var capsule = $(node).closest('.MomentCapsuleItem');
                if (capsule.length > 0) {
                    addButton(capsule);
                } else {
                    $(node).find('.MomentCapsuleItem').each(function() {
                        addButton($(this));
                    });
                }
            });
        });
    });
    observer.observe($('body').get(0), {childList: true, subtree: true});
})(jQuery);