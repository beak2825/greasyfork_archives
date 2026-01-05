// ==UserScript==
// @name        Navi be quiet
// @namespace   pendevin
// @description lowers the volume of Navi so it isn't as annoying
// @include     http://boards.endoftheinter.net/showmessages.php*
// @include     https://boards.endoftheinter.net/showmessages.php*
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/11091/Navi%20be%20quiet.user.js
// @updateURL https://update.greasyfork.org/scripts/11091/Navi%20be%20quiet.meta.js
// ==/UserScript==


const NAVI_VOLUME_PERCENTAGE=3;


this.$ = this.jQuery = jQuery.noConflict(true);

var navi=$('#sound_player');
navi[0].volume=NAVI_VOLUME_PERCENTAGE/100;
//do we need anything else?
//nop