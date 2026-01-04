// ==UserScript==
// @name         ÖBA
// @namespace    oba
// @version      1.0
// @description  Emrah was here
// @author       EmRaH - ekaraman89@hotmail.com
// @match        https://www.oba.gov.tr/egitim/oynatma/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448250/%C3%96BA.user.js
// @updateURL https://update.greasyfork.org/scripts/448250/%C3%96BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
$( document ).ready(function() {
setInterval(function () {
	console.log('running');
	var link = $('.progress-check-icon').last().parent().parent().next().find('a')[0];
	var currentUrl = window.location.href;
	var videoUrl = $(link).prop('href')
	if(currentUrl == videoUrl)
	{

        var video = $('#video_html5_api')[0];
        console.log($($('#video_html5_api')[0]).prop('muted'));
        $($('#video_html5_api')[0]).prop('muted','muted')
         console.log($($('#video_html5_api')[0]).prop('muted'));
        if(video !=undefined)
           $('#video_html5_api')[0].play()
	}
	else{
		 $(link)[0].click()
	}

}, 1000);
});
})();