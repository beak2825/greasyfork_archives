// ==UserScript==
// @name         Betaseries ID
// @namespace    betaseries-id
// @version      0.1
// @description  Shows the series/movie id on the product page.
// @author       Moi
// @match        https://www.betaseries.com/serie/*
// @match        https://www.betaseries.com/film/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425700/Betaseries%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/425700/Betaseries%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

  var id = null;

  if (window.location.href.includes('/serie/')) {
    id = $('#reactjs-show-actions').attr('data-show-id');
  } else {
    id = $('#reactjs-movie-actions').attr('data-movie-id');
  }

    $('ul.blockInformations__details').prepend(`
      <li>
        <strong>ID</strong>
        <span class="u-colorWhiteOpacity05">${id}</span>
      </li>
    `);

})();