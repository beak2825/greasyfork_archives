// ==UserScript==
// @name     Digworm.io redirect with adblock
// @namespace    StephenP
// @version      1.0
// @description  Open DigWorm.io redirect links even if you have an adblocker.
// @author       StephenP
// @match        https://digworm.io/verify?redirect_to=*
// @run-at   document-start
// @license     AGPL-3.0-or-later
// @contributionURL https://nowpayments.io/donation/stephenpgreasyfork
// @downloadURL https://update.greasyfork.org/scripts/452342/Digwormio%20redirect%20with%20adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/452342/Digwormio%20redirect%20with%20adblock.meta.js
// ==/UserScript==
document.location.href=window.atob(document.location.href.split("=")[1]);