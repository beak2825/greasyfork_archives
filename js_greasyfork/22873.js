// ==UserScript==
// @name              Pot Farm Mooch Helper
// @namespace      http://trueidiocy.us
// @description     Pot Farm Mooch Helper tool
// @include           https://www.potfarmmoocherpro.com/list
// @require          https://code.jquery.com/jquery-1.8.3.js
// @version          1.0.0
// @downloadURL https://update.greasyfork.org/scripts/22873/Pot%20Farm%20Mooch%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/22873/Pot%20Farm%20Mooch%20Helper.meta.js
// ==/UserScript==



function moochHelper (jNode) {

$("li:contains('Surprise')").css("background-color","salmon"); 

}



waitForKeyElements ( ".load-more:contains('refresh')" , moochHelper);