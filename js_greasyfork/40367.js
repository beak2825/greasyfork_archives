// ==UserScript==
// @name        Torn Easter Egg Spawner
// @namespace   https://www.torn.com/profiles.php?XID=2029670
// @version     2.8
// @description Spawns additional Easter Eggs
// @author      MikePence [2029670]
// @match       https://www.torn.com/*
// @requires    https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/40367/Torn%20Easter%20Egg%20Spawner.user.js
// @updateURL https://update.greasyfork.org/scripts/40367/Torn%20Easter%20Egg%20Spawner.meta.js
// ==/UserScript==

$(document).ready(function(){
    if(Math.floor((Math.random() * 100) + 1) <= 5){
        $('#mainContainer').prepend('<div class="egg" style="position: absolute; left: ' + (Math.random() * (($(document).width() - 10) - 10) + 10) + 'px; top: ' + (Math.random() * (($(document).width() - 10) - 10) + 10) + 'px; z-index: 99999;"><img src="competition.php?c=EasterEggs&amp;step=eggImage&amp;access_token=ZDlRSDNCN1hRK2RBbFozSEM4c1JscGlFei9nbW8yRnR1UkpnbCtGeDJ0QT0"></div>');
    }

    $('.egg').first().click(function(){
        $(this).remove();
        alert("DO NOT PASS\n\nYou have been placed in MikePence's dungeon for installing a script without reading what it does.");
        /*$('#colorbox').addClass("egg-colorbox");
        $('#colorbox').css({"display": "", "padding-bottom": "80px", "padding-right": "0px", "top": "100px", "left": "360px", "position": "absolute", "width": "304px", "height": "150px", "overflow": "hidden"});
        $('#colorbox').html('<div id="cboxWrapper" style="height: 230px; width: 304px;"><div><div id="cboxTopLeft" style="float: left;"></div><div id="cboxTopCenter" style="float: left; width: 304px;"></div><div id="cboxTopRight" style="float: left;"></div></div><div style="clear: left;"><div id="cboxMiddleLeft" style="float: left; height: 150px;"></div><div id="cboxContent" style="float: left; width: 304px; height: 150px;"><div id="cboxLoadedContent" style="width: 0px; overflow: auto; height: 30px;"><div class="egg-popup success"><div class="egg-item egg-9"></div><div class="text"><div class="title">Congratulations, you found a Pink Egg!</div>You have been rewarded with + Experience<br>and the Pink Egg is now in your inventory.</div></div></div><div id="cboxTitle" style="float: left; display: block;"></div><div id="cboxCurrent" style="float: left; display: none;"></div><div id="cboxNext" style="float: left; display: none;"></div><div id="cboxPrevious" style="float: left; display: none;"></div><div id="cboxSlideshow" style="float: left; display: none;"></div><div id="cboxClose" style="float: left;">close</div></div><div id="cboxMiddleRight" style="float: left; height: 150px;"></div></div><div style="clear: left;"><div id="cboxBottomLeft" style="float: left;"></div><div id="cboxBottomCenter" style="float: left; width: 304px;"></div><div id="cboxBottomRight" style="float: left;"></div></div></div>');

        $("#cboxClose").click(function(){
            $("#colorbox").css("display", "none");
        });*/
    });

    // var eggsSpawned = 0;
    // var width = 15;

    window.setInterval(function(){
        /*if (Math.floor((Math.random() * 100) + 1) <= (eggsSpawned + 10) / 5){
            $('#mainContainer').prepend('<div class="egg" style="position: absolute; left: ' + (Math.random() * (($(document).width() - 10) - 10) + 10) + 'px; top: ' + (Math.random() * (($(document).width() - 10) - 10) + 10) + 'px; z-index: 99999;"><img width="' + width + '" src="competition.php?c=EasterEggs&amp;step=eggImage&amp;access_token=ZDlRSDNCN1hRK2RBbFozSEM4c1JscGlFei9nbW8yRnR1UkpnbCtGeDJ0QT0"></div>');
            eggsSpawned++;
            width++;
        }

        $('.egg').each(function(){
            $(this).click(function(){
                $(this).remove();
            });
        });*/

        if(window.location.href.indexOf("competition.php")){
            $('.percent').first().html('100<span class="symbol">%</span>');
            $('.percent').first().attr('title', 'You ended the competition with a higher score than 100% of other people');
            $('.tokens').first().html('<i class="tokens-icon"></i>10 Tokens Expected');
            $('.tokens').first().attr('title', 'You earned 10 tokens by maintaining a score higher than 100% of other people');
            $('.score-value').first().html('<div class="d-hide">/</div>SCORE: 100');
            $('.score-value').first().attr('title', 'You earned a score of 100 in this competition');
        }

        for(var i = 0; i < ids.length; i++){
            if(window.location.href.indexOf("profiles.php?XID=" + ids[i]) >= 0 ||
               window.location.href.indexOf("profiles.php?NID=" + nids[i]) >= 0){
                $('.score-wrap').first().html('100<div class="score"><div class="text">EGGS FOUND:</div>100</div>');

                $('.box-value').each(function(index){
                    if(index == 0){
                        $(this).html('<li class="digit-r"><div class="l-ear left"></div><div class="digit left">1</div><div class="clear"></div></li><li class="digit-m"><div class="digit ">0</div><div class="clear"></div></li><li class="digit-l"><div class="digit left">0</div><div class="r-ear right"></div><div class="clear"></div></li><li class="clear"></li>');
                    }
                });

                $('.two-row').first().children().each(function(index){
                    if(index == 0){
                        $(this).text(ranks[i]);
                    }
                    else if(index == 1){
                        $(this).text(titles[i]);
                    }
                });

                $('.rank1-rank,.rank2-rank,.rank3-rank,.rank4-rank,.rank5-rank,.rank6-rank,.rank7-rank,.rank8-rank,.rank9-rank,.rank10-rank,.rank11-rank,.rank12-rank,.rank13-rank,.rank14-rank,.rank15-rank,.rank16-rank,.rank17-rank,.rank18-rank,.rank19-rank,.rank20-rank,.rank21-rank,.rank22-rank,.rank23-rank,.rank24-rank,.rank25-rank').first().attr('class', 'rank25-rank');
                $('.f-membership1-commitment,.f-membership2-commitment,.f-membership3-commitment,.f-membership4-commitment,.f-membership5-commitment,.f-membership6-commitment,.f-membership7-commitment,.f-membership8-commitment,.f-membership9-commitment,.f-membership10-commitment').first().attr('class', 'f-membership10-commitment');
                $('.busting1-miscellaneous,.busting2-miscellaneous,.busting3-miscellaneous,.busting4-miscellaneous,.busting5-miscellaneous,.busting6-miscellaneous,.busting7-miscellaneous').first().attr('class', 'busting7-miscellaneous');
                $('.fraud1-crime,.fraud2-crime,.fraud3-crime,.fraud4-crime,.fraud5-crime,.fraud6-crime,.fraud7-crime,.fraud8-crime,.fraud9-crime,.fraud10-crime,.fraud11-crime,.fraud12-crime,.fraud13-crime,.fraud14-crime,.fraud15-crime,.fraud16-crime').first().attr('class', 'fraud16-crime');
                $('.auto-theft1-crime,.auto-theft2-crime,.auto-theft3-crime,.auto-theft4-crime,.auto-theft5-crime,.auto-theft6-crime,.auto-theft7-crime,.auto-theft8-crime,.auto-theft9-crime,.auto-theft10-crime,.auto-theft11-crime,.auto-theft12-crime,.auto-theft13-crime,.auto-theft14-crime,.auto-theft15-crime,.auto-theft16-crime,.auto-theft17-crime,.auto-theft18-crime,.auto-theft19-crime,.auto-theft20-crime,.auto-theft21-crime').first().attr('class', 'auto-theft21-crime');
                $('.pc-crimes1-crime,.pc-crimes2-crime,.pc-crimes3-crime,.pc-crimes4-crime,.pc-crimes5-crime,.pc-crimes6-crime,.pc-crimes7-crime,.pc-crimes8-crime,.pc-crimes9-crime,.pc-crimes10-crime,.pc-crimes11-crime,.pc-crimes12-crime,.pc-crimes13-crime,.pc-crimes14-crime,.pc-crimes15-crime,.pc-crimes16-crime').first().attr('class', 'pc-crimes16-crime');
                $('.drug-deals1-crime,.drug-deals2-crime,.drug-deals3-crime,.drug-deals4-crime,.drug-deals5-crime,.drug-deals6-crime,.drug-deals7-crime,.drug-deals8-crime').first().attr('class', 'drug-deals8-crime');
                $('.lvl1-level,.lvl2-level,.lvl3-level,.lvl4-level,.lvl5-level,.lvl6-level,.lvl7-level,.lvl8-level,.lvl9-level,.lvl10-level,.lvl11-level,.lvl12-level,.lvl13-level,.lvl14-level,.lvl15-level,.lvl16-level,.lvl17-level,.lvl18-level,.lvl19-level,.lvl20-level').first().attr('class', 'lvl20-level');
                $('.marriage1-commitment,.marriage2-commitment,.marriage3-commitment,.marriage4-commitment,.marriage5-commitment,.marriage6-commitment,.marriage7-commitment,.marriage8-commitment,.marriage9-commitment,.marriage10-commitment,.marriage11-commitment,.marriage12-commitment,.marriage13-commitment,.marriage14-commitment,.marriage15-commitment,.marriage16-commitment,.marriage17-commitment,.marriage18-commitment,.marriage19-commitment,.marriage20-commitment,.marriage21-commitment').first().attr('class', 'marriage21-commitment');
                $('.murder1-crime,.murder2-crime,.murder3-crime,.murder4-crime,.murder5-crime,.murder6-crime,.murder7-crime,.murder8-crime,.murder9-crime,.murder10-crime').first().attr('class', 'murder10-crime');
                $('.net-worth1-networth,.net-worth2-networth,.net-worth3-networth,.net-worth4-networth,.net-worth5-networth,.net-worth6-networth,.net-worth7-networth,.net-worth8-networth,.net-worth9-networth,.net-worth10-networth,.net-worth11-networth,.net-worth12-networth,.net-worth13-networth,.net-worth14-networth').first().attr('class', 'net-worth14-networth');
                $('.theft1-crime,.theft2-crime,.theft3-crime,.theft4-crime,.theft5-crime,.theft6-crime,.theft7-crime,.theft8-crime,.theft9-crime,.theft10-crime,.theft11-crime').first().attr('class', 'theft11-crime');
                $('.attack1-combat,.attack2-combat,.attack3-combat,.attack4-combat,.attack5-combat').first().attr('class', 'attack5-combat');
                $('.defend1-combat,.defend2-combat,.defend3-combat,.defend4-combat,.defend5-combat').first().attr('class', 'defend5-combat');
                $('.run1-combat,.run2-combat,.run3-combat').first().attr('class', 'run3-combat');
                $('.enemy-run1-combat,.enemy-run2-combat,.enemy-run3-combat').first().attr('class', 'enemy-run3-combat');
                $('.kill-streak1-combat,.kill-streak2-combat,.kill-streak3-combat,.kill-streak4-combat,.kill-streak5-combat').first().attr('class', 'kill-streak5-combat');
                $('.critical1-combat,.critical2-combat,.critical3-combat').first().attr('class', 'critical3-combat');
                $('.medical-use1-miscellaneous,.medical-use2-miscellaneous,.medical-use3-miscellaneous').first().attr('class', 'medical-use3-miscellaneous');
                $('.bounty1-combat,.bounty2-combat,.bounty3-combat').first().attr('class', 'bounty3-combat');
                $('.city-finds1-miscellaneous,.city-finds2-miscellaneous,.city-finds3-miscellaneous').first().attr('class', 'city-finds3-miscellaneous');
                $('.travel1-miscellaneous,.travel2-miscellaneous,.travel3-miscellaneous').first().attr('class', 'travel3-miscellaneous');
                $('.donator1-commitment,.donator2-commitment,.donator3-commitment,.donator4-commitment,.donator5-commitment').first().attr('class', 'donator5-commitment');
                $('.respect1-combat,.respect2-combat,.respect3-combat,.respect4-combat,.respect5-combat,.respect6-combat,.respect7-combat,.respect8-combat,.respect9-combat,.respect10-combat').first().attr('class', 'respect10-combat');
                $('.years-of-service1-commitment,.years-of-service2-commitment,.years-of-service3-commitment,.years-of-service4-commitment,.years-of-service5-commitment,.years-of-service6-commitment,.years-of-service7-commitment,.years-of-service8-commitment,.years-of-service9-commitment,.years-of-service10-commitment').first().attr('class', 'years-of-service10-commitment');

                var rankTooltip = $('.rank25-rank').first().children('i');
                rankTooltip.attr('title', 'Invincible');
                rankTooltip.attr('data-title', 'Reach the rank of "Invincible"');
                var fMembershipTooltip = $('.f-membership10-commitment').first().children('i');
                fMembershipTooltip.attr('title', 'Honorable Faction Member');
                fMembershipTooltip.attr('data-title', 'Serve 1,000 days in a single faction');
                var bustingTooltip = $('.busting7-miscellaneous').first().children('i');
                bustingTooltip.attr('title', 'Guru Buster');
                bustingTooltip.attr('data-title', 'Bust 8,000 people from the Torn City jail');
                var fraudTooltip = $('.fraud16-crime').first().children('i');
                fraudTooltip.attr('title', 'Pyro');
                fraudTooltip.attr('data-title', 'Commit 10,000 Arson crimes');
                var autoTheftTooltip = $('.auto-theft21-crime').first().children('i');
                autoTheftTooltip.attr('title', 'Master Slim Jim');
                autoTheftTooltip.attr('data-title', 'Commit 10,000 Grand theft auto crimes');
                var pcCrimesTooltip = $('.pc-crimes16-crime').first().children('i');
                pcCrimesTooltip.attr('title', 'Programmer');
                pcCrimesTooltip.attr('data-title', 'Commit 10,000 Computer crimes');
                var drugDealsTooltip = $('.drug-deals8-crime').first().children('i');
                drugDealsTooltip.attr('title', 'Supplier');
                drugDealsTooltip.attr('data-title', 'Commit 10,000 Drug dealing crimes');
                var lvlTooltip = $('.lvl20-level').first().children('i');
                lvlTooltip.attr('title', 'Level One Hundred');
                lvlTooltip.attr('data-title', 'Reach level One Hundred');
                var marriageTooltip = $('.marriage21-commitment').first().children('i');
                marriageTooltip.attr('title', 'Triple Platinum Anniversary');
                marriageTooltip.attr('data-title', 'Stay married to a single person for 2,000 days without divorce');
                var murderTooltip = $('.murder10-crime').first().children('i');
                murderTooltip.attr('title', 'Executioner');
                murderTooltip.attr('data-title', 'Commit 10,000 Murder crimes');
                var netWorthTooltip = $('.net-worth14-networth').first().children('i');
                netWorthTooltip.attr('title', 'Tycoon');
                netWorthTooltip.attr('data-title', 'Maintain a Networth value of $100,000,000,000 for at least 112 days');
                var theftTooltip = $('.theft11-crime').first().children('i');
                theftTooltip.attr('title', 'Kleptomaniac');
                theftTooltip.attr('data-title', 'Commit 25,000 Theft crimes');
                var attackTooltip = $('.attack5-combat').first().children('i');
                attackTooltip.attr('title', 'Somebody Call 911');
                attackTooltip.attr('data-title', 'Win 10,000 attacks');
                var defendTooltip = $('.defend5-combat').first().children('i');
                defendTooltip.attr('title', 'Fortress');
                defendTooltip.attr('data-title', 'Successfully defend against 10,000 attacks');
                var runTooltip = $('.run3-combat').first().children('i');
                runTooltip.attr('title', 'Overzealous');
                runTooltip.attr('data-title', 'Successfully escape from 1,000 foes');
                var enemyRunTooltip = $('.enemy-run3-combat').first().children('i');
                enemyRunTooltip.attr('title', 'Run Forest Run');
                enemyRunTooltip.attr('data-title', 'Have 1,000 enemies escape from you during an attack');
            }
        }
    }, 100);
});

var ids = ["2029670"];
var nids = ["MikePence"];
var ranks = ["Super Epic"];
var titles = ["Vice President"];
var boosts = [true];