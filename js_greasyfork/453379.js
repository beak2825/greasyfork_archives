// ==UserScript==
// @name        BC: embed player everywhere
// @namespace   userscript1
// @match       https://*.bandcamp.com/music
// @match       https://bandcamp.com/EmbeddedPlayer*
// @match       https://bandcamp.com/*/feed
// @match       https://*/*
// @grant       none
// @version     0.1.7
// @author      -
// @license     GPLv3
// @description use embedded player on: /feed (mouseover album art); /music
// @downloadURL https://update.greasyfork.org/scripts/453379/BC%3A%20embed%20player%20everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/453379/BC%3A%20embed%20player%20everywhere.meta.js
// ==/UserScript==


(function() {    // ------------
  'use strict';

  // is this *bandcamp.com or bandcamp on a custom domain?
  if (!document.location.hostname.endsWith('bandcamp.com')
      && !document.head.querySelector('meta[property="twitter:site"][content="@bandcamp"]') ) {
        //console.log('--not a bandcamp site');
        return;
  }


  //document.body.classList.add(document.URL);  // testing what URL the iframe ends up on

  ////////////////////////////////////////////////////////////////////////////////////////////////
  if (document.location.pathname.startsWith('/EmbeddedPlayer')) {
    // embeddedplayer window.location changes when iframed:  https://bandcamp.com/EmbeddedPlayer.html/ ...
    console.log('---embed page');
    if (document.location.pathname.includes('/track=') ) {
      console.log('---track player, checking for album');

      var albumID = JSON.parse(
            document.querySelector('script[data-player-data]')
            ?.getAttribute('data-player-data')
          ).album_id;

      if (!albumID) {
        console.log('--track only');
        return;
      }

      // it's from an album, so load that
      document.body.remove();
      var newURL = document.URL.replace(/track=\d*/, 'album=' + albumID);
      console.log('--redirecting to: ' + newURL);
      document.location = newURL;
    }
  ////////////////////////////////////////////////////////////////////////////////////////////////
  } else if (document.location.pathname == '/music') {
    console.log('---music page');

    // featured releases don't have the data id, hide them. we unhide their regular listing below
    document.querySelectorAll('ol.featured-grid')?.forEach( li => li.style.display = 'none' );

    var releases = document.querySelectorAll('li.music-grid-item');
    for (let r of releases) {
      r.style.display = '';  // unhiding anything that was featured
      var itemStr = r.getAttribute('data-item-id').replace('-', '=');
      // firefox doesn't yet support lazy-loading iframes
      var player = `<iframe style="border: 0; width: 400px; height: 300px;"
                            src="https://bandcamp.com/EmbeddedPlayer/${itemStr}/size=large/bgcol=ffffff/linkcol=0687f5/artwork=none/transparent=true/"
                            loading="lazy"
                            referrerpolicy="no-referrer"
                            seamless>
                    </iframe>
                    <div style="clear:left;"> </div>
                    `;
      r.insertAdjacentHTML('afterEnd', player);
    }
  ////////////////////////////////////////////////////////////////////////////////////////////////
  } else if (document.location.pathname.endsWith('/feed')) {
    console.log('---feed page');
    document.getElementById('stories').addEventListener('mouseover', feedEvent, true);
  }



  function feedEvent(evt) {
    const t = evt.target;
    if (t.nodeName == 'IMG' && t.classList.contains('tralbum-art-large') ) {

      // if we decide to make the event 'click' we need to block the default player:
      //evt.preventDefault();
      //evt.stopPropagation();

      // step up the tree to find data
      var d = t.parentNode;
      while (!d.classList.contains('collection-item-container') ) {
        d = d.parentNode;
      }
      var itemID   = d.getAttribute('data-tralbumid');
      var itemType = d.getAttribute('data-tralbumtype') == 'a' ? 'album' : 'track';
      var itemStr  = itemType + '=' + itemID;
      var player   = `<iframe style="border: 0; width: 100%; height: 300px;"
                        src="https://bandcamp.com/EmbeddedPlayer/${itemStr}/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/"
                        referrerpolicy="no-referrer"
                        seamless>
                      </iframe>
                      `;
      d.querySelector('div.story-title').insertAdjacentHTML('afterEnd', player);
      d.querySelector('div.tralbum-art-container').remove();
      //d.querySelector('div.tralbum-wrapper-col2').remove();  // 'supported by' section
    }
  }

})();  // ----------------
