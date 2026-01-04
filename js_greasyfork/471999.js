// ==UserScript==
// @name         e-対戦 [e-typing]
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  e-typingに対戦機能を追加したい
// @author       Toshi
// @match        https://www.e-typing.ne.jp/app/jsa_std*trysc*
// @match        https://www.e-typing.ne.jp/app/jsa_kana*trysc*

// @exclude      https://www.e-typing.ne.jp/app/ad*
// @exclude      https://www.e-typing.ne.jp/app/*std.2*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-typing.ne.jp
// @license MIT
// @require      https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js
// @require      https://www.gstatic.com/firebasejs/10.1.0/firebase-auth-compat.js
// @require      https://www.gstatic.com/firebasejs/10.1.0/firebase-database-compat.js

// @grant unsafeWindow


// @downloadURL https://update.greasyfork.org/scripts/471999/e-%E5%AF%BE%E6%88%A6%20%5Be-typing%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/471999/e-%E5%AF%BE%E6%88%A6%20%5Be-typing%5D.meta.js
// ==/UserScript==

//localStorage内に'firebase:previous_websocket_failure'keyが存在しているとデータ取得できなくなるため、ロード時に削除。
localStorage.removeItem('firebase:previous_websocket_failure')

const firebaseConfig = {
	//テスト用データベース
/*  	apiKey: "AIzaSyARzYljiRuZCoABA32_wnuyMkjScpcZUN8",
	databaseURL: "https://e-typing-battle-fb330-default-rtdb.firebaseio.com/" */

	//本番用データベース
 	apiKey: "AIzaSyDsHiPII5dgN_AEGwOtMehyveucoF4Twvs",
	databaseURL: "https://e-typing-battle-default-rtdb.firebaseio.com"
};


class MyResult{

	constructor(){
		this.battlePlayerResultData = {}

		this.etypingPlus = ['score','level','time','typeCount','missCount','wpm','correct','latency','rkpm']
		this.normal = ['score','level','time','typeCount','missCount','wpm','correct','weakKey']
	}



	sendResult(){
		playerStateChange.update('result')

		const RESULT_DATA = document.getElementsByClassName("result_data")[0].firstElementChild.children
		const RESULT_ITEM = RESULT_DATA.length == 9 ? this.etypingPlus : this.normal
		let updates = {}
		let sendData = {}


		for(let i=0; i<RESULT_ITEM.length; i++){
			sendData[RESULT_ITEM[i]] = RESULT_DATA[i].lastElementChild.textContent
		}




		updates['/users/' + myID + '/result/'] = sendData
		firebaseDB.ref().update(updates)


		this.createBattlePlayerResultArea()
		//相手のリザルトを取得していた場合、相手のリザルトを表示
		const BATTLE_PLAYPER_RESULT = Object.keys(this.battlePlayerResultData)

		if(BATTLE_PLAYPER_RESULT.length){
				const RESULT_DATA = document.getElementsByClassName("result_data")[1].firstElementChild.children
				const RESULT_ITEM = RESULT_DATA.length == 9 ? myResult.etypingPlus : myResult.normal

				for(let i=0;i<BATTLE_PLAYPER_RESULT.length;i++){
					const INDEX = RESULT_ITEM.indexOf(BATTLE_PLAYPER_RESULT[i])

					if(INDEX >= 0){
						RESULT_DATA[INDEX].lastElementChild.textContent = this.battlePlayerResultData[BATTLE_PLAYPER_RESULT[i]]
					}
				}

			document.getElementById("prev").firstElementChild.textContent = battleUserData.data.name
			myResult.displayResultRivalInputMode()

		}

	}


	createBattlePlayerResultArea(){
		const RESULT_DATA = document.getElementsByClassName("result_data")[1].firstElementChild.children
		document.getElementById("prev").firstElementChild.textContent = '待機中'

		for(let i=0; i<RESULT_DATA.length; i++){
			RESULT_DATA[i].lastElementChild.textContent = ''
			RESULT_DATA[i].lastElementChild.style.color = '#23c21f'
		}

		if(battleArea.RTCLine.textContent == 'タイムアウトしました。'){
			battleUserData.resultTimeoutPlayer()
		}

	}


	onBattleResultDisplay(snapshot){
		const uid = snapshot._delegate.ref._path.pieces_[1];
		const Info = snapshot._delegate.ref._path.pieces_[3]
		const SnapShotValue = snapshot.val()


		myResult.battlePlayerResultData[Info] = SnapShotValue

		if(playerStateChange.prevState == 'result'){
		const RESULT_DATA = document.getElementsByClassName("result_data")[1].firstElementChild.children
		const RESULT_ITEM = RESULT_DATA.length == 9 ? myResult.etypingPlus : myResult.normal

			const INDEX = RESULT_ITEM.indexOf(Info)

			if(INDEX >= 0){
				RESULT_DATA[INDEX].lastElementChild.textContent = SnapShotValue
			}

			document.getElementById("prev").firstElementChild.textContent = battleUserData.data.name
			myResult.displayResultRivalInputMode()
		}

		battleUserData.removePlayerStateChangeEvent()
	}

		displayResultRivalInputMode(){
			const INPUT_MODE = document.getElementsByClassName("result_data")[1].getElementsByClassName("input-mode")[0]
			const MODE = battleUserData.data.mode == 'roma' ? 'ローマ字' : 'かな'

			if(INPUT_MODE){
				INPUT_MODE.lastElementChild.textContent = MODE
			}
		}

