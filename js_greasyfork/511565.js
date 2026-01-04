// ==UserScript==
// @name         Autodarts - Permanente Lobby-Namen
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  Namen aller Spieler des Vereins/Clubs
// @author       Greasyfork: MartinHH / AD: benebelter
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/511565/Autodarts%20-%20Permanente%20Lobby-Namen.user.js
// @updateURL https://update.greasyfork.org/scripts/511565/Autodarts%20-%20Permanente%20Lobby-Namen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (new Date().getDay() != 1) {
        var players = ["Altmeister","Ben","Chris","Clemens","Ebel","Frank","Hartmut","Martin","Max","Nils","Olli","Roger","Thorsten","Torsten","Volker"];
    }
    else {
        var players = ["Frank", "Thorsten", "Björn", "Monier", "Juri", "Justin", "Vogel", "Daniel", "Paul"];
    }
players.sort();

    GM_addStyle(".css-ut3x8m {overflow: auto;} ");
    GM_addStyle(".addplayer {  display: inline-flex;  appearance: none;  -moz-box-align: center;  align-items: center;  -moz-box-pack: center;  justify-content: center;user-select: none;  position: relative;  white-space: nowrap; vertical-align: middle;  outline: transparent solid 2px;  outline-offset: 2px;  line-height: 1.2;  border-radius: var(--chakra-radii-md);  font-weight: var(--chakra-fontWeights-semibold);  transition-property: var(--chakra-transition-property-common);transition-duration: var(--chakra-transition-duration-normal);  height: var(--chakra-sizes-8);  min-width: var(--chakra-sizes-8);  font-size: var(--chakra-fontSizes-sm);  padding-inline-start: var(--chakra-space-3);  padding-inline-end: var(--chakra-space-3);  background: var(--chakra-colors-whiteAlpha-200);  color: var(--chakra-colors-whiteAlpha-900);} ");

    function removeplayer(playerID) {
        fetch('https://api.autodarts.io/gs/v0/lobbies/'+location.pathname.split("/")[2]+'/players/by-index/'+playerID,  {
            method: 'DELETE',
            credentials: 'include',
        })
    }

    function addplayer(playername, boardID, avcpuPPR) {
        if(typeof playername !== "undefined"  ) {

            if(playername.substring(0,9) === 'BOT LEVEL') {
                var level = playername.substring(10);
                console.log('Level: '+ level);
                var data = '{"name":"'+playername+'","cpuPPR":'+avcpuPPR[level]+'}'; }
            else {
                var data ='{"name":"'+playername+'","boardId":"'+boardID+'"}';

            }

            $.ajax({
                url: 'https://api.autodarts.io/gs/v0/lobbies/'+location.pathname.split("/")[2]+'/players',
                data: data,
                type: 'POST',
                contentType: "text/xml",
                dataType: "text",
                asynch: false,

                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {   },
                error: function(e){}
            });


        }

    }

    $(document).on('click','button:contains("Open Lobby"), button:contains("Lobby öffnen")', function(){

        var search_start_button = setInterval(function() {

            if( ($('button:contains("Start game")').length != 0 || $('button:contains("Spiel starten")').length != 0)  && location.pathname.split("/")[1] == 'lobbies' && $('.addplayer').length == 0) {


                for (let index = 0; index < players.length; ++index) {
                    if(index == 0) {
                        $(".css-ut3x8m:last-child").after('</div><div class="chakra-stack css-ut3x8m" style="margin-top: 6px;"><img src="https://gravatar.com/avatar/652bde6ce9c5fbc58a5a8f33c9340fda?d=404&s=32">');
                    }
                    if(index == 10) {
                        $(".css-ut3x8m:last-child").after('</div><div class="chakra-stack css-ut3x8m" style="margin-top: 6px;">');
                    }

                    $(".css-ut3x8m:last-child").append('<button type="button" class="chakra-button css-1e89954 addplayer">'+players[index]+'</button>');


                }
                clearInterval(search_start_button);
                const boardID = $('.css-1h3944a option:selected').val();

                 setTimeout(function(){removeplayer(0);}, (200));

                $('.addplayer').on( "click", function() {
                    addplayer( $(this).text(), boardID, 80) ;
                });
            }

        }, 1000);


    });


})();     