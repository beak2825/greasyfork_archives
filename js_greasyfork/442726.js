// ==UserScript==
// @name         Typingtube拡張new02
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  ・。・
// @author       つべ
// @match       https://typing-tube.net/movie/show*
// @icon         https://www.gEoogle.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466578/Typingtube%E6%8B%A1%E5%BC%B5new02.user.js
// @updateURL https://update.greasyfork.org/scripts/466578/Typingtube%E6%8B%A1%E5%BC%B5new02.meta.js
// ==/UserScript==
const settings = {
    videoBelow: true,        // 動画を下に配置
    scroll: true,     // 指定場所までエンターでスクロール
    showKPM: false,           // KPM表示
    showPossibleScore: true, // 達成可能スコア表示
};

const scrollDistance = -15;
/*指定場所までエンターでスクロールが有効のときのみ*/
/*スクロールの高さ調整。マイナスにすると上に、プラスにすると下に行きます。*/
let is_play = false;

let is_keydown_addEventListener = false;
function moveVideoBelow(){
    const YOUTUBE = document.getElementById("youtube-movie");
    const TYPING_AREA = document.getElementById("controlbox");
    YOUTUBE.parentNode.insertBefore(YOUTUBE,TYPING_AREA.nextSibling);
    /*動画下に表示  Toshi氏のを借用*/
}

function addTypingLineListContainer(){
    document.getElementsByClassName('modal-content')[1].insertAdjacentHTML('beforeend',`<div class="modal-body" id="typing-line-list-container"></div>`);
}
/*F4等で消えてしまったResult表示のdivを追加*/

function hideRanks(){
    document.getElementById('status').style.display = 'block'
    document.getElementById('ranking_roma').style.display = 'none'
    document.getElementById('ranking_kana').style.display = 'none'
    document.getElementById('ranking_flick').style.display = 'none'
};
/*エンターを押したら下の表示をstatusに切り替えてその他を表示しなくする*/

function updateKPMAndPossibleScore() {
    if (!is_play) return;

    if (settings.showKPM && !document.getElementById('line-speed-kpm')) {
        document.getElementById('line_remaining_time').insertAdjacentHTML("beforeend", ` - <span id="line-speed-kpm">0KPM</span>`);
    }

    if (settings.showPossibleScore && !document.getElementById('PS')) {
        document.getElementById('score-value').insertAdjacentHTML("afterend", `<span id="PS" style="font-size: 0.7em; color: rgb(204, 153, 204);">0</span>`);
    }

    if (settings.showKPM) {
        //document.getElementById("line-speed-kpm").textContent = `${Math.floor(line_typingspeed * 60)}KPM`;
    }

    if (settings.showPossibleScore) {
        const scoreParChar = parseLyric.scoreParChar
        const possibleScore = (200000 - ((lineResult.lostTypeLength * scoreParChar) +(typingCounter.missCount * (scoreParChar / 4)) )) / 2000
        document.getElementById("PS").textContent = Math.round(possibleScore * 100) / 100;
    }
}

function Event_func(e){
    if (is_play && is_keydown_addEventListener) {
        updateKPMAndPossibleScore();
    }

    if (e.code === 'Enter' && settings.scroll) {
        document.getElementById("tab w-100").scrollIntoView(true);
        scrollBy(0, scrollDistance);
        hideRanks();
    }

    if (e.code === 'F4') {
        addTypingLineListContainer();
    }
};

(function() {
    if (!is_keydown_addEventListener) {
        is_keydown_addEventListener = true;
        document.addEventListener('keydown', Event_func);
    }
})();
document.getElementById('restart').addEventListener('click', addTypingLineListContainer);

if (settings.videoBelow) {
    moveVideoBelow();
}


//書き換えここから
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


document.addEventListener("keydown",(e)=>{
    if(e.code === 'Escape' && !is_play) player.playVideo();
})

