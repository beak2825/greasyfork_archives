// ==UserScript==
// @name         Imgur open image in new tab
// @namespace    http://cactuspie.com
// @version      1.0
// @description  Allows favoriting single images from dumps
// @author       CactusPie
// @match        https://imgur.com/gallery/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396271/Imgur%20open%20image%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/396271/Imgur%20open%20image%20in%20new%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document.body).on("mousedown mouseup click focus blur", "img[src^='//i.imgur.com'],video", e => {
		let url;

		if(e.target.tagName.toUpperCase() === "VIDEO") {
			url = e.target.children[0].src;
		} else {
			url = e.target.src;
		}

        if(e.which === 2) {
            const imgName = url.substr(url.lastIndexOf('/') + 1);
            let imgId = imgName.substr(0, imgName.indexOf("."));
            if(imgId.endsWith('g')) {
				imgId = imgId.substr(0, imgId.length - 1);
            }
            window.open(`https://imgur.com/${imgId}`, '_blank');
        }
    });
})();