// ==UserScript==
// @name         dlsite nijigame auto draw
// @namespace    https://greasyfork.org/zh-TW/users/234408-kfoawf
// @version      0.2
// @description  auto draw
// @author       kfoawf
// @match        *://www.nijiyome.com/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
 
// @downloadURL https://update.greasyfork.org/scripts/446230/dlsite%20nijigame%20auto%20draw.user.js
// @updateURL https://update.greasyfork.org/scripts/446230/dlsite%20nijigame%20auto%20draw.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
 
setTimeout(function(){
    $('.start').click();
}, 5000);