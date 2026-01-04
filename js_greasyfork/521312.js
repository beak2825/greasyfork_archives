// ==UserScript==
// @name         Blooket Login Client
// @namespace    http://tampermonkey.net/
// @version      2024-12-19
// @description  Allows communication with blooket
// @author       Blookedex
// @match        https://dashboard.blooket.com/stats*
// @match        https://hollowvr.github.io/BlooketAuthorizer.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/521312/Blooket%20Login%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/521312/Blooket%20Login%20Client.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const urlParams = new URLSearchParams(window.location.search);

  if (document.documentElement.getAttribute('data-site') === 'blookedexAuth') {
    if (typeof window.addonPresent !== 'function') {
      window.addEventListener('addonInitialized', (event) => {
        window.addonPresent();
      });
    } else {
      window.addonPresent();
    }
  }


  if (urlParams.get('authorizationRequest') === null) {
    return;
  }

  function wait(seconds) {
    return new Promise(resolve => {
      setTimeout(resolve, seconds * 1000);
    });
  }

  if (window.fetch.call.toString() === 'function call() { [native code] }') {
    const call = window.fetch.call;
    window.fetch.call = function() {
      if (!arguments[1].includes("s.blooket.com/rc")) return call.apply(this, arguments);
    }
  }
  document.head.appendChild(Object.assign(document.createElement('style'), {type: 'text/css',textContent: ".RYID{z-index:1000;gap:5px;position:fixed;width:100vw;height:100vh;top:0;left:0;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;background-color:#f4f4f4}.xcLd{font-family: Arial, sans-serif;color:gray;}.Y5eD{width:50px;height:50px;border:6px solid #ccc;border-top:6px solid #888;border-radius:50%;animation:1s linear infinite KxhH}@keyframes KxhH{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.wlku{font-family: Arial, sans-serif;color:gray;position:fixed;top:calc(100% - 40px);}.wlku::after{content:'Blookedex';font-family:'Titan One';font-size:30px;"}));
  const overlay = Object.assign(document.createElement('div'), {className: 'RYID'});
  overlay.appendChild(Object.assign(document.createElement('div'), {className: 'Y5eD'}));
  overlay.appendChild(Object.assign(document.createElement('div'), {className: 'xcLd',textContent: "loading..."}));
  overlay.appendChild(Object.assign(document.createElement('div'), {className: 'wlku',textContent: "Powered By "}));
  document.body.appendChild(overlay);

  await wait(3);

  const userData = {};
  const topstats = document.querySelector('._topStats_1c2jf_663').children;
  userData.totalTokens = topstats[1].children[1].textContent;
  userData.blooksUnlocked = topstats[2].children[1].textContent;
  const statswrapper = document.querySelector('._statsWrapper_1c2jf_670').children
  userData.wins = statswrapper[0].children[1].textContent;
  userData.playersDefeated = statswrapper[5].children[1].textContent;
  userData.correctAnswers = statswrapper[6].children[1].textContent;
  userData.gamesPlayed = statswrapper[7].children[1].textContent;
  userData.icon = document.querySelector('._blook_1601v_1').src;
  userData.username = document.querySelector('._headerName_1c2jf_112').textContent;

  document.querySelector('._headerBlookContainer_1c2jf_57').click();

  const blooksHolder = document.querySelector('._blooksHolder_sxo9c_17');
  userData.blooks = [];
  const commonBlacklist = [
    "Chick", "Chicken", "Cow", "Goat", "Horse", "Pig", "Sheep", "Duck",
    "Alpaca", "Dog", "Cat", "Rabbit", "Goldfish", "Hamster", "Turtle",
    "Kitten", "Puppy", "Bear", "Moose", "Fox", "Raccoon", "Squirrel",
    "Owl", "Hedgehog", "Deer", "Wolf", "Beaver", "Tiger", "Orangutan",
    "Cockatoo", "Parrot", "Anaconda", "Jaguar", "Macaw", "Toucan",
    "Panther", "Capuchin", "Gorilla", "Hippo", "Rhino", "Giraffe",
    "Snowy Owl", "Polar Bear", "Arctic Fox", "Baby Penguin", "Penguin",
    "Arctic Hare", "Seal", "Walrus"
  ];
  for (let i = 0;i < blooksHolder.children.length;i++) {
    const x = blooksHolder.children[i].children[0].children[0].alt.slice(0,-6);
    if (!commonBlacklist.includes(x)) {
      userData.blooks.push(x);
    }
  }

  window.location.replace("https://hollowvr.github.io/BlooketAuthorizer.html?returnData="+JSON.stringify(userData));
})();