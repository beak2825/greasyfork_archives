// ==UserScript==
// @name        TF2 Center powah' counter
// @namespace   http://www.janhouse.lv/
// @description Count total hours played for each team.
// @include     http://tf2center.com/lobbies/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4289/TF2%20Center%20powah%27%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/4289/TF2%20Center%20powah%27%20counter.meta.js
// ==/UserScript==

var $ = unsafeWindow.jQuery; // Use their jQuery

var skillThreshold=1500; // Players below 1000 played hours will get more red. Above it - more green.

function updateStats(){
    
    //console.log("tick");
    
    // Add info boxes
    $(".blue-team, .red-team").each(function(){
        if(!$(this).find(".statZ").length){
            //console.log("lost");
           $(this).find(".teamName").after("<span style='top: 15px;position: relative;left: 14px;font-size: 14px;color: #E8E5D5' class='statZ'></span>");
        }
    });
    
    // Calculate team powah'
    $(".blue-team, .red-team").each(function(){
        var count=0;
        var size=0
        //console.log("team");
        
        // Get stats for each player
        $(this).find(".playerSlot > .details > .statsContainer > .hours").next("span.darkgrey").each(function(){
           count=count+parseInt($(this).text().trim(), 10);
           size++;
        });
       
        // Color players based on play time
        $(this).find(".playerSlot.filled").each(function(){
            
            var hours=parseInt($(this).find(".details > .statsContainer > .hours").next("span.darkgrey").text().trim(), 10);
            
            // "Magic" "formula"
            if(hours < skillThreshold){
               $(this).css({"background-color": "rgba(255, 0, 0, "+(((-skillThreshold+hours)*-1) / 10000 )+")"});
            }else{
                $(this).css({"background-color": "rgba(0, 255, 0, "+(hours/20000)+")"});
            }
        });

        // Average powah'?
        var avg = count/size;
        var avgF=avg.toFixed(2);
        
        // Team average powah color
        if(avgF < skillThreshold){
            tColor="rgba(255, 0, 0, "+(((-skillThreshold+parseInt(avgF, 10))*-1) / 10000 )+")";
        }else{
            tColor="rgba(0, 255, 0, "+(avgF/13000)+")";
        }
        
        //console.log(count);
        $(this).find(".statZ").html("Powah: "+count+", Avg: <span style='background-color: "+tColor+"'>"+avgF+"</span>");

    });
    
}

$(document).ready(function() {  

    // Tweak css for nick background changes
    $("#mainContent").before("<style>.statsContainer .darkgrey{color: rgba(183, 183, 183, 0.8);} .playerSlot .details .name {color: rgba(233, 233, 233, 0.8);}</style>");

    // Do it once in 5 sec.
    var i = window.setInterval( function(){ 
       updateStats();
    }, 5000 );
    updateStats();
    
});
