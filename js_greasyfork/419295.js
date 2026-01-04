// ==UserScript==
// @name        IMDb2KGUpload
// @namespace   KG
// @description Add a link to IMDb movie pages directly to auto-filled KG upload form
// @author      tadanobu
// @match       https://*.imdb.com/title/tt*
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @version     1.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/419295/IMDb2KGUpload.user.js
// @updateURL https://update.greasyfork.org/scripts/419295/IMDb2KGUpload.meta.js
// ==/UserScript==
window.addEventListener('load', showCL);
function showCL() {
    var movie_id = window.location.pathname.match(/\/tt(\d+)\//)[1];
    var h1s = $("h1");

    for (var i = 0; i < h1s.length; i++) {
        var h1 = h1s[i];
        var divAfterH1 = $("<div>");

        var uploadLink = $('<a href=\'https://karagarga.in/upload.php?title=Bypassed&type=1&upstep=2&imdbid=' + movie_id + '\' target="_blank" style="color:#bbb !important; text-decoration:none;">Upload to KG</a>');

        divAfterH1.append(uploadLink);
        $(h1).after(divAfterH1);
    }
}