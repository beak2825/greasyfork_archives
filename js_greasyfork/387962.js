// ==UserScript==
// @name         User notes iframe
// @namespace    http://fxp.co.il/
// @version      0.1.1
// @description  Show user notes iframe in newnote page
// @author       MultiApple
// @match        https://www.fxp.co.il/usernote.php?do=newnote*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387962/User%20notes%20iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/387962/User%20notes%20iframe.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var notesLink = $('.lastnavbit').prev().children('a').attr('href');
  $('#pagetitle + .vbform').prepend('<iframe src="'+notesLink+'&amp;pp=200'+'" style="width:100%;height:400px;"></iframe>');
})();