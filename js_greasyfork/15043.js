// ==UserScript==
// @name          WME Validator Visiblity Toggle
// @version       0.0.8
// @namespace     https://greasyfork.org/en/users/5920-rickzabel
// @description	  Validator Visiblity Toggle
// @author        rickzabel
// @homepage      https://greasyfork.org/en/scripts/13733-wme-maximized-basic-rickzabel-edits
// @include       https://www.waze.com/*
// @include       https://wiki.waze.com/*
// @include       https://editor-beta.waze.com/*     
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/15043/WME%20Validator%20Visiblity%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/15043/WME%20Validator%20Visiblity%20Toggle.meta.js
// ==/UserScript==
(function() {
	function begin() {
		if (typeof($) === 'function') {
			var g = "";
			$("#user-details").prepend('<a id="Vjerk"></a> <a id="VjerkUserProfile"></a>');
			$("head").append($('<style id="VjerkCSS" type="text/css">' + g + '</style>'));
			$("head").append($('<style id="VjerkUserProfileCSS" type="text/css">' + g + '</style>'));

			//hide validator on load
			var Vjerk = localStorage.getItem('Vjerk');
			//console.log("ValidatorToggle: CheckVjerk " + Vjerk);
			if (Vjerk == "1") {
				$('#Vjerk').html("Show Validator");
				g = '.c2821834348 {display: none !important;padding-top: 20px !important;} ';
			} else {
				$('#Vjerk').html("Hide Validator");
				g = '.c2821834348 {display: block !important;padding-top: 20px !important;} ';
			}

			//hide me on load
			var VjerkUserProfile = localStorage.getItem('VjerkUserProfile');
			//console.log("ValidatorToggle: CheckVjerk " + VjerkUserProfile);
			if (VjerkUserProfile == "1") {
				$('#VjerkUserProfile').html("Show Profile");
				g = '.user-profile {display: none !important;padding-top: 20px !important;} ';
			} else {
				$('#VjerkUserProfile').html("Hide Profile");
				g = '.user-profile {display: block !important;padding-top: 20px !important;} ';
			}

			//hide validator on click			
			$('#Vjerk').click(function() {
				var Vjerk = localStorage.getItem('Vjerk');
				if (Vjerk == "1") {
					$("#VjerkCSS").html('.c2821834348 {display: none !important;padding-top: 20px !important;}');
					$('#Vjerk').html("Show Validator");
					$(localStorage.setItem('Vjerk', '0'));
				} else {
					$("#VjerkCSS").html('.c2821834348 {display: block !important;padding-top: 20px !important;}');
					$('#Vjerk').html("Hide Validator");
					$(localStorage.setItem('Vjerk', '1'));
				}
				//console.log("ValidatorToggle: Switch Clicked " + Vjerk);
			});

			//hide me on click
			$('#VjerkUserProfile').click(function() {
				var VjerkUserProfile = localStorage.getItem('VjerkUserProfile');
				if (VjerkUserProfile == "1") {
					$("#VjerkUserProfileCSS").html('.user-profile {display: none !important;padding-top: 20px !important;}');
					$('#VjerkUserProfile').html("Show Profile");
					$(localStorage.setItem('VjerkUserProfile', '0'));
				} else {
					$("#VjerkUserProfileCSS").html('.user-profile {display: block !important;padding-top: 20px !important;}');
					$('#VjerkUserProfile').html("Hide Profile");
					$(localStorage.setItem('VjerkUserProfile', '1'));
				}
				//console.log("ValidatorToggle: Switch Clicked " + VjerkUserProfile);
			});
			window.window.setInterval(CheckVjerk, 1000);
		} else {
			window.setTimeout(begin, 400);
		}
	}

	function CheckVjerk() {
		var Vjerk = localStorage.getItem('Vjerk');
		//console.log("ValidatorToggle: CheckVjerk " + Vjerk);
		if (Vjerk == "0" || Vjerk === null) {
			$("#VjerkCSS").html('.c2821834348 {display: block !important;padding-top: 20px !important;}');
			$('#Vjerk').html("Hide Validator");
		} else if (Vjerk == "1") {
			$("#VjerkCSS").html('.c2821834348 {display: none !important;padding-top: 20px !important;}');
			$('#Vjerk').html("Show Validator");
		}

		var VjerkUserProfile = localStorage.getItem('VjerkUserProfile');
		//console.log("ValidatorToggle: Check VjerkUserProfile " + VjerkUserProfile);
		if (VjerkUserProfile == "0" || VjerkUserProfile === null) {
			$("#VjerkUserProfileCSS").html('.user-profile {display: block !important;padding-top: 20px !important;}');
			$('#VjerkUserProfile').html("Hide Profile");
		} else if (VjerkUserProfile == "1") {
			$("#VjerkUserProfileCSS").html('.user-profile {display: none !important;padding-top: 20px !important;}');
			$('#VjerkUserProfile').html("Show Profile");
		}
	}
	window.setTimeout(begin, 4000);
})();