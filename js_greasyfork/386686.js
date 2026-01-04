// ==UserScript==
// @name         Twitter Pic Save
// @description  Save pictures from twitter site
// @author       KUMA
// @version      1.0
// @match        *://twitter.com*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @run-at       document-end
// @namespace    https://greasyfork.org/users/299057
// @downloadURL https://update.greasyfork.org/scripts/386686/Twitter%20Pic%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/386686/Twitter%20Pic%20Save.meta.js
// ==/UserScript==
var int = setInterval(function(){
  if($('.Gallery-media').length > 0){
    $('head').append('<style type="text/css">.GalleryNav--next {right: 0;width: 33%;}</style>');
    $('.Gallery-media').on('DOMNodeInserted', function(){
      $(this).find('img').css('cursor', 'alias').attr('src', $(this).find('img').attr('src').replace(/:large$/, ':orig'));
    });
  	clearInterval(int);
  }
},100);