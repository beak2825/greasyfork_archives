// ==UserScript==
// @name         Chios System script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/39604/Chios%20System%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39604/Chios%20System%20script.meta.js
// ==/UserScript==
$(document).ready(function() {
    console.log($("h3").text());
//Sanity Check
    var sanity = "Geofence the store at the given location (notice: new changed instructions)";
    var sanity2 = "Geofence the car dealership at the given location (notice: new changed instructions)";
    if(sanity == $("h3").text() || sanity2 == $("h3").text() ){
        console.log("Running Chios.exe");
//Hides insctructions/clutter
        $("h3").toggle();
        $("div[class=highlight-box]").toggle();
        $("h2").toggle();
        $("img[height=200]").toggle();
        $('button').click();
        $("button").eq(0).toggle();
//Creates ease of use buttons
        var inp = "No input";
        document.getElementById("polygon").value = inp;
        var oql = '<button type="button" id="oql">(1) Over Query Limit</button>';
        var wsn = '<button type="button" id="wsn">(2) Wrong Store Name</button>';
        var cfi = '<button type="button" id="cfi">(3) Cannot Find it</button>';
        var ns = '<button type="button" id="ns">(4) Zero Results</button>';
        $("#reasons").before("<br>");
        $("#reasons").before(oql);
        $("#oql").click(function(){
            document.getElementById("reasons").value = "Overy Query Limit";
            $("button").eq(0).click();
            if(document.getElementById("polygon").value != inp){
                $("#submitButton").click();
            }
        });
        $("#reasons").before(wsn);
        $("#wsn").click(function(){
            document.getElementById("reasons").value = "Wrong Store Name";
            $("button").eq(0).click();
            if(document.getElementById("polygon").value != inp){
                $("#submitButton").click();
            }
        });
        $("#reasons").before(cfi);
        $("#cfi").click(function(){
            document.getElementById("reasons").value = "Cannot Find it";
            $("button").eq(0).click();
            if(document.getElementById("polygon").value != inp){
                $("#submitButton").click();
            }
        });
        $("#reasons").before(ns);
        $("#ns").click(function(){
            document.getElementById("reasons").value = "Zero Results";
            $("button").eq(0).click();
            if(document.getElementById("polygon").value != inp){
                $("#submitButton").click();
            }
        });
        $("#reasons").before("<br>");
//makes hotkeys for buttons
        $(document).keyup(function(event){
            if(event.which == 49){
                document.getElementById("reasons").value = "Overy Query Limit";
                $("button").eq(0).click();
                if(document.getElementById("polygon").value != inp){
                    $("#submitButton").click();
                }
            }
            if(event.which == 50){
                document.getElementById("reasons").value = "Wrong Store Name";
                $("button").eq(0).click();
                if(document.getElementById("polygon").value != inp){
                    $("#submitButton").click();
                }
            }
            if(event.which == 51){
                document.getElementById("reasons").value = "Cannot Find it";
                $("button").eq(0).click();
                if(document.getElementById("polygon").value != inp){
                    $("#submitButton").click();
                }
            }
            if(event.which == 52){
                document.getElementById("reasons").value = "Not Sure";
                $("button").eq(0).click();
                if(document.getElementById("polygon").value != inp){
                    $("#submitButton").click();
                }
            }
        });
//Press Enter to submit and check for correct input
        $(document).keyup(function(event){
            if(event.which == 13 && document.getElementById("polygon").value != inp){
                event.preventDefault();
                $("#submitButton").click();
            }
        });
    }
    else{
        console.log("Chios Script is not running");
    }
});