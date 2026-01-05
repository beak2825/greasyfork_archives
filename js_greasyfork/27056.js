// ==UserScript==
// @name         exhentai flow viewer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       PokemonMaster802
// @match        https://exhentai.org/s/*
// @description  This scripts helps you to view a gallery in a single page, from up to down.
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/27056/exhentai%20flow%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/27056/exhentai%20flow%20viewer.meta.js
// ==/UserScript==

var container;  // The <div> to hold images, intending to inherit it's style.
var parser;

function getNext(currURL, currDOC) {
    'use strict';
    var nextURL = currDOC.getElementById('next').href;

    // The last page has the next url directing to itself.
    if (currURL === nextURL) {
        console.log('Reach the last page');
        return;
    }

    // Prepare http request for the next page.
    var nextPage = new XMLHttpRequest();
    nextPage.onreadystatechange = function() {
        if (nextPage.readyState == 4) {
            if (nextPage.status == 200) {
                var doc = parser.parseFromString(nextPage.responseText, 'text/html');
                var img = doc.getElementById('img');
                img.style.paddingTop = '1em';
                container.append(img);
                setTimeout(getNext, 500, nextURL, doc);
            }
            else {
                console.log('Failed to fetch ' + nextURL + ': ' + nextPage.status);
            }
        }
    };
    nextPage.open("GET", nextURL, false);
    nextPage.send();
}

(function() {
    parser = new DOMParser();
    container = document.getElementById('i3');
    getNext(document.URL, document);
})();