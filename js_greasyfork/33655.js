// ==UserScript==
// @name          Jira Uncheck bulk edit emailer
// @namespace     randomecho.com
// @description   Uncheck the "Send mail for this update" on the Jira Bulk Edit screen.
// @include       https://*.atlassian.net/secure/views/bulkedit/BulkEditDetails.jspa
// @include       */secure/views/bulkedit/BulkEditDetails.jspa
// @grant         none
// @copyright     2017 Soon Van
// @author        Soon Van - randomecho.com
// @license       http://opensource.org/licenses/BSD-3-Clause
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/33655/Jira%20Uncheck%20bulk%20edit%20emailer.user.js
// @updateURL https://update.greasyfork.org/scripts/33655/Jira%20Uncheck%20bulk%20edit%20emailer.meta.js
// ==/UserScript==

var sendBulkEmail = document.getElementById('sendBulkNotificationCB');
sendBulkEmail.checked = false;
