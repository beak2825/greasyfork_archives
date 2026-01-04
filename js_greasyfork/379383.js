// ==UserScript==
// @name         Auto comment Medals and Articles
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @match        https://www.erepublik.com/*
// @include	 https://www.erepublik.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379383/Auto%20comment%20Medals%20and%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/379383/Auto%20comment%20Medals%20and%20Articles.meta.js
// ==/UserScript==


(function() {

    // vote all medal posts
    $j('h6:contains("medal")').siblings('.post_actions').children("a:contains('Vote')").click()

    //$j('h6:contains("medal")').children(".reactionBtn").click();
    $j(".reactionBtn").click();

    // vote all comments in articles
   // $j('li:contains("Vote")').click();

    // vote an opened article
    $j("div.vote_boxer a").click();

})();