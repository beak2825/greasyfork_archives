// ==UserScript==
// @name       　選曲ページ用RealTimeCombatting[Typing-Tube]
// @namespace    http://tampermonkey.net/
// @version      2.11.0
// @description  typing-tube.netにて、リアルタイムでの対戦を実現したい。
// @author       Spacia(の)
// @match        https://typing-tube.net/user*
// @grant        none
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-auth.js
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-database.js
// @downloadURL https://update.greasyfork.org/scripts/447020/%E9%81%B8%E6%9B%B2%E3%83%9A%E3%83%BC%E3%82%B8%E7%94%A8RealTimeCombatting%5BTyping-Tube%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/447020/%E9%81%B8%E6%9B%B2%E3%83%9A%E3%83%BC%E3%82%B8%E7%94%A8RealTimeCombatting%5BTyping-Tube%5D.meta.js
// ==/UserScript==


/////////////////////////////////////////////////////////////////////////////////////////////////
//
//firebase Project ? https://console.firebase.google.com/u/0/project/realtimecombatting-typingtube/overview
//Greasy Fork https://greasyfork.org/ja/scripts/391474-realtimecombatting-typing-tube
//テスト譜面 https://typing-tube.net/movie/show/28719
//
//  <参考サイト>
//Firebase初期化方法-Qiita  https://qiita.com/kohashi/items/43ea22f61ade45972881
//js内部から他scriptの読み込み　https://teratail.com/questions/41023
//クッキーの使用方法　https://so-zou.jp/web-app/tech/programming/javascript/cookie/
//一意な文字列の作成 https://qiita.com/coa00/items/679b0b5c7c468698d53f
//ポップアップ作成 https://tech-dig.jp/js-modal/
//JavaScriptでHTMLタグを削除する正規表現 https://qiita.com/miiitaka/items/793555b4ccb0259a4cb8
//Divにイベントハンドラを追加 https://blog.keisuke11.com/webdesign/div-watch-js/
//下から出現する固定メニュー http://know-garden.com/%e4%b8%8b%e9%83%a8%e5%9b%ba%e5%ae%9a%e3%83%a1%e3%83%8b%e3%83%a5%e3%83%bc%e3%81%ae%e4%bd%9c%e3%82%8a%e6%96%b903%ef%bc%88%e6%a0%bc%e7%b4%8d%e5%bc%8f%ef%bc%9a%e7%b8%a6%e5%87%ba%e7%8f%be%ef%bc%89/
//Youtube API reference https://developers.google.com/youtube/iframe_api_reference#Playback_controls
//JavaScriptで連想配列に対してforEachループを使う方法 https://pisuke-code.com/javascript-dictionary-foreach/
//
/////////////////////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @note RealTimeCombatting ON/OFF 切り替えスイッチをヘッダーに追加　ここから ---
*/


let RTC_Switch = sessionStorage.getItem("RTC_Switch") == "true"
const MOBILE_FLAG = navigator.userAgent.match(/iPhone|Android.+Mobile/)
const PHONE_TABLET_FLAG = navigator.userAgent.match(/(iPhone|iPod|iPad|Android.*Mobile)/i);


//if(!MOBILE_FLAG){
document.querySelector('[data-sa-action="search-open"]').parentNode.insertAdjacentHTML('afterend',`<li id="RTC_Switch"><a class="" id="notify_room" data-sa-action="combat"><span id="combat-mode-on-off" style="
    color:`+(RTC_Switch ? "gold" : "")+`;
　　">`+(RTC_Switch ? "ON" : "OFF")+`</span>
 <i class="fas fa-users"></i></a></li>`)


//ON/OFF 切り替えスイッチクリック時イベント
document.getElementById("RTC_Switch").addEventListener("click",function RTC_Switcher(event){
	if(sessionStorage.getItem("RTC_Switch") == "true"){

		sessionStorage.setItem("RTC_Switch", "false")
		document.getElementById("RTC_Switch").removeEventListener("click",RTC_Switcher)
		if(isEnter){
			ExitRoom()
		}
		location.reload();
	}else if(sessionStorage.getItem("RTC_Switch") == "false" || !sessionStorage.getItem("RTC_Switch")){
		sessionStorage.setItem("RTC_Switch", "true")
		document.getElementById("RTC_Switch").removeEventListener("click",RTC_Switcher)
		location.reload();
	}
})


AddStyles();
//}
/**
 *@note RealTimeCombatting切り替えスイッチをヘッダーに追加　ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////



(function() {
	'use strict';
	if(RTC_Switch || location.href.indexOf("https://typing-tube.net/movie")<0){
		InitFirebase();
	}
})();



/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note Firebase初期化ここから ---
*/


/**
*@Description Firebaseの初期化作業、SDKの読み込み後、使用する前に呼び出す。
*@param callback
*/


function InitFirebase(){

	// Your web app's Firebase configuration
	var firebaseConfig = {
		/*
		RealTimeCombatting"TypingTube" データベース(非公式)
		https://console.firebase.google.com/u/1/project/realtimecombatting-typingtube/database/realtimecombatting-typingtube/data
		authDomain: "realtimecombatting-typingtube.firebaseapp.com",
        projectId: "realtimecombatting-typingtube",
        storageBucket: "realtimecombatting-typingtube.appspot.com",
        messagingSenderId: "62043628528",
        appId: "1:62043628528:web:3ab013403b1f3ed9383335",
        measurementId: "G-1P2BBSLWYW",
		*/
		//apiKey: "AIzaSyACA8ARVyv9vawk9BAfoaKg5Cl8dsNGItM",
		//databaseURL: "https://realtimecombatting-typingtube.firebaseio.com"

		/*
		TypingTube データベース(公式)
		*/
		//authDomain: "api-project-959901312274.firebaseapp.com",

		//projectId: "api-project-959901312274",
		//storageBucket: "api-project-959901312274.appspot.com",
		//messagingSenderId: "959901312274",
		//appId: "1:959901312274:web:f78a1d9339b573bbdc7fcb",
		//measurementId: "G-04HLEDZM",

		apiKey: "AIzaSyDAsof24N3Ikx3vpKegkmhVYo6j1ejx2Ss",
		databaseURL: "https://typingtube.firebaseio.com"

	};

	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);

	if(location.href.indexOf("https://typing-tube.net/movie/") == -1){
		RoginAnon();
	}
}

/**
*@note Firebase初期化ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note ログイン関係 ここから---
*/


/**
 * TypingTubeのサーバー時刻を取得します。取得したサーバー時刻を一定間隔で更新し、ログイン or ログアウトの状態をユーザー間で確認し合います。
 * @param LocationDateTimeStamp {number} サーバー時刻のタイムスタンプ
 * @param LocalDateTimeStamp {number} サーバー時刻を取得出来たときのローカル時刻のタイムスタンプ
 */


let LocationDateTimeStamp
let LocalDateTimeStamp
const GetLocationDate = async () => {
	const resp = await fetch(window.location.href)
	//サーバー時刻のタイムスタンプ
	LocationDateTimeStamp = await new Date(resp.headers.get("date")).getTime()
	//ローカル時刻タイムスタンプ
	LocalDateTimeStamp = new Date().getTime()

	//LocationDateTimeStamp + (new Date().getTime() - LocalDateTimeStamp)
	//サーバー時刻のタイムスタンプ + (現在のローカル時刻 - ローカル時刻タイムスタンプ)
	//上記の計算で環境の違いでズレない時刻を取得

	////////////////////////////////////////////////////////////////////

	//サーバー時刻取得後、現在ログインしていない部屋とユーザー情報を削除
	deleteIdlePlayerAndRoom();
	return true
}


/*
*@note サーバー時刻を取得 ここまで---
**/





/**
*@*(F5時)ユーザー&ルーム存在確認 ここから---
*/


/**
*@Description (F5時)1分以上更新されていない部屋&人データを削除
*/

const TIME_FOR_DELETE = 60000;

function deleteIdlePlayerAndRoom(){

	const nowTime = LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp)

	firebase.database().ref('users/').once('value').then(users => {

		firebase.database().ref('rooms/').once('value').then(rooms => {

			//ルーム有り
			if(rooms.val() != null){

				//現在ログインしていない人と部屋の削除
				Object.keys(rooms.val()).forEach(function(roomID){
					const roomInfo = rooms.val()[roomID];

					//ユーザーが存在しない部屋を削除
					if(!roomInfo.users){
						ForcePlayerDelete(null ,roomID)
						return;
					}

					//部屋にユーザーがいた場合の処理
					inRoomUserDelete(roomInfo , users.val() ,nowTime)
				});

			}
			//ユーザー有り
			if(users.val() != null){

				//その他の人の削除
				Object.keys(users.val()).forEach(function(userID){

					const PlayerTimeStamp = users.val()[userID].DeletetimeStamp;

					if(!PlayerTimeStamp){
						var updates = {};
						updates['/users/' + userID + '/DeletetimeStamp'] = nowTime
						firebase.database().ref().update(updates);
					}

					//60秒以上更新されていないユーザーを削除
					if(nowTime > TIME_FOR_DELETE + PlayerTimeStamp){
						ForcePlayerDelete(userID);
					}

				});

			}


		});
	});
}


/**
*@*(F5時)1分以上更新されていない部屋内の人データを削除
*/
function inRoomUserDelete(roomInfo,users,nowTime){

	Object.keys(roomInfo.users).forEach(function(userID){

		//部屋内のログアウトしているユーザーを削除
		if(users[userID] == null){
			ForcePlayerDelete(userID, roomID);
			return;
		}

		//60秒以上更新されていないユーザーを削除
		const PlayerTimeStamp = userID != myID ? users[userID].DeletetimeStamp : nowTime
		if(nowTime > TIME_FOR_DELETE + PlayerTimeStamp){
			ForcePlayerDelete(userID, roomID);
		}
	});

}



/*
*@note サーバー時刻を取得 ここまで---
**/







/**
*@Description　自分のユーザーデータを送信する
*/
function myUserDataUpdate(){
	//アイコンがされている場合はTypingTubeのユーザーID{Number}を取得する
	const USER_IMG = document.getElementsByClassName("user__img")[0]
	var updates = {};

	if(USER_IMG != null){
		updates['/users/' + myID + '/img'] = USER_IMG.getAttribute("alt")
	}

	//ユーザーネーム更新
	updates['/users/' + myID + '/name'] = userName;

	//ユーザーの状態を更新
	if(location.href.indexOf("https://typing-tube.net/movie")==0 && player.getVideoData().title == ""){
		//再生不可
		updates['/users/' + myID + '/state'] = prevState = "not_playable";
	}else{
		updates['/users/' + myID + '/state'] = prevState = "idle";
	}


	firebase.database().ref().update(updates)
}


/**
*@Description　キックされた人を判別するIPアドレスを取得
*/
function getIPaddress(){
	//一度取得していたらhttps://ipinfo.ioに接続しない。
	myIP = localStorage.getItem("IPaddress")

	if(!myIP){
		fetch('https://ipinfo.io?callback').then(res => res.json()).then(json => {
			myIP = md5(json.ip)
			localStorage.setItem("IPaddress",md5(json.ip))
		});
	}
}


/**
*@Description　動画一覧ページでオープン部屋が存在するときに点滅で通知する
*/
function checkOpenRoom(){

	firebase.database().ref('rooms').once('value').then(room => {
		if(location.href.indexOf("https://typing-tube.net/movie")<0&&room.val()){
			const roomCheck = (_roomID) => _roomID.length == 14;
			const ROOMS_ID = Object.keys(room.val());

			if(ROOMS_ID.some(roomCheck)){
				document.getElementById("notify_room").classList.add("top-nav__notify_room");
			}
		}
	})

}





var userName;
var myID;
var myIP;
var prevTS = new Date().getTime()
var playing = false;
/**
*@Description　ユーザの匿名ログイン
*@return bool  true:ログインに成功
*/
function RoginAnon(){

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

			if(RTC_Switch){

				//Firebaseで使用するuserID、ユーザーネーム取得
				myID = "U"+user.uid;
				userName = document.getElementsByClassName("user__name")[0].textContent;

				//IPアドレス取得(一度取得していたら取得しない)
				getIPaddress()

				var path = firebase.database().ref('users/' + myID);

				path.transaction(function(currentData) {
					//ユーザー情報を更新
					myUserDataUpdate()

					//対戦用のデータ読み込み + 対戦用の表示領域を作成。
					createRTC();
				});

			}else{
				//部屋が存在すれば、動画一覧ページで通知する
				GetLocationDate().then(checkOpenRoom)
			}
			// ...
		} else {
			// User is signed out.
			// ...
			var _path = firebase.database().ref('users/' + myID);
			if(_path.name != null){
				_path.remove();
			}
		}
		// ...
	});

	return true;
}




let timeStampForAFK;
let isWrittenAFKState;

/**
*@Description　操作があればafkの状態から復帰する
*/
function afkStateChange(){
	timeStampForAFK = new Date().getTime();
	if(isWrittenAFKState == true){
		var updates = {};
		isWrittenAFKState = false;
		updates['/users/' + myID + "/state"] = prevState;
		updates['/users/' + myID + '/DeletetimeStamp'] = LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp)
		firebase.database().ref().update(updates);
	}
}


/**
*@Description　ユーザーのタイムアウト状態をチェックする
*/
function roomUserTimeoutCheck(DeleteTimeStamp){
	const roomPlayers = document.getElementsByClassName("RTCroomPlayer")
	firebase.database().ref('users').once('value').then(users => {
		var updates = {}

		for(let i=0;i<roomPlayers.length;i++){
			const checkID = roomPlayers[i].id
			const TimeOut_time = DeleteTimeStamp - users.val()[checkID].DeletetimeStamp

			if(TimeOut_time >= 50000){
				//50秒TimeStampの更新が無ければユーザーを削除する
				ForcePlayerDelete(checkID, null)
			}else if(TimeOut_time >= 20000){
				//20秒TimeStampの更新が無ければタイムアウト状態にする
				updates['/users/' + checkID + '/state'] = "timeOut"
			}
		}
		firebase.database().ref().update(updates);
	});
}



let AFK_TIMEOUT = 60000;

let RoomUserAfkWriteClock = 0
let prevState;

/**
*@Description　ユーザーのタイムスタンプ書き換え
*/
function ClockWriteTimeStamp(){
	const new_Date = new Date().getTime()
	var updates = {};
	const DeleteTimeStamp = LocationDateTimeStamp+(new_Date-LocalDateTimeStamp)
	updates['/users/' + myID + '/DeletetimeStamp'] = DeleteTimeStamp


	//afkTimeout
	if(new_Date > AFK_TIMEOUT + timeStampForAFK && playing == false && (prevState == "idle" || prevState == "move") ){
		if(isWrittenAFKState == false){
			isWrittenAFKState = true;
			updates['/users/' + myID + "/state"] = "afk";
		}
	}

	//30秒に一度、ルーム内のユーザーの存在をチェックする
	if(isEnter && !playing && new_Date - RoomUserAfkWriteClock >= 30000){
		RoomUserAfkWriteClock = new_Date
		roomUserTimeoutCheck(DeleteTimeStamp)
	}

	firebase.database().ref().update(updates);
}


/**
*@Description 1.5秒効果音を無効化する
*/
function RTCSECancel(){
	isSECancel = true;
	setTimeout(function(){
		isSECancel = false;
	}, 1500);
}


/**
*@Description 対戦用のデータ読み込み + 対戦用の表示領域を作成。
*/
let wholeChat
let wholeRoom
function createRTC(){

	//対戦用のインタラクティブエリア作成
	CreateRTCElement();


	//初めの数秒は音を鳴らさない
	RTCSECancel()


	firebase.database().ref('users/' + myID + '/roomID').once('value').then(inRoomID => {
		roomID = inRoomID.val();

		//ルームにすでに入っているか
		if(roomID != null){
			EnterRoom(roomID);
		}else{
			if(!wholeChat){
				addWholeChatEvent()
			}
		}

	});

	//以下、サーバー時間を取得した後に行う処理
	GetLocationDate().then( () => {

		if(roomID == null && !wholeRoom){
			addWholeRoomsUpdateEvent()
			setTimeout(()=> {document.getElementById("noRoomMes").textContent = "現在ルームが存在しません。";},700)
		}

		//ユーザー確認用タイムスタンプを更新
		ClockWriteTimeStamp()
		setInterval(ClockWriteTimeStamp,5000)

		//afk復帰確認イベント
		timeStampForAFK = new Date().getTime();
		document.body.addEventListener("keydown",afkStateChange);
		document.body.addEventListener("mousedown",afkStateChange);
		document.body.addEventListener("mousemove",afkStateChange);

		window.addEventListener("focus",windowFocusUpdate)

		window.addEventListener('beforeunload',windowBeforeunload );
	})

}


/**
*@Description　ウィンドウがアクティブになった
*/
function windowFocusUpdate(){
	var updates = {}
	updates['/users/' + myID + '/name'] = userName
	updates['/users/' + myID + "/state"] = prevState;
	firebase.database().ref().update(updates);

	//タイムアウト処理を受けていたらルームから離脱。
	if(isEnter){
		firebase.database().ref('users/' + myID + '/roomID').once('value').then(inRoomID => {
			if(!inRoomID.val()){
				ExitRoom();
			}
		})
	}

	ClockWriteTimeStamp()
}

/**
*@Description　ウィンドウから離れる
*/
function windowBeforeunload(){
	if(!playing){
		var updates = {}
		updates['/users/' + myID + '/state'] = "move"
		firebase.database().ref().update(updates);
	}
}



/**
*@note ログイン関係 ここまで---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note 対戦用のインタラクティブエリア作成 ここから---
*/

var DOMContainer;
var DOMChatInput;
var movieID;
var movieTitle;
var RTCselectingMode;
var WindowBlur


/**
*@Description 対戦用のインタラクティブエリア作成 ルート
*/
function CreateRTCElement(){
	//動画の再生を無効化
	var playarea = document.getElementsByClassName("playarea")[0];

	if(playarea != null){
		playarea.classList.add("is-hide-playarea");
		// document.getElementsByClassName("status")[0].classList.add("flex_100");
	}

	CreateContainer();
	CreateStatusArea();
	CreateChatArea();
}





/**
*@note スタイルを追加---
*/
function AddStyles(){
	var DOMstyle = document.createElement("style");
	DOMstyle.setAttribute("type","text/css");
	DOMstyle.textContent = `
#notify_room{
    padding-bottom: 1.5rem;
    padding-top: 0.6rem;
    position: relative;
    top: 5px;
}

#combat-mode-on-off{
    position: absolute;
    top: 4.1em;
    margin: auto;
    font-size: 0.5em;
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    font-weight: 600;
}
#ranking ::-webkit-scrollbar {
    width: 10px;
    background-color: hsla(0,0%,100%,.025);
    -webkit-border-radius: 100px;
}
#ranking ::-webkit-scrollbar-thumb {
    background: hsla(0,0%,100%,.5);
    -webkit-border-radius: 100px;
    background-clip: padding-box;
    border: 2px solid hsla(0,0%,100%,0);
    min-height: 10px;
}
.RTCroom{
width:45%;
max-height:160px;
height:160px;
margin:5px;
background-color:rgba(0,0,0, 0.2);
display:inline-block;
overflow-y:auto;
}

.RTCroom:hover{
background-color:rgba(0,0,0, 0.5);
}
#RTCRoomPlayers::-webkit-scrollbar{display:block;}/*バーの太さ*/
#RTCRoomPlayers::-webkit-scrollbar-thumb{display:block;background: #8b8b8b;border-radius: 1em;}

#RTCRoomPlayers::-webkit-scrollbar-thumb:hover{display:block;background: #8b8b8b;}
#RTCRoomPlayers::-webkit-scrollbar-thumb:active{background: #555555;}
.RTClineInput{
letter-spacing: 0.7px;
}
.top-nav__notify_room:before {
    content: '';
    width: 5px;
    height: 5px;
    background-color: #fff;
    color: #fff;
    border-radius: 50%;
    position: absolute;
    top: -6.4px;
    right: 0;
    left: 0;
    margin: auto;
    -webkit-animation-name: flash;
    animation-name: flash;
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
}
        .popup {
     position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 101;
        opacity: 0;
        visibility: hidden;
		background:rgb(255 255 255 / 10%);
        }

        .is-show {
        opacity: 1;
        visibility: visible;
        }
        .is-hide {
        opacity:0;
        visibility: hidden;
        display: none;
        }
        .is-hide-playarea {
        opacity:0;
        visibility: hidden;
        }
        .flex_100{
        flex:0 0 100%;
        max-width:100%;
        }
        .popup-inner {
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%,-50%);
        width: 60%;
        height:340px;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.96);
        z-index: 100;
        }
		.popup-text-area{
        background-color:rgba(0,0,0, 0.2);
        color:white;
        margin:4px 4px 10px;
        width:80%;
        border: none;
        border-bottom: solid thin;
        }
         .mine {
        color:#e65c00;
        }

        .RTCLine {
		font-size:13px;
        }

        .RTCLine:after{content:'\u200b';}

        .chatArea {
        display: none;
        width: 100%;
        position: fixed;
        background-color: rgb(0 0 0 / 78%);
        bottom: 0;
        z-index:101;
        }

        .is-disable {
        disabled:true;
        }

        .is-DifferInMovieID {
        color:#e6e600;
        }
        .count {
        display:none;
        }
       .select_area{
       font-weight: 600;
       display: flex;
       justify-content: flex-start;
       align-items: center;
       margin-top: 13px;
       margin-right: 10px;
       margin-left: 5px;
       }
        select {
        font-weight: 600;
        padding: 5px 8px;
        width: 130%;
        color:#FFF;
        box-shadow: none;
        background-color: #000000CC;
        background-image: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 5px;
        width: auto;
        }
        select:focus {
        outline: none;
        }
        select:hover{
        background:#1E90FF;
        }
        option{
        background:#333;
        color:#FFF;
       }
.rtc-room-container{
height:100%;
width:47%;
margin:0 5px;
padding:0;
display:inline-block;
vertical-align: top;
background-color:rgba(0,0,0, 0.2);
font-size:12px;
overflow-y:auto;
}
        .ready_background_color td{
        background: #5eff8330;
       }

        .timeout_background_color td{
        opacity:0.5;
       }
    .display_AutoStart{
    display: flex!important;
    justify-content: flex-end;
    align-items: center;
    }
    .display_AutoMove{
    display: flex!important;
    justify-content: flex-end;
    align-items: center;
    }
.ready_loading{
    background: #ffffff38;
}
#ChatInput{
width:75%;
height:30px;
font-size:15px;
background-color:rgba(0,0,0, 0.2);
border:none;
color:white;
}
#ChatInput:hover{
background-color:rgba(80,80,80, 0.5);

}

#RTCChat{
max-height:170px;
margin:0 0 5px 0;
padding:0;
background-color:rgba(0,0,0, 0.2);
overflow-y:auto;
font-size:12px;
}
#RTCRoomChat{
max-height:170px;
margin:0 0 5px 0;
padding:0;
background-color:rgba(0,0,0, 0.2);
overflow-y:auto;
font-size:12px;
}
#chat-limit{
    width: 10%;
    padding: 0.3rem;
}
.rtc-button {
    vertical-align: middle;
    user-select: none;
    border:1.5px solid transparent;
    padding: .6rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25;
    border-radius: 2px;
    transition: all .15s ease-in-out;
    cursor:pointer;
}
#Room_Existence{
    font-size:14px;
    background: #000000dd;
    position: absolute;
    height: 201px;
}

#Room_Existence span{
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    position: absolute;
    top: 48%;
    left: 50%;
}

[value="準備完了"],[value="途中参加"],[value="ゲーム開始"] {
    color: #56e576;
    background-color: transparent;
    background-image: none;
    border-color: #56e576!important;
}
[value="準備完了"]:hover,[value="途中参加"]:hover,[value="ゲーム開始"]:hover {
    color: #fff;
    background-color: #56e576b3;
    border-color: #56e576b3!important;
    text-shadow: 0.5px 0.5px 0px #333, -0.5px -0.5px 0px #333, -0.5px 0.5px 0px #333, 0.5px -0.5px 0px #333, 0.5px 0px 0px #333, -0.5px 0px 0px #333, 0px 0.5px 0px #333, 0px -0.5px 0px #333;
}
[value="ルームを退出"]{
    color: #ffc107;
    background-color: transparent;
    background-image: none;
    border-color: #ffc107!important;
    border: 1px solid!important;
}
[value="ルームを退出"]:hover {
    color: #fff;
    background-color: #ffc107a6;
    border-color: #ffc107c9!important;
    text-shadow: 0.5px 0.5px 0px #333, -0.5px -0.5px 0px #333, -0.5px 0.5px 0px #333, 0.5px -0.5px 0px #333, 0.5px 0px 0px #333, -0.5px 0px 0px #333, 0px 0.5px 0px #333, 0px -0.5px 0px #333;
}
[value="準備完了を解除"]{
    color:#00dcff;
    background-color: transparent;
    background-image: none;
    border-color:#17a2b8!important;
    border: 1px solid!important;
}
[value="準備完了を解除"]:hover {
    color: #fff;
    background-color:#00dcffa6;
    border-color:#17a2b8!important;
    text-shadow: 0.5px 0.5px 0px #333, -0.5px -0.5px 0px #333, -0.5px 0.5px 0px #333, 0.5px -0.5px 0px #333, 0.5px 0px 0px #333, -0.5px 0px 0px #333, 0px 0.5px 0px #333, 0px -0.5px 0px #333;
}
.request-playing {
    cursor: pointer;
    text-decoration: underline;
}
.rtc-request-info {
    color: #ffdd557d;
}
.rtc-request-info:hover {
    color: #fd5;
}
.rtc-request-info > span{
    margin-left: 5px;
}
.rtc-request-info .mode-label{
    margin-left: 15px;
}
#RTCContainer{
    border-style: solid;border-color: #f5f5f5;border-width: 2px;margin-top:10px;z-index:5;
}
#RTCStatus_Area{
    height: 320px;
    width: 896px;
    padding: 0px 10px;
    position: absolute;
    background-color: rgb(1,2,3,0.95);
}



.button-group-pills .btn {
    border-radius: 20px;
    line-height:0.8;
    border-color: #bbbbbb;
    color: rgb(255 255 255 / 88%);
    zoom: 80%;
	margin-left:1rem;
}
.button-group-pills #battleChat.active {
  border-color: #14a4be;
  background-color: #128ca370;
  color: #fff;
  box-shadow: none;
}
.button-group-pills .btn:hover {
  border-color: #158b9f;
  background-color: #158b9f;
  color: #fff;
}
.button-group-pills #submit-report:hover {
  border-color: #ffc107;
  background-color:#ffc1078c;
  color: #fff;
}
#roomKey{
    margin-left: 15px;cursor:pointer;
}
`
	var DOMstyleRequestInfo = document.createElement("style");
	DOMstyleRequestInfo.setAttribute("type","text/css");
	DOMstyleRequestInfo.setAttribute("id","request-info-roma-kana");
	DOMstyleRequestInfo.textContent = `
.request-kana-info{
    display:none;
}
.request-roma-info{
    display:table-row;
}
`
        ;
	document.querySelector("head").appendChild(DOMstyle);
	document.querySelector("head").appendChild(DOMstyleRequestInfo);
}

