// ==UserScript==
// @name         Wantedly Follow
// @namespace    https://greasyfork.org/ja/users/61980-kuma
// @version      0.2.3
// @description  try to take over the world!
// @author       kuma
// @match        https://www.wantedly.com/*
// @exclude      https://www.wantedly.com/user/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/22661/Wantedly%20Follow.user.js
// @updateURL https://update.greasyfork.org/scripts/22661/Wantedly%20Follow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function() {
        var selector = [
            '.follow-button:visible:not(.disabled, .following, .post-company-follow-button-wrapper, [role=presentation])',
            '.post-company-follow-button:not(.disabled, .following)'
        ].join(',');
        var num = $(selector).length;
        var text = '';
        function start() {
            text = num ? 'Follow: ' + num : '';
            if (num) {
                $(selector)[0].click();
                $('#wantedlyFollow').text('Follow: ' + num);
            }
            setTimeout(start, 1000 * (Math.random() * 2 + 4));
        }
        function count() {
          num = $(selector).length;
          text = num ? 'Unfollow: ' + num : '';
          $('#wantedlyFollow').text(text);
          setTimeout(count, 1300);
        }
        $('body').append('<div id="wantedlyFollow" style="font-size:50px;color:olive;position:fixed;top:100px;left:150px;z-index:9999999;"></div>');
        start();
        count();
    });
})();
