// ==UserScript==
// @name         WarOfTitans
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://tiwar.ru/*
// @match        http://tiwar.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388091/WarOfTitans.user.js
// @updateURL https://update.greasyfork.org/scripts/388091/WarOfTitans.meta.js
// ==/UserScript==

function similarityOfLinks(link){
    var s = '';
    var i = 0;
    for ( i=0; i < document.links.length; i++ ){
        s = document.links[i].href;
        if (s.indexOf(link) > 0) {
            //alert (document.links[i].href);
            document.location.replace(document.links[i].href);
            break;
        }
    }
}

(function() {
    'use strict';
    var attackLinkMain = 'tiwar.ru/arena/attack';
  setTimeout(function () {
      similarityOfLinks(attackLinkMain);
  }, 90000);
})();