/**
*@note コンテナ作成---
*/
function CreateContainer(){
        if (document.getElementById("RTCContainer")) {
            return false;
        }
	DOMContainer = document.createElement("div");
	DOMContainer.classList.add('w-100');
	DOMContainer.id = "RTCContainer";

	if(/movie\/show/.test(location.pathname)){
		const parent = CONTROLBOX_SELECTOR;
		parent.appendChild(DOMContainer);

		movieID = location.pathname.match(/\d+/g)[0];
		movieTitle = document.querySelector(".movietitle > h1").textContent;
	}else{
		const parent = document.querySelector("#main_content");
		parent.prepend(DOMContainer);
		movieID = 0;
		movieTitle = " ";
	}
}

/**
*RTCステータスエリア作成
*/
function CreateStatusArea(){
        if (document.getElementById("RTCStatus_Area") != null) {
            return false;
        }
	var DOMStatus = document.createElement("div");
	DOMStatus.setAttribute("id","RTCStatus_Area");
	DOMContainer.appendChild(DOMStatus);

	CreateRoomSelectScene(DOMStatus);
	CreateRoomIdleScene(DOMStatus);
	CreateGamePlayScene(DOMStatus);
}

/**
*ルーム選択画面作成
*/
function CreateRoomSelectScene(parent){
	var DOMRoomSelectScene = document.createElement("div");
	DOMRoomSelectScene.setAttribute("style","width:100%");

	DOMRoomSelectScene.id = "RTCRoomSelectScene";
	parent.appendChild(DOMRoomSelectScene);

	var DOMp = document.createElement("p");
	DOMp.setAttribute("style","font-size:18px;margin:10px 0;");
	DOMp.textContent = "ルームを選択";
	DOMRoomSelectScene.appendChild(DOMp);

	var DOMRooms = document.createElement("ul");
	DOMRooms.setAttribute("style","height:200px;overflow-y:auto;margin:0;padding:0;");
	DOMRooms.id = "RTCRooms";
	DOMRoomSelectScene.appendChild(DOMRooms);

	var DOMNoRoomMes = document.createElement("p");
	DOMNoRoomMes.setAttribute("style","font-size:14px;padding-top:90px;text-align: center;");
	DOMNoRoomMes.id = "noRoomMes";
	DOMRooms.appendChild(DOMNoRoomMes);

	var DOMUIs = document.createElement("div");
	DOMUIs.setAttribute("style","height:30px;margin:10px 0; padding:0");
	DOMRoomSelectScene.appendChild(DOMUIs);

	var DOMCreateNewRoom = document.createElement("input");
	DOMCreateNewRoom.setAttribute("type","button");
	DOMCreateNewRoom.id = "create-room-button";
	DOMCreateNewRoom.setAttribute("class","rtc-button");
	DOMCreateNewRoom.setAttribute("value","新しくルームを作成");
	DOMCreateNewRoom.addEventListener("click", onClickCreateNewRoom);
	DOMUIs.appendChild(DOMCreateNewRoom);

	CreateModalForCreateNewRoom();
}

/**
*ルーム新規作成用モーダルの作成
*/
function CreateModalForCreateNewRoom(){
	var DOMpopup = document.createElement("div");
	DOMpopup.classList.add("popup");
	DOMpopup.id = "createNewRoom";
	document.getElementsByTagName("body")[0].appendChild(DOMpopup);

	var DOMpopupInner = document.createElement("div");
	DOMpopupInner.classList.add("popup-inner");
	DOMpopup.appendChild(DOMpopupInner);

	var DOMdiv = document.createElement("div");
	DOMdiv.setAttribute("style","height:80%;");
	DOMpopupInner.appendChild(DOMdiv);

	var DOMp = document.createElement("p");
	DOMp.setAttribute("style","font-size:18px;margin:4px 0 20px;");
	DOMp.textContent = "新しく対戦ルームを作成";
	DOMdiv.appendChild(DOMp);

	var DOMlabelRoomName = document.createElement("label");
	DOMlabelRoomName.setAttribute("for","roomName");
	DOMlabelRoomName.setAttribute("style","font-size:14px;margin:4px 0;width:20%;");
	DOMlabelRoomName.textContent = "ルーム名: ";
	DOMdiv.appendChild(DOMlabelRoomName);

	var DOMroomName = document.createElement("input");
	DOMroomName.id = "roomName";
	DOMroomName.setAttribute("type","text");
	DOMroomName.setAttribute("name","roomName");
	DOMroomName.setAttribute("maxlength","64");
	DOMroomName.setAttribute("class","popup-text-area");
	DOMroomName.setAttribute("value", userName + "'s room");
	DOMdiv.appendChild(DOMroomName);

	var DOMbr = document.createElement("br");
	DOMdiv.appendChild(DOMbr );

	var DOMlabelDescription = document.createElement("label");
	DOMlabelDescription.setAttribute("for","roomDescription");
	DOMlabelDescription.setAttribute("style","font-size:14px;margin:4px 0;width:20%;");
	DOMlabelDescription.textContent = "詳細: ";
	DOMdiv.appendChild(DOMlabelDescription);

	var DOMDescription = document.createElement("input");
	DOMDescription.id = "roomDescription";
	DOMDescription.setAttribute("type","text");
	DOMDescription.setAttribute("name","roomName");
	DOMDescription.setAttribute("maxlength","64");
	DOMDescription.setAttribute("value", "誰でもわいわい！");
	DOMDescription.setAttribute("class","popup-text-area");
	DOMdiv.appendChild(DOMDescription);

	var DOMPassWord = document.createElement("label");
	DOMPassWord.setAttribute("style","display:flex;align-items: center;margin-top:10px;");
	DOMPassWord.innerHTML = `<span style="font-size: 14px;margin: 0 5px  0 0;">パスワード設定:</span>
                             <input type="checkbox" id="Enable_PassWord">`
    DOMdiv.appendChild(DOMPassWord);

	DOMPassWord.addEventListener("change",function(){
		if(document.getElementById("Enable_PassWord").checked){
			document.getElementById("roomPassWordArea").style.display = "block"
		}else{
			document.getElementById("roomPassWordArea").style.display = "none"
		}
	})


	var DOMPassWordArea = document.createElement("input");
	DOMPassWordArea.id = "roomPassWordArea";
	DOMPassWordArea.setAttribute("type","text");
	DOMPassWordArea.setAttribute("name","roomName");
	DOMPassWordArea.setAttribute("maxlength","64");
	DOMPassWordArea.setAttribute("value", "");
	DOMPassWordArea.setAttribute("class","popup-text-area");
	DOMPassWordArea.setAttribute("style","display:none;");
	DOMdiv.appendChild(DOMPassWordArea);


	var DOMdiv2 = document.createElement("div");
	DOMdiv2.setAttribute("style","height:20%;");
	DOMpopupInner.appendChild(DOMdiv2);

	var DOMbuttonCreate = document.createElement("input");
	DOMbuttonCreate.setAttribute("type","button");
	DOMbuttonCreate.setAttribute("value","ルームを作成");
	DOMbuttonCreate.setAttribute("class","btn btn-light");
	DOMbuttonCreate.setAttribute("style","margin:4px 4px");
	DOMbuttonCreate.addEventListener("click", onClickCreateRoom);
	DOMdiv2.appendChild(DOMbuttonCreate);

	var DOMbuttonCancel = document.createElement("input");
	DOMbuttonCancel.setAttribute("type","button");
	DOMbuttonCancel.setAttribute("value","キャンセル");
	DOMbuttonCancel.setAttribute("class","btn btn-light");
	DOMbuttonCancel.setAttribute("style","margin:4px 4px");
	DOMbuttonCancel.addEventListener("click", onClickCancel);
	DOMdiv2.appendChild(DOMbuttonCancel);
}

/**
*ルーム待機画面作成
*/

const RequestInfoStyleRoma = `
.request-kana-info{
    display:none;
}
.request-roma-info{
    display:table-row;
}
`
const RequestInfoStyleKana = `
.request-kana-info{
    display:table-row;
}
.request-roma-info{
    display:none;
}
`
function CreateRoomIdleScene(parent){
	var DOMRoomIdleScene = document.createElement("div");
	DOMRoomIdleScene.setAttribute("style","width:100%");

	DOMRoomIdleScene.id = "RTCRoomIdleScene";
	DOMRoomIdleScene.classList.add('is-hide');
	parent.appendChild(DOMRoomIdleScene);

	var DOMp = document.createElement("p");
	DOMp.setAttribute("style","font-size:18px;margin:10px 0;");
	DOMp.id = "RTCRoomName";
	DOMp.textContent = "ルーム";
	DOMRoomIdleScene.appendChild(DOMp);

	var DOMRoomWrapper = document.createElement("div");
	DOMRoomWrapper.setAttribute("style","height:200px;margin:0;padding:0;");
	DOMRoomWrapper.id = "RTCRoomWrapper";
	DOMRoomIdleScene.appendChild(DOMRoomWrapper);


	var DOMRoomPlayers = document.createElement("div");
	DOMRoomPlayers.setAttribute("class","rtc-room-container");
	DOMRoomPlayers.id = "RTCRoomPlayers";
	DOMRoomWrapper.appendChild(DOMRoomPlayers);

	var DOMAutoStart = document.createElement("label");
	DOMAutoStart.setAttribute("style","float: right;display: none;");
	DOMAutoStart.innerHTML = `<input id="RTC_AutoStart" type="checkbox">自動開始`;
	DOMRoomPlayers.appendChild(DOMAutoStart);

	DOMAutoStart.addEventListener("change",function(event){
		if(isRoomMaster){
			var updates = {}
			if(event.target.checked){
				updates['/rooms/' + roomID + '/AutoStart'] = true;
			}else{
				updates['/rooms/' + roomID + '/AutoStart'] = false;
				if(prevState == "Auto_ready" || prevState == "ready"){
					prevState = "idle"
					updates['users/' + myID + '/state'] = "idle";
				}
			}

			firebase.database().ref().update(updates);
		}
	})


	var DOMThead = document.createElement("P");
	DOMThead.id = "RTCRoomPlayerCount";
	DOMThead.textContent = "参加者一覧";
	DOMRoomPlayers.appendChild(DOMThead);

	var DOMTable = document.createElement("table");
	DOMTable.setAttribute("rules","all");
	DOMTable.setAttribute("border","1");
	DOMTable.id = "RTCRoomPlayersTable";
	DOMRoomPlayers.appendChild(DOMTable);

	var DOMRoomInfo = document.createElement("div");
	DOMRoomInfo.setAttribute("class","rtc-room-container");
	DOMRoomInfo.id = "RTCRoomInfo";
	DOMRoomWrapper.appendChild(DOMRoomInfo);

	var DOMAutoMove = document.createElement("label");
	DOMAutoMove.setAttribute("style","float: right;display: none;");
	DOMAutoMove.innerHTML = `<input id="RTC_AutoMove" type="checkbox"`+(localStorage.getItem("RTC_AutoMove") == "false" ? "" : "checked")+`>譜面ページ自動遷移`;
	DOMRoomInfo.appendChild(DOMAutoMove);
	DOMAutoMove.addEventListener("change",function(event){
		if(!isRoomMaster){
			localStorage.setItem("RTC_AutoMove",event.target.checked)
			if(event.target.checked && document.getElementById("RTCRoomMovieTitle").href != "https://typing-tube.net/movie/show/null" && window.location.href != document.getElementById("RTCRoomMovieTitle").href){
				window.location.href = document.getElementById("RTCRoomMovieTitle").href
			}
		}
	})


	var DOMplayModeMes = document.createElement("p");
	DOMplayModeMes.textContent = "プレイモード";
	DOMRoomInfo.appendChild(DOMplayModeMes);


	var DOMmovieTitleDiv = document.createElement("div");
	DOMmovieTitleDiv.id  = "RTCmovieTitleDiv";
	DOMmovieTitleDiv.setAttribute("style","margin:5px 5px;");
	DOMRoomInfo.appendChild(DOMmovieTitleDiv);

	var DOMmovieTitleMes = document.createElement("span");
	DOMmovieTitleMes.setAttribute("style","color:inherit;");
	DOMmovieTitleMes.textContent = "楽曲: "
	DOMmovieTitleDiv.appendChild(DOMmovieTitleMes);

	var DOMmovieTitleU = document.createElement("u");
	DOMmovieTitleDiv.appendChild(DOMmovieTitleU);

	var DOMmovieTitleA = document.createElement("a");
	DOMmovieTitleA.setAttribute("style","color:inherit;font-weight:600;");
	DOMmovieTitleA.id = "RTCRoomMovieTitle";
	DOMmovieTitleU.appendChild(DOMmovieTitleA);


	var DOMselectingMes = document.createElement("span");
	DOMselectingMes.textContent = "ルームマスターがプレイする曲を選択中です。 ";
	DOMselectingMes.id = "RTCMovleSelectingMes";
	DOMRoomIdleScene.classList.add('is-hide');
	DOMmovieTitleDiv.appendChild(DOMselectingMes);

	var DOMselectingMesRM = document.createElement("span");
	DOMselectingMesRM.textContent = "プレイする曲を選択してください。 ";
	DOMselectingMesRM.id = "RTCMovleSelectingMesRM";
	DOMselectingMesRM.classList.add('is-hide');
	DOMmovieTitleDiv.appendChild(DOMselectingMesRM);


	var DOMplaySpeedDiv = document.createElement("div");
	DOMplaySpeedDiv.setAttribute("style","margin:5px 5px;");
	DOMRoomInfo.appendChild(DOMplaySpeedDiv);

	var DOMplaySpeedMes = document.createElement("span");
	DOMplaySpeedMes.textContent = "プレイ速度: "
	DOMplaySpeedDiv.appendChild(DOMplaySpeedMes);

	var DOMbtSpeedlt = document.createElement("a");
	if(typeof title_speed != "number"){
		DOMbtSpeedlt.addEventListener("click", onClickPlaySpeedlt);
	}
	DOMbtSpeedlt.textContent = " - ";
	DOMbtSpeedlt.setAttribute("style","margin:5px 5px;");
	DOMbtSpeedlt.id = "RTCPlaybtSpeedlt";
	DOMbtSpeedlt.classList.add('is-hide');
	DOMbtSpeedlt.setAttribute("title","プレイ速度を遅くする");
	DOMplaySpeedDiv.appendChild(DOMbtSpeedlt);

	var DOMplaySpeedSpan = document.createElement("span");
	DOMplaySpeedSpan.id = "RTCPlaySpeedSpan";
	DOMplaySpeedSpan.textContent = typeof title_speed == "number" ? title_speed.toFixed(2)+"倍" : "1.00倍"
	DOMplaySpeedDiv.appendChild(DOMplaySpeedSpan);

	var DOMbtSpeedgt = document.createElement("a");
	if(typeof title_speed != "number"){
		DOMbtSpeedgt.addEventListener("click", onClickPlaySpeedgt);
	}
	DOMbtSpeedgt.textContent = " + ";
	DOMbtSpeedgt.id = "RTCPlaybtSpeedgt";
	DOMbtSpeedgt.classList.add('is-hide');
	DOMbtSpeedgt.setAttribute("title","プレイ速度を速くする");
	DOMbtSpeedgt.setAttribute("style","margin:5px 5px;");
	DOMplaySpeedDiv.appendChild(DOMbtSpeedgt);


	var DOMPlayMideDiv = document.createElement("div");
	DOMPlayMideDiv.id = "RTCPlayModeDiv";
	DOMRoomInfo.appendChild(DOMPlayMideDiv);

	var DOMlabel1 = document.createElement("label");
	DOMlabel1.setAttribute("style","font-size:7px;margin:0 0 0 5px");
	DOMlabel1.setAttribute("for","rbModeKana");
	DOMlabel1.textContent = "かな表示";
	DOMRoomInfo.appendChild(DOMlabel1);

	var DOMrb1 = document.createElement("input");
	DOMrb1.id = "rbModeKana";
	DOMrb1.setAttribute("type","radio");
	DOMrb1.setAttribute("name","rbPlayMode");
	DOMrb1.setAttribute("checked","checked");
	DOMrb1.setAttribute("value","kana");
	DOMrb1.addEventListener("change", function(){
		mode = 'kana';
		kana_mode = false;
		keyboard='normal';
		typing_play_mode = 'roma'
		RTCselectingMode = mode;
		WriteToCookie('cookieRTCselectingMode', 'roma1');
		var updates = {};
		updates['users/' + myID + '/status/InputMode'] = "ローマ字";
		firebase.database().ref().update(updates);
		document.getElementById("request-info-roma-kana").textContent = RequestInfoStyleRoma
	});
	DOMRoomInfo.appendChild(DOMrb1);
	var updates = {};
	updates['users/' + myID + '/status/InputMode'] = "ローマ字";
	firebase.database().ref().update(updates);

	var DOMlabel2 = document.createElement("label");
	DOMlabel2.setAttribute("style","font-size:7px;margin:0 0 0 10px");
	DOMlabel2.setAttribute("for","rbModeRoma");
	DOMlabel2.textContent = "ローマ字表示";
	DOMRoomInfo.appendChild(DOMlabel2);

	var DOMrb2 = document.createElement("input");
	DOMrb2.id = "rbModeRoma";
	DOMrb2.setAttribute("type","radio");
	DOMrb2.setAttribute("name","rbPlayMode");
	DOMrb2.setAttribute("value","roma");
	DOMrb2.addEventListener("change", function(){
		mode = 'roma';
		kana_mode = false;
		keyboard='normal';
		typing_play_mode = 'roma'
		WriteToCookie('cookieRTCselectingMode', 'roma2');
		var updates = {};
		updates['users/' + myID + '/status/InputMode'] = "ローマ字";
		firebase.database().ref().update(updates);
		document.getElementById("request-info-roma-kana").textContent = RequestInfoStyleRoma
	});
	DOMRoomInfo.appendChild(DOMrb2);


	var DOMlabel3 = document.createElement("label");
	DOMlabel3.setAttribute("style","font-size:7px;margin:0 0 0 10px");
	DOMlabel3.setAttribute("for","rbModeKanaInput");
	DOMlabel3.textContent = "かな入力";
	DOMRoomInfo.appendChild(DOMlabel3);

	var DOMrb3 = document.createElement("input");
	DOMrb3.id = "rbModeKanaInput";
	DOMrb3.setAttribute("type","radio");
	DOMrb3.setAttribute("name","rbPlayMode");
	DOMrb3.setAttribute("value","kanaInput");
	DOMrb3.addEventListener("change", function(){
		mode = 'kana';
		kana_mode = true;
		keyboard='normal';
		typing_play_mode = 'kana'
		WriteToCookie('cookieRTCselectingMode', 'kana1');
		var updates = {};
		updates['users/' + myID + '/status/InputMode'] = "かな";
		firebase.database().ref().update(updates);
		document.getElementById("request-info-roma-kana").textContent = RequestInfoStyleKana
	});
	DOMRoomInfo.appendChild(DOMrb3);


	var DOMlabel4 = document.createElement("label");
	DOMlabel4.setAttribute("style","font-size:7px;margin:0 0 0 10px");
	DOMlabel4.setAttribute("for","rbModeFlickInput");
	DOMlabel4.textContent = "フリック入力";
	DOMRoomInfo.appendChild(DOMlabel4);

	var DOMrb4 = document.createElement("input");
	DOMrb4.id = "rbModeKanaInput";
	DOMrb4.setAttribute("type","radio");
	DOMrb4.setAttribute("name","rbPlayMode");
	DOMrb4.setAttribute("value","flickInput");
	DOMrb4.addEventListener("change", function(){
		mode = 'kana';
		kana_mode = true;
		keyboard='mac';
		typing_play_mode = 'flick'
		WriteToCookie('cookieRTCselectingMode', 'kana2');
		var updates = {};
		updates['users/' + myID + '/status/InputMode'] = "フリック";
		firebase.database().ref().update(updates);
		document.getElementById("request-info-roma-kana").textContent = RequestInfoStyleKana
	});
	DOMRoomInfo.appendChild(DOMrb4);

	DOMRoomInfo.insertAdjacentHTML('beforeend', `<div class="select_area"><span style="margin-right: 9px;">勝敗条件:</span>
<select id="combat_mode" style="width: 70px;" disabled>
<option value="Score" title="通常のScoreで対戦するモードです。">Score</option>
<option value="Line" title="いち早くLineクリアすると1clearポイント獲得できます。clearポイントの多さで競います。">Line先取</option>
<option value="Combo" title="Missをすると対戦エリアのScoreがリセットされます。">Combo</option>
<option value="Perfect" title="Missに加えて、ラインクリアに失敗しても対戦エリアのScoreがリセットされます。">Perfect</option>
</select></div><div class="select_area"><span style="margin-right: 9px;">Skip方法:</span>
<select id="skip_mode" style="width: 70px;" disabled>
<option value="HOST" title="ホストのユーザーがスキップしたタイミングで参加者全員がSkipされます。短い間奏(10秒未満)はSkip出来なくなります。">ホスト式</option>
<option value="All" title="参加者全員がスキップ申請したタイミングでスキップします。">申請式</option>
</select></div>`)
	document.getElementById("combat_mode").addEventListener("change",onChangeCombatMode)
	document.getElementById("skip_mode").addEventListener("change",onChangeSkipMode)

	var DOMdiv2 = document.createElement("div");
	DOMdiv2.setAttribute("style","height:20%;");
	DOMRoomIdleScene.appendChild(DOMdiv2);

	var DOMbuttonReady = document.createElement("input");
	DOMbuttonReady.setAttribute("type","button");
	DOMbuttonReady.setAttribute("class","rtc-button");
	DOMbuttonReady.setAttribute("value","準備完了");
	DOMbuttonReady.id = "RTCbtnReady";
	DOMbuttonReady.setAttribute("style","margin:10px 4px;visibility:hidden;");
	DOMbuttonReady.addEventListener("click", onClickBtnReady);
	DOMdiv2.appendChild(DOMbuttonReady);

	var DOMbuttonGameStart = document.createElement("input");
	DOMbuttonGameStart.setAttribute("type","button");
	DOMbuttonGameStart.setAttribute("class","rtc-button");
	DOMbuttonGameStart.setAttribute("value","ゲーム開始");
	DOMbuttonGameStart.setAttribute("style","visibility:hidden");
	DOMbuttonGameStart.id = "RTCbtnGameStart";
	if(movieID == 0){
		DOMbuttonGameStart.disabled = true;
		DOMbuttonGameStart.setAttribute("title","プレイする楽曲を選択してください。");
	}
	DOMbuttonGameStart.setAttribute("style","margin:10px 4px;" + (movieID == 0 ? "visibility:hidden;":""));
	DOMbuttonGameStart.addEventListener("click", onClickBtnGameStart);
	DOMdiv2.appendChild(DOMbuttonGameStart);

	var DOMbuttonExit = document.createElement("input");
	DOMbuttonExit.setAttribute("type","button");
	DOMbuttonExit.id = "RTCbtnExit";
	DOMbuttonExit.setAttribute("class","rtc-button");
	DOMbuttonExit.setAttribute("value","ルームを退出");
	DOMbuttonExit.setAttribute("style","margin:10px 4px 10px 30px");
	DOMbuttonExit.addEventListener("click", ExitRoom);
	DOMdiv2.appendChild(DOMbuttonExit);


	if(!localStorage.getItem("RTCpreview")){
		localStorage.setItem("RTCpreview", "false")
	}
	var DOMbuttonPreview = document.createElement("span");
	DOMbuttonPreview.setAttribute("style","display: flex;justify-content: flex-end;    position: relative;top: -10px;");
	DOMbuttonPreview.innerHTML = `<label><input type="checkbox" value="RTC_Scroll" `+(localStorage.getItem("RTC_Scroll")=="false" ? "":"checked")+`>自動スクロール</label>　<label><input type="checkbox" value="nowplay_preview" id="rtc-preview" `+(localStorage.getItem("RTCpreview")=="false"?"":"checked")+`>プレビュー再生</label>`

	DOMdiv2.appendChild(DOMbuttonPreview);

	document.querySelector("[value='RTC_Scroll']").addEventListener("change", function(event){
		localStorage.setItem("RTC_Scroll", event.target.checked)
	});
	document.querySelector("[value='nowplay_preview']").addEventListener("change", function(event){
		localStorage.setItem("RTCpreview", event.target.checked)
		if(!event.target.checked && location.href.indexOf("https://typing-tube.net/movie/") >= 0 && !playing){
			player.pauseVideo()
		}
	});

	//クッキーにより、記憶されていたモードを自動で選択するようにする処理
	RTCselectingMode = ReadFromCookie('cookieRTCselectingMode');
	if(RTCselectingMode == ''){
		WriteToCookie('cookieRTCselectingMode', 'roma1');
	}else{
		switch(RTCselectingMode){
			case 'roma1':DOMrb1.click();break;
			case 'roma2':DOMrb2.click();break;
			case 'kana1':DOMrb3.click();break;
			case 'kana2':DOMrb4.click();break;
			default: WriteToCookie('cookieRTCselectingMode', 'roma1');DOMrb1.click();break;
		}

	}
}

