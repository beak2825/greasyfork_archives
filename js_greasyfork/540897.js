// ==UserScript==
// @name         Skip the MinBangWeeee video
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  이딴거왜함
// @author       Unknown
// @match        *://*.kcmes.kr/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540897/Skip%20the%20MinBangWeeee%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/540897/Skip%20the%20MinBangWeeee%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("민방위 스킵 스크립트 v2.1 (간소화) 실행됨");

    // --- UI 생성 ---
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.bottom = '20px';
    controlPanel.style.right = '20px';
    controlPanel.style.zIndex = '99999';
    controlPanel.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    controlPanel.style.padding = '15px';
    controlPanel.style.border = '1px solid #ccc';
    controlPanel.style.borderRadius = '10px';
    controlPanel.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    controlPanel.style.fontFamily = 'sans-serif';
    controlPanel.innerHTML = `
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; text-align: center;">영상 제어판 v2.1</h3>
        <button id="gm-skip-video" style="display: block; width: 100%; cursor: pointer; padding: 10px 12px; font-size: 14px; margin-bottom: 8px; border: none; background-color: #007bff; color: white; border-radius: 5px; transition: background-color 0.2s;">
            현재 영상 완료 처리
        </button>
        <button id="gm-show-controls" style="display: block; width: 100%; cursor: pointer; padding: 8px 12px; font-size: 14px; border: none; background-color: #6c757d; color: white; border-radius: 5px; transition: background-color 0.2s;">
            기본 컨트롤러 표시
        </button>
        <div style="margin-top: 10px; text-align: center; font-size: 12px; color: #555;">팝업 자동 차단 활성</div>
    `;
    document.body.appendChild(controlPanel);


    // --- 핵심 기능 함수 ---

    function getVideoElement() {
        const video = document.querySelector('video');
        if (!video) {
            console.warn('스크립트: <video> 태그를 찾을 수 없습니다.');
            return null;
        }
        return video;
    }

    /**
     * '현재 영상 완료 처리'
     */
    function skipCurrentVideo() {
        const video = getVideoElement();
        if (video) {
            if (video.duration && isFinite(video.duration)) {
                video.currentTime = video.duration - 0.1;
            } else {
                video.currentTime = 9999;
            }
            video.play().catch(e => console.error("재생 오류:", e));
            setTimeout(() => {
                video.pause();
                video.dispatchEvent(new Event('ended', { 'bubbles': true, 'cancelable': true }));
            }, 150);
            alert('[완료 처리]를 시도했습니다. "다음" 버튼 활성화를 확인하세요.');
        } else {
            alert('영상을 찾을 수 없습니다.');
        }
    }

    /**
     * '기본 컨트롤러 표시'
     */
    function showVideoControls() {
        const video = getVideoElement();
        if (video) {
            video.controls = true;
            const playerContainer = video.parentElement;
            if (playerContainer) {
                for (const child of playerContainer.children) {
                    if (child !== video) {
                        child.style.pointerEvents = 'none';
                    }
                }
            }
            alert('영상에 [기본 컨트롤러]를 표시했습니다.');
        } else {
            alert('영상을 찾을 수 없습니다.');
        }
    }

    // --- 감지 우회 기능 ---

    /**
     * 부정행위 감지 팝업을 찾아서 숨기는 MutationObserver
     */
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;

                    const nodeText = node.textContent || "";
                    const keywords = ["네트워크 이상", "정상적으로 이루어지지 않고", "부정 행위"];

                    if (keywords.some(keyword => nodeText.includes(keyword))) {
                        console.log('감지 팝업 발견! 즉시 숨기고 새로고침을 방지합니다:', node);
                        node.style.display = 'none';
                        node.style.visibility = 'hidden';

                        const closeButton = node.querySelector('button');
                        if(closeButton) {
                            console.log('팝업의 확인 버튼을 강제로 클릭합니다.');
                            closeButton.click();
                        }
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('감지 팝업 모니터링 시작.');

    // --- 이벤트 리스너 연결 ---
    document.getElementById('gm-skip-video').addEventListener('click', skipCurrentVideo);
    document.getElementById('gm-show-controls').addEventListener('click', showVideoControls);

})();