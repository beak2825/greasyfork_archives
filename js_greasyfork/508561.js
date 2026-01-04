// ==UserScript==
// @name        [루시퍼홍] 아실 아파트 연식라벨
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/asil/*
// @grant       none
// @version     1.07
// @description 2024. 7. 17. 오후 1:50:03
// @downloadURL https://update.greasyfork.org/scripts/508561/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%95%84%ED%8C%8C%ED%8A%B8%20%EC%97%B0%EC%8B%9D%EB%9D%BC%EB%B2%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/508561/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%95%84%ED%8C%8C%ED%8A%B8%20%EC%97%B0%EC%8B%9D%EB%9D%BC%EB%B2%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const currentVersion = GM_info.script.version;
    const scriptName = GM_info.script.name;
    console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
    //console.log(scriptName + ' ' + "scriptName: " + scriptName);
    //const updateUrl = 'https://update.greasyfork.org/scripts/500905/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%8B%9C%EC%84%B8%EC%A7%80%EB%8F%84%20%EA%B7%B8%EB%A6%AC%EA%B8%B0.meta.js';
    const updateUrl =  GM_info.script.updateURL;
    const cafeUrl = 'https://cafe.naver.com/wecando7/11204240';
    const popupDismissKey = 'scriptUpdatePopupDismissed';
    const dismissDuration = 24 * 60 * 60 * 1000; // 24시간

    // 한국 시간을 가져오는 함수
    function getKoreanTime() {
        const now = new Date();
        const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000); // UTC 시간
        const koreanTime = new Date(utcNow + (9 * 60 * 60 * 1000)); // 한국 시간 (UTC+9)
        //console.log("UTC Now:", new Date(utcNow).toISOString());
        //console.log("Korean Time:", koreanTime.toISOString());
        return koreanTime;
    }

    // 날짜를 24시간 형식으로 포맷하는 함수
    function formatDateTo24Hour(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // 최신 버전을 가져오기 위해 메타 파일을 가져옴
    fetch(`${updateUrl}?_=${Date.now()}`)
        .then(response => response.text())
        .then(meta => {
            const latestVersionMatch = meta.match(/@version\s+([^\s]+)/);

            if (latestVersionMatch) {
                const latestVersion = latestVersionMatch[1];
                console.log(scriptName + ' ' + "latestVersion: " + latestVersion);

                if (currentVersion !== latestVersion) {
                    //console.log("Different version detected.");
                    if (!shouldDismissPopup()) {
                        //console.log("Showing update popup.");
                        showUpdatePopup(latestVersion);
                    } else {
                        //console.log("Popup dismissed recently.");
                    }
                } else {
                    //console.log("No new version available.");
                }
            }
        })
        .catch(error => {
            console.error('Failed to fetch the latest version information:', error);
        });

    function shouldDismissPopup() {
        const lastDismissTime = localStorage.getItem(popupDismissKey);
        //console.log("lastDismissTime: " + lastDismissTime);
        if (!lastDismissTime) return false;

        const timeSinceDismiss = getKoreanTime().getTime() - new Date(lastDismissTime).getTime();
        //console.log("timeSinceDismiss: " + timeSinceDismiss);
        //console.log("dismissDuration: " + dismissDuration);
        return timeSinceDismiss < dismissDuration;
    }

    function dismissPopup() {
        const koreanTime = getKoreanTime();
        const formattedTime = formatDateTo24Hour(koreanTime);
        //console.log("Dismiss time set to:", formattedTime);
        localStorage.setItem(popupDismissKey, formattedTime);
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
        message.innerHTML = `${scriptName} (${latestVersion}) 버젼 업데이트가 있습니다. 확인하시겠습니까?<br><br>(닫기 버튼을 누르실 경우 24시간 동안 다시 알림이 뜨지 않습니다)<br><br>`;
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
        //console.log("Popup shown");
    }
    // 버튼 추가 코드
    let yearBtn = `<div class="filter_item" id="yearLabel"><a href="#" class="filter_btn" id="yearBtn"><i></i>연식별로보기</a></div>`;
    jQuery('#filter > div.filter_scroll > div').append(yearBtn);
    let yearSettingBtn = `<div class="filter_item" id="yearSetting"><a href="#" class="filter_btn" id="yearSettingBtn"><i></i>연식설정창</a></div>`;
    jQuery('#filter > div.filter_scroll > div').append(yearSettingBtn);
    let yearHouseHoldBtn = `<div class="filter_item" id="yearHouseHold"><a href="#" class="filter_btn" id="yearHouseHoldBtn"><i></i>연식+세대수</a></div>`;
    jQuery('#filter > div.filter_scroll > div').append(yearHouseHoldBtn);


    document.getElementById('yearBtn').addEventListener('click', function(event) {
        //event.preventDefault();

        // Toggle the pink-background class on the button itself
        this.classList.toggle('pink-background');


       if(this.classList.contains('pink-background')){
         setPinMode(2);
         loadYearTableData();
         updateBackgroundImage();
       }
        // Add any additional toggle actions specific to "연식별로보기" here if needed
        // For example, if it should affect other elements or display specific data
    });


  document.getElementById('yearSettingBtn').addEventListener('click', function(event) {
      event.preventDefault();
      const yearTable = document.getElementById('yearTable');

      // Toggle the visibility of the yearTable
      if (yearTable.style.display === 'none' || !yearTable.style.display) {
          yearTable.style.display = 'block';
          this.classList.add('pink-background'); // Add the toggle effect
          loadYearTableData();
      } else {
          yearTable.style.display = 'none';
          this.classList.remove('pink-background'); // Remove the toggle effect
      }
  });

  document.getElementById('yearHouseHoldBtn').addEventListener('click', function(event) {
     // 배열을 저장할 변수들
      const resultArray1 = [];  // setPinMode(1)의 결과 저장 (세대수)
      const resultArray2 = [];  // setPinMode(2)의 결과 저장 (입주시기)

      // 공통: id가 apt로 시작하는 div 요소를 모두 찾는 함수
      function getAptDivs() {
        return document.querySelectorAll("div[id^='apt']");
      }

      // setPinMode 함수 정의
      function loadPinMode(mode) {
        if (mode === 1) {
          // id가 apt로 시작하는 div 요소 모두 찾기
          const aptDivs = getAptDivs();

          aptDivs.forEach(div => {
            // div의 id 값 가져오기
            const id = div.id;

            // 세대수 정보가 들어있는 span.t2 요소의 텍스트 가져오기
            const generationSpan = div.querySelector("span.t2");
            const generationText = generationSpan ? generationSpan.textContent : "";

            // 배열에 id와 세대수 정보를 저장
            resultArray1.push({ id: id, generation: generationText });
          });

          // 세대수 정보를 콘솔에 출력
          //console.log("setPinMode(1) 결과:", resultArray1);
        }
        else if (mode === 2) {
          // setPinMode(2) 실행: 입주시기 정보 저장
          const aptDivs = getAptDivs();

          aptDivs.forEach(div => {
            // div의 id 값 가져오기
            const id = div.id;

            // 입주시기 정보가 들어있는 span.t2 요소의 텍스트 가져오기
            const moveInSpan = div.querySelector("span.t2");
            const moveInText = moveInSpan ? moveInSpan.textContent : "";

            // 배열에 id와 입주시기 정보를 저장
            resultArray2.push({ id: id, moveInDate: moveInText });
          });

          // 입주시기 정보를 콘솔에 출력
          //console.log("setPinMode(2) 결과:", resultArray2);
        }
      }

      // 배열에서 id를 탐색하여 "입주시기 + 세대수" 형태로 업데이트하는 함수
      function updateT2WithFormattedYearAndGeneration() {
        const aptDivs = getAptDivs();

        aptDivs.forEach(div => {
          const id = div.id;

          // resultArray2 (입주시기)에서 해당 id를 찾기
          const moveInItem = resultArray2.find(item => item.id === id);

          // resultArray1 (세대수)에서 해당 id를 찾기
          const generationItem = resultArray1.find(item => item.id === id);

          // 둘 다 존재하는 경우 "입주시기 + 세대수" 형태로 업데이트
          if (moveInItem && generationItem) {
            const t2Element = div.querySelector("span.t2");

            // 연도 마지막 두 자리 가져오기
            const year = moveInItem.moveInDate.slice(2, 4) + "y";

            // 세대수에서 '세대'를 '^'로 바꾸기
            const formattedGeneration = generationItem.generation.replace("세대", "^");

            // 새로운 텍스트: "00년 456^" 형태
            const newText = `${year} ${formattedGeneration}`;
            t2Element.textContent = newText;
          }
        });
      }

      // setPinMode(1) 호출 -> 세대수 정보 저장
      setPinMode(1);

      // 1초 후에 loadPinMode(1) 실행
      setTimeout(() => {
        loadPinMode(1);

        // setPinMode(2) 호출 -> 입주시기 정보 저장
        setPinMode(2);

        // 1초 후에 loadPinMode(2) 실행
        setTimeout(() => {
          loadPinMode(2);

          // 입주시기 + 세대수 업데이트
          setTimeout(() => {
            updateT2WithFormattedYearAndGeneration();
          }, 400);

        }, 400);

      }, 400);

    });




let _1bwImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAyCAYAAADySu2nAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADZGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ5MzA5RDVGNTgzQTExRUE4MTgxREI0QUFEOUQ3REY1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ5MzA5RDVFNTgzQTExRUE4MTgxREI0QUFEOUQ3REY1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGQUI1MUYwMzg1OEVBMTFBRDg3RjdBOTVGRjQ0MjQ2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HoKliAAAAlpJREFUaEPtm7FLW1EUxp/aqNGgLZY6FEEwVATFLEIpmD+gjt1FOnfSpZNDx9K1a4Uujk66Cg4SK6IiGGiVImqHItiWxEST+Hq+6ztWtCZ5Z3vh+8GXe+4jau4v5+YqMR6x0YSbp6ncy4Hc4aK7Qqqyn+ibON5KLKFuSiez/pfNik+qA0dwBWfNcoN4Yyk3kCrccNR8LY6EguKMUJwRJ44YgDj3KwkJhTtViQGKM0JxRijOCMUZoTgjFGeE4oxQnBGKM0JxRq7FrW9dBhW5j/Xtf47wB35HOpnNX01JPazsDXVyqxqhOCMUZ4TijFCcEYozQnFGKM4IxRmhOCMUZ4TijFCcEYozQnFGKM4IxPnf2rveXk1JLQJXvuu4P9/fzGEktVFXruPy+YXiTnF5BBfI/cARXEnp4z2HVkkMYzz+vKN74PPrZ8XKO5mTgK/tLbO/9yc/FQqZM5leSEoQ9yAI5CEtEnSipoIxncwey/hfVo9ejZeLu3tStknwOQB8jb4lhHmUwePHWrCmUpAyxEEULlYl+GDEHVYOXgx7pdOfUj6WoI3xjDSKODx2FVcOgrVVIA6pubjb4nbOlz6eHs58kBJdGZegjSFOv7n+0Cija3CyJNp5lyZxG7/eT+dP5ualfCTB9ZzE7X0JxDVKt+mI9SBa1/8f5you82Nq4uJsLSNlrwQdVpCcS3SL4n6aqKNruLmmcOuCuFisf1TKh5JBSZ+kR5KQ4FDAAXP7YIl6dEfeabC6Oy7giaRToq9nuj21jcM9GxEmjDicmrg/tiNkQVqjvJ6FxPP+ApS03J0wa1MdAAAAAElFTkSuQmCC';
let _2bwImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAyCAYAAADySu2nAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADZGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ5MzA5RDVGNTgzQTExRUE4MTgxREI0QUFEOUQ3REY1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ5MzA5RDVFNTgzQTExRUE4MTgxREI0QUFEOUQ3REY1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGQUI1MUYwMzg1OEVBMTFBRDg3RjdBOTVGRjQ0MjQ2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HoKliAAAAktJREFUaEPtmztPIlEYhkdc3ShuNqIBA2sllSsJjSV/QCt/xm6pjZW/wNba0nKrtbfTtRBjYmWhQUwEFzSKF27j9x7mKHtxZL6OyfskL3xnZricJ9/hjkN0DOAklb1bOCplf5otxJdMPL9YzI9tox6oJNPur4OWS/yBI7iCs4icIM581pwRH7ocRV7EkUBQnBKKU2LEEQUQZ16SkECYZ1WigOKUUJwSilNCcUooTgnFKaE4JRSnhOKUUJySF3H7+bZXkbfYP3x1hDf4o5VkutYZkl6IXZxEuVSVUJwSilNCcUooTgnFKaE4JRSnhOKUUJwSilNCcUooTgnFKaE4JRSnBOLcr7Gd1c6QvIfnysUnwCPR6NKnwuejS7OH+DJ9k0nUaj9uTcdJ8TgTWc50dpG3gCO4ktKFOHwD0aqefy+mqpNfZmPbaziIvAIncANHMmxJ2liqH7wMeRmUQKgNDoxUkmlc6L/EK8O55uPxiZQfJfgfgLlyCcC4n8H9N80laXhpQhxEYaMv3h8j/iFW/j3nNKolKSclaOO6JCzicN+tuKYXzK0Fcci7k/tb3Mzgt41qYWVdSnTliOReAnH2yu2N9jN2DkaWxHaeWaqBxU3Xc8u1q80tKccl2H4nQaeZNpaEpdvsOeaD2Lr3X5xbcVPXE4v1+71dKRMSdNiD5ElilyiOs+l37By652S2BRKXKDezjcbpmQwhDUsTgTR0WliWZzfdc/ljXj2L84hLohL7eGaXp23jMEnzJYg4PGvieHQWZEFaWB7PAuI4z/Mn5RZ+vu6vAAAAAElFTkSuQmCC';
let _3bwImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAyCAYAAADySu2nAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADZGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ5MzA5RDVGNTgzQTExRUE4MTgxREI0QUFEOUQ3REY1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ5MzA5RDVFNTgzQTExRUE4MTgxREI0QUFEOUQ3REY1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGQUI1MUYwMzg1OEVBMTFBRDg3RjdBOTVGRjQ0MjQ2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HoKliAAAAmRJREFUaEPtmj9LW2EUxm+0qV4NWNG2QxGUDl1sdRG6+AX0A6RQ4hAodRBadeifoYN0EbTg4KrQDJLJST+D4qIgThaH4mIL0pJ4rYlJz3NzTxUbk9yz3fD84Mn7vjfR5Pxy3lyT6BAbMVw8Gs6NfZm9v+EfITWZWfwxfryb2IS4WDbjlgYGc87IcEvlWlKVnd2Sc7SfcJIprwWmfFuUVp9rjq7EkVBQnBGKM+KLIwYgzv+ThIQixo4zQnFGKM4IxRmhOCMUZ4TijFCcEYozQnFGKM7IP3H4dJPUZmfvyhHe4HdkM26+siSNkEx5ndyqRijOCMUZoTgjFGeE4oxQnBGKM0JxRijOCMUZoTgjFGeE4oxQnBGKMwJx5bfzh+8rS1KPwFXZ77jfR1OrGEl91JXfcfn8+vnkh8WnOEBuB47gSqZlfOdwVxLH6LrPO7oef00vvRuakzUJeDO/9+nXt4kVz9s6k+WFpABxd4JAHtIqQSdqLjFmM+6xjFV5+WpgtHh+cCjTNklZgp/Rr4SwjjJ4/KgFNRWCFCEOonCwJiKuqoBkun3QKZyeyLRXgjbGM9Is4vDYVVwxCGq7hDikbnE3xU1+/Lx8+n12QaboSleCNoY4/eV6p1FGa/BlSbTzSiZx6ekXM/mfq2sy7ZbgeE7i730JxDVLt+mIehCdN/4f5you9frZ+MXZ9pZMH0rQYZ7kj0S3KG6niTpaw/WawtUFcfF4/5BM70meSPokPZKEBCcFnGBunliiHt2R/zVYwx0X8EDSKdHXM92e2sbhno0IE0Yczpq4PbYjZEFas7yehcRx/gJJObbAq7eezQAAAABJRU5ErkJggg==';
let _4bwImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAyCAYAAADySu2nAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADZGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ5MzA5RDVGNTgzQTExRUE4MTgxREI0QUFEOUQ3REY1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ5MzA5RDVFNTgzQTExRUE4MTgxREI0QUFEOUQ3REY1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGQUI1MUYwMzg1OEVBMTFBRDg3RjdBOTVGRjQ0MjQ2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HoKliAAAAl5JREFUaEPtm71LW1EYxq/WtEQFW1p0KIWCUJeKUrB06SA46b8QOmTJ0sksTg7OOjp0UVBRcRGEdNCWDi4aoY1Lp5YOxUUEsRij+fD2fY73VfEjyX23G54fPDnvuUTN+eU9OUqMR2w04eZ5//Hw4Jt0xl0hVfn2fWpkL9f+GXVTIpnysz8qPqkOHMEVnDXLDeIN9LuBVOGao+ZLcSQUFGeE4ow4ccQAxLlfSUgo3KlKDFCcEYozQnFGKM4IxRmhOCMUZ4TijFCcEYozciluJ3ceVOQ+dnavHOEP/NZEMpW/mJJ6WJj51MataoTijFCcEYozQnFGKM4IxRmhOCMUZ4TijFCcEYozQnFGKM4IxRmhOCMQ53/Njo9dTEktAle+67h/fz7OYiS1UVeu4/L51dPMel8vLpD7gSO4ktLHew4PJTGM8fi71o7uueTQ26kJmZOAL9n0+NHvDzOFwtaJTIuSEsS1BIE85IEEnaipYEwkU3sy3sny4ub78unPX1I+kuBzAPgafUsI8yiDx4+1YE2lIGWIgyhcrErwwYhbLMyvvPZKh/tSPpOgjfGMNIo4PHYVVw6CtVUgDqm5uJviMhuvpg//pielRFfGJWhjiNNvrj80yuganCyJdt65SdzqWnE0fzC7JOUTCa4fS9zel0Bco3SbjlgPonX9/3Gu4laWcyPFk+0tKbsk6LCC5EyiWxT300QdXcP1NYVbF8TFYi/7pHws6ZG8kDyVtEtwKOCAuXmwRD26I281WN0dF9ApaZPo65luT23jcM9GhAkjDqcm7o/tCFmQ1iivZyHxvP+FjNuxL2kI0QAAAABJRU5ErkJggg==';
const _blackImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAyCAYAAADySu2nAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADZGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ5MzA5RDVGNTgzQTExRUE4MTgxREI0QUFEOUQ3REY1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ5MzA5RDVFNTgzQTExRUE4MTgxREI0QUFEOUQ3REY1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGQUI1MUYwMzg1OEVBMTFBRDg3RjdBOTVGRjQ0MjQ2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HoKliAAAAixJREFUaEPtm0svA1EYhk+rrdYkTSYRl5TEWrqohcvGH2DlJ/gLbGz8A5ZsLf0VdIGNhVgQsRGJTVG9je8d59AmrTGfVcf7JG/mmzG9nCffOb0NQ/5AqVJbk03ARMe6Mimbztl52yxW0jhGBlC96JilhRGUaUhD1QoCCCVRpFJQZjJoMbZZfNIUp4PilITiiAKIC1c7EosUO04JxSmhOCUUp4TilFCcEopTQnFKKE4JxSmhOCVf4vDtJvmZ6uW3I3zAH5O8hHvkt3icqkooTgnFKaE4JRSnhOKUUJwSilNCcUooTgnFKaE4JRSnhOKUUJwSilMCccF0+WHnc5dEYV2F1/0WPG9jwu4wEbGuChKTlxT9mcMy/sAMjnVUlMCZyUk8iV8orJSmyte7Uve94X8NnMCN1L4ErnL4sSZjk7XB5ftY+1zadvsg6UsmP7/aql/dSDkqwYPhNu4nIewPM3j+GAvG1LRpuf9zwMEo+gvI+mXTfH6UalxSlzQkSRGH5+7EtWwwtjbEIb8ZXM85/uz+wfP99p6U6EYslq8SiHN37h50mHFjCGVJXOd1VOK88c2tl6ejYykx53G8JkGnhW0sSUq3uS3Gg7g61hXn4R3lxpbXG6+nJ1JOStBhb5J3iZuiOM9l2HFj6B5TeCyWuGx2rtJs3t5JDWmYmgikodOSMj276R5Lz7jiiAN484eXY7eeuenp2jhJ0n4kjji8auJ8dBZkQVpS1rOYGPMB0A+0RZflqo8AAAAASUVORK5CYII=';
//const _blackImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAyCAYAAADySu2nAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADZGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ5MzA5RDVGNTgzQTExRUE4MTgxREI0QUFEOUQ3REY1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ5MzA5RDVFNTgzQTExRUE4MTgxREI0QUFEOUQ3REY1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGQUI1MUYwMzg1OEVBMTFBRDg3RjdBOTVGRjQ0MjQ2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HoKliAAAAj1JREFUaEPtm7tOAkEUhgcEFEhINjFeoibWhgILL40voJWP4CtoY+MbaKmtpa+iUqiNhbHQGBtjYoNXbp5/nME1AZc9Vqz/l/zu2XW5zJczgyxoyB+YqtRWZdNmouNcmZRL6/SsaRYqaRwjPaiet8zi/BDKNKSharTbEEqiSKWgzGTQYmyz+KQpTgfFKbHiiAKIs6sdiUWKHaeE4pRQnBKKU0JxSihOCcUpoTglFKeE4pRQnJKOOFzdJL9Tvfh2hDf4Bcmz3SP9UsQPiON18/6BqwLXOCUUp4TilFCcEopTQnFKKE4JxSmhOCUUp4TilFCcEopTQnFKwuJ4aSmajiOIa0+W77e/dkkUzpUVmC8W18fcDruuN9aPc5XHgRFJKZg+KOMXoZAvOk6co5IEzkxOgmvoQT6/PDVRvtqROizw3wdO4EbqQAJXOXxYk3HJuuDr+1j7fJpuey/pSmZkbqXxdnkt5bAED4bb+I+EsD/I4PljLBhT3aXh/88BB6PoLiAblE396UGqUcmb5EOSFHF47l5cwwVja0Ic0s/gfpwTzOztP91t7UqJbsRi+SKBOH/n/kEHGT8GK0viO6+lElcc3dh8fjw8khJzHsdrEnSabWNJUrrNbzEexNexvnFu7yhXWFr7eDk5lnJcgg57lbxL/BTFeT6Djh9DeEz2WCxx2exspV6/uZUa0jA1EUhDpyVleoYJj+XHuOKIA/jjDy/Hfj3z09O3cZKk/UoccXjVxPnoLMiCtKSsZzEx5hNDUTDb5EdTLwAAAABJRU5ErkJggg==';

// 기존 클래스 이름과 새로운 클래스 이름
const _oldClass = '.pin_st2.bg21';
const _1byClass = '.pin_st2.bg21.1by';
const _2byClass = '.pin_st2.bg21.2by';
const _3byClass = '.pin_st2.bg21.3by';
const _4byClass = '.pin_st2.bg21.4by';

const ClassName = '.pin_st2.bg21';
const middelClassName = '.pin_schl.mi';
const eleClassName = '.pin_schl.el';
const storeClassName = '.pin_schl.store';
const departmentClassName = '.pin_schl.department';

// 함수 호출하여 CSS 클래스 복제
cloneCSSClass(_oldClass, _1byClass);
cloneCSSClass(_oldClass, _2byClass);
cloneCSSClass(_oldClass, _3byClass);
cloneCSSClass(_oldClass, _4byClass);

function updateBackgroundImage() {

    const pinSubtitle = document.querySelector("#pin_subtitle");
    const yearBtn = document.getElementById('yearBtn');
    const yearSelect = yearBtn.classList.contains('pink-background');

    // Check if the pin_subtitle text is "입주시기"
    if (pinSubtitle && pinSubtitle.textContent.trim() === "입주시기" && yearSelect) {
      //console.log("updateBackgroundImage 호출")
        // Get year values from the input fields in yearTable
        let year1 = parseInt(document.getElementById("cell1_3").querySelector("input").value, 10);
        let year2 = parseInt(document.getElementById("cell2_3").querySelector("input").value, 10);
        let year3 = parseInt(document.getElementById("cell3_3").querySelector("input").value, 10);
        let year4 = parseInt(document.getElementById("cell4_3").querySelector("input").value, 10);

        // Select all elements with ID starting with "apt"
        document.querySelectorAll('div[id^="apt"]').forEach(div => {
            // Select the .t2 span and extract the year from its text content
            const yearText = div.querySelector('.t2').textContent.trim(); // Get the text from the .t2 element
            const aptYear = parseInt(yearText.replace('년', ''), 10); // Remove the "년" and convert to a number
//console.log(aptYear, year1)
            // Change background based on the year
            if (aptYear >= year1) {
                div.style.backgroundImage = `url(${_1bwImage})`;
            } else if (aptYear >= year2) {
                div.style.backgroundImage = `url(${_2bwImage})`;
            } else if (aptYear >= year3) {
                div.style.backgroundImage = `url(${_3bwImage})`;
            } else if (aptYear >= year4) {
                div.style.backgroundImage = `url(${_4bwImage})`;
            } else {
                div.style.backgroundImage = ""; // Reset if none match
            }
        });
    }
}


// 저장된 연식 및 색상 로드 함수
function loadYearTableData() {
    const storedData = localStorage.getItem('yearTableData');
    if (storedData) {
        const yearData = JSON.parse(storedData);

        // 연도 및 색상 로드
        document.getElementById("cell1_3").querySelector("input").value = yearData.year1;
        document.getElementById("cell2_3").querySelector("input").value = yearData.year2;
        document.getElementById("cell3_3").querySelector("input").value = yearData.year3;
        document.getElementById("cell4_3").querySelector("input").value = yearData.year4;

        document.getElementById("cell1_1").style.backgroundColor = yearData.color1;
        document.getElementById("cell2_1").style.backgroundColor = yearData.color2;
        document.getElementById("cell3_1").style.backgroundColor = yearData.color3;
        document.getElementById("cell4_1").style.backgroundColor = yearData.color4;
    }
}

// 연식 및 색상 저장 함수
function saveYearTableData() {
  console.log("saveYearTableData 호출")
    const yearData = {
        year1: document.getElementById("cell1_3").querySelector("input").value,
        year2: document.getElementById("cell2_3").querySelector("input").value,
        year3: document.getElementById("cell3_3").querySelector("input").value,
        year4: document.getElementById("cell4_3").querySelector("input").value,
        color1: document.getElementById("cell1_1").style.backgroundColor,
        color2: document.getElementById("cell2_1").style.backgroundColor,
        color3: document.getElementById("cell3_1").style.backgroundColor,
        color4: document.getElementById("cell4_1").style.backgroundColor
    };
    localStorage.setItem('yearTableData', JSON.stringify(yearData));
}



function cloneCSSClass(oldClass, newClass) {
    // 모든 스타일 시트 가져오기
    const styleSheets = document.styleSheets;

    // 새로운 스타일 시트를 만들기 위한 변수
    let newStyles = '';

    // 각 스타일 시트를 순회
    for (let i = 0; i < styleSheets.length; i++) {
        const sheet = styleSheets[i];
        // 스타일 시트의 규칙(규칙이 없을 수도 있음)
        try {
            const rules = sheet.cssRules || sheet.rules;
            // 각 규칙을 순회
            for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                // oldClass에 해당하는 규칙 찾기
                if (rule.selectorText && rule.selectorText.includes(oldClass)) {
                    // 규칙의 CSS 텍스트를 가져와서 newClass로 변환
                    const cssText = rule.cssText.replace(new RegExp(oldClass, 'g'), newClass);
                    newStyles += cssText + ' ';
                }
            }
        } catch (e) {
            // CORS 정책으로 인해 외부 스타일 시트에 접근할 수 없을 수 있음
            console.warn(`Cannot access stylesheet: ${sheet.href}`, e);
        }
    }

    // 새로운 스타일 시트를 문서에 추가
    if (newStyles) {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerHTML = newStyles;
        document.head.appendChild(styleSheet);
       // console.log(`New CSS class ${newClass} has been defined with the styles:`);
      //  console.log(newStyles);
    } else {
        console.log(`No styles found for the class ${oldClass}`);
    }
}




  function addYearInputListeners() {
        const yearInputs = [
            document.getElementById("cell1_3").querySelector("input"),
            document.getElementById("cell2_3").querySelector("input"),
            document.getElementById("cell3_3").querySelector("input"),
            document.getElementById("cell4_3").querySelector("input"),
        ];

        yearInputs.forEach(input => {
            input.addEventListener("input", updateBackgroundImage);
        });
    }
/*
   function updateBackgroundImage() {

        const pinSubtitle = document.querySelector("#pin_subtitle");
        const yearBtn = document.getElementById('yearBtn');
        const yearSelect = yearBtn.classList.contains('pink-background')


        // Check if the pin_subtitle text is "입주시기"
        if (pinSubtitle && pinSubtitle.textContent.trim() === "입주시기" && yearSelect == true) {
            // Get year values from the input fields in yearTable
            let year1 = parseInt(document.getElementById("cell1_3").querySelector("input").value, 10);

            let year2 = parseInt(document.getElementById("cell2_3").querySelector("input").value, 10);
            let year3 = parseInt(document.getElementById("cell3_3").querySelector("input").value, 10);
            let year4 = parseInt(document.getElementById("cell4_3").querySelector("input").value, 10);


          // Convert year1 to string and remove "년" if present
            year1 = String(year1).replace("년", "");
            //console.log(year1)
            //          year2 = year2.replace("년","")
            //          year3 = year3.replace("년","")
            //          year4 = year4.replace("년","")

                      // Select all elements with ID starting with "apt"
            document.querySelectorAll('div[id^="apt"]').forEach(div => {
                // Select the .t2 span and extract the year from its text content
                const yearText = div.querySelector('.t2').textContent.trim(); // Get the text from the .t2 element
                const aptYear = parseInt(yearText.replace('년', ''), 10); // Remove the "년" and convert to a number
          //  console.log("aptYear : "+aptYear)
                // Change background based on the year
                if (aptYear >= year1) {
                    //div.classList.replace('bg21', 'bg21.1by');
                     div.style.backgroundImage = `url(${_1bwImage})`;
                } else if (aptYear >= year2) {
                    div.style.backgroundImage = `url(${_2bwImage})`;
                } else if (aptYear >= year3) {
                    div.style.backgroundImage = `url(${_3bwImage})`;
                } else if (aptYear >= year4) {
                    div.style.backgroundImage = `url(${_4bwImage})`;
                } else {
                    div.style.backgroundImage = ""; // Reset if none match
                }
            });

        }
    }
*/


  function makeYearTable() {
    var newDiv = document.createElement("div");
    var table = document.createElement("table");

    table.id = "yearTable";
    table.style.width = "250px";
    table.style.border = "1px solid black";
    table.style.display = "none"; // 테이블을 표시
    table.style.position = "absolute"; // 위치를 고정
    table.style.top = "300px"; // 상단에서 50px 떨어진 위치 (필요에 따라 조정 가능)
    table.style.left = "500px"; // 왼쪽에서 50px 떨어진 위치 (필요에 따라 조정 가능)
    table.style.zIndex = "9999"; // 맵 위에 나오도록 z-index를 높게 설정

    var row1 = table.insertRow();
    var cell1_1 = row1.insertCell(0);
    var cell1_2 = row1.insertCell(1);
    var cell1_3 = row1.insertCell(2);
    var row2 = table.insertRow();
    var cell2_1 = row2.insertCell(0);
    var cell2_2 = row2.insertCell(1);
    var cell2_3 = row2.insertCell(2);
    var row3 = table.insertRow();
    var cell3_1 = row3.insertCell(0);
    var cell3_2 = row3.insertCell(1);
    var cell3_3 = row3.insertCell(2);
    var row4 = table.insertRow();
    var cell4_1 = row4.insertCell(0);
    var cell4_2 = row4.insertCell(1);
    var cell4_3 = row4.insertCell(2);


    cell1_1.id = "cell1_1";
    cell2_1.id = "cell2_1";
    cell3_1.id = "cell3_1";
    cell4_1.id = "cell4_1";
    cell1_3.id = "cell1_3";
    cell2_3.id = "cell2_3";
    cell3_3.id = "cell3_3";
    cell4_3.id = "cell4_3";

    cell1_1.style.width = "100px";
    cell1_2.style.width = "50px";
    cell1_3.style.width = "100px";
    cell2_1.style.width = "100px";
    cell2_2.style.width = "50px";
    cell2_3.style.width = "100px";
    cell3_1.style.width = "100px";
    cell3_2.style.width = "50px";
    cell3_3.style.width = "100px";
    cell4_1.style.width = "100px";
    cell4_2.style.width = "50px";
    cell4_3.style.width = "100px";


    // 셀의 배경색 설정
    cell1_1.style.backgroundColor = "#3E24D7";
    cell2_1.style.backgroundColor = "#EE1A24";
    cell3_1.style.backgroundColor = "#A9A309";
    cell4_1.style.backgroundColor = "#5C6267";

    // >=가 있는 셀의 배경색을 흰색으로 설정
    cell1_2.style.backgroundColor = "#FFFFFF";
    cell2_2.style.backgroundColor = "#FFFFFF";
    cell3_2.style.backgroundColor = "#FFFFFF";
    cell4_2.style.backgroundColor = "#FFFFFF";

    cell1_1.innerHTML = "&nbsp;";
    cell1_2.textContent = ">=";
    cell1_3.innerHTML = "<input type='text' style='width: 100%;text-align:center' value='2019' maxlength='4'/>";
    cell2_1.innerHTML = "&nbsp;";
    cell2_2.textContent = ">=";
    cell2_3.innerHTML = "<input type='text' style='width: 100%;text-align:center' value='2010' maxlength='4'/>";
    cell3_1.innerHTML = "&nbsp;";
    cell3_2.textContent = ">=";
    cell3_3.innerHTML = "<input type='text' style='width: 100%;text-align:center' value='2000' maxlength='4'/>";
    cell4_1.innerHTML = "&nbsp;";
    cell4_2.textContent = ">=";
    cell4_3.innerHTML = "<input type='text' style='width: 100%;text-align:center' value='1900' maxlength='4'/>";

    var cells = [cell1_1, cell1_2, cell1_3, cell2_1, cell2_2, cell2_3, cell3_1, cell3_2, cell3_3, cell4_1, cell4_2, cell4_3];
    cells.forEach(cell => {
        cell.style.border = "1px solid black";
        cell.style.textAlign = "center";
    });

    newDiv.appendChild(table);
    document.body.appendChild(newDiv);


    // Adding the color picker functionality to each cell
    //addColorPicker(cell1_1);
    //addColorPicker(cell2_1);
    //addColorPicker(cell3_1);
    //addColorPicker(cell4_1);

    // 연도 입력 필드에 이벤트 추가
document.getElementById("cell1_3").querySelector("input").addEventListener("input", saveYearTableData);
document.getElementById("cell2_3").querySelector("input").addEventListener("input", saveYearTableData);
document.getElementById("cell3_3").querySelector("input").addEventListener("input", saveYearTableData);
document.getElementById("cell4_3").querySelector("input").addEventListener("input", saveYearTableData);

function addColorPicker(cell, saveCallback = null) {
    // Create color input element
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.style.position = 'absolute';
    colorPicker.style.zIndex = '10000';
    colorPicker.style.opacity = '0'; // Make it invisible initially
    document.body.appendChild(colorPicker);

    // When a cell is clicked, trigger the color picker
    cell.addEventListener('click', (event) => {
        event.preventDefault();

        // Update color picker position to follow the mouse cursor
        colorPicker.style.left = `${event.pageX}px`;
        colorPicker.style.top = `${event.pageY}px`;
        colorPicker.click(); // Programmatically click the hidden color input
    });

    // When a color is selected, update the cell's background and close the picker
    colorPicker.addEventListener('input', () => {
        cell.style.backgroundColor = colorPicker.value;

        // Close the color picker after selection by removing it from the document
        if (document.body.contains(colorPicker)) {
            document.body.removeChild(colorPicker);
        }

        // Update the corresponding _bwImage based on the selected color and cell id
        changeImageColor(_blackImage, colorPicker.value, (newImageUrl) => {
            if (cell.id === 'cell1_1') {
                _1bwImage = newImageUrl;
            } else if (cell.id === 'cell2_1') {
                _2bwImage = newImageUrl;
            } else if (cell.id === 'cell3_1') {
                _3bwImage = newImageUrl;
            } else if (cell.id === 'cell4_1') {
                _4bwImage = newImageUrl;
            }

            updateAffectedElements(); // Update elements that use the corresponding _bwImage
        });

        // If a saveCallback is provided, call it to handle storage
        if (saveCallback) {
            saveCallback();
        }
    });
}

function addColorPickerWithStorage(cell) {
    addColorPicker(cell, saveYearTableData);
}



addColorPickerWithStorage(document.getElementById("cell1_1"));
addColorPickerWithStorage(document.getElementById("cell2_1"));
addColorPickerWithStorage(document.getElementById("cell3_1"));
addColorPickerWithStorage(document.getElementById("cell4_1"));


}




