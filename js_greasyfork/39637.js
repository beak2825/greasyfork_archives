// ==UserScript==
// @name         tax engine script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @include      *amazonaws*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39637/tax%20engine%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39637/tax%20engine%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    GM_xmlhttpRequest({
        method : 'GET',
        url: $('.dont-break-out').attr("href"),
        onload: function(response){
            const $$ = selector => $(response.responseText).find(selector);
            var title = $$('#productTitle').text().trim();
            $('.dont-break-out').append("<br />" + title);
            var x = 13;
            while ($$('span.a-list-item').eq(x).text().trim() !== "+" && x !== 30){
                $('.dont-break-out').append("<br /> " +$$('span.a-list-item').eq(x++).text().trim());
            }
            var pic = $$('img').eq(5).attr('src');
            $('.dont-break-out').prepend($('<img>',{id:'theImg', src:pic}));
        }
    });
});