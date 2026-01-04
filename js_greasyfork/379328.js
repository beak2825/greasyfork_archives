// ==UserScript==
// @name               Inishi Dungeon Popout
// @description        Pop out Inishie Dungeon game
// @version            1.0.0
// @include            /^http\:\/\/inishie-dungeon.com//
// @run-at             document-idle
// @author             willy_sunny
// @license            GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @namespace          https://greasyfork.org/users/9968
// @downloadURL https://update.greasyfork.org/scripts/379328/Inishi%20Dungeon%20Popout.user.js
// @updateURL https://update.greasyfork.org/scripts/379328/Inishi%20Dungeon%20Popout.meta.js
// ==/UserScript==
//

var g=document.getElementById('inishie').outerHTML.replace(' width="480"',' width="100%"').replace(' height="360"',' height="100%"').replace(' width="480"',' width="100%"').replace(' height="360"',' height="100%"');var w=window.open("", "", "width=150,height=100");w.document.write(g);