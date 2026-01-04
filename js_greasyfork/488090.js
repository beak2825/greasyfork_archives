// ==UserScript==
// @name         Gaia forum resizer
// @namespace    http://tampermonkey.net/
// @version      2024-02-23
// @description  Removes the minimum width on the forums, and also removes a lot of empty space.
// @author       Taggy
// @match        https://www.gaiaonline.com/forum/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gaiaonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488090/Gaia%20forum%20resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/488090/Gaia%20forum%20resizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.innerHTML = css;
        head.appendChild(style);
}
    addGlobalStyle(`

    html body, #gaia_content, #content, body #gaia_header, body #gaia_footer, #gaia_footer p {
		width: unset !important;
		min-width: unset !important;
    }
    .wskyscraper, #gaia_content .wskyscraper {visibility:hidden}
    #gaia_content.ss_2Columns_flexiLeft_wideRight #yui-main .yui-b {
        width: 100%;
    }
    .wskyscraper, #gaia_content .wskyscraper {
		width: 0px;
		height: 0px;
	}
    #gaia_content.ss_2Columns_flexiLeft_wideRight .yui-b {
		width: 0px;
		padding-right: 0px;
	}
    #gaia_content.ss_2Columns_flexiLeft_wideRight #yui-main .yui-b {
		width: unset !important;
		padding-left: unset !important;
		margin-right: unset !important;
	}
    #gaia_content.ss_2Columns_flexiLeft_wideRight .yui-b {
		padding-right: unset !important;
	}
    #gaia_header .header_content, .gu-ch-header_content, #gaia_header {
	    width: unset !important;
		min-width: unset !important;
    }
    #gaia_deals_newdeal, #gaia_deals {
    	left: unset !important;
		right: 0px;
	}
    #topic_header_container, #thread_header {
		margin-left: unset;
		margin-right: unset;
	}
    #topic_header_container .detail-navlinks, #gaia_content #hd .leaderboard  {
		height: unset;
    }
    `)
})();