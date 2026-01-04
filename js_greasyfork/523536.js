// ==UserScript==
// @name         INE live player
// @version      0.2.2
// @description  디시인사이드 INE 갤러리의 영상을 재생합니다.
// @author       Kak-ine
// @match        https://*.dcinside.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dcinside.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/ko/scripts/523536-dc-streaming
// @downloadURL https://update.greasyfork.org/scripts/523536/INE%20live%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/523536/INE%20live%20player.meta.js
// ==/UserScript==

// TODO: 디시인사이드 화면 없애고 영상 플레이어만 띄우는 옵션 추가

(async () => {
    'use strict';

    const galleryBaseUrl = 'https://gall.dcinside.com/mini/board/lists?id=ineviolet';
    const maxRetries = 5;
    const keyword = "아이네 -";
    let currentIndex = -1;
    let isHidden = false;  // 🔥 숨김 상태 여부 저장
    let shuffledItems = [];

    // 🔥 새로 추가: { title: ..., videoUrl: ... } 형태의 배열
    const videoItems = [];

    // 📌 랜덤 딜레이 (2~5초)
    const delay = (min = 2000, max = 5000) => new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));

    // 📌 도메인 변경 함수 (dcm6 → dcm1)
    function replaceDomain(videoUrl) {
        return videoUrl.replace('dcm6', 'dcm1');
    }

    // 📌 최대 페이지 수 자동 추출
    const fetchMaxPageNumber = async (retryCount = 0) => {
        try {
            const response = await fetch(galleryBaseUrl);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const totalPageElement = doc.querySelector('span.num.total_page');
            return parseInt(totalPageElement.textContent.trim());
        } catch (error) {
            if (retryCount < maxRetries) {
                await delay();
                return fetchMaxPageNumber(retryCount + 1);
            } else {
                return 1;
            }
        }
    };

    // 📌 동영상 링크 추출
    const fetchVideoUrl = async (postUrl, retryCount = 0) => {
        try {
            const response = await fetch(postUrl);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const iframeElement = doc.querySelector('iframe[id^="movieIcon"]');
            if (iframeElement) {
                const iframeSrc = iframeElement.getAttribute('src');
                const iframeResponse = await fetch(iframeSrc);
                const iframeText = await iframeResponse.text();
                const iframeDoc = parser.parseFromString(iframeText, 'text/html');
                const videoElement = iframeDoc.querySelector('video.dc_mv source');
                return videoElement ? replaceDomain(videoElement.getAttribute('src')) : null;
            }
            return null;

        } catch (error) {
            console.warn(`❌ 비디오 링크 수집 실패: ${error.message}, retryCount: ${retryCount}`);
            if (retryCount > 0) {
                retryCount--;
                await delay();
                return fetchVideoUrl(postUrl, retryCount)
            }
        }
        return null;
    };

    // 📌 게시글 링크 수집 (순차적 페이지 + 재시도 기능)
    const fetchPostLinksSeq = async (maxPageNumber, retryCount = 0) => {

        let i = 0;
        let retry = 0
        for (i = 0; i < maxPageNumber; i++) {
            const PageUrl = `${galleryBaseUrl}&page=${i + 1}`;

            try {
                const response = await fetch(PageUrl, {
                    headers: { 'User-Agent': navigator.userAgent }
                });
                // await delay();

                if (!response.ok) throw new Error(`응답 실패 (상태 코드: ${response.status})`);

                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                const links = doc.querySelectorAll('a[href*="/mini/board/view"]');
                const postLinks = [];

                links.forEach(link => {
                    const href = link.getAttribute('href');
                    const title = link.textContent.trim() || "";
                    // 🔥 "아이네" 포함 제목만 수집
                    if (href && title.includes(keyword)) {
                        // 갤러리 글 주소
                        const postUrl = `https://gall.dcinside.com${href}`;
                        postLinks.push({ postUrl, title });
                    }
                });

                if (postLinks.length === 0) throw new Error('게시글 링크를 찾을 수 없음');
                console.log(`📄 ${PageUrl} 페이지에서 ${postLinks.length}개의 게시글 링크 수집 완료`);

                // 🔥 각 postUrl에서 videoUrl 추출, videoItems에 저장
                for (const item of postLinks) {
                    const videoUrl = await fetchVideoUrl(item.postUrl, retryCount);
                    await delay();
                    if (videoUrl) {
                        videoItems.push({
                            title: item.title,
                            videoUrl: videoUrl
                        });
                        console.log(item.title, videoUrl);
                    }
                }
                console.log(`📄 ${PageUrl} 페이지에서 ${videoItems.length}개의 동영상 링크 수집 완료`);


            } catch (error) {
                console.warn(`❌ 게시글 링크 수집 실패: ${error.message}, retryCount: ${retry}`);
                if (retry >= retryCount) {
                    retry = 0
                    continue
                }
                i--;
                retry++;
            }
        }
    };


    // 📌 동영상 재생
    function playVideo(videoUrl) {
        const existingVideo = document.getElementById('autoPlayedVideo');
        if (existingVideo) existingVideo.remove();

        const videoPlayer = document.createElement('video');
        videoPlayer.id = 'autoPlayedVideo';
        videoPlayer.src = videoUrl;
        videoPlayer.controls = true;
        videoPlayer.autoplay = true;
        videoPlayer.muted = false;
        videoPlayer.volume = 0.5;
        videoPlayer.style.position = 'fixed';
        videoPlayer.style.bottom = '100px';
        videoPlayer.style.right = '20px';
        videoPlayer.style.width = '480px';
        videoPlayer.style.zIndex = 9999;
        videoPlayer.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        videoPlayer.style.borderRadius = '10px';

        // 📌 숨김 상태일 때 영상도 숨김 처리
        videoPlayer.style.display = isHidden ? 'none' : 'block';

        document.body.appendChild(videoPlayer);

        videoPlayer.onended = () => {
            playNextVideo();  // 🔥 자동으로 다음 영상 재생
        };
    }

    // Fisher–Yates shuffle 예시
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function shufflePlay() {
        if (shuffledItems.length <= 1) return; // 곡이 1개 이하라면 셔플 불필요

        // 1) 현재 재생 중인 곡을 변수에 저장
        const currentTrack = shuffledItems[currentIndex];

        // 2) 배열에서 제거
        //    (splice로 해당 인덱스의 요소를 추출)
        shuffledItems.splice(currentIndex, 1);

        // 3) 나머지 곡들 무작위 셔플
        //    (Fisher–Yates 알고리즘 등)
        shuffleArray(shuffledItems);

        // 4) 다시 currentIndex 위치에 삽입
        shuffledItems.splice(currentIndex, 0, currentTrack);

        // console.log('✅ 셔플(현재 곡 유지) 완료:', shuffledItems.map(item=>item.title));
        // 필요 시 UI 갱신
        createPlaylistUI();
    }

    const playPreviousVideo = () => {
        currentIndex--;
        if (currentIndex < 0) {
            console.log("❌ 이전 영상이 없습니다.");
            currentIndex = 0;
            return;
        }
        playVideo(shuffledItems[currentIndex].videoUrl);

        createPlaylistUI();
    }

    // 📌 다음 영상 재생
    function playNextVideo() {
        // 순서대로 재생하기 위해 currentIndex 증가

        currentIndex++;
        // 범위 체크: 인덱스가 videoItems 길이를 초과하면 더 이상 영상 없음
        if (currentIndex >= videoItems.length) {
            currentIndex = 0
        }

        // 해당 index의 영상 불러오기
        const item = shuffledItems[currentIndex];
        console.log(`▶ [${currentIndex}] ${item.title} 재생`);
        playVideo(item.videoUrl);

        // 🔥 재생 목록 UI 갱신
        createPlaylistUI();
    }

    // 📌 재생/일시정지 버튼 상태 토글 (아이콘 변경)
    function togglePlayPause() {
        const video = document.getElementById('autoPlayedVideo');
        const playPauseButton = document.getElementById('playPauseButton');

        if (video) {
            if (video.paused) {
                video.play();
                playPauseButton.innerText = '⏸';  // 🔥 일시정지 아이콘으로 변경
            } else {
                video.pause();
                playPauseButton.innerText = '▶';  // 🔥 재생 아이콘으로 변경
            }
        } else {
            playNextVideo();
            playPauseButton.innerText = '⏸';
            // 🔥 재생 목록 UI 갱신
            createPlaylistUI();
        }
    }

    function createPlaylistUI() {
        // 기존 UI 제거
        const existing = document.getElementById('playlistContainer');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'playlistContainer';
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.padding = '10px';
        container.style.width = '250px';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '8px';
        container.style.background = 'rgba(255, 255, 255, 0.8)';
        container.style.zIndex = 9999;

        if (isHidden) {
            container.style.right = '70px';
        } else {
            container.style.right = '230px';
        }

        // 스크롤 영역 설정
        container.style.maxHeight = '60px';
        container.style.overflowY = 'auto';
        container.style.scrollBehavior = 'smooth'; // 스무스 스크롤

        const list = document.createElement('ul');
        list.style.margin = '0';
        list.style.padding = '0 0 0 20px';

        let activeLi = null; // 현재 곡에 해당하는 <li>를 저장할 변수

        for (let i = 0; i < shuffledItems.length; i++) {
            const item = shuffledItems[i];
            const pli = document.createElement('li');
            const cleanedTitle = item.title.replace(/^아이네 - /, "");
            pli.textContent = cleanedTitle;

            // 현재 곡 배경 강조
            if (i === currentIndex) {
                pli.style.backgroundColor = '#cceeff';
                pli.style.fontWeight = 'bold';
                pli.classList.add('activeSong'); // 식별용 클래스
                activeLi = pli; // 아래에서 scrollIntoView()에 사용
            }

            // 곡 클릭 시
            pli.addEventListener('click', () => {
                currentIndex = i;
                playVideo(item.videoUrl);
                createPlaylistUI();
            });

            list.appendChild(pli);
        }

        container.appendChild(list);
        document.body.appendChild(container);

        // 📌 UI 생성 후, 현재 곡이 있는 li 위치로 스크롤 이동
        if (activeLi) {
            activeLi.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }



    // 📌 Fancy 버튼 컨트롤 패널 + 버튼 디자인 개선
    function createFancyControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'fancyControlPanel';
        controlPanel.style.position = 'fixed';
        controlPanel.style.bottom = '40px';
        controlPanel.style.right = '-250px';  // 📌 숨김 상태
        controlPanel.style.display = 'flex';
        controlPanel.style.gap = '0px';
        controlPanel.style.padding = '5px';
        // controlPanel.style.background = 'rgba(0, 0, 0, 0.3)';
        controlPanel.style.borderRadius = '30px';
        controlPanel.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.3)';
        controlPanel.style.zIndex = '10000';
        controlPanel.style.width = '180px';
        controlPanel.style.transition = 'right 0.3s ease';

        // 📌 펼치기 버튼 (📂)
        const expandButton = document.createElement('button');
        expandButton.id = 'expandControlPanel';
        expandButton.innerText = '⬅︎';  // 아이콘 변경
        expandButton.style.position = 'fixed';
        expandButton.style.bottom = '40px';
        expandButton.style.right = '20px';
        expandButton.style.padding = '10px';
        expandButton.style.fontSize = '18px';
        expandButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        expandButton.style.color = '#ffffff';
        // expandButton.style.border = 'none';
        expandButton.style.borderRadius = '50%';
        expandButton.style.cursor = 'pointer';
        expandButton.style.boxShadow = '0px 2px 6px rgba(0, 0, 0, 0.3)';
        expandButton.style.zIndex = '10001';

        // 📌 펼치기 버튼 클릭 시 패널 열기
        expandButton.addEventListener('click', () => {
            controlPanel.style.right = '20px';
            expandButton.style.display = 'none';

            isHidden = false;  // 🔥 숨김 상태 해제

            // 🔥 영상도 같이 표시
            const videoPlayer = document.getElementById('autoPlayedVideo');
            if (videoPlayer) {
                videoPlayer.style.display = 'block';
                // 플레이리스트 위치 조절 (isHidden에 의해 위치 조절)
                createPlaylistUI()
            }
        });

        // 📌 버튼 목록 (숨기기 버튼 포함)
        const buttons = [
            { id: 'prevVideoButton', text: '⏮', action: playPreviousVideo },
            { id: 'playPauseButton', text: '▶', action: togglePlayPause },  // 🔥 상태에 따라 변경
            { id: 'nextVideoButton', text: '⏭', action: playNextVideo },
            { id: 'nextVideoButton', text: '🔀', action: shufflePlay },
            { id: 'hidePanelButton', text: '➡︎', action: () => {  // 📂 숨기기 버튼으로 변경
                controlPanel.style.right = '-250px';
                expandButton.style.display = 'block';

                 // 🔥 영상도 같이 숨기기
                const videoPlayer = document.getElementById('autoPlayedVideo');
                if (videoPlayer) {
                    videoPlayer.style.display = 'none';
                }
                isHidden = true;  // 🔥 숨김 상태 유지

                // 플레이리스트만 표시되게 갱신 (isHidden에 의해 위치 조절)
                createPlaylistUI()
            }}
        ];

        // 📌 버튼 생성 및 디자인 적용
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.id = btn.id;
            button.innerText = btn.text;
            button.style.width = '45px';
            button.style.height = '45px';
            button.style.fontSize = '20px';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            button.style.color = '#000';
            // button.style.border = '1px solid rgba(0, 0, 0, 0.3)';
            button.style.borderRadius = '50%';
            button.style.cursor = 'pointer';
            button.style.boxShadow = 'none';
            button.style.transition = 'transform 0.2s ease, background-color 0.2s ease';

            // 📌 버튼 호버 효과 (부드러운 확대 + 색상 변경)
            button.addEventListener('mouseover', () => {
                button.style.transform = 'scale(1.2)';
                //button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                button.style.color = '#ffffff';
            });

            button.addEventListener('mouseout', () => {
                button.style.transform = 'scale(1)';
                // button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                button.style.color = '#000';
            });

            button.addEventListener('click', btn.action);
            controlPanel.appendChild(button);
        });

        // 📌 버튼 및 패널 추가
        document.body.appendChild(controlPanel);
        document.body.appendChild(expandButton);
    }


    // ✅ Base64 디코딩 함수
    function decodeBase64(data) {
        return decodeURIComponent(escape(atob(data)));
    }

    const response = await fetch('https://kak-ine.github.io/data/videos.json');
    const fetchedItems = await response.json();

    // ✅ 배열 전체 디코딩
    const decodedData = fetchedItems.map(item => ({
        title: decodeBase64(item.title),
        videoUrl: decodeBase64(item.videoUrl)
    }));


    // DONE: Github Action에서 DB에 daily update 하도록 자동화 //

    // ///////////////// Depecated ////////////////////////
    // // 미니 갤러리 크롤링하여 비디오 링크 수집
    // const maxPageNumber = await fetchMaxPageNumber();
    // await fetchPostLinksSeq(maxPageNumber, 5);
    // console.log('수집된 videoItems:', videoItems);
    // ///////////////// Depecated ////////////////////////

    // DB로 부터 로드
    videoItems.push(...decodedData);
    shuffledItems = videoItems.slice()
    createFancyControlPanel();
})();
