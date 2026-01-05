// ==UserScript==
// @name        1337X - Subtitle download links to TV and Movie torrents
// @description  Adds download links for subtitles to every TV and movie torrent on 1337x (addic7ed & subscene)
// @namespace   NotNeo
// @icon        https://i.imgur.com/osa4FfN.png
// @include     http*://1337x.to/torrent/*
// @include     http*://1337x.st/torrent/*
// @include     http*://1337x.ws/torrent/*
// @include     http*://1337x.eu/torrent/*
// @include     http*://1337x.se/torrent/*
// @include     http*://1337x.is/torrent/*
// @include     http*://1337x.gd/torrent/*
// @include     http*://www.1337x.to/torrent/*
// @include     http*://www.1337x.st/torrent/*
// @include     http*://www.1337x.ws/torrent/*
// @include     http*://www.1337x.eu/torrent/*
// @include     http*://www.1337x.se/torrent/*
// @include     http*://www.1337x.is/torrent/*
// @include     http*://www.1337x.gd/torrent/*
// @version     2.2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29467/1337X%20-%20Subtitle%20download%20links%20to%20TV%20and%20Movie%20torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/29467/1337X%20-%20Subtitle%20download%20links%20to%20TV%20and%20Movie%20torrents.meta.js
// ==/UserScript==

setTimeout(function() {

    let cat = document.querySelectorAll(".torrent-detail-page > div:nth-child(2) > div:nth-child(1) > .list")[0].firstElementChild.lastElementChild.textContent;

    if ( cat == "TV" ) {
        let torrentTitle = document.querySelectorAll("h1")[0].textContent;
        let baseURL = "https://www.addic7ed.com/srch.php?search=";
        let place = document.querySelectorAll(".torrent-detail-page > div:nth-child(2) > div:nth-child(1) > ul:not(.list):nth-child(1)")[0];
        let subLi = document.createElement("li");
        let mouseOverIn = "this.style.backgroundColor = '#396a93';";
        let mouseOutIn = "this.style.backgroundColor = '#4682b4';";
        subLi.innerHTML = '<li class="subDownL"><a class="btn btn-magnet" style="border-radius: 3px; padding: 4px 4px 4px 50px; font-size: 15px; width: 100%; font-family: Oswald Bold,sans-serif; text-transform: uppercase; background-color:SteelBlue" onMouseOver="' + mouseOverIn + '" onMouseOut="' + mouseOutIn + '" href="' + baseURL + encodeURI(torrentTitle) + '"><span><i><img src="https://www.addic7ed.com/favicon.ico" style="float: left; margin-left: -40px;" alt="Download subtitles for this torrent" height="20" width="20"></i></span>  Subtitle Download</a> </li>';
        place.appendChild(subLi);
    }else if ( cat == "Movies" ) {
        let searchTerm = document.querySelectorAll(".torrent-detail-info h3");
        if(!searchTerm || searchTerm.length == 0) {
            searchTerm = document.querySelectorAll("h1")[0].textContent;
        }
        else {
            searchTerm = searchTerm[0].textContent;
        }
        let baseURL = "https://subscene.com/subtitles/searchbytitle?query=";
        let place = document.querySelectorAll(".torrent-detail-page > div:nth-child(2) > div:nth-child(1) > ul:not(.list):nth-child(1)")[0];
        let subLi = document.createElement("li");
        let mouseOverIn = "this.style.backgroundColor = '#396a93';";
        let mouseOutIn = "this.style.backgroundColor = '#4682b4';";
        subLi.innerHTML = '<li class="subDownL"><a class="btn btn-magnet" style="border-radius: 3px; padding: 4px 4px 4px 50px; font-size: 15px; width: 100%; font-family: Oswald Bold,sans-serif; text-transform: uppercase; background-color:SteelBlue" onMouseOver="' + mouseOverIn + '" onMouseOut="' + mouseOutIn + '" href="' + baseURL + encodeURI(searchTerm) + '"><span><i><img src="https://subscene.com/favicon.ico" style="float: left; margin-left: -40px;" alt="Download subtitles for this torrent" height="20" width="20"></i></span>  Subtitle Download</a> </li>';
        place.appendChild(subLi);
    }

}, 100);