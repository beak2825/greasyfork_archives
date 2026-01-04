// ==UserScript==
// @name         Youtube PiP Button
// @namespace    https://greasyfork.org/en/users/921063-archgryphon9362
// @version      0.1
// @description  Creates a button on youtube videos to open PiP
// @author       ArchGryphon9362
// @match        *://*.youtube.com/watch*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445888/Youtube%20PiP%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/445888/Youtube%20PiP%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const requestPiP = () => {
      let videoPl = document.getElementsByClassName('html5-main-video')[0];
      videoPl.requestPictureInPicture();
    };

    console.log('loading pip')
    setTimeout(() => {
        let info = document.getElementsByClassName('related-chips-slot-wrapper')[0]
        info.insertAdjacentHTML('afterbegin', '<button onclick="requestPiP()" style="background-color: #333333; border: none; color: #ffffff; padding: 0.5rem; border-radius: 0.5rem; box-shadow: 5px 5px 0px black; margin-top: 0.5rem; margin-left: 0.5rem;">PiP</button>');
    }, 1000);
})();