// ==UserScript==
// @name         DECIPHER - Preset SST Window
// @version      1.2
// @description  A few ease-of-use changes made to SST window
// @include      https://survey-*.dynata.com/admin/sst/*
// @include      https://survey-*.yoursurveynow.com/admin/sst/*
// @exclude      *:edit
// @exclude      *:xmledit
// @author       Scott
// @grant        none
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/446964/DECIPHER%20-%20Preset%20SST%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/446964/DECIPHER%20-%20Preset%20SST%20Window.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var scottTimer = setInterval(scottFunction,10);
	var jQuery = window.jQuery;		//Need for Tampermonkey or it raises warnings.
	var url = window.location.href;	//Get URL, to differentiate between main results window, and error window
    console.log(url);

function scottFunction() {
	if ($().jquery.length > 0) {		//Checks to make sure jQuery has been injected

		if (url.indexOf("path") >= 0)						//If "Main SST" URL
		{
			window.resizeTo(600, 850);						//Resize window to a good size
			console.log("MAIN WINDOW");

			jQuery(".toggleConfiguration").click();			//Opens configuration settings
			jQuery("#automatedRespondents").val('100');		//Set to 100 tests by default
			jQuery("#quotaIncDec").val('100x');				//Set to x100 quota values by default

			$("input").each(function(index) {				//Tick each of the four checkboxes
				$("input").eq(index).attr('checked', true); //
			});

			jQuery(".editSstText").height("350");			//Set height of SST rule box larger for easy typing
            clearInterval(scottTimer);						//Once jQuery loaded, stop checking to see if it's loaded
		}
        if (url.indexOf("attempt") >= 0)									//If "Error Details" SST URL
		{
			console.log("ERROR WINDOW");									//Clarity print
            $(".main").css({"margin-right":"50px", "margin-left":"50px"});	//Layout tweak
			$(".main").width("1200");										//Make window wider
            $("body > pre").removeAttr("style");							//Stick all code on one line
			window.resizeTo(990, 850);										//Make parent window wider




$( "body > pre" ).click(function() {
  console.log("LOADED");



            var tempHTML = "";
            tempHTML = $("body > pre").html().split("\n");
            for (let i = 0; i < tempHTML.length; i++) {
                console.log("i = " + i);
                if (tempHTML[i].substring(0,5).indexOf("=") >= 0) {
                    console.log("BEFORE tempHTML[i] = " + tempHTML[i]);
                    var beforeHighlight = tempHTML[i];
                    tempHTML[i] = "<span style='color: red'>" + beforeHighlight + "</span>\n"
                    console.log("AFTER tempHTML[i] = " + tempHTML[i]);
                }
               else {
                   tempHTML[i] = tempHTML[i] + "\n"
               }
            }
    $("body > pre").html(tempHTML);

});

            clearInterval(scottTimer);										//Once jQuery loaded, stop checking to see if it's loaded
		}

	}
}
})();