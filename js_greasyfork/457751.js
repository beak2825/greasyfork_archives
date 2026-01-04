// ==UserScript==
// @name         [e-typing]累計コンボ数表示
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  e-typingで継続ノーミス記録を表示する
// @author       xyu
// @match        https://www.e-typing.ne.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-typing.ne.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457751/%5Be-typing%5D%E7%B4%AF%E8%A8%88%E3%82%B3%E3%83%B3%E3%83%9C%E6%95%B0%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/457751/%5Be-typing%5D%E7%B4%AF%E8%A8%88%E3%82%B3%E3%83%B3%E3%83%9C%E6%95%B0%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==
if(localStorage.getItem('totalCombo') == undefined){
	localStorage.setItem('totalCombo',0)
	localStorage.setItem('round',0)
	localStorage.setItem('averageWPM',0)
	localStorage.setItem('bestCombo',0)
}

let clearLineCount = 0
let typingAppModInterval
let createOptionInterval
let displayComboSwitch
let bestCombo = +localStorage.getItem('bestCombo')
let totalCombo = +localStorage.getItem("totalCombo")
let combo = 0
let wpmCountFlag = true
let scoreCheck
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
		displayComboSwitch = localStorage.getItem("combo-option") == "false" ? false : true;
		FUNC_VIEW.style.height = document.getElementById("func_view").clientHeight + 30 + "px"
		FUNC_VIEW.insertAdjacentHTML('beforeend' , `<div>
<div><label><small>累計コンボ数表示</small><input id="combo-option" type="checkbox" style="display:none;" ${displayComboSwitch == false ? "" : "checked"}><div id="combo-btn" style="margin-left:4px;" class="switch_btn"><a class="on_btn btn show">ON</a><a class="off_btn btn" style="display:${displayComboSwitch == false ? "block" : ""};">OFF</a></div></label></div>
</div>`)

		document.getElementById("combo-option").addEventListener("change" , event => {
			localStorage.setItem("combo-option" , event.target.checked);

			if(event.target.checked){
				document.querySelector("#combo-btn .off_btn").style.display = ""
				displayComboSwitch = true;
			}else{
				document.querySelector("#combo-btn .off_btn").style.display = "block"
				displayComboSwitch = false;
			}
		})
		clearInterval(createOptionInterval)
	}
}