	reBuildResultAria(){

		//e-typing plus用
		document.getElementById("RTCGamePlayScene").style.marginTop = ''
		document.getElementById("RTCGamePlayScene").style.display = 'none'
		document.getElementById("battle-display-option").style.display = 'none'
		document.getElementById("comment").style.display = 'none'
		document.getElementById("result").querySelector('article').style.height = '441px'
		document.getElementById("current").style.height = '414px'
		document.getElementById("exampleList").style.height = '345px'
		document.getElementsByClassName("result_data")[0].style.height = '365px'
		document.getElementById("prev").style.height = '414px'
		document.getElementsByClassName("result_data")[1].style.height = '365px'

		for(let i=0;i<2;i++){
			document.getElementsByClassName("result_data")[i].firstElementChild.insertAdjacentHTML('beforeend',
`<li class='input-mode'><div class="data"></div></li><li class='battle-result'><div class="data"></div></li>`)
		}

		const INPUT_MODE = document.getElementsByClassName("result_data")[0].getElementsByClassName("input-mode")[0]
		const MODE = setUp.typingMode == 'roma' ? 'ローマ字' : 'かな'

		if(INPUT_MODE){
			INPUT_MODE.lastElementChild.textContent = MODE
		}
	}


	checkResultDisplay(){
		myResult.reBuildResultAria()
		myResult.sendResult()
	}



}
let myResult



class DeleteUser {

	constructor(){

	}

	userTimeoutCheck(DeleteTimeStamp){

		firebaseDB.ref('users').once('value').then(users => {

			const PLAYERS_KEY = Object.keys(users.val())
			let updates = {}

			for(let i=0;i<PLAYERS_KEY.length;i++){

				const checkID = PLAYERS_KEY[i]
				const TIMEOUT_TIME = DeleteTimeStamp - users.val()[checkID].deleteTimeStamp

				if(TIMEOUT_TIME >= 100000 || !users.val()[checkID].deleteTimeStamp){
					//50秒TimeStampの更新が無ければユーザーを削除する
					updates['/users/' + checkID] = null;
					updates['/usersState/' + checkID] = null;

				}else if(TIMEOUT_TIME >= 20000){
					//20秒TimeStampの更新が無ければタイムアウト状態にする
					updates['/usersState/' + checkID + '/state'] = "timeOut"
				}

			}

			firebaseDB.ref().update(updates);
		});
	}

}
let deleteUser = new DeleteUser()


class PlayerStateChange {

	constructor(){
		this.prevState = 'idle'
		this.scriptUpdateNotify = `<a href="https://greasyfork.org/ja/scripts/471999-e-%E5%AF%BE%E6%88%A6-e-typing/versions" style='font-weight:bold;' target="_blank">こちら</a>から最新のスクリプトに更新をお願いします`

	}


	update(state){

		if(this.prevState == 'oldVersion'){return;}

		let updates = {}

		if(state != 'afk' && state != 'timeOut'){
			this.prevState = state
		}

		updates['/usersState/' + myID + '/state'] = state;


		switch(state){
			case "oldVersion":

				const RTCLine = document.getElementsByClassName("RTCLine")[0]

				if(RTCLine){
					RTCLine.innerHTML = playerStateChange.scriptUpdateNotify
				}
				break;

			case "move":

				break;

			case "idle":

				break;

			case "preStart":
				battleUserData.removePlayerStateChangeEvent()
				battleUserData.addPlayerStateChangeEvent()


				break;

			case "matching":
				battleArea.displayReadyButton()

				break;


			case "ready":

				break;

			case "play":

				break;

			case "soloPlay":
				battleUserData.removePlayerStateChangeEvent()


				break;

			case "result":

				break;

			case "afk":

				break;

			case "timeOut":

				break;
		}

		firebaseDB.ref().update(updates)

	}

}
let playerStateChange



class MyData {

	constructor(){
		this.locationDateTimeStamp
		this.localDateTimeStamp
		this.myName
		this.UserCheckTimeCount = 0
		this.lineInput = ''
		this.clearCount = 0
		this.updateTimeInterval
		this.AFK_TIMEOUT = 60000;


		myResult = new MyResult()
		deleteUser = new DeleteUser()
		playerStateChange = new PlayerStateChange()

		this.update()
		this.loggedIn()
		this.getLocationDate().then( () => myData.startingClockTime())
	}



	update(){
		var updates = {};
		const NAME = localStorage.getItem("battleName")
		this.myName = NAME ? NAME : 'Guest'

		//ユーザーネーム更新
		updates['/usersState/' + myID + '/name'] = this.myName;
		updates['/usersState/' + myID + '/mode'] = setUp.typingMode;
		updates['/users/' + myID + '/version'] = GM_info.script.version
		updates['/users/' + myID + '/status/' + '/lineInput'] = '';
		updates['/users/' + myID + '/status/' + '/clearCount'] = 0;

		firebaseDB.ref().update(updates)
		playerStateChange.update(playerStateChange.prevState)
	}

	loggedIn(){

		document.getElementById("start_btn").style.display = 'block'
		document.getElementsByClassName("loading")[0].style.display = 'none'

		window.addEventListener('beforeunload', e => {
			playerStateChange.update('move')
			myData.resetResult()
		});

		if(window.parent.document.getElementsByClassName("pp_close").length){

			window.parent.document.getElementsByClassName("pp_close")[0].addEventListener('click',e => {
			playerStateChange.update('move')
			myData.resetResult()
		});

		}

		window.addEventListener('focus', e => {
			myData.update()
			myData.startingClockTime()
			myData.resetResult()
		});

	}

