// ==UserScript==
// @name         [e-typing]リトライ高速化
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  e-typingでEscキーを入力後、即時Rキーを有効化
// @author       Toshi
// @match        https://www.e-typing.ne.jp/*
// @match        https://www.e-typing.ne.jp/e-typing.ne.jp/app/standard.asp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-typing.ne.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466183/%5Be-typing%5D%E3%83%AA%E3%83%88%E3%83%A9%E3%82%A4%E9%AB%98%E9%80%9F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/466183/%5Be-typing%5D%E3%83%AA%E3%83%88%E3%83%A9%E3%82%A4%E9%AB%98%E9%80%9F%E5%8C%96.meta.js
// ==/UserScript==

let romaMode = document.title.match(/ローマ字/) ? true : false;

if(!location.href.match("https://www.e-typing.ne.jp/app") ){
	sessionStorage.setItem("romaMode", romaMode);
	}

let resultInterval
let createOptionInterval
let disable



const createOption = () => {
console.log("createOption")
const FUNC_VIEW = document.getElementById("func_view")
	if(FUNC_VIEW){
//		romaMode = sessionStorage.getItem("romaMode") != "false" ? true : false;
		disable = localStorage.getItem("disable-option") == "false" ? false : true;

	FUNC_VIEW.style.height = romaMode ? "50px" : "54px"
		FUNC_VIEW.insertAdjacentHTML('beforeend' , `<div><label><small>即時リトライモードを有効化</small><input id="disable-option" type="checkbox" style="display:none;" ${disable == false ? "" : "checked"}><div id="disable-btn" style="margin-left:4px;" class="switch_btn"><a class="on_btn btn show">ON</a><a class="off_btn btn" style="display:${disable == false ? "block" : ""};">OFF</a></div></label></div>
</div>`)

		document.getElementById("disable-option").addEventListener("change" , event => {
			localStorage.setItem("disable-option" , event.target.checked);

			if(event.target.checked){
				document.querySelector("#disable-btn .off_btn").style.display = ""
				disable = true;
			}else{
				document.querySelector("#disable-btn .off_btn").style.display = "block"
				disable = false;
			}
		})

		clearInterval(createOptionInterval)
	}
}

const clickReplayBtn = () => {
	console.log("clickReplayBtn")
	// document.getElementById("replay_btn") {結果画面のもう一度ボタン要素}
	const RETRY_BUTTON = document.getElementById("replay_btn")

	// リトライ処理。
	if(RETRY_BUTTON != null){
        //リザルト画面でRキー押下でもう一回ボタンをクリック
        window.addEventListener("keydown", e=> {
        if(e.code == 'KeyR'){RETRY_BUTTON.click()};
        });

		clearInterval(resultInterval)
		resultInterval = null
	}

}



/**
 * e-typingの埋め込みタイピングApp内にkeydownイベントを追加します。
 */


const createKeydownEventInTypingApp = (() => {

	// https://www.e-typing.ne.jp/app/jsa_std/typing.asp タイピング画面のiframe URL
	if( location.href.match("https://www.e-typing.ne.jp/app/jsa_") ){

		createOptionInterval = setInterval(createOption , 50)

		window.addEventListener("keydown", event => {

			// document.getElementById("miss_type_screen") {タイピングワードが表示される要素}
			// document.getElementById("miss_type_screen") 要素が存在する場合のみ即時リトライを適用。(打ち切り時の結果画面等では無効化。)
			if(!resultInterval && disable && event.key == "Escape"&& document.getElementById("exampleText") != null && document.getElementById("miss_type_screen") != null){
					// Escキー入力後にもう一度ボタンが表示されるまでにラグがあるのでsetTimeoutで調整。
					resultInterval = setInterval(clickReplayBtn , 50)
			}
		},true)

	}

})()