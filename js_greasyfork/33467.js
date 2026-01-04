// ==UserScript==
// @name         eBonus.gg reCAPTCHA
// @namespace    TheGoldGames
// @version      0.3
// @description  Automate reCAPTCHA on eBonus.gg
// @author       TheGoldGames
// @include      *://ebonus.gg*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/33467/eBonusgg%20reCAPTCHA.user.js
// @updateURL https://update.greasyfork.org/scripts/33467/eBonusgg%20reCAPTCHA.meta.js
// ==/UserScript==

/*$().ready(function () {
	$('iframe[title="recaptcha challenge"]').ready(function () { //The function below executes once the iframe has finished loading
		// get the window with the challenge
		var iFrameTitle = $('iframe[title="recaptcha challenge"]').attr("name");
		
		var iframeWindow = frames[iFrameTitle].document;
		// get the image that we want to classify
		var result = iframeWindow.evaluate('//div[@class="rc-image-tile-wrapper"]/img', iframeWindow);
		alert(result.iterateNext());
	});
});*/



// this function adds jquery
function addJquery(){
	var jq = document.createElement('script');
	jq.src = "//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
	document.getElementsByTagName('head')[0].appendChild(jq);
	// ... give time for script to load, then type.
	//jQuery.noConflict();
}


// this function clicks the I'm not a robot button
function notRobot() {
	$('#recaptcha-anchor', $('iframe[title="recaptcha widget"]').contents()).click()
}


// get the window with the challenge
function recognize() {
	var iframeWindow = $('iframe[title="recaptcha challenge"]')[0].contentWindow.document;
	// get the url of the image that we want to classify
	var result = iframeWindow.evaluate('//div[@class="rc-image-tile-wrapper"]/img', iframeWindow);
	var imageUrl = result.iterateNext().getAttribute("src");
	
	// get the parameters
	var getUrlParameter = function getUrlParameter(url, sParam) {
	  var sPageURL = decodeURIComponent(url),
		  sURLVariables = sPageURL.split(/\?|&/),
		  sParameterName,
		  i;
	  for (i = 0; i < sURLVariables.length; i++) {
		  sParameterName = sURLVariables[i].split('=');
		  if (sParameterName[0] === sParam) {
			  return sParameterName[1] === undefined ? true : sParameterName[1];
		  }
	  }
	};
	var c = getUrlParameter(imageUrl, "c")
	var k = getUrlParameter(imageUrl, "k")
	var u = imageUrl.split("?")[0]
	
	var imageTableWindows = iframeWindow.evaluate('//table[@class="rc-imageselect-table-3"]/tbody/tr/td', iframeWindow);
	list = [];
	while ((attribute = imageTableWindows.iterateNext())) {
		list.push(attribute);
		// Note: can't call removeAttributeNode here: 
		// InvalidStateError: Failed to execute 'iterateNext' on 'XPathResult': The document has mutated since the result was returned.
	}
	
	var descriptionTextIterator = iframeWindow.evaluate('//div[@class="rc-imageselect-desc-wrapper"]/div/strong', iframeWindow);
	var descriptionText = descriptionTextIterator.iterateNext().innerText;
	
	$.ajax({
	  url: "https://captchas.htfs.de/solve/captchas.php?t=" + descriptionText + "&u=" + u + "&c=" + c + "&k=" + k,
	}).done(function( data ) {
		if (data.match("^Error detecting image")) {
		   alert( data );
		}
		else {
			var jsonData = jQuery.parseJSON( data );
			var text = "";
			jsonData.forEach(function(obj) {
				var piece = obj.piece;
				text += "Image " + (piece + 1) + ": ";
				if(obj.isCorrectImage) {
					text += "Correct!\nThe image was identified as " + obj.correctClass + ".";
					list[piece].click();
				}
				else {
					text += "Wrong!";
				}
				text += "\n\nAll Classes:\n-------------";
				obj.allClasses.forEach(function(entry) {
					text += "\n-" + entry;
				});
				text += "\n\n==========================\n\n";
			});
			//alert( text );
			console.log(text);
		}
	});
}


addJquery();
setTimeout(notRobot, 1000);
//setTimeout(recognize(1), 6000);
setTimeout(function() {recognize();}, 4000);



/*
	for (i = 0; i <= numberOfImages-1; ++i) {
		setTimeout(function(i) {
			$.ajax({
			  url: "https://captchas.htfs.de/solve/captchas.php?piece=" + i + "&t=" + descriptionText + "&u=" + u + "&c=" + c + "&k=" + k,
			}).done(function( data ) {
				if (data.match("^Error detecting image")) {
				   alert( data );
				}
				else {
					var obj = jQuery.parseJSON( data );
					var piece = obj.piece;
					var text = "Image " + (piece + 1) + "\n\n";
					if(obj.isCorrectImage) {
						text += "Correct!\nThe image was identified as " + obj.correctClass + ".";
						list[piece].click();
					}
					else {
						text += "Wrong!";
					}
					text += "\n\nAll Classes:\n-------------";
						obj.allClasses.forEach(function(entry) {
						text += "\n-" + entry;
						});
					alert( text );
				}
			});
		},i*250,i)
	}
*/


/*/ click the submit button
var submitButtonIterator = iframeWindow.evaluate('//div[@id="recaptcha-verify-button"]', iframeWindow);
//var submitButton = submitButtonIterator.snapshotItem(0);
//$('#', $('iframe[title="recaptcha challenge"]').contents()).click()
var submitButton = submitButtonIterator.iterateNext();
// create a mouse click event
var event = document.createEvent( 'MouseEvents' );
event.initMouseEvent( 'click', true, true, frames[iFrameTitle], 1, 0, 0 );
// send click to element
submitButton.dispatchEvent( event );
var event = $.Event('click');
event.clientX = 100;
event.clientY = 50;
image.trigger(event);*/