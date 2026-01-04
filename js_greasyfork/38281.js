// ==UserScript==
// @name         Steam Total Play Time
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Shows the total play time in the user's game library (below the user name)
// @author       mimameidr
// @match        https://steamcommunity.com/*/*/games/*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/38281/Steam%20Total%20Play%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/38281/Steam%20Total%20Play%20Time.meta.js
// ==/UserScript==
//
(function() {
    'use strict';
    $('.profile_small_header_text').append('<div>Total Hours Played: <span class="totalPlayed"><img style="height:10px" src="https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif" /></span></div>');
    setInterval(function(){
        var total=0;
        var result = $('.gameListRow:visible .hours_played');
        for(var i=0;i<result.length;i++)
        {
            var num = $(result[i]).text().split(' ');

            if(num.length >= 1)
            {
                num = num[0];
                if(num)
                    total = total+parseFloat(num);
            }
        }
        $('.totalPlayed').html(total.toFixed(2));
    },500);
})();