// ==UserScript==
// @name        mark_owned_games
// @namespace   http://tampermonkey.net/
// @description mark owned games
// @author      jacky
// @license     MIT
// @include     http*://*dailyindiegame.com/*
// @include     https://barter.vg/bundle*/*
// @include     https://www.indiegala.com/gift?gift_id=*
// @include     http*://*steamcardexchange.net/index.php?boosterprices
// @include     http*://*steamcardexchange.net/index.php?badgeprices
// @include     http*://*keylol.com/t*
// @include     http*://*keylol.com/forum.php?mod=viewthread*
// @include     https://www.steamgifts.com/discussion/*
// @include     https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @include     https://www.fanatical.com/en/game/*
// @include     https://www.fanatical.com/en/bundle/*
// @include     https://www.fanatical.com/en/pick-and-mix/*
// @include     https://www.indiegala.com/library
// @include     https://www.indiegala.com/gift?gift_id=*
// @include     https://www.indiegala.com/gift-bundle/*
// @include     http://wtfprice.ru*
// @include     https://key.lol/*
// @include     https://www.youshangames.com/wholesale-center.html*
// @include     http://bundle.ccyycn.com/*
// @include     https://www.steamgifts.com/discussion/Infm8/*
// @version     2025.07.30.1
// @run-at      document-end
// @connect     store.steampowered.com
// @connect     steamcardexchange.net
// @require     http://libs.baidu.com/jquery/1.10.1/jquery.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_log
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/460418/mark_owned_games.user.js
// @updateURL https://update.greasyfork.org/scripts/460418/mark_owned_games.meta.js
// ==/UserScript==

// ==Configuration==
const prefix = false; // Prefix (true) instead of suffix (false) position icon.
const wantIgnores = true; // Wether (true) or not (false) you want to display an extra icon for ignored (not interested) apps.
const wantDecommissioned = true; // Wether (true) or not (false) you want to display an extra icon for removed or delisted (decommissioned) apps.
const wantCards = true; // Whether (true) or not (false) you want to display an extra icon for apps with cards.
const linkCardIcon = true; // Link the card icon to SteamCardExchange.net
const ignoredIcon = "&#128683;&#xFE0E;"; // HTML entity code for '🛇' (default).
const ignoredColor = "grey"; // Color of the icon for ignored (not interested) apps.
const wishlistIcon = "&#10084;"; // HTML entity code for '❤' (default).
const wishlistColor = "blue"; // Color of the icon for wishlisted apps.
const ownedIcon = "&#10004;"; // HTML entity code for '✔' (default).
const ownedColor = "green"; // Color of the icon for owned apps and subs.
const cartIcon = "&#35;";
const cartColor = "yellow";
const unownedIcon = "&#10008;"; // HTML entity code for '✘' (default).
const unownedColor = "red"; // Color of the icon for unowned apps and subs.
const decommissionedIcon = "&#128465;"; // HTML entity code for '🗑' (default).
const decommissionedColor = "initial"; // Color of the icon for removed or delisted apps and subs.
const cardIcon = "&#x1F0A1"; // HTML entity code for '🂡' (default).
const cardColor = "DodgerBlue"; // Color of the icon for cards.
const dbIcon = "&#8505;"; // HTML entity code for 'ℹ' (default).
const userRefreshInterval = 60 * 24; // Number of minutes to wait to refesh cached userdata. 0 = always stay up-to-date.
const decommissionedRefreshInterval = 60 * 24; // Number of minutes to wait to refesh cached userdata. 0 = always stay up-to-date.
const cardRefreshInterval = 60 * 24 * 7; // Number of minutes to wait to refesh cached trading card data. 0 = always stay up-to-date.
// ==/Configuration==

var txt = GM_getValue("steam_info", "{}");
var dt = GM_getValue("last_upd", 0);
var txt2 = GM_getValue("card_info", null);
var dt2 = GM_getValue("card_upd", 0);
var r = JSON.parse(txt);
var r2 = JSON.parse(txt2);
var ignoredApps = r.rgIgnoredApps;
var ownedApps = r.rgOwnedApps;
var ownedPackages = r.rgOwnedPackages;
var wishlist = r.rgWishlist;
var cartApps = r.rgAppsInCart;
var cartPackages = r.rgPackagesInCart;

$('body').append('<div id="ru" style="position:fixed;bottom:0px;left:0px;"></div>');
$('#ru').append('<a id="upd" style="cursor: default;" title="'+ (new Date(dt)).toLocaleString() +'">UPDATE</a>');
$('#ru').append('&nbsp;&nbsp;');
$('#ru').append('<a id="card" style="cursor: default;" title="'+ (new Date(dt2)).toLocaleString() +'">CARDS</a>');
$('#ru').append('&nbsp;&nbsp;');
$('#ru').append('<a id="mark" style="cursor: default;">MARK</a>');
$('#ru').append('&nbsp;&nbsp;');
$('#ru').append('<a id="umark" style="cursor: default;">UMARK</a>');
$('#upd').click(function(){update();});
$('#card').click(function(){upcard();});
$('#mark').click(function(){
    $('.ruc').remove();
    $('.dbc').remove();
    $('.db').remove();
    var b = $("a:not(.db, [href*='#'], [href*='protondb'])[href*='/app/'],[href*='/sub/'],[href*='-appid-']");
    mark(b);
    b = $("button[data-img*='/apps/'],[data-img*='/subs/']");
    mark2(b);
    b = $("a:not(.db)[href*='gamelisting_']");
    mark3(b);
});

$('#umark').click(function(){
    $('.ruc').remove();
    $('.dbc').remove();
    $('.db').remove();
});

if (Date.now() - dt > userRefreshInterval * 60000 || ownedApps===undefined)
    update();

