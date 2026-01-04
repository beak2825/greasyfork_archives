// ==UserScript==
// @name        RED: highlight snatched groups & torrents
// @namespace   userscript1
// @match       https://redacted.sh/*
// @grant       none
// @version     0.1.3
// @description highlight snatched groups & torrents
// @downloadURL https://update.greasyfork.org/scripts/432678/RED%3A%20highlight%20snatched%20groups%20%20torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/432678/RED%3A%20highlight%20snatched%20groups%20%20torrents.meta.js
// ==/UserScript==


// requires 'Snatched torrents indicator' enabled in your RED settings

(function() {

  'use strict';

  document.querySelectorAll('.group.snatched_group, .group.seeding_group, .snatched_torrent, .seeding_torrent')
    .forEach(a => a.querySelector('td')
             .style.background='linear-gradient(90deg, rgba(200,225,202,1), rgba(200,225,202,0))'
            );

})();