/**
*プレイ中画面作成
*/
function CreateGamePlayScene(parent){
	var DOMGamePlayScene = document.createElement("div");
	DOMGamePlayScene.id = "RTCGamePlayScene";
	DOMGamePlayScene.setAttribute("style","width:98.5%;margin:8px 8px;");
	DOMGamePlayScene.classList.add('is-hide');
	parent.appendChild(DOMGamePlayScene);

	var DOMWrapper = document.createElement("div");
	DOMWrapper.setAttribute("style","height:292px;margin:0;padding:0;overflow-y:auto;background-color:rgba(0,0,0, 0.2);");
	DOMWrapper.id = "RTCGamePlayWrapper";
	DOMGamePlayScene.appendChild(DOMWrapper);

	var DOMTable = document.createElement("table");
	DOMTable.id = "RTCGamePlayPlayersStatusTable";
	DOMTable.setAttribute("style","width:100%;margin: 8px 0px 6.5px 0;");
	DOMTable.setAttribute("rules","all");
	DOMTable.setAttribute("border","1");
	DOMWrapper.appendChild(DOMTable);

	var DOMdiv2 = document.createElement("div");
	DOMGamePlayScene.appendChild(DOMdiv2);

	var DOMp2 = document.createElement("p");
	DOMp2.setAttribute("style","font-size:14px;margin:25px 0;display:none;");
	DOMp2.id = "RTCRoomMes";
	DOMp2.textContent = "　";
	DOMWrapper.appendChild(DOMp2);
}

let getSelectionBak = ""
/**
*チャットエリア作成
*/
function CreateChatArea(){


	var DOMChatDiv = document.createElement("div");
	DOMChatDiv.classList.add("chatArea");
	DOMChatDiv.setAttribute("style",`display:${sessionStorage.getItem("chatOpen") != "false" ? "block" : "none"};`);
	document.getElementsByClassName('main')[0].appendChild(DOMChatDiv);

	var DOMKnobUp = document.createElement("span");
	DOMKnobUp.setAttribute("style","height: 18px;position: absolute;cursor: pointer;bottom: 15px;");
	DOMKnobUp.setAttribute("id","knob-up");
	DOMKnobUp.textContent = "△"

	DOMChatDiv.appendChild(DOMKnobUp);
	DOMKnobUp.addEventListener("click", function chatAreaUp(e){
		const CHAT_HEIGHT = parseFloat(document.getElementById("RTCRoomChat").style.height)
		const MAX_HEIGHT = 170
		const ROOM_CHAT_FIRST_CHILD = document.getElementById("RTCRoomChat").firstChild
		const CHAT_UP_HEIGHT = (CHAT_HEIGHT+ (ROOM_CHAT_FIRST_CHILD && ROOM_CHAT_FIRST_CHILD.clientHeight ? document.getElementById("RTCRoomChat").firstChild.clientHeight:20) )

		if(CHAT_UP_HEIGHT >= MAX_HEIGHT){
			e.target.style.visibility = "hidden"
			document.getElementById("RTCRoomChat").style.height = MAX_HEIGHT+"px"
			document.getElementById("RTCChat").style.height = MAX_HEIGHT+"px"
		}else{
			e.target.style.visibility = ""
			document.getElementById("RTCRoomChat").style.height = CHAT_UP_HEIGHT+"px"
			document.getElementById("RTCChat").style.height = CHAT_UP_HEIGHT+"px"
		}

		localStorage.setItem( (!playing ? "RTCRoomChatHeight":"RTCRoomBattleChatHeight") ,document.getElementById("RTCRoomChat").style.height)
		document.getElementById("knob-down").style.visibility = ""
	},false)

	var DOMKnobDown = document.createElement("span");
	DOMKnobDown.setAttribute("style","height: 18px;position: absolute;bottom: 0px;cursor: pointer;");
	DOMKnobDown.setAttribute("id","knob-down");
	DOMKnobDown.textContent = "▽"
	DOMChatDiv.appendChild(DOMKnobDown);
	DOMKnobDown.addEventListener("click", function chatAreaDown(e){
		const CHAT_HEIGHT = parseFloat(document.getElementById("RTCRoomChat").style.height)
		const MINUMUM_HEIGHT = 40
		const ROOM_CHAT_FIRST_CHILD = document.getElementById("RTCRoomChat").firstChild
		const CHAT_DOWN_HEIGHT = (CHAT_HEIGHT-(ROOM_CHAT_FIRST_CHILD && ROOM_CHAT_FIRST_CHILD.clientHeight ? document.getElementById("RTCRoomChat").firstChild.clientHeight:20) )

		if(CHAT_DOWN_HEIGHT <= MINUMUM_HEIGHT){
			e.target.style.visibility = "hidden"
			document.getElementById("RTCRoomChat").style.height = MINUMUM_HEIGHT+"px"
			document.getElementById("RTCChat").style.height = MINUMUM_HEIGHT+"px"

		}else{
			e.target.style.visibility = ""
			document.getElementById("RTCRoomChat").style.height = CHAT_DOWN_HEIGHT +"px"
			document.getElementById("RTCChat").style.height = CHAT_DOWN_HEIGHT+"px"
		}

		localStorage.setItem((!playing ? "RTCRoomChatHeight":"RTCRoomBattleChatHeight"),document.getElementById("RTCRoomChat").style.height)
		document.getElementById("knob-up").style.visibility = ""
	})
	var DOMDiv = document.createElement("div");
	DOMDiv.setAttribute("style","margin:0 2.5%;padding-top: 7px;");
	DOMChatDiv.appendChild(DOMDiv);

	var DOMChatModeDiv = document.createElement("span");
	DOMChatModeDiv.id = "RTCchatModeDiv";
	DOMChatModeDiv.classList.add('is-hide');
	DOMDiv.appendChild(DOMChatModeDiv);


	var DOMlabelWorldChat = document.createElement("label");
	DOMlabelWorldChat.setAttribute("style","font-size:7px;margin:0 0 0 20px");
	DOMlabelWorldChat.setAttribute("for","rbWorldChat");
	DOMlabelWorldChat.textContent = "全体チャット";
	DOMChatModeDiv.appendChild(DOMlabelWorldChat);

	var DOMrbWorldChat = document.createElement("input");
	DOMrbWorldChat.id = "rbWorldChat";
	DOMrbWorldChat.setAttribute("type","radio");
	DOMrbWorldChat.setAttribute("name","rbChatMode");
	DOMrbWorldChat.setAttribute("checked","checked");
	DOMrbWorldChat.setAttribute("value","world");
	DOMrbWorldChat.addEventListener("change", function(){
		document.getElementById("RTCChat").classList.remove("is-hide");
		document.getElementById("RTCRoomChat").classList.add("is-hide");
		if(!wholeChat){
			addWholeChatEvent()
		}
	});
	DOMChatModeDiv.appendChild(DOMrbWorldChat);

	var DOMlabelRoomChat = document.createElement("label");
	DOMlabelRoomChat.setAttribute("style","font-size:7px;margin:0");
	DOMlabelRoomChat.setAttribute("for","rbRoomChat");
	DOMlabelRoomChat.textContent = "ルームチャット";
	DOMChatModeDiv.appendChild(DOMlabelRoomChat);

	var DOMrbRoomChat = document.createElement("input");
	DOMrbRoomChat.id = "rbRoomChat";
	DOMrbRoomChat.setAttribute("type","radio");
	DOMrbRoomChat.setAttribute("style","font-size:10px;");
	DOMrbRoomChat.setAttribute("name","rbChatMode");
	DOMrbRoomChat.setAttribute("value","room");
	DOMrbRoomChat.addEventListener("change", function(){
		document.getElementById("RTCChat").classList.add("is-hide");
		document.getElementById("RTCRoomChat").classList.remove("is-hide");
	});
	DOMChatModeDiv.appendChild(DOMrbRoomChat);

	const battleChatButtonOption = localStorage.getItem("battleChat")
	var DOMp2 = document.createElement("span");
	DOMp2.setAttribute("style","font-size:12px;margin:0 20px;");
	DOMp2.innerHTML = `F4キーで表示非表示を切り替えられます。
<span class="button-group-pills text-center" data-toggle="buttons">
        <label class="pointer btn btn-default ${battleChatButtonOption && battleChatButtonOption != "active" ? "active" : ""}" id="battleChat">
          <div>対戦中に表示</div>
        </label>
		        <label class="pointer btn btn-default" id="submit-report">
          <div>運営に通報</div>
        </label>
      </span>`;
	DOMDiv.appendChild(DOMp2);
	document.getElementById("battleChat").addEventListener("click", e => {
		localStorage.setItem("battleChat" ,e.currentTarget.classList[2])
	},false)

	document.getElementById("submit-report").addEventListener("click", submitChatReportApi, false)

	const CHAT_HEIGHT = localStorage.getItem("RTCRoomChatHeight")
	if(!CHAT_HEIGHT){
		localStorage.setItem("RTCRoomChatHeight",MOBILE_FLAG ? "40px":"150px")
	}
	if(CHAT_HEIGHT == "170px"){
		DOMKnobUp.style.visibility = "hidden"
	}else if(CHAT_HEIGHT == "40px"){
		DOMKnobDown.style.visibility = "hidden"
	}

	var DOMChatUl = document.createElement("ul");
	DOMChatUl.id = "RTCChat";
	DOMChatUl.setAttribute("style",`height:${localStorage.getItem("RTCRoomChatHeight")};`);
	DOMDiv.appendChild(DOMChatUl);


	var DOMRoomChatUl = document.createElement("ul");
	DOMRoomChatUl.id = "RTCRoomChat";
	DOMRoomChatUl.innerHTML = `<li style="position: absolute;visibility: hidden;"></li>`
    DOMRoomChatUl.classList.add('is-hide');
	DOMRoomChatUl.setAttribute("style",`height:${localStorage.getItem("RTCRoomChatHeight")};`);

	DOMDiv.appendChild(DOMRoomChatUl);

	var DOMForm = document.createElement("div");
	DOMForm.setAttribute("style","margin:10px 0; padding:0;");
	DOMDiv.appendChild(DOMForm);

	DOMChatInput = document.createElement("input");
	DOMChatInput.id = "ChatInput"
	DOMChatInput.setAttribute("type","text");
	DOMChatInput.setAttribute("name","text");
	DOMChatInput.setAttribute("placeholder","メッセージを入力　[コマンド #譜面ID or 譜面URL でリクエストができます。例：#22097 ランダム：#random] ");
	DOMChatInput.setAttribute("autocomplete","off");

	DOMChatInput.addEventListener("input",function(event){

		//チャット入力中は自動遷移しない。(入力後に自動遷移する)
		if(event.target.value == "" && AutoMovehref && document.getElementById("RTC_AutoMove").checked){
			window.location.href = AutoMovehref
		}

		//文字数カウント処理
		document.getElementById("chat-input-limit").textContent = event.target.value.length
		if(event.target.value.length > 200){
			document.getElementById("chat-limit").classList.add("text-warning")
		}else{
			document.getElementById("chat-limit").classList.remove("text-warning")
		}
	});
	DOMForm.appendChild(DOMChatInput);

	var DOMChatLimit = document.createElement("span");
	DOMChatLimit.id = "chat-limit"
	DOMChatLimit.innerHTML = `<span id="chat-input-limit">0</span> / 200`
	DOMForm.appendChild(DOMChatLimit);


	var DOMChatSubmit = document.createElement("input");
	DOMChatSubmit.setAttribute("type","button");
	DOMChatSubmit.setAttribute("value","送信");
	DOMChatSubmit.setAttribute("style","width:15%;");
	DOMChatSubmit.setAttribute("class","btn btn-light");
	DOMChatSubmit.addEventListener("click", SubmitMessage);
	DOMForm.appendChild(DOMChatSubmit);


	window.addEventListener("beforeunload" , function(event){
		if(limitter>0){
			sessionStorage.setItem("LIMITTER",requestDate)
		}
	});
	if(sessionStorage.getItem("LIMITTER")){
		requestDate = +sessionStorage.getItem("LIMITTER")
		requestLimit = setInterval(() => { requestLimitter(+sessionStorage.getItem("LIMITTER_TIME")) },1000)
	}
	//コメント入力後Enterを押したら送信
	DOMChatInput.addEventListener("keydown" , function(event){
		if(!event.isComposing && event.code == "Enter" && document.getElementById("ChatInput").value){
			DOMChatSubmit.click();
			event.stopImmediatePropagation()
		}
	});
	document.addEventListener("click" , function(event){

		const focusing_area = event.target.type == "text" || event.target.type == "select-one" || document.activeElement.id == "RoomNameArea" || document.activeElement.id == "roomName" ? true:false
		const GET_SELECTION = window.getSelection().toString()
		const selecting_input = String(GET_SELECTION) && document.activeElement.type == "text" ? true:false
		const notPlaying = !focusing_area && !selecting_input && (GET_SELECTION == getSelectionBak || GET_SELECTION == "") && !playing
		const playingFocus = playing && event.target.closest(".chatArea") != null

		if(!PHONE_TABLET_FLAG && (notPlaying || playingFocus)){
			document.getElementById("ChatInput").focus();
			getSelectionBak = ""
		}
		getSelectionBak = GET_SELECTION
	});
	document.addEventListener("change" , function(event){
		if(!PHONE_TABLET_FLAG && document.activeElement.id != 'keyword'){
			$('.chatArea input[name="text"]:visible').focus();
		}
	});
	//F4キークリックで表示非表示切り替え
	window.addEventListener("keydown" , function(event){
		if(event.code == "F4" && (playing == false || document.getElementsByClassName("RTCRoomPlayerName").length >= 2 && playing == true)){

			if(document.getElementsByClassName("chatArea")[0].style.length == 1){

				if(document.getElementsByClassName("chatArea")[0].style.display == "block"){
					$('.chatArea').animate({height: 'hide',opacity:'hide'}, 'nomal')
					sessionStorage.setItem("chatOpen","false")
				}else{
					$('.chatArea').animate({height: 'show',opacity:'show'}, 'nomal')
					const Chat = document.getElementById('RTCRoomChat');
					Chat.scrollTo(0, Chat.scrollHeight)
					sessionStorage.setItem("chatOpen","true")
					document.getElementById("ChatInput").focus();
				}

			}

			event.preventDefault()
		}
	});
	if(location.href.indexOf("https://typing-tube.net/movie/show/")>-1 && localStorage.getItem("RTC_Scroll") != "false"){
		window.scrollBy({
			top:CONTROLBOX_SELECTOR.getBoundingClientRect().bottom-document.documentElement.clientHeight+250+document.getElementById("RTCStatus_Area").clientHeight
		})
	}
	//ページ読み込み時、チャットが表示されているならDOMChatInputに自動フォーカス by.Toshi
	if(!PHONE_TABLET_FLAG){
		if(document.getElementsByClassName("chatArea")[0].style.display == "block"){
			document.getElementById("ChatInput").focus();
		}
	}
	//F8キークリックで key/sec と key/minのトグル
	window.addEventListener("keydown" , function(event){
		if(event.code == "F8"){
			isDispFmtKeySec = !isDispFmtKeySec;
		}
	});
}




/**
*@note 対戦用のインタラクティブエリア作成 ここまで---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////










/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note チャット関連 ここから ---
*/

let requestLyric
let requestDate


/**
*@Description 全体チャット読み込み
*/
function addWholeChatEvent(){
	wholeChat = new ChatUpdate("RTCChat")

	//チャット欄自動更新
	var chats = firebase.database().ref('chats').limitToLast(14);
	chats.on('child_added', wholeChat.onChatUpdate.bind(wholeChat));
}

/**
*@Description 全体ルーム読み込み
*/
function addWholeRoomsUpdateEvent(){
	wholeRoom = new updateRoomsInfo()

	//全体Room情報自動更新
	var rooms = firebase.database().ref('rooms');
	rooms.on('child_added', wholeRoom.onAddRoom)
	rooms.on('child_changed', wholeRoom.onChangeRoom);
	rooms.on('child_removed', wholeRoom.onRemoveRoom);
}


/**
*@Description チャット送信
*/


function connectMessageRef(){

	if(document.getElementById("RTCChat").classList[0] == "is-hide"){
		return firebase.database().ref('roomChat/' + roomID).push();
	}else{
		return firebase.database().ref('chats').push();
	}

}

let createReq
let SubmitedWord
function SubmitMessage(){
	if(DOMChatInput.value.length == 0 || DOMChatInput.value.length > 200){
		return;
	}
	if(SubmitedWord == DOMChatInput.value || document.getElementById("ChatInput").placeholder.match("連投")){
		//チャットボックスを初期化
		chatInputClear()
		return;
	}


	if(DOMChatInput.value.match("https://typing-tube.net/movie/") || (DOMChatInput.value.match("#") || DOMChatInput.value.match("＃")) && !isNaN(hankaku2Zenkaku( (DOMChatInput.value.slice(1)) ))){
		const TYPING_DATA_NUMBER = +hankaku2Zenkaku((DOMChatInput.value).replace(/[^0-9０-９]/g, ''))
		if(requestLimit){
			DOMChatInput.value = "";
			return;
		}

		$.ajax({
			type: 'POST',
			url: '/movie/lyrics/' + TYPING_DATA_NUMBER,
			success:function(data){
				createReq = new createRequest(data , TYPING_DATA_NUMBER ,"Request")
				createReq.createRequest()
			}
		});

	}else if(hankaku2Zenkaku(DOMChatInput.value) == "#random"){
		if(requestLimit){
			DOMChatInput.value = "";
			return;
		}
		random_generator()
	}else{
		//連投カウントを進める
		chatLimitCount()
		const messageRef = connectMessageRef()
		submitChatApi()
		if(continuousPitchingCount >= 8){
			messageRef.set({
				"userID": myID,
				"name": userName,
				"text" : DOMChatInput.value,
				"announce" : true,
			});
		}else{
			messageRef.set({
				"userID": myID,
				"name": userName,
				"text" : DOMChatInput.value
			});
		}
		SubmitedWord = DOMChatInput.value

	}

	chatInputClear()

}

function submitChatApi(){
	const options = {
		method: 'POST', // HTTPメソッドを指定
		headers: {
                    'Content-Type': 'application/json'
                },
		body: JSON.stringify({
			room_id: (document.getElementById('rbRoomChat').checked ? roomID : undefined),
			name: userName,
			text: DOMChatInput.value,
			firebase_user_id: myID,
			authenticity_token: 'YuIeaac+n/T7bYIk721uikkwrNw5WfpNMuU3Bh614In3iNv5/xbZsEKvT0EjfnLgvKSGzYmOV7H627PEODuKsw=='
		})
	}

	fetch("/api/chat/add", options);
}

function submitChatReportApi(event){
	const LIMIT = (+localStorage.getItem('submitReportLimit') + (60000 * 10))
	if(LIMIT > LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp)){
		const remarningSubmitTime = Math.abs((LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp) - LIMIT)/1000)
		const MIN = Math.floor((remarningSubmitTime/60))
		const SEC = Math.round(+String((remarningSubmitTime/60)).slice(1)*60)

		alert(`通報機能は${MIN}分${SEC}秒後に使用可能です。`)
		return;
	}

	const kick_password = Math.floor( Math.random() * (999 + 1 - 100) ) + 100
	const pass_form = prompt("問題のあるコメントは運営チームに通報することができます。\nよろしければ入力欄に　"+kick_password+"　を入力してください。")
	if (pass_form == kick_password) {
		const options = {
			method: 'POST', // HTTPメソッドを指定
		        headers: {
                            'Content-Type': 'application/json'
                        },
			body: JSON.stringify({
				room_id: (document.getElementById('rbRoomChat').checked ? roomID : undefined),
				name: userName,
				firebase_user_id: myID,
				authenticity_token: 'cpzJ25u+3VZVUijTjU4KCr0uAe0IoidiqHuPKwkfsQzn9gxLw5abEuyQ5bZBXRZgSLor/Lh1ip5gRQvpL5HbNg=='
			})
		}

		fetch("/api/chat/report", options).then(() => {
			alert(`チャット内容の通報が完了しました。`)
			localStorage.setItem('submitReportLimit',LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp))
		});
	}

}

class createRequest{

	constructor(data , number ,messageType) {
		this.data = data;
		this.messageType = messageType;
		this.dataNumber = number
	}

	createRequest(){

		const DATA_SPLIT = this.data.split("\n")
		const SLICE_SEARCH = DATA_SPLIT[0].search("http")
		const REQUEST_MUSIC_NAME = DATA_SPLIT[0].slice(0 , SLICE_SEARCH-1)
		requestLyric = new requestLyricInfo(this.data);
		requestLyric.splitData();
		requestLyric.createTypingData();
		requestLyric.getTypingDataInfo();
		const messageRef = connectMessageRef()

		messageRef.set({
			"userID": myID,
			"name": userName,
			"number": this.dataNumber,
			"musicName":REQUEST_MUSIC_NAME,
			"movieTime":`${requestLyric.movieTime_mm}:${requestLyric.movieTime_ss}`,
			"totalNotes": [requestLyric.totalNotesRomaMode , requestLyric.totalNotesKanaMode],
			"medianSpeed": [requestLyric.medianRomaSpeed.toFixed(2) , requestLyric.medianKanaSpeed.toFixed(2)],
			"maxSpeed": [requestLyric.maxRomaSpeed.toFixed(2) , requestLyric.maxKanaSpeed.toFixed(2)],
			"messageType" : this.messageType
		});
		requestDate = new Date().getTime()
		sessionStorage.setItem("LIMITTER_TIME","20000")
		requestLimit = setInterval(() => { requestLimitter(+sessionStorage.getItem("LIMITTER_TIME")) },1000)

	}

}

/**
*@Description チャットボックスを初期化
*/
function chatInputClear(){

	DOMChatInput.value = "";
	document.getElementById("chat-input-limit").textContent = 0

}


let chatSubmitTime = 0
let continuousPitchingCount = 0
const continuousPitchingCheckTime = 30000


/**
*@Description チャットの連投カウンター
*/

function chatLimitCount(){

	if(new Date().getTime() - chatSubmitTime > continuousPitchingCheckTime){
		chatSubmitTime = new Date().getTime()
		continuousPitchingCount = 1
	}else{

		continuousPitchingCount++
	}

	if(continuousPitchingCount >= 8){
		requestDate = new Date().getTime()
		sessionStorage.setItem("LIMITTER_TIME","100000")
		requestLimitter(+sessionStorage.getItem("LIMITTER_TIME"))
		requestLimit = setInterval(() => { requestLimitter(+sessionStorage.getItem("LIMITTER_TIME")) },1000)
	}

}



/**
*@Description チャット欄更新
*/

class ChatUpdate {
	constructor(data) {
		this.data = data;
	}

	onChatUpdate(snapshot) {
		const msg = snapshot.val();

		if(roomID == null || this.data == "RTCRoomChat"){
			playSE("chat");
		}

		var li = document.createElement("li");
		li.setAttribute('data-id',msg.userID)
		const announce = `<span class="text-success">　(announce: 連投を検知しました。100秒間チャット送信ができなくなります。)</span>`
		if(msg.messageType == "Request" || msg.messageType == "Random"){
			const REQ_DATA =
				  `#${msg.messageType} - <a style="background:#2c487e;" href="https://typing-tube.net/movie/show/${msg.number}">[ID${msg.number}] ${msg.musicName}</a> [<span class="request-playing" value=${msg.number}>視聴</span>]
<span class="rtc-request-info">
<span><i class="far fa-clock"></i>&nbsp;
${msg.movieTime}</span>
<span><i class="fas fa-drum"></i>&nbsp;
<span class="request-roma-info">${msg.totalNotes[0]}</span>
<span class="request-kana-info">${msg.totalNotes[1]}</span>打</span>

<span><i class="fas fa-tachometer-alt"></i>&nbsp;中央値
<span class="request-roma-info">${msg.medianSpeed[0]}</span>
<span class="request-kana-info">${msg.medianSpeed[1]}</span>打/秒 | 最高
<span class="request-roma-info">${msg.maxSpeed[0]}</span>
<span class="request-kana-info">${msg.maxSpeed[1]}</span>打/秒</span>
</span>`

			li.innerHTML = `<span class="${msg.userID == myID ? 'mine' : ''}">${msg.name}</span> : <span>${REQ_DATA}</span>`
		}else{
			li.innerHTML = `<span class="${msg.userID == myID ? 'mine' : ''}">${msg.name}</span> : <span>${msg.announce ? (escapeHtml(msg.text) + announce)  : escapeHtml(msg.text)}</span>`;
		}
		//this.data : "RTCChat" or "RTCRoomChat"
		const target = document.getElementById(this.data);

		if(target.scrollTop + 10 >= target.scrollHeight - target.clientHeight){
			target.appendChild(li);
			target.scrollTop = target.scrollHeight - target.clientHeight;
		}else{
			target.appendChild(li);
		}

		if(msg.messageType == "Request" || msg.messageType == "Random"){
			const REQUEST_PLAYING = document.getElementsByClassName("request-playing")
			REQUEST_PLAYING[REQUEST_PLAYING.length-1].addEventListener("click" , requestPlay)
		}
	}
}


