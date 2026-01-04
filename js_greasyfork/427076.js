// ==UserScript==
// @name         Bitland Auto Bonus Collector v1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bitland Pro Auto Bonus Collector
// @author       (V)åŤřȉx²°°°
// @match        https://bitland.pro/*
// @require      http://code.jquery.com/jquery-latest.js
// @icon         https://www.google.com/s2/favicons?domain=bitland.pro
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427076/Bitland%20Auto%20Bonus%20Collector%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/427076/Bitland%20Auto%20Bonus%20Collector%20v1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('body').prepend("<div id='ABStatus' class='shadow sticky-top' style='height: 35px; z-index: 9999; background-color: #333333; color: #f7921a; font-family: open sans,sans-serif; font-size: 20px; font-weight: 400;'>Auto Bonus Collector - Next Bonus: <span id='BLAB_NextBonus'></span><span id='BLAB_ActiveMiner' style='float: right;'></span><br /><div id='progressbar' style='width: 100%; padding: 2px; background: #333333; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);'><div id='progress' style='width: 100%; height: 7px; background-color: #FCBC51; border-radius: 2px; transition: 0.4s linear; transition-property: width, background-color; background-image: linear-gradient(45deg, rgb(252,163,17) 25%, transparent 25%, transparent 50%, rgb(252,163,17) 50%, rgb(252,163,17) 75%,transparent 75%, transparent); animation: progressAnimationStrike 6s;'></div></div></div>");
    $('.message_text').html("Auto Bonus Collector Enabled");

    // Your code here...
    var email='me@example.com';
    var password='MyPassword123!';

    var initLoad=true;
    var seconds_to_bonus;
    var BLAB_ReloadTimer=300;
    var mainTimer = setInterval(AutoBonus, 1000);
    var statsTimer = setInterval(updateStats, 60000);
    updateStats();

    function AutoBonus() {
        var segment=$(location).attr('href').split('/');

        handleReload();

        //Check if Bonus URL is active
        if(segment[segment.length-1]=='') {
            window.location.replace('https://bitland.pro/login');
        }
        else if(segment[segment.length-1]=='login') {
            $('#InputEmailRegister').val(email);
            $('#InputPassRegister').val(password);
            $('#login').submit();
        }
        else if(segment[segment.length-1]=='cabinet') {
            setMiningStats();
            window.location.replace('https://bitland.pro/cabinet/bonuses');
        }
        else if(segment[segment.length-1]=='bonuses') {
            collectBonus();
        }
    }

    function handleReload() {
        if(BLAB_ReloadTimer>=0) {
            BLAB_ReloadTimer--;
            //$('#BLAB_ReloadTimer').html("Reloading In: "+BLAB_ReloadTimer);
            $('footer p').html("<span id='BLAB_ReloadTimer'>Reloading In: "+BLAB_ReloadTimer+"</span>");
            //console.log("Reloading in: "+ABReloadTimer);
        } else {
            window.location.replace('https://bitland.pro/cabinet/bonuses');
        }
    }

    function setMiningStats() {
        var powers = $('#cabinet span').html().replace("&nbsp;", "");
        var level = $('#pricingCabinet h3').html().replace("Your level&nbsp;", "");
        var activeChain = $('.coin-block-mine.active').data('chain');
        var activeBal = $('.coin-block-mine.active').data('balance');

        var stats = {
            "powers":powers,
            "level":level,
            "activeChain":activeChain,
            "activeBal":activeBal
        };

        //console.log("Storing Mining Stats: ", JSON.stringify(stats));
        localStorage.setItem('BLAB_MiningStats', JSON.stringify(stats));
        //console.log("Level: "+level);
        //console.log("Active: "+activeChain);
    }

    function collectBonus() {
        if(typeof seconds_to_bonus==='undefined') {
            seconds_to_bonus = $('#bonus-timer').data('seconds_to_bonus');
        }
        var progressPercent = seconds_to_bonus/3600*100;
        $('#progress').css('width',progressPercent+'%');
        //console.log("STB: ",seconds_to_bonus);
        $('#BLAB_NextBonus').html($('#bonus-timer').text());
        var MiningStats = JSON.parse(localStorage.getItem('BLAB_MiningStats'));
        $('#BLAB_ActiveMiner').html("Mining@"+MiningStats.powers+" - "+MiningStats.activeBal + " "+MiningStats.activeChain);
        //Remove Ads
        $('#bonus > div > div.row.d-flex.justify-content-center').remove();
        $('#bonus > div > br').remove();
        $("script[src='//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5e6930e31a44f01b']").remove();
        $("script[src='https://static.cloudflareinsights.com/beacon.min.js']").remove();
        $("script[src='https://mc.yandex.ru/metrika/tag.js']").remove();

        if($('#bonus-timer:contains("Get a bonus")') && seconds_to_bonus<0)
        {
            //console.log("BONUS TIME!", seconds_to_bonus);
            $('#bonus-timer').click();
        }
        seconds_to_bonus--;
    }

    function updateStats() {
        $.ajax({
            url: 'https://bitland.pro/cabinet',
            dataType: 'html',
            success: function(response) {
                var html = $(response);
                var powers = html.find('#cabinet span').html().replace("&nbsp;", "");
                var level = html.find('#pricingCabinet h3').html().replace("Your level&nbsp;", "");
                var activeChain = html.find('.coin-block-mine.active').data('chain');
                var activeBal = html.find('.coin-block-mine.active').data('balance');
                var stats = {
                    "powers":powers,
                    "level":level,
                    "activeChain":activeChain,
                    "activeBal":activeBal
                };

                //console.log("Storing Mining Stats: ", JSON.stringify(stats));
                localStorage.setItem('BLAB_MiningStats', JSON.stringify(stats));
            }
        });
    }

})();