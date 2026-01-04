// ==UserScript==
// @name        LVV2列表添加略图 - https://lvv2.com/nsfw
// @namespace   Violentmonkey Scripts
// @match       https://lvv2.com/nsfw*
// @grant       none
// @version     2.0
// @author      zbutfly@gmail.com
// @icon        data:image/webp;base64,UklGRiwCAABXRUJQVlA4ICACAACQDwCdASpgAGAAPpFCmUklpCIhKrQLULASCWkACwLnM7lZUD3qPhhyfoi4EJqYEkijj1eyOYmT3IYhtxgy+BGpwZDnJebEYh8xoDtcQGJwfXR6XKUsDp8ImRstvpI9QDDlilTxpA7kcdGt/DL01It0ORjvjrZdFshyhgDOqb2u0sSMxP4AAP75WILI9izCJ90U/ymzkAkChdxajHRzZduKaHsdj1+2UJNefVhNU13bUAPiqJsdwBBpOrKaP5IEU7r53aXsSsXcLRe+kMYBXu1yVLxOBbqz5FzIX0RejZ9rMQ4JezrYUOPmp2+nW63W5ZTyR4L1Kb6dYBQad9bw7txNBTLTh+0tHFjHb+iUGu44OJbc59XGEu0e95Du9epPGLsCjkKOTjpoQEVTQOG6VQX9JFLIBf1tS3TX1dcrcoE4AwJuz/DQqdfVAzkCKGorgYfGEEh07+04xxg84GWco2z0EZapsSzjJ+I5rtWG0v0YP+O4n6QalKIK3Yen+6+lF4np3zOYHprBKtih8L23RFapNjSV1cX/BiR3S52ev9J5OndAgVhpeex6DCEUkRV9l42knag8br10z3f2g/3iZdXGBgYGcnWtARJDCbnUHGcMStX/diAZtkphXJz19NMWf1k3YlsHc0IDJOgUe1sAntBhE+w9NTprFM4ezX2WFD7cosQxHWTRYCKQ2hC4uYI7CbgoCd8uBMxuNS+pMR45QAAA
// @description LVV2列表添加略图
// @downloadURL https://update.greasyfork.org/scripts/396791/LVV2%E5%88%97%E8%A1%A8%E6%B7%BB%E5%8A%A0%E7%95%A5%E5%9B%BE%20-%20https%3Alvv2comnsfw.user.js
// @updateURL https://update.greasyfork.org/scripts/396791/LVV2%E5%88%97%E8%A1%A8%E6%B7%BB%E5%8A%A0%E7%95%A5%E5%9B%BE%20-%20https%3Alvv2comnsfw.meta.js
// ==/UserScript==

; (function () { // eslint-disable-line
	var entries = document.getElementsByClassName('entry');
	var regex = RegExp(/<img[^>]*detailImg[^>]*data-echo=\"([^\"]+)\">/, 'g')
	var thumbnailing = function (i) {
		if (i >= entries.length) return;
		var entry = entries[i];
		var url = entry.children[0].children[0].href.replace(/\/title-.*/, '');
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", function () {
			var div = entry.children[1].children[0];
			var replies = div.children[2];
			for (var j = 0; j < 5; j++) {
				var match = regex.exec(this.responseText);
				if (!match) break;
				var thumb = document.createElement('img');
				thumb.style['max-height'] = '100px';
				thumb.onclick = e => {
					if ('60vh' === e.target.style['max-height']) e.target.style['max-height'] = '100px'; // zoom in
					else {
						var all = document.getElementsByClassName('butfly-thumbnail-' + replies.id);
						for (var k = 0; k < all.length; k++)
							all[k].style['max-height'] = '100px';
						e.target.style['max-height'] = '60vh';
					}
				}
				thumb.style.padding = '0.5em';
				thumb.src = match[1];
				thumb.id = replies.id + '-thumb-' + (i + 1);
				thumb.classList.add('butfly-thumbnail-' + replies.id);
				thumb.title = "略图" + (j + 1) + '，点击缩放。';
				entry.parentElement.insertBefore(thumb, entry.nextSibling);
				// entry.insertAdjacentElement("afterend", thumb);
				// div.insertBefore(thumb, replies);
				console.log('thumb ' + match[1] + ' inserted');
			}
			thumbnailing(i + 1); //next
		});
		oReq.open("GET", url);
		oReq.send();
	}
	thumbnailing(0);
}());
