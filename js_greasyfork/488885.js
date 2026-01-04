// ==UserScript==
// @name         YT截圖到剪貼簿Screenshot
// @description  YouTube控制項新增按鈕[截圖到剪貼簿]Screenshot to clipboard
// @version      1.1.1
// @match        https://*.youtube.com/*
// @license      MIT
// @namespace    https://greasyfork.org/zh-TW/users/4839-leadra
// @icon         https://www.youtube.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/488885/YT%E6%88%AA%E5%9C%96%E5%88%B0%E5%89%AA%E8%B2%BC%E7%B0%BFScreenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/488885/YT%E6%88%AA%E5%9C%96%E5%88%B0%E5%89%AA%E8%B2%BC%E7%B0%BFScreenshot.meta.js
// ==/UserScript==
/*
*配合下面腳本，可使用快速鍵shift+C(可自定義)
YT快速鍵hotkeys
https://greasyfork.org/zh-TW/scripts/487719
*/
//速度提示框
const SHOW_NOTIFICATIONS = true;
const NOTIFICATION_DURATION_MILLIS = 500;

var lastToastElement = null;
function showNotification(message) {
    if (!SHOW_NOTIFICATIONS) {
        return;
    }
    if (lastToastElement !== null) { // delete if still visible
        lastToastElement.remove();
        lastToastElement = null;
    }

    const toast = document.createElement('tp-yt-paper-toast');
    toast.innerText = message;
    toast.classList.add('toast-open');
    toast.style.cssText= "font:normal 16pt/normal sans-serif;background:#444;color:#fff";
    const styleProps = {
        outline: 'none',
        position: 'fixed',
        right: '15%',
        bottom: '0%',
        maxWidth: '100px',
        maxHeight: '48px',
        zIndex: '2202',
        opacity: '1',
    };
    for (const prop in styleProps) {
        toast.style[prop] = styleProps[prop];
    }

    document.body.appendChild(toast);
    lastToastElement = toast;

    // needed otherwise the notification won't show
    setTimeout(() => {
        toast.style.display = 'block';
    }, 0);

    // preserves the animation
    setTimeout(() => {
        toast.style.transform = 'none';
    }, 0);

    setTimeout(() => {
        toast.style.display = 'none';
    }, Math.max(0, NOTIFICATION_DURATION_MILLIS));
}


function update(){

	let $miniplayerBtn = document.querySelector('button.ytp-miniplayer-button');
	if($miniplayerBtn && !$miniplayerBtn.previousElementSibling.classList.contains('ytp-screenshot-button')){

		const $btn = document.createElement('button');
    $btn.id = 'ytp-screenshot-button'
		$btn.classList.add('ytp-screenshot-button', 'ytp-button');
		$btn.dataset.priority = '5';
		$btn.dataset.tooltipTargetId = 'ytp-screenshot-button';
		$btn.dataset.titleNoTooltip = 'Screenshot';
		$btn.ariaLabel = 'Screenshot';
		$btn.title = 'Screenshot';
		$btn.innerHTML = `<svg height="100%" version="1.1" viewBox="-300 -1260 1560 1560" width="100%">
	        <use class="ytp-svg-shadow" xlink:href="#ytp-id-screenshot-svg"></use>
	        <path
	            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"
	            fill="#fff" id="ytp-id-screenshot-svg"></path>
	    </svg>`;
	    $btn.addEventListener('click', screenshot);

		insertBefore($btn, $miniplayerBtn);

	}

	requestAnimationFrame(update);
}
requestAnimationFrame(update);

function insertBefore($element, $sibling){
	$sibling.parentElement.insertBefore($element, $sibling);
}

function screenshot(){
showNotification('截圖到剪貼簿clipboard');
	const $video = document.querySelector('#player video');
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

		const item = new ClipboardItem({ 'image/png': blob });
		navigator.clipboard.write([ item ]);

		$video.style.cssText = oldCss;

		$canvas.remove();

		if(wasPlaying) $video.play();


	});

}