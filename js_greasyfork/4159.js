// ==UserScript==
// @name         Nexus Clash: Lore Counter
// @namespace    http://nexusclash.com/wiki/index.php/user:xensyria
// @version      1.2
// @description  Adds total Lore collected so far to the Lore button in the sidebar when Lore is selected.
// @match        http://nexusclash.com/modules.php?name=Game*
// @match        http://www.nexusclash.com/modules.php?name=Game*
// @exclude      http://nexusclash.com/modules.php?name=Game&op=disconnect
// @exclude      http://www.nexusclash.com/modules.php?name=Game&op=disconnect
// @grant        none
// @copyright    PD
// @downloadURL https://update.greasyfork.org/scripts/4159/Nexus%20Clash%3A%20Lore%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/4159/Nexus%20Clash%3A%20Lore%20Counter.meta.js
// ==/UserScript==

var sideBars = document.getElementsByName('sidebar');    //  Find the sidebar

for (var i = 0; i < sideBars.length; i++){        //  Cycle through the buttons

    if (sideBars[i].value == 'Lore'){      //  Find the Lore button if it's there

        var possibleLore = sideBars[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.firstChild.textContent   //  Select the sidebar pane from the Lore button

        if (possibleLore.match(/^(\n\s+\d{1,2}\.\s+[a-z ,\?\-:\.\;]+)+\s*$/i)){      //  Check if the pane contents match Lore formatting (e.g. 1. blah / 20. blah / etc.)

            sideBars[i].nextSibling.value = 'Lore (' + possibleLore.match(/\n\s+\d{1,2}\.\s+[a-z ,\?\-:\.\;]+/gi).length + '/50)';   //  If so, change Lore button to include Lore count

        }

    }

}