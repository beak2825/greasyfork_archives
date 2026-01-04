// ==UserScript==
// @name         ArcaLive PostSidebar
// @namespace    ArcaLive PostSidebar
// @version      1.2
// @description  이 스크립트는 Arcalive 웹 페이지에서 우측에 인접 게시글 패널을 생성합니다. 사용자 익명화, 키보드 단축키 추가 등의 기능을 포함하며, 특정 요소를 숨깁니다.
// @author       Hess
// @match        https://arca.live/*
// @run-at       document-idle
// @icon         https://i.namu.wiki/i/uDNhs7D-YhK4rVCOjzk6NLNzbC58cvwSpMHw-b0mG8XGgPA1uxFI1JqUFBE1gLHvSWhq1LNrXuwchq6TPh1WIg.svg
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529392/ArcaLive%20PostSidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/529392/ArcaLive%20PostSidebar.meta.js
// ==/UserScript==
// https://greasyfork.org/ko/scripts/529392-arcalive-postsidebar-%EB%B0%B0%ED%8F%AC%EC%9A%A9

// 최우선 목표: 함수화하기
// iframe 2개만 불러오게 만들기 iframe 로드 완료 감지
// 로딩 시간 최소화

// 더 압축할 거리 찾기
// 더 넣을 기능 찾기
// 단축키 설명서?
// 저장소 내보내기 / 가져오기

// 저번에 안본 (저장소에 카운트 안된) 댓글은 (최근 방문일을 기준으로) 따로 표시 (완, 맨 밑은 파란색이라 덮어짐)
// 검색창 위에도 만들기 (완, 목록 페이지만)

