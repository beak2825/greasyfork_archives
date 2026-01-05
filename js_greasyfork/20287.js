// ==UserScript==
// @name         Script Duplicate Highlighter
// @namespace    pxgamer
// @version      0.3.1
// @description  Highlight duplicated @descriptions/@name in the list all scripts thread. [For Boba_Fett]
// @author       pxgamer
// @include      *kat.cr/community/show/list-all-scripts-themes-made-our-site-members/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20287/Script%20Duplicate%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/20287/Script%20Duplicate%20Highlighter.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    let duplicates = [];
    let ssScript = /[a-z0-9]+ - [a-z0-9]+/ig;

    let dl = $('div[id="post17719419"] .commentbody div[id^="content_"]').text().split('\n');
    for (let i = 0; i < dl.length; i++) {
        let title = dl[i].split(' - ')[0];
        let descr = dl[i].split(' - ')[1];
        if (typeof descr !== 'undefined' && title !== '') {
            duplicates.push({
                title: title,
                descr: descr
            });
        }
    }

    for (i = 0; i < duplicates.length; i++) {
        if (duplicates[i].title.toLowerCase() == duplicates[i].descr.toLowerCase()) {
            console.info(duplicates[i]);
        }
    }
})();
