// ==UserScript==
// @name         Gitlab submodule compare
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Clicking on submodule link opens comparison in new tab
// @author       Cáno
// @match        https://git.getprintbox.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/31707/Gitlab%20submodule%20compare.user.js
// @updateURL https://update.greasyfork.org/scripts/31707/Gitlab%20submodule%20compare.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //return;
    setInterval(function() {
        $('.file-title-name > .commit-sha').each(function() {
            var parent = $(this);
            var n = parent.closest('.diff-file').find('.line_content.parallel:not(.old) > span').html();
            var o = parent.closest('.diff-file').find('.line_content.parallel.old > span').html();
            var a = parent.prev().find('a');
            if (a.attr('done') !== 'true') {
                a.attr('href', a.attr('href') + '/compare/' + o + '...' + n);
            }
            a.attr('done', true);
        });
    }, 1600);
})();