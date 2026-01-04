// ==UserScript==
// @name         No-bide Project
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Permet d'afficher bides récents.
// @author       Nathaniel55
// @match        *://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369761/No-bide%20Project.user.js
// @updateURL https://update.greasyfork.org/scripts/369761/No-bide%20Project.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var butContainer = document.querySelector(".bloc-pre-right");
    var topicsHead = document.querySelector(".topic-head");
    var topicsContainer = document.querySelector(".topic-list");
    butContainer.insertAdjacentHTML('afterbegin', '<button class="btn btn-actu-new-list-forum" id="bides-but">Bides only</button>');
    document.getElementById("bides-but").onclick = () => {
        getBides();
    }

    function getBides() {

    topicsContainer.innerHTML = topicsHead.outerHTML;

    for(var i = 0; i < 15; i++) {
        var x = (i * 25) + 1;
        fetchBides(x);
    }
}

function fetchBides(pageCount) {
    fetch(`http://www.jeuxvideo.com/forums/0-51-0-1-0-${pageCount}-0-blabla-18-25-ans.htm`)
    .then(res => {
        res.text().then((text) => {
            var doc = document.implementation.createHTMLDocument();
            doc.body.innerHTML = text;
            var topicCounts = doc.getElementsByClassName("topic-count");
            for(var i = 0; i < topicCounts.length; i++) {
                if(topicCounts[i].innerText == 0) {
                    var topicBide = topicCounts[i].parentElement;
                    topicsContainer.appendChild(topicBide);
                }
            }
        })
    })
}


})();