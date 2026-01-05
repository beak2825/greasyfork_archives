// ==UserScript==
// @name        HTML5 notifications on Spotify Web Player
// @description Adds silent song notifications with title, artist and cover art
// @namespace   https://greasyfork.org/users/4813-swyter
// @match       https://play.spotify.com/*
// @version     2016.06.08
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/13885/HTML5%20notifications%20on%20Spotify%20Web%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/13885/HTML5%20notifications%20on%20Spotify%20Web%20Player.meta.js
// ==/UserScript==

/* run this just on the parent page, not in sub-frames */
if (window.parent !== window)
  throw "stop execution";

function when_external_loaded()
{
  /* request permission to show notifications, if needed */
  if (Notification.permission !== 'granted')
    Notification.requestPermission();

  /* create a listener mechanism for title changes using mutation observers,
     let's be good citizens (http://stackoverflow.com/a/29540461) */
  document.aptEventListener = document.addEventListener;
  document.addEventListener = function(what, callback)
  {
    if (what !== 'title')
      return document.aptEventListener.apply(this, arguments);

    console.log('setting title event listener =>', arguments);

    new MutationObserver(function(mutations)
    {
      console.log('mutation observer triggered =>', mutations[0].target);
      
      /* save the title also at trigger time, so that we can skip it if the song
         has quickly changed between the triggering and the notificaction shows up */
      setTimeout(
        callback.bind(this, document.title),
        4500
      );

    }).observe(document.querySelector('title'), {subtree: true, childList: true, characterData: true});
  };

  /* trigger a new notification every time the page title changes */
  document.addEventListener('title', function(title_when_triggered)
  {
    /* trigger it only if we are actually playing songs and we haven't
       shown a notification for this song already */
    if (!document.title.match('▶') || document.prevtitle === document.title || title_when_triggered !== document.title)
    {
      console.log('returning without showing it up =>', document.title);
      return;
    }

    /* save the current title to avoid needless repetition */
    document.prevtitle = document.title;

    /* some debug printing to help out development, seems work work pretty nicely */
    console.log('this seems to be a new song, showing it up =>', document.title);

    /* feel free to customize the formatting and layout to your liking */
    var track_name     = document.querySelector("iframe#app-player").contentWindow.document.querySelector("#track-name > a").textContent;
    var track_artist   = document.querySelector("iframe#app-player").contentWindow.document.querySelector("#track-artist > a").textContent;
    var track_coverart = document.querySelector("iframe#app-player").contentWindow.document.querySelector(".sp-image-img").style.backgroundImage.replace(/"/g,'').split("(")[1].split(")")[0];

    /* show it! */
    new Notification(track_name, {body: track_artist, icon: track_coverart, silent: true});
  });
}

/* inject this cleaning function right in the page to avoid silly sandbox-related greasemonkey limitations */
window.document.head.appendChild(
  inject_fn = document.createElement("script")
);

inject_fn.innerHTML = '(' + when_external_loaded.toString() + ')()';