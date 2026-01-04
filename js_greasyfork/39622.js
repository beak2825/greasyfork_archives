// ==UserScript==
// @name         Micu script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39622/Micu%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39622/Micu%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    if(!$('strong:contains(Data Collection Instructions)').length) return;
    var comp = "https://api.instagram.com/oembed/?url="+$('td').text();
    $("input").prop('required type',"true");
    GM_xmlhttpRequest({
        method : 'GET',
        url: comp,
        onload: function(response){
            const $$ = selector => $(response.responseText).find(selector);
            var web1 = $$('span._fd86t._he56w').text();
            console.log(web1);
            console.log($$('span').text());

            $('input.form-control').attr('id','thaat');
            document.getElementById("thaat").value = web1;
            //document.getElementById("web_url").value += web1;
        }
    });
});