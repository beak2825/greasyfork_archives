// ==UserScript==
// @name         RED : Streaming Search Links
// @description  Adds Spotify, Deezer or Tidal search links on RED
// @author       Quoph
// @version      1.3.10
// @include      http*://redacted.ch/*
// @include      http*://*orpheus.network/*
// @include      http*://notwhat.cd/*
// @grant        none
// @namespace    https://greasyfork.org/users/165243
// @downloadURL https://update.greasyfork.org/scripts/36937/RED%20%3A%20Streaming%20Search%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/36937/RED%20%3A%20Streaming%20Search%20Links.meta.js
// ==/UserScript==
//
// Quoph's non-API version, credits to orkyl, aphex80, spacepandas and duskyliability for the original Spotify Integration script.
//
// CHANGELOG
// 1.3.10    14/12/2019
//      fix: Improved forum post link translation
//
// 1.3.9     8/11/2019
//      add: Include new Orpheus URL
//      add: Album and Artist search strings for Spotify and Tidal web searches
//
// 1.3.8     20/10/2019
//      fix: Spotify web search url
//
// 1.3.7     28/06/2019
//      add: Links added to official forum post torrent links
//      fix: Reconfigured Tidal search urls as generic searches
//
// 1.3.6     30/03/2018
//      add: Links added to bookmarked requests & requests on user pages
//      fix: Don't display links if no requests found
//      fix: Generate links for Various Artist releases on collages and bookmarks page
//
// 1.3.5     05/03/2018
//      add: Links added requests.php
//      add: Links added to compositions and requests sections on Artist pages
//
// 1.3.4     12/02/2018
//      add: Script settings added to user settings page to allow changes from APL and NWCD
//      fix: General code tidying
//      fix: Only run (get settings) on pages with links
//
// 1.3.3     11/02/2018
//      add: Transfer settings from RED to APL and NWCD
//
// 1.3.2     11/02/2018
//      fix: No blank tabs when opening Spotify app
//
// 1.3.1     11/02/2018
//      add: User preferences placed on forum thread
//    to do: APL & NWCD user settings solution
//      add: (Artist page) Links generated on Singles, Live Albums, Anthologies, Remixes, Mixtapes,
//           Appearances, Produced Bys, Mixed Bys and Compilations
//      fix: Consolidated link creation with functions (DRY)
//   change: Name changed to Streaming Search Links to reflect the additional streaming services
//
// 1.2.1     04/02/2018
//      add: Tidal links
//
// 1.2       02/01/2018
//      add: Deezer Links
//      add: Support for more trackers: APL and NWCD.
//      add: Support for secure and non-secure domain URLs.
//   change: Moved from pastebin to Greasy Fork.

var settings = getSettings();

if (window.location.href.indexOf('threadid=17119') > -1 || window.location.href.indexOf('user.php?action=edit') > -1) {
    showSettings();
}

function showSettings() {
    var div = document.getElementById('SSLSettings');
    var userSettings = window.location.href.indexOf('user.php?action=edit') > -1;
    if (userSettings && !div) {
        div = document.createElement('table');
        div.setAttribute('id', 'SSLSettings');
        $(".main_column").append(div);
    }
    if(window.location.href.indexOf('threadid=17119') > -1 && !div) {
        var before = document.getElementsByClassName('forum_post')[0];
        div = document.createElement('div');
        div.setAttribute('id', 'SSLSettings');
        before.parentNode.insertBefore(div, before);
        div.setAttribute('style', 'width: 100%; text-align: center;');
        div.setAttribute('class', 'box');
    }
    div.innerHTML = (userSettings ? '<tbody><tr class="colhead_dark"><td colspan="2"><strong>Streaming Search Links Settings</strong></td></tr><tr><td>' : '<h2>Streaming Search Links Settings</h2><br />') + '<span>Deezer</span><span>Tidal</span><span>Spotify</span><span>Spotify Player: </span>' + (userSettings ? '</td></tr></tbody>' : '');
    var settings = getSettings();
    var span = div.getElementsByTagName('span');
    function createCheckbox (name, setting, mySpan) {
        var checkbox=document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute("name", name);
        checkbox.setAttribute('style', 'margin: 0 10px;');
        checkbox.checked = setting ? setting:'';
        checkbox.addEventListener('change', changeSettings.bind(undefined, checkbox, div, undefined), false);
        mySpan.appendChild(checkbox);
    }
    createCheckbox ("Deezer", settings.Deezer, span[0]);
    createCheckbox ("Tidal", settings.Tidal, span[1]);
    createCheckbox ("Spotify", settings.Spotify, span[2]);
    var select=document.createElement('select');
    var op = new Option();
    op.text = "APP";
    var op2 = new Option();
    op2.text = "WEB";
    select.options.add(op);
    select.options.add(op2);
    select.selectedIndex = (settings.spotifyApp ? 0 : 1);
    select.addEventListener('change', changeSettings.bind(undefined, select, div, select.selectedIndex), false);
    span[3].appendChild(select);
    div.appendChild(document.createElement('br'));
}

