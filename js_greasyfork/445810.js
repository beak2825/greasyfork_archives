// ==UserScript==
// @name         Soundsnap.com download
// @namespace    V@no
// @version      0.1
// @description  Direct download
// @author       V@no
// @license      MIT
// @match        *://www.soundsnap.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/445810/Soundsnapcom%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/445810/Soundsnapcom%20download.meta.js
// ==/UserScript==

// jshint esversion:6, curly: false

(function loop(attempts)
{
  'use strict';
  if (attempts)
    loop._attempts = attempts;

  const wavesurfer = window.wavesurfer;
  if ((!wavesurfer || !wavesurfer.length) && loop._attempts--)
    return setTimeout(loop);

  for(let i = 0, node; i < wavesurfer.length; i++ )
  {
    if (!wavesurfer[i] || !(node = document.querySelector('#node-' + i + ' .ss_download')))
      continue;

    node.addEventListener("click", e => e.stopPropagation());
    node.href = wavesurfer[i].backend.song;
  }
})(10000);
