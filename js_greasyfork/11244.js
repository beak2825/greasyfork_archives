// ==UserScript==
// @name        WaniKani Real Numbers
// @namespace   Mempo.scripts
// @author      Mempo
// @description Replaces 42+ with the real number using WaniKani API
// @include     http://www.wanikani.com/*
// @include     https://www.wanikani.com/*
// @version     6
// @grant       none
// @run-at    document-end
// @downloadURL https://update.greasyfork.org/scripts/11244/WaniKani%20Real%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/11244/WaniKani%20Real%20Numbers.meta.js
// ==/UserScript==

// NOTE:
// Script written by seanblue
// I'm just the maintainer

(function($) {
	'use strict';

	var wkData = window.WaniKani;
	if (!wkData || !wkData.studyInformation) {
		return;
	}

	var studyData = wkData.studyInformation.requested_information;

	if (!studyData) {
		return;
	}

	var lessonsEl = $('.lessons span');
	var reviewsEl = $('.reviews span');

	if (lessonsEl.length === 0 || reviewsEl.length === 0) {
		return;
	}

	lessonsEl.text(studyData.lessons_available);
	reviewsEl.text(studyData.reviews_available);

})(window.jQuery);