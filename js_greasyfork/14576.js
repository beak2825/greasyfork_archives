// ==UserScript==
// @name         Realitygaming Red Neige
// @namespace    https://realitygaming.fr/
// @version     1.2
// @description  try to take over the world!
// @author       Marentdu93
// @match        https://realitygaming.fr/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14576/Realitygaming%20Red%20Neige.user.js
// @updateURL https://update.greasyfork.org/scripts/14576/Realitygaming%20Red%20Neige.meta.js
// ==/UserScript==

$(document).ready(function(){

                var css = ' .titleBar h1{font-size:32pt;font-family:Open Sans Condensed,Arial,sans-serif;color:rgba(0,0,0,0);overflow:hidden;zoom:1;text-align:center;font-weight:normal!important;background:url(http://i.imgur.com/Hl700Y7.png) center}';

    $('head').append('<style>' + css + '</style>');
            });
  
$(document).ready(function(){

    var css = '.titleBar {visibility:hidden}';

    $('.titleBar h1').before('<img scr="http://i.imgur.com/Hl700Y7.png"/>');

});
