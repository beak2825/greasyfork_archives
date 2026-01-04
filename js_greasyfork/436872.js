// ==UserScript==
// @name         Thinner HIT Alerts
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Thinner HIT alerts. Removes footer.
// @author       lucassilvas1
// @match        http*://worker.mturk.com/projects/*/tasks/*?assignment_id=*
// @grant        GM_addStyle
// @run-at       document-start
// jshint        esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/436872/Thinner%20HIT%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/436872/Thinner%20HIT%20Alerts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle( `
		.mturk-alert {
			padding: 0 !important;
			margin: 0 !important;
		}

		.mturk-alert-icon {
			display: none !important;
		}

		.mturk-alert-content h3 {
			display: none !important;
		}

		.footer-horizontal-rule {
			display: none !important;
		}

		.work-pipeline-bottom-bar {
			display: none !important;
		}

		footer {
			display: none !important;
		}

		.m-b-md {
			margin-bottom: 0 !important;
}
	` );
})();