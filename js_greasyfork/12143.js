// ==UserScript==
// @name        GitHub Status
// @icon        https://github.com/eXistenZNL/userscripts/raw/master/icons/github.png
// @namespace   eXistenZNL
// @description Changes the colour of the main Github octocat icon according to status.github.com
// @include     https://*github.com/*
// @version     3.0.1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/12143/GitHub%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/12143/GitHub%20Status.meta.js
// ==/UserScript==

(function($) {
  $.get(
    'https://status.github.com/api/status.json',
    function(data) {
      colors = {
        'good': '#396',
        'minor': '#f29d50',
        'major': '#c30'
      };
      $logo = $('.header-logo-invertocat .octicon-mark-github');
      $logo.css('color', colors[data.status]);
    }
  );
})(jQuery);
