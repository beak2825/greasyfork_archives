// ==UserScript==
// @name        [루시퍼홍] 호갱노노 단지 테두리 그리기
// @namespace   Violentmonkey Scripts
// @match       *://hogangnono.com/*
// @grant       none
// @version     1.09
// @author      루시퍼홍
// @description 2024. 5. 3. 오후 14:05:18
// @downloadURL https://update.greasyfork.org/scripts/490141/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%ED%98%B8%EA%B0%B1%EB%85%B8%EB%85%B8%20%EB%8B%A8%EC%A7%80%20%ED%85%8C%EB%91%90%EB%A6%AC%20%EA%B7%B8%EB%A6%AC%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/490141/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%ED%98%B8%EA%B0%B1%EB%85%B8%EB%85%B8%20%EB%8B%A8%EC%A7%80%20%ED%85%8C%EB%91%90%EB%A6%AC%20%EA%B7%B8%EB%A6%AC%EA%B8%B0.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const currentVersion = GM_info.script.version;
    console.log("currentVersion: " + currentVersion);
    const updateUrl = 'https://update.greasyfork.org/scripts/490141/%ED%98%B8%EA%B0%B1%EB%85%B8%EB%85%B8%20%EB%8B%A8%EC%A7%80%20%ED%85%8C%EB%91%90%EB%A6%AC%20%EA%B7%B8%EB%A6%AC%EA%B8%B0.meta.js';
    const cafeUrl = 'https://cafe.naver.com/wecando7/10897351';
    const popupDismissKey = 'scriptUpdatePopupDismissed';
    const dismissDuration = 24 * 60 * 60 * 1000; // 24시간

    // 최신 버전을 가져오기 위해 메타 파일을 가져옴
    fetch(`${updateUrl}?_=${Date.now()}`)
        .then(response => response.text())
        .then(meta => {
            const latestVersionMatch = meta.match(/@version\s+([^\s]+)/);

            if (latestVersionMatch) {
                const latestVersion = latestVersionMatch[1];
                console.log("latestVersion: " + latestVersion);

                if (currentVersion !== latestVersion && !shouldDismissPopup()) {
                    showUpdatePopup(latestVersion);
                }
            }
        })
        .catch(error => {
            console.error('Failed to fetch the latest version information:', error);
        });

    function shouldDismissPopup() {
        const lastDismissTime = localStorage.getItem(popupDismissKey);
        if (!lastDismissTime) return false;

        const timeSinceDismiss = Date.now() - new Date(lastDismissTime).getTime();
        return timeSinceDismiss < dismissDuration;
    }

    function dismissPopup() {
        localStorage.setItem(popupDismissKey, new Date().toISOString());
    }

    function showUpdatePopup(latestVersion) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = 'white';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = '10000';

        const message = document.createElement('p');
        message.innerHTML = `[루시퍼홍] 호갱노노 단지 테두리 그리기의 (${latestVersion}) 버젼 업데이트가 있습니다. 확인하시겠습니까?<br><br>(닫기 버튼을 누르실 경우 24시간 동안 다시 알림이 뜨지 않습니다)<br><br>`;
        popup.appendChild(message);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '확인';
        confirmButton.style.marginRight = '10px';
        confirmButton.onclick = () => {
            window.open(cafeUrl, '_blank');
            document.body.removeChild(popup);
        };
        popup.appendChild(confirmButton);

        const closeButton = document.createElement('button');
        closeButton.textContent = '닫기';
        closeButton.onclick = () => {
            dismissPopup();
            document.body.removeChild(popup);
        };
        popup.appendChild(closeButton);

        document.body.appendChild(popup);
    }
})();

let colorinput;
let colorDiv;
let svgElement;
let svgArray = [];
let savedSvgArray = [];
let svgContainer = document.querySelector("#map-layer > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)");
window.addEventListener('load', function() {
    start();
});


// 키보드 이벤트 리스너를 등록합니다.
document.addEventListener('keydown', function(event) {

	if (event.key === 'Delete') {
		if(svgElement !== ""){


			const existingCloneIndex = svgArray.findIndex(element => element.innerHTML === svgElement.innerHTML);

				const existingClone = svgArray.splice(existingCloneIndex, 1)[0];
				//console.log(existingClone);

				svgElement.style.display = 'none';

				svgElement = ""; // 이 부분은 필요 없어집니다.

				// 모든 클론이 삭제되었으므로 svgElement도 빈 문자열로 설정합니다.
				svgArray = [];

		}
	}
});

