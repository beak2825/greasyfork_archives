// ==UserScript==
// @name         Meteor's activities
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take a guess
// @author       Salmon
// @match        /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(army_info).php*/
// @include      /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(army_info).php*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522305/Meteor%27s%20activities.user.js
// @updateURL https://update.greasyfork.org/scripts/522305/Meteor%27s%20activities.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let srcList = [];
    const download_img_btn = document.createElement('a');
    download_img_btn.innerText = 'Картинка';

    const parent_elem = document.getElementsByClassName('info_header_content')[0];

    window.addEventListener("load", () => {
        let images = document.getElementsByTagName('img');

        for(let i = 0; i < images.length; i++) {
            srcList.push(images[i].src);
        }
        download_img_btn.href = srcList[0];
        download_img_btn.target = '_blank';
    })

    parent_elem.appendChild(download_img_btn);

})();