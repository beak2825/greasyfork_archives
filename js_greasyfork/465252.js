// ==UserScript==
// @name         GazelleGames PlayAsia Uploady
// @namespace    https://greasyfork.org/
// @version      0.4
// @license      MIT
// @description  GGN Uploady Script using data from Play-Asia, from FinalDoom base uploady framework
// @author       drlivog
// @match        https://gazellegames.net/upload.php
// @match        https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php?action=editgroup&*
// @match        https://gazellegames.net/torrents.php?id=*
// @match        https://gazellegames.net/upload.php?groupid=*
// @match        https://gazellegames.net/torrents.php?action=edit&*
// @match        https://www.play-asia.com/*/13/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://raw.githubusercontent.com/tengattack/html2bbcode.js/master/lib/html2bbcode.js#sha256=8szzypnTS8AecoP8w5zWksLeiniDbO78pr+BZy/jQXo=
// @require      https://raw.githubusercontent.com/FinalDoom/gazelle-uploady/master/common.js#sha256=VuqvEsflVlU4wriqFlMUR8GXljnwVHCsjT2cowz/L5k=
// @downloadURL https://update.greasyfork.org/scripts/465252/GazelleGames%20PlayAsia%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/465252/GazelleGames%20PlayAsia%20Uploady.meta.js
// ==/UserScript==

/* globals $ GameInfo UploadyFactory */
/*jshint esversion: 11 */


function getGameInfo() {
    const playasia = new GameInfo();
    var match_platform = $('#comptext').text().match(/Compatible with\s?(.+)\s\(/);
    if (match_platform) {
        playasia.platform = match_platform[1].replace("™","").trim();
    }
    playasia.title = $('#pname_seg .p_name')?.text()?.trim();
    playasia.publisher = $('[itemprop=brand] span')?.text()?.trim();
    if ($('#further_info tr td:contains("Language")').length>0) {
        playasia.addLanguage($('#further_info tr td:contains("Language")')?.next('td')?.text()?.split(", "));
    }
    playasia.description = $('[itemprop="description"]')?.text()?.trim();
    playasia.year = $('#further_info tr td:contains("Release Date")')?.next('td')?.text()?.trim();
    var rating_box = $('#further_info > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2)').text();
    var rating_match = rating_box.match(/((?:PEGI|ESRB|CERO).*)/);
    if (rating_match) {
        playasia.rating = rating_match[1].trim();
    } else {
        playasia.rating = $('#further_info tr td:contains("PEGI"),td:contains("ESRB"),td:contains("CERO")')?.text()?.split("    ")[0].trim();
    }
    var tag = $('#further_info tr td:contains("Genre")')?.next('td')?.text()?.trim();
    if (tag != "Misc") {
        playasia.addTag(tag);
    }
    playasia.website = $('#links a:contains("Official Website")').attr('href');
    playasia.cover = $('#main-img > img').attr('src').trim().replace("//","https://").split("?")[0];
    var trailers = [...$('iframe[src]')];
    //var trailer = trailers?.pop()?.src;
    //var ytmatch = trailer?.match(/youtube.com\/embed\/(.*)/);
    //playasia.trailer = ytmatch ? `https://youtu.be/${ytmatch[1]}` : trailer;
    var trailer;
    var ytmatch;
    while (trailers.length > 0) {
        trailer = trailers?.pop().src;
        ytmatch = trailer.match(/youtube.com\/embed\/(.*)/);
        if (!playasia?.trailer) {
            playasia.trailer = ytmatch ? `https://youtu.be/${ytmatch[1]}` : trailer;
            console.log(`Trailer: ${playasia.trailer}`);
            continue;
        }
        if (!playasia?.extraInfo) {
            playasia.extraInfo = {};
        }
        if ('videos' in playasia.extraInfo) {
            playasia.extraInfo.videos += ", " + ytmatch ? `https://youtu.be/${ytmatch[1]}` : trailer;
        } else {
            playasia.extraInfo.videos = ytmatch ? `https://youtu.be/${ytmatch[1]}` : trailer;
        }
    }
    const images = $('.hidmob .p-thumb img');
    playasia.addScreenshot(...images.slice(0).map( function() { return $(this).attr('src').replace("//","https://").split("?")[0]; }).toArray());
    if (!('extraInfo' in playasia)) {
        playasia.extraInfo = {};
    }
    playasia.extraInfo.publisher = $('[itemprop=brand] span')?.text()?.trim();
    playasia.extraInfo.storeLink = window.location.toLocaleString();
    console.log(playasia);
    return playasia;
}

(function() {
    'use strict';
    const factory = new UploadyFactory();
    factory.build(
    'Search PlayAsia',
    (title) => `https://www.play-asia.com/search/${title.replaceAll(/[_.,]/g," ").replaceAll(/\-.*$/g,"").replaceAll("JPN","").replaceAll("NSW","").trim()}-4399`, //-4399 for Games Category?
    (resolve) => resolve(getGameInfo()),
  );
})();