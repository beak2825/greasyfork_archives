// ==UserScript==
// @name         Elser script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39609/Elser%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39609/Elser%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    if(!$('span:contains("Find the website URL for this company.")').eq(0).text().trim()) return;
//Hides stuff
    $('div.panel.panel-primary').toggle();
    $('p').toggle();
//Grabs company name
    var company = $('td').eq(1).text().trim().toLowerCase();
    var links = ["","",""];
    company = company.replace(' ',"+");
//Searches google for website urls
    GM_xmlhttpRequest({
        method : 'GET',
        url: 'http://www.google.com/search?q=' + company + "+company",
        onload: function(response){
        const $$ = selector => $(response.responseText).find(selector);
            for(x=0; x<3; x++){
                links[x] = $$('cite._Rm').eq(x).text().trim().replace('http://','').replace('https://','').replace('www.','').toLowerCase();
                if (links[x].substr(links[x].length-1) == '/'){
                    links[x] = links[x].slice(0,-1);
                }
            }
//Creates website buttons + autofills box
            console.log($$('a').attr('href'));
            document.getElementById("url").value = links[0];
            var b1 = '<button type="button" id="b1">'+links[0]+'</button>';
            var b2 = '<button type="button" id="b2">'+links[1]+'</button>';
            var b3 = '<button type="button" id="b3">'+links[2]+'</button>';
            $('input.form-control').after(b3).after(b2).after(b1);
            $('#b1').click(function(){
                document.getElementById("url").value = links[0];
                document.querySelector(`[type="submit"]`).click(); //CAUTION - SCRIPT AUTO-SUBMITS
            });
            $('#b2').click(function(){
                document.getElementById("url").value = links[1];
                document.querySelector(`[type="submit"]`).click();
            });
            $('#b3').click(function(){
                document.getElementById("url").value = links[2];
                document.querySelector(`[type="submit"]`).click();
            });
//EVEN BIGGER CAUTION - SCRIPT AUTO-SUBMITS ON PERFECT RESULTS
            for(x=0; x<3; x++){
                if(links[x] == company+".com"){
                    document.getElementById("url").value = links[x];
                    setTimeout(document.querySelector(`[type="submit"]`).click(), 400);
                }
            }
        }
    });
});