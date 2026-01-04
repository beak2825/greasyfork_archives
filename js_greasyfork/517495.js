// ==UserScript==
// @name         둘크립트 - 위버스 - 배포용
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  페이지에서 특정 버튼을 찾아 예약된 시간에 자동으로 클릭하는 스크립트입니다.
// @author       @Pigeon
// @match        *://fanevent.weverse.io/*
// @match        *://fanevent-v2.weverse.io/events/*

// @grant        none
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/516398/1480085/userList.js
// @downloadURL https://update.greasyfork.org/scripts/517495/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%9C%84%EB%B2%84%EC%8A%A4%20-%20%EB%B0%B0%ED%8F%AC%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/517495/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%9C%84%EB%B2%84%EC%8A%A4%20-%20%EB%B0%B0%ED%8F%AC%EC%9A%A9.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const whiteList = userList();

    let button;

	const CONFIG = {
		buttonSelectorNew: "button[class*=primary1]", // 새 버전 버튼 선택자
		buttonSelectorDefault: "input[type=submit]", // 기본 버전 버튼 선택자
	};

	// URL에 따라 적절한 버튼 선택자 결정
	const isNewForm = window.location.href.includes("fanevent-v2.weverse.io");
	const buttonSelector = isNewForm ? CONFIG.buttonSelectorNew : CONFIG.buttonSelectorDefault;

    const clickButton = () => {
        if (button) {
            button.click();
            console.log('버튼을 클릭했습니다.');
        } else {
            console.log('버튼을 찾을 수 없습니다.');
        }
    };

    const displayRemainingTime = (targetDate) => {
        const updateRemainingTime = () => {
            const remainingTime = targetDate - new Date();
            if (remainingTime <= 0) {
                clearInterval(intervalId);
                console.log('목표 시간이 도달했습니다.');
                clickButton();
                return;
            }

            const remainingMinutes = Math.floor((remainingTime / 1000 / 60) % 60);
            const remainingSeconds = ((remainingTime / 1000) % 60).toFixed(3);
            console.log(`버튼 클릭까지 ${remainingMinutes}분 ${remainingSeconds}초 남았습니다.`);
        };

        const intervalId = setInterval(updateRemainingTime, 5000);
        updateRemainingTime();  // 바로 초기 시간 업데이트
    };

    const scheduleButtonClick = (targetTime) => {
        const targetDate = new Date();
        targetDate.setHours(targetTime.hours);
        targetDate.setMinutes(targetTime.minutes);
        targetDate.setSeconds(targetTime.seconds);
        targetDate.setMilliseconds(targetTime.milliseconds);

        const timeDifference = targetDate - new Date();
        if (timeDifference > 0) {
            console.log(`버튼이 ${targetTime.hours}시 ${targetTime.minutes}분 ${targetTime.seconds}초 ${targetTime.milliseconds}밀리초에 클릭됩니다.`);
            displayRemainingTime(targetDate);
            setTimeout(clickButton, timeDifference);
        } else {
            console.log('목표 시간이 이미 지났습니다. 시간을 다시 설정하세요.');
        }
    };

    const findButton = (selector = buttonSelector) => {
        button = document.querySelector(selector);
        if (button) {
            button.style.outline = '2px solid red';
            button.style.opacity = '1';
            console.log('버튼을 찾았습니다.');
        } else {
            console.log('버튼을 찾을 수 없습니다.');
        }
        return button;
    };

    const whiteListUserCheck = ()=> {
        const userName = document.querySelector('dd').textContent;
        // userName이 whiteList에 포함되어 있는지 확인
        if (!whiteList.includes(userName)) {
            // whiteList에 포함되지 않으면 버튼을 숨김
           button.parentNode.removeChild(button);

            return false;
        }
    };

    const initializeScript = () => {
        window.cbc = (hours, minutes, seconds, milliseconds) => {
            findButton(); // 버튼을 먼저 찾기
           // whiteListUserCheck(); // 인원 검열
            if (hours !== undefined || minutes !== undefined || seconds !== undefined || milliseconds !== undefined) {
                scheduleButtonClick({ hours, minutes, seconds, milliseconds });
            } else {
                console.log('시간이 입력되지 않았습니다. 5초 뒤에 버튼을 클릭합니다.');
                setTimeout(clickButton, 5000); // 5초 후 클릭
            }
        };

        window.findButton = findButton;

        console.log(`
Tampermonkey 스크립트가 로드되었습니다.

사용법:
1. 개발자 도구를 열고 콘솔 탭으로 이동합니다.
2. 'findButton([선택자])'을 호출하여 페이지에서 버튼을 찾고 강조 표시할 수 있습니다. 선택자가 제공되지 않으면 기본적으로 'input[type=submit]' 버튼을 찾습니다.
3. 'cbc(hours, minutes, seconds, milliseconds)'을 호출하여 버튼 클릭을 예약할 수 있습니다.
   시간이 입력되지 않으면 5초 뒤에 버튼이 클릭됩니다.
        `);
    };

    document.addEventListener('DOMContentLoaded', initializeScript);

    window.addEventListener('keydown', function(e) {
        if (e.key === 'F1') {
            e.preventDefault();
            findButton(); // 첫 번째 날짜 클릭
        }else if (e.key === 'F2') {
            e.preventDefault();
            handleF2Press();  // F2 키로 실행
        }
        else if (e.key === 'F3') {
            e.preventDefault();
            handleF3Press();
        }
    });

    const fillFormAndCheck = () => {


        // 생년월일 입력
        const birthInput = document.querySelector('#requiredProperties-birthDate');

        if (birthInput) {
            birthInput.focus();  // 입력 필드에 포커스를 맞추기
            birthInput.value = '1993112';
            birthInput.setAttribute('value', '1993112');
        }

          // 모든 체크박스 클릭
        const checkboxes = document.querySelectorAll('input[type=checkbox]');
        if (checkboxes.length > 0) {
            checkboxes.forEach((checkbox) => {
                if (!checkbox.checked) {
                    checkbox.click();
                }
            });
            console.log(`${checkboxes.length}개의 체크박스를 클릭했습니다.`);
        } else {
            console.log('체크박스를 찾을 수 없습니다.');
        }


    };
      function handleF2Press () {
                  fillFormAndCheck();  // 생년월일 입력 및 체크박스 클릭
        findButton();  // 버튼을 먼저 찾기


    };


     function handleF3Press() {
        const hours = prompt("시간(시)을 입력하세요. 즉시 실행을 원하면 'ㄱㄱ'을 입력하세요.");
        if (hours === 'ㄱㄱ') {
            cbc();
            return;
        }

        const minutes = prompt("분을 입력하세요.") || 0;
        const seconds = prompt("초를 입력하세요.") || 0;
        const milliseconds = prompt("밀리초를 입력하세요.") || 0;

        if (hours !== null && minutes !== null && seconds !== null && milliseconds !== null) {
            cbc(parseInt(hours), parseInt(minutes), parseInt(seconds), parseInt(milliseconds));
        }
    }

      // div 요소 생성 및 스타일 및 HTML 설정
    const fixedDiv = document.createElement('div');
    fixedDiv.style.position = 'fixed';
    fixedDiv.style.top = '70px';
    fixedDiv.style.left = '20px';

    const buttonStyles = `margin: 0 5px; color:white; padding: 2px 4px; border-radius: 4px;`;
    // div 안에 button 요소들 포함
    fixedDiv.innerHTML = `
    <p>둘크립트 동작중...</p>
        <button id="findButton" style="${buttonStyles} background:#2faa24;">find</button>
        <button id="cbcButton" style="${buttonStyles} background:#2437aa;">cbc</button>
       <button id="prayButton" style="${buttonStyles} background:#14e0a9;">기도</button>

            `;

    // 생성한 div를 body에 추가
    document.body.appendChild(fixedDiv);

    // 각 버튼에 이벤트 리스너 할당
    document.getElementById('findButton').addEventListener('click', () => findButton());
    document.getElementById('cbcButton').addEventListener('click', () => handleF3Press());
	document.getElementById("prayButton").addEventListener("click", () => handlePrayButtonClick());
	
	function handlePrayButtonClick() {
		const words = ["제", "발", "당", "첨"];
		const positions = [
			{ top: "10px", left: "10px" }, // 좌상단
			{ top: "10px", right: "10px" }, // 우상단
			{ bottom: "10px", right: "10px" }, // 우하단
			{ bottom: "10px", left: "10px" } // 좌하단
		];
		
		const elements = [];
		
		// 각 글자를 순서대로 표시
		words.forEach((word, index) => {
			setTimeout(() => {
				const element = document.createElement("div");
				element.textContent = word;
				element.style.position = "fixed";
				element.style.fontSize = "100px";
				element.style.fontWeight = "bold";
				element.style.color = "red";
				element.style.zIndex = "9999";
				
				// 위치 설정
				Object.keys(positions[index]).forEach(key => {
					element.style[key] = positions[index][key];
				});
				
				document.body.appendChild(element);
				elements.push(element);
				
				// 마지막 글자가 표시된 후 깜빡임 효과 시작
				if (index === words.length - 1) {
					setTimeout(() => blinkElements(elements), 500);
				}
			}, index * 500); // 0.5초 간격으로 표시
		});
		
		// 깜빡임 효과 함수
		function blinkElements(elements) {
			// 첫 번째 깜빡임
			setTimeout(() => {
				elements.forEach(el => el.style.visibility = "hidden");
				
				// 다시 보이게
				setTimeout(() => {
					elements.forEach(el => el.style.visibility = "visible");
					
					// 두 번째 깜빡임
					setTimeout(() => {
						elements.forEach(el => el.style.visibility = "hidden");
						
						// 다시 보이게
						setTimeout(() => {
							elements.forEach(el => el.style.visibility = "visible");
							
							// 모든 요소 제거
							setTimeout(() => {
								elements.forEach(el => {
									if (el && el.parentNode) {
										el.parentNode.removeChild(el);
									}
								});
							}, 500);
						}, 300);
					}, 300);
				}, 300);
			}, 300);
		}
	}

})();
