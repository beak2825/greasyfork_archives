// ==UserScript==
// @name         BLAEO time to beat
// @namespace    http://backlog-deepness.rhcloud.com/
// @version      0.1
// @description  add ttb from AStats as an extra column to all games lists
// @author       mandrill
// @match        http://backlog-deepness.rhcloud.com/users/*/games
// @match        http://backlog-deepness.rhcloud.com/users/*/games/*
// @match        http://backlog-deepness.rhcloud.com/lists/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      //ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26570/BLAEO%20time%20to%20beat.user.js
// @updateURL https://update.greasyfork.org/scripts/26570/BLAEO%20time%20to%20beat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var readable = function(mins) {
        if (mins < 90)
            return mins + " minutes";
        return "about " + Math.round(mins / 60) + " hours";
    };

    var stillInDOM = function($elem) {
        var root = $elem.parents('html')[0];
        return root && root == document.documentElement;
    };

    var fetchTimeToBeat = function(appid, continuation) {
        var cached = GM_getValue(appid);
        if (cached) {
            // TODO cache is never invalidated. probably should be.
            continuation(cached);
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://astats.astats.nl/astats/Steam_Game_Info.php?AppID=' + appid,
            onload: function(response) {
                // before looking at the HTML, toss all img tags so the browser doesn't start
                // fetching unneeded images
                var $aStatsGameInfo = $(response.responseText.replace(/<img[^>]*>/g,""));

                var $ttbCell = $($aStatsGameInfo.find('td.GameInfoBoxRow')[3]);
                var m = /Hours story\s+(\d+(?:.\d\d\d)*,\d+)/.exec($ttbCell.text());
                var minutes;
                if (!m) {
                    var t = $ttbCell.text().trim();
                    if (t)
                        console.log("BLAEO time to beat: could not parse ttb for " + appid + ": " + t);
                }
                else
                    minutes = m[1].replace('.', '').replace(',', '.') * 60;

                GM_setValue(appid, minutes);
                continuation(minutes);
            }
        });
    };

    var addTimesToBeat = function() {
        if (!$('.game-table').length) {
            // thumbnail view or list view; nothing to do here
            return;
        }

        // name column is first on progress lists (/games/*) and second on custom lists (/lists/*)
        var nameColumnIndex = 1;
        if (/^http:\/\/backlog-deepness.rhcloud.com\/lists\//.exec(document.location))
            nameColumnIndex = 2;

        // add col descriptor for new column
        var $nameColumnDescriptor = $('.game-table colgroup col:nth-child(' + nameColumnIndex + ')');
        if (nameColumnIndex == 1)
            $nameColumnDescriptor
                .removeClass('col-sm-8')
                .addClass('col-sm-6')
                .after('<col class="col-sm-2"></col>');
        else
            $nameColumnDescriptor
                .width('45%')
                .after('<col width="15%"></col>');

        // add header for new column
        // TODO should probably be sortable ... ¯\_(ツ)_/¯
        $('.game-table thead th:nth-child(' + nameColumnIndex + ')')
            .after("<th class='text-right'>Time to beat</th>");

        // add empty ttb cell to every row
        var cells = [];
        $('.game-table tbody tr').each(function() {
            var $row = $(this);
            var appid = /\/(\d+)$/.exec($row.find('a.steam').attr('href'))[1];
            var $cell = $("<td class='text-muted text-center'>?</td>")
                .insertAfter($row.find('td:nth-child(' + nameColumnIndex + ')'))
                .data('value', appid);
            cells.push($cell);
        });

        // get the ttbs and fill the cell contents
        // this is deliberately a separate and strictly sequential loop:
        // page changes on blaeo don't cancel running scripts, so firing all the xhr requests in
        // parallel would clog the queue; doing it sequentially like this, pending "ttb fetches"
        // can be aborted on page change
        // ... downside: this is rather slow. parallel batches of 10 or sth like that would be
        // better, but ... meh. everything is cached after first fetch anyway.
        var fillOneCell = function() {
            if (!cells.length)
                return;
            var $cell = cells.shift();
            var appid = $cell.data('value');
            fetchTimeToBeat(appid, function(minutes) {
                if (!stillInDOM($cell))
                    return;  // user navigated to a different page -- abort
                if (!isNaN(minutes))
                    $cell
                        .removeClass('text-muted')
                        .removeClass('text-center')
                        .addClass('text-right')
                        .text(readable(minutes));
                fillOneCell();
            });
        };
        fillOneCell();
    };

    $(document).ready(addTimesToBeat);
    $(document).on('turbolinks:load', addTimesToBeat);
})();