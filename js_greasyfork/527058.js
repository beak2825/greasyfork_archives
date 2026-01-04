// ==UserScript==
// @name         양도끼 좋아요!
// @namespace    http://tampermonkey.net/
// @version      1.171
// @description  유튜브 자동 좋아요 (번호 입력 방식 + 자동 좋아요 복원)
// @match        *://*.youtube.com/watch?v=*
// @grant        GM_registerMenuCommand
// @license      MIT
// @autor        Eggarlic
// @downloadURL https://update.greasyfork.org/scripts/527058/%EC%96%91%EB%8F%84%EB%81%BC%20%EC%A2%8B%EC%95%84%EC%9A%94%21.user.js
// @updateURL https://update.greasyfork.org/scripts/527058/%EC%96%91%EB%8F%84%EB%81%BC%20%EC%A2%8B%EC%95%84%EC%9A%94%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("✅ '양도끼좋아요!' 스크립트 실행 중...");

    // ✅ 저장된 채널 목록 불러오기 (없으면 기본 채널 추가)
    let targetChannels = JSON.parse(localStorage.getItem("targetChannels")) || ["양도끼", "양도끼얏호"];
    let autoLikeEnabled = localStorage.getItem("autoLikeEnabled") === "true";
    let lastURL = location.href;

    // ✅ 자동 좋아요 ON/OFF
    function toggleAutoLike() {
        autoLikeEnabled = !autoLikeEnabled;
        localStorage.setItem("autoLikeEnabled", autoLikeEnabled);
        alert(`👍 자동 좋아요 기능: ${autoLikeEnabled ? "활성화됨" : "비활성화됨"}`);
        updateMenu();
    }

    // ✅ 채널 추가 함수
    function addTargetChannel() {
        let newChannel = prompt("추가할 유튜브 채널명을 입력하세요:");
        if (newChannel && !targetChannels.includes(newChannel)) {
            targetChannels.push(newChannel);
            localStorage.setItem("targetChannels", JSON.stringify(targetChannels));
            alert(`📌 '${newChannel}' 채널이 자동 좋아요 목록에 추가되었습니다!`);
            updateMenu();
        } else {
            alert("⚠️ 채널명이 비어있거나 이미 추가된 채널입니다.");
        }
    }

    // ✅ 채널 삭제 함수
    function removeTargetChannel() {
        if (targetChannels.length === 0) {
            alert("❌ 삭제할 채널이 없습니다.");
            return;
        }

        let list = targetChannels.map((ch, index) => `${index + 1}. ${ch}`).join("\n");
        let selectedIndex = prompt(`삭제할 채널의 번호를 입력하세요:\n${list}`);

        let index = parseInt(selectedIndex, 10) - 1;
        if (!isNaN(index) && index >= 0 && index < targetChannels.length) {
            let removedChannel = targetChannels.splice(index, 1);
            localStorage.setItem("targetChannels", JSON.stringify(targetChannels));
            alert(`❌ '${removedChannel}' 채널이 자동 좋아요 목록에서 삭제되었습니다.`);
            updateMenu();
        } else {
            alert("⚠️ 올바른 번호를 입력하세요.");
        }
    }

    // ✅ 추가된 채널 목록 UI (템퍼몽키 메뉴에서 확인 가능)
    function showTargetChannels() {
        let channelList = targetChannels.length > 0 ? targetChannels.join("\n") : "❌ 등록된 채널이 없습니다.";
        alert("📜 현재 자동 좋아요 채널 목록:\n" + channelList);
    }

    // ✅ URL 변경 감지 (SPA 환경 대응)
    const observer = new MutationObserver(() => {
        if (location.href !== lastURL) {
            console.log("🔄 URL 변경 감지됨. 1초 대기 후 자동 좋아요 실행...");
            lastURL = location.href;
            setTimeout(checkChannelAndExecute, 1000);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function checkChannelAndExecute() {
        console.log("🔍 채널 확인 중...");

        let channelNameElement = document.querySelector('ytd-channel-name yt-formatted-string');
        if (channelNameElement) {
            let channelName = channelNameElement.innerText.trim();
            console.log(`📢 현재 채널: ${channelName}`);

            if (targetChannels.includes(channelName)) {
                console.log("✅ 대상 채널 영상입니다! 자동 좋아요 실행...");

                if (autoLikeEnabled) {
                    findLikeButton(channelNameElement);
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
            clickLike(likeButton);
        } else {
            console.log("❌ 좋아요 버튼을 찾을 수 없습니다. 다시 시도 중...");
            setTimeout(() => findLikeButton(channelElement), 500);
        }
    }

    function clickLike(likeButton) {
        console.log("👍 좋아요 버튼 클릭 중...");

        let isLiked = likeButton.getAttribute("aria-pressed") === "true";
        if (isLiked) {
            console.log("✅ 이미 좋아요를 눌렀습니다.");
            return;
        }

        likeButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        console.log("✅ 좋아요 버튼을 눌렀습니다!");
    }

    // ✅ 템퍼몽키 메뉴 등록
    function updateMenu() {
        GM_registerMenuCommand(`👍 자동 좋아요: ${autoLikeEnabled ? "ON" : "OFF"}`, toggleAutoLike);
        GM_registerMenuCommand("📜 추가된 채널 목록 보기", showTargetChannels);
        GM_registerMenuCommand("➕ 채널 추가", addTargetChannel);
        GM_registerMenuCommand("➖ 채널 삭제 (번호 입력)", removeTargetChannel);
    }

    updateMenu();
    checkChannelAndExecute();
})();
