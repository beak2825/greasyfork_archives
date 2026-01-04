// ==UserScript==
// @name        asiansister full image loading
// @namespace   Violentmonkey Scripts
// @match       https://asiansister.com/view_*
// @grant       none
// @version     1.0
// @author      zbutfly@gmail.com
// @icon        data:image/webp;base64,UklGRiwCAABXRUJQVlA4ICACAACQDwCdASpgAGAAPpFCmUklpCIhKrQLULASCWkACwLnM7lZUD3qPhhyfoi4EJqYEkijj1eyOYmT3IYhtxgy+BGpwZDnJebEYh8xoDtcQGJwfXR6XKUsDp8ImRstvpI9QDDlilTxpA7kcdGt/DL01It0ORjvjrZdFshyhgDOqb2u0sSMxP4AAP75WILI9izCJ90U/ymzkAkChdxajHRzZduKaHsdj1+2UJNefVhNU13bUAPiqJsdwBBpOrKaP5IEU7r53aXsSsXcLRe+kMYBXu1yVLxOBbqz5FzIX0RejZ9rMQ4JezrYUOPmp2+nW63W5ZTyR4L1Kb6dYBQad9bw7txNBTLTh+0tHFjHb+iUGu44OJbc59XGEu0e95Du9epPGLsCjkKOTjpoQEVTQOG6VQX9JFLIBf1tS3TX1dcrcoE4AwJuz/DQqdfVAzkCKGorgYfGEEh07+04xxg84GWco2z0EZapsSzjJ+I5rtWG0v0YP+O4n6QalKIK3Yen+6+lF4np3zOYHprBKtih8L23RFapNjSV1cX/BiR3S52ev9J5OndAgVhpeex6DCEUkRV9l42knag8br10z3f2g/3iZdXGBgYGcnWtARJDCbnUHGcMStX/diAZtkphXJz19NMWf1k3YlsHc0IDJOgUe1sAntBhE+w9NTprFM4ezX2WFD7cosQxHWTRYCKQ2hC4uYI7CbgoCd8uBMxuNS+pMR45QAAA
// @description ASIAN SISTER原图载入
// @downloadURL https://update.greasyfork.org/scripts/397701/asiansister%20full%20image%20loading.user.js
// @updateURL https://update.greasyfork.org/scripts/397701/asiansister%20full%20image%20loading.meta.js
// ==/UserScript==

; (function () { // eslint-disable-line
    var imgs=document.getElementsByClassName("showMiniImage");
    var loaded = false;
    
    for (var i = 0; i < imgs.length; i++) {
    	var url=imgs[i].getAttribute("dataurl");
    	if (url) {
        url = url.substring(5);
    		imgs[i].setAttribute("src", url);
        loaded = true;
    	}
    }
    
    if (loaded) alert("full image loaded ["+imgs.length+"], you can save is")
}());
