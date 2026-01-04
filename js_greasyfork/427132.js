// ==UserScript==
// @name         Wallpaper bulk downloader
// @namespace    https://greasyfork.org/fr/users/191481-zeper
// @version      0.1
// @description  Download all loaded wallpaper on an search page result.
// @author       Zeper
// @match        *://wallhaven.cc/search?*
// @icon         https://www.google.com/s2/favicons?domain=wallhaven.cc
// @grant        GM_download
// @run-at          context-menu
// @downloadURL https://update.greasyfork.org/scripts/427132/Wallpaper%20bulk%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/427132/Wallpaper%20bulk%20downloader.meta.js
// ==/UserScript==

async function InitDownloadAll(){
    var preview = document.getElementsByClassName("preview");
    var thumbInfo = document.getElementsByClassName("thumb-info");
    console.log(preview.length);
    for (var i = 0; i < preview.length; i++) {
        var preview_id = preview[i].href.split('/').pop();
        var previewFormat = ".jpg";
        if (thumbInfo[i].getElementsByClassName("png").length > 0) {previewFormat = ".png"}
        if (!preview_id) {console.log("Skip unloaded wallpaper");continue;}
        console.log(preview_id+previewFormat);
        if (i == preview.length-1){console.log("All done !");}
        var imageLink = 'https://w.wallhaven.cc/full/'+preview_id.substring(0, 2)+'/wallhaven-'+preview_id+previewFormat;
        await GM_download({
            url: imageLink,
            name: preview_id+previewFormat,
            onerror: function (e) {
                console.log("Error while downloading : "+e.error+"("+e.details+")");
            }
        });
    }
}


InitDownloadAll();