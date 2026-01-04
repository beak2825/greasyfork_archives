// ==UserScript==
// @name         X on aoe2cm
// @version      0.1.1
// @description  Toggle X over picked civ image by clicking it
// @author       Ravana
// @match        https://aoe2cm.net/spectate?code=*
// @grant        none
// @namespace https://greasyfork.org/users/181454
// @downloadURL https://update.greasyfork.org/scripts/40938/X%20on%20aoe2cm.user.js
// @updateURL https://update.greasyfork.org/scripts/40938/X%20on%20aoe2cm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".pick.card").click(function(){if($(this).has(".pick_card_x").length>0){$(".pick_card_x",this).remove();}else{$(this).prepend('<div class="pick_card_x" style="position: absolute;z-index: 1;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="96px" height="96px" viewBox="0 0 96 96" preserveAspectRatio="xMidYMid meet"><rect id="svgEditorBackground" x="0" y="0" width="96" height="96" style="fill: none; stroke: none;"></rect><line id="e1_line" x1="0" y1="0" x2="96" y2="96" style="stroke:red;fill:none;stroke-width:5px;"></line><line id="e2_line" x1="0" y1="96" x2="96" y2="0" style="stroke:red;fill:none;stroke-width:5px;"></line></svg></div>');}});
})();