function changeSettings(obj, div, val) {
    var settings = getSettings();
    var x = div.getElementsByTagName('input');
    var sel = div.getElementsByTagName('select');
    if (obj == x[0]) {
        if(x[0].checked) {
            settings.Deezer = true;
        } else
            settings.Deezer = false;
    }
    if (obj == x[2]) {
        if(x[2].checked) {
            settings.Spotify = true;
        } else
            settings.Spotify = false;
    }
    if (obj == x[1]) {
        if(x[1].checked) {
            settings.Tidal = true;
        } else
            settings.Tidal = false;
    }
    if (obj == sel[0]) {
        if(val !== 1) {
            settings.spotifyApp = false;
        } else
            settings.spotifyApp = true;
    }
    window.localStorage.spotifySearchLinksSettings = JSON.stringify(settings);
    showSettings();
}

function getSettings() {
    var settings = window.localStorage.spotifySearchLinksSettings;
    if (!settings) {
        settings = {Deezer:false, Spotify:true, Tidal:false, spotifyApp:true};
    } else
        settings = JSON.parse(settings);
    if (settings.spotifyApp) {
        spotURL = 'spotify:search:';
    } else {
        spotURL = 'https://open.spotify.com/search/';
    }
    return settings;
}

var deezURL = 'http://www.deezer.com/search/';
var tidURL = 'https://listen.tidal.com/search/';
var SpotAlb = settings.spotifyApp ? '' : "/albums";
var SpotArt = settings.spotifyApp ? '' : "/artists";
var deezIMG = ['Listen on Deezer','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKNSURBVFhH7dfvSxNxHAdw/4p6Hj2ydjftrt3Nu1UTIirBSItl5s+VurTNprPpbE1xM9ZkaitTKyVMk9iTIRkUpYjSk7IQeuCTwp4UZESE0IN3uyuaH08RJLaCPXhxx32+3Pd9n+99H3wzMllev4vhopk6bjl+RTL8niuqzJ2h3KwuJlk0I5lfvpYyt9KBdYvJkg6QDpCUAN7xSfTNvyOKXT61lpQAjuvD6IhNEQU1TrW2pQDNJ2ux0PGQeGDvWnes4tJwFOGZBcJS71FrWwrgLKjCnPceMWQLrDtWcbFvBFcfzxEnal1q7f8M8NeXINcoYdpl1eCyDZqXKRzHz+J5yx1ioLodzb5KjMe8hMtTtvlPeEiSseS3axg4QTO54kqRA++vTRCxhgiCvXWYnQ8TgS7b5tvwgJCDCUepxkYdsOWXI9YYIborPXC6S3B31E3YG4thC95E6+gEkW+tU9+lBjgsm/A15NTYqAP+Mw1Y7n1GPG0eRE9/PV4v3iBCkQvxlk9jaPEzUdry66dVA+xjsjDG7NA4dYzD2G2RGOwRYWXzMcLaiQBbhrLzInxhiSipFrHXFYQYuk9kWaoSAY4wLFZ02zWazvFYWZKJD28kdLLl+KaPEFN6D9p6JDx6ZSYuhyTIIzMwv/hC8M7ORACZycYAs1OjMI/DQLdIhAMCSpg83GJriFb2NIqsIpr8EmGpEMDb2yC09xNZhRWJAEfjHYBum4a7mgc+ysSntxKCbAV+6PuIWb0XHREZTxbMhLIM8tgccl9+J5RlSXfgTwAmTtkJa2Vz8ef7eUI28eAYASbGRBiZHHACDzFeX22PgYfOaIZOPkjs5qVEgFRKB0h9gH/haJbiw2lKj+e8/if7hYp3VOy3mwAAAABJRU5ErkJggg=='];
var spotIMG = ['Listen in Spotify','data:image/png;charset=utf-8;base64,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'];
var tidIMG = ['Listen on Tidal','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAKESURBVFhHvZVJaiphFIVLAyEDJ4qjBKPo1BayhDg0CCoqToJkG4HY4QZMJARFcAUiuAqbsQ1RHIQQp1FjQ27e/R+/qeZW6UNe/fCBde6pOsdqBdECnZEsyqAHbFEDPSFFPSFFPVGKTqdToVGcnp7CxcUFOZPjcDjAaDRSM6mQyWTg8/MTrq+vJbocDG80GjAej/cW9nq98P7+DtVqlSrxu5HL5eD7+5sxn89VS2B4s9nceSeTiWoJDP/4+Nh5a7WavMTfH/l8fmfiYIlgMCg2K8I5VAmfzycJ58hKCFAoFBQmjrjE2dkZtFot0odMp1NwuVzM6/f7YTabkT6kXq/DyckJCMVikTSIwRKhUEgznIMlotGoZjgHSwh3d3ew3W5JAwdPI57O5+dnci6m1+tBIBCA0WhEzsXgZWeXIJ1Oq5bAcLyR0GcwGKBcLpM+pNvtgtVqZd7Ly0sYDoekD8lms8zHCiBUCXx0PB4PNzKwxNPTk8SHdDodsFgsEi++IwaDgcKLj7rI97vD7e0tbDYbZsJwt9stNu7AEo+Pj7sDUuEceYmHhwe5R7LBSry9vamGiymVStBut8FsNpNzzvn5OfT7fbi/v6fmCgFMJpNCo8DrHIlEyJkcjWOS4l5sNhu70xeLBXtEKc+BkKIm+M9fX19313W5XB5TghRVkYeLS9zc3JD77IEUSex2O/v6ycM5X19fEA6HyX01IEUF+B045O2GJa6urshjqECKJKlUCtbrNRnMUfnma0GKqiSTSdUSlUrlX8MRUtQkkUgoSry8vLA3JOXfAynuJR6Pw2q1OjYcIcWDiMVi7JtwRDhCinpCinpCinrCFjXQA8miDP+TP0sQfgAbiI7MBa0d0QAAAABJRU5ErkJggg=='];
var d, s, t, links, spotURL;