const typingAppMod = () => {

const example_container = document.getElementById("example_container") //iframe内の要素を取得


	if(example_container){

let keyJudge = event => {

		let sentenceText = document.getElementsByClassName("entered")[enteredClass]

		if(sentenceText){

			sentenceText = document.getElementsByClassName("entered")[enteredClass].nextSibling.textContent

			let char = windows_keymap[event.code] ? windows_keymap[event.code] : kana_keymap[event.key];
			if(!char || (event.key == ' ' && typingMode != "eng")){return;}

			//正タイプ
			combo++
			updateCombo()
			if(scoreCheck){
				scoreCheck.bestScorePass()
			}
			if(sentenceText.length == 1){
				//ラインクリア
				clearLineCount++
			}
			console.log(combo)
		}else{

			const startMsg = document.getElementById("start_msg")
			const countdown = document.getElementById('countdown')
			if((startMsg || countdown) && event.key == ' '){
				totalCombo = +localStorage.getItem("totalCombo")
				updateCombo()
				document.getElementById('total-combo').textContent = totalCombo
				document.getElementById('round').textContent = localStorage.getItem("round")
				missScreenObserver()
				appObserver()
				wpmCountFlag = true
				scoreCheck = new ScoreCheck()
				document.getElementById("wpm-area").classList.add('hide')
			}
		}
}

if(displayComboSwitch){
	const width = document.getElementById("example_container").clientWidth
	const scale = document.getElementById("app").style.webkitTransform.replace(/[^\d^\.]/g,'')
	document.addEventListener("keydown",keyJudge,false)
	document.getElementById("ad_frame").style.display = 'none';
	document.getElementById("ad_frame").insertAdjacentHTML('beforebegin',
`<div id="combo-container" style="width:${width * (scale ? scale:1)}px;">
<span id="combo-area" class="area" title="最高記録：${bestCombo}コンボ"><ruby><span id="total-combo">${totalCombo}</span><rt>累計</rt></ruby>
 + <ruby><span id="combo">0</span><rt>コンボ</rt></ruby>
 = <ruby><span id="all-combo" class="${bestCombo < totalCombo ? 'gold' : ''}">${totalCombo}</span><rt>継続</rt></ruby></span>
 <span id="round-area" class="area"><span id="round">${+localStorage.getItem('round')}</span>周</span>
 <span id="wpm-area" class="hide area"><ruby><span id="average-wpm_">---</span><rt>平均WPM</rt></ruby></span></div>
	<style>
	#combo-container{
    margin-left: auto;
    margin-right: auto;
	font-weight: bold;
    font-size: 2rem;
	margin-top: 2rem;
    white-space: nowrap;
	margin-bottom: 2rem;
	}
	.area{
	padding: 0.2rem 1rem;
    background: #ff9c0091;
    border-radius: 23px;
	}
    #combo-container > span:not(:first-child){
    margin-left:1rem;
	}
	#wpm-area{
	padding-top:1rem;
	}
	#combo-area{
	padding-top:1.5rem;
	}
	#all-combo{
	font-size:2.5rem;
	}
	.hide{
    visibility: hidden;
	}
	.gold{
    color: gold;
    text-shadow:
           1px 1px 0px #000, -1px -1px 0px #000,
          -1px 1px 0px #000,  1px -1px 0px #000,
           1px 0px 0px #000, -1px  0px 0px #000,
           0px 1px 0px #000,  0px -1px 0px #000;
	}
	</style>
	`)
	window.addEventListener('beforeunload', () => {
		if(combo){
			updateTotalCombo()
			updateRoundCount()
		}
	})
	if(window.parent.document.getElementsByClassName('pp_close').length){
		window.parent.document.getElementsByClassName('pp_close')[0].addEventListener('click', () => {
			updateTotalCombo()
			updateRoundCount()
		})
	}

	window.addEventListener('resize',resize)

}

		clearInterval(typingAppModInterval)
		typingAppModInterval = null
	}

		console.log("searching for example_container")
}


function updateCombo(){
	document.getElementById('combo').textContent = combo
	document.getElementById('all-combo').textContent = totalCombo + combo
}

function updateTotalCombo(){
	localStorage.setItem("totalCombo",+localStorage.getItem("totalCombo") + combo)
	combo = 0
}

class ScoreCheck{

	bestScorePass(){
		if(bestCombo < (totalCombo + combo)){
			document.getElementById('all-combo').classList.add('gold')
			scoreCheck = null
		}
	}

}

function resetCombo(){
	combo = 0
	totalCombo = 0
	localStorage.setItem("totalCombo",0)
}

function updateRoundCount(){
	let round = +localStorage.getItem('round')
	round += Math.round((clearLineCount/15) * 10) / 10;
	localStorage.setItem("round",round)
	clearLineCount = 0
}

function updateAverageWpm(){
	setTimeout( () => {
		if(document.getElementById('result') != null){
			const results = document.getElementsByClassName("result_data")[0].firstElementChild.children
			const aveWpm = +localStorage.getItem('averageWPM')
			for(let i=0;i<results.length;i++){
				if(results[i].firstElementChild.textContent == 'WPM'){
					const wpm = +results[i].lastElementChild.textContent
					putOptionSaveData(wpm)
					getAllIndexeddbData(wpm)
				}

			}
		}else{
			updateAverageWpm()
		}
	},100)

}

function reset(){

	if(bestCombo < (totalCombo + combo)){
		bestCombo = (totalCombo + combo)
		localStorage.setItem('bestCombo',totalCombo + combo)
		document.getElementById('combo-area').title = `最高記録：${bestCombo}コンボ`
	}
	document.getElementById('all-combo').classList.remove('gold')
	resetCombo()
	updateCombo()
	clearData()
	document.getElementById('total-combo').textContent = totalCombo
	localStorage.setItem("round",0)
	clearLineCount = 0
	document.getElementById('round').textContent = 0
	wpmCountFlag = false
	scoreCheck = new ScoreCheck()
}


