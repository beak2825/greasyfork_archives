// ==UserScript==
// @name         Voxiom Better text
// @version      0.1
// @description  Better text visability
// @author       Pix#7008
// @match        https://voxiom.io/*
// @icon         https://avatars.githubusercontent.com/u/44953835?v=4
// @grant        none
// @license      GPL3
// @namespace    Pix_vox_bettertext
// @downloadURL https://update.greasyfork.org/scripts/440552/Voxiom%20Better%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/440552/Voxiom%20Better%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';

function fixtext(){
    if (document.getElementsByClassName('sc-imVSVl ekMhWj')[0]) {
        if (document.getElementsByClassName('sc-imVSVl ekMhWj')[0].style.color != `#000`) {
            document.getElementsByClassName(`sc-imVSVl ekMhWj`)[0].style.color = `#000`
            document.getElementsByClassName(`sc-imVSVl ekMhWj`)[0].style.fontWeight = `bold`
        }
    }
    setTimeout(fixtext, 500)
}
fixtext()
})();