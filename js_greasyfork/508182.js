// ==UserScript==
// @name         Autodarts - Show thrown darts each leg in stats
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Zeigt die Statistik besser an.
// @author       benebelter
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/508182/Autodarts%20-%20Show%20thrown%20darts%20each%20leg%20in%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/508182/Autodarts%20-%20Show%20thrown%20darts%20each%20leg%20in%20stats.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var players_highscores = new Array();
    var legsoverview  = new Array();
    let table_head = '';
    let table_rows = '';
    var shortlegs = new Array();
    var players = new Array();
    var several_highscores = new Array();
    var interval = setInterval(function() {


        if( $(".ad-ext-player-name").length != 0
           && window.location.href.indexOf("/history/matches/") != -1 ) {


            if(   $('#dartsthrows').length == 0) {
                var gameid =  location.pathname.split("/")[3] ;

                fetch('https://api.autodarts.io/as/v0/matches/'+gameid+'/stats', {
                    credentials: 'include',
                    method: 'GET'
                })
                    .then(function(response) { return response.json(); })
                    .then(function(json) {
                    let count_players = json['players'].length;
                    for (let i = 0; i < json['games'].length; i++){

                        if(i == 0) {// collect players
                            for (let p = 0; p < json['players'].length; p++) {

                                players.push  ({'id':p , 'name': json['players'][p]['name'] , 'playerid': json['players'][p]['id'] });
                                console.log('player pushed #'+ p +' = '+ json['players'][p]['name'] );
                                players_highscores[p] = [];
                                players_highscores[p]['PlayerGameId'] = p;
                                players_highscores[p]['playerId'] = json['players'][p]['id'];
                                players_highscores[p]['name'] = json['players'][p]['name'];
                                players_highscores[p]['60'] = 0;
                                players_highscores[p]['90'] = 0;
                                players_highscores[p]['100'] = 0;
                                players_highscores[p]['130'] = 0;
                                players_highscores[p]['170'] = 0;
                                players_highscores[p]['180'] = 0;
                                var tdDartsThrown = tdDartsThrown + '<td class="css-1fq7vy1" id="td_player_'+p+'"></td>';
                                var td90sThrown   = td90sThrown   + '<td class="css-1fq7vy1" id="td_player90s_'+p+'"></td>';
                                var td130sThrown  = td130sThrown  + '<td class="css-1fq7vy1" id="td_player130s_'+p+'"></td>';
                            }
                            // Get +90 and 130+ stats
                            json['games'].forEach((game) => {
                                game['turns'].forEach((turn) => {
                                    if(turn['points'] >= 60) {
                                        const thisplayerId = players_highscores.findIndex((item) => item.playerId === turn['playerId']);

                                        switch (true) {
                                            case (turn['points'] == 180):
                                                players_highscores[thisplayerId]['180'] ++;
                                                break;
                                            case (turn['points'] >=170):
                                                players_highscores[thisplayerId]['170'] ++;
                                                break;
                                            case (turn['points'] >=130):
                                                players_highscores[thisplayerId]['130'] ++;
                                                break;
                                            case (turn['points'] >=90):
                                                players_highscores[thisplayerId]['90'] ++;
                                                break;
                                            case (turn['points'] >=60):
                                                players_highscores[thisplayerId]['60'] ++;
                                                break;
                                        }
                                    }
                                });

                            });

                            // find html & add row to page
                            let appendDartsThrown = '<tr class="css-0" id="dartsthrows"><td class="css-1vmvwla">Darts legs won</td>'+tdDartsThrown+'</tr>';
                            let append90sThrown   = '<tr class="css-0" id="dartsthrows"><td class="css-1vmvwla">90+</td>'+td90sThrown+'</tr>';
                            let append130sThrown  = '<tr class="css-0" id="dartsthrows"><td class="css-1vmvwla">130+</td>'+td130sThrown+'</tr>';

                            if($('#dartsthrows').length == 0) {
                                $('.chakra-table > thead ').after(appendDartsThrown);

                                $('tr:has(td:contains("100+"))').hide();
                                $('tr:has(td:contains("140+"))').hide();
                                $('tr:has(td:contains("60+"))').after(append90sThrown);
                                $('tr:has(td:contains("100+"))').after(append130sThrown);
                            }

                        }

                        var winner = players.find(item => item.playerid === json['games'][i]['winnerPlayerId']);
                        var winner_name = winner['name'];
                        var winner_id = winner['id'];

                        //darts throwns
                        // welcher Spieler ist der Winner im aktuellen Leg gewesen?
                        let winnerindex = json['legStats'][i]['playerIndices'].indexOf(winner_id);
                        let dartsthrown = json['legStats'][i]['stats'][winnerindex]['dartsThrown'];

                        // Restscore other players this leg
                        for (let p = 0; p < json['players'].length; p++) {
                            var name = players.find(item => item.id === p);
                            table_rows += '<tr><td>'+name['name']+'</td>';
                            for (let i = 0; i < json['games'].length; i++){
                                table_rows += '<td>15d</td>';}
                            table_rows += '</tr>';

                            if( p == winnerindex) {var iswinner = 1;} else {var iswinner = 0;}
                            legsoverview.push  ( {'leg':i , 'playerid':p ,
                                                  'leftscore': json['games'][i]['scores'][p],
                                                  'iswinner': iswinner ,
                                                  'dartstrown':json['legStats'][i]['stats'][p]['dartsThrown']
                                                 } );
                        }
                        //build table
                        table_head = '<table><tr class=""><th class="" style="min-width: 40px; border-bottom: 1px solid #c0c0c0; border-right: 1px solid #c0c0c0;  ">Leg</th>';
                        for (let i = 0; i < json['games'].length; i++){
                            table_head += '<th class="text-center" style="min-width: 40px; border-bottom: 1px solid #c0c0c0; border-right: 1px solid #c0c0c0;  ">'+(i+1)+'</th>';
                        }

                        table_head += table_rows+'</tr></table>';

                        $('#td_player_'+winner_id).append('<span style="white-space:nowrap; background-color: #4162a1; color: white; border-radius: 10% / 50%; padding: 2px 5px 2px 5px; margin-left: 2px;">'+dartsthrown+'</span>');
                    }

                    // Display new scores
                    $("tr td:contains('130+')").each(function(){
                        for (let i = 0; i < count_players; i++) {
                            $(this).closest('td').nextAll().eq(i).text(players_highscores[i][130]);
                            $(this).closest('td').nextAll().eq(i).css("background", "var(--chakra-colors-table-background-odd)");
                            $(this).css("background", "var(--chakra-colors-table-background-odd)");
                        }
                    });

                    $("tr td:contains('90+')").each(function(){
                        for (let i = 0; i < count_players; i++) {
                            $(this).closest('td').nextAll().eq(i).text(players_highscores[i][90]);
                        }
                    });


                    $("tr td:contains('60+')").each(function(){
                        for (let i = 0; i < count_players; i++) {
                            $(this).closest('td').nextAll().eq(i).text(players_highscores[i][60]);
                        }
                    });

                    $("tr:nth-of-type(2n+1)").eq(7).css("background", "rgba(255, 255, 225, 0.0) "); // change background of 100+
                    //end stats

                }); // end-then



            } // end if $("#dartsthrows").length
        } // end if $(".ad-ext-player-name").length != 0

        $( ".chakra-button:contains('Leg')" ).on("click", function() {
            $( "#dartsthrows").hide();
            $('tr:has(td:contains("90+"))').hide();
            $('tr:has(td:contains("130+"))').hide();
            $('tr:has(td:contains("100+"))').show();
            $('tr:has(td:contains("140+"))').show();
        })
        $( ".chakra-button:contains('Match')" ).on("click", function() {
            $( "#dartsthrows").show();
            $('tr:has(td:contains("90+"))').show();
            $('tr:has(td:contains("130+"))').show();
            $('tr:has(td:contains("100+"))').hide();
            $('tr:has(td:contains("140+"))').hide();
        })
    }, 2000)

    })();