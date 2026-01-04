// ==UserScript==
// @name			TTS Reader Extension
// @namespace		https://github.com/Amourspirit/TTS-Reader-Extension
// @version			0.3.0
// @description		Cleans up https://ttsreader.com tts app for cleaner experience
// @run-at			document-end
// @match			http://ttsreader.com/
// @match			https://ttsreader.com/
// @match			http://ttsreader.com/online-reader/
// @match			https://ttsreader.com/online-reader/
// @grant			none
// @noframes
// @license			MIT
// @homepageURL     https://github.com/Amourspirit/TTS-Reader-Extension
// @update			https://github.com/Amourspirit/TTS-Reader-Extension/raw/master/TTS_Reader_Extension.user.js
// @contributionURL https://github.com/Amourspirit/TTS-Reader-Extension/
// @downloadURL https://update.greasyfork.org/scripts/36110/TTS%20Reader%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/36110/TTS%20Reader%20Extension.meta.js
// ==/UserScript==
(function() {
    'use strict';

	document.getElementById('app_ad_banner_right').style.display = 'none';
	document.getElementById('app_ad_banner_left').style.display = 'none';
	document.getElementById('app_container').style.position = 'static';
	document.getElementById('goPremiumBtn').style.display = 'none';

	setUiNotFullScreen();

	var appC = document.getElementById('app_container');
	appC.style.right = '0px';
	appC.style.left = '0px';
	appC.style.width = '100%';

	var appP = document.getElementById('app_panel');
	appP.style.top = '70px';

	$('#fullScreenBtn').off('click');
	$("#fullScreenBtn").on("click", function () {
		toggleFullScreen();
	});
	if (!isPremium()) {
		// localStorage.setItem("isPremium","true");
		$('.ad').hide();
		if (document.getElementById('removeAdsBtn')) {
			document.getElementById('removeAdsBtn').style.display = "none";
		}
		$('#app_panel').css('top', '67px');
		$('#app_panel').css('bottom', '0');
	}
	if ($('#helpBtn').length) {
		$('#helpBtn').off('click');
		$('#helpBtn').on('click', function () {
			if (isFullScreen) {
				toggleFullScreen();
			}
			invokeHelpDialog();
		});
	}

	function setUiNotFullScreen() {
		var app = $('#application');
		app.css('background-image', "url('../img/app/desk.jpeg')");
		app.css('background-size', "cover");
		app.css('height', "700px");
		app.css('width', "100%");
		app.css('max-height', "80vh");
		app.css('max-width', "100%");
		app.css('padding','0px');
		app.css('margin', '0px');
		app.css('left', '0px');
		app.css('right', '0px');
	}

	function toggleFullScreen() {
		var app = document.getElementById("application");
		if (!isFullScreen) {
			var reqF = app.requestFullScreen || app.webkitRequestFullScreen || app.mozRequestFullScreen || app.msRequestFullscreen;
			reqF.call(app);
			$(app).css('background', "white");
			$(app).css('height', "100vh");
			$(app).css('width', "100vh");
			$(app).css('max-height', "100vh");
		} else {
			var reqE = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen ;
			reqE.call(document);
			setUiNotFullScreen();
		}
		isFullScreen = !isFullScreen;
	}
})();
