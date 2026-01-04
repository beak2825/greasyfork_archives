// ==UserScript==
// @name         B站高度
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自動跳到看影片舒服的高度
// @author       You
// @match        https://www.bilibili.com/video/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/541990/B%E7%AB%99%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/541990/B%E7%AB%99%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==
(function() {

    const lastMatchingElement = $('div.player-wrap');
    var changeButtonHtml3 = '<input type="button" value="高度" ' +
        'style="position: fixed; top: 100px; left: 83px; z-index: 9999;line-height: 30px;font-size: 25px; ">';
    jQuery('body').append(changeButtonHtml3);
    jQuery('body').on('click', 'input[type="button"][value="高度"]', function() {
        $(window).scrollTop($(lastMatchingElement).offset().top-5);
    });
    
    const $video = $('video');
    const $target = $('div.player-wrap');

    function scrollToTarget() {
        if ($target.length) {
            $(window).scrollTop($target.offset().top - 5);
        }
    }

    if ($video.length) {
        const observer = new MutationObserver(function(mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    scrollToTarget();
                }
            }
        });

        observer.observe($video[0], {
            attributes: true,
            attributeFilter: ['src']
        });
        $video.on('play', function() {
            scrollToTarget();
        });

    } 
    scrollToTarget();
})();


