// ==UserScript==
// @name         (9anime) AniWave Bingewatcher+
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      6.3
// @description  Auto-fullscreen, skip intros, jump to next episode, 9anime on Vidstream and MyCloud videos (Auto-1080p in configuration panel)
// @match        https://aniwave.to/*
// @include      https://www*.9anime.*/*
// @include      https://netmovies.to/*
// @include      https://guccihide.com/*
// @include      https://rabbitstream.net/*
// @include      https://sbface.com/*
// @include      https://filemoon.sx/*
// @include      https://9anime.*/*
// @include      https://*.9anime.*/*
// @include      https://9anime.id/*
// @include      https://vidstream.pro/*
// @include      https://vidstreamz.online/*
// @include      https://vizcloud.online/*
// @include      https://vizcloud2.online/*
// @include      https://vizcloud.*/*
// @include      https://vizcloud.store/*
// @include      https://blob:vizcloud.store/*
// @include      https://mcloud.to/*
// @include      https://mcloud2.to/* 
// @include      https://storage.googleapis.com/*
// @include      https://movies7.to/*
// @include      https://*.mp4upload.com:*/*
// @include      https://*.mp4upload.com*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://greasyfork.org/scripts/439099-monkeyconfig-modern-reloaded/code/MonkeyConfig%20Modern%20Reloaded.js?version=1012538
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require      https://greasyfork.org/scripts/451088-utils-library/code/Utils%20-%20Library.js?version=1097324
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        window.onurlchange
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon         https://www.google.com/s2/favicons?domain=9anime.to
// @downloadURL https://update.greasyfork.org/scripts/401339/%289anime%29%20AniWave%20Bingewatcher%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/401339/%289anime%29%20AniWave%20Bingewatcher%2B.meta.js
// ==/UserScript==
/* global jQuery, $ */
this.$ = this.jQuery = jQuery.noConflict(true);

