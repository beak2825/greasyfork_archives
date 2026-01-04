// ==UserScript==
// @name         deploy server switcher
// @namespace    https://osu.ppy.sh/users/1927193
// @version      0.1
// @description  making switching to osu!catch pp test deploy server easier
// @author       Molqus
// @match        https://osu.ppy.sh/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/435897/deploy%20server%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/435897/deploy%20server%20switcher.meta.js
// ==/UserScript==

(() => {
  'use strict';

  if (location.href.match(/^https?:\/\/osu\.ppy\.sh\/beatmapsets\/[0-9]+#fruits\/[0-9]+$/)) {
    const current_url_splitted = location.href.split('/');
    const beatmapsetid = current_url_splitted[4].split('#')[0];
    const beatmapid = current_url_splitted[5];
    const target_url = `https://bastoo.smgi.me/beatmapsets/${beatmapsetid}#fruits/${beatmapid}`;

    window.addEventListener('load', () => {
      const insert_position = document.getElementsByClassName("osu-layout__row osu-layout__row--page-compact")[0];
      const new_element = `<div class="osu-page osu-page--generic" style="margin:0;">
        <center><a href="${target_url}">click here to switch to bastoo0's test deploy server</a>
    <p>(may move to missing page since test server is not completely synced with stable)</p></center>
    </div>`;
      insert_position.insertAdjacentHTML('afterend', new_element);
    });
  }

})();