/**
*@Description コメント内のHTMLタグをエスケープ
*/
function escapeHtml(str) {
	str = str.replace(/&/g, '&amp;');
	str = str.replace(/</g, '&lt;');
	str = str.replace(/>/g, '&gt;');
	str = str.replace(/"/g, '&quot;');
	str = str.replace(/'/g, '&#39;');
	return str;
}


/**
*@Description 全角数字を半角数字に変換
*/
function hankaku2Zenkaku(str) {
	return str.replace(/[０-９]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
	});
}


/**
*@Description リクエストコマンドリミッター
*/
let requestLimit
let limitter = 0
function requestLimitter(limitterTime){
	const NOW_DATE = new Date().getTime()
	limitter = (requestDate + limitterTime) - NOW_DATE

	if(limitterTime == 20000){
		document.getElementById("ChatInput").setAttribute("placeholder",`メッセージを入力 (次のコマンド使用可能まで ${Math.floor(limitter / 1000)} 秒)`);
	}else{
		document.getElementById("ChatInput").setAttribute("placeholder",`連投を検知しました。 (次のチャット使用可能時間まで ${Math.floor(limitter / 1000)} 秒)`);
	}

	if(limitter < 0){
		document.getElementById("ChatInput").setAttribute("placeholder",`メッセージを入力　[コマンド #譜面ID or 譜面URL でリクエストができます。例：#22097 ランダム：#random] `);
		clearInterval(requestLimit)
		requestLimit = null
		sessionStorage.removeItem("LIMITTER")
		sessionStorage.removeItem("LIMITTER_TIME")
	}
}


/**
*@note チャット関連 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////






/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note リクエスト視聴再生 ここから ---
*/



function requestPlay (event){
	if(playing){ return;}
	if(typeof player != "undefined" && player.getPlayerState() == 1){
		player.pauseVideo()
	}
	$.ajax({
		type: 'POST',
		url: '/movie/lyrics/' + (+event.target.getAttribute("value")),
		success:function(data){
			const DATA_SPLIT = data.split("\n")
			start_time = -1
			speed_title = DATA_SPLIT[0].match(/^【\d?\.?\d?\d倍速】/)
			if(speed_title){
				speed_title = parseFloat(speed_title[0].slice(1))
				if(!speed_Fixed.includes(speed_title)){
					speed_title = false
				}
			}
			for(let i=0;i<DATA_SPLIT.length;i++){
				if(i>0){
					if(start_time == -1 && DATA_SPLIT[i].split("\t")[2]){
						start_time = Math.floor(+DATA_SPLIT[i].split("\t")[0])
						preview_time = +DATA_SPLIT[i].split("\t")[0]
					}else if(DATA_SPLIT[i].split("\t")[0].substr( -5, 1 ) == "."){
						start_time = Math.floor(+DATA_SPLIT[i].split("\t")[0])
						preview_time = +DATA_SPLIT[i].split("\t")[0]
						break;
					}
				}
			}
			demo_video_delete()
			control_enable = 0
			onYouTubeIframeAPIReady_Chat(data.match(/(v=).*\n/)[0].slice(2))
		}
	});
}

function onYouTubeIframeAPIReady_Chat(preview_videoid) {

	document.getElementsByTagName('section')[0].insertAdjacentHTML('beforebegin', `<div id="player_demo" style="position: fixed;
    z-index: 102;
    width: 355px;
    height: 200px;
    bottom: 30px;
    right: 17px;"></div>`)

	player_demo = new YT.Player('player_demo', {
		playerVars: {
			autoplay: 1,
			disablekb: 1,
			modestbranding:1,
			origin: location.protocol + '//' + location.hostname + "/",
			start: start_time
		},
		videoId: preview_videoid,
		events: {
			'onReady': onPlayerReady_demo,
			'onStateChange': onPlayerStateChange_demo

		}
	});
}

let random
let randomName
let player_random
if(+(location.pathname).replace(/[^0-9]/g, '') > 50571 && +(location.pathname).replace(/[^0-9]/g, '') > localStorage.getItem("randomMaxLength")){
	localStorage.setItem("randomMaxLength",(location.pathname).replace(/[^0-9]/g, ''))
}
function random_generator(){
	if(document.getElementById("player_box") == null){
		document.querySelector("head").insertAdjacentHTML('afterend', `<span id=player_box style="position:absolute;visibility:hidden;"></span>`)
	}
	random = Math.floor(Math.random() * (50571 - 5 + 1) + 5)
	$.ajax({
		type: 'POST',
		url: '/movie/lyrics/' + random,
		success:function(data){
			if(data.match(/(v=).*\n/) != null){
				createReq = new createRequest(data , random , "Random")
				onYouTubeIframeAPIReady_random(data.match(/(v=).*\n/)[0].slice(2))
			}else{
				random_generator()
			}
		},error: function(data) {
			random_generator()
		}
	});
}

function onYouTubeIframeAPIReady_random(preview_videoid) {
	player_random = ""
	player_random = new YT.Player('player_box', {
		height: 100 ,
		width: 100 ,
		playerVars: {
			autoplay: 0,
			controls: 0,
			disablekb: 1,
			modestbranding:1,
			origin: location.protocol + '//' + location.hostname + "/",
			start: 0
		},
		videoId: preview_videoid,
		events: {
			'onReady': onPlayerReady_check,
			'onError': onPlayerReady_check,


		}
	});
}

function onPlayerReady_check(event){

	if(event.target.videoTitle){
		createReq.createRequest()
		document.getElementById("player_box").remove()
	}else{
		//削除済みの動画だった場合は再度ランダム抽選
		document.getElementById("player_box").remove()
		random_generator()
	}

}

/**
*@note リクエスト視聴再生 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note リクエスト譜面情報取得 ここから ---
*/



class requestLyricInfo {

	constructor(data) {
		this.data = data;
		this.imperfectSokuonJoin = ["い", "う", "ん"]
		this.imperfectSokuonRomaList = ["i","u","n"]
		this.sokuonJoin = ["ヰ", "ゐ", "ヱ", "ゑ","ぁ", "ぃ", "ぅ", "ぇ", "ぉ","ゃ","ゅ","ょ","っ", "ゎ", "ヵ", "ヶ", "ゔ", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"]
		this.zenkakuList = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９", "Ａ", "Ｂ", "Ｃ", "Ｄ", "Ｅ", "Ｆ", "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ", "Ｍ", "Ｎ", "Ｏ", "Ｐ", "Ｑ", "Ｒ", "Ｓ", "Ｔ", "Ｕ", "Ｖ", "Ｗ", "Ｘ", "Ｙ", "Ｚ", "ａ", "ｂ", "ｃ", "ｄ", "ｅ", "ｆ", "ｇ", "ｈ", "ｉ", "ｊ", "ｋ", "ｌ", "ｍ", "ｎ", "ｏ", "ｐ", "ｑ", "ｒ", "ｓ", "ｔ", "ｕ", "ｖ", "ｗ", "ｘ", "ｙ", "ｚ", "～", "＆", "％", "！", "？", "＠", "＃", "＄", "（", "）", "｜", "｛", "｝", "｀", "＊", "＋", "：", "；", "＿", "＜", "＞", "＝", "＾"]
		this.nnList = ["あ", "い", "う", "え", "お", "な", "に", "ぬ", "ね", "の", "や", "ゆ", "よ", "ん", "'", "’"]

		this.romaMap = [
			["0", "0"],
			["1", "1"],
			["2", "2"],
			["3", "3"],
			["4", "4"],
			["5", "5"],
			["6", "6"],
			["7", "7"],
			["8", "8"],
			["9", "9"],
			["ぎゃ", "gya", "gilya", "gixya"],
			["ぎぃ", "gyi", "gili", "gixi", "gilyi", "gixyi"],
			["ぎゅ", "gyu", "gilyu", "gixyu"],
			["ぎぇ", "gye", "gile", "gixe", "gilye", "gixye"],
			["ぎょ", "gyo", "gilyo", "gixyo"],
			["きゃ", "kya", "kilya", "kixya"],
			["きぃ", "kyi", "kili", "kixi", "kilyi", "kixyi"],
			["きゅ", "kyu", "kilyu", "kixyu"],
			["きぇ", "kye", "kile", "kixe", "kilye", "kixye"],
			["きょ", "kyo", "kilyo", "kixyo"],
			["ぐぁ", "gwa", "gula", "guxa"],
			["ぐぃ", "gwi", "guli", "guxi", "gulyi", "guxyi"],
			["ぐぅ", "gwu", "gulu", "guxu"],
			["ぐぇ", "gwe", "gule", "guxe", "gulye", "guxye"],
			["ぐぉ", "gwo", "gulo", "guxo"],
			["しゃ", "sya", "sha", "silya", "sixya", "shilya", "shixya", "cilya", "cixya"],
			["しぃ", "syi", "sili", "sixi", "silyi", "shixyi", "shili", "shixi", "shilyi", "shixyi", "cili", "cixi", "cilyi", "cixyi"],
			["しゅ", "syu", "shu", "silyu", "sixyu", "shilyu", "shixyu", "cilyu", "cixyu"],
			["しぇ", "sye", "she", "sile", "sixe", "silye", "sixye", "shile", "shixe", "shilye", "shixye", "cile", "cixe", "cilye", "cixye"],
			["しょ", "syo", "sho", "silyo", "sixyo", "shilyo", "shixyo", "cilyo", "cixyo"],
			["じゃ", "ja", "zya", "jya", "jilya", "jixya", "zilya", "zixya"],
			["じぃ", "zyi", "jyi", "jili", "jixi", "jilyi", "jixyi", "zili", "zixi", "zilyi", "zixyi"],
			["じゅ", "ju", "zyu", "jyu", "jilyu", "jixyu", "zilyu", "zixyu"],
			["じぇ", "je", "zye", "jye", "jile", "jixe", "jilye", "jixye", "zile", "zixe", "zilye", "zixye"],
			["じょ", "jo", "zyo", "jyo", "jilyo", "jixyo", "zilyo", "zixyo"],
			["すぁ", "swa", "sula", "suxa"],
			["すぃ", "swi", "suli", "suxi", "sulyi", "suxyi"],
			["すぅ", "swu", "sulu", "suxu"],
			["すぇ", "swe", "sule", "suxe", "sulye", "suxye"],
			["すぉ", "swo", "sulo", "suxo"],
			["ちゃ", "tya", "cya", "cha", "tilya", "tixya", "chilya", "chixya"],
			["ちぃ", "tyi", "cyi", "tili", "tixi", "tilyi", "tixyi", "chili", "chixi", "chilyi", "chixyi"],
			["ちゅ", "tyu", "cyu", "chu", "tilyu", "tixyu", "chilyu", "chixyu"],
			["ちぇ", "tye", "cye", "che", "tile", "tixe", "tilye", "tixye", "chile", "chixe", "chilye", "chixye"],
			["ちょ", "tyo", "cyo", "cho", "tilyo", "tixyo", "chilyo", "chixyo"],
			["ぢゃ", "dya", "dilya", "dixya"],
			["ぢぃ", "dyi", "dili", "dixi", "dilyi", "dixyi"],
			["ぢゅ", "dyu", "dilyu", "dixyu"],
			["ぢぇ", "dye", "dile", "dixe", "dilye", "dixye"],
			["ぢょ", "dyo", "dilyo", "dixyo"],
			["つぁ", "tsa", "tula", "tuxa", "tsula", "tsuxa"],
			["つぃ", "tsi", "tuli", "tuxi", "tulyi", "tuxyi", "tsuli", "tsuxi", "tsulyi", "tsuxyi"],
			["つぇ", "tse", "tule", "tuxe", "tulye", "tuxye", "tsule", "tsuxe", "tsulye", "tsuxye"],
			["つぉ", "tso", "tulo", "tuxo", "tsulo", "tsuxo"],
			["てゃ", "tha", "telya", "texya"],
			["てぃ", "thi", "t'i", "teli", "texi", "telyi", "texyi"],
			["てゅ", "thu", "t'yu", "telyu", "texyu"],
			["てぇ", "the", "tele", "texe", "telye", "texye"],
			["てょ", "tho", "telyo", "texyo"],
			["でゃ", "dha", "delya", "dexya"],
			["でぃ", "dhi", "d'i", "deli", "dexi", "delyi", "dexyi"],
			["でゅ", "dhu", "d'yu", "delyu", "dexyu"],
			["でぇ", "dhe", "dele", "dexe", "delye", "dexye"],
			["でょ", "dho", "delyo", "dexyo"],
			["とぁ", "twa", "tola", "toxa"],
			["とぃ", "twi", "toli", "toxi", "tolyi", "toxyi"],
			["とぅ", "twu", "t'u", "tolu", "toxu"],
			["とぇ", "twe", "tole", "toxe", "tolye", "toxye"],
			["とぉ", "two", "tolo", "toxo"],
			["どぁ", "dwa", "dola", "doxa"],
			["どぃ", "dwi", "doli", "doxi", "dolyi", "doxyi"],
			["どぅ", "dwu", "d'u", "dolu", "doxu"],
			["どぇ", "dwe", "dole", "doxe", "dolye", "doxye"],
			["どぉ", "dwo", "dolo", "doxo"],
			["にゃ", "nya", "nilya", "nixya"],
			["にぃ", "nyi", "nili", "nixi", "nilyi", "nixyi"],
			["にゅ", "nyu", "nilyu", "nixyu"],
			["にぇ", "nye", "nile", "nixe", "nilye", "nixye"],
			["にょ", "nyo", "nilyo", "nixyo"],
			["ひゃ", "hya", "hilya", "hixya"],
			["ひぃ", "hyi", "hili", "hixi", "hilyi", "hixyi"],
			["ひゅ", "hyu", "hilyu", "hixyu"],
			["ひぇ", "hye", "hile", "hixe", "hilye", "hixye"],
			["ひょ", "hyo", "hilyo", "hixyo"],
			["ぴゃ", "pya", "pilya", "pixya"],
			["ぴぃ", "pyi", "pili", "pixi", "pilyi", "pixyi"],
			["ぴゅ", "pyu", "pilyu", "pixyu"],
			["ぴぇ", "pye", "pile", "pixe", "pilye", "pixye"],
			["ぴょ", "pyo", "pilyo", "pixyo"],
			["びゃ", "bya", "bilya", "bixya"],
			["びぃ", "byi", "bili", "bixi", "bilyi", "bixyi"],
			["びゅ", "byu", "bilyu", "bixyu"],
			["びぇ", "bye", "bile", "bixe", "bilye", "bixye"],
			["びょ", "byo", "bilyo", "bixyo"],
			["ゔぁ", "va", "vula", "vuxa"],
			["ゔぃ", "vi", "vyi", "vuli", "vuxi", "vulyi", "vuxyi"],
			["ゔぇ", "ve", "vye", "vule", "vuxe", "vulye", "vuxye"],
			["ゔぉ", "vo", "vulo", "vuxo"],
			["ゔゃ", "vya", "vulya", "vuxya"],
			["ゔゅ", "vyu", "vulyu", "vuxyu"],
			["ゔょ", "vyo", "vulyo", "vuxyo"],
			["ふぁ", "fa", "fwa", "hwa", "fula", "fuxa", "hula", "huxa"],
			["ふぃ", "fi", "fwi", "hwi", "fuli", "fuxi", "fulyi", "fuxyi", "huli", "huxi", "hulyi", "huxyi"],
			["ふぅ", "fwu", "fulu", "fuxu", "hulu", "huxu"],
			["ふぇ", "fe", "fwe", "fye", "hwe", "fule", "fuxe", "fulye", "fuxye", "hule", "huxe", "hulye", "huxye"],
			["ふぉ", "fo", "fwo", "hwo", "fulo", "fuxo", "hulo", "huxo"],
			["ふゃ", "fya", "fulya", "fuxya", "hulya", "huxya"],
			["ふゅ", "fyu", "hwyu", "fulyu", "fuxyu", "hulyu", "huxyu"],
			["ふょ", "fyo", "fulyo", "fuxyo", "hulyo", "huxyo"],
			["みゃ", "mya", "milya", "mixya"],
			["みぃ", "myi", "mili", "mixi", "milyi", "mixyi"],
			["みゅ", "myu", "milyu", "mixyu"],
			["みぇ", "mye", "mile", "mixe", "milye", "mixye"],
			["みょ", "myo", "milyo", "mixyo"],
			["りゃ", "rya", "rilya", "rixya"],
			["りぃ", "ryi", "rili", "rixi", "rilyi", "rixyi"],
			["りゅ", "ryu", "rilyu", "rixyu"],
			["りぇ", "rye", "rile", "rixe", "rilye", "rixye"],
			["りょ", "ryo", "rilyo", "rixyo"],
			["いぇ", "ye", "ile", "ixe", "ilye", "ixye", "yile", "yixe", "yilye", "yixye"],
			["うぁ", "wha", "ula", "uxa", "wula", "wuxa", "whula", "whuxa"],
			["うぃ", "wi", "whi", "uli", "uxi", "ulyi", "uxyi", "wuli", "wuxi", "wulyi", "wuxyi", "whuli", "whuxi", "whulyi", "whuxyi"],
			["うぇ", "we", "whe", "ule", "uxe", "ulye", "uxye", "wule", "wuxe", "wulye", "wuxye", "whule", "whuxe", "whulye", "whuxye"],
			["うぉ", "who", "ulo", "uxo", "wulo", "wuxo", "whulo", "whuxo"],
			["くぁ", "qa", "qwa", "kwa", "kula", "kuxa", "qula", "quxa", "cula", "cuxa"],
			["くぃ", "qi", "qwi", "qyi", "kwi", "kuli", "kuxi", "kulyi", "kuxyi", "quli", "quxi", "qulyi", "quxyi", "culi", "cuxi", "culyi", "cuxyi"],
			["くぅ", "qwu", "kwu", "kulu", "kuxu", "qulu", "quxu", "culu", "cuxu"],
			["くぇ", "qe", "qwe", "qye", "kwe", "kule", "kuxe", "kulye", "kuxye", "qule", "quxe", "qulye", "quxye", "cule", "cuxe", "culye", "cuxye"],
			["くぉ", "qo", "qwo", "kwo", "kulo", "kuxo", "qulo", "quxo", "culo", "cuxo"],
			["くゃ", "qya", "kulya", "kuxya", "qulya", "quxya", "culya", "cuxya"],
			["くゅ", "qyu", "kulyu", "kuxyu", "qulyu", "quxyu", "culyu", "cuxyu"],
			["くょ", "qyo", "kulyo", "kuxyo", "qulyo", "quxyo", "culyo", "cuxyo"],
			["あ", "a"],
			["い", "i", "yi"],
			["う", "u", "wu", "whu"],
			["え", "e"],
			["お", "o"],
			["か", "ka", "ca"],
			["き", "ki"],
			["く", "ku", "cu", "qu"],
			["け", "ke"],
			["こ", "ko", "co"],
			["さ", "sa"],
			["し", "si", "ci", "shi"],
			["す", "su"],
			["せ", "se", "ce"],
			["そ", "so"],
			["た", "ta"],
			["ち", "ti", "chi"],
			["つ", "tu", "tsu"],
			["て", "te"],
			["と", "to"],
			["な", "na"],
			["に", "ni"],
			["ぬ", "nu"],
			["ね", "ne"],
			["の", "no"],
			["は", "ha"],
			["ひ", "hi"],
			["ふ", "hu", "fu"],
			["へ", "he"],
			["ほ", "ho"],
			["ま", "ma"],
			["み", "mi"],
			["む", "mu"],
			["め", "me"],
			["も", "mo"],
			["や", "ya"],
			["ゆ", "yu"],
			["よ", "yo"],
			["ら", "ra"],
			["り", "ri"],
			["る", "ru"],
			["れ", "re"],
			["ろ", "ro"],
			["わ", "wa"],
			["を", "wo"],
			["ん", "n", "xn", "n'"],
			["ゔ", "vu"],
			["が", "ga"],
			["ぎ", "gi"],
			["ぐ", "gu"],
			["げ", "ge"],
			["ご", "go"],
			["ざ", "za"],
			["じ", "zi", "ji"],
			["ず", "zu"],
			["ぜ", "ze"],
			["ぞ", "zo"],
			["だ", "da"],
			["ぢ", "di"],
			["づ", "du"],
			["で", "de"],
			["ど", "do"],
			["ば", "ba"],
			["び", "bi"],
			["ぶ", "bu"],
			["べ", "be"],
			["ぼ", "bo"],
			["ぱ", "pa"],
			["ぴ", "pi"],
			["ぷ", "pu"],
			["ぺ", "pe"],
			["ぽ", "po"],
			["ぁ", "xa", "la"],
			["ぃ", "xi", "li", "lyi", "xyi"],
			["ぅ", "xu", "lu"],
			["ぇ", "xe", "le", "lye", "xye"],
			["ぉ", "xo", "lo"],
			["ゃ", "xya", "lya"],
			["ゅ", "xyu", "lyu"],
			["ょ", "xyo", "lyo"],
			["ゎ", "xwa", "lwa"],
			["っ", "xtu", "ltu", "xtsu", "ltsu"],
			["ヵ", "xka", "lka"],
			["ヶ", "xke", "lke"],
			["←", "zh"],
			["↓", "zj"],
			["↑", "zk"],
			["→", "zl"],
			["『", "z["],
			["』", "z]"],
			["ヰ", "wyi"],
			["ゐ", "wyi"],
			["ヱ", "wye"],
			["ゑ", "wye"],
			["ー", "-"],
			["、", ","],
			["。", "."],
			["・", "/" , "z/"],
			["”", "\""],
			["“", "\""],
			["’", "'"],
			["￥", "\\"],
			["「", "["],
			["」", "]"]
		];
	}

	splitData() {
		const lines = this.data.split("\n");
		const lines_length = lines.length
		const speed_= lines[0].split("\t")[0].match(/^【\d?\.?\d?\d倍速】/)
		const speed_Fixed = [0.25,0.5,0.75,1.00,1.25,1.5,1.75,2]
		this.lyricsArray = []
		this.kanaLyric = ""
		this.titleSpeed = 1
		if(speed_){
			this.titleSpeed = parseFloat(speed_[0].slice(1))
			if(!speed_Fixed.includes(this.titleSpeed)){
				this.titleSpeed = 1
			}
		}

		for (let s=1; s<lines_length; s++){
			let LINE = lines[s].split("\t");

			if(s == 1){
				//先頭の行が["0", "", ""]出ない場合、["0", "", ""]を挿入
				if(+LINE[0] > 0 ){
					LINE = ["0", "", ""]
					s--
				}
			}

			if(LINE.length >= 3){

			}else{
				LINE.push("")
			}

			this.kanaLyric += LINE[2].replace(/[ 　]+$/,"").replace(/^[ 　]+/,"")+"\n"
			this.lyricsArray.push(LINE);

			if(LINE[1] == "end") {
				this.movieTotalTime = parseInt(LINE[0] * this.titleSpeed);
				this.movieTime_mm =("00" + parseInt(parseInt(this.movieTotalTime) / 60)).slice(-2)
				this.movieTime_ss = ("00" +(parseInt(this.movieTotalTime) - this.movieTime_mm * 60)).slice(-2)
				break;
			}
		};
		this.kanaLyric = this.kanaLyric
			.replace(/…/g,"...")
			.replace(/‥/g,"..")
			.replace(/･/g,"・")
			.replace(/〜/g,"～")
			.replace(/｢/g,"「")
			.replace(/｣/g,"」")
			.replace(/､/g,"、")
			.replace(/｡/g,"。")
			.replace(/　/g," ")
			.replace(/ヴ/g,"ゔ")
			.replace(/－/g,"ー")

	}


	createTypingData(){
		const romaMap_length = this.romaMap.length
		this.typingArrayKana = []
		this.typingArrayRoma = []

		for (let i=0; i<romaMap_length; i++){
			if(this.romaMap[i].length > 1){
				this.kanaLyric = this.kanaLyric.replace(RegExp(this.romaMap[i][0],"g"),"\t"+i+"\t");
			}
		};

		this.kanaLyric = this.kanaLyric.split("\n")

		for(let m=0;m<this.lyricsArray.length;m++){
			if(this.kanaLyric[m] && this.lyricsArray[m][1] != "end"){
				const arr = this.createKanaAndRomaWord(this.kanaLyric[m]);
				this.typingArrayKana.push(arr[0]);
				this.typingArrayRoma.push(arr[1]);
			} else {
				this.typingArrayKana.push([]);
				this.typingArrayRoma.push([]);
			}
		}
	}


	createKanaAndRomaWord(str) {
		var str_array = [];
		var kana_array = [];
		var roma_array = [];
		str = str.split("\t").filter(word => word > "")
		const str_length = str.length

		for (let i=0; i<str_length; i++){
			if(this.romaMap[parseInt(str[i])]){
				kana_array.push(this.romaMap[parseInt(str[i])][0]);
				str_array.push(this.romaMap[parseInt(str[i])].slice(1));
				roma_array.push(this.romaMap[parseInt(str[i])][1]);
				//促音の打鍵パターン
				if(kana_array.length >= 2 && kana_array[kana_array.length-2][kana_array[kana_array.length-2].length-1]=="っ"){
					if(this.sokuonJoin.includes(kana_array[kana_array.length-1][0])){
						const xtu_times = ( kana_array[kana_array.length-2].match( /っ/g ) || [] ).length

						kana_array[kana_array.length-1] = kana_array[kana_array.length-2] + kana_array[kana_array.length-1]
						kana_array.splice(-2,1)
						const length = str_array[str_array.length-1].length
						let repeat = []
						let xtu = []
						let ltu = []
						let xtsu = []
						let ltsu = []
						for(let s = 0;s<length;s++){
							repeat.push(str_array[str_array.length-1][s][0].repeat(xtu_times)+str_array[str_array.length-1][s])
							xtu.push("x".repeat(xtu_times)+"tu"+str_array[str_array.length-1][s])
							ltu.push("l".repeat(xtu_times)+"tu"+str_array[str_array.length-1][s])
							xtsu.push("x".repeat(xtu_times)+"tsu"+str_array[str_array.length-1][s])
							ltsu.push("l".repeat(xtu_times)+"tsu"+str_array[str_array.length-1][s])
						}

						str_array[str_array.length-1] = [...repeat,...xtu,...ltu,...xtsu,...ltsu]
						str_array.splice(-2,1)

						roma_array[roma_array.length-1] = str_array[str_array.length-1][0]
						roma_array.splice(-2,1)
					}else if(this.imperfectSokuonJoin.includes(kana_array[kana_array.length-1][0])){
						const xtu_times = ( kana_array[kana_array.length-2].match( /っ/g ) || [] ).length

						kana_array[kana_array.length-1] = kana_array[kana_array.length-2] + kana_array[kana_array.length-1]
						kana_array.splice(-2,1)

						const length = str_array[str_array.length-1].length
						let repeat = []
						let xtu = []
						let ltu = []
						let xtsu = []
						let ltsu = []
						for(let s = 0;s<length;s++){
							if(!this.imperfectSokuonRomaList.includes(str_array[str_array.length-1][s][0])){
								repeat.push(str_array[str_array.length-1][s][0].repeat(xtu_times)+str_array[str_array.length-1][s])
							}
							xtu.push("x".repeat(xtu_times)+"tu"+str_array[str_array.length-1][s])
							ltu.push("l".repeat(xtu_times)+"tu"+str_array[str_array.length-1][s])
							xtsu.push("x".repeat(xtu_times)+"tsu"+str_array[str_array.length-1][s])
							ltsu.push("l".repeat(xtu_times)+"tsu"+str_array[str_array.length-1][s])
						}

						str_array[str_array.length-1] = [...repeat,...xtu,...ltu,...xtsu,...ltsu]
						str_array.splice(-2,1)

						roma_array[roma_array.length-1] = str_array[str_array.length-1][0]
						roma_array.splice(-2,1)
					}
				}

				//n→nn変換
				const n_kana_check = kana_array[kana_array.length-2]
				if(n_kana_check && n_kana_check[n_kana_check.length-1]=="ん"){
					if(this.nnList.includes(kana_array[kana_array.length-1][0])){
						for(let n=0;n<str_array[str_array.length-2].length;n++){
							const str_pattern = str_array[str_array.length-2][n]
							if((str_pattern.length >= 2 && str_pattern[str_pattern.length-2] != "x" && str_pattern[str_pattern.length-1] == "n") || str_pattern=="n"){
								str_array[str_array.length-2][n] = str_array[str_array.length-2][n]+"n"
							}
						}
						roma_array[roma_array.length-2] = str_array[str_array.length-2][0]
						//それ以外の文字でもnnの入力を可能にする
					}else if(kana_array[kana_array.length-1]){
						const array_length = str_array[str_array.length-1].length
						for (let i=0; i<array_length; i++){
							str_array[str_array.length-1].push("n"+str_array[str_array.length-1][i])
							str_array[str_array.length-1].push("'"+str_array[str_array.length-1][i])
						}
					}
				}

			} else{

				//打鍵パターン生成を行わなくて良い文字はそのままtyping_arrayに追加
				for (let v=0; v<str[i].length; v++){
					kana_array.push( str[i][v] );
					let typing_character = str[i][v]
					if(this.zenkakuList.includes(str[i][v])){
						typing_character = String.fromCharCode(typing_character.charCodeAt(0) - 0xFEE0);
					}
					roma_array.push(typing_character);
					if(/[A-Z]/.test(typing_character) ){
						typing_character = typing_character.toLowerCase()
					}
					str_array.push( [typing_character] );

					//n→nn変換
					if(v == 0){

						//ん
						const n_kana_check = kana_array[kana_array.length-2]
						//「アルファベット シングルクォート」の [n] 非対応の文字がkana_arrayに追加されたとき、 [n]→[nn] に置き換えます。
						if(n_kana_check && n_kana_check[n_kana_check.length-1]=="ん"){
							if(/[a-zA-Zａ-ｚＡ-Ｚ]/.test(kana_array[kana_array.length-1])||this.nnList.includes(kana_array[kana_array.length-1][0])){
								for(let n=0;n<str_array[str_array.length-2].length;n++){
									const str_pattern = str_array[str_array.length-2][n]
									if((str_pattern.length >= 2 && str_pattern[str_pattern.length-2] != "x" && str_pattern[str_pattern.length-1] == "n") || str_pattern=="n"){
										str_array[str_array.length-2][n] = str_array[str_array.length-2][n]+"n"
									}
								}
								roma_array[roma_array.length-2] = str_array[str_array.length-2][0]
								//それ以外の文字でもnnの入力を可能にする
							}else if(kana_array[kana_array.length-1]){
								const array_length = str_array[str_array.length-1].length
								for (let i=0; i<array_length; i++){
									str_array[str_array.length-1].push("n"+str_array[str_array.length-1][i])
									str_array[str_array.length-1].push("'"+str_array[str_array.length-1][i])
								}
							}
						}
					}
				}
			}

		};

		//kana_array最後の文字が「ん」だった場合も[nn]に置き換えます。
		if(kana_array[kana_array.length-1] == "ん"){
			roma_array.splice(-1,1,'nn')
			str_array[str_array.length-1][0] = 'nn'
			str_array[str_array.length-1].push("n'")
		}
		return [kana_array, roma_array];
	}

	getTypingDataInfo() {

		this.lineDifficultyDataRoma = []
		this.lineDifficultyDataKana = []
		this.totalNotesKanaMode = 0
		this.totalNotesRomaMode = 0
		for (let i=0; i<this.lyricsArray.length; i++){

			//typing_arrayのi番号がend行と同じ番号なら総合打鍵数に含まない
			if(this.lyricsArray[i][1]!='end' && this.typingArrayRoma[i] != ''){

				const LINE_SPEED = this.lyricsArray[i+1][0]-this.lyricsArray[i][0]

				//かな入力
				const LINE_DAKU_HANDAKU = (this.typingArrayKana[i].join('').match( /[ゔ|が|ぎ|ぐ|げ|ご|ざ|じ|ず|ぜ|ぞ|だ|ぢ|づ|で|ど|ば|び|ぶ|べ|ぼ|ぱ|ぴ|ぷ|ぺ|ぽ]/g ) || [] ).length
				const LINE_NOTES_KANA = this.typingArrayKana[i].join('').replace(/ /g,"").length
				this.totalNotesKanaMode += (LINE_NOTES_KANA + LINE_DAKU_HANDAKU)

				//ローマ字入力
				const LINE_NOTES_ROMA = this.typingArrayRoma[i].join('').replace(/ /g,"").length
				this.totalNotesRomaMode += LINE_NOTES_ROMA

				this.lineDifficultyDataRoma.push(LINE_SPEED > 0 ? (Math.round((LINE_NOTES_ROMA / LINE_SPEED) * 100) / 100) * this.titleSpeed : 0)
				this.lineDifficultyDataKana.push(LINE_SPEED > 0 ? (Math.round(( (LINE_NOTES_KANA + LINE_DAKU_HANDAKU) / LINE_SPEED) * 100) / 100) * this.titleSpeed : 0)

			}else if(this.lyricsArray[i][1]=='end'){

				this.medianRomaSpeed = this.median(this.lineDifficultyDataRoma);
				this.medianKanaSpeed = this.median(this.lineDifficultyDataKana);
				this.maxRomaSpeed = Math.max(...this.lineDifficultyDataRoma)
				this.maxKanaSpeed = Math.max(...this.lineDifficultyDataKana)
				break;
			}

		};
	}

	median(arr) {
		arr = arr.filter(function(a) {return a !== 0;})
		var half = (arr.length/2)|0;
		var temp = arr.sort((a, b) => a - b);

		if (temp.length%2) {
			return temp[half];
		}

		return (temp[half-1] + temp[half])/2;
	};
}






/**
*@note リクエスト譜面情報取得 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note クッキー関連 ここから ---
*/


/**
*@description クッキーデータの読み込み
*@param name
*@return val
*/
function ReadFromCookie(name){
	var result = null;

	var cookieName = name + '=';
	var allcookies = document.cookie;

	var position = allcookies.indexOf( cookieName );
	if( position != -1 )
	{
		var startIndex = position + cookieName.length;

		var endIndex = allcookies.indexOf( ';', startIndex );
		if( endIndex == -1 )
		{
			endIndex = allcookies.length;
		}

		result = decodeURIComponent(
			allcookies.substring( startIndex, endIndex ) );
	}
	return result;
}

/**
*@description クッキーにデータの書き込み
*@param name
*@param val
*/
function WriteToCookie(name, val){
	var expire = new Date();
	expire.setTime( expire.getTime() + 1000 * 3600 * 24 * 30);
	document.cookie = name + '=' +  encodeURIComponent(val) + '; path=/ ; expires=' + expire.toUTCString();
}


/**
*@note クッキー関連 ここから ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////











/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note room関連 ここから ---
*/

let roomID;
let playSpeeds = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00];

class updateRoomsInfo{

	/**
*@Description Roomが追加された
*/
	onAddRoom(snapShot){
		const msg = snapShot.val();
		const roomID_ = snapShot.ref_.path.pieces_[1];
		if(roomID_ == "null"){ return; }

		const roomName = msg.roomName;
		const desc = msg.description;
		const state = msg.state;
		const movieInfo = msg.movieInfo
		const roomMaster = msg.roomMaster;
		const players = msg.users;
		const roomPassWord = msg.roomPassWord;

		//キックされた部屋なら表示しない
		if(msg.kick != null && myIP){
			if(msg.kick[myIP.replace(/\./g , "")] != undefined){
				return;
			}
		}

		var DOMroom = document.createElement("div");
		DOMroom.id = roomID_;
		DOMroom.classList.add("RTCroom");

		DOMroom.addEventListener("click",function(event){
			const roomID_ = event.currentTarget.id

			if(event.currentTarget.closest(".RTCroom")){
				if(/debug$/.test(event.currentTarget.id)){
					if (window.confirm("このルームは対戦機能テスト用のデバッグルームです。\nこのルームに参加するにはTampermonkeyアドオンとテストページ用対戦スクリプトをブラウザに導入する必要があります。\nTampermonkeyアドオンを導入済みの場合はOKを選択してください。")) {

						firebase.database().ref('debugData').once('value').then(debugData => {
							if(!localStorage.getItem("testScriptVersion")){
								window.open(debugData.val().ScriptURL, '_blank');
								alert("別タブで開かれたテストページ用対戦スクリプトを更新・または導入してください。")
							}
							EnterRoom(roomID_);
						})

					}else{
						return;
					}
				}


				if(event.currentTarget.id.length == 14){
					EnterRoom(roomID_);
				}else if(event.currentTarget.id.length == 15){
					const pass_form = window.prompt("このルームに参加するにはパスワードが必要です")
					if(pass_form){
						firebase.database().ref('rooms/' + roomID_ + '/roomPassWord').once('value').then(roomPassWord => {
							if(roomPassWord.val() == pass_form){
								EnterRoom(roomID_);
							}else{
								alert("パスワードが違います。")
							}
						})
					}
				}


			}
		});
		document.getElementById("RTCRooms").appendChild(DOMroom);

		var DOMroomTitle = document.createElement("div");
		DOMroomTitle.setAttribute("id","roomTitle");
		DOMroomTitle.setAttribute("style",`display: flex;justify-content: space-between;`);
		DOMroom.appendChild(DOMroomTitle);

		var DOMName = document.createElement("p");
		DOMName.setAttribute("style","font-size:14px;margin:2px 2px;");
		DOMName.textContent = roomName;
		DOMName.classList.add("RTCroomName");
		DOMroomTitle.appendChild(DOMName);

		if(roomPassWord){
			DOMName.insertAdjacentHTML('afterend', `<i class="fas fa-lock" style="margin: 6px 9px 0 5px;font-size: 1.5rem;"></i>`)
		}

		var DOMDesc = document.createElement("p");
		DOMDesc.setAttribute("style","font-size:10px;margin:2px 2px;");
		DOMDesc.textContent = desc;
		DOMDesc.classList.add("RTCroomDescription");
		DOMroom.appendChild(DOMDesc);

		var DOMstatus = document.createElement("p");
		DOMstatus.setAttribute("style","font-size:8px;margin:10px 2px;");
		DOMstatus.classList.add("RTCroomPlayStatus");

		if(state == "play"){
			DOMstatus.textContent = "プレイ中";
		}else if(state == "result"){
			DOMstatus.textContent = "プレイ終了";
		}else{
			DOMstatus.textContent = "プレイ前";
		}
		DOMroom.appendChild(DOMstatus);


		var DOMMovieTitle = document.createElement("p");
		DOMMovieTitle.setAttribute("style","font-size:8px;margin:2px 2px;");
		DOMMovieTitle.classList.add("RTCroomMovieTitle");
		if(movieInfo){
			DOMMovieTitle.textContent = "楽曲: [ID" + movieInfo.movieID + "]" + movieInfo.movieTitle;
		}
		DOMroom.appendChild(DOMMovieTitle);

		var DOMplayers = document.createElement("p");
		DOMplayers.setAttribute("style","font-size:8px;margin:10px 2px; 2px");
		DOMplayers.classList.add("RTCroomPlayers");
		DOMroom.appendChild(DOMplayers);

		if(players != null){
			let playersName = ""
			Object.keys(players).forEach(function(key) {
				playersName +=  " " + players[key].name;
			});
			DOMplayers.textContent += "参加者:"+playersName
		}

		document.getElementById("noRoomMes").classList.add('is-hide');
	}


	/**
*@Description Room情報が変更された
*/
	onChangeRoom(snapshot){
		const msg = snapshot.val();
		const roomID_ = snapshot.ref_.path.pieces_[1];
		const roomName = msg.roomName;
		const desc = msg.description;
		const state = msg.state;
		const movieInfo = msg.movieInfo
		const roomMaster = msg.roomMaster;
		const players = msg.users;
		const roomPassWord = msg.roomPassWord;
		const roomCreateTimeStamp = msg.roomCreateTimeStamp;
		//キックされた部屋なら表示しない
		if(msg.kick != null && myIP){
			if(msg.kick[myIP.replace(/\./g , "")] != undefined){
				return;
			}
		}

		const ELAPSED_TIME = LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp) - roomCreateTimeStamp;
		let sec = ELAPSED_TIME / 1000;
		let hour = Math.floor(sec / 3600);
		let min = Math.floor(sec % 3600 / 60);
		console.log(`${hour}時間 ${min}分`);


		//変更されたルームの情報を上書き
		document.getElementById(roomID_).getElementsByClassName("RTCroomName")[0].textContent = roomName;
		document.getElementById(roomID_).getElementsByClassName("RTCroomDescription")[0].textContent = desc;
		if(movieInfo){
			document.getElementById(roomID_).getElementsByClassName("RTCroomMovieTitle")[0].textContent= "楽曲: [ID" + movieInfo.movieID + "]" + movieInfo.movieTitle;
		}
		if(state == "play"){
			document.getElementById(roomID_).getElementsByClassName("RTCroomPlayStatus")[0].textContent = "プレイ中";
		}else if(state == "result"){
			document.getElementById(roomID_).getElementsByClassName("RTCroomPlayStatus")[0].textContent = "プレイ終了";
		}else{
			document.getElementById(roomID_).getElementsByClassName("RTCroomPlayStatus")[0].textContent = "プレイ前";
		}

		if(players != null){

			let playersName = ""
			Object.keys(players).forEach(function(key) {
				playersName += " " + players[key].name;
			});
			document.getElementById(roomID_).getElementsByClassName("RTCroomPlayers")[0].textContent = "参加者:"+playersName
		}

	}

/**
*@Description Roomが削除された
*/
	onRemoveRoom(snapshot){
		const msg = snapshot.val();
		const roomID_ = snapshot.ref_.path.pieces_[1];
		const RemoveRoom = document.getElementById(roomID_)
		if(RemoveRoom){
			document.getElementById(roomID_).remove();
		}
		if(document.getElementById("RTCRooms").getElementsByClassName("RTCroom").length === 0){
			document.getElementById("noRoomMes").classList.remove('is-hide');
			document.getElementById("noRoomMes").textContent = "現在ルームが存在しません。";
		}
	}



}






