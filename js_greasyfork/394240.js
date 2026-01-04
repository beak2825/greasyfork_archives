// ==UserScript==
// @name               No more Dude
// @namespace    elprofesor.nomoredude
// @version           0.5
// @description    No more annoying posts from dude
// @author            El Profesor
// @include           https://www.torn.com/forums.php*
// @include           https://www.torn.com/laptop.php*
// @grant              none

// @downloadURL https://update.greasyfork.org/scripts/394240/No%20more%20Dude.user.js
// @updateURL https://update.greasyfork.org/scripts/394240/No%20more%20Dude.meta.js
// ==/UserScript==


(function() {
    'use strict';

  $(document).ready(function(){
    setInterval(function() {

        $(".user").each(function(){
        if ($(this).attr('href') == '/profiles.php?XID=1028023' && $(this).parent('li').hasClass('last-post') == false ) {
            $(this).parents('li').hide();
            var threadWrap = $(this).parents('thread-name-wrap');
            var columnWrap = $(this).parents('column-wrap');
            $(threadWrap).parents('li').hide();
            $(columnWrap).parents('li').hide();
        }
    });

   }, 2000);
  });
})();