function drawBorder(){
	//console.log("drawBorder 실행");

	let svgElements1 = Array.from(document.querySelector("#map-layer > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)").getElementsByTagName("svg:svg"));
	for (let i = 0; i < svgElements1.length; i++) {
		 svgElements1[i].style.display = "none";
	}

	svgArray.forEach(function(svgElement) {
		document.querySelector("#map-layer > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)").appendChild(svgElement);
	});
	//console.log("svgArray 다시 그리기");
}

function pushSvgArray() {


    let svgElements1 = Array.from(document.querySelector("#map-layer > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)").getElementsByTagName("svg:svg"));

    // 현재 SVG 요소를 저장할 새로운 배열
    svgArray = [];

    // 새로운 SVG 요소를 저장할 배열에 필터링된 요소 추가
    for (let i = 0; i < svgElements1.length; i++) {
        const svgElement = svgElements1[i];
        const pathElements = svgElement.querySelectorAll("path");
        let hasDesiredFill = false;
        pathElements.forEach(function(pathElement) {
            if (pathElement.style.fill !== 'rgb(79, 177, 122)') {
                hasDesiredFill = true;
            }
        });
        if (svgElement.style.cursor !== "pointer" && svgElement.style.cursor !== "events" && hasDesiredFill && svgElement.style.display !== "none") {
            const clone = svgElement.cloneNode(true);

			// 중복을 확인하여 추가하는 로직 추가
			if (!svgArray.some(element => element.innerHTML === clone.innerHTML)) {
				svgArray.push(clone);
				//console.log("svgArray 초기화 하고 추가");
				//svgArray.forEach(element => console.log(element.innerHTML));
				// 클론에 클릭 이벤트 리스너 추가
				clone.addEventListener('click', function() {
					colorChange(clone);
				});
			}
        }
    }

    deletedong();
}
function colorChange(lastSvgElement) {
    svgElement = lastSvgElement;

    showPanel();

    // 색상 입력 처리
    colorInput.addEventListener('input', function(event) {
        const enteredColor = event.target.value;
        const pathElements = svgElement.querySelectorAll('path');
        pathElements.forEach(function(pathElement) {
            pathElement.style.fill = enteredColor;
            pathElement.style.fillOpacity = opacityInput.value || "0.3"; // 입력된 opacity가 없으면 기본값 0.3 적용
        });
        pushSvgArray();
    });

    // opacity 입력 처리
    opacityInput.addEventListener('input', function(event) {
        const enteredOpacity = event.target.value;
        const pathElements = svgElement.querySelectorAll('path');
        pathElements.forEach(function(pathElement) {
            pathElement.style.fillOpacity = enteredOpacity; // 입력된 투명도 값을 적용
        });
        pushSvgArray();
    });

    // 작은 정사각형에 대한 클릭 이벤트 리스너 등록
    document.querySelectorAll('.small-square').forEach(function(square) {
        square.addEventListener('click', function(event) {
            const backgroundColor = rgbToHex(event.target.style.backgroundColor);
            const pathElements = svgElement.querySelectorAll('path');
            pathElements[0].style.fill = backgroundColor;
            pathElements[0].style.fillOpacity = opacityInput.value || "0.3"; // 입력된 opacity가 없으면 기본값 0.3 적용
            colorInput.value = backgroundColor; // 클릭한 색상을 colorInput에 반영
            //opacityInput.value = currentFillOpacity; // 현재 투명도를 opacityInput에 설정
            pushSvgArray();
        });
    });
}

function deletedong(){
        const svgContainer2 = document.querySelector("#map-layer > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)");
        const svgElements2 = Array.from(svgContainer2.getElementsByTagName("svg:svg"));
        for (let i = 0; i < svgElements2.length; i++) {
            const svgElement = svgElements2[i];
            if (svgElement.style.cursor === "pointer") {
                svgElement.style.visibility = "hidden"
            }
        }

        var dong = document.querySelectorAll("div[data-type='dong']");
        dong.forEach(function(apt) {
            apt.style.display = 'none';
        });

        var enterance = document.querySelectorAll("div[data-type='enterance']");
        enterance.forEach(function(apt) {
            apt.style.display = 'none';
        });
    }



