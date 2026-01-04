// ==UserScript==
// @name         nhentai.net - G to Fullscreen ⛶
// @namespace    Violentmonkey Scripts
// @include      https://nhentai.net/*
// @icon         https://icons.duckduckgo.com/ip2/nhentai.net.ico
// @supportURL   https://greasyfork.org/en/scripts/436918-nhentai-net-g-to-fullscreen/code
// @grant        none
// @version      1.1
// @author       shelbyKiraM
// @license      https://choosealicense.com/licenses/mit/
// @inject-into  page
// @description  Press G to rotate fullscreen comics
// @description  macOS users may need to install Symbola: https://fontlibrary.org/en/font/symbola
// @downloadURL https://update.greasyfork.org/scripts/436918/nhentainet%20-%20G%20to%20Fullscreen%20%E2%9B%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/436918/nhentainet%20-%20G%20to%20Fullscreen%20%E2%9B%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cookieName = 'gtofull'
    var expiration_date = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toUTCString();
    var bclass = (document.cookie.match(/gtofull/)?document.cookie.split('; ').find(row => row.startsWith(cookieName+'=')).split('=')[1]:'n');
    // wrap the main #content
    document.body.classList.add(bclass);
    var el = document.querySelector('div#content');
    var wrapper = document.createElement('div');
    wrapper.setAttribute("id", "fsw");
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    // add the Full Screen link
    var sel="#content .reader-bar:nth-child(2) .zoom-buttons .box:last-child";
    document.querySelector(sel).style = "cursor:pointer";
    document.querySelector(sel).addEventListener('click', function(e) {
        e.preventDefault();
        fullscreeny('fsw');
    });
    document.querySelector(sel).innerHTML = '<a aria-label="Full screen (g)" title="Full screen (g)">&#x26F6;</a>';

    // G fullscreen shortcut
    window.onkeydown = function(e){
        if(e.key=='g') {
            // Chose G as F was already bound :( ;
            fullscreeny("fsw");
        }
        if(e.key=='r' && (document.fullscreenElement && document.fullscreenElement !== null)) {
            // R to rotate.
            if (!e.metaKey) {
                if (bclass == 'r') {
                    bclass = 'l';
                } else if (bclass == 'l') {
                    bclass = 'n';
                } else {
                    bclass = 'r';
                }
            }
            document.body.classList = bclass;
            document.cookie = cookieName + '=' + bclass + '; expires=' + expiration_date;
        }
    }

    // Add custom styles to rotate (originally made on laptop to read like book)
    var styles = `@media (display-mode:fullscreen) and (max-device-width: 100vw) and (max-device-height:100vh) {
	#content {
		transition: transform 0.5s ease-in;
    }
    #content img {
        object-fit: scale-down;
    }
    .r #content .image-container, .l #content .image-container {
        height: auto !important;
    }
    .r #content img, .l #content img {
        width: 100vh
    }
    .r #content .fit-both img, .l #content .fit-both img {
        height: calc(100vw - 40px);
    }
    .r #content .fit-horizontal img, .l #content .fit-horizontal img {
        height: calc(100vw - 80px);
        width: 100vh;
    }
    .r #content {
		width: 100vh;
		max-height:100vw;
        transform:rotate(90deg) translate(0, calc(-100vw + 100vh)); /* 0 or -35 */
	}
    .l #content {
		width: 100vh;
		max-height:100vw;
        transform:rotate(270deg) translate(0, -0vw); /* 0 or -35 */
    }
    .n #content {
        width: 100vw;
        max-height: 100vh;
        transform:rotate(0deg) translate(0, -0); /* 0 or -35 */
    }
    .n #content img {
        width: 100vw;
    }
    .n #content #image-container.fit-horizontal img {
        height: calc(100vh - 80px) !important;
        background: #000;
    }
    .n #content #image-container.fit-both img {
        height: calc(100vh - 40px) !important;
    }
    .zoom-buttons.hidden {
        display: block !important;
    }
    .zoom-buttons.hidden .btn, .zoom-buttons.hidden .zoom-level {
        display: none;
    }
}`;
    // '#image-container, #image-container a {max-height:calc(100vw - 60px);object-fit:scale-down;}';
    var css = document.createElement('style');
    css.innerHTML = styles;
    document.getElementsByTagName("head")[0].appendChild(css);

    function fullscreeny(fullElem) {
        // toggles fullscreen
        var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null);
        var elFull = document.getElementById(fullElem);
        if (!isInFullScreen) {
            if (elFull.requestFullscreen) { elFull.requestFullscreen(); } else if (elFull.mozRequestFullScreen) { elFull.mozRequestFullScreen(); } else if (elFull.webkitRequestFullScreen) { elFull.webkitRequestFullScreen(); } else if (elFull.msRequestFullscreen) { elFull.msRequestFullscreen(); }
        } else {
            if (document.exitFullscreen) { document.exitFullscreen(); } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); } else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); } else if (document.msExitFullscreen) { document.msExitFullscreen(); }
        }
    }
})();