/**
*@Description [新しくルームを作成] ボタンが押された
*/
function onClickCreateNewRoom(){
	playSE("click");
	document.getElementById("createNewRoom").classList.add('is-show');
	document.getElementById("roomName").focus();
	document.getElementById("roomName").setSelectionRange(999, 999);
}

/**
*@Description　32文字の一意な文字列を作成
*/
function getUniqueStr(){
	const strong = 1000;
	return new Date().getTime().toString(16) + Math.floor(strong*Math.random()).toString(16);
}

/**
*@Description [ルームを作成] ボタンが押された
*/

let debugMode = false
function onClickCreateRoom(){

	const roomPassWord = document.getElementById("Enable_PassWord").checked ? document.getElementById("roomPassWordArea").value:""
	let roomID_ = getUniqueStr()


	//roomIDが14文字のIDになるように調整
	if(roomID_.length < 14){
		while(roomID_.length != 14){
			roomID_ += "0"
		}
	}else if(roomID_.length > 14){
		while(roomID_.length != 14){
			roomID_ = roomID_.slice(0,-1)
		}
	}


	if(roomPassWord){
		roomID_ = "P"+roomID_
	}

	if(debugMode){
		roomID_ = roomID_.replace(/.{5}$/,"debug")
	}


	const description = document.getElementById("roomDescription").value;

	let _movieID = movieID;
	if(_movieID == null){
		_movieID = " ";
	}
	let _movieTitle = movieTitle;
	if(_movieTitle == null){
		_movieTitle = " ";
	}

	const roomMaster = myID;
	const roomName = document.getElementById("roomName").value;
	const state = "idle";


	var path = firebase.database().ref('rooms/' + roomID_);
	path.set({
		"description": description,
		"movieInfo":{
			"movieID" :_movieID,
			"movieTitle": _movieTitle
		},
		"roomMaster": roomMaster,
		"roomName": roomName,
		"roomPassWord": roomPassWord,
		"roomCreateTimeStamp": LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp),
		"state": state,
		"playSpeed": 3,
		"playMode": "Score",
		"skipMode": "HOST",
		"AutoStart": false
	});

	document.getElementById("createNewRoom").classList.remove('is-show');
	EnterRoom(roomID_);
}

/**
*@Description [キャンセル] ボタンが押された
*/
function onClickCancel(){
	playSE("cancel");
	document.getElementById("createNewRoom").classList.remove('is-show');
}

let isEnter;
let roomChat
let roomUpdate


/**
*@Description プレイ者がいなければ部屋の状態をidleにする
*@param
*/
function roomStateCheck(roomState , roomUsers){
	if(roomState == "play" || roomState == "result"){
		const playCheck = (userState) => userState == "play";
		let usersState = []
		const roomUsersKey = Object.keys(roomUsers)
		for(let i=0;i<roomUsersKey.length;i++){
			const key = roomUsersKey[i]
			if(myID != key){
				usersState.push(roomUsers[key].state)
			}
		}

		if(!usersState.some(playCheck)){
			var updates = {};
			updates['/rooms/' + roomID + '/state'] = "idle";
			roomState = "idle"
			firebase.database().ref().update(updates);
		}
	}
	return roomState;
}

/**
*@Description ホストならゲーム開始ボタン、参加者なら準備完了 or 途中参加ボタンを表示する
*@param
*/
function readyButtonDisplay(isRoomState){

	if(!isRoomMaster){
		document.getElementById("RTCbtnReady").classList.remove("is-hide");
		document.getElementById("RTCbtnGameStart").classList.add("is-hide");
		if(isRoomState == "play"){
			document.getElementById("RTCbtnReady").value = "途中参加"
		}

	}else if(isRoomMaster){
		document.getElementById("RTCbtnReady").classList.add("is-hide");
		document.getElementById("RTCbtnGameStart").classList.remove("is-hide");

		if(movieID && !playing){
			window.addEventListener("keydown" , ready_key)
		}

	}

}

/**
*@Description (F5時)ホストが自動開始設定を有効にしている。
*@param
*/
function autoStartCheck(AutoStart , roomState , Users){

	if(isRoomMaster && AutoStart){
		document.getElementById("RTC_AutoStart").checked = true

		if(roomState == "idle" && Object.keys(Users).length > 1){
			let updates = {}
			prevState = "Auto_ready"
			updates['users/' + myID + '/state'] = "Auto_ready";
			firebase.database().ref().update(updates);
		}
	}

}


/**
*@Description デバッグルームに入室しているか
*@param
*/
function inDebugRoomCheck(_roomID){
	if(/debug$/.test(_roomID)){
		if(localStorage.getItem("testScriptVersion")){
			debugMode = true
		}

		//バージョンチェック
		firebase.database().ref('debugData').once('value').then(debugData => {
			const msg = debugData.val()
			if(localStorage.getItem("testScriptVersion") != msg.version){
				document.getElementById("RTCRoomPlayers").insertAdjacentHTML("beforeend",`<a href="${msg.scriptURL}" style="text-decoration: underline;">テスト用対戦スクリプトを${localStorage.getItem("testScriptVersion") ? "更新":"導入"}</a>
<div>スクリプト導入後に<a href="https://typing-tube.net/movie/show/38539?test=test" style="text-decoration: underline;">ココ</a>をクリックしてテストページに移動してください。</<div>`)
				var updates = {}
				updates['/rooms/' + roomID + '/users/' + myID + '/state'] = 'noScript';
				updates['/users/' + myID + '/state'] = prevState = "noScript";
				firebase.database().ref().update(updates);
			}
		})
		if(debugMode && location.pathname.match("/movie/show") && location.search != '?test=test'){
			window.location.href = location.href+'?test=test'
		}
	}
}

/**
*@Description roomに入室した
*@param _roomID
*/
function EnterRoom(_roomID){

	playSE("greet");
	//初めの数秒は音を鳴らさない
	RTCSECancel()

	//are you ready? SoundEffect Load
	if(!matchconfirm_sound){
		matchconfirm_sound = new AudioContext();
		matchconfirm_sound_load()
	}
	if(!CountDown_sound){
		CountDown_sound = new AudioContext();
		countDownEnd_sound = new AudioContext();
		countDownEnd_sound_load()
		CountDown_sound_load()
	}
	isEnter = true;
	roomID = _roomID;


	firebase.database().ref('rooms/' + _roomID).once('value').then(room => {
		//入室していたroomが無くなった
		if(room.val() == null){
			ExitRoom();
		}else{
			//チャット先をルームチャットに変更
			document.getElementById("rbRoomChat").checked = true;
			document.getElementById("RTCRoomChat").classList.remove("is-hide");
			document.getElementById("RTCChat").classList.add("is-hide");
			document.getElementById("RTCRoomName").innerHTML = "ルーム - <span id='RoomNameArea'>" + room.val().roomName + "</span>";
			roomUsersCount(room.val().users ? Object.keys(room.val().users).length : 1)


			//鍵部屋に入室している。
			if(_roomID.length == 15){
				document.getElementById("RoomNameArea").insertAdjacentHTML('afterend', `<i id="roomKey" class="fas fa-key"></i>`)
				document.getElementById("roomKey").addEventListener("click",getRoomKey)
			}

			//入室ステータス送信
			var updates = {};
			//ルーム内ユーザー情報
			updates['/rooms/' + roomID + '/users/' + myID + '/name'] = userName;
			updates['/rooms/' + roomID + '/users/' + myID + '/state'] = 'idle';
			if(myIP){
				updates['/rooms/' + roomID + '/users/' + myID + '/IP'] = myIP;
			}

			//ユーザー情報更新
			updates['/users/' + myID + '/roomID'] = roomID;
			updates['/users/' + myID + '/name'] = userName;
			updates['/users/' + myID + '/status/score'] = "0.00";
			updates['/users/' + myID + '/status/miss'] = 0;
			updates['/users/' + myID + '/status/combo'] = 0;
			updates['/users/' + myID + '/status/clearline'] = 0;
			updates['/users/' + myID + '/status/combo'] = 0;
			updates['/users/' + myID + '/status/maxCombo'] = 0;
			updates['/users/' + myID + '/status/type'] = 0;
			updates['/users/' + myID + '/status/correct'] = 100;
			updates['/users/' + myID + '/status/moviePos'] = "0"
			updates['/users/' + myID + '/status/lineInput'] = " ";
			updates['/users/' + myID + '/status/lineRemain'] = " ";
			updates['/users/' + myID + '/status/count'] = 0;
			updates['/users/' + myID + '/status/SkipOptin'] = " ";
			updates['/users/' + myID + '/status/keySec'] = "0.00";
			updates['/users/' + myID + '/status/linekeySec'] = " ";
			updates['/users/' + myID + '/status/linekeySec'] = " ";

			if(document.getElementsByName('correct-word-color')[0] != null){
				const CORRECT_COLOR = document.getElementsByName('correct-word-color')[0].value
				const CLEAR_COLOR = document.getElementsByName('line-clear-color')[0].value
				updates['/users/' + myID + '/status/correctColor'] = CORRECT_COLOR == "transparent" ? "rgba(255,255,255,0.4)" : CORRECT_COLOR;
				updates['/users/' + myID + '/status/lineClearColor'] = CLEAR_COLOR == "transparent" ? "rgba(255,255,255,0.4)" : CLEAR_COLOR;
			}

			firebase.database().ref('/users/' + myID + '/status/ClearTime/').set({start:0});
			firebase.database().ref().update(updates);

			//room情報が更新された時用のイベントリスナー追加
			roomUpdate = new inRoomInfo()
			firebase.database().ref('/rooms/' + roomID).on('child_changed', roomUpdate.onUpdateRoomInfo.bind(roomUpdate));
			firebase.database().ref('/rooms/' + roomID + '/kick/').on('child_added', onAddKickUser);
			const roomUserInOut = firebase.database().ref('/rooms/' + roomID + '/users/')
			roomUserInOut.on('child_removed', onRemoveRoomUser);
			roomUserInOut.on('child_added', onAddRoomUser)


			//ルームマスターになっているか
			if(room.val().roomMaster == myID){
				becomeRoomMaster(room.val().movieInfo);
			}else{
				becomeCommon();
			}

			//プレイしていない曲であれば自動開始設定を確認(ルーム情報の更新前に適用)
			autoStartCheck(room.val().AutoStart , room.val().state , room.val().users)

			//ルームのstateを更新＆取得
			const isRoomState = roomStateCheck(room.val().state , room.val().users)

			//ルームセレクト画面非表示
			document.getElementById("RTCRoomSelectScene").classList.add('is-hide');

			//入室画面表示
			document.getElementById("RTCRoomIdleScene").classList.remove('is-hide');

			//デバッグルームチェック
			inDebugRoomCheck(_roomID)

			//選択されている曲を表示
			loadSelectMovie()



			//ルームチャット切り替え用ラジオボタンの表示
			document.getElementById("RTCchatModeDiv").classList.remove('is-hide');

			//ルームチャット欄自動更新
			var chats = firebase.database().ref('roomChat/' + roomID).limitToLast(30);
			roomChat = new ChatUpdate("RTCRoomChat")
			chats.on('child_added', roomChat.onChatUpdate.bind(roomChat));

			//プレイ速度更新
			changeSelectSpeed(room.val().playSpeed)

			//ルームステータス更新
			document.getElementById("combat_mode").value = room.val().playMode
			document.getElementById("skip_mode").value = room.val().skipMode

			//ボタン等表示
			readyButtonDisplay(isRoomState)

			setTimeout(addWinnerTrophy,200)
		}
	});
}

