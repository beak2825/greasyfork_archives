// ==UserScript==
// @name         User notes numbers and links
// @namespace    http://fxp.co.il/
// @version      0.1.1
// @description  Show notes numbers with links
// @author       MultiApple
// @match        https://www.fxp.co.il/usernote.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387960/User%20notes%20numbers%20and%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/387960/User%20notes%20numbers%20and%20links.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var urlParams = new URLSearchParams(window.location.search),
    u = urlParams.get('u'),
    pp = urlParams.get('pp') || 15,
    page = urlParams.get('page') || 1;
  $('.postbit .posthead-date').each(function(i){
    var noteCount = i+pp*(page-1)+1;
    $(this).append('<a href="usernote.php?u='+u+'&amp;pp=1&amp;page='+noteCount+'" class="postcounter">#'+noteCount+'</a>');
  });
})();