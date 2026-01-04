// ==UserScript==
// @name         F-ADVERTISERs!
// @version      1.0.1
// @description  Hide Facebook sponsored ad posts from advertisers, once and for all!
// @author       AdroitAdorKhan <mail@nayemador.com>
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @match        https://www.facebook.com/adpreferences/advertisers
// @grant        none
// @namespace https://greasyfork.org/users/905644
// @downloadURL https://update.greasyfork.org/scripts/443827/F-ADVERTISERs%21.user.js
// @updateURL https://update.greasyfork.org/scripts/443827/F-ADVERTISERs%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // sleep function
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }
    // check if see more button is there
    const seeMoreButton = document.querySelectorAll('[aria-label="See more"]');
    if(seeMoreButton.length > 0) {
        document.querySelector('[aria-label="See more"]').click();
    } else {
        //alert("NO MORE ADS FOR NOW!");
    }
    // sleep 1s before hiding ads
    sleep(1000).then(() => {
        // count total hide ads available
        const totalHideAdsButtons = document.querySelectorAll('[aria-label="Hide Ads"]').length;
        // declare sleep time checking hide ads button count
        let sleepTime=60000;
        let sleepTimeS = 0;
        if(totalHideAdsButtons > 5) {
            sleepTime=5000;
            sleepTimeS=5;
        } else if(totalHideAdsButtons > 2) {
            sleepTime=10000;
            sleepTimeS=10;
        } else {
            sleepTime=60000;
            sleepTimeS=60;
        }
        // output
        //document.getElementsByTagName('h1')[0].innerHTML = '<hr><span style="color:blue;">FAD HIDE! <span style="position:absolute;top:8px;right:188px;padding:4px 8px;border-radius:50%;background:red;color:white;font-size:12px">' + totalHideAdsButtons + '</span> </span><br><code style="font-size:10px;">' + totalHideAdsButtons + ' New Ad(s) Hidden - Refreshing in ' + sleepTime + 'ms</code><hr><br> Ad Preferences';
        if(totalHideAdsButtons > 0) {
            (document.querySelector('[href="/adpreferences/advertisers/?hide_left_rail=false&section=hidden_advertisers"]')).parentElement.insertAdjacentHTML('beforebegin', '<hr><div style="padding: 8px 25px 8px ;"><h1 style="font-size: 1.0625rem;"><i style="color:blue;font-weight: bold;">F-ADVERTISERs!</i> - <span style="color:green;font-size: 0.7rem;">✔️ FILTERING</span></h1> » <code style="font-size: 0.6rem;">' + totalHideAdsButtons + ' New Advertiser(s) Hidden. <br> » Re-checking in ' + sleepTimeS + ' seconds...</code></div><hr>');
        } else {
            (document.querySelector('[href="/adpreferences/advertisers/?hide_left_rail=false&section=hidden_advertisers"]')).parentElement.insertAdjacentHTML('beforebegin', '<hr><div style="padding: 8px 25px 8px ;"><h1 style="font-size: 1.0625rem;"><i style="color:blue;font-weight: bold;">F-ADVERTISERs!</i> - <span style="color:green;font-size: 0.7rem;">✔️ FILTERING</span></h1> » <code style="font-size: 0.6rem;">Great! No New Advertiser found this session. <br> » Re-checking in ' + sleepTimeS + ' seconds...</code></div><hr>');
        }
        // click hide ads button function
        document.querySelectorAll('[aria-label="Hide Ads"]').forEach(function(hideAdsButton) {
            // element refers to the DOM node
            hideAdsButton.click();
        });
    // reload the page depending on sleep time
    setTimeout(function() {
        location.reload();
    }, sleepTime);
   // end sleep wait
   });
// end
})();