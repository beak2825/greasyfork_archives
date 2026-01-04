// ==UserScript==
// @name        KissAnime Preferred Server
// @description Allows setting a preferred server for KissAnime without the need for an account
// @author      Imposter
// @namespace   github.com/Imposter
// @match       *://kissanime.to/*
// @match       *://kissanime.ru/*
// @match       *://kisscartoon.me/*
// @match       *://kisscartoon.se/*
// @version     2018.08.24
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/40377/KissAnime%20Preferred%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/40377/KissAnime%20Preferred%20Server.meta.js
// ==/UserScript==

const PreferredServer = "beta";

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getQueryParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

window.addEventListener("DOMContentLoaded", function (e) {
    // Check if we're on a video
    var selectServerElement = document.getElementById("selectServer");
    if (selectServerElement) {
        // Get available servers and their links
        var servers = {};
        for (var i = 0; i < selectServerElement.options.length; i++) {
            var link = selectServerElement.options[i].value;
            var server = getQueryParam("s", link);
            servers[server] = link;

            // Update link
            selectServerElement.options[i].value = link + "&manual=true";
        }

        // Check if we're already on the preferred server
        console.log("[KAPS] Checking current server");
        var currentServer = getQueryParam("s");
        var manualRedirect = getQueryParam("manual");
        if (manualRedirect !== "true") {
            if (currentServer === PreferredServer) {
                if (servers[currentServer] === null) {
                    // Preferred server not available, redirecting to default
                    window.location.href = window.location.link.replace("&s=" + currentServer, "&s=default");
                }
            } else {
                console.log("[KAPS] Checking for preferred server");
                for (var server in servers) {
                    // If the preferred server is available, redirect to it
                    if (servers.hasOwnProperty(server) && server === PreferredServer) {
                        console.log("[KAPS] Redirecting to preferred server");
                        window.location.href = servers[server];
                    }
                }
            }
        }
    }

    // Update links
    console.log("[KAPS] Updating links");
    var links = document.links;
    for (var i = 0; i < links.length; i++) {
        var link = links[i].href;
        if (link.toLowerCase().indexOf("episode") > 0 || getQueryParam("id", link) !== null) {
            console.log("[KAPS] Updating link: " + link);
            var server = getQueryParam("s", link);
            if (server === null) {
                links[i].href = link + "&s=" + PreferredServer;
            } else if (server !== PreferredServer) {
                links[i].href = link.replace("&s=" + server, "&s=" + PreferredServer);
            }
        }
    }
});