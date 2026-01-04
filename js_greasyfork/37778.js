// ==UserScript==
// @name        Discord Youtube
// @version     0.02
// @author      lolamtisch@gmail.com
// @license     Creative Commons; http://creativecommons.org/licenses/by/4.0/
// @supportURL  https://discord.gg/cTH4yaw
// @include     /^https?:\/\/(www\.)?youtube\.com\/watch/
//
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
//
// @require     https://greasyfork.org/scripts/33416-discord-io/code/discordio.js?version=240880
//
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @namespace https://greasyfork.org/users/92233
// @description Sets the discord playing state
// @downloadURL https://update.greasyfork.org/scripts/37778/Discord%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/37778/Discord%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interval = 10000;

    if( window.location.href.indexOf("youtube") > -1 ){
    	$.docReady = function(data) {
    	    return $( document).ready(data);
    	};

    	$.getTitle = function(){
    	    return document.title;
    	};
    }

    function urlToEpisode(url){
        return '';
    }

    $.docReady(function (){
        var token = '';

        if(GM_getValue('token', 0)){
            token = GM_getValue('token');
        }else{
            token = prompt("Please enter your token.\nCheck the description for more information");
            GM_setValue('token', token);
        }

        var client = new Discord.Client({
            token: token,
            autorun: true
        });

        client.on('ready', function() {
            console.log("%s (%s)... in the browser!", client.username, client.id);
            GM_deleteValue('timeLeft');
            setInterval(function(){ setgame(); }, interval);
            setgame();
        });

        client.on('disconnect', function(errMsg, code) {
            alert(errMsg);
            if(code == 4004){
                GM_deleteValue('token');
            }
        });

        function setgame() {
            var timeLeft = getTimeleft();

            if( timeLeft == '' && GM_getValue('timeLeft', '') != ''){
                timeLeft = GM_getValue('timeLeft', '');
                GM_deleteValue('timeLeft');
            }

            var episode = urlToEpisode(window.location.href);
            if(episode == null || episode == 0 || isNaN(episode)){
                episode = '';
            }else{
                episode = 'Ep. '+ episode;
            }
            client.setPresence({
                game:{
                    name: $.getTitle().trim() +" "+ episode +" "+ timeLeft ,
                    type: 3
                }
            });
            console.log('Set Game', $.getTitle().trim() +" "+ episode +" "+ timeLeft);
        }

        $( window ).unload(function() {
            client.setPresence({ game:{ name:"", } });
        });
    });

    function getTimeleft(){
        var timeLeft = '';
        var paused = false;
        if( typeof $('video').get(0) != 'undefined' ){
            var duration = $('video').get(0).duration;
            var current = $('video').get(0).currentTime;
            paused = $('video').get(0).paused;
            timeLeft =  Math.ceil((duration - current) / 60);
            if(timeLeft == null || timeLeft == 0 || isNaN(timeLeft)){
                timeLeft = '';
            }else{
                timeLeft = "( -"+timeLeft+" Min )";
            }
            if(paused === true){
                timeLeft = "(PAUSED)"
            }
        }
        return timeLeft;
    }

})();