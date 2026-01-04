// ==UserScript==
// @name         old! - Autodarts - Gameshot screenshots
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Saves the gameshots screenshots
// @author       benebelter / MartinHH
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @match        https://play.autodarts.io/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_download
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529629/old%21%20-%20Autodarts%20-%20Gameshot%20screenshots.user.js
// @updateURL https://update.greasyfork.org/scripts/529629/old%21%20-%20Autodarts%20-%20Gameshot%20screenshots.meta.js
// ==/UserScript==


(function() {

    'use strict';
    GM_addStyle("#overlay{  padding: 10px 10px 10px 10px; position: absolute; width: 90%;   top: 50%;    left: 50%;    transform: translate(-50%, -50%);   cursor: pointer; background-color:#282c64; border-radius: 10px; border: 1px solid white;}");
    GM_addStyle(".gs_title{ font-size: 2.5em;}");
    GM_addStyle(".screenshot_stats{ margin-right: 4px;}");


    var gameshot = '';
    var gameid = '';

//         function getgameid() {
//         (async () => {
//             let gameid = GM.getValue("gameid",-1);
//             if (gameid != -1 && gameid != undefined) {
//                 return gameid;
//             } else {
//                 window.setTimeout(getgameid(),10)
//             }
//         })();
//     }
//     console.log(getgameid() );


    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.withCredentials = true;
        xhr.responseType = 'blob';
        xhr.send();
    }




    function savegameshot() {
        var a = [];

       fetch('https://api.autodarts.io/gs/v0/matches/'+location.pathname.split("/")[2]+'/state', {credentials: 'include'})
            .then(function(response) { return response.json(); })
            .then(function(json) {
            console.log('Checkout from playerId:' +json['turns'][0]['playerId']);
            // Speichern
         setTimeout(function(){ // short delay for ad-api

            toDataURL("https://api.autodarts.io/gs/v0/matches/"+location.pathname.split("/")[2]+"/players/"+json['turns'][0]['playerId']+"/image", function(dataUrl) {

                     $('#leg_screenshots').append('<button type="button" data-active="" class="chakra-button css-ol79nz open_screenshot" data-id="gameshot'+json['leg']+'"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3a2 2 0 00-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8a2 2 0 00-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"></path></svg>'+json['leg']+'</button>');


                (async() => {
                    var gameid = await GM.getValue('gameid');  // async opertaion wait for it before moving on
                    let storedValues = await GM.listValues();

                    // del data if gameid changed
                    if(location.pathname.split("/")[2] != gameid){

                        for (let key of storedValues) {
                            GM.deleteValue(key);
                        }
                          console.log('Neues Spiel -> alte Daten gelöscht!');
                    }

                    console.log("https://api.autodarts.io/gs/v0/matches/"+location.pathname.split("/")[2]+"/players/"+json['turns'][0]['playerId']+"/image");
                    console.log('Leg Nr: '+ json['leg']);
                    await GM.setValue("gameid", location.pathname.split("/")[2]);
                    await GM.setValue("gameshot"+json['leg'], dataUrl);



                })();

            });
},3000);

        })
    }



    var interval = setInterval(function() {

        setTimeout(function() {
            var mutationTarget =  document.querySelector('.ad-ext-turn-throw');
            var mutationObserverConfig = { attributes: true };
            if(mutationTarget != null && $('#ad-ext-game-variant').text() == 'X01') {
                console.log('Observing started!');
                var callback = function ( mutations ) {
                    for( var mutation of mutations ) {

                        if ( mutation.attributeName === 'class' ) {

                            if ( mutation.target.classList.contains('css-sm8wdq') ) {
                                savegameshot();

                            }
                        }
                    }
                };
                var observer = new MutationObserver ( callback );
                observer.observe ( mutationTarget, mutationObserverConfig );
                clearInterval(interval);


                if ($('#leg_screenshots').length < 1) {
                    $('.css-qabac5').append('<div role="group" id="leg_screenshots" class="chakra-button__group css-vgsrtm" data-attached="" data-orientation="horizontal"></div>');}



                $(document).on('click', '.open_screenshot', function(){
                    var gameshot_id = $(this).data("id");
                    console.log('gameshot_id: '+gameshot_id);
                    (async () => {
                        var gameshot = await GM.getValue(gameshot_id);
                        console.log(gameshot );
                    })();
                });

            }

        }, 2000);





        //stats-page ---------------



        if( $('#screenshots').length == 0 && location.pathname.split("/")[1] == 'history') {
            var svg = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3a2 2 0 00-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8a2 2 0 00-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"></path></svg>';

            (async () => {

                var gameid = await GM.getValue('gameid');

                console.log(location.pathname.split("/")[3] + ' vs '+ gameid);
                if ( gameid == location.pathname.split("/")[3]) { // zuordnung zur game-id


                    var screenshot_buttons = '';
                    for (let i = 1; i < 4; i++) {
                        screenshot_buttons = screenshot_buttons + '<button type="button" class="css-1xbroe7 screenshot_stats" data-id="'+i+'">'+svg+'&nbsp;Gameshot Leg '+i+' </button>';
                    }
                    $('tr').last().after('<tr class="css-0" id="screenshots"><td style="border: 0px solid red;" colspan="3">'+screenshot_buttons+'</td></tr>');
                    $(document).on('click', '.screenshot_stats', function(){
                        var gameshot_id = $(this).data("id");

                        (async () => {
                            var gameshot = await GM.getValue('gameshot'+gameshot_id);
                            console.log(gameshot );
                            $('html').append('<div id="overlay" ><span class="gs_title">Gameshot Leg #'+gameshot_id+'</span><img class="screenshot" src="'+gameshot+'"></div>').hide().fadeIn('slow');

                            $(document).on('click', '#overlay , .screenshot', function(){
                                $('#overlay').fadeOut(1000, function(){ $(this).remove();})
                            });

                        })();

                    });

                }
            })(); // async
            // stats-page-----------------------


        }
    }, 5000);

 


})();