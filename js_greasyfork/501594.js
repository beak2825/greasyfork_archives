// ==UserScript==
// @name          치지직 추가 볼륨
// @namespace     치지직 추가 볼륨
// @match         *://chzzk.naver.com/*
// @version       0.6
// @description   치지직 추가 증폭 볼륨을 구현합니다.
// @icon          https://www.google.com/s2/favicons?sz=256&domain_url=chzzk.naver.com
// @author        mickey90427 <mickey90427@naver.com>
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/501594/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%B6%94%EA%B0%80%20%EB%B3%BC%EB%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/501594/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%B6%94%EA%B0%80%20%EB%B3%BC%EB%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxVolume = 16; // 최대 볼륨 증폭 비율
    let gainValue = getSavedVolume() || 1; // 쿠키에서 저장된 볼륨 값 불러오기, 기본값 1
    const originalVolume = 1;
    let hideTimeout;

    // 볼륨 증폭 기능
    function boostVolume(video, boost) {
        let audioContext = video.audioContext;
        let gainNode = video.gainNode;

        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            let source = audioContext.createMediaElementSource(video);
            gainNode = audioContext.createGain();
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            video.audioContext = audioContext;
            video.gainNode = gainNode;

            video.addEventListener('play', () => {
                audioContext.resume();
            }, { once: true });
        }

        gainNode.gain.value = boost ? gainValue : originalVolume;
    }

    // 증폭 적용 기능
    function applyVolumeBoost() {
        let videos = document.querySelectorAll('video');
        videos.forEach(video => {
            boostVolume(video, true);
        });
        saveVolume(gainValue); // 볼륨 값 저장
    }

    // 증폭 해제 기능
    function removeVolumeBoost() {
        let videos = document.querySelectorAll('video');
        videos.forEach(video => {
            boostVolume(video, false);
        });
    }

    // 슬라이더와 버튼을 페이지에 추가
    function addVolumeSlider() {
        const targetElement = document.querySelector('.pzp-pc__bottom-buttons-left');
        if (targetElement) {
            // 기존에 추가된 슬라이더가 있는지 확인
            if (document.querySelector('#volumeBoostSlider')) return;

            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.marginLeft = '10px';
            container.style.opacity = '0'; // 초기에는 숨김
            container.style.transition = 'opacity 0.3s';

            const slider = document.createElement('input');
            slider.id = 'volumeBoostSlider';
            slider.type = 'range';
            slider.min = 1;
            slider.max = maxVolume;
            slider.value = gainValue;
            slider.style.width = '150px';
            slider.style.marginRight = '10px';
            slider.style.cursor = 'pointer';

            const label = document.createElement('span');
            label.id = 'volumeBoostLabel';
            label.textContent = `볼륨: ${((gainValue - 1) / (maxVolume - 1) * 100).toFixed(2)}%`;
            label.style.color = '#fff';

            slider.oninput = () => {
                gainValue = parseFloat(slider.value);
                const percentage = ((gainValue - 1) / (maxVolume - 1) * 100).toFixed(2);
                label.textContent = `볼륨: ${percentage}%`;
                applyVolumeBoost(); // 볼륨 적용
            };

            container.appendChild(slider);
            container.appendChild(label);
            container.id = 'volumeBoostControl';
            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);

            // 슬라이더 표시 및 숨기기
            function showSlider() {
                container.style.opacity = '1'; // 슬라이더 표시
                resetHideTimeout();
            }

            function hideSlider() {
                container.style.opacity = '0'; // 슬라이더 숨김
            }

            function resetHideTimeout() {
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(hideSlider, 3000); // 3초 후 슬라이더 숨김
            }

            // 슬라이더가 있는 요소와 그 하위 요소들에 마우스가 들어가면 슬라이더를 보이게 하고 타이머를 리셋
            function setupEventListeners() {
                const videoContainer = document.querySelector('.webplayer-internal-video');
                const shadowElements = document.querySelectorAll('.pzp-pc__bottom-shadow, .pzp-pc__bottom');

                function onMouseMoveOrKeyDown(event) {
                    if (videoContainer.contains(event.target) || Array.from(shadowElements).some(el => el.contains(event.target))) {
                        showSlider();
                    } else {
                        hideSlider();
                    }
                }

                document.addEventListener('mousemove', onMouseMoveOrKeyDown);
                document.addEventListener('keydown', onMouseMoveOrKeyDown);
            }

            setupEventListeners();
        } else {
            console.log('targetElement를 찾을 수 없습니다.');
            // 일정 시간 후 재시도
            setTimeout(addVolumeSlider, 1000);
        }
    }

    // 쿠키에 볼륨 값 저장
    function saveVolume(value) {
        const domain = window.location.hostname;
        document.cookie = `volumeBoost_${domain}=${value}; path=/;`;
    }

    // 쿠키에서 볼륨 값 불러오기
    function getSavedVolume() {
        const domain = window.location.hostname;
        const name = `volumeBoost_${domain}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return parseFloat(cookie.substring(name.length, cookie.length));
            }
        }
        return null; // 쿠키에 저장된 볼륨 값이 없으면 null 반환
    }

    // 비디오가 로드된 후에 볼륨을 적용하는 함수
    function init() {
        function waitForVideoAndApply() {
            const videos = document.querySelectorAll('video');
            if (videos.length > 0) {
                applyVolumeBoost(); // 비디오가 존재할 때 볼륨 적용
                addVolumeSlider(); // 슬라이더 추가
            } else {
                // 비디오가 없으면 100ms 후에 다시 시도
                setTimeout(waitForVideoAndApply, 100);
            }
        }

        waitForVideoAndApply(); // 비디오 로드 확인 후 볼륨 적용 시작

        // MutationObserver를 사용하여 새로운 비디오 요소가 추가되었을 때 다시 시도
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    waitForVideoAndApply(); // 비디오가 추가되었을 때 볼륨 적용 시도
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();
