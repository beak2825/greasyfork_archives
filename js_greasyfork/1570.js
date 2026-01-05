// ==UserScript==
// @name        Dumpert Download
// @namespace   Dumpert Download
// @description Downloads dumpert videos
// @include     http://www.dumpert.nl/mediabase/*/*/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1570/Dumpert%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/1570/Dumpert%20Download.meta.js
// ==/UserScript==

if (typeof console == 'undefined') {
	window.console = {
		log: function () {}
	};
}

// script details/updates
var us_XXXXXX_Name = GM_info.script.name;
var us_XXXXXX_Version = GM_info.script.version;
function firstRun() {
	if ($.cookie('us_XXXXXX_name') == null) {
		//set cookies
		$.cookie('us_XXXXXX_name', us_XXXXXX_Name, {
			expires: 365,
			path: '/'
		});
		$.cookie('us_XXXXXX_version', us_XXXXXX_Version, {
			expires: 365,
			path: '/'
		});
		console.info('Hi, thanks for using userscript: ' + us_XXXXXX_Name + ' v' + us_XXXXXX_Version);
	}
}
function checkIfUpdated() {
	if ($.cookie('us_XXXXXX_version') != us_XXXXXX_Version) {
		//re-set cookies
		$.cookie('us_XXXXXX_name', us_XXXXXX_Name, {
			expires: 365,
			path: '/'
		});
		$.cookie('us_XXXXXX_version', us_XXXXXX_Version, {
			expires: 365,
			path: '/'
		});
		console.info('Userscript updated to version: ' + us_XXXXXX_Version);
		alert('Userscript ' + us_XXXXXX_Name + ' is updated. \n\n Thanks for updating.');
	}
}
function setActiveCookie() {
	// console.info('setActiveCookie()');
	if ($.cookie('us_XXXXXX_active') == null) {
		console.log('cookie us_XXXXXX_active not set');
		//set cookie
		$.cookie('us_XXXXXX_active', 'true', {
			path: '/'
		});
		// session
		console.log('cookie us_XXXXXX_active set to true');
	}
}

function cleanCrap() {
	$('section#glamorama').remove(); // f*ck roddelgingers
	$('section#dkheaders').remove(); // Das Kapital
	$('section#snheaders').remove(); // Spitsnieuws
	$('section#gsheaders').remove(); // GeenStijl
	$('#upcoming').remove();
	$('#themashighlight').remove();
}

function newDownloadButton(btnText, btnHref, btnContainer) {
    // console.info('function newDownloadButton');
	if (btnText == 'still') {
		btnText = 'screenshot';
	}
	$(btnContainer).prepend('<li>&nbsp;<a href="' + btnHref + '">' + btnText + '</a></li>');
}


function createDownloadLinks() {
	// console.info('function createDownloadLinks');

	// class="videoplayer" id="video1" data-files="**base64encodingshit**"
	// data-files attribute on div#video1 / div.videoplay not available after rendering
	// so we'll retrieve the original HTML file again and get the data we want

	var currItemUrl = $("link[rel='canonical']").attr("href");

	$('section#comments').load(currItemUrl + ' #video1', function (response, status, xhr) {
		var dataFiles = $(response).find("#video1").data("files");
		if (typeof dataFiles !== 'undefined') {
			// create download link section
			$('.dump-desc').append('<div class="dump-tags"><span>Download:</span><ul id="downloadLinks"></ul></div>');
			dataFiles = window.atob(dataFiles);
			var dataObj = jQuery.parseJSON(dataFiles);  
			for (var prop in dataObj) {
				if (dataObj.hasOwnProperty(prop)) {
					//console.log(prop + ": " + dataObj[prop]);
					// add download button for each object property
					newDownloadButton(prop, dataObj[prop], '#downloadLinks');
				}
			}
            
            $('#downloadLinks').append('<li>&nbsp;<small>(rechter muisklik > opslaan als)</small></li>');
            
		} else {
			console.log('nothing found to download, probably not a video');
		}
	});
}

$(function () {
	console.log('userscript loaded: Dumpert Download');
	firstRun();
	checkIfUpdated();
	setActiveCookie();
	createDownloadLinks();
	cleanCrap();
});

$(window).load(function () {
	//setTimeout(function(){ getItemData(); }, 5000);    
});