// ==UserScript==
// @name         Blockchain Cuties Advanced Player's Cuties list
// @version      0.31
// @description  a small script for Blockchain Cuties to provide a new (sortable, searchable) list of any player's cuties
// @author       VeRychard  <me@verychard.com>
// @icon         http://hyperfocus.net/darkcuties_logo.png
// @match        https://blockchaincuties.co/pet/*
// @match        https://blockchaincuties.co/leaderboard*
// @match        https://blockchaincuties.com/pet/*
// @match        https://blockchaincuties.com/leaderboard*
// @grant        none
// @namespace https://greasyfork.org/users/193828
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/370183/Blockchain%20Cuties%20Advanced%20Player%27s%20Cuties%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/370183/Blockchain%20Cuties%20Advanced%20Player%27s%20Cuties%20list.meta.js
// ==/UserScript==
(function() {
    'use strict';
  $(document).ready(function() {
     setTimeout(
      function()
        {
          $('.pet_header_owner-name, .pet_header_owner-imageLink, .board-item-user a').each(function()
          {this.href = this.href.replace(/player\//,"pets/1?search=owner:");
          });
       }, 2500);
});
})();
