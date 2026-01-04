// ==UserScript==
// @name        [루시퍼홍]시세지도 만들기
// @namespace   Violentmonkey Scripts
// @match       https://new.land.naver.com/complexes*
// @grant       none
// @version     1.02
// @author      -
// @description 2024. 3. 10. 오전 9:57:03
// @downloadURL https://update.greasyfork.org/scripts/490406/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%EC%8B%9C%EC%84%B8%EC%A7%80%EB%8F%84%20%EB%A7%8C%EB%93%A4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/490406/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%EC%8B%9C%EC%84%B8%EC%A7%80%EB%8F%84%20%EB%A7%8C%EB%93%A4%EA%B8%B0.meta.js
// ==/UserScript==
var resultArray = [];
var targetElement = "";
var targetElementX = ""
var targetElementY = ""
var isRightClicking = false;
var leavEventYn = false;


window.addEventListener('load', function() {
	start();
});


function start(){
	opserver();
	css_yeonsik_install();
	css_price_install();
	add_price_checkbox();
	setTimeout(function() {
           labelFont();
        }, 2000); // 3초 후에 overlay 숨김

}

function labelLeaveEvent(){
	if(!leavEventYn){
		console.log("labelLeaveEvent 실행");
		document.querySelectorAll('[class*="marker_complex--apart"]').forEach(function(element) {
			//console.log(element.id);
			element.addEventListener('mouseleave', function(event) {
				console.log(element.id);
				processComplex(element.id);
			});
			labelMovement(element.id);
		});
		leavEventYn = true;
	}

}


var mapWrap = document.querySelector('.map_panel');

mapWrap.addEventListener('mouseup', function(e) {

	if (isRightClicking && e.button === 0) { // 왼쪽 클릭일 때
			//console.log(targetElement);
			var complexElement = document.getElementById(targetElement)

			// 마우스 우클릭한 위치로 이동
			//console.log(targetElement);
			//console.log(e.pageX - targetElementX + "px");
			//console.log(e.pageX - targetElementY + "px");
			var complexElementWidth = complexElement.offsetWidth
			//console.log("complexElementWidth : "+complexElementWidth);
			complexElement.style.left = e.pageX - targetElementX + complexElementWidth / 2 +  "px";
			complexElement.style.top = e.pageY - targetElementY - complexElement.offsetHeight +  "px";
			//complexElement.style.left = e.pageX + "px";
			//complexElement.style.left = window.pageXOffset + "px"
			//complexElement.style.top = window.pageYOffset + "px";
			//complexElement.style.left = e.pageX  + "px";
			//complexElement.style.top = e.pageY  + "px";
			// 플래그와 저장된 위치 초기화
			isRightClicking = false;
			targetElementX = null;
			targetElementY = null;
	}else if(e.button === 0){
		if (!event.target.classList.contains('complex_data_button') && !event.target.classList.contains('marker_transparent') && !event.target.classList.contains('complex_quantity')) {
			executeAll();
		}
	}
});

// 키보드 이벤트 리스너를 등록합니다.
document.addEventListener('keydown', function(event) {

	if(isRightClicking){

		var complexElement = document.getElementById(targetElement)
		// 이동 거리를 지정합니다.
		const moveDistance = 10; // 이동 거리를 조정할 수 있습니다.

		// 왼쪽으로 이동
		if (event.key === 'a' || event.key === 'A' || event.key === 'ㅁ') {
			complexElement.style.left = parseInt(complexElement.style.left) - moveDistance + 'px';
		}
		// 오른쪽으로 이동
		else if (event.key === 'd' || event.key === 'D' || event.key === 'ㅇ') {
			complexElement.style.left = parseInt(complexElement.style.left) + moveDistance + 'px';
		}
		// 위로 이동
		else if (event.key === 'w' || event.key === 'W' || event.key === 'ㅈ') {
			complexElement.style.top = parseInt(complexElement.style.top) - moveDistance + 'px';
		}
		// 아래로 이동
		else if (event.key === 's' || event.key === 'S' || event.key === 'ㄴ') {
			complexElement.style.top = parseInt(complexElement.style.top) + moveDistance + 'px';
		}
		else if (event.key === 'Escape') {
			isRightClicking = false;
		}
		else if (event.key === 'Delete') {
        // complexElement를 화면에서 삭제합니다.
			//console.log("complexElement :"+complexElement);
			 complexElement.style.display = 'none';
			isRightClicking = false;
			targetElement = "";
		}
	}
});




