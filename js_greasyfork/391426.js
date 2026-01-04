// ==UserScript==
// @name         vidsrc.me navigator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      apache2
// @description  Navigate between episodes on vidsrc.me
// @author       Aditya Sriram
// @match        https://vidsrc.me/embed/*/*-*/
// @grant        none
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391426/vidsrcme%20navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/391426/vidsrcme%20navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const patn = /embed\/(?<id>tt\d+)\/(?<season>\d+)-(?<episode>\d+)/gi;
    const match = patn.exec(window.location.pathname);
    const data = match ? match.groups : {};

    console.log(`tampered id: ${data.id}, season: ${data.season}, episode: ${data.episode}`);

    function checkForEp(id, season, ep, success, failure) {
        const queryurl = `/embed/${id}/${season}-${ep}/`;
        jQuery.get(queryurl, function(data) {
            if (data == "not found") {
                failure(queryurl);
            } else {
                success(queryurl);
            }
        });

    }

    function setStatus(status) {
        jQuery("div.header").html("<i>" + status + "</i>");
    }

    function resetStatus() {
        jQuery("div.header").html("change player");
    }

    function switchToUrl(newurl) {
        window.setTimeout(function() {window.location = newurl;}, 1000);
        setStatus("redirecting...");
    }

    function nextEp() {
        const id = data.id;
        const season = parseInt(data.season);
        const episode = parseInt(data.episode);
        setStatus("searching...");

        checkForEp(id, season, episode+1, switchToUrl, function(queryurl) {
            checkForEp(id, season+1, 1, switchToUrl, function(queryurl) {
                setStatus("<span style='color:crimson'> couldn't find any more episodes </span>" );
                window.setTimeout(resetStatus, 3000);
            });
        });
    }

    jQuery("body").append(`<div class="tm-next" style="
    color: white;
    background-color: rgba(0,0,0,0.6);
    right: 0px;
    position: absolute;
    top: calc(50% - 30px);
    font-weight: bold;
    border-radius: 5px;
    padding: 5px;
    font-size: 5em;
    cursor: pointer;
    ">⏭</div>`);

    jQuery(".tm-next").click(nextEp);

})();