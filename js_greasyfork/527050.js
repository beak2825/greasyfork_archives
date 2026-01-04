// ==UserScript==
// @name        YouTube Playlist
// @namespace   Violentmonkey Scripts
// @match       https://pokeheroes.com/userprofile*
// @grant       none
// @version     1.0.0
// @author      -
// @description Replace eggs/pkmns with widgets
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/527050/YouTube%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/527050/YouTube%20Playlist.meta.js
// ==/UserScript==

(function(){
  'use strict';

  let id
  let body
  $('table:eq(0) a').each((index, data) => {
    id = /\d+/.exec(data.href)
    body = `<iframe src="https://api.pokeheroes.com/widgets/pkmninteract.php?id=${id}" style="width: 100px; height: 126px; border: 0" scrolling="no"></iframe>`
    $(data).parent().html(body)
  })
})()