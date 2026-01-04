// ==UserScript==
// @name        RARBG - Add Direct Torrent Link
// @namespace   https://greasyfork.org
// @description Autofocus captcha and add a torrent link shortcut in search/browse view of torrents, inspired by https://greasyfork.org/en/scripts/12648
// @author      Guillaume
// @version     1.8.1
// @icon        https://dyncdn.me/static/20/img/logo_dark_nodomain2_optimized.png
// @include     *rarbg*/threat_defence.php*
// @include     *rarbg*/torrent/*
// @include     *rarbg*/torrents.php*
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/31239/RARBG%20-%20Add%20Direct%20Torrent%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/31239/RARBG%20-%20Add%20Direct%20Torrent%20Link.meta.js
// ==/UserScript==

if (document.URL.indexOf('/torrent/') > 0 && document.URL.endsWith('#')) {
  return window.addEventListener('DOMContentLoaded', function() {
    var iframe = document.createElement('iframe');
    iframe.src = document.querySelector('a[href^="/download.php"]').href;
    iframe.onload = function() { window.history.back() };  // Firefox
    document.body.appendChild(iframe);
    if (navigator.userAgent.indexOf('Chrome') > 0)
      setTimeout(function() { window.history.back() }, 500);  // Increase for slow connections or Vivaldi
  });
}

if (document.URL.indexOf('/threat_defence.php?defence=nojc') > 0)
  return location.assign('/threat_defence.php?defence=1');

if (document.URL.indexOf('/threat_defence') > 0) {
  return window.addEventListener('DOMContentLoaded', function() {
    var solve = document.getElementById('solve_string');
    if (solve) solve.focus();
    else setTimeout(this, 100);
  });
}

const torrentImgData = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCIgWwoJPCFFTlRJVFkgc3QwICJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiMzMzMzMzM7Ij4KCTwhRU5USVRZIHN0MSAiZmlsbDojMzMzMzMzOyI+Cl0+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0IDI0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojMzMzMzMzOyIgZD0iTTAuNzc2LDEyLjAzN2MwLTYuMTksNS4wMTktMTEuMjA5LDExLjIxLTExLjIwOWM2LjE4OSwwLDExLjIwNiw1LjAyLDExLjIwNiwxMS4yMDkgIGMwLDYuMTkyLTUuMDE3LDExLjIwOS0xMS4yMDYsMTEuMjA5QzUuNzk1LDIzLjI0NiwwLjc3NiwxOC4yMjksMC43NzYsMTIuMDM3eiBNMjEuNDQsMTIuMDM3YzAtNS4yMi00LjIzLTkuNDU0LTkuNDU0LTkuNDU0ICBjLTUuMjIyLDAtOS40NTQsNC4yMzQtOS40NTQsOS40NTRjMCw1LjIyMSw0LjIzMiw5LjQ1NCw5LjQ1NCw5LjQ1NEMxNy4yMSwyMS40OTEsMjEuNDQsMTcuMjU4LDIxLjQ0LDEyLjAzN3oiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiMzMzMzMzM7IiBkPSJNMTQuOTk1LDExLjkwMmwtMy42ODQsMy42ODNjLTAuMTgyLDAuMTgtMC4yNzgsMC40MTgtMC4yNzgsMC42NzZjMCwwLjI1MywwLjA5NiwwLjQ5LDAuMjc4LDAuNjcxICBjMC4zNywwLjM3NCwwLjk3NSwwLjM3MiwxLjM0NywwbDMuNjg0LTMuNjgxYzAuMTgtMC4xODIsMC4yNzktMC40MiwwLjI3OS0wLjY3NGMtMC4wMDEtMC4yNTUtMC4xLTAuNDk2LTAuMjc5LTAuNjc1ICBDMTUuOTcsMTEuNTM0LDE1LjM2OCwxMS41MjksMTQuOTk1LDExLjkwMnoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiMzMzMzMzM7IiBkPSJNNy42MjYsMTMuMjUybDMuNjg1LDMuNjgxYzAuMTc4LDAuMTgxLDAuNDE4LDAuMjc5LDAuNjczLDAuMjgyYzAuMjU1LTAuMDAzLDAuNDk1LTAuMSwwLjY3NC0wLjI4MiAgYzAuMzcyLTAuMzcsMC4zNzEtMC45NzYsMC0xLjM0N2wtMy42ODQtMy42ODNjLTAuMTgyLTAuMTgtMC40Mi0wLjI4LTAuNjc0LTAuMjhjLTAuMjUzLDAtMC40OTMsMC4xMDEtMC42NzQsMC4yOCAgQzcuMjU2LDEyLjI3Myw3LjI1NSwxMi44NzgsNy42MjYsMTMuMjUyeiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6IzMzMzMzMzsiIGQ9Ik0xMS4wMzMsNy44NzZ2Ni4yMzJjMCwwLjI1NSwwLjA5OSwwLjQ5NCwwLjI3OSwwLjY3NGMwLjE4MSwwLjE4MSwwLjQxOCwwLjI4MSwwLjY3MywwLjI3OCAgYzAuNTI2LDAuMDAzLDAuOTUyLTAuNDI2LDAuOTUyLTAuOTUybDAuMDAxLTYuMjMyYzAuMDAyLTAuMjU0LTAuMDk3LTAuNDk0LTAuMjc4LTAuNjc0Yy0wLjE4MS0wLjE3OC0wLjQyLTAuMjc5LTAuNjc1LTAuMjggIEMxMS40Niw2LjkyMywxMS4wMzMsNy4zNSwxMS4wMzMsNy44NzZ6Ii8+DQo8L3N2Zz4=';

window.addEventListener('DOMContentLoaded', function() {
  var headCell = document.createElement('td');
  headCell.innerHTML = 'Tor.';
  headCell.classList.add('header6');
  headCell.classList.add('header40');
  document.querySelector('.lista2t tr:first-child td:nth-child(2)').parentNode.insertBefore(headCell, document.querySelector('.lista2t tr:first-child td:nth-child(2)'));

  var torrents = document.querySelectorAll('.lista2 td:nth-child(2) [href^="/torrent/"]');
  for (var i = 0; i < torrents.length; i++) {
    var torrentCell = document.createElement('td');
    torrentCell.classList.add('torrent-cell');
    torrentCell.innerHTML = '<img src="'+ torrentImgData +'" title="Grab torrent" onclick="location.assign(\''+ torrents[i].href +'#\')"/>';
    torrents[i].parentNode.parentNode.insertBefore(torrentCell, torrents[i].parentNode);
  }

  GM_addStyle(`
    .torrent-cell { width: 32px; cursor: pointer }
    .torrent-cell img { width: 20px; padding: 8px 6px 8px 5.5px }
    .torrent-cell img:active { opacity: .75 !important }
  `);
});