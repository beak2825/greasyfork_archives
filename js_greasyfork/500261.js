// ==UserScript==
// @name         lck
// @namespace    lck
// @version      2.05
// @description  롤캐 숙제 바로가기+직링보조
// @match        https://lolcast.kr/*
// @exclude      https://lolcast.kr/main/page/chat-popout.php
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/500261/lck.user.js
// @updateURL https://update.greasyfork.org/scripts/500261/lck.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 특정 페이지에서 스크립트 실행 방지
    if (window.location.href.includes('https://lolcast.kr/main/page/chat-popout.php')) {
        return; // 스크립트 실행 중지
    }

    // 기본 설정
    const DEFAULT_SETTINGS = {
        youtube: true,
        chzzk: true,
        afreeca: true,
        flow: true,
        customInput: true, // 주소 입력창 표시 여부
        lockSettingsPanel: false // 설정 패널 잠금 여부
    };

    // 설정 불러오기
    let settings = JSON.parse(GM_getValue('settings', JSON.stringify(DEFAULT_SETTINGS)));

    // 채널 정보
    const CHANNELS = {
        youtube: {
            id: 'UCw1DsweY9b2AKGjV4kGJP1A',
            buttonLabel: '유튜브',
            color: '#FF0000',
            url: (id) => `/#/player/youtube/${id}`
        },
        chzzk: {
            buttonLabel: '치지직',
            color: '#00FFA3',
            url: () => '/#/player/chzzk/9381e7d6816e6d915a44a13c0195b202'
        },
        afreeca: {
            buttonLabel: '숲',
            color: '#2970B6',
            url: () => '/#/player/afreeca/aflol'
        },
        flow: {
            buttonLabel: 'Flow',
            color: '#6A5ACD',
            url: () => '/#/player/flow'
        }
    };

    // 유튜브 라이브 영상 ID 가져오기
    async function fetchLiveVideoId(channelId) {
        const YOUTUBE_LIVE_URL = `https://www.youtube.com/channel/${channelId}/live`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: YOUTUBE_LIVE_URL,
                onload: function(response) {
                    const videoIdMatch = response.responseText.match(/"videoId":"([\w-]+)"/);
                    const isLiveNow = response.responseText.includes('"isLiveNow":true') || response.responseText.includes('"isLive":true');
                    const liveBroadcastContentMatch = response.responseText.match(/"liveBroadcastContent":"(\w+)"/);
                    const isLiveBroadcast = liveBroadcastContentMatch && liveBroadcastContentMatch[1] === 'live';

                    if (videoIdMatch && videoIdMatch[1] && (isLiveNow || isLiveBroadcast)) {
                        resolve(videoIdMatch[1]);
                    } else {
                        reject('No live video found.');
                    }
                },
                onerror: reject
            });
        });
    }

    // URL 분석 및 리디렉션
    function parseAndRedirect(url) {
        const youtubeShortRegex = /https:\/\/youtu\.be\/([\w-]+)/;
        const youtubeLongRegex = /https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)/;
        const kickRegex = /https:\/\/kick\.com\/([\w-]+)/;
        const chzzkRegex = /https:\/\/chzzk\.naver\.com\/([\w-]+)/;
        const twitchRegex = /https:\/\/twitch\.tv\/([\w-]+)/;
        const afreecaRegex = /https:\/\/play\.sooplive\.co\.kr\/([\w-]+)/;

        if (youtubeShortRegex.test(url)) {
            const videoId = url.match(youtubeShortRegex)[1];
            window.location.href = `https://lolcast.kr/#/player/youtube/${videoId}`;
        } else if (youtubeLongRegex.test(url)) {
            const videoId = url.match(youtubeLongRegex)[1];
            window.location.href = `https://lolcast.kr/#/player/youtube/${videoId}`;
        } else if (kickRegex.test(url)) {
            const channelId = url.match(kickRegex)[1];
            window.location.href = `https://lolcast.kr/#/player/kick/${channelId}`;
        } else if (chzzkRegex.test(url)) {
            const channelId = url.match(chzzkRegex)[1];
            window.location.href = `https://lolcast.kr/#/player/chzzk/${channelId}`;
        } else if (twitchRegex.test(url)) {
            const channelId = url.match(twitchRegex)[1];
            window.location.href = `https://lolcast.kr/#/player/twitch/${channelId}`;
        } else if (afreecaRegex.test(url)) {
            const channelId = url.match(afreecaRegex)[1];
            window.location.href = `https://lolcast.kr/#/player/afreeca/${channelId}`;
        } else {
            alert('지원하지 않는 URL 형식입니다.');
        }
    }

    // 설정 패널 생성
    function createSettingsPanel() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        modal.style.padding = '20px';
        modal.style.borderRadius = '8px';
        modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        modal.style.zIndex = '10000';
        modal.style.display = 'none';
        modal.id = 'settingsModal';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '15px';

        const title = document.createElement('h3');
        title.textContent = '채널 설정';
        title.style.margin = '0';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => modal.style.display = 'none';

        header.appendChild(title);
        header.appendChild(closeBtn);

        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '10px';

        Object.keys(CHANNELS).forEach(channel => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '8px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = settings[channel];
            checkbox.onchange = (e) => {
                settings[channel] = e.target.checked;
                GM_setValue('settings', JSON.stringify(settings));
                refreshControlPanel();
            };

            const text = document.createTextNode(CHANNELS[channel].buttonLabel);

            label.appendChild(checkbox);
            label.appendChild(text);
            content.appendChild(label);
        });

        // 주소 입력창 표시 여부 설정 추가
        const customInputLabel = document.createElement('label');
        customInputLabel.style.display = 'flex';
        customInputLabel.style.alignItems = 'center';
        customInputLabel.style.gap = '8px';

        const customInputCheckbox = document.createElement('input');
        customInputCheckbox.type = 'checkbox';
        customInputCheckbox.checked = settings.customInput;
        customInputCheckbox.onchange = (e) => {
            settings.customInput = e.target.checked;
            GM_setValue('settings', JSON.stringify(settings));
            refreshControlPanel();
        };

        const customInputText = document.createTextNode('주소입력창');

        customInputLabel.appendChild(customInputCheckbox);
        customInputLabel.appendChild(customInputText);
        content.appendChild(customInputLabel);

        // 잠금 설정 추가
        const lockLabel = document.createElement('label');
        lockLabel.style.display = 'flex';
        lockLabel.style.alignItems = 'center';
        lockLabel.style.gap = '8px';

        const lockCheckbox = document.createElement('input');
        lockCheckbox.type = 'checkbox';
        lockCheckbox.checked = settings.lockSettingsPanel;
        lockCheckbox.onchange = (e) => {
            settings.lockSettingsPanel = e.target.checked;
            GM_setValue('settings', JSON.stringify(settings));
        };

        const lockText = document.createTextNode('위치 잠금');

        lockLabel.appendChild(lockCheckbox);
        lockLabel.appendChild(lockText);
        content.appendChild(lockLabel);

        modal.appendChild(header);
        modal.appendChild(content);
        document.body.appendChild(modal);

        // 드래그 기능
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            if (!settings.lockSettingsPanel) { // 잠금 상태가 아닐 때만 드래그 가능
                isDragging = true;
                offsetX = e.clientX - modal.offsetLeft;
                offsetY = e.clientY - modal.offsetTop;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && !settings.lockSettingsPanel) { // 잠금 상태가 아닐 때만 드래그 가능
                modal.style.left = `${e.clientX - offsetX}px`;
                modal.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        return modal;
    }

    // 컨트롤 패널 새로고침
    function refreshControlPanel() {
        const oldPanel = document.getElementById('controlPanel');
        if (oldPanel) oldPanel.remove();
        createControlPanel();
    }

    // 컨트롤 패널 생성
    function createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'controlPanel';
        controlPanel.style.position = 'fixed';
        controlPanel.style.top = '380px';
        controlPanel.style.left = '0';
        controlPanel.style.padding = '7px';
        controlPanel.style.borderRadius = '0 4px 4px 0';
        controlPanel.style.zIndex = '9999';
        controlPanel.style.display = 'flex';
        controlPanel.style.flexDirection = 'row';
        controlPanel.style.flexWrap = 'wrap';
        controlPanel.style.gap = '6px';
        controlPanel.style.background = 'transparent';
        controlPanel.style.transition = 'all 0.3s ease';
        controlPanel.style.maxWidth = '200px'; // 컨테이너 최대 너비 설정

        // 위치 불러오기
        const savedPosition = JSON.parse(localStorage.getItem('lckControlPanelPosition'));
        if (savedPosition) {
            controlPanel.style.left = savedPosition.left;
            controlPanel.style.top = savedPosition.top;
        }

        // 드래그 기능
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        controlPanel.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - controlPanel.offsetLeft;
            offsetY = e.clientY - controlPanel.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                controlPanel.style.left = (e.clientX - offsetX) + 'px';
                controlPanel.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('lckControlPanelPosition', JSON.stringify({
                    left: controlPanel.style.left,
                    top: controlPanel.style.top
                }));
            }
        });

        // 버튼 생성 함수
        function createChannelButton(channel) {
            const button = document.createElement('button');
            button.textContent = channel.buttonLabel;
            button.style.padding = '5px 11px';
            button.style.color = channel.color;
            button.style.border = `1px solid ${channel.color}`;
            button.style.borderRadius = '3px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '13px';
            button.style.transition = 'all 0.2s';
            button.style.background = 'transparent';

            button.onmouseover = () => {
                button.style.background = channel.color;
                button.style.color = 'white';
            };
            button.onmouseout = () => {
                button.style.background = 'transparent';
                button.style.color = channel.color;
            };
            button.onclick = async () => {
                if (channel.buttonLabel === '유튜브') {
                    try {
                        const liveVideoId = await fetchLiveVideoId(channel.id);
                        window.location.href = channel.url(liveVideoId);
                    } catch {
                        alert('유튜브 라이브 방송이 없습니다.');
                    }
                } else {
                    window.location.href = channel.url();
                }
            };
            return button;
        }

        // 토글 버튼 생성
        function createToggleButton() {
            const toggleButton = document.createElement('button');
            toggleButton.textContent = '◀';
            toggleButton.style.padding = '5px 11px';
            toggleButton.style.color = '#888';
            toggleButton.style.border = '1px solid #888';
            toggleButton.style.borderRadius = '3px';
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.fontSize = '13px';
            toggleButton.style.transition = 'all 0.2s';
            toggleButton.style.background = 'transparent';

            toggleButton.onmouseover = () => {
                toggleButton.style.background = '#888';
                toggleButton.style.color = 'white';
            };
            toggleButton.onmouseout = () => {
                toggleButton.style.background = 'transparent';
                toggleButton.style.color = '#888';
            };
            toggleButton.onclick = () => {
                controlPanel.style.display = 'none';
            };
            return toggleButton;
        }

        // 설정 버튼 생성
        const settingsButton = document.createElement('button');
        settingsButton.textContent = '⚙';
        settingsButton.style.padding = '5px 11px';
        settingsButton.style.color = '#666';
        settingsButton.style.border = '1px solid #666';
        settingsButton.style.borderRadius = '3px';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.background = 'transparent';
        settingsButton.onclick = () => {
            document.getElementById('settingsModal').style.display = 'block';
        };

        // 커스텀 입력 섹션
        const customSection = document.createElement('div');
        customSection.style.display = 'flex';
        customSection.style.flexDirection = 'column';
        customSection.style.gap = '5px';
        customSection.style.marginTop = '10px';
        customSection.style.width = '100%';

        // 주소 입력창 표시 여부 설정
        if (settings.customInput) {
            // 입력 필드 및 Go 버튼
            const inputRow = document.createElement('div');
            inputRow.style.display = 'flex';
            inputRow.style.gap = '5px';
            inputRow.style.width = '100%';

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'URL 입력';
            input.style.padding = '5px';
            input.style.border = '1px solid #ddd';
            input.style.borderRadius = '3px';
            input.style.flexGrow = '1';
           
            const goBtn = document.createElement('button');
            goBtn.textContent = 'Go';
            goBtn.style.padding = '5px 11px';
            goBtn.style.background = '#666';
            goBtn.style.color = 'white';
            goBtn.style.border = 'none';
            goBtn.style.borderRadius = '3px';
            goBtn.style.cursor = 'pointer';

            goBtn.onclick = () => {
                const url = input.value.trim();
                if (!url) {
                    alert('URL을 입력해주세요.');
                    return;
                }
                parseAndRedirect(url);
            };

            inputRow.appendChild(input);
            inputRow.appendChild(goBtn);

            customSection.appendChild(inputRow);
        }

        // 기존 버튼 추가
        if (settings.youtube) controlPanel.appendChild(createChannelButton(CHANNELS.youtube));
        if (settings.chzzk) controlPanel.appendChild(createChannelButton(CHANNELS.chzzk));
        if (settings.afreeca) controlPanel.appendChild(createChannelButton(CHANNELS.afreeca));
        if (settings.flow) controlPanel.appendChild(createChannelButton(CHANNELS.flow));
        controlPanel.appendChild(settingsButton);
        controlPanel.appendChild(createToggleButton());
        controlPanel.appendChild(customSection);

        document.body.appendChild(controlPanel);
    }

    // 초기화
    createSettingsPanel();
    createControlPanel();
})();