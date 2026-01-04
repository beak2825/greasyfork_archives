// ==UserScript==
// @name        youtube anasayfa önerilen videolar gizleme
// @author      Hasan KÖROĞLU
// @namespace   hasankoroglu.com
// @description Arif'in Manchester'a attığı golü ararken başka konulara dalmamak için anasayfadaki önerilen videoları gizlemeyi sağlıyor.
// @include     https://www.youtube.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/389540/youtube%20anasayfa%20%C3%B6nerilen%20videolar%20gizleme.user.js
// @updateURL https://update.greasyfork.org/scripts/389540/youtube%20anasayfa%20%C3%B6nerilen%20videolar%20gizleme.meta.js
// ==/UserScript==

document.querySelectorAll('ytd-item-section-renderer.ytd-section-list-renderer').forEach(function(node){node.style.visibility='hidden'});