// ==UserScript==
// @name         Google Search Result Domain Blocker
// @namespace    mailto:cunninghamelijahwork@gmail.com
// @version      0.1
// @description  This script blocks domains from your google search results.
// @author       cunninghamelijahwork@gmail.com
// @match        https://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408754/Google%20Search%20Result%20Domain%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/408754/Google%20Search%20Result%20Domain%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Load Filter
    let filter = {
        //'example.com' : true
    };

    //Cull Results
    let results = document.querySelectorAll('.rc');
    results.forEach((res)=>{
        //Get Domain
        let url = res.childNodes[0].childNodes[0].href;
        url = getDomain(url);

        if (filter[url]){
            res.parentNode.remove();
            console.log(`Filtered a result from: ${url}`);
        }
    });

    //Helper Functions
    function getDomain(url){
        url = url.slice( url.search('://')+3);
        url = url.slice(0, url.indexOf('/'));

        //Trim Subdomain
        if (url.split('.').length>2) {
            url = url.slice(url.indexOf('.')+1);
        }

        return url;
    }
})();