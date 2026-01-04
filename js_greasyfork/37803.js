// ==UserScript==
// @name        Discord bmovies
// @version     0.11
// @author      dinosw
// @license     Creative Commons; http://creativecommons.org/licenses/by/4.0/
// @homepageURL  https://greasyfork.org/en/scripts/37803
// @supportURL  https://discord.gg/cTH4yaw
//
// @include     /^https?:\/\/bmovies\.to\/film\//
// @include     /^https?:\/\/bmovies\.is\/film\//
//
// @include     /^https?:\/\/(www\.)?mp4upload\.com\/./
// @include     /^https?:\/\/(www\.)?streamango\.com\/./
// @include     /^https?:\/\/(www\.)?youtube\.googleapis\.com\/embed\/./
// @include     /^https?:\/\/(www\.)?estream\.to\/./
// @include     /^https?:\/\/(www\.)?mycloud\.to\//
// @include     /^https?:\/\/(www\.)?openload\.co\/./
// @include     /^https?:\/\/(www\.)?yourupload\.com\/./
// @include     /^https?:\/\/(www\.)?mcloud\.to\/./
// @include     /^https?:\/\/(www\.)?rapidvideo\.com\/./
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
// @namespace https://greasyfork.org/users/29386
// @description Sets the discord playing state
// @downloadURL https://update.greasyfork.org/scripts/37803/Discord%20bmovies.user.js
// @updateURL https://update.greasyfork.org/scripts/37803/Discord%20bmovies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interval = 60000;

    var players = ["mp4upload.com", "streamango.com", "youtube.googleapis.com", "estream.to", "mycloud.to", "openload.co", "yourupload.com", "mcloud", "rapidvideo"];
    $.each( players, function( index, value ) {
        if(window.location.href.indexOf( value ) > -1){
            setInterval(function(){
                var timeLeft = '';
                if( typeof $('video').get(0) != 'undefined' ){
                    var duration = $('video').get(0).duration;
                    var current = $('video').get(0).currentTime;
                    timeLeft =  Math.ceil((duration - current) / 60);
                    if(timeLeft == null || timeLeft == 0 || isNaN(timeLeft)){
                        timeLeft = '';
                    }else{
                        timeLeft = "( -"+timeLeft+" Min )";
                    }
                }
                GM_setValue('timeLeft', timeLeft);
            }, interval);
            return;
        }
    });

if( window.location.href.indexOf("bmovies.") > -1 ){
        //#########bmovies#########
        var domain = 'https://'+window.location.hostname;
        var textColor = '#694ba1';

        $.isOverviewPage = function() {
            if(window.location.href.split('/')[4] !== 'film'){
                return false;
            }else{
                return true;
            }
        };

        $.urlEpisodePart = function(url) {
            return $(".servers .episodes a.active").attr('data-base');
        };

        $.EpisodePartToEpisode = function(string) {
            return string;
        };

    	$.docReady = function(data) {
    	    return $( document).ready(data);
    	};
    	
        $.getTitle = function(){
            return $('h1.name').first().html();
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
            var timeLeft = '';
            if( typeof $('video').get(0) != 'undefined' ){
                var duration = $('video').get(0).duration;
                var current = $('video').get(0).currentTime;
                timeLeft =  Math.ceil((duration - current) / 60);
                if(timeLeft == null || timeLeft == 0 || isNaN(timeLeft)){
                    timeLeft = '';
                }else{
                    timeLeft = "( -"+timeLeft+" Min )";
                }
            }

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
                    name: $.getTitle() +" "+ episode +" "+ timeLeft ,
                    type: 3
                }
            });
            console.log('Set Game', $.getTitle() +" "+ episode +" "+ timeLeft);
        }

        $( window ).unload(function() {
            client.setPresence({ game:{ name:"", } });
        });
    });
})();