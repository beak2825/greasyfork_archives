// ==UserScript==
// @name            collectTB-Codes
// @namespace       https://github.com/Confectrician/collect_tb_codes
// @author          Confectrician
// @description     Collect TB-Codes from TB Listing
// @include         https://www.geocaching.com/track/details.aspx*
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           unsafeWindow
// @version         2.03
// @downloadURL https://update.greasyfork.org/scripts/5442/collectTB-Codes.user.js
// @updateURL https://update.greasyfork.org/scripts/5442/collectTB-Codes.meta.js
// ==/UserScript==


var stored;
var tbcodes = [];
var codehash = [];


function clearCollection() {
  GM_setValue("tbcodeshashed","");
  TA = document.getElementById('gm_tb_ta');
  TA.innerHTML = "";
  alert("TB-Codes cleared");
}

// main()

GM_registerMenuCommand( "TB-Codes clear", clearCollection );

try {
	stored = GM_getValue("tbcodeshashed");
	//console.log("stored = " + stored);
	tbcodes = stored.split('|');
	//console.log("tbcodes = " + tbcodes);
	//console.log("tbcodes length = " + tbcodes.length);
    //alert("Stored " + tbcodes.length + " TB-Codes");
	for(var i=0 ; i < tbcodes.length ; i++)
	{
		codehash[tbcodes[i]]=i;
		//console.log("codehash["+tbcodes[i]+"] Nr. " + i  + " = " + codehash[tbcodes[i]]);
	}
}
catch (err){
}

try
{
	var GCElement = document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode');
	var GCCode    = GCElement.innerHTML;
	codehash[GCCode]=0;

	stored="";
	var i= 0;
	for (var st in codehash) {
	    //console.log("forschleife " + st + " " + i);
	    if(i++){
	        //console.log("ifbedingung true");
            stored = stored + '|';
        }
        stored = stored + st;    
  }
    output = stored;
	if(stored[stored.length -1] == ";"){
	    output = stored.substr(0,stored.length -1);
	}
	//console.log("stored length = " + stored.length);
	GM_setValue("tbcodeshashed",stored);
	var Element=document.getElementById('divContentSide');
	Element.innerHTML=Element.innerHTML + "<div style='width: 250px;'>" + tbcodes.length + ' TB-Codes Stored<br />(Refresh could be necessary)<br /><textarea id=\"gm_tb_ta\" cols=\'40\' rows=\'30\'>' + output.replace(/\|/gi,";") + '</textarea></div>';
    //.replace(/\|/gi,";")
}
catch (err){
}
