// ==UserScript==
// @name         Toggle Comments for Toki
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  토끼(마나,뉴,북) 댓글창 ON OFF 설정 버튼 추가
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515588/Toggle%20Comments%20for%20Toki.user.js
// @updateURL https://update.greasyfork.org/scripts/515588/Toggle%20Comments%20for%20Toki.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.hostname;
    const filePath = window.location.pathname;

    if ((url.includes("newtoki")) || (url.includes("manatoki")) || (url.includes("booktoki"))) {
        // toon-nav 요소 찾기
        const toonNav = document.querySelector(".toon-nav");

        if (toonNav) {
            // 댓글창 보이기/숨기기 버튼 생성
            const toggleCommentBtn = document.createElement("a");
            toggleCommentBtn.href = "#";
            toggleCommentBtn.id = "toggleCommentBtn";
            toggleCommentBtn.style.marginLeft = "10px"; // 간격 조정

            // #viewcomment 요소 가져오기
            const commentSection = document.getElementById("viewcomment");

            // localStorage에서 저장된 상태 불러오기
            const commentVisibility = localStorage.getItem("commentVisibility") || "show";
            if (commentSection) {
                if (commentVisibility === "hide") {
                    commentSection.style.display = "none";
                    toggleCommentBtn.textContent = "댓글창 보기";
                } else {
                    commentSection.style.display = "block";
                    toggleCommentBtn.textContent = "댓글창 숨기기";
                }
            }

            // 버튼을 toon-nav 요소에 추가
            toonNav.appendChild(toggleCommentBtn);

            // 댓글창 토글 기능 추가
            toggleCommentBtn.addEventListener("click", function(event) {
                event.preventDefault(); // 링크 기본 동작 방지

                if (commentSection) {
                    // 보임 상태 토글
                    if (commentSection.style.display === "none" || getComputedStyle(commentSection).display === "none") {
                        commentSection.style.display = "block";
                        toggleCommentBtn.textContent = "댓글창 숨기기"; // 버튼 텍스트 변경
                        localStorage.setItem("commentVisibility", "show"); // 상태 저장
                    } else {
                        commentSection.style.display = "none";
                        toggleCommentBtn.textContent = "댓글창 보기"; // 버튼 텍스트 변경
                        localStorage.setItem("commentVisibility", "hide"); // 상태 저장
                    }
                }
            });
        }
    }
})();
