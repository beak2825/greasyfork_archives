// ==UserScript==
// @name        Kinopoisk and IMDB torrent download
// @description Allows to search for torrents (via Torrtilla site) on 2 major movies databases: Kinopoisk and IMDB
// @namespace   torrents
// @include     http://www.imdb.com/title/*
// @include     http://www.kinopoisk.ru/film/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16164/Kinopoisk%20and%20IMDB%20torrent%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/16164/Kinopoisk%20and%20IMDB%20torrent%20download.meta.js
// ==/UserScript==
$(document).ready(function(){
    if (window.location.href.indexOf('kinopoisk')===-1)
    {     
        var header=$('.header');
        var title_and_year=header.find('span[itemprop=name]').text()+' '+header.find('span.nobr').text().replace('(', '').replace(')', '');
        var m_left=-2;
    }
    else
    {
        var header=$('.moviename-big');
        var title_and_year=$('span[itemprop=alternativeHeadline]').text()+' '+$('#infoTable').find('A:first').text();
        var m_left=5;
    }

    var link='<A target="_blank" href="http://torrtilla.ru/torrents/'+encodeURIComponent(title_and_year)+'#movies"><IMG src="https://lh6.googleusercontent.com/hVNzW9m-TLQ0Z3WrtOnTyJg1uOS0d8P8CT29sm_ZaqBhuRgDLnnArtGR6q4nSgnQS-_DNHis7Q=s32-h32-e365" alt="torrtilla" style="vertical-align:-20%; margin-left:'+m_left+'px;"></A>';
  
    header.append(link);
});