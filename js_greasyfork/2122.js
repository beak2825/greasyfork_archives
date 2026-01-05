// ==UserScript==
// @name            Weibo Lite (无干扰新浪微博)
// @namespace       https://github.com/adelabs
// @description     Clear the ads and add a toggle button to hide/show bottom bar and side bars.
// @version         2.1.1
// @license         GPL version 3
// @include         *://weibo.com/*
// @require         http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/2122/Weibo%20Lite%20%28%E6%97%A0%E5%B9%B2%E6%89%B0%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/2122/Weibo%20Lite%20%28%E6%97%A0%E5%B9%B2%E6%89%B0%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%29.meta.js
// ==/UserScript==

// Add a button.
var button = $('<button></button>');
$('div.W_main_a').before(button.hide());
// Function the button.
var speed = 250;
button.text('hide').click(function(){
    var bars = $('div.W_main_l, div.W_main_r, div.global_footer');
    if (button.text() == 'hide') {
       bars.hide(speed, function(){button.text('show');});
    } else {
       bars.fadeIn(speed, function(){button.text('hide');});
    }
});
// Show the button and then toggle.
button.show(speed, function(){button.click();});

// Hide ads.
function hide_ads() {
    console.log('hide_ads');
    var ads = $([
        // Tips
        'div.layer_tips_version',
        // Header ads
        'div.pl_content_biztips',
        'div.tips_wrapper',
        'div.tips_player',
        'div.title_area',
        // Left side ads
        // Right side ads
        'div.adver_contB',
        'div#pl_rightmod_ads36',
        'div.M_activities',
        'div.M_abverArea',
        // Mid ads
        'div.W_no_border',
        'div.WB_feed_type[feedtype="ad"]',
        // Footer ads
        'div.footer_adv',
    ].join());
    ads.each(function(){
        if ($(this).css('display') == 'none') { return; }
        console.log('Hide', this);
        $(this).remove();
    });
}
// Observe and repeat
$([
   'body',
   'div.W_miniblog',
   'div.WB_feed',
].join()).each(function(i, o){
    var observer = new MutationObserver(function(mutations) {
        hide_ads();
    });
    observer.observe(o, {childList: true});
});
