// ==UserScript==
// @name         아카라이브 차단 버튼
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  닉네임 옆에 [차단] 버튼 생성 → 클릭 시 data-filter 값으로 자동 뮤트 등록
// @match        https://arca.live/b/*
// @match        https://arca.live/settings/etc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534852/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%B0%A8%EB%8B%A8%20%EB%B2%84%ED%8A%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/534852/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%B0%A8%EB%8B%A8%20%EB%B2%84%ED%8A%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 설정: true로 하면 설정 창 자동 닫기, false로 하면 닫지 않음
    const autoCloseSettingWindow = true; // 또는 false 로 변경

    let newWindow = null;

    function maybeCloseSelf() {
        if (autoCloseSettingWindow && window.opener && !window.opener.closed) {
            try {
                window.close();
                console.log("✅ 작업 완료 후 새 창 닫기 완료 (자동 닫기 활성화)");
            } catch (e) {
                console.warn("❌ 자기 자신 창 닫기 실패:", e);
            }
        } else if (!autoCloseSettingWindow) {
            console.log("ℹ️ 자동 닫기 비활성화됨: 설정 창을 수동으로 닫아주세요.");
        }
    }

    function setNickname(filterValue) {
        const inputs = document.querySelectorAll('input[name="customize.mute.users[]"]');
        const input = inputs[inputs.length - 1];
        if (input) {
            input.value = filterValue; // data-filter 값 그대로 뮤트
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`✅ 필터 값 입력: ${filterValue}`);
            return true;
        } else {
            console.warn('❌ 닉네임 입력 필드를 찾을 수 없습니다.');
            return false;
        }
    }

    function saveMuteSettings() {
        return new Promise((resolve, reject) => {
            const saveButton = document.querySelector('button.btn.btn-primary');
            if (saveButton) {
                saveButton.click();
                console.log('✅ 뮤트 설정을 저장했습니다.');
                setTimeout(() => {
                    resolve(true);
                }, 1000);
            } else {
                console.warn('❌ 저장 버튼을 찾을 수 없습니다.');
                reject(false);
            }
        });
    }

    function processMuteQueue() {
        const queueString = localStorage.getItem('muteQueue');
        const queue = queueString ? JSON.parse(queueString) : [];

        if (queue.length === 0) {
            console.log('✅ 뮤트 큐가 비어 있습니다.');
            maybeCloseSelf();
            return;
        }

        const filterValue = queue.shift();
        localStorage.setItem('muteQueue', JSON.stringify(queue));

        const addBtn = document.querySelector('a[data-action="table-add-row"]');
        if (addBtn) {
            addBtn.click();
            setTimeout(() => {
                const nicknameSuccess = setNickname(filterValue);
                if (nicknameSuccess) {
                    saveMuteSettings()
                        .then(saveSuccess => {
                            if (saveSuccess && queue.length === 0) {
                                localStorage.removeItem('muteQueue');
                                maybeCloseSelf();
                            } else if (!saveSuccess) {
                                queue.unshift(filterValue);
                                localStorage.setItem('muteQueue', JSON.stringify(queue));
                                console.error("❌ 저장 실패로 인해 필터 값을 큐에 다시 추가:", filterValue);
                                maybeCloseSelf();
                            } else {
                                setTimeout(processMuteQueue, 500);
                            }
                        })
                        .catch(saveError => {
                            queue.unshift(filterValue);
                            localStorage.setItem('muteQueue', JSON.stringify(queue));
                            console.error("❌ 저장 중 오류 발생:", saveError);
                            maybeCloseSelf();
                        });
                } else {
                    queue.unshift(filterValue);
                    localStorage.setItem('muteQueue', JSON.stringify(queue));
                    console.error("❌ 필터 값 입력 실패");
                    maybeCloseSelf();
                }
            }, 500);
        } else {
            console.warn('❌ 추가 버튼을 찾을 수 없습니다.');
            maybeCloseSelf();
        }
    }

    function createMuteButton(nicknameElement) {
        const nickname = nicknameElement.innerText.trim();
        const filterValue = nicknameElement.dataset.filter;

        if (!filterValue) {
            console.warn("⚠️ data-filter 속성을 찾을 수 없습니다:", nicknameElement);
            return;
        }

        const muteBtn = document.createElement('button');
        muteBtn.innerText = '차단';
        muteBtn.style.marginLeft = '6px';
        muteBtn.style.fontSize = '12px';
        muteBtn.style.cursor = 'pointer';
        muteBtn.style.padding = '2px 6px';
        muteBtn.style.border = '1px solid #ccc';
        muteBtn.style.borderRadius = '3px';
        muteBtn.style.backgroundColor = '#f5f5f5';
        muteBtn.style.color = '#333';

        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 닉네임 클릭 이벤트 방지
            e.preventDefault();  // 링크 이동 방지
            if (confirm(`"${nickname}" 님 (필터: ${filterValue})을 뮤트하시겠습니까?`)) {
                let queue = JSON.parse(localStorage.getItem('muteQueue') || '[]');
                queue.push(filterValue);
                localStorage.setItem('muteQueue', JSON.stringify(queue));
                newWindow = window.open('https://arca.live/settings/etc', '_blank');
                if (!newWindow) {
                    console.error("❌ 팝업 창 열기 실패");
                }
            }
        });

        nicknameElement.parentElement.appendChild(muteBtn);
    }

    // 게시판 페이지에서 차단 버튼 추가
    if (location.href.includes('arca.live/b/')) {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('.user-info a').forEach(el => { // 변경: .user-info a 선택
                if (el && !el.dataset.muteInjected) {
                    el.dataset.muteInjected = 'true';
                    createMuteButton(el); // 변경: a 태그 자체를 전달
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 설정 페이지에서 뮤트 처리
    if (location.href.includes('/settings/etc')) {
        window.addEventListener('load', processMuteQueue);
    }
})();