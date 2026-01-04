// ==UserScript==
// @name         [e-typing]打鍵音の追加 (ログアウト専用)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  e-typingに打鍵音を追加したい
// @author       xyu
// @match        https://www.e-typing.ne.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-typing.ne.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452331/%5Be-typing%5D%E6%89%93%E9%8D%B5%E9%9F%B3%E3%81%AE%E8%BF%BD%E5%8A%A0%20%28%E3%83%AD%E3%82%B0%E3%82%A2%E3%82%A6%E3%83%88%E5%B0%82%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/452331/%5Be-typing%5D%E6%89%93%E9%8D%B5%E9%9F%B3%E3%81%AE%E8%BF%BD%E5%8A%A0%20%28%E3%83%AD%E3%82%B0%E3%82%A2%E3%82%A6%E3%83%88%E5%B0%82%E7%94%A8%29.meta.js
// ==/UserScript==
window.AudioContext = window.AudioContext || window.webkitAudioContext;
let key_type = new AudioContext();
let clear_type = new AudioContext();
let audioBuffer = {}

		fetch("https://dl.dropboxusercontent.com/s/ffeunovtfylnlsy/key_type.mp3?dl=0").then(function(response) {
			return response.arrayBuffer();
		}).then(function(arrayBuffer) {
			key_type.decodeAudioData(arrayBuffer, function(buffer) {
				audioBuffer.KeyType = buffer;
			});
		})
		fetch("https://dl.dropboxusercontent.com/s/cbwfyhbs8fmkg5d/clear_type.mp3?dl=0").then(function(response) {
			return response.arrayBuffer();
		}).then(function(arrayBuffer) {
			clear_type.decodeAudioData(arrayBuffer, function(buffer) {
				audioBuffer.ClearType = buffer;
			});
		})
function key_type_play(){
	let key_type_gain = key_type.createGain();
	let key_type_source = key_type.createBufferSource();
	key_type_source.buffer = audioBuffer.KeyType;
	key_type_source.connect(key_type_gain);
	key_type_gain.connect(key_type.destination);
			key_type_gain.gain.value = 70/100

	key_type_source.start(0,0.0005);
}
function clear_type_play(){
	let clear_type_gain = clear_type.createGain();
	let clear_type_source = clear_type.createBufferSource();
	clear_type_source.buffer = audioBuffer.ClearType;
	clear_type_source.connect(clear_type_gain);
	clear_type_gain.connect(clear_type.destination);
	clear_type_gain.gain.value = 70/100

	clear_type_source.start(0);
}


let typingAppModInterval
let createOptionInterval

let wordReload = false
let soundEffectSwitch = true
let typingMode = "roma"
let enteredClass = 2
if(location.href.match(/kana\.1/)){
	typingMode = "kana"
	enteredClass = 1
}else if(location.href.match(/std\.2/) || location.href.match(/lstn\.4/)){
	typingMode = "eng"
	enteredClass = 1
}else{
	typingMode = "roma"
	enteredClass = 2
}

const createOption = () => {
console.log("createOption")
const FUNC_VIEW = document.getElementById("func_view")
const DISABLE_OPTION = document.getElementById("disable-option")
	if(FUNC_VIEW){
		soundEffectSwitch = localStorage.getItem("sound-effect-option") == "false" ? false : true;
		FUNC_VIEW.style.height = document.getElementById("func_view").clientHeight + 30 + "px"
		FUNC_VIEW.insertAdjacentHTML('beforeend' , `<div>
<div><label><small>打鍵音</small><input id="sound-effect-option" type="checkbox" style="display:none;" ${soundEffectSwitch == false ? "" : "checked"}><div id="sound-effect-btn" style="margin-left:4px;" class="switch_btn"><a class="on_btn btn show">ON</a><a class="off_btn btn" style="display:${soundEffectSwitch == false ? "block" : ""};">OFF</a></div></label></div>
</div>`)

		document.getElementById("sound-effect-option").addEventListener("change" , event => {
			localStorage.setItem("sound-effect-option" , event.target.checked);

			if(event.target.checked){
				document.querySelector("#sound-effect-btn .off_btn").style.display = ""
				soundEffectSwitch = true;
			}else{
				document.querySelector("#sound-effect-btn .off_btn").style.display = "block"
				soundEffectSwitch = false;
			}
		})
		clearInterval(createOptionInterval)
	}
}


