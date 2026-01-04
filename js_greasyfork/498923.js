// ==UserScript==
// @name         자담 쿠폰 광클
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  자담 광클
// @match        https://ejadam.wmpoplus.com/event/*
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie

// @downloadURL https://update.greasyfork.org/scripts/498923/%EC%9E%90%EB%8B%B4%20%EC%BF%A0%ED%8F%B0%20%EA%B4%91%ED%81%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/498923/%EC%9E%90%EB%8B%B4%20%EC%BF%A0%ED%8F%B0%20%EA%B4%91%ED%81%B4.meta.js
// ==/UserScript==

function createButton(text, onClick, offset) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.position = 'fixed';
    button.style.top = '20px';  // 'bottom'을 'top'으로 변경
    button.style.right = `${20 + offset}px`;
    button.style.zIndex = '9999';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    button.style.color = 'white';
    button.style.padding = '10px 20px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', onClick);
    return button;
}

setTimeout(function() {
    const images = document.querySelectorAll('.cont figure img');
    const altTexts = [];
    function getTokenFromCookie() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'token') {
                return value;
            }
        }
        return null;
    }
    images.forEach(img => {
        if (img.alt && img.alt.length === 30) {
            altTexts.push(img.alt);
        }
    });
    var title = document.querySelector('h5');
    console.log(altTexts);
    console.log( title.innerText);
    title.innerText = "쿠폰번호: "+altTexts[0]+"\n토큰: "+getTokenFromCookie();
    var cnt = 0;
    const url = "https://api.thecupping.co.kr/my/get/brands/59/coupons/" + altTexts[0];
    const headers = {
        'Accept': "application/json, text/plain, */*",
        'Accept-Encoding': "gzip, deflate",
        'origin': "https://ejadam.wmpoplus.com",
        'x-requested-with': "com.wmpoplus.ejadam",
        'sec-fetch-site': "cross-site",
        'sec-fetch-mode': "cors",
        'sec-fetch-dest': "empty",
        'referer': "https://ejadam.wmpoplus.com/",
        'accept-language': "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
    };



    function makeRequest(token) {
        if (!token) {
            console.error("유효한 토큰이 없습니다.");
            return;
        }

        headers['token'] = token;

        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: headers,
            onload: function(response) {
                try {
                    const responseText = response.responseText;
                    const data = JSON.parse(responseText);
                    cnt += 1;
                    title.innerText = cnt+"클릭 / "+data.result.message;
                } catch (err) {
                    title.innerText = "에러 발생: "+ err;
                }

            },
            onerror: function(error) {
                title.innerText = "에러 발생: "+ error;
            }
        });
    }

    function run() {
        const token = getTokenFromCookie();
        if (token) {
            console.log("토큰을 찾았습니다:", token);
            setInterval(function() {
                makeRequest(token);
            }, 10); // 0.01초(10ms) 간격으로 실행
        } else {
            console.error("토큰을 찾을 수 없습니다.");
        }
    }
    const macro = createButton('매크로실행', run, 0);
    document.body.appendChild(macro);
}, 2000); // 2000ms = 2초딜레이


