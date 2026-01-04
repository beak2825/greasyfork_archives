// ==UserScript==
// @name         Confirm Before Mark All Unread Posts Read
// @version      0.1
// @description  Adds confrmation prompt when presseing Mark All Read on the Unread Posts page on ivelt
// @author       Huroitze Beilum Shemoi
// @match        http://www.ivelt.com/forum/search.php?search_id=unreadposts
// @grant        none
// @namespace https://greasyfork.org/users/473330
// @downloadURL https://update.greasyfork.org/scripts/406231/Confirm%20Before%20Mark%20All%20Unread%20Posts%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/406231/Confirm%20Before%20Mark%20All%20Unread%20Posts%20Read.meta.js
// ==/UserScript==

(function() {
    'use strict';
var $ = window.jQuery;
$('.mark-read').click(function(e){
var r = confirm("ביזטו זיכער אז דו ווילסט פארצייכענען 'אלע תגובות' ווי געליינט?");
if (r == true){$('.mark-read').off('click');$('.mark-read').trigger('click')}else{return false;}})

})();