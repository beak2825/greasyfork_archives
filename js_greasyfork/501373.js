// ==UserScript==
// @name        Persist Twitter(X) Mute
// @version     0.2.0
// @description Control the global mute for embedded videos on Twitter
// @namespace   https://github.com/oodzchen/user-scripts
// @author      Kholin
// @grant       GM.setValue
// @grant       GM.getValue
// @run-at      document-end
// @include     https://x.com/*
// @include     https://twitter.com/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/501373/Persist%20Twitter%28X%29%20Mute.user.js
// @updateURL https://update.greasyfork.org/scripts/501373/Persist%20Twitter%28X%29%20Mute.meta.js
// ==/UserScript==

(async () => {
    const setPlayEvent = (vdoEl) => {
	vdoEl.onplay = async (ev) => {
	    const globalMuted = await GM.getValue('global_audio_muted')

	    if (globalMuted != undefined){
		const container = vdoEl.closest('div[data-testid^="cellInnerDiv-tweet-"]') || vdoEl.closest('div[data-testid="videoComponent"]')
		if(!container) return
		
		const relateMuteBtn = container.querySelector('div.r-ero68b:nth-child(2) button, button[data-testid^="immersive-tweet-mute-button-"]')
		if (relateMuteBtn){
		    if (vdoEl.muted != globalMuted){
			relateMuteBtn.click()
		    }
		} else {
		    vdoEl.muted = globalMuted
		}
	    }
	    
	}
    }

    const setMuteEvent = (mtEl) => {
	mtEl.onclick = (ev) => {
	    if (ev.isTrusted){
		const container = mtEl.closest('div[data-testid^="cellInnerDiv-tweet-"]') || mtEl.closest('div[data-testid="videoComponent"]')
		if (!container) return
		const relateVidEl = container.querySelector('video')
		if (!relateVidEl) return
		
		GM.setValue('global_audio_muted', !relateVidEl.muted)
	    }
	}
    }

    const callback = (mutations, observer) => {
	for (const mutation of mutations) {
	    const videoList = mutation.target.querySelectorAll('div[data-testid="videoComponent"] video')
	    Array.from(videoList).forEach(el => {
		if (el.isConnected) {
		    setPlayEvent(el)
		}
	    })

	    const muteBtnList = mutation.target.querySelectorAll('div.r-ero68b:nth-child(2) button, button[data-testid^="immersive-tweet-mute-button-"]')
	    Array.from(muteBtnList).forEach(el => {
		if (el.isConnected) {
		    setMuteEvent(el)
		}
	    })
	}
    }

    const observer = new MutationObserver(callback)

    observer.observe(document.body, {
	attributes: false,
	childList: true,
	subtree: true,
    })

})()