	resetResult(){

		let updates = {};
		updates['/users/' + myID + '/result/'] = ''
		updates['/usersState/' + myID + '/matchPlayerKey'] = null
		firebaseDB.ref().update(updates)

	}

	updateTimeStamp(){
		const newDate = new Date().getTime()
		var updates = {};
		const deleteTimeStamp = myData.locationDateTimeStamp + (newDate - myData.localDateTimeStamp)
		updates['/users/' + myID + '/deleteTimeStamp'] = deleteTimeStamp

		//30秒に一度、ルーム内のユーザーの存在をチェックする
		if(newDate - myData.UserCheckTimeCount >= 30000){
			myData.UserCheckTimeCount = newDate
			deleteUser.userTimeoutCheck(deleteTimeStamp)
		}

		firebaseDB.ref().update(updates);
	}


	startingClockTime(){
		//ユーザー確認用タイムスタンプを更新
		this.updateTimeStamp()

		clearInterval(this.updateTimeInterval)
		this.updateTimeInterval = setInterval(this.updateTimeStamp,5000)
	}

	async getLocationDate(){
		const resp = await fetch(window.location.href)

		//サーバー時刻のタイムスタンプ
		this.locationDateTimeStamp = await new Date(resp.headers.get("date")).getTime()
		//ローカル時刻タイムスタンプ
		this.localDateTimeStamp = new Date().getTime()


		return true
	}


}
let myData






let myID
const firebaseApp = firebase.initializeApp(firebaseConfig,"firebaseApp");
const firebaseDB = firebaseApp.database();

class LoginFirebase {

	constructor(){
		firebase.initializeApp(firebaseConfig)
		this.roginAnon()
	}


	roginAnon(){

		firebase.auth().signInAnonymously().catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;

			console.log(errorCode);
			console.log( errorMessage);
			alert("RealTimeCombatting:Firebaseのサインインに失敗しました。");
			return false;
			// ...
		});

		firebase.auth().onAuthStateChanged(function(user) {

			if (user) {
				// User is signed in.
				myID = "U"+user.uid
				console.log('!!!')

				var path = firebaseDB.ref('users/' + myID);

				path.transaction(function(currentData) {
					//ユーザー情報を更新
					myData = new MyData()
				}).then( () => loginFirebase.versionCheck());
			}
		});

	}


	versionCheck(){
		firebaseDB.ref('newVersion').once('value').then(version => {
			const newVersion = version.val()

			if(+GM_info.script.version < +newVersion){
				playerStateChange.update('oldVersion')

			}

		}).catch(error => console.log(error));
	}
}

let loginFirebase













const typingAppMod = () => {


	//タイピング画面に移動した。

		if(setUp.battleSwitch){

			battleArea = new BattleArea()
			keyJudge = new KeyJudge()


		}

}


class SetMutationObserver {

	constructor(){
		this.observer
		this.elem = document.getElementById("app")
		this.config = {
			childList: true//「子ノード（テキストノードも含む）」の変化
		};

		this.set()
		this.startObserve()
	}

	startObserve(){
		this.observer.observe(this.elem, this.config);
	}

	stopObserve(){
		this.observer.disconnect();
	}

	set(){
		this.observer = new MutationObserver(function(event){

			const add = event[0].addedNodes[0]
			const remove = event[0].removedNodes[0]

			if(remove && remove.id == 'hands'){

				if(playerStateChange.prevState == "play"){
					setMutationObserver.setResultObserver()
				}else{
					playerStateChange.update('result')
				}

				return;
			}

			if(add && add.id == 'example_container'){
				//console.log('battleAreaSetUp')

				if(!setUp.battleSwitch){
					setMutationObserver.stopObserve()
					return;
				}

				if(battleUserData && battleUserData.data){
					battleUserData.deleteBattlePlayerEvents()
				}

				myResult.battlePlayerResultData = {}
				typingAppMod()
				return;
			}
		});
	}


	setResultObserver(){
		this.result = document.getElementById("result")

		this.resultObserver = new MutationObserver(function(){
			console.log('resultDisplay')
			myResult.checkResultDisplay()
			setMutationObserver.resultObserver.disconnect();

		});

		this.resultObserver.observe(this.result, this.config);
	}

}
let setMutationObserver






class KeyJudge {

	constructor(){
		this.wordReload = false;
		this.clearLine = 0
		this.wordSendSwitch = 1
		if(keyJudge){
			keyJudge.removeEvent()
		}

		this.addEvent()
	}

	addEvent(){
		this.Event = this.wait.bind(this)
		this.playEvent = this.startSpaceKey.bind(this)
		window.addEventListener("keydown",this.Event)
		window.addEventListener("keydown",this.playEvent)
	}

	removeSpaceKeyEvent(){
		window.removeEventListener("keydown",this.playEvent)
	}

	removeEvent(){
		window.removeEventListener("keydown",this.Event)
	}


	wait(event){
		setTimeout(() => this.checkType(event))
	}

