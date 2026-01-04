// ==UserScript==
// @name         Facebook's fbclid Killer
// @namespace    https://driftkingtw.me/
// @version      0.1.1
// @description  Get rid of Facebook's fbclid tracking
// @author       DriftKingTW
// @match        https://www.facebook.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/382875/Facebook%27s%20fbclid%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/382875/Facebook%27s%20fbclid%20Killer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).on("click", 'a', function(event){
        var fbLink = this.href;
        var index = fbLink.search(/fbclid/);
        if(index != -1){
            var originalLink = fbLink.substring(0, index);
            this.href = originalLink;
        }
    });

})();