/**
*@Description roomから退出した
*/
function ExitRoom(){

	//退出音を鳴らす
	playSE("exit");
	isEnter = false;
	isRoomMaster = false;
	var updates = {};
	updates['/users/' + myID + '/roomID'] = null;
	updates['/rooms/' + roomID + '/users/' + myID] = null;
	firebase.database().ref().update(updates);

	//ルームチャット欄自動更新解除
	var chats = firebase.database().ref('roomChat/' + roomID).limitToLast(30);
	chats.off('child_added', roomChat.onChatUpdate.bind(roomChat));

	//ルームチャットすべて削除
	var rc = document.getElementById("RTCRoomChat");
	while(rc.firstChild){
		rc.removeChild(rc.firstChild );
	}

	//ルームチャット切り替え用ラジオボタンの非表示
	document.getElementById("rbWorldChat").checked = true;
	document.getElementById("RTCChat").classList.remove("is-hide");
	document.getElementById("RTCRoomChat").classList.add("is-hide");
	document.getElementById("RTCchatModeDiv").classList.add('is-hide');

	//全体チャットの読み込み
	if(!wholeChat){
		addWholeChatEvent()
		RTCSECancel()
	}
	if(!wholeRoom){
		addWholeRoomsUpdateEvent()
	}


	//room情報が更新された時用のイベントリスナー削除
	firebase.database().ref('/rooms/' + roomID).off('child_changed', roomUpdate.onUpdateRoomInfo.bind(roomUpdate));
	firebase.database().ref('/rooms/' + roomID + '/users/').off('child_added', onAddRoomUser);
	firebase.database().ref('/rooms/' + roomID + '/users/').off('child_removed', onRemoveRoomUser);
	firebase.database().ref('/rooms/' + roomID + '/kick/').off('child_added', onAddKickUser);
	window.removeEventListener("keydown" , ready_key)
	document.getElementById("RTCRoomSelectScene").classList.remove("is-hide");
	document.getElementById("RTCRoomIdleScene").classList.add('is-hide');

	firebase.database().ref('rooms/' + roomID + '/users/').once('value').then(users => {

		//もしroomに誰もいなければこのroomを削除
		if(users.val() === null || users.length === 0){

			firebase.database().ref("/rooms/" + roomID).set(null);
			firebase.database().ref("/roomChat/" + roomID).set(null);

		}else{

			firebase.database().ref('rooms/' + roomID).once('value').then(room => {
				//自分がルームマスターなら他の誰かにルームマスターを移動
				var newRoomMaster = {};
				var idx = 0;

				if(room.val().roomMaster != null && room.val().roomMaster  == myID){
					newRoomMaster = {};
					Object.keys(room.val().users).forEach(function(key){
						if(key != myID){
							newRoomMaster[idx++] = key;
						}
					});

					if(idx > 0){
						idx = Math.floor( Math.random() * idx);
						updates = {};
						updates['/rooms/' + roomID + '/roomMaster'] = newRoomMaster[idx];
						firebase.database().ref().update(updates);
					}
				}
				roomID = null;
			});
		}
	});
}

/**
*@Description 入室中のroom情報が更新された
*/
let AutoMovehref = ""

class inRoomInfo {

	onUpdateRoomInfo(snapshot){
		if(snapshot){
			const msg = snapshot.val();
			const updateKey = snapshot.ref_.path.pieces_[2];
			var updates = {};

			switch(updateKey){
					//ルームマスターが行う処理
				case "AutoStart":
					if(isRoomMaster && prevState == "idle" && msg && movieID){
						prevState = "Auto_ready"
						updates['users/' + myID + '/state'] = "Auto_ready";
					}
					break;

				case "playSpeed":
					changeSelectSpeed(msg)
					break;
				case "roomName":
					document.getElementById("RoomNameArea").textContent = msg
					break;
				case "users":
					firebase.database().ref('rooms/' + roomID + '/users').once('value').then(users => {
						roomUsersCount(Object.keys(users.val()).length)
					})
					break;
				case "playMode":
					document.getElementById("combat_mode").value = msg
					break;
				case "skipMode":
					document.getElementById("skip_mode").value = msg
					break;
				case "state":
					if(msg == "play"){
						document.getElementById("RTCbtnReady").setAttribute("value","途中参加");
					}else {
						document.getElementById("RTCbtnReady").setAttribute("value","準備完了");
					}
					break;
				case "movieInfo":
					if(msg.movieID == 0){
						selectingMovie(msg)
					}else if(msg.movieID >= 1){
						changeSelectMovie(msg)
					}
					break;

				case "Winner":
					addWinnerTrophy()

					break;

				case "roomMaster": //動作確認済み
					const Players = document.getElementsByClassName("RTCRoomPlayerAuthority")

					//旗の移動
					for(let i=0;i<Players.length;i++){
						if(document.getElementsByClassName("RTCRoomPlayerAuthority")[i].parentElement.id == msg){
							Players[i].textContent = "🚩";
							Players[i].parentElement.classList.add("roomMaster");
						}else{
							Players[i].textContent = "・"
							Players[i].parentElement.classList.remove("roomMaster");
						}
					}

					//ルームマスターになったか
					if(msg == myID){
						updates['/rooms/' + roomID + '/AutoStart'] = false;
						document.getElementById("RTC_AutoStart").checked = false
						becomeRoomMaster();
					}else if(msg != myID){
						becomeCommon();
					}
					break;

			}
			firebase.database().ref().update(updates);
		}
	}

}

/**
*@Description 現在の参加人数を更新する。
*/
function roomUsersCount(usersLength){
	document.getElementById("RTCRoomPlayerCount").textContent = "参加者一覧 ("+usersLength+"人)"
}

/**
*@Description ページ更新時に選曲されている動画を表示する
*/
function loadSelectMovie(){
	firebase.database().ref('rooms/' + roomID + '/movieInfo').once('value').then(movieInfo => {
		const msg = movieInfo.val()
		changeSelectMovie(msg)
	})
}
/**
*@Description ユーザー待機画面で前回の1位にトロフィーを追加する。
*/
function addWinnerTrophy(winners){
	firebase.database().ref('rooms/' + roomID + '/Winner').once('value').then(roomWinner => {


		if(roomWinner.val()){
			//トロフィー更新時にすべてのトロフィーを削除
			while(document.getElementsByClassName("Winner_Trophy").length){
				document.getElementsByClassName("Winner_Trophy")[0].remove()
			}

			//取得したWinnersデータから新たにトロフィーを追加する。
			Object.keys(roomWinner.val()).forEach(function(winner_id){
				const Consecutive_wins = roomWinner.val()[winner_id].length
				if(document.getElementById(winner_id) != null){
					document.getElementById(winner_id).getElementsByClassName("RTCRoomBtBan")[0].insertAdjacentHTML('afterend',
					`<span class="Winner_Trophy"><i class="fa fa-trophy" style="color:#FFD700"></i>`+ (Consecutive_wins > 1 ? "x"+Consecutive_wins : "")+"</span>")
				}
			})

		}
	})
}

/**
*@Description スピードが変更された
*/
function changeSelectSpeed(msg){
	//title_speed {スピード固定譜面の場合は処理しない}
	if( typeof title_speed != "number"){

		document.getElementById("RTCPlaySpeedSpan").textContent = playSpeeds[msg].toFixed(2) + "倍速";
		play_speed = playSpeeds[msg]
		speed = playSpeeds[msg]

		if(typeof player !== 'undefined'){
			player.setPlaybackRate(playSpeeds[msg])
		}

		if(!playing && location.href.indexOf("https://typing-tube.net/movie/show/")>-1){
			map_info_generator()
		}

	}
}

/**
*@Description ルームマスターが選曲中になった
*/
function selectingMovie(msg){

	document.getElementById("RTCbtnReady").disabled = true;
	document.getElementById("RTCbtnReady").style.visibility = "hidden";
	document.getElementById("RTCbtnReady").setAttribute("title","");

	document.getElementById("RTCRoomMovieTitle").textContent = "";
	document.getElementById("RTCRoomMovieTitle").href = null;

	if(!isRoomMaster){
		document.getElementById("RTCMovleSelectingMes").classList.remove('is-hide');
		document.getElementById("RTCMovleSelectingMesRM").classList.add('is-hide');
		document.getElementById("RTCRoomMovieTitle").setAttribute("title","");
		AutoMovehref = ""
	}else{
		document.getElementById("RTCMovleSelectingMesRM").classList.remove('is-hide');
		document.getElementById("RTCMovleSelectingMes").classList.add('is-hide');
		document.getElementById("RTCRoomMovieTitle").setAttribute("title","");
	}

	prevState = "move"
	var updates = {}
	updates['users/' + myID + '/state'] = "move";
	firebase.database().ref().update(updates);
}

/**
*@Description 対戦開始前のプレビュー再生を開始する
*/
function RTCpreviewStart(feedIn){

	player.setVolume(volume*.7)
	player.setPlaybackRate(speed)
	player.seekTo(+BGM_time)
	player.playVideo()
	demo_play_flag = true


	if(feedIn == "feedIn"){

		volume_feedin = setInterval(function(){
			feedin_volume ++
			player.setVolume(feedin_volume)
			if(feedin_volume == volume){
				feedin_volume = -10
				clearInterval(volume_feedin);
			}
		},25)

	}

}

/**
*@Description 曲が変更された
*/
function changeSelectMovie(msg){

	//選曲中は曲を表示しない。
	if(!msg.movieID){
		selectingMovie()
		return;
	}


	playSE("cngSong");


	//選択された曲を表示
	if(isRoomMaster){
		document.getElementById("RTCRoomMovieTitle").textContent = "[ID" + movieID + "]" + movieTitle;
		document.getElementById("RTCRoomMovieTitle").href = "https://typing-tube.net/movie/show/" + movieID + (debugMode ? '?test=test':"");
	}else{
		document.getElementById("RTCRoomMovieTitle").textContent = "[ID" + msg.movieID + "]" + msg.movieTitle;
		document.getElementById("RTCRoomMovieTitle").href = "https://typing-tube.net/movie/show/" + msg.movieID + (debugMode ? '?test=test':"");
	}

	//非選択メッセージを非表示
	document.getElementById("RTCMovleSelectingMes").classList.add('is-hide');
	document.getElementById("RTCMovleSelectingMesRM").classList.add('is-hide');

	//準備完了ボタン無効
	document.getElementById("RTCbtnReady").disabled = true;
	document.getElementById("RTCbtnReady").style.visibility = "hidden";

	if(msg.movieID == movieID){

		if(typeof player != "undefined" && !playing && localStorage.getItem("RTCpreview")=="true" && !demo_play_flag){
			RTCpreviewStart()
		}
		prevState = "idle"
		let updates = {}
		updates['users/' + myID + '/state'] = "idle";
		firebase.database().ref().update(updates);

		document.getElementById("RTCbtnReady").disabled = false;
		document.getElementById("RTCbtnReady").style.visibility = "visible";
		document.getElementById("RTCbtnReady").setAttribute("title","");
		document.getElementById("RTCmovieTitleDiv").classList.remove("is-DifferInMovieID");
		document.getElementById("RTCRoomMovieTitle").setAttribute("title","準備が完了したら、準備完了ボタンを押してください。");
        window.addEventListener("keydown" , ready_key)

}else if(msg.movieID != movieID){

	//選択曲が変わったらプレビュー再生を止める。
	if(!playing && demo_play_flag){
		player.pauseVideo()
		demo_play_flag = false
	}

	//以下、移動させる処理
		if(!isRoomMaster){
			prevState = "move"
			let updates = {}
			updates['users/' + myID + '/state'] = "move";
			firebase.database().ref().update(updates);

			if(document.getElementById("RTC_AutoMove").checked){
				AutoMovehref = document.getElementById("RTCRoomMovieTitle").href
				if(DOMChatInput.value == "" || document.getElementsByClassName("chatArea")[0].style.display == "none"){
					window.location.href = AutoMovehref
				}
			}

			document.getElementById("RTCbtnReady").setAttribute("title","ルームマスターが選択した曲と同じ曲を選択してください。");
			document.getElementById("RTCmovieTitleDiv").classList.add("is-DifferInMovieID");
			document.getElementById("RTCRoomMovieTitle").setAttribute("title","ルームマスターが選択した曲と違います。コチラをクリックして開きなおしてください。");
			window.removeEventListener("keydown" , ready_key)
			document.getElementById("RTCbtnReady").setAttribute("value","準備完了");
		}else{
			if(typeof player != "undefined" && !playing && localStorage.getItem("RTCpreview")=="true" && !demo_play_flag){
				RTCpreviewStart()
			}
		}

	}
}

/**
*@Description room内の人がキックされた
*/
function onAddKickUser(snapshot){
	const _userIP = snapshot.ref_.path.pieces_[3];
	const _userID = snapshot.val()
	if(_userID == myID){
		kicked();
	}
}
/**
*@Description roomに人が入室した
*/
function onAddRoomUser(snapshot){

	playSE("greet");
	const _userID = snapshot.ref_.path.pieces_[3];
	const _userName = snapshot.val().name;

	//すでに追加されていたらそれ以上の処理はしない
	if(document.getElementById(_userID) != null){
		return;
	}

	var DOMTr = document.createElement("tr");
	DOMTr.id = _userID;
	DOMTr.classList.add("RTCroomPlayer");
	if(_userID == myID){
		DOMTr.classList.add("mine");
	}

	document.getElementById("RTCRoomPlayersTable").appendChild(DOMTr);


	var DOMisRM = document.createElement("td");
	DOMisRM.classList.add("RTCRoomPlayerAuthority");
	DOMisRM.setAttribute("style","width:20px;");
	firebase.database().ref('rooms/' + roomID + '/roomMaster').once('value').then(roomMasterId => {
		if(roomMasterId.val() == _userID){
			DOMisRM.textContent = "🚩";
			DOMTr.classList.add("roomMaster");
		}else{
			DOMisRM.textContent = "・";
			DOMTr.classList.remove("roomMaster");
		}
	});
	DOMTr.appendChild(DOMisRM);

	var DOMname = document.createElement("td");
	DOMname.classList.add("RTCRoomPlayerName");
	DOMname.textContent = _userName;
	DOMTr.appendChild(DOMname);

	var DOMstatus = document.createElement("td");
	DOMstatus.classList.add("RTCRoomPlayerState");
	DOMstatus.setAttribute("style","width:75px;");
	DOMTr.appendChild(DOMstatus);

	var DOMbtChangeRM = document.createElement("a");
	DOMbtChangeRM.classList.add("RTCRoomBtChangeRM");
	DOMbtChangeRM.setAttribute("style","width:20px;font-size:8px");
	DOMbtChangeRM.setAttribute("title",_userName + " にルームマスター権限を渡す。");
	DOMbtChangeRM.addEventListener("click", onButtonChangeRM);
	DOMbtChangeRM.textContent = "↪🚩";
	DOMTr.appendChild(DOMbtChangeRM);

	var DOMbtBan = document.createElement("a");
	DOMbtBan.classList.add("RTCRoomBtBan");
	DOMbtBan.setAttribute("style","width:20px;font-size:12px");
	DOMbtBan.setAttribute("title",_userName + " をルームからキックする。");
	DOMbtBan.addEventListener("click", onButtonBan);
	DOMbtBan.textContent = "💣";
	DOMTr.appendChild(DOMbtBan);

	//自分の↪🚩💣を隠す
	if(!isRoomMaster || _userID == myID){
		DOMbtChangeRM.classList.add("is-hide");
		DOMbtBan.classList.add("is-hide");
	}

	//マルチプレイ用のチェックボックスを表示
	if(isRoomMaster){
		const Players = document.getElementsByClassName("RTCRoomPlayerAuthority")
		if(Players.length >= 2 && prevState != "not_playable"){
			document.getElementById("RTC_AutoStart").parentNode.classList.add("display_AutoStart")
		}
	}else{
		document.getElementById("RTC_AutoMove").parentNode.classList.add("display_AutoMove")
	}

	//このユーザにイベントリスナー追加
	firebase.database().ref('/users/' +_userID+'/state').on('value', onUpdateRoomUser);

}

/**
*@Description room人が退出した
*/
function onRemoveRoomUser(snapshot){
	const _userID = snapshot.ref_.path.pieces_[3];
	const _userName = snapshot.val().name;


	firebase.database().ref('/users/' +_userID+'/state').off('value', onUpdateRoomUser);
	//すでに削除されていたらそれ以上の処理はしない
	if(document.getElementById(_userID) == null){
		return;
	}
	document.getElementById(_userID).remove();

	//もし自分自身ならルーム参加者欄すべて削除
	if(_userID == myID){
		const roomPlayers = document.getElementsByClassName("RTCroomPlayer");
		for(let i=0;i<roomPlayers.length;i++){
			firebase.database().ref('/users/' +roomPlayers[i].id+'/state').off('value', onUpdateRoomUser);
			roomPlayers[i].remove()
			i--
		}
	}else{
		const roomPlayers = document.getElementsByClassName("RTCroomPlayer")


		if(roomPlayers.length == 1){
			if(isRoomMaster){
				document.getElementById("RTC_AutoStart").parentNode.classList.remove("display_AutoStart")
			}else{
				document.getElementById("RTC_AutoMove").parentNode.classList.remove("display_AutoMove")
			}
		}
		if(isRoomMaster){
			autoReadyDisable(roomPlayers)
		}

	}

}


function autoReadyDisable(roomPlayers){
	var AutoStart = false
	firebase.database().ref('users/').once('value').then(users => {
		//全員が準備完了になっているかチェック
		for(let i=0;i<roomPlayers.length;i++){
			const key = roomPlayers[i].id
			if(users.val()[key].state != "ready" && users.val()[key].state != "Auto_ready"){
				AutoStart = true
			}
		}
		//全員が準備完了
		if(!AutoStart){
			var updates = {}
			prevState = "idle"
			updates['users/' + myID + '/state'] = "idle";
			firebase.database().ref().update(updates);
		}
	});
}




/**
*@Description room内の人の情報が変更された
*/
var playing_interval
let standByGraceTime
let graceTime
let ready_player = []

function roomUserBackGroundChange(userId , change){
	const userTable = document.getElementById(userId)
	userTable.classList.remove("ready_background_color");
	userTable.classList.remove("timeout_background_color");

	if(change == "ready"){
		userTable.classList.add("ready_background_color");
	}else if(change == "timeout"){
		userTable.classList.add("timeout_background_color");
	}

}

function readyPlayerStartChange (roomPlayersId){
	if(roomPlayersId.length >= 2){
		if(matchconfirm_sound){
			matchconfirm_sound_play()
		}

		if(prevState == "Auto_ready" || prevState == "ready"){
			document.getElementById("RTCbtnGameStart").disabled = true;
			document.getElementById("RTCbtnReady").disabled = true;
			document.getElementById("RTCbtnExit").disabled = true;
		}

		window.removeEventListener("keydown" , ready_key)

		//ルームマスターがreadyプレイヤー全員の状態をPreStartに変更する
		if(isRoomMaster){
			setTimeout(function(){
				PreStartRM();
			},1600)
		}
	}else{
		PreStartRM();
	}
}

function readyPlayerCheck(user,state){

	const roomPlayers = document.getElementsByClassName("RTCroomPlayer")
	const roomMaster = document.getElementsByClassName("roomMaster")[0]
	if(!roomMaster){return;}

	let roomPlayersId = []
	for(let i=0;i<roomPlayers.length;i++){
		roomPlayersId.push(roomPlayers[i].id)
	}


	const allReadyStateCheck = (key) => roomPlayers[key].className.match("ready_background_color");
	const hostReadyCheck = roomMaster.id == user && state == "ready"

	if(roomPlayersId.every(allReadyStateCheck) || hostReadyCheck){
		//ゲーム前準備処理
		readyPlayerStartChange(roomPlayersId)
	}
}


function onUpdateRoomUser(snapshot){
	const user = snapshot.ref_.path.pieces_[1];
	const state = snapshot.node_.value_
	switch(state){
		case "move":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "移動中";
			roomUserBackGroundChange(user , "remove")
			break;
		case "idle":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "準備中";
			roomUserBackGroundChange(user , "remove")
			break;
		case "ready":

			const roomPlayers = document.getElementsByClassName("RTCroomPlayer");

			//準備完了表示
			if(roomPlayers.length >= 2){
				document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "準備完了";
				roomUserBackGroundChange(user , "ready")
			}
			readyPlayerCheck(user,state)

			break;
		case "Auto_ready":

			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "準備完了";
			roomUserBackGroundChange(user , "ready")
			readyPlayerCheck(user,state)

			break;
		case "play":

			if(prevState == "preStart"){

				ready_player.push(user)
				ready_player = ready_player.filter((element, index) => ready_player.indexOf(element) === index);

				if(Object.keys(Players_ID).length <= ready_player.length){
					prevState = "play"
					console.log("ready_playerBattleStart")
					clearInterval(graceTime)
					battleStart()
				}else{
					standByGraceTime = new Date().getTime()
					if(!graceTime){
						graceTime = setInterval(function(){
							if(new Date().getTime() > 3000 + standByGraceTime){
								console.log("graceBattleStart")
								battleStart()
								prevState = "play"
								if(!ready_player.includes(myID)){
									var updates = {};
									updates['users/' + myID + '/state'] = "play";
									updates['bugUserAgent/' + userName] = navigator.userAgent;
									firebase.database().ref().update(updates);
								}
								clearInterval(graceTime)
							}
						},100)
					}
				}

			}

			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "プレイ中";
			const userLoadingContainer = document.querySelector("#__" + user + " > .RTCLine")
			if(userLoadingContainer != null){
				userLoadingContainer.classList.remove("ready_loading")
			}
			roomUserBackGroundChange(user , "remove")
			break;
		case "preStart":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "プレイ中";
			if(user == myID && !playing){
				prevState = "preStart"
				//ゲーム前準備処理
				PreStart();
			}
			break;
		case "timeOut":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "タイムアウト";
			roomUserBackGroundChange(user , "timeout")
			if(user == myID){
				isWrittenAFKState = true
			}
			break;
		case "afk":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "afk";
			roomUserBackGroundChange(user , "remove")
			break;
		case "result":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "プレイ終了";
			roomUserBackGroundChange(user , "remove")
			break;
		case "end":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "プレイ終了";
			roomUserBackGroundChange(user , "remove")
			break;
		case "not_playable":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "再生不可";
			roomUserBackGroundChange(user , "remove")
			break;
		case "noScript":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").textContent = "ｽｸﾘﾌﾟﾄ未導入";
			roomUserBackGroundChange(user , "remove")
			break;
	}
}

function battleStart(){
	playing = true
	prevState = "play"
	window.removeEventListener("keydown",preventScrollBySpacaKey)
	player.setVolume(volume)
	playing_interval = setInterval(function(){
		if(playing){
			player.seekTo(roomMasterMoviePos)
			player.pauseVideo()
			console.log("後")
			player.playVideo();
			clearInterval(playing_interval)
		}
	},10)
	document.getElementsByClassName("playarea")[0].classList.remove("is-hide-playarea");
	// document.getElementsByClassName("status")[0].classList.remove("flex_100");
}


var isRoomMaster = false;

