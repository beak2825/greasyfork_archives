// ==UserScript==
// @name           BvS Arena Hotkeys
// @namespace      Ren Po Ken
// @description    Press (H) for the complete list of hotkeys.  Adds hotkeys for rebuyable Arena Rewards, as well as (F)ight and (P)urchase keys.  Also displays Win Percentages for Today and Overall.  Update (8/21/11): Added Chrome compatibility
// @include        http*://*animecubed.com/billy/bvs/arena.html
// @include        http*://*animecubedgaming.com/billy/bvs/arena.html
// @version        1.9
// @history        1.9 Added a key to buy three sets of fights at once (3) and a key to jump to the mini-coliseum (c). Also tinkered with the Today %: so that it no longer displays N/A before you do your fights (it instead displays '0%') - Ren Po Ken
// @history        1.8 Added variable "precision" which sets the number of decimal places your win percentages display. Also tightened up a lot of the syntax so my editor stops yelling at me - Ren Po Ken
// @history        1.7 New domain - animecubedgaming.com - Channel28
// @history        1.6 Now https compatible (Updated by Channel28)
// @history        1.5 Chrome compatibility added
// @history        1.2 Added new Arena Rewards to Hotkeys
// @history        1.0 Initial Release
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/4303/BvS%20Arena%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/4303/BvS%20Arena%20Hotkeys.meta.js
// ==/UserScript==

var precision=4;      //Change this to set the number of decimal places in your win percentages
function megaarena()   {
   var confirm = document.evaluate("//input [@name='megaarena']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   var toConfirm = confirm.snapshotItem(0);
   toConfirm.setAttribute("checked", "checked"); //check the confirm checkbox
   location.assign('javascript:document.forms.namedItem("arenafight").submit()');
   }

function megabuy()   {
    var confirm = document.evaluate("//input [@name='buyfights']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   var toConfirm = confirm.snapshotItem(1);   //There is also a hidden 'buyfights' input
   toConfirm.setAttribute("checked", "checked"); //check the confirm checkbox
   location.assign('javascript:document.forms.namedItem("buytfights").submit()');
   }

function process_event(event) {
   var rewards = document.forms.namedItem("buyreward").elements;
   var   rewardCode = -1;
   switch (event.keyCode) {
      case 32: case 70: case 13:                        //Space Bar, f, Enter
      location.assign('javascript:document.forms.namedItem("arenafight").submit()');   break;   //Attack other Ninja
      case 80:                              //p
      location.assign('javascript:document.forms.namedItem("buyfights").submit()');   break;   //Purchase Fights
        case 51:                              //3
        megabuy();                              break;   //Purchase 3 sets of Fights
        case 67:                              //c
        location.assign('javascript:document.forms.namedItem("minicoli").submit()'); break; //Enter Minicoli
      case 81:                              //q
      megaarena();                           break;   //Use all fights at once
      case 87:                              //w
      rewardCode = 16;                        break;   //Warrior's High RC
      case 65:                              //a
      rewardCode = 17;                        break;   //Arena Coupon RC
      case 84:                              //t
      rewardCode = 19;                        break;   //Trail Mix RC
      case 73:                              //i
      rewardCode = 20;                        break;   //MegaTrail Mix RC
      case 82:                              //r
      rewardCode = 22;                        break;   //Roll of Tickets RC
      case 79:                              //o
      rewardCode = 23;                        break;   //Monochrome Pheremone RC
      case 69:                              //e
      rewardCode = 24;                        break;   //Make-Out Mood Enhancer RC
      case 77:                              //m
      rewardCode = 200;                        break;   //Contract RC
      case 78:                              //n
      rewardCode = 201;                        break;   //Contract x11 RC
      case 72:                              //h --- Begin Help Menu Text ---
      var helpMenu = "H: This Help Menu\
\nW: Warrior's High\
\nA: Arena Coupon\
\nT: Trail Mix\
\nI: MegaTrail Mix\
\nR: Roll of Tickets\
\nO: Monochrome Pheromone\
\nE: Make-Out Mood Enhancer\
\nM: Major Village Contract\
\nN: Major Village Contract (Qty: 11)\
\nP: Purchase Fights\
\n3: Purchase Fights (Qty: 3 sets)\
\nQ: Quick Attack (Uses all your arena fight at once)\
\nC: mini-Coliseum\
\n\
\nF or Space Bar or Enter: Attack other ninja\
\n\
\nThis Grease Monkey script was written by Ren Po Ken\nUpdated: 11/07/19";
alert(helpMenu);                              break;   // --- End Help Menu Text ---*/
   }

   if (rewardCode != -1) {
      for(var i=0; i<rewards.length; i++){
         if(rewards[i].value==rewardCode)
            {rewards[i].setAttribute("checked", "checked");
            break;}}

      if(rewards[i].disabled == false)
             {location.assign('javascript:document.forms.namedItem("buyreward").submit()');}
   }
}

var fightsT = document.evaluate("//td[contains (., 'Fights today:')]/b", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var fightsTN=fightsT.snapshotItem(0).innerHTML;

var winsT = document.evaluate("//td[contains (., 'Wins today:')]/b", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var winsTN= winsT.snapshotItem(0).innerHTML;

var winsO = document.evaluate("//tr[contains (., 'overall:')]/td[2]/b", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var winsON= winsO.snapshotItem(0).innerHTML;

var fightsO = document.evaluate("//tr[contains (., 'overall:')]/td[1]/b", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var fightsON = fightsO.snapshotItem(0).innerHTML;

var percentT = Math.round(winsTN/fightsTN*Math.pow(10, (precision+2)))/Math.pow(10, precision)
var percentO = Math.round(winsON/fightsON*Math.pow(10, (precision+2)))/Math.pow(10, precision)

if (fightsTN==0) {percentT=0;}                  //Avoids N/A being the Today's %:

var newRow = document.createElement('tr');         //Creates the new Row
var newtd1 = document.createElement('td');         //Creates the 1st new cell
newtd1.innerHTML = "Today's %: <b>"+percentT+"%</b>";
var newtd2 = document.createElement('td');         //Creates the 2nd new cell
newtd2.innerHTML = "Overall %: <b>"+percentO+"%</b>";
newtd2.align = "right";               //Aligns the cell Right

newRow.appendChild(newtd1);                                    //Inserts the new Cells into the new Row
newRow.appendChild(newtd2);

var overallRowHTML = document.evaluate("//td[contains (., 'overall:')]/b/../..", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var overallRow = overallRowHTML.snapshotItem(0);
overallRow.parentNode.insertBefore(newRow, overallRow.nestSibling);

window.addEventListener("keyup", process_event, false);