const typingAppMod = () => {

const example_container = document.getElementById("example_container") //iframe内の要素を取得


	if(example_container){

let keyJudge = event => {
	setTimeout( () => {
		const sentenceText = document.getElementsByClassName("entered")[enteredClass]
		let judge_key
		if(sentenceText){
			if(typingMode == "roma"){
				judge_key = sentenceText.textContent.slice(-1).toLowerCase() == event.key ? true:false
			}else if(typingMode == "eng"){
				judge_key = sentenceText.textContent.slice(-1).replace("␣", " ") == event.key ? true:false
			}else if(typingMode == "kana"){
let kana_keymap = {
					0: ["わ"],
					1: ["ぬ"],
					"!": ["ぬ"],
					2: ["ふ"],
					3: ["あ"],
					4: ["う"],
					5: ["え"],
					6: ["お"],
					7: ["や"],
					8: ["ゆ"],
					9: ["よ"],
					"-": ["ほ","-"],
					"q": ["た"],
					"Q": ["た"],
					"w": ["て"],
					"W": ["て"],
					"e": ["い"],
					"E": ["い"],
					"r": ["す"],
					"R": ["す"],
					"t": ["か"],
					"T": ["か"],
					"y": ["ん"],
					"Y": ["ん"],
					"u": ["な"],
					"U": ["な"],
					"i": ["に"],
					"I": ["に"],
					"o": ["ら"],
					"O": ["ら"],
					"p": ["せ"],
					"P": ["せ"],
					"a": ["ち"],
					"A": ["ち"],
					"s": ["と"],
					"S": ["と"],
					"d": ["し"],
					"D": ["し"],
					"f": ["は"],
					"F": ["は"],
					"g": ["き"],
					"G": ["き"],
					"h": ["く"],
					"H": ["く"],
					"j": ["ま"],
					"J": ["ま"],
					"k": ["の"],
					"K": ["の"],
					"l": ["り"],
					"L": ["り"],
					"z": ["つ"],
					"Z": ["つ"],
					"x": ["さ"],
					"X": ["さ"],
					"c": ["そ"],
					"C": ["そ"],
					"v": ["ひ"],
					"V": ["ひ"],
					"b": ["こ"],
					"B": ["こ"],
					"n": ["み"],
					"N": ["み"],
					"m": ["も"],
					"M": ["も"],
					",": ["ね",","],
					"<": ["、"],
					".": ["る","."],
					">": ["。"],
					"/": ["め","/"],
					"?": ["・"],
					"#": ["ぁ"],
					"$": ["ぅ"],
					"%": ["ぇ"],
					"'": ["ゃ","’","'"],
					"^": ["へ"],
					"~": ["へ"],
					"&": ["ぉ"],
					"(": ["ゅ"],
					")": ["ょ"],
					'|': ["ー"],
					"_": ["ろ"],
					"=": ["ほ"],
					"+": ["れ"],
					";": ["れ"],
					'"': ["ふ","”","“","\""],
					"@": ["゛"],
					'`': ["゛"],
					"[": ["゜"],
					']': ["む"],
					"{": ["「"],
					'}': ["」"],
					":": ["け"],
					"*": ["け"]
				}
let windows_keymap = {
					'IntlYen': ["ー","￥","\\"],
					"IntlRo": ["ろ","￥","\\"],
					"Space": [" "],
					"Numpad1": [],
					"Numpad2": [],
					"Numpad3": [],
					"Numpad4": [],
					"Numpad5": [],
					"Numpad6": [],
					"Numpad7": [],
					"Numpad8": [],
					"Numpad9": [],
					"Numpad0": [],
					"NumpadDivide": [],
					"NumpadMultiply": [],
					"NumpadSubtract": [],
					"NumpadAdd": [],
					"NumpadDecimal": []
				}
				let char = windows_keymap[event.code] ? windows_keymap[event.code] : kana_keymap[event.key];
				if(event.shiftKey){
					if(event.code == "KeyE"){char[0] = "ぃ";}
					if(event.code == "KeyZ"){char[0] = "っ";}

					//ATOK入力 https://support.justsystems.com/faq/1032/app/servlet/qadoc?QID=024273
					if(event.code == "KeyV"){char.push("ゐ","ヰ")}
					if(event.code == "Equal"){char.push("ゑ","ヱ")}
					if(event.code == "KeyT"){char.push("ヵ")}
					if(event.code == "Quote"){char.push("ヶ")}
					if(event.code == "KeyF"){char.push("ゎ")}
				}
				if(event.shiftKey && event.key === "0"){char = ["を"];}
				judge_key = char.includes(sentenceText.textContent.slice(-1))
			}
		}
		if(event.key == "Escape"){
			wordReload = false
		}
		if(!sentenceText && wordReload){
			clear_type_play()
			wordReload = true
			if(!sentenceText){
				wordReload = false
			}
		}else if(sentenceText && judge_key){
			key_type_play()
			wordReload = true
			if(!sentenceText){
				wordReload = false
			}
		}
	},0)
}
if(soundEffectSwitch){
	document.addEventListener("keydown",keyJudge,false)
}

		clearInterval(typingAppModInterval)
		typingAppModInterval = null
	}

		console.log("searching for example_container")
}





const createEventInTypingApp = (() => {

	// https://www.e-typing.ne.jp/app/jsa_std/typing.asp タイピング画面のiframe URL
	if( location.href.match(/app\/jsa_.*u=&.*/)){

		typingAppModInterval = setInterval(typingAppMod , 50)
		createOptionInterval = setInterval(createOption , 100)

/*
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
*/
	}

})()

