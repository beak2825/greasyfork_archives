// ==UserScript==
// @name         Autodarts - Rematch-Button for local matches
// @namespace    http://tampermonkey.net/
// @version      0.71
// @description  Rematch-Button on mainpage with the last 2-6 players
// @author       benebelter
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/502077/Autodarts%20-%20Rematch-Button%20for%20local%20matches.user.js
// @updateURL https://update.greasyfork.org/scripts/502077/Autodarts%20-%20Rematch-Button%20for%20local%20matches.meta.js
// ==/UserScript==


(function() {

    'use strict';
    var player1 = '';
    var player2 = '';
    var player3 = '';
    var player4 = '';
    var player5 = '';
    var player6 = '';
    var player1Id = '';
    var player2Id = '';
    var player3Id = '';
    var player4Id = '';
    var player5Id = '';
    var player6Id = '';
    var rematch = '';
    var player_clicked = 0;
    var gamemode = '';
    var startx01 = '';
    var variante = '';
    var firstto = '';
    var tosets = '';
    var gameconditions = '';
    var account;
    const players = [];
    var statedata = 0;
    var playerstart = 0;
    var data = '';
    const avcpuPPR = [0, 20, 30, 40, 50, 60 ,70 , 80 ,90 ,100, 110 ,120];

    function startgame(){
        $.ajax({
            url: 'https://api.autodarts.io/gs/v0/lobbies/'+location.pathname.split("/")[2]+'/start',
            data: data,
            type: 'POST',
            async: false,
            xhrFields: {
                withCredentials: true
            },
            success: function(start){
                (async () => {
                    await GM.deleteValue("player1");
                    await GM.deleteValue("player2");
                    await GM.deleteValue("player3");
                    await GM.deleteValue("player4");
                    await GM.deleteValue("player5");
                    await GM.deleteValue("player6");

                    for (let index = 0; index < start['players'].length; ++index) {
                        if(start['players'][index]['name'] != ''){

                            await GM.setValue("player"+(index+1), start['players'][index]['name'].toUpperCase()  );
                            await GM.setValue("player"+(index+1)+"Id", start['players'][index]['userId']   );
                        }
                    }
                    player_clicked = 0;
                })();
            }
        })
    }


    async function removeplayer(playerID) { //remove default player from lobby
        fetch('https://api.autodarts.io/gs/v0/lobbies/'+location.pathname.split("/")[2]+'/players/by-index/'+playerID,  {
            method: 'DELETE',
            credentials: 'include'
        })
    }

    async function addplayer(playername, boardID, avcpuPPR, userId) {
        if(typeof playername !== "undefined"  ) {

            if(playername.substring(0,9) === 'BOT LEVEL') { // bot-level
                var level = playername.substring(10);
                data = '{"name":"'+playername+'","cpuPPR":'+avcpuPPR[level]+'}'; }
            else if (userId != null ) { // account-player
                data ='{"name":"'+playername+'","boardId":"'+boardID+'" , "userId":"'+userId+'"}';
            }
            else { // local player
                data ='{"name":"'+playername+'","boardId":"'+boardID+'"}';
            }


            $.ajax({
                url: 'https://api.autodarts.io/gs/v0/lobbies/'+location.pathname.split("/")[2]+'/players',
                data: data,
                type: 'POST',
                contentType: "text/xml",
                dataType: "text",
                async: false,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {},
                error: function(e){}
            });
        }
    }




    // Load last players
    (async () => {
        player1 = await GM.getValue('player1');
        player2 = await GM.getValue('player2');
        player3 = await GM.getValue('player3');
        player4 = await GM.getValue('player4');
        player5 = await GM.getValue('player5');
        player6 = await GM.getValue('player6');

        player1Id = await GM.getValue('player1Id');
        player2Id = await GM.getValue('player2Id');
        player3Id = await GM.getValue('player3Id');
        player4Id = await GM.getValue('player4Id');
        player5Id = await GM.getValue('player5Id');
        player6Id = await GM.getValue('player6Id');
        gamemode = await GM.getValue('gamemode');
        startx01 = await GM.getValue('startx01');
        variante = await GM.getValue('variante');
        firstto = await GM.getValue('firstto');
        tosets = await GM.getValue('tosets');


        setInterval(function() {
            // Lobby autostart
            if( ($('button:contains("Open Lobby")').length != 0 || $('button:contains("Lobby öffnen")').length != 0)  && playerstart > 0) {
                $('button:contains("Off")').eq(0).click();
                $('button:contains("Private")').click();
            $('button:contains("Privat")').click();

                setTimeout(() => { $('button:contains("Open Lobby")').click(); $('button:contains("Lobby öffnen")').click(); }, 2000)

            }


            // add players and start game

            if( ($('button:contains("Start game")').length != 0 || $('button:contains("Spiel starten")').length != 0 )
               && player_clicked == 0 && playerstart > 0) {
                const boardID = $('.css-1h3944a option:selected').val();

                setTimeout(function(){

                    $('button:contains("Join")').addClass("account css-1e89954");
                    $('.account').css('color', 'yellow') ;
                    $('.account').text(account);

                }, 200);

                const delay = 800;
                setTimeout(function(){  startgame(); }, (delay*8));
                // Player 1 starts
                if(playerstart == 1){
                    setTimeout(function(){removeplayer(0);}, (delay*1));
                    setTimeout(function(){addplayer(player1, boardID,avcpuPPR, player1Id); }, (delay*2));
                    setTimeout(function(){addplayer(player2, boardID,avcpuPPR, player2Id); }, (delay*3));
                    setTimeout(function(){addplayer(player3, boardID,avcpuPPR, player3Id); }, (delay*4));
                    setTimeout(function(){addplayer(player4, boardID,avcpuPPR, player4Id); }, (delay*5));
                    setTimeout(function(){addplayer(player5, boardID,avcpuPPR, player5Id); }, (delay*6));
                    setTimeout(function(){addplayer(player6, boardID,avcpuPPR, player6Id); }, (delay*7));
                }
                if(playerstart == 2){  // Player 2 starts
                    setTimeout(function(){removeplayer(0);}, (delay*1));
                    setTimeout(function(){addplayer(player2, boardID,avcpuPPR, player2Id); }, (delay*2));
                    setTimeout(function(){addplayer(player3, boardID,avcpuPPR, player3Id); }, (delay*3));
                    setTimeout(function(){addplayer(player4, boardID,avcpuPPR, player4Id); }, (delay*4));
                    setTimeout(function(){addplayer(player5, boardID,avcpuPPR, player5Id); }, (delay*5));
                    setTimeout(function(){addplayer(player6, boardID,avcpuPPR, player6Id); }, (delay*6));
                    setTimeout(function(){addplayer(player1, boardID,avcpuPPR, player1Id); }, (delay*7));
                }
                if(playerstart == 3){  // Player 3 starts

                    setTimeout(function(){removeplayer(0);}, (delay*1));
                    setTimeout(function(){addplayer(player3, boardID,avcpuPPR, player3Id); }, (delay*2));
                    setTimeout(function(){addplayer(player4, boardID,avcpuPPR, player4Id); }, (delay*3));
                    setTimeout(function(){addplayer(player5, boardID,avcpuPPR, player5Id); }, (delay*4));
                    setTimeout(function(){addplayer(player6, boardID,avcpuPPR, player6Id); }, (delay*5));
                    setTimeout(function(){addplayer(player1, boardID,avcpuPPR, player1Id); }, (delay*6));
                    setTimeout(function(){addplayer(player2, boardID,avcpuPPR, player2Id); }, (delay*7));
                }
                if(playerstart == 4){ // Player 4 starts
                    setTimeout(function(){removeplayer(0);}, (delay*1));
                    setTimeout(function(){addplayer(player4, boardID,avcpuPPR, player4Id); }, (delay*2));
                    setTimeout(function(){addplayer(player5, boardID,avcpuPPR, player5Id); }, (delay*3));
                    setTimeout(function(){addplayer(player6, boardID,avcpuPPR, player6Id); }, (delay*4));
                    setTimeout(function(){addplayer(player1, boardID,avcpuPPR, player1Id); }, (delay*5));
                    setTimeout(function(){addplayer(player2, boardID,avcpuPPR, player2Id); }, (delay*6));
                    setTimeout(function(){addplayer(player3, boardID,avcpuPPR, player3Id); }, (delay*7));
                }
                if(playerstart == 5){ // Player 5 starts
                    setTimeout(function(){removeplayer(0);}, (delay*1));
                    setTimeout(function(){addplayer(player5, boardID,avcpuPPR, player5Id); }, (delay*2));
                    setTimeout(function(){addplayer(player6, boardID,avcpuPPR, player6Id); }, (delay*3));
                    setTimeout(function(){addplayer(player1, boardID,avcpuPPR, player1Id); }, (delay*4));
                    setTimeout(function(){addplayer(player2, boardID,avcpuPPR, player2Id); }, (delay*5));
                    setTimeout(function(){addplayer(player3, boardID,avcpuPPR, player3Id); }, (delay*6));
                    setTimeout(function(){addplayer(player4, boardID,avcpuPPR, player4Id); }, (delay*7));
                }
                if(playerstart == 6){ // Player 6 starts
                    setTimeout(function(){removeplayer(0);}, (delay*1));
                    setTimeout(function(){addplayer(player6, boardID,avcpuPPR, player6Id); }, (delay*2));
                    setTimeout(function(){addplayer(player1, boardID,avcpuPPR, player1Id); }, (delay*3));
                    setTimeout(function(){addplayer(player2, boardID,avcpuPPR, player2Id); }, (delay*4));
                    setTimeout(function(){addplayer(player3, boardID,avcpuPPR, player3Id); }, (delay*5));
                    setTimeout(function(){addplayer(player4, boardID,avcpuPPR, player4Id); }, (delay*6));
                    setTimeout(function(){addplayer(player5, boardID,avcpuPPR, player5Id); }, (delay*7));
                }

                player_clicked = 1;
            }

            // add Rematch-button to mainpage
            if(   player1 !=''
               && player2 !=''
               && $('.rematch_button').length == 0
               && typeof(player1) !== "undefined"
               && player1 !== null
               && typeof(player2) !== "undefined"
               && player2 !== null
               && gamemode !== undefined)
            {
                if(gamemode.toUpperCase()  == 'X01') {
                    var gameconditions = startx01 + ' | ' +variante   ;
                    if (typeof firstto !== "undefined" ) { gameconditions = gameconditions + ' | ' + 'First to '+firstto+ ' Legs'}
                    if (typeof tosets !== "undefined" ) { gameconditions = gameconditions + ' / '+tosets+ ' Sets' ; }
                }
                else if(gamemode == 'Count Up') {
                    gameconditions = 'Count-Up'; gamemode='count-up';
                }
                else {

                    if( variante == undefined ) { var variantetext = '';}
                    else { var variantetext = ' | '+ variante;}

                    var gameconditions = gamemode + variantetext  ;
                }

                // Load last players
                (async () => {
                    player1 = await GM.getValue('player1');
                    player2 = await GM.getValue('player2');
                    player3 = await GM.getValue('player3');
                    player4 = await GM.getValue('player4');
                    player5 = await GM.getValue('player5');
                    player6 = await GM.getValue('player6');

                    var mainmenu = '<div><div class="chakra-stack css-1aucrbz"><span style="font-size: 2.5em;">REMATCH</span><div style="font-size: 1em; min-height: 30px; " >'+gameconditions+'</div><a class="css-z1xk1r rematch_button" href="#" style="font-size: 1em; min-height: 50px; width: 500px;" data-id="1"><span style="font-size: 1.5em;" >'+player1+'</span>&nbsp;&nbsp;to throw first</a><a class="css-z1xk1r rematch_button" href="#" style="font-size: 1em; min-height: 50px; width: 500px; " data-id="2"><span style="font-size: 1.5em;">'+player2+'</span>&nbsp;&nbsp;to throw first</a>';

                    // 3. Spieler?
                    if( typeof(player3) !== "undefined" && player3 !== ''){
                        mainmenu += '<a class="chakra-button css-z1xk1r rematch_button"  href="#" style="font-size: 1em; min-height: 50px; width: 500px;" data-id="3"> <span style="font-size: 1.5em;" data-id="3">'+player3+'</span>&nbsp;&nbsp;to throw first</a>';
                    }
                    // 4. Spieler?
                    if( typeof(player4) !== "undefined" && player4 !== null){
                        mainmenu += '<a class="chakra-button css-z1xk1r rematch_button" href="#" style="font-size: 1em; min-height: 50px; width: 500px;" data-id="4"> <span style="font-size: 1.5em;" >'+player4+'</span>&nbsp;&nbsp;to throw first</a>';
                    }
                    // 5. Spieler?
                    if( typeof(player5) !== "undefined" && player5 !== null){
                        mainmenu += '<a class="chakra-button css-z1xk1r rematch_button" href="#" style="font-size: 1em; min-height: 50px; width: 500px;" data-id="5"> <span style="font-size: 1.5em;" >'+player5+'</span>&nbsp;&nbsp;to throw first</a>';
                    }
                    // 6. Spieler?
                    if( typeof(player6) !== "undefined" && player6 !== null){
                        mainmenu += '<a class="chakra-button css-z1xk1r rematch_button" href="#" style="font-size: 1em; min-height: 50px; width: 500px;" data-id="6"> <span style="font-size: 1.5em;" >'+player6+'</span>&nbsp;&nbsp;to throw first</a>';
                    }

                    $('.css-1aucrbz').first().prepend(mainmenu+'</div>');

                })();

            }



            // only on own match-page::
            if( ($('button:contains("Abort")').length != 0 || $('button:contains("Abbrechen")').length != 0  )
                && statedata != 1
                && location.pathname.split("/")[1] === 'matches'
                && $('#ad-ext-game-variant').text() != "Bull-off") {
                    fetch('https://api.autodarts.io/gs/v0/matches/'+location.pathname.split("/")[2]+'/state', {credentials: 'include'})
                    .then(function(response) { return response.json(); })
                    .then(function(json) {
                                          if( typeof json['error'] !== "undefined" ){
                                              console.log('ERROR');
                                              return; //stop the execution of function
                                          }
                                          (async() => {
                                              let storedValues = await GM.listValues();
                                              for (let key of storedValues) {
                                                  await GM.deleteValue(key);
                                              }

                                              statedata = 1;
                                              player_clicked = 0;
                                              playerstart = 0;
                                              for (let i = 0; i < json.players.length; i++) {
                                                  if(i == 0){ player1 = json['players'][0]['name'];
                                                            player1Id = json['players'][0]['userId'];}
                                                  if(i == 1){ player2 = json['players'][1]['name'];}
                                                  if(i == 2){ player3 = json['players'][2]['name'];}
                                                  if(i == 3){ player4 = json['players'][3]['name'];}
                                                  if(i == 4){ player5 = json['players'][4]['name'];}
                                                  if(i == 5){ player6 = json['players'][5]['name'];}
                                              }

                                              gamemode = json['variant'];
                                              startx01 = json['settings']['baseScore'];
                                              if( json['settings']['inMode'] == undefined) {
                                                  variante = json['settings']['Mode'];
                                              }
                                              else { variante =  json['settings']['inMode'][0] +'I/' + json['settings']['outMode'][0]+ 'O';
                                                   }
                                              firstto  = json['legs'];
                                              tosets = json['sets'];
                                              (async () => {

                                                  await GM.setValue("gamemode" , gamemode ); // x01
                                                  await GM.setValue("startx01" , startx01 ); // 501
                                                  await GM.setValue("variante" , variante ); // SI/DO
                                                  await GM.setValue("firstto" , firstto ); // int
                                                  await GM.setValue("tosets" , tosets ); // int
                                              })();

                                              for (let index = 0;  index < json['players'].length;   ++index) {
                                                  if(json['players'][index]['name'] != ''){
                                                      (async () => {
                                                          await GM.setValue("player"+(index+1), json['players'][index]['name']  ); // .toUpperCase()?
                                                          await GM.setValue("player"+(index+1)+"Id", json['players'][index]['userId']);


                                                      })();
                                                  }
                                              }
                                          })(); // end async
                                         });
            }

        },100); // end-interval
    })();

    $(document).on('click', '.css-u7txwc', function(){ // $('button:contains("Start game"), $('button:contains("Spiel starten")
        statedata = 0;
    })

    $(document).on ('click', '.rematch_button',function() {
        playerstart = $(this).data("id");
        setTimeout(function(){
            if(gamemode == "ATC"){ gamemode = 'Around the Clock';}
            if(gamemode == "RTW"){ gamemode = 'Round the World';}
            if(gamemode == "CountUp"){ gamemode = 'Count Up';}
            $('.chakra-button:contains("'+gamemode+'")')[0].click();

        }, 100);
    });

})();