/**
*@Description ルームマスターになった。
*/
function becomeRoomMaster(movieInfo){
	if(isRoomMaster){return;}

	//初めの数秒は音を鳴らさない
	RTCSECancel()

	if(!isSECancel){
		matchconfirm_sound_play()
	}

	var updates = {};

	if(!movieInfo || movieInfo.movieID != movieID){
		prevState = "idle"
		updates['users/' + myID + '/state'] = "idle";
		updates['/rooms/' + roomID + '/state' ] = "idle";
		updates['/rooms/' + roomID + '/movieInfo'] = { "movieID":movieID , "movieTitle":movieTitle }
		firebase.database().ref().update(updates);
	}

	var cngRMbts = document.getElementsByClassName("RTCRoomBtChangeRM");
	var Banbts = document.getElementsByClassName("RTCRoomBtBan");

	Array.prototype.forEach.call(cngRMbts, function(bt) {
		if(bt.parentNode.id != myID){
			bt.classList.remove("is-hide");
		}
	});
	Array.prototype.forEach.call(Banbts, function(bt) {
		if(bt.parentNode.id != myID){
			bt.classList.remove("is-hide");
		}
	});

	document.getElementById("RoomNameArea").setAttribute("contentEditable","true")
	document.getElementById("RoomNameArea").addEventListener("input",RoomName_Change)
	document.getElementById("RTCPlaybtSpeedlt").classList.remove("is-hide");
	document.getElementById("RTCPlaybtSpeedgt").classList.remove("is-hide");
	document.getElementById("combat_mode").removeAttribute("disabled")
	document.getElementById("skip_mode").removeAttribute("disabled")
	document.getElementById("RTCbtnReady").classList.add("is-hide");
	document.getElementById("RTCbtnGameStart").classList.remove("is-hide");

	document.getElementById("RTC_AutoMove").parentNode.classList.remove("display_AutoMove")
	const Players = document.getElementsByClassName("RTCRoomPlayerAuthority")
	if(Players.length >= 2 && prevState != "not_playable"){
		document.getElementById("RTC_AutoStart").parentNode.classList.add("display_AutoStart")
	}
	isRoomMaster = true;
}

/**
*@Description ルームマスターではなくなった。
*/
function becomeCommon(){
	if(!isRoomMaster){return;}
	var cngRMbts = document.getElementsByClassName("RTCRoomBtChangeRM");
	var Banbts = document.getElementsByClassName("RTCRoomBtBan");
	Array.prototype.forEach.call(cngRMbts, function(bt) {
		if(bt.parentNode.id != myID){
			bt.classList.add("is-hide");
		}
	});
	Array.prototype.forEach.call(Banbts, function(bt) {
		if(bt.parentNode.id != myID){
			bt.classList.add("is-hide");
		}
	});
	document.getElementById("RoomNameArea").setAttribute("contentEditable","false")
	document.getElementById("RoomNameArea").removeEventListener("input",RoomName_Change)
	document.getElementById("RTCPlaybtSpeedlt").classList.add("is-hide");
	document.getElementById("RTCPlaybtSpeedgt").classList.add("is-hide");
	document.getElementById("combat_mode").setAttribute("disabled","")
	document.getElementById("skip_mode").setAttribute("disabled","")
	document.getElementById("RTCbtnReady").classList.remove("is-hide");
	document.getElementById("RTCbtnReady").style.visibility = "visible";
	document.getElementById("RTCbtnGameStart").classList.add("is-hide");
	document.getElementById("RTC_AutoStart").parentNode.classList.remove("display_AutoStart")
	document.getElementById("RTC_AutoMove").parentNode.classList.add("display_AutoMove")

	isRoomMaster = false;
}

/**
*@Description ルームマスター権限を渡す ボタンが押された。
*/
function onButtonChangeRM(event){
	const EVENT_PATH = event.composedPath()
	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		if(room.val().roomMaster == myID){
			firebase.database().ref('rooms/' + roomID + '/users/' + EVENT_PATH[1].id).once('value').then(user => {
				if (window.confirm("RealTimeCombatting:" + user.val().name + " にルームマスター権限を渡します。よろしいですか？")) {
					var updates = {};
					prevState = "idle"
					updates['users/' + myID + '/state'] = "idle";
					updates['/rooms/' + roomID + '/roomMaster'] = EVENT_PATH[1].id;
					firebase.database().ref().update(updates);
					document.getElementById("RTCbtnReady").setAttribute("value","準備完了");
				}
			});
		}
	});
}

/**
*@Description キックする ボタンが押された。
*/
function onButtonBan(event){
	const EVENT_PATH = event.composedPath()
	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		if(room.val().roomMaster == myID){
			firebase.database().ref('rooms/' + roomID + '/users/' + EVENT_PATH[1].id).once('value').then(user => {
				const kick_password = Math.floor( Math.random() * (999 + 1 - 100) ) + 100
				const pass_form = window.prompt("RealTimeCombatting: " + user.val().name + " さんをルームからキックします。\nよろしければ入力欄に　"+kick_password+"　を入力してください。")
				if (pass_form == kick_password) {
					var updates = {};
					updates['/rooms/' + roomID + '/users/' + EVENT_PATH[1].id] = null;
					updates['/rooms/' + roomID + '/kick/'+user.val().IP.replace(/\./g, "")] = EVENT_PATH[1].id;
					updates['users/' + EVENT_PATH[1].id + '/roomID'] = null;
					firebase.database().ref().update(updates);
					window.alert("RealTimeCombatting: " + user.val().name + " さんをルームからキックしました。")
				}
			});
		}
	});
}


/**
*@Description 。player情報をDBから削除
*@param playerID
*@param roomID nullならroomからの削除処理はしない
*/
function ForcePlayerDelete(playerID, _roomID){

	var updates = {};

	if(_roomID == null){

		firebase.database().ref('users/' + playerID).once('value').then(player_info => {

			if(player_info.val() && player_info.val().roomID != null){
				//削除対象プレイヤーがルームに入っていた。
				ForcePlayerDelete(playerID, player_info.val().roomID)
			}else{
				//プレイヤーを削除
				updates['/users/' + playerID] = null;
			}
			firebase.database().ref().update(updates);
		})

	}else{

		firebase.database().ref('rooms/' + _roomID).once('value').then(room => {

			//ルーム内ユーザーを取得
			let roomUsers = room.val() ? room.val().users : room.val()

			//削除対象プレイヤーIDをルーム内ユーザーオブジェクトから削除
			if(roomUsers){
				delete roomUsers[playerID]
			}

			if(!roomUsers || Object.keys(roomUsers).length == 0){
				//最後の1人ならRoom削除
				updates['/rooms/' + _roomID] = null;
				updates['/roomChat/' + _roomID] = null;

			}else if(room.val().roomMaster == playerID){
				//ルームマスターが削除されたらマスター権限の移動
				updates['/rooms/' + _roomID + '/roomMaster'] = moveRoomMaster(roomUsers , playerID)
			}

			//ユーザー情報を削除
			updates['/users/' + playerID] = null;
			if(updates["/rooms/"+_roomID] === undefined){
				updates['/rooms/' + _roomID + '/users/' + playerID] = null;
			}

			firebase.database().ref().update(updates);
		});

	}
}

/**
*@Description ルームマスターを誰かに変更する。
*/
function moveRoomMaster(roomUsers , playerID){
	var masterID;

	Object.keys(roomUsers).forEach(function(id){
		if(id != playerID){
			masterID = id;
		}
	});

	return masterID;
}


/**
*@Description キックされた
*/
function kicked(){
	location.reload();
	ExitRoom();
}


/**
*@Description 対戦モードが変更された
*/
function onChangeCombatMode(event){
	playSE("click");
	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		if(room.val().roomMaster == myID){
			var updates = {};
			updates['/rooms/' + roomID + '/playMode'] = document.getElementById("combat_mode").value;
			firebase.database().ref().update(updates);
		}
	});
}

function onChangeSkipMode(event){
	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		if(room.val().roomMaster == myID){
			var updates = {};
			updates['/rooms/' + roomID + '/skipMode'] = document.getElementById("skip_mode").value;
			firebase.database().ref().update(updates);
		}
	});
}

/**
*@Description プレイ速度変更ボタンが押された
*/
function onClickPlaySpeedlt(event){
	playSE("click");
	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		if(room.val().roomMaster == myID){
			var ps = room.val().playSpeed - 1;
			if(ps < 0){
				ps = 0;
			}
			var updates = {};
			updates['/rooms/' + roomID + '/playSpeed'] = ps;
			firebase.database().ref().update(updates);
		}
	});
}

/**
*@Description プレイ速度変更ボタンが押された
*/
function onClickPlaySpeedgt(event){
	playSE("click");

	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		if(room.val().roomMaster == myID){
			var ps = room.val().playSpeed + 1;
			if(ps >= playSpeeds.length){
				ps = playSpeeds.length - 1;
			}
			var updates = {};
			updates['/rooms/' + roomID + '/playSpeed'] = ps;
			firebase.database().ref().update(updates);
		}
	});
}


/**
*@Description 準備完了ボタンを押した
*/

let ReadyTimeStamp = 0
let playerReadyInterval
function onClickBtnReady(event){

	if(!playerReadyInterval){

		player.playVideo()
		playerReadyInterval = setInterval(readyStateChange , 50)
		CountDown_sound_play("mute")
		countDownEnd_sound_play("mute")
		matchconfirm_sound_play("mute")
		playSE("enter","mute")
		playSE("cancel","mute");
		if(!document.getElementById("rtc-preview").checked && player.getPlayerState() != 1){
			player.mute()
		}
	}

}


let middleStart = false
function readyStateChange(){
	if(player.getPlayerState() != 1){ return; }
	clearInterval(playerReadyInterval)
	playerReadyInterval = null

	var updates = {};
	const now_date = new Date().getTime()
	if(prevState == "idle"){

		ReadyTimeStamp = new Date().getTime()
		playSE("enter");
		if(document.getElementById("RTCbtnReady").value == "途中参加"){
			prevState = "preStart"
			updates['users/' + myID + '/state'] = "preStart";
			middleStart = true
			firebase.database().ref('rooms/'+ roomID + '/users').once('value').then(roomUsers => {
				const roomPlayers = document.getElementsByClassName("RTCroomPlayer");
				for(let i=0;i<roomUsers.val().length;i++){
					if(roomUsers.val()[roomPlayers[i].id].state == "play"){
						ready_player.push(roomPlayers[i].id)
					}
				}
			});
		}else{
			prevState = "ready"
			updates['users/' + myID + '/state'] = "ready";
			document.getElementById("RTCbtnReady").setAttribute("value","準備完了を解除");
		}


	}else if(prevState == "ready" && now_date-ReadyTimeStamp > 1000){

		playSE("cancel");
		prevState = "idle"
		updates['users/' + myID + '/state'] = "idle";
		document.getElementById("RTCbtnReady").setAttribute("value","準備完了");
	}
	firebase.database().ref().update(updates);


}


/**
*@note room関連 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////










/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note ゲーム中処理 ここから ---
*/

/**
*@note （ルームマスター）ゲーム開始ボタンを押した
*/
function onClickBtnGameStart(event){

	if(!playerReadyInterval){

		player.playVideo()

		playerReadyInterval = setInterval(hostGameStartCheck , 50)

		CountDown_sound_play("mute")
		countDownEnd_sound_play("mute")
		matchconfirm_sound_play("mute")
		playSE("enter","mute")
		playSE("cancel","mute");
		if(!document.getElementById("rtc-preview").checked && player.getPlayerState() != 1){
			player.mute()
		}
	}

}
function hostGameStartCheck(){
	if(player.getPlayerState() != 1){ return; }
	clearInterval(playerReadyInterval)
	playerReadyInterval = null

	//room内の全員が準備完了かどうか確認
	const roomPlayers = document.getElementsByClassName("RTCroomPlayer")

	//参加者のIDを取得
	let roomPlayersId = []
	for(let i=0;i<roomPlayers.length;i++){
		roomPlayersId.push(roomPlayers[i].id)
	}

	//自分以外にready_background_color classが付いているか確認
	const ReadyStateCheck = (key) => roomPlayers[key].className.match("ready_background_color") || key == myID

	//ready_background_color classが付いていない人がいれば確認ダイアログを出す
	if(!roomPlayersId.every(ReadyStateCheck)){
		if (!window.confirm("RealTimeCombatting: ルーム内全員が準備完了ボタンを押していません。ゲームをスタートしてもよろしいですか？")) {
			return;
		}
	}

	var updates = {};
	prevState = "ready"
	updates['users/' + myID + '/state'] = "ready";
	firebase.database().ref().update(updates);
	window.removeEventListener("keydown" , ready_key)


}


/**
*@note （ルームマスター）ゲーム開始ボタンを押した
*/
let combating_mode = "Score"
let Preflag = false

function PreStartRM(){
	//全員の状態をpreStartへ。

	const roomPlayers = document.getElementsByClassName("RTCroomPlayer")

	var updates = {};
	for(let i=0;i<roomPlayers.length;i++){
		const key = roomPlayers[i].id
		if(roomPlayers[key].className.match("ready_background_color") || key == myID){
			updates['users/' + key + '/state'] = "preStart";
		}
	}
	const new_Date = new Date().getTime()
	updates['rooms/' + roomID + '/state'] = "play";
	updates['rooms/' + roomID + '/StartTime'] = LocationDateTimeStamp+(new_Date-LocalDateTimeStamp);
	firebase.database().ref().update(updates);
}
/**
*@note ゲーム開始準備処理
*/


let last_combo_score = 0
let speed_background = "transparent"
let speed_color = "rgba(255,255,255,.85)"
let RTCGamePlayPlayersStatusTableSelector
let Skip_Mode = "HOST"
let FirstVideoLoadedCheck
let selected_play_mode
let combat_ranking_ViewMode = "Scroll"
let status_updates = {}
let score_flag = false
let roomMasterMoviePos = 0
let Players_ID = {}
let RoomMaster_ID = ""

function PreStart(){


	if(Preflag){return;}
	Preflag = true

	feedout_volume = +localStorage.getItem("volume_storage")
	//プレイスピードをroomの設定に合わせる。
	if( typeof title_speed != "number"){
		firebase.database().ref('rooms/' + roomID).once('value').then(room => {
			changeSelectSpeed(room.val().playSpeed)
			document.getElementById("playspeed").textContent = speed.toFixed(2)+"倍速"
			document.getElementById("speed").textContent = play_speed.toFixed(2)+"倍速"

			if(play_mode == "normal"){
				if(play_speed == 2){
					speed_background = "#ed143d99"
					speed_color = "ghostwhite"
				}else if(play_speed == 1.75){
					speed_background = "#9370dba9"
					speed_color = "ghostwhite"
				}else if(play_speed == 1.5){
					speed_background = "#00ff7f7a"
					speed_color = "#FFF"
				}else if(play_speed == 1.25){
					speed_background = "#4ed6ff73"
				}else if(play_speed == 1){
					speed_background = "transparent"
				}
				document.getElementById("speed").setAttribute("style", `
    color:`+speed_color+`;
    background:`+speed_background+`;`);
			}
		});
	}
	var updates = {};
	updates['/rooms/' + roomID + '/users/' + myID + '/state'] = 'play';
	firebase.database().ref().update(updates);


	//表示画面の切り替え
	document.getElementById("RTCRoomIdleScene").classList.add("is-hide");
	document.getElementById("RTCGamePlayScene").classList.remove("is-hide");

	combating_mode = document.getElementById("combat_mode").value
	Skip_Mode = document.getElementById("skip_mode").value
	// 選択状態を再設定(TypingTubeMODと競合しないように)
	selected_play_mode = document.querySelector("[name=rbPlayMode]:checked").value
	if(selected_play_mode == "kana"){
		mode = 'kana';
		kana_mode = false;
		keyboard='normal';
		typing_play_mode = 'roma'
	}else if(selected_play_mode == "roma"){
		mode = 'roma';
		kana_mode = false;
		keyboard='normal';
		typing_play_mode = 'roma'
	}else if(selected_play_mode == "kanaInput"){
		mode = 'kana';
		kana_mode = true;
		keyboard='normal';
		typing_play_mode = 'kana'
	}else if(selected_play_mode == "flickInput"){
		mode = 'kana';
		kana_mode = true;
		keyboard='mac';
		typing_play_mode = 'flick'
	}
	window.removeEventListener("keydown" , ready_key)
	player.setVolume(volume/7.5)

	//チャットを非表示にする
	if(!document.getElementById("battleChat").classList.value.includes('active')){
		$('.chatArea').animate({height: 'hide'}, 'slow');
	}

	let CHAT_HEIGHT = localStorage.getItem("RTCRoomBattleChatHeight")

	if(CHAT_HEIGHT){

		if(CHAT_HEIGHT == "170px"){
			document.getElementById("knob-up").style.visibility = "hidden"
			document.getElementById("knob-down").style.visibility = "visible"
		}else if(CHAT_HEIGHT == "40px"){
			document.getElementById("knob-up").style.visibility = "visible"
			document.getElementById("knob-down").style.visibility = "hidden"
		}
	}else{

		const DEFAULT_HEIGHT = "60px"
		CHAT_HEIGHT = DEFAULT_HEIGHT
		localStorage.setItem("RTCRoomBattleChatHeight",DEFAULT_HEIGHT)
	}

	const Chat = document.getElementById('RTCRoomChat');
	Chat.style.height = CHAT_HEIGHT
	Chat.scrollTo(0, Chat.scrollHeight)

	DOMChatInput.setAttribute("placeholder","メッセージを入力　<対戦中はTABキーでフォーカスを切り替えることができます>");


	window.addEventListener("keydown" , event => {
		if(event.key == "Tab"){
			if(document.activeElement.id == 'ChatInput'){
				play_focus()
				play_focus()
			}else if(!next_char[0] && document.activeElement.id != 'ChatInput'){
				document.getElementById("ChatInput").focus()
			}
			event.preventDefault()
		}
	})

	document.getElementById("ChatInput").addEventListener("focus" , event => {
		document.getElementById("ChatInput").style.borderBottom = "solid thin"
	})
	document.getElementById("ChatInput").addEventListener("blur" , event => {
		document.getElementById("ChatInput").style.borderBottom = "none"
	})

	//対戦エリアの表示設定を呼び出し
	const ViewMode = localStorage.getItem("combat_ranking_ViewMode")
	if(ViewMode){
		combat_ranking_ViewMode = ViewMode
	}



	//ルーム情報更新イベント削除
	firebase.database().ref('/rooms/' + roomID).off('child_changed', roomUpdate.onUpdateRoomInfo.bind(roomUpdate));
	AutoMovehref = ""

	//ステータス表示用のテーブルの作成
	var table = document.getElementById("RTCGamePlayPlayersStatusTable");
	while(table.firstChild){
		table.firstChild.remove();
	}
	//スペースキーによるscrollの無効化
	window.addEventListener("keydown",preventScrollBySpacaKey)
	//ルーム内ユーザーに対してイベントハンドラを追加
	firebase.database().ref('rooms/' + roomID + '/roomMaster').once('value').then(roomMasterID => {
		RoomMaster_ID = roomMasterID.val()

		const roomPlayers = document.getElementsByClassName("RTCroomPlayer");

		firebase.database().ref('users/').once('value').then(users => {

			for(let i=0;i<roomPlayers.length;i++){
				const key = roomPlayers[i].id
				if(users.val()[key].state == "preStart" || users.val()[key].state == "play"){

					//ユーザーの対戦イベントを追加
					addUserBattleStatusEvent(users.val()[key].name , key)


					//ユーザーの対戦テーブルが既に追加されていたらここで終了
					if(document.getElementById("_" + key) != null){
						return;
					}

					//ユーザーの対戦テーブルを追加
					addbattleStatusTable(users.val()[key] , key)
				}




			}


			//以下、準備完了者のテーブル追加終了後
			RTCGamePlayPlayersStatusTableSelector = document.getElementById("RTCGamePlayPlayersStatusTable")

			if(Object.keys(Players_ID).length >= 2 || !isRoomMaster){
				let mode_color = "transparent"
				if(combating_mode == "Combo"){
					mode_color = "#fd7e009e"
				}else if(combating_mode == "Line"){
					mode_color = "#37a34a"
				}else if(combating_mode == "Perfect"){
					mode_color = "#dab3008c"
				}
				//controlエリアを対戦用に変更
				document.getElementById("time_settings").style.marginTop = "8px"
				document.getElementById("time_settings").style.marginBottom = "8px"
				document.getElementById("speed_change_F10").style.display = "none"
				document.getElementById("song_reset").style.display = "none"
				document.getElementById("shortcut").style.zIndex = "6"
				document.getElementById("speed").style.border = "solid thin"
				document.getElementById("speed").classList.remove('pointer');
				document.getElementById("more_shortcutkey").style.display = "none"
				document.getElementById("more_shortcutkey").insertAdjacentHTML('afterend',`<div id="battle_mode"><span style="border:solid thin;background:`+mode_color+`;" class="control_option">`+(combating_mode == "Line" ? "Line先取" : combating_mode)+`</span></div>`)

				document.getElementById("song_reset").insertAdjacentHTML('afterend',`<div id="battle_container_display"><span id="battle_container_display_button" class="control_option pointer">順位表示切り替え</span><span id="battle_container_display_button_F1" class="shortcut_navi hover_dom select_none">F1</span></div>`)
				document.getElementById("battle_container_display").addEventListener("click",battle_container_change)
				document.getElementById("battle_container_display_button_F1").addEventListener("mouseover",function battle_container_underline(event){
					document.getElementById("battle_container_display_button").style.textDecoration = "underline"
				})
				document.getElementById("battle_container_display_button_F1").addEventListener("mouseout",function battle_container_underline_delete(event){
					document.getElementById("battle_container_display_button").style.textDecoration = ""
				})
				document.querySelector("#shortcut > div").style.display = "none"
			}

			//カウントダウン
			ClockCountDownFirst();
			document.getElementById("RTCGamePlayWrapper").scrollTo({
				top:999
			})

			if(localStorage.getItem("RTC_Scroll") != "false"){
				const gauge_height = (document.getElementById("gauge").clientHeight - (document.getElementById("gauge").clientHeight > 0 ? -20:0))
				const absolute_controlbox_point = window.pageYOffset+CONTROLBOX_SELECTOR.getBoundingClientRect().top-gauge_height-document.getElementsByTagName("header")[0].clientHeight
				const display_size_height = document.documentElement.clientHeight-document.getElementsByTagName("header")[0].clientHeight
				window.scrollTo({top: absolute_controlbox_point-(display_size_height > CONTROLBOX_SELECTOR.clientHeight+50 ? localStorage.getItem('scroll_adjustment1') : 0)})
			}

			//途中参加のユーザーを検知するイベントを追加。
			firebase.database().ref('/rooms/' + roomID + '/users').on('child_changed', middleUserJoin);
		});
	});
}

function addUserBattleStatusEvent(name , key){
	//試合参加者のIDをPlayers_IDに格納
	Players_ID[key] = name

	//ユーザーのStatus更新イベント
	firebase.database().ref('users/' + key + '/status').on('child_changed', onUpdateRoomUserInfo);
	//ユーザーのState更新イベント
	firebase.database().ref('users/' + key + '/state').on('value', onUpdateRoomUserState)

	//Line先取モード専用イベント
	if(combating_mode == "Line"){
		ClearTime_addevent_target = firebase.database().ref('users/' + key + '/status/ClearTime');
		ClearTime_addevent_target.on('child_added', add_clear_time);
	}

}



let PlayersColor = {}
function addbattleStatusTable(User,key){
	var DOMtr = document.createElement("tr");
	DOMtr.id = "_" + key ;
	if(key == myID){
		DOMtr.classList.add("mine");
	}
	if(key == RoomMaster_ID){
		DOMtr.classList.add("host");
	}
	DOMtr.setAttribute("style","font-size:14px;font-weight:bold");

	document.getElementById("RTCGamePlayPlayersStatusTable").appendChild(DOMtr);

	var DOMrank = document.createElement("td");
	DOMrank .classList.add("RTCrank");
	DOMrank.setAttribute("style","width:7%;");
	DOMrank.setAttribute("rowspan","2");
	DOMrank.textContent = "1位";
	DOMtr.appendChild(DOMrank);

	var DOMname = document.createElement("td");
	DOMname.textContent = User.name;
	DOMname.setAttribute("rowspan","2");
	DOMname.setAttribute("style","width:11%;");

	DOMtr.appendChild(DOMname);


	var DOMscore = document.createElement("td");
	DOMscore .classList.add("RTCscore");
	if(key == myID){
		DOMscore .classList.add("mine_score");
	}
	DOMscore.setAttribute("style","width:9%;");
	DOMscore.textContent = User.status.score+"点"
	var DOMclear = document.createElement("td");
	DOMclear .classList.add("RTCclear");
	DOMclear.setAttribute("style","width:9%;");
	if(combating_mode != "Line"){
		DOMtr.appendChild(DOMscore);
	}else{
		DOMclear.textContent = (Object.values(User.status.ClearTime).length-1)+"pt"
		DOMtr.appendChild(DOMclear);
	}
	var DOMmiss = document.createElement("td");
	DOMmiss.classList.add("RTCmiss");
	DOMmiss.setAttribute("style","width:9%;");
	DOMmiss.textContent = User.status.miss+"ミス";
	DOMtr.appendChild(DOMmiss );

	var DOMcombo = document.createElement("td");
	DOMcombo.classList.add("RTCcomboArea");
	DOMcombo.setAttribute("style","width:16%;");
	DOMcombo.innerHTML = `<span class='RTCcombo'>${User.status.combo}</span> / <span class='RTCmaxcombo'>${User.status.maxCombo}</span> コンボ`;
	DOMtr.appendChild(DOMcombo);

	var DOMtype = document.createElement("td");
	DOMtype.classList.add("RTCtype");
	DOMtype.setAttribute("style","width:9%;");
	DOMtype.textContent = User.status.type+"打";
	DOMtr.appendChild(DOMtype);

	var DOMcorrect = document.createElement("td");
	DOMcorrect .classList.add("RTCcorrect");
	DOMcorrect.setAttribute("style","width:9%;");
	DOMcorrect .textContent = User.status.correct+"%";
	DOMtr.appendChild(DOMcorrect);
	if(combating_mode != "Line"){
		DOMclear.textContent = User.status.clearline+"clear"
		DOMtr.appendChild(DOMclear);
	}else{
		DOMtr.appendChild(DOMscore);
	}
	var DOMkeySec = document.createElement("td");
	DOMkeySec .classList.add("RTCkeySec");
	DOMkeySec.setAttribute("style","width:11%;");
	DOMkeySec .textContent = User.status.keySec+"打/秒";
	DOMtr.appendChild(DOMkeySec);

	var DOMTime = document.createElement("td");
	DOMTime .classList.add("RTCtime");
	DOMTime.setAttribute("style","width:12%;");
	DOMTime .textContent = User.status.moviePos+"秒";
	DOMtr.appendChild(DOMTime);


	var DOMLinetr = document.createElement("tr");
	DOMLinetr.id = "__" + key ;
	if(key == myID){
		DOMLinetr.classList.add("mine");
	}
	if(key == RoomMaster_ID){
		DOMLinetr.classList.add("host");
		roomMasterMoviePos = User.status.moviePos
	}
	DOMLinetr.setAttribute("style","font-size:10px;font-weight:bold");
	document.getElementById("RTCGamePlayPlayersStatusTable").appendChild(DOMLinetr);


	var DOMLine = document.createElement("td");
	DOMLine .classList.add("RTCLine");
	if(User.state == "preStart"){
		DOMLine .classList.add("ready_loading");
	}
	if(key == myID){
		DOMscore .classList.add("mine_line");
	}
	DOMLine.setAttribute("colspan","7");
	DOMLine.setAttribute("style","max-width: 350px;white-space: nowrap;overflow:hidden;");
	DOMLinetr.appendChild(DOMLine);

	var DOMInputMode = document.createElement("td");
	DOMInputMode .classList.add("InputMode");
	DOMInputMode.textContent = User.status.InputMode;
	DOMInputMode.setAttribute("style","font-size:12px");
	DOMLinetr.appendChild(DOMInputMode);

	var DOMlineInput = document.createElement("span");
	DOMlineInput.classList.add("RTClineInput");
	DOMlineInput.setAttribute("style",`color:${User.status.correctColor}`);
	DOMLine.appendChild(DOMlineInput);
	PlayersColor[key] = {
		"correctColor" : User.status.correctColor,
		"lineClearColor" : User.status.lineClearColor
	}

	var DOMlineRemain = document.createElement("span");
	DOMlineRemain .classList.add("RTClineRemain");
	DOMLine.appendChild(DOMlineRemain);

	var DOMlineSpeed = document.createElement("span");
	DOMlineSpeed .classList.add("RTClineSpeed");
	DOMlineSpeed.setAttribute("style","opacity:0.7;font-size: 95%;");
	DOMLine.appendChild(DOMlineSpeed);

	var DOMlineCount = document.createElement("span");
	DOMlineCount .classList.add("count");
	DOMlineCount .textContent = User.status.count;
	DOMLine.appendChild(DOMlineCount);

}




