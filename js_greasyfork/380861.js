// ==UserScript==
// @name         Mousehunt Deep Run Assistant
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  A userscript that helps you check if you have failed a Deep Run
// @author       Lim Yi Qin (Chirpphixel#8006)
// @match        https://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380861/Mousehunt%20Deep%20Run%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/380861/Mousehunt%20Deep%20Run%20Assistant.meta.js
// ==/UserScript==

//credits to Bill Comeau for the Deep Run Tracker.
//--- https://docs.google.com/spreadsheets/d/10Tv63I3cbPrkLm9p0lYJlU4z34nCn2viU-E-WO_o3DE/pub?output=html


//checks if user is at iceberg
$(document).ready(function(){
    if($(".mousehuntHud-environmentName").text() === "Iceberg"){

        const zones = ["Treacherous Tunnels", "Brutal Bulwark", "Bombing Run", "The Mad Depths", "Icewing's Lair", "Hidden Depths", "The Deep Lair", "General"];
        const targethunts = [0, 39, 99, 212, 222, 233, 249];
        const zonesmaxdepth = [300, 600, 1600, 1800, 1800, 2000, 2000];
        //average depth per hunt is calculated by the sum of (AR of mice * progress of that mice) from that zone
        //CR is assumed to be 100% and arming Ultimate Iceberg Base/4 Iceberg Bases
        //credits to jack's tools for the AR of mice from different zones
        const avgdepthperhunt = [12.0, 6.9, 13.2, 6.0, 0, 14.8, 0]

        var currentzone = '';
        var currenthuntno = 0;
        var currentdepth = 0;

        function initHuntSeq() {

            //initialise div for appending
            $("#hudLocationContent > .icebergHud > .cutaway > .depth")
            .append("<div id='deeprunassist_targethuntcontainer'><div class='deeprunassist_nxtzone'>"+
                "Next Zone: <b><span id='deeprunassist_nextzone' title=''></span></b></div><div class='deeprunassist_nxtzonehunt'>Next Zone Target Hunt: "+
                "<b><span id='deeprunassist_targethunt' title=''></span></b></div></div>");

            currentzone = $("#hudLocationContent > .icebergHud > .cutaway > .depth > .currentPhase").text();

            //find next zone(and hunts)
            var nextzoneindex = parseInt(zones.indexOf(currentzone)) + 1;
            if(nextzoneindex < 7){
                $("#deeprunassist_nextzone").text(zones[nextzoneindex]);
                $("#deeprunassist_targethunt").text(targethunts[nextzoneindex]);
            }
            else{
                $("#deeprunassist_nextzone").text("Catching Deep Mouse");
                $("#deeprunassist_targethunt").text("250");
            }

            $("#deeprunassist_targethunt").css('background-color', '#FFFFFFAA');
            calcFeasibility();
        }

        //aka colourise target hunts
        function calcFeasibility(){

            currentzone = $("#hudLocationContent > .icebergHud > .cutaway > .depth > .currentPhase").text();
            currentdepth = parseInt($("#hudLocationContent > .icebergHud > .cutaway > .depth > .user_progress_container > .user_progress").text().replace(/^[, ]+|[, ]+$|[, ]+/g, ""));
            currenthuntno = parseInt($("#hudLocationContent > .icebergHud > .cutaway > .depth > .turnsTaken").text());

            var currentselector = parseInt(zones.indexOf(currentzone));

            //modify next zone if zone changes
            if(currentzone === $("#deeprunassist_nextzone").text() || currentselector < 6){
                $("#deeprunassist_nextzone").text(zones[currentselector + 1]);
                $("#deeprunassist_targethunt").text(targethunts[currentselector + 1]);
            }
            else{
                $("#deeprunassist_nextzone").text("Catching Deep Mouse");
                $("#deeprunassist_targethunt").text("250");
            }

            //check if current zone is icewing or deep lair
            if(currentselector === 4){

                //only compare hunts, since hunting mice does not progress you here, except icewing. By then you will be in another zone. :)
                var comparehuntcount = currenthuntno - targethunts[currentselector];

                //ahead of run
                if(comparehuntcount <=0){
                    $("#deeprunassist_targethunt").css('color', '#28a745');
                    $("#deeprunassist_targethunt").attr('title','Ahead of run');
                }

                //change of failing the run
                else if(comparehuntcount >0 && comparehuntcount < 10){
                    $("#deeprunassist_targethunt").css('color', '#ffc107');
                    $("#deeprunassist_targethunt").attr('title','Chance of failing the run');
                }
                //impossible
                else{
                    $("#deeprunassist_targethunt").css('color', '#dc3545');
                    $("#deeprunassist_targethunt").attr('title','Deep run impossible');
                }

            }else if(currentselector === 6){

                //ahead of run
                if(currenthuntno <= 248){
                    $("#deeprunassist_targethunt").css('color', '#28a745');
                    $("#deeprunassist_targethunt").attr('title','Ahead of run');
                }

                //change of failing the run
                else if(currenthuntno === 249){
                    $("#deeprunassist_targethunt").css('color', '#ffc107');
                    $("#deeprunassist_targethunt").attr('title','Arm SB now!');
                    alert("Arm SB Now! CR of Deep is 100%")
                }


            }else if(currentselector === 7){

                //do nothing


            }else{

                var depthsneeded = zonesmaxdepth[currentselector] - currentdepth;
                //hunts needed to reach end of current zone
                var huntsneeded = targethunts[currentselector+1] - (depthsneeded / avgdepthperhunt[currentselector]);
                var comparehuntcount = currenthuntno - huntsneeded;

                //ahead of run
                if(comparehuntcount <=0){
                    $("#deeprunassist_targethunt").css('color', '#28a745');
                    $("#deeprunassist_targethunt").attr('title','Ahead of run');
                }
                //change of failing the run
                //note: hunt count here is more delicate, because your run is getting closer to the deep lair, which you can easily screw up your run with a higher hunt count.
                else if(comparehuntcount >0 && comparehuntcount < 5){
                    $("#deeprunassist_targethunt").css('color', '#ffc107');
                    $("#deeprunassist_targethunt").attr('title','Chance of failing the run');
                }
                //impossible
                else{
                    $("#deeprunassist_targethunt").css('color', '#dc3545');
                    $("#deeprunassist_targethunt").attr('title','Deep run impossible');
                }
            }

        }

        initHuntSeq();

        $("#hudLocationContent > .icebergHud > .cutaway > .depth > .turnsTaken").on('DOMSubtreeModified', calcFeasibility);

    }else{
        return;
    }
});