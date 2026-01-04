// ==UserScript==
// @name         [e-typing]埋め込み要素内でJS実行 (雛形)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  e-typingの埋め込みframe内でJSを実行する
// @author       You
// @match        https://www.e-typing.ne.jp/*
// @match        https://www.e-typing.ne.jp/e-typing.ne.jp/app/standard.asp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-typing.ne.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451003/%5Be-typing%5D%E5%9F%8B%E3%82%81%E8%BE%BC%E3%81%BF%E8%A6%81%E7%B4%A0%E5%86%85%E3%81%A7JS%E5%AE%9F%E8%A1%8C%20%28%E9%9B%9B%E5%BD%A2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/451003/%5Be-typing%5D%E5%9F%8B%E3%82%81%E8%BE%BC%E3%81%BF%E8%A6%81%E7%B4%A0%E5%86%85%E3%81%A7JS%E5%AE%9F%E8%A1%8C%20%28%E9%9B%9B%E5%BD%A2%29.meta.js
// ==/UserScript==

let typingAppModInterval


const typingAppMod = () => {

const example_container = document.getElementById("example_container") //iframe内の要素を取得


	if(example_container){
		//ココに処理を追加
		document.querySelector("#example_container").style.height = "100%"
		document.querySelector("#hands").remove()



		clearInterval(typingAppModInterval)
		typingAppModInterval = null
	}

		console.log("searching for example_container")
}





const createEventInTypingApp = (() => {

	// https://www.e-typing.ne.jp/app/jsa_std/typing.asp タイピング画面のiframe URL
	if( location.href.match("https://www.e-typing.ne.jp/app/jsa_") ){

		typingAppModInterval = setInterval(typingAppMod , 50)

		//タイピング中にEscキーを押したらtypingAppModを実行
		window.addEventListener("keydown", event => {
			// document.getElementById("miss_type_screen") {タイピングワードが表示される要素}
			// document.getElementById("miss_type_screen") 要素が存在する場合のみ即時リトライを適用。(打ち切り時の結果画面等では無効化。)
			if(!typingAppModInterval && event.key == "Escape" && document.getElementById("exampleText") != null && document.getElementById("miss_type_screen") != null){
				typingAppModInterval = setInterval(typingAppMod , 50)
			}
			if(!typingAppModInterval && event.code == "KeyR" && document.getElementById("replay_btn") != null){
				typingAppModInterval = setInterval(typingAppMod , 50)
			}
		},true)

		//打ち切り時にやり直しボタン or ミスだけボタンをクリックしたらtypingAppModを実行
		window.addEventListener("click", event => {

			if(!typingAppModInterval && event.target.id == "replay_btn" || event.target.id == "miss_only_btn"){
				typingAppModInterval = setInterval(typingAppMod , 50)
			}
		},true)

	}

})()