(function() {
    'use strict';
    // 로드 되면 새 댓글 색깔 바꾸기
    window.onload = function() {colorNewComment();};

    const hideMore = true // 세로일 때 제거 요소가 더 많아짐
    // 세로 모드이면 일부 요소 제거
    hideElementsInPortrait(detectScreenMode(), hideMore);
    // 세로로 인식시키고 강제로 제거
    // hideElementsInPortrait("Portrait", hideMore);

    // 검색창을 위에 복사
    const targetElement = document.querySelector("body > div.root-container > div.content-wrapper.clearfix > article > div");
    const elementToCopy = document.querySelector("body > div.root-container > div.content-wrapper.clearfix > article > div > form.form-inline.search-form.justify-content-end");

    if (targetElement && elementToCopy) {
        const clonedElement = elementToCopy.cloneNode(true); // true는 자식 노드까지 복사
        clonedElement.style.paddingBottom = "7px"; // 원하는 패딩 값 적용
        clonedElement.style.paddingRight = "15px"; // 오른쪽 패딩 추가
        targetElement.parentNode.insertBefore(clonedElement, targetElement);
    }

    const mouseRecommendHardMode = true;
    const keyRecommendHardMode = true;
    const maxGauge = 5; // 추천 버튼을 눌러야하는 횟수, 1 이상의 값으로 변경 가능

    const mouseNotRecommendHardMode = true;
    const maxGauge2 = 10; // 비추 버튼을 클릭해야하는 횟수, 1 이상의 값으로 변경 가능

    if (window.self === window.top) {
        window.currentPrevPage = (function() {
            const urlParams = new URLSearchParams(window.location.search);
            const pageFromUrl = parseInt(urlParams.get('p'));
            const pageFromDOM = getCurrentPageNumber();
            return pageFromUrl || pageFromDOM || 1;
        })();
        window.prevLoadCount = 0;
        window.MAX_PREV_LOAD_COUNT = 3;
    }
    // 현재 페이지의 방문 기록을 저장
    // storeCurrentPage();
    // 페이지를 떠날 떄 현재 방문 시간을 업데이트 (예: 페이지 unload 시 업데이트)
    window.addEventListener("beforeunload", () => {
        storeCurrentPage();
    });

    // 가로 모드면 우측에 인접 게시글 n개 생성
    const n = 15;
    if (detectScreenMode() === "Landscape") createAdjacentPostsSection(n);
    // 세로 모드면 기존 게시판 위에 인접 게시글 m개 삽입
    // const m = 11;
    // insertDistributedAdjacentPostsAboveBoard(m);
    // 이전, 현재, 다음 게시물들 사이에 경계 넣기
    const makeBorder = true;

    // 기본 익명화 최초 설정 값 (이후 스크립트에 저장함, h키로 토글하여 변경 가능)
    let DEFAULT_ANONYMIZE_SETTING = false;
    // 로컬 스토리지에서 익명화 설정 값을 불러오거나, 없으면 기본값 사용
    let anonymizeSetting = GM_getValue("anonymizeSetting", DEFAULT_ANONYMIZE_SETTING);
    // 닉네임 익명화
    let anony = false; // 글 작성자, 댓글 작성자, 사이드바 게시물 익명화
    let anony2 = false; // 기존 게시글 목록 익명화
    anony = anonymizeSetting;
    anony2 = anonymizeSetting;

    // 새로운 키 기능 추가
    const keyActionsEnabled = true;
    const myLink = 'https://arca.live/b/holopro'; // Shift + Q 단축키로 이동할 링크

    // 댓글 입력창에 색 넣기
    const replyColoring = true;

    const els = {
        recommendButton: document.querySelector('button#rateUp.item'), // 추천 버튼
        notRecommendButton: document.querySelector('button#rateDown.item'), // 비추천 버튼
        pressedRecommendButton: document.querySelector('button#rateUp.item.already'),
        pressedNotRecommendButton: document.querySelector('button#rateDown.item.already'),
        commentCounter: document.querySelector('.article-comment.position-relative .title'), // 댓글 수 표시
        writeBtn: document.querySelector('#comment .title .btn-arca-article-write'), // 댓글 작성 버튼
        mainBoard: document.querySelector('.article-list') || document.querySelector('.board-article-list'), // 게시판 목록
    };
    let recommendCount = 0, notRecommendCount = 0;
    let recommendButton = els.recommendButton;
    let notRecommendButton = els.notRecommendButton;
    let pressedRecommendButton = els.pressedRecommendButton;
    let pressedNotRecommendButton = els.pressedNotRecommendButton;

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 버튼 색 설정 (비추 기본색은 흰색이라 생략)
    if (pressedRecommendButton) {
        recommendButton = pressedRecommendButton;
        recommendButton.style.backgroundColor = 'Azure';
        recommendCount = maxGauge;
    } else if (recommendButton) {
        recommendButton.style.backgroundColor = '#F5F5F5';
    }
    if (pressedNotRecommendButton) {
        notRecommendButton = pressedNotRecommendButton;
        notRecommendButton.style.backgroundColor = 'pink';
        notRecommendCount = maxGauge2;
    }

    // recommendButton이 존재할 때만 스타일 변경
    if (recommendButton) {
        recommendButton.style.zIndex = '1';
    }

    function checkButtonVisibility(selector) {
        const button = document.querySelector(selector);
        // 1. 존재하지 않으면 false 반환
        if (!button) {
            console.log(false);
            return false;
        }
        // 2. 크기 확인 (width와 height가 0이면 보이지 않는 것으로 판단)
        const rect = button.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            console.log(false);
            return false;
        }
        // 3. 모든 부모 요소의 display와 visibility를 체크
        let currentElement = button;
        while (currentElement) {
            const style = getComputedStyle(currentElement);
            if (style.display === 'none' || style.visibility === 'hidden') {
                console.log(false);
                return false;
            }
            currentElement = currentElement.parentElement;
        }
        // 위 모든 체크를 통과하면, 보이는 상태로 판단
        console.log("요소가 있습니다.");
        return true;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // fillGauge의 사용
    function fillRecommendGauge(recommendCount) {
        fillGauge(recommendButton, recommendCount, maxGauge, "Azure");
    }
    function fillNotRecommendGauge(notRecommendCount) {
        fillGauge(notRecommendButton, notRecommendCount, maxGauge2, "pink");
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    function fillGauge(button, count, maxCount, color) {
        if (maxCount === 1) return;

        const borderRadius = parseInt(getComputedStyle(button).borderRadius) - 0.5;
        const height = button.offsetHeight - 2;
        const width = button.offsetWidth;

        const newHeight = height * count / maxCount;
        const newBorderRadius = Math.min(borderRadius, ((newHeight - 0) / 2));
        const newLeft = Math.max(0, borderRadius - newBorderRadius);

        let newWidth;
        let newBottom = 0;

        const widthMap = {
            10: 85.2, 8: 85.2, 6: 85.2, 5: 85.2, 4: 85.1,
            3.5: 85.6, 3: 85.2, 2.5: 85.78, 2.2: 85.38, 2: 85.48,
            1.8: 84.68, 1.6: 84.18, 1.5: 86.18, 1.33: 85.18, 1: 85.18,
            0.67: 86.08, 0.5: 88.08
        };
        function getWidth(ratio) {
            return widthMap[ratio] ?? 85.22;
        }
        const deviceRatio = parseFloat(window.devicePixelRatio.toFixed(2));
        let baseWidth = getWidth(deviceRatio);

        let newWidth2 = width - 2 * (borderRadius - newBorderRadius) - 1.8 - 0.4 - 88.08 + 4 + 85.44;
        const nonRecommendButton = checkButtonVisibility('button#rateDown.item');
        if (color === "pink" || (color === "Azure" && nonRecommendButton)) { // 비추 버튼, 옆의 추천 버튼 보정
            if (deviceRatio === 5.00) {

            } else if (deviceRatio === 2.20) {
                newWidth2 -= 2.3;
            } else if (deviceRatio === 2.00) {
                newWidth2 -= 2.1;
                baseWidth += 0.2;
            } else if (deviceRatio === 1.33) {
                newWidth2 -= 0.7;
            } else if (deviceRatio === 1.00) {
                newWidth2 -= 1;
            } else if (deviceRatio === 0.67) {
                newWidth2 -= 2;
                newBottom += 0.5;
            } else if (deviceRatio === 0.50) {
                newWidth2 -= 4;
                newBottom += 0.9;
            }
            newWidth = newHeight >= 10 ? baseWidth : newWidth2;
        } else { // 비추 숨김일 때 추천 버튼 보정
            if (deviceRatio === 10.00) {
                newWidth2 -= 0.3;
            } else if (deviceRatio === 8.00) {
                newWidth2 -= 0.3;
            } else if (deviceRatio === 5.00) {
                newWidth2 -= 0.3;
            } else if (deviceRatio === 4.00) {
                newWidth2 -= 1.2;
            } else if (deviceRatio === 3.00) {
                baseWidth += 0.2;
            } else if (deviceRatio === 2.00) {
                newWidth2 -= 2.2;
            } else if (deviceRatio === 1.80) {
                baseWidth += 0.5;
            } else if (deviceRatio === 1.60) {
                newWidth2 -= 0.3;
                baseWidth += 0.5;
            } else if (deviceRatio === 1.50) {
                newWidth2 -= 0.7;
            } else if (deviceRatio === 1.33) {
                newWidth2 -= 0.1;
                baseWidth += 0.4;
            } else if (deviceRatio === 1.00) {
                newWidth2 -= 0.1;
            } else if (deviceRatio === 0.67) {
                newWidth2 -= 2;
                baseWidth -= 0.5;
            } else if (deviceRatio === 0.50) {
                newWidth2 -= 2;
            }
            newWidth = newHeight >= 10 ? baseWidth : newWidth2;
        }

        if (count < maxCount) {
            const newBackground = document.createElement('div');
            Object.assign(newBackground.style, {
                position: 'absolute',
                width: newWidth + 'px',
                height: newHeight + 'px',
                backgroundColor: color,
                bottom: newBottom + 'px',
                left: newLeft + 'px',
                zIndex: '-2',
                borderRadius: newBorderRadius + (deviceRatio === 5.00 ? -0.3 : 0) + 'px'
            });

            button.appendChild(newBackground);
            button.style.zIndex = '2';
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 아카 리프레셔의 비추천 안누름 버튼이 보이자마자 클릭해버리기
    const targetSelector = 'button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary'; // 추천 또는 비추 버튼

    // 게이지가 다 차기 직전이 아니면 비추 확인 창이 뜨자마자 꺼버림
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                // ELEMENT_NODE인지 확인 (텍스트 노드 등은 제외)
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // 해당 노드 내에 조건에 맞는 요소가 있는지 확인
                    const button = node.querySelector(targetSelector);
                    if (button && notRecommendCount < maxGauge2) {
                        button.click();
                        console.log("현재의 notRecommendCount", notRecommendCount + 1); // 비추 누른 횟수만 카운트
                    }
                }
            });
        });
    });

    // body 전체를 감시해 자식 요소 변화와 모든 하위 노드의 변화를 체크함
    observer.observe(document.body, { childList: true, subtree: true });

    let allowClick = false; // 복제된 버튼에서의 클릭은 허용하기 위한 플래그

    function beechuClick(e) {
        if (event.target !== notRecommendButton) return;
        console.log(notRecommendCount + 1, "비추 클릭");
        if (notRecommendCount < maxGauge2 - 1) return;
        const yea = document.querySelectorAll('button.MuiButtonBase-root.MuiButton-root.MuiButton-outlined.MuiButton-outlinedPrimary')[1];
        if (notRecommendCount === maxGauge2 - 1 && yea && e.target === yea) {
            interceptClick(e, fillNotRecommendGauge, maxGauge2);
        }
    }

    function interceptClick(e, func, variable) {
        // 복제된 버튼에서의 클릭이면 그냥 플래그를 리셋하고 정상 실행하도록 함.
        if (allowClick) {
            allowClick = false;
            return;
        }

        // 원래 버튼에서 발생한 클릭 이벤트는 잠시 차단
        e.stopImmediatePropagation();
        e.preventDefault();

        func(variable);
        const targetSelector3 = document.querySelectorAll('button.MuiButtonBase-root.MuiButton-root.MuiButton-outlined.MuiButton-outlinedPrimary')[1];

        targetSelector3.click();
        // 이후 복제된 버튼에서는 기존 이벤트를 실행할 수 있도록 플래그를 켜줌.
        allowClick = true;
        // 약간의 지연 후(0ms라도 좋음) 복제된 버튼에 클릭 이벤트를 강제로 발생시킵니다.
        //setTimeout(() => {
        // button.style.backgroundColor = 'pink';
        //}, 0);
    }

    // 캡처링 단계에서 클릭 이벤트를 가로채도록 true 옵션 사용
    document.addEventListener("click", beechuClick, true);


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    function pressRecommendButton() {
        recommendButton.style.backgroundColor = 'Azure';
        recommendButton.click();
    }
    function pressNotRecommendButton() {
        recommendButton.style.backgroundColor = 'pink';
        notRecommendButton.click();
    }

    if (mouseRecommendHardMode) {
        document.addEventListener('click', function(event) {
            if (!recommendButton) return;
            if (recommendCount >= maxGauge) return;
            if (recommendButton.contains(event.target)) {
                event.preventDefault();
                event.stopPropagation();
                recommendCount++
                fillRecommendGauge(recommendCount);
                if (recommendCount >= maxGauge) {
                    pressRecommendButton();
                    console.log("추천에 성공했습니다");
                }
            }
        });
    }

    if (mouseNotRecommendHardMode) {
        document.addEventListener('click', function(event) {
            if (!notRecommendButton) return;
            if (notRecommendCount >= maxGauge2 - 1) return;
            if (notRecommendButton.contains(event.target)) {
                event.preventDefault();
                event.stopPropagation();
                notRecommendCount++;
                fillNotRecommendGauge(notRecommendCount);
            }
        });
    }

    function triggerRecommend() {
        if (keyRecommendHardMode) {
            recommendCount++
            fillRecommendGauge(recommendCount);
            if (recommendCount >= maxGauge) {
                pressRecommendButton();
                console.log("추천에 성공했습니다");
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    // 키 동작 기능
    const keyHandlers = {
        keydown: {
            "f": () => triggerRecommend(),
            "d": () => scrollHandler('down'),
            "n": () => hideElementsInPortrait("Portrait"),
            "g": () => {
                if (/^https:\/\/arca\.live\/b\/[^\/?]+(?:\?p=[1-9]\d*)?$/.test(window.location.href)) { // 이 조건은 글 페이지, 목록 페이지 구분법 가져와도 되긴 함
                    const firstPost = document.querySelector('a.vrow.column:not(.notice)');
                    window.location.href = firstPost.href;
                } else { // 새로운 댓글 버튼 클릭 기능
                    const newCommentButton = document.querySelector('a.newcomment-alert.w-100.fetch-comment.d-block');
                    if (newCommentButton) {
                        const precount = getCommentCount(); // 댓글 갱신 이전의 개수 ?????

                        newCommentButton.click();
                        applyBackgroundColors1();
                        console.log("댓글 갱신이 진행됩니다");
                        const newCommentAlert = 'a.newcomment-alert.w-100.fetch-comment.d-block';
                        hideAll(newCommentAlert);

                        setTimeout(() => {
                            const count = getCommentCount();
                            console.log("새로운 댓글 개수:", count);
                            storeCurrentPage(); // 바뀐 댓글 개수 저장
                            setTimeout(() => {
                                applyBackgroundColors2(); // 댓글 아랫쪽 색상 변경
                            }, 2000); // 1+2초 후 호출
                        }, 1000); // 1초 후 호출
                        cloneAndOverlayLastComment();
                        function runCloneAndOverlayFor3Seconds() {
                            const interval = setInterval(() => {
                                cloneAndOverlayLastComment();
                            }, 10);
                            setTimeout(() => {
                                clearInterval(interval);
                            }, 500);
                        }
                        runCloneAndOverlayFor3Seconds();

                        storeCurrentPage(); // 최근 방문 시간, 댓글 수 새로 저장
                    } else {
                        console.log("댓글 추가 없음");
                        // 마지막 댓글을 찾아 복사 후 파란색으로 강조하여 표시하고, 수정/답글 이벤트를 재등록하며, 버튼을 반투명하게 설정
                        const comments = document.querySelectorAll('.comment-wrapper');
                        if (comments.length > 0) {
                            const lastComment = comments[comments.length - 1]; // 마지막 댓글 선택
                            const clonedComment = lastComment.cloneNode(true); // 깊은 복사
                            clonedComment.id = 'clonedComment-userScript'; // ID 부여

                            // 원본 댓글 숨기기
                            lastComment.style.display = "none";

                            // 배경색 변경 (파란색 강조)
                            const infoRow = clonedComment.querySelector('.content .info-row.clearfix');
                            const message = clonedComment.querySelector('.content .message');
                            if (infoRow) {
                                infoRow.style.backgroundColor = 'skyblue';
                                infoRow.style.setProperty("transition", "none", "important");
                            }
                            if (message) {
                                message.style.backgroundColor = 'Azure';
                                message.style.setProperty("transition", "none", "important");
                            }

                            // 수정 버튼 이벤트 재등록 및 반투명 스타일 적용
                            const cloneCompose = clonedComment.querySelector('.icon.ion-compose');
                            if (cloneCompose) {
                                // 버튼 반투명 적용
                                cloneCompose.parentNode.style.opacity = "0.2";
                                cloneCompose.parentNode.addEventListener('click', function(event) {
                                    event.preventDefault();
                                    // 원한다면 클릭 시 반투명 스타일을 원래대로 복원할 수 있습니다.
                                    // cloneCompose.parentNode.style.opacity = "1";
                                    const hiddenComment = document.querySelector('.comment-wrapper[style*="display: none"]');
                                    if (hiddenComment) {
                                        hiddenComment.style.display = '';
                                        clonedComment.style.display = 'none';
                                        hiddenComment.querySelector('.icon.ion-compose').parentNode.click();
                                    }
                                });
                            }

                            // 답글 버튼 이벤트 재등록 및 반투명 스타일 적용
                            const cloneReply = clonedComment.querySelector('.icon.ion-reply');
                            if (cloneReply) {
                                // 버튼 반투명 적용
                                cloneReply.parentNode.style.opacity = "0.2";
                                cloneReply.parentNode.addEventListener('click', function(event) {
                                    event.preventDefault();
                                    // cloneReply.parentNode.style.opacity = "1"; // 필요 시 원래대로 복원
                                    const hiddenComment = document.querySelector('.comment-wrapper[style*="display: none"]');
                                    if (hiddenComment) {
                                        hiddenComment.style.display = '';
                                        clonedComment.style.display = 'none';
                                        hiddenComment.querySelector('.icon.ion-reply').parentNode.click();
                                    }
                                });
                            }
                            // 클론된 댓글을 원본 댓글이 있던 부모에 추가
                            lastComment.parentNode.appendChild(clonedComment);
                        }

                    }
                }
            },
            "h": () => {
                const toggle = toggleAnonymizeSetting();
                let anony = toggle; // 글 작성자, 댓글 작성자, 사이드바 게시물 익명화
                let anony2 = toggle; // 기존 게시글 목록 익명화
                location.reload(); // 새로고침
            },
        },
        keydownShift: {
            "Q": () => {window.location.href = myLink;},
            "D": () => scrollHandler('up'), // 위로 빠르게, 위로 느리게, 멈춤
            // "P": () => {cleanOldVisitedPages(1);},
            "A": () => {
                event.preventDefault(); // 기본 동작 막기
                event.stopPropagation(); // 버블링 막기
                goToClosestUnreadAbove(); // 위쪽 안 읽은 글로 이동
            },
            "S": () => {
                event.preventDefault(); // 기본 동작 막기
                event.stopPropagation(); // 버블링 막기
                goToClosestUnreadBelow(); // 아래쪽 안 읽은 글로 이동
            },
        },
    };

    //////////////////////////////////////

    // 전역 변수 선언
    let scrollDirection = null; // 'up' 또는 'down'
    let scrollSpeed = 0; // 0: 정지, 1: 빠른 스크롤, 2: 느린 스크롤
    let scrollInterval = null;
    let stopTimeout = null;
    let loadFinished = false;
    var visitedPages = {};

    //////////////////////////////////////

    // 익명화 설정 값을 변경하고 로컬 스토리지에 저장하는 함수
    function setAnonymizeSetting(newSetting) {
        if (typeof newSetting === "boolean") {
            anonymizeSetting = newSetting;
            GM_setValue("anonymizeSetting", anonymizeSetting);
            console.log("익명화 설정이 업데이트되었습니다:", anonymizeSetting);
        } else {
            console.error("익명화 설정은 boolean 값이어야 합니다.");
        }
    }

    function toggleAnonymizeSetting() {
        // 기존 설정 값을 로컬 스토리지에서 불러옴
        let currentSetting = GM_getValue("anonymizeSetting", DEFAULT_ANONYMIZE_SETTING);
        // 값을 반대로 토글
        let newSetting = !currentSetting;
        // 로컬 스토리지에 저장 및 전역 변수 업데이트
        GM_setValue("anonymizeSetting", newSetting);
        anonymizeSetting = newSetting;
        console.log("익명화 설정이 토글되었습니다:", newSetting);
        return newSetting;
    }

    //////////////////////////////////////

    // 사이드바 아이템 제거
    document.querySelectorAll('.sidebar-item').forEach(element => element.remove());
    // *ㅎㅎ 공지 제거
    const notices = document.querySelectorAll('a.vrow.column.notice');
    const filteredElements = Array.from(notices).filter(element => element.textContent.includes('*ㅎㅎ'));
    filteredElements.forEach(element => {element.remove();});
    // 광고 제거
    ['.sticky-container .ad', '.banner'].forEach(selector => document.querySelector(selector)?.remove());
    document.querySelector('.ad#svQazR5NHC3xCQr3')?.remove();
    // iframe이면 여기서 종료
    function isIframe() {return window.self !== window.top;}
    if (isIframe()) return;

    // 🔄 스크립트 실행 시 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .my-script-hidden-post {
            display: none;  /* 처음엔 보이지 않음 */
        }
    `;
    document.head.appendChild(style);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function updateReplyColors() {
        if (replyColoring) {
            applyBackgroundColors1(); // 댓글 윗쪽 색상 변경
            applyBackgroundColors2(); // 댓글 아랫쪽 색상 변경
        }
    }
    // 댓글 입력창 색칠 (색칠 여부는 자동 판단)
    updateReplyColors();
    // 이후 코드에서 클릭의 경우도 감지, g키도 확인

    // 댓글이 0개인 경우 댓글창 헤드 색칠 + 댓글 입력창 상단부
    function applyBackgroundColors1() {
        // 댓글 입력창 상단부 색칠
        const elements = [
            { selector: '.reply-form .reply-form__container .reply-form__user-info', color: 'lightgreen' },
            { selector: '.reply-form-button-container', color: 'lightgreen' },
            { selector: '.reply-form-arcacon-button.btn-namlacon', color: '#32CD32' }
        ];
        elements.forEach(({ selector, color }) => {
            const element = document.querySelector(selector);
            if (element) element.style.backgroundColor = color;
        });

        // 댓글 0개일 때 댓글 개수 칸을 하늘색으로 칠함
        // 댓글 개수 칸 선택
        const commentCounterBar = els.commentCounter;
        const writeButton = els.writeBtn;
        if (!commentCounterBar) return;
        // 없으면 목록 페이지이고, 색칠할 필요 없음

        const startTime = Date.now();
        const interval = setInterval(() => {
            const currentTime = Date.now();
            if (currentTime - startTime >= 3000) {
                clearInterval(interval); // 길어야 3초 후 종료
                return;
            }
            // 댓글 개수 칸 색 변경
            const newColor = getCommentCount() === 0 ? 'rgb(130, 206, 235)' : 'rgba(0, 0, 0, 0)';
            const newColor2 = getCommentCount() === 0 ? 'rgb(50, 148, 235)' : 'rgba(0, 0, 0, 0)';
            let previousColor = window.getComputedStyle(commentCounterBar).backgroundColor;

            if (newColor !== previousColor) {
                commentCounterBar.style.backgroundColor = newColor;
                writeButton.style.backgroundColor = newColor2;
                writeButton.style.borderColor = newColor2;
                clearInterval(interval); // 색을 변경했으니 종료
            }
        }, 50);
    }

    // 댓글이 하나 이상 있는 경우
    // 댓글을 새로 불러오면 기존의 댓글들이 싹 새로 불러와져서 색을 되돌리는 과정은 필요없음
    function applyBackgroundColors2() {
        const comments = document.querySelectorAll('.comment-wrapper');
        if (comments.length > 0) {
            const lastComment = comments[comments.length - 1]; // 마지막 댓글 선택
            const infoRow = lastComment.querySelector('.content .info-row.clearfix');
            const message = lastComment.querySelector('.content .message');

            // 색 변경
            if (infoRow) infoRow.style.backgroundColor = 'skyblue';
            infoRow.style.setProperty("transition", "none", "important");
            if (message) message.style.backgroundColor = 'Azure'; // AliceBlue, Azure 추천
            message.style.setProperty("transition", "none", "important");
        }
    }

    // 댓글 갱신
    function cloneAndOverlayLastComment() {
        const comments = document.querySelectorAll('.comment-wrapper');
        if (comments.length === 0) return;

        const lastComment = comments[comments.length - 1];
        const clone = lastComment.cloneNode(true);
        clone.id = 'clonedComment-userScript';
        lastComment.style.display = "none";

        //////////////////////////////////////////////////////////////

        // 원본 스타일 복사
        const computedStyle = window.getComputedStyle(lastComment);
        clone.style.textAlign = computedStyle.textAlign;
        clone.style.fontSize = computedStyle.fontSize;
        clone.style.animation = "none";
        clone.querySelectorAll('img').forEach(imgClone => { // 이미지 크기 유지
            const originalImg = lastComment.querySelector(`img[src="${imgClone.src}"]`);
            if (originalImg) {
                const originalImgStyle = window.getComputedStyle(originalImg);
                imgClone.style.width = originalImgStyle.width;
                imgClone.style.height = originalImgStyle.height;
            }
        });

        // 위치와 크기 복사
        // const rect = lastComment.getBoundingClientRect();
        // 원본 스타일 유지
        clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        clone.querySelectorAll('img').forEach(imgClone => {
            const originalImg = lastComment.querySelector(`img[src="${imgClone.src}"]`);
            if (originalImg) {
                const originalImgStyle = window.getComputedStyle(originalImg);
                imgClone.style.width = originalImgStyle.width;
                imgClone.style.height = originalImgStyle.height;
            }
        });
        // 신고 버튼 구현
        const cloneAlert = clone.querySelector('.icon.ion-alert');
        cloneAlert.parentNode.onclick = function () {
        };

        // 삭제 버튼 구현
        const cloneDelete = clone.querySelector('.icon.ion-trash-b');
        if (cloneDelete) {
            cloneDelete.parentNode.addEventListener('click', function(event) {
            });
        };

        // 수정 버튼 구현
        const cloneCompose = clone.querySelector('.icon.ion-compose');
        if (cloneCompose) {
            cloneCompose.parentNode.addEventListener('click', function(event) {
                event.preventDefault();
                const list = document.querySelectorAll('#clonedComment-userScript');
                list.forEach((element, index) => {
                    if (index > 0 && list[index - 1].style.display === 'none') element.remove();
                });
                list[list.length - 1].style.display = '';
                const hiddenComment = Array.from(document.querySelectorAll('.comment-wrapper'))
                .find(element => getComputedStyle(element).display === 'none');
                hiddenComment.style.display = '';
                clone.style.display = 'none';
                hiddenComment.querySelector('.icon.ion-compose').parentNode.click();
            });
        };

        // 답글 버튼 구현
        const cloneReply = clone.querySelector('.icon.ion-reply');
        if (cloneReply) {
            cloneReply.parentNode.addEventListener('click', function(event) {
                event.preventDefault();
                const list = document.querySelectorAll('#clonedComment-userScript');
                list.forEach((element, index) => {
                    if (index > 0 && list[index - 1].style.display === 'none') element.remove();
                });
                list[list.length - 1].style.display = '';
                const hiddenComment = Array.from(document.querySelectorAll('.comment-wrapper'))
                .find(element => getComputedStyle(element).display === 'none');
                hiddenComment.style.display = '';
                clone.style.display = 'none';
                hiddenComment.querySelector('.icon.ion-reply').parentNode.click();
            });
        };

        const fadein = lastComment.querySelector('.content-item fadein');
        const infoRow = clone.querySelector('.content .info-row.clearfix');
        infoRow.style.animation = "none";
        const message = clone.querySelector('.content .message');
        // 색 변경
        if (infoRow) infoRow.style.backgroundColor = 'skyblue';
        infoRow.style.setProperty("transition", "none", "important");

        if (message) message.style.backgroundColor = 'Azure'; // AliceBlue, Azure 추천
        message.style.setProperty("transition", "none", "important");

        lastComment.parentNode.style.setProperty("transition", "none", "important");

        if (message) message.style.backgroundColor = 'Azure'; // AliceBlue, Azure 추천 // orange
        lastComment.parentNode.appendChild(clone);
        comments.forEach(comment => {
        });
    }///////////////////////////////////////////////////////////////////////////

    let commentNumberChanged = false;

    const newCommentAlert = 'a.newcomment-alert.w-100.fetch-comment.d-block';
    function hideFirst(selector) {
        const elements = document.querySelectorAll(selector);
        if (elements.length >= 2) {
            elements[0].style.backgroundColor = 'pink'; // 작동함!!
            elements[0].style.display = 'none'; // 요소를 완전히 숨김
            elements[0].style.setProperty("display", "none", "important");
        }
    }

    function hideAll(selector) {
        document.querySelectorAll(selector).forEach(element => {
            element.style.setProperty("display", "none", "important");
        });
    }

    // MutationObserver를 설정하는 함수
    function observeDOMChanges(targetNode) {
        if (!(targetNode instanceof Node)) {
            console.error("오류: MutationObserver를 실행할 대상이 유효한 Node가 아닙니다.", targetNode);
            return;
        }
        const observer = new MutationObserver(() => {
            hideFirst(newCommentAlert);
        });

        observer.observe(targetNode, { childList: true, subtree: true });
    }
    document.addEventListener("DOMContentLoaded", () => {
        observeDOMChanges(document.body);
    });

    function observeAndCloneNewCommentButton() {
        const callback = (mutationsList, observer) => {
            const newCommentButton = document.querySelector('a.newcomment-alert.w-100.fetch-comment.d-block'); // "새로운 댓글이 달렸습니다" 버튼
            if (newCommentButton) {
                const clone = newCommentButton.cloneNode(true);
                const comments = document.querySelectorAll('.comment-wrapper');
                const lastComment = comments[comments.length - 1];

                if (lastComment && !commentNumberChanged) {
                    lastComment.parentNode.appendChild(clone);
                    commentNumberChanged = true;
                }
            } else commentNumberChanged = false;
        };

        const observer = new MutationObserver(callback);
        observer.observe(document.body, { childList: true, subtree: true });
    }
    // 감시 시작
    observeAndCloneNewCommentButton();

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function scrollHandler(inputDirection) {
        if (scrollSpeed === 0 || scrollDirection !== inputDirection) {
            scrollDirection = inputDirection;
            scrollSpeed = 1;
        } else {
            scrollSpeed = scrollSpeed === 1 ? 2 : 0;
            if (scrollSpeed === 0) scrollDirection = null;
        }

        clearInterval(scrollInterval);
        clearTimeout(stopTimeout);
        if (scrollSpeed === 0) return;

        // 스크롤 이동량 및 간격 설정
        // 빠른 스크롤: 이동량 2, 인터벌 4ms / 느린 스크롤: 이동량 1, 인터벌 5ms
        let moveAmount = (scrollSpeed === 1) ? 2 : 1;
        let intervalDelay = (scrollSpeed === 1) ? 4 : 5;
        // 방향에 따라 양수(아래) 또는 음수(위) 적용
        let scrollAmount = (scrollDirection === 'down') ? moveAmount : -moveAmount;

        scrollInterval = setInterval(() => {
            window.scrollBy({ top: scrollAmount, left: 0 });
        }, intervalDelay);

        // 일정 시간(예: 8000ms) 후에 자동 정지 처리
        stopTimeout = setTimeout(() => {
            clearInterval(scrollInterval);
            scrollSpeed = 0;
            scrollDirection = null;
        }, 8000);
    }

    // 가로세로 판별 함수
    function detectScreenMode() {
        return window.innerWidth >= 992 ? "Landscape" : "Portrait"; // 가로 : 세로
    }

    // 세로일 때 몇몇 요소 지우기
    function hideElementsInPortrait(isPortrait = "Portrait", hideMore) {
        // Set default value for 'hideMore' inside the function body.
        if (hideMore === undefined) {
            hideMore = false;
        }
        if (isPortrait === "Portrait") {
            const elementsToHide = ["nav.navbar", "div.board-title", "div#vote.vote-area", "div.article-menu.mt-2",
                                    "div.edit-menu", "div.alert.alert-info", "div.article-link", "a.vrow.column.notice notice-unfilter"]; // 숨길 요소의 선택자 목록
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = "none";
            });
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = "none";
            });

            if (hideMore) { ////////////////////////////////////////////
                const container = document.querySelector("div#comment.article-comment.position-relative");
                //console.log("컨테이너 선택");
                if (container) {
                    //console.log("컨테이너는 있음");
                    const title = container.querySelector(".title");
                    title.remove();
                    const title1 = container.querySelector(".reply-form.write");
                    title1.remove();
                }
                const container2 = document.querySelector("div.btns-board");
                if (container) {
                    //console.log("컨테이너는 있음2");
                    const title = container2.querySelector(".float-right");
                    title.remove();
                    const title1 = container2.querySelector(".float-left");
                    title1.remove();
                }
                document.querySelector("div.board-category-wrapper").remove();
                const history = document.querySelector("div.channel-visit-history");
                if (history) history.remove();
                // document.querySelector("div.btns-board").remove();
                // document.querySelector("div.board-Btns").remove();

            }

            document.querySelectorAll("a.vrow.column.notice").forEach(element => {
                element.style.display = "none";
            });
            const vrowInner = document.querySelector('div.vrow-inner');
            if (vrowInner) {
                const parent = vrowInner.parentElement;
                if (parent) parent.style.display = 'none';
            }
            const allAds = document.querySelectorAll('div.ad');
            // 모든 요소를 순회하면서 작업 수행
            allAds.forEach(ad => {
                ad.remove(); // 예시: 요소 없애기
            });

            // MutationObserver를 사용하여 DOM 변경 시 자동으로 notice 요소 제거
            const targetSelectors = ["a.vrow.column.notice", "a.vrow.column.notice.notice-unfilter"];
            const observer = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            targetSelectors.forEach(sel => { if (node.matches(sel)) node.remove(); });
                            targetSelectors.forEach(sel => { node.querySelectorAll(sel).forEach(el => el.remove()); });
                        }
                    });
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    const handleKeyEvent = (event) => {
        // 반복 이벤트 무시, 직접 입력이 아니면 무시
        if (event.repeat || !event.isTrusted) return;

        // 텍스트 입력창에 포커스가 있으면 키 입력 무시
        const activeElement = document.activeElement;
        const tagName = activeElement.tagName.toLowerCase();
        const isTextInput = (
            tagName === "textarea" ||
            (tagName === "input" && ["text", "password", "email", "search", "tel", "url", "number", "date", "time"].includes(activeElement.type)) ||
            activeElement.isContentEditable
        );
        if (isTextInput) return;

        // 키 입력
        if (event.shiftKey) {
            if (event.type === "keydown") keyHandlers.keydownShift?.[event.key]?.(event);
            else if (event.type === "keyup") keyHandlers.keyupShift?.[event.key]?.(event);
        } else {
            if (event.type === "keydown") keyHandlers.keydown?.[event.key]?.(event);
            else if (event.type === "keyup") keyHandlers.keyup?.[event.key]?.(event);
        }
    };
    if (keyActionsEnabled) {
        window.addEventListener("keydown", handleKeyEvent);
        window.addEventListener("keyup", handleKeyEvent);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const waitForElementState = (selector, desiredState = "present", timeout = 10000) => {
        return new Promise((resolve, reject) => {
            // 조건 체크 함수: "present"이면 요소가 존재하는지, "removed"이면 요소가 없는지 판단
            const checkCondition = () => {
                const element = document.querySelector(selector);
                if (desiredState === "present") return element || null;
                if (desiredState === "removed") return element ? null : true;
            };

            // 초기 상태 검사
            const initialResult = checkCondition();
            if ((desiredState === "present" && initialResult) || (desiredState === "removed" && initialResult === true)) {
                return resolve(initialResult);
            }

            const observer = new MutationObserver(() => {
                const result = checkCondition();
                if ((desiredState === "present" && result) || (desiredState === "removed" && result === true)) {
                    observer.disconnect();
                    resolve(result);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Desired state "${desiredState}" not achieved within the maximum wait time.`));
            }, timeout);
        });
    };

    // 특정 요소가 화면에 보이는지 확인하는 함수
    function isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 방문 페이지 정보를 저장할 객체 (정렬 없이, URL을 키로 사용)
    visitedPages = {};

    // 보관 기간 (예: 30일). 이후 방문 기록은 정리합니다.
    var retentionPeriod = 10 * 365 * 24 * 60 * 60 * 1000; // 10년

    // 저장소에서 방문 기록을 불러옵니다.
    // visitedPages 전역변수를 불러옴.
    function getVisitedPages() {
        let stored = GM_getValue("visitedPages");
        if (stored === undefined) {
            visitedPages = {};
        } else {
            try {
                visitedPages = JSON.parse(stored);
            } catch (e) {
                visitedPages = {};
            }
        }
        return visitedPages;
    }
    getVisitedPages();

    // 방문 기록에 페이지 정보를 추가하거나 업데이트합니다.
    function addVisitedPage(pageUrl = window.location.origin + window.location.pathname, time = Date.now(), noSave = false) {
        getVisitedPages();
        const comment = getCommentCount();
        if (!visitedPages[pageUrl]) {
            // 새로 방문한 페이지이면, 최초 방문 및 최근 방문 시각, 댓글 수를 모두 기록
            visitedPages[pageUrl] = {
                firstVisit: time,
                lastVisit: time,
                comment: comment
            };
        } else {
            // 이미 존재하면 최신 방문 시각, 댓글만 업데이트
            visitedPages[pageUrl].lastVisit = time;
            visitedPages[pageUrl].comment = comment;
        }
        if (!noSave) {
            GM_setValue("visitedPages", JSON.stringify(visitedPages));
            // console.log("저장했습니다", pageUrl, visitedPages[pageUrl]);
        }
    }

    function delVisitedPage(pageUrl, noSave = false) {
        getVisitedPages(); // 저장소에서 기존 방문 기록 불러오기
        if (visitedPages[pageUrl]) {
            delete visitedPages[pageUrl];
            if (!noSave) {
                GM_setValue("visitedPages", JSON.stringify(visitedPages));
            }
        }
    }

    // 보관 기간(retentionPeriod)을 넘긴 방문 기록을 정리합니다.
    function cleanOldVisitedPages(retentionPeriod = retentionPeriod, noSave = false) {
        const now = Date.now();
        let changed = false;
        for (const pageUrl in visitedPages) {
            if (visitedPages.hasOwnProperty(pageUrl)) {
                // 마지막 방문 시각이 현재보다 retentionPeriod보다 오래 전이면 삭제
                if (now - visitedPages[pageUrl].lastVisit > retentionPeriod) {
                    delete visitedPages[pageUrl];
                    changed = true;
                }
            }
        }
        if (changed && !noSave) {
            GM_setValue("visitedPages", JSON.stringify(visitedPages));
        }
    }

    function getBaseUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathSegments = urlObj.pathname.split('/');
            // 필요한 경우 첫 4개 세그먼트만 사용
            if (pathSegments.length > 4) {
                urlObj.pathname = pathSegments.slice(0, 4).join('/');
            }
            return urlObj.origin + urlObj.pathname;
        } catch (e) {
            return url;
        }
    }

    function storeCurrentPage(noSave = false) {
        let baseUrl = window.location.origin + window.location.pathname;
        if (window.location.pathname.split('/').length > 4) {
            baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, 4).join('/');
        }
        addVisitedPage(baseUrl, Date.now(), noSave);
    }

    function isPageVisited(pageUrl) {
        getVisitedPages();
        return visitedPages.hasOwnProperty(pageUrl);
    }

    document.addEventListener("contextmenu", function (event) {
        if (event.ctrlKey) { // 컨트롤 + 우클릭을 누른 상태에서만 실행
            const target = event.target.closest("a"); // 클릭한 위치에서 가장 가까운 <a> 태그 탐색
            if (target) {
                const href = target.href.split('?')[0];
                console.log("쿼리 제거 후 URL:", href);
                event.preventDefault(); // 기본 우클릭 메뉴 방지
                delVisitedPage(href); // 저장소에서 URL 제거
            }
        }
    });

    function getCurrentPageNumber() {
        const element = document.querySelector('.page-item.active');
        return Number(element.textContent.trim());
    }

    // 위에도 검색창 만들기
    const searchBar = document.querySelector("body > div.root-container > div.content-wrapper.clearfix > article > div > form.form-inline.search-form.justify-content-end");

    getVisitedPages();

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    // 댓글 개수를 세는 함수
    function getCommentCount() {
        // 첫 번째 요소: <span class="title-comment-count">[0]</span>
        let element = document.querySelector('span.title-comment-count');
        if (element) {
            // 대괄호([])를 제거하고 숫자만 추출합니다.
            const text = element.textContent.replace(/[\[\]]/g, '').trim();
            const count = parseInt(text, 10);
            if (!isNaN(count)) {
                return count;
            }
        }
        // 두 번째 요소: <span class="body comment-count">0</span>
        element = document.querySelector('span.body.comment-count');
        if (element) {
            const text = element.textContent.trim();
            const count = parseInt(text, 10);
            if (!isNaN(count)) {
                return count;
            }
        }
        return 0;
    }

    async function createGeneralPostSectionFromAdjacentPage(direction = "curr", postCount, adjacentClonedItem = document.getElementById("adjacent-posts-container")) {
        const currentPage = window.currentPrevPage;
        let targetPage;

        if (direction === "prev") {
            if (window.prevLoadCount >= window.MAX_PREV_LOAD_COUNT) {
                console.warn("최대 이전 페이지 로드 횟수에 도달하여 로드를 중단합니다.");
                return;
            }
            if (currentPage > 1) {
                targetPage = currentPage - 1;
                window.currentPrevPage = targetPage; // 부모 변수 업데이트
                window.prevLoadCount++;
            } else {
                return;
            }
        } else if (direction === "curr") {
            targetPage = currentPage;
        } else if (direction === "next") {
            targetPage = currentPage + 1;
        } else {
            console.error("유효한 방향('prev', 'curr' 또는 'next')을 입력하세요.");
            return;
        }
        // 사이드바(또는 body)에 붙이기
        const sidebarContainer = document.querySelector('div.sidebar-item')?.parentElement;

        // 컨테이너 생성
        adjacentClonedItem = adjacentClonedItem ? adjacentClonedItem : document.getElementById("adjacent-posts-container");
        if (!adjacentClonedItem) {
            // console.log("새 인접 게시글 컨테이너 생성");
            adjacentClonedItem = document.createElement('div');
            adjacentClonedItem.id = "adjacent-posts-container";
            adjacentClonedItem.style.backgroundColor = 'white';
            adjacentClonedItem.style.maxHeight = '600px';
            adjacentClonedItem.style.overflowY = 'auto';
            adjacentClonedItem.style.marginTop = '10px';
            adjacentClonedItem.style.width = '310px';
            adjacentClonedItem.classList.add('my-script-hidden-post');

            // 상단 구분선 추가
            const topSeparator = document.createElement('div');
            topSeparator.style.height = '1px';
            topSeparator.style.backgroundColor = 'gray';
            topSeparator.style.margin = '0';
            adjacentClonedItem.appendChild(topSeparator);

            if (sidebarContainer) {
                sidebarContainer.appendChild(adjacentClonedItem);
            } else {
                document.body.appendChild(adjacentClonedItem);
            }
        }

        // curr의 경우 iframe 없이 바로 처리
        if (direction === "curr") {
            // 현재 페이지에서 active(현재 보고 있는 글)의 위치를 찾음
            let posts = Array.from(document.querySelectorAll('a.vrow.column:not(.notice)'));
            const activeIndex = posts.findIndex(post => {
                try {
                    const currentUrl = new URL(window.location.href);
                    const postUrl = new URL(post.href, window.location.origin);
                    return postUrl.pathname === currentUrl.pathname;
                } catch (e) {
                    return false;
                }
            });

            if (activeIndex !== -1) {
                let start = Math.max(0, activeIndex - Math.floor(postCount / 2));
                let end = Math.min(posts.length, start + postCount);
                posts = posts.slice(Math.max(0, end - postCount), end);
            } else {
                posts = posts.slice(0, postCount);
            }

            await extractAndAppendPosts(document, adjacentClonedItem, direction, postCount, posts);
            finalizeAdjacentSection(adjacentClonedItem);
            return;
        }

        // prev 또는 next의 경우 hidden iframe을 생성하여 targetPage 로드
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        const currentUrl = new URL(location.href);
        const originUrl = window.location.origin;
        const pathName = window.location.pathname.split('/').slice(0, 3).join('/');
        const baseUrl = `${originUrl}${pathName}`;

        // 현재 페이지의 URL 객체 생성
        currentUrl.searchParams.delete("p");
        let otherParams = currentUrl.searchParams.toString();
        if (otherParams) {
            iframe.src = `${baseUrl}?p=${targetPage}&${otherParams}`; // 다른 파라미터가 있으면 추가
        } else {
            iframe.src = `${baseUrl}?p=${targetPage}`; // 없으면 그냥 p만 붙임
        }
        console.log("iframe src:", iframe.src);
        document.body.appendChild(iframe);

        iframe.onload = function() {
            const thickSeparator = document.createElement('div');
            thickSeparator.style.height = '2px';
            thickSeparator.style.backgroundColor = 'gray';
            thickSeparator.style.margin = '0';
            if (makeBorder && direction === "next") {
                adjacentClonedItem.appendChild(thickSeparator);
            }
            console.log("iframe 로드 완료, targetPage =", targetPage);

            const doc = iframe.contentDocument || iframe.contentWindow.document;
            extractAndAppendPosts(doc, adjacentClonedItem, direction, postCount);

            iframe.remove();
            finalizeAdjacentSection(adjacentClonedItem);
            if (makeBorder && direction === "prev") {
                adjacentClonedItem.appendChild(thickSeparator);
            }
        };

        iframe.onerror = function() {
            console.error(`페이지 ${targetPage}의 iframe 로드 중 오류 발생.`);
            iframe.remove();
            finalizeAdjacentSection(adjacentClonedItem);
        };

        function finalizeAdjacentSection(container) {
            // 위치 설정 및 고정
            container.style.position = 'sticky';
            container.style.top = '10px';
        }
    }

    // 게시글 추출 및 컨테이너에 추가
    async function extractAndAppendPosts(doc, container, direction, postCount, posts = null) {
        const containerElement = doc.querySelector('div.article-list');
        if (!containerElement) {
            console.error("게시글 컨테이너를 찾을 수 없습니다.");
            return;
        }
        if (!posts) {
            posts = Array.from(containerElement.querySelectorAll('a.vrow.column:not(.notice)'));
            posts = direction === "prev" ? posts.slice(-postCount) : direction === "next" ? posts.slice(0, postCount) : posts;
        }

        posts.forEach(post => {
            const clonedPost = post.cloneNode(true);
            clonedPost.querySelectorAll('.vrow-preview').forEach(preview => preview.remove());
            // 배경색 확인
            const computedStyle = window.getComputedStyle(post);
            const backgroundColor = computedStyle.backgroundColor;
            let url = clonedPost.href;
            const baseUrl = getBaseUrl(url); // iframe의 기존 게시판에 있는 글일테니 ?만 해결하면 됨 (아님, getBaseUrl 만들어서 사용)
            if (backgroundColor === 'rgb(208, 208, 208)' || backgroundColor === 'rgb(238, 238, 238)' || isPageVisited(baseUrl)) {
                clonedPost.style.color = 'lightgray';
            }

            const idElement = clonedPost.querySelector('.vcol.col-id');
            if (idElement) idElement.remove();

            const viewElement = clonedPost.querySelector('.vcol.col-view');
            if (viewElement) {
                const viewSpan = document.createElement('span');
                viewSpan.innerText = '조회수 ';
                viewElement.parentNode.insertBefore(viewSpan, viewElement);
            }

            const rateElement = clonedPost.querySelector('.vcol.col-rate');
            if (rateElement && viewElement) {
                const rateSpan = document.createElement('span');
                rateSpan.innerText = '추천 ';
                viewElement.parentNode.insertBefore(rateSpan, rateElement);
            }

            clonedPost.style.fontSize = '11px';
            if (clonedPost.classList.contains('active')) {
                clonedPost.style.backgroundColor = '#d0d0d0';
                clonedPost.style.zIndex = '2';
                clonedPost.style.color = 'lightgray'; // 텍스트 색상을 회색으로 설정 /////////

                const activeBackgroundDiv = document.createElement('div');
                activeBackgroundDiv.style.position = 'absolute';
                activeBackgroundDiv.style.top = '0';
                activeBackgroundDiv.style.left = '0';
                activeBackgroundDiv.style.width = '100%';
                activeBackgroundDiv.style.height = '100%';
                activeBackgroundDiv.style.backgroundColor = '#EEEEEE';
                activeBackgroundDiv.style.zIndex = '-1';
                clonedPost.style.position = 'relative';
                // active 클래스를 제거하여 이후 키 이벤트 등에 영향이 없도록 합니다.
                clonedPost.classList.remove('active');
                clonedPost.appendChild(activeBackgroundDiv);
            }

            container.appendChild(clonedPost);
            const separator = document.createElement('div');
            separator.style.height = '1px';
            separator.style.backgroundColor = 'gray';
            separator.style.margin = '0';
            container.appendChild(separator);
        });

        container.classList.add(`${direction}-loaded`);
    }

    // 게시글 개수 분배
    function calculateAboveBelowNext(pageNumber, activeIndex, length = 45, count = 15) {
        const half = Math.floor(count/2); // = 7
        // 1페이지인 경우 이전 페이지에서 가져올 게시글은 없으므로 prev는 항상 0
        if (pageNumber === 1) {
            // active가 0-indexed 기준으로 후반(8번째 이상)이 아니면
            if (activeIndex < length - half) {
                return [0, count, 0]; // 전부 현재 페이지에서 사용
            } else {
                const curr = count + (length - half -1) - activeIndex;
                return [0, curr, count - curr];
            }
        } else {
            // 2페이지 이상인 경우
            if (activeIndex < half) {
                return [half - activeIndex, count - (half - activeIndex), 0]; // 페이지 상단일 때
            } else if (activeIndex < length - half) {
                return [0, 15, 0]; // 중간 부분이면 현재 페이지 전체 15개 사용
            } else {
                const curr = count + (length - half -1) - activeIndex;
                return [0, curr, count - curr];
            }
        }
    }

    // 최종 목표: 우측 컨테이너를 인접 게시글로 채우기!!!
    async function createAdjacentPostsSection(postCount) {
        // if (detectScreenMode() === "Portrait") return;
        const posts = Array.from(document.querySelectorAll('a.vrow.column:not(.notice)'));

        let activeIndex = posts.findIndex(post => {
            try {
                const currentUrl = new URL(window.location.href);
                const postUrl = new URL(post.href, window.location.origin);
                return postUrl.pathname === currentUrl.pathname;
            } catch (e) {
                console.error("findIndex 오류:", e);
                return false;
            }
        });

        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = getCurrentPageNumber() || parseInt(urlParams.get('p')) || 1; // yyy
        const postDistribution = calculateAboveBelowNext(currentPage, Math.max(activeIndex, 0), posts.length, postCount);
        // 이전, 현재, 다음 페이지 섹션 로드 및 조건 기반 대기
        try {
            (async () => {
                if (postDistribution[0] > 0) {
                    // console.log("이전 페이지에서", postDistribution[0], "개 게시글 로드");
                    await createGeneralPostSectionFromAdjacentPage("prev", postDistribution[0]);
                    await waitForCondition(() => document.querySelector('.prev-loaded') !== null, 10000); // 타임아웃 오류가 뜨면 이 숫자 등을 늘릴 것
                }

                if (postDistribution[1] > 0) {
                    // console.log("현재 페이지에서", postDistribution[1], "개 게시글 로드");
                    await createGeneralPostSectionFromAdjacentPage("curr", postDistribution[1]);
                    await waitForCondition(() => document.querySelector('.curr-loaded') !== null, 2000);
                }

                if (postDistribution[2] > 0) {
                    // console.log("다음 페이지에서", postDistribution[2], "개 게시글 로드");
                    await createGeneralPostSectionFromAdjacentPage("next", postDistribution[2]);
                    await waitForCondition(() => document.querySelector('.next-loaded') !== null, 2000);
                }
                // console.log("모든 게시글 로드 완료");
                let isHidden = true;
                function revealPosts() {
                    // 🔵 모두 완료된 후 한꺼번에 보이기
                    document.querySelectorAll('.my-script-hidden-post').forEach(post => {
                        post.classList.remove('my-script-hidden-post'); // 숨김 속성 클래스 제거
                        isHidden = false;
                    });
                    if (!isHidden) {
                        clearInterval(intervalId); // 반복 멈춤
                        loadFinished = true;
                    }
                }
                const intervalId = setInterval(revealPosts, 200); // 0.2초마다 반복
            })();
        } catch (error) {
            console.warn("조건 기반 대기 중 오류 발생:", error);
        }
    }

    function waitForCondition(predicate, timeout = 2000, interval = 50) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const timer = setInterval(() => {
                if (predicate()) {
                    clearInterval(timer);
                    resolve();
                } else if (Date.now() - startTime >= timeout) {
                    clearInterval(timer);
                    reject(new Error("조건이 충족되지 않음 (타임아웃)")); // 타임아웃 오류는 여기
                }
            }, interval);
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async function insertDistributedAdjacentPostsAboveBoard(postCount = 9) {
        // 세로 모드(Portrait)에서만 실행
        if (detectScreenMode() !== "Portrait") return;

        // 메인 게시판 컨테이너 찾기
        const mainBoard = els.mainBoard;
        if (!mainBoard) {
            console.warn("메인 게시판 컨테이너를 찾을 수 없습니다.");
            return;
        }

        // 게시글 목록(공지 제외) 가져오기
        const posts = Array.from(mainBoard.querySelectorAll('a.vrow.column:not(.notice)'));
        if (posts.length === 0) return;
        // 현재 페이지 번호 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = getCurrentPageNumber() || parseInt(urlParams.get('p')) || 1;

        // 현재 페이지의 active 게시글 인덱스 찾기
        let activeIndex = posts.findIndex(post => {
            try {
                const currentUrl = new URL(window.location.href);
                const postUrl = new URL(post.href, window.location.origin);
                return postUrl.pathname === currentUrl.pathname;
            } catch (e) {
                return false;
            }
        });
        if (activeIndex < 0) activeIndex = 0;

        // 게시글 분배 계산
        const [numPrev, numCurr, numNext] = calculateAboveBelowNext(currentPage, activeIndex, posts.length, postCount);
        //console.log([numPrev, numCurr, numNext]);

        // 게시판 위에 추가할 컨테이너 생성
        const container = document.createElement('div');
        container.id = "distributed-adjacent-posts";
        container.style.backgroundColor = '#fff';
        container.style.padding = '5px';
        container.style.marginBottom = '5px';
        container.style.border = '1px solid #ccc';
        container.style.width = '100%';
        container.style.maxHeight = 'none';

        try {
            //console.log(numPrev);
            if (numPrev > 0) {
                await createGeneralPostSectionFromAdjacentPage("prev", numPrev, container);
                //console.log("✅ prev 로딩 완료");
                await delay(1000); // 🔹 prev 완료 후 1000ms 대기
            }

            //console.log(numCurr);
            if (numCurr > 0) {
                await createGeneralPostSectionFromAdjacentPage("curr", numCurr, container);
                //  console.log("✅ curr 로딩 완료");
                await delay(1000); // 🔹 curr 완료 후 1000ms 대기
            }

            //console.log(numNext);
            if (numNext > 0) {
                await createGeneralPostSectionFromAdjacentPage("next", numNext, container);
                //  console.log("✅ next 로딩 완료");
            }
        } catch (error) {
            console.warn("게시글 로딩 중 오류 발생:", error);
        }

        // 메인 게시판 위에 컨테이너 삽입
        mainBoard.parentNode.insertBefore(container, mainBoard);
        loadFinished = true; // 세로 모드에서도 로딩 완료 상태로 표시
    }

    // 🔹 지정한 시간(ms) 동안 대기하는 함수
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function clonePostsWithOriginalStyle(doc, container, postsToClone) {
        postsToClone.forEach(post => {
            // 기존 게시글 요소를 수정 없이 그대로 클론
            const clonedPost = post.cloneNode(true);
            container.appendChild(clonedPost);
            // 구분선이 필요하다면 추가 (원본과 유사한 방식)
            const separator = document.createElement('div');
            separator.style.height = '1px';
            separator.style.backgroundColor = 'gray';
            separator.style.margin = '0';
            container.appendChild(separator);
        });
    }
    function clonePostsPreservingStyle(doc, container, postCount, posts = null) {
        // doc: 원본 문서, container: 삽입할 컨테이너
        // posts가 없으면 원본 문서에서 게시글을 선택 (공지 제외)
        if (!posts) {
            posts = Array.from(doc.querySelectorAll('a.vrow.column:not(.notice)'));
            posts = posts.slice(0, postCount);
        }
        posts.forEach(post => {
            // 원본 요소를 그대로 복제 (스타일, 클래스, 인라인 스타일 모두 유지)
            const clonedPost = post.cloneNode(true);
            container.appendChild(clonedPost);

            // 필요에 따라 구분선을 추가 (원본과 동일하게)
            const separator = document.createElement('div');
            separator.style.height = '1px';
            separator.style.backgroundColor = 'gray';
            separator.style.margin = '0';
            container.appendChild(separator);
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // (A) 인접 페이지의 게시글을 가져오는 함수
    async function createGeneralPostSectionFromAdjacentPage2(direction, postCount, container) {
        const currentPage = getCurrentPageNumber();
        let targetPage;

        if (direction === "prev") {
            if (currentPage <= 1) return;
            targetPage = currentPage - 1;
        } else if (direction === "next") {
            targetPage = currentPage + 1;
        } else {
            targetPage = currentPage;
        }

        const currentUrl = new URL(location.href);
        currentUrl.searchParams.delete("p");
        const baseUrl = currentUrl.origin + currentUrl.pathname;
        const otherParams = currentUrl.searchParams.toString();
        const targetUrl = otherParams ? `${baseUrl}?p=${targetPage}&${otherParams}` : `${baseUrl}?p=${targetPage}`;

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = targetUrl;
        document.body.appendChild(iframe);

        return new Promise((resolve, reject) => {
            iframe.onload = function() {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                const boardContainer = doc.querySelector('.article-list') || doc.querySelector('.board-article-list');
                if (!boardContainer) {
                    iframe.remove();
                    return reject(new Error("게시글 컨테이너를 찾을 수 없습니다."));
                }
                let posts = Array.from(boardContainer.querySelectorAll('a.vrow.column:not(.notice)'));
                if (direction === "prev") {
                    posts = posts.slice(-postCount);
                } else if (direction === "next") {
                    posts = posts.slice(0, postCount);
                }
                posts.forEach(post => {
                    container.appendChild(post.cloneNode(true));
                });
                iframe.remove();
                resolve();
            };

            iframe.onerror = function() {
                iframe.remove();
                reject(new Error("iframe 로드 오류"));
            };
        });
    }

    /////////////////////////////////////////////////////////////////////////

    // (B) 메인 게시판에 인접 게시글을 추가하는 함수
    async function addAdjacentPostsToMainBoard() {
        const mainBoard = els.mainBoard;
        if (!mainBoard) {
            console.warn("메인 게시판을 찾을 수 없습니다.");
            return;
        }

        const currentPage = getCurrentPageNumber();

        // 이전 페이지의 마지막 2개 게시글 추가
        if (currentPage > 1) {
            const prevContainer = document.createElement('div');
            await createGeneralPostSectionFromAdjacentPage2("prev", 2, prevContainer);
            const prevPosts = prevContainer.querySelectorAll('a.vrow.column:not(.notice)');
            if (prevPosts.length > 0) {
                const fragment = document.createDocumentFragment();
                prevPosts.forEach(prevPost => {
                    const clonedPost = prevPost.cloneNode(true);
                    fixDateFormat(clonedPost); // 각 클론된 게시글의 날짜 변환
                    clonedPost.style.backgroundColor = "Azure"; // : "#e6f7ff"; // 색상 적용
                    const url = clonedPost.href;
                    const baseUrl = getBaseUrl(url);
                    if (isPageVisited(baseUrl)) clonedPost.style.color = 'lightgray';

                    fragment.appendChild(clonedPost);
                });
                const firstPost = mainBoard.querySelector('a.vrow.column:not(.notice)');

                const thickSeparator = document.createElement('div');
                thickSeparator.style.height = '2px';
                thickSeparator.style.backgroundColor = 'gray';
                thickSeparator.style.margin = '0';

                if (firstPost && firstPost.parentNode) {
                    firstPost.parentNode.insertBefore(fragment, firstPost);
                    // firstPost.parentNode.insertBefore(thickSeparator, firstPost);
                } else {
                    mainBoard.insertBefore(fragment, mainBoard.firstChild);
                    // mainBoard.insertBefore(thickSeparator, mainBoard.firstChild);
                }
            }
            // console.log("34434");
        }

        // 다음 페이지의 처음 2개 게시글 추가
        const nextContainer = document.createElement('div');
        await createGeneralPostSectionFromAdjacentPage2("next", 2, nextContainer);
        const nextPosts = nextContainer.querySelectorAll('a.vrow.column:not(.notice)');
        if (nextPosts.length > 0) {
            const lastPost = mainBoard.querySelectorAll('a.vrow.column:not(.notice)')[mainBoard.querySelectorAll('a.vrow.column:not(.notice)').length - 1];

            const thickSeparator = document.createElement('div');
            thickSeparator.style.height = '2px';
            thickSeparator.style.backgroundColor = 'gray';
            thickSeparator.style.margin = '0';

            if (lastPost && lastPost.parentNode) {
                // lastPost.parentNode.appendChild(thickSeparator);

                nextPosts.forEach(nextPost => {
                    const clonedPost = nextPost.cloneNode(true);
                    fixDateFormat(clonedPost); // 각 클론된 게시글의 날짜 변환
                    clonedPost.style.backgroundColor = 'rgb(255, 230, 235)'; // 색상 적용
                    const url = clonedPost.href;
                    const baseUrl = getBaseUrl(url);
                    if (isPageVisited(baseUrl)) clonedPost.style.color = 'lightgray';

                    lastPost.parentNode.appendChild(clonedPost);
                });
            } else {
                // mainBoard.appendChild(thickSeparator);

                nextPosts.forEach(nextPost => {
                    const clonedPost = nextPost.cloneNode(true);
                    fixDateFormat(clonedPost); // 날짜 형식 수정
                    clonedPost.style.backgroundColor = "pink"; // 색상 적용

                    mainBoard.appendChild(clonedPost);
                });
            }

        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////

    // 사이드바 관리 모듈
    const SidebarManager = {
        container: null,
        init: () => {
            SidebarManager.container = document.getElementById('adjacent-posts-container') || SidebarManager.createContainer();
        },
        createContainer: () => {
            const div = document.createElement('div');
            div.id = 'adjacent-posts-container';
            div.style.position = 'fixed';
            div.style.top = '10px';
            div.style.right = '10px';
            document.body.appendChild(div);
            return div;
        },
        getPosts: () => SidebarManager.container.querySelectorAll('a.vrow.column:not(.notice)'),
        addPost: (post) => {
            const link = document.createElement('a');
            link.href = post.href;
            link.textContent = post.textContent || '게시글';
            link.className = 'vrow column';
            SidebarManager.container.appendChild(link);
        },
        highlightPost: (post) => {
            post.style.transition = 'background-color 0.3s';
            post.style.backgroundColor = '#ffeb3b';
            setTimeout(() => {post.style.backgroundColor = ''}, 300);
        },
    };

    // 탐색 모듈 (fetch와 연동)
    const Navigation = {
        currentPage: 1, // 현재 페이지 번호 (실제로는 URL에서 가져와야 함)
        init: () => {
            Navigation.currentPage = new URL(window.location.href).searchParams.get('p') || 1;
        },
        goToClosestUnreadBelow: async () => {
            const posts = SidebarManager.getPosts();
            let currentIndex = Navigation.getActiveIndex(posts);
            if (currentIndex === -1) {
                // 현재 페이지에 해당 게시글이 없으면 인접 페이지 로드
                const nextPosts = await fetchAdjacentPage(Navigation.currentPage + 1);
                nextPosts.forEach(post => SidebarManager.addPost(post));
            }
            currentIndex = Navigation.getActiveIndex(SidebarManager.getPosts());
            const unreadPost = Navigation.findClosestUnreadBelow(SidebarManager.getPosts(), currentIndex);
            if (unreadPost) {
                SidebarManager.highlightPost(unreadPost);
                setTimeout(() => {window.location.href = unreadPost.href}, 300);
            }
        },
        getActiveIndex: (posts) => Array.from(posts).findIndex(post => post.href === window.location.href),
        findClosestUnreadBelow: (posts, startIndex) => {
            for (let i = startIndex + 1; i < posts.length; i++) {
                if (!Navigation.isPageVisited(posts[i].href.split('?')[0])) return posts[i];
            }
            return null;
        },
        isPageVisited: (url) => localStorage.getItem(url) === 'visited', // 방문 여부 확인 (예시)
    };

    // 설정 관리 모듈
    const Settings = {
        maxGauge: GM_getValue('maxGauge', 5), // Tampermonkey 값 가져오기 예시
        anonymizeSetting: GM_getValue('anonymizeSetting', false),
        save: () => {
            GM_setValue('maxGauge', Settings.maxGauge);
            GM_setValue('anonymizeSetting', Settings.anonymizeSetting);
        },
    };

    // 초기화 및 단축키 설정
    SidebarManager.init();
    /*
    Navigation.init();
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'S') {
            Navigation.goToClosestUnreadBelow();
        }
    });

    // 이후에는 Navigation.currentPage 사용
    console.log(Navigation.currentPage);
    */

    ///////////////////////////////////////////////////////////////////////////////////////
    // 페이지의 모든 <t> 요소의 날짜 형식을 동적으로 업데이트하는 함수
    function updateDynamicDateFormat() {
        // datetime 속성을 가진 모든 <t> 요소를 찾음
        const timeElements = document.querySelectorAll('time[datetime]');

        timeElements.forEach(element => {
            // 요소가 댓글 컨테이너(.comment-wrapper) 내에 있는지 확인
            if (!element.closest('.comment-wrapper')) {
                // 댓글 컨테이너 밖에 있는 경우에만 날짜 업데이트 수행
                const datetime = element.getAttribute('datetime');
                const postDate = new Date(datetime); // ISO 8601 형식 파싱 (예: 2025-03-16T18:03:46.000Z)
                const now = new Date(); // 현재 시간
                const diffInHours = (now - postDate) / (1000 * 60 * 60); // 시간 차이 계산 (단위: 시간)
                // console.log(diffInHours);
                let formattedDate;
                if (diffInHours < 24) {
                    // 24시간 이내: "HH:mm" 형식으로 표시
                    formattedDate = postDate.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hourCycle: 'h23' // 이게 중요
                    }); // 예: "18:03"
                    // console.log(formattedDate);
                } else {
                    // 24시간 초과: "YYYY. MM. DD" 형식으로 표시
                    const year = postDate.getFullYear();
                    const month = String(postDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
                    const day = String(postDate.getDate()).padStart(2, '0');
                    formattedDate = `${year}. ${month}. ${day}`; // 예: "2025. 03. 16"
                }

                // 변환된 날짜로 텍스트 업데이트
                element.textContent = formattedDate;
            }
        });
    }

    // 페이지가 로드될 때 함수 실행
    updateDynamicDateFormat();

    let countT = 0;
    const intervalId = setInterval(() => {
        if (countT < 10) {
            // console.log(`작동: ${countT + 1}`); // 원하는 작업 실행
            updateDynamicDateFormat();
            countT++;
        } else {
            clearInterval(intervalId); // 10초 작동 후 멈춤
        }
    }, 100); // 0.1초마다 실행


    // 모든 게시글의 날짜를 변환하는 함수
    function fixAllPostDates() {
        const allPosts = document.querySelectorAll('.article-list .vrow.column');
        allPosts.forEach(post => {
            fixDateFormat(post);
            // console.log(post);
        });
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // 날짜 파싱 함수
    function parseBoardDate(dateString) {
        // 예: "2025-03-17 02:54:01" 형식 처리
        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hour, minute, second);
    }

    // 날짜 형식 변환 함수
    function formatPostDate(dateString) {
        const postDate = parseBoardDate(dateString); // 날짜를 Date 객체로 변환
        const now = new Date(); // 현재 시간
        const diffInHours = (now - postDate) / (1000 * 60 * 60); // 시간 차이 계산

        if (diffInHours < 24) {
            // 24시간 이내: "HH:mm" 형식
            return postDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        } else {
            // 24시간 이상: "YYYY.MM.DD" 형식
            const year = postDate.getFullYear();
            const month = String(postDate.getMonth() + 1).padStart(2, '0');
            const day = String(postDate.getDate()).padStart(2, '0');
            return `${year}.${month}.${day}`;
        }
    }

    // 메인 게시판의 날짜 업데이트
    function fixDateFormat(postElement) {
        const dateElem = postElement.querySelector('.col-date'); // 날짜가 있는 요소
        if (dateElem) {
            const originalDate = dateElem.textContent; // 원래 날짜 문자열
            const formattedDate = formatPostDate(originalDate); // 변환된 날짜
            dateElem.textContent = formattedDate; // 화면에 반영
        }
    }

    // 모든 게시글에 적용
    document.querySelectorAll('.article-list .vrow.column').forEach(post => {
        fixDateFormat(post);
    });

    function parseDateString(dateString) {
        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hour, minute, second);
    }

    function toLocalDate(dateString) {
        const date = parseDateString(dateString);
        const offset = date.getTimezoneOffset() * 60000; // 로컬 시간대 오프셋 (밀리초)
        return new Date(date.getTime() - offset); // 로컬 시간으로 변환
    }
    // (C) DOMContentLoaded 이벤트에서 실행하도록 추가
    document.addEventListener("DOMContentLoaded", () => {
        addAdjacentPostsToMainBoard().catch(err => console.error(err));
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let i = 1;
    // 작성자, 댓글 작성자, 사이드바 게시물 작성자 익명화
    if (anony) {
        // loadFinished 상태를 주기적으로 확인하는 함수
        let checkLoadFinished = setInterval(function() {
            if (loadFinished) {
                clearInterval(checkLoadFinished); // 주기적인 상태 확인 중지
                const sidePosts = document.querySelectorAll('.user-info');

                // 여러 필터링 조건을 한 번에 적용
                const filteredSidePosts = Array.from(sidePosts).reduce((acc, post) => {
                    if (
                        (!post.closest('.article-view') || !post.closest('.board-title')) &&
                        !post.closest('.board-article-list') &&
                        !post.closest('.included-article-list') &&
                        !post.closest('.nav')
                    ) {
                        acc.push(post);
                    }
                    return acc;
                }, []);

                filteredSidePosts.forEach(
                    name => {
                        name.style.whiteSpace = "pre"; // 전후의 공백 유지
                        name.textContent = '홀붕이 ' + i + '  ';
                        i++;
                    }
                );
            }
        }, 100);
    }

    let j = i;
    if (anony2) { // 메인 페이지 게시글 익명화
        function anonymizePosts() {
            // loadFinished 상태를 주기적으로 확인하는 함수
            let checkLoadFinished = setInterval(function() {
                if (loadFinished) {
                    clearInterval(checkLoadFinished); // 주기적인 상태 확인 중지
                    const sidePosts = document.querySelectorAll('.user-info');

                    // 여러 필터링 조건을 한 번에 적용
                    const filteredSidePosts = Array.from(sidePosts).reduce((acc, post) => {
                        if (
                            (post.closest('.article-list') && !post.closest('.board-title'))||
                            (post.closest('.board-article-list') && !post.closest('.board-title')) ||
                            post.closest('.included-article-list') // &&
                        ) {
                            acc.push(post);
                        }
                        return acc;
                    }, []);

                    filteredSidePosts.forEach(
                        (element, index) => {
                            if (element.textContent.trim() !== "*ㅎㅎ") {
                                element.textContent = `홀붕이 ${j}`;
                                j++;
                            }
                        }
                    );
                    j = i;
                }
            }, 100);
        }
        // MutationObserver로 DOM 변화를 감지하여 anonymizePosts 함수 실행
        const observer = new MutationObserver((mutationsList, observer) => {
            let loadFinished = false;
            mutationsList.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    loadFinished = true;
                }
            });
            if (loadFinished) {
                anonymizePosts();
            }
        });

        // 감시할 대상 노드와 옵션 설정
        const config = { childList: true, subtree: true, attributes: true };

        // 대상 노드 설정 (body 요소를 감시)
        observer.observe(document.body, config);

        // 초기 호출
        anonymizePosts();
    }




    ///////////////////////////////////////////////////////////////////////////////////////////////////
    getVisitedPages();

    // 마지막으로 메인 게시글들 읽음 여부 다시 설정
    let postPage = document.querySelector('.article-view'); // 있으면 글 페이지
    const element44 = els.commentCounter; // 있으면 글 페이지
    let boerdPage = document.querySelector('.board-article-list'); // 있으면 목록 페이지
    const mainPage = postPage || boerdPage;
    let mainPosts = Array.from(mainPage.querySelectorAll(' a.vrow.column:not(.notice)'));
    //console.log(mainPosts);

    mainPosts.forEach((post) => {
        post.querySelectorAll('.vrow-preview').forEach(preview => preview.remove());
        let url = post.href;
        const baseUrl = url.split('?')[0];

        // 현재 페이지의 번호 추출
        const currentPath = window.location.pathname;
        const currentParts = currentPath.split('/');
        const currentNumber = currentParts[currentParts.length - 1];

        // 게시글의 번호 추출
        const postPath = new URL(baseUrl).pathname;
        const postParts = postPath.split('/');
        const postNumber = postParts[postParts.length - 1];

        // 읽음 여부 확인 + 번호 일치 여부 확인
        if (isPageVisited(baseUrl) || currentNumber === postNumber) {
            post.style.color = 'lightgray';
        } else {
            post.style.color = 'black';
        }
    });
    // 별의 색상 다시 지정
    const starElement = document.querySelector('.ion-android-star');
    if (starElement) {
        const style = document.createElement('style');
        style.textContent = `
        .ion-android-star::before {
            color: orange;
        }
    `;
        document.head.appendChild(style);
    }

    // 안읽은 답글 숫자 지정 //?????
    const allPosts = Array.from(document.querySelectorAll(' a.vrow.column:not(.notice)'));
    allPosts.forEach((post) => {
        if (getBaseUrl(post.href) !== getBaseUrl(location.href)) {
            const count = post.querySelector('.comment-count');

            let comments;
            if (count === null) comments = 0;
            else comments = count.textContent.match(/\d+/)[0];
            const url = post.href.split('?')[0];
            getVisitedPages();
            const recordedComments = visitedPages[url];

            if (!recordedComments) return;
            if (comments > recordedComments.comment) {
                let colorDetermine = comments - recordedComments.comment;
                count.style.color = colorDetermine === 1 ? 'rgb(255,155,77)' : 'red'; // 댓글 숫자가 이 색(주황, 빨강)으로 표시됨
                if (colorDetermine > 2) count.style.fontWeight = "bold"; // 3개 이상 쌓이면 굵은 글씨로 표시됨
            }
        }
    });

    // 새 댓글 색깔 바꾸기
    function colorNewComment () {
        // 저장된 visitedPages를 객체로 불러오기 (기본값은 빈 객체)
        let stored = GM_getValue("visitedPages", "{}");
        try {
            stored = JSON.parse(stored);
        } catch (e) {
            stored = {};
        }

        const pageUrl = window.location.origin + window.location.pathname;
        // 저장된 데이터에 현재 페이지 방문 기록이 없으면 종료
        if (!(stored[pageUrl] && stored[pageUrl].lastVisit)) {
            console.log("Your First Visit!");
            return;
        }

        let tempLastVisitTime = stored[pageUrl].lastVisit;

        // 댓글 색칠 작업 (tempLastVisitTime을 기준으로)
        // 댓글 컨테이너 선택자를 '.comment-wrapper'로 변경
        const comments = document.querySelectorAll('.comment-wrapper');
        console.log("찾은 댓글 수:", comments.length);

        comments.forEach((comment, index) => {
            console.log(`댓글 ${index + 1} 처리 시작`);

            // 댓글 내의 시간 요소는 보통 <time> 태그에 datetime 속성이 있음
            const timeElement = comment.querySelector('time[datetime]');
            console.log(`댓글 ${index + 1}: 시간 요소`, timeElement);

            if (timeElement) {
                const datetimeAttr = timeElement.getAttribute('datetime');
                console.log(`댓글 ${index + 1}: datetime 속성 값: ${datetimeAttr}`);

                const commentTime = new Date(datetimeAttr);
                console.log(`댓글 ${index + 1}: 파싱된 시간: ${commentTime}`);

                const tempVisitTime = new Date(tempLastVisitTime);
                console.log(`나의 마지막 방문 시간: ${tempVisitTime}`);

                if (commentTime > tempVisitTime) {
                    console.log(`댓글 ${index + 1}: 새로운 댓글로 판단되어 배경색 변경`);
                    const message = comment.querySelector('.content .message');
                    if (message) {
                        message.style.backgroundColor = '#FFFFE0';
                    }
                } else {
                    console.log(`댓글 ${index + 1}: 새 댓글이 아님`);
                }
            } else {
                console.log(`댓글 ${index + 1}: 시간 요소를 찾을 수 없음`);
            }
        });
    }


    function getSidebarPosts() {
        const sidebarContainer = document.getElementById('adjacent-posts-container');
        if (!sidebarContainer) return [];
        return Array.from(sidebarContainer.querySelectorAll('a.vrow.column:not(.notice)'));
    }

    function getActiveIndexInSidebar(posts) {
        return posts.findIndex(post => {
            try {
                const currentUrl = new URL(window.location.href);
                const postUrl = new URL(post.href, window.location.origin);
                return postUrl.pathname === currentUrl.pathname;
            } catch (e) {
                return false;
            }
        });
    }

    function findClosestUnreadAbove(posts, activeIndex) {
        for (let i = activeIndex - 1; i >= 0; i--) {
            const url = posts[i].href.split('?')[0];
            if (!isPageVisited(url)) {
                return posts[i];
            }
        }
        return null;
    }

    function findClosestUnreadBelow(posts, activeIndex) {
        for (let i = activeIndex + 1; i < posts.length; i++) {
            const url = posts[i].href.split('?')[0];
            if (!isPageVisited(url)) {
                return posts[i];
            }
        }
        return null;
    }

    function isArticlePage() {
        return document.querySelector('.article-view') !== null;
    }

    function goToClosestUnreadAbove() {
        if (!isArticlePage()) return;
        const posts = getSidebarPosts();
        let activeIndex = getActiveIndexInSidebar(posts);
        if (activeIndex === -1) return;
        let unreadPost = findClosestUnreadAbove(posts, activeIndex);
        // 현재 글과 같은 URL은 건너뛰기
        while (unreadPost && unreadPost.href === window.location.href) {
            activeIndex = posts.indexOf(unreadPost);
            unreadPost = findClosestUnreadAbove(posts, activeIndex);
        }
        if (unreadPost) {
            window.location.href = unreadPost.href;
        }
    }

    function goToClosestUnreadBelow() {
        if (!isArticlePage()) return; // 게시글 페이지가 아닌 경우 종료
        const posts = getSidebarPosts(); // 사이드바 게시글 목록 가져오기
        let activeIndex = getActiveIndexInSidebar(posts); // 현재 활성 게시글 인덱스 찾기
        if (activeIndex === -1) {
            console.log("활성 게시글을 찾을 수 없습니다.");
            return;
        }
        let unreadPost = findClosestUnreadBelow(posts, activeIndex); // 아래쪽 안 읽은 게시글 찾기
        if (unreadPost) {
            window.location.href = unreadPost.href; // 안 읽은 게시글이 있으면 이동
        } else {
            console.log("아래에 안 읽은 게시글이 없습니다."); // 없으면 이동하지 않음
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    async function fetchAdjacentPage(page) {
        const url = new URL(window.location.href); // 현재 URL 기반으로
        url.searchParams.set('p', page); // 페이지 번호 변경
        const response = await fetch(url); // HTML 요청
        const html = await response.text(); // 텍스트로 받기
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html'); // DOM으로 변환
        return doc.querySelectorAll('a.vrow.column:not(.notice)'); // 게시글만 추출
    }

    function addShortcutGuide() {
        const guide = document.createElement('div');
        guide.id = 'shortcut-guide';
        guide.style.position = 'fixed';
        guide.style.bottom = '10px';
        guide.style.right = '10px';
        guide.style.background = '#fff';
        guide.style.padding = '10px';
        guide.style.border = '1px solid #ccc';
        guide.innerHTML = `
        <style>
            kbd {
                background-color: #FFC0CB; /* 분홍색 배경 */
                color: #000000; /* 검은색 글씨 */
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 2px 4px;
                font-family: monospace;
            }
        </style>
        <h3>단축키 안내 (<kbd>Shift + H</kbd>로 토글)</h3>
        <h4>단축키</h4>
        <ul>
            <li><kbd>f</kbd>: 추천 (하드모드)</li>
            <li><kbd>d</kbd>: 아래로 스크롤(빠름/느림)</li>
            <li><kbd>n</kbd>: 세로 모드 요소 숨기기</li>
            <li><kbd>g</kbd>: 게시판 첫 글/새 댓글 새로고침</li>
            <li><kbd>h</kbd>: 익명화 토글</li>
        </ul>
        <h4>Shift + 단축키</h4>
        <ul>
            <li><kbd>Shift + Q</kbd>: 홀로라이브 채널로 이동</li>
            <li><kbd>Shift + D</kbd>: 위로 스크롤(빠름/느림)</li>
            <li><kbd>Shift + A</kbd>: 위쪽 안 읽은 글</li>
            <li><kbd>Shift + S</kbd>: 아래쪽 안 읽은 글</li>
        </ul>
    `;
        document.body.appendChild(guide);
        guide.style.display = 'none';

        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.key === 'H') {
                guide.style.display = guide.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
    addShortcutGuide();


})();