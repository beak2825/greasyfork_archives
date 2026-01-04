// ==UserScript==
// @name         Polaris portal URL converter
// @namespace    https://lego.binginternal.com/polaris
// @version      1.0
// @description  Convert non-clickable URL texts on the portal to links
// @match        https://lego.binginternal.com/polaris/jobs/*
// @match        https://lego/polaris/jobs/*
// @downloadURL https://update.greasyfork.org/scripts/439108/Polaris%20portal%20URL%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/439108/Polaris%20portal%20URL%20converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        $('div.tab-pane td').each(function(e, i) {
            var this$ = $(this);
            this$.html(this$.html().split(',').map(q => {
                if (/^https:\/\/cosmos\d+.osdinfra.net\/cosmos\//i.test(q)) {
                    var cosmosLink = q.replace(/^https:\/\/cosmos(\d+).osdinfra.net\/cosmos\//i, 'https://www.cosmos$1.osdinfra.net/cosmos/');
                    if (!cosmosLink.endsWith('?property=info')) {
                        cosmosLink = cosmosLink + '?property=info';
                    }
                    return '<a href="' + cosmosLink + '" target="_blank">' + q + '</a>';
                } else if (/^hdfs:\/\/namenode\d-.?vip.mtprime-prod-[^.]+.[^.]+.ap.gbl\//i.test(q)) {
                    var h = q.match(/^hdfs:\/\/namenode(\d)-.?vip.mtprime-prod-([^.]+).[^.]+.ap.gbl\/(.*)/i);
                    var hdfsLink = 'https://magnetar/httpfs.html?subCluster=MTPrime-PROD-' + h[2].toUpperCase() + '-' + h[1] + '#/MTPrime-' + h[2].toUpperCase() + '-' + h[1] + '/' + h[3];
                    return '<a href="' + hdfsLink + '" target="_blank">' + q + '</a>';
                } else if (/^https?:\/\//i.test(q)) {
                    return '<a href="' + q + '" target="_blank">' + q + '</a>';
                } else {
                    return q;
                }
            }).join(','));
        });
    });
})();
