// ==UserScript==
// @name         Cambiar reproductor
// @namespace    bleh
// @version      0.2
// @description  ayy lmoa
// @author       Saladino
// @match        https://escuelapolitecnica.videoweb.tv/embed.php?*
// @icon         https://www.google.com/s2/favicons?domain=videoweb.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438679/Cambiar%20reproductor.user.js
// @updateURL https://update.greasyfork.org/scripts/438679/Cambiar%20reproductor.meta.js
// ==/UserScript==

(function() {
    'use strict';
        $( document ).ready(function() {
            let video = document.getElementById('videoContainer_media')
            //console.log(video.src)
            $("body").html('<video controls="" autoplay="" name="media"><source src="'+video.src+'" type="video/mp4"></video>')
        })

})();