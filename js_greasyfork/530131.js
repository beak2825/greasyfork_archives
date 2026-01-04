// ==UserScript==
// @name         Autodarts - Gameshot screenshots
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  Saves the gameshots screenshots
// @author       benebelter / MartinHH
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @match        https://play.autodarts.io/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_download
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530131/Autodarts%20-%20Gameshot%20screenshots.user.js
// @updateURL https://update.greasyfork.org/scripts/530131/Autodarts%20-%20Gameshot%20screenshots.meta.js
// ==/UserScript==


(function() {


    function remember_turn_on_each_dart() {
        fetch('https://api.autodarts.io/us/v0/profile/settings', {credentials: 'include'})
            .then(function(response) { return response.json(); })
            .then(function(json) {
            if (json.countEachThrow == false)
            {alert('You have to enable "Count each throw" to make this script running.');
             $('.css-10zm3od').click();
             $(".chakra-menu__menuitem-option[value='score']").css('border','1px solid red');

            }
            console.log('https://api.autodarts.io/gs/v0/matches/'+location.pathname.split("/")[2]+'/state');
        })


    }



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




    function savegameshot( ) {


       fetch('https://api.autodarts.io/gs/v0/matches/'+location.pathname.split("/")[2]+'/state', {credentials: 'include'})
            .then(function(response) { return response.json(); })
           .then(function(json) {
          // console.log('Throw from playerId:' +json['turns'][0]['playerId']);
          // console.log(json);

           // Speichern

           //   delay for AD-API to generate picture
           setTimeout(function(){


     //        $('.winnerAnimation  > .chakra-button').click();
            toDataURL("https://api.autodarts.io/gs/v0/matches/"+location.pathname.split("/")[2]+"/players/"+json['turns'][0]['playerId']+"/image", function(dataUrl) {

                   //  $('#leg_screenshots').append('<button type="button" data-active="" class="chakra-button css-ol79nz open_screenshot" data-id="gameshot_'+json['leg']+'"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3a2 2 0 00-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8a2 2 0 00-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"></path></svg>'+json['leg']+'</button>');


                (async() => {
                    var gameid = await GM.getValue('gameid');  // async opertaion wait for it before moving on
                    let storedValues = await GM.listValues();

                    // del data if gameid changed
                    if(location.pathname.split("/")[2] != gameid){
                        for (let key of storedValues) {
                            await GM.deleteValue(key);
                        }
                          console.log('Neues Spiel -> alte Daten gelöscht!');
                      console.log( 'alte gameid: '+ gameid+' <-> neue gameid '+location.pathname.split("/")[2] )
                    }

                    console.log("https://api.autodarts.io/gs/v0/matches/"+location.pathname.split("/")[2]+"/players/"+json['turns'][0]['playerId']+"/image");
                    console.log('Leg Nr: '+ json['leg']);
                    await GM.setValue("gameid", location.pathname.split("/")[2]);
                    if( dataUrl.length > 1000) {
                        await GM.setValue("gameid", location.pathname.split("/")[2]);
                        await GM.setValue("gameshot_"+json['leg'], dataUrl);
                        console.log('dataUrl Länge: '+dataUrl.length);
                    }
                    else {console.log ('Foto nicht gespeichert! Länge: '+dataUrl.length);}

                })();

            });
},5000);  // 5s to generate pic

        })
    }



    var interval = setInterval(function() {

        setTimeout(function() {
            var mutationTarget =  document.querySelector('#ad-ext-player-display');// v1: .ad-ext-turn-throw v2(1.version) #ad-ext-turn // #ad-ext-player-display css-1j0bqop
            //     var mutationObserverConfig = { attributes: true }; // v1
            var mutationObserverConfig = { characterData: true, attributes: false, childList: false, subtree: true };

            if(mutationTarget != null && $('#ad-ext-game-variant').text() == 'X01') {
                console.log('Observing started!');
                remember_turn_on_each_dart();
                var callback = function ( mutations ) {
                    for( var mutation of mutations ) {
                         var nodeType = parseInt(mutation.target.nodeType.attributes);
                        let className =  mutation.target.parentNode.className.toString()  ;

                        var score = $('.ad-ext-player-active > .chakra-stack > .ad-ext-player-score').text();
                        console.log ('score: '+ score);

                        if (   score < 50
                            && className.includes("ad-ext-player-score")

                              ) {

                            console.log('start screenshot...');
                            savegameshot();
                        }
                    }
                };
                var observer = new MutationObserver ( callback );
                //observer.observe ( mutationTarget, mutationObserverConfig );
                $(this).each(function() { // https://stackoverflow.com/questions/58410699/how-to-make-one-mutationobserver-listen-for-changes-on-multiple-elements
                    observer.observe(mutationTarget,  mutationObserverConfig);
                });


                clearInterval(interval);


                if ($('#leg_screenshots').length < 1) {
                    $('.css-qabac5').append('<div role="group" id="leg_screenshots" class="chakra-button__group css-vgsrtm" data-attached="" data-orientation="horizontal"></div>');}



//                 $(document).on('click', '.open_screenshot', function(){
//                     var gameshot_id = $(this).data("id");
//                     console.log('gameshot_id: '+gameshot_id);
//                     (async () => {
//                         var gameshot = await GM.getValue(gameshot_id);
//                         console.log(gameshot );
//                     })();
//                 });

            }

        }, 10);





        //stats-page ---------------



        if( $('#screenshots').length == 0 && location.pathname.split("/")[1] == 'history') {
            var svg = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3a2 2 0 00-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8a2 2 0 00-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"></path></svg>';

            (async () => {

                var gameid = await GM.getValue('gameid');

                console.log(location.pathname.split("/")[3] + ' vs '+ gameid);
                if ( gameid == location.pathname.split("/")[3]) { // zuordnung zur game-id


                    var screenshot_buttons = '';
                    // Zählen
                     var countgs = 0;
                    let storedValues = await GM.listValues();
                    for (var key in storedValues) {
                        var value = storedValues[key];
                        console.log(key, value);
                        if (value.startsWith("gameshot")) { countgs = countgs +1; };
                    }
                    console.log(countgs);

                    for (let key of storedValues) {
                        var keygameshot =  await GM.getValue(key);
                    }

                    for (let i = 1; i <= countgs; i++) {
                        screenshot_buttons = screenshot_buttons + '<button type="button" class="css-1xbroe7 screenshot_stats" data-id="'+i+'">'+svg+'&nbsp;Gameshot Leg '+i+' </button>';
                    }
                    $('tr').last().after('<tr class="css-0" id="screenshots"><td style="border: 0px solid red;" colspan="3">'+screenshot_buttons+'</td></tr>');
                    $(document).on('click', '.screenshot_stats', function(){
                        var gameshot_id = $(this).data("id");

                        (async () => {
                            var gameshot = await GM.getValue('gameshot_'+gameshot_id);
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