function executeAll(){
	console.log("executeAll 실행");
	document.querySelectorAll('[class*="marker_complex--apart"]').forEach(function(element) {
		//console.log(element.id);
		processComplex(element.id);
	});

	if(document.querySelector('#show_purpleDel_check').checked){
		//단지 임장 전용일때 대상이 아니면 화면에서 안보이게 처리
		document.querySelectorAll('[class^="marker_complex--apart"]:not([class*="marker_complex--apart_"])').forEach(function(element) {
		// 요소 처리 작업을 진행한 후
			// 요소 숨기기
			element.style.display = "none"; // 화면에서 요소를 숨깁니다.
		});
	}

	if(document.querySelector('#show_school_check').checked){
		setTimeout(function() {
			try {
				var tooltipElements = document.querySelectorAll('.tooltip_map_school');

				tooltipElements.forEach(function(element) {
					element.style.display = 'block';
				});
			} catch (error) {
				console.error('Failed to show tooltip elements:', error);
			}
		}, 500);
	}

}


//상단 메뉴 구성
function add_price_checkbox(){
    var newDiv = document.createElement("div");
    newDiv.className = "filter_group filter_group--size";
    newDiv.style.margin = "6px 10px 0px 0px";

	/* 학군 전체 보이게 하기 */
	var checkboxInput = document.createElement("input");
	checkboxInput.type = "checkbox";
	checkboxInput.id = "show_school_check";
	checkboxInput.className = "checkbox_input";
	checkboxInput.checked = true;

	// 새로운 label 요소 생성
	var label1 = document.createElement("label");
	label1.textContent = "전체 학교 표시";
	label1.setAttribute("for", "show_school_check");
	label1.className = "checkbox_label";
	label1.style.width = "120px"

	/* 보라색 지우기 */
	var checkboxInput3 = document.createElement("input");
	checkboxInput3.type = "checkbox";
	checkboxInput3.id = "show_purpleDel_check";
	checkboxInput3.className = "checkbox_input";
	//checkboxInput2.checked = true;
	checkboxInput3.checked = false;

	// 새로운 label 요소 생성
	var label3 = document.createElement("label");
	label3.textContent = "보라색 지우기";
	label3.setAttribute("for", "show_purpleDel_check");
	label3.className = "checkbox_label";
	label3.style.width = "120px"

	/* 단지임장 전용 */
	var checkboxInput2 = document.createElement("input");
	checkboxInput2.type = "checkbox";
	checkboxInput2.id = "show_infOnly_check";
	checkboxInput2.className = "checkbox_input";
	//checkboxInput2.checked = true;
	checkboxInput2.checked = false;

	// 새로운 label 요소 생성
	var label2 = document.createElement("label");
	label2.textContent = "단지임장 전용";
	label2.setAttribute("for", "show_infOnly_check");
	label2.className = "checkbox_label";
	label2.style.width = "120px"

    var textareaButton = document.createElement("button");
    textareaButton.textContent = "입력창 보기";
    textareaButton.style.backgroundColor = "red";
    textareaButton.style.color = "white";
    textareaButton.style.display = "inline-block";
    textareaButton.id = "textareaButton";
    textareaButton.onclick = toggleTextarea;

    var createFunctionButton = document.createElement("button");
    createFunctionButton.textContent = "코드 실행하기";
    createFunctionButton.style.backgroundColor = "blue";
    createFunctionButton.style.color = "white";
    createFunctionButton.style.display = "none"; // 초기에는 숨김
    createFunctionButton.id = "createFunctionButton";
    createFunctionButton.onclick = processInputFromTextarea;

    var space = document.createElement("span");
    space.textContent = " "; // 버튼 사이 공백 추가

    var textarea = document.createElement("textarea");
    textarea.id = "jsCode";
    textarea.rows = "10";
    textarea.cols = "150";

	textarea.value = ``;

    textarea.style.display = "none"; // 초기에는 숨김
    textarea.style.border = "1px solid #ccc";
    textarea.style.marginTop = "5px";

    newDiv.appendChild(checkboxInput);
    newDiv.appendChild(label1);
    newDiv.appendChild(checkboxInput3);
    newDiv.appendChild(label3);
    newDiv.appendChild(checkboxInput2);
    newDiv.appendChild(label2);
    newDiv.appendChild(textareaButton);
    newDiv.appendChild(space);
    newDiv.appendChild(createFunctionButton);
    newDiv.appendChild(textarea);

    var parentDiv = document.querySelector("#filter > div");
    parentDiv.appendChild(newDiv);
}

