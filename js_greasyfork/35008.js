// ==UserScript==
// @name         speedrun parse table
// @namespace    test
// @version      0.1
// @description  hello?
// @author       me
// @include      https://www.speedrun.com/*
// @downloadURL https://update.greasyfork.org/scripts/35008/speedrun%20parse%20table.user.js
// @updateURL https://update.greasyfork.org/scripts/35008/speedrun%20parse%20table.meta.js
// ==/UserScript==
document.onkeydown = function(e) {
    if (e.key === 'q') {
            var data = [];
            $("#leaderboarddiv").children('table').children('tbody').children().slice(1).each(function(){
                var output = [];

                output.push({
                    "rank": $(this).children('td:eq(0)').text().trim(),
                    "player": $(this).children('td:eq(1)').text(),
                    "real_time": $(this).children('td:eq(3)').text(),
                    "game_time": $(this).children('td:eq(3)').text(),
                    "version": $(this).children('td:eq(5)').text(),
                    "link": "https://www.speedrun.com" + $(this).data("target")
                });

                data.push(output);
            });
            alert(JSON.stringify(data));
    }
};