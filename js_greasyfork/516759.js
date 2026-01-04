// ==UserScript==
// @name        apple musicvideos lister
// @namespace   Violentmonkey Scripts
// @match       https://music.apple.com/*
// @grant       none
// @version     0.1.1
// @author      -
// @description scroll down to load them all, then click in the textbox at bottom-right and the links are put on your clipboard
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/516759/apple%20musicvideos%20lister.user.js
// @updateURL https://update.greasyfork.org/scripts/516759/apple%20musicvideos%20lister.meta.js
// ==/UserScript==

(function() {
  'use strict';


  var selector = 'a[href*="music-video/"]';


  //////////////////////////
  function getLinks() {
    var txt = '';
    var list = [];
    document.querySelectorAll(selector).forEach(a => {
        //txt += a.href + '\n';
        list.push(a.href);
      });

    //document.querySelector('#userscript-output').value = txt;
    var unique = [...new Set(list)];
    txt = unique.join('\n');
    document.querySelector('#userscript-output').value = txt;
    navigator.clipboard.writeText(txt);
  }

  var t = document.createElement('textarea');
  t.style = 'position: fixed; bottom:1em; right: 0; z-index: 9999;';
  t.setAttribute('readonly', 'readonly');
  t.id = 'userscript-output';
  document.body.appendChild(t);
  t.addEventListener('click', getLinks, false);

})();