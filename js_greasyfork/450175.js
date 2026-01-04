// ==UserScript==
// @name        Melvor Idle - Character Name Title
// @namespace   https://greasyfork.org/en/users/950742-bool
// @match       *://melvoridle.com/*
// @match       *://test.melvoridle.com/*
// @match       *://www.melvoridle.com/*
// @grant       none
// @version     1.0
// @author      bool_
// @description Changes the window title to the current character name
// @downloadURL https://update.greasyfork.org/scripts/450175/Melvor%20Idle%20-%20Character%20Name%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/450175/Melvor%20Idle%20-%20Character%20Name%20Title.meta.js
// ==/UserScript==

let intervalId;

const changeTitle = async () => {
  const accountName = document.querySelector('#account-name'); 
  if (!accountName) {
    return;
  }
  
  if (accountName.innerText.length == 0) {
    return;
  }
  
  // TODO add combat level to the title
  const combatLevel = document.querySelector('#combat-level-sidebar');
  if(!combatLevel) {
    return;
  }
  
  if (combatLevel.innerText.length == 0) {
    return;
  }
  
  document.title = accountName.innerText;
};

(async function() {
  intervalId = setInterval(changeTitle, 1000);
})();