function linkSetting() {
    var settings = getSettings();
    var linksArray = [];
    if (settings.Deezer) {linksArray.push(d);}
    if (settings.Spotify) {linksArray.push(s);}
    if (settings.Tidal) {linksArray.push(t);}
    links = linksArray;
    return links;
}
function createLink(link, linkData) {
    var a = document.createElement('a');
    a.href = link;
    if (link.indexOf('spotify:search:') === -1) {
        a.setAttribute('target', '_blank'); }
    a.title = linkData[0];
    var img = document.createElement('img');
    img.style.border = 'none';
    img.style.marginLeft = '3px';
    img.style.marginRight = '3px';
    img.style.position = "relative";
    img.style.top = '2px';
    img.src = linkData[1];
    img.width = 14;
    a.appendChild(img);
    return a;
}
function createLinks (whatArtist, whatAlbum) {
    d = createLink(deezURL + encodeURIComponent(whatArtist) + "%20" + encodeURIComponent(whatAlbum) + "/album", deezIMG);
    s = createLink(spotURL + encodeURIComponent(whatArtist) + "%20" + encodeURIComponent(whatAlbum) + SpotAlb, spotIMG);
    t = createLink(tidURL + "albums?q=" + encodeURIComponent(whatArtist) + "%20" + encodeURIComponent(whatAlbum), tidIMG);
    linkSetting();
}
function createArtistLinks (whatArtist) {
    d = createLink(deezURL + encodeURIComponent(whatArtist) + "/artist", deezIMG);
    s = createLink(spotURL + encodeURIComponent(whatArtist) + SpotArt, spotIMG);
    t = createLink(tidURL + "artists?q=" + encodeURIComponent(whatArtist), tidIMG);
    linkSetting();
}
/*****************************************/
/** Top 10 / Collage Updates / Torrents **/
/*****************************************/
if (window.location.href.indexOf('top10.php') > -1 || window.location.href.indexOf('userhistory.php') > -1 || window.location.href.indexOf('torrents.php') > -1) {
    var groups = $('div.group_info');
    $(groups).each(function(i, group) {
        var myArtist = $(group).find('a[href*="artist.php"]')[0];
        var myAlbum = $(group).find('a[href*="torrents.php?id"]')[0];
        createLinks($(myArtist).text(), $(myAlbum).text());
        $(group).prepend(links);
    });
}
/*************************************/
/** Collage & Bookmark torrent page **/
/*************************************/
if (window.location.href.indexOf('collages.php') > -1 || window.location.href.indexOf('collage.php?id') > -1 || window.location.href.indexOf('bookmarks.php?type=torrents') > -1) {
    var groups = $('.group');
    $(groups).each(function(i, group) {
        var whatArtistElement = $(group).find('a[href*="artist.php"]')[0];
        var whatAlbumElement = $(group).find('a[href*="torrents.php?id"]')[0];
        createLinks($(whatArtistElement).text(), $(whatAlbumElement).text());
        if (typeof whatArtistElement == "undefined") {
            $(whatAlbumElement).before(links);}
        else {
            $(whatArtistElement).before(links);}
    });
}
/*************************************/
/*********** Artist page *************/
/*************************************/
if (window.location.href.indexOf('artist.php') > -1) {
    createArtistLinks($('h2').first().text());
    {$('h2').append(links);}
    var groups = $('#torrents_album, #torrents_ep, #torrents_anthology, #torrents_single, #torrents_live_album, #torrents_remix, #torrents_mixtape').find('div.group_info');
    var groups2 = $('#torrents_guest_appearance, #torrents_produced_by, #torrents_remixed_by, #torrents_compilation, #torrents_composition').find('div.group_info');
    $(groups).each(function (i, group) {
        whatAlbum = $(group).find('a[href*="torrents.php?id"]')[0];
        createLinks($('h2').first().text(), $(whatAlbum).text());
        $(group).prepend(links);
    });
    $(groups2).each(function (i, group) {
        whatArtistElement = $(group).find('a[href*="artist.php"]')[0];
        whatAlbum = $(group).find('a[href*="torrents.php?id"]')[0];
        createLinks($(whatArtistElement).text(), $(whatAlbum).text());
        $(group).prepend(links);
    });
}
/*************************************/
/*********** Torrent page ************/
/*************************************/
if (window.location.href.indexOf('torrents.php?id') > -1) {
    createLinks($('h2 > a').first().text(), $('h2 > span').text());
    $('h2').append(links);
}
/*************************************/
/******* Bookmark artist page ********/
/*************************************/
if (window.location.href.indexOf('bookmarks.php?type=artists') > -1) {
    var tds = $('.artist_table').find('.rowa, .rowb').find('td');
    var artists = $('.artist_table').find('a[href*="artist.php?id"]');
    $(artists).each(function(i, artistElement) {
        createArtistLinks($(artistElement).text());
        $(tds[i]).prepend(links);
    });
}
/*************************************/
/************* Requests **************/
/*************************************/
if (window.location.href.indexOf('requests.php') > -1 || window.location.href.indexOf('bookmarks.php?type=requests') > -1 || window.location.href.indexOf('user.php?id=') > -1 || window.location.href.indexOf('artist.php') > -1) {
    var tds = $('.request_table').find('.rowa, .rowb').find('td:first');
    $(tds).each(function(i, group) {
        var whatArtist = $(group).find('a[href*="artist.php?id"]')[0];
        var whatAlbum = $(group).find('a[href*="requests.php?action=view&id"]')[0];
        if (typeof whatAlbum != "undefined") {
            createLinks($(whatArtist).text(), $(whatAlbum).text().slice(0, -7));
            $(group).prepend(links);
        }
    });
}
/*************************************/
/*********** Request page ************/
/*************************************/
if (window.location.href.indexOf('requests.php?action=view&id') > -1) {
    var whatArtist = $('h2').find('a[href*="artist.php?id"]')[0];
    var whatAlbum = $('h2').find('a[href*="torrents.php?torrentid"]')[0];
    createLinks($(whatArtist).text(), $(whatAlbum).length ? $(whatAlbum).text() : $('h2 > span').text());
    $('h2').append(links);
}
/*************************************/
/*********** Forum Posts *************/
/*************************************/
    var post = $('.forum_post .body');
    $(post).each(function(i, b){
        var as = $(this).find('a');
        $(as).each(function() {
            if (this.href.indexOf('torrents.php?id=') > -1 || this.href.indexOf('bandcamp.com/album/') > -1 ){
                var [thisArtist, thisAlbum] = $(this).text().split(" - ");
                if (typeof thisAlbum != "undefined") {
                    var year = thisAlbum.search(/\s\(\d{4}\)/);
                    if (year > -1 ) {
                        createLinks((thisArtist), (thisAlbum).slice(0, year));}
                    else {
                        createLinks((thisArtist), (thisAlbum));}
                    $(this).prepend(links);
                }
        }});
           });