function initializeObserver() {
    // Set up observers for each cell and map them to their corresponding images
    const cell1_1 = document.getElementById('cell1_1');
    const cell2_1 = document.getElementById('cell2_1');
    const cell3_1 = document.getElementById('cell3_1');
    const cell4_1 = document.getElementById('cell4_1');

    // Check if the elements exist before observing
    if (cell1_1) {
        observeCellBackgroundChange(cell1_1, _blackImage, (newImageUrl) => {
            _1bwImage = newImageUrl; // Update _1bwImage with the new image URL
            updateAffectedElements(); // Update elements that use _1bwImage
        });
    } else {
        console.warn('cell1_1 not found, observer not initialized.');
    }

    if (cell2_1) {
        observeCellBackgroundChange(cell2_1, _blackImage, (newImageUrl) => {
            _2bwImage = newImageUrl; // Update _2bwImage with the new image URL
            updateAffectedElements(); // Update elements that use _2bwImage
        });
    } else {
        console.warn('cell2_1 not found, observer not initialized.');
    }

    if (cell3_1) {
        observeCellBackgroundChange(cell3_1, _blackImage, (newImageUrl) => {
            _3bwImage = newImageUrl; // Update _3bwImage with the new image URL
            updateAffectedElements(); // Update elements that use _3bwImage
        });
    } else {
        console.warn('cell3_1 not found, observer not initialized.');
    }

    if (cell4_1) {
        observeCellBackgroundChange(cell4_1, _blackImage, (newImageUrl) => {
            _4bwImage = newImageUrl; // Update _4bwImage with the new image URL
            updateAffectedElements(); // Update elements that use _4bwImage
        });
    } else {
        console.warn('cell4_1 not found, observer not initialized.');
    }
}
function observeCellBackgroundChange(targetElement, image, updateImageCallback) {
    const observer = new MutationObserver(() => {
        const bgColor = window.getComputedStyle(targetElement).backgroundColor;
        const hexColor = rgbToHex(bgColor);
        changeImageColor(image, hexColor, updateImageCallback);
    });

    observer.observe(targetElement, { attributes: true, attributeFilter: ['style'] });
}

