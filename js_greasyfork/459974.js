// ==UserScript==
// @name        hypeddit bypass
// @namespace   Violentmonkey Scripts
// @match       https://hypeddit.com/*
// @grant       none
// @version     0.2.2
// @author      -
// @description bypass got patched but we can automate some of this and show if SC/Spotify follows are required
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/459974/hypeddit%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/459974/hypeddit%20bypass.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (!document.querySelector('#downloadProcess')) {
    console.log('no download found, abort');
    return;
  }

  function set(sel, txt) {
    var elm = document.querySelector(sel);
    if (elm) { elm.value = txt };
  }

  // autofills
  set('#email_name', 'me');
  set('#email_address', 'a@a.com');
  set('#sc_comment_text', 'nice');


  const steps = document.querySelector('#steps_select').value.replaceAll(/dw|ig|yt/g, '').replaceAll(',', ' ');
  const art = document.head.querySelector('meta[property="og:image"]').content;
  const link = art.replace(/_coverart(manual)*/, '_main');
  console.log(link);
  const artist = window.jsonGateData['artist_name'];
  const title  = window.jsonGateData['title'];
  const filename = `${artist} - ${title}`
    .replaceAll(/[\/\\":*?<>|]/g, '')
    .replaceAll(/free (download|dl)/ig, '')
    .replaceAll('[]', '')
    .replaceAll('()', '')
    .replaceAll('{}', '')
    ;

  const d = document.createElement('div');
  d.style = 'position: fixed; bottom:0; right: 0; z-index: 100; width:100%; text-align: center; background: white; padding: 2em;';
  d.innerHTML = `
                <span style="font-size: 1.5em;">steps: <b>${steps}</b></span> <br>
                <textarea readonly onclick="this.focus();this.select(); navigator.clipboard.writeText(this.textContent)" style="resize: none; width: 100%; text-align: center; font-family: monospace;">${filename}</textarea>
                <span>
                  <a href="${art}" download>artwork</a>
                </span>
                `;
  document.body.appendChild(d);

  // unlock next button for IG/YT
  window.setInterval(() =>{
    document.querySelectorAll('#instagram_status a , #youtube_status a').forEach(el => {
      el.classList.remove('undone');
    });
  }, 1000);


})();