function rgbToHex(rgb) {
			// RGB 값을 가져옵니다. 'rgb(255, 255, 255)' 형식을 가정합니다.
			const rgbArray = rgb.match(/\d+/g);
			// R, G, B 값을 16진수로 변환하여 헥사코드로 합칩니다.
			const hex = "#" + ((1 << 24) + (parseInt(rgbArray[0]) << 16) + (parseInt(rgbArray[1]) << 8) + parseInt(rgbArray[2])).toString(16).slice(1);
			return hex;
		}

function closeDiv(){

			// 모든 colorInput 요소를 찾아서 안 보이게 처리
	document.querySelectorAll('.color-input').forEach(function(colorInput) {
		colorInput.style.display = 'none';
	});

	// 모든 colorDiv 요소를 찾아서 안 보이게 처리
	document.querySelectorAll('.color-div').forEach(function(colorDiv) {
		colorDiv.style.display = 'none';
	});

  document.querySelectorAll('.opacity-input').forEach(function(opacityInput) {
		opacityInput.style.display = 'none';
	});
	pushSvgArray();
}

function showPanel() {
    // svgElement의 현재 색상을 가져와 colorInput에 반영
    const pathElements = svgElement.querySelectorAll('path');
    if (pathElements.length > 0) {
        const currentFillColor = pathElements[0].style.fill;
        colorInput.value = rgbToHex(currentFillColor); // 현재 배경색을 colorInput에 설정
    }

    // 패널을 보여줄 때 색상 입력 위치 설정
    colorInput.style.left = `${event.clientX}px`;
    colorInput.style.top = `${event.clientY}px`;
    colorInput.style.display = 'block';

    // opacity 입력 위치 설정
    opacityInput.style.left = `${event.clientX}px`;
    opacityInput.style.top = `${event.clientY + 30}px`; // colorInput 바로 아래에 배치
    opacityInput.style.display = 'block';

    // colorDiv 위치 설정
    colorDiv.style.left = `${event.clientX}px`;
    colorDiv.style.top = `${event.clientY + 60}px`; // opacityInput 바로 아래에 배치
    colorDiv.style.display = 'block';

    opacityInput.value = ""; // 초기화
}


