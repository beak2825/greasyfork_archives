// ==UserScript==
// @name         EmuParadise Download Workaround - 1.1.2
// @version      1.1.2
// @description  Replaces the download button link with a working one
// @author       Zypther
// @match        https://www.emuparadise.me/*/*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// @namespace https://greasyfork.org/users/47450
// @downloadURL https://update.greasyfork.org/scripts/375948/EmuParadise%20Download%20Workaround%20-%20112.user.js
// @updateURL https://update.greasyfork.org/scripts/375948/EmuParadise%20Download%20Workaround%20-%20112.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var id = ((document.URL).split("/"))[5];
    $(".download-link").prepend(`<a target="_blank" href="/roms/get-download.php?gid=`+id+`&test=true" title="Download using the workaround script">Download using the workaround script</a><br><br>`);
})();