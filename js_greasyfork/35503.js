// ==UserScript==
// @name         Mangaupdates Genre search pre-chooser
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pre-selects the options you always choose in the genresearch at mangaupdates.com (once you've defined them here)
// @author       JAndyP
// @include        https://www.mangaupdates.com/series/advanced-search
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35503/Mangaupdates%20Genre%20search%20pre-chooser.user.js
// @updateURL https://update.greasyfork.org/scripts/35503/Mangaupdates%20Genre%20search%20pre-chooser.meta.js
// ==/UserScript==

(function() {
    'use strict';

	//Options START
		//Genres (separated by commas) (see below for spelling)
			//Genres you always want
	    	var incl = ["Romance"];
	    	//Genres you never want
    		var excl = ["Hentai", "Doujinshi", "Shoujo Ai", "Shounen Ai", "Yuri", "Yaoi", "Tragedy", "Mecha"];
    	//Choices
    		//License Options: 0 (ignore), 1 (only licensed), 2 (only unlicensed)
    		var licensed = 0;
    		//Extended Options: 0 (all), 1 (scanlated), 2 (completed), 3 (oneshots), 4 (no oneshots), 5 (some_releases), 6 (no releases), 7 (scanlated, no releases), 8 (completed, no releases), 9 (completed, incl oneshots, no releases)
    		var extended = 1;
    		//Type: use the part of the text in quotes (like 'Artbook' in 'Only show results for "Artbook"') to select it per default. Otherwise it's left at the default "all types"
    		var mtype = '';
    		//List Options (only available when logged in): 0 (all), 1 (none), 2 (reading), 3 (wish), 4 (complete), 5 (unfinished), 6 (on hold), 7 (custom)
    		var mlist = 1;
			//Show Results:
			var as_list = false;
    	//New Tab/Window
    	var newtab = true;
    	//How long the script should wait between simulated clicks (setting these variables to 100 and 10 respectively means it waits randomly between 100ms and 110 ms, or 0.10s and 0.11s)
        var min_wait = 100 // Minimum wait time (1000 = 1s)
        var wait_variation = 10 // Maximum random amount of time to add to wait time
    //Options END
	if (newtab)
		document.querySelector("#mu-main form").target = "_blank";

    run(incl,excl, licensed, extended, mtype,mlist, as_list);

})();
async function run(incl,excl,licensed,extended,mtype,mlist,as_list,min_wait,wait_var) {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    document.querySelector("#licensed-"+licensed).click();
        await sleep(min_wait+wait_var*Math.random());
	document.querySelector("#filter-"+extended).click();
        await sleep(min_wait+wait_var*Math.random());
	document.querySelector("input[name='Type'][value='"+mtype+"']").click();
        await sleep(min_wait+wait_var*Math.random());
	try {
		document.querySelector("#list-"+mlist).click();
        await sleep(min_wait+wait_var*Math.random());
	}
	catch(e) {}
	if (as_list)
		document.querySelector("#display-1").click();
    else
        document.querySelector("#display-0").click();
    await sleep(min_wait+wait_var*Math.random());

	var genre_divs = document.querySelectorAll(".text.col-6.p-1");
    var incl_boxes = {};
	var excl_boxes = {};
	for (var i=0; i<genre_divs.length; i++) {
		var name = genre_divs[i].innerText.trim();
		var boxes = genre_divs[i].querySelectorAll("input");
		incl_boxes[name] = boxes[0];
		excl_boxes[name] = boxes[1];
	}

	for (var j=0;j<incl.length;j++)
	{
        if (!incl_boxes[incl[j]].checked) {
            incl_boxes[incl[j]].click();
            await sleep(min_wait+wait_var*Math.random());
        }
	}

	for (var k=0;k<excl.length;k++)
	{
        if (!excl_boxes[excl[k]].checked) {
            excl_boxes[excl[k]].click();
            await sleep(min_wait+wait_var*Math.random());
        }
	}
}