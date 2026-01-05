// ==UserScript==
// @name       Peanut Spored
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://www.siol.net/tv-spored.aspx
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/4613/Peanut%20Spored.user.js
// @updateURL https://update.greasyfork.org/scripts/4613/Peanut%20Spored.meta.js
// ==/UserScript==

$(document).ready(function(){
	var programi = [];
    programi.push("SLO 1");
    programi.push("SLO 2");
    programi.push("Planet TV");
    programi.push("POP TV");
    programi.push("Kanal A");
    programi.push("Discovery Channel");
    programi.push("Discovery HD");
    programi.push("History HD");
    programi.push("Discovery Science HD");
    programi.push("HBO HD");
    programi.push("HBO Comedy HD ");
    programi.push("Fox HD");
    programi.push("Fox Life HD");
    programi.push("Fox Movies HD");
    programi.push("E!");
    
    $("div.def").each(function(){
    	$(this).hide();
    });
    
    $("div.def").each(function(){
        if ($.inArray($(this).children("span:nth-child(2)").text(), programi) != -1)
        {
			$(this).show();
            //$(this).next().show();
            
            if ($(this).next().children("span:nth-child(2)").text().length == 1)
            {
                $(this).next().show();
            }
        }
    });
});