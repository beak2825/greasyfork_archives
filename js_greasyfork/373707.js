// ==UserScript==
// @name        openload plus+
// @description openload plus
// @namespace   1EF01784-DA1D-11E8-86F4-632D9823C688
// @match       https://openload.co/embed/*
// @version     1.0.2
// @grant       unsafeWindow
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/373707/openload%20plus%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/373707/openload%20plus%2B.meta.js
// ==/UserScript==


let el_id = document.querySelector('#DtsBlkVFQx');

let ob = new MutationObserver(function(mutations, observer){
	for(let m of mutations){
		if(m.addedNodes.length){
			setLink();
			ob.disconnect();
		}
	}
}).observe(el_id, {
	childList: true
});

function setLink(){
	let el_videooverlay = document.querySelector('#videooverlay');
	let videoUrl = 'https://openload.co/stream/' + el_id.textContent + '?mime=true';

	new ClipboardJS(el_videooverlay);
	el_videooverlay.setAttribute('data-clipboard-text', videoUrl + '\n' + location.href + '\n');
}