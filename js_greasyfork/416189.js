// ==UserScript==
// @name MAM Ratio Protect
// @namespace yyyzzz999
// @author yyyzzz999
// @description 7/16/22  Warns about downloading based on resulting Ratio Loss due to forgetting to buy w/FL
// @match https://www.myanonamouse.net/t/*
// @version 2.11
// @license MIT
// @supportURL https://greasyfork.org/en/scripts/416189-mam-ratio-protect/feedback
// @icon https://cdn.myanonamouse.net/imagebucket/164109/greenclock.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/416189/MAM%20Ratio%20Protect.user.js
// @updateURL https://update.greasyfork.org/scripts/416189/MAM%20Ratio%20Protect.meta.js
// ==/UserScript==
// Many Thanks to GardenShade, yyywwwyyyhhh, sora12192, Onigiri & ooglyboogly for advice, testing, and code contributions!
// Thanks to all the members who've sent me bug reports like ridel, stuartnz, souljackeruk, and more.
/*jshint esversion: 6 */
/*eslint no-multi-spaces:0 */
//stop pestering me 'cause I learned to type with double spaces!
/*eslint curly: ["error", "multi-line"]*/ // Don't nag about missing {} after if's that do only one thing.
// Release downloadURL:  https://greasyfork.org/en/scripts/416189-mam-ratio-protect

//let xhr;
let rcRow; //Used in body and functions

//let tHash = ""; //Hexcode hash for this torrent

let DEBUG =1; // Debugging mode on (1) or off (0) added in (v1.54) verbose (2) (v1.6), 3 pretend ratio= v2.02 not finished, 4 short table of ratio numbers
let CICON =1; // Custom Favorite icons is ON by default, change this to 0 to keep the default icon on all tabs
let NORATIO = 0; // Will test for new mice later v2.04

if (DEBUG) console.log("Welcome to MAM Ratio Protect v2.11!");

/* Easter Egg bonus features, uncomment to use! */
//Hide banner on book pages if not using MAM+
//document.getElementById("msb").style.display = "none";

//Re-title tab to make it easier to find a book tab! v1.66
document.title=document.title.replace('Details for torrent "', '');
document.title=document.title.replace('" |', ' |'); // v1.98 lop loose unmatched quote
//This makes Bookmark titles easier to read as well!
// See also: https://greasyfork.org/en/scripts/418820-mam-user-page-re-title
// and https://greasyfork.org/en/scripts/418992-mam-request-page-re-title
// and https://greasyfork.org/en/scripts/417852-mam-site-store-fix
// and https://greasyfork.org/en/scripts/441976-mam-banner-shrink

/* End Easter Eggs */

// Functions:

