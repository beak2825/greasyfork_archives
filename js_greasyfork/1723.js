// ==UserScript==
// @name           Tetris Friends Tweaks
// @description    Some tweaks on TetrisFriends.com.
// @grant          unsafeWindow
// @include        http://www.tetrisfriends.com/*
// @version 0.0.1.20150409093204
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/1723/Tetris%20Friends%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/1723/Tetris%20Friends%20Tweaks.meta.js
// ==/UserScript==

/*** Settings ***/
if(typeof remove_ads == 'undefined') { var remove_ads = false }
/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

if(/^http:\/\/www\.tetrisfriends\.com\//.test(href))
{
    if(typeof unsafeWindow != 'undefined') { wnd = unsafeWindow }
    if(/\/leaderboard\/index\.php$/.test(href))
    {
        var goto_sprint_leaderboard = function() { loc.href = 'javascript:window.leaderboardChange("3", "84", 2, "0", 0, "Sprint")' }
        if(doc.readyState == 'complete') { goto_sprint_leaderboard() } else { addEventListener('load', goto_sprint_leaderboard, false) }
        throw 'exit'
    }
    if(remove_ads) {
        if(!/\/game\.php\b/.test(href)) { throw 'exit' }
        wnd.stop()
        if(/Live\/game\.php$/.test(href)) { wnd.stop(); loc.href = href + '?das=117&ar=17&ihs=true&irs=true'; throw 'exit' }
        var tweak_flash = function() {
            loc.href = 'javascript:gamePrerollComplete()'
            var game_swf = ''
            if(/Sprint\b/.test(href)) { game_swf = 'http://tetrisow-a.akamaihd.net/data4_0_0_1/games/Sprint/OWGameSprint.swf?version=3' }
            else if(/Live\b/.test(href)) { game_swf = 'http://www.tetrisfriends.com/data/games/Live/OWGameTetrisLive.swf?livebust=0165?version=0' }
            else if(/Ultra\b/.test(href)) { game_swf = 'http://tetrisow-a.akamaihd.net/data4_0_0_1/games/Ultra/OWGameUltra.swf?version=3' }
            else if(/Marathon\b/.test(href)) { game_swf = 'http://tetrisow-a.akamaihd.net/data4_0_0_1/games/Marathon/OWGameMarathon.swf?version=3' }
            else if(/Mono\b/.test(href)) { game_swf = 'http://tetrisow-a.akamaihd.net/data4_0_0_1/games/Mono/OWGameColorBlind.swf?version=3' }
            else if(/Survival\b/.test(href)) { game_swf = 'http://tetrisow-a.akamaihd.net/data4_0_0_1/games/Survival/OWGameSurvival.swf?version=3' }
            else if(/NBlox\b/.test(href)) { game_swf = 'http://tetrisow-a.akamaihd.net/data4_0_0_1/games/NBlox/nbloxWebsite.swf?version=3' } // doesn't work
            else if(/Battle2P\b/.test(href)) { game_swf = 'http://tetrisow-a.akamaihd.net/data4_0_0_1/games/Battle2P/OWGameBattle2pMaps.swf?version=0' }
            else if(/Battle6P\b/.test(href)) { game_swf = 'http://tetrisow-a.akamaihd.net/data4_0_0_1/games/Battle6P/OWGameBattle6P.swf?version=0' }
            else if(/Rally8P\b/.test(href)) { game_swf = 'http://tetrisow-a.akamaihd.net/data4_0_0_1/games/Rally8P/OWRally8P.swf?version=0' }
            else if(/Sprint5P\b/.test(href)) { game_swf = 'http://tetrisow-a.akamaihd.net/data4_0_0_1/games/Sprint5P/OWGameSprint5p.swf?version=0' }
            else { game_swf = doc.getElementsByTagName('OBJECT')[0].data }
            if(game_swf == '') { return }

            var w = '643', h = '381'
            //if(/Live\b/.test(href)) { w = '800', h = '600' }
            var margin_top = (wnd.innerHeight-h)/2 + 'px'
            doc.head.innerHTML = '' // remove unwanted style sheets. another way: for(var i=doc.styleSheets.length-1; i>=0; i--) { doc.styleSheets[i].disabled=true; }
            doc.body.innerHTML = '<object type="application/x-shockwave-flash" allowscriptaccess="always" data="' + game_swf + '" width="' + w + '" height="' + h + '" id="contentFlash" style="visibility: visible; display: block; margin-left: auto; margin-right: auto; margin-top:' + margin_top + '">' + '<param name="wmode" value="window">' + doc.getElementsByName("flashvars")[0].outerHTML + '<param name="quality" value="low">' + '</object>'

             // only needed when the <OBJECT> id is 'contentFlash'?
            for(var i=0; i<10; i++) { setTimeout('contentFlash.style.visibility = "visible"; contentFlash.as3_prerollDone()', i*1000) }

            // buggy
            var flash_obj = doc.getElementById('contentFlash')
            if(flash_obj)
            {
                flash_obj.addEventListener('keydown', function(evt) { if(evt.keyCode==73) { flash_obj.as3_tetrisGameRestart(); } }, false)
            }
            else
            {
                flash_obj = doc.getElementsByTagName('OBJECT')[0]
                flash_obj.addEventListener('keydown', function(evt) { if(evt.keyCode==73) { flash_obj.as3_tetrisGameRestart(); } }, false)
            }

            //if(/Live\b/.test(href)) { // if one can't connect to arena after a predefined time, reload the page.
            //}
        }
        //if(doc.readyState == 'interactive') { tweak_flash() } else { addEventListener('DOMContentLoaded', tweak_flash, false) }
        if(doc.readyState == 'complete') { tweak_flash() } else { addEventListener('DOMContentLoaded', tweak_flash, false) }        
    }
}
