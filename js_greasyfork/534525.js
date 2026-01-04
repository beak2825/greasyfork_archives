// ==UserScript==
// @name         치지직 Live SpecialChatView
// @namespace    Chzzk Live SpecialChatView
// @version      1.1
// @description  치지직 파트너 스트리머(방송주인 포함)와 채팅관리자 채팅을 추출하여 채팅창 상단에 고정(8초)으로 표시
// @author      주말쾌락주의        //원작자 DOGJIP 
// @match        https://chzzk.naver.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534525/%EC%B9%98%EC%A7%80%EC%A7%81%20Live%20SpecialChatView.user.js
// @updateURL https://update.greasyfork.org/scripts/534525/%EC%B9%98%EC%A7%80%EC%A7%81%20Live%20SpecialChatView.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;

    // ===============================
    // 1. 특수 채팅 고정 영역 생성 함수
    // ===============================
    function createSpecialChatContainer() {
        const chatWrapper = document.querySelector('[class*="live_chatting_list_wrapper__"]');
        if (!chatWrapper) return null;

        let specialContainer = document.getElementById('special-chat-container');
        if (!specialContainer) {
            specialContainer = document.createElement('div');
            specialContainer.id = 'special-chat-container';

            specialContainer.style.position = 'absolute';
            specialContainer.style.top = '50';
            specialContainer.style.left = '0';
            specialContainer.style.width = '100%';
            specialContainer.style.zIndex = '9999';
            specialContainer.style.backgroundColor = 'rgba(0,0,0,0.1)';
            specialContainer.style.color = '#fff';
            specialContainer.style.padding = '5px';
            specialContainer.style.boxSizing = 'border-box';

            chatWrapper.parentElement.insertBefore(specialContainer, chatWrapper);
            chatWrapper.style.marginTop = specialContainer.offsetHeight + 'px';
        }
        return specialContainer;
    }

    // ====================================
    // 2. 특수 채팅 메시지 추가 함수 (n초 후 제거)
    // ====================================
    function addSpecialChatMessage(nickname, message) {
        const container = createSpecialChatContainer();
        if (!container) return;

        const chatElem = document.createElement('div');
        chatElem.className = 'special-chat-message';
        chatElem.style.borderBottom = '1px solid #fff';
        chatElem.style.padding = '10px 5px';
        chatElem.textContent = `${nickname}: ${message}`;

        container.appendChild(chatElem);
        updateContainerHeight();

        setTimeout(() => {
            if (container.contains(chatElem)) {
                container.removeChild(chatElem);
                updateContainerHeight();
            }
        }, 20000); //n초 후 사라짐(1000=1초)
    }

    function updateContainerHeight() {
        const container = document.getElementById('special-chat-container');
        if (!container) return;

        const messages = container.querySelectorAll('.special-chat-message');
        let totalHeight = 0;

        messages.forEach(msg => {
            totalHeight += msg.offsetHeight;
        });

        if (messages.length > 0) {
            container.style.height = `${totalHeight}px`;
            container.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        } else {
            container.style.height = '0px';
            container.style.backgroundColor = 'transparent';
        }
    }

    // ============================================
    // 3. 특정 클래스의 하위요소 존재 여부 체크 함수
    // ============================================
    function hasDescendantWithClass(element, classSubstring) {
        return element.querySelector(`[class*="${classSubstring}"]`) !== null;
    }

    // ===================================
    // 4. 새 채팅 메시지 처리 함수 (스트리머 등 특정 유저 확인)
    // ===================================
    function processChatMessage(node) {
        if (node.nodeType !== 1) return;
        if (!node.className.includes('live_chatting_list_item__')) return;

        const Badge = node.querySelector('[class*="badge_container__"] img');
        const isStreamer = Badge && Badge.src.includes("streamer.png");
        const isPartner = hasDescendantWithClass(node, 'name_icon__zdbVH');
        const isManager = Badge && Badge.src.includes("manager.png");
        //const isFan = Badge && Badge.src.includes("fan_03.png"); //테스트용 후원뱃지 유저

        if (!(isStreamer || isPartner || isManager)) return;
        //if (!(isStreamer || isPartner || isManager || isFan)) return; //테스트용 후원 뱃지 유저 포함

        const nicknameElem = node.querySelector('span[class^="name_text__"]');
        const nickname = nicknameElem ? nicknameElem.innerText.trim() : 'Unknown';


        const messageElem = node.querySelector('[class^="live_chatting_message_text__"]');
        const message = messageElem ? messageElem.innerText.trim() : '';

        if (nickname && message) {
            addSpecialChatMessage(nickname, message);
        }
    }

    // ===================================
    // 5. 채팅 메시지 MutationObserver (진입시 마지막 채팅 저장 후 최신 채팅만 감시)
    // ===================================
    let lastProcessedChat = null; // ✅ 마지막으로 처리한 채팅을 저장할 변수

    function startChatObserver() {
        const chatList = document.querySelector('[class*="live_chatting_list_wrapper__"]');
        if (chatList) {
            chatObserver.disconnect(); // 중복 방지

            // ✅ 처음 실행 시, 가장 마지막(최신) 채팅 메시지를 기억해둠
            if (!lastProcessedChat) {
                const chatItems = chatList.querySelectorAll('[class^="live_chatting_list_item__"]');
                if (chatItems.length > 0) {
                    lastProcessedChat = chatItems[chatItems.length - 1]; // 가장 아래(최신) 메시지를 저장
                    console.log(`[Chzzk Script] 초기 마지막 채팅 저장 완료.`);
                }
            }

            chatObserver.observe(chatList, { childList: true, subtree: true });

            chatList.addEventListener('scroll', function() {
                if (chatList.scrollTop + chatList.clientHeight < chatList.scrollHeight) {
                    const container = document.getElementById('special-chat-container');
                    if (container) {
                        container.innerHTML = "";
                    }
                }
            });
        } else {
            setTimeout(startChatObserver, 1000);
        }
    }

    // ✅ MutationObserver 수정 (마지막 채팅 이후 새로 추가된 것만 감지)
    const chatObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1 || !node.className.includes('live_chatting_list_item__')) return;

                // ✅ 마지막으로 저장된 채팅 이후에 등장한 메시지만 처리
                if (!lastProcessedChat || node.compareDocumentPosition(lastProcessedChat) & Node.DOCUMENT_POSITION_FOLLOWING) {
                    processChatMessage(node);
                    lastProcessedChat = node; // ✅ 최신 채팅으로 업데이트
                }
            });
        });
    });

    function observeSpecialChatContainer() {
        const container = document.getElementById('special-chat-container');
        if (!container) return;

        const observer = new MutationObserver(() => {
            updateContainerHeight();
        });

        observer.observe(container, { childList: true, subtree: true });
    }

    // ===================================
    // 6. 안전한 초기화 루프 (채팅창을 찾지 못하는 등 DOM생성 이전일 경우 재시도)
    // ===================================
    function safeInit(retryCount = 0) {
        const chatList = document.querySelector('[class*="live_chatting_list_wrapper__"]');
        if (chatList) {
            console.log('[Chzzk Script] 채팅 리스트 탐색 성공. 초기화 시작.');
            startChatObserver();
            observeSpecialChatContainer();
        } else {
            if (retryCount < 20) {
                console.log('[Chzzk Script] 채팅 리스트 미탐색. 재시도 중...', retryCount);
                setTimeout(() => safeInit(retryCount + 1), 500);
            } else {
                console.warn('[Chzzk Script] 채팅 리스트 탐색 실패. 초기화 중단.');
            }
        }
    }

    // ===================================
    // 7. SPA 대응: history.pushState / replaceState / popstate 감지 (타 방송인 화면으로 이동해도 정상적인 코드 실행)
    // ===================================
    (function() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        const onUrlChange = () => {
            if (location.href !== lastUrl) {
                console.log('[Chzzk Script] URL 변경 감지 (SPA)', location.href);
                lastUrl = location.href;
                setTimeout(() => safeInit(), 500);
            }
        };

        history.pushState = function (...args) {
            originalPushState.apply(this, args);
            onUrlChange();
        };

        history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            onUrlChange();
        };

        window.addEventListener('popstate', onUrlChange);
    })();

    // ✅ 최초 진입 시 실행
    safeInit();

})();