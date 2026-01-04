// ==UserScript==
// @name         a-ha.io 차단 사용자 모니터링
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  차단된 사용자 목록에 없는 질문을 모니터링
// @author       You
// @match        https://www.a-ha.io/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/529940/a-haio%20%EC%B0%A8%EB%8B%A8%20%EC%82%AC%EC%9A%A9%EC%9E%90%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/529940/a-haio%20%EC%B0%A8%EB%8B%A8%20%EC%82%AC%EC%9A%A9%EC%9E%90%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 활성화된 URL 목록
    const ACTIVE_URLS = [
        'https://www.a-ha.io/?feed=answer&sub=everyone&answerType=unanswered',
        'https://www.a-ha.io/?feed=interest&sub=everyone',
        'https://www.a-ha.io/',
        'https://www.a-ha.io/?feed=interest'
    ];

    // 현재 페이지가 활성화된 URL인지 확인
    function isActiveUrl() {
        return ACTIVE_URLS.includes(window.location.href);
    }

    // 비활성 상태 UI 생성
    function createInactiveUI() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'monitor-status';
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;

        statusDiv.innerHTML = `
            <p style="color: #f88; margin: 0 0 10px 0;">❗ 이 페이지에서는 모니터링이 비활성화되어 있습니다.</p>
            <button id="goto-active" style="
                padding: 5px 10px;
                background: #15C47E;
                border: none;
                border-radius: 4px;
                color: white;
                cursor: pointer;
            ">미답변 질문 페이지로 이동</button>
        `;

        document.body.appendChild(statusDiv);

        document.getElementById('goto-active').onclick = () => {
            window.location.href = 'https://www.a-ha.io/?feed=answer&sub=everyone&answerType=unanswered';
        };
    }

    // 페이지 로드 시 실행
    function init() {
        if (isActiveUrl()) {
            checkQuestions();
        } else {
            createInactiveUI();
        }
    }

    // 기본 차단된 사용자 목록
    const defaultBlockedUsers = [
    ];

    // localStorage에서 차단된 사용자 목록 가져오기
    const getBlockedUsers = () => {
        const savedUsers = GM_getValue('blockedUsers', null);
        return savedUsers ? JSON.parse(savedUsers) : defaultBlockedUsers;
    };

    // 차단된 사용자 목록 저장
    const saveBlockedUsers = (users) => {
        GM_setValue('blockedUsers', JSON.stringify(users));
    };

    // 초기 설정
    if (!GM_getValue('blockedUsers')) {
        saveBlockedUsers(defaultBlockedUsers);
    }

    // 상태 표시 UI 생성
    function createStatusUI() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'monitor-status';
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            max-width: 375px;
            max-height: 80vh;
            overflow-y: auto;
            cursor: move;
            user-select: none;
        `;

        // 드래그 기능 추가
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        statusDiv.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === statusDiv) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, statusDiv);
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        // 차단 사용자 추가 버튼
        const addButton = document.createElement('button');
        addButton.textContent = '➕ 차단 사용자 추가';
        addButton.style.cssText = `
            margin: 5px;
            padding: 5px 10px;
            background: #15C47E;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
        `;
        addButton.onclick = () => {
            const newUser = prompt('차단할 사용자의 닉네임을 입력하세요:');
            if (newUser) {
                const blockedUsers = getBlockedUsers();
                if (!blockedUsers.includes(newUser)) {
                    blockedUsers.push(newUser);
                    saveBlockedUsers(blockedUsers);
                    checkQuestions();
                    alert(`${newUser}가 차단 목록에 추가되었습니다.`);
                } else {
                    alert('이미 차단된 사용자입니다.');
                }
            }
        };

        // 차단 목록 보기 버튼
        const viewButton = document.createElement('button');
        viewButton.textContent = '📋 차단 목록 보기';
        viewButton.style.cssText = `
            margin: 5px;
            padding: 5px 10px;
            background: #666;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
        `;
        viewButton.onclick = () => {
            const blockedUsers = getBlockedUsers();
            alert('현재 차단된 사용자 목록:\n' + blockedUsers.join('\n'));
        };

        // 재탐색 버튼 추가
        const refreshButton = document.createElement('button');
        refreshButton.textContent = '🔄 재탐색';
        refreshButton.style.cssText = `
            margin: 5px;
            padding: 5px 10px;
            background: #3498db;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
        `;
        refreshButton.onclick = () => {
            checkQuestions();
        };

        // 삭제 버튼 추가
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '➖ 차단 사용자 삭제';
        deleteButton.style.cssText = `
            margin: 5px;
            padding: 5px 10px;
            background: #dc3545;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
        `;
        deleteButton.onclick = () => {
            const blockedUsers = getBlockedUsers();
            if (blockedUsers.length === 0) {
                alert('차단된 사용자가 없습니다.');
                return;
            }

            const userToDelete = prompt(
                '삭제할 사용자의 닉네임을 입력하세요:\n현재 차단 목록:\n' +
                blockedUsers.join('\n')
            );

            if (userToDelete) {
                const index = blockedUsers.indexOf(userToDelete);
                if (index > -1) {
                    blockedUsers.splice(index, 1);
                    saveBlockedUsers(blockedUsers);
                    checkQuestions();
                    alert(`${userToDelete}가 차단 목록에서 삭제되었습니다.`);
                } else {
                    alert('해당 사용자를 찾을 수 없습니다.');
                }
            }
        };

        statusDiv.appendChild(addButton);
        statusDiv.appendChild(viewButton);
        statusDiv.appendChild(refreshButton);
        statusDiv.appendChild(deleteButton);
        document.body.appendChild(statusDiv);
        return statusDiv;
    }

    // ESC 키 이벤트 처리 부분을 수정하여 '-' 키 이벤트도 추가
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const statusDiv = document.getElementById('monitor-status');
            if (statusDiv) {
                statusDiv.style.display = statusDiv.style.display === 'none' ? 'block' : 'none';
            }
        } else if (e.key === '-') {
            window.location.href = 'https://www.a-ha.io/?feed=answer&sub=everyone&answerType=unanswered';
        }
    });

    // 질문 확인 및 표시
    function checkQuestions() {
        const statusDiv = document.getElementById('monitor-status') || createStatusUI();
        const posts = document.querySelectorAll('div.css-1xc0fl5');
        const newQuestions = [];
        const blockedUsers = getBlockedUsers();

        posts.forEach(post => {
            const userNameElement = post.querySelector('.css-fe545l');
            if (!userNameElement) return;

            const userName = userNameElement.textContent;
            const questionTitle = post.querySelector('.css-1j6eql0')?.textContent || '제목 없음';
            const questionContent = post.querySelector('.css-5z1n3l')?.textContent || '';
            const timePosted = post.querySelector('.css-6eocg2')?.textContent || '';

            // 링크 가져오기 수정
            const questionLink = post.closest('a')?.href || '';

            if (!blockedUsers.includes(userName)) {
                newQuestions.push({
                    user: userName,
                    title: questionTitle,
                    content: questionContent,
                    time: timePosted,
                    link: questionLink
                });
            }
        });

        let statusHTML = '<h3>🔍 새로운 질문 모니터링</h3>';

        if (newQuestions.length === 0) {
            statusHTML += '<p style="color: #f88;">❗ 표시할 질문이 없습니다.</p>';
        } else {
            statusHTML += `<p style="color: #8f8;">✓ ${newQuestions.length}개의 질문이 발견되었습니다:</p>`;
            newQuestions.forEach((q, index) => {
                statusHTML += `
                    <div style="border-left: 3px solid #8f8; padding-left: 10px; margin: 10px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <p style="margin: 5px 0;">${q.user} (${q.time})</p>
                            <div style="display: flex; gap: 5px;">
                                <button
                                    class="answer-btn"
                                    data-link="${q.link}"
                                    style="
                                        padding: 2px 6px;
                                        background: #15C47E;
                                        border: none;
                                        border-radius: 4px;
                                        color: white;
                                        cursor: pointer;
                                        font-size: 12px;
                                    "
                                >답변</button>
                                <button
                                    class="block-user-btn"
                                    data-username="${q.user}"
                                    style="
                                        padding: 2px 6px;
                                        background: #dc3545;
                                        border: none;
                                        border-radius: 4px;
                                        color: white;
                                        cursor: pointer;
                                        font-size: 12px;
                                    "
                                >차단</button>
                            </div>
                        </div>
                        <p style="margin: 5px 0; font-size: 15px;">${q.title}</p>
                    </div>
                `;
            });
        }

        // 기존 내용 제거
        while (statusDiv.lastChild) {
            statusDiv.removeChild(statusDiv.lastChild);
        }

        // 컨텐츠 div 생성
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = statusHTML;

        // 차단 버튼 이벤트 리스너 추가
        contentDiv.querySelectorAll('.block-user-btn').forEach(button => {
            button.addEventListener('click', function() {
                const username = this.getAttribute('data-username');
                const blockedUsers = getBlockedUsers();

                if (!blockedUsers.includes(username)) {
                    if (confirm(`'${username}'님을 차단하시겠습니까?`)) {
                        blockedUsers.push(username);
                        saveBlockedUsers(blockedUsers);
                        checkQuestions();
                        alert(`${username}님이 차단 목록에 추가되었습니다.`);
                    }
                }
            });
        });

        // 답변 버튼 이벤트 리스너 추가
        contentDiv.querySelectorAll('.answer-btn').forEach(button => {
            button.addEventListener('click', function() {
                const link = this.getAttribute('data-link');
                if (link) {
                    window.location.href = link;
                }
            });
        });

        // 버튼들 다시 생성
        const addButton = document.createElement('button');
        addButton.textContent = '➕ 차단 사용자 추가';
        addButton.style.cssText = `
            margin: 5px;
            padding: 5px 10px;
            background: #15C47E;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
        `;
        addButton.onclick = () => {
            const newUser = prompt('차단할 사용자의 닉네임을 입력하세요:');
            if (newUser) {
                const blockedUsers = getBlockedUsers();
                if (!blockedUsers.includes(newUser)) {
                    blockedUsers.push(newUser);
                    saveBlockedUsers(blockedUsers);
                    checkQuestions();
                    alert(`${newUser}가 차단 목록에 추가되었습니다.`);
                } else {
                    alert('이미 차단된 사용자입니다.');
                }
            }
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '➖ 차단 사용자 삭제';
        deleteButton.style.cssText = `
            margin: 5px;
            padding: 5px 10px;
            background: #dc3545;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
        `;
        deleteButton.onclick = () => {
            const blockedUsers = getBlockedUsers();
            if (blockedUsers.length === 0) {
                alert('차단된 사용자가 없습니다.');
                return;
            }

            const userToDelete = prompt(
                '삭제할 사용자의 닉네임을 입력하세요:\n현재 차단 목록:\n' +
                blockedUsers.join('\n')
            );

            if (userToDelete) {
                const index = blockedUsers.indexOf(userToDelete);
                if (index > -1) {
                    blockedUsers.splice(index, 1);
                    saveBlockedUsers(blockedUsers);
                    checkQuestions();
                    alert(`${userToDelete}가 차단 목록에서 삭제되었습니다.`);
                } else {
                    alert('해당 사용자를 찾을 수 없습니다.');
                }
            }
        };

        const viewButton = document.createElement('button');
        viewButton.textContent = '📋 차단 목록 보기';
        viewButton.style.cssText = `
            margin: 5px;
            padding: 5px 10px;
            background: #666;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
        `;
        viewButton.onclick = () => {
            const blockedUsers = getBlockedUsers();
            alert('현재 차단된 사용자 목록:\n' + blockedUsers.join('\n'));
        };

        const refreshButton = document.createElement('button');
        refreshButton.textContent = '🔄 재탐색';
        refreshButton.style.cssText = `
            margin: 5px;
            padding: 5px 10px;
            background: #3498db;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
        `;
        refreshButton.onclick = () => {
            checkQuestions();
        };

        // 모든 요소 추가
        statusDiv.appendChild(addButton);
        statusDiv.appendChild(deleteButton);
        statusDiv.appendChild(viewButton);
        statusDiv.appendChild(refreshButton);
        statusDiv.appendChild(contentDiv);
    }

    // 페이지 로드 완료 시 실행
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1000);
    } else {
        window.addEventListener('load', () => setTimeout(init, 1000));
    }
})();