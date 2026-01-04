// ==UserScript==
// @name           Big Tits Flipper
// @description    Re-mirrors the mirrored images on bigtits.city again for your viewing pleasure!
// @author         Sgt. Nukem
// @include        https://bigtits.city
// @version        0.666
// @namespace https://greasyfork.org/users/324223
// @downloadURL https://update.greasyfork.org/scripts/388262/Big%20Tits%20Flipper.user.js
// @updateURL https://update.greasyfork.org/scripts/388262/Big%20Tits%20Flipper.meta.js
// ==/UserScript==
var bigtits = document.createElement('style');
bigtits.innerHTML = `
#container img.lazyloaded, img.img-thumbnail, .item.thumbnail img {
	transform: scaleX(-1);
}
`;
document.head.appendChild(bigtits);
console.info("Hello Big Tits! :)");
