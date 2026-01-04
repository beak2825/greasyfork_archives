// ==UserScript==
// @name            AAK - maps4heroes.com
// @namespace       Violentmonkey Scripts
// @match           https://www.maps4heroes.com/forum/opinions.php
// @grant           none
// @version         1.0
// @author          strelokhalfer
// @description     Allows download maps with enabled adblock tool.
// @description:ru  Позволяет скачивать карты без отключения адблока.
// @license   	    CC-BY-4.0
// @downloadURL https://update.greasyfork.org/scripts/416038/AAK%20-%20maps4heroescom.user.js
// @updateURL https://update.greasyfork.org/scripts/416038/AAK%20-%20maps4heroescom.meta.js
// ==/UserScript==
(function() {
  document.querySelector('#watch_here_top').style.height = "1px"
})();