//https://blog.abelotech.com/posts/number-currency-formatting-javascript/
function comma(num) { // add commas to a number
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function formatBytes(a,b=2){if(0===a)return"0 Bytes";
		const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));
		return parseFloat((a/Math.pow(1024,d)).toFixed(c))+" "+["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}

/** hacked from MAM+ 4.2.20 Line 222
    Always inserted line at beginning or end of page block until removed parentElement before insertAdjacentHTML
     * Add a new TorDetRow and return the inner div
     * @param tar The row to be targetted
     * @param label The name to be displayed for the new row
     * @param rowClass The row's classname (should start with mp_)
     */
     function myaddTorDetailsRow(tar, label, rowClass) {
        if (tar == null ) {  //why originally === assignment?
            throw new Error(`myAdd Tor Details Row: empty node @ ${tar}`);
        }
        else {
            tar.insertAdjacentHTML('beforebegin', // changed from afterbegin so I can position before .torDetBottom as nth child changes w/MAM+
			// and Torrent: ratio line has no id or unique CSS
			`<div class="torDetRow" id="Mrp_row"><div class="torDetLeft">${label}</div><div class="torDetRight ${rowClass}"><span id="mp_foobar"></span></div></div>`);
            return document.querySelector(`.${rowClass} #mp_foobar`);
        }
}

/*
https://stackoverflow.com/questions/629671/how-can-i-intercept-xmlhttprequests-from-a-greasemonkey-script
	Spy on all AJAX request/response to see when FL is purchased
	This works in Basilisk Scratchpad, Tampermonkey w/Firefox, but not Greasmonkey 3.9 in Basilisk
	Problem: it also looks at our own AJAX request so we return early if we see the user data object
*/

let ResultObj; // I scoped this out of the XMLHttpRequest.prototype.open function in case I want to reference it later in other contexts/functions
// This is where we react after FL purchase
(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
        if (DEBUG >2) console.log(this.readyState);
		if (DEBUG >2) console.log(this.responseText);
			if (this.readyState == 4 && this.status == 200) {
				ResultObj = JSON.parse(this.responseText);
				if ( ResultObj.uid ) return; //if getting user data in this script w/ fetch('/jsonLoad.php')
				if (DEBUG >1) console.log("Response: " + this.responseText);
				if (DEBUG) console.log("xhr status: " + ResultObj.success);
				if (ResultObj.success && ResultObj.type == "personal FL") { // Return download button etc. to normal after FL purchase (v1.6)
					// bookmark operations return {"success": true, "action": "add"} Specific FL test in v1.63!
					dlBtn.innerHTML = "Download";
					dlBtn.style.backgroundColor="dodgerblue";
                    dlBtn.style.color="white";         // V1.9 restore white text color showing button active again
                    dlBtn.style.pointerEvents = 'auto' //NEW in V1.9 restore DL link
                    if (CICON) favi("5");  // Purple means FL purchased, but not yet downloading or seeding //v1.99 noticed lost on reload!!!
					//document.getElementById("Mrp_row").style.visibility = "hidden"; //Wastes space
                    document.getElementById("Mrp_row").style.display = "none"; //Restore w/ "block"
					if (DEBUG) console.log("Seedbonus: " + ResultObj.seedbonus);
					if( document.getElementById("tmFW") && ResultObj.FLleft) {// If FL Wedges: are displayed in top menu & we have new value so update it
					document.getElementById("tmFW").textContent=ResultObj.textContent="FL Wedges: "  + ResultObj.FLleft; }
					// Why doesn't MAM already do this?
					document.querySelector("#download .torDetInnerTop").innerHTML = ""; //Clear ratio loss //v2.10 bug in Brave browser: Uncaught ReferenceError: dlLabel is not defined
                    // v2.03 will add the FL purchased to tracking history


				}
			}
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

// Function to change the FAVICON to one matching a filename fn
function favi(fn,un) { // fn=filename, un=usernumber
    un = un || 164109; // if no user number is specified, use yyyzzz999's icons
    for (let i = 0; i < links.length; i++) { // v1.97 Works in Chrome now.  Shotgun approach to avoid browser detection?
        links[i].href = 'https://cdn.myanonamouse.net/imagebucket/' + un + '/' + fn + '.png';
        //TODO: Add some debug code or alert for invalid image urls
        //https://stackoverflow.com/questions/18837735/check-if-image-exists-on-server-using-javascript
        //Maybe add a third argument which is an index to a list of fallback URL un,fn pairs?
    }

// was:    link.href = 'https://cdn.myanonamouse.net/imagebucket/' + un + '/' + fn + '.png' ;
// was:   link.href = 'https://cdn.myanonamouse.net/imagebucket/164109/' + fn + '.png' ;

/*  Many filenames are simply the CGA color number 1-15 (low blue to white)
    https://en.wikipedia.org/wiki/Web_colors
    Site security requires the favicon to be hosted on MAM.
    Use: https://www.myanonamouse.net/bitbucket-upload.php
    to store your own custom icons 32x32 or 16x16 if you prefer.
    This function assumes all images are png, but that should be easy to convert to.
    If the URL for your icon is something like:
    https://cdn.myanonamouse.net/imagebucket/123456/MyIcon.png';
    call this function like:
    favi("MyIcon","123456");
*/
}

// https://www.w3docs.com/snippets/javascript/how-to-add-days-to-javascript-date.html
Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function nextFLstr(){
const d = new Date("Jun 14, 2022 00:00:00 UTC" ); // seed date over two weeks ago
const now = new Date(); //Place test dates here like Date("Jul 14, 2022 00:00:00 UTC")
let mssince = now.getTime() - d.getTime(); //time since FL start seed date
let dayssince = mssince/86400000;
let q = Math.floor(dayssince/14); // FL periods since seed date
if (DEBUG) console.log("days since 6/14/22 = " + dayssince);
if (DEBUG) console.log("FL periods q since 6/14/22 = " + q);
return d.addDays((q*14)+14).toISOString().substr(0, 10);
}
if (DEBUG >2) console.log("nextFLstr()= " + nextFLstr());

// MAIN PROGRAM ######

// Set up for custom Favicons, and load a simple default.  Link global variable set up once, then used in favi()
if (CICON) { // If changing icons is set to TRUE or 1 etc.
    var links = document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']"); // v1.97 apple-touch v2.07

/*     var link = document.querySelector("link[rel~='icon']");  // Only worked in Firefox, Chrome needed the "shortcut icon" link changed instead
    if (!link) {  // NOT Needed on MAM, there are four different icon href links, so I'm not going to bother checking for none at all.
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.id = "favicon";
*/
favi("tm_32x32"); //Simple black mouse w/transparent background
// link.style.transform = "rotate(180deg)"; Doesn't work

/* Source icons for the MAM mouse:
    https://www.shareicon.net/data/512x512/2016/01/06/699292_mouse_512x512.png
    https://cdn.myanonamouse.net/safari-pinned-tab.svg
*/
}
/*
// v2.0? Testing local tracking of purchase with FL over time. ########
const d = new Date();  // Now
let StartDayStr = d.toUTCString();
let FLused = 0;
// GM_deleteValue("FL"); Used to start over for debugging init...
let FLhist = GM_getValue("FL");
if ( FLhist == undefined ) { // Initialize local tracking string "Start Date UTC -num_purchases"
   FLhist = StartDayStr + "-0" ; // The final tracking string will have 5 - 8 values, and use a different delimiter
    GM_setValue("FL",FLhist);
   if (DEBUG ) console.log("Set FLhist= " + FLhist);
} else {  // use values retrieved
   StartDayStr = FLhist.split("-")[0];
   FLused = FLhist.split("-")[1];
  if (DEBUG ) console.log("Got FLhist= " + FLhist +"\nStartdayStr= " + StartDayStr +" FLused= " + FLused );
}
if ( FLused > 0) { // let's just watch this in the console a bit before deciding how to use...
    // https://www.javatpoint.com/calculate-days-between-two-dates-in-javascript
    let StartDay = new Date(StartDayStr);
    var time_difference = d.getTime() - StartDay.getTime();
    var days_difference = time_difference / (1000 * 60 * 60 * 24);
    if (DEBUG ) console.log("In " + days_difference +" days MAM Ratio Protect has observed " + FLused + " FL wedge(s) used to buy torrents.");
}
*/

// The download text area

// let dlBtn = document.getElementById("tddl");
// crashed on "TE2: No valid torrent specified" e.g. 739730
// Error: "Uncaught (in promise) TypeError: document.getElementById(...) is null"
let dlBtn = document.querySelector("#tddl"); //Why does this work when getElementById gets all huffy about null?
if (DEBUG >2) console.log("dlBtn= " + dlBtn);
if (dlBtn == null) { // No download button should only happen when the torrent has been deleted, but if another reason shows up use the next test:
   // if (document.querySelector("td[class='text']").textContent.search("No valid torrent") > -1)
   favi("mousetrash");
} else {  // Proceed with grabbing the numbers we need for ratio calculations

// The unused label area above the download text
let dlLabel = document.querySelector("#download .torDetInnerTop");

// Would become ratio
   let rnew = 0; // FALSE
if (document.getElementById("ratio").textContent.split(" ")[1].match(/become/) ) {
    rnew = document.getElementById("ratio").textContent.split(" ")[2].replace(/,/g,""); // (v1.54)
    // VIP expires date caused rdiff to be NaN in v1.53 bcause text crept in in v1.52
	}
if (DEBUG) console.log("rnew= " + rnew);
if (rnew) rnew = rnew.replace(/[A-z]/g,""); // (v.1.71) to address no space before "This can't be made site FL due to no author set" t/73005 //v1.92 added if, replace doesn't work on 0
//let rnew = document.getElementById("ratio").textContent.split("become ")[1].replace(/,/g,""); // broke w/On list for next FL pick
//let rnew = document.getElementById("ratio").textContent.match(/\d*\,?\d+\.\d+/)[0].replace(/,/g,"''); //breaks at 1,000,000bp
if (DEBUG) console.log("After trim rnew= " + rnew); // For debugging
// Current ratio - Version 1.52 and earlier broke when a ratio has a comma
let rcur = document.getElementById("tmR").textContent.replace(/,/g,"").trim();
// rcur = "Infinite or NaN"; // Simulate new mouse for testing NORATIO v2.05
if (rcur.match("Inf") == "Inf")  NORATIO = 1;
//if (DEBUG =3) rcur = prompt("See calculations based on pretend ratio:").replace(/,/g,"").trim(); //v2.02
    // Need to add code to calculate new rnew based on ratio and size before this would be useful
if (DEBUG) console.log("rcur= " + rcur ); // For debugging

const vipstat = document.querySelector("#ratio .torDetInnerBottomSpan").textContent;
if (DEBUG && vipstat) console.log("vipstat= " + vipstat);  // v1.99
// VIP status is in the div with class=torDetInnerBottomSpan in another div with id=ratio
if (CICON && (vipstat.search("VIP expires") > -1 || vipstat.search("torrent is freeleech") > -1 ) )
   {favi("mouseclock");}
if (vipstat.search("VIP expires") > -1) { // copy date to title v1.97
       document.title=document.title.replace(' | My Anonamouse', ' | E' + vipstat.substr(19, 18)); // Removed quote so still works in v1.98
       // Add the expiration date to the tab title so it shows up on mouseover!
}
if (vipstat.search("VIP not set to expire") > -1) {
    favi("0cir");
    document.title=document.title.replace(' | My Anonamouse', " | not set to expire"); //v1.99
}
if (vipstat.search("This torrent is freeleech!") > -1) {
      document.title=document.title.replace(' | My Anonamouse', " | 'till " + nextFLstr()); //v1.99 TODO calculate date
}
// Seeding or downloading TRUE if "Actively Seeding" etc.
// let seeding = document.getElementById('DLhistory');
let seeding = document.querySelector("#DLhistory"); //v1.99 Avoid "Uncaught (in promise) TypeError...
if (seeding !== null) {
if (DEBUG) console.log("seeding= " + seeding);
if (seeding && DEBUG) console.log("seeding.textContent= " + seeding.textContent);     //v1.92 object was not useful in console
if (seeding && CICON) favi("13egg"); // Similar icons: 13seed8, 13seed7, 13egg, 13, 13cir, 13WhiteCir
} else  if (CICON && vipstat.search("This torrent is a personal freeleech") > -1 ) {
    favi("5"); //v1.99 Was only set before on AJAX change
    document.title=document.title.replace(' | My Anonamouse', ' | ' + vipstat.substr(17, 19));
}
else if (DEBUG) { console.log("seeding is null ");}
let bookclub = document.querySelector("div[id='bcfl'] span"); //v1.99 Test for Bookclub and show expire in title for mouse over
if (bookclub !== null) {
if (DEBUG ) console.log("bookclub= " + bookclub);
if (CICON && (bookclub.textContent.search("Bookclub Freeleech") > -1)) { //icon already set as "This torrent is freeleech!" in Ratio box
   document.title=document.title.replace(' | My Anonamouse', ' | ' + bookclub.textContent.substr(19, 18));
   }
} else if (DEBUG) { console.log("bookclub is null ");}

// Available FL wedges - for future use... (>v1.6)
// Only visible if set on MAM in Preferences, Style, Main Menu, Top Menu
//let wedgeAvail = document.getElementById('tmFW').textContent.split(":")[1].trim(); //only works if added to top menu
// Probably more robust way of finding current FL, so use if avail.
//if(wedgeAvail) console.log("tm wedgeAvail= " + wedgeAvail);
// ELSE try finding in drop downs with Rel XPath //a[contains(text(),'FL Wedges: ')] or
// CSS ul:nth-child(1) li.mmUserStats ul.hidden:nth-child(2) li:nth-child(7) > a:nth-child(1)
// let wedgeAvail = document.querySelector('[aria-labelledby="userMenu"] li:nth-of-type(7)').textContent.split(':')[1].trim();
// or document.querySelector("ul:nth-child(1) li.mmUserStats ul.hidden:nth-child(2) li:nth-child(7) > a:nth-child(1)")


// Only run the ratio loss code if the new ratio exists and we found the current one
if(rnew && rcur && !seeding &&!NORATIO ){ // Need to skip this whole section for correct icon colors, should have in the 1st place
//    let rdiff = 0;

    let rdiff = rcur-rnew; // Loss in ratio after download (if error in old browser use var instead of let)
    if (DEBUG) {console.log("rdiff= " + rdiff); // To see how far the script is progressing as well as the values
                console.log("rdiff.toFixed(4)= " + rdiff.toFixed(4));
    }
    if (seeding == null ) { // if NOT already seeding, downloading or VIP expires (v1.54)
    dlLabel.innerHTML = `Ratio loss ${rdiff.toFixed(4)}`; //changed from toPrecision(5) (v1.54)
    if (rdiff > 99 ) dlLabel.innerHTML = `LOSS ${rdiff.toFixed(3)}`; // Large collections showed blank! v2.02
    dlLabel.style.fontWeight = "normal"; //To distinguish from BOLD Titles

	// Add line under Torrent: detail for Cost data "Cost to Restore Ratio"
	rcRow = myaddTorDetailsRow(document.querySelector("div[class='torDetBottom']"), 'Cost to Restore Ratio', 'mp_rcRow');
	if (DEBUG) console.log("rcRow.innerHTML= " + rcRow.innerHTML);

	// Create button that will load data and insert calculations (and slow ajax calls to server)
	//rcRow.innerHTML = '<button id="Mrp_btn">View Calculations</button>';
	//document.getElementById("Mrp_btn").addEventListener("click", fetchUD);

	// Always show calculations when there is a ratio loss
	// Calculate & Display cost of download w/o FL
			let x=document.querySelector("div[id='size'] span").textContent.split(/\s+/); //Why didn't split(" ") work?
			if (DEBUG) console.log("x = " + x + ", x[0]= " + x[0] + ", x[1]= " + x[1] );
			const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];  // V1.9 MAM changed KB to KiB etc. Spring 2022
      // I want to be around when we start sharing TB+ collections! ;-)
			let tsize = x[0].replace(/,/g,"") * Math.pow(1024, sizes.indexOf(x[1])); //Remove commas in V1.9 (only 323984 seemed to need this)
			// Convert human notation to bytes, only used once so didn't make it a function
			if (DEBUG) console.log("tsize = " + tsize);
			//let recovU = (data.uploaded*(data.downloaded+tsize))/data.downloaded - data.uploaded;
            //let recovU2 = tsize*data.uploaded/data.downloaded; //  yyywwwyyyhhh proposed change
            let recovU = tsize*rcur;
            if (DEBUG) { let rloss = rcur/tsize; //v2.03 for what if calculations
                console.log("rloss = " + rloss );
                console.log("1/rloss = " + 1/rloss );
                let WBecome = rcur - rloss;
                console.log("WBecome = " + WBecome );
            }
            if (DEBUG) console.log("recovU = " + recovU ); // 125/268435456 is the LCD of 500bp/100GiB byte cost, or ~4.656612873077E-7 bp/byte
            let BP = comma(Math.floor(125*recovU/268435456)); // v1.99 save BP amount to add to title
                  rcRow.innerHTML = "<b>" + formatBytes(recovU) + "</b>&nbsp; Uploaded Needed to Restore Current Ratio.<br><b>" +
                  BP + "</b> Bonus Points to purchase. " +
                  "That's enough Bonus Points to obtain approximately <b>one FL wedge per day for " + comma(Math.floor(5*recovU/2147483648)) + "</b> days." ;
                     //"<br>" +   "Contributing 2000 bonus points to each vault gives you on average almost one FL wedge per day.";
        if (vipstat.search("On list for next FL pick") <= -1) { document.title=document.title.replace(' | My Anonamouse', ' | ' + BP +' BP cost' );} //v1.99
        rcRow.innerHTML += "<br>The use a FL file size for your ratio is: <b>" + formatBytes(268435456*200/(rcur*125)) +"</b> based on a 200 bonus point average FL cost when you contribute to each vault."; //v2.03
        rcRow.innerHTML += "<br>The use a FL file size for your ratio is: <b>" + formatBytes(268435456*50000/(rcur*125)) +"</b> based on a single 50,000 bonus point FL cost from the store.";
        rcRow.innerHTML += '<br> <a href="/f/t/60213/p/p731190#731190">Please see post #731190 for a table showing how these numbers change at other ratios.</a>'; //v2.05
        if (DEBUG>3) { //v2.04
        rcRow.innerHTML += "<br>The break even file size for a ratio of 50000 is: <b>" + formatBytes(268435456*50000/(50000*125)) +"</b> based on a single 50,000 bonus point FL cost from the store.";
        rcRow.innerHTML += "<br>The break even file size for a ratio of 10000 is: <b>" + formatBytes(268435456*50000/(10000*125)) +"</b> based on a single 50,000 bonus point FL cost from the store.";
        rcRow.innerHTML += "<br>The break even file size for a ratio of 1000 is: <b>" + formatBytes(268435456*50000/(1000*125)) +"</b> based on a single 50,000 bonus point FL cost from the store.";
        rcRow.innerHTML += "<br>The break even file size for a ratio of 100 is: <b>" + formatBytes(268435456*50000/(100*125)) +"</b> based on a single 50,000 bonus point FL cost from the store.";
        rcRow.innerHTML += "<br>The break even file size for a ratio of  10 is: <b>" + formatBytes(268435456*50000/(10*125)) +"</b> based on a single 50,000 bonus point FL cost from the store.";
        rcRow.innerHTML += "<br>The break even file size for a ratio of  2 is: <b>" + formatBytes(268435456*50000/(2*125)) +"</b> based on a single 50,000 bonus point FL cost from the store.";
        }
        // v1.99 show calculations only with verbose debugging
            if (DEBUG >1) { rcRow.innerHTML += "<br>Calculations based on ratio= " + rcur +
            ", approximately " + comma(Math.floor(recovU)) + " future upload bytes, and a download size of " + comma(tsize) + " bytes.";}
  }

    if (CICON && rdiff <= 0.5) favi("DodgerBlue");

    // Change this .3 number to your "trivial ratio loss" amount
    // These changes will always happen if the ratio conditions are met
    if(rdiff > 0.3){
        dlBtn.style.backgroundColor="SpringGreen";
        dlBtn.style.color="black";
        dlBtn.innerHTML = "Download?"; //v1.99
        if (CICON) favi("SpringGreen"); //
    }

    // Change this 2 number to your I never want to dl w/o FL ratio loss amount
    if(rdiff > 2 || rnew < 2){  //v1.99 some additional protection for new mice
        dlBtn.style.backgroundColor="Red";
        if (CICON) favi("12");

// Disable link to prevent download
        dlBtn.style.pointerEvents="none";
//	Comment (add // to) the above line to not disable the download button when RED V1.9 new default
        // maybe hide the button, and add the Ratio Loss warning in its place?  Nah!
        dlBtn.innerHTML = "FL Needed";
        dlLabel.style.fontWeight = "bold";

    // Change this .6 number to your "I need to think about using a FL ratio loss" amount
    }else if(rdiff > .6){
        dlBtn.style.backgroundColor="Orange";
        dlBtn.innerHTML = "Suggest FL";
        if (CICON) favi("3Qmouse"); // Also try Orange, OrangeRed, Gold, or 14 for bright CGA Yellow
    }
} // rnew && rcur && !seeding (we have a ratio loss)
if(NORATIO ){
	rcRow = myaddTorDetailsRow(document.querySelector("div[class='torDetBottom']"), 'Ratio Protect Info:', 'mp_rcRow');
    rcRow.innerHTML= "Ratio calculations and bonus point cost to restore ratio will appear here after your ratio is real number.";
	if (DEBUG) console.log("rcRow.innerHTML= " + rcRow.innerHTML);
}
// if (seeding && CICON) favi("13");  color got changed back in debugging, reording checks seemed to fix
if (CICON && (vipstat.search("On list for next FL pick") > -1)) {
    favi("MirrorGreenClock"); // use "greenclock" if you want all mice facing left
    document.title=document.title.replace(' | My Anonamouse', ' | get ' + nextFLstr()  );
    }
} // dlBtn == null else (we have a download button)

if (DEBUG) console.log("MAM Ratio Protect v2.11 Completed Normally.");
