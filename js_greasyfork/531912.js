// ==UserScript==
// @name         Disable DRC Audio on YouTube (+ both tweaks)
// @author       LegendCraft (forked from Adri and The0x539)
// @namespace    Tampermonkey Scripts
// @match        https://www.youtube.com/*
// @grant        none
// @version      2025.11.03
// @description  The script disables DRC audio (aka Stable Volume) on YouTube (along with both volume normalization disabled and prevents automatic dubbing on all videos).
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531912/Disable%20DRC%20Audio%20on%20YouTube%20%28%2B%20both%20tweaks%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531912/Disable%20DRC%20Audio%20on%20YouTube%20%28%2B%20both%20tweaks%29.meta.js
// ==/UserScript==
// Disables the 'Stable volume' feature
/* jshint esversion: 11 */
 
function waitForElement(selector) {
	return new Promise((resolve, reject) => {
		let element = document.querySelector(selector);
		if (element) {
			resolve(element);
			return;
		}
 
		const observer = new MutationObserver(mutations => {
			const element = document.querySelector(selector);
			if (element) {
				observer.disconnect();
				resolve(element);
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}
 
async function disableDRC() {
	const menuButton = await waitForElement('.ytp-settings-button');
 
	menuButton.click();
	menuButton.click();
 
	const drcMenuItem = await waitForElement('.ytp-drc-menu-item:not([aria-disabled])');
 
	if (drcMenuItem.getAttribute('aria-checked') === 'true') {
		drcMenuItem.click();
		console.log('Disabled DRC Audio');
	} else {
		console.log('DRC Audio is already disabled');
	}
}
 
disableDRC().catch(error => console.error('Error:', error));

// Disable 'Loudness normalization' feature (first introduced back in Dec 2014)
function ytvt_hook() {
  function ytvt_patchDescriptor(targetProto, targetProp) {
    let desc = Object.getOwnPropertyDescriptor(targetProto, targetProp);
    Object.defineProperty(targetProto, targetProp, {
      enumerable: true,
      configurable: true,
      get: function() { return desc.get.call(this); },
      set: function(e) { void e; }
    });
    return desc;
  }
 
  let ytvt_desc = ytvt_patchDescriptor(HTMLMediaElement.prototype, 'volume');
  let ytvt_valSetter = HTMLElement.prototype.setAttribute;
  HTMLElement.prototype.setAttribute = function(name, val) {
    if(name === 'aria-valuenow') {
      let isVolume = this.matches('[aria-label="Volume"][role="slider"]');
      if(isVolume) {
        let newVolume = val / 100;
        let players = document.querySelectorAll('.video-stream');
        // players[1] can be the active, so just set the volume on all players
        for(let player of players) {
          if(player.volume !== newVolume) {
            ytvt_desc.set.call(player, newVolume);
          }
        }
      }
    }
    ytvt_valSetter.call(this, name, val);
  };
 
  let ytvt_rule = '.ytp-sfn-content::after, ytmusic-nerd-stats::after { content: "using No Volume Normalization" }';
  let ytvt_sheet = new CSSStyleSheet();
  ytvt_sheet.insertRule(ytvt_rule);
  document.adoptedStyleSheets = (document.adoptedStyleSheets || []).concat([ytvt_sheet]);
 
  let ytvt_script = document.getElementById('ytvoltweak');
  if(ytvt_script) { ytvt_script.remove(); }
}
 
function ytvt_inject() {
  let ytvt_textContent = ytvt_hook + '\n' + ytvt_hook.name + '();';
  GM_addElement('script', {textContent: ytvt_textContent, id: 'ytvoltweak'});
}
 
if(!document.head) {
  let ytvt_headObserver = new MutationObserver(function(_arr, obs) {
    if(document.head) { obs.disconnect(); ytvt_inject(); }
  });
  ytvt_headObserver.observe(document, {subtree: true, childList: true});
} else {
  ytvt_inject();
}

// Prevent to force the 'Auto-dubbing' feature (for all videos that have any conturies)
/*jshint esversion: 11 */
 
(function () {
    'use strict';
 
    function fallbackGetPlayer() {
        if (window.location.hostname === 'm.youtube.com') return document.querySelector('#movie_player');
        if (window.location.pathname.startsWith('/shorts')) return document.querySelector('#shorts-player');
        if (window.location.pathname.startsWith('/watch')) return document.querySelector('#movie_player');
        return document.querySelector('.inline-preview-player');
    }
 
    function main(event) {
        try {
            const getTrackId = (track) => Object.values(track ?? {}).find((p) => p?.id)?.id ?? null;
            const player = event?.target?.player_ ?? fallbackGetPlayer();
            const availableTracks = player.getAvailableAudioTracks();
            if (availableTracks?.length === 0) return; // Either no dubbing or YouTube's API failed.
            const dubAudioTrack = player.getAudioTrack();
            if (`${dubAudioTrack}` === 'Default') return; // YouTube sometimes returns a partially populated object named "Default" if already using the original language. Perhaps a bug on YouTube's side?
            const renderer = player.getPlayerResponse()?.captions?.playerCaptionsTracklistRenderer;
            const originalAudioId = renderer?.audioTracks?.[renderer?.defaultAudioTrackIndex]?.audioTrackId;
            if (!originalAudioId || getTrackId(dubAudioTrack) === originalAudioId) return; // No undo necessary so return early.
            console.log('Auto-dub detected, trying to undo...');
            const originalAudioTrack = availableTracks.find((track) => getTrackId(track) === originalAudioId);
            if (!originalAudioTrack) throw new Error('Unable to determine the original audio track.');
            player.setAudioTrack(originalAudioTrack);
            console.log(`Auto-dub undo successful. Audio track reverted from ${dubAudioTrack} to ${originalAudioTrack}.`);
        } catch (error) {
            console.error('Failed to prevent YouTube auto-dubbing.', error);
        }
    }
 
    const playerUpdateEvent = window.location.hostname === 'm.youtube.com' ? 'state-navigateend' : 'yt-player-updated';
    window.addEventListener(playerUpdateEvent, main, true);
    window.addEventListener('pageshow', main, {once: true});
})();

// Add CSS to remove the 'Stable volume' option from the right menu (legacy code included)
(function() {
let css = `.ytp-panel .ytp-menuitem.ytp-drc-menu-item { display: none !important }`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = '.ytp-panel .ytp-menuitem.ytp-drc-menu-item{display:none;}';
    document.head.appendChild(style);
})();