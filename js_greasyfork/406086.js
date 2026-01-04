// ==UserScript==
// @name         Baidu Cleaner
// @namespace    https://www.geshkii.xyz/helium
// @version      0.2
// @description  Hide disracting elements of Baidu
// @author       sudo2u
// @include     *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406086/Baidu%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/406086/Baidu%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var hideResou = document.getElementsByClassName("FYB_RD");
    var hideSimilar = document.getElementsByClassName("opr-recommends-merge-content");
    var hideSuggestions = document.getElementsByClassName("se_common_hint");

    for(var i = 0; i < hideResou.length; i++){
        hideResou[i].style.visibility = "hidden";
        hideResou[i].style.display = "none";
    }

    for(var j= 0; j < hideSuggestions.length; j++){
        hideSuggestions[j].style.visibility = "hidden";
        hideSuggestions[j].style.display = "none";
    }

    for(var k= 0; k < hideSimilar.length; k++){
        hideSimilar[k].style.visibility = "hidden";
        hideSimilar[k].style.display = "none";
    }

})();
