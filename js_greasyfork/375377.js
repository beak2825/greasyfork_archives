// ==UserScript==
// @name        MAL Randomizer
// @version     2.5
// @license     MIT
// @description Picks 1,5 or 10 random anime from a users MAL anime list or manga list
// @match       *://myanimelist.net/animelist/*
// @match       *://myanimelist.net/mangalist/*
// @grant       GM_addStyle
// @namespace   https://greasyfork.org/users/231681
// @downloadURL https://update.greasyfork.org/scripts/375377/MAL%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/375377/MAL%20Randomizer.meta.js
// ==/UserScript==

/*
  ***DISCLAIMER***

  This code is an edit of an existing MAL Randomizer.
  The source code can be found through the following link so check it out.
  https://gist.github.com/IA21/866c8c380165adf2caac7a421f608342
  
  This code is also riveted with errors, feel free to fix them up or edit
  this code in any way you see fit. If I have time, I'll look into some of
  the issues myself.
  
  Found Issues:
    - Randomizer only uses first 300 items unless loaded in first
*/

GM_addStyle ( `
.ShowItems {
  display: table-row-group !important;
}

.HideItems {
  display: none !important;
}

.stats {
  user-select: none;
}
` );

/* Just a random function */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Resets ALL Classes to "list-item HideItems" */
function reset(BaseClassList, ShowingClassList, HidingClassList) {
  if (BaseClassList.length !== 0) {
    for (var classes1 in BaseClassList) {
      BaseClassList[classes1].className = "list-item HideItems";
    }
  }
  if (ShowingClassList.length !== 0) {
    for (var classes2 in ShowingClassList) {
      ShowingClassList[classes2].className = "list-item HideItems";
    }
  }
  if (HidingClassList.length !== 0) {
    for (var classes3 in HidingClassList) {
      HidingClassList[classes3].className = "list-item HideItems";
    }
  }
}

/* Chooses the classes to show */
function execute(numberOfItems) {
  var getShowingClassList = document.getElementsByClassName("list-item ShowItems");
  var getHidingClassList = document.getElementsByClassName("list-item HideItems");
  var getBaseClassList = document.getElementsByClassName("list-item");
  reset(getBaseClassList, getShowingClassList, getHidingClassList);
  
  var hiddenClassList = document.getElementsByClassName("list-item HideItems");
  for (var count = 0; count < numberOfItems; count++){
    var chosenRandomInt = randomInt(0, hiddenClassList.length);
    var target = hiddenClassList[chosenRandomInt];
    try{
      target.className = "list-item ShowItems";
    } catch(err) {
      if (hiddenClassList.length !== 0){
        count--;
      }
    }
  }
}

/* Main Body Code */
(function() {
  'use strict';

  /* Button Styles and Creation */
  var container = document.createElement("span");
  var randButton = document.createElement("a");
  var randButton5 = document.createElement("a");
  var randButton10 = document.createElement("a");
  
  randButton.innerHTML = "<i class='fa-solid fa-random'></i> Random 1";
  randButton5.innerHTML = "<i class='fa-solid fa-random'></i> Random 5";
  randButton10.innerHTML = "<i class='fa-solid fa-random'></i> Random 10";
  randButton.style.cursor = "pointer";
  randButton5.style.cursor = "pointer";
  randButton10.style.cursor = "pointer";
  randButton.style.marginLeft = "15px";
  randButton5.style.marginLeft = "15px";
  randButton10.style.marginLeft = "15px";
  
  container.style.left = "4px";
  container.className = "stats";
  container.appendChild(randButton);
  container.appendChild(randButton5);
  container.appendChild(randButton10);
  
  var textlist = document.getElementsByClassName("text");
  var text = document.getElementsByClassName("text")[textlist.length - 1];
  document.getElementsByClassName("list-status-title")[0].insertBefore(container, text);
  
  
  /* On-screen button commands */
  randButton.onclick = function() {
    var numberOfItems = 1;
    execute(numberOfItems);
  };
  randButton5.onclick = function() {
    var numberOfItems = 5;
    execute(numberOfItems);
  };
  randButton10.onclick = function() {
    var numberOfItems = 10;
    execute(numberOfItems);
  };
  
})();