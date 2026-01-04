// ==UserScript==
// @name         SOOP - 하이라이트 댓글 자동 생성
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @namespace    http://tampermonkey.net/

// @license      MIT
// @author       고기
// @version      250224
// @match        https://ch.sooplive.co.kr/*/post/*
// @description  하이라이트 댓글 링크를 자동으로 생성하고 복사하는 버튼 추가

// @grant        GM_setClipboard

// @downloadURL https://update.greasyfork.org/scripts/527755/SOOP%20-%20%ED%95%98%EC%9D%B4%EB%9D%BC%EC%9D%B4%ED%8A%B8%20%EB%8C%93%EA%B8%80%20%EC%9E%90%EB%8F%99%20%EC%83%9D%EC%84%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/527755/SOOP%20-%20%ED%95%98%EC%9D%B4%EB%9D%BC%EC%9D%B4%ED%8A%B8%20%EB%8C%93%EA%B8%80%20%EC%9E%90%EB%8F%99%20%EC%83%9D%EC%84%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function generateHighlightLink(commentId) {
        if (!commentId) {
            alert("답글을 누른 후 눌러주세요.");
            return;
        }

        let url = window.location.href;
        let postId = url.match(/post\/(\d+)/);
        if (!postId) {
            alert("게시글 ID를 찾을 수 없습니다.");
            return;
        }

        let newUrl = `https://ch.sooplive.co.kr/${window.location.pathname.split("/")[1]}/post/${postId[1]}#comment_noti${commentId}`;
        GM_setClipboard(newUrl);
        alert("하이라이트 댓글이 복사되었습니다.");
    }

    function getCommentId(comment) {
        let replyInput = comment.querySelector("div[id^='reply_write_form_']");
        if (!replyInput) return null;
        let match = replyInput.id.match(/reply_write_form_(\d+)_input/);
        return match ? match[1] : null;
    }

    function addHighlightButtonToMenu(menu, comment) {
        if (!menu || menu.querySelector(".highlight-btn")) return;

        let highlightBtn = document.createElement("button");
        highlightBtn.innerHTML = "<span>하이라이트</span>";
        highlightBtn.className = "highlight-btn";
        highlightBtn.style.backgroundColor = getComputedStyle(menu.querySelector("button")).backgroundColor;
        highlightBtn.style.color = getComputedStyle(menu.querySelector("button")).color;
        highlightBtn.addEventListener("click", () => {
            let commentId = getCommentId(comment);
            generateHighlightLink(commentId);
        });

        menu.appendChild(highlightBtn);
    }

    function observeMoreLayer() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains("more-layer")) {
                        let comment = node.closest("li");
                        if (comment) {
                            addHighlightButtonToMenu(node, comment);
                        }
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeMoreLayer();
})();
