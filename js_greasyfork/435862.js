// ==UserScript==
// @name         www.opensubtitles.org - direct download
// @version      1.0
// @description  Adds "Direct download" link
// @author       mgrinzPlayer
// @match        https://www.opensubtitles.org/*/subtitles/*
// @grant        none
// @namespace https://greasyfork.org/users/842275
// @downloadURL https://update.greasyfork.org/scripts/435862/wwwopensubtitlesorg%20-%20direct%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/435862/wwwopensubtitlesorg%20-%20direct%20download.meta.js
// ==/UserScript==

(function() {
    var id = ((document.URL).split("/"))[5];
    $("#bt-dwl-bt").parent().prepend(`<p><a class="bt-dwl" target="_blank" href="https://dl.opensubtitles.org/en/download/sub/`+id+`" title="Direct download">Direct download</a></p>`);
})();
