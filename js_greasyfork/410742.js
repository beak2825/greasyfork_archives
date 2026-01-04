// ==UserScript==
// @name         AppleMusicToSpotify
// @description  append link to Spotify search at Apple Music
// @version      0.2.1
// @namespace    https://github.com/to
// @match        https://music.apple.com/*/album/*
// @match        https://music.apple.com/*/playlist/*
// @downloadURL https://update.greasyfork.org/scripts/410742/AppleMusicToSpotify.user.js
// @updateURL https://update.greasyfork.org/scripts/410742/AppleMusicToSpotify.meta.js
// ==/UserScript==

// original
// https://qiita.com/embokoir/items/d667a6802105b842fb48

let playlist = !!location.href.match('/playlist/');
let artist = document.querySelector('.product-creator').textContent.trim();
let observer = new MutationObserver(records => {
  setTimeout(() => {
    [...document.getElementsByClassName('song-name')].forEach(elmName => {
      let name = elmName.innerText;
      if(playlist)
        artist = elmName.nextElementSibling.textContent.trim();
      
      let elmLink = document.createElement('a');
      elmLink.setAttribute('href', `https://open.spotify.com/search/${artist} ${name}`);
      elmLink.setAttribute('target', '_blank');
      elmLink.style.color = 'hsl(144, 73%, 41%)';
      elmLink.className = elmName.className;
      elmLink.innerText = name;

      elmName.parentNode.replaceChild(elmLink, elmName);
    });
  }, 0);
});

observer.observe(document.body, {
  childList: true
});