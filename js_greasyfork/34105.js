// ==UserScript==
// @name         Youtube Deleted/Private video unliker/remover
// @namespace    whatever
// @version      1
// @description  removes videos named [Private video] or [Deleted video] if they have no timestamp from playlists you edit, including your Liked videos list.
// @author       <nazgand@gmail.com>
// @match        https://www.youtube.com/playlist?list=*
// @grant        none
// @homepage     https://github.com/nazgand/userscripts
// @downloadURL https://update.greasyfork.org/scripts/34105/Youtube%20DeletedPrivate%20video%20unlikerremover.user.js
// @updateURL https://update.greasyfork.org/scripts/34105/Youtube%20DeletedPrivate%20video%20unlikerremover.meta.js
// ==/UserScript==


function trydelete() {
    const badVideo=document.querySelector('tr.pl-video[data-title="[Private video]"],tr.pl-video[data-title="[Deleted video]"]');
    if (badVideo !== null) {
        if (badVideo.querySelector('div.timestamp')===null) {
            badVideo.querySelector('button.pl-video-edit-remove-liked-video,button.pl-video-edit-remove').click();
            setTimeout(trydelete, 200);
        } else {
            //The scripter was too lazy to deal with this unlikely error.
        }
    } else {
        tryload();
    }
}
function tryload() {
    const btnLoadMore = document.querySelector('button.load-more-button');
    if (btnLoadMore !== null) {
        btnLoadMore.click();
        setTimeout(trydelete, 900);
    }
}
trydelete();