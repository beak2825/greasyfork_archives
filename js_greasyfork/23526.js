// ==UserScript==
// @name         WME Show locked HN
// @description  Enables Edit HN button for locked segment for checking HN
// @version      0.3
// @author       Vinkoy
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://editor-beta.waze.com/editor/*
// @include      https://editor-beta.waze.com/*/editor/*
// @namespace    https://greasyfork.org/en/scripts/23526-wme-show-locked-hn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23526/WME%20Show%20locked%20HN.user.js
// @updateURL https://update.greasyfork.org/scripts/23526/WME%20Show%20locked%20HN.meta.js
// ==/UserScript==

function ShowLockedHM_bootstrap()
{
    W.selectionManager.events.register("selectionchanged", null, unlockHNbtn);
}

function unlockHNbtn()
{
    if(W.selectionManager.getSelectedFeatures().length == 1 && W.selectionManager.getSelectedFeatures()[0].model.type === 'segment' &&
       document.getElementsByClassName('edit-house-numbers')[0] !== undefined)
	{
        document.getElementsByClassName('edit-house-numbers')[0].disabled = false;
    }
}

ShowLockedHM_bootstrap();