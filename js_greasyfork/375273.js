// ==UserScript==
// @name         eBay short URL
// @namespace    graphen
// @version      1.2.1
// @description  Replaces long url by short url.
// @author       Ariel Jannai, graphen
// @include      /^https:\/\/www\.(be(fr|nl)\.)?ebay\.(at|ca|cn|vn|ie|it|nl|ph|pl|es|ch|de|fr|be|co\.(uk|th)|com(\.(au|hk|my|sg|tw))?)\/itm\/.*/
// @run-at       document-end
// @icon         https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/ebay-128.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/375273/eBay%20short%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/375273/eBay%20short%20URL.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function(){
    'use strict';

    function tryShortUrl(url) {
        var urlPattern = /(be(fr|nl)\.)?ebay\.(at|ca|cn|vn|ie|it|nl|ph|pl|es|ch|de|fr|be|co\.(uk|th)|com(\.(au|hk|my|sg|tw))?)\/itm\//;

        if(urlPattern.test(url)) {
            var itmId = url.match(/\/(\d{12})(\?|$)/)[1];
            return 'https://www.' + urlPattern.exec(url)[0] + itmId;
        } else {
            return url;
        }
    }

    var url = String(window.location.href);
    history.replaceState(null, 'Shortened Ebay URL', tryShortUrl(url));

})();