//途中参加者を対戦ステータスに表示
function middleUserJoin(snapshot){
	const _userID = snapshot.ref_.path.pieces_[3];
	const _userName = snapshot.val().name;
	const _userState = snapshot.val().state;
	if(_userState != "play" || Players_ID[_userID]){return;}


	//ユーザーの対戦イベントを追加
	addUserBattleStatusEvent(_userName , _userID)

	//ユーザーの対戦テーブルが既に追加されていたらここで終了
	if(document.getElementById("_" + _userID) != null){
		return;
	}

	//ユーザーの対戦テーブルを追加
	firebase.database().ref('users/').once('value').then(users => {
		addbattleStatusTable(users.val()[_userID],_userID)
	})
}

function preventScrollBySpacaKey(){
	if(event.code == "Space" && document.activeElement.tagName != "INPUT"){
		event.preventDefault();
	}
}

var isFirstClockCountDown =true;
var startTime; //ホストが開始ボタンを押したTimeStamp
var countDown = 3;
let countDownInterval
/**
*@note プレイ前カウントダウンはじめ
*/
function ClockCountDownFirst(){
	const COUNT_DOWN_TIME_FLAG = (Object.keys(Players_ID).length >= 2 || !isRoomMaster)
	startTime = parseInt(new Date().getTime() + (COUNT_DOWN_TIME_FLAG && !middleStart ? 3000:0));

	if(COUNT_DOWN_TIME_FLAG){
		CountDown_sound_play()
	}

	if(!countDownInterval){
		countDownInterval = setInterval(ClockCountDown , 100);
	}
}

/**
*@note ボリュームを小さくしながら動画を止める
*/
function volumeFeedout(){
	feedout_volume = +localStorage.getItem("volume_storage")/7.5

	volume_feedout = setInterval(function(){
		feedout_volume --
		player.setVolume(feedout_volume)

		if(feedout_volume < 0){
			demo_play_flag = false
			feedout_volume = +localStorage.getItem("volume_storage")/7.5
			player.stopVideo()
			clearInterval(volume_feedout);
		}
	},75)
}


/**
*@note プレイ前カウントダウン
*/
let feedout_volume = 0
let volume_feedout

function ClockCountDown(){
	var now = new Date().getTime()


	if(now < startTime){
		//カウントダウン中
		var  ct = Math.ceil(((startTime - now) * 0.001));
		if(ct == countDown){

			if(countDown == 2){
				console.log("start")
				//ボリュームを小さくしながら動画を止める
				volumeFeedout()
			}

			countDown--;
			if(countDown <= 2){
				CountDown_sound_play()
			}
		}

		document.getElementById("RTCRoomMes").style.display = "block"
		document.getElementById("RTCRoomMes").textContent = "開始まであと" + ct+ "秒です。";
	}else{
		//カウントダウン終了
		if(Object.keys(Players_ID).length >= 2){
			countDownEnd_sound_play()
		}

		//カウントダウン非表示
		document.getElementById("RTCRoomMes").style.display = "none"
		document.getElementById("RTCRoomMes").textContent = " ";

		//対戦テーブル内の自分の位置にスクロール
		const users = document.getElementById("RTCGamePlayPlayersStatusTable").children;
		document.getElementById("RTCGamePlayWrapper").scrollTo({
			top:combat_ranking_ViewMode == "Scroll" ? (document.getElementsByClassName("mine")[1].querySelector(".RTCrank").clientHeight*(([].slice.call( users ).indexOf(document.getElementsByClassName("mine")[1])/2)-6)):0,
		})

		//対戦テーブル非表示モードだったら非表示
		if(combat_ranking_ViewMode == "none"){
			document.getElementById("RTCContainer").style.display = "none"
			document.querySelector('[class="wrapper row mt-5 w-80"]').parentNode.setAttribute("style","margin-top:250px!important;")
		}

		roomMasterMoviePos = parseFloat(document.getElementsByClassName("host")[0].getElementsByClassName("RTCtime")[0].textContent)
		player.seekTo(roomMasterMoviePos);
		clearInterval(countDownInterval);
	}
}


var isDispFmtKeySec = true; //true:key/sec形式で表示 false key/min形式で表示

let rank = -5
let HostLineCount = 0

/**
*@note 対戦中にユーザーが離脱した。
*/
function exitPlayer(SnapShotValue,uid){
	if(SnapShotValue != "end"){
		firebase.database().ref('users/' + uid + '/status').off('child_changed', onUpdateRoomUserInfo);
		firebase.database().ref('users/' + uid + '/state').off('value', onUpdateRoomUserState)
	}
	delete Players_ID[uid]
}

/**
*@note ルーム内ユーザーの状態が変更された。
*/
function onUpdateRoomUserState(snapshot){
	const uid = snapshot.ref_.path.pieces_[1];
	const Update_Info = snapshot.ref_.path.pieces_[3]


	if(RTCGamePlayPlayersStatusTableSelector == null){return;}

	const SnapShotValue = snapshot.val()
	if(SnapShotValue == 'preStart' || SnapShotValue == "play"){return;}
	//	BubbleSort()
	if(SnapShotValue == "result"){
		RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCtime").textContent = "プレイ終了";
	}else if(SnapShotValue != "play" && SnapShotValue != "end"){
		firebase.database().ref('rooms/' + roomID + '/state').once('value').then(room_state => {
			if(room_state.val() == "play"){
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineInput").textContent = "タイムアウトしました。";
			}else{
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCtime").textContent = "プレイ終了";
			}
		})
	}
	exitPlayer(SnapShotValue,uid)
	if(Object.keys(Players_ID).length == 0){
		//勝者を記録
		winnerRecord()
	}
}

/**
*@note 対戦後、最後まで残っていた人が1位の人を記録する。
*/
function winnerRecord(){
	const users = document.getElementById("RTCGamePlayPlayersStatusTable").children;

	if(users.length > 2){
		firebase.database().ref('rooms/' + roomID).once('value').then(room => {
			const StartTime = room.val().StartTime

			var updates = {}
			if(room.val().Winner){

				if(Object.values(room.val().Winner).flat().includes(StartTime)){
					return;
				}
				let Win_data = Object.keys(room.val().Winner)

				for (let i = 0; i < users.length/2; i++){
					if(document.getElementsByClassName("RTCrank")[i].textContent == "1位"){
						const Winner_ID = document.getElementsByClassName("RTCrank")[i].parentElement.id.slice(1)
						const idx = Win_data.indexOf(Winner_ID);
						if(idx >= 0){
							Win_data.splice(idx, 1);
						}
					}else{
						break;
					}
				}
				for (let i = 0; i < Win_data.length; i++){
					updates['/rooms/' + roomID + '/Winner/' + Win_data[i]] = null
				}
				firebase.database().ref().update(updates);
			}

			firebase.database().ref('rooms/' + roomID + '/Winner').once('value').then(Winner => {
				var updates = {}
				for (let i = 0; i < users.length/2; i++){
					if(document.getElementsByClassName("RTCrank")[i].textContent == "1位"){
						const Winner_ID = document.getElementsByClassName("RTCrank")[i].parentElement.id.slice(1)
						let Win_count = Winner.val() && Winner.val()[Winner_ID] && Winner.val()[Winner_ID].length ? Winner.val()[Winner_ID].concat(StartTime) : [StartTime]
						updates['/rooms/' + roomID + '/Winner/' + Winner_ID] = Win_count.length > 1 ? Win_count.filter((x, i, self) => self.indexOf(x) === i):Win_count
					}else{
						break;
					}
				}
				firebase.database().ref().update(updates);
			})
		})
	}
}

function onUpdateRoomUserInfo(snapshot){
	const uid = snapshot.ref_.path.pieces_[1];
	const Update_Info = snapshot.ref_.path.pieces_[3]
	if(RTCGamePlayPlayersStatusTableSelector == null){return;}
	const SnapShotValue = snapshot.val()
	switch(Update_Info){
		case "clearline":
			if(combating_mode != "Line"){
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCclear").textContent = SnapShotValue+"clear"
			}
			RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineInput").style.color = PlayersColor[uid].lineClearColor
			break;
		case "combo":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " .RTCcombo").textContent =  SnapShotValue;
			break;
		case "maxCombo":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " .RTCmaxcombo").textContent =  SnapShotValue;
			break;
		case "correct":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCcorrect").textContent = SnapShotValue +"%";
			break;
		case "keySec":
			if(isDispFmtKeySec){
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCkeySec").textContent = SnapShotValue + '打/秒';
			}else{
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCkeySec").textContent = Math.round(SnapShotValue * 60) + 'kpm';
			}
			break;
		case "linekeySec":
			if(SnapShotValue){
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineSpeed").textContent =` ${SnapShotValue}打/秒`;
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine").scrollLeft = 999
			}else{
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineSpeed").textContent = ""
			}
			break;
		case "lineInput":
			const RTCLineWidth = RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine")
			const LineInput = RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineInput")
			if(SnapShotValue){
				LineInput.textContent = (LineInput.textContent + SnapShotValue.slice(0,1) ).substr( -60, 60 );
			}else{
				LineInput.textContent = "";
			}
			if(!LineInput.textContent){
				RTCLineWidth.scrollLeft = 0
				LineInput.style.color = PlayersColor[uid].correctColor
			}
			break;
		case "lineRemain":
			break;
		case "SkipOptin":
			if(typeof SnapShotValue === "number"){
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineRemain").insertAdjacentHTML('beforeend', "<span class='skip_opt_in' style='opacity: 0.4;'>"+(Skip_Mode == "HOST" && Players_ID[RoomMaster_ID] ? "":" skip⏩")+"</span>")
				const RTCLineWidth = RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine")
				RTCLineWidth.scrollLeft = RTCLineWidth.scrollWidth
				if(seeked_count != count && Object.keys(Players_ID).length <= document.getElementsByClassName("skip_opt_in").length){
					while(document.getElementsByClassName("skip_opt_in")[0] != null){
						document.getElementsByClassName("skip_opt_in")[0].remove()
					}
					seeked_count = count;
					player.seekTo((parseFloat(lyrics_array[count][0]) + player.difftime - 4)+(4-speed*4));
					stop_count = 0;
					playheadUpdate();
					replace_complete_area("Skip")
					if(Skip_Mode == "HOST"){
						SELECTOR_ACCESS_OBJECT['skip-guide'].textContent = ""
					}
				}
			}else{
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineRemain").textContent = "";
			}
			break;
		case "miss":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCmiss").textContent = SnapShotValue +"ミス";
			break;
		case "count":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " .count").textContent = SnapShotValue;
			break;
		case "moviePos":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCtime").textContent = SnapShotValue +"秒";
			break;
		case "score":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCscore").textContent = SnapShotValue +"点";
			break;
		case "type":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCtype").textContent = SnapShotValue +"打";
			break;
		case "InputMode":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .InputMode").textContent = SnapShotValue
			break;
	}
	if(combating_mode != "Line" && (Update_Info == "score") || combating_mode == "Line" && Update_Info == "ClearTime"){
		//順位入れ替え
		BubbleSort(SnapShotValue,uid)
	}
}


function BubbleSort(SnapShotValue,uid){

	//順位入れ替え
	const users = document.getElementById("RTCGamePlayPlayersStatusTable").children;
	const users_column = users.length / 2
	var scores = {};
	var score_arr = []
	for (let i = 0; i < users.length; i+=2){
		const user_score = parseFloat(combating_mode != "Line" ? users[i].getElementsByClassName("RTCscore")[0].textContent : users[i].getElementsByClassName("RTCclear")[0].textContent);
		scores[i / 2] = user_score
		score_arr.push(user_score)
	}

	var tmp;
	let ranking
	//バブルソート
	for(let i = 0; i < users.length / 2; ++i){ //上位から
		for(var j = i; j < users.length / 2; ++j){
			if(scores[j] > scores[i]){
				users[j * 2 + 1].after(users[i * 2]);
				users[j * 2 + 1].after(users[i * 2]);
				users[i * 2].before(users[j * 2 - 1]);
				users[i * 2].before(users[j * 2 - 1]);
			}
		}
	}
	score_arr.sort(
		function(a,b){
			return (a < b ? 1 : -1);
		}
	);
	let Shift_rank = 0
	for (let i = 0; i < users.length; i+=2){
		const RTCrank = users[i].getElementsByClassName("RTCrank")[0]
		if(RTCrank){
			if(score_arr[ (i / 2)-1-Shift_rank] == score_arr[ (i / 2)]){
				Shift_rank++
			}
			RTCrank.textContent = ((i / 2) + 1 - Shift_rank) + "位";
			if(uid == myID && users[i].classList.value.indexOf("mine") > -1){
				ranking = (i / 2) + 1
				if(SnapShotValue == 0.00 && score){
					ranking = users_column
				}
			}
		}
	}
	if(score && combat_ranking_ViewMode == "Scroll"){
		if(Math.abs(ranking - rank) >= 1 || ranking <= 6){
			if(ranking > 6){
				document.getElementById("RTCGamePlayWrapper").scrollTo({
					top:(document.getElementsByClassName("mine")[1].querySelector(".RTCrank").clientHeight*(ranking-5)),

				})
			}else{
				document.getElementById("RTCGamePlayWrapper").scrollTo({
					top:(0),
				})
			}
			rank = ranking
		}
	}
}

/**
*@note ゲーム終了
*/
function endGames(){
	document.getElementById("RTCRoomMes").style.display = "block"
	document.getElementById("RTCRoomMes").textContent = "お疲れさまでした。続けて対戦する場合は更新ボダン(F5)を押してください。";
	firebase.database().ref('/rooms/' + roomID).on('child_changed', roomUpdate.onUpdateRoomInfo.bind(roomUpdate));

	prevState = "result"
	var updates = {};
	updates['/rooms/' + roomID + '/state'] = "result";
	updates['/users/' + myID + '/state'] = "result";
	firebase.database().ref().update(updates);
}

/**
*@note ゲーム中処理 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////////////////////

var isSECancel = false;

/**
*@note SE関連 ここから ---
*/
var SE_SET = {
	"enter":"https://soundeffect-lab.info/sound/button/mp3/decision5.mp3",
	"warning":"https://soundeffect-lab.info/sound/button/mp3/warning1.mp3",
	"exit":"https://soundeffect-lab.info/sound/button/mp3/decision23.mp3",
	"click":"https://soundeffect-lab.info/sound/button/mp3/cursor1.mp3",
	"cancel":"https://soundeffect-lab.info/sound/button/mp3/cancel2.mp3",

	"greet":"https://soundeffect-lab.info/sound/voice/mp3/game/swordwoman-greeting1.mp3",
	"chat":"https://soundeffect-lab.info/sound/various/mp3/bubble-burst1.mp3",
	"cngSong":"https://soundeffect-lab.info/sound/button/mp3/decision29.mp3",
};

/**
*@note SEを鳴らす
*@param string SEname
*/
function playSE(SEname,mute){
	if(isSECancel){return;}
	var se = new Audio();
	if(mute == "mute"){
		se.muted = true
	}else{
		se.muted = false
		se.volume = (localStorage.getItem("volume_storage")/100)*(SEname == "greet"?0.5:1)
	}
	se.src = SE_SET[SEname];
	se.play();
}


var matchconfirm_sound
var CountDown_sound //https://web.archive.org/web/20170618145501/http://soundeffect-lab.info/sound/button/mp3/cursor3.mp3
var countDownEnd_sound


function CountDown_sound_load(){
	var request_CountDown_sound = new XMLHttpRequest();
	request_CountDown_sound.open('GET', "https://dl.dropboxusercontent.com/s/hpn3k6msvnb2m3c/cursor3.mp3?dl=0", true);
	request_CountDown_sound.responseType = 'arraybuffer';
	request_CountDown_sound.onload = function() {
		CountDown_sound.decodeAudioData(request_CountDown_sound.response, function(buffer) {
			audio_buffer_CountDown_sound = buffer;
		}, function(){
			//エラー
		}
									   );
	};
	request_CountDown_sound.send();
};

function CountDown_sound_play(mute){
	let CountDown_sound_gain = CountDown_sound.createGain();
	let CountDown_sound_source = CountDown_sound.createBufferSource();
	CountDown_sound_source.buffer = audio_buffer_CountDown_sound;
	CountDown_sound_source.connect(CountDown_sound_gain);
	CountDown_sound_gain.connect(CountDown_sound.destination);
	if(mute == "mute"){
		CountDown_sound_gain.gain.value = 0
	}else{
		CountDown_sound_gain.gain.value = (localStorage.getItem("volume_storage")/100)
	}
	CountDown_sound_source.start(0);
}

function countDownEnd_sound_load(){
	var request_countDownEnd_sound = new XMLHttpRequest();
	request_countDownEnd_sound.open('GET', "https://dl.dropboxusercontent.com/s/pvzs4c3k9z4j923/decision1.mp3?dl=0", true);
	request_countDownEnd_sound.responseType = 'arraybuffer';
	request_countDownEnd_sound.onload = function() {
		countDownEnd_sound.decodeAudioData(request_countDownEnd_sound.response, function(buffer) {
			audio_buffer_countDownEnd_sound = buffer;
		}, function(){
			//エラー
		}
										  );
	};
	request_countDownEnd_sound.send();
};

function countDownEnd_sound_play(mute){
	let countDownEnd_sound_gain = countDownEnd_sound.createGain();
	let countDownEnd_sound_source = countDownEnd_sound.createBufferSource();
	countDownEnd_sound_source.buffer = audio_buffer_countDownEnd_sound;
	countDownEnd_sound_source.connect(countDownEnd_sound_gain);
	countDownEnd_sound_gain.connect(countDownEnd_sound.destination);
	if(mute == "mute"){
		countDownEnd_sound_gain.gain.value = 0
	}else{
		countDownEnd_sound_gain.gain.value = (localStorage.getItem("volume_storage")/100)
	}
	countDownEnd_sound_source.start(0);
}


function matchconfirm_sound_load(){
	var request_matchconfirm_sound = new XMLHttpRequest();
	request_matchconfirm_sound.open('GET', "https://dl.dropboxusercontent.com/s/25y0ey3wszmlgev/match-confirm.mp3?dl=0", true);
	request_matchconfirm_sound.responseType = 'arraybuffer';
	request_matchconfirm_sound.onload = function() {
		matchconfirm_sound.decodeAudioData(request_matchconfirm_sound.response, function(buffer) {
			audio_buffer_matchconfirm_sound = buffer;
		}, function(){
			//エラー
		}
										  );
	};
	request_matchconfirm_sound.send();
};

function matchconfirm_sound_play(mute){
	let matchconfirm_sound_gain = matchconfirm_sound.createGain();
	let matchconfirm_sound_source = matchconfirm_sound.createBufferSource();
	matchconfirm_sound_source.buffer = audio_buffer_matchconfirm_sound;
	matchconfirm_sound_source.connect(matchconfirm_sound_gain);
	matchconfirm_sound_gain.connect(matchconfirm_sound.destination);
	if(mute == "mute"){
		matchconfirm_sound_gain.gain.value = 0
	}else{
		matchconfirm_sound_gain.gain.value = (localStorage.getItem("volume_storage")/100)*0.4
	}
	matchconfirm_sound_source.start(0);
}
/**
*@note SE関連 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////











let demo_play_flag = false
let BGM_time = -1
let BGM_time_flag = false

let skip_opt_in = false
let feedin_volume = -10
let volume_feedin



function getRoomKey(event){

	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		const PassWord = room.val().roomPassWord
		if(isRoomMaster){
			let PassWord_Key = window.prompt( "パスワードを変更", PassWord )
			if(PassWord_Key != null && PassWord_Key.length >= 1) {
				var updates = {};
				updates['rooms/' + roomID + "/roomPassWord"] = PassWord_Key;
				firebase.database().ref().update(updates);
			}else if(PassWord_Key == ""){
				window.alert( "1文字以上のパスワードを設定してください。" )
			}
		}else{
			window.alert( "ルームパスワード: " + PassWord)
		}

	})
}
function RoomName_Change(event){
	if(/\n/.test(event.target.innerText)){
		document.activeElement.blur()
	}
	let event_target_id = event.target.innerText.replace(/\n/g,"")
	event.target.textContent = event_target_id
	if(event_target_id.length > 64){
		event_target_id = event_target_id.slice(0,window.getSelection().focusOffset-1)+event_target_id.slice(window.getSelection().focusOffset)
		document.activeElement.blur()
		document.getElementById("RoomNameArea").innerText = event_target_id
	}
	if(event.inputType == "insertFromPaste"){
		event_target_id = event_target_id.slice(0,64)
		document.getElementById("RoomNameArea").innerText = event_target_id
	}
	var updates = {};
	updates['rooms/' + roomID + "/roomName"] = event_target_id;
	firebase.database().ref().update(updates);
}


//ルームマスターの時はゲーム開始、非ルームマスターのときは準備完了ショートカットキー[Enter]

function ready_key(event){
	if(!PHONE_TABLET_FLAG && event.key == "Enter" && (document.activeElement.tagName != "INPUT" || document.activeElement.id == "ChatInput" && !document.getElementById("ChatInput").value)){
		if(isRoomMaster){
			document.getElementById("RTCbtnGameStart").click()
		}else{
			document.getElementById("RTCbtnReady").click()
		}
	}
}

function battle_container_change(){
	if(combat_ranking_ViewMode == "Scroll"){
		combat_ranking_ViewMode = "Fixed"
		replace_complete_area("順位スクロール OFF")
	}else if(combat_ranking_ViewMode == "Fixed"){
		combat_ranking_ViewMode = "none"
		document.getElementById("RTCContainer").style.display = "none"
		document.querySelector('[class="wrapper row mt-5 w-80"]').parentNode.setAttribute("style","margin-top:250px!important;")
		replace_complete_area("順位非表示")
	}else{
		combat_ranking_ViewMode = "Scroll"
		document.getElementById("RTCContainer").style.display = "block"
		document.querySelector('[class="wrapper row mt-5 w-80"]').parentNode.removeAttribute("style")
		replace_complete_area("順位スクロール ON")
	}
	localStorage.setItem("combat_ranking_ViewMode",combat_ranking_ViewMode)
}

function add_clear_time(event){

	const event_target_id = event.ref_.path.pieces_[1];
	const line_number = +event.ref_.path.pieces_[4];
	const line_clear_time = +event.node_.value_
	var updates = {};
	firebase.database().ref('users').once('value').then(room_user => {
		for (let room_user_key in Players_ID) {
			if(!isNaN(line_number)){
				if(room_user_key != event_target_id && room_user.val()[room_user_key].status.ClearTime[line_number]){
					if(room_user.val()[room_user_key].status.ClearTime[line_number] > line_clear_time){
						updates['/users/' + room_user_key + '/status/ClearTime/'+ (line_number)] = null;
					}else{
						updates['/users/' + event_target_id + '/status/ClearTime/'+ (line_number)] = null;
					}
				}
			}
		}
		firebase.database().ref().update(updates);
		firebase.database().ref('users').once('value').then(room_user_update => {
			for (let room_user_key in Players_ID) {
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + room_user_key + " > .RTCclear").textContent = Object.keys( room_user_update.val()[room_user_key].status.ClearTime ).length-1+"pt";
			}
		});
	})
}
