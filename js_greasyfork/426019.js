// ==UserScript==
// @name         Twitch Drop Claim
// @namespace    https://www.twitch.tv/
// @version      1.1
// @description  Clicks claim on drops.
// @author       Vaccaria
// @match        https://www.twitch.tv/drops/inventory
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/426019/Twitch%20Drop%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/426019/Twitch%20Drop%20Claim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, false);

    var path = location.pathname;
    switch (true) {
        case path.includes('/inventory'):
            var checkExist = setInterval(function() {
                if ($('.inventory-max-width').length) {
                    if(!$('*[data-test-selector="DropsCampaignInProgressRewardPresentation-claim-button"]').length){
                        clearInterval(checkExist);
                    }
                    var favoriteBtn = document.querySelector (
                        '*[data-test-selector="DropsCampaignInProgressRewardPresentation-claim-button"]'
                    );
                    favoriteBtn.dispatchEvent (clickEvent);
                    console.log("click");
                    clearInterval(checkExist);
                }
            }, 100);
            break;
    }
})();