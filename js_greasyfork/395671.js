// ==UserScript==
// @name         Citethisforme Ads Remove
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to remove the ads
// @author       Zhihao
// @include      http*://www.citethisforme.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395671/Citethisforme%20Ads%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/395671/Citethisforme%20Ads%20Remove.meta.js
// ==/UserScript==

(function() {
try {
    document.getElementsByClassName('ads_top_middle')[0].style.display="none"
    var divs=document.getElementsByClassName('sbm-ad');
    for (var i=0;i<divs.length;i++) {
      divs[i].style.display='none'
    }
} catch (error) {

}

})();