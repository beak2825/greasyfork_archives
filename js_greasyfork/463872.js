// ==UserScript==
// @name         HLTV Full Width
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fill the screen width on HLTV
// @author       Fergobirck
// @match        https://www.hltv.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hltv.org
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463872/HLTV%20Full%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/463872/HLTV%20Full%20Width.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
		.bgPadding {
		  min-height: calc(100vh - 100px);
		  max-width: 100%;
		  margin: 0 auto;
		  background-color: #1b1f23;
		  padding: 10px 0 16px;
		  position: relative;
		}
	` );

    GM_addStyle ( `
		.widthControl {
          max-width: 100%;
		  margin: 0 auto;
		  z-index: 1;
		  position: relative;
		}
	` );

})();