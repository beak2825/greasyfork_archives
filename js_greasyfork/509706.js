// ==UserScript==
// @name         Autodarts - Calibration-Button in Lobby & Game [just implemented into AD :-)]
// @namespace    http://tampermonkey.net/
// @version      0.52
// @description  Inserts a calibration-button in lobby & game
// @match        https://play.autodarts.io/*
// @include      http://*:3180/monitor?autocalibration*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_addStyle
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @grant        GM_openInTab
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/509706/Autodarts%20-%20Calibration-Button%20in%20Lobby%20%20Game%20%5Bjust%20implemented%20into%20AD%20%3A-%29%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/509706/Autodarts%20-%20Calibration-Button%20in%20Lobby%20%20Game%20%5Bjust%20implemented%20into%20AD%20%3A-%29%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';


    GM_addStyle("#overlay_text {position: absolute;  top: 50%;  left: 50%;  font-size: 40px;  color: white;  transform: translate(-50%,-50%);  -ms-transform: translate(-50%,-50%); } ");
    GM_addStyle("#overlay_div {position: fixed;  display: none;  width: 100%;  height: 100%;  top: 0;  left: 0;  right: 0;  bottom: 0;  background-color: rgba(0,0,0,0.5);  z-index: 2;  cursor: pointer;}");

    var boards = [];

    const overlay = '<div id="overlay_div"><div id="overlay_text">Board is currently being calibrated...</div></div>';



    function observe_calibration() {
       var cali_observe = setInterval(function(){
            (async () => {
                const cali_status = await GM.getValue('cali_status');
                console.log('cali_status: ' + cali_status)
                if(cali_status == 1) {

                   // $('#overlay_div').show();
                }
                else {

                    $('#overlay_div').hide();
                    $('button:contains("Reset")').click(); //
                    clearInterval(cali_observe);
                    console.log('Calibration finished!');
                }

            })();

        }, 500);
    };


    function calibrate(ip, boardId){
        // set cookie
        (async () => {
            await GM.setValue("cali_status" , 1 );
        })();

        $.ajax({
            url: 'http://'+ip+'/api/config/calibration/auto?distortion=true',
            type: 'POST',
            asynch: false,
            contentType: "application/json",
            success: function(response){
                console.log('Board has been calibrated!');
                document.title = 'Calibration finished!';

                (async () => {
                    await GM.setValue("cali_status" , 0 );

                })();

               window.close();
            }  ,
            error : function(){
                //console.log('window closed!')
//                 (async () => {
//                     await GM.setValue("cali_status" , 0 );
//                 })();
//                 window.close();
            }
        });
    }

    function startBoard(ip, boardId) {
        $.ajax({
            type: 'PUT',
            url: 'http://'+ip+'/api/start',
        }).done(function () {
            console.log('Start board: SUCCESS '+boardId);
            calibrate(ip, boardId);

        }).fail(function (msg) {
            console.log('Start: FAIL '+boardId);

        }).always(function (msg) {

        });


    }

    var loop  = setInterval(function(){
        if(location.pathname.split("/")[1] == 'matches' && $('.css-f2usph').length && $('#ad-ext-game-variant').text() != 'Bull-off')  {
            var button = '<button type="button" class="chakra-button css-1cd9b6o" id="calibutton_game"><span class="chakra-button__icon css-1wh2kri"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" aria-hidden="true" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M200.8 157.2l-36.4 37.4L411.7 448l36.3-37.4zM181 64h37v68h-37zM181 262h37v68h-37zM270 176h69v37h-69zM305.6 115.8l-25.7-26.3-47.1 48.3 25.6 26.2zM168.8 137.8l-47.1-48.3-25.6 26.3 47.1 48.2zM96.1 277.9l25.6 26.2 47.1-48.2-25.6-26.3zM64 176h65v37H64z"></path></svg></span>Calibrate</button>';

            $('.css-f2usph').after(button);
            $(document.body).append(overlay);
            $( "#overlay_div" ).on( "click", function() {
                $("#overlay_div").hide();

            });


            clearInterval(loop);
        }
    }, 500);



    $(document).on('click','#calibutton_game', function(){
        $('#overlay_div').show();
        var board_found = 0;
        $('button:contains("Reset")').click(); // get new token
        console.log('getting new token');
        window.setTimeout(function(){ // wait for token
            $.ajax({
                url: 'https://api.autodarts.io/gs/v0/matches/'+location.pathname.split("/")[2],
                type: 'GET',
                asynch: false,
                xhrFields: {
                    withCredentials: true
                },
                success: function(response_game){
                    for (let b = 0; b < Object.values(response_game.players).length; b++) { // player-boards to array

                        if( boards.indexOf(Object.values(response_game.players)[b]['boardId']) == -1) {
                            boards.push(Object.values(response_game.players)[b]['boardId']);
                           // console.log('board pushed to array:'+ Object.values(response_game.players)[b]['boardId'])
                        }
                    }
                },
                error:function(response_game){  console.log(response_game.status);}
            });


        $.ajax({
            url: 'https://api.autodarts.io/bs/v0/boards',
            type: 'GET',
            asynch: false,
            xhrFields: {
                withCredentials: true
            },
            success: function(response){

                for (let i = 0; i < response.length; i++)
                    if( response[i]['state']['connected'] == true && boards.includes(response[i]['id']) == true) {
                        var status =  response[i]['state']['status'];
                        (async () => {
                            await GM.setValue("calibration" , 1 );
                            observe_calibration() ;

                        })();
                        GM_openInTab("http://"+response[i]['ip']+'/monitor?autocalibration=1&boardID='+response[i]['id']+'&status='+status , true);
                        board_found++;
                    }
                    else {
                        console.log('Board not connected or owned? ID: '+   response[i]['id']);
                    }
                if(board_found == 0) {
                    $("#overlay_div").hide();
                    alert('No Board found!');
                }
            }
        });
             }, 2500);
    });

    ///////////////////////////////////

    $(document).on('click','button:contains("Open Lobby")', function(){ // insert button
        setTimeout(function() {
            var button =  '<button type="button" class="chakra-button css-15w88gn" id="calibutton_lobby"><span class="chakra-button__icon css-1wh2kri"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" aria-hidden="true" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M200.8 157.2l-36.4 37.4L411.7 448l36.3-37.4zM181 64h37v68h-37zM181 262h37v68h-37zM270 176h69v37h-69zM305.6 115.8l-25.7-26.3-47.1 48.3 25.6 26.2zM168.8 137.8l-47.1-48.3-25.6 26.3 47.1 48.2zM96.1 277.9l25.6 26.2 47.1-48.2-25.6-26.3zM64 176h65v37H64z"></path></svg></span>Calibrate</button>';
            $('.css-42b2qy').after(button);
        }, 3000);

    });


    $(document).on('click','#calibutton_lobby', function(){
        var board_found = 0;
        const boardID = $('.css-1wq9qmd').eq(0).find(":selected").val();
        console.log( 'Selected  boardID: '+ boardID);
        console.log('calibration starting...');

        $(document.body).append(overlay);
        $('#overlay_div').show();
        $( "#overlay_div" ).on( "click", function() {
            $("#overlay_div").hide();

        });
        observe_calibration();

        $.ajax({
            url: 'https://api.autodarts.io/bs/v0/boards',
            type: 'GET',
            asynch: false,
            xhrFields: {
                withCredentials: true
            },
            success: function(response){
                console.log(response);
                for (let i = 0; i < response.length; i++)
                    if( response[i]['state']['connected'] == true && response[i]['id'] == boardID) {

                        var status = response[i]['state']['status'];
                        console.log('Status: ' + status);
                        console.log(response[i]);
                        GM_openInTab("http://"+response[i]['ip']+'/monitor?autocalibration=1&boardID='+boardID+'&status='+status , true);
                        board_found++;

                    }
                    else {
                        console.log('Board not connected oder wrong id: '+   response[i]['id'] + ' - Board-Status: '+response[i]['state']['status']);

                    }

                if(board_found == 0) {
                     $("#overlay_div").hide();
                    alert('No Board found!');
                }
            }
        });
    });

    ////////////////////

    var urlparm = (new URL(location.href)).searchParams.get('autocalibration');
    if(urlparm) {
        var boardID = (new URL(location.href)).searchParams.get('boardID');
        var status = (new URL(location.href)).searchParams.get('status');

        if (status === 'Stopped') {
            document.title = 'Board stopped -> starting board';
            startBoard(location.hostname+':3180', boardID);
            setTimeout(function() {
                document.title = 'Starting calibration';
                calibrate(location.hostname+':3180', boardID);
            }, 10000);
        }
        else {
           document.title = 'Starting calibration';
            calibrate(location.hostname+':3180', boardID);
        }
    }

})();