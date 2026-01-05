// ==UserScript==
// @name         [Ned] Hide Dealers Name
// @namespace    localhost
// @version      2.1
// @description  Hide Dealers Name
// @author       Ned (Ned@AutoLoop.com
// @match        *autoloop.us/DMS*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16401/%5BNed%5D%20Hide%20Dealers%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/16401/%5BNed%5D%20Hide%20Dealers%20Name.meta.js
// ==/UserScript==

$('#ctl00_ctl00_ctl00_Main_AppMast_lnkCompanySelector > span').hide(); //Hide Header
$('#divLegal').hide(); //Hide Footer