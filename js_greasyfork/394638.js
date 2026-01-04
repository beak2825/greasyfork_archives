// ==UserScript==
// @name         MzTacticsPreviewer
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  pokazuje takse po lewej po najechaniu na wynik 
// @author       kostrzak16 (Michal Kostrzewski)
// @match        https://www.managerzone.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/394638/MzTacticsPreviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/394638/MzTacticsPreviewer.meta.js
// ==/UserScript==

function podgladTaktyk(){
   var calDiv = $('#calendar-new');
   var lastScoreHovered = $("#dummy");

    $('.score-cell-wrapper').mouseover(function(){
        lastScoreHovered.css("font-size","12px");
        $(this).css("font-size","18px");
        var toRotate = $(this).prev().find("strong").length > 0;
        ostylujDiva(calDiv);
        var matchUrl = $(this).find("a").first().attr("href");
        var matchId = matchUrl.substring(matchUrl.indexOf("mid=") + 4,matchUrl.indexOf("&tid="));
        calDiv.html('<img id="imgTactPreview" src="dynimg/pitch.php?match_id=' + matchId + '" class="shadow" alt="" style="width:225px;height:300px">');
        if(toRotate)
        {$("#imgTactPreview").css("transform","rotate(-180deg)");}
        lastScoreHovered = $(this);

    });

    $('#fixtures-results-list').mouseleave(function(){
       $('#calendar-new').html("");
    });
}

function ostylujDiva(div)
{
    //  calDiv.addClass("floating_element");
           div.css("display","block");
           div.css("position","fixed");
           div.css("z-index",1000);
           div.css("left","10%");
           div.css("top","50px");
           div.css("width","225px");
           div.css("height","300px");
}

(function() {
    'use strict';
   podgladTaktyk();
    // Your code here...
})();