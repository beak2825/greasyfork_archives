// ==UserScript==
// @name       　RealTimeCombatting[Typing-Tube]
// @namespace    http://tampermonkey.net/
// @version      1.38.451
// @description  typing-tube.netにて、リアルタイムでの対戦を実現したい。
// @author       Spacia(の)
// @exclude      https://typing-tube.net/movie/edit*
// @exclude      https://typing-tube.net/movie/show/*?test=test
// @match        ttps://typing-tube.net/
// @grant        none
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-auth.js
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-database.js
// @downloadURL https://update.greasyfork.org/scripts/391474/RealTimeCombatting%5BTyping-Tube%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/391474/RealTimeCombatting%5BTyping-Tube%5D.meta.js
// ==/UserScript==

//重要な更新Verの最低値
var ImportantVer = 138451

//バージョンチェック値
var Ver = "1.38.451"

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




/////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @note RealTimeCombatting ON/OFF 切り替えスイッチをヘッダーに追加　ここから ---
*/


let RTC_Switch = sessionStorage.getItem("RTC_Switch") == "true"

document.querySelector('[data-sa-action="search-open"]').parentNode.insertAdjacentHTML('afterend',`<li id="RTC_Switch"><a class="" id="notify_room" data-sa-action="combat" style="
    padding-bottom: 1.5rem;
    padding-top: 0.6rem;
    position: relative;
    top: 5px;
　　"><span style="
    position: absolute;
    top: 4.1em;
    margin: auto;
    font-size: 0.5em;
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    font-weight: 600;
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

/**
 *@note RealTimeCombatting切り替えスイッチをヘッダーに追加　ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////



(function() {
    'use strict';
	if(RTC_Switch || location.href.indexOf("https://typing-tube.net/movie")<0){
		SetUpFirebase();
	}
})();



/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note Firebase初期化ここから ---
*/

/**
*@Description Firebaseを使用可能状態にセットアップ (SDKのロード、初期化)
*/
function SetUpFirebase(){
	// <!-- The core Firebase JS SDK is always required and must be listed first -->
//	loadScript(["https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js" , "https://www.gstatic.com/firebasejs/7.2.1/firebase-auth.js" , "https://www.gstatic.com/firebasejs/7.2.1/firebase-database.js"])
//		.then(function(){
		InitFirebase(RoginAnon);
//	});
}

/**
*@Description urlで指定したscriptファイルを読み込みます。
*@param url 読み込むscriptファイル
*@param callback

function loadScript( urls ){
	return Promise.all( urls.map(function(url){return new Promise(function(resolve,reject){
		var script = document.createElement('script');
	  script.src = url;
	  script.onload=resolve;
	  document.head.appendChild(script);
  })}));

}
*/
/**
*@Description Firebaseの初期化作業、SDKの読み込み後、使用する前に呼び出す。
*@param callback
*/


function InitFirebase(callback){

    // Your web app's Firebase configuration
    var firebaseConfig = {
		/*
		RealTimeCombatting"TypingTube" データベース(非公式)
		https://console.firebase.google.com/u/1/project/realtimecombatting-typingtube/database/realtimecombatting-typingtube/data
        apiKey: "AIzaSyACA8ARVyv9vawk9BAfoaKg5Cl8dsNGItM",
        authDomain: "realtimecombatting-typingtube.firebaseapp.com",
        databaseURL: "https://realtimecombatting-typingtube.firebaseio.com",
        projectId: "realtimecombatting-typingtube",
        storageBucket: "realtimecombatting-typingtube.appspot.com",
        messagingSenderId: "62043628528",
        appId: "1:62043628528:web:3ab013403b1f3ed9383335",
        measurementId: "G-1P2BBSLWYW"
		*/

		/*
		TypingTube データベース(公式)
		*/
		apiKey: "AIzaSyDAsof24N3Ikx3vpKegkmhVYo6j1ejx2Ss",
		authDomain: "api-project-959901312274.firebaseapp.com",
		databaseURL: "https://typingtube.firebaseio.com",
		projectId: "api-project-959901312274",
		storageBucket: "api-project-959901312274.appspot.com",
		messagingSenderId: "959901312274",
		appId: "1:959901312274:web:f78a1d9339b573bbdc7fcb",
		measurementId: "G-04HLEDZM"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
	if(location.href.indexOf("https://typing-tube.net/movie/") == -1){
    callback();
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

var userName;
var myID;
var prevTS = new Date().getTime()
var playing = false;
let Latest_Ver
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
            var isAnonymous = user.isAnonymous;
            myID = "U"+user.uid;
			if(RTC_Switch){
				var path = firebase.database().ref('users/' + myID);
				//ユーザーネーム取得
				userName = document.querySelector("body > main > aside > aside > div > div.scrollbar-inner.scroll-content > div > div.user__info > div > div.user__name").innerHTML;
				path.transaction(function(currentData) {
					//プレイステータスをすべて初期値に戻す
					var updates = {};
					updates['/users/' + myID + '/name'] = userName;
					localStorage.setItem("RTCAfkTS", prevTS)
					updates['/users/' + myID + '/ver'] = Ver;
					firebase.database().ref().update(updates);
					firebase.database().ref('users/' + myID).once('value').then(user => {
						roomID = user.val().roomID;
					});
					firebase.database().ref('Version').once('value').then(Version => {
						Latest_Ver = Version.val()
					})
					//afkタイムアウト用
					timeStampForAFK = new Date().getTime();
					isWrittenAFKState = false;
					$('body').on('keydown mousedown mousemove',function(){
						timeStampForAFK = new Date().getTime();
						if(isWrittenAFKState == true){
							var updates = {};
							isWrittenAFKState = false;
							updates['/users/' + myID + "/state"] = prevState;
							if(LocationDateTimeStamp){
							updates['/users/' + myID + '/DeletetimeStamp'] = LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp)
							}
							firebase.database().ref().update(updates);
						}
					});
					checkMultipleOpen();
				});
			}else{
				GetLocationDate().then( () => {
					firebase.database().ref('rooms').once('value').then(_room => {
						if(location.href.indexOf("https://typing-tube.net/movie")<0&&_room.val()){
							document.getElementById("notify_room").classList.add("top-nav__notify_room");
						}
					})
					UpdateCheck()
				})
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


var AFK_TIMEOUT = 60000;
var timeStampForAFK;
var isWrittenAFKState;
var prevState;
let RoomUserAfkWriteClock = 0
/**
*@Description　ユーザーのタイムスタンプ書き換え
*/

function ClockWriteTimeStamp(){
const new_Date = new Date().getTime()
var updates = {};
    //afkTimeout
    if(new_Date > AFK_TIMEOUT + timeStampForAFK && playing == false && prevState == "idle"){
        if(isWrittenAFKState == false){
            firebase.database().ref('users/' + myID).once('value').then(user => {
					isWrittenAFKState = true;
					updates['/users/' + myID + "/state"] = "afk";
					firebase.database().ref().update(updates);
			});
		}
	}



	if(LocationDateTimeStamp){
		updates['/users/' + myID + '/DeletetimeStamp'] = LocationDateTimeStamp+(new_Date-LocalDateTimeStamp)

		if(!playing && new_Date - RoomUserAfkWriteClock >= 30000){
			RoomUserAfkWriteClock = new_Date
			firebase.database().ref('rooms/' + roomID + '/users').once('value').then(room_users => {
				firebase.database().ref('users').once('value').then(user => {
					var updates = {}
					for (let room_user_key in room_users.val()) {
						const TimeOut_time = LocationDateTimeStamp+(new_Date-LocalDateTimeStamp) - eval("user.val()."+room_user_key+".DeletetimeStamp")
						if(room_user_key != myID){
							if(TimeOut_time >= 50000){
								ForcePlayerDelete(room_user_key, null)
							}else if(TimeOut_time >= 20000){
								updates['/users/' + room_user_key + '/state'] = "timeOut"

							}
						}
					}
					firebase.database().ref().update(updates);
				});
			});
		}
	}

	firebase.database().ref().update(updates);
}

var checkNum = 0;
var CHECK_MAX = 5;
var isChecking = true;
/**
*@Description 2窓チェック
*/
function checkMultipleOpen(){
	if(isChecking){
		if(myID){
			firebase.database().ref('users/' + myID).once('value').then(user => {
				var ts = localStorage.getItem("RTCAfkTS");
				if(prevTS != ts){

					let alert_tag = document.createElement('b');
					alert_tag.textContent = "RealTimeCombatting:2窓アクセスが検出されました。このウィンドウでは対戦をすることができません。"
					let contentTag = document.getElementsByClassName("quick-stats")[0];
					contentTag.parentNode.insertBefore(alert_tag, contentTag);
					contentTag.parentNode.insertBefore(alert_tag, contentTag);
					RTC_Switch = false

				}else{
					checkNum++;

					if(checkNum > CHECK_MAX){
						isChecking = false;
						//対戦用のデータ読み込み + 対戦用の表示領域を作成。
						LoadFirebaseData();
						setInterval(ClockWriteTimeStamp,5000)
					}
					setTimeout(() => {
						checkMultipleOpen();
					}, 100);
				}
			});
		}else{
			setTimeout(() => {
				checkMultipleOpen();
			}, 100);
		}
	}
}


/**
*@Description 対戦用のデータ読み込み + 対戦用の表示領域を作成。
*/
	let First_Load_Room_Existence_flag = false
function LoadFirebaseData(){

	var updates = {};
if(location.href.indexOf("https://typing-tube.net/movie")==0 && player.getVideoData().title == ""){
	updates['/users/' + myID + '/state'] = prevState = "not_playable";
}else{
	updates['/users/' + myID + '/state'] = prevState = "idle";
}
	firebase.database().ref().update(updates);
    //対戦用のインタラクティブエリア作成
    CreateRTCElement();

    //チャット欄自動更新
    var chats = firebase.database().ref('chats').limitToLast(10);
    chats.on('child_added', onChatUpdate);

    //Room情報自動更新
    var rooms = firebase.database().ref('rooms');
    rooms.on('child_added', onAddRoom);
    rooms.on('child_changed', onChangeRoom);
    rooms.on('child_removed', onRemoveRoom);

    //初めの数秒は音を鳴らさない
    isSECancel = true;
    setTimeout(function(){
        isSECancel = false;
    }, 1500);

    //ルームにすでに入っているか
    if(roomID != null){
        EnterRoom(roomID);
    }else{
		First_Load_Room_Existence_flag = true
	}


    GetLocationDate().then( () => {
		var updates = {};
		updates['/users/' + myID + '/DeletetimeStamp'] = LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp)
		firebase.database().ref().update(updates);
		First_Load_Room_Existence_flag = false
		setTimeout(function(){
			if(document.getElementById("Room_Existence") != null){
				document.getElementById("Room_Existence").remove()
			}
		},200)
	})
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
        playarea.classList.add("is-hide");
		document.getElementsByClassName("status")[0].classList.add("flex_100");

    }

	//2窓チェック用のtimestampをlocalStorageに保存
	window.addEventListener("blur",function WindowBlurTimeStamp(event){
		if(!WindowBlur){
			WindowBlur = setInterval(function(){
					const new_Date = new Date().getTime()
					localStorage.setItem("RTCAfkTS", new_Date)
				if(LocationDateTimeStamp){
					var updates = {}
					updates['/users/' + myID + '/DeletetimeStamp'] = LocationDateTimeStamp+(new_Date-LocalDateTimeStamp)
					firebase.database().ref().update(updates);
				}
				},400)
		}
	})

	window.addEventListener("focus",function(){
		if(WindowBlur){
			clearInterval(WindowBlur)
			WindowBlur = 0
		}
            firebase.database().ref('users/' + myID).once('value').then(user => {
				var updates = {}
				if(LocationDateTimeStamp){
					const new_Date = new Date().getTime()
					updates['/users/' + myID + '/name'] = userName
					updates['/users/' + myID + '/ver'] = Ver;
				}
				if(user.val().state == null){
					updates['/users/' + myID + '/state'] = "idle"
				}
				firebase.database().ref().update(updates);
				ClockWriteTimeStamp()
			})
	})

window.addEventListener('beforeunload', function(){
	if(!playing){
	var updates = {}
	updates['/users/' + myID + '/state'] = "idle"
	firebase.database().ref().update(updates);
	}
});
    CreateContainer();
    CreateStatusArea();
    CreateChatArea();
	UpdateCheck();
}





/**
*@note スタイルを追加---
*/
function AddStyles(){
    var DOMstyle = document.createElement("style");
    DOMstyle.setAttribute("type","text/css");
    DOMstyle.innerHTML = `
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
#RTCRoomPlayers::-webkit-scrollbar{display:block;}/*バーの太さ*/
#RTCRoomPlayers::-webkit-scrollbar-thumb{display:block;background: #8b8b8b;border-radius: 1em;}

#RTCRoomPlayers::-webkit-scrollbar-thumb:hover{display:block;background: #8b8b8b;}
#RTCRoomPlayers::-webkit-scrollbar-thumb:active{background: #555555;}
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
        display:none;
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
        .ready_background_color{
        background: #5eff8330;
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

[value="準備完了"],[value="ゲーム開始"] {
    color: #56e576;
    background-color: transparent;
    background-image: none;
    border-color: #56e576!important;
}
[value="準備完了"]:hover,[value="ゲーム開始"]:hover {
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
`
        ;
    document.querySelector("head").appendChild(DOMstyle);
}

/**
*@note コンテナ作成---
*/
function CreateContainer(){
    DOMContainer = document.createElement("div");
    DOMContainer.classList.add('w-100');
    DOMContainer.id = "RTCContainer";
    DOMContainer.setAttribute("style","border-style: solid;border-color: #f5f5f5;border-width: 2px;margin-top:10px;z-index:5;");

    if(/movie\/show/.test(location.pathname)){
        const parent = CONTROLBOX_SELECTOR;
        parent.appendChild(DOMContainer);
        //var parent = after.parent();
        //parent.insertBefore(DOMContainer, after );
        movieID = location.pathname.match(/\/\w+/g)[2].match(/\d+/g)[0];
        movieTitle = document.querySelector(".movietitle > h1").innerHTML.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
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
    var DOMStatus = document.createElement("div");
	DOMStatus.setAttribute("id","RTCStatus_Area");
	DOMStatus.setAttribute("style","height:300px;padding:0px 10px;");
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
    DOMp.innerHTML = "ルームを選択";
    DOMRoomSelectScene.appendChild(DOMp);

    var DOMRooms = document.createElement("ul");
    DOMRooms.setAttribute("style","height:200px;overflow-y:auto;margin:0;padding:0;");
    DOMRooms.id = "RTCRooms";
    DOMRoomSelectScene.appendChild(DOMRooms);

    var DOMNoRoomMes = document.createElement("p");
    DOMNoRoomMes.setAttribute("style","display:hidden;font-size:14px;padding-top:90px;text-align: center;");
    DOMNoRoomMes.id = "noRoomMes";
    DOMNoRoomMes.innerHTML = "現在ルームが存在しません。";
    DOMRooms.appendChild(DOMNoRoomMes);

    var DOMUIs = document.createElement("div");
    DOMUIs.setAttribute("style","height:30px;margin:10px 0; padding:0");
    DOMRoomSelectScene.appendChild(DOMUIs);

    var DOMCreateNewRoom = document.createElement("input");
    DOMCreateNewRoom.setAttribute("type","button");
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
    DOMp.innerHTML = "新しく対戦ルームを作成";
    DOMdiv.appendChild(DOMp);

    var DOMlabelRoomName = document.createElement("label");
    DOMlabelRoomName.setAttribute("for","roomName");
    DOMlabelRoomName.setAttribute("style","font-size:14px;margin:4px 0;width:20%;");
    DOMlabelRoomName.innerHTML = "ルーム名: ";
    DOMdiv.appendChild(DOMlabelRoomName);

    var DOMroomName = document.createElement("input");
    DOMroomName.id = "roomName";
    DOMroomName.setAttribute("type","text");
    DOMroomName.setAttribute("name","roomName");
    DOMroomName.setAttribute("maxlength","19");
	DOMroomName.setAttribute("class","popup-text-area");
    DOMroomName.setAttribute("value", userName + "'s room");
    DOMdiv.appendChild(DOMroomName);

    var DOMbr = document.createElement("br");
    DOMdiv.appendChild(DOMbr );

    var DOMlabelDescription = document.createElement("label");
    DOMlabelDescription.setAttribute("for","roomDescription");
    DOMlabelDescription.setAttribute("style","font-size:14px;margin:4px 0;width:20%;");
    DOMlabelDescription.innerHTML = "詳細: ";
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
function CreateRoomIdleScene(parent){
    var DOMRoomIdleScene = document.createElement("div");
     DOMRoomIdleScene.setAttribute("style","width:100%");

    DOMRoomIdleScene.id = "RTCRoomIdleScene";
    DOMRoomIdleScene.classList.add('is-hide');
    parent.appendChild(DOMRoomIdleScene);

    var DOMp = document.createElement("p");
    DOMp.setAttribute("style","font-size:18px;margin:10px 0;");
    DOMp.id = "RTCRoomName";
    DOMp.innerHTML = "ルーム";
    DOMRoomIdleScene.appendChild(DOMp);

    var DOMRoomWrapper = document.createElement("div");
    DOMRoomWrapper.setAttribute("style","height:200px;margin:0;padding:0;");
    DOMRoomWrapper.id = "RTCRoomWrapper";
    DOMRoomIdleScene.appendChild(DOMRoomWrapper);


    var DOMRoomPlayers = document.createElement("div");
    DOMRoomPlayers.setAttribute("style","height:100%;width:47%;margin:0 5px;padding:0;display:inline-block;vertical-align: top;background-color:rgba(0,0,0, 0.2);font-size:12px;overflow-y:auto;");
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
				if(prevState == "Auto_ready"){
					prevState = "idle"
					updates['users/' + myID + '/state'] = "idle";
				}
			}
			firebase.database().ref().update(updates);
		}
	})


    var DOMThead = document.createElement("P");
	DOMThead.id = "RTCRoomPlayerCount";
    DOMThead.innerHTML = "参加者一覧";
    DOMRoomPlayers.appendChild(DOMThead);

    var DOMTable = document.createElement("table");
    DOMTable.setAttribute("rules","all");
    DOMTable.setAttribute("border","1");
    DOMTable.id = "RTCRoomPlayersTable";
    DOMRoomPlayers.appendChild(DOMTable);

    var DOMRoomInfo = document.createElement("div");
    DOMRoomInfo.setAttribute("style","height:100%;width:47%;margin:0 5px;padding:0;display:inline-block;vertical-align: top;background-color:rgba(0,0,0, 0.2);font-size:12px;overflow-y:auto;");
    DOMRoomInfo.id = "RTCRoomInfo";
    DOMRoomWrapper.appendChild(DOMRoomInfo);

    var DOMAutoMove = document.createElement("label");
    DOMAutoMove.setAttribute("style","float: right;display: none;");
    DOMAutoMove.innerHTML = `<input id="RTC_AutoMove" type="checkbox"`+(localStorage.getItem("RTC_AutoMove") == "true" ? "checked" : "")+`>譜面ページ自動遷移`;
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
    DOMplayModeMes.innerHTML = "プレイモード";
    DOMRoomInfo.appendChild(DOMplayModeMes);


    var DOMmovieTitleDiv = document.createElement("div");
    DOMmovieTitleDiv.id  = "RTCmovieTitleDiv";
    DOMmovieTitleDiv.setAttribute("style","margin:5px 5px;");
    DOMRoomInfo.appendChild(DOMmovieTitleDiv);

    var DOMmovieTitleMes = document.createElement("span");
    DOMmovieTitleMes.setAttribute("style","color:inherit;");
    DOMmovieTitleMes.innerHTML = "楽曲: "
    DOMmovieTitleDiv.appendChild(DOMmovieTitleMes);

    var DOMmovieTitleU = document.createElement("u");
    DOMmovieTitleDiv.appendChild(DOMmovieTitleU);

    var DOMmovieTitleA = document.createElement("a");
    DOMmovieTitleA.setAttribute("style","color:inherit;font-weight:600;");
    DOMmovieTitleA.id = "RTCRoomMovieTitle";
    DOMmovieTitleU.appendChild(DOMmovieTitleA);


    var DOMselectingMes = document.createElement("span");
    DOMselectingMes.innerHTML = "ルームマスターがプレイする曲を選択中です。 ";
    DOMselectingMes.id = "RTCMovleSelectingMes";
    DOMRoomIdleScene.classList.add('is-hide');
    DOMmovieTitleDiv.appendChild(DOMselectingMes);

    var DOMselectingMesRM = document.createElement("span");
    DOMselectingMesRM.innerHTML = "プレイする曲を選択してください。 ";
    DOMselectingMesRM.id = "RTCMovleSelectingMesRM";
    DOMselectingMesRM.classList.add('is-hide');
    DOMmovieTitleDiv.appendChild(DOMselectingMesRM);


    var DOMplaySpeedDiv = document.createElement("div");
    DOMplaySpeedDiv.setAttribute("style","margin:5px 5px;");
    DOMRoomInfo.appendChild(DOMplaySpeedDiv);

    var DOMplaySpeedMes = document.createElement("span");
    DOMplaySpeedMes.innerHTML = "プレイ速度: "
    DOMplaySpeedDiv.appendChild(DOMplaySpeedMes);

    var DOMbtSpeedlt = document.createElement("a");
	if(typeof title_speed != "number"){
    DOMbtSpeedlt.addEventListener("click", onClickPlaySpeedlt);
}
    DOMbtSpeedlt.innerHTML = " - ";
    DOMbtSpeedlt.setAttribute("style","margin:5px 5px;");
    DOMbtSpeedlt.id = "RTCPlaybtSpeedlt";
    DOMbtSpeedlt.classList.add('is-hide');
    DOMbtSpeedlt.setAttribute("title","プレイ速度を遅くする");
    DOMplaySpeedDiv.appendChild(DOMbtSpeedlt);

    var DOMplaySpeedSpan = document.createElement("span");
    DOMplaySpeedSpan.id = "RTCPlaySpeedSpan";
    DOMplaySpeedSpan.innerHTML = typeof title_speed == "number" ? title_speed.toFixed(2)+"倍" : "1.00倍"
    DOMplaySpeedDiv.appendChild(DOMplaySpeedSpan);

    var DOMbtSpeedgt = document.createElement("a");
	if(typeof title_speed != "number"){
    DOMbtSpeedgt.addEventListener("click", onClickPlaySpeedgt);
	}
    DOMbtSpeedgt.innerHTML = " + ";
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
    DOMlabel1.innerHTML = "かな表示";
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
        RTCselectingMode = mode;
        WriteToCookie('cookieRTCselectingMode', 'roma1');
		var updates = {};
		updates['users/' + myID + '/status/InputMode'] = "ローマ字";
		firebase.database().ref().update(updates);
    });
    DOMRoomInfo.appendChild(DOMrb1);
	var updates = {};
	updates['users/' + myID + '/status/InputMode'] = "ローマ字";
	firebase.database().ref().update(updates);

    var DOMlabel2 = document.createElement("label");
    DOMlabel2.setAttribute("style","font-size:7px;margin:0 0 0 10px");
    DOMlabel2.setAttribute("for","rbModeRoma");
    DOMlabel2.innerHTML = "ローマ字表示";
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
        WriteToCookie('cookieRTCselectingMode', 'roma2');
		var updates = {};
		updates['users/' + myID + '/status/InputMode'] = "ローマ字";
		firebase.database().ref().update(updates);
    });
    DOMRoomInfo.appendChild(DOMrb2);


    var DOMlabel3 = document.createElement("label");
    DOMlabel3.setAttribute("style","font-size:7px;margin:0 0 0 10px");
    DOMlabel3.setAttribute("for","rbModeKanaInput");
    DOMlabel3.innerHTML = "かな入力";
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
        WriteToCookie('cookieRTCselectingMode', 'kana1');
		var updates = {};
		updates['users/' + myID + '/status/InputMode'] = "かな";
		firebase.database().ref().update(updates);
    });
    DOMRoomInfo.appendChild(DOMrb3);


    var DOMlabel4 = document.createElement("label");
    DOMlabel4.setAttribute("style","font-size:7px;margin:0 0 0 10px");
    DOMlabel4.setAttribute("for","rbModeFlickInput");
    DOMlabel4.innerHTML = "フリック入力";
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
        WriteToCookie('cookieRTCselectingMode', 'kana2');
		var updates = {};
		updates['users/' + myID + '/status/InputMode'] = "フリック";
		firebase.database().ref().update(updates);
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
    DOMbuttonExit.addEventListener("click", function(){
            ExitRoom();
    });
    DOMdiv2.appendChild(DOMbuttonExit);


	if(!localStorage.getItem("RTCpreview")){
		localStorage.setItem("RTCpreview", "false")
	}
    var DOMbuttonPreview = document.createElement("span");
    DOMbuttonPreview.setAttribute("style","display: flex;justify-content: flex-end;    position: relative;top: -10px;");
	DOMbuttonPreview.innerHTML = `<label><input type="checkbox" value="RTC_Scroll" `+(localStorage.getItem("RTC_Scroll")=="false" ? "":"checked")+`>自動スクロール</label>　<label><input type="checkbox" value="nowplay_preview" `+(localStorage.getItem("RTCpreview")=="false"?"":"checked")+`>プレビュー再生</label>`

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
    DOMp2.innerHTML = "　";
    DOMWrapper.appendChild(DOMp2);
}

var isChatOpen;
/**
*チャットエリア作成
*/
function CreateChatArea(){

    isChatOpen = ReadFromCookie('cookieRTCisChatOpen');
    if(isChatOpen == ''){
        isChatOpen = 'true';
        WriteToCookie('cookieRTCisChatOpen', 'true');
    }

    var DOMChatDiv = document.createElement("div");
    DOMChatDiv.classList.add("chatArea");
    DOMChatDiv.setAttribute("style","height:232px;display:inline-block;vertical-align: top;");
    //DOMContainer.appendChild(DOMChatDiv)
    document.getElementsByClassName('main')[0].appendChild(DOMChatDiv);
    if(isChatOpen == 'false'){
        $('.chatArea').animate({height: 'hide',opacity:'hide'}, 0)
    }else{
        DOMChatDiv.focus();
    }


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
    DOMlabelWorldChat.innerHTML = "全体チャット";
    DOMChatModeDiv.appendChild(DOMlabelWorldChat);

    var DOMrbWorldChat = document.createElement("input");
    DOMrbWorldChat.id = "rbWorldChat";
    DOMrbWorldChat.setAttribute("type","radio");
    DOMrbWorldChat.setAttribute("name","rbChatMode");
    DOMrbWorldChat.setAttribute("checked","checked");
    DOMrbWorldChat.setAttribute("value","world");
    DOMrbWorldChat.addEventListener("change", function(){
        isRoomChat = false;
        document.getElementById("RTCChat").classList.remove("is-hide");
        document.getElementById("RTCRoomChat").classList.add("is-hide");
    });
    DOMChatModeDiv.appendChild(DOMrbWorldChat);

    var DOMlabelRoomChat = document.createElement("label");
    DOMlabelRoomChat.setAttribute("style","font-size:7px;margin:0");
    DOMlabelRoomChat.setAttribute("for","rbRoomChat");
    DOMlabelRoomChat.innerHTML = "ルームチャット";
    DOMChatModeDiv.appendChild(DOMlabelRoomChat);

    var DOMrbRoomChat = document.createElement("input");
    DOMrbRoomChat.id = "rbRoomChat";
    DOMrbRoomChat.setAttribute("type","radio");
    DOMrbRoomChat.setAttribute("style","font-size:10px;");
    DOMrbRoomChat.setAttribute("name","rbChatMode");
    DOMrbRoomChat.setAttribute("value","room");
    DOMrbRoomChat.addEventListener("change", function(){
        isRoomChat = true;
        document.getElementById("RTCChat").classList.add("is-hide");
        document.getElementById("RTCRoomChat").classList.remove("is-hide");
    });
    DOMChatModeDiv.appendChild(DOMrbRoomChat);


    var DOMp2 = document.createElement("span");
    DOMp2.setAttribute("style","font-size:12px;margin:0 20px;");
    DOMp2.innerHTML = "F4キーで表示非表示を切り替えられます。";
    DOMDiv.appendChild(DOMp2);

    var DOMChatUl = document.createElement("ul");
    DOMChatUl.id = "RTCChat";
    DOMChatUl.setAttribute("style","max-height:150px; height:150px;margin:0 0 5px 0; padding:0;background-color:rgba(0,0,0, 0.2);overflow-y:auto;font-size:10px;");
    DOMDiv.appendChild(DOMChatUl);


    var DOMRoomChatUl = document.createElement("ul");
    DOMRoomChatUl.id = "RTCRoomChat";
    DOMRoomChatUl.classList.add('is-hide');
    DOMRoomChatUl.setAttribute("style","max-height:150px; height:150px;margin:0 0 5px 0; padding:0;background-color:rgba(0,0,0, 0.2);overflow-y:auto;");
    DOMDiv.appendChild(DOMRoomChatUl);

    var DOMForm = document.createElement("div");
    DOMForm.setAttribute("style","margin:10px 0; padding:0;");
    DOMDiv.appendChild(DOMForm);

    DOMChatInput = document.createElement("input");
	DOMChatInput.id = "ChatInput"
    DOMChatInput.setAttribute("type","text");
    DOMChatInput.setAttribute("name","text");
    DOMChatInput.setAttribute("placeholder","メッセージをこちらに入力");
	DOMChatInput.setAttribute("autocomplete","off");
    DOMChatInput.setAttribute("style","width:80%;background-color:rgba(0,0,0, 0.2);border:none;color:white;");
    DOMChatInput.addEventListener("mouseenter",function(){
        DOMChatInput.setAttribute("style","width:80%;background-color:rgba(80,80,80, 0.5);border:none;color:white;");
    });
    DOMChatInput.addEventListener("mouseleave",function(){
        DOMChatInput.setAttribute("style","width:80%;background-color:rgba(0,0,0, 0.2);border:none;color:white;");
    });
    DOMForm.appendChild(DOMChatInput);

    var DOMChatSubmit = document.createElement("input");
    DOMChatSubmit.setAttribute("type","button");
    DOMChatSubmit.setAttribute("value","送信");
    DOMChatSubmit.setAttribute("style","width:20%;");
    DOMChatSubmit.addEventListener("click", SubmitMessage);
    DOMForm.appendChild(DOMChatSubmit);

    //コメント入力後Enterを押したら送信
    DOMChatInput.addEventListener("keydown" , function(event){
        if(!event.isComposing && event.code == "Enter" && document.getElementById("ChatInput").value){
            DOMChatSubmit.click();
			event.stopImmediatePropagation()
        }
	});
	document.addEventListener("click" , function(event){

		const focusing_area = event.target.type == "text" || event.target.type == "select-one" || document.activeElement.id == "RoomNameArea" ? true:false
		const selecting_input = String(document.getSelection()) && document.activeElement.type == "text" ? true:false
		if(!focusing_area && !selecting_input){
			$('.chatArea input[name="text"]:visible').focus();
		}
	});
	document.addEventListener("change" , function(event){
			$('.chatArea input[name="text"]:visible').focus();
	});
	//F4キークリックで表示非表示切り替え
	window.addEventListener("keydown" , function(event){
		if(event.code == "F4" && (playing == false || document.getElementsByClassName("RTCRoomPlayerName").length >= 2 && playing == true)){
			if(isChatOpen == 'true'){
				$('.chatArea').animate({height: 'hide',opacity:'hide'}, 'nomal')
				isChatOpen = 'false';
			}else{
				$('.chatArea').animate({height: 'show',opacity:'show'}, 'nomal')
				isChatOpen = 'true';
			}
			WriteToCookie('cookieRTCisChatOpen', isChatOpen);

			$('.chatArea input[name="text"]:visible').focus();
		}
	 },true);
	if(location.href.indexOf("https://typing-tube.net/movie/show/")>-1 && localStorage.getItem("RTC_Scroll") != "false"){
	window.scrollBy({
		top:CONTROLBOX_SELECTOR.getBoundingClientRect().bottom-document.documentElement.clientHeight+250
	})
	}
    //ページ読み込み時、チャットが表示されているならDOMChatInputに自動フォーカス by.Toshi
	$('.chatArea input[name="text"]:visible').focus();
    //F8キークリックで key/sec と key/minのトグル
     window.addEventListener("keydown" , function(event){
        if(event.code == "F8"){
            isDispFmtKeySec = !isDispFmtKeySec;
        }
    });
}



/**
*バージョンチェック
*/
function UpdateCheck(){
	firebase.database().ref('ImportantUpdate').once('value').then(Update => {
		if(Update.val() != null && Update.val() > ImportantVer){
			if(confirm(`RealTimeCombatting[Typing-Tube]: 重要な更新があります。お手数ですが、最新バージョンに更新してください。\n(OKを選択すると更新ページを開きます。)`)){
				window.location.href = "https://greasyfork.org/ja/scripts/391474-realtimecombatting-typing-tube/versions"
			}
		}
	});
	if(RTC_Switch){
		firebase.database().ref('Version').once('value').then(Version => {
			if(Version.val() != null && Version.val() != Ver){
				document.getElementById("RTCContainer").insertAdjacentHTML('afterend', `<a style="z-index:50;margin-left:5px;font-size:1.2rem;text-decoration:underline;" target="_blank" href="https://greasyfork.org/ja/scripts/391474-realtimecombatting-typing-tube/versions">RealTimeCombatting[Typing-Tube]: こちらから新しいバージョン (`+Version.val()+`) へ更新できます</a>`)
			}
		});
	}
}


/**
*@note 対戦用のインタラクティブエリア作成 ここまで---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////










/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note チャット関連 ここから ---
*/

var isRoomChat = false;
/**
*@Description チャット送信
*/
function SubmitMessage(){
    if(DOMChatInput.value.length == 0){
        return;
    }
    var messageRef;
    if(isRoomChat){
        messageRef = firebase.database().ref('rooms/' + roomID + '/chats').push();
    }else{
        messageRef = firebase.database().ref('chats').push();
    }
    messageRef.set({
            "userID": myID,
            "text" :DOMChatInput.value
        });
    DOMChatInput.value = "";
}

/**
*@Description チャット欄更新
*/
function onChatUpdate(snapshot){
    var msg = snapshot.val();

    if(roomID == null){
        playSE("chat");
    }

    var li = document.createElement("li");
    var name;
    var query = firebase.database().ref('users/' + msg.userID);
    query.once('value').then(player => {
       if(msg.userID == myID){
           name = player.val().name;
           li.innerHTML = "<span class='mine'>" + name +"</span> : <span>" + msg.text+ "</span>";
        }else if(player.val() != null){
           name = player.val().name;
           li.innerHTML = "<span>" + name +"</span> : <span>" + msg.text + "</span>";
        }else{
            li.innerHTML = "<span>undefined" +"</span> : <span>" + msg.text + "</span>";
        }
    });

    var target = document.getElementById("RTCChat");

    if(target.scrollTop + 10 >= target.scrollHeight - target.clientHeight){
        target.appendChild(li);
        target.scrollTop = target.scrollHeight - target.clientHeight;
    }else{
        target.appendChild(li);
    }
}

/**
*@Description チャット欄更新(roomChat)
*/
function onRoomChatUpdate(snapshot){
    var msg = snapshot.val();

    playSE("chat");
    var li = document.createElement("li");
    var name;
    var query = firebase.database().ref('users/' + msg.userID);
    query.once('value').then(player => {
       if(msg.userID == myID){
           name = player.val().name;
           li.innerHTML = "<span class='mine'>"  + name +"</span> : <span>" + msg.text+ "</span>";
        }else if(player.val() != null){
           name = player.val().name;
           li.innerHTML = "<span>" + name +"</span> : <span>" + msg.text + "</span>";
        }else{
            li.innerHTML = "<span>undefined" +"</span> : <span>" + msg.text + "</span>";
        }
    });

    var target = document.getElementById("RTCRoomChat");

    if(target.scrollTop + 10 >= target.scrollHeight - target.clientHeight){
        target.appendChild(li);
        target.scrollTop = target.scrollHeight - target.clientHeight;
    }else{
        target.appendChild(li);
    }
}


/**
*@note チャット関連 ここまで ---
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

var roomID;
var playSpeeds = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00];

/**
*@Description Roomが追加された
*/
function onAddRoom(snapShot){
    var msg = snapShot.val();

    var roomID = snapShot.ref_.path.pieces_[1];
    var roomName = msg.roomName;
    var desc = msg.description;
    var state = msg.state;
    var movieID = msg.movieID;
    var movieTitle = msg.movieTitle;
    var roomMaster = msg.roomMaster;
    var players = msg.users;
	var roomPassWord = msg.roomPassWord;
	if(First_Load_Room_Existence_flag){
		First_Load_Room_Existence_flag = false
document.getElementById("RTCRooms").insertAdjacentHTML('afterbegin', `<span style="font-size:14px;background: #000000dd;position: absolute;height: 201px;width:`+document.getElementById("RTCRooms").clientWidth+`px;" id="Room_Existence"><span style="
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    position: absolute;
    top: 48%;
    left: 50%;
">ルーム情報を確認中...</span></span>`)
	}
    //キックされた部屋なら表示しない
    if(msg.kick != null){
        if(msg.kick[myID] != undefined){
            return;
        }
    }

    var DOMroom = document.createElement("div");
    DOMroom.id = roomID;
    DOMroom.classList.add("RTCroom");

    DOMroom.setAttribute("style","width:45%;max-height:160px; height:160px;margin:5px;background-color:rgba(0,0,0, 0.2);display:inline-block;overflow-y:auto;");
    DOMroom.addEventListener("mouseenter",function(){
        DOMroom.setAttribute("style","width:45%;max-height:160px; height:160px;margin:5px;background-color:rgba(40,40,40, 0.5);display:inline-block;overflow-y:auto;");
    });
    DOMroom.addEventListener("mouseleave",function(){
        DOMroom.setAttribute("style","width:45%;max-height:160px; height:160px;margin:5px;background-color:rgba(0,0,0, 0.2);display:inline-block;overflow-y:auto;");
    });
    DOMroom.addEventListener("click",function(event){
        var roomID = event.currentTarget.id
	if(Latest_Ver != null && Latest_Ver != Ver){
		const Update_check = alert(`RealTimeCombatting[Typing-Tube]: 新しいバージョンが利用可能です。\n更新後、TypingTubeページをリロードすると最新Verが適用されます。`)
		return false;
	}
        if(event.currentTarget.closest(".RTCroom")){
			if(event.currentTarget.id.length == 14){
				EnterRoom(roomID);
			}else if(event.currentTarget.id.length == 15){
				const pass_form = window.prompt("このゲームに参加するにはパスワードが必要です")
				if(pass_form){
					firebase.database().ref('rooms/' + roomID).once('value').then(room => {
						if(room.val().roomPassWord == pass_form){
							EnterRoom(roomID);
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
    DOMName.innerHTML =roomName;
    DOMName.classList.add("RTCroomName");
    DOMroomTitle.appendChild(DOMName);

	if(roomPassWord){
		DOMName.insertAdjacentHTML('afterend', `<i class="fas fa-lock" style="margin: 6px 9px 0 5px;font-size: 1.5rem;"></i>`)
	}

    var DOMDesc = document.createElement("p");
    DOMDesc.setAttribute("style","font-size:10px;margin:2px 2px;");
    DOMDesc.innerHTML = desc;
    DOMDesc.classList.add("RTCroomDescription");
    DOMroom.appendChild(DOMDesc);

    var DOMstatus = document.createElement("p");
    DOMstatus.setAttribute("style","font-size:8px;margin:10px 2px;");
    DOMstatus.classList.add("RTCroomPlayStatus");

    if(state == "play"){
        DOMstatus.innerHTML = "プレイ中";
    }else if(state == "result"){
        DOMstatus.innerHTML = "プレイ終了";
    }else{
        DOMstatus.innerHTML = "プレイ前";
    }
    DOMroom.appendChild(DOMstatus);


    var DOMMovieTitle = document.createElement("p");
    DOMMovieTitle.setAttribute("style","font-size:8px;margin:2px 2px;");
    DOMMovieTitle.classList.add("RTCroomMovieTitle");
    DOMMovieTitle.innerHTML = "楽曲: [ID" + movieID + "]" + movieTitle;
    DOMroom.appendChild(DOMMovieTitle);

    var DOMplayers = document.createElement("p");
    DOMplayers.setAttribute("style","font-size:8px;margin:10px 2px; 2px");
    DOMplayers.innerHTML = "参加者: ";
    DOMplayers.classList.add("RTCroomPlayers");
    DOMroom.appendChild(DOMplayers);

    if(players != null){
        Object.keys(players).forEach(function(key) {
            DOMplayers.innerHTML += players[key] + " ";
        });
    }
    document.getElementById("noRoomMes").classList.add('is-hide');
}

/**
*@Description Room情報が変更された
*/
function onChangeRoom(snapshot){
    var msg = snapshot.val();
    var roomID = snapshot.ref_.path.pieces_[1];
    var roomName = msg.roomName;
    var desc = msg.description;
    var state = msg.state;
    var movieID = msg.movieID;
    var movieTitle = msg.movieTitle;
    var roomMaster = msg.roomMaster;
    var players = msg.users;
	var roomPassWord = msg.roomPassWord;
    //キックされた部屋なら表示しない
    if(msg.kick != null){
        if(msg.kick[myID] != undefined){
            return;
        }
    }

    document.getElementById(roomID).getElementsByClassName("RTCroomName")[0].innerHTML = roomName;

    document.getElementById(roomID).getElementsByClassName("RTCroomDescription")[0].innerHTML = desc;
    if(state == "play"){
        document.getElementById(roomID).getElementsByClassName("RTCroomPlayStatus")[0].innerHTML = "プレイ中";
    }else if(state == "result"){
        document.getElementById(roomID).getElementsByClassName("RTCroomPlayStatus")[0].innerHTML = "プレイ終了";
    }else{
        document.getElementById(roomID).getElementsByClassName("RTCroomPlayStatus")[0].innerHTML = "プレイ前";
    }
    document.getElementById(roomID).getElementsByClassName("RTCroomMovieTitle")[0].innerHTML= "楽曲: [ID" + movieID + "]" + movieTitle;
    document.getElementById(roomID).getElementsByClassName("RTCroomPlayers")[0].innerHTML = "参加者: ";

    if(players != null){
        Object.keys(players).forEach(function(key) {
            document.getElementById(roomID).getElementsByClassName("RTCroomPlayers")[0].innerHTML += players[key] + " ";
        });
    }
}

/**
*@Description Roomが削除された
*/
function onRemoveRoom(snapshot){
    var msg = snapshot.val();
    var roomID = snapshot.ref_.path.pieces_[1];

    document.getElementById(roomID).remove();
    if(document.getElementById("RTCRooms").getElementsByClassName("RTCroom").length === 0){
        document.getElementById("noRoomMes").classList.remove('is-hide');
    }
}

/**
*@Description [新しくルームを作成] ボタンが押された
*/
function onClickCreateNewRoom(){
	if(Latest_Ver != null && Latest_Ver != Ver){
		const Update_check = alert(`RealTimeCombatting[Typing-Tube]: 新しいバージョンが利用可能です。\n更新後、TypingTubeページをリロードすると最新Verが適用されます。`)
		return false;
	}
    playSE("click");
    document.getElementById("createNewRoom").classList.add('is-show');
}

/**
*@Description　32文字の一意な文字列を作成
*/
function getUniqueStr(){
    var strong = 1000;
    return new Date().getTime().toString(16) + Math.floor(strong*Math.random()).toString(16);
}

/**
*@Description [ルームを作成] ボタンが押された
*/
function onClickCreateRoom(){

	let roomPassWord = document.getElementById("Enable_PassWord").checked?document.getElementById("roomPassWordArea").value:""
    var roomId = getUniqueStr()
	if(roomId.length < 14){
		while(roomId.length != 14){
			roomId += "0"
		}
	}else if(roomId.length > 14){
		while(roomId.length != 14){
			roomId = roomId.slice(0,-1)
		}
	}
	if(roomPassWord){
		roomId = "P"+roomId
	}

	var description = document.getElementById("roomDescription").value;
    var _movieID = movieID;
    if(_movieID == null){
        _movieID =  " ";
    }
    var _movieTitle = movieTitle;
    if(_movieTitle == null){
        _movieTitle =  " ";
    }
    var roomMaster = myID;
    var roomName = document.getElementById("roomName").value;
    var state = "idle";



    var path = firebase.database().ref('rooms/' + roomId);
    path.set({
            "description": description,
            "movieID" :_movieID,
            "movieTitle": _movieTitle,
            "roomMaster": roomMaster,
            "roomName": roomName,
		    "roomPassWord": roomPassWord,
            "state": state,
        "playSpeed": 3,
		"playMode": "Score",
		"skipMode": "HOST",
		"AutoStart": false
        });

    document.getElementById("createNewRoom").classList.remove('is-show');
    EnterRoom(roomId);
}

/**
*@Description [キャンセル] ボタンが押された
*/
function onClickCancel(){
    playSE("cancel");
     document.getElementById("createNewRoom").classList.remove('is-show');
}

var isEnter;
/**
*@Description roomに入室した
*@param _roomID
*/
function EnterRoom(_roomID){

    playSE("greet");
    //初めの数秒は音を鳴らさない
    isSECancel = true;
    setTimeout(function(){
        isSECancel = false;
    }, 1500);
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
    firebase.database().ref('rooms/' + roomID).once('value').then(room => {
        //roomがない
        if(room.val() == null){
            ExitRoom();
        }else{
            //チャット先をルームチャットに変更
            isRoomChat = true;
            document.getElementById("rbRoomChat").checked = true;
            document.getElementById("RTCRoomChat").classList.remove("is-hide");
            document.getElementById("RTCChat").classList.add("is-hide");
            document.getElementById("RTCRoomName").innerHTML = "ルーム - <span id='RoomNameArea'>" + room.val().roomName + "</span>";
			if(_roomID.length == 15){
				document.getElementById("RoomNameArea").insertAdjacentHTML('afterend',`<i id="roomKey" class="fas fa-key" style="
                                                                                           margin-left: 15px;cursor:pointer;
                                                                                           "></i>`)
				document.getElementById("roomKey").addEventListener("click",getRoomKey)
			}

            var updates = {};
            updates['/users/' + myID + '/roomID'] = roomID;
            updates['/rooms/' + roomID + '/users/' + myID] = userName;
            //ルームマスターになったか
            if(room.val().roomMaster == myID){
                becomeRoomMaster();
            }else{
                becomeCommon();
            }
            firebase.database().ref().update(updates);


            document.getElementById("RTCRoomSelectScene").classList.add('is-hide');
            document.getElementById("RTCRoomIdleScene").classList.remove('is-hide');


            //room情報が更新された時用のイベントリスナー追加
            firebase.database().ref('/rooms/' + roomID).on('child_changed', onUpdateRoomInfo);
            firebase.database().ref('/rooms/' + roomID + '/users/').on('child_added', onAddRoomUser);
            firebase.database().ref('/rooms/' + roomID + '/users/').on('child_removed', onRemoveRoomUser);

            onUpdateRoomInfo();

            //ルームチャット切り替えようラジオボタンの表示
            document.getElementById("RTCchatModeDiv").classList.remove('is-hide');

            //ルームチャット欄自動更新
            var chats = firebase.database().ref('rooms/' + roomID + '/chats').limitToLast(10);
            chats.on('child_added', onRoomChatUpdate);

           //プレイ速度更新
			if( typeof title_speed != "number"){
				document.getElementById("RTCPlaySpeedSpan").innerHTML = playSpeeds[room.val().playSpeed].toFixed(2) + "倍速";
				play_speed = playSpeeds[room.val().playSpeed]
				speed = playSpeeds[room.val().playSpeed]
			}
			document.getElementById("combat_mode").value = room.val().playMode
			document.getElementById("skip_mode").value = room.val().skipMode

            //ボタン等表示
            if(!isRoomMaster){
                document.getElementById("RTCbtnReady").classList.remove("is-hide");
                document.getElementById("RTCbtnGameStart").classList.add("is-hide");
            }else{
                document.getElementById("RTCbtnReady").classList.add("is-hide");
                document.getElementById("RTCbtnGameStart").classList.remove("is-hide");
				if(movieID && !playing && isRoomMaster){
					window.addEventListener("keydown" , ready_key)
				}
            }
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
    var chats = firebase.database().ref('rooms/' + roomID + '/chats').limitToLast(10);
    chats.off('child_added', onRoomChatUpdate);

    //ルームチャットすべて削除
    var rc = document.getElementById("RTCRoomChat");
    while(rc.firstChild){
        rc.removeChild(rc.firstChild );
    }

    //ルームチャット切り替えようラジオボタンの非表示
    document.getElementById("rbWorldChat").checked = true;
    document.getElementById("RTCChat").classList.remove("is-hide");
    document.getElementById("RTCRoomChat").classList.add("is-hide");
    document.getElementById("RTCchatModeDiv").classList.add('is-hide');
    isRoomChat =false;

    //room情報が更新された時用のイベントリスナー削除
    firebase.database().ref('/rooms/' + roomID).off('child_changed', onUpdateRoomInfo);
    firebase.database().ref('/rooms/' + roomID + '/users/').off('child_added', onAddRoomUser);
    firebase.database().ref('/rooms/' + roomID + '/users/').off('child_removed', onRemoveRoomUser);
	window.removeEventListener("keydown" , ready_key)
    document.getElementById("RTCRoomSelectScene").classList.remove("is-hide");
    document.getElementById("RTCRoomIdleScene").classList.add('is-hide');

    firebase.database().ref('rooms/' + roomID + '/users/').once('value').then(users => {
        //もしroomに誰もいなければこのroomを削除
        if(users.val() === null || users.length === 0){
              firebase.database().ref("/rooms/" + roomID).set(null);
        }else{
            firebase.database().ref('rooms/' + roomID).once('value').then(rm => {
                //自分がルームマスターなら他の誰かにルームマスターを移動
                var newRoomMaster = {};
                var idx = 0;
                if(rm.val().roomMaster != null && rm.val().roomMaster  == myID){
                    newRoomMaster = {};
                    Object.keys(rm.val().users).forEach(function(key){
                         if(key != myID){
                            newRoomMaster[idx++] = key;
                        }
                    }, rm.val().users);

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
let AutoStart_Mode = false
function onUpdateRoomInfo(snapshot){
      firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		  var updates = {};
          //roomがない
          if(room.val() == null){
              ExitRoom();
          }else if (room.val().kick && room.val().users && room.val().kick[myID] && room.val().users[myID] == null && isEnter == true){
              //キックされた
              kicked();
            }else{
                //ルームリーダの移動
				if(isEnter){

					document.getElementById("RoomNameArea").textContent = room.val().roomName
					AutoStart_Mode = room.val().AutoStart
					if(room.val().state == "play" || room.val().state == "result"){
						let room_state = room.val().state
						const room_user_id = room.val().users
						firebase.database().ref('users').once('value').then(room_user => {
							for (let room_user_key in room_user_id) {
								if(eval("room_user.val()."+room_user_key+".state") == "play" || eval("room_user.val()."+room_user_key+".state") == "preStart" || Pre_flag || room_state == "result"){
									room_state = room.val().state
									break;
								}else{
									room_state = "idle"
								}
							}
							var updates = {};
							updates['/rooms/' + roomID + '/state'] = room_state;
							firebase.database().ref().update(updates);
						});
					}
                Object.keys(room.val().users).forEach(function(key){
                    if(key == room.val().roomMaster){
                        document.querySelector("#" + key + " > td.RTCRoomPlayerAuthority").innerHTML = "🚩";
                        //ルームマスターになったか
                        if(key == myID){
							document.getElementById("RTC_AutoMove").parentNode.classList.remove("display_AutoMove")
							if(prevState != "not_playable"){
								if(Object.keys(room.val().users).length >= 2){
									document.getElementById("RTC_AutoStart").parentNode.classList.add("display_AutoStart")
									if(room.val().AutoStart == true){
										document.getElementById("RTC_AutoStart").checked = true
									}
								}else if(prevState != "preStart"){
									document.getElementById("RTC_AutoStart").parentNode.classList.remove("display_AutoStart")
									document.getElementById("RTC_AutoStart").checked = false
									prevState = "idle"
									updates['users/' + myID + '/state'] = "idle";
									updates['rooms/' + roomID + '/AutoStart'] = false;
								}
							}
							becomeRoomMaster();
						}else{
							document.getElementById("RTC_AutoStart").parentNode.classList.remove("display_AutoStart")
							if(room.val().users && Object.keys(room.val().users).length >= 2){
								document.getElementById("RTC_AutoMove").parentNode.classList.add("display_AutoMove")
							}else{
								document.getElementById("RTC_AutoMove").parentNode.classList.remove("display_AutoMove")
							}
                            becomeCommon();
                        }
                    }else{
                        document.querySelector("#" + key + " > td.RTCRoomPlayerAuthority").innerHTML = "・";
                    }
                }, room.val().users);

				if(room.val().Winner){
						while(document.getElementsByClassName("Winner_Trophy").length){
							document.getElementsByClassName("Winner_Trophy")[0].remove()
						}
					Object.keys(room.val().Winner).forEach(function(winner_id){
						const Consecutive_wins = room.val().Winner[winner_id].length
						if(room.val().users[winner_id] != null && document.getElementById(winner_id) != null){
						document.getElementById(winner_id).getElementsByClassName("RTCRoomBtBan")[0].insertAdjacentHTML('afterend', `<span class="Winner_Trophy"><i class="fa fa-trophy" style="color:#FFD700"></i>`+ (Consecutive_wins > 1 ? "x"+Consecutive_wins : "")+"</span>")
						}
					})
				}
                //プレイ速度更新
				document.getElementById("RTCRoomPlayerCount").textContent = "参加者一覧 ("+Object.keys(room.val().users).length+"人)"
					if( typeof title_speed != "number"){
						document.getElementById("RTCPlaySpeedSpan").innerHTML = playSpeeds[room.val().playSpeed].toFixed(2) + "倍速";
						play_speed = playSpeeds[room.val().playSpeed]
						speed = playSpeeds[room.val().playSpeed]
					}
				document.getElementById("combat_mode").value = room.val().playMode
				document.getElementById("skip_mode").value = room.val().skipMode

					if(!playing && location.href.indexOf("https://typing-tube.net/movie/show/")>-1){
					map_info_generator()
					}
                document.getElementById("RTCmovieTitleDiv").classList.remove("is-DifferInMovieID");

                //Roomが選択中の楽曲を更新
                //Readyボタンの表示変更
                if(room.val().movieID == 0){
                    document.getElementById("RTCbtnReady").disabled = true;
					document.getElementById("RTCbtnReady").style.visibility = "hidden";
					document.getElementById("RTCbtnReady").setAttribute("title","");
					prevState = "idle"
					updates['users/' + myID + '/state'] = "idle";
                    document.getElementById("RTCRoomMovieTitle").innerHTML = "";
                    document.getElementById("RTCRoomMovieTitle").href = null;
                    if(!isRoomMaster){
                        document.getElementById("RTCMovleSelectingMes").classList.remove('is-hide');
                        document.getElementById("RTCMovleSelectingMesRM").classList.add('is-hide');
                        document.getElementById("RTCRoomMovieTitle").setAttribute("title","");
                    }else{
                        document.getElementById("RTCMovleSelectingMesRM").classList.remove('is-hide');
                        document.getElementById("RTCMovleSelectingMes").classList.add('is-hide');
                        document.getElementById("RTCRoomMovieTitle").setAttribute("title","");
                    }
                }else{
                    if(document.getElementById("RTCRoomMovieTitle").href != "https://typing-tube.net/movie/show/" + room.val().movieID){
                        playSE("cngSong");
						if(!playing && demo_play_flag && room.val().movieID != (location.pathname).replace(/[^0-9]/g, '')){
							player.pauseVideo()
							demo_play_flag = false
						}
					}
					document.getElementById("RTCRoomMovieTitle").innerHTML = "[ID" + room.val().movieID + "]" + room.val().movieTitle;
					document.getElementById("RTCRoomMovieTitle").href = "https://typing-tube.net/movie/show/" + room.val().movieID;
					document.getElementById("RTCMovleSelectingMes").classList.add('is-hide');
					document.getElementById("RTCMovleSelectingMesRM").classList.add('is-hide');
					if(!playing && localStorage.getItem("RTCpreview")=="true" && !demo_play_flag && room.val().movieID == (location.pathname).replace(/[^0-9]/g, '')){
						player.setVolume(volume*.7)
						player.seekTo(+BGM_time)
						player.playVideo()

						demo_play_flag = true
					}
					if(!isRoomMaster){
						if(movieID == room.val().movieID){
							document.getElementById("RTCbtnReady").disabled = false;
							document.getElementById("RTCbtnReady").style.visibility = "visible";
							document.getElementById("RTCbtnReady").setAttribute("title","");
							document.getElementById("RTCmovieTitleDiv").classList.remove("is-DifferInMovieID");
							document.getElementById("RTCRoomMovieTitle").setAttribute("title","準備が完了したら、準備完了ボタンを押してください。");
							if(!playing){
								window.addEventListener("keydown" , ready_key)
							}
						}else{
							document.getElementById("RTCbtnReady").disabled = true;
							document.getElementById("RTCbtnReady").style.visibility = "hidden";
							if(document.getElementById("RTC_AutoMove").checked && room.val().state == "idle"){
							window.location.href = document.getElementById("RTCRoomMovieTitle").href
							}
							document.getElementById("RTCbtnReady").setAttribute("title","ルームマスターが選択した曲と同じ曲を選択してください。");

                            document.getElementById("RTCmovieTitleDiv").classList.add("is-DifferInMovieID");
                            document.getElementById("RTCRoomMovieTitle").setAttribute("title","ルームマスターが選択した曲と違います。コチラをクリックして開きなおしてください。");
							window.removeEventListener("keydown" , ready_key)
							if(prevState == "ready"){
								prevState = "idle"
								updates['users/' + myID + '/state'] = "idle";
								document.getElementById("RTCbtnReady").setAttribute("value","準備完了");
							}
						}
					}else if(prevState == "idle" && AutoStart_Mode && room.val().state != "result"){
						prevState = "Auto_ready"
						updates['users/' + myID + '/state'] = "Auto_ready";
					}
				}
				}
				firebase.database().ref().update(updates);
			}
	  });
}

/**
*@Description roomに人が入室した
*/
function onAddRoomUser(snapshot){

    playSE("greet");
    var _userID = snapshot.ref_.path.pieces_[3];
    var _userName = snapshot.val();

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
    firebase.database().ref('rooms/' + roomID).once('value').then(room => {
        if(room.val().roomMaster == _userID){
            DOMisRM.innerHTML = "🚩";
        }else{
            DOMisRM.innerHTML = "・";
        }
    });
    DOMTr.appendChild(DOMisRM);

    var DOMname = document.createElement("td");
    DOMname.classList.add("RTCRoomPlayerName");
    DOMname.innerHTML = _userName;
    DOMTr.appendChild(DOMname);

    var DOMstatus = document.createElement("td");
    DOMstatus.classList.add("RTCRoomPlayerState");
    DOMstatus.setAttribute("style","width:75px;");
    firebase.database().ref('users/' + _userID).once('value').then(user => {
        switch(user.val().state){
            case "idle":
                DOMstatus.innerHTML = "準備中";
                break;
            case "ready":
            case "Auto_ready":
                DOMstatus.innerHTML = "準備完了";
                break;
            case "play":
            case "preStart":
                DOMstatus.innerHTML = "プレイ中";
                break;
            case "timeOut":
                DOMstatus.innerHTML = "タイムアウト";
                break;
            case "afk":
                DOMstatus.innerHTML = "afk";
                break;
            case "result":
            case "end":
                DOMstatus.innerHTML = "プレイ終了";
                break;
        }
    });
    DOMTr.appendChild(DOMstatus);

    var DOMbtChangeRM = document.createElement("a");
    DOMbtChangeRM.classList.add("RTCRoomBtChangeRM");
    DOMbtChangeRM.setAttribute("style","width:20px;font-size:8px");
    DOMbtChangeRM.setAttribute("title",_userName + " にルームマスター権限を渡す。");
    DOMbtChangeRM.addEventListener("click", onButtonChangeRM);
    DOMbtChangeRM.innerHTML = "↪🚩";
    DOMTr.appendChild(DOMbtChangeRM);

    var DOMbtBan = document.createElement("a");
    DOMbtBan.classList.add("RTCRoomBtBan");
    DOMbtBan.setAttribute("style","width:20px;font-size:12px");
    DOMbtBan.setAttribute("title",_userName + " をルームからキックする。");
    DOMbtBan.addEventListener("click", onButtonBan);
    DOMbtBan.innerHTML = "💣";
    DOMTr.appendChild(DOMbtBan);

     if(!isRoomMaster || _userID == myID){
        DOMbtChangeRM.classList.add("is-hide");
        DOMbtBan.classList.add("is-hide");
    }

    //このユーザにイベントリスナー追加
    firebase.database().ref('/users/' +_userID+'/state').on('value', onUpdateRoomUser);

}

/**
*@Description room人が退出した
*/
function onRemoveRoomUser(snapshot){
    var _userID = snapshot.ref_.path.pieces_[3];
    var _userName = snapshot.val();
	firebase.database().ref('/users/' +_userID+'/state').off('value', onUpdateRoomUser);
	var _roomPlayers = document.getElementsByClassName("RTCroomPlayer");
    document.getElementById(_userID).remove();

     //もし自分自身ならルーム参加者欄すべて削除
    if(_userID == myID){
for(let i=0;i<_roomPlayers.length;i++){
	firebase.database().ref('/users/' +_roomPlayers[i].id+'/state').off('value', onUpdateRoomUser);
	_roomPlayers[i].remove()
	i--
        }
	}else{
		firebase.database().ref('rooms/' + roomID).once('value').then(room => {
			const room_users = Object.keys(room.val().users)

			var AutoStart = true
			firebase.database().ref('users/').once('value').then(users => {
				room_users.some(function(key){
					if(users.val()[key].state != "ready" && users.val()[key].state != "Auto_ready"){
						AutoStart = false
					}
				});

				//ゲーム前準備処理
					if(AutoStart && isRoomMaster){
						var updates = {}
						prevState = "idle"
						updates['users/' + myID + '/state'] = "idle";
						firebase.database().ref().update(updates);
					}
			}, room.val().users);
		});
	}
}





/**
*@Description roomの選択譜面が変更された
*/
let ready_player = 0
let room_state_changed = false
function RoomStateChange(snapshot){
if(isEnter && snapshot.node_.value_ != movieID){
	let room_state_changed = true
    var updates = {};
	firebase.database().ref('rooms/' + roomID + '/movieID').off('value', RoomStateChange)
    updates['/rooms/' + roomID + '/state' ] = "idle";
    firebase.database().ref().update(updates);
}
}


/**
*@Description room内の人の情報が変更された
*/
var playing_interval
function onUpdateRoomUser(snapshot){
	const user = snapshot.ref_.path.pieces_[1];
	const state = snapshot.node_.value_
	switch(state){
		case "idle":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").innerHTML = "準備中";
			document.querySelector("#" + user + " > .RTCRoomPlayerAuthority").classList.remove("ready_background_color");
			document.querySelector("#" + user + " > .RTCRoomPlayerName").classList.remove("ready_background_color");
			document.querySelector("#" + user + " > .RTCRoomPlayerState").classList.remove("ready_background_color");
			break;
		case "ready":


				firebase.database().ref('rooms/' + roomID).once('value').then(room => {
					const room_users = Object.keys(room.val().users)
					if(room_users.length >= 2){
					document.querySelector("#" + user + " > .RTCRoomPlayerState").innerHTML = "準備完了";
					document.querySelector("#" + user + " > .RTCRoomPlayerAuthority").classList.add("ready_background_color");
					document.querySelector("#" + user + " > .RTCRoomPlayerName").classList.add("ready_background_color");
					document.querySelector("#" + user + " > .RTCRoomPlayerState").classList.add("ready_background_color");
					}
					var AutoStart = true
					firebase.database().ref('users/').once('value').then(users => {
						firebase.database().ref('Version').once('value').then(Version => {
							if(users.val()[user].ver == null || +Version.val().replace(/\D/g,"") > +users.val()[user].ver.replace(/\D/g,"")){
								var updates = {};
								updates['users/' + user + '/state'] = "OldVer";
								firebase.database().ref().update(updates);
								document.querySelector("#" + user + " > .RTCRoomPlayerAuthority").classList.remove("ready_background_color");
								document.querySelector("#" + user + " > .RTCRoomPlayerName").classList.remove("ready_background_color");
								document.querySelector("#" + user + " > .RTCRoomPlayerState").classList.remove("ready_background_color");
								return;
							}
							room_users.some(function(key){
								if(room.val().roomMaster == user && state == "ready"){
									AutoStart = true
									return true;
								}
								if(users.val()[key].state != "ready" && users.val()[key].state != "Auto_ready"){
									AutoStart = false
								}
							});
							if(!AutoStart){
								return;
							}

							//ゲーム前準備処理
							if(prevState == "ready" || prevState == "Auto_ready"){
								if(room_users.length >= 2){
									if(matchconfirm_sound){
										matchconfirm_sound_play()
									}
									document.getElementById("RTCbtnGameStart").disabled = true;
									document.getElementById("RTCbtnReady").disabled = true;
									document.getElementById("RTCbtnExit").disabled = true;
									window.removeEventListener("keydown" , ready_key)
									if(isRoomMaster){
										setTimeout(function(){
											if(prevState != "idle"){
												PreStartRM();
											}
										},1600)
									}
								}else{
									PreStartRM();
								}
							}
						}, room.val().users);
					});
				});
			break;
		case "Auto_ready":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").innerHTML = "準備完了";
			document.querySelector("#" + user + " > .RTCRoomPlayerAuthority").classList.add("ready_background_color");
			document.querySelector("#" + user + " > .RTCRoomPlayerName").classList.add("ready_background_color");
			document.querySelector("#" + user + " > .RTCRoomPlayerState").classList.add("ready_background_color");

				firebase.database().ref('rooms/' + roomID).once('value').then(room => {
					var AutoStart = true
					firebase.database().ref('users/').once('value').then(users => {
						Object.keys(room.val().users).some(function(key){
							if(users.val()[key].state != "ready" && users.val()[key].state != "Auto_ready"){
								AutoStart = false
							}
						});
						if(!AutoStart){
							return;
						}

						//ゲーム前準備処理
							if(Object.keys(room.val().users).length >= 2){
								if(matchconfirm_sound){
								matchconfirm_sound_play()
								}
							document.getElementById("RTCbtnGameStart").disabled = true;
							document.getElementById("RTCbtnReady").disabled = true;
							document.getElementById("RTCbtnExit").disabled = true;
							window.removeEventListener("keydown" , ready_key)
							if(isRoomMaster){
								setTimeout(function(){
									if(prevState != "idle"){
										PreStartRM();
									}
								},1600)
							}
							}else{
								PreStartRM();
							}
					}, room.val().users);
				});
			break;
		case "play":
			if(prevState == "preStart"){
				console.log("played")
				ready_player++
				document.querySelector("#__" + user + " > .RTCLine").classList.remove("ready_loading")
				if(Object.keys(Players_ID).length <= ready_player){
					playing = true
					prevState = "play"
					console.log(0)
					window.removeEventListener("keydown",preventScrollBySpacaKey)
					player.setVolume(volume)
					playing_interval = setInterval(function(){
						console.log(1)
						if(playing){
							player.pauseVideo();
							player.playVideo();
							clearInterval(playing_interval)
						}
					},10)
					document.getElementsByClassName("playarea")[0].classList.remove("is-hide");
					document.getElementsByClassName("status")[0].classList.remove("flex_100");
				}
			}
			document.querySelector("#" + user + " > .RTCRoomPlayerState").innerHTML = "プレイ中";
			document.querySelector("#" + user + " > .RTCRoomPlayerAuthority").classList.remove("ready_background_color");
			document.querySelector("#" + user + " > .RTCRoomPlayerName").classList.remove("ready_background_color");
			document.querySelector("#" + user + " > .RTCRoomPlayerState").classList.remove("ready_background_color");
			break;
		case "preStart":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").innerHTML = "プレイ中";
			if(user == myID && !playing){
				prevState = "preStart"
					//ゲーム前準備処理
				console.log("preStart")
					PreStart();
			}
			break;
		case "timeOut":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").innerHTML = "タイムアウト";
			if(user == myID){
				isWrittenAFKState = true
			}
			break;
		case "afk":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").innerHTML = "afk";
			if(user == myID){
				isWrittenAFKState = true
			}
			break;
		case "result":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").innerHTML = "プレイ終了";
			break;
		case "OldVer":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").innerHTML = "バージョン古";
			break;
		case "not_playable":
			document.querySelector("#" + user + " > .RTCRoomPlayerState").innerHTML = "再生不可";
			break;
	}
}


var isRoomMaster = false;

/**
*@Description ルームマスターになった。
*/
function becomeRoomMaster(){
	if(isRoomMaster){return;}
    isSECancel = true;
    setTimeout(function(){
        isSECancel = false;
    }, 1500);
	if(!isSECancel){
		matchconfirm_sound_play()
	}
    var updates = {};
	firebase.database().ref('rooms/' + roomID + '/movieID').on('value', RoomStateChange)
	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		if(room.val().movieID != movieID){
			updates['/rooms/' + roomID + '/movieID' ] = movieID;
			updates['/rooms/' + roomID + '/movieTitle' ] = movieTitle;
			firebase.database().ref().update(updates);
		}
	})

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

    isRoomMaster = true;
}

/**
*@Description ルームマスターではなくなった。
*/
function becomeCommon(){
    if(!isRoomMaster){return;}
	firebase.database().ref('rooms/' + roomID + '/movieID').off('value', RoomStateChange)
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
    document.getElementById("RTCbtnGameStart").classList.add("is-hide");

    isRoomMaster = false;
}

/**
*@Description ルームマスター権限を渡す ボタンが押された。
*/
function onButtonChangeRM(event){
    firebase.database().ref('rooms/' + roomID).once('value').then(room => {
        if(room.val().roomMaster == myID){
              firebase.database().ref('rooms/' + roomID + '/users/' + event.path[1].id).once('value').then(user => {
                  if (window.confirm("RealTimeCombatting:" + user.val() + " にルームマスター権限を渡します。よろしいですか？")) {
					  var updates = {};
					  prevState = "idle"
					  updates['users/' + myID + '/state'] = "idle";
                      updates['/rooms/' + roomID + '/roomMaster' ] =  event.path[1].id;
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
    firebase.database().ref('rooms/' + roomID).once('value').then(room => {
        if(room.val().roomMaster == myID){
            firebase.database().ref('rooms/' + roomID + '/users/' + event.path[1].id).once('value').then(user => {
				const kick_password = Math.floor( Math.random() * (999 + 1 - 100) ) + 100
const pass_form = window.prompt("RealTimeCombatting: " + user.val() + " さんをルームからキックします。\nよろしければ入力欄に　"+kick_password+"　を入力してください。")
                if (pass_form == kick_password) {
                    var updates = {};
                    updates['/rooms/' + roomID + '/users/' + event.path[1].id] = null;
					updates['/rooms/' + roomID + '/kick/' + event.path[1].id] =  event.path[1].id;
					updates['users/' + event.path[1].id + '/roomID'] = null;
                    firebase.database().ref().update(updates);
					window.alert("RealTimeCombatting: " + user.val() + " さんをルームからキックしました。")
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
	if(player_info.val().roomID != null){
		ForcePlayerDelete(playerID, player_info.val().roomID)
		return;
	}else{
		updates['/users/' + playerID] = null;
	}
	firebase.database().ref().update(updates);
})
    }else{
        firebase.database().ref('rooms/' + _roomID).once('value').then(room => {
			let room_user_array = room.val().users
			if(room_user_array){
				updates['/users/' + playerID] = null;
				delete room_user_array[playerID]
			}
            //最後の1人ならRoom削除
            if(!room_user_array || Object.keys(room_user_array).length == 0){
                updates['/rooms/' + _roomID] = null;
            }else if(room.val().roomMaster == myID){
                //ルームマスターならマスター権限の移動
                var masterID;
                Object.keys(room.val().users).forEach(function(id){
                    if(id != playerID){
                        masterID = id;
                    }
                });
                updates['/rooms/' + _roomID + '/roomMaster'] = masterID;
            }
			if(updates["/rooms/"+_roomID] === undefined){
			updates['/rooms/' + _roomID + '/users/' + playerID] = null;
			}
			firebase.database().ref().update(updates);
        });
    }
}


/**
*@Description キックされた
*/
function kicked(){
	//alert("RealTimeCombatting:" + document.getElementById("RTCRoomName").textContent + "からキックされました。以降入室することができません。");
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
function onClickBtnReady(event){
    firebase.database().ref('users/' + myID).once('value').then(user => {
		var updates = {};
		const now_date = new Date().getTime()
        if(user.val().state == "idle" && LocationDateTimeStamp){
			console.log(LocationDateTimeStamp)
			ReadyTimeStamp = new Date().getTime()
            playSE("enter");
			prevState = "ready"
            updates['users/' + myID + '/state'] = "ready";
            firebase.database().ref().update(updates);
            document.getElementById("RTCbtnReady").setAttribute("value","準備完了を解除");
        }else if(user.val().state != "OldVer" && user.val().state != "not_playable" && now_date-ReadyTimeStamp > 1000){
			playSE("cancel");
			prevState = "idle"
            updates['users/' + myID + '/state'] = "idle";
			firebase.database().ref().update(updates);
            document.getElementById("RTCbtnReady").setAttribute("value","準備完了");
        }
    });
}

/**
*@*(F5時)1分以上更新されていない部屋&人データを削除
*/


function deleteIdlePlayerAndRoom(){


	const TIME_FOR_DELETE = 60000;
    var nowTime = LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp)

    firebase.database().ref('users/').once('value').then(users => {
        firebase.database().ref('rooms/').once('value').then(rooms => {
			if(rooms.val() != null){ //ルーム有り

				//現在ログインしていない人と部屋の削除
				Object.keys(rooms.val()).forEach(function(roomID){
					var roomInfo = rooms.val()[roomID];

					//ユーザーが存在しない部屋を削除
					if(!roomInfo.users){
						ForcePlayerDelete(null ,roomID)
						return;
					}

					//部屋にユーザーがいた場合の処理
					Object.keys(roomInfo.users).forEach(function(userID){

						//部屋内のログアウトしているユーザーを削除
						if(users.val()[userID] == null){
							ForcePlayerDelete(userID, roomID);
							return;
						}

/**
 * 部屋内の1分以上タイムアウトしているユーザーを削除
 * @param PlayerTimeStamp {number} ユーザーのタイムスタンプ
 */
						//
						const PlayerTimeStamp = userID != myID ? users.val()[userID].DeletetimeStamp : LocationDateTimeStamp+(new Date().getTime()-LocalDateTimeStamp)

						if(nowTime > TIME_FOR_DELETE + PlayerTimeStamp){
							ForcePlayerDelete(userID, roomID);
						}
					});
				});
			}
			if(users.val() != null){
				//その他の人の削除
				Object.keys(users.val()).forEach(function(userID){
					const PlayerTimeStamp = users.val()[userID].DeletetimeStamp;
					if(!PlayerTimeStamp){
						var updates = {};
						updates['/users/' + userID + '/DeletetimeStamp'] = nowTime
						firebase.database().ref().update(updates);
					}
					if(nowTime > TIME_FOR_DELETE + PlayerTimeStamp){
						ForcePlayerDelete(userID);
					}
				});
			}
		});
	});
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
let Enter_flag = true
function onClickBtnGameStart(event){
	if(!LocationDateTimeStamp){
		Enter_flag = true
		return;
	}
    //room内の全員が準備完了かどうか確認
    firebase.database().ref('rooms/' + roomID).once('value').then(room => {
        firebase.database().ref('users/').once('value').then(users => {
			var isEveryoneReady = true;
            Object.keys(room.val().users).forEach(function(key){
                if(users.val()[key].state != "ready" && key != myID){
					isEveryoneReady = false;
				}
            });
            if(!isEveryoneReady){
              if (!window.confirm("RealTimeCombatting: ルーム内全員が準備完了ボタンを押していません。ゲームをスタートしてもよろしいですか？")) {
				  Enter_flag = true
                  return;
              }
            }
			var updates = {};
			prevState = "ready"
			updates['users/' + myID + '/state'] = "ready";
			firebase.database().ref().update(updates);
			window.removeEventListener("keydown" , ready_key)
        }, room.val().users);
    });

}

/**
*@note （ルームマスター）ゲーム開始ボタンを押した
*/
let Pre_flag = false
let combating_mode = "Score"
let Players_ID = {}
let RoomMaster_ID = ""
let ready_users=0
function PreStartRM(){
    //全員の状態をpreStartへ。
	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		firebase.database().ref('users/').once('value').then(users => {
			var updates = {};
			Object.keys(room.val().users).forEach(function(key){
				if(users.val()[key].state == "ready" || users.val()[key].state == "Auto_ready" || key == myID){
					ready_users++
					updates['users/' + key + '/state'] = "preStart";
				}
			}, room.val().users);
			updates['rooms/' + roomID + '/state'] = "play";
			const new_Date = new Date().getTime()
			updates['rooms/' + roomID + '/StartTime'] = LocationDateTimeStamp+(new_Date-LocalDateTimeStamp);
			Pre_flag = true
			firebase.database().ref().update(updates);
		});
    });
}
/**
*@note ゲーム開始準備処理
*/

let speed_background = "transparent"
let speed_color = "rgba(255,255,255,.85)"
let RTCGamePlayPlayersStatusTableSelector
let Skip_Mode = "HOST"
let FirstVideoLoadedCheck
let selected_play_mode

function PreStart(){

	feedout_volume = +localStorage.getItem("volume_storage")
    //プレイスピードをroomの設定に合わせる。
	if( typeof title_speed != "number"){
    firebase.database().ref('rooms/' + roomID).once('value').then(room => {
        player.setPlaybackRate( playSpeeds[room.val().playSpeed]);
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
	updates['/users/' + myID + '/status/ClearTime'] = null;
	firebase.database().ref().update(updates);
    //プレイステータスをすべて初期値に戻す
	updates = {};
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
	updates['/users/' + myID + '/status/SkipOptin'] = " ";
    updates['/users/' + myID + '/status/keySec'] = "0.00";
	updates['/users/' + myID + '/status/ClearTime/start'] = 0;

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
	}else if(selected_play_mode == "roma"){
		mode = 'roma';
		kana_mode = false;
		keyboard='normal';
	}else if(selected_play_mode == "kanaInput"){
		mode = 'kana';
		kana_mode = true;
		keyboard='normal';
	}else if(selected_play_mode == "flickInput"){
		mode = 'kana';
		kana_mode = true;
		keyboard='mac';
	}
	window.removeEventListener("keydown" , ready_key)
	player.setVolume(volume/7.5)

    //チャットを非表示にする
    $('.chatArea').animate({height: 'hide'}, 'slow');


	//対戦エリアの表示設定を呼び出し
	const ViewMode = localStorage.getItem("combat_ranking_ViewMode")
	if(ViewMode){
		combat_ranking_ViewMode = ViewMode
	}


if(ready_users >= 2 || !isRoomMaster){
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

	//ルーム情報更新イベント削除
	firebase.database().ref('/rooms/' + roomID).off('child_changed', onUpdateRoomInfo);
	//カウントダウン
	ClockCountDownFirst();

}

	//ステータス表示用のテーブルの作成
	var table = document.getElementById("RTCGamePlayPlayersStatusTable");
	while(table.firstChild){
		table.firstChild.remove();
	}
	//スペースキーによるscrollの無効化
	window.addEventListener("keydown",preventScrollBySpacaKey)
	//ルーム内ユーザーに対してイベントハンドラを追加
	firebase.database().ref('rooms/' + roomID).once('value').then(room => {
		RoomMaster_ID = room.val().roomMaster
		firebase.database().ref('users/').once('value').then(users => {
			Object.keys(room.val().users).forEach(function(key){
				if(users.val()[key].state == "preStart"){
					Players_ID[key] = users.val()[key].name
					firebase.database().ref('users/' + key + '/status').on('child_changed', onUpdateRoomUserInfo);
					firebase.database().ref('users/' + key + '/state').on('value', onUpdateRoomUserState)

					if(combating_mode == "Line"){
						ClearTime_addevent_target = firebase.database().ref('users/' + key + '/status/ClearTime');
						ClearTime_addevent_target.on('child_added', add_clear_time);
					}
				}

				if(document.getElementById("_" + key) != null){
					return;
				}

				if(users.val()[key].state == "preStart"){
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
                    DOMrank.innerHTML = "1位";
                    DOMtr.appendChild(DOMrank);

                    var DOMname = document.createElement("td");
                    DOMname.innerHTML = users.val()[key].name;
                    DOMname.setAttribute("rowspan","2");
                    DOMname.setAttribute("style","width:11%;");

                    DOMtr.appendChild(DOMname);


                    var DOMscore = document.createElement("td");
                    DOMscore .classList.add("RTCscore");
                    if(key == myID){
						DOMscore .classList.add("mine_score");
                    }
                    DOMscore.setAttribute("style","width:9%;");
					DOMscore.innerHTML = "0.00点"
                    var DOMclear = document.createElement("td");
                    DOMclear .classList.add("RTCclear");
                    DOMclear.setAttribute("style","width:9%;");
					if(combating_mode != "Line"){
						DOMtr.appendChild(DOMscore);
					}else{
						DOMclear.innerHTML = "0pt"
						DOMtr.appendChild(DOMclear);
					}
                    var DOMmiss = document.createElement("td");
                    DOMmiss.classList.add("RTCmiss");
                    DOMmiss.setAttribute("style","width:9%;");
                    DOMmiss.innerHTML = "0ミス";
                    DOMtr.appendChild(DOMmiss );

                    var DOMcombo = document.createElement("td");
                    DOMcombo.classList.add("RTCcomboArea");
                    DOMcombo.setAttribute("style","width:16%;");
                    DOMcombo.innerHTML = "<span class='RTCcombo'>0</span> / <span class='RTCmaxcombo'>0</span> コンボ";
                    DOMtr.appendChild(DOMcombo);

                    var DOMtype = document.createElement("td");
                    DOMtype.classList.add("RTCtype");
                    DOMtype.setAttribute("style","width:9%;");
                    DOMtype.innerHTML = "0打";
                    DOMtr.appendChild(DOMtype);

                    var DOMcorrect = document.createElement("td");
                    DOMcorrect .classList.add("RTCcorrect");
                    DOMcorrect.setAttribute("style","width:9%;");
                    DOMcorrect .innerHTML = "100%";
                    DOMtr.appendChild(DOMcorrect);
					if(combating_mode != "Line"){
						DOMclear.innerHTML = "0clear"
						DOMtr.appendChild(DOMclear);
					}else{
						DOMtr.appendChild(DOMscore);
					}
                    var DOMkeySec = document.createElement("td");
                    DOMkeySec .classList.add("RTCkeySec");
                    DOMkeySec.setAttribute("style","width:11%;");
                    DOMkeySec .innerHTML = "0.00key/sec";
                    DOMtr.appendChild(DOMkeySec);

                    var DOMTime = document.createElement("td");
                    DOMTime .classList.add("RTCtime");
                    DOMTime.setAttribute("style","width:12%;");
                    DOMTime .innerHTML = "0秒";
                    DOMtr.appendChild(DOMTime);


                     var DOMLinetr = document.createElement("tr");
                    DOMLinetr.id = "__" + key ;
                    if(key == myID){
                        DOMLinetr.classList.add("mine");
                    }
					if(key == RoomMaster_ID){
						DOMLinetr.classList.add("host");
					}
                    DOMLinetr.setAttribute("style","font-size:10px;font-weight:bold");
                    document.getElementById("RTCGamePlayPlayersStatusTable").appendChild(DOMLinetr);


                    var DOMLine = document.createElement("td");
                    DOMLine .classList.add("RTCLine","ready_loading");
                    if(key == myID){
						DOMscore .classList.add("mine_line");
					}
                    DOMLine.setAttribute("colspan","7");
                    DOMLine.setAttribute("style","max-width: 350px;white-space: nowrap;overflow:hidden;");
                    DOMLinetr.appendChild(DOMLine);

                    var DOMInputMode = document.createElement("td");
                    DOMInputMode .classList.add("InputMode");
                    DOMInputMode.innerHTML = users.val()[key].status.InputMode;
                    DOMInputMode.setAttribute("style","font-size:12px");
                    DOMLinetr.appendChild(DOMInputMode);

                    var DOMlineInput = document.createElement("span");
                    DOMlineInput .classList.add("RTClineInput");
                    DOMLine.appendChild(DOMlineInput);

                    var DOMlineRemain = document.createElement("span");
                    DOMlineRemain .classList.add("RTClineRemain");
                    DOMlineRemain .innerHTML = "　";
                    DOMLine.appendChild(DOMlineRemain);
                }

            }, room.val().users);
			RTCGamePlayPlayersStatusTableSelector = document.getElementById("RTCGamePlayPlayersStatusTable")
			if(ready_users == 1){
				//ソロプレイ時のカウントダウン
				ClockCountDownFirst();
			}
			document.getElementById("RTCGamePlayWrapper").scrollTo({
				top:999
			})
			if(localStorage.getItem("RTC_Scroll") != "false"){
				const gauge_height = (document.getElementById("gauge").clientHeight - (document.getElementById("gauge").clientHeight > 0 ? -20:0))
				const absolute_controlbox_point = window.pageYOffset+CONTROLBOX_SELECTOR.getBoundingClientRect().top-gauge_height-document.getElementsByTagName("header")[0].clientHeight
				const display_size_height = document.documentElement.clientHeight-document.getElementsByTagName("header")[0].clientHeight
				window.scrollTo({top: absolute_controlbox_point-(display_size_height > CONTROLBOX_SELECTOR.clientHeight+50 ? localStorage.getItem('scroll_adjustment1') : 0)})
			}
			ready_users = Object.keys(Players_ID).length
		});
	});
}

function preventScrollBySpacaKey(){
        if(event.code == "Space" && document.activeElement.tagName != "INPUT"){
           event.preventDefault();
        }
}

var isFirstClockCountDown =true;
var startTime; //ホストが開始ボタンを押したTimeStamp
var countDown = 3;
/**
*@note プレイ前カウントダウンはじめ
*/
function ClockCountDownFirst(){
        startTime = parseInt(new Date().getTime() +(ready_users >= 2 || !isRoomMaster ? 3000:0));
        countDown = 3;
	if(ready_users >= 2 || !isRoomMaster){
	CountDown_sound_play()
	}
	ClockCountDown();
}

/**
*@note プレイ前カウントダウン
*/
let feedout_volume = 0
let volume_feedout

function ClockCountDown(){
    var now =new Date().getTime()

    if(now < startTime){
       var  ct = Math.ceil(((startTime - now) * 0.001));
        if(ct == countDown){
			if(countDown == 2 && demo_play_flag){
				feedout_volume = +localStorage.getItem("volume_storage")/7.5
				volume_feedout = setInterval(function(){
					feedout_volume --
					player.setVolume(feedout_volume)
					if(feedout_volume < 0){
						demo_play_flag = false
						feedout_volume = +localStorage.getItem("volume_storage")/7.5
						player.pauseVideo()
						clearInterval(volume_feedout);}
				},75)
			}
            countDown--;
			if(countDown <= 2){
				CountDown_sound_play()
			}
        }
		document.getElementById("RTCRoomMes").style.display = "block"
        document.getElementById("RTCRoomMes").innerHTML = "開始まであと" + ct+ "秒です。";


        setTimeout(ClockCountDown, 100);
	}else{
		if(Object.keys(Players_ID).length >= 2){
			countDownEnd_sound_play()
		}
		document.getElementById("RTCRoomMes").style.display = "none"
		document.getElementById("RTCRoomMes").innerHTML = " ";
		const users = document.getElementById("RTCGamePlayPlayersStatusTable").children;
		document.getElementById("RTCGamePlayWrapper").scrollTo({
			top:combat_ranking_ViewMode == "Scroll" ? (document.getElementsByClassName("mine")[1].querySelector(".RTCrank").clientHeight*(([].slice.call( users ).indexOf(document.getElementsByClassName("mine")[1])/2)-6)):0,
		})
		if(combat_ranking_ViewMode == "none"){
			document.getElementById("RTCContainer").style.display = "none"
			document.querySelector('[class="wrapper row mt-5 w-80"]').parentNode.setAttribute("style","margin-top:250px!important;")
		}
		console.log(-1)
		player.playVideo()
		player.seekTo(0);

    }
}


var isDispFmtKeySec = true; //true:key/sec形式で表示 false key/min形式で表示
/**
*@note ルーム内ユーザーの状態が変更された。
*/
let rank = -5
let HostLineCount = 0

function onUpdateRoomUserState(snapshot){
	const uid = snapshot.ref_.path.pieces_[1];
	const Update_Info = snapshot.ref_.path.pieces_[3]

	if(RTCGamePlayPlayersStatusTableSelector == null){return;}
	const SnapShotValue = snapshot.val()
//	BubbleSort()
	if(SnapShotValue == "end"){
		delete Players_ID[uid]
	}else if(SnapShotValue == "result"){
		RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCtime").textContent = "プレイ終了";
		firebase.database().ref('users/' + uid + '/status').off('child_changed', onUpdateRoomUserInfo);
		firebase.database().ref('users/' + uid + '/state').off('value', onUpdateRoomUserState)
		delete Players_ID[uid]
	}else if(SnapShotValue != "play"){
		firebase.database().ref('rooms/' + roomID + '/state').once('value').then(room_state => {
			firebase.database().ref('users/' + uid + '/status').off('child_changed', onUpdateRoomUserInfo);
			firebase.database().ref('users/' + uid + '/state').off('value', onUpdateRoomUserState)
			delete Players_ID[uid]
			if(room_state.val() == "play"){
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineInput").textContent = " ";
				RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineRemain").textContent = "タイムアウトしました。";
			}else{
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCtime").textContent = "プレイ終了";
			}
		})
	}
if(Object.keys(Players_ID).length == 0 ){
	//勝者を記録
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
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCkeySec").textContent = SnapShotValue + 'key/sec';
			}else{
				RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCkeySec").textContent = Math.round(SnapShotValue * 60) + 'key/min';
			}
			break;
		case "lineInput":
			const RTCLineWidth = RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine")
			const LineInput = RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineInput")
			if(RTCLineWidth.scrollWidth > RTCLineWidth.clientWidth && RTCLineWidth.clientWidth / LineInput.offsetWidth < 2.5){
				RTCLineWidth.scrollLeft += document.querySelector("#__" + uid + " .RTClineRemain > span").offsetWidth
			}
			LineInput.innerHTML = SnapShotValue;
			if(!LineInput.textContent){
				RTCLineWidth.scrollLeft = 0
			}
			break;
		case "lineRemain":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineRemain").innerHTML = SnapShotValue;
			break;
		case "SkipOptin":
			if(typeof SnapShotValue === "number"){
			RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineRemain").insertAdjacentHTML('beforeend', "<span class='skip_opt_in' style='opacity: 0.4;'>"+(Skip_Mode == "HOST" && Players_ID[RoomMaster_ID] ? "":" skip⏩")+"</span>")
				const RTCLineWidth = RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine")
				RTCLineWidth.scrollLeft = RTCLineWidth.scrollWidth
			if(seeked_count != count && Object.keys(Players_ID).length <= document.getElementsByClassName("skip_opt_in").length){
				for(let i=0;i<document.getElementsByClassName("skip_opt_in").length;i++){
					document.getElementsByClassName("skip_opt_in")[i].style.display = "none"
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
			RTCGamePlayPlayersStatusTableSelector.querySelector("#__" + uid + " > .RTCLine > .RTClineRemain").innerHTML = "";
			}
			break;
		case "miss":
			RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + uid + " > .RTCmiss").textContent = SnapShotValue +"ミス";
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

var waitForSync = false;

/**
*@note lineが更新された ---
*/
function onLineUpdate(){
    clockSyncPlayer();
}


/**
*@note player line初めの同期処理 ---
*/
function clockSyncPlayer(){

    //もし、再生時間の一番遅い人に比べてTIME_ALLOWANCE以上進んでいたら待機
    var playerTimeMin = Number.MAX_VALUE;
    var myPlayerTime;
    var TIME_ALLOWANCE = 1.20;

    var now = new Date().getTime();
    var playerTimeStamps = {};
    var TIMEOUT_DIFF = 3000;

    firebase.database().ref('rooms/' + roomID).once('value').then(room => {
        firebase.database().ref('users/').once('value').then(users => {
            Object.keys(room.val().users).forEach(function(key){
                if(users.val()[key].state == "play"){
                    if(playerTimeMin > parseFloat(users.val()[key].status.moviePos)){
                        playerTimeMin = parseFloat(users.val()[key].status.moviePos);
                    }
                    playerTimeStamps[key] = users.val()[key].timeStamp;
                }
                else if(users.val()[key].state == "timeOut"){
                    document.querySelector("#__" + key + " > .RTCLine > .RTClineInput").innerHTML = " ";
                    document.querySelector("#__" + key + " > .RTCLine > .RTClineRemain").innerHTML = "タイムアウトしました。";
                }
            }, room.val().users);
            myPlayerTime = users.val()[myID].status.moviePos;

            //もしタイムアウトしている人がいれば、その人の状態をtimeOutへ
            Object.keys(playerTimeStamps).forEach(function(key){
                if(playerTimeStamps[key] < now -  TIMEOUT_DIFF){
//                     var updates = {};
//                     updates['/users/' + key + '/state'] = "timeOut";
//                     //もしその人がルームマスターなら自分がルームマスターになる。
//                     if(room.roomMaster == key){
//                      updates['/rooms/' + roomID + '/roomMaster'] = myID;
//                     }
//                     firebase.database().ref().update(updates);

//                     document.querySelector("#__" + key + " > .RTCLine > .RTClineInput").innerHTML = " ";
//                     document.querySelector("#__" + key + " > .RTCLine > .RTClineRemain").innerHTML = "タイムアウトしました。";
                }
            });

            if(myPlayerTime > parseFloat(TIME_ALLOWANCE) + playerTimeMin){
                waitForSync = true;
                player.pauseVideo();
                setTimeout(() => {
                    clockSyncPlayer();
                }, 10);
            }else{
                 waitForSync = false;
            }
        });
    });

}

/**
*@note ゲーム終了
*/
function endGames(){
	document.getElementById("RTCRoomMes").style.display = "block"
    document.getElementById("RTCRoomMes").innerHTML = "お疲れさまでした。続けて対戦する場合は更新ボダン(F5)を押してください。";
    firebase.database().ref('/rooms/' + roomID).on('child_changed', onUpdateRoomInfo);

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
function playSE(SEname){
    if(isSECancel){return;}
    var se = new Audio();
    se.volume = (localStorage.getItem("volume_storage")/100)*(SEname == "greet"?0.5:1)
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

function CountDown_sound_play(){
	let CountDown_sound_gain = CountDown_sound.createGain();
	let CountDown_sound_source = CountDown_sound.createBufferSource();
	CountDown_sound_source.buffer = audio_buffer_CountDown_sound;
	CountDown_sound_source.connect(CountDown_sound_gain);
	CountDown_sound_gain.connect(CountDown_sound.destination);
	CountDown_sound_gain.gain.value = (localStorage.getItem("volume_storage")/100)
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

function countDownEnd_sound_play(){
	let countDownEnd_sound_gain = countDownEnd_sound.createGain();
	let countDownEnd_sound_source = countDownEnd_sound.createBufferSource();
	countDownEnd_sound_source.buffer = audio_buffer_countDownEnd_sound;
	countDownEnd_sound_source.connect(countDownEnd_sound_gain);
	countDownEnd_sound_gain.connect(countDownEnd_sound.destination);
	countDownEnd_sound_gain.gain.value = (localStorage.getItem("volume_storage")/100)
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

function matchconfirm_sound_play(){
	let matchconfirm_sound_gain = matchconfirm_sound.createGain();
	let matchconfirm_sound_source = matchconfirm_sound.createBufferSource();
	matchconfirm_sound_source.buffer = audio_buffer_matchconfirm_sound;
	matchconfirm_sound_source.connect(matchconfirm_sound_gain);
	matchconfirm_sound_gain.connect(matchconfirm_sound.destination);
	matchconfirm_sound_gain.gain.value = (localStorage.getItem("volume_storage")/100)*0.4
	matchconfirm_sound_source.start(0);
}
/**
*@note SE関連 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////











/////////////////////////////////////////////////////////////////////////////////////////////////
/**
* Toshi added code ここから  ---
* @note onPlayerStateChange; getScorePerChar;は既存関数書き換え
*/


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
if(PassWord_Key != null && PassWord_Key.length > 1) {
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
	let event_target_id = event.target.innerText.replace(/\n/,"")
	event.target.textContent = event_target_id
if(event_target_id.length > 19){
event_target_id = event_target_id.slice(0,window.getSelection().focusOffset-1)+event_target_id.slice(window.getSelection().focusOffset)
document.getElementById("RoomNameArea").innerText = event_target_id
}
	var updates = {};
	updates['rooms/' + roomID + "/roomName"] = event_target_id;
	firebase.database().ref().update(updates);
}


        //ルームマスターの時はゲーム開始、非ルームマスターのときは準備完了ショートカットキー[Enter]

function ready_key(event){
	if(event.key == "Enter" && document.getElementById("RTCbtnGameStart") != null && document.getElementById("RTCbtnGameStart").disabled == false && isEnter && (document.activeElement.tagName != "INPUT" || document.activeElement.id == "ChatInput" && !document.getElementById("ChatInput").value)){
		if(isRoomMaster && Enter_flag){
			onClickBtnGameStart(event)
		}else{
			onClickBtnReady(event)
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
						if(room_user_key != event_target_id && eval("room_user.val()."+room_user_key+".status.ClearTime")[line_number]){
							if(eval("room_user.val()."+room_user_key+".status.ClearTime")[line_number] > line_clear_time){
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
						RTCGamePlayPlayersStatusTableSelector.querySelector("#_" + room_user_key + " > .RTCclear").textContent = Object.keys(eval("room_user_update.val()."+room_user_key+".status.ClearTime")).length-1+"pt";
					}
				});
				})
}





/**
*Toshi added code　ここまで  ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////





















/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*Toshi added code　プレイ中の処理を対戦用に変更 ここから  ---
*@note 以下の範囲のコードは対戦ON時のみ有効
*/

let last_combo_score = 0
let combat_ranking_ViewMode = "Scroll"
let status_updates = {}
let score_flag = false



/**
*Toshi added code　プレイ中の処理 ここまで  ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////