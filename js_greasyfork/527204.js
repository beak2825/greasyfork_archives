// ==UserScript==
// @name         N카페 이메일 추출
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  N카페의 멤버들 이메일 추출
// @author       ChatGPT
// @match        *://cafe.naver.com/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527204/N%EC%B9%B4%ED%8E%98%20%EC%9D%B4%EB%A9%94%EC%9D%BC%20%EC%B6%94%EC%B6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/527204/N%EC%B9%B4%ED%8E%98%20%EC%9D%B4%EB%A9%94%EC%9D%BC%20%EC%B6%94%EC%B6%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let extractBtn; // 추출 버튼을 전역 변수로 저장
    let nicknameToIdMap = new Map(); // 닉네임 → writer.id 저장하는 맵 (API 요청 최소화)

    // 1️⃣ "추출 시작" 버튼을 적절한 위치에 추가
    function addExtractButton() {
        let sortBox = document.querySelector("#searchOptionSortByDiv .select_box"); // "최신순" 버튼 확인
        let noticeBox = document.querySelector("label[for='notice_hidden']"); // "공지 숨기기" 버튼 확인

        let targetElement = sortBox || noticeBox; // 최신순이 있으면 그 옆, 없으면 공지 숨기기 옆에 추가
        if (!targetElement) return console.error("❌ 버튼 추가 위치를 찾을 수 없음");

        extractBtn = document.createElement("button");
        extractBtn.innerText = "추출 시작";
        extractBtn.style = "margin-left:10px; padding:5px 10px; background:#ff5722; color:white; border:none; cursor:pointer; font-size:14px; border-radius:5px;";
        extractBtn.onclick = selectDuplicateOption;
        targetElement.parentNode.insertBefore(extractBtn, targetElement.nextSibling);
    }

    // 2️⃣ 중복 제거 선택 창 표시
    function selectDuplicateOption() {
        let removeDuplicates = confirm("중복을 제거하시겠습니까?\n\n확인 = 중복 제거, 취소 = 모든 데이터 포함");
        extractData(removeDuplicates);
    }

    // 3️⃣ 게시글 작성자 정보 추출 함수
    async function extractData(removeDuplicates) {
        if (extractBtn) {
            extractBtn.disabled = true; // ✅ 버튼 비활성화
            extractBtn.innerText = "추출 중...";
        }

        var g_sClubId = typeof window.g_sClubId !== "undefined" ? window.g_sClubId : (document.scripts[0].textContent.match(/g_sClubId\s*=\s*"(\d+)"/) || [,""])[1];
        if (!g_sClubId) {
            console.error("❌ g_sClubId 없음");
            if (extractBtn) {
                extractBtn.disabled = false;
                extractBtn.innerText = "추출 시작";
            }
            return;
        }

        let articleElements = document.querySelectorAll('.article');
        let writers = [];

        for (let articleEl of articleElements) {
            let articleHref = articleEl.getAttribute('href');
            let articleIdMatch = articleHref.match(/articleid=(\d+)/);
            let articleId = articleIdMatch ? articleIdMatch[1] : null;
            if (!articleId) continue;

            // 닉네임 추출 (게시글 목록에서 가져옴)
            let nicknameEl = articleEl.closest("tr")?.querySelector(".m-tcol-c");
            let nickname = nicknameEl ? nicknameEl.textContent.trim() : null;

            if (nickname && nicknameToIdMap.has(nickname)) {
                // ✅ 닉네임이 이미 저장된 경우 → API 호출 없이 사용
                let writerId = nicknameToIdMap.get(nickname);
                let email = `${writerId}@naver.com`; // 📌 이메일 추가
                writers.push(`${writerId}\t${nickname}\t${email}`);
                continue;
            }

            // ✅ 닉네임이 없거나 저장되지 않은 경우 → API 호출 필요
            let retryCount = 0, success = false;
            while (retryCount < 2 && !success) { // 최대 1회 재시도
                try {
                    let response = await fetch(`https://apis.naver.com/cafe-web/cafe-articleapi/v2/cafes/${g_sClubId}/articles/${articleId}/comments/pages/1?requestFrom=A&orderBy=asc`, {
                        "headers": {
                            "accept": "application/json, text/plain, */*",
                            "accept-language": "ko",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-site",
                            "x-cafe-product": "pc"
                        },
                        "referrer": `https://cafe.naver.com/ca-fe/cafes/${g_sClubId}/articles/${articleId}?where=search&tc=naver_search&oldPath=%2FArticleRead.nhn%3Farticleid%3D${articleId}%26where%3Dsearch%26clubid%3D${g_sClubId}%26tc%3Dnaver_search`,
                        "referrerPolicy": "unsafe-url",
                        "body": null,
                        "method": "GET",
                        "mode": "cors",
                        "credentials": "include"
                    });

                    if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);

                    let data = await response.json();
                    let writerId = data?.result?.article?.writer?.id;
                    let writerNick = data?.result?.article?.writer?.nick;

                    if (writerId && writerNick) {
                        // ✅ 닉네임 → ID 저장 (중복 API 호출 방지)
                        nicknameToIdMap.set(writerNick, writerId);
                        let email = `${writerId}@naver.com`; // 📌 이메일 추가
                        writers.push(`${writerId}\t${writerNick}\t${email}`);
                    } else {
                        console.error(`❌ writer 정보 찾을 수 없음: articleid=${articleId}`);
                    }

                    success = true;

                } catch (error) {
                    console.error(`🚨 오류 발생 (${retryCount + 1}번째 시도): ${error.message}`);
                    retryCount++;
                }

                // ✅ 요청 간 랜덤 딜레이 (500~1200ms)
                let randomDelay = Math.floor(Math.random() * 700) + 500;
                await new Promise(resolve => setTimeout(resolve, randomDelay));
            }
        }

        // 4️⃣ 중복 제거 여부에 따라 데이터 처리
        if (removeDuplicates) {
            writers = [...new Set(writers)]; // 중복 제거
        }

        // 5️⃣ 결과를 엑셀 형식으로 변환 & 클립보드 복사
        let resultText = "ID\t닉네임\t이메일\n" + writers.join("\n");
        GM_setClipboard(resultText);

        alert(`📋 결과가 클립보드에 복사되었습니다!\n엑셀에서 Ctrl+V로 붙여넣기하세요.\n\n중복 제거: ${removeDuplicates ? "✅ 예" : "❌ 아니오"}`);

        if (extractBtn) {
            extractBtn.disabled = false; // ✅ 버튼 활성화
            extractBtn.innerText = "추출 시작";
        }
    }

    // Tampermonkey가 실행될 때 버튼 추가
    addExtractButton();
})();
