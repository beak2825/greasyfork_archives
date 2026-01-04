// ==UserScript==
// @name         둘크립트 - 위버스 - 내부용
// @namespace    http://tampermonkey.net/
// @version      1.45
// @description  페이지에서 특정 버튼을 찾아 예약된 시간에 자동으로 클릭하는 스크립트입니다.
// @author       @Pigeon
// @match        *://fanevent.weverse.io/*
// @match        *://fanevent-v2.weverse.io/events/*

// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/517494/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%9C%84%EB%B2%84%EC%8A%A4%20-%20%EB%82%B4%EB%B6%80%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/517494/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%9C%84%EB%B2%84%EC%8A%A4%20-%20%EB%82%B4%EB%B6%80%EC%9A%A9.meta.js
// ==/UserScript==

/**
 * 위버스 팬이벤트 자동화 스크립트
 *
 * 주요 기능:
 * - 특정 시간에 버튼 자동 클릭 예약
 * - 생년월일 자동 입력 및 체크박스 자동 선택
 * - 서버 예열을 통한 응답 지연 최소화
 * - 키보드 단축키(F1~F4) 지원
 *
 * 전역 함수:
 * - cbc(hours, minutes, seconds, milliseconds): 시간 지정하여 버튼 클릭 예약
 * - findButton(selector): 버튼을 찾아서 강조 표시
 */
