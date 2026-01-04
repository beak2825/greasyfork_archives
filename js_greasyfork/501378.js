// ==UserScript==
// @name         Twitch Rerun Transparency
// @namespace    Violentmonkey Scripts
//
// @version      0.3.1
//
// @description  Make Reruns from twitch cards lists directories transparent (should work for all directories e.g.: /following, /following/live and all categories)
// @homepage     https://github.com/saccma/twitch-reruns-hide-userscript
// @author       Dampyr
//
// @include      *://www.twitch.tv/*
//
// @grant        GM_getResourceText
// @resource     waitForKeyElements https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.2/waitForKeyElements.js
//
// @comment      Based upon the work of Markus 'Ragowit' Persson, "Twitch Rerun Hider - https://greasyfork.org/it/scripts/40477-twitch-rerun-hider/code".
// @downloadURL https://update.greasyfork.org/scripts/501378/Twitch%20Rerun%20Transparency.user.js
// @updateURL https://update.greasyfork.org/scripts/501378/Twitch%20Rerun%20Transparency.meta.js
// ==/UserScript==

eval(GM_getResourceText("waitForKeyElements"));

waitForKeyElements("article", hideRerunLive, false);

function hideRerunLive(jNode) {
  var title = jNode.querySelector("h4")?.textContent?.toLowerCase();
  if (!title) {
    return;
  }
  // Good streams, they tag it as a rerun
  var rerunTagEl = jNode.querySelector('[data-a-target="Rerun"]');
  if (rerunTagEl) {
    hideCard(jNode);
  } else {
  // Mediocre streams, they don't tag it right but at least type it in the title...
    var badWords = [
      "re-run",
      "rebroadcast",
      "recap",
      "rerun",
      "!rr",
      "rewatch",
      "𝓡𝓡",
      "𝙍𝙚𝙧𝙪𝙣",
      "not live"
    ];

    if (badWords.some(x => title.includes(x))) {
      hideCard(jNode);
    } else if (title.split(' ').some(x => x === 'rr')) {
      hideCard(jNode);
    }
  }
}

function hideCard(node) {
    node.style.opacity = 0.15;
    node.style.background = "dimgray";
}