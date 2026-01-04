// ==UserScript==
// @name         CleanAff
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  clean hostloc aff
// @author       Golang
// @include      /https://www.hostloc.com/thread/
// @require       https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/394868/CleanAff.user.js
// @updateURL https://update.greasyfork.org/scripts/394868/CleanAff.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $('a').each((i, e) => {
        let href = $(e).attr('href')
        if (href) {
            if (href.indexOf('aff=') > -1) {
                $(e).attr('href', href.replace(/(aff=)\d+/, '$1-1'))
                $(e).text(href.replace(/(aff=)\d+/, '$1-1'))
            } else if (href.indexOf('ref=') > -1) {
                $(e).attr('href', href.replace(/(ref=)\d+/, '$1-1'))
                $(e).text(href.replace(/(ref=)\d+/, '$1-1'))
            }

        }

    })
})();