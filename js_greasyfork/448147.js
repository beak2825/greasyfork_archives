// ==UserScript==
// @name        Google Meet autoleave
// @namespace   Violentmonkey Scripts
// @match       nah
// @include     https://meet.google.com/*
// @grant       GM_addStyle
// @version     1.0
// @author      l0st_idi0t
// @description hi
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448147/Google%20Meet%20autoleave.user.js
// @updateURL https://update.greasyfork.org/scripts/448147/Google%20Meet%20autoleave.meta.js
// ==/UserScript==

//enable html injection
window.trustedTypes.createPolicy('default', {createHTML: (string, sink) => string});

let participants;
let count;

//add html
let content = document.createElement("div");
content.innerHTML   = '\
    <div style="z-index: 9999; position: absolute; left: 0; top: 0; height: 100px; width: 250px; background-color: #555555;">\
        <p style="color: white;">How many participants must be left before you leave the meet?</p>\
        <input type="text" id="kek">\
    </div>\
';

document.body.appendChild(content);

//leave call stuff 
setInterval(() => {
  participants = parseInt(document.querySelector("#ow3 > div.T4LgNb > div > div:nth-child(10) > div.crqnQb > div.UnvNgf.Sdwpn.P9KVBf > div.jsNRx > div.fXLZ2 > div > div > div:nth-child(2) > div > div").innerText);

  count = parseInt(document.getElementById("kek").value);
  if (participants <= count) {
    document.querySelector('[aria-label="Leave call"]').click();
  }
}, 1000);