// ==UserScript==
// @name         4chan json Image Viewer - Thread Float Link
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Float URL to View Thread using "4chan json Image Viewer" (https://greasyfork.org/en/scripts/418726-4chan-json-image-viewer)
// @author       Czy [2020]
// @match        https://boards.4chan.org/*/thread/*
// @match        https://boards.4channel.org/*/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418729/4chan%20json%20Image%20Viewer%20-%20Thread%20Float%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/418729/4chan%20json%20Image%20Viewer%20-%20Thread%20Float%20Link.meta.js
// ==/UserScript==

// #######REQUIRES "4chan json Image Viewer" for full use.

// -- keep up to date, may add New Functions in the future.

(function() {
    'use strict';


    var el ;
function dirco(a){ return window.location.pathname.split("/")[a]};
// displays Thread number (Lower right corner)
var dirhref = dirco(3); // thread number
var dirthread = dirco(1); // thread name


el =`
	<div style="background:#eeeeee; position:fixed; bottom:0px; right:0px;">
        <a href="https://a.4cdn.org/`+dirthread+`/thread/`+dirhref+`.json" target="_blank" onclick="window.close();">
            <h1>ImgViewer</h1>
        </a>
    </div>`;

//ADDS el to PAGE
document.body.innerHTML += el;
})();