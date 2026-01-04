// ==UserScript==
// @name        Redirect to AllTabs
// @namespace   http://domain.com/directory
// @version   1.0.1
// @description Redirect the initial salesforces pages to AllTabs Page!
// @include     https://*.my.salesforce.com/home/home.jsp*
// @include     https://*.lightning.force.com/lightning/page/home
// @include     https://*.lightning.force.com/lightning/setup/SetupOneHome/home
// @include     https://*.my.salesforce.com/_ui/system/security/ChangePassword*
// @downloadURL https://update.greasyfork.org/scripts/389192/Redirect%20to%20AllTabs.user.js
// @updateURL https://update.greasyfork.org/scripts/389192/Redirect%20to%20AllTabs.meta.js
// ==/UserScript==
document.location.href = "/ltng/switcher?destination=classic";
document.location.href = "/home/showAllTabs.jsp";