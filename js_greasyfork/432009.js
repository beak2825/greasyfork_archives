// ==UserScript==
// @name        Upwork: Hide jobs with hires
// @namespace   https://www.stardecimal.com/
// @version     1
// @description Hide the jobs where someone has already been hired
// @author      lifeweaver
// @grant       none
// @include     https://www.upwork.com/ab/jobs/search/*
// @downloadURL https://update.greasyfork.org/scripts/432009/Upwork%3A%20Hide%20jobs%20with%20hires.user.js
// @updateURL https://update.greasyfork.org/scripts/432009/Upwork%3A%20Hide%20jobs%20with%20hires.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function (_undefined) {
  
	// ===================================================================
	// Tried of clicking on the jobs with hires already?
  //
	// Script style and some functions from YouTube: Hide Watched Videos - https://github.com/EvHaus/youtube-hide-watched

	// ====================================================================

	// Enable for debugging
	const __DEV__ = false;

	const logDebug = (msg) => {
		// eslint-disable-next-line no-console
		if (__DEV__) console.log(msg);
	};

	// ===========================================================

	const debounce = function (func, wait, immediate) {
		let timeout;
		return (...args) => {
			const later = () => {
				timeout = null;
				if (!immediate) func.apply(this, args);
			};
			const callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(this, args);
		};
	};
  
  // ===========================================================
  
  // There is probably some normal way to get these, but I don't know how so...
  const getCookie = function (name) {
      var value = '';
      document.cookie.split(';').forEach(function(item, index) {
          if(item.includes(name)) {
              value = item.split('=').pop()
          }
      });
      return value;
  }
  
  // ===========================================================

  // Called after getting the details for each job
  const reqListener = function () {
      var jobDetails = JSON.parse(this.responseText);
      logDebug('[UW-JHH] totalHired: ', jobDetails.job.clientActivity.totalHired);
      if(jobDetails.job.clientActivity.totalHired > 0) {
          //Drop the first one
          var responseUrlArray = this.responseURL.split('/');
          responseUrlArray.pop()

          //JobId is the second to last
          var jobId = responseUrlArray.pop();

          document.querySelector('a[href*="' + jobId + '"]').closest('section').remove();
      }
  }

  // ===========================================================
  
  const lookForJobs = function () {
    document.querySelectorAll('.job-title-link').forEach(function(item, index) {
        var jobId = item.href.split('_').pop();
        jobId = jobId.slice(0, jobId.length -1);
        var detailsUrl = "https://www.upwork.com/job-details/jobdetails/api/job/" + jobId + "/summary";

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", reqListener);
        xhr.open("GET", detailsUrl);
        xhr.setRequestHeader('Authorization', "Bearer " + getCookie('oauth2_global_js_token'));
        xhr.setRequestHeader('X-Odesk-Csrf-Token', getCookie('XSRF-TOKEN'));
        xhr.setRequestHeader('x-odesk-user-agent', 'oDesk LM');
        xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
        xhr.send();
    });
  }
  
	const run = debounce((mutations) => {
		logDebug('[UW-JHH] Running check for jobs with hires');
		lookForJobs();
	}, 250);

	// ===========================================================
  
	const observeDOM = (function () {
		const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		const eventListenerSupported = window.addEventListener;

		return function (obj, callback) {
			logDebug('[UW-JHH] Attaching DOM listener');

			// Invalid `obj` given
			if (!obj) return;

			if (MutationObserver) {
				const obs = new MutationObserver(((mutations, _observer) => {
					if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
						// eslint-disable-next-line callback-return
						callback(mutations);
					}
				}));

				obs.observe(obj, {childList: true, subtree: true});
			} else if (eventListenerSupported) {
				obj.addEventListener('DOMNodeInserted', callback, false);
				obj.addEventListener('DOMNodeRemoved', callback, false);
			}
		};
	}());

  
	logDebug('[UW-JHH] Starting Script');
  
	// Listen for ANY DOM change event, and re-run the script.
	observeDOM(document.body, run);
  
  // Initial run
  run();
  
}());