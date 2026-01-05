// ==UserScript==
// @name         filelist.io torrent filter
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  Track favorite torrents on filelist.ro
// @author       fatman
// @match        http*://filelist.io/*
// @require https://code.jquery.com/jquery-latest.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @resource customCSS https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @grant    GM_addStyle
// @grant    GM_getResourceText
// @grant    GM_setValue
// @grant    GM_getValue
// @locale   en
// @downloadURL https://update.greasyfork.org/scripts/27627/filelistio%20torrent%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/27627/filelistio%20torrent%20filter.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var newCSS = GM_getResourceText("customCSS");
    newCSS = newCSS.replace(/images\/ui\-icons/g, "https://code.jquery.com/ui/1.12.1/themes/base/images/ui-icons");
    GM_addStyle(newCSS);
    var matches = GM_getValue('filelist_matches_', [
        /(.*)the.walking.dead(.*)/i,
        /(.*)the.simpsons(.*)/i,
        /(.*)family.guy(.*)/i,
        /(.*)(bob.s.burgers|bobs.burgers)(.*)/i,
        /(.*)the.man.in.the.high.castle(.*)/i,
        /(.*)american.dad(.*)/i,
        /(.*)agents.of(.*)/i,
        /(.*)(doctor.who|dr.who)(.*)/i,
        /(.*)a.series.of.unfortunate.events(.*)/i,
        /(.*)expanse(.*)/i]);


    var listString = "";
    for (var i = 0; i < matches.length; i++) {
        listString += matches[i] + (i < matches.length - 1 ? '\n' : '');
        var ttt = matches[i];
        if (ttt.length > 0) {
            ttt = ttt.split('/');
            if (ttt.length == 3) {
                matches[i] = new RegExp(ttt[1], ttt[2]);
            }
        }
    }

    $('li.fleft:last').after('<li class="fleft"><a href="#" id="btn">Matches</a></li>');
    $('#wrapper .mainheader').prepend('<div id="dialog"  title="Edit RegExp match strings"><textarea id="matchesString" style="font-size:normal;font-family:monospace;min-width:99%;min-height:80%!important;max-height:100%!important">' + listString + '</textarea><br><br><button id="saveMatches">Save</button></div>');

    setTimeout(function () {
        $('#dialog').dialog({autoOpen: false, resizable: true, height:400, minHeight: 250, minWidth: 250});
        $('#btn').css('color', 'red').on("click", function () {
            $("#dialog").dialog("open");
        });
        $('#saveMatches').button().on('click', function () {
            var newS = $('#matchesString').val().split('\n');
            //nsole.log(newS);
            GM_setValue('filelist_matches_', newS);
            location.reload();
        });

    }, 100);

    var rndInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };
    var hslToRgb = function (h, s, l) {
        var r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function (p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return 'rgb(' + parseInt(r * 255) + ',' + parseInt(g * 255) + ',' + parseInt(b * 255) + ')';
        //return [r * 255, g * 255, b * 255];
    };

    var getDayOfYear = function () {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        //console.log('Day of year: ' + day);
        return day;
    };
    var deltaColor = parseFloat(getDayOfYear() / 365);
    var found = [];
    var links = $('.torrentrow a[href^="details.php?id="]');
    var fidx = 0;
    links.each(function () {
        var t = $(this).text();
        var t2=$(this).siblings('font[class=small]').text();
        console.log(t2);
        for (var i = 0; i < matches.length; i++) {
            if (matches[i] && (t.match(matches[i]) || t2.match(matches[i])) ) {
                console.log(t,t2);
                var colIndex = ( (i % 2 === 0 ? 0.75 : 0) + deltaColor + i / matches.length) % 1;
                var newTextColor = hslToRgb(colIndex, 0.8, 0.3);
                $(this).css('color', newTextColor);
                var newBgColor = hslToRgb(colIndex, 1, 0.85);
                var torrentRow = $(this).closest('.torrentrow').css('background-color', newBgColor);
                found.push(torrentRow);
                $(this).closest('.torrenttable').nextAll('.torrenttable').eq(6).find('font')
                    .css({
                    'color': 'white', 'border': '1px solid white', 'padding': '5px',
                    'background-color': 'rgba(255,255,255,0.1)',
                    'min-width': '35px',
                    'display': 'inline-block'

                });
            }
        }
    });

    $('.pager').after('<div class="visitedlinks" style="margin-top:10px;" id="FOUND"></div>');
    for (var ii = 0; ii < found.length; ii++) {
        $('#FOUND').append(found[ii]);
    }

    var maxTimes=0;
    $('font.small:contains("times")').each(function(){
        var t=$(this).text();
        t=t.substr(0, t.length-5).replace(',','');
        maxTimes=Math.max(maxTimes,t);
        //console.log(t);
    });
    $('font.small:contains("times")').each(function(){
        var t=$(this).text();
        t=t.substr(0, t.length-5).replace(',','');

        var num = (7*t/maxTimes).toFixed();
        if(num>0){
            $(this).parent().css({'background':'red','color':'white'});
        }

        $(this).text("*".repeat(num)).attr('title', t);
    });




})();