if (wantCards && (Date.now() - dt2 >= cardRefreshInterval * 60000 || !r2 || Object.keys(r2).length < 7000))
    upcard();

if (/content_digaccount/.exec(document.URL)){
    $('#TableKeys2 tr').each(function(){
        var m = /(app|sub)\/(\d+)/.exec($(this).html());
        if (m){
            var td = $(this).children('td')[2];
            $(td).wrapInner(`<a href="http://store.steampowered.com/${m[0]}/" target=_blank></a>`);
        }
    });
}

var a = $("a:not(.db, [href*='#'], [href*='protondb'])[href*='/app/'],[href*='/sub/'],[href*='-appid-']");
var t = 1;
if (a.length == 0)
    t =15;

setTimeout(function() {
    a = $("a:not(.db,[href*='#'],[href*='protondb'])[href*='/app/'],[href*='/sub/'],[href*='-appid-'],[href*='site_gamelisting_']");
    mark(a);
}, t * 1000);

function update(){
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://store.steampowered.com/dynamicstore/userdata/?l=english",
        onload: function(response) {
            if (response.responseText.length > 1000 && /rgWishlist/.exec(response.responseText)){
                GM_setValue("steam_info", response.responseText);
                GM_setValue("last_upd", Date.now());
                r = JSON.parse(response.responseText);
                ignoredApps = r.rgIgnoredApps;
                ownedApps = r.rgOwnedApps;
                ownedPackages = r.rgOwnedPackages;
                wishlist = r.rgWishlist;
                cartApps = r.rgAppsInCart;
                cartPackages = r.rgPackagesInCart;
                //alert("complete");
                $('#upd').attr('title', new Date(Date.now()).toLocaleString());
            } else {
                $('#upd').attr('title', 'error');
            }
        },
        onerror:  function(response) {
            console.log(response);
            alert(response.statusText);
        },
        ontimeout:  function(response) {
            console.log(response);
            alert(response.statusText);
        },
    });
}

function upcard(){
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.steamcardexchange.net/api/request.php?GetBadgePrices_Guest",
        onload: function(response) {
            var json = null;
            try {
                json = {};
                JSON.parse(response.responseText).data.forEach(function(item) {
                    json[item[0][0]] = item[1];
                });
                if (Object.keys(json).length > 7000) { // sanity check
                    GM_setValue("card_info", JSON.stringify(json));
                    GM_setValue("card_upd", Date.now());
                    $('#card').attr('title', new Date(Date.now()).toLocaleString());
                } else {
                    $('#card').attr('title', 'error');
                }
            } catch(error) {
            }
        },
        onerror:  function(response) {
            console.log(response);
            alert(response.statusText);
        },
        ontimeout:  function(response) {
            console.log(response);
            alert(response.statusText);
        },
    });
}

function marka(a, b, c){
    var color = '';
    if (c == 'app') {
        if ($.inArray(b, ownedApps) > -1){
            color = '#59b946';
        }
        else if ($.inArray(b, wishlist) > -1){
            color = '#6694ff';
        }
        if ($.inArray(b, cartApps) > -1){
            color = '#f7cb08';
        }
        if (wantCards && r2.hasOwnProperty(b))
            $(a).after(`<div style="margin:1px;width:16px;height:16px;padding:1 1 1 1px;display:inline-block;text-align:center;"><a class="db" title="${r2[b]}" style="color:#6694ff;" target=_blank href="https://www.steamcardexchange.net/index.php?gamepage-appid-${b}">&Copf;</a></div>`);
        $(a).after(`<div style="margin:1px;width:16px;height:16px;padding:1 1 1 1px;display:inline-block;text-align:center;"><a class="db" style="color:#f7cb08;" target=_blank href="https://barter.vg/steam/${c}/${b}/" target=_blank>&Bopf;</a></div>`);
        $(a).after(`<div style="margin:1px;width:16px;height:16px;padding:1 1 1 1px;display:inline-block;text-align:center;"><a class="db" style="color:#67c5f1;" target=_blank href="https://help.steampowered.com/zh-cn/wizard/HelpWithGame/?appid=${b}" target=_blank>&Hopf;</a></div>`);
    }
    else {
        if ($.inArray(b, ownedPackages) > -1)
            color = '#59b946';
        if ($.inArray(b, cartPackages) > -1)
            color = '#f7cb08';
    }
    if (color){
        $(a).css('background-color', color);
    }
}

function markb(a, b, c, d){
    var m = /steamdb.info|barter.vg/.exec(b);
    if (!m)
        $(a).after(`<div style="margin:1px;width:16px;height:16px;padding:1 1 1 1px;display:inline-block;text-align:center;"><a class="dbc" style="color:#282e39;" target=_blank href="https://steamdb.info/${d}/${c}/" target=_blank>&Dopf;</a></div>`);
}

function mark(a){
    a.each(function(i, v){
        var h = $(this).attr('href');
        var m = /(app|sub)(\/|id\-)(\d+)/.exec(h);
        if (m){
            var id = parseInt(m[3]);
            marka(this, id, m[1]);
            markb(this, h, id, m[1]);
        }
    });
}

function mark2(a){
    a.each(function(i, v){
        var h = $(this).attr('data-img');
        var m = /(app|sub)s\/(\d+)/.exec(h);
        if (m){
            var id = parseInt(m[2]);
            marka(this, id, m[1]);
            markb(this, h, id, m[1]);
        }
    });
}

function mark3(a){
    a.each(function(i, v){
        var h = $(this).attr('href');
        var m = /gamelisting_(\d+)/.exec(h);
        if (m){
            var id = parseInt(m[1]);
            marka(this, id, 'app');
            markb(this, h, id, 'app');
        }
    });
}