function validateHexColor(hex) {
    // Ensure hex starts with '#' and is either 4 or 7 characters long
    const isValid = /^#([a-fA-F0-9]{3}){1,2}$/.test(hex);
    if (!isValid) {
        console.error('Invalid hex color input:', hex);
    }
    return isValid;
}

// Modified hexToRgb function with added validation
function hexToRgb(hex) {
    // Check if the input is a valid hex color string
    if (!validateHexColor(hex)) {
        return null; // Early return if the format is not correct
    }

    // Expand shorthand hex notation if necessary
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    // Match hex string to RGB values
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    // Check if the conversion was successful
    if (!result) {
        console.error('Failed to convert hex to RGB:', hex);
        return null;
    }

    // Return the RGB values
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    };
}

// Function to change the color of black pixels in the image
function changeImageColor(base64Image, targetColor, callback) {
    //console.log("base64Image: " + base64Image);
    //console.log("targetColor: " + targetColor);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Convert the target color (hex) to RGB
        const rgbTargetColor = hexToRgb(targetColor);

        // Check if rgbTargetColor is valid before using it
        if (!rgbTargetColor) {
            console.error('Invalid target color, cannot modify image.');
            return;
        }

        // Modify pixels that are black (RGB 0,0,0)
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
                data[i] = rgbTargetColor.r;     // Red
                data[i + 1] = rgbTargetColor.g; // Green
                data[i + 2] = rgbTargetColor.b; // Blue
            }
        }

        ctx.putImageData(imageData, 0, 0);
        const newImageUrl = canvas.toDataURL();
        callback(newImageUrl); // Pass the modified image URL back
    };

    img.src = base64Image;
}