const createEventInTypingApp = (() => {

	// https://www.e-typing.ne.jp/app/jsa_std/typing.asp タイピング画面のiframe URL
	if( location.href.match(/app\/jsa_/)){

		typingAppModInterval = setInterval(typingAppMod , 50)
		createOptionInterval = setInterval(createOption , 100)
	}

})()

function resize(){
	if(document.getElementById("example_container") == null){return;}
	const width = document.getElementById("example_container").clientWidth
	const scale = document.getElementById("app").style.webkitTransform.replace(/[^\d^\.]/g,'')
	document.getElementById('combo-container').style.width = (width * (scale ? scale:1)) + "px"
}

function missScreenObserver(){

		const target = document.getElementById('miss_type_screen'); // body要素を監視
		const observer_a = new MutationObserver(function (mutations) {
			// observer.disconnect(); // 監視を終了
			if(combo){
				reset()
			}
		});

		// 監視を開始
		observer_a.observe(target, {
        attributes: true // 属性変化の監視
		});

}


function appObserver(){

		const target = document.getElementById('app'); // body要素を監視
		const observer_b = new MutationObserver(function (mutations) {
			observer_b.disconnect(); // 監視を終了
			updateTotalCombo()
			updateRoundCount()
			if(wpmCountFlag){
				updateAverageWpm()
			}
		});

		// 監視を開始
		observer_b.observe(target, {
        childList: true
		});

}



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



let db;
let indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
let OptionDatabaseObject = {}
const STORE_NAME = "wpmDB";
const STORE_KEYPATH = ["wpm"];

//filterDBにアクセス
(function accessIndexedDB(){
	const OPEN_REQUEST = indexedDB.open(STORE_NAME, 1.0);

	//データベースストア新規作成。(初回アクセス時)
	OPEN_REQUEST.onupgradeneeded = function(event) {
		// データベースのバージョンに変更があった場合(初めての場合もここを通ります。)
		db = event.target.result;
		const CREATE_filterList = db.createObjectStore("wpm", { keyPath:STORE_KEYPATH[0]});
  }
	//データベースストアアクセス成功時。
	OPEN_REQUEST.onsuccess = function(event) {
		db = event.target.result;
	}
})();


function getAllIndexeddbData(wpm) {
	//トランザクション
	var transaction = db.transaction(STORE_KEYPATH, 'readonly');
	//オブジェクトストアにアクセスします。
	var listObjectStore = transaction.objectStore(STORE_KEYPATH[0]);
	//全件取得
	var listRequest = listObjectStore.getAllKeys()
	//取得が成功した場合の関数宣言
	listRequest.onsuccess = function (event) {
	  const result = event.currentTarget.result
	  let sum = result.reduce(function (acc, cur) {
		  return acc + cur;
	  });
		document.getElementById("average-wpm_").textContent = ((sum+wpm) / (result.length+1)).toFixed(2)
		document.getElementById("wpm-area").classList.remove('hide')
	};
  }

//データを保存
function putOptionSaveData(Data){
	const SEND_DATA = {[STORE_KEYPATH[0]] : Data};
	const OPEN_REQ = window.indexedDB.open(STORE_NAME);

	OPEN_REQ.onsuccess = function(event){
		var db = event.target.result;
		var trans = db.transaction(STORE_KEYPATH[0], 'readwrite');
		var store = trans.objectStore(STORE_KEYPATH[0]);
		var putReq = store.put(SEND_DATA);
	}
}

//削除
function clearData() {
  // open a read/write db transaction, ready for clearing the data
  const transaction = db.transaction(STORE_KEYPATH, "readwrite");

  // create an object store on the transaction
  const objectStore = transaction.objectStore(STORE_KEYPATH[0]);

  // Make a request to clear all the data out of the object store
  const objectStoreRequest = objectStore.clear();

  objectStoreRequest.onsuccess = (event) => {
    // report the success of our request
  };
};