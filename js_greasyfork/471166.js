// ==UserScript==
// @name         GGn Censored Freeleech Hider
// @namespace    https://greasyfork.org/users/1130260
// @version      1.4.3
// @description  Hides blocked freeleech pots
// @author       Gazellion
// @match        https://gazellegames.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471166/GGn%20Censored%20Freeleech%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/471166/GGn%20Censored%20Freeleech%20Hider.meta.js
// ==/UserScript==

let cachedFLPotData = JSON.parse(localStorage.getItem('cachedFLPotData'));
function editFLPotPage() {
  'use strict';
  var pots = document.querySelectorAll('tr.group_torrent'); //each individual table row
  var potCounter = document.querySelector('i.fa.fa-fl-pots'); //number of pots
  var potCounterDesc = document.getElementById('buff_fl pots'); //text that displays when you hover over the FL Pots header
  var potsUnblocked = pots.length; //number of uncensored FL pots left over
  for (var i = 0; i < pots.length; i++) {
    if (pots[i].textContent.includes("Censored (hover for name)")) {
      pots[i].classList.add("hidden");
      potsUnblocked--;
    }
  }
  potCounter.innerHTML = potsUnblocked;
  potCounterDesc.title = potCounterDesc.title.replace(potCounterDesc.title, potsUnblocked + " torrent groups are currently freeleech!");
  console.log(pots.length)
  return [potsUnblocked, potCounterDesc.title, pots.length]; //caches the uncensored FL pot count, the FL pot header description, and the total number of pots
}

function editFLPotHeader() {
  'use strict';
  var potCounter = document.querySelector('i.fa.fa-fl-pots');
  var potCounterDesc = document.getElementById('buff_fl pots');
  //if the current real number of FL pots matches the cached one
  //this method is inherently somewhat flawed but it's all I could come up with without scraping
  console.log(potCounter.innerHTML)
  if (potCounter.innerHTML == cachedFLPotData[2])
  {
    potCounter.innerHTML = cachedFLPotData[0];
    potCounterDesc.title = cachedFLPotData[1];
  }
  else
  {
    potCounter.innerHTML = cachedFLPotData[0] + "<sup>*<sup>"; //<sup> messes up the line height but it looks even weirder without <sup> so it is what it is
    potCounterDesc.title = "This number may be outdated. Open the FL Pots page to update.";
  }
}

if (window.location.href.includes("https://gazellegames.net/shop.php?action=freeleech")) {
  if (cachedFLPotData != editFLPotPage()) {
    cachedFLPotData = editFLPotPage();
    localStorage.setItem('cachedFLPotData', JSON.stringify(cachedFLPotData));
  } else {
    editFLPotPage();
  }
} else {
  editFLPotHeader();
}