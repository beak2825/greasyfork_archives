// ==UserScript==
// @name         Andreascript
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39598/Andreascript.user.js
// @updateURL https://update.greasyfork.org/scripts/39598/Andreascript.meta.js
// ==/UserScript==

$(document).ready(function() {
    if(!$('strong:contains(Website data collection - Instructions)').length) return;
    var comp = $('a').eq(2).attr('href')+"+company&nfpr=1";
    var fac  = $('a').eq(3).attr('href')+"&nfpr=1";
    console.log(fac);
    GM_xmlhttpRequest({
        method : 'GET',
        url: comp,
        onload: function(response){
            const $$ = selector => $(response.responseText).find(selector);
            var web1 = $$('cite._Rm').eq(1).text().trim();
            document.getElementById("companyName").value = web1;
        }
    });
    GM_xmlhttpRequest({
        method : 'GET',
        url: fac,
        onload: function(response){
            const $$ = selector => $(response.responseText).find(selector);
            var web2 = $$('cite._Rm').eq(1).text().trim();
            document.getElementById("addressLine1").value = web2;
        }
    });

});