	startSpaceKey(event){
		if(event.code == 'Space' || event.code == 'Digit1' || event.code == 'Digit2' || event.code == 'Digit3' || event.code == 'Digit0' || (event.code == 'KeyL' && setUp.typingMode == "roma")){
			playerStateChange.update('soloPlay')
			this.removeSpaceKeyEvent()
			this.removeEvent()
			battleArea.displayKeyboard()


		}
	}


	judge(event , sentenceText){
		let result
		if(setUp.typingMode == "roma"){
			result = sentenceText.textContent.slice(-1).toLowerCase() == event.key ? true:false
		}else if(setUp.typingMode == "eng"){
			result = sentenceText.textContent.slice(-1).replace("␣", " ") == event.key ? true:false
		}else if(setUp.typingMode == "kana"){
			result = this.createKanaChar(event).includes(sentenceText.textContent.slice(-1))
		}
		return result;
	}

	checkType(event){
		const sentenceText = document.getElementsByClassName("entered")[setUp.enteredClass]
		let key

		if(sentenceText){
			key = this.judge(event , sentenceText)
		}

		if(!sentenceText && this.wordReload){
			this.sendWordData('')
			this.wordReload = true

			if(!sentenceText){
				this.wordReload = false
			}

		}else if(sentenceText && key){

			this.sendWordData(sentenceText.textContent)
			this.wordReload = true

			if(!sentenceText){
				this.wordReload = false
			}

		}
	}

	createKanaChar(event){
		let char = windows_keymap[event.code] ? windows_keymap[event.code] : kana_keymap[event.key];

		if(event.shiftKey){
			if(event.code == "KeyE"){char[0] = "ぃ";}
			if(event.code == "KeyZ"){char[0] = "っ";}
		}

		if(event.shiftKey && event.key === "0"){char = ["を"];}

		return char;
	}

	sendWordData(text) {

		var updates = {}
		if(this.wordSendSwitch == 1 || !text){
			this.wordSendSwitch = ''
		}else{
			this.wordSendSwitch = 1
		}

		updates['/users/' + myID + '/status/' + '/lineInput'] = text.slice(-1) + this.wordSendSwitch;

		if(!text){
			this.clearLine++
			updates['/users/' + myID + '/status/' + '/clearCount'] = this.clearLine

		}

		firebaseDB.ref().update(updates)
	}

}
let keyJudge








class BattleArea {

	constructor(){
		battleUserData = new BattleUserData()
		if(setUp.soundEffectSwitch){
			soundEffect = new SoundEffect()
		}
		playerStateChange.update('preStart')

		const RTC = document.getElementById("RTCGamePlayScene")
		if(RTC){
			RTC.remove()
			document.getElementById("battle-display-option").remove()
			document.getElementById("user-state-area").remove()
		}


		this.createArea()
		myData.resetResult()
		this.Lstart = false

		this.joinLength = 0
		this.RTCLine
		this.myDisplayOption

		this.stateName = {
			 "preStart":'対戦募集',
			 "matching":'マッチ済み',
			 "ready":'マッチ済み',
			 "play":'対戦中',
			 "result":'リザルト',
			 "oldVersion":'マッチ不可',
			 "soloPlay":'ソロプレイ',
			 "move":'離席中',
			 "idle":'離席中',
			 "afk":'離席中',
			 "timeOut":'タイムアウト'
		}
	}


	displayReadyButton(){

		const LstartButton = document.getElementById("l-ready-button")

		if(LstartButton){
			document.getElementById("l-ready-button").style.display = 'block'
		}

		document.getElementById("ready-button").style.display = 'block'
	}

	hideReadyButton(){
		const LstartButton = document.getElementById("l-ready-button")

		if(LstartButton){
			document.getElementById("l-ready-button").style.display = 'none'
		}

		document.getElementById("ready-button").style.display = 'none'
	}


	displayKeyboard(){
		document.getElementById('virtual_keyboard').style.display = 'block';
		document.getElementById('hands').style.display = 'block';
		document.getElementById('RTCGamePlayScene').style.display = 'none';
		document.getElementById("battle-display-option").style.display = 'none'
		document.getElementById("user-state-area").style.display = 'none'
	}

	hideKeyboard(){
		document.getElementById('virtual_keyboard').style.display = 'none';
		document.getElementById('hands').style.display = 'none';
		document.getElementById('RTCGamePlayScene').style.display = 'block';
		document.getElementById("battle-display-option").style.visibility = 'hidden'
		document.getElementById("user-state-area").style.display = 'none'
	}


	addTable(){
		document.getElementById('user-state-area').insertAdjacentHTML('beforeend',`<table class='user-state-table'><tbody><tr><td>現在の参加者</td></tr></tbody></table>`)
	}

	updateJoinLength(){
			const JOIN_LENGTH_ELEMENT = document.getElementById("join-length")
			if(JOIN_LENGTH_ELEMENT){
				JOIN_LENGTH_ELEMENT.textContent = battleArea.joinLength
			}
	}

