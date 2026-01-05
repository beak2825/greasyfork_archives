// ==UserScript==
// @name          Swyter Tweaks for Spotify
// @description   Mutes the audio ads on play.spotify.com, while they are still being played, so *everyone* is happy.
// @homepage      https://swyterzone.appspot.com
// @namespace     https://greasyfork.org/users/4813
// @match         https://play.spotify.com/*
// @grant         none
// @run-at        document-end
// @version       2015.07.01
// @author        Swyter
// @icon          https://i.imgur.com/LHkCkka.png
// @downloadURL https://update.greasyfork.org/scripts/4638/Swyter%20Tweaks%20for%20Spotify.user.js
// @updateURL https://update.greasyfork.org/scripts/4638/Swyter%20Tweaks%20for%20Spotify.meta.js
// ==/UserScript==

if (window.parent !== window)
  throw 'stop execution';

function when_external_loaded()
{

  // Bruteforce our way to get the instance reference, nice spaguetti code, JS at its finest!
  // F*ck you Firefox, I'm elegant!— Said the angry programmer with the hair-raising voice of a stud.
  var _core = Spotify.Instances.get(
    (document.querySelector("object[id*='SPFBIn_']")||{id:"firefoxsux69"}).id.match(/.+\d+/)
  );

  if (typeof _core === 'undefined')
  {
    // Wait in cycles of 100 ms until the client finally loads
    setTimeout(arguments.callee, 100);
  }
  
  else
  {
    // Here's the real meat...
    console.log("Binding Swyter Tweaks for Spotify on the player's code.");

    _core.audioManager.bind('PLAYING', function(e)
    {
        var isAd = document.getElementById("app-player").contentDocument.getElementById("next").classList.contains('disabled');

        if (isAd)
        {
            console.log("We're loading an ad, skipping “"+ document.title.match(/^▶?\s?(.+) -/)[1] +"”");

            var timestamp = document.getElementById('app-player').contentDocument.getElementById('track-length').innerHTML.split(':');
                timestamp = timestamp[0]*60 + timestamp[1]*1;
                timestamp*= 1000;

            _core.audioManager.getActivePlayer().seek(
                _core.audioManager.getActivePlayer().getDuration() || timestamp
            );
        }
    });

  }
}

// Ugly as hell so it stays crossplatform, damn you Spotify engineers for a nicely done work! :-)
document.head.appendChild(
  inject_fn = document.createElement('script')
);

inject_fn.innerHTML = '(' + when_external_loaded.toString() + ')()';