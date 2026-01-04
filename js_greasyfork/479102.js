// ==UserScript==
// @name        SC: highlight hypeddits (swipeddit edition)
// @namespace   userscript1
// @match       https://soundcloud.com/*
// @grant       none
// @version     0.1.9
// @author      -
// @description highlight tracks with hypeddit or otherwise download/buy link
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/479102/SC%3A%20highlight%20hypeddits%20%28swipeddit%20edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479102/SC%3A%20highlight%20hypeddits%20%28swipeddit%20edition%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.body.insertAdjacentHTML('beforeEnd', `<iframe id="swipeddit" style="display:none;"></iframe>`);


  function process(elm) {
    var link = elm.querySelector('a.soundActions__purchaseLink');
    var title = elm.querySelector('a.soundTitle__title, h1.soundTitle__title');

    // TODO: check description text on track pages:  div.truncatedAudioInfo__content a[href*="hypeddit.com"]

    if (!link && !title?.textContent.toLowerCase().includes('free down')) { return; }

    title.style.color = 'black';
    if (link && link.href.includes('hypeddit.com')) {
      title.style.background = '#f5d5eb';

      if (!title.parentNode.querySelector('.swipeddit')) {
        if (title.href != null) {
          var url = title.href;
        } else {
          var url = window.location;
        }
        const swipedditlink = 'http://localhost:8500/swipeddit?url=' + encodeURIComponent(url);

        title.insertAdjacentHTML('afterEnd', ` &nbsp;<a class="swipeddit" href="#"
                onclick="document.querySelector('#swipeddit').src = '${swipedditlink}'; this.style.textDecoration='line-through'; return false;"
                style="float:right;">SWIPEDDIT</a>`);
      }
    } else {
      title.style.background = '#d5ebf5';
    }
  }

  
  // get all tracks in a playlist and copy a list of swipeddit commands to clipboard
  function swipePlaylist(evt) {
    evt.preventDefault();
    var t='';
    document.querySelectorAll('.trackList__list .trackItem__trackTitle').forEach(
          a => {t+=`swipeddit "${a.href}" \n`}
        );
    console.log(t);
    navigator.clipboard.writeText(t);
  }


  // search results update after loading so just run on an interval for now
  window.setInterval(() =>{
      var s;
      if (document.querySelector('div.fullListenHero')) {
        s = '#content'; // track/playlist page
      } else {
        s = 'div.sound__content';
      }
      document.querySelectorAll(s).forEach(elm => process(elm) );

      // playlists
      var eof = document.querySelector('div.paging-eof:not(.swipeddit-processed)');
      if (eof) {
        eof.classList.add('swipeddit-processed');
        eof.insertAdjacentHTML('afterEnd', `<div><a id="swipeplaylist" href="#">copy swipe commands</a></div>`);
        document.querySelector('#swipeplaylist')?.addEventListener('click', swipePlaylist, false);
      }

    }, 1500);

})();