	createActiveUserTable(){
		document.getElementById('RTCGamePlayScene').insertAdjacentHTML('afterend',`<div id='user-state-area'></div>`)

		this.addTable()

		firebaseDB.ref('usersState').once('value').then(usersState => {

			const USERS_STATE = usersState.val()
			const USERS_KEY = Object.keys(USERS_STATE)

			for(let i=0;i<USERS_KEY.length;i++){
				const tableClass = document.getElementsByClassName("user-state-table")
				const table = tableClass[tableClass.length-1].firstElementChild
				if(USERS_STATE[USERS_KEY[i]].name){
					if(table.children.length < 4){
						battleArea.joinLength ++
						table.insertAdjacentHTML('beforeend',`<tr id='${USERS_KEY[i]}' class='${USERS_KEY[i] == myID ? 'mine': ''}'><td class='state'>${battleArea.stateName[USERS_STATE[USERS_KEY[i]].state]}</td></tr>`)
					}else{
						battleArea.addTable()
						i--
					}
				}
			}

			battleArea.updateJoinLength()

		})

		setTimeout(() => {
			const tableClass = document.getElementsByClassName("user-state-table")
			if(tableClass[0].firstChild.children.length == 1){
				battleArea.RTCLine.innerHTML = 'データを取得できませんでした。<br>シークレットウィンドウや別のブラウザでお試しください。'
				battleArea.RTCLine.style.fontSize = 'larger'
			}
		},2000)


	}


	createArea(){
		document.getElementById('virtual_keyboard').style.display = 'none';
		document.getElementById('hands').style.display = 'none';

		document.getElementById('start_msg').insertAdjacentHTML("afterbegin" ,
`<div class="loading ready-btn" id='ready-button'>準備完了</div>
${setUp.typingMode == 'roma' ? `<div class="loading ready-btn" id='l-ready-button'>Lスタートで準備完了</div>` : ''}`)


		document.getElementById("ready-button").addEventListener('click', event => {
			event.target.style.display = 'none'
			const LstartButton = document.getElementById("l-ready-button")

			if(LstartButton){
				LstartButton.style.display = 'none'
			}

			battleArea.Lstart = false
			playerStateChange.update('ready')
			if(setUp.soundEffectSwitch){
				soundEffect.play('ready')
			}
		})

		const LstartButton = document.getElementById("l-ready-button")

		if(LstartButton){

			LstartButton.addEventListener('click', event => {
				event.target.style.display = 'none'
				document.getElementById("ready-button").style.display = 'none'
				battleArea.Lstart = true
				playerStateChange.update('ready')
				if(setUp.soundEffectSwitch){
					soundEffect.play('ready')
				}
			})

		}

		const SEARCH_PLAYER_GUIDE = playerStateChange.prevState != "oldVersion" ? `対戦相手を探しています (<span id='join-length'>0</span>人参加中)` : playerStateChange.scriptUpdateNotify;


		document.getElementById('example_container').insertAdjacentHTML('afterend',
`<div id='battle-display-option'>
<div class="display-head"><strong>表示方法</strong></div>
<div><label><input type="radio" name="layout" id="keyboard-display" ${localStorage.getItem('battle-display-option') == 'keyboard-display' || !localStorage.getItem('battle-display-option')? 'checked' : ''}>キーボード</label>
<label><input type="radio" name="layout" id="player-display" ${localStorage.getItem('battle-display-option') == 'player-display' ? 'checked' : ''}>対戦相手</label></div>
</div>
<div id="RTCGamePlayScene"><table class='user-table' rules="all" border="1"><tbody>
<tr>
<td class='user-name'></td>
<td><span  class="RTCLine" style='color:#7b7a7a;'>${SEARCH_PLAYER_GUIDE}</span></td>
<td class="InputMode"></td></tr></tbody></table></div>`)

		this.RTCLine = document.getElementsByClassName("RTCLine")[0]

		document.getElementById("battle-display-option").addEventListener('change', event => {
			localStorage.setItem('battle-display-option',event.target.id)
			battleArea.sendBattleDisplayOption(event.target.id)
		})
		this.myDisplayOption = document.querySelector("input[name='layout']:checked").id
		this.sendBattleDisplayOption(this.myDisplayOption)
		this.createActiveUserTable()
	}

	sendBattleDisplayOption(displayOption){
		let updates = {}
		updates['/usersState/' + myID + '/displayOption'] = displayOption
		this.myDisplayOption = displayOption
		firebaseDB.ref().update(updates)
	}



	addBattleStatusTable(userName,key,inputType){
		const INPUT_TYPE = inputType != 'kana' ? 'ローマ字' : 'かな'
		document.getElementsByClassName("user-name")[0].textContent = userName
		document.getElementsByClassName("InputMode")[0].textContent = INPUT_TYPE
		battleArea.RTCLine.textContent = '対戦相手の準備完了を待ってます'
		battleArea.RTCLine.insertAdjacentHTML('afterend',`<div id="battle-progress-bar"></div>`)

		document.getElementById("battle-progress-bar").style.width = (battleArea.RTCLine.parentElement.clientWidth-3) + 'px'

	}

	removeBattleStatusTable(){
		setTimeout( () => {
			if(playerStateChange.prevState == "preStart"){
				battleArea.RTCLine.textContent = '対戦相手を探しています'
			}
		},2000)
		document.getElementsByClassName("user-name")[0].textContent = ''
		document.getElementsByClassName("InputMode")[0].textContent = ''
		battleArea.RTCLine.style.color = '#7b7a7a'
		battleArea.RTCLine.textContent = '離脱しました'


		if(document.getElementById("battle-progress-bar") != null){
			document.getElementById("battle-progress-bar").remove()
		}

	}

}
let battleArea



class BattleUserData{

	constructor(){
		this.data
	}


