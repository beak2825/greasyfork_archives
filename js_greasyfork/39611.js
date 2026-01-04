// ==UserScript==
// @name         Gautam script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39611/Gautam%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39611/Gautam%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    GM_xmlhttpRequest({
        method : 'GET',
        url: $('.dont-break-out').attr("href"),
        onload: function(response){
            const $$ = selector => $(response.responseText).find(selector);
            var ind = $$('._1c03').text();
            console.log(ind);
        }
    });
});