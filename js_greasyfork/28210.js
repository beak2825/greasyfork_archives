// ==UserScript==
// @name           WIS Diplomky
// @description    Zvýrazní témata diplomek, které si už někdo zapsal   
// @namespace      vokracko
// @author         Lukáš Vokráčko
// @include        https://wis.fit.vutbr.cz/FIT/st/bci-prj-z.php*
// @version        1.0
// @grant          none
// @encoding       utf-8
// @downloadURL https://update.greasyfork.org/scripts/28210/WIS%20Diplomky.user.js
// @updateURL https://update.greasyfork.org/scripts/28210/WIS%20Diplomky.meta.js
// ==/UserScript==

var taken = document.getElementsByTagName('table') [5].getElementsByTagName('td');
var n = taken.length;
for (var i = 0; i < n; i++)
{
    var attr = taken[i].getAttribute('bgcolor');
    if (attr == '#FFE4B5')
    {
        taken[i].style.background = '#FF7F7F';
        taken[i].parentNode.style.background = '#FF7F7F';
    } 
    else
    {
        taken[i].parentNode.style.background = '#90EE90';
    }
}
