// ==UserScript==
// @name          Spotify Web - Copy playlist info
// @description   Copy playlist info for export
// @namespace     cobr123
// @version       2.9
// @license       MIT
// @grant         GM.setClipboard
// @grant         GM_setClipboard
// @include       https://open.spotify.com/*
// @downloadURL https://update.greasyfork.org/scripts/382828/Spotify%20Web%20-%20Copy%20playlist%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/382828/Spotify%20Web%20-%20Copy%20playlist%20info.meta.js
// ==/UserScript==


function copyPL() {
  let svPlayList = '';

  document.querySelectorAll('div[data-testid="tracklist-row"] > div:nth-child(2) > div').forEach(row => {
    let svTrackName = row.querySelector('div').textContent;
    let svArtistName = row.querySelector('span').textContent;
    if(row.querySelectorAll('span').length > 2) {
      svArtistName = row.querySelector('span:nth-child(3)').textContent
    }
    let svTrackInfo = svTrackName + ' - ' + svArtistName;
    console.log(svTrackInfo);
    svPlayList += svTrackInfo + '\n';
  });
  GM_setClipboard(svPlayList);
  alert('Copied:\n' + svPlayList);
}
function copyPLwithTime() {
  let svPlayList = '';
  document.querySelectorAll('div[data-testid="tracklist-row"] > div:nth-child(2) > div').forEach(row => {
    let svTrackName = row.querySelector('div').textContent;
    let svArtistName = row.querySelector('span').textContent
    if(row.querySelectorAll('span').length > 2) {
      svArtistName = row.querySelector('span:nth-child(3)').textContent
    }
    let svTrackTime = row.parentElement.parentElement.querySelector('div:nth-child(5) > div').textContent;
    let svTrackInfo = svTrackTime + ' ' + svTrackName + ' - ' + svArtistName;
    console.log(svTrackInfo);
    svPlayList += svTrackInfo + '\n';
  });
  GM_setClipboard(svPlayList);
  alert('Copied:\n' + svPlayList);
}

let bindEvents = function () {
  document.querySelector('div[data-testid="action-bar-row"]').innerHTML += '<button id="copy_playlist_to_clipboard" class="btn btn-green false">Copy playlist to clipboard</button>';
  document.querySelector('div[data-testid="action-bar-row"]').innerHTML += '<button id="copy_playlist_to_clipboard_with_time" class="btn btn-green false">Copy playlist to clipboard with time</button>';
  document.getElementById('copy_playlist_to_clipboard_with_time').onclick = copyPLwithTime;
  document.getElementById('copy_playlist_to_clipboard').onclick = copyPL;
};

window.setTimeout(bindEvents, 1000);
