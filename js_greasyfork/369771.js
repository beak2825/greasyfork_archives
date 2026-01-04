// ==UserScript==
// @name         ConnectRank
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Classe les topics par nombre de connectés
// @author       Nathaniel55
// @match        *://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369771/ConnectRank.user.js
// @updateURL https://update.greasyfork.org/scripts/369771/ConnectRank.meta.js
// ==/UserScript==

(function() {
    'use strict';

var butContainer = document.querySelector(".bloc-pre-right");
var topicsHead = document.querySelector(".topic-head");
var topicsContainer = document.querySelector(".topic-list");
var topicLinks = document.getElementsByClassName("lien-jv topic-title");

butContainer.insertAdjacentHTML('afterbegin', '<button class="btn btn-actu-new-list-forum" id="rank-but">Classer</button>');

var rankBut = document.getElementById("rank-but");

rankBut.onclick = () => {
    reClass();
}

var topicOrder = [];
var x = 0;

function reClass() {

    rankBut.style.display = "none";
    for (var i = 0; i < topicLinks.length; i++) {
        fetchCounts(i);
    }
}

function fetchCounts(i) {
    var context = topicLinks[i];
    fetch(context.href)
    .then(res => {
        res.text().then((text) => {
            var doc = document.implementation.createHTMLDocument();
            doc.body.innerHTML = text;
            var topicCount = doc.querySelector(".nb-connect-fofo").innerText
            var topicCountClean = topicCount.substr(0, topicCount.length - 12);
            var topicCountNumber = parseInt(topicCountClean);
            var parent = context.parentElement.parentElement;
            topicOrder.push([topicCountNumber, parent]);
            console.log(i);
            if(x == 24) {
                nextStep();
            }
            x++
        })
    })
}

function nextStep() {
    topicsContainer.innerHTML = topicsHead.outerHTML;
    topicOrder.sort(sortFunction);
    document.querySelector(".topic-author").innerText = "NBconnect";
    document.querySelector("head").insertAdjacentHTML("afterbegin", '<style type="text/css">.topic-author{text-align:center;font-weight:500;}</style>');
    for(var i = 0; i < topicOrder.length; i++) {
        var author = topicOrder[i][1].getElementsByClassName("topic-author")[0];
        author.innerText = topicOrder[i][0];
        topicsContainer.appendChild(topicOrder[i][1]);
    }
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}

})();