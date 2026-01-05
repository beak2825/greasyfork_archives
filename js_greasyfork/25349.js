// ==UserScript==
// @name        Fake Gelocation getCurrentPosition
// @description prompt instead native geolocation
// @namespace   http://eldar.cz/myf/
// @include     *
// @version     1.0.0
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/25349/Fake%20Gelocation%20getCurrentPosition.user.js
// @updateURL https://update.greasyfork.org/scripts/25349/Fake%20Gelocation%20getCurrentPosition.meta.js
// ==/UserScript==


;(function(){
	// navigator.geolocation.originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
	navigator.geolocation.getCurrentPosition = fakeGet;
	function fakeGet(ok, err){
		var p = prompt('coords','0.2581778, 6.6247559');
		var c = p.trim().split(/\s*,\s*/).map(e=>Number(e));
		if(c[0] && c[1]) {
			ok({coords:
				{	latitude: c[0]
				,	longitude: c[1]
				}
			});
		} else {
			err(JSON.parse(p));
		}
	}
})();