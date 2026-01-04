// ==UserScript==
// @name         Enhanced subconscious debiaser for MangaDex
// @namespace    https://mangadex.org/
// @version      0.1
// @description  removes the bias present in the user's subconscious while attempting to pick a manga to read
// @author       Xnot
// @include      /.*mangadex\.org/.*
// @downloadURL https://update.greasyfork.org/scripts/407816/Enhanced%20subconscious%20debiaser%20for%20MangaDex.user.js
// @updateURL https://update.greasyfork.org/scripts/407816/Enhanced%20subconscious%20debiaser%20for%20MangaDex.meta.js
// ==/UserScript==

(function() {
    randomizeScores();
})();

function randomizeScores(){
    const ratings = document.querySelectorAll('[title*="rating"]');
    const votes = document.querySelectorAll('[title*="votes"]');
    for(let rating of ratings){
        if(rating.nextSibling){
            rating.nextSibling.nodeValue = Math.round(Math.random() * 100000);
        }
    }
    for(let vote of votes){
        vote.innerText = Math.round(Math.random() * 100000);
    }
    setTimeout(randomizeScores, 50);
}