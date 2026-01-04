// ==UserScript==
// @icon           https://cf.geekdo-static.com/icons/favicon2.ico
// @name           Geek Plus
// @namespace      damasch.ch
// @description    A growing collection of usability enhancements for BoardGameGeek
// @include        https://www.boardgamegeek.com/*
// @include        https://boardgamegeek.com/*
// @version        0.2.1
// @grant GM_setValue
// @grant GM_getValue
// @require http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/425576/Geek%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/425576/Geek%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (/https:\/\/(www\.)?boardgamegeek\.com\/boardgame\/.*/.test(window.location.href))
    {
        GamePage_bootstrap();
    }
})();

function GEEK_XML_getPlaysForGamePromise(gameid, date, page = 1)
{
    //https://boardgamegeek.com/xmlapi2/plays?id=187645&type=thing&mindate=2021-03-01&maxdate=2021-03-31

    var url = "https://boardgamegeek.com/xmlapi2/plays?id=" + gameid + "&type=thing&mindate=" + date + "-01&maxdate=" + date + "-31&page=" + page;

    var p = new Promise((resolve, reject) => {
        $.get( url, function(data) {
            //console.log(data);
            //var parser = new DOMParser();
            //var xmlDoc = parser.parseFromString(data, 'text/xml');

            var plays = Array.from(data.getElementsByTagName('play'));//.filter(p => p.getAttribute('length') != 0);
            //console.log(plays);

            if (plays.length < 100)
            {
                resolve(plays);
            }
            else
            {
                var p2 = GEEK_XML_getPlaysForGamePromise(gameid, date, page + 1)
                .then(plays2 => resolve(plays.concat(plays2)))
                .catch(() => reject());
            }
        }).fail(function() {
            reject();
        });
    });
    return p;
}

function GEEK_getPlayersForGamePromise(gameid, date, page)
{
    var url = "https://boardgamegeek.com/playstats/thing/" + gameid + "/" + date + "/page/" + page; // 203427/2021-03

    var p = new Promise((resolve, reject) => {
        $.get( url, function(data) {
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(data, 'text/html');


            var links = Array.from(htmlDoc.getElementsByClassName('lf')).map(l => l.getElementsByTagName('a')[0].href);

            if (links.length < 100)
            {
                resolve(links);
            }
            else
            {
                var p2 = GEEK_getPlayersForGamePromise(gameid, date, page + 1)
                .then(links2 => resolve(links.concat(links2)))
                .catch(() => reject());
            }
            // /plays/thing/203427?userid=732590&amp;date=2021-03
        }).fail(function() {
            reject();
        });
    });
    return p;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function GamePage_bootstrap()
{
    var match = window.location.href.match(/boardgame\/(\d+)\//);
    var gameid = match[1];
    //console.log(match);

    GamePage_PlayTime_bootstrap(gameid);
}

function GamePage_PlayTime_fetch(gameid)
{
    console.log(gameid);
    var now = new Date();
    var month0 = now.getMonth() - 1;
    var year = now.getFullYear();

    if (month0 < 0)
    {
        month0 += 12;
        year--;
    }
    var month = ("00" + (month0 + 1)).substr(-2);

    console.log(year, month);
    var pplays = GEEK_XML_getPlaysForGamePromise(gameid, year + "-" + month)
    .then(data => {
        console.log("Play index returned");
        console.log(data);
        var lengths = data
        .filter(p => p.getAttribute('length') != 0 && p.getAttribute("incomplete") == 0 && p.getAttribute("quantity") == 1)
        .map(p => parseInt(p.getAttribute('length')));

        lengths.sort((a, b) => a - b);
        console.log(lengths);
        var min90 = lengths[Math.round(lengths.length / 20)];
        var max90 = lengths[Math.round(lengths.length - lengths.length / 20)];
        var median = lengths[Math.round(lengths.length / 2)];
        var mean = lengths.reduce((t, sum) => sum + t) / lengths.length;
        console.log(min90, max90, median, mean);

        var cached = {
            min90: min90,
            max90: max90,
            count: lengths.length,
            median: median,
            mean: mean,
        };
        GM_setValue("GamePage_PlayTime_" + gameid, JSON.stringify(cached));

        GamePage_PlayTime_update(gameid);
    })
    .catch(() => console.log("Something went wrong"));
}

function GamePage_PlayTime_bootstrap(gameid)
{
    var cached = JSON.parse(GM_getValue("GamePage_PlayTime_" + gameid, "{}"));

    var gameplay_items = document.getElementsByClassName('gameplay-item');

    var gameplay_playingtime = gameplay_items[1];
    var gameplay_playingtime_primary = gameplay_playingtime.getElementsByClassName('gameplay-item-primary')[0];
    gameplay_playingtime_primary.innerHTML = "Time:" + gameplay_playingtime_primary.innerHTML;
    var gameplay_playingtime_secondary = gameplay_playingtime.getElementsByClassName('gameplay-item-secondary')[0];

    GamePage_PlayTime_update(gameid);
    gameplay_playingtime_secondary.onclick = () => {
        GamePage_PlayTime_fetch(gameid);
    };

}

function GamePage_PlayTime_update(gameid)
{
    var cached = JSON.parse(GM_getValue("GamePage_PlayTime_" + gameid, "{}"));

    var gameplay_items = document.getElementsByClassName('gameplay-item');

    var gameplay_playingtime = gameplay_items[1];
    var gameplay_playingtime_secondary = gameplay_playingtime.getElementsByClassName('gameplay-item-secondary')[0];

    if (cached.min90 && cached.max90)
    {
        var text = "Community: <span title=\"90% of logged plays last month fell within this range.\">" + cached.min90 + "–" + cached.max90 + "</span>";

        if (cached.mean)
        {
            text += (" <span title=\"average playing time last month.\"> t&#772; = " + Math.round(cached.mean) + "</span> <span title=\"median playing time last month.\">Q<sub>2</sub> = " + cached.median + "</span>");
        }

        gameplay_playingtime_secondary.innerHTML = "<button class=\"btn btn-link btn-xs\" type=\"button\">" + text + "</button>";
        gameplay_playingtime_secondary.setAttribute('title', 'Click to update.');
    }
    else
    {
        gameplay_playingtime_secondary.innerHTML = "<button class=\"btn btn-link btn-xs\" type=\"button\">Community: click to load...</button>";
        gameplay_playingtime_secondary.setAttribute('title', 'Click to load.');
    }
}