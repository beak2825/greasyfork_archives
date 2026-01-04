// ==UserScript==
// @name         둘크립트 - 구글/네이버 폼
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  페이지에서 특정 버튼을 찾아 예약된 시간에 자동으로 클릭하는 스크립트입니다.
// @author       @Pigeon
// @match        *://docs.google.com/forms/*
// @match        *://form.naver.com/response/*
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/509313/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EA%B5%AC%EA%B8%80%EB%84%A4%EC%9D%B4%EB%B2%84%20%ED%8F%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/509313/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EA%B5%AC%EA%B8%80%EB%84%A4%EC%9D%B4%EB%B2%84%20%ED%8F%BC.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const isGoogleForm = window.location.href.includes("docs.google.com");
	const isNaverForm = window.location.href.includes("form.naver.com");

	const googleFormSelector = "[role=button][aria-label=Submit] span";
	const naverFormSelector = "#nsv_page_control_submit";

	const buttonSelector = isGoogleForm ? googleFormSelector : naverFormSelector;

	const createUI = () => {
		const fixedDiv = document.createElement("div");
		fixedDiv.style.position = "fixed";
		fixedDiv.style.top = "10px";
		fixedDiv.style.left = "10px";
		fixedDiv.style.zIndex = "1000";

		const buttonStyles = `margin: 0 5px; color:white; padding: 2px 4px; border-radius: 4px;`;

		// 문구 추가
		const paragraph = document.createElement("p");
		paragraph.textContent = "둘크립트 동작중...";
		fixedDiv.appendChild(paragraph);

		// find 버튼 생성
		const findButtonEl = document.createElement("button");
		findButtonEl.id = "findButton";
		findButtonEl.textContent = "find";
		findButtonEl.style.cssText = buttonStyles + "background:#2faa24;";
		fixedDiv.appendChild(findButtonEl);

		// cbc 버튼 생성
		const cbcButtonEl = document.createElement("button");
		cbcButtonEl.id = "cbcButton";
		cbcButtonEl.textContent = "cbc";
		cbcButtonEl.style.cssText = buttonStyles + "background:#2437aa;";
		fixedDiv.appendChild(cbcButtonEl);

		// 문서에 추가
		document.body.appendChild(fixedDiv);

		// 이벤트 리스너 추가
		findButtonEl.addEventListener("click", () => findButton());
		cbcButtonEl.addEventListener("click", () => handleF3Press());
	};

	let button;

	const clickButton = () => {
		if (button) {
			button.click();
			console.log("버튼을 클릭했습니다.");
		} else {
			console.log("버튼을 찾을 수 없습니다.");
		}
	};

	const displayRemainingTime = (targetDate) => {
		const updateRemainingTime = () => {
			const remainingTime = targetDate - new Date();
			if (remainingTime <= 0) {
				clearInterval(intervalId);
				console.log("목표 시간이 도달했습니다.");
				clickButton();
				return;
			}

			const remainingMinutes = Math.floor((remainingTime / 1000 / 60) % 60);
			const remainingSeconds = ((remainingTime / 1000) % 60).toFixed(3);
			console.log(
				`버튼 클릭까지 ${remainingMinutes}분 ${remainingSeconds}초 남았습니다.`
			);
		};

		const intervalId = setInterval(updateRemainingTime, 5000);
		updateRemainingTime(); // 바로 초기 시간 업데이트
	};

	const scheduleButtonClick = (targetTime) => {
		const targetDate = new Date();
		targetDate.setHours(targetTime.hours);
		targetDate.setMinutes(targetTime.minutes);
		targetDate.setSeconds(targetTime.seconds);
		targetDate.setMilliseconds(targetTime.milliseconds);

		const timeDifference = targetDate - new Date();
		if (timeDifference > 0) {
			console.log(
				`버튼이 ${targetTime.hours}시 ${targetTime.minutes}분 ${targetTime.seconds}초 ${targetTime.milliseconds}밀리초에 클릭됩니다.`
			);
			displayRemainingTime(targetDate);
			setTimeout(clickButton, timeDifference);
		} else {
			console.log("목표 시간이 이미 지났습니다. 시간을 다시 설정하세요.");
		}
	};

	const findButton = (selector = buttonSelector) => {
		button = document.querySelector(selector);
		if (button) {
			button.style.outline = "2px solid red";
			button.style.border = "2px solid red";
			button.style.opacity = "1";
			console.log("버튼을 찾았습니다.");
		} else {
			console.log("버튼을 찾을 수 없습니다.");
		}
		return button;
	};

	const initializeScript = () => {
		window.cbc = (hours, minutes, seconds, milliseconds) => {
			findButton(); // 버튼을 먼저 찾기
			if (
				hours !== undefined ||
				minutes !== undefined ||
				seconds !== undefined ||
				milliseconds !== undefined
			) {
				scheduleButtonClick({ hours, minutes, seconds, milliseconds });
			} else {
				console.log("시간이 입력되지 않았습니다. 5초 뒤에 버튼을 클릭합니다.");
				setTimeout(clickButton, 5000); // 5초 후 클릭
			}
		};

		window.findButton = findButton;
		// UI 생성 추가
		createUI();
		console.log(`
Tampermonkey 스크립트가 로드되었습니다.

사용법:
1. 개발자 도구를 열고 콘솔 탭으로 이동합니다.
2. 'findButton([선택자])'을 호출하여 페이지에서 버튼을 찾고 강조 표시할 수 있습니다. 선택자가 제공되지 않으면 기본적으로 'input[type=submit]' 버튼을 찾습니다.
3. 'cbc(hours, minutes, seconds, milliseconds)'을 호출하여 버튼 클릭을 예약할 수 있습니다.
 시간이 입력되지 않으면 5초 뒤에 버튼이 클릭됩니다.
      `);
	};
	// DOMContentLoaded 이벤트가 발생한 후에 초기화
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initializeScript);
	} else {
		initializeScript();
	}
	window.addEventListener("keydown", function (e) {
		if (e.key === "F1") {
			e.preventDefault();
			handleF1Press();
		} else if (e.key === "F3") {
			e.preventDefault();
			handleF3Press();
		}
	});

	function handleF1Press() {
		findButton();
		clickButton();
	}

	function handleF3Press() {
		const hours = prompt(
			"시간(시)을 입력하세요. 즉시 실행을 원하면 'ㄱㄱ'을 입력하세요."
		);
		if (hours === "ㄱㄱ") {
			cbc();
			return;
		}

		const minutes = prompt("분을 입력하세요.") || 0;
		const seconds = prompt("초를 입력하세요.") || 0;
		const milliseconds = prompt("밀리초를 입력하세요.") || 0;

		if (
			hours !== null &&
			minutes !== null &&
			seconds !== null &&
			milliseconds !== null
		) {
			cbc(
				parseInt(hours),
				parseInt(minutes),
				parseInt(seconds),
				parseInt(milliseconds)
			);
		}
	}
})();
