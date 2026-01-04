// ==UserScript==
// @name         YouTube Screenshot
// @description  Screenshot the current frame of any YouTube video
// @version      1.5
// @icon         https://i.imgur.com/UbC1oPW.png
// @match        https://*.youtube.com/*
// @license      MIT
// @namespace https://greasyfork.org/users/1207477
// @downloadURL https://update.greasyfork.org/scripts/482387/YouTube%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/482387/YouTube%20Screenshot.meta.js
// ==/UserScript==

let escapeHTMLPolicy = 'trustedTypes' in window
    ? trustedTypes.createPolicy('forceInner', { createHTML: html=>html })
    : { createHTML: html=>html };

function update(){
	
	let $miniplayerBtn = document.querySelector('button.ytp-miniplayer-button');
	if($miniplayerBtn && !$miniplayerBtn.previousElementSibling.classList.contains('ytp-screenshot-button')){
		
		const $btn = document.createElement('button');
		$btn.id = 'ytp-screenshot-button';
		$btn.classList.add('ytp-screenshot-button', 'ytp-button');
		$btn.dataset.priority = '5';
		$btn.dataset.tooltipTargetId = 'ytp-screenshot-button';
		$btn.dataset.titleNoTooltip = 'Screenshot';
		$btn.ariaLabel = 'Screenshot';
		$btn.title = 'Screenshot';
		$btn.innerHTML = escapeHTMLPolicy.createHTML(`<svg height="100%" version="1.1" viewBox="-300 -1260 1560 1560" width="100%">
	        <use class="ytp-svg-shadow" xlink:href="#ytp-id-screenshot-svg"></use>
	        <path
	            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"
	            fill="#fff" id="ytp-id-screenshot-svg"></path>
	    </svg>`);
	    $btn.addEventListener('click', screenshot);
		
		insertBefore($btn, $miniplayerBtn);
		
	}
	
	requestAnimationFrame(update);
}
requestAnimationFrame(update);

function insertBefore($element, $sibling){
	$sibling.parentElement.insertBefore($element, $sibling);
}

function screenshot(e){
	
	const $video = document.querySelector('#player video, #movie_player video');
	if(!$video){
		console.error('No video found to screenshot!');
		return;
	}

    let wasPlaying = !$video.paused;
    if(wasPlaying) $video.pause();
	
	const $canvas = document.createElement('canvas');
	$canvas.width = $video.videoWidth;
	$canvas.height = $video.videoHeight;
	
	let oldCss = $video.style.cssText;
	$video.style.width = $video.videoWidth + 'px';
	$video.style.height = $video.videoHeight + 'px';
	
	const ctx = $canvas.getContext('2d');
	ctx.drawImage($video, 0, 0, $video.videoWidth, $video.videoHeight);
	
	$canvas.toBlob(blob=>{
		
        if(!e.shiftKey){
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([ item ]);
        }else{
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = document.title;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        }
		
		$video.style.cssText = oldCss;
		
		$canvas.remove();
		
		if(wasPlaying) $video.play();
		
		
	});
	
}