function start(){
    document.addEventListener("contextmenu", function(event) {
		//console.log("우클릭");
		var apt = document.querySelectorAll("div[data-type='apt']");
		var allNone = false; // none인 요소가 하나라도 있는지 확인하는 플래그
		var anyBlock = false;

		apt.forEach(function(apt) {
			if(apt.style.display !== 'none') {
				anyBlock = true;
			}
		});

		if(anyBlock){
			apt.forEach(function(apt) {
				apt.style.display = 'none'
			});
		}else{
			apt.forEach(function(apt) {
				apt.style.display = 'block'
			});
		}

		//console.log("우클릭"+anyBlock);


		//지하철역 숨기기
		var hideElements = document.querySelectorAll("div.poi.convenience.subway.simple");

		// 선택된 모든 div 요소를 숨김 처리
		hideElements.forEach(function(div) {
			div.style.display = "none";
		});

		// ktx역 숨기기
		var parentElement = document.querySelectorAll("div.poi.convenience.ktx.simple");
		// 선택된 모든 div 요소를 숨김 처리
		parentElement.forEach(function(div) {
			div.style.display = "none";
		});


		//오피스텔 숨기기
		var parentElements = document.querySelectorAll("div[class*='officetel']");

		// 선택된 모든 div 요소를 숨김 처리
		parentElements.forEach(function(div) {
			div.style.display = "none";
		});

		//법정/행정동 지우기
		var parentElements = document.querySelectorAll("div[class*='cluster']");

		// 선택된 모든 div 요소를 숨김 처리
		parentElements.forEach(function(div) {
			div.style.display = "none";
		});

		//버스 정류장 숨기기
		var parentElements = document.querySelectorAll("div[class*='bus']");

		// 선택된 모든 div 요소를 숨김 처리
		parentElements.forEach(function(div) {
			div.style.display = "none";
		});

		// 하나로마트 숨기기
		var parentElement = document.querySelectorAll("div.poi.convenience.department-store.simple");
		// 선택된 모든 div 요소를 숨김 처리
		parentElement.forEach(function(div) {
			var descElement = div.querySelector("div.desc");

			// 만약 텍스트가 '하나로마트'이면 부모 요소를 숨김 처리
			if (descElement && descElement.textContent.trim() === '하나로마트') {
				div.style.display = 'none';
			}

		});

	});

	var apt = document.querySelectorAll("div[data-type='apt']");
	apt.forEach(function(apt) {
		apt.addEventListener('click', function() {
						//console.log("아파트 클릭");
						drawBorder();

		});
	});



  // 마우스 클릭 이벤트를 추가하여 패널 영역 외부 클릭 시 패널 숨김
document.addEventListener('mouseup', function(event) {
    // 클릭된 위치
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // 각 패널의 위치와 크기를 구합니다.
    const inputRect = colorInput.getBoundingClientRect();
    const divRect = colorDiv.getBoundingClientRect();
    const opacityRect = opacityInput.getBoundingClientRect();

    // 마우스가 패널 안에 있는지 확인합니다.
    const isInsideColorInput = mouseX >= inputRect.left && mouseX <= inputRect.right && mouseY >= inputRect.top && mouseY <= inputRect.bottom;
    const isInsideOpacityInput = mouseX >= opacityRect.left && mouseX <= opacityRect.right && mouseY >= opacityRect.top && mouseY <= opacityRect.bottom;
    const isInsideColorDiv = mouseX >= divRect.left && mouseX <= divRect.right && mouseY >= divRect.top && mouseY <= divRect.bottom;

    // 패널 외부 클릭 시 패널 숨기기
    if (!isInsideColorInput && !isInsideOpacityInput && !isInsideColorDiv) {
        closeDiv();
    }
  deletedong();
});

    var parentElement = document;

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(addedNode) {
                    if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.dataset && addedNode.dataset.type === 'apt') {
                        //addedNode.addEventListener('click', drawBorder);
						addedNode.addEventListener('click', function() {
							//console.log("svg 클릭");
							drawBorder();
						});
                    }
                });
            }
        });
    });

    var observerConfig = {
        childList: true,
        subtree: true
    };

    observer.observe(parentElement, observerConfig);


	//신규 경계 감지
	var observer2 = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach(function(addedNode) {
					if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.tagName === "svg:svg") {
						const svgElement = addedNode;
						const pathElements = svgElement.querySelectorAll("path");
						let hasDesiredFill = false;
						pathElements.forEach(function(pathElement) {
							if (pathElement.style.fill !== 'rgb(79, 177, 122)') {
								hasDesiredFill = true;
							}
						});
						if (svgElement.style.cursor !== "pointer" && svgElement.style.cursor !== "events" && hasDesiredFill) {

							svgElement.addEventListener('click', function() {

								colorChange(svgElement);
							});


						}
					}
				});
			}
		});
	});

	// MutationObserver 설정
	var observerConfig = {
		childList: true,
		subtree: true
	};

	// MutationObserver를 사용하여 DOM 변경 감지 시작
	observer2.observe(document.body, observerConfig);





	function colorPanelSet() {
    // 기존 colorInput 설정
    colorInput = document.createElement('input');
    colorInput.type = 'text';
    colorInput.className = 'color-input';
    colorInput.style.position = 'absolute';
    colorInput.style.display = 'none';
    colorInput.style.border = '1px solid black';
    colorInput.placeholder = '색상값 입력 #000000';
    document.body.appendChild(colorInput);

    // 새로운 opacityInput 설정
    opacityInput = document.createElement('input');
    opacityInput.type = 'text';
    opacityInput.className = 'opacity-input';
    opacityInput.style.position = 'absolute';
    opacityInput.style.display = 'none';
    opacityInput.style.border = '1px solid black';
    opacityInput.placeholder = '투명도 입력 (0.0 - 1.0)';
    document.body.appendChild(opacityInput);

    // 기존 colorDiv 설정
    colorDiv = document.createElement('div');
    colorDiv.className = 'color-div';
    colorDiv.style.position = 'absolute';
    colorDiv.style.display = 'none';
    document.body.appendChild(colorDiv);

    const colors = ['#000000', '#454648', '#474C4F', '#FF0000', '#FF6600', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#000099', '#7030A0', '#CC3399', '#FF66CC'];

    for (let j = 0; j < 2; j++) { // 2개의 행
        for (let k = 0; k < 7; k++) { // 7개의 열
            const smallSquare = document.createElement('div');
            smallSquare.className = 'small-square';
            smallSquare.style.width = '70px';
            smallSquare.style.height = '70px';
            smallSquare.style.backgroundColor = colors[j * 7 + k];
            smallSquare.style.float = 'left';
            smallSquare.style.border = '2px solid black';
            colorDiv.appendChild(smallSquare);
        }
        const breakLine = document.createElement('br');
        colorDiv.appendChild(breakLine);
    }
}
	colorPanelSet();
}
