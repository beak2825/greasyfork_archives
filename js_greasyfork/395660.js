// ==UserScript==
// @name        8kun NSFW Remover
// @description Removes NSFW boards from the board list on 8chan.
// @include     /^https?://8kun\.top/boards.html$/
// @include        https://8kun.top/*
// @include        http://h.8kun.top/*
// @include        http://8kun.top/*
// @license     GPLv3
// @grant       none
// @version 0.0.1.20200125193427
// @namespace https://greasyfork.org/users/438347
// @downloadURL https://update.greasyfork.org/scripts/395660/8kun%20NSFW%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/395660/8kun%20NSFW%20Remover.meta.js
// ==/UserScript==

window.addEventListener ("load", Greasemonkey_main, false);

function Greasemonkey_main(){
  document.getElementById('search-sfw-input').checked = true;
  if(document.getElementById('search-sfw-input').checked = true){
    document.getElementById('search-submit').click();
  }
}