// ==UserScript==
// @name       Social Networks Automator
// @version    0.7
// @description  Automates OCMP's social network presence hits
// @match      https://*.crowdcomputingsystems.com/mturk-web/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/4772/Social%20Networks%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/4772/Social%20Networks%20Automator.meta.js
// ==/UserScript==

function pickResult(element){
    selectResult(element);
}

setTimeout(function() {
    var pages = $(".site.ui-slider-tab-content").each(function() {
        var company_info = $("div.place.bg-dark", $(this)).html().split("<br>");
        var companyName = company_info[0].split("</strong>")[1].trim();
        var companyAddress = company_info[1].split("</strong>")[1].trim().replace(/&nbsp;/g," ");
        
        console.log("Name: "+companyName);
        console.log("Address: "+companyAddress);
        var results = $(this).find("div.gs-webResult.gs-result").children();
        console.log($(this).find("input:radio:first")[0]);
        if ($(results[0]).text() == "No Results" || results.length < 2)
            pickResult($(this).find("input:radio:first")[0]);
            //$(this).find("input:radio:first")[0].click();
        else{
            if ($(results[1]).text().indexOf("N/A") > -1)
                pickResult($(results[0]).find("input:radio:first")[0]);
                //$(this).find("input:radio:first")[0].click();
            else{
                var bolds = [];
                var winner = -1;
                console.log(results.length);
                for (var i = 0; i < results.length; i++){
                    if ($(results[i]).text().indexOf("N/A") != -1){
                        bolds[i] = -1;
                        continue;
                    }
                    var title = $(results[i]).find(".gs-title").html();
                    var snippet = $(results[i]).find(".gs-snippet").html();
                    var url = $(results[i]).find(".gs-visibleUrl").html();
                    if (snippet.match(/<b>/g))
                        bolds[i] = snippet.match(/<b>/g).length;
                    else
                        bolds[i]=-99999;
                    if (title.match(/<b>/g))
                        bolds[i] += title.match(/<b>/g).length;
                    else
                        bolds[i]=-99999;
                }
                console.log(bolds);
                var best_match = bolds.indexOf(Math.max.apply(Math, bolds));
                var elem = $(results[best_match]).find("input:radio:first")[0];
                pickResult(elem);
                //$(results[best_match]).find("input:radio:first")[0].click();
            }
        }/**/
    });
    //if (confirm("Submit?"))
    //    $(".submit-btn").click();
    },2000);