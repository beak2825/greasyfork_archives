// ==UserScript==
// @name         プロジェクトデフォルト選択
// @namespace    https://www.tomo-report.com/
// @version      2.0.0
// @description  プロジェクトをデフォルトで"サイト構築"を選択，勤務日に今日の日付を代入，ストップウォッチの追加
// @author       Yuto
// @match        https://www.tomo-report.com/app/staff
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tomo-report.com
// @grant        none
// @license Copyright (c) 2022 Yuto | https://github.com/Yuto-34
// @downloadURL https://update.greasyfork.org/scripts/442429/%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E9%81%B8%E6%8A%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/442429/%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E9%81%B8%E6%8A%9E.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// ----------------------------
	// デフォルト時の選択を操作
	// ----------------------------

	// 0~9の数値に0を足して2桁にする関数
	// (例: 0:0:0 -> 00:00:00)
	function formatTime(val) {
		return ("0" + val).slice(-2);
	}

	// 今日の日付データをcurrentDateに格納
	const currentDate = new Date();

	// 年・月・日・曜日を取得
	const year = currentDate.getFullYear();
	const month = formatTime(currentDate.getMonth() + 1);
	const date = formatTime(currentDate.getDate());
	// const day = formatTime(currentDate.getDay());

	// 値の代入
	document.getElementById("id_department").value = 24;
	document.getElementById("id_project").value = 277;
	document.getElementById("id_worked_at").value = `${year}-${month}-${date}`;

	// ----------------------------
	// ストップウォッチ
	// ----------------------------

	// Start Button の作成
	var startButton = document.createElement("input"); // input要素作成
	startButton.setAttribute("type", "button"); // input要素にtypeを設定
	startButton.setAttribute("value", "開始"); // input要素にvalueを設定
	startButton.setAttribute("id", "startButton"); // input要素にidを設定
	startButton.setAttribute("onclick", "startTimer()"); // input要素にonclickを設定
	startButton.setAttribute("style", "margin: 5px 5px 10px 0;"); // input要素にstyleを設定

	// Stop Buttonの作成
	var stopButton = document.createElement("input"); // input要素作成
	stopButton.setAttribute("type", "button"); // input要素にtypeを設定
	stopButton.setAttribute("value", "停止"); // input要素にvalueを設定
	stopButton.setAttribute("id", "stopButton"); // input要素にidを設定
	stopButton.setAttribute("onclick", "stopTimer()"); // input要素にonclickを設定
	stopButton.setAttribute("style", "margin: 5px 5px 10px 0;"); // input要素にstyleを設定
	stopButton.setAttribute("disabled", true); // input要素にstyleを設定

	// Apply Buttonの作成
	// var applyButton = document.createElement("input"); // input要素作成
	// applyButton.setAttribute("type", "button"); // input要素にtypeを設定
	// applyButton.setAttribute("value", "終了！"); // input要素にvalueを設定
	// applyButton.setAttribute("id", "applyButton"); // input要素にidを設定
	// applyButton.setAttribute("onclick", "applyTimer()"); // input要素にonclickを設定
	// applyButton.setAttribute("style", "margin: 5px 5px 10px 0;"); // input要素にstyleを設定
	// applyButton.setAttribute("disabled", true); // input要素にstyleを設定

	var newContent = document.createTextNode("00:00:00"); // テキストノードを作成
	var setTimer = document.createElement("h1");
	setTimer.setAttribute("id", "timer");
	setTimer.appendChild(newContent); // h1要素にテキストノードを追加
	setTimer.setAttribute("style", "margin-bottom: 25px;"); // input要素にstyleを設定

	// 親要素（div）への参照を取得
	const parentDiv = document.getElementsByClassName("col-md-5")[0];

	// =============
	// 要素の追加
	// =============
	// hiddenボタンへの参照を取得してタイマー追加
	const previousId = document.getElementById("previous");
	parentDiv.insertBefore(setTimer, previousId.nextSibling);
	// タイマーへの参照を取得してスタートボタンを追加
	const timer = document.getElementById("timer");
	parentDiv.insertBefore(startButton, timer.nextSibling);

	// startボタンへの参照を取得
	const start = document.getElementById("startButton");
	parentDiv.insertBefore(stopButton, start.nextSibling);

	// stopボタンへの参照を取得
	const stop = document.getElementById("stopButton");
	// parentDiv.insertBefore(applyButton, stop.nextSibling);

	// // applyボタンへの参照を取得
	// const apply = document.getElementById("applyButton");

	// =============
	// 変数の用意
	// =============
	let startTime; // Startボタンクリック時の時刻
	let timerSetId; // ID
	let elapsedTime = 0; // StartからStopまでの経過時間
	var timeToadd = 0; //タイマーをストップ -> 再開させたら0になってしまうのを避けるための変数。
	let h = 0;
	let m = 0;
	let s = 0;

	// =============
	// 時間表示
	// =============
	function updateTimetText() {
		h = Math.floor(elapsedTime / 1000 / 60 / 60) % 24;
		m = Math.floor(elapsedTime / 60000);
		s = Math.floor(elapsedTime % 60000 / 1000);

		let str_h = ('0' + h).slice(-2);
		let str_m = ('0' + m).slice(-2);
		let str_s = ('0' + s).slice(-2);

		//HTMLのid timer部分に表示させる　
		timer.textContent = str_h + ':' + str_m + ':' + str_s;
	}

	// =============
	// 時間計算
	// =============
	function countUp() {
		//timerSetId変数はsetTimeoutの返り値になるので代入する
		timerSetId = setTimeout(function () {

			//経過時刻は現在時刻をミリ秒で示すDate.now()からstartを押した時の時刻(startTime)を引く
			elapsedTime = Date.now() - startTime + timeToadd;
			updateTimetText()

			//countUp関数自身を呼ぶことで100ミリ秒毎に以下の計算を始める
			countUp();

			//100ミリ秒後に始めるよう宣言
		}, 100);
	}


	// =============
	// スタートボタン
	// =============
	function startTimer() {
		startTime = Date.now();
		timer.style.color = "blue";
		start.setAttribute("disabled", true);
		stop.removeAttribute("disabled");
		// apply.removeAttribute("disabled");
		countUp();
	}

	// =============
	// ストップボタン
	// =============
	function stopTimer() {
		timer.style.color = "red";
		start.value = "再開";
		start.removeAttribute("disabled");

		//タイマーを止めるにはclearTimeoutを使う必要があり、そのためにはclearTimeoutの引数に渡すためのタイマーのidが必要
		clearTimeout(timerSetId);

		// elapsedTime = Date.now - startTime + timeToadd (timeToadd = ストップを押した時刻(Date.now)から直近のスタート時刻(startTime)を引く)
		timeToadd += Date.now() - startTime;

		// if (!(start.hasAttribute("desabled"))) {
		// 	clearTimeout(timerSetId);
		// 	timer.style.color = "red";
		// 	start.removeAttribute("disabled");
		stop.setAttribute("disabled", true);
		// }

		if (m > 50) {
			m = 0;
			h = h + 1;
		} else if (m > 35) {
			m = 45;
		} else if (m > 20) {
			m = 30;
		} else if (m > 5) {
			m = 15;
		} else {
			m = 0;
		}
		document.getElementById("id_working_hour").value = h;
		document.getElementById("id_working_minute").value = m;
	}

	// =============
	// 適用ボタン
	// =============
	function applyTimer() {
		var result = start.hasAttribute("desabled");
		if (!result) {
			clearTimeout(timerSetId);
			timer.setAttribute("style", "color:red;")
			stop.setAttribute("disabled", true);
			start.removeAttribute("disabled");
		}
		// alert('This is a test');
		if (m > 50) {
			m = 0;
			h = h + 1;
		} else if (m > 35) {
			m = 45;
		} else if (m > 20) {
			m = 30;
		} else if (m > 5) {
			m = 15;
		} else {
			m = 0;
		}
		document.getElementById("id_working_hour").value = h;
		document.getElementById("id_working_minute").value = m;
	}

	start.onclick = startTimer;
	stop.onclick = stopTimer;
	// apply.onclick = applyTimer;

})();