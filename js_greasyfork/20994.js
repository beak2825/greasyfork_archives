// ==UserScript==
// @name        3gokushi_A.Troop_in_JST
// @namespace   http://mixi.jp/
// @description 日本標準時間で予約して自動出兵させる
// @include     http://*.3gokushi.jp/facility/*
// @version     2016.06.28
// @grant		GM_addStyle
// @grant		GM_deleteValue
// @grant		GM_getValue
// @grant		GM_listValues
// @grant		GM_log
// @grant		GM_setValue
// @grant		GM_xmlhttpRequest
// @grant		GM_getResourceURL
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
//
//
//
// @downloadURL https://update.greasyfork.org/scripts/20994/3gokushi_ATroop_in_JST.user.js
// @updateURL https://update.greasyfork.org/scripts/20994/3gokushi_ATroop_in_JST.meta.js
// ==/UserScript==
var JST_H = -1;
var JST_M = -1;
var JST_S = -1;
var JST_MS = 0;
var BTN_TOP;
// JSTの表示
function disp_jsttime2(){
	var LEAP, NEXT, SL;
	var TZoffset, LocalClock, Start, Timer2;
	var Offset, Offset0, Offset1;

	var JSToffset = 9 * 3600000;  // JST = UTC + 9H
	var Nservers = 0, Prev = 99, Loopcount = 20;
	var Jdisable = 0, Interval = 100;  // Refresh every 100ms

	var Server = new Array();
	var Lang = "J";

	var msg = {
		E: [	"<h1>No response from time servers.<\/h1><h2>Please reload after a while.<\/h2>",
			"<h1>Some of time servers didn\'t respond.<\/h1><h2>Displayed time can be incorrect.<\/h2>",
			" correct.",
			" second(s) fast.",
			" second(s) slow." ],
		J: [	"<h1>サーバからの時刻取得に失敗しました。<\/h1><h2>少し時間がたってから再読み込みしてください。<\/h2>",
			"<h2>一部のサーバからの時刻取得に失敗しました。<\/h2><h2>不正確な時刻が表示されている可能性があります。<\/h2>",
			"合っています",
			" 秒 進んでいます",
			" 秒 遅れています" ]
	};
	function jsont(json){
		if( Jdisable ) return;
		var now = new Date();
		if( json["st"] == null || json["it"] == null ) return;
		if( json["leap"] == null || json["next"] == null ) return;
		json["rt"] = now.getTime() / 1000;  // Record Receive time
		Server.push( json );
	}
	function addscript(url) {  // Dynamic loading of JSONP script
		var now = new Date();  // Record Initiation time
		var script	 = document.createElement('script'); 
		script.type	= 'text/javascript'; 
		script.charset = 'UTF-8';
		script.src	 = url + "?" + ( now.getTime() / 1000 );
		Nservers++;  // Number of servers
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	function stopclock() {
		if ( Timer2 != null ) clearInterval(Timer2);
	}

	function errmsg(msgnum) {
		var msgbox;
		msgbox = document.getElementById( "ServerStat" );
		if ( null != msgbox )  msgbox.innerHTML = msg[Lang][msgnum];
	}

	function showmsg() {
		var msgbox, msg;
		msg  = '<center><h3>時刻取得結果<\/h3><\/center>';
		if( Server.length > 0 ) {
			msg += 'server0: ' + Server[0]["id"] + ' , RTT = ';
			msg += Math.floor( 1000 * (Server[0]["rt"] - Server[0]["it"]) );
			msg += ' ms , (PC Clock - JST) = ' + Math.floor( - Offset0 ) + ' ms<br>';
		}
		else msg += 'server0: unavailable<br>';

		if( Server.length > 1 ) {
			msg += 'server1: ' + Server[1]["id"] + ' , RTT = ';
			msg += Math.floor( 1000 * (Server[1]["rt"] - Server[1]["it"]) );
			msg += ' ms , (PC Clock - JST) = ' + Math.floor( - Offset1 ) + ' ms<br>';
		}
		else msg += 'server1: unavailable<br>';

		msg += "取得した時刻の誤差は、上記 RTT ＋ 処理系の誤差（通常 30ms 程度）に収まると考えられます。<br>"

		msgbox = document.getElementById( "ServerStat" );
		if ( null != msgbox ) msgbox.innerHTML = msg;
	}
	function ToDateStr(t, flg){
		var h, m, s, ms, YY, MM, DD;
		// 時
		h = t.getUTCHours();
		JST_H = h;
		if (h < 10) h = "0" + h;
		// 分
		m = t.getUTCMinutes();
		JST_M = m;
		if (m < 10) m = "0" + m;
		// 秒
		s = t.getUTCSeconds();
		if ( flg != 0 ) s = 60;
		JST_S = s;
		if (s < 10) s = "0" + s;
		// ミリ秒
		ms = t.getUTCMilliseconds();
		JST_MS = ms;
		
		YY = t.getUTCFullYear();
		MM = t.getUTCMonth() + 1;if (MM < 10) MM = "0" + MM;
		DD = t.getUTCDate();	 if (DD < 10) DD = "0" + DD;
		//return (MM + "/" + DD + "  " + h + ":" + m + ":" + s);
		return (h + ":" + m + ":" + s);
	}	
	function showtime(){
		var now, flg, temp, sec, utcms, utcsec;
		var JST, UTC, TAI, LOC, CMP, CL;
		now = new Date();
		utcms = now.getTime() + Offset + Interval / 2;
		utcsec = Math.floor( utcms / 1000 );
		CL = LEAP;
		if ( utcsec >= NEXT ) CL = CL + 1;	// Current TAI - UTC
		temp = utcms - ( CL - SL ) * 1000;
		flg = 0;
		if ( utcsec == NEXT ) flg = 1;
		JST = new Date( temp + JSToffset );
		j$("#JST").html(ToDateStr(JST, flg));
	}
	
	jQuery.noConflict();
	var j$ = jQuery;
	j$("<div id=clock>JST <span id=JST></div>").appendTo("#container");
	j$("#clock")
	  .css("font-size", "13pt")
	  .css("bottom", "0px")
		.css("left", "492px")
		.css("width", "150px")
		.css("height", "28px")	// 高さを0にすると背景が透過になる
		.css("position", "absolute")
		.css("background-color", "#FFDE49")
		.css("color", "#000000")
		.css("opacity", "1.0");

	unsafeWindow.showtime = showtime;
	unsafeWindow.jsont = jsont;
	exportFunction(showtime, unsafeWindow, {defineAs: "showtime"});
	exportFunction(jsont, unsafeWindow, {defineAs: "jsont"});

	startclock();
	function startclock(l) {
		if ( l == "E" ) Lang = "E";
		addscript( "http://ntp-a1.nict.go.jp/cgi-bin/jsont" );
		startc();
	}
	function startc() {
		if ( ( Server.length < Nservers ) && ( Loopcount-- > 0 ) ) {
			setTimeout(startc,100);
			return;
		}
		Jdisable = 1; // No more return packets will be processed
		if ( Server.length == 0 ) {
			errmsg( 0 );
			return;
		}
		Offset0 = 1000 * Server[0]["st"] - 500 * Server[0]["it"] - 500 * Server[0]["rt"];
		Offset = Offset0;
		if ( Server.length >= 2 ) {
			Offset1 = 1000 * Server[1]["st"] - 500 * Server[1]["it"] - 500 * Server[1]["rt"];
			if( Math.abs( Offset0 - Offset1 ) < 200 ) {
				Offset = ( Offset0 + Offset1 ) / 2;
			} else {
				Server.pop();
			}
		}
		if ( Server.length == 1 ) errmsg( 1 );
		LEAP = Server[0]["leap"];  // Total leap seconds before NEXT Leap
		NEXT = Server[0]["next"];  // Next Leap (UNIX TIME)
		LocalClock = new Date();
		Start = Math.floor( ( Offset + LocalClock.getTime() ) / 1000 );
		TZoffset = LocalClock.getTimezoneOffset() * 60000;
		if (TZoffset > 12 * 3600000) TZoffset -= ( 24 * 3600000 );
		SL = LEAP;
		if ( Start >= NEXT ) SL = SL + 1;	// TAI - UTC at startup
		Timer2 = setInterval(showtime, Interval);
	}
}
// 予約部分の表示
window.executeTroop = function ()
{
  var btn = window.document.getElementById('btn_send');
	//alert("MilliSecond:" + JST_S + "." + JST_MS);// *************************************
  btn.click();
}
window.displayTroop = function ()
{
  var obj = window.document.getElementById('gray02Wrapper');
  var html = '';
  html += '<input id="autoTroop_CHECK" type="checkbox" value="on">  ';// ***
  html += '時間設定　';;
  html += '<strong>  【出兵予約】</strong> ';
  html += '<select id="autoTroop_HH"><option value="-1">--</option>';
  for (var i = 0; i < 24; i++) {
    html += '<option value="' + i + '">' + i + '</option>';
  }
  html += '</select>';
  html += '時';
  html += '<select id="autoTroop_MM"><option value="-1">--</option>';
  for (var i = 0; i < 60; i++) {
    html += '<option value="' + i + '">' + i + '</option>';
  }
  html += '</select>';
  html += '分';
  // 秒の指定
  html += '<select id="autoTroop_SS"><option value="-1">--</option>';
  for (var i = 0; i < 60; i++) {
    html += '<option value="' + i + '">' + i + '</option>';
  }
  html += '</select>';
  html += '秒';
	html += 'に自動的に出兵ボタンを押します';// ***
  //html += '<span id="autoTroop_hms" style="">に自動的に出兵ボタンを押します(最終チェック--時--分)</span>';
	html += '<span id="autoTroop_hms" style="">(最終チェック--時--分)</span>';// ***
  obj.innerHTML += '<div style="text-align:center; border:3px #660 solid;padding:6px;-moz-border-radius: 10px;-webkit-border-radius: 10px;border-radius: 10px;">' + html + '</div>';
  // 0.1秒間隔でチェックする
  window.setInterval(function () {
    checkTroopTime()
  }, 0.1 * 1000);
}
window.checkTroopTime = function ()
{
	var h = window.document.getElementById('autoTroop_HH').value;
	var m = window.document.getElementById('autoTroop_MM').value;
	var s = window.document.getElementById('autoTroop_SS').value;
	var check_flg = window.document.getElementById('autoTroop_CHECK').checked;
	//var ms500 = JST_MS % 500;
	if (check_flg == true && h != '--' && m != '--' && s != '--') {
		if (h == JST_H && m == JST_M && s == JST_S) {
			//alert(now_h + '時' + now_m + '分)' + now_s + '秒' + '.' + now_ms); //*******　
			executeTroop();
		}
		// 予約が有効なことを表示
		var obj = window.document.getElementById('autoTroop_hms');
		obj.innerHTML = '(最終チェック' + JST_H + '時' + JST_M + '分)';
	}
	// チェックを外した時
	if (check_flg != true) {
		var obj = window.document.getElementById('autoTroop_hms');
		obj.innerHTML = '(最終チェック--時--分)';
	}
}

var title2 = window.document.title;
if ( title2.indexOf("出兵(確認)") != -1 ) {
	// JSTの表示
	disp_jsttime2();
	// 自動出兵
	checkTroopTime;
	window.setTimeout(function () {
	displayTroop();}, 100); // インターバルの初期値は1000だった1000⇒100
} else {
	// 出兵確認画面でなければ何もしない
}