(function () {
	"use strict";

	// 클릭할 버튼 요소를 저장하는 전역 변수
	let button;

	// DOM 요소 캐시 (성능 최적화)
	let cachedBirthInput = null;

	// 이벤트 리스너 중복 등록 방지 플래그
	let isPasteHandlerAttached = false;

	/**
	 * 사용자 설정 변수
	 * @property {string} birthDate - 자동 입력할 생년월일 (YYYYMMD 형식, 7자리)
	 * @property {number} checkInterval - 남은 시간 체크 간격 (밀리초)
	 * @property {number} defaultDelay - 기본 지연 시간 (밀리초)
	 * @property {string} buttonSelectorNew - 새 폼의 버튼 선택자
	 * @property {string} buttonSelectorDefault - 기본 폼의 버튼 선택자
	 * @property {string} birthDateSelector - 생년월일 입력 필드 선택자
	 */
	const CONFIG = {
		birthDate: "1993112", // 생년월일
		checkInterval: 5000, // 남은 시간 체크 간격 (밀리초)
		defaultDelay: 5000, // 기본 지연 시간 (밀리초)
		buttonSelectorNew: "button[class*=primary1]", // 새 버전 버튼 선택자
		buttonSelectorDefault: "input[type=submit]", // 기본 버전 버튼 선택자
		birthDateSelector: "#requiredProperties-birthDate",
	};

	// URL에 따라 적절한 버튼 선택자 결정
	const isNewForm = window.location.href.includes("fanevent-v2.weverse.io");
	const buttonSelector = isNewForm ? CONFIG.buttonSelectorNew : CONFIG.buttonSelectorDefault;

	/**
	 * 찾아둔 버튼을 클릭합니다.
	 */
	const clickButton = () => {
		if (button) {
			button.click();
			console.log("버튼을 클릭했습니다.");
		} else {
			console.log("버튼을 찾을 수 없습니다.");
		}
	};

	/**
	 * 생년월일 입력 필드를 가져옵니다. (캐싱 적용)
	 * 한 번 조회한 요소는 캐시에 저장되어 재사용됩니다.
	 * @returns {HTMLElement|null} 생년월일 입력 필드
	 */
	const getBirthInput = () => {
		if (!cachedBirthInput) {
			cachedBirthInput = document.querySelector(CONFIG.birthDateSelector);
		}
		return cachedBirthInput;
	};

	/**
	 * 목표 시간까지 남은 시간을 5초마다 콘솔에 출력합니다.
	 * @param {Date} targetDate - 목표 시간
	 * @returns {number} intervalId - 인터벌 ID (취소 가능하도록)
	 */
	const displayRemainingTime = (targetDate) => {
		const updateRemainingTime = () => {
			const remainingTime = targetDate - new Date();
			if (remainingTime <= 0) {
				clearInterval(intervalId);
				console.log("목표 시간이 도달했습니다.");
				return;
			}

			const remainingMinutes = Math.floor((remainingTime / 1000 / 60) % 60);
			const remainingSeconds = ((remainingTime / 1000) % 60).toFixed(3);
			console.log(
				`버튼 클릭까지 ${remainingMinutes}분 ${remainingSeconds}초 남았습니다.`
			);
		};

		const intervalId = setInterval(updateRemainingTime, CONFIG.checkInterval);
		updateRemainingTime(); // 바로 초기 시간 업데이트
		return intervalId;
	};

	/**
	 * 서버 응답 지연을 줄이기 위해 현재 페이지에 HEAD 요청을 보내 서버를 예열합니다.
	 * 보통 버튼 클릭 5초 전에 실행됩니다.
	 */
	const warmupServer = () => {
		try {
			// 현재 페이지에 더미 요청을 보내 서버 예열
			fetch(window.location.href, {
				method: 'HEAD',
				cache: 'no-cache'
			}).then(() => {
				console.log("서버 예열 완료");
			}).catch(() => {
				console.log("서버 예열 시도");
			});
		} catch (error) {
			console.log("서버 예열 중 오류:", error.message);
		}
	};

	/**
	 * 지정된 시간에 버튼을 클릭하도록 예약합니다.
	 * 클릭 5초 전에 서버 예열을 자동으로 실행합니다.
	 * @param {Object} targetTime - 목표 시간 (hours, minutes, seconds, milliseconds)
	 */
	const scheduleButtonClick = (targetTime) => {
		const targetDate = new Date();
		targetDate.setHours(targetTime.hours);
		targetDate.setMinutes(targetTime.minutes);
		targetDate.setSeconds(targetTime.seconds);
		targetDate.setMilliseconds(targetTime.milliseconds);

		const timeDifference = targetDate - new Date();
		const warmupTime = 5000; // 5초 전에 서버 예열

		if (timeDifference > 0) {
			console.log(
				`버튼이 ${targetTime.hours}시 ${targetTime.minutes}분 ${targetTime.seconds}초 ${targetTime.milliseconds}밀리초에 클릭됩니다.`
			);
			displayRemainingTime(targetDate);

			// 서버 예열을 위한 타이머 설정 (클릭 5초 전)
			if (timeDifference > warmupTime) {
				setTimeout(warmupServer, timeDifference - warmupTime);
				console.log("서버 예열이 버튼 클릭 5초 전에 실행됩니다.");
			}

			setTimeout(clickButton, timeDifference);
		} else {
			console.log("목표 시간이 이미 지났습니다. 시간을 다시 설정하세요.");
		}
	};

	/**
	 * 페이지에서 버튼을 찾아 빨간색 테두리로 강조 표시합니다.
	 * 콘솔에서 직접 호출 가능한 함수입니다.
	 * @param {string} selector - CSS 선택자 (기본값: buttonSelector)
	 * @returns {HTMLElement} 찾은 버튼 요소
	 */
	const findButton = (selector = buttonSelector) => {
		button = document.querySelector(selector);
		if (button) {
			button.style.outline = "2px solid red";
			button.style.opacity = "1";
			console.log("버튼을 찾았습니다.");
		} else {
			console.log("버튼을 찾을 수 없습니다.");
		}
		return button;
	};

	/**
	 * 스크립트를 초기화하고 전역 함수(cbc, findButton)를 등록합니다.
	 * 콘솔에 사용법을 출력하고 UI를 생성합니다.
	 */
	const initializeScript = () => {
		// cbc: Click Button by Clock - 시간 지정하여 버튼 클릭
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
				setTimeout(clickButton, CONFIG.defaultDelay); // 기본 지연 시간 후 클릭
			}
		};

		window.findButton = findButton;

		// UI 생성 (DOM이 준비된 후 실행)
		createControlUI();

		console.log(`
Tampermonkey 스크립트가 로드되었습니다.

사용법:
1. 개발자 도구를 열고 콘솔 탭으로 이동합니다.
2. 'findButton([선택자])'을 호출하여 페이지에서 버튼을 찾고 강조 표시할 수 있습니다. 선택자가 제공되지 않으면 기본적으로 'input[type=submit]' 버튼을 찾습니다.
3. 'cbc(hours, minutes, seconds, milliseconds)'을 호출하여 버튼 클릭을 예약할 수 있습니다.
 시간이 입력되지 않으면 5초 뒤에 버튼이 클릭됩니다.
      `);
	};

	// DOM이 로드되면 스크립트 초기화
	document.addEventListener("DOMContentLoaded", initializeScript);

	/**
	 * 키보드 단축키 이벤트 리스너
	 * F1: 버튼 찾기
	 * F2: 생년월일 입력 + 체크박스 선택 + 버튼 찾기
	 * F3: 시간 입력 프롬프트 (버튼 클릭 예약)
	 * F4: 버튼 찾기 + 복사/붙여넣기 설정 + 버튼 클릭
	 */
	window.addEventListener("keydown", function (e) {
		switch (e.key) {
			case "F1":
				e.preventDefault();
				findButton();
				break;
			case "F2":
				e.preventDefault();
				handleF2Press();
				break;
			case "F3":
				e.preventDefault();
				handleF3Press();
				break;
			case "F4":
				e.preventDefault();
				handleF4Press();
				break;
		}
	});

	/**
	 * 설정된 생년월일을 클립보드에 복사합니다.
	 */
	const copyBirthDateToClipboard = () => {
		navigator.clipboard
			.writeText(CONFIG.birthDate)
			.then(() =>
				console.log("생년월일이 클립보드에 복사되었습니다:", CONFIG.birthDate)
			)
			.catch((err) => console.error("클립보드 복사 실패:", err));
	};

	/**
	 * 생년월일 입력 필드에 붙여넣기 이벤트 리스너를 추가합니다.
	 * 숫자만 추출하고 7자리로 제한하여 입력합니다.
	 * 중복 등록을 방지합니다.
	 */
	const setupBirthDatePasteHandler = () => {
		// 이미 이벤트 리스너가 등록되어 있으면 중복 등록 방지
		if (isPasteHandlerAttached) {
			console.log("붙여넣기 핸들러가 이미 등록되어 있습니다.");
			return;
		}

		const birthInput = getBirthInput();
		if (!birthInput) return;

		birthInput.addEventListener("paste", (e) => {
			e.preventDefault();
			const pastedText = (e.clipboardData || window.clipboardData).getData(
				"text"
			);

			// 숫자만 추출
			const numbers = pastedText.replace(/[^\d]/g, "");

			// 7자리로 제한
			const formattedText = numbers.slice(0, 7);

			birthInput.value = formattedText;
			birthInput.setAttribute("value", formattedText);
			console.log("생년월일이 붙여넣기 되었습니다:", formattedText);
		});

		isPasteHandlerAttached = true;
		console.log("붙여넣기 핸들러가 등록되었습니다.");
	};

	/**
	 * 생년월일을 클립보드에 복사하고, 모든 체크박스를 선택하며, 붙여넣기 핸들러를 설정합니다.
	 * CNP: Copy 'N' Paste
	 */
	const setupFormWithCopyPaste = () => {
		copyBirthDateToClipboard();
		checkAllCheckboxes();
		setupBirthDatePasteHandler();
	};

	/**
	 * 페이지의 모든 체크박스를 찾아서 체크합니다.
	 */
	const checkAllCheckboxes = () => {
		// 모든 체크박스 클릭
		const checkboxes = document.querySelectorAll("input[type=checkbox]");
		if (checkboxes.length > 0) {
			checkboxes.forEach((checkbox) => {
				if (!checkbox.checked) {
					checkbox.click();
				}
			});
			console.log(`${checkboxes.length}개의 체크박스를 클릭했습니다.`);
		} else {
			console.log("체크박스를 찾을 수 없습니다.");
		}
	};

	/**
	 * 생년월일을 직접 입력하고 모든 체크박스를 선택합니다.
	 */
	const fillBirthDateAndCheckAll = () => {
		// 생년월일 입력
		const birthInput = getBirthInput();

		if (birthInput) {
			birthInput.focus();
			birthInput.value = CONFIG.birthDate;
			birthInput.setAttribute("value", CONFIG.birthDate);
		}

		// 모든 체크박스 클릭
		checkAllCheckboxes();
	};
	/**
	 * F2 키를 눌렀을 때 실행: 생년월일 입력, 체크박스 선택, 버튼 찾기
	 */
	function handleF2Press() {
		fillBirthDateAndCheckAll(); // 생년월일 입력 및 체크박스 클릭
		findButton(); // 버튼을 먼저 찾기
	}

	/**
	 * F4 키를 눌렀을 때 실행: 버튼 찾기, 폼 설정(복사/붙여넣기), 버튼 클릭
	 */
	function handleF4Press() {
		findButton(); // 버튼을 먼저 찾기
		setupFormWithCopyPaste();
		clickButton();
	}

	/**
	 * F3 키를 눌렀을 때 실행: 프롬프트로 시간을 입력받아 버튼 클릭 예약
	 * 'ㄱㄱ'을 입력하면 즉시 실행됩니다.
	 */
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

	/**
	 * 화면 좌측 상단에 스크립트 상태 표시 UI를 생성하고 버튼을 추가합니다.
	 */
	const createControlUI = () => {
		// div 요소 생성 및 스타일 설정
		const fixedDiv = document.createElement("div");
		fixedDiv.style.position = "fixed";
		fixedDiv.style.top = "70px";
		fixedDiv.style.left = "20px";

		const buttonStyles = `margin: 0 5px; color:white; padding: 2px 4px; border-radius: 4px; z-index:9999;`;
		// div 안에 button 요소들 포함
		fixedDiv.innerHTML = `
  <p>둘크립트 동작중...</p>
      <button id="findButton" style="${buttonStyles} background:#2faa24;">find</button>
      <button id="cbcButton" style="${buttonStyles} background:#2437aa;">cbc</button>
          `;

		// 생성한 div를 body에 추가
		document.body.appendChild(fixedDiv);

		// 각 버튼에 이벤트 리스너 할당
		document
			.getElementById("findButton")
			.addEventListener("click", () => findButton());
		document
			.getElementById("cbcButton")
			.addEventListener("click", () => handleF3Press());
	};
})();
