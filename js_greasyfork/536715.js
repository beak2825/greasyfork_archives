// ==UserScript==
// @name         Auto Skip Ad Gartic
// @namespace https://greasyfork.org/users/1220697
// @version      1.0
// @license        none
// @description   Auto Skip Ad in Gartic
// @author       STRAGON
// @match        *://gartic.io/*
// @grant        none
// @icon           https://cdn.imgurl.ir/uploads/x049596_photo_2025-04-03_23-14-27.jpg
// @downloadURL https://update.greasyfork.org/scripts/536715/Auto%20Skip%20Ad%20Gartic.user.js
// @updateURL https://update.greasyfork.org/scripts/536715/Auto%20Skip%20Ad%20Gartic.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        const button = document.querySelector('#popUp #videoContainer #gphone button');
        if (button) {
            console.log('یافت شد');
            button.style.color = 'red';
            button.click();
        }
    }, 1000);
})();
