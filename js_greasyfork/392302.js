// ==UserScript==
// @name        SDissues
// @namespace   SDissues iframe
// @match       http://hd/WorkOrder.do*
// @grant       none
// @version     1.0
// @author      -
// @description 08.11.2019, 14:46:57
// @downloadURL https://update.greasyfork.org/scripts/392302/SDissues.user.js
// @updateURL https://update.greasyfork.org/scripts/392302/SDissues.meta.js
// ==/UserScript==
if (requesterID > 0) sharedNodata.innerHTML = '<iframe src="http://hd/ListRequests.do?id='+requesterID+'" width="100%" height="350px"></iframe>';