// ==UserScript==
// @name     Youtube video duration in title
// @description Put Youtube video duration into title
// @author sg2002
// @license MIT
// @version  5
// @grant    none
// @include *youtube.com/*
// @namespace https://greasyfork.org/users/1249054
// @downloadURL https://update.greasyfork.org/scripts/485000/Youtube%20video%20duration%20in%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/485000/Youtube%20video%20duration%20in%20title.meta.js
// ==/UserScript==

function getDuration(){
  const data = document.querySelector('.PlayerMicroformatRendererHost > script:nth-child(1)');
  if(data && data.innerText){
    return JSON.parse(data.innerText).duration;
  }
}

function formatDuration(duration){
  s = parseInt(duration.slice(2, -1));
  const date = new Date(null);
  date.setSeconds(--s); // it's off by 1 most of the time, so we correct
  r = date.toISOString().slice(11, 19);
  if(r.slice(0, 2) == "00"){
    r = r.slice(3);
  }
  if(r.charAt(0) == '0'){
    r = r.slice(1);
  }
  return r;
}

function addDurationToTitle(title) {
  if(document.title.substring(document.title.length - title.length) !== title){
    document.title = document.title + " " + title;
    console.log(document.title);
  }
}

function onElementAvailable(selector, callback) {
  const observer = new MutationObserver(mutations => {
    if (document.querySelector(selector)) {
      observer.disconnect();
      callback();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

onElementAvailable("#microformat > player-microformat-renderer > script", () => {
  let oldDuration = null;
  const hrefObserver = new MutationObserver(mutations => {
    const newDuration = getDuration();
    if(newDuration && newDuration != oldDuration){
      addDurationToTitle(formatDuration(newDuration));
      oldDuration = newDuration;
    }
  }).observe(document.querySelector(
    "#microformat"),
             { childList: true, subtree: true });
  const titleObserver = new MutationObserver(mutations => {
    if (document.location.href.indexOf('v=') > 0)
    {
      addDurationToTitle(formatDuration(getDuration()));
    }
  }).observe(document.querySelector('title'),
             { subtree: true, characterData: true, childList: true });
});
