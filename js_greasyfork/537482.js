// ==UserScript==
// @name         janitorai I want to leave bypass
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Simply click on the link automatically for you when you want to click an external link
// @author       James
// @license      MIT
// @match        https://janitorai.com/external-link?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537482/janitorai%20I%20want%20to%20leave%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/537482/janitorai%20I%20want%20to%20leave%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';


    if(document.getElementsByClassName('chakra-button css-asuskz').length != 0){
        document.getElementsByClassName('chakra-button css-asuskz')[0].click();
    }

    let retries = 10;//Do it 10 time

    const intervalID = setInterval(_ => {
        if(document.getElementsByClassName('chakra-button css-asuskz').length != 0){
            document.getElementsByClassName('chakra-button css-asuskz')[0].click();
        }
        retries--;
        if(retries == 0) clearInterval(intervalID);//Stop the loop when 10 attemp tried
    }, 5000);//Try to click again after 5 second

})();