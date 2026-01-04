// ==UserScript==
// @name         Filehippo Auto Press Download Latest Version Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Advance Filehippo Download Latest Version
// @author       ajaybnl
// @match        https://filehippo.com/download_*/
// @exclude      https://filehippo.com/download_*/post_download/
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/411290/Filehippo%20Auto%20Press%20Download%20Latest%20Version%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/411290/Filehippo%20Auto%20Press%20Download%20Latest%20Version%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = new URL(document.URL); // Get the current URL
    //alert(url + "post_download/");
    window.location.href = url + "post_download/";
    // fuck adfly
})();