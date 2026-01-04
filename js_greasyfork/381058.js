// ==UserScript==
// @name         MouseHunt - SEH Loot Counter for Hunting Log
// @author       Jia Hao (Limerence#0448 @Discord)
// @author       plasmoidia#7296
// @namespace    https://greasyfork.org/en/users/165918-jia-hao
// @version      1.2
// @description  Counts the number of unique loot you have in your daily hunting log.
// @include      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/381058/MouseHunt%20-%20SEH%20Loot%20Counter%20for%20Hunting%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/381058/MouseHunt%20-%20SEH%20Loot%20Counter%20for%20Hunting%20Log.meta.js
// ==/UserScript==

//Appends loot count into the journal entry itself
function countLoot() {
    var logEntry = $("a:contains('More details')");
    if (logEntry.length == 0) return;

    //Find the JSON string for the loot obtained. Parse into JSON and iterate to count the loot
    var lootRawString = logEntry.attr('onclick').match(/{.*?}/gm)[2];
    var lootJSON = JSON.parse(lootRawString);
    var counter = 0;
    for (var loot in lootJSON) counter++;

    //compute total number of hunts
    var parentTr = logEntry.parent().parent();
    const journalLog = parentTr.parent()[0];
    const values = journalLog.getElementsByClassName('value');
    const catches = parseInt(values[0].childNodes[0].data);
    const fta = parseInt(values[1].childNodes[0].data);
    const misses = parseInt(values[2].childNodes[0].data);
    const hunts = catches + misses + fta;

    //HTML magic
    var htmlString = `
    <tr>
      <td class="spacer goldPointsSpacer" colspan="4"></td>
    </tr>
    <tr>
      <td class='field leftSide loot' colspan='2'>
        <div class='fieldHeader left'>
          <b>Hunts</b>
        </div>
      </td>
	  <td class='field rightSide loot' colspan='2'>
	    <div class='fieldHeader right'>
          <b>Loot</b>
        </div>
	  </td>
    </tr>
    <tr>
	  <td class='field leftSide'>Total:</td>
      <td class='value leftSide totalHunts'>` + hunts + `</td>
      <td class='field rightSide'>Total:</td>
      <td class='value rightSide uniqueLoot'>` + counter + `</td>
    </tr>`;
    if ($(".uniqueLoot").length == 0) $(htmlString).insertBefore(parentTr);
}

//Appends loot count into the sub-header in the loot journal
function lootWindow() {
    if ($(".default.hunting_summary").length == 0) return;
    if ($(".uniqueLoot").length == 0) countLoot();
    $(".lootContainer .label").append(" (" + $(".uniqueLoot").text() + " loots in " + $(".totalHunts").text() + " hunts)");
}

function render() {
    //If current page is main camp or journal
    var pageTitle = hg.utils.PageUtil.getCurrentPageTemplateType();
    if (pageTitle.includes("Camp") || pageTitle.includes("Journal") || pageTitle.includes("HunterProfile")) {
        countLoot();
    }
}

//If loot window is opened, append the total count into the sub-header.
$(document).ajaxSuccess(lootWindow);
$(document).ajaxStop(render);
$(document).ready(render);