function toggleTextarea() {
    var textarea = document.getElementById("jsCode");
    var textareaButton = document.getElementById("textareaButton");
    var createFunctionButton = document.getElementById("createFunctionButton");
    if (textarea.style.display === "none") {
        textarea.style.display = "block";
        textareaButton.textContent = "입력창 닫기";
        createFunctionButton.style.display = "inline-block"; // 입력창 열릴 때만 보이게
    } else {
        textarea.style.display = "none";
        textareaButton.textContent = "입력창 보기";
        createFunctionButton.style.display = "none"; // 입력창 닫힐 때는 숨김
    }
}


function processInputFromTextarea() {
    var textarea = document.getElementById("jsCode");
    var inputText = textarea.value;
    inputArray(inputText);
}

function inputArray(inputText) {

// 입력된 텍스트를 가져와서 줄 단위로 분할합니다.
	var text = document.getElementById("jsCode").value;
	var lines = text.split("\n");

	// 결과를 저장할 배열을 초기화합니다.
	resultArray = [];

	// 각 줄에 대해 반복하여 처리합니다.
	for (var i = 0; i < lines.length; i++) {
		// 쉼표를 기준으로 각 줄을 분할하여 임시 배열에 저장합니다.
		var tempArray = lines[i].split(",");

		// 임시 배열을 결과 배열에 추가합니다.
		resultArray.push(tempArray);
	}
	setTimeout(function() {
		   //console.log("executeAll");
           executeAll();
		   labelLeaveEvent();

    }, 1500); // 3초 후에 overlay 숨김
	// 결과 배열을 콘솔에 출력합니다.
	//console.log(resultArray);
}
function labelMovement(complexId){
	//isRightClicking = false; // 우클릭 여부를 나타내는 플래그

	var complexElement = document.getElementById(complexId);
	complexElement.addEventListener("mouseup", function(e) {
		if (e.button === 2) { // 우클릭일 때

			isRightClicking = true; // 우클릭 플래그를 true로 설정
			console.log("isRightClicking :"+isRightClicking);
			targetElement = complexId;
			// 우클릭한 위치를 저장
			targetElementX = e.pageX - complexElement.offsetLeft;
			targetElementY = e.pageY - complexElement.offsetTop;
			
		}
	});



}

function opserver(){
	try {
		var parentElement = document.querySelector('.map_wrap');

		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				// 추가된 노드의 클래스를 확인하여 조건이 맞으면 execute() 함수를 호출합니다.
				if (mutation.addedNodes.length > 0) {
					mutation.addedNodes.forEach(function(addedNode) {
						// 추가된 노드가 HTMLElement인지 확인합니다.
						if (addedNode.nodeType === 1 && addedNode.classList.contains('marker_complex--apart')) {
							//console.log("추가됨");
							//addEventListener(addedNode);
							if(document.getElementById("jsCode").value.trim() !== ""){
								//aptList();


								labelMovement(addedNode.id);
								processComplex(addedNode.id);

								addedNode.addEventListener('mouseleave', function(event) {
									//console.log("301");
									processComplex(addedNode.id);
								});
							}
							return;
						}
					});
				}
			});
		});


		// MutationObserver를 설정하여 새로운 자식 노드의 추가를 감시합니다.
		var observerConfig = {
			childList: true,
			subtree: true
		};

		observer.observe(parentElement, observerConfig);
	} catch (e) {

		return;
	}

	//학군누르면 모든 학교 라벨 보이게 하기
	var mapControlSchool = document.querySelector('.map_control--school');
	if (mapControlSchool) {
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {

				if (mutation.attributeName === 'aria-pressed') {

					if (mapControlSchool.getAttribute('aria-pressed') === 'true') {

						if(document.querySelector('#show_school_check').checked){

							//console.log("학군 체크박스 선택");
							setTimeout(function() {
								try {
									var tooltipElements = document.querySelectorAll('.tooltip_map_school');

									tooltipElements.forEach(function(element) {
										element.style.display = 'block';
									});
								} catch (error) {
									console.error('Failed to show tooltip elements:', error);
									// 오류 처리
								}
							}, 500);
						}else{

						}

					}else{

					}
				}
			});
		});

		var observerConfig = { attributes: true };

		observer.observe(mapControlSchool, observerConfig);
	} else {
		console.error('map_control--school 클래스를 가진 요소를 찾을 수 없습니다.');
	}
	//console.log("옵저버 실행");
}

