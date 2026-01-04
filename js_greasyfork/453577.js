// ==UserScript==
// @name         YouTube Video WindowOpener
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  YouTube動画・配信を別ウィンドウで開くアイコンを設置
// @author       You
// @include        https://www.youtube.com/watch?v=*
// @include      https://www.youtube.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453577/YouTube%20Video%20WindowOpener.user.js
// @updateURL https://update.greasyfork.org/scripts/453577/YouTube%20Video%20WindowOpener.meta.js
// ==/UserScript==

//動画プレイヤー
const player = document.querySelector('#movie_player')

//ライブ配信の左上にBufferを表示
let liveBufferLatency


//SVGアイコン追加
if(location.pathname == "/watch"){

	document.querySelector('[aria-label="設定"]').insertAdjacentHTML("afterend", `
<div  id="windowOpen" class="ytp-button" aria-label="別ウィンドウで開く" title="別ウィンドウで開く" data-title-no-tooltip="別ウィンドウで開く">

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" viewBox="-150 -230 975 975" style="enable-background:new 0 0 600 600;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#FFF;}
</style>
<g id="XMLID_6_">
	<path id="XMLID_11_" class="st0" d="M418.5,139.4H232.4v139.8h186.1V139.4z M464.8,46.7H46.3C20.5,46.7,0,68.1,0,93.1v325.9   c0,25.8,21.4,46.3,46.3,46.3h419.4c25.8,0,46.3-20.5,46.3-46.3V93.1C512,67.2,490.6,46.7,464.8,46.7z M464.8,418.9H46.3V92.2h419.4   v326.8H464.8z"></path>
</g>
</svg>

</div>`)

	//イベント作成
	document.getElementById("windowOpen").addEventListener("click", e => {
		//動画を止める
		player.pauseVideo()
		//別ウィンドウを作成
		const VIDEO_ID = player.getVideoStats().debug_videoId
		window.open(`https://www.youtube.com/embed/${VIDEO_ID}?currentTime=${player.getCurrentTime()}`, "window_name","width=1024,height=576")
	})

}else if(location.href.match("https://www.youtube.com/embed/") && location.search.match("currentTime")){

	//動画を再生
	player.playVideo()
	player.seekTo(+location.search.match(/\d.*/g))



	setTimeout( () => {
		const stats = document.querySelector('#movie_player').getVideoStats() || {};

		if (stats.live !== 'live') {
			return;
		}else{
			//動画左上にバッファーとテイレンシを表示
			LiveBufferAndLatency()
			//latency自動調整実行
			setInterval(speedCheck,100)
		}
	},1000)

}








function speedCheck(){

	const Buffer = getBufferHealth(player)

	liveBufferLatency.textContent = `Buffer: ${Buffer.toFixed(2)}`


	if((Buffer < 0) && player.getPlaybackRate() != 0.75){
		//0.5秒以下バッファーがあれば速度を更に下げる
		player.setPlaybackRate(0.75);
		console.log(0.75)
	}else if((Buffer < 0.2) && player.getPlaybackRate() != 1){
		//1.5秒以下バッファーがあれば速度を下げる
		player.setPlaybackRate(1.00);
		console.log(1)
	}else if(Buffer > 0.4 && player.getPlaybackRate() != 1.25){
		//1.5秒以上バッファーがあれば速度を上げる
		player.setPlaybackRate(1.25);
		console.log(1.25)
	}

}

function getBufferHealth(player) {
    const stats = player.getVideoStats();
    if (!stats) {
        return 0;
    }
    const bufferRange = stats.vbu;
    if (!bufferRange) {
        return 0;
    }
    const buffer = bufferRange.split('-');
    if (buffer.length < 2) {
        return 0;
    }
    const bufferTime = Number(buffer.slice(-1)[0]);
    const currentTime = Number(stats.vct);
    if (isNaN(bufferTime) || isNaN(currentTime)) {
        return 0;
    }
    return bufferTime - currentTime;
}


function LiveBufferAndLatency(){
	player.insertAdjacentHTML("afterbegin",`<div id="live-buffer-latency" style="
    position: absolute;
    z-index: 111;
    background: #00000088;
    "></div>`)

	liveBufferLatency = document.getElementById("live-buffer-latency")
}