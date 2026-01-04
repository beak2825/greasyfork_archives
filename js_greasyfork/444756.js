// ==UserScript==
// @name         dlsite auto draw
// @namespace    https://greasyfork.org/zh-TW/users/234408-kfoawf
// @version      0.4
// @description  auto draw
// @author       kfoawf
// @match        *://www.dlsite.com/home/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/444756/dlsite%20auto%20draw.user.js
// @updateURL https://update.greasyfork.org/scripts/444756/dlsite%20auto%20draw.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

setTimeout(function(){
    $('.message_box_01').click();
}, 5000);