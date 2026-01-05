// ==UserScript==
// @name             Yahoo Fantasy Football Rank
// @author           Bijan
// @version          2019.0
// @description      Very simple script to conveniently see how many points a team gives up
// @namespace        http://albuyeh.com
// @match            *://football.fantasysports.yahoo.com/*
// @require          http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require          https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @grant            GM_xmlhttpRequest
// @grant            GM_getValue
// @grant            GM_setValue
// @icon             http://albuyeh.com/FF/Icon.png
// @downloadURL https://update.greasyfork.org/scripts/12189/Yahoo%20Fantasy%20Football%20Rank.user.js
// @updateURL https://update.greasyfork.org/scripts/12189/Yahoo%20Fantasy%20Football%20Rank.meta.js
// ==/UserScript==



//Display notification of Update
var ver = GM_info.script.version;
console.log("Starting Yahoo Fantasy Football Rank v" + ver);
if (parseFloat(GM_getValue("version", "")) < parseFloat(ver)) {
    GM_setValue("version", ver);
    alert("Updated Yahoo Fantasy Football Rank by Bijan to version v" + ver + "\n2018 stats will be available after Week 1");
}

waitForKeyElements ("a.Inline", delinkChangeStat);
waitForKeyElements ("a.F-reset", win_loss);

function delinkChangeStat (jNode) {
    var rawText = jNode.attr ("title") || "";
    var deltaText   = "";
    var mtchResult  = null;


    //-- Like "gives up the 3rd most"
    if (mtchResult  = rawText.match (/gives up the (\d+)[a-t]{2} most/i) ) {
        deltaText   = mtchResult[1];
    }
    //-- Like "gives up the 2nd fewest points"
    else if (mtchResult = rawText.match (/gives up the (\d+)[a-t]{2} fewest/i) ) {
        deltaText   = 33 - parseInt (mtchResult[1], 10);
    }
	//-- "Gives up the most points"
    else if (mtchResult = rawText.match (/gives up the most/i) ) {
        deltaText   = 1;
    }
	//-- "Gives up the fewest points"
    else if (mtchResult = rawText.match (/gives up the fewest/i) ) {
        deltaText   = 32;
    }

    //-- Change the link
	var noDup = isNaN(jNode.text().charAt(0)) && isNaN(jNode.text().charAt(jNode.text().length-1));
	if (deltaText && noDup) {
		jNode.text (jNode.text () + " - " + deltaText);

		var deltaVal = parseInt (deltaText, 10);

		if ( (1 <= deltaVal)  &&  (deltaVal <= 10) )
			jNode.removeClass ("F-link-secondary").addClass ("F-rank-good");
		else if ( (11 <= deltaVal) && (deltaVal <= 22) )
			jNode.removeClass ("F-link-secondary").addClass ("F-rank-neutral");
		else if ( (23 <= deltaVal) && (deltaVal <= 32) )
			jNode.removeClass ("F-link-secondary").addClass ("F-rank-bad");
	}
}

function win_loss(jNode) {
	if(jNode.html().indexOf("Final (L)") != -1) {
		jNode.html(jNode.html().replace("Final (L)","<span class='F-rank-bad'>Final (L)</span>"));
	}
	else if(jNode.html().indexOf("Final (W)") != -1) {
		jNode.html(jNode.html().replace("Final (W)","<span class='F-rank-good'>Final (W)</span>"));
	}
}

// That's it!