// Convert RGB to HEX
function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g).map((num) => {
        const hex = parseInt(num).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    });
    return `#${result.join('')}`;
}

// Function to update elements that use _1bwImage
function updateAffectedElements() {
    document.querySelectorAll('.target-class').forEach(el => {
        // Determine which image to use based on a condition. Adjust the condition based on your needs.
        if (el.classList.contains('class-for-1bw')) {
            el.style.backgroundImage = `url(${_1bwImage})`;
        } else if (el.classList.contains('class-for-2bw')) {
            el.style.backgroundImage = `url(${_2bwImage})`;
        } else if (el.classList.contains('class-for-3bw')) {
            el.style.backgroundImage = `url(${_3bwImage})`;
        } else if (el.classList.contains('class-for-4bw')) {
            el.style.backgroundImage = `url(${_4bwImage})`;
        } else {
            // Default behavior or handle other cases
            el.style.backgroundImage = ''; // Reset or set a default image if needed
        }
    });
}





    // Add CSS to make t2 and t3 elements dynamically adjust height
    const style = document.createElement('style');
    style.innerHTML = `
       .t3 {
        display: block;
        width: 76px;
        line-height: 17px !important;
        font-weight : bold;
        padding: 0px 0px 0px 0px;
        font-size: 13px;
        color: #fff;
        letter-spacing: 0;
        box-sizing: border-box;
        text-align: center;
        white-space: normal;
        word-break: break-word;
        overflow-wrap: break-word;
        height: auto;
        background-color: #1C32F7;
        border : 1px #1C32F7 solid;
        transition: height 0.2s, background-color 0.2s, color 0.2s, font-size 0.2s;
    }

        .color-input, .color-div, .font-size-input {
            margin-top: 10px;
        }
        .small-square {
            width: 30px;
            height: 30px;
            cursor: pointer;
            display: inline-block;
        }
        .color-div {
            display: flex;
            flex-wrap: wrap;
            width: 220px;
        }
        .draggable {
            cursor: move;
        }
        .color-picker-wrapper {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .color-picker-wrapper input[type="color"] {
            padding: 0;
            margin: 0;
        }
        .custom-modal textarea::selection {
            background: #b3d4fc;
            color: #000000;
        }
        .custom-modal textarea {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 5px;
            resize: none;
            border: 1px solid #ccc;
            outline: none;
            font-size: 14px;
            line-height: 1.5;
        }
        .export-button, .import-button {
            margin: 10px;
            padding: 10px 20px;
            background-color: #1C32F7;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 14px;
        }
        .export-button:hover, .import-button:hover {
            background-color: #1427b0;
        }
        .pink-background {
            background-color: pink;
        }

    `;
    document.head.appendChild(style);




    // Convert RGB to HEX
    function rgbToHex(rgb) {
        if (!rgb) return '#1C32F7'; // Default color
        const result = rgb.match(/\d+/g).map((num) => {
            const hex = parseInt(num).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        });
        return `#${result.join('')}`;
    }

    // Dynamically resize t2 element based on content
    function autoResize(element) {
        element.style.height = 'auto'; // Reset the height to auto
        element.style.height = element.scrollHeight + 'px'; // Set the height to the scrollHeight
    }

    // Initialize MutationObserver
    function initMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) { // If child nodes are added
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // If it's an element node
                            // Directly added nodes with ID starting with 'apt'
                            if (node.id && node.id.startsWith('apt')) {
                                const nodeId = node.id.trim().replace(/[\r\n]/g, '');

                                const yearBtnCheck = document.getElementById('yearBtn');
                                const yearSelectCheck = yearBtn.classList.contains('pink-background')
                                if(yearSelectCheck){
                                  updateBackgroundImage();
                                }else{
                                  //enableEditing(nodeId);
                                  //updateT2FromIndexedDB(nodeId);
                                }
                            } else {
                                // Child nodes with ID starting with 'apt

                                node.querySelectorAll('[id^="apt"]').forEach(childNode => {
                                    const childNodeId = childNode.id.trim().replace(/[\r\n]/g, '');
                                  updateBackgroundImage();
                                  //enableEditing(childNodeId);
                                    //updateT2FromIndexedDB(childNodeId);
                                });

                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true }); // Observe the body and its subtree
    }





    // Initialize MutationObserver to monitor DOM changes
    initMutationObserver();


    makeYearTable();
 addYearInputListeners(); // Add listeners to year inputs
        //updateBackgroundImage(); // Initial check and update of images
  initializeObserver()

})();