	onUpdateUserStatus(snapshot){
		const uid = snapshot._delegate.ref._path.pieces_[1];
		const Update_Info = snapshot._delegate.ref._path.pieces_[3]
		const SnapShotValue = snapshot.val()

		switch(Update_Info){
			case "clearCount":
				document.getElementById("battle-progress-bar").style.transform = `scaleX(${(100 - (+SnapShotValue / 15 * 100))/100})`

				break;

			case "lineInput":
				if(SnapShotValue){
					battleArea.RTCLine.textContent = (battleArea.RTCLine.textContent + SnapShotValue.slice(0,1)).substr( -28, 28 );
				} else{
					battleArea.RTCLine.textContent = "";
				}
				break;
		}
	}

	findBattlePlayer(name,key,mode,state,displayOption){

		battleUserData.data = {
			name:name,
			key:key,
			mode:mode,
			display:displayOption,
			state:state
		}

		battleArea.addBattleStatusTable(battleUserData.data.name , battleUserData.data.key , battleUserData.data.mode)
		playerStateChange.update('matching')

		if(setUp.soundEffectSwitch){
			soundEffect.play('match')
		}

		let updates = {}
		updates['/usersState/' + myID + '/matchPlayerKey'] = battleUserData.data.key

		firebaseDB.ref().update(updates)

		document.getElementById("start_msg").getElementsByTagName('em')[0].textContent = 'スペースキーを押すと一人プレイで開始します'

		const userTable = document.getElementById(battleUserData.data.key)

		if(userTable){
			userTable.style.fontWeight = 'bold'
		}

	}

	addBattlePlayerEvents(){

		if(battleArea.myDisplayOption != 'keyboard-display'){
			firebaseDB.ref('users/' + battleUserData.data.key + '/status').on('child_changed', battleUserData.onUpdateUserStatus);
		}

		firebaseDB.ref('users/' + battleUserData.data.key + '/result').on('child_added', myResult.onBattleResultDisplay);
	}


	deleteBattlePlayerEvents(){
		firebaseDB.ref('users/' + battleUserData.data.key + '/status').off('child_changed');
		firebaseDB.ref('users/' + battleUserData.data.key + '/result').off('child_added');
	}

	addPlayerStateChangeEvent(){
		firebaseDB.ref('usersState/').on('child_changed', battleUserData.onChangeUserState);
		firebaseDB.ref('usersState/').on('child_removed', battleUserData.onRemoveUserState);
	}


	removePlayerStateChangeEvent(){
		firebaseDB.ref('usersState/').off('child_changed');
		firebaseDB.ref('usersState/').off('child_removed');
	}

	lostBattlePlayer(){
		this.deleteBattlePlayerEvents()
		const userTable = document.getElementById(battleUserData.data.key)

		if(userTable){
			userTable.style.fontWeight = ''
		}

		battleUserData.data = null
		battleArea.hideReadyButton()
		playerStateChange.update('preStart')
		document.getElementById("start_msg").getElementsByTagName('em')[0].textContent = 'スペースキーで開始'
		battleArea.removeBattleStatusTable()


	}


	resultTimeoutPlayer(){
		this.deleteBattlePlayerEvents()
		const RESULT_DATA = document.getElementsByClassName("result_data")[1].firstElementChild.children
		document.getElementById("prev").firstElementChild.textContent = 'タイムアウト'

		for(let i=0; i<RESULT_DATA.length; i++){
			RESULT_DATA[i].lastElementChild.textContent = '-'
			RESULT_DATA[i].lastElementChild.style.color = '#23c21f'
		}

	}

	updateUserTable(uid, name, state){
		const userTable = document.getElementById(uid)
		if(!name){return;}

		if(userTable){
			userTable.getElementsByClassName("state")[0].textContent = battleArea.stateName[state];
		}else{
			const tableClass = document.getElementsByClassName("user-state-table")
			const table = tableClass[tableClass.length-1].firstElementChild

			if(table.children.length < 4){
				battleArea.joinLength ++
				table.insertAdjacentHTML('beforeend',`<tr id='${uid}'><td class='state'>${battleArea.stateName[state]}</td></tr>`)
				battleArea.updateJoinLength()
			}else{
				battleArea.addTable()
				this.updateUserTable(uid, name, state)
			}

		}

	}

	removeUserTable(uid){
		const userTable = document.getElementById(uid)

		if(userTable){
			battleArea.joinLength --
			userTable.remove()
			battleArea.updateJoinLength()
		}
	}


	battleStart(){

		document.dispatchEvent( new KeyboardEvent("keydown",{
			// keyCode:32 スペースキー keyCode:76 Lキー
			// keyプロパティ & codeプロパティでは開始できませんでした。
			keyCode: (battleArea.Lstart ? 76 : 32)

		}))

		battleUserData.addBattlePlayerEvents()

		if(battleUserData.data.displayOption == 'keyboard-display'){
			keyJudge.removeEvent()
		}


		if(battleArea.myDisplayOption == 'keyboard-display'){
			battleArea.displayKeyboard()
		}else{
			battleArea.hideKeyboard()
		}

		battleArea.RTCLine.textContent = '';
		playerStateChange.update('play')
		keyJudge.removeSpaceKeyEvent()

	}

	rivalReady(){
		battleArea.RTCLine.style.color = ''
		battleArea.RTCLine.textContent = '準備完了';
		if(setUp.soundEffectSwitch){
			soundEffect.play('ready')
		}
	}