$(window).on('load', function() {

    var vPoint_launch = setTimeout(function(){
        var vPoint_work = window.location.href;
        if ( vPoint_work.indexOf('9anime') > -1 && cfg.get('Automatic Crowdsource Skip Opt-in'))
        {
            GM_setValue('toplocation', vPoint_work)
            vPoint_check()
            clearInterval(vPoint_launch)
        }
    }, 1000);

    var cfg = new MonkeyConfig({
        title: 'Configure',
        menuCommand: true,
        params: {
            'Automatic Highest Quality': {
                type: 'checkbox',
                default: true
            },
            Skip_Anime_Intro_Key: {
                type: 'text',
                default: 'v'
            },
            'Skip Anime Intro Time': {
                type: 'number',
                default: '89'
            },
            Next_Episode_Key: {
                type: 'text',
                default: 'n'
            },
            Skip_Company_ID_Key: {
                type: 'text',
                default: 'q'
            },
            'Skip Company ID Time': {
                type: 'number',
                default: '10'
            },
            'Automatic Skip Company ID': {
                type: 'checkbox',
                default: false
            },
            'Automatic Crowdsource Skip Opt-in': {
                type: 'checkbox',
                default: true
            },
        },
        // onSave: setOptions
    })


    function myTimer2() {
        var video = $("#player").get(0);
        const player = $('#player')[0];
        $('body').click()
        player.requestFullscreen();
        $(player).focus();
        if (document.fullscreen === true)
            clearInterval(myInterval2);
    }

    if (cfg.get('Automatic Highest Quality') && !window.location.href.includes("movies7")) {
        try {
            var myInterval2 = setInterval(myTimer2, 1000);
        } catch (error) {
            if (error instanceof TypeError) {
                // Do nothing
            } else {
                throw error;
            }
        }
    }

    function openFullscreen(elem) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE / Edge */
            elem.msRequestFullscreen();
        }
    }

    function vPoint_check(){
        $.get("https://unity.alwaysdata.net/vpoint.php?toplocation=" + GM_getValue('toplocation'), function(data){

            if(data !== 'nada'){
                GM_setValue('vPoint_exists', Number(data));
            }
            else {
                GM_setValue('vPoint_exists', 'nada');
            }

        });
    }

    function checkURLchange(){
        if(window.location.href != oldURL){
            GM_setValue('title', document.title)
            GM_setValue('toplocation', window.location.href)
            oldURL = window.location.href;
        }
    }

    var oldURL = window.location.href;
    if (cfg.get('Automatic Crowdsource Skip Opt-in'))
        setInterval(checkURLchange, 1000);

    var canOnlyFireOnce2 = once(function(current) {
        central(current)
    });

    function central(current){
        var episode = window.location.href
        var vPoint = current
        var title = GM_getValue('title')
        var toplocation = GM_getValue('toplocation')

        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", "https://unity.alwaysdata.net/central.php?vPoint=" + vPoint + "&toplocation=" + toplocation);
        xhttp.send();
    }

    function once(fn, context) {
        var result;
        return function() {
            if(fn) {
                result = fn.apply(context || this, arguments);
                fn = null;
            }
            return result;
        };
    }

    var canOnlyFireOnce = once(function(player, current) {
        player.currentTime = Number(cfg.get('Skip Company ID Time'))
    });

    function waitForElementToDisplay(selector, time) {
        if($(selector)!=null) {
            setTimeout(function(){
                var video = $("#player").get(0);
                // var rfs = video.requestFullscreen || video.webkitRequestFullScreen || video.mozRequestFullScreen || video.msRequestFullscreen;
                // rfs.call(video);

                const player = $('#player')[0];
                // var video = $("#player").get(0);

                // If the player element exists and supports fullscreen mode
                if (player && player.requestFullscreen && !window.location.href.includes("movies7")) {
                    // Activate fullscreen mode on page load
                    // $('body').click()
                    player.requestFullscreen();
                    $(player).focus();

                    // player = $("#vidcloud-player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video").get(0)
                    player.requestFullscreen();
                    $(player).focus();
                }
            }, 1000);


            var newYearCountdown = setInterval(function(){

                var player = $('video').get(0);

                var duration = player.duration;
                var current = player.currentTime;

                if(cfg.get('Automatic Skip Company ID')){
                    if(player.currentTime < 1){
                        canOnlyFireOnce(player, current);
                    }
                }

                if (GM_getValue('vPoint_exists') !== 'nada' && cfg.get('Automatic Crowdsource Skip Opt-in')){
                    if (Math.round(player.currentTime) === GM_getValue('vPoint_exists')){
                        player.currentTime = GM_getValue('vPoint_exists') + Number(cfg.get('Skip Anime Intro Time'))
                        GM_setValue('vPoint_exists','nada')
                    }
                }


                $('body').keypress(function(event){
                    var key = (event.keyCode ? event.keyCode : event.which);
                    var x = String.fromCharCode(key)
                    // player = $("#vidcloud-player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video").get(0)
                    if (x == cfg.get('Skip_Company_ID_Key')) { // Q key skip 10s
                        player.currentTime = current + Number(cfg.get('Skip Company ID Time'));
                    }
                    if (x == cfg.get('Skip_Anime_Intro_Key')) { // V key skip 89s
                        if ('Automatic Crowdsource Skip Opt-in')
                            canOnlyFireOnce2(player.currentTime);
                        player.currentTime = current + Number(cfg.get('Skip Anime Intro Time'));
                    }
                    if (x == cfg.get('Next_Episode_Key')) { // N key skip end
                        player.currentTime = player.duration;
                    }

                })
            }, 1000);
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, time);
            }, time);
        }
    }

    waitForElementToDisplay('#player', 1000);




    const runOnURLChange = () => {
        window.addEventListener('urlchange', (info) => {

            utils.waitForElement('#player').then(function() {

                if (cfg.get('Automatic Highest Quality')) {
                    const myInterval = setInterval(myTimer, 1000);

                    function myTimer() {
                        var $highest_check = $('#jw-player-settings-menu > div:nth-child(3) > div > button:nth-child(2)').attr('aria-checked')
                        var $auto_check = $('#jw-player-settings-menu > div:nth-child(3) > div > button:nth-child(1)').text()
                        //$('div.jw-icon:nth-child(14)')[0].click()

                        if ($auto_check === 'Auto'){
                            if ($highest_check === "true"){
                                // $('div.jw-icon:nth-child(14)')[0].click()
                                clearInterval(myInterval);
                            } else {
                                $("div[aria-label='Settings']")[0].click()
                                $('#jw-player-settings-menu > div:nth-child(3) > div > button:nth-child(2)')[0].click()
                            }
                        } else {
                            //$('div.jw-icon:nth-child(14)')[0].click()
                            clearInterval(myInterval);
                        }
                    }
                }


                setTimeout(function(){
                    var video = $("#player").get(0);
                    const player = $('#player')[0];
                    $('body').click()

                    if (player && player.requestFullscreen && !window.location.href.includes("movies7")) {
                        player.requestFullscreen();
                        $(player).focus();
                    }
                }, 1000);

            }) 


        })
    }

    })