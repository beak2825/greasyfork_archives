// ==UserScript==
// @name         Aither++
// @namespace    https://aither.cc/
// @version      0.2
// @description  various QoL improvements to aither
// @author       Seraph2
// @match        https://aither.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414780/Aither%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/414780/Aither%2B%2B.meta.js
// ==/UserScript==
function statsChange() {
    var badges = document.getElementsByClassName("badge-user");
    var upload = badges[2];
    var download = badges[3];
    var ratio = badges[4];
    var buffer = badges[5];
    var warnings = badges[8];
    var bon = badges[9];
    var tokens = badges[10];
    var stats = [upload, download, ratio, buffer, warnings, bon, tokens];
    var counter = 0;
    var item;
    for (const badge of stats){
        // this looks disgusting lol
        switch (counter) {
            case 0:
                item = "upload";
                break;
            case 1:
                item = "download";
                break;
            case 2:
                item = "ratio";
                break;
            case 3:
                item = "buffer";
                break;
            case 4:
                item = "warnings";
                break;
            case 5:
                item = "bon";
                break;
            case 6:
                item = "tokens";
                break;
        }
        var storedValue = localStorage.getItem(item);
        var currentValue = badge.textContent.replace( /^\D+/g, '');
        // converts all transfer quantities into GB
        if (currentValue.includes("TiB")) {
            currentValue = currentValue.split(" ")[0] * 1000;
        } else {
            if (currentValue.includes("GiB")) {
                currentValue = currentValue.split(" ")[0];
            }
        }
        var newCurrentValue;
        if (item != "bon") {
            newCurrentValue = parseFloat(currentValue);
        } else {
            newCurrentValue = parseInt(currentValue.split(" ").join(""));
        }
        if (storedValue) {
            var change = (newCurrentValue - storedValue);
            if (["warnings", "tokens"].includes(item)) {
                change = change.toPrecision(1);
            } else {
                change < 1 ? change = change.toFixed(1) : change = +change.toFixed(2);
            }
            var ending;
            if (["upload", "download", "buffer"].includes(item)) {
                ending = " GiB";
            } else {
                ending = "";
            }
            if (change && change != 0) {
                var span = document.createElement("span");
                var changeIsPositive;
                Math.sign(change) == 1 ? changeIsPositive = 1 : changeIsPositive = 0;
                if (["upload", "ratio", "buffer", "bon", "tokens"].includes(item)) {
                    if (changeIsPositive == 1) {
                        span.innerHTML = " +" + change.toString() + ending;
                        span.style.cssText = "color:green;"
                        badge.appendChild(span);
                    } else {
                        span.innerHTML = " " + change.toString() + ending;
                        span.style.cssText = "color:red;"
                        badge.appendChild(span);
                    }
                } else {
                    if (changeIsPositive == 1) {
                        span.innerHTML = " +" + change.toString() + ending;
                        span.style.cssText = "color:red;"
                        badge.appendChild(span);
                    } else {
                        span.innerHTML = " " + change.toString() + ending;
                        span.style.cssText = "color:green;"
                        badge.appendChild(span);
                    }
                }
            }
            localStorage.setItem(item, newCurrentValue);
        } else {
            localStorage.setItem(item, newCurrentValue);
        }
        counter++;
}};

function randomTorrent() {
    var buttons = document.getElementsByClassName("button-left")[0];
    var latestTorrent = document.getElementById("facetedSearch").childNodes[1].childNodes[3].childNodes[3].querySelector("tr:not(.success)").childNodes[7].childNodes[1].href; // get the first non-featured torrent in the list
    var latestTorrentID = latestTorrent.split("/");
    latestTorrentID = parseInt(latestTorrentID[latestTorrentID.length - 1]);
    var randomTorrentID = Math.floor(Math.random() * (latestTorrentID - 1) + 1); // generate random torrent ID
    var randomURL = "https://aither.cc/torrents/" + randomTorrentID;
    var randomButton = document.createElement("a");
    randomButton.setAttribute("href", randomURL);
    randomButton.innerText = "? Random Torrent";
    randomButton.className += "btn btn-sm btn-warning";
    buttons.appendChild(randomButton);
};

statsChange();
if (window.location.href.endsWith("/torrents")) {
    randomTorrent();
}