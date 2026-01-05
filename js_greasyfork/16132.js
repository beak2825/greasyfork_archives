// ==UserScript==
// @name         [Ned] Book Warning Quick Remover
// @namespace    localhost
// @version      2.1
// @description  Book Warning Quick Clicker/Remover
// @author       Ned (Ned@Autoloop.com)
// @include      *autoloop.us/DMS/App/Schedule/Settings/Default.aspx*
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16132/%5BNed%5D%20Book%20Warning%20Quick%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/16132/%5BNed%5D%20Book%20Warning%20Quick%20Remover.meta.js
// ==/UserScript==

$('#ctl00_ctl00_ctl00_MasterPageBodyTag > div.barWrapper > div.notificationWarning.notificationMessage > div > a').click();
$('#MasterPageBodyTag > div.barWrapper > div.notificationWarning.notificationMessage > div > a').click();