// ==UserScript==
// @name         WME Show locked HN + Restriction
// @description  Enables View HN and View Restrictions buttons for locked or out of area segments
// @version      1.1
// @author       whathappened15
// @include      https://www.waze.com/*/editor*
// @include      https://www.waze.com/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/*user/*editor/*
// @namespace    https://greasyfork.org/en/scripts/24955-wme-show-locked-hn-restriction
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24955/WME%20Show%20locked%20HN%20%2B%20Restriction.user.js
// @updateURL https://update.greasyfork.org/scripts/24955/WME%20Show%20locked%20HN%20%2B%20Restriction.meta.js
// ==/UserScript==

function ShowLockedHM_bootstrap()
{
    Waze.selectionManager.events.register("selectionchanged", null, unlockHNbtn);
    Waze.selectionManager.events.register("selectionchanged", null, unlockResbtn);
}

function unlockHNbtn()
{
    if(Waze.selectionManager.selectedItems.length == 1 && Waze.selectionManager.selectedItems[0].model.type === 'segment' &&
       document.getElementsByClassName('edit-house-numbers')[0] !== undefined)
	{
        document.getElementsByClassName('edit-house-numbers')[0].disabled = false;
    }
}

function unlockResbtn()
{
    if(Waze.selectionManager.selectedItems.length == 1 && Waze.selectionManager.selectedItems[0].model.type === 'segment' &&
       document.getElementsByClassName('edit-restrictions')[0] !== undefined)
	{
        document.getElementsByClassName('edit-restrictions')[0].disabled = false;
    }
}

ShowLockedHM_bootstrap();