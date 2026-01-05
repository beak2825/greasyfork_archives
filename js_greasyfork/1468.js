// ==UserScript==
// @name           Remove Equipment Defaults From GLB Equipment Page
// @namespace      pbr
// @include        http://goallineblitz.com/game/upgrade_equipment.pl?*
// @version        09.03.05
// @description dfsdfs
// @downloadURL https://update.greasyfork.org/scripts/1468/Remove%20Equipment%20Defaults%20From%20GLB%20Equipment%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/1468/Remove%20Equipment%20Defaults%20From%20GLB%20Equipment%20Page.meta.js
// ==/UserScript==

/*
 *
 * pabst did this 3/2/09+
 *
 */

window.setTimeout(
    function() {
        eqmain();
    }
, 100);

function eqmain() {
    var option = document.createElement("option");
    option.text = "-select-";

    var select = document.getElementsByTagName("select")[0];
    select.options.add(option);
    select.selectedIndex = select.options.length-1;
}
