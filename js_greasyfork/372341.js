// ==UserScript==
// @name    		Creative Cow Message Skipper
// @description		Skips the 'click here to skip this sponsored message' page on CreativeCow.net
// @namespace		iamMG
// @license			MIT
// @version			1.0
// @match			https://www.creativecow.net/interstitial.php*
// @author			iamMG
// @run-at			document-start
// @grant			none
// @copyright		2018, iamMG (https://openuserjs.org/users/iamMG)
// @downloadURL https://update.greasyfork.org/scripts/372341/Creative%20Cow%20Message%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/372341/Creative%20Cow%20Message%20Skipper.meta.js
// ==/UserScript==

window.location.replace(location.search.replace(/%3A/g, ':').replace(/%2F/g, '/').replace(/%3F/g, '?').replace(/%3D/g, '=').replace(/%26/g, '&').replace(/%3A/g, ':').replace('&id=0', '').replace('?url=', ''));