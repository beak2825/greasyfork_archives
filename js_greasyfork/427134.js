// ==UserScript==
// @name MAM Auto Pot Contribution
// @namespace yyyzzz999
// @author    yyyzzz999
// @description Donates to the Millionaire's vault once a day if you leave the tab open 7/13/22
// @match     https://www.myanonamouse.net/millionaires/donate.*
// @icon      https://cdn.myanonamouse.net/imagebucket/164109/mclubm.png
// @version 0.66
// @grant window.onurlchange
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427134/MAM%20Auto%20Pot%20Contribution.user.js
// @updateURL https://update.greasyfork.org/scripts/427134/MAM%20Auto%20Pot%20Contribution.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
/*eslint no-multi-spaces:0 */ //stop pestering me 'cause I learned to type with double spaces!

// https://davidwalsh.name/automatically-refresh-page-javascript-meta-tags
function auto_reload()
{
	window.location = 'https://www.myanonamouse.net/millionaires/donate.php'; // Reload near or at donate again time
}
let DEBUG =1; // Debugging mode on (1) or off (0)
if (DEBUG) console.log("MAM Auto Pot Contribution .65 loaded");
let headr = document.querySelector("div[class='blockHeadCon']");

// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
/* Date.prototype.addDays= function(d){
  this.setDate(this.getDate() + d);
  return this;
}; */

//from https://stackoverflow.com/questions/8583694/determine-minutes-until-midnight
  const now = new Date();
  var then = new Date(now);
  then.setUTCHours(23, 50, 0); //10 minutes before UTC midnight target time to run
  var ddiff = then - now;
  if (DEBUG) console.log("now: ", now," then: ",then, "then - now: ",ddiff );
  if (now.getTime() < then.getTime()) { //if we have to wait for our target time to run...
      //then.addDays(1);  //NOT NEEDED prototype function avoids leap year boundry conditions   Test running in evening when it is tomorrow UTC
	 // ddiff = then - now;
      if (DEBUG) { console.log("Reload at target time then");
      console.log("Starting at: ", now," Waiting until: ",then ); }
      headr.innerText = "Loaded at: " + now.toUTCString() + " -> Reloading at: " + then.toUTCString() + " or locally " + then.toLocaleString();
	  setTimeout(auto_reload,ddiff);
  } else  { // We are in target window
      if (DEBUG) console.log("Spending BP in the vault");
	  // Get the mouse Bonus Points
let bp = document.getElementById("tmBP").textContent.split(":")[1].trim(); //Should be current as we act seconds after page load
bp = bp.split(" ")[0]; // remove (+/- nnnn) from MAM+ if running
//let bp = document.getElementById("currentBonusPoints").textContent
if (DEBUG) console.log("Bonus Points: " + bp);
if (DEBUG) console.log(document.querySelector("tbody tr h2:nth-child(3)").textContent);
if(bp > 1999 && document.querySelector("tbody tr h2:nth-child(3)").textContent.includes("You can currently donate")   ){
// Read amount left to donate and calculate what we really need in next version..., add countdown display
// Problem if jQuery functions not yet loaded when DOM complete
    setTimeout(function(){
        if (DEBUG) console.log("Will Donate Points in 10 seconds.");
    }, 1000);  //
    setTimeout(function(){
    document.querySelector("input[name='submit']").dispatchEvent(new MouseEvent('click')); // Donate Points, aborts script if already donated as nothing matches query
    if (DEBUG) console.log("Clicked Donate Points");
	}, 11000);  //
}
then.setMilliseconds(now.getMilliseconds() + 900000);
headr.innerText = "Run at: " + now.toUTCString() + " or locally " + now.toLocaleString() +". Reloading at: " + then.toUTCString() + " (" + then.toLocaleString() + ")";
setTimeout(auto_reload,900000); //Reload in 15 minutes to calculate next day's window.
  }