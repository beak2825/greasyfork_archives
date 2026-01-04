// ==UserScript==
// @name	Retroogle
// @version	1.0.4
// @description	Revert Google product icons to their pre-2020 style.
// @author	Xing <dev@x-ing.space> (https://x-ing.space)
// @license	MIT License
// @namespace	https://x-ing.space
// @match	https://*.google.com/*
// @grant	none
// @downloadURL https://update.greasyfork.org/scripts/414827/Retroogle.user.js
// @updateURL https://update.greasyfork.org/scripts/414827/Retroogle.meta.js
// ==/UserScript==

(function(){

	const loc = window.location
	let key = false
	switch(loc.hostname.split('.')[0]){
		case 'meet':
			key='meet'
			break
		case 'drive':
			key='drive'
			break
		case 'mail':
			key='mail'
			break
			/*
		case 'docs':
			switch(loc.pathname.split('/')[1]){
				case 'presentation':
					key='slides'
					break
				case 'document':
					key='docs'
					break
			}
			break	
			*/
	}

	if(!key) return
	
	const fav = document.createElement('link')
	fav.type='image/png'
	fav.rel='shortcut icon'
	fav.href = `https://x-ing.space/retroogle/icons/${key}.png`
	document.head.append(fav)
	
})()