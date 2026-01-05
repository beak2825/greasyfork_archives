// ==UserScript==
// @name         Sergey Schmidt - Labels YT
// @namespace    http://kadauchi.com/
// @version      1.4.1
// @description  Hides instuctions, chooses off topic.
// @author       Kadauchi
// @icon         http://kadauchi.com/avatar.jpg
// @include      https://s3.amazonaws.com/*
// @grant        GM_log
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/12809/Sergey%20Schmidt%20-%20Labels%20YT.user.js
// @updateURL https://update.greasyfork.org/scripts/12809/Sergey%20Schmidt%20-%20Labels%20YT.meta.js
// ==/UserScript==

$(function(){
    var hitcheck = $("a[class='jumper'][data-target='#desc-off-topic']");
    if (hitcheck.length){ 
        console.log("Hit Check for [Sergey Schmidt - Labels YT]: Success!!!");

        $("#instructions").before('<button id="toggle" type="button"><span>Show Instructions</span></button>');
        $("#toggle").click(function() {
            $("#instructions, #sample-task, #delete-history").toggle();
            $("#toggle").text() == "Show Instructions" ? str = "Hide Instructions" : str = "Show Instructions";
            $("#toggle span").html(str);
        });  

        $("#instructions, #sample-task, #delete-history").hide();
        $("input[value='OFF_TOPIC']").click();
        $("input[value='OFF_TOPIC']:visible").eq(0).focus();

        $(window).on("beforeunload", function(){
            var topics = $("input[value='OFF_TOPIC']:visible").length;
            var checked = $("input:radio:checked:visible").length;
            if (checked !== topics){
                return "You are missing a checked radio.";
            }
        });
    }
    else {
        console.log("Hit Check for [Sergey Schmidt - Labels YT]: Fail!!!");
    }
});
