// ==UserScript==
// @name         Clean PlantUML.com
// @namespace    dannieboi
// @version      0.1
// @description  Removes unnecessary elements so that documentation is easier to read
// @author       dannieboi
// @match        http://www.plantuml.com/*
// @match        http://www.plantuml.net/*
// @match        http://plantuml.com/*
// @match        http://plantuml.net/*
// @match        http://plantuml.sourceforge.net/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/12818/Clean%20PlantUMLcom.user.js
// @updateURL https://update.greasyfork.org/scripts/12818/Clean%20PlantUMLcom.meta.js
// ==/UserScript==

$("body").css("overflow-x", "auto");
$("<div>MENU</div>")
.css({"position": "fixed", "top": 0, "left": 0, "z-index": 5000, "font-weight": "bold", "color": "red", "cursor": "pointer"})
.appendTo("body")
.click(function(){
    $("#side, #sideback, #H1, #V1, #C1").toggle();
    if($("#side").is(":visible")){
        $("#content").css({"margin-left": "170px"});
    }
    else{
        $("#content").css({"margin-left": "auto"});
    }
});
$("#side, #sideback, #H1, #V1, #C1, #ann1, #gcsesearch, #annonces7i, #annonces7, #side2, #annonces8, #PUBH2, #pied_de_page").hide();
$("#content").css({"margin-left": "auto", "margin-right": "auto"});
