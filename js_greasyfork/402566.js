// ==UserScript==
// @name         Hi10anime Downloads De-Redirector
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Converts data-href download links on hi10anime.com into normal href links, bypassing the ad site. Only works if at least 1 ad site link has the full download link.
// @author       tamchow
// @match        https://*.hi10anime.com/archives/*
// @connect      self
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/core.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/md5.min.js
// @downloadURL https://update.greasyfork.org/scripts/402566/Hi10anime%20Downloads%20De-Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/402566/Hi10anime%20Downloads%20De-Redirector.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

function MD5(d, sz) {
    return CryptoJS.MD5(d).toString().slice(0, sz === undefined || sz === null ? -1 : sz);
}

(function() {
    'use strict';

    /*global CryptoJS, $*/


    for	(const elem of document.querySelectorAll('a[data-href]')) {
        const link_regex = /https:\/\/.+(https:\/\/\w+\.hi10anime\.com.+$)/gm;
        const link = elem.dataset.href;
        const matches = link_regex.exec(link);
        if (matches && (matches.length > 1) && matches[1].length > 0) {
            // link_node.attributes.removeNamedItem('data-href');
            const clean_link = matches[1];
            const filename_start_index = clean_link.lastIndexOf('/') + 1
            const filename = clean_link.slice(filename_start_index, clean_link.length);

            /* start hi10anime.com token generation code */
            const random_string = Math.random().toString(36).substring(5);

            const jtoken = MD5(random_string, 5);
            const id = MD5(jtoken, 5);

            const new_clean_link = clean_link.split('?jtoken').shift() + `?jtoken=${jtoken}${id}`;
            /* end hi10anime.com token generation code */

            elem.dataset.href = new_clean_link;
        }
    }
})();