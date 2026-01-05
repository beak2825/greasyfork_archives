// ==UserScript==
// @name        ast
// @namespace   AST
// @version     1.2
// @grant       none
// @description ast.tv
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include  *ast.tv*
// @downloadURL https://update.greasyfork.org/scripts/29477/ast.user.js
// @updateURL https://update.greasyfork.org/scripts/29477/ast.meta.js
// ==/UserScript==

var $ = jQuery;
$(document).ready(function(){
    $('.video-cont').addClass('col-lg-12');
    $('.chat-cont').addClass('col-lg-12');
  
    $('#videoContainer').css('width', '100%').css('height', 'auto');
});