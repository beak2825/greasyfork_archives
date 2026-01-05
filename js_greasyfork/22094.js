// ==UserScript==
// @name         Zaladunek surowcow
// @namespace    Polskie literki w wiadomościach ąśćźż
// @include      http://ogame1304.de/game/index.php?page=flotten3*
// @version      1.0
// @description  joks@linux.pl
// @author       Lee A-Z/joks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22094/Zaladunek%20surowcow.user.js
// @updateURL https://update.greasyfork.org/scripts/22094/Zaladunek%20surowcow.meta.js
// ==/UserScript==


if (location.href.split ("page=flotten3").length == 2)
{
    var thShortcuts = document.getElementById ('remainingresources').parentNode.parentNode.nextSibling.nextSibling.childNodes [1];
    thShortcuts.innerHTML = "<a href=\"javascript:void (0);\" onclick=\"document.getElementsByName ('resource1') [0].value='0'; document.getElementsByName ('resource2') [0].value='0'; document.getElementsByName ('resource3') [0].value='0'; calculateTransportCapacity ();\">Zeruj</a> - " +
                thShortcuts.innerHTML +
                " - <a href=\"javascript:void (0);\" onclick=\"document.getElementsByName ('resource1') [0].value='0'; document.getElementsByName ('resource2') [0].value='0'; document.getElementsByName ('resource3') [0].value='0'; maxResource ('3'); maxResource ('2'); maxResource ('1'); calculateTransportCapacity ();\">Deu/Kry/Met</a>";
}