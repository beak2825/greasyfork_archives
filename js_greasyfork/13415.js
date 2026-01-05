// ==UserScript==
// @name Gameminer.net Auto Join
// @namespace GMAJ
// @description A userscript to autojoin giveaways on gameminer
// @author Tackyou
// @version 0.7
// @license https://raw.githubusercontent.com/Tackyou/gameminer-autojoin/master/LICENSE
// @match *://gameminer.net/*
// @supportURL https://github.com/Tackyou/gameminer-autojoin/issues
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/13415/Gameminernet%20Auto%20Join.user.js
// @updateURL https://update.greasyfork.org/scripts/13415/Gameminernet%20Auto%20Join.meta.js
// ==/UserScript==

var giveawaysjoined = 0, i = 0, x = 1, category = "coal", categories = ["coal", "sandbox", "golden"], coal = $('span.g-coal-big-icon span.user__coal'), gold = $('span.g-coal-big-icon span.user__gold'), yourcoal = +(coal.text()), yourgold = +(gold.text());
console.log('[GMAJ # ' + new Date().toString() +'] # Coal: '+yourcoal+', Gold: '+yourgold);
cycle(); // lets go
setTimeout(pointrefill, 3600000);
function cycle() {
    x = 1;
    category = categories[i];
    $.get('http://gameminer.net/giveaway/' + category + '?type=any&q=&sortby=finish&order=asc&filter_entered=on', function(content){
        console.log('[GMAJ # ' + new Date().toString() +'] # Browsing category ' + category + ' ...');
        var parsedcontent = $(content);
        $('.giveaway__container', parsedcontent).each(function(index){
            JoinIfNotDLC(this, category);
        });
        i++;
        if(i > 2){
            i=0;
            setTimeout(cycle, 900000); // every 15 minutes
            console.log('[GMAJ # ' + new Date().toString() +'] ### Giveaways joined: ' + giveawaysjoined + ', pausing for 15 minutes ...');
        }else{
            setTimeout(cycle, 5000);
        }
    });
}

function pointrefill(){
    yourcoal += 1;
    coal.text(yourcoal);
    setTimeout(pointrefill, 3600000);
}

function JoinIfNotDLC(content, category){
    var name = $('a.giveaway__name', content).text();
    var points = +($('.giveaway__main-info', content).next().find('p:nth-child(3) span').text().split(' ')[0]);
    var form = $('.giveaway__action form', content);
    var canjoin = form.hasClass('giveaway-join');
    var steamurl = $('.giveaway__topc a', content).attr('href'), steamappid = 0;
    if(steamurl != undefined){
        try{
            steamappid = steamurl.split('/app/')[1].split('/')[0];
        }catch(ex){
            // it's a bundle /sub/
            canJoin = false; // can't check them, can't join them.
            // you could make it check all games in the bundle some day .... maybe a bit overload tho
        }
    }
    setTimeout(function(){
        if(((category == 'golden' && points <= yourgold) || (category != 'golden' && points <= yourcoal)) && canjoin){
            var site = 'http://store.steampowered.com/api/appdetails/?appids='+steamappid;
            var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + site + '"') + '&format=json&callback=?';
            $.getJSON(yql, function(data) {
                var game;
                var json = data.query.results;
                for (var property in json) {
                    if (json.hasOwnProperty(property)) {
                        game = json[property];
                        break;
                    }
                }
                if(game != undefined && game.data != undefined && game.data.type != 'dlc'){
                    $.post(form.attr('action'), form.serialize() + "&json=true", function(resp) {
                        coal.text(resp.coal);
                        gold.text(resp.gold);
                        yourcoal = resp.coal;
                        yourgold = resp.gold;
                        console.log('[GMAJ # ' + new Date().toString() +'] # ('+points+'p) '+name);
                        giveawaysjoined++;
                    });
                }
            });
        }
    }, 3000*x);
    x++;
}
