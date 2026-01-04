// ==UserScript==
// @name         my EmuParadise Download Workaround - 1.1.1
// @namespace    DANS-AWESOME-NAMESPACE
// @version      1.1.2
// @description  Replaces the download button link with a working one
// @author       Eptun
// @match        https://www.emuparadise.me/*/*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422501/my%20EmuParadise%20Download%20Workaround%20-%20111.user.js
// @updateURL https://update.greasyfork.org/scripts/422501/my%20EmuParadise%20Download%20Workaround%20-%20111.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var id = ((document.URL).split("/"))[5];
    $(".download-link").prepend(`<a target="_blank" href="/roms/get-download.php?gid=`+id+`&test=true" title="Download using the workaround script">Download using the workaround script</a><br><br>`);
})();