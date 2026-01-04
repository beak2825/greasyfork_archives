// ==UserScript==
// @name           Amazon short URL
// @namespace      graphen
// @version        4.2.0
// @description    Replace article URL with short Amazon permalink
// @author         Graphen
// @include        /^https?:\/\/www\.amazon\.(cn|in|sg|ae|fr|de|pl|it|nl|es|ca|se|com(\.(mx|au|br|tr|be))?|co\.(uk|jp))\/.*(dp|gp\/(product|video)|exec\/obidos\/ASIN|o\/ASIN)\/.*$/
// @icon           https://www.amazon.com/favicon.ico
// @noframes
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/33227/Amazon%20short%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/33227/Amazon%20short%20URL.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function (doc) {
    'use strict';

    function getAsin(){
        let asinId = doc.getElementById('ASIN');

        if (asinId && asinId.value.length === 10) {
            return asinId.value;
        }
        else {
            // Get ASIN from canonical link
            let links = doc.getElementsByTagName('link');

            let i;
            for (i=0; i < links.length; i++) {

                if (links[i].rel === 'canonical') {

                    let canonical = links[i].href;
                    let asin = canonical.replace(/https?:\/\/www\.amazon\..*\/dp\/([\w]+)$/, '$1');

                    if (asin.length === 10) {
                        return asin;
                    }
                }
            }
        }
    }

    function replaceUrl() {
        let asin = getAsin();
        if (asin){
            history.replaceState(null, 'Amazon URL Cleaner', '/dp/' + asin + '/');
            //console.log("URL replaced by Amazon URL Cleaner. ASIN: " + asin);
        }
    }
    replaceUrl();

    // Execute again when item variation is selected
    var buyboxParent = doc.getElementById('desktop_buybox');
    if (buyboxParent) {
        var MO = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(nodeElement) {
                    if (nodeElement.id === "buybox") {
                        replaceUrl();
                    }
                });
            });
        });
        MO.observe(buyboxParent, { childList: true, subtree: true });
    }

    // Clear dynamically added URL parameters
    function checkUrlParameters(){
        if(window.location.search !== '') {
            window.history.replaceState(window.history.state, "", window.location.origin + window.location.pathname);
        }
    }
    setInterval(checkUrlParameters, 1000);

}) (document);