	onChangeUserState(snapshot){
		const uid = snapshot._delegate.ref._path.pieces_[1];
		const name = snapshot.val().name
		const state = snapshot.val().state
		const mode = snapshot.val().mode
		const displayOption = snapshot.val().displayOption
		const matchPlayerKey = snapshot.val().matchPlayerKey

		//対戦相手のstateを更新する
		if(battleUserData.data && uid == battleUserData.data.key){
			battleUserData.data.state = state;
		}

		//対戦相手のdisplayOptionを更新する
		if(battleUserData.data && uid == battleUserData.data.key){
			battleUserData.data.displayOption = displayOption;
		}

		//参加者のstateを更新する
		if(playerStateChange.prevState != "play"){
			battleUserData.updateUserTable(uid, name, state)
		}

		if(!battleUserData.data){

			//お互いに状態がpreStartのプレイヤーをマッチさせる
			if( playerStateChange.prevState == "preStart"){

				//先にマッチ画面で待機していたプレイヤー
				if(uid != myID && state == 'preStart'){
					battleUserData.findBattlePlayer(name , uid , mode, state , displayOption)
				}

				//後から入室したプレイヤー
				if(matchPlayerKey == myID && state == 'matching'){
					battleUserData.findBattlePlayer(name , uid , mode, state , displayOption)
				}

			}
		}


		if(battleUserData.data){

			if(battleUserData.data.state == 'ready' && battleUserData.data.key == uid){
				battleUserData.rivalReady()
			}

			//自分と相手が準備完了したら同時に開始。
			if( (battleUserData.data.key == uid || myID == uid) && (battleUserData.data.state == 'ready' && playerStateChange.prevState == "ready") ){
				battleUserData.battleStart()
			}

			//相手が離脱した。
			if(uid == battleUserData.data.key && (state == 'soloPlay' || state == 'idle' || state == 'timeOut' || state == 'move' || state == 'afk')){

				if(playerStateChange.prevState != "play" && playerStateChange.prevState != "result"){
					battleUserData.lostBattlePlayer()
				}else if(playerStateChange.prevState == "play"){
					battleArea.RTCLine.textContent = 'タイムアウトしました。';
					battleUserData.deleteBattlePlayerEvents()
				}else if(playerStateChange.prevState == "result"){
					battleUserData.resultTimeoutPlayer()
				}
				myData.resetResult()
			}


		}

	}

	onRemoveUserState(snapshot){
		const uid = snapshot._delegate.ref._path.pieces_[1];

		if( playerStateChange.prevState != "play"){
			battleUserData.removeUserTable(uid)
		}
	}


}
let battleUserData




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







