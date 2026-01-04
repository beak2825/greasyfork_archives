// ==UserScript==
// @name         Autoskip DisneyPlus/StarPlus
// @name:es      Autoskip Disnet+/Star+
// @namespace    https://greasyfork.org/es/users/921146-guishepr
// @version      1.0
// @description  Automatically skip intros and click nexts on DisneyPlus and StarPlus.
// @description:es Skipea automaticamente las intros y el boton de siguiente episodio en DisneyPlus y StarPlus
// @author       GuishePR
// @match      https://www.disneyplus.com//video/*
// @match      https://www.disneyplus.com/*/video/*
// @match      https://www.starplus.com//video/*
// @match      https://www.starplus.com/*/video/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445902/Autoskip%20DisneyPlusStarPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/445902/Autoskip%20DisneyPlusStarPlus.meta.js
// ==/UserScript==
var count = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function find() {
  if (count === 0) {
    if (document.getElementsByClassName('skip__button').length !== 0) {
      // skips recaps and intros on disneyplus
      document.getElementsByClassName('skip__button')[0].firstChild.click();
      count = 5;
    }
    else if (document.getElementsByClassName('video_view--mini').length !== 0) {
      // auto plays next episode on disneyplus
      //console.log('Found autoplay.');
      document.querySelector('*[data-testid="up-next-play-button"]').click();
      count = 5;
    }
    else if (document.getElementsByClassName('atvwebplayersdk-skipelement-button').length !== 0) {
      //console.log('Found Amazon imdb skip intro.');
      document.getElementsByClassName('atvwebplayersdk-skipelement-button')[0].click();
      count = 5;
    }
  }
  else {
    count--;
  }
}

var intervalId = window.setInterval(find, 300);