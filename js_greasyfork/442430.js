// ==UserScript==
// @name         トモノカイ業務報告Web 効率化ツール
// @namespace    https://www.tomo-report.com/
// @version      2.1.2
// @description  プロジェクトをデフォルトで"サイト構築"を選択，勤務日に今日の日付を代入，ストップウォッチの追加
// @author       Yuto
// @match        https://www.tomo-report.com/app/staff
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tomo-report.com
// @grant        none
// @license Copyright (c) 2022 Yuto https://github.com/Yuto-34
// @downloadURL https://update.greasyfork.org/scripts/442430/%E3%83%88%E3%83%A2%E3%83%8E%E3%82%AB%E3%82%A4%E6%A5%AD%E5%8B%99%E5%A0%B1%E5%91%8AWeb%20%E5%8A%B9%E7%8E%87%E5%8C%96%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/442430/%E3%83%88%E3%83%A2%E3%83%8E%E3%82%AB%E3%82%A4%E6%A5%AD%E5%8B%99%E5%A0%B1%E5%91%8AWeb%20%E5%8A%B9%E7%8E%87%E5%8C%96%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// ----------------------------
	// 色の指定
	// ----------------------------
	let colorNormal = "#362706"
	let bgColorDeactive = "#524A4E";
	let bdColorDeactive = "#524A4E";

	let colorActive = "#980F5A";
	let bgColorActive = "#FFC0D3";
	let bdColorActive = "#FDEFF4";

	let colorHover = "#FDEFF4"
	let bgColorHover = "#FF5C8D";
	let bdColorHover = "#FFC0D3";


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
	{
		var startButton = document.createElement("input"); // input要素作成
		startButton.setAttribute("type", "button"); // input要素にtypeを設定
		startButton.setAttribute("value", "開始"); // input要素にvalueを設定
		startButton.setAttribute("id", "startButton"); // input要素にidを設定
		startButton.setAttribute("onclick", "startTimer()"); // input要素にonclickを設定
		startButton.setAttribute("style", "margin: 5px 5px 10px 0;"); // input要素にstyleを設定
	}

	// Stop Buttonの作成
	{
		var stopButton = document.createElement("input"); // input要素作成
		stopButton.setAttribute("type", "button"); // input要素にtypeを設定
		stopButton.setAttribute("value", "停止"); // input要素にvalueを設定
		stopButton.setAttribute("id", "stopButton"); // input要素にidを設定
		stopButton.setAttribute("onclick", "stopTimer()"); // input要素にonclickを設定
		stopButton.setAttribute("style", "margin: 5px 5px 10px 0;"); // input要素にstyleを設定
		stopButton.setAttribute("disabled", true); // input要素にstyleを設定
	}

	// タイマーの作成
	{
		var newContent = document.createTextNode("00:00:00"); // テキストノードを作成
		var setTimer = document.createElement("h1");
		setTimer.setAttribute("id", "timer");
		setTimer.appendChild(newContent); // h1要素にテキストノードを追加
		setTimer.setAttribute("style", "margin-bottom: 25px;"); // input要素にstyleを設定
	}

	// タイマーを囲むdivの作成
	{
		var setDiv = document.createElement("div");
		setDiv.setAttribute("id", "timer_div");
		setDiv.setAttribute("style", "padding-bottom: 20px; border-radius: 5px;")
	}

	// 親要素（div）への参照を取得
	const parentDiv = document.getElementsByClassName("col-md-5")[0];
	document.body.style.overflow = 'scroll';
	document.body.style.background = "#fffdfd";

	// =============
	// 要素の追加
	// =============

	// hiddenボタンへの参照を取得(唯一既存の要素)
	const previousId = document.getElementById("previous");
	// 新しいtimer_divの追加
	parentDiv.insertBefore(setDiv, previousId.nextSibling);
	// timer_divへの参照を取得
	const timerDiv = document.getElementById("timer_div");
	// timerDiv.style.boxShadow = "0 0 10px 5px #FDEFF4";
	// timerDiv.style.background = " #FDEFF4";

	// タイマー追加
	timerDiv.appendChild(setTimer, timerDiv.firstChild);

	// タイマーへの参照を取得してスタートボタンを追加
	const timer = document.getElementById("timer");
	timerDiv.insertBefore(startButton, timer.nextSibling);
	timer.style.color = "#7bbd9e";

	// startボタンへの参照を取得
	const start = document.getElementById("startButton");
	timerDiv.insertBefore(stopButton, start.nextSibling);

	// stopボタンへの参照を取得
	const stop = document.getElementById("stopButton");
	// timerDiv.insertBefore(applyButton, stop.nextSibling);

	// =============
	// デザイン
	// =============

	function styleActive(button) {
		button.style.cursor = "auto";
		button.style.color = colorActive;
		button.style.background = bgColorActive;
		button.style.borderColor = bdColorActive;
		// button.style.border = "none";
		// button.style.boxShadow = `7px 7px 10px 2px ${bgColorActive}, -2px -2px 5px 1px ${bdColorActive}`;
		// button.style.boxShadow = `7px 7px 10px 2px ${bgColorActive}, -2px -2px 5px 1px ${bdColorActive}`;
		button.style.boxShadow = `none`;
		button.removeAttribute("disabled");

		button.addEventListener("mouseover", function (event) {
			styleHover(event.target);
			event.target.style.transition = "0.5s";
		}, false);

		button.addEventListener("mouseleave", function (event) {
			styleActive(event.target);
			event.target.style.transition = "0.5s";
		}, false);
		button.style.transition = "0.3s";
	}

	function styleDeactive(button) {
		button.style.color = colorNormal;
		button.style.background = bgColorDeactive;
		button.style.borderColor = bdColorDeactive;
		button.style.boxShadow = `none`;
		button.style.cursor = "not-allowed";
		button.setAttribute("disabled", true);
		button.style.transition = "0.3s";
	}

	function styleHover(button) {
		button.style.color = colorHover;
		button.style.background = bgColorHover;
		button.style.borderColor = bdColorHover;
		// button.style.boxShadow = `7px 7px 10px 2px ${bdColorHover}, -2px -2px 5px 1px ${bgColorActive}`;
		button.style.boxShadow = `3px 3px 10px 2px ${bdColorHover}`;
		button.style.cursor = "pointer";
		button.style.transition = "0.3s";
	}

	function makeButton(button) {
		button.style.margin = "0";
		button.style.padding = "0";
		button.style.width = "200px";
		button.style.maxWidth = "45%";
		button.style.height = "50px";
		button.style.borderRadius = "10px";
		button.style.fontSize = "2.5ex";
		button.style.fontWeight = "bold";
	}

	// Div
	{
		timerDiv.style.marginBottom = "30px";
		timerDiv.style.display = "flex";
		timerDiv.style.flexWrap = "wrap";
		timerDiv.style.justifyContent = "space-around";
	}
	// タイマー
	{
		timer.style.width = "100%";
		timer.style.textAlign = "center";
	}
	// startボタン
	makeButton(start);
	styleActive(start);
	start.style.marginRight = "10%";


	// stopボタン
	makeButton(stop);
	styleDeactive(stop);


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
		let countedTime = elapsedTime;
		s = Math.floor(countedTime / 1000) % 60;
		m = Math.floor(countedTime / 1000 / 60) % 60;
		h = Math.floor(countedTime / 1000 / 60 / 60) % 24;
		let str_s = formatTime(s);
		let str_m = formatTime(m);
		let str_h = formatTime(h);
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
	// スタート押下
	// =============
	function startTimer() {
		startTime = Date.now();
		timer.style.color = "#7bbd9e";
		styleDeactive(start);
		styleActive(stop);

		countUp();
	}

	// =============
	// ストップボタン
	// =============
	function stopTimer() {
		timer.style.color = "#B8405E";
		start.value = "再開";
		styleActive(start);
		styleDeactive(stop);
		//タイマーを止める
		clearTimeout(timerSetId);
		// elapsedTime = Date.now - startTime + timeToadd 
		timeToadd += Date.now() - startTime;

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
		document.getElementById("id_working_minute").value = formatTime(m);
	}

	start.onclick = startTimer;
	stop.onclick = stopTimer;

})();