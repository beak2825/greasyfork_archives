// ==UserScript==
// @name        捷克论坛加载原图 - jkforum.net
// @namespace   Violentmonkey Scripts
// @match       https://www.jkforum.net/thread-*
// @grant       none
// @version     2.0
// @author      zbutfly@gmail.com
// @icon        data:image/webp;base64,UklGRiwCAABXRUJQVlA4ICACAACQDwCdASpgAGAAPpFCmUklpCIhKrQLULASCWkACwLnM7lZUD3qPhhyfoi4EJqYEkijj1eyOYmT3IYhtxgy+BGpwZDnJebEYh8xoDtcQGJwfXR6XKUsDp8ImRstvpI9QDDlilTxpA7kcdGt/DL01It0ORjvjrZdFshyhgDOqb2u0sSMxP4AAP75WILI9izCJ90U/ymzkAkChdxajHRzZduKaHsdj1+2UJNefVhNU13bUAPiqJsdwBBpOrKaP5IEU7r53aXsSsXcLRe+kMYBXu1yVLxOBbqz5FzIX0RejZ9rMQ4JezrYUOPmp2+nW63W5ZTyR4L1Kb6dYBQad9bw7txNBTLTh+0tHFjHb+iUGu44OJbc59XGEu0e95Du9epPGLsCjkKOTjpoQEVTQOG6VQX9JFLIBf1tS3TX1dcrcoE4AwJuz/DQqdfVAzkCKGorgYfGEEh07+04xxg84GWco2z0EZapsSzjJ+I5rtWG0v0YP+O4n6QalKIK3Yen+6+lF4np3zOYHprBKtih8L23RFapNjSV1cX/BiR3S52ev9J5OndAgVhpeex6DCEUkRV9l42knag8br10z3f2g/3iZdXGBgYGcnWtARJDCbnUHGcMStX/diAZtkphXJz19NMWf1k3YlsHc0IDJOgUe1sAntBhE+w9NTprFM4ezX2WFD7cosQxHWTRYCKQ2hC4uYI7CbgoCd8uBMxuNS+pMR45QAAA
// @description 捷克论坛图片主题自动感谢和载入全图
// @downloadURL https://update.greasyfork.org/scripts/396777/%E6%8D%B7%E5%85%8B%E8%AE%BA%E5%9D%9B%E5%8A%A0%E8%BD%BD%E5%8E%9F%E5%9B%BE%20-%20jkforumnet.user.js
// @updateURL https://update.greasyfork.org/scripts/396777/%E6%8D%B7%E5%85%8B%E8%AE%BA%E5%9D%9B%E5%8A%A0%E8%BD%BD%E5%8E%9F%E5%9B%BE%20-%20jkforumnet.meta.js
// ==/UserScript==

; (function () { // eslint-disable-line
	var imgs = document.getElementsByTagName("img");
	for (var i = 0; i < imgs.length; i++) {
		var zoom = imgs[i].getAttribute("zoomfile");
		if (zoom) {
			console.log("载入原图：" + zoom + "\n缩略图（" + imgs[i].naturalWidth + " x " + imgs[i].naturalHeight + "）：" + imgs[i].src)
			imgs[i].src = zoom;
			imgs[i].onload = e => e.target.title = "原图已载入：" + e.target.naturalWidth + " x " + e.target.naturalHeight;
		}
	}
	var thanks = document.getElementById('k_thankauthor');
	if (thanks) {
		alert("自动感谢，等待刷新后载入全图。");
		thanks.click();
	}
}());
