// ==UserScript==
// @name         DEPRECATED: TRAKT.TV: YouTube trailer search and RARBG/Torrentleech link
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.8.4
// @description  adds a RARBG and a Torrentleech link to the link sidebar and a youtube trailer search behind the trailer button
// @author       Alistair1231
// @match        https://trakt.tv/*
// @icon         https://www.google.com/s2/favicons?domain=trakt.tv
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/427513/DEPRECATED%3A%20TRAKTTV%3A%20YouTube%20trailer%20search%20and%20RARBGTorrentleech%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/427513/DEPRECATED%3A%20TRAKTTV%3A%20YouTube%20trailer%20search%20and%20RARBGTorrentleech%20link.meta.js
// ==/UserScript==

function waitForSiteToLoad() {
    let value = document.querySelectorAll(".sidebar.affixable .external a");
    if (value == null) {
        setTimeout(waitForSiteToLoad, 300);
        return;
    }
    return value;
}

function injectRarbgButton(path, imdbButton) {
    console.log("injecting rarbg button");
    let imdbId = imdbButton.href.match(/tt\d+/)[0];

    let rarbgButton = document.createElement("a");
    rarbgButton.target = "_blank";
    // rarbgButton.innerHTML = "RARBG";
    rarbgButton.innerHTML = "<img width=16 height=16 alt=\"RARBG\" src=\"https://icons.duckduckgo.com/ip2/rarbg.to.ico\">";
    rarbgButton.id = "rarbgButton";

    if (path == "shows")
        rarbgButton.href = `https://rarbgproxy.org/tv/${imdbId}/`;
    else if (path == "movies")
        rarbgButton.href = `https://rarbgproxy.org/torrents.php?imdb=${imdbId}`;

    imdbButton.after(rarbgButton);
}
function injectTorrentleechButton(title, rarbgButton,path) {
    let torrentleechButton = document.createElement("a");
    torrentleechButton.target = "_blank";
    torrentleechButton.innerHTML = "<img width=16 height=16 alt=\"TL\" src=\"https://icons.duckduckgo.com/ip2/torrentleech.org.ico\">";
    torrentleechButton.id = "torrentleechButton";
    if(path == "shows")
        torrentleechButton.href = `https://www.torrentleech.org/torrents/browse/index/categories/27/query/${title}/orderby/seeders/order/desc`;
    if(path == "movies")
        torrentleechButton.href = `https://www.torrentleech.org/torrents/browse/index/categories/8,37,43,14,12,13,47,27/query/${title}/orderby/seeders/order/desc`;

    rarbgButton.after(torrentleechButton);
}
function injectYoutubeSearchButton(title) {

    //create button for youtube search
    let newLink = document.createElement("a");
    newLink.className = "popup-video one-liner trailer";
    newLink.target = "_blank";
    newLink.href = `https://www.youtube.com/results?search_query=%22${title}%22+trailer`;
    // copied from other button (for text and icon)
    newLink.innerHTML += '<div class="icon"><div class="fa fa-youtube-play"></div></div><div class="text"><div class="site">Trailer Search</div></div>';
    newLink.id = "youtubeSearchButton";


    //put new button after old, if not already there
    let oldTrailer = document.querySelector(".popup-video.one-liner.trailer");
    oldTrailer.after(newLink);
}

function run() {
    let path = window.location.pathname.split('/');
    let linkArray = document.querySelectorAll(".sidebar.affixable .external a");

    linkArray = waitForSiteToLoad();

    try {
        let title;
        if(window.location.pathname.split('/')[3]==null) // if on main page of tv-show
            title = document.querySelector(".mobile-title h1").firstChild.textContent.replace(/ $/g,""); // gets title and removes space at the end
        else // on page like /seasons/1
            title = document.querySelector(".mobile-title h2 a").innerHTML.replace(/: $/g,""); // gets title and removes ': ' from the end
        let urlTitle=encodeURIComponent(title);
        let imdbButton = Array.from(linkArray).filter(x => x.innerHTML == "IMDB")[0];

        if (document.getElementById("rarbgButton") == null) // if rarbg button doesn't exist
            injectRarbgButton(path[1], imdbButton);

        if ((document.querySelector("a.trailer")!=null) && (document.getElementById("youtubeSearchButton")==null)) // if there is a trailer button but no trailer search was added
            injectYoutubeSearchButton(urlTitle);

        if ((document.getElementById("torrentleechButton") == null) && (document.getElementById("rarbgButton") != null)) // if torrentleech button doesn't and rarbg button does exist
            injectTorrentleechButton(urlTitle, rarbgButton,path[1]);


    } catch (err) { }
}
(function () {
    'use strict';
    setInterval(run, 700);
})();
