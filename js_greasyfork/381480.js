// ==UserScript==
// @name 			YouTube Podcast Web
// @version         1.0
// @author			Sergio Zhuk
// @description 	Convert a shared link to a useful one for a web browser.
// @include 		*www.google.com/podcasts?*
// @run-at 			document-start
// @namespace https://greasyfork.org/users/289963
// @downloadURL https://update.greasyfork.org/scripts/381480/YouTube%20Podcast%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/381480/YouTube%20Podcast%20Web.meta.js
// ==/UserScript==

window.location.href = window.location.href.replace("/podcasts?", "/?").replace("www.", "podcasts.")