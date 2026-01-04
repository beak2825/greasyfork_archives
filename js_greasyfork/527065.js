// ==UserScript==
// @name         양도끼 좋아요!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  유튜브 양도끼 채널 영상에서 자동으로 좋아요를 눌러주는 스크립트입니다.
// @match        *://*.youtube.com/watch?v=*
// @grant        GM_registerMenuCommand
// @license      MIT
// @author       Eggarlic
// @downloadURL https://update.greasyfork.org/scripts/527065/%EC%96%91%EB%8F%84%EB%81%BC%20%EC%A2%8B%EC%95%84%EC%9A%94%21.user.js
// @updateURL https://update.greasyfork.org/scripts/527065/%EC%96%91%EB%8F%84%EB%81%BC%20%EC%A2%8B%EC%95%84%EC%9A%94%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("✅ '양도끼좋아요!' 스크립트 실행 중...");

    const TARGET_CHANNELS = ["양도끼", "양도끼얏호"]; // ✅ 자동 좋아요를 누를 채널 목록
    let autoLikeEnabled = localStorage.getItem("autoLikeEnabled") === "true";
    let lastURL = location.href; // ✅ 현재 URL 저장

    // ✅ 설정 변경 함수
    function toggleAutoLike() {
        autoLikeEnabled = !autoLikeEnabled;
        localStorage.setItem("autoLikeEnabled", autoLikeEnabled);
        alert(`👍 자동 좋아요 기능: ${autoLikeEnabled ? "활성화됨" : "비활성화됨"}`);
    }

    // ✅ 템퍼몽키 메뉴에서 설정 변경 가능
    GM_registerMenuCommand(`👍 자동 좋아요: ${autoLikeEnabled ? "ON" : "OFF"}`, toggleAutoLike);

    // ✅ URL 변경 감지 (SPA 환경 대응) - 1초 대기 추가
    const observer = new MutationObserver(() => {
        if (location.href !== lastURL) {
            console.log("🔄 URL 변경 감지됨. 1초 대기 후 자동 좋아요 실행...");
            lastURL = location.href;
            setTimeout(checkChannelAndExecute, 1000); // ✅ 1초 대기 후 실행
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function checkChannelAndExecute() {
        console.log("🔍 채널 확인 중...");

        let channelNameElement = document.querySelector('ytd-channel-name yt-formatted-string');
        if (channelNameElement) {
            let channelName = channelNameElement.innerText.trim();
            console.log(`📢 현재 채널: ${channelName}`);

            if (TARGET_CHANNELS.includes(channelName)) {
                console.log("✅ 대상 채널 영상입니다! 자동 좋아요 실행...");

                if (autoLikeEnabled) {
                    findLikeButton(channelNameElement); // ✅ 좋아요 버튼 찾기 시작
                } else {
                    console.log("👍 자동 좋아요 기능이 비활성화됨.");
                }
            } else {
                console.log("❌ 대상 채널이 아닙니다. 자동화를 실행하지 않습니다.");
            }
        } else {
            console.log("⚠️ 채널 이름을 찾을 수 없습니다. 다시 시도 중...");
            setTimeout(checkChannelAndExecute, 500);
        }
    }

    function findLikeButton(channelElement) {
        console.log("🔍 좋아요 버튼 찾는 중...");

        let allButtons = [...document.querySelectorAll('button')];
        let channelIndex = allButtons.findIndex(btn => btn.compareDocumentPosition(channelElement) & Node.DOCUMENT_POSITION_FOLLOWING);
        let buttonsAfterChannel = allButtons.slice(channelIndex);

        let likeButton = buttonsAfterChannel.find(btn => /\d/.test(btn.innerText));

        if (likeButton) {
            console.log(`✅ 좋아요 버튼을 찾았습니다: ${likeButton.innerText}`);
            waitForPageLoad(likeButton); // ✅ 버튼을 찾은 후 로딩 확인
        } else {
            console.log("❌ 좋아요 버튼을 찾을 수 없습니다. 다시 시도 중...");
            setTimeout(() => findLikeButton(channelElement), 500);
        }
    }

    function waitForPageLoad(likeButton) {
        console.log("⏳ 페이지 로딩 확인 중...");

        let checkInterval = setInterval(() => {
            let pageLoaded = document.readyState === "complete";
            let commentSection = document.querySelector('#comments'); // 댓글 섹션이 로드되었는지 확인 (페이지 완전 로딩 여부 체크)

            if (pageLoaded && commentSection) {
                console.log("✅ 페이지 로딩 완료! 좋아요 버튼 클릭 준비...");
                clearInterval(checkInterval);
                clickLike(likeButton); // ✅ 페이지가 로딩 완료되면 좋아요 클릭
            }
        }, 500); // ✅ 0.5초마다 확인
    }

    function clickLike(likeButton) {
        console.log("👍 좋아요 버튼 클릭 중...");

        let isLiked = likeButton.getAttribute("aria-pressed") === "true";
        if (isLiked) {
            console.log("✅ 이미 좋아요를 눌렀습니다.");
            return;
        }

        // ✅ 버튼 즉시 클릭
        likeButton.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        likeButton.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        likeButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        console.log("✅ 좋아요 버튼을 눌렀습니다!");
    }

    // ✅ 최초 실행
    checkChannelAndExecute();
})();
