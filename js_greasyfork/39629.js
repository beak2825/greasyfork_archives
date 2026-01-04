// ==UserScript==
// @name         PK script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39629/PK%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39629/PK%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    //if(!$('span:contains("Find the website URL for this company.")').eq(0).text().trim()) return;
    //Searches google for website urls
    var search1 = $('p').eq(1).text().slice(11);
    console.log(search1);
    GM_xmlhttpRequest({
        method : 'GET',
        url: 'http://www.google.ch/search?q=' + search1,
        onload: function(response){
            const $$ = selector => $(response.responseText).find(selector);
            var link = $$('a').eq(26).attr('href');
            $("input#surveycode").eq(0).val(link);
            console.log(link);
        }
    });
    var search2 = $('div.form-group').eq(5).text().slice(11);
    console.log(search2);
    GM_xmlhttpRequest({
        method : 'GET',
        url: 'http://www.google.ch/search?q=' + search2,
        onload: function(response){
            const $$ = selector => $(response.responseText).find(selector);
            var link2 = $$('a').eq(26).attr('href');
            $("input#surveycode").eq(1).val(link2);
            console.log(link2);
        }
    });
});