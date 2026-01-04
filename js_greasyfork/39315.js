// ==UserScript==
// @name        Gamdom Rain Notifier
// @description WORKABLE SCRIPT, NO BAN RISK, NO MINER INSIDE. READ DESCRIPTION ON GREASYFORK.ORG
// @namespace   https://greasyfork.org/users/173937
// @version     1.11.0
// @author      Boris Britva
// @include     /^https:\/\/greasyfork\.org\/([a-z]{2}(\-[A-Z]{2})?\/)?scripts/39315(\-[^\/]+)$/
// @include     /^https:\/\/(www\.)?gamdom(rain)?\.com\/detector/.*$/
// @require     https://greasyfork.org/scripts/39350-gamdom-rain-notifier-library/code/Gamdom%20Rain%20Notifier%20Library.js?version=600414
// @require     https://greasyfork.org/scripts/39677-gamdom-rain-notifier-library-meow/code/Gamdom%20Rain%20Notifier%20Library%20Meow.js?version=259503
// @require     https://greasyfork.org/scripts/39689-gamdom-rain-notifier-library-update/code/Gamdom%20Rain%20Notifier%20Library%20Update.js?version=263408
// @require     https://greasyfork.org/scripts/40823-gamdom-rain-notifier-mimic/code/Gamdom%20Rain%20Notifier%20Mimic.js?version=265980
// @icon        https://gamdom.com/img/favicon.ico
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @grant       GM_info
// @grant       GM_getValue
// @grant       GM_setValue
// @connect     gamdomrain.com
// @connect     greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/39315/Gamdom%20Rain%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/39315/Gamdom%20Rain%20Notifier.meta.js
// ==/UserScript==

(function(){
	main();
})();