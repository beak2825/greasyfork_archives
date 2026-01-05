// ==UserScript==
// @name         KissAnime in VLC
// @version      0.1
// @description  Open KissAnime direct link in VLC
// @author       asdaa
// @include      *
// @run-at       document-start
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/79147
// @downloadURL https://update.greasyfork.org/scripts/24719/KissAnime%20in%20VLC.user.js
// @updateURL https://update.greasyfork.org/scripts/24719/KissAnime%20in%20VLC.meta.js
// ==/UserScript==

window.addEventListener ("DOMContentLoaded", function() {
    console.log ("In GM script, local global, after ready: ", unsafeWindow.link);
    if (unsafeWindow.link === undefined) {
        unsafeWindow.link = document.querySelector('.clsTempMSg').childNodes[2].childNodes[1];
        unsafeWindow.link.href = "vlcweb:///" + unsafeWindow.link.href;
    }
}, false);