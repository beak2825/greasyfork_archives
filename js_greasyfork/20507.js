// ==UserScript==
// @name        Slight Style Enhancer for Presse.com
// @namespace   MegaByteSSEPresse
// @description Enhances the styling on diePresse.com slightly
// @include     http*://*diepresse.com/*
// @run-at      document-start
// @version     4.1
// @grant    	GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/20507/Slight%20Style%20Enhancer%20for%20Pressecom.user.js
// @updateURL https://update.greasyfork.org/scripts/20507/Slight%20Style%20Enhancer%20for%20Pressecom.meta.js
// ==/UserScript==

	GM_addStyle(
		"#wrapper {									    \
			float: none !important;						\
			margin: auto !important;					\
		}                                               \
		#navi.sticky {									\
			right: unset !important;					\
			left: unset !important;					    \
		}								\
		#articlefeatv2 {									\
			right: unset !important;					\
			left: unset !important;					    \
		}									\
		#network {									\
			right: 0 !important;					\
			left: 0 !important;					    \
			margin: auto !important;					\
		}"								
	);