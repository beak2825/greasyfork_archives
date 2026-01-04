// ==UserScript==
// @name         Filter NOT Verified
// @namespace    none
// @version      1.0.0
// @description  'https://twitter.com/search*' にて認証済みアカウントを一掃します。フォローしているアカウントも無差別に消します。公式アカウント（黄色✓）も消します。
// @author       4ma9ry
// @match        https://twitter.com/search*
// @exclude      https://twitter.com/search?q=list*
// @icon         none
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487362/Filter%20NOT%20Verified.user.js
// @updateURL https://update.greasyfork.org/scripts/487362/Filter%20NOT%20Verified.meta.js
// ==/UserScript==


$(function() {

    var id = setInterval(function(){
        $('svg[data-testid="icon-verified"]').closest('article').remove();
    },1000 );

})();