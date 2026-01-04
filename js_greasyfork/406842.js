// ==UserScript==
// @name        How generous
// @namespace   Violentmonkey Scripts
// @match       https://ruqqus.com/*
// @grant       none
// @version     1.5
// @author      PauloBoks
// @description wtf i love communism now
// @downloadURL https://update.greasyfork.org/scripts/406842/How%20generous.user.js
// @updateURL https://update.greasyfork.org/scripts/406842/How%20generous.meta.js
// ==/UserScript==

console.log("inicianting comunismifsafsd");

let upvoteThreshold = 0;
let highLightPosts = true;
let highLightColor = [128, 90, 213] // [R, G, B]

function upvoteAllPosts() {
  document.querySelectorAll('div[id^="post"].card:not(.upvoted):not(.downvoted)').forEach(function(card) {
    try { // for some reason sometimes things go wrong, i'll look into it when i get proper time
      if(card.querySelector(".score").innerText > upvoteThreshold) {
        if(highLightPosts) { card.style.backgroundColor = `rgb(${highLightColor[0]}, ${highLightColor[1]}, ${highLightColor[2]})`; }

        card.querySelector(".arrow-up").click();
      }
    } catch(err) {}
  });
}

function upvoteAllComments() {
  document.querySelectorAll("div.comment-actions:not(.upvoted):not(.downvoted)").forEach(function(actions) {
    actions.querySelector(".arrow-up").click();
  });
}

window.addEventListener('ruqesinfinitescrollload', function() {
  upvoteAllPosts();
});

window.addEventListener('load', function() {
  upvoteAllPosts();
  upvoteAllComments();
}, false);
