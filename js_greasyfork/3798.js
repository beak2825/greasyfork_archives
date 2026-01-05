// ==UserScript==
// @name        fetlife_unfakepictures
// @namespace   bewam.free.fr/gm_scripts
// @description replace the css image on fetlife by the true one, allowing you to download the picture.
// @include     https://fetlife.com/users/*/pictures/*
// @version     0.2.2
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/3798/fetlife_unfakepictures.user.js
// @updateURL https://update.greasyfork.org/scripts/3798/fetlife_unfakepictures.meta.js
// ==/UserScript==

var fake = document.querySelector('.fake_img');
if (fake) {
	var p = fake.parentNode;
	var img = document.createElement('img');
	var url = getComputedStyle(fake).getPropertyValue("background-image");

	if( url && (m = url.match(/url\(.?(\b.*\b).?\)/)) && m.length > 1 ) {
		img.src = m[1];

        if(img.src.length > 0) {
            img.height = fake.offsetHeight;
            img.width = fake.offsetWidth;
            fake.className = ''; // TODO: should be a replace()
            p.appendChild(img, fake);
        }
	}
}