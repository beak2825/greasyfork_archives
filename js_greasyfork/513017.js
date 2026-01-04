// ==UserScript==
// @name         RYM: All releases chart from artist page
// @namespace    https://github.com/sercep/userscripts
// @version      1.2.1
// @description  Add links to all releases chart from this artist sorted by popularity on artist page
// @author       sercep
// @match        https://rateyourmusic.com/artist/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513017/RYM%3A%20All%20releases%20chart%20from%20artist%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/513017/RYM%3A%20All%20releases%20chart%20from%20artist%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = document.URL;
    var artistlink = "https://rateyourmusic.com/artist/";
    var credits = "/credits/"
    var artistlinkname = url.replace(artistlink, '');
    artistlinkname = artistlinkname.replace(credits, '');
    var songratings = document.querySelector(".page_artist_tracks_track_stats_scores");
    var page_artist_section_song_guide = document.querySelector(".page_artist_section_song_guide");
    if (!page_artist_section_song_guide) {
            console.log('no songs');
        }
    else {
        if (!songratings) {
            console.log('no songs ratings');
        }
        else {
            songratings = songratings.lastElementChild.textContent.trim().replace("k","000");
            if (songratings > 300) {
                document.querySelector(".page_artist_section_song_guide").innerHTML = "<span class=\"highlighted\"><i class=\"fa fa-caret-down\"></i><a href=\"https://rateyourmusic.com/charts/popular/song/all-time/a:" + artistlinkname + "/\"> Popular songs</a></span> <span>|</span> <span class=\"\"><a href=\"https://rateyourmusic.com/charts/top/song/all-time/a:" + artistlinkname + "/\">Top songs</a></span>";
            }
            else {
                document.querySelector(".page_artist_section_song_guide").innerHTML = "<span class=\"highlighted\"><i class=\"fa fa-caret-down\"></i><a href=\"https://rateyourmusic.com/charts/popular/song/all-time/a:" + artistlinkname + "/\"> Popular songs</a></span> <span>|</span> <span class=\"\"><a href=\"https://rateyourmusic.com/charts/esoteric/song/all-time/a:" + artistlinkname + "/\">Top (esoteric) songs</a></span>";
            }
        }
    }

    const artistLinks = document.querySelectorAll("div.artist_info a.artist");
    const artists = [];
    artistLinks.forEach(link => {
        const href = link.getAttribute("href");
        const match = href.match(/\/artist\/([^\/]+)/);
        if (match && match[1]) {
            artists.push(match[1]);
        }
    });
    const relatedArtists = artists.join(",");

    var artistname = document.querySelector(".artist_name_hdr").textContent;
    var info_hdr = document.querySelector(".info_hdr").textContent;
    var discography_number = document.querySelector(".artist_page_section_active_music").textContent.replace(/\D/g,'');

    function addField() {
        const artistInfo = document.querySelector('.artist_info');
        const headers = artistInfo.querySelectorAll('.info_hdr');
        let shareHeader = null;
        const headerMap = {};
        headers.forEach(function(header) {
            if (header.textContent.trim() === "Share") {
                shareHeader = header;
            }
            const headerText = header.textContent.trim();
            headerMap[headerText] = header;
        });
        let shareContent = shareHeader.nextElementSibling;
        const newHeader = document.createElement('div');
        newHeader.className = 'info_hdr';
        newHeader.textContent = 'Charts';
        const newContent = document.createElement('div');
        newContent.className = 'info_content';
        newContent.style.minHeight = '1em';
        newContent.style.marginTop = '0.25em';
        var newLink = document.createElement('a');
        const newspan = document.createElement('span');
        if (discography_number > 0) {
            newLink.href = "https://rateyourmusic.com/charts/popular/album,ep,comp,single,video,unauth,mixtape,musicvideo,djmix,additional/all-time/a:" + artistlinkname + "/incl:live,archival,soundtrack/";
            newLink.textContent = "All releases by " + artistname;
            newContent.appendChild(newLink);
            newContent.appendChild(newspan);
            if (relatedArtists) {
            newspan.textContent = "    |    ";
            newContent.appendChild(newspan);
            }
        }
        if (!relatedArtists) {
            console.log('no related artists');
        }
        else {
            newLink = document.createElement('a');
            if (discography_number == 0) {
                newLink.href = "https://rateyourmusic.com/charts/popular/album,ep,comp,single,video,unauth,mixtape,musicvideo,djmix,additional/all-time/a:" + relatedArtists + "/incl:live,archival,soundtrack/";
            }
            else {
                newLink.href = "https://rateyourmusic.com/charts/popular/album,ep,comp,single,video,unauth,mixtape,musicvideo,djmix,additional/all-time/a:" + artistlinkname + "," + relatedArtists + "/incl:live,archival,soundtrack/";
            }
            newLink.textContent = "All releases by";
            if (headerMap['Members']) {
                newLink.textContent = newLink.textContent + " members,";
            }
            if (headerMap['Member of']) {
                newLink.textContent = newLink.textContent + " bands,";
            }
            if (headerMap['Related Artists'] || headerMap['Notes']) {
                newLink.textContent = newLink.textContent + " related artists,";
            }
            if (headerMap['Also Known As']) {
                newLink.textContent = newLink.textContent + " AKAs";
            }
            newLink.textContent = newLink.textContent.replace(/,\s*$/, "");
            if (discography_number > 0) {
                newLink.textContent = newLink.textContent + " and " + artistname;
            }
            newContent.appendChild(newLink);
        }
        shareContent.parentNode.insertBefore(newHeader, shareContent.nextSibling);
        shareContent.parentNode.insertBefore(newContent, newHeader.nextSibling);
    }
    window.addEventListener('load', addField);
})();