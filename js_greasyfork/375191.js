// ==UserScript==
// @name         Kibana resize
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  important: update matching url in the script. Script adds input fields for column width. Empty field resets width to auto.
// @author       nemanjabu
// @match        https://kibana-lon.brisqq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375191/Kibana%20resize.user.js
// @updateURL https://update.greasyfork.org/scripts/375191/Kibana%20resize.meta.js
// ==/UserScript==
console.log('Kibana resize');
waitFor(() => window.$, 300, 10, function($) {
    waitFor(() => $('.kbn-table').length, 300, 10, function () {
        $('.kbn-table th').each((i, thEl) => {
            var th = $(thEl);
            var input = $('<input type="number" size="3" min="0" max="999"/>').on('keyup', function () {
                if (this.value.length >= 2) {
                    th.width(this.value);
                } else if (!this.value) {
                    th.width(this.value);
                }
            });
            th.append(input);
        });
    });
});

function waitFor(handler, interval, repeats, callback) {
    var res;
    if (res = handler()) {
        callback(res);
    } else {
        if (repeats > 0) {
            setTimeout(function() {
                waitFor(handler, interval, repeats--, callback);
            }, interval);
        } else {
            console.log('Wait failed');
        }
    }
}