function processComplex(complex) {
    // 주어진 텍스트를 줄 단위로 분할하여 배열을 만듭니다.
     // 결과 배열을 순회하며 complex와 비교하여 해당하는 배열을 찾습니다.
	//console.log("405라인 : "+complex);
	//console.log(resultArray);
    for (var i = 0; i < resultArray.length; i++) {
        var values = resultArray[i];
		//console.log(values[0]);
		//console.log(complex);
        if (values[0].replace(/"/g, '') === complex) {
            // 배열의 각 요소를 변수에 저장합니다.
            var classNm = values[1].replace(/"/g, '');
            var title = values[2].replace(/"/g, '');
            var aptNm = values[3].replace(/"/g, '');
            var salePrice = values[4].replace(/"/g, '');
            var rentPrice = values[5].replace(/"/g, '');
            var RATE = values[6].replace(/"/g, '');
            var PERSIZE = values[7].replace(/"/g, '');
            var maxPriceDown = values[8].replace(/"/g, '');
            var maxPrice = values[9].replace(/"/g, '');



            // marketPrice 함수를 호출합니다.
            marketPrice(complex, classNm, title, aptNm, salePrice, rentPrice, RATE, PERSIZE, maxPriceDown, maxPrice);
            break; // 일치하는 항목을 찾았으므로 더 이상 반복할 필요가 없습니다.
        }
    }
}



function marketPrice(complex, classNm, title, aptNm, salePrice, rentPrice, RATE, PERSIZE, maxPriceDown, maxPrice ){

	if(document.querySelector('#show_infOnly_check').checked){


		try{
			var complexElement = document.getElementById(complex);
			if (complexElement) {
				const classesToRemove = Array.from(complexElement.classList).filter(className => className.startsWith('marker_complex--apart'));
							classesToRemove.forEach(className => {
								complexElement.classList.remove(className);
							});

				complexElement.classList.add("marker_complex--apart_"+classNm);
				var featureElement = complexElement.querySelector(".complex_feature.is-feature_default");
				if (featureElement) {
					//featureElement.textContent = title;
					//featureElement.innerHTML = `${aptNm}<br>${title}`;
					featureElement.innerHTML = `${aptNm}<br><span class="title">${title}</span>`;
					featureElement.style.textAlign = "center"; // 가운데 정렬 스타일 추가
					//featureElement.style.margin = "10px 0"; // 위아래 10px 마진
					featureElement.style.lineHeight = "1.5";
					//featureElement.style.fontSize = "10px"; // 글씨체 설정
					featureElement.style.fontFamily = "HY헤드라인M, sans-serif"; // 글씨체 설정
				}
				var complexPrice = complexElement.querySelector(".complex_price");
				if (complexPrice) {
					complexPrice.style.textAlign = "center";
				}
				var complexInfo = complexElement.querySelector(".complex_price_wrap .complex_price .type");
				complexInfo.textContent = "";
				complexInfo.style.textAlign = "center"; // 텍스트 가운데 정렬
				complexInfo.style.width = "140px"; // 가로 길이를 complexElement의 길이보다 3px 작게 설정
				complexInfo.style.display = "none";

				var elementToReplace = complexElement.querySelector('div.marker_complex_inner > div.complex_infos > div.complex_price_wrap > div > span.price_default');
				elementToReplace.style.display = "none";


				var sizeElement = complexElement.querySelector(".complex_size-default");
				var table = document.createElement("table");

				var row1 = table.insertRow();
				var cell1_1 = row1.insertCell(0);
				var cell1_2 = row1.insertCell(1);
				var cell1_3 = row1.insertCell(2);
				cell1_1.textContent = "";
				cell1_2.textContent = salePrice; 
				cell1_3.textContent = rentPrice;

				var row2 = table.insertRow();
				var cell2_1 = row2.insertCell(0);
				var cell2_2 = row2.insertCell(1);
				var cell2_3 = row2.insertCell(2);
				cell2_1.textContent = "";
				cell2_2.textContent = RATE;
				cell2_3.textContent = PERSIZE;

				var cells = table.querySelectorAll("td");
				cells.forEach(function(cell) {
				cell.style.paddingLeft = "5px"; // 셀 왼쪽에만 여백 5px
				cell.style.paddingRight = "5px"; // 셀 오른쪽에만 여백 5px
				cell.style.textAlign = "right"; // 셀 내용 오른쪽 정렬
				});

				// 테이블을 sizeElement에 추가
				var sizeElement = complexElement.querySelector(".complex_size-default");
				sizeElement.innerHTML = ''; // 기존 내용 지우기
				sizeElement.appendChild(table);

				//라벨 움직이기
				var isDragging = false;
				var offsetX, offsetY;


			}
		} catch (e) {
				//console.error(e);
				console.log(complex+" "+aptNm+" 오류");
				return;
		}
	}else{


		try{
			var complexElement = document.getElementById(complex);
			if (complexElement) {
				const classesToRemove = Array.from(complexElement.classList).filter(className => className.startsWith('marker_complex--apart'));
							classesToRemove.forEach(className => {
								complexElement.classList.remove(className);
							});

				complexElement.classList.add("marker_complex--apart_"+classNm);
				var featureElement = complexElement.querySelector(".complex_feature.is-feature_default");
				if (featureElement) {
					//featureElement.textContent = title;
					//featureElement.innerHTML = `${aptNm}<br>${title}`;
					featureElement.innerHTML = `${aptNm}<br><span class="title">${title}</span>`;
					featureElement.style.textAlign = "center"; // 가운데 정렬 스타일 추가
					//featureElement.style.margin = "10px 0"; // 위아래 10px 마진
					featureElement.style.lineHeight = "1.5";
					//featureElement.style.fontSize = "10px"; // 글씨체 설정
					featureElement.style.fontFamily = "HY헤드라인M, sans-serif"; // 글씨체 설정
				}
				var complexPrice = complexElement.querySelector(".complex_price");
				if (complexPrice) {
					complexPrice.style.textAlign = "center";
				}
				var complexInfo = complexElement.querySelector(".complex_price_wrap .complex_price .type");
				complexInfo.textContent = "";
				complexInfo.style.textAlign = "center"; // 텍스트 가운데 정렬
				complexInfo.style.width = "140px"; // 가로 길이를 complexElement의 길이보다 3px 작게 설정
				complexInfo.style.display = "none";

				var elementToReplace = complexElement.querySelector('div.marker_complex_inner > div.complex_infos > div.complex_price_wrap > div > span.price_default');
				elementToReplace.style.display = "none";


				var sizeElement = complexElement.querySelector(".complex_size-default");
				var table = document.createElement("table");


                var row1 = table.insertRow();
				var cell1_1 = row1.insertCell(0);
				var cell1_2 = row1.insertCell(1);
				var cell1_3 = row1.insertCell(2);
                var cell1_4 = row1.insertCell(3);

				//cell1_2.textContent = salePrice; //20평대 평수
				//cell1_3.textContent = rentPrice;
                cell1_1.textContent = "";
                cell1_2.textContent = "매매";
                cell1_3.textContent = "전세금";
                cell1_4.textContent = "투자금";

				var row2 = table.insertRow();
				var cell2_1 = row2.insertCell(0);
				var cell2_2 = row2.insertCell(1);
                var cell2_3 = row2.insertCell(2);
				var cell2_4 = row2.insertCell(3);
				//var cell2_3 = row2.insertCell(2);
				cell2_1.textContent = "전고점";
				cell2_2.textContent = maxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');;
				cell2_3.textContent = "";
                cell2_4.textContent = "";

                var row3 = table.insertRow();
				var cell3_1 = row3.insertCell(0);
				var cell3_2 = row3.insertCell(1);
                var cell3_3 = row3.insertCell(2);
				var cell3_4 = row3.insertCell(3);

                const now = new Date();
                const year = now.getFullYear().toString().slice(-2).padStart(2, '0');
                const month = (now.getMonth() + 1).toString().padStart(2, '0');

                const formattedDate = `${year}.${month}`;

				//var cell2_3 = row2.insertCell(2);
				cell3_1.textContent = formattedDate;
				cell3_2.textContent = salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');;
				cell3_3.textContent = rentPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');;
                cell3_4.textContent = PERSIZE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');;


                var row4 = table.insertRow();
				var cell4_1 = row4.insertCell(0);
				var cell4_2 = row4.insertCell(1);
                var cell4_3 = row4.insertCell(2);
				var cell4_4 = row4.insertCell(3);

				cell4_1.textContent = "";
				cell4_2.textContent = maxPriceDown;
				cell4_3.textContent = "";
                cell4_4.textContent = RATE;


                var rows = table.querySelectorAll("tr");
                rows.forEach(function(row, index) {
                    var cells = row.querySelectorAll("td");
                    if (index === 0) {
                        // 첫 번째 행일 경우 가운데 정렬
                        cells.forEach(function(cell) {
                            cell.style.textAlign = "center";
                            cell.style.paddingLeft = "5px"; // 셀 왼쪽에만 여백 5px
					        cell.style.paddingRight = "5px"; // 셀 오른쪽에만 여백 5px
                        });
                    } else {
                        // 나머지 행은 오른쪽 정렬
                        cells.forEach(function(cell) {
                            cell.style.textAlign = "right";
                            cell.style.paddingLeft = "5px"; // 셀 왼쪽에만 여백 5px
					        cell.style.paddingRight = "5px"; // 셀 오른쪽에만 여백 5px
                        });
                    }
                });


				// 테이블을 sizeElement에 추가
				var sizeElement = complexElement.querySelector(".complex_size-default");
				sizeElement.innerHTML = ''; // 기존 내용 지우기
				sizeElement.appendChild(table);

				//라벨 움직이기
				var isDragging = false;
				var offsetX, offsetY;

			}
		} catch (e) {
				//console.error(e);
				console.log(complex+" "+aptNm+" 오류");
				return;
		}
	}

}




function labelFont(){
		// CSS 코드를 문자열로 저장합니다.
	var cssCode = `
		/* 스타일은 CSS로 정의 */
		#overlay {
			display: none;
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
			z-index: 9999;
		}

		#overlay div {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 500px;
			height: 239px;
			background-color: white;
			text-align: center;
		}

		.marker_complex--apart_red .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: #FC541B;
		}

		.marker_complex--apart_red .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_blue .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #FFF;
			background-color: #3F24D6;
		}

		.marker_complex--apart_blue .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_gray .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #FFF;
			background-color: #5C6268;
		}

		.marker_complex--apart_gray .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_purple .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #222;
			background-color: #fff;
		}

		.marker_complex--apart_purple .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #FFF;
		}

		.marker_complex--apart_yellow .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #474C4F;
			background-color: rgb(255, 255, 0);

		}

		.marker_complex--apart_yellow .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_yellow .complex_infos {
			overflow: hidden;
			position: relative;
			height: 100%;
			padding: 2px 7px 4px 5px;
			font-size: 10px;
			letter-spacing: -0.5px;
			text-align: left;
			vertical-align: top;
			color: #000000;
		}

		.marker_complex--apart_3 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgb(0, 0, 0);
		}

		.marker_complex--apart_3 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_4 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgb(55, 58, 61);
		}

		.marker_complex--apart_4 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_5 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgb(96, 103, 108);
		}

		.marker_complex--apart_5 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_6 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgb(255, 0, 0);
		}

		.marker_complex--apart_6 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_7 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgb(255, 102, 0);
		}

		.marker_complex--apart_7 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_8 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #474C4F;
			background-color: rgb(255, 255, 0);
		}

		.marker_complex--apart_8 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_8 .complex_infos {
			overflow: hidden;
			position: relative;
			height: 100%;
			padding: 2px 7px 4px 5px;
			font-size: 10px;
			letter-spacing: -0.5px;
			text-align: left;
			vertical-align: top;
			color: #000000;
		}

		.marker_complex--apart_9 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgb(146, 208, 80);
		}

		.marker_complex--apart_9 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_10 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgb(0, 176, 80);
		}

		.marker_complex--apart_10 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_11 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgb(0, 176, 240);
		}

		.marker_complex--apart_11 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_12 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgb(0, 112, 192);
		}

		.marker_complex--apart_12 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_13 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgb(0, 0, 153);
		}

		.marker_complex--apart_13 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_14 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgba(112, 48, 160);
		}

		.marker_complex--apart_14 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_15 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgb(204, 51, 153);
		}

		.marker_complex--apart_15 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

		.marker_complex--apart_16 .complex_feature {
			font-size: 14px;
			line-height: 16px;
			letter-spacing: -0.3px;
			padding: 0 5px;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			text-align: left;
			white-space: nowrap;
			color: #fff;
			background-color: rgb(255, 102, 204, 1);
		}

		.marker_complex--apart_16 .complex_size {
			font-size: 12px;
			line-height: 14px;
			letter-spacing: -0.56px;
			white-space: nowrap;
			color: #474C4F;
		}

	`;

	// 스타일 요소를 생성합니다.
	var styleElement = document.createElement('style');
	styleElement.type = 'text/css';

	// CSS 코드를 스타일 요소에 추가합니다.
	if (styleElement.styleSheet){
		// IE에서 작동하는 방법
		styleElement.styleSheet.cssText = cssCode;
	} else {
		// 다른 브라우저에서 작동하는 방법
		styleElement.appendChild(document.createTextNode(cssCode));
	}

	// 문서의 head 요소에 스타일 요소를 추가합니다.
	document.head.appendChild(styleElement);

}


function css_yeonsik_install(){

	// CSS 파일의 URL
	var cssUrl = "https://ssl.pstatic.net/static.land/static/beta-service/css/1707289307391/land.3b4f8d49993a841858b7.css";

	// CSS 파일을 가져오기 위한 XMLHttpRequest 객체 생성
	var xhr1 = new XMLHttpRequest();
	var xhr2 = new XMLHttpRequest();
	var xhr3 = new XMLHttpRequest();
	var xhr4 = new XMLHttpRequest();
	var xhr5 = new XMLHttpRequest();
	var xhr6 = new XMLHttpRequest();

	xhr1.open('GET', cssUrl, true);

	// blue
	xhr1.onreadystatechange = function() {
		if (xhr1.readyState === 4) {
			if (xhr1.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhr1.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_blue');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhr1.status, xhr1.statusText);
			}
		}
	};
	xhr1.send();



	// red
	xhr2.open('GET', cssUrl, true);
	xhr2.onreadystatechange = function() {
		if (xhr2.readyState === 4) {
			if (xhr2.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhr2.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_red');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhr2.status, xhr2.statusText);
			}
		}
	};
	xhr2.send();


	// purple
	xhr3.open('GET', cssUrl, true);
	xhr3.onreadystatechange = function() {
		if (xhr3.readyState === 4) {
			if (xhr3.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhr3.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_purple');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhr3.status, xhr3.statusText);
			}
		}
	};
	xhr3.send();



	// green
	xhr4.open('GET', cssUrl, true);
	xhr4.onreadystatechange = function() {
		if (xhr4.readyState === 4) {
			if (xhr4.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhr4.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_green');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhr4.status, xhr4.statusText);
			}
		}
	};
	xhr4.send();

	// gray
	xhr5.open('GET', cssUrl, true);
	xhr5.onreadystatechange = function() {
		if (xhr5.readyState === 4) {
			if (xhr5.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhr5.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_gray');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhr5.status, xhr5.statusText);
			}
		}
	};
	xhr5.send();


	// yellow
	xhr6.open('GET', cssUrl, true);
	xhr6.onreadystatechange = function() {
		if (xhr6.readyState === 4) {
			if (xhr6.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhr6.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_yellow');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhr6.status, xhr6.statusText);
			}
		}
	};
	xhr6.send();
}



function css_price_install(){

	// CSS 파일의 URL
	var cssUrl = "https://ssl.pstatic.net/static.land/static/beta-service/css/1707289307391/land.3b4f8d49993a841858b7.css";

	// CSS 파일을 가져오기 위한 XMLHttpRequest 객체 생성
	var xhrPrice3 = new XMLHttpRequest();
	var xhrPrice4 = new XMLHttpRequest();
	var xhrPrice5 = new XMLHttpRequest();
	var xhrPrice6 = new XMLHttpRequest();
	var xhrPrice7 = new XMLHttpRequest();
	var xhrPrice8 = new XMLHttpRequest();
	var xhrPrice9 = new XMLHttpRequest();
	var xhrPrice10 = new XMLHttpRequest();
	var xhrPrice11 = new XMLHttpRequest();
	var xhrPrice12 = new XMLHttpRequest();
	var xhrPrice13 = new XMLHttpRequest();
	var xhrPrice14 = new XMLHttpRequest();
	var xhrPrice15 = new XMLHttpRequest();
	var xhrPrice16 = new XMLHttpRequest();

	xhrPrice3.open('GET', cssUrl, true);

	// 매매가 3억대 이하
	xhrPrice3.onreadystatechange = function() {
		if (xhrPrice3.readyState === 4) {
			if (xhrPrice3.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice3.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_3');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice3.status, xhrPrice3.statusText);
			}
		}
	};

	// XMLHttpRequest를 통해 CSS 파일 가져오기
	xhrPrice3.send();



	// 매매가 4억대
	xhrPrice4.open('GET', cssUrl, true);
	xhrPrice4.onreadystatechange = function() {
		if (xhrPrice4.readyState === 4) {
			if (xhrPrice4.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice4.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_4');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice4.status, xhrPrice4.statusText);
			}
		}
	};

	// XMLHttpRequest를 통해 CSS 파일 가져오기
	xhrPrice4.send();


	// 매매가 5억대
	xhrPrice5.open('GET', cssUrl, true);
	xhrPrice5.onreadystatechange = function() {
		if (xhrPrice5.readyState === 4) {
			if (xhrPrice5.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice5.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_5');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice5.status, xhrPrice5.statusText);
			}
		}
	};

	// XMLHttpRequest를 통해 CSS 파일 가져오기
	xhrPrice5.send();



	// 매매가 6억대
	xhrPrice6.open('GET', cssUrl, true);
	xhrPrice6.onreadystatechange = function() {
		if (xhrPrice6.readyState === 4) {
			if (xhrPrice6.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice6.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_6');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice6.status, xhrPrice6.statusText);
			}
		}
	};

	// XMLHttpRequest를 통해 CSS 파일 가져오기
	xhrPrice6.send();

	// 매매가 7억대
	xhrPrice7.open('GET', cssUrl, true);
	xhrPrice7.onreadystatechange = function() {
		if (xhrPrice7.readyState === 4) {
			if (xhrPrice7.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice7.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_7');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice7.status, xhrPrice7.statusText);
			}
		}
	};
	xhrPrice7.send();

	// 매매가 8억대
	xhrPrice8.open('GET', cssUrl, true);
	xhrPrice8.onreadystatechange = function() {
		if (xhrPrice8.readyState === 4) {
			if (xhrPrice8.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice8.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_8');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice8.status, xhrPrice8.statusText);
			}
		}
	};
	xhrPrice8.send();

	// 매매가 9억대
	xhrPrice9.open('GET', cssUrl, true);
	xhrPrice9.onreadystatechange = function() {
		if (xhrPrice9.readyState === 4) {
			if (xhrPrice9.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice9.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_9');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice9.status, xhrPrice9.statusText);
			}
		}
	};
	xhrPrice9.send();

	// 매매가 10억대
	xhrPrice10.open('GET', cssUrl, true);
	xhrPrice10.onreadystatechange = function() {
		if (xhrPrice10.readyState === 4) {
			if (xhrPrice10.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice10.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_10');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice10.status, xhrPrice10.statusText);
			}
		}
	};
	xhrPrice10.send();

	// 매매가 11억대
	xhrPrice11.open('GET', cssUrl, true);
	xhrPrice11.onreadystatechange = function() {
		if (xhrPrice11.readyState === 4) {
			if (xhrPrice11.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice11.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_11');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice11.status, xhrPrice11.statusText);
			}
		}
	};
	xhrPrice11.send();

	// 매매가 12억대
	xhrPrice12.open('GET', cssUrl, true);
	xhrPrice12.onreadystatechange = function() {
		if (xhrPrice12.readyState === 4) {
			if (xhrPrice12.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice12.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_12');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice12.status, xhrPrice12.statusText);
			}
		}
	};
	xhrPrice12.send();

	// 매매가 13억대
	xhrPrice13.open('GET', cssUrl, true);
	xhrPrice13.onreadystatechange = function() {
		if (xhrPrice13.readyState === 4) {
			if (xhrPrice13.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice13.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_13');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice13.status, xhrPrice13.statusText);
			}
		}
	};
	xhrPrice13.send();

	// 매매가 14억대
	xhrPrice14.open('GET', cssUrl, true);
	xhrPrice14.onreadystatechange = function() {
		if (xhrPrice14.readyState === 4) {
			if (xhrPrice14.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice14.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_14');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice14.status, xhrPrice14.statusText);
			}
		}
	};
	xhrPrice14.send();

	// 매매가 15억대
	xhrPrice15.open('GET', cssUrl, true);
	xhrPrice15.onreadystatechange = function() {
		if (xhrPrice15.readyState === 4) {
			if (xhrPrice15.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice15.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_15');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice15.status, xhrPrice15.statusText);
			}
		}
	};
	xhrPrice15.send();

	// 매매가 16억대
	xhrPrice16.open('GET', cssUrl, true);
	xhrPrice16.onreadystatechange = function() {
		if (xhrPrice16.readyState === 4) {
			if (xhrPrice16.status === 200) {
				// CSS 파일 내용 가져오기
				var cssContent = xhrPrice16.responseText;

				// 문자열 치환
				cssContent = cssContent.replace(/marker_complex--apart/g, 'marker_complex--apart_16');
				cssContent = cssContent.replace(/#8160e2/g, 'rgba(255, 255, 255, 1)');

				// style 태그에 추가
				var styleElement = document.createElement('style');
				styleElement.textContent = cssContent;
				document.head.appendChild(styleElement);
			} else {
				console.error('Failed to load CSS:', xhrPrice16.status, xhrPrice16.statusText);
			}
		}
	};
	xhrPrice16.send();

}



