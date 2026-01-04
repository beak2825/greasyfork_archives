/* jslint       esversion: 6 */
// ==UserScript==
// @name        bandcamp Nice embedded
// @description Adds hotkeys to embedded pages
// @namespace   prettyView
// @include     https://bandcamp.com/EmbeddedPlayer*
// @version     v0.2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/369509/bandcamp%20Nice%20embedded.user.js
// @updateURL https://update.greasyfork.org/scripts/369509/bandcamp%20Nice%20embedded.meta.js
// ==/UserScript==

// Play/Pause on Space
// Performer — Album in title
// Artwork as tab icon

document.head.appendChild(document.createElement('style')).textContent = '#player {max-width: unset;}';

addEventListener('keydown', ({key:key})=>{
    if (key === ' ' || key === 'MediaPlayPause')
        return document.getElementById('big_play_button').click();
    if (key === 'MediaTrackNext')
        return document.querySelector('.nextbutton').click();
    if (key === 'MediaTrackPrevious')
        return document.querySelector('.prevbutton').click();
});
document.head.appendChild(document.createElement('title')).textContent = playerdata.artist + ' — ' + playerdata.album_title;

let linkEl = document.head.appendChild( document.createElement('link') );
linkEl.rel  = 'shortcut icon';
linkEl.href = playerdata.album_art;
