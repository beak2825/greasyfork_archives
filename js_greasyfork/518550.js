// ==UserScript==
// @name         둘크립트 - 통합폼
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  페이지에서 특정 버튼을 찾아 예약된 시간에 자동으로 클릭하는 스크립트입니다.
// @author       @Pigeon
// @match        *://docs.google.com/forms/*
// @match        *://form.naver.com/response/*
// @match        *://cafe.daum.net/*
// @match        *://artist.mnetplus.world/*
// @match        *://bewave.bstage.in/surveys/*
// @match        *://chungha-official.com/surveys/*
// @match        *://all-h-ours.com/surveys/*
// @match        *://partner.frommyarti.com/*
// @match        *://store.frommyarti.com/event/*
// @match        *://h1key-official.com/surveys/*


// @grant        none
// @run-at       document-start
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/518550/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%ED%86%B5%ED%95%A9%ED%8F%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/518550/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%ED%86%B5%ED%95%A9%ED%8F%BC.meta.js
// ==/UserScript==
//Button_container__a1Cru Button_large__ecBab Button_contained__cpO6n Button_primary__bUZKl
// 이즈나: https://artist.mnetplus.world/main/stg/izna/home
// TODO: 비스테이지는 아티스트마다 추가 필요
(function () {
	"use strict";

	const getButtonSelector = () => {
		const url = window.location.href;

		switch (true) {
			case url.includes("docs.google.com"):
				return "[role=button][aria-label=Submit] span";

			case url.includes("form.naver.com"):
				return "#nsv_page_control_submit";

			case url.includes("artist.mnetplus.world"):
				return "[class*='Button_primary']";

			case url.includes("bstage.in"):
			case url.includes("chungha-official"):
			case url.includes("all-h-ours"):
			case url.includes("h1key-official"):
				return "[class*='Button_primary']";

			case url.includes("frommyarti"):
				return "[role='button'][tabindex='0']";

			default:
				// Daum Cafe
				return "#btnSaveView .txt_btn";
		}
	};

	const buttonSelector = getButtonSelector();

	const createUI = () => {
		const fixedDiv = document.createElement("div");
		fixedDiv.style.position = "fixed";
		fixedDiv.style.top = "10px";
		fixedDiv.style.left = "10px";
		fixedDiv.style.zIndex = "9999";

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

		// cbc 실행 시 "~~에 버튼이 클릭됩니다" 출력
		const cbcResultEl = document.createElement("p");
		cbcResultEl.id = "cbcResult";
		fixedDiv.appendChild(cbcResultEl);

		// 문서에 추가
		document.body.appendChild(fixedDiv);

		// 이벤트 리스너 추가
		findButtonEl.addEventListener("click", () => findButton());
		cbcButtonEl.addEventListener("click", () => handleF3Press());
	};

	let button;
	let scheduledClickTimeout = null;
	let warmupTimeout = null;
	let displayInterval = null;
	let isClickExecuted = false;

	const WARMUP_DELAY_MS = 5000; // 서버 예열 시간 (버튼 클릭 전)

	const warmupServer = () => {
		// 서버 예열: 여러 기법 조합
		console.log("[서버 예열] 시작...");

		// 1. DNS 프리페치 - 현재 도메인의 DNS를 미리 조회
		const currentDomain = window.location.hostname;
		const link = document.createElement('link');
		link.rel = 'dns-prefetch';
		link.href = `//${currentDomain}`;
		document.head.appendChild(link);

		// 2. 프리커넥트 - TCP 연결, TLS 핸드셰이크 미리 수행
		const preconnect = document.createElement('link');
		preconnect.rel = 'preconnect';
		preconnect.href = window.location.origin;
		document.head.appendChild(preconnect);

		// 3. Keep-Alive 요청 - 현재 페이지를 가벼운 HEAD 요청으로 미리 접근
		// 이를 통해 서버와의 연결을 유지하고 캐시를 웜업
		fetch(window.location.href, {
			method: 'HEAD',
			cache: 'no-cache',
			credentials: 'same-origin'
		}).catch(() => {
			// HEAD 실패 시 GET 시도 (일부 서버는 HEAD를 지원하지 않음)
			fetch(window.location.href, {
				method: 'GET',
				cache: 'reload',
				credentials: 'same-origin'
			}).catch(() => {});
		});

		// 4. 마우스 호버 시뮬레이션 - 버튼에 마우스를 올려 브라우저/서버 프리로딩 트리거
		if (button) {
			const hoverEvent = new MouseEvent('mouseenter', {
				view: window,
				bubbles: true,
				cancelable: true
			});
			button.dispatchEvent(hoverEvent);

			// 5. 포커스 이벤트 - 버튼을 미리 활성화
			if (typeof button.focus === 'function') {
				button.focus();
			}
		}

		// 6. 더미 XHR/Fetch 요청 - 서버의 응답성 향상
		// API 엔드포인트가 있다면 미리 핑을 보냄
		const dummyImage = new Image();
		dummyImage.src = `${window.location.origin}/favicon.ico?_warmup=${Date.now()}`;

		console.log("[서버 예열] 완료");
	};

	const clearAllTimers = () => {
		if (scheduledClickTimeout) {
			clearTimeout(scheduledClickTimeout);
			scheduledClickTimeout = null;
		}
		if (warmupTimeout) {
			clearTimeout(warmupTimeout);
			warmupTimeout = null;
		}
		if (displayInterval) {
			clearInterval(displayInterval);
			displayInterval = null;
		}
	};

	const clickButton = () => {
		// 중복 클릭 방지
		if (isClickExecuted) {
			console.log("[중복 방지] 버튼이 이미 클릭되었습니다.");
			return;
		}

		if (button) {
			isClickExecuted = true;
			clearAllTimers(); // 모든 타이머 정리
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
				if (displayInterval) {
					clearInterval(displayInterval);
					displayInterval = null;
				}
				console.log("목표 시간이 도달했습니다.");
				// clickButton()은 setTimeout에서 호출되므로 여기서는 제거
				return;
			}

			const remainingMinutes = Math.floor((remainingTime / 1000 / 60) % 60);
			const remainingSeconds = ((remainingTime / 1000) % 60).toFixed(3);
			console.log(
				`버튼 클릭까지 ${remainingMinutes}분 ${remainingSeconds}초 남았습니다.`
			);
		};

		// 기존 interval이 있다면 정리
		if (displayInterval) {
			clearInterval(displayInterval);
		}
		displayInterval = setInterval(updateRemainingTime, 5000);
		updateRemainingTime(); // 바로 초기 시간 업데이트
	};

	const scheduleButtonClick = (targetTime) => {
		// 이전 스케줄 취소
		clearAllTimers();
		isClickExecuted = false;

		const targetDate = new Date();
		targetDate.setHours(targetTime.hours);
		targetDate.setMinutes(targetTime.minutes);
		targetDate.setSeconds(targetTime.seconds);
		targetDate.setMilliseconds(targetTime.milliseconds);

		const timeDifference = targetDate - new Date();
		if (timeDifference > 0) {
			const message = `버튼이 ${targetTime.hours}시 ${targetTime.minutes}분 ${targetTime.seconds}초 ${targetTime.milliseconds}밀리초에 클릭됩니다.`;
			console.log(message);

			// UI 업데이트 안전성 확보
			const cbcResultEl = document.getElementById("cbcResult");
			if (cbcResultEl) {
				cbcResultEl.textContent = message;
			}

			displayRemainingTime(targetDate);

			// 서버 예열: 버튼 클릭 WARMUP_DELAY_MS 전에 실행
			const warmupTime = timeDifference - WARMUP_DELAY_MS;
			if (warmupTime > 0) {
				warmupTimeout = setTimeout(() => {
					warmupServer();
				}, warmupTime);
				console.log(`[스케줄] 서버 예열이 클릭 ${WARMUP_DELAY_MS / 1000}초 전에 실행됩니다.`);
			} else if (timeDifference > 0) {
				// WARMUP_DELAY_MS 미만 남았다면 즉시 예열 실행
				warmupServer();
			}

			scheduledClickTimeout = setTimeout(clickButton, timeDifference);
		} else {
			const message = "목표 시간이 이미 지났습니다. 시간을 다시 설정하세요.";
			console.log(message);

			const cbcResultEl = document.getElementById("cbcResult");
			if (cbcResultEl) {
				cbcResultEl.textContent = message;
			}
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
				// 이전 스케줄 취소
				clearAllTimers();
				isClickExecuted = false;

				const message =
					"시간이 입력되지 않았습니다. 5초 뒤에 버튼을 클릭합니다.";
				console.log(message);

				// UI 업데이트 안전성 확보
				const cbcResultEl = document.getElementById("cbcResult");
				if (cbcResultEl) {
					cbcResultEl.textContent = message;
				}

				// 즉시 서버 예열 실행
				warmupServer();

				scheduledClickTimeout = setTimeout(clickButton, WARMUP_DELAY_MS);
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
