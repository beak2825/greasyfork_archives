// ==UserScript==
// @name         Voe video redirector
// @namespace    https://tribbe.de
// @version      1.2.0
// @description  Redirect to link for Voe.sx videos
// @author       Tribbe
// @include      *://*voe*
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/415956/Voe%20video%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/415956/Voe%20video%20redirector.meta.js
// ==/UserScript==

function decrypt(p01){ p01 = p01.join(''); p01 = p01.split('').reverse().join(''); return atob(p01); }

window.addEventListener("load", function() {
    var mp4finder = null;
    var video = null;

    var content = document.body.textContent;

    mp4finder = content.match(/(https?.*?\.mp4)/);
    if (mp4finder != null) video = mp4finder[0];

    if(video == null) {
        mp4finder = content.match(/sources\[\"mp4\"\] = .*?\(\[(.*?)]\);/);
        if (mp4finder != null && mp4finder.length == 2) {
            var mp4array = mp4finder[1].replaceAll("'", "").split(",");
            video = decrypt(mp4array);
        }
    }

    if(video != null) window.location.href = video;
});


// Stop Autoplay
waitForKeyElements ("video[name*='media']", function(jNode) { jNode[0].autoplay = false; });