// ==UserScript==
// @name Twitter cleanup
// @version 1.9.12
// @grant Sly_North
// @description Remove user and topics to follow suggestions from Twitter
// @author Sly_North
// @match https://x.com/*
// @match https://twitter.com/*
// @match https://mobile.twitter.com/*
// @namespace https://greasyfork.org/en/users/759669-sly-north
// @icon https://pbs.twimg.com/profile_images/1711354492925378560/mWYEK97t_400x400.jpg
// old icon https://abs.twimg.com/responsive-web/client-web/icon-svg.168b89d8.svg
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/452215/Twitter%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/452215/Twitter%20cleanup.meta.js
// ==/UserScript==

function RemoveFollowingThinElements(e, removeWithoutFollowButton) {
  console.log('- TWcleanup removing H=', e.getBoundingClientRect().height, ' ', e.innerText);
  let next = e.nextSibling;
  if (next) {
  let nextH = next.getBoundingClientRect().height;
    if (nextH < 200) {
      if (removeWithoutFollowButton || next.innerText.match(/Follow/) || next.innerText.match(/Subscribe/) || next.innerText.match(/Show more/))
        RemoveFollowingThinElements(next, removeWithoutFollowButton);
      else {
        console.log('- TWcleanup stops at H=', nextH, ' "' + next.innerText + '"');
        if (next.innerText === 'Show more') {
          next.innerHTML = "";
        }
      }
    }
  }
  e.innerHTML = "";
}

// Tool to remove the "X follows Y" tweets and "See more" suggested topics.
function RemoveSuggestedTweets(name, regex) {
  let elts = Array.from(document.getElementsByTagName('article')).filter(e => e.innerText.match(regex));
  if (elts.length > 0) {
    console.log('- TWcleanup Found ', name, ' count=', elts.length);
    for (let e of elts) {
      console.log('  - TWcleanup remove suggestion: ', e.innerText.substring(0, 40));
      e.innerHTML = "";
    }
  }
}

function RemoveSuggestions() {
  // Remove suggested people to follow
  let elts = Array.from(document.getElementsByTagName('H2')).filter(
     // Needs to be in screen for nextSibling to be defined.
     e => e.getBoundingClientRect().top < window.innerHeight &&
           (e.innerText === 'Who to follow') || e.innerText === 'Creators for you');
  if (elts.length > 0) {
    console.log('TWcleanup found "Who to follow"');
    for (let e of elts) {
      e = e.parentElement.parentElement.parentElement.parentElement;
      RemoveFollowingThinElements(e, false);
    }
  }

  // Remove suggested topics
  elts = Array.from(document.getElementsByTagName('SPAN')).filter(
    e => // e.getBoundingClientRect().top < window.innerHeight &&
      (e.innerText === 'Topics to follow' || e.innerText === 'Expand your timeline with Topics'));
  if (elts.length > 0) {
    console.log('TWcleanup found "', elts[0].innerText, '"');
    for (let e of elts) {
      e = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
      // Remove topics and offset bar
      RemoveFollowingThinElements(e.nextSibling, true);
      // Remove title
      e.innerHTML = "";
    }
    console.log('TWcleanup removed "', title, '"');
  }
  
  const isTwitterHomePage = document.location.href === 'https://x.com/home';
  if (isTwitterHomePage) {
    // Remove "Subscribe" elements
	  for (let e of Array.from(document.getElementsByTagName('span')).filter(e => e.innerText == 'Subscribe' && e.getBoundingClientRect().width > 0)) {
      e = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
      const height = e.getBoundingClientRect().height;
      if (height > 0 && height < 100) {
        console.log('  - Remove TW Subscribe: H=', height, ' ', e.innerText.substring(0, 40));
        e.innerHTML = ''
      }
    }

    // Remove tweets of people followed by one we follow
    RemoveSuggestedTweets('X follows Y', / follows*\n/);
    // Remove "See more" suggestions
    RemoveSuggestedTweets('See more', /\nSee more\n/);
    
    // Remove Premium ads
    for (let e of Array.from(document.getElementsByTagName('h1'))
         .filter(e => e.innerText.match(/ad.*Premium/))) {
      e.parentElement.parentElement.parentElement.innerHTML = "";
    }
  }

  // Unfreeze scrolling (ie: in incognito after scrolling a bit)
  if (document.documentElement.style.overflow) document.documentElement.style.overflow = "scroll";

  let eltCred = document.getElementById('credential_picker_container');
  if (eltCred && eltCred.getBoundingClientRect().width < 400) eltCred.style.display = "none";

  // If the window is very small (like when watching a video in a small secondary window),
  // remove the Twitter left column and top banner.
  {
    let elts = document.getElementsByTagName('header');
    if (elts.length > 0) {
      let widthLimit = isTwitterHomePage ? 800 : 900;
      let smallWindow = window.innerWidth < widthLimit;
      elts[0].style.display = smallWindow ? "none" : "";
      let primaryCol = document.querySelector('[data-testid="primaryColumn"]');
      if (primaryCol) {
        primaryCol.style.maxWidth = smallWindow ? null : '600px';
        primaryCol.style.minWidth = smallWindow ? '100vw' : null;
      }
    }
    var elt = document.querySelector('[aria-label="Home timeline"]');
    if (elt) elt.firstChild.style.display = (window.innerHeight < 700) ? "none" : "";
  }

  setTimeout(RemoveSuggestions, 1000);
}

// Remove credential banner (in incognito windows)
let bottomBanners = Array.from(document.getElementsByTagName('div'))
    .filter(e => e.dataset.testid === 'BottomBar' );
if (bottomBanners.length > 0) bottomBanners[0].innerHTML = '';
let elt = document.getElementById('credential_picker_container');
if (elt) elt.innerHTML = "";

setTimeout(RemoveSuggestions, 1000);

// Change logo to Twitter
const twitterIcon = "https://pbs.twimg.com/profile_images/1711354492925378560/mWYEK97t_400x400.jpg";
setTimeout(() => {
  let logo = Array.from(document.getElementsByTagName('svg')).filter(e => e.getBoundingClientRect().top < 15)[0];
  logo.parentElement.innerHTML = '<img src="' + twitterIcon + '" width=32 height=32>'
}, 500);
// Change favicon
var link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
}
link.href = twitterIcon;


/*
// Switch to the Following tab
if (isTwitterHomePage) {
  setTimeout(() => {
  for (let e of document.getElementsByTagName('span')) {
      if (e.innerText === 'Following') { e.click(); break;}
    }
  }, 500);
}
*/