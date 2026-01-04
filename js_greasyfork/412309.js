// ==UserScript==
// @name         Subeta: Auto Slots
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1.1
// @description  This script automatically plays Slots for you. It keeps a record of how much money you have spent and any wins you get. You may add a 1 - 2 second delay between clicks.
// @author       AyBeCee
// @match        https://subeta.net/games/slots.php
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/412309/Subeta%3A%20Auto%20Slots.user.js
// @updateURL https://update.greasyfork.org/scripts/412309/Subeta%3A%20Auto%20Slots.meta.js
// ==/UserScript==

Notification.requestPermission();

var moneySpentKey;
var moneySpent = GM_getValue('moneySpentKey',0);

var winsKey;
var wins = GM_getValue('winsKey',0);

var startKey;
var start = GM_getValue('startKey',0);

var delayKey;
var delay = GM_getValue('delayKey',0);

$(`.container-fluid center`).prepend(`
<div style="padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3; display: inline-block; margin-left: 25px; background: #e3e3e3;">
<div style="font-size: 20px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;color:red;">Auto Slots Script</div>
<button id="stopScript">Stop script</button>
<button id="startScript">Start script</button>
<button id="clearHist">Clear history</button>
<button id="addDelay">Add delay</button>
<button id="noDelay">Remove delay</button>
<br>
<br>
<p id="addDelayText">There is currently a <b>1 - 2 second delay</b> between clicks.</p>
<p id="noDelayText">There is currently <b>no delay</b> between clicks.</p>

<b>Money spent:</b> ${moneySpent}
<br>
<div id="clearWins"><b>Wins:</b>${wins}</div>
</div>
<br><br>
<style>
#clearWins {
text-align:left;
}
</style>
`);


// clear history button
$("#clearHist").click(function(){
    GM_setValue('moneySpentKey',0);
    GM_setValue('winsKey'," ");
    $(`#clearWins`).hide();
});
$("#stopScript").click(function(){
    GM_setValue('startKey',false);
    $("#stopScript").hide();
    $("#startScript").show();

});
$("#startScript").click(function(){
    GM_setValue('startKey',true);
    $("#startScript").hide();
    $("#stopScript").show();
    window.location.href = "https://subeta.net/games/slots.php";
});
$("#addDelay").click(function(){
    GM_setValue('delayKey',true);
});
$("#noDelay").click(function(){
    GM_setValue('delayKey',false);
});

var wait;
if ( delay == true ) {
    $("#addDelay").hide();
    $("#noDelay").show();

    $("#addDelayText").show();
    $("#noDelayText").hide();

    wait = Math.floor(Math.random() * 1001) + 1000 ;
} else {
    $("#noDelay").hide();
    $("#addDelay").show();

    $("#addDelayText").hide();
    $("#noDelayText").show();

    wait = 0;
}

if ( start == true ) {
    $("#startScript").hide();
    $("#stopScript").show();
    setTimeout(function () {
        if (    $(`h1:contains("ackpot")`).length > 0 ) {

        }
       else if (    $(`h1:contains("You've lost, unfortunately.")`).length > 0 ) {
            moneySpent += 50;
            GM_setValue('moneySpentKey',moneySpent);
            $('input.btn.btn-primary[type="submit"][value="Spin again!"]').click();
        }
        else if  (    $(`h1:contains("Winner winner, chicken dinner!")`).length > 0 ) {
            var menuTime = $('#menu-time').text()

            var winprize = $(`h1:contains("Winner winner, chicken dinner!")`).next().next().text();
            wins += `<br><i>${menuTime}:</i> ${winprize}`;
            GM_setValue('winsKey',wins);

            moneySpent += 50;
            GM_setValue('moneySpentKey',moneySpent);
            $('input.btn.btn-primary[type="submit"][value="Spin again!"]').click();
        }
        else if ( $('input.btn.btn-primary[type="submit"][value="Have a spin!"]').length > 0 ) {

            $('input.btn.btn-primary[type="submit"][value="Have a spin!"]').click();
        } else if ( $(`body:contains("Oops, you have too many items in your")`).length > 0 ) {
            new Notification(`Too many items in Inventory`);
        }

    }, wait);
} else {
    $("#stopScript").hide();
    $("#startScript").show();
}
