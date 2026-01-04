// ==UserScript==
// @name        [루시퍼홍]아실 차트 가격표[실거래 바로가기][단독사용X]
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/asil/apt_price_2020.jsp*
// @grant       none
// @version     1.01
// @author      -
// @description 2024. 3. 10. 오전 9:57:03
// @downloadURL https://update.greasyfork.org/scripts/497173/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%EC%95%84%EC%8B%A4%20%EC%B0%A8%ED%8A%B8%20%EA%B0%80%EA%B2%A9%ED%91%9C%5B%EC%8B%A4%EA%B1%B0%EB%9E%98%20%EB%B0%94%EB%A1%9C%EA%B0%80%EA%B8%B0%5D%5B%EB%8B%A8%EB%8F%85%EC%82%AC%EC%9A%A9X%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/497173/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%EC%95%84%EC%8B%A4%20%EC%B0%A8%ED%8A%B8%20%EA%B0%80%EA%B2%A9%ED%91%9C%5B%EC%8B%A4%EA%B1%B0%EB%9E%98%20%EB%B0%94%EB%A1%9C%EA%B0%80%EA%B8%B0%5D%5B%EB%8B%A8%EB%8F%85%EC%82%AC%EC%9A%A9X%5D.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const currentVersion = GM_info.script.version;
    console.log("currentVersion: " + currentVersion);
    const updateUrl = 'https://update.greasyfork.org/scripts/497173/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%EC%95%84%EC%8B%A4%20%EC%B0%A8%ED%8A%B8%20%EA%B0%80%EA%B2%A9%ED%91%9C%5B%EC%8B%A4%EA%B1%B0%EB%9E%98%20%EB%B0%94%EB%A1%9C%EA%B0%80%EA%B8%B0%5D%5B%EB%8B%A8%EB%8F%85%EC%82%AC%EC%9A%A9X%5D.meta.js';
    const cafeUrl = 'https://cafe.naver.com/wecando7/10782960';
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
        message.innerHTML = `[루시퍼홍] 아실 차트 가격표[실거래 바로가기][단독사용X]의 (${latestVersion}) 버젼 업데이트가 있습니다. 확인하시겠습니까?<br><br>(닫기 버튼을 누르실 경우 24시간 동안 다시 알림이 뜨지 않습니다)<br><br>`;
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


let url = window.location.href;
//console.log("오른쪽 url : "+url);
// URLSearchParams 객체를 사용하여 URL에서 파라미터를 추출
const urlParams = new URLSearchParams(url.split('?')[1]);

// 파라미터를 출력
let v_os = urlParams.get('os');
let v_building = urlParams.get('building');
let v_apt = urlParams.get('apt');
let v_evt = urlParams.get('evt');
let v_year = urlParams.get('year');
let v_year6 = v_year ? v_year.substring(2, 4) + '.' + v_year.substring(4, 6) : null;
let v_year4 = v_year ? v_year.substring(0, 4) : null;
let v_deal = urlParams.get('deal');

/*
// 파라미터를 콘솔에 출력
console.log('os:', v_os);
console.log('building:', v_building);
console.log('apt:', v_apt);
console.log('evt:', v_evt);
console.log('year:', v_year);
console.log('year4:', v_year4);
console.log('year6:', v_year6);
console.log('deal:', v_deal);
*/
var dealLink1 = document.getElementById('deal1');
var dealLink2 = document.getElementById('deal2');
var dealLink3 = document.getElementById('deal3');

if (v_deal === "1") {
    if (dealLink2) {
        dealLink2.click();
    } else {
        console.log('Element not found');
    }

    if (dealLink3) {
        dealLink3.click();
    } else {
        console.log('Element not found');
    }

} else if (v_deal === "2") {
    if (dealLink1) {
        dealLink1.click();
    } else {
        console.log('Element not found');
    }

    if (dealLink3) {
        dealLink3.click();
    } else {
        console.log('Element not found');
    }
}

var links = document.querySelectorAll('#mCSB_1_container ul li a');
var targetText = v_evt.replace("py", "평");
//console.log(targetText);

links.forEach(function (link) {
    if (link.textContent.includes(targetText)) {
        //console.log('Found link:', link);
        // 클릭 이벤트 트리거
        link.click();
    }
});



let lastCheckedIndex = 0;


function searchyear() {
    // iframe 안의 콘텐츠에 접근
    let iframe = document.getElementById('ifrm');
    if (iframe) {
        let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        let table = iframeDoc.getElementById('tableList1');
        if (table) {
            let mmElements = table.querySelectorAll('.mm');
            let found = false;
            for (let i = lastCheckedIndex; i < mmElements.length; i++) {
                let element = mmElements[i];
                //console.log('Checking element:', element.textContent);
                if (element.textContent === v_year6) {
                    //console.log('Found matching element:', element);
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    found = true;
                    break;
                }
                lastCheckedIndex = i + 1;
            }
            if (!found) {
                //console.log('Matching element not found, calling moreList');
                if(iframeDoc.getElementById('morePriceBtn')){iframeDoc.getElementById('morePriceBtn').click()}
                setTimeout(searchyear, 1000); // 2초 후에 다시 검색
            }
        } else {
            console.log('Table not found');
        }
    }
}

// 2초 후에 searchyear 함수 실행
setTimeout(searchyear, 2000);

