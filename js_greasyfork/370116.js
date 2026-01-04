// ==UserScript==
// @name        [KissAnime] Beta Default Server
// @namespace   https://greasyfork.org/en/users/193865-westleym
// @author      WestleyM
// @version     2019.01.19
// @icon        http://kissanime.ru/Content/images/favicon.ico
// @description Sets KissAnime/Kimcartoon player to beta server.
// @grant       none
// @include     *://kissanime.ru/anime/*
// @include     *://kimcartoon.me/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/370116/%5BKissAnime%5D%20Beta%20Default%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/370116/%5BKissAnime%5D%20Beta%20Default%20Server.meta.js
// ==/UserScript==

function main() {
    var updateLink = "&s=beta&pfail=3";
    var $ = window.jQuery;
    var webLink = window.location.href;
    console.log(webLink);
    //kimcartoon
    if (webLink.indexOf("kimcartoon") > -1) {
        if (webLink.indexOf("&s=") > -1 && webLink.indexOf("&s=beta") === -1) {
            window.stop();
            var currentServer = webLink.substring(webLink.indexOf("&s="), webLink.length); //Grabs string starting with &s= until the end of the link
            webLink = webLink.replace(currentServer, "&s=beta");
            location.replace(webLink);
        } else if (webLink.indexOf("&s=") === -1 && webLink.indexOf("id=") > -1) {
            window.stop();
            webLink += "&s=beta";
            location.replace(webLink);
        }
    }

    //kissanime
    //Redirect to the beta server if the script detects you are on the default one
    if (webLink.indexOf("kissanime") > -1) {
        if(webLink.indexOf("&s=default") > -1) {
            window.stop();
            webLink = webLink.replace("&s=default", updateLink);
            location.replace(webLink);
        }
        //Works when on the page for watching the anime
        try {
            //Updates the links in the episode box
            var selectEpisode = $("#selectEpisode").find("option").toArray();
            if (selectEpisode != null) {
                selectEpisode.forEach(function(episodeLink) {
                    episodeLink.value += updateLink;
                });
            }

            //Updates the link on the "previous" button
            var btnPrevious = $("#btnPrevious").parent()[0];
            if (btnPrevious != null) {
                btnPrevious.href += updateLink;
            }

            //Updates the link on the "next" button
            var btnNext = $("#btnNext").parent()[0];
            if (btnNext != null) {
                btnNext.href += updateLink;
            }
        }
        catch(err) {
            console.log("There was an error: " + err);
        }
    }
}

main();