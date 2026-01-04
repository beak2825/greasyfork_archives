// ==UserScript==
// @name         CF - keep mobile and locale unchanged
// @version      0.0.0
// @description  Prevent accidentally modifying the mobile or locale on Codeforces
// @match        *://codeforces.com
// @match        *://codeforces.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-start
// @namespace    https://greasyfork.org/users/410786
// @downloadURL https://update.greasyfork.org/scripts/393809/CF%20-%20keep%20mobile%20and%20locale%20unchanged.user.js
// @updateURL https://update.greasyfork.org/scripts/393809/CF%20-%20keep%20mobile%20and%20locale%20unchanged.meta.js
// ==/UserScript==

(function(){
	let url=new URL(location.href)
	let changed=false
	for(let param of ['mobile','locale']){
		const expected=GM_getValue('lastParam_'+param)
		if(expected!==undefined&&
			url.searchParams.has(param)&&
			url.searchParams.get(param)!==expected
		){
			changed=true
			url.searchParams.set(param,expected)
		}
	}
	if(changed){
		location.href=url.toString()
		return
	}

	window.addEventListener('DOMContentLoaded',function(){
		document.querySelectorAll('a[href^="?locale="],a[href^="?mobile="]').forEach(function(elem){
			elem.addEventListener('click',function(){
				for(let param of ['mobile','locale'])
					GM_deleteValue('lastParam_'+param)
			})
		})

		GM_setValue('lastParam_locale',document.documentElement.lang)
		GM_setValue('lastParam_mobile',document.getElementsByClassName('switchToMobile').length ? "false" : "true")
	})
})()
