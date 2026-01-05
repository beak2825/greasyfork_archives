// ==UserScript==
// @name         Netflix Marathon
// @namespace    https://greasyfork.org/en/scripts/30029-netflix-marathon
// @version      2.7
// @description  Automatically skip recaps, intros and click nexts on Netflix, DisneyPlus and Amazon video for you.
// @author       ran
// @include      https://www.netflix.com/*
// @include      https://www.amazon.com/gp/video/*
// @include      https://www.amazon.de/gp/video/*
// @include      https://www.amazon.*/gp/video/*
// @include      https://www.amazon.*/gp/product/*
// @include      https://primevideo.com/region/*/detail/*
// @include      https://*.primevideo.com/region/*/detail/*
// @include      https://primevideo.com/detail/*
// @include      https://*.primevideo.com/detail/*
// @include      https://*.primevideo.com/*
// @include      https://www.peacocktv.com/watch/*
// @include      https://www.disneyplus.com//video/*
// @include      https://www.disneyplus.com/*/video/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/30029/Netflix%20Marathon.user.js
// @updateURL https://update.greasyfork.org/scripts/30029/Netflix%20Marathon.meta.js
// ==/UserScript==
var count = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function find() {
  if (count === 0) {
    if (document.getElementsByClassName('skip-credits').length !== 0 && document.getElementsByClassName('skip-credits-hidden').length == 0) {
      //console.log('Found credits.');
      await sleep(200);
      document.getElementsByClassName('skip-credits')[0].firstElementChild.click();
      await sleep(200);
      document.querySelector('.button-nfplayerPlay').click();
      count = 80;
      //console.log('Found credits. +4s');
      //window.clearInterval(intervalId);
    }
    else if (document.getElementsByClassName('postplay-still-container').length !== 0) {
      //console.log('Found autoplay.');
      document.getElementsByClassName('postplay-still-container')[0].click();
      count = 5;
    }
    else if (document.getElementsByClassName('WatchNext-still-container').length !== 0) {
      //console.log('Found autoplay.');
      document.getElementsByClassName('WatchNext-still-container')[0].click();
      count = 5;
    }
    else if (document.getElementsByClassName('countdown').length !== 0) {
      //console.log('Found Amazon video next.');
      document.getElementsByClassName('countdown')[0].click();
      count = 5;
    }
    else if (document.getElementsByClassName('adSkipButton').length !== 0) {
      //console.log('Found Amazon skip ad.');
      document.getElementsByClassName('adSkipButton')[0].click();
      count = 5;
    }
    else if (document.getElementsByClassName('skipElement').length !== 0) {
      //console.log('Found Amazon skip intro.');
      document.getElementsByClassName('skipElement')[0].click();
      count = 5;
    }
    else if (document.getElementsByClassName('playback-controls__skip--button').length !== 0) {
      //console.log('Found peacock skip intro.');
      document.getElementsByClassName('playback-controls__skip--button')[0].click();
      count = 5;
    }
    else if (document.getElementsByClassName('PlayerControlsNeo__layout PlayerControlsNeo__layout--dimmed').length !== 0) {
      document.getElementsByClassName('interrupter-actions')[0].firstChild.click();
      count = 80;
    }
    else if (document.getElementsByClassName('skip__button').length !== 0) {
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
    
    
    
    if ($("div div:contains('Skip')").length !== 0) {
      // amazon trailers 
      var badDivs = $("div div:contains('Skip')");
      for (i = 0; i < badDivs.length; i++) {
        if (badDivs[i].innerText == "Skip") {
          badDivs[i].click();
          count = 5;
        }
      }
    }
    if ($("div div:contains('Skip Intro')").length !== 0) {
      // amazon intro 
      var badDivs = $("div div:contains('Skip Intro')");
      //console.log(badDivs);
      for (i = 0; i < badDivs.length; i++) {
        if (badDivs[i].innerText == "Skip Intro") {
          badDivs[i].click();
          count = 5;
        }
      }
    }
    if ($("div div:contains('Skip Recap')").length !== 0) {
      // amazon recap 
      var badDivs = $("div div:contains('Skip Recap')");
      //console.log(badDivs);
      for (i = 0; i < badDivs.length; i++) {
        if (badDivs[i].innerText == "Skip Recap") {
          badDivs[i].click();
          count = 5;
        }
      }
    }
  }
  else {
    count--;
  }
}

var intervalId = window.setInterval(find, 300);
