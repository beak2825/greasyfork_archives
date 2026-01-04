// ==UserScript==
// @name         esc再開
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  escを押したら再開（再生）できます
// @author       つべ
// @match       https://typing-tube.net/movie/show*
// @icon         https://www.gEoogle.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488681/esc%E5%86%8D%E9%96%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/488681/esc%E5%86%8D%E9%96%8B.meta.js
// ==/UserScript==
let is_play = false;
let addEvent_flg = false;

onPlayerStateChange = function (event) {
	switch(event.data){

		case 1: //再生(player.playVideo)
			console.log("再生 1")
            PlayerEvent.play()
            is_play = true;
			break;

		case 0: //プレイ終了(最後まで再生した)
		case 5://動画停止(途中でStopVideo)

			if(event.data == 0){
				console.log("プレイ終了 0")
                is_play = false;
			}else{
				console.log("動画停止 5")
                is_play = false;
			}

            PlayerEvent.end()
			break;

		case 2 : //一時停止(player.pauseVideo)
			console.log("一時停止 2")
            PlayerEvent.pause()
            is_play = false;
			break;

		case 3: //再生時間移動 スキップ(player.seekTo)
			console.log("シーク 3")
            PlayerEvent.seek()
			break;

		case -1: //	未スタート、他の動画に切り替えた時など
			console.log("未スタート -1")
            PlayerEvent.ready()
            is_play = false;
			break;
	}

}


if(!addEvent_flg){
addEvent_flg = true;
document.addEventListener("keydown",(e)=>{
    if(e.code === 'Escape' && !is_play) player.playVideo();
})
}