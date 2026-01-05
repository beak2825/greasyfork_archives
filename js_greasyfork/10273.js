// ==UserScript==
// @name        quietness
// @namespace   fasttechforumquiet
// @description removes noise from the forum at fasttech.com
// @include     https://www.fasttech.com/forums/*
// @version     1.01
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/10273/quietness.user.js
// @updateURL https://update.greasyfork.org/scripts/10273/quietness.meta.js
// ==/UserScript==

var ignorelist = new Array('user1', 'user2', 'user3', 'user4', 'user5', 'user6');

function quietness() {
  window.setTimeout(function () {
    for (z in ignorelist) {
      $('.Nickname:contains(\'' + ignorelist[z] + '\')').each(function (i) {
        $(this).parent().parent().remove();
      }
      )
    }
  }, 1000);
}

window.onload = quietness;