// ==UserScript==
// @name     PI Institute Video Enlarger
// @version  1
// @grant    none
// @namespace      http://pirsa.org/displayFlash.php/*
// @description The script makes the video screen of PERIMETER INSTITUTE RECORDED SEMINAR ARCHIVE aka http://pirsa.org/ larger. Because who can read equations on 640px ?!
// @match @//pirsa.org/displayFlash.php*
// @downloadURL https://update.greasyfork.org/scripts/428872/PI%20Institute%20Video%20Enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/428872/PI%20Institute%20Video%20Enlarger.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('#media_wrapper { max-width: 900px !important;}');