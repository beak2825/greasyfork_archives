// ==UserScript==
// @name         Bring Back [Shift + Enter]
// @namespace    pxgamer
// @version      0.3
// @description  Adds the old post method to post boxes (Shift + Enter)
// @author       pxgamer
// @include      *kat.cr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19978/Bring%20Back%20%5BShift%20%2B%20Enter%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/19978/Bring%20Back%20%5BShift%20%2B%20Enter%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var arrShortCut = [{ name: 'Post', key: 13, fx: 'post' }];

    var shift = 16; // SHIFT Key
    var shiftKeyActived = false;
    var ta = $('.quicksubmit');
    var isBBaction = false;
    var postAction = false;

    $(document).keyup(function(e) {
        if (e.which == shift) shiftKeyActived = false;
    }).keydown(function(e) {
        if (e.which == shift) shiftKeyActived = true;
        if (shiftKeyActived === true && ta.is(":focus")) {
            jQuery.each(arrShortCut, function(i) {
                if (arrShortCut[i].key == e.which) {
                    exec(arrShortCut[i].fx, ta);
                    return;
                }
            });
        }
    });

    function exec(fx, ta) {
        console.info(fx);
        switch (fx) {
            case 'post':
                isBBaction = false;
                postAction = true;
                break;
            default:
                isBBaction = false;
                postAction = false;
        }
        if (postAction === true) {
            $('form[action^="/community/post/"] div.buttonsline button.siteButton.bigButton[type="submit"]').click();
        }
        postAction = false;
        shiftKeyActived = false;
    }
})();