const kana_keymap = {
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

const windows_keymap = {
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



class SetUp {

	constructor(){

		this.typingMode = 'roma'
		this.enteredClass = 2
		this.battleSwitch = true
		this.soundEffectSwitch = true

		this.checkTypingMode()
		loginFirebase = localStorage.getItem("battle-option") != "false" ? new LoginFirebase() : null
	}


	checkDisplayMenu(){
		const config = {
			childList: true//「子ノード（テキストノードも含む）」の変化
		};

		const Observe = new MutationObserver(function(event){

			setTimeout( () => {
				setUp.createMenu()
				setMutationObserver = new SetMutationObserver()
			})

			Observe.disconnect();
		});

		Observe.observe(document.getElementById("app"), config);

	}


	checkTypingMode(){

		if(location.href.match(/kana\.1/)){
			this.typingMode = "kana"
			this.enteredClass = 1
		}else if(location.href.match(/std\.2/) || location.href.match(/lstn\.4/)){
			this.typingMode = "eng"
			this.enteredClass = 1
		}else{
			this.typingMode = "roma"
			this.enteredClass = 2
		}

		this.checkDisplayMenu()
	}

	createMenu(){

		const NAME = localStorage.getItem("battleName")
		this.battleSwitch = localStorage.getItem("battle-option") == "false" ? false : true;
		this.soundEffectSwitch = localStorage.getItem("sound-option") == "false" ? false : true;


		if(!localStorage.getItem("battle-option")){
			localStorage.setItem("battle-option",'true')
		}

		if(loginFirebase){
			document.getElementById("start_btn").style.display = this.battleSwitch == false ? '' : 'none'
			document.getElementById("start_btn").insertAdjacentHTML('afterend',`<div class='loading'>対戦データベースに接続中</div>`)
		}

		this.addCss()

		const FUNC_VIEW = document.getElementById("func_view")
		setTimeout( () => FUNC_VIEW.style.height = FUNC_VIEW.clientHeight + 30 + "px", 100)
		FUNC_VIEW.insertAdjacentHTML('beforeend' ,
									 `<div id='battle-option-container'>
<label><small>対戦機能</small>
<input id="battle-option" type="checkbox" style="display:none;" ${this.battleSwitch == false ? "" : "checked"}>
<div id="battle-effect-btn" style="margin-left:4px;margin-right: 18px;" class="switch_btn"><a class="on_btn btn show">ON</a>
<a class="off_btn btn" style="display:${this.battleSwitch == false ? "block" : ""};">OFF</a></div>
</label>

<label><small>マッチ音</small>
<input id="sound-option" type="checkbox" style="display:none;" ${this.soundEffectSwitch == false ? "" : "checked"}>
<div id="sound-effect-btn" style="margin-left:4px;margin-right: 18px;" class="switch_btn"><a class="on_btn btn show">ON</a>
<a class="off_btn btn" style="display:${this.soundEffectSwitch == false ? "block" : ""};">OFF</a></div>
</label>

<input type="button" id="battle-name" value="対戦ネーム変更">
</div>`)

		if(!NAME){
			localStorage.setItem("battleName" , 'Guest')
		}


		document.getElementById("battle-name").addEventListener("click", event => {
			const NAME = window.prompt("対戦時のユーザー名を入力してください", myData.myName)

			if(NAME){
				localStorage.setItem("battleName" , NAME)
				myData.update()
			}
		})

		document.getElementById("battle-option").addEventListener("change" , event => {
			localStorage.setItem("battle-option" , event.target.checked);

			if(event.target.checked){
				document.querySelector("#battle-effect-btn .off_btn").style.display = ""
				setUp.battleSwitch = true;

				if(!loginFirebase){
					loginFirebase = new LoginFirebase()
					document.getElementById("start_btn").style.display = setUp.battleSwitch == false ? '' : 'none'
					document.getElementById("start_btn").insertAdjacentHTML('afterend',`<div class='loading'>対戦データベースに接続中</div>`)
				}

			}else{
				document.querySelector("#battle-effect-btn .off_btn").style.display = "block"
				setUp.battleSwitch = false;
			}
		})

		document.getElementById("sound-option").addEventListener("change" , event => {
			localStorage.setItem("sound-option" , event.target.checked);

			if(event.target.checked){
				document.querySelector("#sound-effect-btn .off_btn").style.display = ""
				setUp.soundEffectSwitch = true;

			}else{
				document.querySelector("#sound-effect-btn .off_btn").style.display = "block"
				setUp.soundEffectSwitch = false;
			}
		})

	}

	addCss(){

		document.getElementById("app").insertAdjacentHTML('afterend',`<style>


.loading{
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    background-color: #057fff;
    width: 160px;
    height: 45px;
    margin: 0 auto;
    text-align: center;
    line-height: 45px;
    overflow: hidden;
    border-radius: 3px;
}


#battle-option-container{
    display: flex;
    align-items: center;
    justify-content: center;
}

#battle-option-container label{
cursor: pointer;

}

#battle-name{
    width: 7rem;
    margin: 2px;
cursor: pointer;
}


.user-table{
width: 100%;
position: relative;
height: 68px;
left: 0;
right: 0;
margin: auto;
}

.user-table tr{
font-weight:bold;
height: 3rem;
}

.user-name{
    font-size: 1rem;
    width: 90px;
text-align: center;
}

.RTCLine{
max-width: 350px;
white-space: nowrap;
overflow:hidden;
width: 68%;
color:#ffd0a6;
font-size: 26px;
font-weight: normal;
}

.InputMode{
font-size: 1rem;
    width: 95px;
text-align: center;
}

.clear-line{
font-size: 1rem;
text-align: center;
}

#RTCGamePlayScene{
margin: 8px;
margin-top:1rem;
}

.display-head{
margin-left: 0.2rem;
font-size: 1rem;
margin-bottom: 0.3rem;
}

#battle-display-option{
margin-left: 4rem;
display: flex;
flex-direction: column;
}


#battle-progress-bar{
    position: absolute;
    bottom: 1px;
    background-color: #bcbcbc;
    height: 4px;
    transform-origin: left top;
}

#user-state-area{
    display: flex;
    justify-content: space-evenly;
    align-items: flex-start;
    margin-top: 1.3rem;
}


.user-state-table, .user-state-table td, .user-state-table th{
	border: 1px solid #595959;
	border-collapse: collapse;
    text-align: center;
}


.user-state-table td, .user-state-table th {
	padding: 3px;
	width: 100px;
	height: 25px;

}

.mine{
font-weight:bold;
}

.ready-btn{
cursor: pointer;
display: none;
position: absolute;
bottom: -23px;
width: 130px;
}

#ready-button{
left: 28px;
font-size: 1.1rem;
}

#l-ready-button{
right: 26px;
font-size: 0.8rem;
}
</style>`)

	}



}

const setUp = new SetUp()

const SoundURL = {
	'match':'https://dl.dropboxusercontent.com/scl/fi/14ovgqnxribt5yw0bcpzv/match.mp3?rlkey=6lsizg3oda06psbn9zoip1lyd&dl=0',
	'ready':'https://dl.dropboxusercontent.com/scl/fi/p5u2luqb36st0qt18qkfi/ready.mp3?rlkey=i1ibbnb2mh6q7fmrtjrqw2wqy&dl=0'


}
window.AudioContext = window.AudioContext || window.webkitAudioContext;
class SoundEffect {

	constructor(){
		this.match = new AudioContext();
		this.ready = new AudioContext();
		this.audioBuffer = {}

		this.loadSoundEffect('match')
		this.loadSoundEffect('ready')

	}

	loadSoundEffect(soundName){
		fetch(SoundURL[soundName]).then(function(response) {
			return response.arrayBuffer();
		}).then(function(arrayBuffer) {
			soundEffect[soundName].decodeAudioData(arrayBuffer, function(buffer) {
				soundEffect.audioBuffer[soundName] = buffer;
			});
		})
	}

	play(soundName){
		let playGain = this[soundName].createGain();
		let playSrc = this[soundName].createBufferSource();

		playSrc.buffer = this.audioBuffer[soundName];
		playSrc.connect(playGain);
		playGain.connect(this[soundName].destination);
		playGain.gain.value = 0.2
		playSrc.start(0);
	}


}
let soundEffect




